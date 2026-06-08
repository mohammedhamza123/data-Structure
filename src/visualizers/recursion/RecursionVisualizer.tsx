import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlaybackBar, PseudocodePanel, usePlayer } from "../../components/Player";
import { ComplexityBadge } from "../../components/ComplexityBadge";
import { getRecursionExamples, type ExampleDef } from "./examples";
import { useLang } from "../../i18n";

export function RecursionVisualizer() {
  const { t } = useLang();
  const recursionExamples = useMemo(() => getRecursionExamples(t), [t]);
  const [exampleKey, setExampleKey] = useState<string>(recursionExamples[0].key);
  const example = recursionExamples.find((e) => e.key === exampleKey) ?? recursionExamples[0];
  const [inputs, setInputs] = useState<Record<string, number>>(() =>
    Object.fromEntries(recursionExamples[0].inputs.map((f) => [f.name, f.default]))
  );

  const run = useMemo(() => example.run(inputs), [example, inputs]);
  const player = usePlayer(run.frames.length, 800);
  const { idx, setIdx, playing, setPlaying, speed, setSpeed, toggle } = player;
  const frame = run.frames[Math.min(idx, run.frames.length - 1)];

  useEffect(() => {
    setIdx(0);
    setPlaying(false);
  }, [run, setIdx, setPlaying]);

  const pickExample = (ex: ExampleDef) => {
    setExampleKey(ex.key);
    setInputs(Object.fromEntries(ex.inputs.map((f) => [f.name, f.default])));
  };
  const setInput = (name: string, v: number, field: { min: number; max: number }) => {
    const clamped = Math.max(field.min, Math.min(field.max, v));
    setInputs((p) => ({ ...p, [name]: clamped }));
  };

  const maxDepth = useMemo(() => run.frames.reduce((m, f) => Math.max(m, f.stack.length), 0), [run]);
  const reversed = [...frame.stack].reverse();

  const colors = {
    active: { border: "#22d3ee", bg: "rgba(34,211,238,0.16)", text: "#a5f3fc", glow: "0 0 18px -2px rgba(34,211,238,0.5)" },
    waiting: { border: "#3b4574", bg: "rgba(99,102,241,0.07)", text: "#94a3b8", glow: "none" },
    returned: { border: "#34d399", bg: "rgba(52,211,153,0.14)", text: "#bbf7d0", glow: "none" },
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_330px]">
      <div className="space-y-6">
        {/* example picker */}
        <div className="flex flex-wrap gap-2">
          {recursionExamples.map((ex) => (
            <button
              key={ex.key}
              onClick={() => pickExample(ex)}
              className={`rounded-xl px-3.5 py-2 text-sm font-bold transition-all ${
                example.key === ex.key
                  ? "bg-gradient-to-l from-brand-500 to-accent-500 text-white shadow-lg shadow-brand-600/30"
                  : "border border-border bg-surface text-slate-300 hover:text-white"
              }`}
            >
              {ex.label}
            </button>
          ))}
        </div>

        {/* kind + inputs */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-surface/70 p-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="rounded-md bg-brand-500/15 px-2 py-1 text-xs font-bold text-brand-300">{t("نوع الاستدعاء", "Recursion type")}</span>
            <span className="text-slate-300">{example.kind}</span>
          </div>
          <div className="flex items-end gap-3">
            {example.inputs.map((f) => (
              <label key={f.name} className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-slate-400">{f.label} (≤ {f.max})</span>
                <input
                  type="number"
                  value={inputs[f.name]}
                  min={f.min}
                  max={f.max}
                  onChange={(e) => setInput(f.name, parseInt(e.target.value, 10) || 0, f)}
                  className="w-20 rounded-lg border border-border bg-bg-soft px-3 py-2 font-mono text-sm text-white outline-none focus:border-brand-500"
                />
              </label>
            ))}
          </div>
        </div>

        {/* call stack */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-bg-soft/80 p-5">
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
          <div className="relative">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-bold text-white">{t("مكدس الاستدعاءات (Call Stack)", "Call Stack")}</span>
              <span className="font-mono text-xs text-slate-500">{t("العمق:", "Depth:")} {frame.stack.length} / {maxDepth}</span>
            </div>
            <div className="flex min-h-[260px] flex-col gap-2">
              {frame.stack.length > 0 && <div className="text-center text-[11px] font-bold text-accent-400">{t("↑ قمة المكدس (الاستدعاء الحالي)", "↑ Top of stack (current call)")}</div>}
              <AnimatePresence mode="popLayout">
                {reversed.map((cf) => {
                  const c = colors[cf.status];
                  return (
                    <motion.div
                      key={cf.id}
                      layout
                      initial={{ opacity: 0, x: -30, scale: 0.92 }}
                      animate={{ opacity: 1, x: 0, scale: 1, borderColor: c.border, backgroundColor: c.bg, boxShadow: c.glow }}
                      exit={{ opacity: 0, x: 30, scale: 0.92 }}
                      transition={{ type: "spring", stiffness: 300, damping: 26 }}
                      className="flex items-center justify-between rounded-xl border-2 px-4 py-2.5"
                      style={{ marginRight: cf.depth * 14 }}
                    >
                      <span className="font-mono text-sm font-bold" style={{ color: c.text }}>{cf.label}</span>
                      <div className="flex items-center gap-2">
                        {cf.status === "waiting" && <span className="text-[10px] text-slate-500">{t("ينتظر…", "waiting…")}</span>}
                        {cf.status === "returned" && (
                          <span className="rounded-md bg-success/15 px-2 py-0.5 font-mono text-xs font-bold text-success">↩ {cf.ret}</span>
                        )}
                        {cf.status === "active" && <span className="h-2 w-2 animate-pulse rounded-full bg-accent-400" />}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              {frame.stack.length === 0 && (
                <div className="grid flex-1 place-items-center text-sm text-slate-500">
                  {frame.result ? t(`المكدس فارغ — اكتمل التنفيذ. الناتج: ${frame.result}`, `Stack empty — execution complete. Result: ${frame.result}`) : t("المكدس فارغ.", "The stack is empty.")}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* message + playback */}
        <div className="rounded-2xl border border-border bg-surface/70 p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">{run.name}</span>
              {frame.result && <span className="rounded-md bg-success/15 px-2 py-0.5 text-xs font-bold text-success">= {frame.result}</span>}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">{t("زمني", "Time")}</span>
              <ComplexityBadge value={run.time} size="sm" />
              <span className="text-xs text-slate-500">{t("مكاني", "Space")}</span>
              <ComplexityBadge value={run.space} size="sm" />
            </div>
          </div>
          <div className="min-h-[44px] rounded-xl bg-bg-soft px-4 py-3 text-sm leading-relaxed text-slate-200">{frame.message}</div>
          <div className="mt-4">
            <PlaybackBar idx={idx} total={run.frames.length} playing={playing} speed={speed} onPrev={() => setIdx((i) => Math.max(0, i - 1))} onNext={() => setIdx((i) => Math.min(run.frames.length - 1, i + 1))} onToggle={toggle} onSpeed={setSpeed} />
          </div>
        </div>
      </div>

      <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <PseudocodePanel code={run.code} activeLine={frame.codeLine} />
        <div className="rounded-2xl border border-border bg-surface/70 p-4 text-sm text-slate-400">
          <h4 className="mb-2 font-bold text-white">{t("كل استدعاء = إطار في المكدس", "Each call = a stack frame")}</h4>
          <p className="leading-relaxed">
            {t("عند كل استدعاء ذاتي يُضاف إطار (frame) لأعلى المكدس ويبقى \"ينتظر\" حتى يعود الاستدعاء الأعمق. لهذا يكون التعقيد المكاني للاستدعاء الذاتي على الأقل بقدر أقصى عمق للمكدس. الاستدعاء الذيلي يمكن تحويله لحلقة بـ", "On each recursive call a frame is pushed onto the stack and stays \"waiting\" until the deeper call returns. That's why recursion's space complexity is at least the maximum stack depth. Tail recursion can be turned into a loop with")} <ComplexityBadge value="O(1)" size="sm" /> {t("مساحة.", "space.")}
          </p>
        </div>
      </div>
    </div>
  );
}
