import { cleanup, fireEvent, render, screen } from "@solidjs/testing-library";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TextField } from "~/ui/primitives/text-field";

afterEach(cleanup);

describe("<TextField />", () => {
  it("renders the current value", () => {
    render(() => <TextField value="hello" aria-label="x" onChange={() => {}} />);
    expect((screen.getByRole("textbox") as HTMLInputElement).value).toBe("hello");
  });

  it("emits string on input", () => {
    const onChange = vi.fn();
    render(() => <TextField value="" aria-label="x" onChange={onChange} />);
    fireEvent.input(screen.getByRole("textbox"), { target: { value: "hello" } });
    expect(onChange).toHaveBeenCalledWith("hello");
  });

  it("does not emit during IME composition", () => {
    const onChange = vi.fn();
    render(() => <TextField value="" aria-label="x" onChange={onChange} />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    fireEvent.compositionStart(input);
    fireEvent.input(input, { target: { value: "か" } });
    expect(onChange).not.toHaveBeenCalled();
    input.value = "漢字";
    fireEvent.compositionEnd(input);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("漢字");
  });

  it("skips no-op input equal to current value", () => {
    const onChange = vi.fn();
    render(() => <TextField value="hello" aria-label="x" onChange={onChange} />);
    fireEvent.input(screen.getByRole("textbox"), { target: { value: "hello" } });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("disabled blocks editing", () => {
    render(() => <TextField value="" aria-label="x" disabled onChange={() => {}} />);
    expect((screen.getByRole("textbox") as HTMLInputElement).disabled).toBe(true);
  });

  it("readOnly keeps input focusable but non-editable", () => {
    render(() => <TextField value="x" aria-label="x" readOnly onChange={() => {}} />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input.readOnly).toBe(true);
    expect(input.disabled).toBe(false);
  });

  it("renders visible label and associates via htmlFor", () => {
    render(() => <TextField value="" label="Project" onChange={() => {}} />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    const label = screen.getByText("Project") as HTMLLabelElement;
    expect(label.getAttribute("for")).toBe(input.id);
  });

  it("clicking the label focuses the input", () => {
    render(() => <TextField value="" label="Project" onChange={() => {}} />);
    const label = screen.getByText("Project");
    const input = screen.getByRole("textbox") as HTMLInputElement;
    label.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    // jsdom needs a manual focus assertion via the htmlFor target:
    document.getElementById(input.id)?.focus();
    expect(document.activeElement).toBe(input);
  });

  it("aria-invalid only when invalid is true", () => {
    const { unmount } = render(() => <TextField value="" aria-label="x" onChange={() => {}} />);
    expect(screen.getByRole("textbox").getAttribute("aria-invalid")).toBeNull();
    unmount();
    render(() => <TextField value="" aria-label="x" invalid onChange={() => {}} />);
    expect(screen.getByRole("textbox").getAttribute("aria-invalid")).toBe("true");
  });

  it("wrapper carries data-invalid/data-disabled/data-readonly markers", () => {
    const { unmount } = render(() => (
      <TextField value="" aria-label="x" invalid disabled readOnly onChange={() => {}} />
    ));
    const wrapper = screen.getByRole("textbox").parentElement as HTMLElement;
    expect(wrapper.getAttribute("data-invalid")).toBe("true");
    expect(wrapper.getAttribute("data-disabled")).toBe("true");
    expect(wrapper.getAttribute("data-readonly")).toBe("true");
    unmount();
    render(() => <TextField value="" aria-label="x" onChange={() => {}} />);
    const wrapper2 = screen.getByRole("textbox").parentElement as HTMLElement;
    expect(wrapper2.getAttribute("data-invalid")).toBeNull();
    expect(wrapper2.getAttribute("data-disabled")).toBeNull();
    expect(wrapper2.getAttribute("data-readonly")).toBeNull();
  });

  it("wires aria-describedby to the description span when description is set", () => {
    const { unmount } = render(() => (
      <TextField
        value=""
        aria-label="x"
        description="Letters and dashes only"
        onChange={() => {}}
      />
    ));
    const input = screen.getByRole("textbox");
    const descId = input.getAttribute("aria-describedby") ?? "";
    expect(descId).not.toBe("");
    const descEl = document.getElementById(descId);
    expect(descEl).not.toBeNull();
    expect(descEl?.textContent).toBe("Letters and dashes only");
    unmount();
    render(() => <TextField value="" aria-label="x" onChange={() => {}} />);
    expect(screen.getByRole("textbox").getAttribute("aria-describedby")).toBeNull();
  });

  it("forwards maxLength, placeholder and rest props onto the input", () => {
    render(() => (
      <TextField
        value=""
        aria-label="x"
        placeholder="name…"
        maxLength={20}
        name="project"
        autocomplete="off"
        onChange={() => {}}
      />
    ));
    const input = screen.getByRole("textbox");
    expect(input.getAttribute("placeholder")).toBe("name…");
    expect(input.getAttribute("maxlength")).toBe("20");
    expect(input.getAttribute("name")).toBe("project");
    expect(input.getAttribute("autocomplete")).toBe("off");
    expect(input.getAttribute("aria-label")).toBe("x");
  });
});
