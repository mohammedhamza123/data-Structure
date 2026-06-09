import { useEffect, useMemo, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { ComplexityBadge } from "../../components/ComplexityBadge";
import { binarySearch, randomSorted, type BSFrame } from "./binarySearch";
import { useLang } from "../../i18n";

const POINTER_COLORS: Record<string, string> = {
  lo: "#38bdf8",
  mid: "#c084fc",
  hi: "#fb7185",
};

function cellStyle(i: number, f: BSFrame) {
  if (f.found === i) return { border: "#34d399", bg: "rgba(52,211,153,0.2)", text: "#bbf7d0" };
  if (f.mid === i) return { border: "#c084fc", bg: "rgba(192,132,252,0.2)", text: "#e9d5ff" };
  if (f.eliminated.includes(i)) return { border: "#283153", bg: "#0d1120", text: "#475569" };
  if (i >= f.lo && i <= f.hi) return { border: "#6366f1", bg: "rgba(99,102,241,0.16)", text: "#c7d2fe" };
  return { border: "#283153", bg: "#0d1120", text: "#475569" };
}

export function BinarySearchVisualizer() {
  const { t } = useLang();
  const [values, setValues] = useState<number[]>(() => randomSorted(11));
  const [target, setTarget] = useState<number>(() => 0);
  const [frameIdx, setFrameIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1.5);

  useEffect(() => {
    if (target === 0) setTarget(values[Math.floor(values.length / 2)]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const run = useMemo(() => binarySearch(t, values, target), [t, values, target]);
  const lastFrame = run.frames.length - 1;
  const frame = run.frames[Math.min(frameIdx, lastFrame)];

  useEffect(() => {
    setFrameIdx(0);
    setPlaying(false);
  }, [values, target]);

  useEffect(() => {
    if (!playing) return;
    if (frameIdx >= lastFrame) {
      setPlaying(false);
      return;
    }
    const id = setTimeout(() => setFrameIdx((i) => i + 1), 850 / speed);
    return () => clearTimeout(id);
  }, [playing, frameIdx, lastFrame, speed]);

  const togglePlay = () => {
    if (frameIdx >= lastFrame) {
      setFrameIdx(0);
      setPlaying(true);
    } else setPlaying((p) => !p);
  };

  const pointersAt = (i: number) => {
    const out: string[] = [];
    if (frame.lo === i) out.push("lo");
    if (frame.mid === i) out.push("mid");
    if (frame.hi === i) out.push("hi");
    return out;
  };

  const actionBtn =
    "rounded-xl border border-border bg-surface px-3 py-2 text-sm font-semibold text-slate-200 transition-all hover:border-brand-500/50 hover:bg-surface-2 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 active:scale-95";

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="space-y-6">
        {/* Cells */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-bg-soft/80 p-6">
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
          <div dir="ltr" className="relative flex flex-wrap items-end justify-center gap-2 sm:gap-3">
            {run.values.map((v, i) => {
              const c = cellStyle(i, frame);
              return (
                <motion.div
                  key={i}
                  className="flex flex-1 flex-col items-center"
                  style={{ minWidth: 40, maxWidth: 56 }}
                >
                  <motion.div
                    className="flex h-12 w-full items-center justify-center rounded-lg font-mono text-sm font-bold"
                    animate={{
                      borderColor: c.border,
                      backgroundColor: c.bg,
                      color: c.text,
                      opacity: c.text === "#475569" ? 0.45 : 1,
                    }}
                    style={{ borderWidth: 2 }}
                    transition={{ type: "spring", stiffness: 280, damping: 26 }}
                  >
                    {v}
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          {/* Index labels + moving pointers */}
          <div dir="ltr" className="relative mt-2 flex flex-wrap items-start justify-center gap-2 sm:gap-3">
            {run.values.map((_, i) => {
              const here = pointersAt(i);
              return (
                <div key={i} className="flex flex-1 flex-col items-center" style={{ minWidth: 40, maxWidth: 56 }}>
                  <span className="font-mono text-[10px] text-slate-500">{i}</span>
                  <div className="mt-1 flex min-h-[40px] flex-col items-center gap-1">
                    {here.map((label) => {
                      const col = POINTER_COLORS[label];
                      return (
                        <motion.div
                          key={label}
                          layoutId={`bs-ptr-${label}`}
                          layout
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ type: "spring", stiffness: 520, damping: 34 }}
                          className="flex flex-col items-center"
                        >
                          <svg className="h-2.5 w-2.5" viewBox="0 0 12 8" fill={col}>
                            <path d="M6 0l6 8H0z" />
                          </svg>
                          <span
                            className="rounded-md px-1.5 py-0.5 font-mono text-[10px] font-bold leading-none"
                            style={{ color: col, backgroundColor: `${col}22`, border: `1px solid ${col}66` }}
                          >
                            {label}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Message + status */}
        <div className="rounded-2xl border border-border bg-surface/70 p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm font-bold text-white">{run.name}</span>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">{t("الهدف:", "Target:")}</span>
              <span className="rounded-md bg-brand-500/20 px-2 py-0.5 font-mono font-bold text-brand-300">{run.target}</span>
            </div>
          </div>
          <div className="min-h-[44px] rounded-xl bg-bg-soft px-4 py-3 text-sm leading-relaxed text-slate-200">
            {frame.message}
          </div>

          {/* Playback */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <button onClick={() => setFrameIdx((i) => Math.max(0, i - 1))} disabled={playing || frameIdx === 0} className={actionBtn} aria-label={t("السابق", "Previous")}>
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h2v14H6zM20 5v14l-9-7z" /></svg>
              </button>
              <button onClick={togglePlay} className="rounded-xl bg-gradient-to-l from-brand-500 to-accent-500 px-4 py-2 text-white shadow-lg shadow-brand-600/30 transition-transform hover:scale-105">
                {playing ? (
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z" /></svg>
                ) : (
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M7 5v14l12-7z" /></svg>
                )}
              </button>
              <button onClick={() => setFrameIdx((i) => Math.min(lastFrame, i + 1))} disabled={playing || frameIdx >= lastFrame} className={actionBtn} aria-label={t("التالي", "Next")}>
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
              <span className="text-xs text-slate-500">{t("السرعة", "Speed")}</span>
              <input type="range" min={0.5} max={4} step={0.5} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-20 accent-brand-500" />
              <span className="w-8 font-mono text-xs text-slate-300">{speed}x</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="rounded-2xl border border-border bg-surface/70 p-4">
          <div className="flex flex-wrap items-end gap-4">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-slate-400">{t("القيمة المطلوبة", "Target value")}</span>
              <input
                type="number"
                value={target}
                onChange={(e) => setTarget(Number(e.target.value))}
                className="w-28 rounded-lg border border-border bg-bg-soft px-3 py-2 font-mono text-sm text-white outline-none focus:border-brand-500"
              />
            </label>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-400">{t("حجم المصفوفة", "Array size")}</span>
              <input type="range" min={5} max={16} value={values.length} onChange={(e) => setValues(randomSorted(Number(e.target.value)))} className="w-32 accent-brand-500" />
              <span className="w-6 font-mono text-sm text-white">{values.length}</span>
            </div>
            <button className={actionBtn} disabled={playing} onClick={() => setValues(randomSorted(values.length))}>{t("مصفوفة جديدة", "New array")}</button>
            <button className={actionBtn} disabled={playing} onClick={() => setTarget(values[Math.floor(Math.random() * values.length)])}>{t("هدف موجود", "Existing target")}</button>
            <button className={actionBtn} disabled={playing} onClick={() => setFrameIdx(0)}>{t("إعادة من البداية", "Restart")}</button>
          </div>
        </div>
      </div>

      {/* Side: pseudocode + complexity */}
      <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <div className="overflow-hidden rounded-2xl border border-border bg-bg-soft">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="text-sm font-bold text-white">{t("الكود الزائف", "Pseudocode")}</span>
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
          <h4 className="mb-3 text-sm font-bold text-white">{t("التعقيد", "Complexity")}</h4>
          <div className="space-y-2.5 text-sm">
            <Row label={t("زمني", "Time")}><ComplexityBadge value={run.time} size="sm" /></Row>
            <Row label={t("مكاني", "Space")}><ComplexityBadge value={run.space} size="sm" /></Row>
            <Row label={t("النتيجة", "Result")}>
              <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${run.resultIndex >= 0 ? "bg-success/15 text-success" : "bg-danger/15 text-danger"}`}>
                {run.resultIndex >= 0 ? t(`الموضع ${run.resultIndex}`, `Index ${run.resultIndex}`) : t("غير موجود", "Not found")}
              </span>
            </Row>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface/70 p-4 text-sm text-slate-400">
          <h4 className="mb-2 font-bold text-white">{t("دليل الألوان", "Color guide")}</h4>
          <div className="space-y-1.5">
            <Legend color="#6366f1" text={t("ضمن مجال البحث", "Within search range")} />
            <Legend color="#c084fc" text={t("المنتصف (mid)", "Middle (mid)")} />
            <Legend color="#34d399" text={t("تم العثور عليه", "Found")} />
            <Legend color="#283153" text={t("مُستبعد", "Discarded")} />
          </div>
          <p className="mt-3 text-xs text-slate-500">
            {t(
              "يتطلب البحث الثنائي مصفوفة مرتّبة، ويقصي نصف العناصر في كل خطوة.",
              "Binary search requires a sorted array and eliminates half of the elements at each step.",
            )}
          </p>
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
