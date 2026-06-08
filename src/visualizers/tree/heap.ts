import { buildRun, node, type ArrayCell, type RawFrame, type TNode, type TreeRun } from "./engine";

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

function siftDown(r: HRec, i: number, size: number, cmpLine: number, actLine: number) {
  while (true) {
    let largest = i;
    const l = 2 * i + 1;
    const rr = 2 * i + 2;
    if (l < size) {
      r.snap({ size, activeIdx: [i, l], codeLine: cmpLine, message: `نقارن الأب ${r.items[i].value} بابنه الأيسر ${r.items[l].value}.` });
      if (r.items[l].value > r.items[largest].value) largest = l;
    }
    if (rr < size) {
      r.snap({ size, activeIdx: [largest, rr], codeLine: cmpLine, message: `نقارن ${r.items[largest].value} بالابن الأيمن ${r.items[rr].value}.` });
      if (r.items[rr].value > r.items[largest].value) largest = rr;
    }
    if (largest === i) {
      r.snap({ size, activeIdx: [i], codeLine: actLine, message: `الأب ${r.items[i].value} أكبر من ابنيه ← خاصية الكومة محقّقة هنا.` });
      return;
    }
    r.snap({ size, swapIdx: [i, largest], codeLine: actLine, message: `الابن ${r.items[largest].value} أكبر ← نبدّله مع الأب ${r.items[i].value}.` });
    r.swap(i, largest);
    r.snap({ size, swapIdx: [i, largest], codeLine: actLine, message: "تمّ التبديل، نتابع النزول (sift down)." });
    i = largest;
  }
}

export function heapify(items: HeapItem[]): { run: TreeRun; root: null } {
  const code = [
    "buildMaxHeap(a):",
    "  for i = n/2 - 1 downto 0:",
    "    siftDown(i)        // قارن بالأبناء",
    "    swap if a child is larger",
  ];
  const r = new HRec(items);
  const n = r.items.length;
  r.snap({ size: n, codeLine: 0, message: "بناء كومة قصوى (Max-Heap): نبدأ من آخر عقدة أب." });
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    r.snap({ size: n, activeIdx: [i], codeLine: 1, message: `نطبّق siftDown على العقدة عند الفهرس ${i} (القيمة ${r.items[i].value}).` });
    siftDown(r, i, n, 2, 3);
  }
  r.snap({ size: n, sortedIds: [], codeLine: 0, message: "اكتمل بناء الكومة القصوى: كل أب ≥ أبنائه، والجذر هو الأكبر." });
  return { run: buildRun({ name: "بناء الكومة (Heapify)", time: "O(n)", space: "O(1)", code }, r.frames), root: null };
}

export function heapSort(items: HeapItem[]): { run: TreeRun; root: null } {
  const code = [
    "buildMaxHeap(a)",
    "for end = n-1 downto 1:",
    "  swap(a[0], a[end])   // أكبر عنصر لنهايته",
    "  heapSize--",
    "  siftDown(0)          // أصلح الجذر",
  ];
  const r = new HRec(items);
  const n = r.items.length;
  r.snap({ size: n, codeLine: 0, message: "الترتيب بالكومة: أولاً نبني كومة قصوى." });
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    siftDown(r, i, n, 4, 4);
  }
  r.snap({ size: n, codeLine: 0, message: "اكتملت الكومة القصوى. الآن نستخرج الجذر (الأكبر) تكراراً." });

  for (let end = n - 1; end > 0; end--) {
    r.snap({ size: end + 1, swapIdx: [0, end], codeLine: 2, message: `الجذر ${r.items[0].value} هو الأكبر ← نبدّله مع آخر عنصر في الكومة.` });
    r.swap(0, end);
    r.snap({ size: end, codeLine: 3, message: `العنصر ${r.items[end].value} استقر في موضعه النهائي. نُقلّص حجم الكومة.` });
    siftDown(r, 0, end, 4, 4);
  }
  r.snap({ size: 0, codeLine: 1, message: "اكتمل الترتيب! المصفوفة مرتّبة تصاعدياً." });
  return { run: buildRun({ name: "الترتيب بالكومة (Heap Sort)", time: "O(n log n)", space: "O(1)", code }, r.frames), root: null };
}
