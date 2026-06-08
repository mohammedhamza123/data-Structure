import type { ComplexityClass } from "../../data/complexity";
import type { TFunction } from "../../i18n";

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

export function bubbleSort(t: TFunction, items: SortItem[]): SortRun {
  const r = new Recorder(items);
  const n = r.items.length;
  const code = [
    "for (i = 0; i < n - 1; i++)",
    "  for (j = 0; j < n - i - 1; j++)",
    "    if (a[j] > a[j + 1])",
    "      swap(a[j], a[j + 1])",
  ];
  r.snap({ codeLine: 0, message: t("نبدأ ترتيب الفقاعات: نقارن كل عنصرين متجاورين.", "Start bubble sort: compare each pair of adjacent elements.") });
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      r.snap({ comparing: [j, j + 1], codeLine: 2, message: t(`مقارنة ${r.items[j].value} و ${r.items[j + 1].value}.`, `Compare ${r.items[j].value} and ${r.items[j + 1].value}.`) });
      if (r.items[j].value > r.items[j + 1].value) {
        r.snap({ swapping: [j, j + 1], codeLine: 3, message: t(`${r.items[j].value} > ${r.items[j + 1].value} ← نبدّلهما.`, `${r.items[j].value} > ${r.items[j + 1].value} ← swap them.`) });
        r.swap(j, j + 1);
        r.snap({ swapping: [j, j + 1], codeLine: 3, message: t("تمّ التبديل.", "Swapped.") });
      }
    }
    r.sorted.add(n - 1 - i);
    r.snap({ codeLine: 1, message: t(`أكبر عنصر متبقٍّ استقر في موضعه الصحيح.`, `The largest remaining element settled into its correct position.`) });
  }
  r.markAllSorted();
  r.snap({ codeLine: 0, message: t("اكتمل الترتيب! المصفوفة مرتّبة تصاعدياً.", "Sorting complete! The array is sorted in ascending order.") });
  return { name: t("ترتيب الفقاعات", "Bubble Sort"), best: "O(n)", average: "O(n²)", worst: "O(n²)", space: "O(1)", stable: true, code, frames: r.frames };
}

export function selectionSort(t: TFunction, items: SortItem[]): SortRun {
  const r = new Recorder(items);
  const n = r.items.length;
  const code = [
    "for (i = 0; i < n - 1; i++)",
    "  min = i",
    "  for (j = i + 1; j < n; j++)",
    "    if (a[j] < a[min]) min = j",
    "  swap(a[i], a[min])",
  ];
  r.snap({ codeLine: 0, message: t("ترتيب الاختيار: نبحث عن الأصغر ونضعه في المقدمة.", "Selection sort: find the smallest element and place it at the front.") });
  for (let i = 0; i < n - 1; i++) {
    let min = i;
    r.snap({ comparing: [min], pivot: i, codeLine: 1, message: t(`نفترض أن الأصغر عند الموضع ${i}.`, `Assume the smallest is at index ${i}.`) });
    for (let j = i + 1; j < n; j++) {
      r.snap({ comparing: [min, j], pivot: i, codeLine: 3, message: t(`هل ${r.items[j].value} < ${r.items[min].value}؟`, `Is ${r.items[j].value} < ${r.items[min].value}?`) });
      if (r.items[j].value < r.items[min].value) {
        min = j;
        r.snap({ comparing: [min], pivot: i, codeLine: 3, message: t(`أصغر جديد: ${r.items[min].value}.`, `New smallest: ${r.items[min].value}.`) });
      }
    }
    if (min !== i) {
      r.snap({ swapping: [i, min], codeLine: 4, message: t(`نبدّل العنصر ${r.items[i].value} مع الأصغر ${r.items[min].value}.`, `Swap element ${r.items[i].value} with the smallest ${r.items[min].value}.`) });
      r.swap(i, min);
    }
    r.sorted.add(i);
    r.snap({ codeLine: 4, message: t(`الموضع ${i} أصبح في مكانه الصحيح.`, `Index ${i} is now in its correct place.`) });
  }
  r.markAllSorted();
  r.snap({ codeLine: 0, message: t("اكتمل الترتيب!", "Sorting complete!") });
  return { name: t("ترتيب الاختيار", "Selection Sort"), best: "O(n²)", average: "O(n²)", worst: "O(n²)", space: "O(1)", stable: false, code, frames: r.frames };
}

