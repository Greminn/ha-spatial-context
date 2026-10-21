import { LitElement, html, css, nothing } from "lit";
import { property } from "lit/decorators.js";
import { safeCustomElement } from "../define";
import type { Settings } from "../types";
import { localize } from "../i18n";
import { selectStyles, sharedStyles, switchStyles } from "../styles";

const REPO = "https://github.com/Greminn/ha-spatial-context";
const DOCS = "https://greminn.github.io/ha-spatial-context/";
const SUPPORT = "https://buymeacoffee.com/greminn";

/** The Settings page: a card per topic (HA's settings layout), rows, label (and an optional
 * one-line description) on the left, its control on the right. Every
 * change is reported as a `settings-change` patch — the panel applies and
 * saves it (settings are instant-apply, shared by every viewer). */
@safeCustomElement("settings-page")
export class SettingsPage extends LitElement {
  static override styles = [
    sharedStyles,
    selectStyles,
    switchStyles,
    css`
      :host {
        display: block;
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        background: var(--primary-background-color, #fafafa);
        font-size: var(--sc-fs-row);
      }
      .page {
        max-width: 720px;
        margin: 0 auto;
        padding: var(--ha-space-6, 24px) var(--ha-space-4, 16px)
          var(--ha-space-12, 48px);
      }
      /* HA's settings cards: the title is inside the card, rows have no
       * dividers, and the box is lighter than the page. */
      .card {
        margin-bottom: var(--ha-space-6, 24px);
        padding: var(--ha-space-2, 8px) 0;
        border: 1px solid var(--ha-card-border-color, var(--sc-divider));
        border-radius: var(
          --ha-card-border-radius,
          var(--ha-border-radius-xl, 12px)
        );
        background: var(
          --ha-card-background,
          var(--card-background-color, #fff)
        );
        overflow: hidden;
      }
      .card h2 {
        margin: 0;
        padding: var(--ha-space-4, 16px) var(--ha-space-4, 16px)
          var(--ha-space-2, 8px);
        font-size: var(--ha-font-size-2xl, 24px);
        font-weight: 400;
        line-height: 1.3;
      }
      .row {
        display: flex;
        align-items: center;
        gap: var(--ha-space-4, 16px);
        min-height: 56px;
        padding: var(--ha-space-2, 8px) var(--ha-space-4, 16px);
      }
      .text {
        flex: 1;
        min-width: 0;
      }
      .label {
        color: var(--sc-fg);
        line-height: 1.3;
      }
      .description {
        margin-top: 2px;
        font-size: var(--sc-fs-small);
        line-height: 1.3;
        color: var(--sc-fg-secondary);
      }
      /* A row that is a link: icon, label and hint, and an "opens in a
       * new tab" arrow. The whole row is the target. */
      a.row {
        color: inherit;
        text-decoration: none;
      }
      a.row:hover {
        background: var(--sc-hover);
      }
      a.row:focus-visible {
        outline: 2px solid var(--sc-accent);
        outline-offset: -2px;
      }
      .row > ha-icon {
        --mdc-icon-size: 20px;
        flex: none;
        color: var(--sc-fg-secondary);
      }
      .row > ha-icon.external {
        --mdc-icon-size: 16px;
        color: var(--sc-accent);
      }

      /* Two-option segmented control. */
      .segmented {
        flex: none;
        display: inline-flex;
        border: 1px solid var(--sc-divider);
        border-radius: var(--sc-r-control);
        overflow: hidden;
      }
      .segmented button {
        padding: 6px 14px;
        border-radius: 0;
        font-size: var(--sc-fs-small);
        font-weight: 400;
        color: var(--sc-fg);
        background: transparent;
        white-space: nowrap;
      }
      .segmented button + button {
        border-inline-start: 1px solid var(--sc-divider);
      }
      .segmented button.active {
        background: color-mix(in srgb, var(--sc-accent) 22%, transparent);
        color: var(--sc-accent);
      }

      /* Filled fields, as HA's forms draw them. */
      select,
      input[type="number"] {
        font: inherit;
        font-size: var(--sc-fs-body);
        color: var(--sc-fg);
        height: 48px;
        padding: 0 var(--ha-space-4, 16px);
        border: none;
        border-bottom: 1px solid
          color-mix(in srgb, var(--sc-fg) 60%, transparent);
        border-radius: var(--ha-border-radius-sm, 4px)
          var(--ha-border-radius-sm, 4px) 0 0;
        background: var(
          --ha-color-form-background,
          color-mix(in srgb, var(--sc-fg) 12%, transparent)
        );
      }
      select:hover,
      input[type="number"]:hover {
        border-bottom-color: var(--sc-fg);
        background: var(
          --ha-color-form-background-hover,
          color-mix(in srgb, var(--sc-fg) 16%, transparent)
        );
      }
      select:focus-visible,
      input[type="number"]:focus-visible {
        outline: none;
        border-bottom: 2px solid var(--sc-accent);
      }
      select {
        width: 240px;
        max-width: 100%;
      }
      .select-wrap {
        flex: none;
      }
      input[type="number"] {
        -moz-appearance: textfield;
      }
      input[type="number"]::-webkit-inner-spin-button,
      input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
      .number {
        flex: none;
        display: inline-flex;
        align-items: center;
        gap: var(--ha-space-1, 4px);
        color: var(--sc-fg-secondary);
        font-size: var(--sc-fs-small);
      }
      input[type="number"] {
        width: 64px;
        text-align: end;
      }
      @media (max-width: 600px) {
        .row {
          flex-wrap: wrap;
        }
        select {
          width: 100%;
        }
        .select-wrap {
          flex: 1 1 100%;
        }
      }
    `,
  ];

