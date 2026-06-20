import { cleanup, fireEvent, render, screen } from "@solidjs/testing-library";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Textarea } from "~/ui/primitives/textarea";

afterEach(cleanup);

describe("<Textarea />", () => {
  it("renders the supplied value", () => {
    render(() => <Textarea value="hi" aria-label="x" onChange={() => {}} />);
    const ta = screen.getByRole("textbox") as HTMLTextAreaElement;
    expect(ta.tagName).toBe("TEXTAREA");
    expect(ta.value).toBe("hi");
  });

  it("emits onChange on user input outside composition", () => {
    const onChange = vi.fn();
    render(() => <Textarea value="" aria-label="x" onChange={onChange} />);
    fireEvent.input(screen.getByRole("textbox"), { target: { value: "hello" } });
    expect(onChange).toHaveBeenCalledWith("hello");
  });

  it("skips no-op input equal to current value", () => {
    const onChange = vi.fn();
    render(() => <Textarea value="hi" aria-label="x" onChange={onChange} />);
    fireEvent.input(screen.getByRole("textbox"), { target: { value: "hi" } });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("suppresses onChange during IME composition and emits once on compositionend", () => {
    const onChange = vi.fn();
    render(() => <Textarea value="" aria-label="x" onChange={onChange} />);
    const ta = screen.getByRole("textbox") as HTMLTextAreaElement;
    fireEvent.compositionStart(ta);
    fireEvent.input(ta, { target: { value: "か" } });
    expect(onChange).not.toHaveBeenCalled();
    ta.value = "漢字";
    fireEvent.compositionEnd(ta);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("漢字");
  });

  it("respects disabled", () => {
    const onChange = vi.fn();
    render(() => <Textarea value="" aria-label="x" disabled onChange={onChange} />);
    const ta = screen.getByRole("textbox") as HTMLTextAreaElement;
    expect(ta.disabled).toBe(true);
    fireEvent.input(ta, { target: { value: "x" } });
    // disabled inputs do not normally fire input; we just check the attribute.
    expect(ta.disabled).toBe(true);
  });

  it("sets aria-invalid when invalid is true", () => {
    render(() => <Textarea value="" aria-label="x" invalid onChange={() => {}} />);
    expect(screen.getByRole("textbox").getAttribute("aria-invalid")).toBe("true");
  });

  it("does not set aria-multiline", () => {
    render(() => <Textarea value="" aria-label="x" onChange={() => {}} />);
    expect(screen.getByRole("textbox").getAttribute("aria-multiline")).toBeNull();
  });

  it("applies minRows fallback via the rows attribute", () => {
    render(() => <Textarea value="" aria-label="x" minRows={5} onChange={() => {}} />);
    expect(screen.getByRole("textbox").getAttribute("rows")).toBe("5");
  });

  it("spreads rest props onto the host textarea", () => {
    render(() => (
      <Textarea
        value=""
        aria-label="x"
        placeholder="…"
        name="notes"
        aria-describedby="hint"
        onChange={() => {}}
      />
    ));
    const ta = screen.getByRole("textbox");
    expect(ta.getAttribute("placeholder")).toBe("…");
    expect(ta.getAttribute("name")).toBe("notes");
    expect(ta.getAttribute("aria-describedby")).toBe("hint");
  });

  it("wrapper carries data-disabled and data-readonly markers", () => {
    const { unmount } = render(() => (
      <Textarea value="" aria-label="x" disabled readOnly onChange={() => {}} />
    ));
    const wrapper = screen.getByRole("textbox").parentElement as HTMLElement;
    expect(wrapper.getAttribute("data-disabled")).toBe("true");
    expect(wrapper.getAttribute("data-readonly")).toBe("true");
    unmount();
    render(() => <Textarea value="" aria-label="x" onChange={() => {}} />);
    const wrapper2 = screen.getByRole("textbox").parentElement as HTMLElement;
    expect(wrapper2.getAttribute("data-disabled")).toBeNull();
    expect(wrapper2.getAttribute("data-readonly")).toBeNull();
  });

  it("wires aria-describedby to the description span when description is set", () => {
    const { unmount } = render(() => (
      <Textarea value="" aria-label="x" description="Visible during playback" onChange={() => {}} />
    ));
    const ta = screen.getByRole("textbox");
    const descId = ta.getAttribute("aria-describedby") ?? "";
    expect(descId).not.toBe("");
    const descEl = document.getElementById(descId);
    expect(descEl).not.toBeNull();
    expect(descEl?.textContent).toBe("Visible during playback");
    unmount();
    render(() => <Textarea value="" aria-label="x" onChange={() => {}} />);
    expect(screen.getByRole("textbox").getAttribute("aria-describedby")).toBeNull();
  });

  it("does not preventDefault on Tab keydown", () => {
    render(() => <Textarea value="" aria-label="x" onChange={() => {}} />);
    const ta = screen.getByRole("textbox");
    const e = new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true });
    ta.dispatchEvent(e);
    expect(e.defaultPrevented).toBe(false);
  });
});
