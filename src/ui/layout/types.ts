/** Internal node: two children laid out along one axis with a splitter between. */
export interface SplitNode {
  readonly kind: "split";
  readonly id: string;
  /** `row` = children sit side-by-side; the splitter between them is vertical. */
  readonly orientation: "row" | "column";
  readonly children: readonly [LayoutNode, LayoutNode];
  /** Weights summing to ~1; rendered as `flex: ${w} 1 0`. */
  readonly sizes: readonly [number, number];
}

/** Terminal node: a single cell hosting an ordered list of panel tabs. */
export interface LeafNode {
  readonly kind: "leaf";
  readonly id: string;
  readonly panelIds: readonly string[];
  readonly activePanelId: string | null;
}

export type LayoutNode = SplitNode | LeafNode;

export interface LayoutState {
  /** `null` only when every panel is closed; the renderer shows an empty-state placeholder. */
  readonly root: LayoutNode | null;
  /** Panel id -> the leaf id it lived in the last time it was closed. */
  readonly homeMemory: ReadonlyMap<string, string>;
}

/** Wire format for persistent storage. Maps become plain objects. */
export interface LayoutSnapshot {
  readonly version: 1;
  readonly root: SerializedNode | null;
  readonly homeMemory: Record<string, string>;
}

export type SerializedNode = SerializedSplit | SerializedLeaf;

export interface SerializedSplit {
  readonly kind: "split";
  readonly id: string;
  readonly orientation: "row" | "column";
  readonly sizes: readonly [number, number];
  readonly children: readonly [SerializedNode, SerializedNode];
}

export interface SerializedLeaf {
  readonly kind: "leaf";
  readonly id: string;
  readonly panelIds: readonly string[];
  readonly activePanelId: string | null;
}
