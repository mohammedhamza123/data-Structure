import { motion } from "framer-motion";
import { PageHeader } from "../components/PageHeader";
import { StackVisualizer } from "../visualizers/stack/StackVisualizer";
import { useLang } from "../i18n";

export function StackPage() {
  const { t } = useLang();
  const uses = [
    { title: t("مكدس الاستدعاءات", "Call stack"), desc: t("تتبّع الدوال أثناء الاستدعاء الذاتي (call stack).", "Tracking function calls during recursion (call stack).") },
    { title: t("التراجع (Undo)", "Undo"), desc: t("حفظ الحالات السابقة للرجوع إليها.", "Storing previous states to revert to them.") },
    { title: t("تقييم التعابير", "Expression evaluation"), desc: t("تحويل وحساب التعابير الحسابية (postfix).", "Converting and evaluating arithmetic expressions (postfix).") },
    { title: t("تتبّع المسار", "Path tracking"), desc: t("DFS في الرسوم البيانية والمتاهات.", "DFS in graphs and mazes.") },
  ];

  return (
    <div>
      <PageHeader
        eyebrow={t("هياكل البيانات", "Data Structures")}
        title={t("المكدس (Stack)", "Stack")}
        description={t(
          "بنية بيانات تعمل بمبدأ LIFO: آخر عنصر يدخل هو أول من يخرج. الإضافة والسحب يتمان من القمة فقط، وكلاهما في زمن ثابت.",
          "A LIFO data structure: the last element in is the first out. Push and pop happen at the top only, both in constant time."
        )}
      />
      <StackVisualizer />
      <section className="mt-10">
        <h2 className="mb-4 text-xl font-extrabold text-white">{t("استخدامات المكدس", "Stack use cases")}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {uses.map((u, i) => (
            <motion.div key={u.title} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="rounded-2xl border border-border bg-surface/70 p-5">
              <h3 className="font-bold text-brand-300">{u.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{u.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
