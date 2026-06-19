import { cleanup, render, screen } from "@solidjs/testing-library";
import { afterEach, describe, expect, it } from "vitest";
import { StatusDot } from "~/ui/primitives/status-dot";

afterEach(cleanup);

describe("<StatusDot />", () => {
  it("renders a dot element", () => {
    render(() => <StatusDot data-testid="dot" />);
    expect(screen.getByTestId("dot")).toBeTruthy();
  });

  it("is hidden from a11y tree by default", () => {
    render(() => <StatusDot data-testid="dot" />);
    expect(screen.getByTestId("dot").getAttribute("aria-hidden")).toBe("true");
  });

  it("exposes itself to the a11y tree when aria-label is set", () => {
    render(() => <StatusDot aria-label="running" data-testid="dot" />);
    const dot = screen.getByTestId("dot");
    expect(dot.getAttribute("aria-hidden")).toBeNull();
    expect(dot.getAttribute("aria-label")).toBe("running");
  });

  it("applies pulse class when pulse is true", () => {
    render(() => <StatusDot pulse data-testid="dot" />);
    expect(screen.getByTestId("dot").className).toMatch(/pulse/i);
  });

  it("applies the tone class", () => {
    render(() => <StatusDot tone="audio" data-testid="dot" />);
    expect(screen.getByTestId("dot").className).toMatch(/audio/);
  });
});
