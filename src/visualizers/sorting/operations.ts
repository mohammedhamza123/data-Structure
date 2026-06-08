import type { ComplexityClass } from "../../data/complexity";

export type SortItem = { id: string; value: number };

export type SortFrame = {
  order: SortItem[];
  comparing: number[];
  swapping: number[];
  sorted: number[];
  pivot: number | null;
  codeLine: number;
  message: string;
};

export type SortRun = {
  name: string;
  best: ComplexityClass;
  average: ComplexityClass;
  worst: ComplexityClass;
  space: ComplexityClass;
  stable: boolean;
  code: string[];
  frames: SortFrame[];
};

export type SortKey = "bubble" | "selection" | "insertion" | "merge" | "quick";

let counter = 0;
export const makeItems = (values: number[]): SortItem[] =>
  values.map((value) => ({ id: `s${counter++}`, value }));

export const randomValues = (n: number): number[] =>
  Array.from({ length: n }, () => Math.floor(Math.random() * 92) + 8);

class Recorder {
  items: SortItem[];
  sorted = new Set<number>();
  frames: SortFrame[] = [];

  constructor(items: SortItem[]) {
    this.items = items.map((i) => ({ ...i }));
  }

  snap(opts: { comparing?: number[]; swapping?: number[]; pivot?: number | null; codeLine: number; message: string }) {
    this.frames.push({
      order: this.items.map((i) => ({ ...i })),
      comparing: opts.comparing ?? [],
      swapping: opts.swapping ?? [],
      sorted: [...this.sorted],
      pivot: opts.pivot ?? null,
      codeLine: opts.codeLine,
      message: opts.message,
    });
  }

  swap(a: number, b: number) {
    const t = this.items[a];
    this.items[a] = this.items[b];
    this.items[b] = t;
  }

  markAllSorted() {
    for (let i = 0; i < this.items.length; i++) this.sorted.add(i);
  }
}

export function bubbleSort(items: SortItem[]): SortRun {
  const r = new Recorder(items);
  const n = r.items.length;
  const code = [
    "for (i = 0; i < n - 1; i++)",
    "  for (j = 0; j < n - i - 1; j++)",
    "    if (a[j] > a[j + 1])",
    "      swap(a[j], a[j + 1])",
  ];
  r.snap({ codeLine: 0, message: "نبدأ ترتيب الفقاعات: نقارن كل عنصرين متجاورين." });
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      r.snap({ comparing: [j, j + 1], codeLine: 2, message: `مقارنة ${r.items[j].value} و ${r.items[j + 1].value}.` });
      if (r.items[j].value > r.items[j + 1].value) {
        r.snap({ swapping: [j, j + 1], codeLine: 3, message: `${r.items[j].value} > ${r.items[j + 1].value} ← نبدّلهما.` });
        r.swap(j, j + 1);
        r.snap({ swapping: [j, j + 1], codeLine: 3, message: "تمّ التبديل." });
      }
    }
    r.sorted.add(n - 1 - i);
    r.snap({ codeLine: 1, message: `أكبر عنصر متبقٍّ استقر في موضعه الصحيح.` });
  }
  r.markAllSorted();
  r.snap({ codeLine: 0, message: "اكتمل الترتيب! المصفوفة مرتّبة تصاعدياً." });
  return { name: "ترتيب الفقاعات", best: "O(n)", average: "O(n²)", worst: "O(n²)", space: "O(1)", stable: true, code, frames: r.frames };
}

