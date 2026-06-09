import type { ComplexityClass } from "../../data/complexity";
import type { TFunction } from "../../i18n";

export type BSFrame = {
  lo: number;
  hi: number;
  mid: number | null;
  found: number | null;
  eliminated: number[];
  codeLine: number;
  message: string;
};

export type BSRun = {
  name: string;
  time: ComplexityClass;
  space: ComplexityClass;
  code: string[];
  frames: BSFrame[];
  values: number[];
  target: number;
  resultIndex: number;
};

export const randomSorted = (n: number): number[] => {
  const out: number[] = [];
  let cur = Math.floor(Math.random() * 8) + 2;
  for (let i = 0; i < n; i++) {
    out.push(cur);
    cur += Math.floor(Math.random() * 7) + 2;
  }
  return out;
};

export function binarySearch(t: TFunction, values: number[], target: number): BSRun {
  const code = [
    "lo = 0; hi = n - 1",
    "while (lo <= hi):",
    "  mid = (lo + hi) / 2",
    "  if (a[mid] == target) return mid",
    "  else if (a[mid] < target) lo = mid + 1",
    "  else hi = mid - 1",
    "return -1",
  ];
  const frames: BSFrame[] = [];
  const eliminated: number[] = [];
  let lo = 0;
  let hi = values.length - 1;
  let result = -1;

  frames.push({
    lo,
    hi,
    mid: null,
    found: null,
    eliminated: [...eliminated],
    codeLine: 0,
    message: t(
      `نبحث عن ${target} في مصفوفة مرتّبة من ${values.length} عنصراً. lo=0 و hi=${hi}.`,
      `Search for ${target} in a sorted array of ${values.length} elements. lo=0 and hi=${hi}.`,
    ),
  });

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    frames.push({
      lo,
      hi,
      mid,
      found: null,
      eliminated: [...eliminated],
      codeLine: 2,
      message: t(
        `نحسب المنتصف: mid = (${lo} + ${hi}) / 2 = ${mid}.`,
        `Compute the middle: mid = (${lo} + ${hi}) / 2 = ${mid}.`,
      ),
    });
    frames.push({
      lo,
      hi,
      mid,
      found: null,
      eliminated: [...eliminated],
      codeLine: 3,
      message: t(`نقارن: هل a[${mid}] = ${values[mid]} يساوي ${target}؟`, `Compare: is a[${mid}] = ${values[mid]} equal to ${target}?`),
    });

    if (values[mid] === target) {
      result = mid;
      frames.push({
        lo,
        hi,
        mid,
        found: mid,
        eliminated: [...eliminated],
        codeLine: 3,
        message: t(`تطابق! وُجدت ${target} عند الموضع ${mid}.`, `Match! Found ${target} at index ${mid}.`),
      });
      break;
    } else if (values[mid] < target) {
      for (let k = lo; k <= mid; k++) eliminated.push(k);
      lo = mid + 1;
      frames.push({
        lo,
        hi,
        mid,
        found: null,
        eliminated: [...eliminated],
        codeLine: 4,
        message: t(
          `${values[mid]} < ${target} ← المطلوب في النصف الأيمن. نستبعد اليسار، lo = ${lo}.`,
          `${values[mid]} < ${target} ← the target is in the right half. Discard the left, lo = ${lo}.`,
        ),
      });
    } else {
      for (let k = mid; k <= hi; k++) eliminated.push(k);
      hi = mid - 1;
      frames.push({
        lo,
        hi,
        mid,
        found: null,
        eliminated: [...eliminated],
        codeLine: 5,
        message: t(
          `${values[mid]} > ${target} ← المطلوب في النصف الأيسر. نستبعد اليمين، hi = ${hi}.`,
          `${values[mid]} > ${target} ← the target is in the left half. Discard the right, hi = ${hi}.`,
        ),
      });
    }
  }

  if (result === -1) {
    frames.push({
      lo,
      hi,
      mid: null,
      found: null,
      eliminated: [...eliminated],
      codeLine: 6,
      message: t(`أصبح lo > hi والمجال فارغ — القيمة ${target} غير موجودة.`, `lo > hi and the range is empty — value ${target} is not present.`),
    });
  }

  return {
    name: t("البحث الثنائي", "Binary Search"),
    time: "O(log n)",
    space: "O(1)",
    code,
    frames,
    values: [...values],
    target,
    resultIndex: result,
  };
}
