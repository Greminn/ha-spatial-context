import type { HaClient } from "./ha-client";

/** Opt-in panel event log (Settings → Debug logging), shipped in small
 * batches to the backend's debug log file (see debug.py). Records carry
 * ids and counts only — never device names or positions — since the log
 * is meant to be attachable to a public issue. */

const FLUSH_MS = 2000;
const MAX_BUFFER = 200;

type Entry = { event: string; t: string } & Record<string, unknown>;

class DebugLog {
  private _client: HaClient | null = null;
  private _enabled = false;
  private _buffer: Entry[] = [];
  private _timer: number | null = null;
  private _errorHooked = false;

  configure(client: HaClient, enabled: boolean): void {
    this._client = client;
    this._enabled = enabled;
    if (!enabled) {
      this._buffer = [];
      return;
    }
    this._hookErrors();
  }

  log(event: string, data: Record<string, unknown> = {}): void {
    if (!this._enabled) return;
    this._buffer.push({ event, t: new Date().toISOString(), ...data });
    if (this._buffer.length > MAX_BUFFER) this._buffer.shift();
    this._timer ??= window.setTimeout(() => void this.flush(), FLUSH_MS);
  }

  async flush(): Promise<void> {
    this._timer = null;
    if (!this._client || this._buffer.length === 0) return;
    const entries = this._buffer;
    this._buffer = [];
    try {
      await this._client.sendDebugLog(entries);
    } catch {
      // Debug logging must never get in the way — drop the batch.
    }
  }

  /** Uncaught errors and rejections from this panel's own code. */
  private _hookErrors(): void {
    if (this._errorHooked) return;
    this._errorHooked = true;
    const ours = (stack: string | undefined) =>
      !!stack && /spatial[-_]context/.test(stack);
    window.addEventListener("error", (e) => {
      const stack = (e.error as Error | undefined)?.stack;
      if (ours(stack) || ours(e.filename)) {
        this.log("js_error", { message: e.message, stack });
      }
    });
    window.addEventListener("unhandledrejection", (e) => {
      const reason = e.reason as { message?: string; stack?: string } | null;
      if (ours(reason?.stack)) {
        this.log("js_rejection", {
          message: reason?.message,
          stack: reason?.stack,
        });
      }
    });
  }
}

export const debugLog = new DebugLog();