export function insertionSort(t: TFunction, items: SortItem[]): SortRun {
  const r = new Recorder(items);
  const n = r.items.length;
  const code = [
    "for (i = 1; i < n; i++)",
    "  j = i",
    "  while (j > 0 && a[j - 1] > a[j])",
    "    swap(a[j - 1], a[j]); j--",
  ];
  r.sorted.add(0);
  r.snap({ codeLine: 0, message: t("ترتيب الإدراج: نبني جزءاً مرتّباً عنصراً عنصراً.", "Insertion sort: build a sorted portion one element at a time.") });
  for (let i = 1; i < n; i++) {
    let j = i;
    r.snap({ comparing: [i], codeLine: 1, message: t(`نُدرج العنصر ${r.items[i].value} في الجزء المرتّب.`, `Insert element ${r.items[i].value} into the sorted portion.`) });
    while (j > 0 && r.items[j - 1].value > r.items[j].value) {
      r.snap({ comparing: [j - 1, j], codeLine: 2, message: t(`${r.items[j - 1].value} > ${r.items[j].value} ← نزيحه لليمين.`, `${r.items[j - 1].value} > ${r.items[j].value} ← shift it right.`) });
      r.swap(j - 1, j);
      r.snap({ swapping: [j - 1, j], codeLine: 3, message: t("إزاحة.", "Shift.") });
      j--;
    }
    r.sorted.add(i);
    for (let k = 0; k <= i; k++) r.sorted.add(k);
    r.snap({ codeLine: 0, message: t(`العنصر استقر في موضعه ضمن الجزء المرتّب.`, `The element settled into its place within the sorted portion.`) });
  }
  r.markAllSorted();
  r.snap({ codeLine: 0, message: t("اكتمل الترتيب!", "Sorting complete!") });
  return { name: t("ترتيب الإدراج", "Insertion Sort"), best: "O(n)", average: "O(n²)", worst: "O(n²)", space: "O(1)", stable: true, code, frames: r.frames };
}

export function quickSort(t: TFunction, items: SortItem[]): SortRun {
  const r = new Recorder(items);
  const code = [
    "quickSort(lo, hi):",
    "  pivot = a[hi]; i = lo - 1",
    "  for (j = lo; j < hi; j++)",
    "    if (a[j] < pivot) { i++; swap(a[i], a[j]) }",
    "  swap(a[i + 1], a[hi])",
    "  recurse(lo, i), recurse(i + 2, hi)",
  ];
  r.snap({ codeLine: 0, message: t("الترتيب السريع: نختار محوراً ونقسّم حوله.", "Quick sort: choose a pivot and partition around it.") });

  const qs = (lo: number, hi: number) => {
    if (lo > hi) return;
    if (lo === hi) {
      r.sorted.add(lo);
      r.snap({ codeLine: 0, message: t(`العنصر المفرد عند ${lo} في مكانه.`, `The single element at ${lo} is in place.`) });
      return;
    }
    const pivotIdx = hi;
    r.snap({ pivot: pivotIdx, codeLine: 1, message: t(`المحور = ${r.items[pivotIdx].value} (آخر عنصر في المجال).`, `Pivot = ${r.items[pivotIdx].value} (last element in the range).`) });
    let i = lo - 1;
    for (let j = lo; j < hi; j++) {
      r.snap({ comparing: [j], pivot: pivotIdx, codeLine: 2, message: t(`هل ${r.items[j].value} < المحور ${r.items[pivotIdx].value}؟`, `Is ${r.items[j].value} < pivot ${r.items[pivotIdx].value}?`) });
      if (r.items[j].value < r.items[pivotIdx].value) {
        i++;
        if (i !== j) {
          r.snap({ swapping: [i, j], pivot: pivotIdx, codeLine: 3, message: t(`نعم ← نبدّل ${r.items[i].value} و ${r.items[j].value}.`, `Yes ← swap ${r.items[i].value} and ${r.items[j].value}.`) });
          r.swap(i, j);
          r.snap({ swapping: [i, j], pivot: pivotIdx, codeLine: 3, message: t("تمّ التبديل.", "Swapped.") });
        }
      }
    }
    r.snap({ swapping: [i + 1, hi], pivot: pivotIdx, codeLine: 4, message: t(`نضع المحور في موضعه النهائي ${i + 1}.`, `Place the pivot in its final position ${i + 1}.`) });
    r.swap(i + 1, hi);
    r.sorted.add(i + 1);
    r.snap({ codeLine: 4, message: t(`المحور ${r.items[i + 1].value} استقر. كل ما يساره أصغر وما يمينه أكبر.`, `The pivot ${r.items[i + 1].value} settled. Everything to its left is smaller and to its right is larger.`) });
    qs(lo, i);
    qs(i + 2, hi);
  };

  qs(0, r.items.length - 1);
  r.markAllSorted();
  r.snap({ codeLine: 0, message: t("اكتمل الترتيب!", "Sorting complete!") });
  return { name: t("الترتيب السريع", "Quick Sort"), best: "O(n log n)", average: "O(n log n)", worst: "O(n²)", space: "O(log n)", stable: false, code, frames: r.frames };
}

