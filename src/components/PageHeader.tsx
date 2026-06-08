import type { ReactNode } from "react";
import { motion } from "framer-motion";

type Props = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
};

export function PageHeader({ eyebrow, title, description, children }: Props) {
  return (
    <div className="mb-8">
      {eyebrow && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-300"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
          {eyebrow}
        </motion.div>
      )}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
      >
        {title}
      </motion.h1>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-3 max-w-2xl text-base leading-relaxed text-slate-400"
        >
          {description}
        </motion.p>
      )}
      {children}
    </div>
  );
}
