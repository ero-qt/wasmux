import { cleanup, render, screen } from "@solidjs/testing-library";
import { afterEach, describe, expect, it } from "vitest";
import { Pill } from "~/ui/primitives/pill";

afterEach(cleanup);

describe("<Pill />", () => {
  it("renders text", () => {
    render(() => <Pill>offline</Pill>);
    expect(screen.getByText("offline")).toBeTruthy();
  });

  it("renders a dot when dot is true", () => {
    render(() => (
      <Pill dot data-testid="pill">
        offline
      </Pill>
    ));
    const pill = screen.getByTestId("pill");
    expect(pill.querySelector("[aria-hidden='true']")).not.toBeNull();
  });

  it("omits the dot by default", () => {
    render(() => <Pill data-testid="pill">label</Pill>);
    const pill = screen.getByTestId("pill");
    expect(pill.querySelector("[aria-hidden='true']")).toBeNull();
  });

  it("applies the tone class", () => {
    render(() => (
      <Pill tone="audio" data-testid="pill">
        audio
      </Pill>
    ));
    expect(screen.getByTestId("pill").className).toMatch(/audio/);
  });
});
