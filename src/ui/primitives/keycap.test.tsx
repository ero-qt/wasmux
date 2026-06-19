import { cleanup, render, screen } from "@solidjs/testing-library";
import { afterEach, describe, expect, it } from "vitest";
import { Keycap } from "~/ui/primitives/keycap";

afterEach(cleanup);

describe("<Keycap />", () => {
  it("renders inside a <kbd> element", () => {
    render(() => <Keycap>⌘S</Keycap>);
    const el = screen.getByText("⌘S");
    expect(el.tagName).toBe("KBD");
  });

  it("passes through extra class", () => {
    render(() => (
      <Keycap class="extra" data-testid="kc">
        ⌘S
      </Keycap>
    ));
    expect(screen.getByTestId("kc").className).toContain("extra");
  });
});
