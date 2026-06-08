import { motion } from "framer-motion";
import { PageHeader } from "../components/PageHeader";
import { ComplexityBadge } from "../components/ComplexityBadge";
import { SortingVisualizer } from "../visualizers/sorting/SortingVisualizer";
import type { ComplexityClass } from "../data/complexity";

const table: { name: string; best: ComplexityClass; avg: ComplexityClass; worst: ComplexityClass; space: ComplexityClass; stable: string }[] = [
  { name: "الفقاعات", best: "O(n)", avg: "O(n²)", worst: "O(n²)", space: "O(1)", stable: "نعم" },
  { name: "الاختيار", best: "O(n²)", avg: "O(n²)", worst: "O(n²)", space: "O(1)", stable: "لا" },
  { name: "الإدراج", best: "O(n)", avg: "O(n²)", worst: "O(n²)", space: "O(1)", stable: "نعم" },
  { name: "السريع", best: "O(n log n)", avg: "O(n log n)", worst: "O(n²)", space: "O(log n)", stable: "لا" },
  { name: "الدمج", best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)", space: "O(n)", stable: "نعم" },
];

export function SortingPage() {
  return (
    <div>
      <PageHeader
        eyebrow="الخوارزميات"
        title="خوارزميات الترتيب"
        description="شاهد كيف ترتّب كل خوارزمية المصفوفة خطوة بخطوة. الأشرطة تتلوّن أثناء المقارنة والتبديل، مع كود زائف متزامن وعدّادات حيّة للمقارنات والتبديلات."
      />

      <SortingVisualizer />

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-extrabold text-white">مقارنة شاملة</h2>
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-right text-sm">
            <thead className="bg-surface-2 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-bold">الخوارزمية</th>
                <th className="px-4 py-3 font-bold">الأفضل</th>
                <th className="px-4 py-3 font-bold">المتوسط</th>
                <th className="px-4 py-3 font-bold">الأسوأ</th>
                <th className="px-4 py-3 font-bold">المساحة</th>
                <th className="px-4 py-3 font-bold">مستقرّة</th>
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
