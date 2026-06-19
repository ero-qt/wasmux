import { cleanup, fireEvent, render, screen } from "@solidjs/testing-library";
import { afterEach, describe, expect, it, vi } from "vitest";
import { IconButton } from "~/ui/primitives/icon-button";

afterEach(cleanup);

describe("<IconButton />", () => {
  it("uses the icon variant", () => {
    render(() => <IconButton aria-label="settings">⚙</IconButton>);
    expect(screen.getByRole("button", { name: "settings" }).className).toMatch(/icon/);
  });

  it("requires aria-label and forwards it", () => {
    render(() => <IconButton aria-label="settings">⚙</IconButton>);
    expect(screen.getByLabelText("settings")).toBeTruthy();
  });

  it("reflects pressed state via aria-pressed", () => {
    render(() => (
      <IconButton aria-label="snap" pressed>
        ⌶
      </IconButton>
    ));
    expect(screen.getByRole("button", { name: "snap" }).getAttribute("aria-pressed")).toBe("true");
  });

  it("omits aria-pressed when pressed is undefined", () => {
    render(() => <IconButton aria-label="plain">⚙</IconButton>);
    expect(screen.getByRole("button", { name: "plain" }).getAttribute("aria-pressed")).toBeNull();
  });

  it("calls onClick", () => {
    const onClick = vi.fn();
    render(() => (
      <IconButton aria-label="x" onClick={onClick}>
        ✕
      </IconButton>
    ));
    fireEvent.click(screen.getByRole("button", { name: "x" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
