import { motion } from "framer-motion";
import { PageHeader } from "../components/PageHeader";
import { RecursionVisualizer } from "../visualizers/recursion/RecursionVisualizer";

const types = [
  { name: "خطي (Linear)", color: "#818cf8", desc: "كل استدعاء يولّد استدعاءً واحداً فقط، مثل المضروب والأس." },
  { name: "ذيلي (Tail)", color: "#34d399", desc: "الاستدعاء الذاتي هو آخر عملية، فلا حاجة لحفظ سياق ويمكن تحويله لحلقة." },
  { name: "شجري/ثنائي (Tree)", color: "#fbbf24", desc: "كل استدعاء يولّد عدة استدعاءات، مثل فيبوناتشي — يؤدي لتعقيد أُسّي غالباً." },
  { name: "متبادل/غير مباشر (Mutual)", color: "#22d3ee", desc: "دالتان تستدعيان بعضهما بالتناوب، مثل isEven/isOdd." },
  { name: "متداخل (Nested)", color: "#ec4899", desc: "استدعاء يظهر داخل وسيط استدعاء آخر، مثل دالة أكرمان." },
  { name: "الحالة الأساسية (Base Case)", color: "#a78bfa", desc: "شرط التوقف الذي يمنع الاستدعاء اللانهائي — لا بد منه في كل استدعاء ذاتي." },
];

export function RecursionPage() {
  return (
    <div>
      <PageHeader
        eyebrow="الخوارزميات"
        title="الاستدعاء الذاتي (Recursion)"
        description="استكشف جميع حالات الاستدعاء الذاتي — الخطي، الذيلي، الشجري، المتبادل، والمتداخل — وشاهد مكدس الاستدعاءات ينمو ويتقلّص خطوة بخطوة مع عودة كل نتيجة."
      />
      <RecursionVisualizer />

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-extrabold text-white">حالات الاستدعاء الذاتي</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {types.map((t, i) => (
            <motion.div key={t.name} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="rounded-2xl border border-border bg-surface/70 p-5">
              <div className="mb-2 flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: t.color }} />
                <h3 className="font-bold text-white">{t.name}</h3>
              </div>
              <p className="text-sm leading-relaxed text-slate-400">{t.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
