import { motion } from "framer-motion";
import { PageHeader } from "../components/PageHeader";
import { ComplexityBadge } from "../components/ComplexityBadge";
import { LinkedListVisualizer } from "../visualizers/linkedList/LinkedListVisualizer";
import type { ComplexityClass } from "../data/complexity";

const opsTable: { name: string; time: ComplexityClass; note: string }[] = [
  { name: "إضافة للبداية", time: "O(1)", note: "تعديل مؤشر الرأس فقط" },
  { name: "إضافة للنهاية", time: "O(n)", note: "تتطلب المرور حتى آخر عقدة" },
  { name: "حذف البداية", time: "O(1)", note: "تحريك الرأس للعقدة التالية" },
  { name: "حذف النهاية", time: "O(n)", note: "الوصول لما قبل الأخيرة" },
  { name: "البحث", time: "O(n)", note: "مقارنة خطية للعناصر" },
  { name: "عكس القائمة", time: "O(n)", note: "ثلاثة مؤشرات بمرور واحد" },
];

export function LinkedListPage() {
  return (
    <div>
      <PageHeader
        eyebrow="هياكل البيانات"
        title="القوائم المرتبطة المفردة"
        description="سلسلة من العقد، كل عقدة تحمل قيمة ومؤشراً للعقدة التالية. جرّب العمليات وشاهد حركة المؤشرات خطوة بخطوة مع الكود الزائف المقابل."
      />

      <LinkedListVisualizer />

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-extrabold text-white">ملخّص التعقيد الزمني</h2>
        <div className="overflow-hidden rounded-2xl border border-border">
          <table className="w-full text-right text-sm">
            <thead className="bg-surface-2 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-bold">العملية</th>
                <th className="px-4 py-3 font-bold">التعقيد الزمني</th>
                <th className="px-4 py-3 font-bold">الملاحظة</th>
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
