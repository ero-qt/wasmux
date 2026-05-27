import { describe, expect, test } from "vitest";
import {
  dfsLeaves,
  findLeaf,
  findParent,
  insertPanelInLeaf,
  removeLeaf,
  replaceNode,
} from "~/ui/layout/layout-tree";
import type { LayoutNode, LeafNode, SplitNode } from "~/ui/layout/types";

const leaf = (id: string, panelIds: readonly string[] = [id]): LeafNode => ({
  kind: "leaf",
  id,
  panelIds,
  activePanelId: panelIds[0] ?? null,
});

const split = (id: string, children: readonly [LayoutNode, LayoutNode]): SplitNode => ({
  kind: "split",
  id,
  orientation: "row",
  children,
  sizes: [0.5, 0.5],
});

describe("findLeaf", () => {
  test("returns null when root is null", () => {
    expect(findLeaf(null, "a")).toBeNull();
  });

  test("returns the leaf itself when root is that leaf", () => {
    const root = leaf("a");
    expect(findLeaf(root, "a")).toBe(root);
  });

  test("walks into a split to find a deep leaf", () => {
    const target = leaf("deep");
    const root = split("s1", [leaf("a"), split("s2", [leaf("b"), target])]);
    expect(findLeaf(root, "deep")).toBe(target);
  });

  test("returns null when leaf id is not in the tree", () => {
    const root = split("s1", [leaf("a"), leaf("b")]);
    expect(findLeaf(root, "missing")).toBeNull();
  });
});

describe("findParent", () => {
  test("returns null when root is the target", () => {
    const root = leaf("a");
    expect(findParent(root, "a")).toBeNull();
  });

  test("finds a direct child's parent + side", () => {
    const root = split("s1", [leaf("a"), leaf("b")]);
    expect(findParent(root, "a")).toEqual({ parent: root, side: 0 });
    expect(findParent(root, "b")).toEqual({ parent: root, side: 1 });
  });

  test("finds a deep child's parent", () => {
    const inner = split("s2", [leaf("c"), leaf("d")]);
    const root = split("s1", [leaf("a"), inner]);
    expect(findParent(root, "c")).toEqual({ parent: inner, side: 0 });
  });
});

describe("removeLeaf", () => {
  test("removing the root leaf returns null", () => {
    expect(removeLeaf(leaf("a"), "a")).toBeNull();
  });

  test("removing one child of a top-level split returns the sibling as root", () => {
    const sibling = leaf("b");
    const root = split("s1", [leaf("a"), sibling]);
    expect(removeLeaf(root, "a")).toBe(sibling);
  });

  test("removing a deeply nested leaf collapses its parent split", () => {
    const sibling = leaf("c");
    const inner = split("s2", [leaf("b"), sibling]);
    const root = split("s1", [leaf("a"), inner]);
    const next = removeLeaf(root, "b");
    expect(next).toEqual(split("s1", [leaf("a"), sibling]));
  });

  test("removing a non-existent leaf returns the tree unchanged", () => {
    const root = split("s1", [leaf("a"), leaf("b")]);
    expect(removeLeaf(root, "ghost")).toBe(root);
  });

  test("removing a leaf whose sibling is itself a split promotes the sibling", () => {
    const innerSplit = split("s2", [leaf("c"), leaf("d")]);
    const root = split("s1", [leaf("a"), innerSplit]);
    expect(removeLeaf(root, "a")).toBe(innerSplit);
  });

  test("removing returns null when null root is passed", () => {
    expect(removeLeaf(null, "a")).toBeNull();
  });
});

describe("insertPanelInLeaf", () => {
  test("appends a panel to the leaf's tab list", () => {
    const root = leaf("a", ["x"]);
    const next = insertPanelInLeaf(root, "a", "y", false);
    expect(next).toEqual({ kind: "leaf", id: "a", panelIds: ["x", "y"], activePanelId: "x" });
  });

  test("setting makeActive switches the active panel", () => {
    const root = leaf("a", ["x"]);
    const next = insertPanelInLeaf(root, "a", "y", true);
    expect((next as LeafNode).activePanelId).toBe("y");
  });

  test("skips when the panel is already in the leaf", () => {
    const root = leaf("a", ["x", "y"]);
    expect(insertPanelInLeaf(root, "a", "y", false)).toBe(root);
  });

  test("returns the tree unchanged when leaf id is missing", () => {
    const root = split("s1", [leaf("a"), leaf("b")]);
    expect(insertPanelInLeaf(root, "ghost", "p", false)).toBe(root);
  });
});

describe("replaceNode", () => {
  test("applies transform to a deep node", () => {
    const root = split("s1", [leaf("a"), leaf("b")]);
    const next = replaceNode(root, "b", (n) => ({ ...(n as LeafNode), activePanelId: "z" }));
    expect((next as SplitNode).children[1]).toEqual({
      ...leaf("b"),
      activePanelId: "z",
    });
  });

  test("returns the tree unchanged when id is missing", () => {
    const root = split("s1", [leaf("a"), leaf("b")]);
    expect(replaceNode(root, "ghost", (n) => n)).toBe(root);
  });
});

describe("dfsLeaves", () => {
  test("returns the single leaf when root is one", () => {
    const root = leaf("a");
    expect(dfsLeaves(root)).toEqual([root]);
  });

  test("returns leaves in left-to-right DFS order", () => {
    const root = split("s1", [split("s2", [leaf("a"), leaf("b")]), leaf("c")]);
    expect(dfsLeaves(root).map((l) => l.id)).toEqual(["a", "b", "c"]);
  });

  test("returns empty array for null root", () => {
    expect(dfsLeaves(null)).toEqual([]);
  });
});
