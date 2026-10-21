import { LitElement, html, css, nothing } from "lit";
import { query, state } from "lit/decorators.js";
import { safeCustomElement } from "../define";
import { localize } from "../i18n";
import { sharedStyles } from "../styles";

interface Request {
  kind: "confirm" | "alert" | "prompt";
  text: string;
  title?: string;
  confirmText?: string;
  dismissText?: string;
  destructive?: boolean;
  resolve: (value: boolean | string | null) => void;
}

/** One dialog for every confirmation, error notice and one-line question in
 * the panel, replacing window.confirm / alert / prompt. Laid out like HA's
 * own generic dialog (dialog-box): large-radius card on a dimmed backdrop,
 * title, text, and a footer with a plain Cancel and a filled (or danger)
 * confirm button. HA's dialog-box can't be opened from a custom panel — it
 * is lazy-loaded by HA's own bundle — so this mirrors it using the native
 * <dialog> element, which gives focus trapping and Escape for free. */
@safeCustomElement("sc-dialog")
export class ScDialog extends LitElement {
  static override styles = [
    sharedStyles,
    css`
      dialog {
        padding: 0;
        border: none;
        border-radius: var(--ha-border-radius-4xl, 28px);
        background: var(--card-background-color, var(--sc-bg));
        color: var(--sc-fg);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        width: 480px;
        max-width: calc(100vw - 32px);
      }
      dialog::backdrop {
        background: rgba(0, 0, 0, 0.32);
      }
      .body {
        padding: var(--ha-space-6, 24px) var(--ha-space-6, 24px) 0;
      }
      h2 {
        margin: 0 0 var(--ha-space-4, 16px);
        font-size: var(--ha-font-size-2xl, 24px);
        font-weight: var(--ha-font-weight-normal, 400);
        line-height: 1.3;
      }
      p {
        margin: 0;
        font-size: var(--ha-font-size-m, 14px);
        line-height: 1.5;
        white-space: pre-line;
      }
      input {
        width: 100%;
        margin-top: var(--ha-space-4, 16px);
      }
      .footer {
        display: flex;
        justify-content: flex-end;
        gap: var(--ha-space-2, 8px);
        padding: var(--ha-space-4, 16px) var(--ha-space-6, 24px)
          var(--ha-space-6, 24px);
      }
      .footer button {
        height: var(--sc-h-control);
        padding: 0 var(--ha-space-4, 16px);
        border-radius: var(--ha-border-radius-pill, 9999px);
        font-weight: var(--ha-font-weight-medium, 500);
      }
      .footer button.cancel {
        color: var(--sc-accent);
      }
      .footer button.confirm {
        background: var(--sc-accent);
        color: var(--text-primary-color, #fff);
      }
      .footer button.confirm.destructive {
        background: var(--sc-danger);
      }
    `,
  ];

  @state() private _req: Request | null = null;
  @state() private _value = "";
  @query("dialog") private _dialog!: HTMLDialogElement;

  confirm(opts: {
    text: string;
    title?: string;
    confirmText?: string;
    dismissText?: string;
    destructive?: boolean;
  }): Promise<boolean> {
    return this._open({ kind: "confirm", ...opts }) as Promise<boolean>;
  }

  alert(opts: { text: string; title?: string }): Promise<void> {
    return this._open({ kind: "alert", ...opts }).then(() => undefined);
  }

  /** Resolves the entered text, or null if cancelled. */
  prompt(opts: {
    text: string;
    title?: string;
    confirmText?: string;
  }): Promise<string | null> {
    return this._open({ kind: "prompt", ...opts }) as Promise<string | null>;
  }

  private _open(
    req: Omit<Request, "resolve">,
  ): Promise<boolean | string | null> {
    // A second request while one is open dismisses the first.
    this._onCancel();
    return new Promise((resolve) => {
      this._value = "";
      this._req = { ...req, resolve };
      void this.updateComplete.then(() => {
        if (!this._dialog.open) this._dialog.showModal();
        const target = this.renderRoot.querySelector<HTMLElement>(
          req.destructive ? "button.cancel" : "input, button.confirm",
        );
        target?.focus();
      });
    });
  }

  private _finish(value: boolean | string | null): void {
    const req = this._req;
    if (!req) return;
    this._req = null;
    if (this._dialog?.open) this._dialog.close();
    req.resolve(value);
  }

  private _onConfirm = () => {
    this._finish(this._req?.kind === "prompt" ? this._value : true);
  };

  private _onCancel = () => {
    this._finish(this._req?.kind === "prompt" ? null : false);
  };

  /** Escape: the dialog's own cancel event. */
  private _onDialogCancel = (e: Event) => {
    e.preventDefault();
    this._onCancel();
  };

  private _onBackdropClick = (e: MouseEvent) => {
    if (e.target === this._dialog) this._onCancel();
  };

  private _onInputKey = (e: KeyboardEvent) => {
    if (e.key === "Enter") this._onConfirm();
  };

  override render() {
    const req = this._req;
    return html`<dialog
      @cancel=${this._onDialogCancel}
      @click=${this._onBackdropClick}
      aria-labelledby=${req?.title ? "title" : nothing}
      aria-describedby="text"
    >
      ${
        req
          ? html`<div class="body">
                ${req.title ? html`<h2 id="title">${req.title}</h2>` : nothing}
                <p id="text">${req.text}</p>
                ${
                  req.kind === "prompt"
                    ? html`<input
                        type="text"
                        .value=${this._value}
                        @input=${(e: Event) =>
                          (this._value = (e.target as HTMLInputElement).value)}
                        @keydown=${this._onInputKey}
                      />`
                    : nothing
                }
              </div>
              <div class="footer">
                ${
                  req.kind === "alert"
                    ? nothing
                    : html`<button class="cancel" @click=${this._onCancel}>
                        ${req.dismissText ?? localize("dialog.cancel")}
                      </button>`
                }
                <button
                  class="confirm ${req.destructive ? "destructive" : ""}"
                  @click=${this._onConfirm}
                >
                  ${req.confirmText ?? localize("dialog.ok")}
                </button>
              </div>`
          : nothing
      }
    </dialog>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sc-dialog": ScDialog;
  }
}
