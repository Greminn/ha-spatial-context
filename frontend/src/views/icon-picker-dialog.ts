import { LitElement, html, css, nothing, type PropertyValues } from "lit";
import { property, query, state } from "lit/decorators.js";
import { safeCustomElement } from "../define";
import { localize } from "../i18n";
import { sharedStyles } from "../styles";

/** Searchable icon picker (#17), replacing the old "type an mdi: name"
 * prompt for a pin's icon override. Previews are HA's own <ha-icon>, so
 * nothing is fetched from outside Home Assistant. The search index (every
 * MDI name with its aliases and tags) is built at build time — see
 * rollup.config.js's writeIconIndex — and fetched the first time the
 * picker opens. */

type IndexEntry = [name: string, keywords: string];

const MAX_RESULTS = 160;
const MAX_SUGGESTIONS = 60;
/** Words in a device name too generic to suggest icons from. */
const STOP_WORDS = new Set(["the", "and", "with", "power", "light", "plug"]);

let indexPromise: Promise<IndexEntry[]> | null = null;

function loadIndex(): Promise<IndexEntry[]> {
  indexPromise ??= fetch(`/spatial_context/mdi-index.json?v=${__BUILD_ID__}`)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json() as Promise<IndexEntry[]>;
    })
    .catch((err: unknown) => {
      indexPromise = null; // let a later open retry
      throw err;
    });
  return indexPromise;
}

/** Icons matching the words of `text`, best first: those matching every
 * word (exact name, then name starting with the first word, then name
 * containing every word, then via an alias or tag), then those matching
 * only some of the words — so "garden light" still finds lights. */
export function searchIcons(
  index: IndexEntry[],
  text: string,
  limit: number,
): string[] {
  const words = text
    .toLowerCase()
    .split(/[\s:]+/)
    .filter(Boolean);
  if (words.length === 0) return [];
  const joined = words.join("-");
  const scored: [number, string][] = [];
  for (const [name, keywords] of index) {
    const inName = words.filter((w) => name.includes(w)).length;
    const matched = words.filter(
      (w) => name.includes(w) || keywords.includes(w),
    ).length;
    if (matched === 0) continue;
    const base =
      name === joined
        ? 0
        : name.startsWith(words[0]!)
          ? 1
          : inName === words.length
            ? 2
            : // Some words only via aliases/tags: more of them in the
              // name itself still ranks higher.
              3 - inName / words.length;
    // Every missing word ranks below any complete match.
    scored.push([(words.length - matched) * 4 + base, name]);
  }
  scored.sort(
    (a, b) =>
      a[0] - b[0] || a[1].length - b[1].length || a[1].localeCompare(b[1]),
  );
  return scored.slice(0, limit).map(([, name]) => name);
}

@safeCustomElement("icon-picker-dialog")
export class IconPickerDialog extends LitElement {
  static override styles = [
    sharedStyles,
    css`
      :host {
        position: fixed;
        inset: 0;
        z-index: 20;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.45);
      }
      .dialog {
        width: min(560px, calc(100vw - 32px));
        max-height: min(640px, calc(100vh - 32px));
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 16px;
      }
      .title {
        font-size: 1.05rem;
        font-weight: 500;
      }
      input[type="search"] {
        width: 100%;
        box-sizing: border-box;
        padding: 8px 10px;
        font: inherit;
        color: var(--sc-fg);
        background: var(--sc-bg);
        border: 1px solid var(--sc-divider);
        border-radius: 6px;
      }
      .grid {
        flex: 1;
        min-height: 160px;
        overflow-y: auto;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(84px, 1fr));
        gap: 4px;
      }
      .icon-choice {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        padding: 8px 4px;
        border-radius: 8px;
        min-width: 0;
      }
      .icon-choice.current {
        outline: 2px solid var(--sc-accent);
      }
      .icon-choice ha-icon {
        --mdc-icon-size: 28px;
      }
      .icon-choice span {
        font-size: 0.7rem;
        color: var(--sc-fg-secondary);
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .hint {
        font-size: 0.8rem;
        color: var(--sc-fg-secondary);
      }
      .actions {
        display: flex;
        justify-content: space-between;
        gap: 8px;
      }
    `,
  ];

