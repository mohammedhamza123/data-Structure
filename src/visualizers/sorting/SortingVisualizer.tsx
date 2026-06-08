import { useEffect, useMemo, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { ComplexityBadge } from "../../components/ComplexityBadge";
import {
  makeItems,
  randomValues,
  sortAlgorithms,
  type SortKey,
} from "./operations";

const algoOrder: SortKey[] = ["bubble", "selection", "insertion", "quick", "merge"];

function barColor(i: number, frame: { comparing: number[]; swapping: number[]; sorted: number[]; pivot: number | null }) {
  if (frame.sorted.includes(i)) return { bg: "#34d399", glow: "rgba(52,211,153,0.5)" };
  if (frame.swapping.includes(i)) return { bg: "#ec4899", glow: "rgba(236,72,153,0.55)" };
  if (frame.pivot === i) return { bg: "#a78bfa", glow: "rgba(167,139,250,0.55)" };
  if (frame.comparing.includes(i)) return { bg: "#f59e0b", glow: "rgba(245,158,11,0.55)" };
  return { bg: "#6366f1", glow: "rgba(99,102,241,0.35)" };
}

export function SortingVisualizer() {
  const [algo, setAlgo] = useState<SortKey>("bubble");
  const [values, setValues] = useState<number[]>(() => randomValues(9));
  const [frameIdx, setFrameIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1.5);

  const run = useMemo(() => sortAlgorithms[algo].run(makeItems(values)), [algo, values]);
  const lastFrame = run.frames.length - 1;
  const frame = run.frames[Math.min(frameIdx, lastFrame)];
  const maxVal = useMemo(() => Math.max(...values, 1), [values]);

  useEffect(() => {
    setFrameIdx(0);
    setPlaying(false);
  }, [algo, values]);

  useEffect(() => {
    if (!playing) return;
    if (frameIdx >= lastFrame) {
      setPlaying(false);
      return;
    }
    const t = setTimeout(() => setFrameIdx((i) => i + 1), 700 / speed);
    return () => clearTimeout(t);
  }, [playing, frameIdx, lastFrame, speed]);

  const counters = useMemo(() => {
    let comparisons = 0;
    let swaps = 0;
    for (let k = 1; k <= frameIdx && k <= lastFrame; k++) {
      if (run.frames[k].comparing.length > 0) comparisons++;
      if (run.frames[k].swapping.length > 0) swaps++;
    }
    return { comparisons, swaps };
  }, [run, frameIdx, lastFrame]);

  const togglePlay = () => {
    if (frameIdx >= lastFrame) {
      setFrameIdx(0);
      setPlaying(true);
    } else setPlaying((p) => !p);
  };

  const actionBtn =
    "rounded-xl border border-border bg-surface px-3 py-2 text-sm font-semibold text-slate-200 transition-all hover:border-brand-500/50 hover:bg-surface-2 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 active:scale-95";

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="space-y-6">
        {/* Algorithm tabs */}
        <div className="flex flex-wrap gap-2">
          {algoOrder.map((k) => (
            <button
              key={k}
              onClick={() => setAlgo(k)}
              className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${
                algo === k
                  ? "bg-gradient-to-l from-brand-500 to-accent-500 text-white shadow-lg shadow-brand-600/30"
                  : "border border-border bg-surface text-slate-300 hover:text-white"
              }`}
            >
              {sortAlgorithms[k].label}
            </button>
          ))}
        </div>

        {/* Bars */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-bg-soft/80 p-6">
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
          <div className="relative flex h-72 items-end justify-center gap-2 sm:gap-3">
            {frame.order.map((item, i) => {
              const c = barColor(i, frame);
              return (
                <motion.div
                  key={item.id}
                  layout
                  transition={{ type: "spring", stiffness: 320, damping: 30 }}
                  className="flex flex-1 flex-col items-center justify-end"
                  style={{ maxWidth: 56 }}
                >
                  <motion.span
                    animate={{ color: c.bg }}
                    className="mb-1.5 font-mono text-xs font-bold"
                  >
                    {item.value}
                  </motion.span>
                  <motion.div
                    className="w-full rounded-t-lg"
                    animate={{
                      height: `${(item.value / maxVal) * 210}px`,
                      backgroundColor: c.bg,
                      boxShadow: `0 0 18px -2px ${c.glow}`,
                    }}
                    transition={{ type: "spring", stiffness: 260, damping: 26 }}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Message + counters */}
        <div className="rounded-2xl border border-border bg-surface/70 p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm font-bold text-white">{run.name}</span>
            <div className="flex gap-4 text-xs">
              <span className="text-slate-400">المقارنات: <span className="font-mono font-bold text-warning">{counters.comparisons}</span></span>
              <span className="text-slate-400">التبديلات: <span className="font-mono font-bold text-swap">{counters.swaps}</span></span>
            </div>
          </div>
          <div className="min-h-[44px] rounded-xl bg-bg-soft px-4 py-3 text-sm leading-relaxed text-slate-200">
            {frame.message}
          </div>

          {/* Playback */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <button onClick={() => setFrameIdx((i) => Math.max(0, i - 1))} disabled={playing || frameIdx === 0} className={actionBtn} aria-label="السابق">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h2v14H6zM20 5v14l-9-7z" /></svg>
              </button>
              <button onClick={togglePlay} className="rounded-xl bg-gradient-to-l from-brand-500 to-accent-500 px-4 py-2 text-white shadow-lg shadow-brand-600/30 transition-transform hover:scale-105">
                {playing ? (
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z" /></svg>
                ) : (
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M7 5v14l12-7z" /></svg>
                )}
              </button>
              <button onClick={() => setFrameIdx((i) => Math.min(lastFrame, i + 1))} disabled={playing || frameIdx >= lastFrame} className={actionBtn} aria-label="التالي">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M16 5h2v14h-2zM4 5l9 7-9 7z" /></svg>
              </button>
            </div>

            <div className="flex flex-1 items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
                <motion.div className="h-full rounded-full bg-gradient-to-l from-brand-500 to-accent-500" animate={{ width: `${((frameIdx + 1) / run.frames.length) * 100}%` }} />
              </div>
              <span className="font-mono text-xs text-slate-500">{frameIdx + 1}/{run.frames.length}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">السرعة</span>
              <input type="range" min={0.5} max={4} step={0.5} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-20 accent-brand-500" />
              <span className="w-8 font-mono text-xs text-slate-300">{speed}x</span>
            </div>
          </div>
        </div>

        {/* Dataset controls */}
        <div className="rounded-2xl border border-border bg-surface/70 p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-400">حجم المصفوفة</span>
              <input type="range" min={5} max={14} value={values.length} onChange={(e) => setValues(randomValues(Number(e.target.value)))} className="w-32 accent-brand-500" />
              <span className="w-6 font-mono text-sm text-white">{values.length}</span>
            </div>
            <button className={actionBtn} disabled={playing} onClick={() => setValues(randomValues(values.length))}>مصفوفة عشوائية</button>
            <button className={actionBtn} disabled={playing} onClick={() => setValues([...values].sort((a, b) => b - a))}>أسوأ حالة (معكوسة)</button>
            <button className={actionBtn} disabled={playing} onClick={() => setFrameIdx(0)}>إعادة من البداية</button>
          </div>
        </div>
      </div>

      {/* Side: pseudocode + complexity */}
      <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <div className="overflow-hidden rounded-2xl border border-border bg-bg-soft">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="text-sm font-bold text-white">الكود الزائف</span>
            <div className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-danger/70" />
              <span className="h-3 w-3 rounded-full bg-warning/70" />
              <span className="h-3 w-3 rounded-full bg-success/70" />
            </div>
          </div>
          <div dir="ltr" className="p-3 font-mono text-[13px] leading-relaxed">
            {run.code.map((line, i) => (
              <motion.div
                key={i}
                animate={{
                  backgroundColor: frame.codeLine === i ? "rgba(99,102,241,0.18)" : "rgba(0,0,0,0)",
                  color: frame.codeLine === i ? "#c7d2fe" : "#94a3b8",
                }}
                className="flex gap-3 rounded-md px-2 py-1"
              >
                <span className="select-none text-slate-600">{String(i + 1).padStart(2, "0")}</span>
                <span className="whitespace-pre-wrap">{line}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface/70 p-4">
          <h4 className="mb-3 text-sm font-bold text-white">التعقيد</h4>
          <div className="space-y-2.5 text-sm">
            <Row label="الأفضل"><ComplexityBadge value={run.best} size="sm" /></Row>
            <Row label="المتوسط"><ComplexityBadge value={run.average} size="sm" /></Row>
            <Row label="الأسوأ"><ComplexityBadge value={run.worst} size="sm" /></Row>
            <Row label="المساحة"><ComplexityBadge value={run.space} size="sm" /></Row>
            <Row label="مستقرّة">
              <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${run.stable ? "bg-success/15 text-success" : "bg-danger/15 text-danger"}`}>
                {run.stable ? "نعم" : "لا"}
              </span>
            </Row>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface/70 p-4 text-sm text-slate-400">
          <h4 className="mb-2 font-bold text-white">دليل الألوان</h4>
          <div className="space-y-1.5">
            <Legend color="#6366f1" text="عنصر عادي" />
            <Legend color="#f59e0b" text="قيد المقارنة" />
            <Legend color="#ec4899" text="قيد التبديل" />
            <Legend color="#a78bfa" text="المحور (pivot)" />
            <Legend color="#34d399" text="في موضعه النهائي" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-400">{label}</span>
      {children}
    </div>
  );
}

function Legend({ color, text }: { color: string; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-3 w-3 rounded" style={{ backgroundColor: color }} />
      <span>{text}</span>
    </div>
  );
}
