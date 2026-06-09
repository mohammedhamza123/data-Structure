import { motion } from "framer-motion";
import { PageHeader } from "../components/PageHeader";
import { ComplexityBadge } from "../components/ComplexityBadge";
import { BinarySearchVisualizer } from "../visualizers/binarySearch/BinarySearchVisualizer";
import type { ComplexityClass } from "../data/complexity";
import { useLang } from "../i18n";

export function BinarySearchPage() {
  const { t, dir } = useLang();
  const table: { name: string; time: ComplexityClass; note: string }[] = [
    { name: t("البحث الخطي", "Linear search"), time: "O(n)", note: t("يفحص كل عنصر، لا يشترط الترتيب", "Checks every element, no sorting required") },
    { name: t("البحث الثنائي", "Binary search"), time: "O(log n)", note: t("يقصي نصف العناصر كل خطوة، يشترط الترتيب", "Eliminates half each step, requires a sorted array") },
  ];

  return (
    <div>
      <PageHeader
        eyebrow={t("الخوارزميات", "Algorithms")}
        title={t("البحث الثنائي", "Binary Search")}
        description={t(
          "خوارزمية بحث فعّالة على المصفوفات المرتّبة. في كل خطوة نقارن العنصر الأوسط بالهدف ونستبعد نصف المصفوفة، فتتقلّص مساحة البحث لوغاريتمياً. تابع حركة المؤشرات lo و mid و hi خطوة بخطوة.",
          "An efficient search algorithm for sorted arrays. At each step we compare the middle element to the target and discard half of the array, shrinking the search space logarithmically. Follow the lo, mid, and hi pointers step by step.",
        )}
      />

      <BinarySearchVisualizer />

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-extrabold text-white">{t("مقارنة طرق البحث", "Search methods comparison")}</h2>
        <div className="overflow-hidden rounded-2xl border border-border">
          <table className={`w-full text-sm ${dir === "rtl" ? "text-right" : "text-left"}`}>
            <thead className="bg-surface-2 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-bold">{t("الطريقة", "Method")}</th>
                <th className="px-4 py-3 font-bold">{t("التعقيد الزمني", "Time complexity")}</th>
                <th className="px-4 py-3 font-bold">{t("الملاحظة", "Note")}</th>
              </tr>
            </thead>
            <tbody>
              {table.map((row, i) => (
                <motion.tr
                  key={row.name}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="border-t border-border bg-surface/40"
                >
                  <td className="px-4 py-3 font-semibold text-white">{row.name}</td>
                  <td className="px-4 py-3"><ComplexityBadge value={row.time} size="sm" /></td>
                  <td className="px-4 py-3 text-slate-400">{row.note}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