  /** The pin's current override (e.g. "mdi:outdoor-lamp"), or null. */
  @property({ attribute: false }) value: string | null = null;
  /** The device's display name — its words seed the initial suggestions,
   * as the original request asked ("proposes some default icons based on
   * name of device"). */
  @property({ attribute: false }) suggestFrom = "";

  @state() private _query = "";
  @state() private _index: IndexEntry[] | null = null;
  @state() private _error: string | null = null;

  @query("input[type=search]") private _input?: HTMLInputElement;

  override connectedCallback(): void {
    super.connectedCallback();
    // A click on the backdrop (outside the dialog, which stops its own
    // clicks from bubbling) closes it, like any modal.
    this.addEventListener("click", this._onBackdropClick);
    loadIndex().then(
      (index) => (this._index = index),
      (err: unknown) =>
        (this._error =
          (err as { message?: string })?.message ?? "couldn't load icons"),
    );
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("click", this._onBackdropClick);
  }

  private _onBackdropClick = () => this._fire("icon-picker-cancel");

  protected override firstUpdated(_changed: PropertyValues): void {
    this._input?.focus();
  }

  private _fire(name: string, detail?: unknown) {
    this.dispatchEvent(
      new CustomEvent(name, { detail, bubbles: true, composed: true }),
    );
  }

  private get _results(): string[] {
    const index = this._index;
    if (!index) return [];
    if (this._query.trim()) {
      return searchIcons(index, this._query, MAX_RESULTS);
    }
    // No search yet: suggestions from the device's own name.
    const seen = new Set<string>();
    for (const word of this.suggestFrom.toLowerCase().split(/[^a-z0-9]+/)) {
      if (word.length < 3 || STOP_WORDS.has(word)) continue;
      for (const name of searchIcons(index, word, 12)) seen.add(name);
      if (seen.size >= MAX_SUGGESTIONS) break;
    }
    return [...seen];
  }

  private _onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      this._fire("icon-picker-cancel");
    } else if (e.key === "Enter") {
      const first = this._results[0];
      if (first) this._fire("icon-picked", { icon: `mdi:${first}` });
    }
  };

  override render() {
    const results = this._results;
    const current = this.value?.replace(/^mdi:/, "") ?? null;
    return html`
      <div
        class="dialog floating-panel"
        role="dialog"
        aria-label=${localize("iconPicker.title")}
        @click=${(e: Event) => e.stopPropagation()}
        @keydown=${this._onKeyDown}
      >
        <div class="title">${localize("iconPicker.title")}</div>
        <input
          type="search"
          placeholder=${localize("iconPicker.search")}
          .value=${this._query}
          @input=${(e: Event) =>
            (this._query = (e.target as HTMLInputElement).value)}
        />
        ${
          this._error
            ? html`<span class="hint"
                >${localize("iconPicker.loadError", { error: this._error })}</span
              >`
            : !this._index
              ? html`<span class="hint"
                  >${localize("iconPicker.loading")}</span
                >`
              : results.length === 0
                ? html`<span class="hint"
                    >${
                      this._query.trim()
                        ? localize("iconPicker.noMatch")
                        : localize("iconPicker.typeToSearch")
                    }</span
                  >`
                : nothing
        }
        <div class="grid">
          ${results.map(
            (name) =>
              html`<button
                class="icon-choice ${name === current ? "current" : ""}"
                title=${`mdi:${name}`}
                @click=${() => this._fire("icon-picked", { icon: `mdi:${name}` })}
              >
                <ha-icon icon=${`mdi:${name}`}></ha-icon>
                <span>${name}</span>
              </button>`,
          )}
        </div>
        <div class="actions">
          <button
            ?disabled=${!this.value}
            @click=${() => this._fire("icon-picked", { icon: null })}
          >
            ${localize("iconPicker.useDefault")}
          </button>
          <button @click=${() => this._fire("icon-picker-cancel")}>
            ${localize("iconPicker.cancel")}
          </button>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "icon-picker-dialog": IconPickerDialog;
  }
}