export function mergeSort(t: TFunction, items: SortItem[]): SortRun {
  const r = new Recorder(items);
  const code = [
    "mergeSort(lo, hi):",
    "  mid = (lo + hi) / 2",
    "  mergeSort(lo, mid); mergeSort(mid + 1, hi)",
    "  merge: compare fronts of both halves",
    "  write smaller value back into place",
  ];
  r.snap({ codeLine: 0, message: t("ترتيب الدمج: نقسّم المصفوفة ثم ندمج الأجزاء مرتّبة.", "Merge sort: split the array, then merge the parts in sorted order.") });

  const merge = (lo: number, mid: number, hi: number) => {
    const left = r.items.slice(lo, mid + 1);
    const right = r.items.slice(mid + 1, hi + 1);
    const merged: SortItem[] = [];
    let i = 0;
    let j = 0;
    while (i < left.length && j < right.length) {
      r.snap({ comparing: [lo + i, mid + 1 + j], codeLine: 3, message: t(`ندمج: نقارن ${left[i].value} و ${right[j].value}.`, `Merging: compare ${left[i].value} and ${right[j].value}.`) });
      if (left[i].value <= right[j].value) merged.push(left[i++]);
      else merged.push(right[j++]);
    }
    while (i < left.length) merged.push(left[i++]);
    while (j < right.length) merged.push(right[j++]);
    for (let k = 0; k < merged.length; k++) r.items[lo + k] = merged[k];
    const range = Array.from({ length: hi - lo + 1 }, (_, k) => lo + k);
    r.snap({ swapping: range, codeLine: 4, message: t(`دُمج المجال [${lo}..${hi}] بترتيب صحيح.`, `Merged the range [${lo}..${hi}] in correct order.`) });
  };

  const ms = (lo: number, hi: number) => {
    if (lo >= hi) return;
    const mid = Math.floor((lo + hi) / 2);
    r.snap({ comparing: Array.from({ length: hi - lo + 1 }, (_, k) => lo + k), codeLine: 1, message: t(`نقسّم المجال [${lo}..${hi}] عند ${mid}.`, `Split the range [${lo}..${hi}] at ${mid}.`) });
    ms(lo, mid);
    ms(mid + 1, hi);
    merge(lo, mid, hi);
  };

  ms(0, r.items.length - 1);
  r.markAllSorted();
  r.snap({ codeLine: 0, message: t("اكتمل الترتيب!", "Sorting complete!") });
  return { name: t("ترتيب الدمج", "Merge Sort"), best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)", space: "O(n)", stable: true, code, frames: r.frames };
}

export function getSortAlgorithms(
  t: TFunction
): Record<SortKey, { label: string; run: (items: SortItem[]) => SortRun }> {
  return {
    bubble: { label: t("الفقاعات", "Bubble"), run: (items) => bubbleSort(t, items) },
    selection: { label: t("الاختيار", "Selection"), run: (items) => selectionSort(t, items) },
    insertion: { label: t("الإدراج", "Insertion"), run: (items) => insertionSort(t, items) },
    quick: { label: t("السريع", "Quick"), run: (items) => quickSort(t, items) },
    merge: { label: t("الدمج", "Merge"), run: (items) => mergeSort(t, items) },
  };
}
