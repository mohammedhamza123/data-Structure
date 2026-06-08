import { motion, AnimatePresence } from "framer-motion";
import { NODE_R, type TreeFrame } from "./engine";

const colors = {
  default: { fill: "#1c2440", border: "#6366f1", text: "#c7d2fe", glow: "rgba(99,102,241,0.3)" },
  active: { fill: "rgba(34,211,238,0.2)", border: "#22d3ee", text: "#a5f3fc", glow: "rgba(34,211,238,0.55)" },
  compare: { fill: "rgba(245,158,11,0.2)", border: "#f59e0b", text: "#fde68a", glow: "rgba(245,158,11,0.55)" },
  swap: { fill: "rgba(236,72,153,0.22)", border: "#ec4899", text: "#fbcfe8", glow: "rgba(236,72,153,0.55)" },
  found: { fill: "rgba(52,211,153,0.22)", border: "#34d399", text: "#bbf7d0", glow: "rgba(52,211,153,0.55)" },
};

type Kind = keyof typeof colors;

function kindOf(id: string, f: TreeFrame): Kind {
  if (f.found.includes(id) || f.sorted.includes(id)) return "found";
  if (f.swap.includes(id)) return "swap";
  if (f.active.includes(id)) return "active";
  if (f.compare.includes(id)) return "compare";
  return "default";
}

export function TreeCanvas({ frame, width, height }: { frame: TreeFrame; width: number; height: number }) {
  return (
    <div className="relative overflow-auto rounded-2xl border border-border bg-bg-soft/80 p-4">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
      <div className="relative mx-auto" style={{ width, height, minWidth: width }}>
        <svg className="absolute inset-0" width={width} height={height}>
          {frame.edges.map((e) => {
            const highlight = frame.active.includes(e.to) || frame.compare.includes(e.to) || frame.found.includes(e.to);
            return (
              <motion.line
                key={e.id}
                initial={{ opacity: 0 }}
                animate={{ x1: e.x1, y1: e.y1, x2: e.x2, y2: e.y2, opacity: 1, stroke: highlight ? "#22d3ee" : "#334067", strokeWidth: highlight ? 3 : 2 }}
                transition={{ type: "spring", stiffness: 200, damping: 26 }}
              />
            );
          })}
        </svg>

        <AnimatePresence>
          {frame.nodes.map((n) => {
            const k = kindOf(n.id, frame);
            const c = colors[k];
            return (
              <motion.div
                key={n.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  left: n.cx - NODE_R,
                  top: n.cy - NODE_R,
                  borderColor: c.border,
                  backgroundColor: c.fill,
                  boxShadow: `0 0 0 1px ${c.border}55, 0 0 22px -2px ${c.glow}`,
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
                className="absolute grid place-items-center rounded-full border-2 font-mono text-sm font-bold"
                style={{ width: NODE_R * 2, height: NODE_R * 2, color: c.text }}
              >
                {n.value}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function ArrayRow({ frame }: { frame: TreeFrame }) {
  if (!frame.array) return null;
  return (
    <div className="rounded-2xl border border-border bg-surface/70 p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-bold text-slate-400">تمثيل المصفوفة (الشجرة الكاملة)</span>
        <span className="font-mono text-[11px] text-slate-500">الأبناء: 2i+1، 2i+2</span>
      </div>
      <div dir="ltr" className="flex flex-wrap gap-1.5">
        {frame.array.map((cell, i) => {
          const bg = cell.sorted ? "#34d399" : cell.swap ? "#ec4899" : cell.active ? "#22d3ee" : cell.heap ? "#1c2440" : "#0f1424";
          const border = cell.sorted ? "#34d399" : cell.swap ? "#ec4899" : cell.active ? "#22d3ee" : "#283153";
          const text = cell.sorted || cell.swap || cell.active ? "#0a0e1a" : "#e2e8f0";
          return (
            <div key={cell.id} className="flex flex-col items-center">
              <motion.div
                layout
                animate={{ backgroundColor: bg, borderColor: border, color: text }}
                className="grid h-10 w-10 place-items-center rounded-lg border-2 font-mono text-sm font-bold"
              >
                {cell.value}
              </motion.div>
              <span className="mt-1 font-mono text-[10px] text-slate-600">{i}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
