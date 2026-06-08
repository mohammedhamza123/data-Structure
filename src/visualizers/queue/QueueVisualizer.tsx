import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PlaybackBar, PseudocodePanel, usePlayer } from "../../components/Player";
import { ComplexityBadge } from "../../components/ComplexityBadge";
import { dequeue, emptyQueue, enqueue, type QueueFrame, type QueueRun, type QueueState } from "./queue";
import { useLang, type TFunction } from "../../i18n";

const CAP = 6;

function idleRun(state: QueueState, message: string): QueueRun {
  return {
    name: "—",
    time: "O(1)",
    space: "O(1)",
    code: ["// ..."],
    frames: [{ ...frameFrom(state), active: [], enter: null, exit: null, codeLine: 0, message }],
    state,
  };
}
function frameFrom(s: QueueState): QueueFrame {
  return { cells: [...s.cells], front: s.front, rear: s.rear, count: s.count, capacity: s.capacity, circular: s.circular, active: [], enter: null, exit: null, codeLine: 0, message: "" };
}

function cellStyle(i: number, f: QueueFrame) {
  const filled = f.cells[i] !== null;
  if (f.exit === i) return { border: "#f87171", bg: "rgba(248,113,113,0.18)", text: "#fecaca" };
  if (f.enter === i || f.active.includes(i)) return { border: "#22d3ee", bg: "rgba(34,211,238,0.2)", text: "#a5f3fc" };
  if (filled) return { border: "#6366f1", bg: "rgba(99,102,241,0.16)", text: "#c7d2fe" };
  return { border: "#283153", bg: "#11162a", text: "#475569" };
}

export function QueueVisualizer() {
  const { t } = useLang();
  const [mode, setMode] = useState<"linear" | "circular">("circular");
  const [state, setState] = useState<QueueState>(() => {
    const s = emptyQueue(CAP, true);
    return applyValues(t, s, [10, 20, 30]);
  });
  const [run, setRun] = useState<QueueRun>(() => idleRun(applyValues(t, emptyQueue(CAP, true), [10, 20, 30]), t("الطابور يعمل بمبدأ FIFO: أول من يدخل أول من يخرج. جرّب الإضافة والإخراج.", "A queue works on the FIFO principle: first in, first out. Try enqueue and dequeue.")));
  const [value, setValue] = useState("40");

  const player = usePlayer(run.frames.length);
  const { idx, setIdx, playing, setPlaying, speed, setSpeed, toggle } = player;
  const frame = run.frames[Math.min(idx, run.frames.length - 1)];

  useEffect(() => {
    setIdx(0);
    setPlaying(run.frames.length > 1);
  }, [run, setIdx, setPlaying]);

  const switchMode = (m: "linear" | "circular") => {
    const s = applyValues(t, emptyQueue(CAP, m === "circular"), [10, 20, 30]);
    setMode(m);
    setState(s);
    setRun(idleRun(s, m === "circular" ? t("الطابور الدائري يعيد استخدام المساحة عبر الالتفاف (rear = (rear+1) % capacity).", "The circular queue reuses space by wrapping around (rear = (rear+1) % capacity).") : t("الطابور الخطي: front و rear يتقدّمان للأمام فقط، وقد تُهدر مساحة بعد front.", "The linear queue: front and rear only move forward, and space after front may be wasted.")));
  };

  const val = () => {
    const v = parseInt(value, 10);
    return Number.isNaN(v) ? Math.floor(Math.random() * 90) + 10 : v;
  };
  const doEnq = () => { const r = enqueue(t, state, val()); setState(r.state); setRun(r); };
  const doDeq = () => { const r = dequeue(t, state); setState(r.state); setRun(r); };
  const reset = () => { const s = applyValues(t, emptyQueue(CAP, mode === "circular"), [10, 20, 30]); setState(s); setRun(idleRun(s, t("أُعيد الطابور.", "The queue was reset."))); };
  const clear = () => { const s = emptyQueue(CAP, mode === "circular"); setState(s); setRun(idleRun(s, t("الطابور فارغ.", "The queue is empty."))); };

  const busy = playing;
  const actionBtn =
    "rounded-xl border border-border bg-surface px-3 py-2 text-sm font-semibold text-slate-200 transition-all hover:border-brand-500/50 hover:bg-surface-2 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 active:scale-95";

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_330px]">
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          <button onClick={() => switchMode("circular")} className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${mode === "circular" ? "bg-gradient-to-l from-brand-500 to-accent-500 text-white shadow-lg shadow-brand-600/30" : "border border-border bg-surface text-slate-300 hover:text-white"}`}>{t("طابور دائري", "Circular queue")}</button>
          <button onClick={() => switchMode("linear")} className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${mode === "linear" ? "bg-gradient-to-l from-brand-500 to-accent-500 text-white shadow-lg shadow-brand-600/30" : "border border-border bg-surface text-slate-300 hover:text-white"}`}>{t("طابور خطي", "Linear queue")}</button>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-border bg-bg-soft/80 p-6">
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
          <div className="relative">
            {frame.circular ? <CircularLayout frame={frame} /> : <LinearLayout frame={frame} />}
            <div className="mt-4 flex justify-center gap-6 text-xs text-slate-400">
              <span>{t("الحجم:", "Size:")} <span className="font-mono font-bold text-white">{frame.count}</span> / {frame.capacity}</span>
              <span>front = <span className="font-mono font-bold text-accent-400">{frame.count ? frame.front : "-"}</span></span>
              <span>rear = <span className="font-mono font-bold text-brand-300">{frame.count ? frame.rear : "-"}</span></span>
            </div>
          </div>
        </div>

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

        <div className="rounded-2xl border border-border bg-surface/70 p-4">
          <div className="flex flex-wrap items-end gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-slate-400">{t("القيمة", "Value")}</span>
              <input type="number" value={value} onChange={(e) => setValue(e.target.value)} className="w-28 rounded-lg border border-border bg-bg-soft px-3 py-2 font-mono text-sm text-white outline-none focus:border-brand-500" />
            </label>
            <button className={actionBtn} disabled={busy} onClick={doEnq}>{t("Enqueue (إضافة)", "Enqueue")}</button>
            <button className={actionBtn} disabled={busy} onClick={doDeq}>{t("Dequeue (إخراج)", "Dequeue")}</button>
            <button className={actionBtn} disabled={busy} onClick={reset}>{t("إعادة تعيين", "Reset")}</button>
            <button className={actionBtn} disabled={busy} onClick={clear}>{t("تفريغ", "Clear")}</button>
          </div>
        </div>
      </div>

      <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <PseudocodePanel code={run.code} activeLine={frame.codeLine} />
        <div className="rounded-2xl border border-border bg-surface/70 p-4 text-sm text-slate-400">
          <h4 className="mb-2 font-bold text-white">{frame.circular ? t("الطابور الدائري", "Circular queue") : t("الطابور الخطي", "Linear queue")}</h4>
          <p className="leading-relaxed">
            {frame.circular
              ? t("يلتفّ rear و front حول المصفوفة باستخدام باقي القسمة % capacity، فيُعاد استخدام الخلايا الفارغة بكفاءة دون إزاحة العناصر.", "rear and front wrap around the array using modulo % capacity, so empty cells are reused efficiently without shifting elements.")
              : t("front و rear يتقدّمان للأمام فقط. بعد عدّة dequeue تبقى خلايا فارغة في البداية لا يُعاد استخدامها — وهذا عيب الطابور الخطي.", "front and rear only move forward. After several dequeues, empty cells remain at the start and are not reused — the linear queue's drawback.")}
          </p>
          <p className="mt-2">{t("العمليتان enqueue و dequeue في زمن ثابت", "Both enqueue and dequeue run in constant time")} <ComplexityBadge value="O(1)" size="sm" />.</p>
        </div>
      </div>
    </div>
  );
}

