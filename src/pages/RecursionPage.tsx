import { motion } from "framer-motion";
import { PageHeader } from "../components/PageHeader";
import { RecursionVisualizer } from "../visualizers/recursion/RecursionVisualizer";
import { useLang } from "../i18n";

export function RecursionPage() {
  const { t } = useLang();
  const types = [
    { name: t("خطي (Linear)", "Linear"), color: "#818cf8", desc: t("كل استدعاء يولّد استدعاءً واحداً فقط، مثل المضروب والأس.", "Each call makes exactly one further call, like factorial and power.") },
    { name: t("ذيلي (Tail)", "Tail"), color: "#34d399", desc: t("الاستدعاء الذاتي هو آخر عملية، فلا حاجة لحفظ سياق ويمكن تحويله لحلقة.", "The recursive call is the last operation, so no context is kept and it can become a loop.") },
    { name: t("شجري/ثنائي (Tree)", "Tree"), color: "#fbbf24", desc: t("كل استدعاء يولّد عدة استدعاءات، مثل فيبوناتشي — يؤدي لتعقيد أُسّي غالباً.", "Each call spawns several calls, like Fibonacci — often exponential complexity.") },
    { name: t("متبادل/غير مباشر (Mutual)", "Mutual"), color: "#22d3ee", desc: t("دالتان تستدعيان بعضهما بالتناوب، مثل isEven/isOdd.", "Two functions call each other alternately, like isEven/isOdd.") },
    { name: t("متداخل (Nested)", "Nested"), color: "#ec4899", desc: t("استدعاء يظهر داخل وسيط استدعاء آخر، مثل دالة أكرمان.", "A call appears inside the argument of another call, like the Ackermann function.") },
    { name: t("الحالة الأساسية (Base Case)", "Base Case"), color: "#a78bfa", desc: t("شرط التوقف الذي يمنع الاستدعاء اللانهائي — لا بد منه في كل استدعاء ذاتي.", "The stopping condition that prevents infinite recursion — required in every recursive function.") },
  ];

  return (
    <div>
      <PageHeader
        eyebrow={t("الخوارزميات", "Algorithms")}
        title={t("الاستدعاء الذاتي (Recursion)", "Recursion")}
        description={t(
          "استكشف جميع حالات الاستدعاء الذاتي — الخطي، الذيلي، الشجري، المتبادل، والمتداخل — وشاهد مكدس الاستدعاءات ينمو ويتقلّص خطوة بخطوة مع عودة كل نتيجة.",
          "Explore all recursion cases — linear, tail, tree, mutual, and nested — and watch the call stack grow and shrink step by step as each result returns."
        )}
      />
      <RecursionVisualizer />

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-extrabold text-white">{t("حالات الاستدعاء الذاتي", "Recursion cases")}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {types.map((item, i) => (
            <motion.div key={item.name} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="rounded-2xl border border-border bg-surface/70 p-5">
              <div className="mb-2 flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                <h3 className="font-bold text-white">{item.name}</h3>
              </div>
              <p className="text-sm leading-relaxed text-slate-400">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
