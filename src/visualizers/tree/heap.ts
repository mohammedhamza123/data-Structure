import { buildRun, node, type ArrayCell, type RawFrame, type TNode, type TreeRun } from "./engine";
import type { TFunction } from "../../i18n";

export type HeapItem = { id: string; value: number };

let hc = 0;
export const makeHeapItems = (values: number[]): HeapItem[] =>
  values.map((value) => ({ id: `h${hc++}`, value }));

export const randomHeap = (n: number): number[] =>
  Array.from({ length: n }, () => Math.floor(Math.random() * 92) + 8);

function arrToTree(items: HeapItem[], size: number): TNode | null {
  if (size === 0) return null;
  const nodes: TNode[] = items.slice(0, size).map((it) => {
    const n = node(it.value);
    n.id = it.id;
    return n;
  });
  for (let i = 0; i < size; i++) {
    const l = 2 * i + 1;
    const rr = 2 * i + 2;
    nodes[i].left = l < size ? nodes[l] : null;
    nodes[i].right = rr < size ? nodes[rr] : null;
  }
  return nodes[0];
}

function buildArray(items: HeapItem[], opts: { size: number; active?: number[]; swap?: number[] }): ArrayCell[] {
  const { size, active = [], swap = [] } = opts;
  return items.map((it, i) => ({
    id: it.id,
    value: it.value,
    sorted: i >= size,
    active: active.includes(i),
    swap: swap.includes(i),
    heap: i < size,
  }));
}

class HRec {
  items: HeapItem[];
  frames: RawFrame[] = [];
  constructor(items: HeapItem[]) {
    this.items = items.map((i) => ({ ...i }));
  }
  snap(o: { size: number; activeIdx?: number[]; swapIdx?: number[]; sortedIds?: string[]; codeLine: number; message: string }) {
    const ids = o.swapIdx?.map((i) => this.items[i].id) ?? [];
    const activeIds = o.activeIdx?.map((i) => this.items[i].id) ?? [];
    this.frames.push({
      root: arrToTree(this.items, o.size),
      active: activeIds,
      swap: ids,
      sorted: o.sortedIds ?? [],
      array: buildArray(this.items, { size: o.size, active: o.activeIdx, swap: o.swapIdx }),
      codeLine: o.codeLine,
      message: o.message,
    });
  }
  swap(a: number, b: number) {
    const t = this.items[a];
    this.items[a] = this.items[b];
    this.items[b] = t;
  }
}

function siftDown(t: TFunction, r: HRec, i: number, size: number, cmpLine: number, actLine: number) {
  while (true) {
    let largest = i;
    const l = 2 * i + 1;
    const rr = 2 * i + 2;
    if (l < size) {
      r.snap({ size, activeIdx: [i, l], codeLine: cmpLine, message: t(`نقارن الأب ${r.items[i].value} بابنه الأيسر ${r.items[l].value}.`, `Compare parent ${r.items[i].value} with its left child ${r.items[l].value}.`) });
      if (r.items[l].value > r.items[largest].value) largest = l;
    }
    if (rr < size) {
      r.snap({ size, activeIdx: [largest, rr], codeLine: cmpLine, message: t(`نقارن ${r.items[largest].value} بالابن الأيمن ${r.items[rr].value}.`, `Compare ${r.items[largest].value} with the right child ${r.items[rr].value}.`) });
      if (r.items[rr].value > r.items[largest].value) largest = rr;
    }
    if (largest === i) {
      r.snap({ size, activeIdx: [i], codeLine: actLine, message: t(`الأب ${r.items[i].value} أكبر من ابنيه ← خاصية الكومة محقّقة هنا.`, `Parent ${r.items[i].value} is larger than both children ← the heap property holds here.`) });
      return;
    }
    r.snap({ size, swapIdx: [i, largest], codeLine: actLine, message: t(`الابن ${r.items[largest].value} أكبر ← نبدّله مع الأب ${r.items[i].value}.`, `Child ${r.items[largest].value} is larger ← swap it with the parent ${r.items[i].value}.`) });
    r.swap(i, largest);
    r.snap({ size, swapIdx: [i, largest], codeLine: actLine, message: t("تمّ التبديل، نتابع النزول (sift down).", "Swapped, continue sifting down.") });
    i = largest;
  }
}

export function heapify(t: TFunction, items: HeapItem[]): { run: TreeRun; root: null } {
  const code = [
    "buildMaxHeap(a):",
    "  for i = n/2 - 1 downto 0:",
    "    siftDown(i)        // compare with children",
    "    swap if a child is larger",
  ];
  const r = new HRec(items);
  const n = r.items.length;
  r.snap({ size: n, codeLine: 0, message: t("بناء كومة قصوى (Max-Heap): نبدأ من آخر عقدة أب.", "Build a Max-Heap: start from the last parent node.") });
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    r.snap({ size: n, activeIdx: [i], codeLine: 1, message: t(`نطبّق siftDown على العقدة عند الفهرس ${i} (القيمة ${r.items[i].value}).`, `Apply siftDown to the node at index ${i} (value ${r.items[i].value}).`) });
    siftDown(t, r, i, n, 2, 3);
  }
  r.snap({ size: n, sortedIds: [], codeLine: 0, message: t("اكتمل بناء الكومة القصوى: كل أب ≥ أبنائه، والجذر هو الأكبر.", "Max-Heap built: every parent ≥ its children, and the root is the largest.") });
  return { run: buildRun({ name: t("بناء الكومة (Heapify)", "Build Heap (Heapify)"), time: "O(n)", space: "O(1)", code }, r.frames), root: null };
}

export function heapSort(t: TFunction, items: HeapItem[]): { run: TreeRun; root: null } {
  const code = [
    "buildMaxHeap(a)",
    "for end = n-1 downto 1:",
    "  swap(a[0], a[end])   // largest element to its end",
    "  heapSize--",
    "  siftDown(0)          // fix the root",
  ];
  const r = new HRec(items);
  const n = r.items.length;
  r.snap({ size: n, codeLine: 0, message: t("الترتيب بالكومة: أولاً نبني كومة قصوى.", "Heap sort: first build a max-heap.") });
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    siftDown(t, r, i, n, 4, 4);
  }
  r.snap({ size: n, codeLine: 0, message: t("اكتملت الكومة القصوى. الآن نستخرج الجذر (الأكبر) تكراراً.", "Max-heap is ready. Now extract the root (the largest) repeatedly.") });

  for (let end = n - 1; end > 0; end--) {
    r.snap({ size: end + 1, swapIdx: [0, end], codeLine: 2, message: t(`الجذر ${r.items[0].value} هو الأكبر ← نبدّله مع آخر عنصر في الكومة.`, `The root ${r.items[0].value} is the largest ← swap it with the last element in the heap.`) });
    r.swap(0, end);
    r.snap({ size: end, codeLine: 3, message: t(`العنصر ${r.items[end].value} استقر في موضعه النهائي. نُقلّص حجم الكومة.`, `Element ${r.items[end].value} settled into its final position. Shrink the heap size.`) });
    siftDown(t, r, 0, end, 4, 4);
  }
  r.snap({ size: 0, codeLine: 1, message: t("اكتمل الترتيب! المصفوفة مرتّبة تصاعدياً.", "Sorting complete! The array is sorted in ascending order.") });
  return { run: buildRun({ name: t("الترتيب بالكومة (Heap Sort)", "Heap Sort"), time: "O(n log n)", space: "O(1)", code }, r.frames), root: null };
}