function LinearLayout({ frame }: { frame: QueueFrame }) {
  return (
    <div dir="ltr" className="flex flex-col items-center">
      <div className="flex gap-2">
        {frame.cells.map((v, i) => {
          const c = cellStyle(i, frame);
          const isFront = frame.count > 0 && i === frame.front;
          const isRear = frame.count > 0 && i === frame.rear;
          return (
            <div key={i} className="flex flex-col items-center">
              <div className="mb-1 flex h-4 gap-1 text-[10px] font-bold">
                {isFront && <span className="text-accent-400">front</span>}
                {isRear && <span className="text-brand-300">rear</span>}
              </div>
              <motion.div
                animate={{ borderColor: c.border, backgroundColor: c.bg, color: c.text, scale: frame.enter === i ? [0.6, 1] : 1 }}
                className="grid h-14 w-14 place-items-center rounded-xl border-2 font-mono text-lg font-bold"
              >
                {v ?? ""}
              </motion.div>
              <span className="mt-1 font-mono text-[10px] text-slate-600">{i}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CircularLayout({ frame }: { frame: QueueFrame }) {
  const size = 300;
  const R = 110;
  const cx = size / 2;
  const cy = size / 2;
  const n = frame.capacity;
  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <div className="absolute inset-0 grid place-items-center">
        <span className="text-xs font-bold text-slate-500">Circular<br />Queue</span>
      </div>
      {frame.cells.map((v, i) => {
        const angle = (-90 + (i * 360) / n) * (Math.PI / 180);
        const x = cx + R * Math.cos(angle);
        const y = cy + R * Math.sin(angle);
        const c = cellStyle(i, frame);
        const isFront = frame.count > 0 && i === frame.front;
        const isRear = frame.count > 0 && i === frame.rear;
        const lx = cx + (R + 38) * Math.cos(angle);
        const ly = cy + (R + 38) * Math.sin(angle);
        return (
          <div key={i}>
            <motion.div
              animate={{ borderColor: c.border, backgroundColor: c.bg, color: c.text, scale: frame.enter === i ? [0.6, 1] : 1 }}
              className="absolute grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-xl border-2 font-mono text-base font-bold"
              style={{ left: x, top: y }}
            >
              {v ?? ""}
              <span className="absolute -bottom-4 font-mono text-[9px] text-slate-600">{i}</span>
            </motion.div>
            {(isFront || isRear) && (
              <div className="absolute -translate-x-1/2 -translate-y-1/2 text-[10px] font-bold" style={{ left: lx, top: ly }}>
                {isFront && <span className="text-accent-400">front</span>}
                {isFront && isRear && <span className="text-slate-500"> / </span>}
                {isRear && <span className="text-brand-300">rear</span>}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function applyValues(t: TFunction, s: QueueState, values: number[]): QueueState {
  let cur = s;
  for (const v of values) cur = enqueue(t, cur, v).state;
  return cur;
}
