import { motion, AnimatePresence } from "framer-motion";

type Props = {
  value: number;
  index: number;
  isLast: boolean;
  state: "default" | "entering" | "highlight" | "fading";
  pointer: boolean;
};

const palette = {
  default: { border: "#283153", bg: "#1c2440", text: "#e2e8f0", dot: "#64748b" },
  entering: { border: "#6366f1", bg: "rgba(99,102,241,0.18)", text: "#c7d2fe", dot: "#818cf8" },
  highlight: { border: "#34d399", bg: "rgba(52,211,153,0.18)", text: "#bbf7d0", dot: "#34d399" },
  fading: { border: "#f87171", bg: "rgba(248,113,113,0.16)", text: "#fecaca", dot: "#f87171" },
};

export function LinkedListNode({ value, index, isLast, state, pointer }: Props) {
  const c = palette[state];
  return (
    <motion.div layout="position" transition={{ type: "spring", stiffness: 320, damping: 30 }} className="flex items-center">
      <div className="relative flex flex-col items-center">
        <div className="relative flex h-10 items-end justify-center">
          <AnimatePresence>
            {pointer && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="absolute bottom-0 flex flex-col items-center"
              >
                <span className="rounded-md bg-accent-500/20 px-2 py-0.5 font-mono text-[11px] font-bold text-accent-400">
                  curr
                </span>
                <svg className="h-3 w-3 text-accent-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 16 4 8h16z" />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          initial={state === "entering" ? { scale: 0.4, opacity: 0 } : false}
          animate={{
            scale: 1,
            opacity: state === "fading" ? 0.85 : 1,
            borderColor: c.border,
            backgroundColor: c.bg,
            boxShadow: pointer ? `0 0 0 3px ${c.border}44, 0 10px 30px -10px ${c.border}` : "none",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          className="flex h-14 overflow-hidden rounded-xl border-2"
        >
          <div className="grid w-14 place-items-center font-mono text-lg font-bold" style={{ color: c.text }}>
            {value}
          </div>
          <div className="grid w-6 place-items-center border-r-0 border-l-2" style={{ borderColor: c.border, backgroundColor: "rgba(0,0,0,0.18)" }}>
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c.dot }} />
          </div>
        </motion.div>

        <span className="mt-1.5 font-mono text-[11px] text-slate-500">[{index}]</span>
      </div>

      <div className="flex w-10 items-center justify-center pb-6">
        <svg className="h-4 w-full" viewBox="0 0 40 16" preserveAspectRatio="none">
          <defs>
            <marker id={`arrow-${state}`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0 0L6 3L0 6z" fill={isLast ? "#475569" : c.dot} />
            </marker>
          </defs>
          <line x1="2" y1="8" x2="32" y2="8" stroke={isLast ? "#475569" : c.dot} strokeWidth="2" markerEnd={`url(#arrow-${state})`} />
        </svg>
      </div>
    </motion.div>
  );
}
