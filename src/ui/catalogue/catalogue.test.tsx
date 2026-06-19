import { cleanup, render, screen } from "@solidjs/testing-library";
import { afterEach, describe, expect, it } from "vitest";
import { Catalogue } from "~/ui/catalogue";

afterEach(cleanup);

describe("<Catalogue />", () => {
  it("renders the sidebar landmark", () => {
    render(() => <Catalogue />);
    expect(screen.getByRole("navigation", { name: /catalogue/i })).toBeTruthy();
  });

  it("renders at least one entry by default", () => {
    render(() => <Catalogue />);
    // placeholder entry registers itself on import.
    expect(screen.getByRole("heading", { name: /placeholder/i })).toBeTruthy();
  });
});
