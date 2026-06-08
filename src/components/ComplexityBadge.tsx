import { complexityMeta, type ComplexityClass } from "../data/complexity";

type Props = {
  value: ComplexityClass;
  size?: "sm" | "md";
  showName?: boolean;
};

export function ComplexityBadge({ value, size = "md", showName = false }: Props) {
  const meta = complexityMeta[value];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg font-mono font-semibold whitespace-nowrap ${
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm"
      }`}
      style={{ color: meta.color, backgroundColor: meta.bg, border: `1px solid ${meta.color}33` }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: meta.color }} />
      {meta.label}
      {showName && <span className="opacity-70 font-sans text-xs">· {meta.name}</span>}
    </span>
  );
}
