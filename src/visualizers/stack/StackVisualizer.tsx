import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlaybackBar, PseudocodePanel, usePlayer } from "../../components/Player";
import { ComplexityBadge } from "../../components/ComplexityBadge";
import { makeStackItem, peek, pop, push, type StackItem, type StackRun } from "./stack";
import { useLang } from "../../i18n";

const initial = (): StackItem[] => [12, 27, 8].map(makeStackItem);

function idleRun(items: StackItem[], message: string): StackRun {
  return { name: "—", time: "O(1)", space: "O(1)", code: ["// ..."], frames: [{ items, active: [], entering: [], fading: [], codeLine: 0, message }], items };
}

export function StackVisualizer() {
  const { t } = useLang();
  const [items, setItems] = useState<StackItem[]>(initial);
  const [run, setRun] = useState<StackRun>(() => idleRun(initial(), t("المكدس يعمل بمبدأ LIFO: آخر عنصر يدخل هو أول من يخرج. جرّب العمليات.", "A stack works on the LIFO principle: the last element in is the first out. Try the operations.")));
  const [value, setValue] = useState("42");

  const player = usePlayer(run.frames.length);
  const { idx, setIdx, playing, setPlaying, speed, setSpeed, toggle } = player;
  const frame = run.frames[Math.min(idx, run.frames.length - 1)];

  useEffect(() => {
    setIdx(0);
    setPlaying(run.frames.length > 1);
  }, [run, setIdx, setPlaying]);

  const val = () => {
    const v = parseInt(value, 10);
    return Number.isNaN(v) ? Math.floor(Math.random() * 90) + 10 : v;
  };
  const apply = (res: StackRun) => {
    setItems(res.items);
    setRun(res);
  };
  const reset = () => {
    const it = initial();
    setItems(it);
    setRun(idleRun(it, t("أُعيد المكدس الافتراضي.", "The default stack was restored.")));
  };
  const clear = () => {
    setItems([]);
    setRun(idleRun([], t("المكدس فارغ.", "The stack is empty.")));
  };

  const busy = playing;
  const display = frame.items;
  const topId = display[display.length - 1]?.id;

  const state = (id: string) => {
    if (frame.fading.includes(id)) return "fading";
    if (frame.entering.includes(id)) return "entering";
    if (frame.active.includes(id)) return "active";
    return "default";
  };
  const palette: Record<string, { border: string; bg: string; text: string }> = {
    default: { border: "#283153", bg: "#1c2440", text: "#e2e8f0" },
    entering: { border: "#6366f1", bg: "rgba(99,102,241,0.2)", text: "#c7d2fe" },
    active: { border: "#22d3ee", bg: "rgba(34,211,238,0.2)", text: "#a5f3fc" },
    fading: { border: "#f87171", bg: "rgba(248,113,113,0.18)", text: "#fecaca" },
  };

  const actionBtn =
    "rounded-xl border border-border bg-surface px-3 py-2 text-sm font-semibold text-slate-200 transition-all hover:border-brand-500/50 hover:bg-surface-2 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 active:scale-95";

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_330px]">
      <div className="space-y-6">
        {/* Stack canvas */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-bg-soft/80 p-6">
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
          <div className="relative flex min-h-[280px] flex-col items-center justify-end">
            <div className="mb-3 h-5 text-xs font-bold text-accent-400">
              {display.length > 0 && <span>{t("← top (القمة)", "← top")}</span>}
            </div>
            <div className="flex w-48 flex-col-reverse gap-2">
              <AnimatePresence mode="popLayout">
                {display.map((item) => {
                  const c = palette[state(item.id)];
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: -40, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1, borderColor: c.border, backgroundColor: c.bg, color: c.text }}
                      exit={{ opacity: 0, y: -40, scale: 0.8 }}
                      transition={{ type: "spring", stiffness: 320, damping: 26 }}
                      className="relative grid h-14 place-items-center rounded-xl border-2 font-mono text-lg font-bold"
                    >
                      {item.value}
                      {item.id === topId && (
                        <motion.span layoutId="stack-top" className="absolute -right-16 text-xs font-bold text-accent-400">
                          top →
                        </motion.span>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
            <div className="mt-2 w-52 rounded-b-xl border-x-2 border-b-2 border-slate-600 pb-1 text-center text-[11px] text-slate-500">
              {t("قاعدة المكدس (base)", "Stack base")}
            </div>
            {display.length === 0 && <p className="mt-4 text-sm text-slate-500">{t("المكدس فارغ.", "The stack is empty.")}</p>}
          </div>
        </div>

        {/* message + playback */}
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
          <div className="min-h-[44px] rounded-xl bg-bg-soft px-4 py-3 text-sm leading-relaxed text-slate-200">{frame.message}</div>
          <div className="mt-4">
            <PlaybackBar idx={idx} total={run.frames.length} playing={playing} speed={speed} onPrev={() => setIdx((i) => Math.max(0, i - 1))} onNext={() => setIdx((i) => Math.min(run.frames.length - 1, i + 1))} onToggle={toggle} onSpeed={setSpeed} />
          </div>
        </div>

        {/* controls */}
        <div className="rounded-2xl border border-border bg-surface/70 p-4">
          <div className="flex flex-wrap items-end gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-slate-400">{t("القيمة", "Value")}</span>
              <input type="number" value={value} onChange={(e) => setValue(e.target.value)} className="w-28 rounded-lg border border-border bg-bg-soft px-3 py-2 font-mono text-sm text-white outline-none focus:border-brand-500" />
            </label>
            <button className={actionBtn} disabled={busy} onClick={() => apply(push(items, val()))}>{t("Push (إضافة)", "Push")}</button>
            <button className={actionBtn} disabled={busy} onClick={() => apply(pop(items))}>{t("Pop (سحب)", "Pop")}</button>
            <button className={actionBtn} disabled={busy} onClick={() => apply(peek(items))}>{t("Peek (نظرة)", "Peek")}</button>
            <button className={actionBtn} disabled={busy} onClick={reset}>{t("إعادة تعيين", "Reset")}</button>
            <button className={actionBtn} disabled={busy} onClick={clear}>{t("تفريغ", "Clear")}</button>
          </div>
        </div>
      </div>

      <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <PseudocodePanel code={run.code} activeLine={frame.codeLine} />
        <div className="rounded-2xl border border-border bg-surface/70 p-4 text-sm text-slate-400">
          <h4 className="mb-2 font-bold text-white">{t("المكدس (Stack)", "Stack")}</h4>
          <p className="leading-relaxed">
            {t("بنية LIFO (Last In, First Out). كل العمليات الأساسية (push/pop/peek) تتم في زمن ثابت", "A LIFO (Last In, First Out) structure. All basic operations (push/pop/peek) run in constant time")}
            <ComplexityBadge value="O(1)" size="sm" />. {t("يُستخدم في تتبّع الاستدعاءات (call stack)، التراجع (undo)، وتقييم التعابير.", "Used in call stacks, undo, and expression evaluation.")}
          </p>
        </div>
      </div>
    </div>
  );
}
