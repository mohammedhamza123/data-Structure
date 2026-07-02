import { motion } from "framer-motion";
import { CppCodePanel } from "./CppCodePanel";

export type CppLesson = {
  title: string;
  explanation: string;
  code: string;
  note?: string;
};

type Props = {
  lesson: CppLesson;
  index: number;
};

export function CppLessonCard({ lesson, index }: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="grid gap-6 rounded-2xl border border-border bg-surface/50 p-6 lg:grid-cols-2"
    >
      <div>
        <h3 className="mb-3 text-lg font-extrabold text-white">{lesson.title}</h3>
        <p className="text-sm leading-relaxed text-slate-300">{lesson.explanation}</p>
        {lesson.note && (
          <p className="mt-4 rounded-xl border border-brand-500/20 bg-brand-500/10 px-4 py-3 text-xs leading-relaxed text-brand-200">
            {lesson.note}
          </p>
        )}
      </div>
      <CppCodePanel code={lesson.code} />
    </motion.section>
  );
}