export function selectionSort(items: SortItem[]): SortRun {
  const r = new Recorder(items);
  const n = r.items.length;
  const code = [
    "for (i = 0; i < n - 1; i++)",
    "  min = i",
    "  for (j = i + 1; j < n; j++)",
    "    if (a[j] < a[min]) min = j",
    "  swap(a[i], a[min])",
  ];
  r.snap({ codeLine: 0, message: "ترتيب الاختيار: نبحث عن الأصغر ونضعه في المقدمة." });
  for (let i = 0; i < n - 1; i++) {
    let min = i;
    r.snap({ comparing: [min], pivot: i, codeLine: 1, message: `نفترض أن الأصغر عند الموضع ${i}.` });
    for (let j = i + 1; j < n; j++) {
      r.snap({ comparing: [min, j], pivot: i, codeLine: 3, message: `هل ${r.items[j].value} < ${r.items[min].value}؟` });
      if (r.items[j].value < r.items[min].value) {
        min = j;
        r.snap({ comparing: [min], pivot: i, codeLine: 3, message: `أصغر جديد: ${r.items[min].value}.` });
      }
    }
    if (min !== i) {
      r.snap({ swapping: [i, min], codeLine: 4, message: `نبدّل العنصر ${r.items[i].value} مع الأصغر ${r.items[min].value}.` });
      r.swap(i, min);
    }
    r.sorted.add(i);
    r.snap({ codeLine: 4, message: `الموضع ${i} أصبح في مكانه الصحيح.` });
  }
  r.markAllSorted();
  r.snap({ codeLine: 0, message: "اكتمل الترتيب!" });
  return { name: "ترتيب الاختيار", best: "O(n²)", average: "O(n²)", worst: "O(n²)", space: "O(1)", stable: false, code, frames: r.frames };
}

export function insertionSort(items: SortItem[]): SortRun {
  const r = new Recorder(items);
  const n = r.items.length;
  const code = [
    "for (i = 1; i < n; i++)",
    "  j = i",
    "  while (j > 0 && a[j - 1] > a[j])",
    "    swap(a[j - 1], a[j]); j--",
  ];
  r.sorted.add(0);
  r.snap({ codeLine: 0, message: "ترتيب الإدراج: نبني جزءاً مرتّباً عنصراً عنصراً." });
  for (let i = 1; i < n; i++) {
    let j = i;
    r.snap({ comparing: [i], codeLine: 1, message: `نُدرج العنصر ${r.items[i].value} في الجزء المرتّب.` });
    while (j > 0 && r.items[j - 1].value > r.items[j].value) {
      r.snap({ comparing: [j - 1, j], codeLine: 2, message: `${r.items[j - 1].value} > ${r.items[j].value} ← نزيحه لليمين.` });
      r.swap(j - 1, j);
      r.snap({ swapping: [j - 1, j], codeLine: 3, message: "إزاحة." });
      j--;
    }
    r.sorted.add(i);
    for (let k = 0; k <= i; k++) r.sorted.add(k);
    r.snap({ codeLine: 0, message: `العنصر استقر في موضعه ضمن الجزء المرتّب.` });
  }
  r.markAllSorted();
  r.snap({ codeLine: 0, message: "اكتمل الترتيب!" });
  return { name: "ترتيب الإدراج", best: "O(n)", average: "O(n²)", worst: "O(n²)", space: "O(1)", stable: true, code, frames: r.frames };
}

