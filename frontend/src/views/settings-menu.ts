import { LitElement, html, css, nothing } from "lit";
import { property } from "lit/decorators.js";
import { safeCustomElement } from "../define";
import type { Settings } from "../types";
import { localize } from "../i18n";
import { selectStyles, sharedStyles, switchStyles } from "../styles";

/** The Settings menu's content: grouped rows, label (and an optional
 * one-line description) on the left, its control on the right. Every
 * change is reported as a `settings-change` patch — the panel applies and
 * saves it (settings are instant-apply, shared by every viewer). */
@safeCustomElement("settings-menu")
export class SettingsMenu extends LitElement {
  static override styles = [
    sharedStyles,
    selectStyles,
    switchStyles,
    css`
      :host {
        display: flex;
        flex-direction: column;
        min-height: 0;
        max-height: calc(100vh - 32px);
        font-size: 0.9375rem;
      }
      .header {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 16px 24px 8px 16px;
        font-size: 1.375rem;
        font-weight: 500;
      }
      .body {
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        padding-bottom: 8px;
      }
      .footer {
        display: flex;
        justify-content: flex-end;
        padding: 12px 24px 20px;
      }
      .done {
        height: 48px;
        padding: 0 28px;
        border-radius: 24px;
        background: var(--sc-accent);
        color: var(--text-primary-color, #fff);
        font-size: 0.9375rem;
        font-weight: 500;
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
        margin-top: 4px;
      }
      .section-title {
        padding: 16px 24px 4px;
        font-size: 0.75rem;
        font-weight: 400;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--sc-fg-secondary);
      }
      .row {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        align-items: center;
        gap: 16px;
        padding: 8px 24px;
        min-height: 44px;
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
        border-radius: 12px;
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
        border-radius: 12px;
        padding: 6px 12px;
      }
      select {
        max-width: 170px;
        height: 36px;
      }
      input[type="number"] {
        height: 36px;
        -moz-appearance: textfield;
      }
      input[type="number"]::-webkit-inner-spin-button,
      input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
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
          title=${localize("settings.close")}
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
        <span>${localize("settings.title")}</span>
      </div>
      <div class="body">
        <div class="section">
          <div class="section-title">${localize("settings.editing")}</div>
          ${this._row(
            localize("settings.autoSave"),
            this._switch(
              s.auto_save,
              localize("settings.autoSave"),
              (auto_save) => this._change({ auto_save }),
            ),
            localize("settings.autoSaveHint"),
          )}
          ${this._row(
            localize("settings.units"),
            this._segmented(
              s.unit_system,
              [
                ["metric", localize("settings.metric")],
                ["imperial", localize("settings.imperial")],
              ],
              (unit_system) => this._change({ unit_system }),
            ),
          )}
          ${this._row(
            localize("settings.floorOrder"),
            this._segmented(
              s.floor_order,
              [
                ["top_down", localize("settings.topFirst")],
                ["ground_up", localize("settings.groundFirst")],
              ],
              (floor_order) => this._change({ floor_order }),
            ),
          )}
        </div>

        <div class="section">
          <div class="section-title">${localize("settings.zigbeeMesh")}</div>
          ${this._row(
            localize("settings.coordinator"),
            html`<span class="select-wrap"
              ><select
                aria-label=${localize("settings.coordinatorAria")}
                @change=${(e: Event) =>
                  this._change({
                    zigbee_coordinator_device_id:
                      (e.target as HTMLSelectElement).value || null,
                  })}
              >
                <option value="" ?selected=${!coordinator}>
                  ${localize("settings.bridge")}
                </option>
                ${
                  // Keep a saved choice visible even once its pin is removed,
                  // rather than the select silently showing the default.
                  coordinator && !coordinatorPlaced
                    ? html`<option value=${coordinator} selected>
                        ${localize("settings.notPlaced")}
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
                )}</select
              ><ha-icon class="chev" icon="mdi:menu-down"></ha-icon
            ></span>`,
            localize("settings.coordinatorHint"),
          )}
          ${this._row(
            localize("settings.scanTimeout"),
            html`<span class="number"
              ><input
                type="number"
                min="30"
                max="600"
                step="10"
                aria-label=${localize("settings.scanTimeoutAria")}
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
            localize("settings.scanTimeoutHint"),
          )}
        </div>

        <div class="section">
          <div class="section-title">
            ${localize("settings.troubleshooting")}
          </div>
          ${this._row(
            localize("settings.debugLogging"),
            this._switch(
              s.debug_logging,
              localize("settings.debugLogging"),
              (debug_logging) => this._change({ debug_logging }),
            ),
            localize("settings.debugLoggingHint"),
          )}
        </div>

        <div class="section">
          <div class="section-title">${localize("settings.about")}</div>
          ${this._row(
            localize("settings.version"),
            html`<span class="description">v${__VERSION__}</span>`,
          )}
        </div>
      </div>
      <div class="footer">
        <button
          class="done"
          @click=${() =>
            this.dispatchEvent(
              new CustomEvent("settings-close", {
                bubbles: true,
                composed: true,
              }),
            )}
        >
          ${localize("settings.done")}
        </button>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "settings-menu": SettingsMenu;
  }
}
