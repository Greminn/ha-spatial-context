import { LitElement, html, css, nothing } from "lit";
import { property } from "lit/decorators.js";
import { safeCustomElement } from "../define";
import type { Settings } from "../types";
import { sharedStyles, switchStyles } from "../styles";

/** The Settings menu's content: grouped rows, label (and an optional
 * one-line description) on the left, its control on the right. Every
 * change is reported as a `settings-change` patch — the panel applies and
 * saves it (settings are instant-apply, shared by every viewer). */
@safeCustomElement("settings-menu")
export class SettingsMenu extends LitElement {
  static override styles = [
    sharedStyles,
    switchStyles,
    css`
      :host {
        display: block;
        width: min(360px, calc(100vw - 32px));
        font-size: 0.875rem;
      }
      .header {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 12px 4px 8px;
        font-size: 1.125rem;
      }
      .header button {
        display: grid;
        place-items: center;
        width: 40px;
        height: 40px;
        padding: 0;
        border-radius: 50%;
      }
      .section {
        padding: 4px 0;
      }
      .section + .section {
        border-top: 1px solid var(--sc-divider);
      }
      .section-title {
        padding: 10px 12px 4px;
        font-size: 0.7rem;
        font-weight: 600;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: var(--sc-fg-secondary);
      }
      .row {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        align-items: center;
        gap: 16px;
        padding: 8px 12px;
        min-height: 36px;
      }
      .label {
        color: var(--sc-fg);
        line-height: 1.3;
      }
      .description {
        margin-top: 2px;
        font-size: 0.75rem;
        line-height: 1.3;
        color: var(--sc-fg-secondary);
      }

      /* Two-option segmented control. */
      .segmented {
        display: inline-flex;
        border: 1px solid var(--sc-divider);
        border-radius: 18px;
        overflow: hidden;
      }
      .segmented button {
        padding: 6px 14px;
        border-radius: 0;
        font-size: 0.8rem;
        font-weight: 400;
        text-transform: none;
        letter-spacing: normal;
        color: var(--sc-fg);
        background: transparent;
        white-space: nowrap;
      }
      .segmented button + button {
        border-left: 1px solid var(--sc-divider);
      }
      .segmented button.active {
        background: color-mix(in srgb, var(--sc-accent) 22%, transparent);
        color: var(--sc-accent);
      }

      select,
      input[type="number"] {
        font: inherit;
        font-size: 0.8rem;
        color: var(--sc-fg);
        background: var(--sc-bg);
        border: 1px solid var(--sc-divider);
        border-radius: 16px;
        padding: 6px 12px;
      }
      select {
        max-width: 170px;
      }
      .number {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        color: var(--sc-fg-secondary);
        font-size: 0.8rem;
      }
      input[type="number"] {
        width: 64px;
        text-align: right;
      }
    `,
  ];

  @property({ attribute: false }) settings!: Settings;
  /** Placed devices (any floor) a coordinator can be pinned to. */
  @property({ attribute: false }) coordinatorChoices: {
    deviceId: string;
    label: string;
  }[] = [];

