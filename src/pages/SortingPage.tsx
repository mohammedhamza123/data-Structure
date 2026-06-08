import { motion } from "framer-motion";
import { PageHeader } from "../components/PageHeader";
import { ComplexityBadge } from "../components/ComplexityBadge";
import { SortingVisualizer } from "../visualizers/sorting/SortingVisualizer";
import type { ComplexityClass } from "../data/complexity";
import { useLang } from "../i18n";

export function SortingPage() {
  const { t, dir } = useLang();
  const table: { name: string; best: ComplexityClass; avg: ComplexityClass; worst: ComplexityClass; space: ComplexityClass; stable: string }[] = [
    { name: t("الفقاعات", "Bubble"), best: "O(n)", avg: "O(n²)", worst: "O(n²)", space: "O(1)", stable: t("نعم", "Yes") },
    { name: t("الاختيار", "Selection"), best: "O(n²)", avg: "O(n²)", worst: "O(n²)", space: "O(1)", stable: t("لا", "No") },
    { name: t("الإدراج", "Insertion"), best: "O(n)", avg: "O(n²)", worst: "O(n²)", space: "O(1)", stable: t("نعم", "Yes") },
    { name: t("السريع", "Quick"), best: "O(n log n)", avg: "O(n log n)", worst: "O(n²)", space: "O(log n)", stable: t("لا", "No") },
    { name: t("الدمج", "Merge"), best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)", space: "O(n)", stable: t("نعم", "Yes") },
  ];

  return (
    <div>
      <PageHeader
        eyebrow={t("الخوارزميات", "Algorithms")}
        title={t("خوارزميات الترتيب", "Sorting Algorithms")}
        description={t(
          "شاهد كيف ترتّب كل خوارزمية المصفوفة خطوة بخطوة. الأشرطة تتلوّن أثناء المقارنة والتبديل، مع كود زائف متزامن وعدّادات حيّة للمقارنات والتبديلات.",
          "Watch how each algorithm sorts the array step by step. Bars change color during comparisons and swaps, with synchronized pseudocode and live counters for comparisons and swaps."
        )}
      />

      <SortingVisualizer />

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-extrabold text-white">{t("مقارنة شاملة", "Full comparison")}</h2>
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className={`w-full text-sm ${dir === "rtl" ? "text-right" : "text-left"}`}>
            <thead className="bg-surface-2 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-bold">{t("الخوارزمية", "Algorithm")}</th>
                <th className="px-4 py-3 font-bold">{t("الأفضل", "Best")}</th>
                <th className="px-4 py-3 font-bold">{t("المتوسط", "Average")}</th>
                <th className="px-4 py-3 font-bold">{t("الأسوأ", "Worst")}</th>
                <th className="px-4 py-3 font-bold">{t("المساحة", "Space")}</th>
                <th className="px-4 py-3 font-bold">{t("مستقرّة", "Stable")}</th>
              </tr>
            </thead>
            <tbody>
              {table.map((row, i) => (
                <motion.tr
                  key={row.name}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="border-t border-border bg-surface/40"
                >
                  <td className="px-4 py-3 font-semibold text-white">{row.name}</td>
                  <td className="px-4 py-3"><ComplexityBadge value={row.best} size="sm" /></td>
                  <td className="px-4 py-3"><ComplexityBadge value={row.avg} size="sm" /></td>
                  <td className="px-4 py-3"><ComplexityBadge value={row.worst} size="sm" /></td>
                  <td className="px-4 py-3"><ComplexityBadge value={row.space} size="sm" /></td>
                  <td className="px-4 py-3 text-slate-400">{row.stable}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
