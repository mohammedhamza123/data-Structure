import { motion } from "framer-motion";
import { PageHeader } from "../components/PageHeader";
import { StackVisualizer } from "../visualizers/stack/StackVisualizer";

const uses = [
  { title: "مكدس الاستدعاءات", desc: "تتبّع الدوال أثناء الاستدعاء الذاتي (call stack)." },
  { title: "التراجع (Undo)", desc: "حفظ الحالات السابقة للرجوع إليها." },
  { title: "تقييم التعابير", desc: "تحويل وحساب التعابير الحسابية (postfix)." },
  { title: "تتبّع المسار", desc: "DFS في الرسوم البيانية والمتاهات." },
];

export function StackPage() {
  return (
    <div>
      <PageHeader
        eyebrow="هياكل البيانات"
        title="المكدس (Stack)"
        description="بنية بيانات تعمل بمبدأ LIFO: آخر عنصر يدخل هو أول من يخرج. الإضافة والسحب يتمان من القمة فقط، وكلاهما في زمن ثابت."
      />
      <StackVisualizer />
      <section className="mt-10">
        <h2 className="mb-4 text-xl font-extrabold text-white">استخدامات المكدس</h2>
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
