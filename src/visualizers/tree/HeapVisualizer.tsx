import { useEffect, useMemo, useState } from "react";
import { ArrayRow, TreeCanvas } from "./TreeCanvas";
import { PlaybackBar, PseudocodePanel, usePlayer } from "../../components/Player";
import { ComplexityBadge } from "../../components/ComplexityBadge";
import { heapify, heapSort, makeHeapItems, randomHeap } from "./heap";
import { useLang } from "../../i18n";

type Mode = "heapify" | "heapsort";

export function HeapVisualizer() {
  const { t } = useLang();
  const [mode, setMode] = useState<Mode>("heapify");
  const [values, setValues] = useState<number[]>(() => randomHeap(7));

  const run = useMemo(() => {
    const items = makeHeapItems(values);
    return mode === "heapify" ? heapify(t, items).run : heapSort(t, items).run;
  }, [mode, values, t]);

  const player = usePlayer(run.frames.length, 750);
  const { idx, setIdx, playing, setPlaying, speed, setSpeed, toggle } = player;
  const frame = run.frames[Math.min(idx, run.frames.length - 1)];

  useEffect(() => {
    setIdx(0);
    setPlaying(false);
  }, [run, setIdx, setPlaying]);

  const actionBtn =
    "rounded-xl border border-border bg-surface px-3 py-2 text-sm font-semibold text-slate-200 transition-all hover:border-brand-500/50 hover:bg-surface-2 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 active:scale-95";

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_330px]">
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setMode("heapify")}
            className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${mode === "heapify" ? "bg-gradient-to-l from-brand-500 to-accent-500 text-white shadow-lg shadow-brand-600/30" : "border border-border bg-surface text-slate-300 hover:text-white"}`}
          >
            {t("بناء الكومة (Heapify)", "Build heap (Heapify)")}
          </button>
          <button
            onClick={() => setMode("heapsort")}
            className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${mode === "heapsort" ? "bg-gradient-to-l from-brand-500 to-accent-500 text-white shadow-lg shadow-brand-600/30" : "border border-border bg-surface text-slate-300 hover:text-white"}`}
          >
            {t("الترتيب بالكومة (Heap Sort)", "Heap Sort")}
          </button>
        </div>

        <TreeCanvas frame={frame} width={run.width} height={run.height} />
        <ArrayRow frame={frame} />

        <div className="rounded-2xl border border-border bg-surface/70 p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-bold text-white">{run.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">{t("زمني", "Time")}</span>
              <ComplexityBadge value={run.time} size="sm" />
              <span className="text-xs text-slate-500">{t("مكاني", "Space")}</span>
              <ComplexityBadge value={run.space} size="sm" />
            </div>
          </div>
          <div className="min-h-[44px] rounded-xl bg-bg-soft px-4 py-3 text-sm leading-relaxed text-slate-200">
            {frame.message}
          </div>
          <div className="mt-4">
            <PlaybackBar
              idx={idx}
              total={run.frames.length}
              playing={playing}
              speed={speed}
              onPrev={() => setIdx((i) => Math.max(0, i - 1))}
              onNext={() => setIdx((i) => Math.min(run.frames.length - 1, i + 1))}
              onToggle={toggle}
              onSpeed={setSpeed}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface/70 p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-400">{t("حجم المصفوفة", "Array size")}</span>
              <input type="range" min={4} max={12} value={values.length} onChange={(e) => setValues(randomHeap(Number(e.target.value)))} className="w-32 accent-brand-500" />
              <span className="w-6 font-mono text-sm text-white">{values.length}</span>
            </div>
            <button className={actionBtn} disabled={playing} onClick={() => setValues(randomHeap(values.length))}>{t("مصفوفة عشوائية", "Random array")}</button>
            <button className={actionBtn} disabled={playing} onClick={() => setIdx(0)}>{t("إعادة من البداية", "Restart")}</button>
          </div>
        </div>
      </div>

      <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <PseudocodePanel code={run.code} activeLine={frame.codeLine} />
        <div className="rounded-2xl border border-border bg-surface/70 p-4 text-sm text-slate-400">
          <h4 className="mb-2 font-bold text-white">{t("دليل الألوان", "Color guide")}</h4>
          <div className="space-y-1.5">
            <Legend color="#6366f1" text={t("عقدة في الكومة", "Heap node")} />
            <Legend color="#22d3ee" text={t("قيد المقارنة", "Comparing")} />
            <Legend color="#ec4899" text={t("قيد التبديل", "Swapping")} />
            <Legend color="#34d399" text={t("مستقرّة / مرتّبة", "Settled / sorted")} />
          </div>
          <p className="mt-3 leading-relaxed">
            {t("الكومة القصوى شجرة ثنائية كاملة، لذا تُخزَّن بكفاءة في مصفوفة: ابنا العقدة", "A max-heap is a complete binary tree, so it is stored efficiently in an array: the children of node")} <span className="font-mono">i</span> {t("هما", "are")} <span className="font-mono">2i+1</span> {t("و", "and")}
            <span className="font-mono"> 2i+2</span>.
          </p>
        </div>
      </div>
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
