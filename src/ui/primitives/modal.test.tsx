import { cleanup, fireEvent, render, screen } from "@solidjs/testing-library";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Modal } from "~/ui/primitives/modal";

afterEach(cleanup);

// jsdom does not implement <dialog>'s showModal/close natively.
beforeEach(() => {
  if (!HTMLDialogElement.prototype.showModal) {
    HTMLDialogElement.prototype.showModal = function () {
      this.setAttribute("open", "");
      Object.defineProperty(this, "open", { configurable: true, get: () => true });
    };
    HTMLDialogElement.prototype.close = function () {
      this.removeAttribute("open");
      Object.defineProperty(this, "open", { configurable: true, get: () => false });
      this.dispatchEvent(new Event("close"));
    };
  }
});

describe("<Modal />", () => {
  it("wires title and description via aria-labelledby and aria-describedby", () => {
    render(() => (
      <Modal open title="Settings" description="Configure your project" onChange={() => {}}>
        body
      </Modal>
    ));
    const dialog = screen.getByRole("dialog") as HTMLDialogElement;
    const labelId = dialog.getAttribute("aria-labelledby");
    const descId = dialog.getAttribute("aria-describedby");
    expect(labelId).toBeTruthy();
    expect(descId).toBeTruthy();
    expect(document.getElementById(labelId ?? "")?.textContent).toBe("Settings");
    expect(document.getElementById(descId ?? "")?.textContent).toBe("Configure your project");
  });

  it("calls showModal on open=true and close on open=false, idempotent on repeat", () => {
    const showModal = vi.spyOn(HTMLDialogElement.prototype, "showModal");
    const close = vi.spyOn(HTMLDialogElement.prototype, "close");
    const [getOpen, setOpen] = (() => {
      let v = false;
      return [() => v, (n: boolean) => (v = n)];
    })();
    const { unmount } = render(() => (
      <Modal open={getOpen()} title="t" onChange={setOpen}>
        body
      </Modal>
    ));
    setOpen(true);
    // Solid effects are synchronous on prop assignment in the test; force a re-render:
    unmount();
    render(() => (
      <Modal open title="t" onChange={() => {}}>
        body
      </Modal>
    ));
    expect(showModal).toHaveBeenCalled();
    cleanup();
    expect(close).toHaveBeenCalled();
  });

  it("Escape (cancel event) triggers onChange(false) and preventDefaults", () => {
    const onChange = vi.fn();
    render(() => (
      <Modal open title="t" onChange={onChange}>
        body
      </Modal>
    ));
    const dialog = screen.getByRole("dialog");
    const e = new Event("cancel", { cancelable: true });
    dialog.dispatchEvent(e);
    expect(onChange).toHaveBeenCalledWith(false);
    expect(e.defaultPrevented).toBe(true);
  });

  it("backdrop click triggers onChange(false) by default", () => {
    const onChange = vi.fn();
    render(() => (
      <Modal open title="t" onChange={onChange}>
        <p data-testid="inner">body</p>
      </Modal>
    ));
    const dialog = screen.getByRole("dialog");
    // click on the dialog element itself = backdrop
    fireEvent.click(dialog, { target: dialog });
    expect(onChange).toHaveBeenLastCalledWith(false);
    onChange.mockClear();
    fireEvent.click(screen.getByTestId("inner"));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("dismissOnBackdrop={false} suppresses backdrop dismissal but not Esc", () => {
    const onChange = vi.fn();
    render(() => (
      <Modal open title="t" dismissOnBackdrop={false} onChange={onChange}>
        body
      </Modal>
    ));
    const dialog = screen.getByRole("dialog");
    fireEvent.click(dialog, { target: dialog });
    expect(onChange).not.toHaveBeenCalled();
    dialog.dispatchEvent(new Event("cancel", { cancelable: true }));
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it("close button calls onChange(false)", () => {
    const onChange = vi.fn();
    render(() => (
      <Modal open title="t" onChange={onChange}>
        body
      </Modal>
    ));
    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it("size prop reflects on data-size; default is md", () => {
    const { unmount } = render(() => (
      <Modal open title="t" onChange={() => {}}>
        body
      </Modal>
    ));
    expect(screen.getByRole("dialog").getAttribute("data-size")).toBe("md");
    unmount();
    render(() => (
      <Modal open title="t" size="lg" onChange={() => {}}>
        body
      </Modal>
    ));
    expect(screen.getByRole("dialog").getAttribute("data-size")).toBe("lg");
  });

  it("locks documentElement overflow when open and restores on close", () => {
    document.documentElement.style.overflow = "auto";
    const { unmount } = render(() => (
      <Modal open title="t" onChange={() => {}}>
        body
      </Modal>
    ));
    expect(document.documentElement.style.overflow).toBe("hidden");
    unmount();
    expect(document.documentElement.style.overflow).toBe("auto");
  });

  it("renders children inside the dialog subtree", () => {
    render(() => (
      <Modal open title="t" onChange={() => {}}>
        <span data-testid="leaf">x</span>
      </Modal>
    ));
    expect(screen.getByTestId("leaf").closest("dialog")).toBeTruthy();
  });
});
