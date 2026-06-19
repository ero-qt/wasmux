import { cleanup, fireEvent, render, screen } from "@solidjs/testing-library";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Button } from "~/ui/primitives/button";

afterEach(cleanup);

describe("<Button />", () => {
  it("renders children", () => {
    render(() => <Button>save</Button>);
    expect(screen.getByRole("button", { name: "save" })).toBeTruthy();
  });

  it("calls onClick when activated", () => {
    const onClick = vi.fn();
    render(() => <Button onClick={onClick}>save</Button>);
    fireEvent.click(screen.getByRole("button", { name: "save" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("forwards type to the underlying button", () => {
    render(() => <Button type="submit">submit</Button>);
    expect(screen.getByRole("button", { name: "submit" }).getAttribute("type")).toBe("submit");
  });

  it("does not call onClick when disabled", () => {
    const onClick = vi.fn();
    render(() => (
      <Button disabled onClick={onClick}>
        disabled
      </Button>
    ));
    fireEvent.click(screen.getByRole("button", { name: "disabled" }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("applies the variant class", () => {
    render(() => (
      <Button variant="ghost" data-testid="ghost">
        ghost
      </Button>
    ));
    expect(screen.getByTestId("ghost").className).toMatch(/ghost/);
  });

  it("accepts an extra class without dropping the variant class", () => {
    render(() => (
      <Button class="extra" data-testid="merged">
        merged
      </Button>
    ));
    const el = screen.getByTestId("merged");
    expect(el.className).toContain("extra");
    expect(el.className.split(/\s+/).length).toBeGreaterThan(1);
  });
});
