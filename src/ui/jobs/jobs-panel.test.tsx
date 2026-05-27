import { cleanup, fireEvent, render, screen } from "@solidjs/testing-library";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { jobTracker } from "~/ui/jobs/job-tracker";
import { JobsPanel } from "~/ui/jobs/jobs-panel";

beforeEach(() => {
  jobTracker.clear();
});

afterEach(() => {
  cleanup();
  jobTracker.clear();
});

describe("JobsPanel", () => {
  test("renders the empty-state message when no jobs are tracked", () => {
    render(() => <JobsPanel />);

    expect(screen.getByText(/no jobs this session/i)).toBeTruthy();
  });

  test("parent rows expose a button role with aria-expanded", () => {
    const parentId = jobTracker.start("parent");
    jobTracker.start("child", parentId);

    render(() => <JobsPanel />);

    const parentRow = screen.getByRole("button", { name: /parent/i });
    expect(parentRow.getAttribute("aria-expanded")).toBe("true");
  });

  test("leaf rows do not advertise a button role", () => {
    jobTracker.start("just me");

    render(() => <JobsPanel />);

    expect(screen.queryByRole("button")).toBeNull();
  });

  test("clicking anywhere on the parent row toggles aria-expanded", () => {
    const parentId = jobTracker.start("parent");
    jobTracker.start("child", parentId);

    render(() => <JobsPanel />);

    const parentRow = screen.getByRole("button", { name: /parent/i });
    fireEvent.click(parentRow);
    expect(parentRow.getAttribute("aria-expanded")).toBe("false");

    fireEvent.click(parentRow);
    expect(parentRow.getAttribute("aria-expanded")).toBe("true");
  });

  test("clicking on text inside the row still toggles", () => {
    const parentId = jobTracker.start("parent");
    jobTracker.start("child", parentId);

    render(() => <JobsPanel />);

    // The job-name span is a descendant of the clickable row; clicking it
    // should bubble up and toggle the row.
    const nameSpan = screen.getByText("parent");
    fireEvent.click(nameSpan);

    const parentRow = screen.getByRole("button", { name: /parent/i });
    expect(parentRow.getAttribute("aria-expanded")).toBe("false");
  });

  test("Enter on a focused parent row toggles", () => {
    const parentId = jobTracker.start("parent");
    jobTracker.start("child", parentId);

    render(() => <JobsPanel />);

    const parentRow = screen.getByRole("button", { name: /parent/i });
    fireEvent.keyDown(parentRow, { key: "Enter" });

    expect(parentRow.getAttribute("aria-expanded")).toBe("false");
  });

  test("Space on a focused parent row toggles", () => {
    const parentId = jobTracker.start("parent");
    jobTracker.start("child", parentId);

    render(() => <JobsPanel />);

    const parentRow = screen.getByRole("button", { name: /parent/i });
    fireEvent.keyDown(parentRow, { key: " " });

    expect(parentRow.getAttribute("aria-expanded")).toBe("false");
  });

  test("clicking a child row does not toggle the parent", () => {
    const parentId = jobTracker.start("parent");
    jobTracker.start("child", parentId);

    render(() => <JobsPanel />);

    const parentRow = screen.getByRole("button", { name: /parent/i });
    // The child has no descendants so it is a leaf and not interactive.
    const childName = screen.getByText("child");
    fireEvent.click(childName);

    expect(parentRow.getAttribute("aria-expanded")).toBe("true");
  });
});