  private _change(patch: Partial<Settings>) {
    this.dispatchEvent(
      new CustomEvent("settings-change", {
        detail: patch,
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _switch(
    checked: boolean,
    label: string,
    onChange: (checked: boolean) => void,
  ) {
    return html`<input
      type="checkbox"
      class="switch"
      role="switch"
      aria-label=${label}
      .checked=${checked}
      @change=${(e: Event) => onChange((e.target as HTMLInputElement).checked)}
    />`;
  }

  private _segmented<T extends string>(
    value: T,
    options: [T, string][],
    onPick: (value: T) => void,
  ) {
    return html`<div class="segmented" role="radiogroup">
      ${options.map(
        ([option, text]) =>
          html`<button
            role="radio"
            aria-checked=${option === value ? "true" : "false"}
            class=${option === value ? "active" : ""}
            @click=${() => option !== value && onPick(option)}
          >
            ${text}
          </button>`,
      )}
    </div>`;
  }

  private _row(label: string, control: unknown, description?: string) {
    return html`<div class="row">
      <div>
        <div class="label">${label}</div>
        ${description ? html`<div class="description">${description}</div>` : nothing}
      </div>
      ${control}
    </div>`;
  }

  override render() {
    const s = this.settings;
    const coordinator = s.zigbee_coordinator_device_id;
    const coordinatorPlaced = this.coordinatorChoices.some(
      (c) => c.deviceId === coordinator,
    );
    return html`
      <div class="header">
        <button
          title="Close"
          @click=${() =>
            this.dispatchEvent(
              new CustomEvent("settings-close", {
                bubbles: true,
                composed: true,
              }),
            )}
        >
          <ha-icon icon="mdi:close"></ha-icon>
        </button>
        <span>Settings</span>
      </div>
      <div class="section">
        <div class="section-title">Editing</div>
        ${this._row(
          "Auto-save changes",
          this._switch(s.auto_save, "Auto-save changes", (auto_save) =>
            this._change({ auto_save }),
          ),
          "Saves a few seconds after each change",
        )}
        ${this._row(
          "Units",
          this._segmented(
            s.unit_system,
            [
              ["metric", "Metric"],
              ["imperial", "Imperial"],
            ],
            (unit_system) => this._change({ unit_system }),
          ),
        )}
        ${this._row(
          "Floor tab order",
          this._segmented(
            s.floor_order,
            [
              ["top_down", "Top first"],
              ["ground_up", "Ground first"],
            ],
            (floor_order) => this._change({ floor_order }),
          ),
        )}
      </div>

      <div class="section">
        <div class="section-title">Zigbee mesh</div>
        ${this._row(
          "Coordinator",
          html`<select
            aria-label="Zigbee coordinator device"
            @change=${(e: Event) =>
              this._change({
                zigbee_coordinator_device_id:
                  (e.target as HTMLSelectElement).value || null,
              })}
          >
            <option value="" ?selected=${!coordinator}>
              Zigbee2MQTT Bridge
            </option>
            ${
              // Keep a saved choice visible even once its pin is removed,
              // rather than the select silently showing the default.
              coordinator && !coordinatorPlaced
                ? html`<option value=${coordinator} selected>
                    (device not placed)
                  </option>`
                : nothing
            }
            ${this.coordinatorChoices.map(
              ({ deviceId, label }) =>
                html`<option
                  value=${deviceId}
                  ?selected=${deviceId === coordinator}
                >
                  ${label}
                </option>`,
            )}
          </select>`,
          "The device placed for your radio, if it isn't the Bridge",
        )}
        ${this._row(
          "Scan timeout",
          html`<span class="number"
            ><input
              type="number"
              min="30"
              max="600"
              step="10"
              aria-label="Zigbee scan timeout in seconds"
              .value=${String(s.zigbee_timeout_seconds)}
              @change=${(e: Event) => {
                const raw = Number((e.target as HTMLInputElement).value);
                if (!Number.isFinite(raw)) return;
                this._change({
                  zigbee_timeout_seconds: Math.min(
                    600,
                    Math.max(30, Math.round(raw)),
                  ),
                });
              }}
            />s</span
          >`,
          "Raise it if Load Mesh times out on a large mesh",
        )}
      </div>

      <div class="section">
        <div class="section-title">Troubleshooting</div>
        ${this._row(
          "Debug logging",
          this._switch(s.debug_logging, "Debug logging", (debug_logging) =>
            this._change({ debug_logging }),
          ),
          "Writes spatial_context_debug.log in your config folder — ids and counts only",
        )}
      </div>

      <div class="section">
        <div class="section-title">About</div>
        ${this._row(
          "Version",
          html`<span class="description">v${__VERSION__}</span>`,
        )}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "settings-menu": SettingsMenu;
  }
}
