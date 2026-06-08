import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { PageHeader } from "../components/PageHeader";
import { complexityMeta, type ComplexityClass } from "../data/complexity";
import { useLang } from "../i18n";

const order: ComplexityClass[] = ["O(1)", "O(log n)", "O(n)", "O(n log n)", "O(n²)", "O(2ⁿ)", "O(n!)"];

export function ComplexityPage() {
  const { t } = useLang();
  const examples: Record<ComplexityClass, string> = {
    "O(1)": t("الوصول لعنصر في مصفوفة بالفهرس، أو إضافة عقدة في بداية قائمة مرتبطة.", "Accessing an array element by index, or inserting a node at the head of a linked list."),
    "O(log n)": t("البحث الثنائي، أو البحث في شجرة BST متوازنة.", "Binary search, or searching in a balanced BST."),
    "O(n)": t("المرور على كل عناصر القائمة مرة واحدة (بحث خطي).", "Traversing all list elements once (linear search)."),
    "O(n log n)": t("خوارزميات الترتيب الفعّالة مثل Merge Sort و Quick Sort.", "Efficient sorting algorithms like Merge Sort and Quick Sort."),
    "O(n²)": t("الترتيب بالفقاعات Bubble Sort والحلقات المتداخلة.", "Bubble Sort and nested loops."),
    "O(2ⁿ)": t("حساب فيبوناتشي بالاستدعاء الذاتي دون تخزين.", "Computing Fibonacci recursively without memoization."),
    "O(n!)": t("توليد كل التباديل الممكنة (مشكلة البائع المتجول).", "Generating all possible permutations (the traveling salesman problem)."),
  };
  const names: Record<ComplexityClass, string> = {
    "O(1)": t("ثابت", "Constant"),
    "O(log n)": t("لوغاريتمي", "Logarithmic"),
    "O(n)": t("خطي", "Linear"),
    "O(n log n)": t("خطي-لوغاريتمي", "Linearithmic"),
    "O(n²)": t("تربيعي", "Quadratic"),
    "O(2ⁿ)": t("أُسّي", "Exponential"),
    "O(n!)": t("عاملي", "Factorial"),
  };

  const [n, setN] = useState(16);
  const [active, setActive] = useState<Record<ComplexityClass, boolean>>({
    "O(1)": true,
    "O(log n)": true,
    "O(n)": true,
    "O(n log n)": true,
    "O(n²)": true,
    "O(2ⁿ)": false,
    "O(n!)": false,
  });

  const data = useMemo(() => {
    const points = [];
    const maxN = 32;
    for (let i = 1; i <= maxN; i++) {
      const row: Record<string, number> = { n: i };
      for (const c of order) {
        if (active[c]) {
          const v = complexityMeta[c].fn(i);
          row[c] = Number.isFinite(v) ? Math.min(v, 1e6) : 1e6;
        }
      }
      points.push(row);
    }
    return points;
  }, [active]);

  return (
    <div>
      <PageHeader
        eyebrow={t("تحليل Big-O", "Big-O analysis")}
        title={t("التعقيد الزمني والمكاني", "Time & Space Complexity")}
        description={t(
          "افهم كيف ينمو وقت تنفيذ الخوارزمية مع حجم المدخلات. قارن بين درجات النمو بصرياً وجرّب أثر تغيير حجم المدخلات n.",
          "Understand how an algorithm's runtime grows with input size. Compare growth rates visually and experiment with the effect of changing the input size n."
        )}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-surface/70 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold text-white">{t("منحنى النمو", "Growth curve")}</h3>
            <span className="font-mono text-xs text-slate-400">{t("حتى n = 32", "up to n = 32")}</span>
          </div>
          <div className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#283153" />
                <XAxis dataKey="n" stroke="#64748b" tick={{ fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} domain={[0, 300]} allowDataOverflow />
                <Tooltip
                  contentStyle={{
                    background: "#151b30",
                    border: "1px solid #283153",
                    borderRadius: 12,
                    fontFamily: "JetBrains Mono",
                    fontSize: 12,
                  }}
                  labelStyle={{ color: "#e2e8f0" }}
                />
                <Legend wrapperStyle={{ fontFamily: "JetBrains Mono", fontSize: 12 }} />
                {order.filter((c) => active[c]).map((c) => (
                  <Line
                    key={c}
                    type="monotone"
                    dataKey={c}
                    stroke={complexityMeta[c].color}
                    strokeWidth={2.5}
                    dot={false}
                    isAnimationActive
                    animationDuration={600}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {order.map((c) => (
              <button
                key={c}
                onClick={() => setActive((p) => ({ ...p, [c]: !p[c] }))}
                className="rounded-lg border px-2.5 py-1 font-mono text-xs font-semibold transition-all"
                style={{
                  color: active[c] ? complexityMeta[c].color : "#64748b",
                  borderColor: active[c] ? `${complexityMeta[c].color}55` : "#283153",
                  backgroundColor: active[c] ? complexityMeta[c].bg : "transparent",
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface/70 p-5">
          <h3 className="mb-4 font-bold text-white">{t("عمليات عند n =", "Operations at n =")} {n}</h3>
          <input
            type="range"
            min={1}
            max={32}
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
            className="mb-5 w-full accent-brand-500"
          />
          <div className="space-y-2.5">
            {order.map((c) => {
              const ops = complexityMeta[c].fn(n);
              const display = ops > 1e7 ? t("هائل جداً", "Huge") : Math.round(ops).toLocaleString("en-US");
              const pct = Math.min(100, (complexityMeta[c].rank / 7) * 100);
              return (
                <div key={c}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-semibold" style={{ color: complexityMeta[c].color }}>
                      {c}
                    </span>
                    <span className="font-mono text-slate-300">{display}</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-2">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: complexityMeta[c].color }}
                      animate={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {order.map((c, i) => (
          <motion.div
            key={c}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="rounded-2xl border border-border bg-surface/70 p-5"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-lg font-bold" style={{ color: complexityMeta[c].color }}>
                {c}
              </span>
              <span
                className="rounded-md px-2 py-0.5 text-xs font-semibold"
                style={{ color: complexityMeta[c].color, backgroundColor: complexityMeta[c].bg }}
              >
                {names[c]}
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">{examples[c]}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