export function quickSort(items: SortItem[]): SortRun {
  const r = new Recorder(items);
  const code = [
    "quickSort(lo, hi):",
    "  pivot = a[hi]; i = lo - 1",
    "  for (j = lo; j < hi; j++)",
    "    if (a[j] < pivot) { i++; swap(a[i], a[j]) }",
    "  swap(a[i + 1], a[hi])",
    "  recurse(lo, i), recurse(i + 2, hi)",
  ];
  r.snap({ codeLine: 0, message: "الترتيب السريع: نختار محوراً ونقسّم حوله." });

  const qs = (lo: number, hi: number) => {
    if (lo > hi) return;
    if (lo === hi) {
      r.sorted.add(lo);
      r.snap({ codeLine: 0, message: `العنصر المفرد عند ${lo} في مكانه.` });
      return;
    }
    const pivotIdx = hi;
    r.snap({ pivot: pivotIdx, codeLine: 1, message: `المحور = ${r.items[pivotIdx].value} (آخر عنصر في المجال).` });
    let i = lo - 1;
    for (let j = lo; j < hi; j++) {
      r.snap({ comparing: [j], pivot: pivotIdx, codeLine: 2, message: `هل ${r.items[j].value} < المحور ${r.items[pivotIdx].value}؟` });
      if (r.items[j].value < r.items[pivotIdx].value) {
        i++;
        if (i !== j) {
          r.snap({ swapping: [i, j], pivot: pivotIdx, codeLine: 3, message: `نعم ← نبدّل ${r.items[i].value} و ${r.items[j].value}.` });
          r.swap(i, j);
          r.snap({ swapping: [i, j], pivot: pivotIdx, codeLine: 3, message: "تمّ التبديل." });
        }
      }
    }
    r.snap({ swapping: [i + 1, hi], pivot: pivotIdx, codeLine: 4, message: `نضع المحور في موضعه النهائي ${i + 1}.` });
    r.swap(i + 1, hi);
    r.sorted.add(i + 1);
    r.snap({ codeLine: 4, message: `المحور ${r.items[i + 1].value} استقر. كل ما يساره أصغر وما يمينه أكبر.` });
    qs(lo, i);
    qs(i + 2, hi);
  };

  qs(0, r.items.length - 1);
  r.markAllSorted();
  r.snap({ codeLine: 0, message: "اكتمل الترتيب!" });
  return { name: "الترتيب السريع", best: "O(n log n)", average: "O(n log n)", worst: "O(n²)", space: "O(log n)", stable: false, code, frames: r.frames };
}

export function mergeSort(items: SortItem[]): SortRun {
  const r = new Recorder(items);
  const code = [
    "mergeSort(lo, hi):",
    "  mid = (lo + hi) / 2",
    "  mergeSort(lo, mid); mergeSort(mid + 1, hi)",
    "  merge: compare fronts of both halves",
    "  write smaller value back into place",
  ];
  r.snap({ codeLine: 0, message: "ترتيب الدمج: نقسّم المصفوفة ثم ندمج الأجزاء مرتّبة." });

  const merge = (lo: number, mid: number, hi: number) => {
    const left = r.items.slice(lo, mid + 1);
    const right = r.items.slice(mid + 1, hi + 1);
    const merged: SortItem[] = [];
    let i = 0;
    let j = 0;
    while (i < left.length && j < right.length) {
      r.snap({ comparing: [lo + i, mid + 1 + j], codeLine: 3, message: `ندمج: نقارن ${left[i].value} و ${right[j].value}.` });
      if (left[i].value <= right[j].value) merged.push(left[i++]);
      else merged.push(right[j++]);
    }
    while (i < left.length) merged.push(left[i++]);
    while (j < right.length) merged.push(right[j++]);
    for (let k = 0; k < merged.length; k++) r.items[lo + k] = merged[k];
    const range = Array.from({ length: hi - lo + 1 }, (_, k) => lo + k);
    r.snap({ swapping: range, codeLine: 4, message: `دُمج المجال [${lo}..${hi}] بترتيب صحيح.` });
  };

  const ms = (lo: number, hi: number) => {
    if (lo >= hi) return;
    const mid = Math.floor((lo + hi) / 2);
    r.snap({ comparing: Array.from({ length: hi - lo + 1 }, (_, k) => lo + k), codeLine: 1, message: `نقسّم المجال [${lo}..${hi}] عند ${mid}.` });
    ms(lo, mid);
    ms(mid + 1, hi);
    merge(lo, mid, hi);
  };

  ms(0, r.items.length - 1);
  r.markAllSorted();
  r.snap({ codeLine: 0, message: "اكتمل الترتيب!" });
  return { name: "ترتيب الدمج", best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)", space: "O(n)", stable: true, code, frames: r.frames };
}

export const sortAlgorithms: Record<SortKey, { label: string; run: (items: SortItem[]) => SortRun }> = {
  bubble: { label: "الفقاعات", run: bubbleSort },
  selection: { label: "الاختيار", run: selectionSort },
  insertion: { label: "الإدراج", run: insertionSort },
  quick: { label: "السريع", run: quickSort },
  merge: { label: "الدمج", run: mergeSort },
};
