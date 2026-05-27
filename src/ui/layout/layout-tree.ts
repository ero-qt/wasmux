import type { LayoutNode, LeafNode, SplitNode } from "~/ui/layout/types";

/** DFS lookup of a leaf by id. Returns `null` when not found. */
export function findLeaf(root: LayoutNode | null, leafId: string): LeafNode | null {
  if (root === null) {
    return null;
  }
  if (root.kind === "leaf") {
    return root.id === leafId ? root : null;
  }
  return findLeaf(root.children[0], leafId) ?? findLeaf(root.children[1], leafId);
}

/**
 * Returns the {@link SplitNode} that has the node `nodeId` as a direct child,
 * plus which side (`0` = left/top, `1` = right/bottom). `null` when the node
 * is the root or unknown.
 */
export function findParent(
  root: LayoutNode | null,
  nodeId: string,
): { readonly parent: SplitNode; readonly side: 0 | 1 } | null {
  if (root === null || root.kind === "leaf") {
    return null;
  }
  if (root.children[0].id === nodeId) {
    return { parent: root, side: 0 };
  }
  if (root.children[1].id === nodeId) {
    return { parent: root, side: 1 };
  }
  return findParent(root.children[0], nodeId) ?? findParent(root.children[1], nodeId);
}

/**
 * Removes a leaf from the tree. The surrounding split node dissolves so the
 * removed leaf's sibling takes its place. Returns `null` when the last leaf
 * was removed.
 */
export function removeLeaf(root: LayoutNode | null, leafId: string): LayoutNode | null {
  if (root === null) {
    return null;
  }
  if (root.kind === "leaf") {
    return root.id === leafId ? null : root;
  }
  const [left, right] = root.children;
  if (left.kind === "leaf" && left.id === leafId) {
    return right;
  }
  if (right.kind === "leaf" && right.id === leafId) {
    return left;
  }
  const newLeft = removeLeaf(left, leafId);
  const newRight = removeLeaf(right, leafId);
  if (newLeft === left && newRight === right) {
    return root;
  }
  if (newLeft === null) {
    return newRight;
  }
  if (newRight === null) {
    return newLeft;
  }
  return { ...root, children: [newLeft, newRight] };
}

/**
 * Adds `panelId` as the last tab of leaf `leafId`. No-op when the panel is
 * already in that leaf or when the leaf is missing.
 */
export function insertPanelInLeaf(
  root: LayoutNode | null,
  leafId: string,
  panelId: string,
  makeActive: boolean,
): LayoutNode | null {
  return replaceNode(root, leafId, (n) => {
    if (n.kind !== "leaf") {
      return n;
    }
    if (n.panelIds.includes(panelId)) {
      return n;
    }
    return {
      ...n,
      panelIds: [...n.panelIds, panelId],
      activePanelId: makeActive ? panelId : n.activePanelId,
    };
  });
}

/**
 * Updates a node by id using `transform`. Returns the same tree by reference
 * when the node is missing OR the transform returned the same reference.
 */
export function replaceNode(
  root: LayoutNode | null,
  nodeId: string,
  transform: (n: LayoutNode) => LayoutNode,
): LayoutNode | null {
  if (root === null) {
    return null;
  }
  if (root.id === nodeId) {
    return transform(root);
  }
  if (root.kind === "leaf") {
    return root;
  }
  const newLeft = replaceNode(root.children[0], nodeId, transform);
  const newRight = replaceNode(root.children[1], nodeId, transform);
  if (newLeft === root.children[0] && newRight === root.children[1]) {
    return root;
  }
  // both children stay non-null because we never delete via this helper
  return { ...root, children: [newLeft as LayoutNode, newRight as LayoutNode] };
}

/** Every leaf reachable from `root`, in left-first DFS order. */
export function dfsLeaves(root: LayoutNode | null): readonly LeafNode[] {
  if (root === null) {
    return [];
  }
  if (root.kind === "leaf") {
    return [root];
  }
  return [...dfsLeaves(root.children[0]), ...dfsLeaves(root.children[1])];
}
