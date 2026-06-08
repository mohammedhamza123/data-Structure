import { Link } from "react-router-dom";
import { motion } from "framer-motion";

type Props = {
  title: string;
  description: string;
};

export function ComingSoonPage({ title, description }: Props) {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="max-w-lg text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-2xl border border-border bg-surface glow-brand"
        >
          <svg className="h-10 w-10 text-brand-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 3" />
          </svg>
        </motion.div>
        <span className="mb-3 inline-block rounded-full bg-accent-500/15 px-3 py-1 text-xs font-bold text-accent-400">
          قيد التطوير
        </span>
        <h1 className="text-3xl font-extrabold text-white">{title}</h1>
        <p className="mt-3 text-slate-400">{description}</p>
        <p className="mt-2 text-sm text-slate-500">
          هذا القسم سيُبنى بنفس مستوى الجودة التفاعلية لقسم القوائم المرتبطة.
        </p>
        <Link
          to="/linked-list"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-brand-500 to-accent-500 px-6 py-3 font-bold text-white transition-transform hover:scale-[1.03]"
        >
          جرّب القوائم المرتبطة الآن
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M11 18l-6-6 6-6" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
