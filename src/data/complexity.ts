export type ComplexityClass =
  | "O(1)"
  | "O(log n)"
  | "O(n)"
  | "O(n log n)"
  | "O(n²)"
  | "O(2ⁿ)"
  | "O(n!)";

type ComplexityMeta = {
  label: ComplexityClass;
  name: string;
  color: string;
  bg: string;
  rank: number;
  fn: (n: number) => number;
};

export const complexityMeta: Record<ComplexityClass, ComplexityMeta> = {
  "O(1)": { label: "O(1)", name: "ثابت", color: "#34d399", bg: "rgba(52,211,153,0.14)", rank: 1, fn: () => 1 },
  "O(log n)": { label: "O(log n)", name: "لوغاريتمي", color: "#22d3ee", bg: "rgba(34,211,238,0.14)", rank: 2, fn: (n) => Math.log2(Math.max(1, n)) },
  "O(n)": { label: "O(n)", name: "خطي", color: "#818cf8", bg: "rgba(129,140,248,0.14)", rank: 3, fn: (n) => n },
  "O(n log n)": { label: "O(n log n)", name: "خطي-لوغاريتمي", color: "#a78bfa", bg: "rgba(167,139,250,0.14)", rank: 4, fn: (n) => n * Math.log2(Math.max(1, n)) },
  "O(n²)": { label: "O(n²)", name: "تربيعي", color: "#fbbf24", bg: "rgba(251,191,36,0.14)", rank: 5, fn: (n) => n * n },
  "O(2ⁿ)": { label: "O(2ⁿ)", name: "أُسّي", color: "#f87171", bg: "rgba(248,113,113,0.14)", rank: 6, fn: (n) => Math.pow(2, n) },
  "O(n!)": { label: "O(n!)", name: "عاملي", color: "#ec4899", bg: "rgba(236,72,153,0.14)", rank: 7, fn: (n) => { let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; } },
};
