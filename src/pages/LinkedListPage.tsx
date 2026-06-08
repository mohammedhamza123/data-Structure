import { motion } from "framer-motion";
import { PageHeader } from "../components/PageHeader";
import { ComplexityBadge } from "../components/ComplexityBadge";
import { LinkedListVisualizer } from "../visualizers/linkedList/LinkedListVisualizer";
import type { ComplexityClass } from "../data/complexity";
import { useLang } from "../i18n";

export function LinkedListPage() {
  const { t, dir } = useLang();
  const opsTable: { name: string; time: ComplexityClass; note: string }[] = [
    { name: t("إضافة للبداية", "Insert at head"), time: "O(1)", note: t("تعديل مؤشر الرأس فقط", "Update the head pointer only") },
    { name: t("إضافة للنهاية", "Insert at tail"), time: "O(n)", note: t("تتطلب المرور حتى آخر عقدة", "Requires traversing to the last node") },
    { name: t("حذف البداية", "Delete head"), time: "O(1)", note: t("تحريك الرأس للعقدة التالية", "Move head to the next node") },
    { name: t("حذف النهاية", "Delete tail"), time: "O(n)", note: t("الوصول لما قبل الأخيرة", "Reach the node before last") },
    { name: t("البحث", "Search"), time: "O(n)", note: t("مقارنة خطية للعناصر", "Linear comparison of elements") },
    { name: t("عكس القائمة", "Reverse list"), time: "O(n)", note: t("ثلاثة مؤشرات بمرور واحد", "Three pointers in a single pass") },
    { name: t("ترتيب الدمج", "Merge sort"), time: "O(n log n)", note: t("تقسيم بمؤشرَي slow/fast ثم دمج مرتّب", "Split with slow/fast pointers, then merge in order") },
  ];

  return (
    <div>
      <PageHeader
        eyebrow={t("هياكل البيانات", "Data Structures")}
        title={t("القوائم المرتبطة المفردة", "Singly Linked Lists")}
        description={t(
          "سلسلة من العقد، كل عقدة تحمل قيمة ومؤشراً للعقدة التالية. جرّب العمليات وشاهد حركة المؤشرات خطوة بخطوة مع الكود الزائف المقابل.",
          "A chain of nodes, each holding a value and a pointer to the next node. Try the operations and watch the pointers move step by step alongside the matching pseudocode."
        )}
      />

      <LinkedListVisualizer />

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-extrabold text-white">{t("ملخّص التعقيد الزمني", "Time complexity summary")}</h2>
        <div className="overflow-hidden rounded-2xl border border-border">
          <table className={`w-full text-sm ${dir === "rtl" ? "text-right" : "text-left"}`}>
            <thead className="bg-surface-2 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-bold">{t("العملية", "Operation")}</th>
                <th className="px-4 py-3 font-bold">{t("التعقيد الزمني", "Time complexity")}</th>
                <th className="px-4 py-3 font-bold">{t("الملاحظة", "Note")}</th>
              </tr>
            </thead>
            <tbody>
              {opsTable.map((row, i) => (
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
