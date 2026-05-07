// jsdom does not implement Pointer Events. Kobalte and other a11y-first
// libraries call `setPointerCapture` / `releasePointerCapture` on real
// pointer interactions. The methods are no-ops in tests.
if (typeof Element !== "undefined") {
  if (!Element.prototype.setPointerCapture) {
    Element.prototype.setPointerCapture = () => {};
    Element.prototype.releasePointerCapture = () => {};
    Element.prototype.hasPointerCapture = () => false;
  }
}
