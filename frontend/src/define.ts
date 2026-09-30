/** Drop-in for Lit's `@customElement` that skips a tag already defined.
 *
 * When HA restarts with a new build, an open browser tab reconnects and
 * imports the panel module again under a new `?v=` URL (see frontend.py's
 * cache-bust token) into a page that already defined every tag. Lit's
 * decorator throws on the first duplicate ("the name 'floorplan-canvas'
 * has already been used"), aborting the module halfway and logging an
 * uncaught error to HA's log. Custom elements can't be redefined, so the
 * tab keeps running the old code either way until reloaded — this just
 * makes that quiet instead of a half-evaluated module plus a logged error.
 */
export const safeCustomElement =
  (tagName: string) =>
  (
    classOrTarget: CustomElementConstructor,
    context?: ClassDecoratorContext,
  ) => {
    const define = () => {
      if (customElements.get(tagName)) {
        console.info(
          `spatial-context: <${tagName}> already defined — reload the page to pick up the updated panel.`,
        );
        return;
      }
      customElements.define(tagName, classOrTarget);
    };
    if (context !== undefined) context.addInitializer(define);
    else define();
  };
