type Props = {
  title?: string;
  code: string;
};

export function CppCodePanel({ title, code }: Props) {
  const lines = code.trim().split("\n");
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-bg-soft">
      {title && (
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <span className="text-sm font-bold text-white">{title}</span>
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-danger/70" />
            <span className="h-3 w-3 rounded-full bg-warning/70" />
            <span className="h-3 w-3 rounded-full bg-success/70" />
          </div>
        </div>
      )}
      <div dir="ltr" className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed">
        {lines.map((line, i) => (
          <div key={i} className="flex gap-3 text-slate-300">
            <span className="select-none text-slate-600">{String(i + 1).padStart(2, "0")}</span>
            <span className="whitespace-pre">{line || " "}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