  @property({ attribute: false }) settings!: Settings;
  /** Placed devices (any floor) a coordinator can be pinned to. */
  @property({ attribute: false }) coordinatorChoices: {
    deviceId: string;
    label: string;
  }[] = [];

  /** Home Assistant's own version, shown under About so it can go in a bug
   * report without leaving the page. */
  @property() haVersion = "";

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
      <div class="text">
        <div class="label">${label}</div>
        ${description ? html`<div class="description">${description}</div>` : nothing}
      </div>
      ${control}
    </div>`;
  }

  private _linkRow(icon: string, label: string, hint: string, href: string) {
    return html`<a
      class="row"
      href=${href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <ha-icon icon=${icon}></ha-icon>
      <div class="text">
        <div class="label">${label}</div>
        <div class="description">${hint}</div>
      </div>
      <ha-icon class="external" icon="mdi:open-in-new"></ha-icon>
    </a>`;
  }

  /** A dropdown of the devices placed on the map, with a default entry
   * for "none chosen". Keeps a saved choice visible even once its pin is
   * removed, rather than the select silently showing the default. */
  private _deviceSelect(opts: {
    value: string | null;
    defaultLabel: string;
    aria: string;
    onChange: (deviceId: string | null) => void;
  }) {
    const { value } = opts;
    const placed = this.coordinatorChoices.some((c) => c.deviceId === value);
    return html`<span class="select-wrap"
      ><select
        aria-label=${opts.aria}
        @change=${(e: Event) =>
          opts.onChange((e.target as HTMLSelectElement).value || null)}
      >
        <option value="" ?selected=${!value}>${opts.defaultLabel}</option>
        ${
          value && !placed
            ? html`<option value=${value} selected>
                ${localize("settings.notPlaced")}
              </option>`
            : nothing
        }
        ${this.coordinatorChoices.map(
          ({ deviceId, label }) =>
            html`<option value=${deviceId} ?selected=${deviceId === value}>
              ${label}
            </option>`,
        )}</select
      ><ha-icon class="chev" icon="mdi:menu-down"></ha-icon
    ></span>`;
  }

  override render() {
    const s = this.settings;
    const coordinator = s.zigbee_coordinator_device_id;
    return html`<div class="page">
      <div class="card">
        <h2>${localize("settings.editing")}</h2>
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

      <div class="card">
        <h2>${localize("settings.zigbeeMesh")}</h2>
        ${this._row(
          localize("settings.coordinator"),
          this._deviceSelect({
            value: coordinator,
            defaultLabel: localize("settings.bridge"),
            aria: localize("settings.coordinatorAria"),
            onChange: (zigbee_coordinator_device_id) =>
              this._change({ zigbee_coordinator_device_id }),
          }),
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

      <div class="card">
        <h2>${localize("settings.matterThread")}</h2>
        ${this._row(
          localize("settings.borderRouter"),
          this._deviceSelect({
            value: s.thread_border_router_device_id,
            defaultLabel: localize("settings.notSet"),
            aria: localize("settings.borderRouterAria"),
            onChange: (thread_border_router_device_id) =>
              this._change({ thread_border_router_device_id }),
          }),
          localize("settings.borderRouterHint"),
        )}
      </div>

      <div class="card">
        <h2>${localize("settings.troubleshooting")}</h2>
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

      <div class="card">
        <h2>${localize("settings.about")}</h2>
        ${this._row(
          localize("settings.version"),
          html`<span class="description">v${__VERSION__}</span>`,
        )}
        ${
          this.haVersion
            ? this._row(
                localize("settings.haVersion"),
                html`<span class="description">${this.haVersion}</span>`,
              )
            : nothing
        }
        ${this._linkRow(
          "mdi:text-box-outline",
          localize("settings.releaseNotes"),
          localize("settings.releaseNotesHint"),
          `${REPO}/releases`,
        )}
        ${this._linkRow(
          "mdi:book-open-variant",
          localize("settings.documentation"),
          localize("settings.documentationHint"),
          DOCS,
        )}
        ${this._linkRow(
          "mdi:bug-outline",
          localize("settings.reportIssue"),
          localize("settings.reportIssueHint"),
          `${REPO}/issues/new/choose`,
        )}
        ${this._linkRow(
          "mdi:github",
          localize("settings.github"),
          localize("settings.githubHint"),
          REPO,
        )}
        ${this._linkRow(
          "mdi:coffee-outline",
          localize("settings.support"),
          localize("settings.supportHint"),
          SUPPORT,
        )}
        ${this._row(
          localize("settings.licence"),
          html`<span class="description">MIT</span>`,
        )}
      </div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "settings-page": SettingsPage;
  }
}
