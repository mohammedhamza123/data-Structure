import type { ComplexityClass } from "../../data/complexity";

export type TNode = {
  id: string;
  value: number;
  left: TNode | null;
  right: TNode | null;
};

export type ViewNode = { id: string; value: number; cx: number; cy: number };
export type ViewEdge = { id: string; to: string; x1: number; y1: number; x2: number; y2: number };

export type ArrayCell = { id: string; value: number; sorted: boolean; active: boolean; swap: boolean; heap: boolean };

export type TreeFrame = {
  nodes: ViewNode[];
  edges: ViewEdge[];
  active: string[];
  compare: string[];
  found: string[];
  swap: string[];
  sorted: string[];
  array?: ArrayCell[];
  visit: number[];
  codeLine: number;
  message: string;
};

export type TreeRun = {
  name: string;
  time: ComplexityClass;
  space: ComplexityClass;
  code: string[];
  frames: TreeFrame[];
  width: number;
  height: number;
  showVisit: boolean;
};

let counter = 0;
export const newId = () => `t${counter++}`;
export const node = (value: number): TNode => ({ id: newId(), value, left: null, right: null });

export function cloneTree(root: TNode | null): TNode | null {
  if (!root) return null;
  return { id: root.id, value: root.value, left: cloneTree(root.left), right: cloneTree(root.right) };
}

export const GAP_X = 60;
export const GAP_Y = 80;
export const PAD = 36;
export const NODE_R = 22;

type Pos = { x: number; depth: number };

function layout(root: TNode | null): { pos: Map<string, Pos>; count: number; maxDepth: number } {
  const pos = new Map<string, Pos>();
  let idx = 0;
  let maxDepth = 0;
  const rec = (n: TNode | null, depth: number) => {
    if (!n) return;
    rec(n.left, depth + 1);
    pos.set(n.id, { x: idx++, depth });
    maxDepth = Math.max(maxDepth, depth);
    rec(n.right, depth + 1);
  };
  rec(root, 0);
  return { pos, count: idx, maxDepth };
}

export function buildView(root: TNode | null): { nodes: ViewNode[]; edges: ViewEdge[]; count: number; maxDepth: number } {
  const { pos, count, maxDepth } = layout(root);
  const nodes: ViewNode[] = [];
  const edges: ViewEdge[] = [];
  const cx = (p: Pos) => PAD + p.x * GAP_X + NODE_R;
  const cy = (p: Pos) => PAD + p.depth * GAP_Y + NODE_R;
  const rec = (n: TNode | null) => {
    if (!n) return;
    const p = pos.get(n.id)!;
    nodes.push({ id: n.id, value: n.value, cx: cx(p), cy: cy(p) });
    for (const child of [n.left, n.right]) {
      if (child) {
        const cp = pos.get(child.id)!;
        edges.push({ id: `${n.id}-${child.id}`, to: child.id, x1: cx(p), y1: cy(p), x2: cx(cp), y2: cy(cp) });
      }
    }
    rec(n.left);
    rec(n.right);
  };
  rec(root);
  return { nodes, edges, count, maxDepth };
}

export type RawFrame = {
  root: TNode | null;
  active?: string[];
  compare?: string[];
  found?: string[];
  swap?: string[];
  sorted?: string[];
  array?: ArrayCell[];
  visit?: number[];
  codeLine: number;
  message: string;
};

export function buildRun(
  meta: { name: string; time: ComplexityClass; space: ComplexityClass; code: string[]; showVisit?: boolean },
  raws: RawFrame[]
): TreeRun {
  let maxCount = 1;
  let maxDepth = 0;
  const views = raws.map((rf) => {
    const v = buildView(rf.root);
    maxCount = Math.max(maxCount, v.count);
    maxDepth = Math.max(maxDepth, v.maxDepth);
    return v;
  });
  const width = PAD * 2 + Math.max(0, maxCount - 1) * GAP_X + NODE_R * 2;
  const height = PAD * 2 + maxDepth * GAP_Y + NODE_R * 2;
  const frames: TreeFrame[] = raws.map((rf, i) => ({
    nodes: views[i].nodes,
    edges: views[i].edges,
    active: rf.active ?? [],
    compare: rf.compare ?? [],
    found: rf.found ?? [],
    swap: rf.swap ?? [],
    sorted: rf.sorted ?? [],
    array: rf.array,
    visit: rf.visit ?? [],
    codeLine: rf.codeLine,
    message: rf.message,
  }));
  return {
    name: meta.name,
    time: meta.time,
    space: meta.space,
    code: meta.code,
    showVisit: meta.showVisit ?? false,
    frames,
    width,
    height,
  };
}
