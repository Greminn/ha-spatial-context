/** Undo/redo history of whole-layout snapshots (#15).
 *
 * Every edit already produces a new layout object (panel.ts's
 * `_updateLayout`), so a snapshot is just the previous object — no diffing,
 * and structural sharing keeps it cheap. Edits arriving in quick succession
 * (a drag, a slider, a burst of keystrokes) collapse into one undo step:
 * only the state from *before* the burst is kept.
 */
export class EditHistory<T> {
  private _past: T[] = [];
  private _future: T[] = [];
  private _lastRecordAt = Number.NEGATIVE_INFINITY;

  constructor(
    private readonly _limit = 100,
    private readonly _coalesceMs = 400,
  ) {}

  get canUndo(): boolean {
    return this._past.length > 0;
  }

  get canRedo(): boolean {
    return this._future.length > 0;
  }

  /** Call with the state an edit is about to replace. */
  record(before: T, now = Date.now()): void {
    if (now - this._lastRecordAt > this._coalesceMs) {
      this._past.push(before);
      if (this._past.length > this._limit) this._past.shift();
    }
    this._lastRecordAt = now;
    this._future = [];
  }

  /** The state to go back to, or null when there's nothing to undo. */
  undo(current: T): T | null {
    const previous = this._past.pop();
    if (previous === undefined) return null;
    this._future.push(current);
    this._lastRecordAt = Number.NEGATIVE_INFINITY;
    return previous;
  }

  redo(current: T): T | null {
    const next = this._future.pop();
    if (next === undefined) return null;
    this._past.push(current);
    this._lastRecordAt = Number.NEGATIVE_INFINITY;
    return next;
  }

  /** Forgets the most recent undo step if it's exactly `state` — for an
   * edit that was cancelled and put back, so it doesn't leave a step that
   * undoes nothing. */
  discardIfLast(state: T): void {
    if (this._past[this._past.length - 1] === state) {
      this._past.pop();
      this._lastRecordAt = Number.NEGATIVE_INFINITY;
    }
  }

  clear(): void {
    this._past = [];
    this._future = [];
    this._lastRecordAt = Number.NEGATIVE_INFINITY;
  }
}
