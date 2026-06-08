import { useEffect, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LinkedListNode } from "./LinkedListNode";
import { ComplexityBadge } from "../../components/ComplexityBadge";
import { useLang } from "../../i18n";
import {
  makeNode,
  insertHead,
  insertTail,
  insertAt,
  deleteHead,
  deleteTail,
  search,
  reverse,
  type LLNode,
  type Operation,
} from "./operations";

const initial = (): LLNode[] => [9, 4, 7, 2].map(makeNode);

export function LinkedListVisualizer() {
  const { t } = useLang();
  const [nodes, setNodes] = useState<LLNode[]>(initial);
  const [op, setOp] = useState<Operation | null>(null);
  const [frameIdx, setFrameIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [value, setValue] = useState("5");
  const [index, setIndex] = useState("1");

  const base = () => (op ? op.finalNodes : nodes);
  const lastFrame = op ? op.frames.length - 1 : 0;
  const frame = op ? op.frames[frameIdx] : null;
  const display = op ? frame!.nodes : nodes;

  useEffect(() => {
    if (!playing || !op) return;
    if (frameIdx >= op.frames.length - 1) {
      setPlaying(false);
      return;
    }
    const t = setTimeout(() => setFrameIdx((i) => i + 1), 1050 / speed);
    return () => clearTimeout(t);
  }, [playing, op, frameIdx, speed]);

  const run = (gen: (n: LLNode[]) => Operation) => {
    if (playing) return;
    const b = base();
    const newOp = gen(b);
    setNodes(b);
    setOp(newOp);
    setFrameIdx(0);
    setPlaying(newOp.frames.length > 1);
  };

  const val = () => {
    const v = parseInt(value, 10);
    return Number.isNaN(v) ? Math.floor(Math.random() * 90) + 10 : v;
  };
  const idx = () => {
    const v = parseInt(index, 10);
    return Number.isNaN(v) ? 0 : v;
  };

  const togglePlay = () => {
    if (!op) return;
    if (frameIdx >= lastFrame) {
      setFrameIdx(0);
      setPlaying(true);
    } else {
      setPlaying((p) => !p);
    }
  };

  const resetList = () => {
    setPlaying(false);
    setOp(null);
    setFrameIdx(0);
    setNodes(initial());
  };
  const randomize = () => {
    setPlaying(false);
    setOp(null);
    setFrameIdx(0);
    const len = Math.floor(Math.random() * 4) + 3;
    setNodes(Array.from({ length: len }, () => makeNode(Math.floor(Math.random() * 90) + 10)));
  };
  const clearList = () => {
    setPlaying(false);
    setOp(null);
    setFrameIdx(0);
    setNodes([]);
  };

  const nodeState = (id: string): "default" | "entering" | "highlight" | "fading" => {
    if (!frame) return "default";
    if (frame.fadingIds.includes(id)) return "fading";
    if (frame.enteringIds.includes(id)) return "entering";
    if (frame.highlightIds.includes(id)) return "highlight";
    return "default";
  };

  const busy = playing;

  const actionBtn =
    "rounded-xl border border-border bg-surface px-3 py-2 text-sm font-semibold text-slate-200 transition-all hover:border-brand-500/50 hover:bg-surface-2 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 active:scale-95";

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="space-y-6">
        {/* Canvas */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-bg-soft/80 p-6">
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
          <div className="relative min-h-[180px]">
            <div dir="ltr" className="flex min-h-[150px] flex-wrap items-center gap-y-6 pt-4">
              <div className="mb-6 flex flex-col items-center pr-1">
                <span className="rounded-md bg-brand-500/20 px-2 py-1 font-mono text-xs font-bold text-brand-300">
                  HEAD
                </span>
                <svg className="mt-1 h-4 w-8 text-brand-400" viewBox="0 0 32 16">
                  <line x1="2" y1="8" x2="26" y2="8" stroke="currentColor" strokeWidth="2" />
                  <path d="M26 4l6 4-6 4z" fill="currentColor" />
                </svg>
              </div>

              <AnimatePresence mode="popLayout">
                {display.map((n, i) => (
                  <LinkedListNode
                    key={n.id}
                    value={n.value}
                    index={i}
                    isLast={i === display.length - 1}
                    state={nodeState(n.id)}
                    pointer={frame?.pointer === i}
                  />
                ))}
              </AnimatePresence>

              <div className="mb-6 flex flex-col items-center">
                <span className="rounded-md border border-border bg-surface px-2.5 py-1 font-mono text-xs font-bold text-slate-400">
                  NULL
                </span>
              </div>
            </div>

            {display.length === 0 && (
              <p className="mt-2 text-sm text-slate-500">{t("القائمة فارغة. أضف عقدة للبدء.", "The list is empty. Add a node to start.")}</p>
            )}
          </div>
        </div>

        {/* Message + complexity */}
        <div className="rounded-2xl border border-border bg-surface/70 p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">{t("العملية:", "Operation:")}</span>
              <span className="text-sm font-bold text-white">{op?.title ?? "—"}</span>
            </div>
            {op && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">{t("زمني", "Time")}</span>
                <ComplexityBadge value={op.time} size="sm" />
                <span className="text-xs text-slate-500">{t("مكاني", "Space")}</span>
                <ComplexityBadge value={op.space} size="sm" />
              </div>
            )}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={op ? `${op.title}-${frameIdx}` : "idle"}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="min-h-[44px] rounded-xl bg-bg-soft px-4 py-3 text-sm leading-relaxed text-slate-200"
            >
              {frame?.message ?? t("اختر عملية لرؤية الشرح خطوة بخطوة مع تتبّع المؤشرات.", "Choose an operation to see a step-by-step explanation with pointer tracking.")}
            </motion.div>
          </AnimatePresence>

          {/* Playback */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <button onClick={() => setFrameIdx((i) => Math.max(0, i - 1))} disabled={!op || playing || frameIdx === 0} className={actionBtn} aria-label={t("السابق", "Previous")}>
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h2v14H6zM20 5v14l-9-7z" /></svg>
              </button>
              <button onClick={togglePlay} disabled={!op} className="rounded-xl bg-gradient-to-l from-brand-500 to-accent-500 px-4 py-2 text-white shadow-lg shadow-brand-600/30 transition-transform hover:scale-105 disabled:opacity-40">
                {playing ? (
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z" /></svg>
                ) : (
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M7 5v14l12-7z" /></svg>
                )}
              </button>
              <button onClick={() => setFrameIdx((i) => Math.min(lastFrame, i + 1))} disabled={!op || playing || frameIdx >= lastFrame} className={actionBtn} aria-label={t("التالي", "Next")}>
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M16 5h2v14h-2zM4 5l9 7-9 7z" /></svg>
              </button>
            </div>

            <div className="flex flex-1 items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
                <motion.div className="h-full rounded-full bg-gradient-to-l from-brand-500 to-accent-500" animate={{ width: op ? `${((frameIdx + 1) / op.frames.length) * 100}%` : "0%" }} />
              </div>
              <span className="font-mono text-xs text-slate-500">{op ? `${frameIdx + 1}/${op.frames.length}` : "0/0"}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">{t("السرعة", "Speed")}</span>
              <input type="range" min={0.5} max={3} step={0.5} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-24 accent-brand-500" />
              <span className="w-8 font-mono text-xs text-slate-300">{speed}x</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="rounded-2xl border border-border bg-surface/70 p-4">
          <div className="mb-4 flex flex-wrap items-end gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-slate-400">{t("القيمة", "Value")}</span>
              <input type="number" value={value} onChange={(e) => setValue(e.target.value)} className="w-24 rounded-lg border border-border bg-bg-soft px-3 py-2 font-mono text-sm text-white outline-none focus:border-brand-500" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-slate-400">{t("الموضع", "Index")}</span>
              <input type="number" value={index} onChange={(e) => setIndex(e.target.value)} className="w-24 rounded-lg border border-border bg-bg-soft px-3 py-2 font-mono text-sm text-white outline-none focus:border-brand-500" />
            </label>
          </div>

          <div className="space-y-3">
            <ButtonGroup label={t("إضافة", "Insert")}>
              <button className={actionBtn} disabled={busy} onClick={() => run((n) => insertHead(t, n, val()))}>{t("للبداية", "At head")}</button>
              <button className={actionBtn} disabled={busy} onClick={() => run((n) => insertTail(t, n, val()))}>{t("للنهاية", "At tail")}</button>
              <button className={actionBtn} disabled={busy} onClick={() => run((n) => insertAt(t, n, idx(), val()))}>{t("عند الموضع", "At index")}</button>
            </ButtonGroup>
            <ButtonGroup label={t("حذف", "Delete")}>
              <button className={actionBtn} disabled={busy} onClick={() => run((n) => deleteHead(t, n))}>{t("البداية", "Head")}</button>
              <button className={actionBtn} disabled={busy} onClick={() => run((n) => deleteTail(t, n))}>{t("النهاية", "Tail")}</button>
            </ButtonGroup>
            <ButtonGroup label={t("خوارزميات", "Algorithms")}>
              <button className={actionBtn} disabled={busy} onClick={() => run((n) => search(t, n, val()))}>{t("بحث", "Search")}</button>
              <button className={actionBtn} disabled={busy} onClick={() => run((n) => reverse(t, n))}>{t("عكس القائمة", "Reverse")}</button>
            </ButtonGroup>
            <ButtonGroup label={t("القائمة", "List")}>
              <button className={actionBtn} disabled={busy} onClick={randomize}>{t("عشوائي", "Random")}</button>
              <button className={actionBtn} disabled={busy} onClick={resetList}>{t("إعادة تعيين", "Reset")}</button>
              <button className={actionBtn} disabled={busy} onClick={clearList}>{t("تفريغ", "Clear")}</button>
            </ButtonGroup>
          </div>
        </div>
      </div>

      {/* Pseudocode */}
      <div className="lg:sticky lg:top-24 lg:self-start">
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
            {op ? (
              op.code.map((line, i) => (
                <motion.div
                  key={i}
                  animate={{
                    backgroundColor: frame?.codeLine === i ? "rgba(99,102,241,0.18)" : "rgba(0,0,0,0)",
                    color: frame?.codeLine === i ? "#c7d2fe" : "#94a3b8",
                  }}
                  className="flex gap-3 rounded-md px-2 py-1"
                >
                  <span className="select-none text-slate-600">{String(i + 1).padStart(2, "0")}</span>
                  <span className="whitespace-pre-wrap">{line}</span>
                  {frame?.codeLine === i && (
                    <motion.span layoutId="code-cursor" className="mr-auto self-center text-accent-400">◀</motion.span>
                  )}
                </motion.div>
              ))
            ) : (
              <p className="px-2 py-6 text-center text-xs text-slate-500">{t("شغّل عملية لعرض الكود المقابل لكل خطوة.", "Run an operation to see the code matching each step.")}</p>
            )}
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-border bg-surface/70 p-4 text-sm text-slate-400">
          <h4 className="mb-2 font-bold text-white">{t("معلومة", "Note")}</h4>
          <p className="leading-relaxed">
            {t("القائمة المرتبطة المفردة تسمح بإضافة/حذف من البداية في زمن ثابت", "A singly linked list allows insertion/deletion at the head in constant time")}
            <ComplexityBadge value="O(1)" size="sm" /> {t("بينما الوصول لعنصر بفهرسه يكلّف", "while accessing an element by index costs")} <ComplexityBadge value="O(n)" size="sm" /> {t("لأنها لا تدعم الوصول العشوائي.", "because it does not support random access.")}
          </p>
        </div>
      </div>
    </div>
  );
}

function ButtonGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-20 shrink-0 text-xs font-bold text-slate-500">{label}</span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
