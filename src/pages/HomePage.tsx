import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useNavSections } from "../data/navigation";
import { useLang } from "../i18n";

export function HomePage() {
  const { t } = useLang();
  const featured = useNavSections()
    .flatMap((s) => s.items)
    .filter((i) => i.path !== "/");

  const stats = [
    { value: "+15", label: t("خوارزمية تفاعلية", "Interactive algorithms") },
    { value: "100%", label: t("خطوة بخطوة", "Step by step") },
    { value: "Big-O", label: t("تحليل كامل", "Full analysis") },
    { value: t("RTL", "EN/AR"), label: t("واجهة عربية", "Bilingual UI") },
  ];

  return (
    <div>
      <section className="relative overflow-hidden rounded-3xl border border-border glass px-6 py-12 sm:px-12 sm:py-16">
        <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-brand-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-10 h-72 w-72 rounded-full bg-accent-500/20 blur-3xl" />

        <div className="relative max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-sm font-semibold text-brand-200"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-400" />
            </span>
            {t("تعلّم هياكل البيانات بصرياً", "Learn data structures visually")}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl font-black leading-tight tracking-tight text-white sm:text-6xl"
          >
            {t("افهم ", "Understand ")}
            <span className="text-gradient">{t("الخوارزميات", "algorithms")}</span>
            <br />
            {t("عبر الحركة لا الحفظ", "through motion, not memorization")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="mt-5 max-w-xl text-lg leading-relaxed text-slate-300"
          >
            {t(
              "منصة تفاعلية تشرح القوائم المرتبطة، خوارزميات الترتيب، والأشجار خطوة بخطوة مع أنيميشن احترافي وتحليل دقيق للتعقيد الزمني والمكاني.",
              "An interactive platform explaining linked lists, sorting algorithms, and trees step by step with polished animations and precise time and space complexity analysis."
            )}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link
              to="/linked-list"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-brand-500 to-accent-500 px-6 py-3 font-bold text-white shadow-lg shadow-brand-600/30 transition-transform hover:scale-[1.03]"
            >
              {t("ابدأ بالقوائم المرتبطة", "Start with linked lists")}
              <svg className="h-5 w-5 transition-transform group-hover:-translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M11 18l-6-6 6-6" />
              </svg>
            </Link>
            <Link
              to="/complexity"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-6 py-3 font-bold text-slate-200 transition-colors hover:border-brand-500/50 hover:text-white"
            >
              {t("تحليل التعقيد الزمني", "Time complexity analysis")}
            </Link>
          </motion.div>
        </div>

        <div className="relative mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.05 }}
              className="rounded-2xl border border-border bg-surface/60 p-4 text-center"
            >
              <div className="text-2xl font-black text-gradient">{s.value}</div>
              <div className="mt-1 text-xs text-slate-400">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="mb-6 text-2xl font-extrabold text-white">{t("استكشف الأقسام", "Explore sections")}</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((item, i) => {
            const card = (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                whileHover={item.available ? { y: -6 } : undefined}
                className={`group relative h-full overflow-hidden rounded-2xl border border-border bg-surface/70 p-6 ${
                  item.available ? "cursor-pointer hover:border-brand-500/50" : "opacity-60"
                }`}
              >
                <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-brand-600/10 blur-2xl transition-opacity group-hover:opacity-100" />
                <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-brand-500/20 to-accent-500/20 text-brand-300">
                  {item.icon}
                </div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">{item.label}</h3>
                  {item.badge && (
                    <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${item.available ? "bg-accent-500/15 text-accent-400" : "bg-surface-2 text-slate-500"}`}>
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-slate-400">{item.description}</p>
                {item.available && (
                  <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-300">
                    {t("افتح", "Open")}
                    <svg className="h-4 w-4 transition-transform group-hover:-translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 12H5M11 18l-6-6 6-6" />
                    </svg>
                  </div>
                )}
              </motion.div>
            );
            return item.available ? (
              <Link key={item.path} to={item.path}>
                {card}
              </Link>
            ) : (
              <div key={item.path}>{card}</div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
