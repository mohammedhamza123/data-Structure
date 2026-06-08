import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "../i18n";

export function usePlayer(total: number, baseDelay = 850) {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1.5);

  useEffect(() => {
    if (!playing) return;
    if (idx >= total - 1) {
      setPlaying(false);
      return;
    }
    const t = setTimeout(() => setIdx((i) => i + 1), baseDelay / speed);
    return () => clearTimeout(t);
  }, [playing, idx, total, speed, baseDelay]);

  const toggle = () => {
    if (idx >= total - 1) {
      setIdx(0);
      setPlaying(true);
    } else setPlaying((p) => !p);
  };

  return { idx, setIdx, playing, setPlaying, speed, setSpeed, toggle };
}

type BarProps = {
  idx: number;
  total: number;
  playing: boolean;
  speed: number;
  onPrev: () => void;
  onNext: () => void;
  onToggle: () => void;
  onSpeed: (v: number) => void;
};

const btn =
  "rounded-xl border border-border bg-surface px-3 py-2 text-sm font-semibold text-slate-200 transition-all hover:border-brand-500/50 hover:bg-surface-2 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 active:scale-95";

export function PlaybackBar({ idx, total, playing, speed, onPrev, onNext, onToggle, onSpeed }: BarProps) {
  const { t } = useLang();
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-1.5">
        <button onClick={onPrev} disabled={playing || idx === 0} className={btn} aria-label={t("السابق", "Previous")}>
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h2v14H6zM20 5v14l-9-7z" /></svg>
        </button>
        <button onClick={onToggle} className="rounded-xl bg-gradient-to-l from-brand-500 to-accent-500 px-4 py-2 text-white shadow-lg shadow-brand-600/30 transition-transform hover:scale-105">
          {playing ? (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z" /></svg>
          ) : (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M7 5v14l12-7z" /></svg>
          )}
        </button>
        <button onClick={onNext} disabled={playing || idx >= total - 1} className={btn} aria-label={t("التالي", "Next")}>
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M16 5h2v14h-2zM4 5l9 7-9 7z" /></svg>
        </button>
      </div>

      <div className="flex flex-1 items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
          <motion.div className="h-full rounded-full bg-gradient-to-l from-brand-500 to-accent-500" animate={{ width: `${((idx + 1) / total) * 100}%` }} />
        </div>
        <span className="font-mono text-xs text-slate-500">{idx + 1}/{total}</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500">{t("السرعة", "Speed")}</span>
        <input type="range" min={0.5} max={4} step={0.5} value={speed} onChange={(e) => onSpeed(Number(e.target.value))} className="w-20 accent-brand-500" />
        <span className="w-8 font-mono text-xs text-slate-300">{speed}x</span>
      </div>
    </div>
  );
}

export function PseudocodePanel({ code, activeLine }: { code: string[]; activeLine: number }) {
  const { t } = useLang();
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-bg-soft">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <span className="text-sm font-bold text-white">{t("الكود الزائف", "Pseudocode")}</span>
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-danger/70" />
          <span className="h-3 w-3 rounded-full bg-warning/70" />
          <span className="h-3 w-3 rounded-full bg-success/70" />
        </div>
      </div>
      <div dir="ltr" className="p-3 font-mono text-[12.5px] leading-relaxed">
        {code.map((line, i) => (
          <motion.div
            key={i}
            animate={{
              backgroundColor: activeLine === i ? "rgba(99,102,241,0.18)" : "rgba(0,0,0,0)",
              color: activeLine === i ? "#c7d2fe" : "#94a3b8",
            }}
            className="flex gap-3 rounded-md px-2 py-1"
          >
            <span className="select-none text-slate-600">{String(i + 1).padStart(2, "0")}</span>
            <span className="whitespace-pre-wrap">{line}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
