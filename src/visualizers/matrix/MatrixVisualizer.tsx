import { useEffect, useMemo, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { ComplexityBadge } from "../../components/ComplexityBadge";
import { PlaybackBar } from "../../components/Player";
import { useLang } from "../../i18n";
import {
  defaultArray1d,
  defaultMatrix,
  getMatrixOperations,
  randomArray1d,
  randomMatrix,
  type MatrixFrame,
  type MatrixOpKey,
} from "./operations";

const opOrder: MatrixOpKey[] = ["array1d", "reverse", "rowSums", "rowColSum", "diagonal"];

function cellKey(row: number, col: number) {
  return `${row}-${col}`;
}

function isHighlighted(frame: MatrixFrame, row: number, col: number) {
  return frame.highlight.some((h) => h.row === row && h.col === col);
}

function cellStyle(frame: MatrixFrame, row: number, col: number) {
  if (frame.swapPair) {
    const [a, b] = frame.swapPair;
    if ((a.row === row && a.col === col) || (b.row === row && b.col === col)) {
      return { bg: "#ec4899", border: "#f472b6", glow: "rgba(236,72,153,0.45)" };
    }
  }
  if (isHighlighted(frame, row, col)) {
    return { bg: "#f59e0b", border: "#fbbf24", glow: "rgba(245,158,11,0.45)" };
  }
  if (frame.highlightRow === row && frame.highlightCol === col) {
    return { bg: "#a78bfa", border: "#c4b5fd", glow: "rgba(167,139,250,0.45)" };
  }
  if (frame.highlightRow === row) {
    return { bg: "#38bdf8", border: "#7dd3fc", glow: "rgba(56,189,248,0.35)" };
  }
  if (frame.highlightCol === col) {
    return { bg: "#34d399", border: "#6ee7b7", glow: "rgba(52,211,153,0.35)" };
  }
  return { bg: "#6366f1", border: "#818cf8", glow: "rgba(99,102,241,0.3)" };
}

export function MatrixVisualizer() {
  const { t } = useLang();
  const [opKey, setOpKey] = useState<MatrixOpKey>("reverse");
  const [matrix, setMatrix] = useState<number[][]>(() => defaultMatrix());
  const [array1d, setArray1d] = useState<number[]>(() => defaultArray1d());
  const [targetRow, setTargetRow] = useState(1);
  const [targetCol, setTargetCol] = useState(2);
  const [frameIdx, setFrameIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1.5);

  const operations = useMemo(() => getMatrixOperations(t), [t]);
  const currentOp = operations.find((o) => o.key === opKey)!;

  const run = useMemo(
    () => currentOp.run(matrix, array1d, targetRow, targetCol),
    [currentOp, matrix, array1d, targetRow, targetCol],
  );

  const lastFrame = run.frames.length - 1;
  const frame = run.frames[Math.min(frameIdx, lastFrame)];
  const is1d = opKey === "array1d";

  useEffect(() => {
    setFrameIdx(0);
    setPlaying(false);
  }, [opKey, matrix, array1d, targetRow, targetCol]);

  useEffect(() => {
    if (!playing) return;
    if (frameIdx >= lastFrame) {
      setPlaying(false);
      return;
    }
    const timer = setTimeout(() => setFrameIdx((i) => i + 1), 750 / speed);
    return () => clearTimeout(timer);
  }, [playing, frameIdx, lastFrame, speed]);

  const togglePlay = () => {
    if (frameIdx >= lastFrame) {
      setFrameIdx(0);
      setPlaying(true);
    } else setPlaying((p) => !p);
  };

  const actionBtn =
    "rounded-xl border border-border bg-surface px-3 py-2 text-sm font-semibold text-slate-200 transition-all hover:border-brand-500/50 hover:bg-surface-2 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 active:scale-95";

  const rows = matrix.length;
  const cols = matrix[0]?.length ?? 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {opOrder.map((k) => {
            const op = operations.find((o) => o.key === k)!;
            return (
              <button
                key={k}
                onClick={() => setOpKey(k)}
                className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${
                  opKey === k
                    ? "bg-gradient-to-l from-brand-500 to-accent-500 text-white shadow-lg shadow-brand-600/30"
                    : "border border-border bg-surface text-slate-300 hover:text-white"
                }`}
              >
                {op.label}
              </button>
            );
          })}
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-border bg-bg-soft/80 p-6">
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
          <div className="relative">
            {is1d ? (
              <div className="space-y-4">
                <div className="text-xs font-semibold text-slate-400">{t("مصفوفة أحادية البُعد (1D)", "One-dimensional array (1D)")}</div>
                <div dir="ltr" className="flex flex-wrap items-end justify-center gap-2 sm:gap-3">
                  {(frame.array1d ?? array1d).map((val, i) => {
                    const hl = frame.highlight.some((h) => h.col === i);
                    const c = hl
                      ? { bg: "#f59e0b", border: "#fbbf24", glow: "rgba(245,158,11,0.45)" }
                      : { bg: "#6366f1", border: "#818cf8", glow: "rgba(99,102,241,0.3)" };
                    return (
                      <div key={i} className="flex flex-col items-center gap-1.5">
                        <motion.div
                          animate={{
                            backgroundColor: c.bg,
                            boxShadow: `0 0 16px -2px ${c.glow}`,
                          }}
                          className="flex h-14 w-14 items-center justify-center rounded-xl border-2 font-mono text-lg font-bold text-white"
                          style={{ borderColor: c.border }}
                        >
                          {val}
                        </motion.div>
                        <span className="font-mono text-[10px] text-slate-500">[{i}]</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-xs font-semibold text-slate-400">
                  {t("مصفوفة ثنائية البُعد (2D)", "Two-dimensional matrix (2D)")} · {rows}×{cols}
                </div>
                <div dir="ltr" className="overflow-x-auto">
                  <div className="inline-block min-w-full">
                    <div className="mb-2 flex gap-2 pl-10">
                      {Array.from({ length: cols }, (_, j) => (
                        <div
                          key={j}
                          className={`flex h-7 w-14 items-center justify-center font-mono text-[10px] font-bold ${
                            frame.highlightCol === j ? "text-success" : "text-slate-500"
                          }`}
                        >
                          col {j}
                        </div>
                      ))}
                    </div>
                    {frame.matrix.map((row, i) => (
                      <div key={i} className="mb-2 flex items-center gap-2">
                        <span
                          className={`w-8 font-mono text-[10px] font-bold ${
                            frame.highlightRow === i ? "text-brand-300" : "text-slate-500"
                          }`}
                        >
                          r{i}
                        </span>
                        {row.map((val, j) => {
                          const c = cellStyle(frame, i, j);
                          return (
                            <motion.div
                              key={cellKey(i, j)}
                              layout
                              animate={{
                                backgroundColor: c.bg,
                                boxShadow: `0 0 14px -2px ${c.glow}`,
                              }}
                              transition={{ type: "spring", stiffness: 320, damping: 28 }}
                              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border-2 font-mono text-base font-bold text-white"
                              style={{ borderColor: c.border }}
                            >
                              {val}
                            </motion.div>
                          );
                        })}
                        {frame.rowSums && frame.rowSums[i] !== undefined && (
                          <span className="ml-2 font-mono text-xs font-bold text-accent-400">
                            Σ={frame.rowSums[i]}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {frame.runningSum !== null && !is1d && (
              <div className="mt-4 rounded-xl border border-brand-500/30 bg-brand-500/10 px-4 py-2 text-center">
                <span className="text-xs text-slate-400">{t("المجموع الجاري:", "Running sum:")} </span>
                <span className="font-mono text-lg font-bold text-brand-200">{frame.runningSum}</span>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface/70 p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm font-bold text-white">{run.name}</span>
            <span className="font-mono text-xs text-slate-500">
              {frameIdx + 1}/{run.frames.length}
            </span>
          </div>
          <div className="min-h-[44px] rounded-xl bg-bg-soft px-4 py-3 text-sm leading-relaxed text-slate-200">
            {frame.message}
          </div>
          <div className="mt-4">
            <PlaybackBar
              idx={frameIdx}
              total={run.frames.length}
              playing={playing}
              speed={speed}
              onPrev={() => setFrameIdx((i) => Math.max(0, i - 1))}
              onNext={() => setFrameIdx((i) => Math.min(lastFrame, i + 1))}
              onToggle={togglePlay}
              onSpeed={setSpeed}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface/70 p-4">
          <div className="flex flex-wrap items-center gap-4">
            {opKey === "array1d" ? (
              <>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-400">{t("الطول", "Length")}</span>
                  <input
                    type="range"
                    min={4}
                    max={10}
                    value={array1d.length}
                    onChange={(e) => setArray1d(randomArray1d(Number(e.target.value)))}
                    className="w-32 accent-brand-500"
                    disabled={playing}
                  />
                  <span className="w-6 font-mono text-sm text-white">{array1d.length}</span>
                </div>
                <button className={actionBtn} disabled={playing} onClick={() => setArray1d(randomArray1d(array1d.length))}>
                  {t("مصفوفة عشوائية", "Random array")}
                </button>
              </>
            ) : (
              <>
                {opKey === "rowColSum" && (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-400">{t("الصف", "Row")}</span>
                      <input
                        type="number"
                        min={0}
                        max={rows - 1}
                        value={targetRow}
                        onChange={(e) => setTargetRow(Number(e.target.value))}
                        className="w-16 rounded-lg border border-border bg-bg-soft px-2 py-1.5 font-mono text-sm text-white"
                        disabled={playing}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-400">{t("العمود", "Col")}</span>
                      <input
                        type="number"
                        min={0}
                        max={cols - 1}
                        value={targetCol}
                        onChange={(e) => setTargetCol(Number(e.target.value))}
                        className="w-16 rounded-lg border border-border bg-bg-soft px-2 py-1.5 font-mono text-sm text-white"
                        disabled={playing}
                      />
                    </div>
                  </>
                )}
                <button className={actionBtn} disabled={playing} onClick={() => setMatrix(randomMatrix(rows, cols))}>
                  {t("مصفوفة عشوائية", "Random matrix")}
                </button>
                <button className={actionBtn} disabled={playing} onClick={() => setMatrix(defaultMatrix())}>
                  {t("مثال افتراضي", "Default example")}
                </button>
              </>
            )}
            <button className={actionBtn} disabled={playing} onClick={() => setFrameIdx(0)}>
              {t("إعادة من البداية", "Restart")}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <div className="overflow-hidden rounded-2xl border border-border bg-bg-soft">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="text-sm font-bold text-white">{t("كود C++", "C++ Code")}</span>
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
            <Row label={t("الأفضل", "Best")}><ComplexityBadge value={run.best} size="sm" /></Row>
            <Row label={t("المتوسط", "Average")}><ComplexityBadge value={run.average} size="sm" /></Row>
            <Row label={t("الأسوأ", "Worst")}><ComplexityBadge value={run.worst} size="sm" /></Row>
            <Row label={t("المساحة", "Space")}><ComplexityBadge value={run.space} size="sm" /></Row>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface/70 p-4 text-sm text-slate-400">
          <h4 className="mb-2 font-bold text-white">{t("دليل الألوان", "Color guide")}</h4>
          <div className="space-y-1.5">
            <Legend color="#6366f1" text={t("عنصر عادي", "Normal cell")} />
            <Legend color="#38bdf8" text={t("صف نشط", "Active row")} />
            <Legend color="#34d399" text={t("عمود نشط", "Active column")} />
            <Legend color="#f59e0b" text={t("عنصر قيد المعالجة", "Processing cell")} />
            <Legend color="#ec4899" text={t("قيد التبديل", "Swapping")} />
            <Legend color="#a78bfa" text={t("تقاطع صف وعمود", "Row & column intersection")} />
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
