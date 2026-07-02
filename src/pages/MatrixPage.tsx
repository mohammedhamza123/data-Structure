import { motion } from "framer-motion";
import { PageHeader } from "../components/PageHeader";
import { ComplexityBadge } from "../components/ComplexityBadge";
import { MatrixVisualizer } from "../visualizers/matrix/MatrixVisualizer";
import type { ComplexityClass } from "../data/complexity";
import { useLang } from "../i18n";

export function MatrixPage() {
  const { t, dir } = useLang();

  const opsTable: { name: string; time: ComplexityClass; note: string }[] = [
    {
      name: t("مصفوفة 1D — مرور", "1D array — traverse"),
      time: "O(n)",
      note: t("زيارة كل عنصر بالمؤشر i", "Visit each element by index i"),
    },
    {
      name: t("عكس المصفوفة 2D", "Reverse 2D matrix"),
      time: "O(n²)",
      note: t("تبديل عناصر كل صف من الطرفين", "Swap elements in each row from both ends"),
    },
    {
      name: t("جمع كل صف", "Sum each row"),
      time: "O(n²)",
      note: t("حلقة خارجية للصفوف وداخلية للأعمدة", "Outer loop for rows, inner for columns"),
    },
    {
      name: t("جمع صف وعمود", "Sum row & column"),
      time: "O(n)",
      note: t("مروران: صف محدد ثم عمود محدد", "Two passes: one row then one column"),
    },
    {
      name: t("مجموع القطر الرئيسي", "Main diagonal sum"),
      time: "O(n)",
      note: t("عناصر a[i][i] حيث i = j", "Elements a[i][i] where i = j"),
    },
  ];

  const concepts = [
    {
      title: t("مصفوفة أحادية البُعد (1D)", "One-dimensional array (1D)"),
      body: t(
        "سلسلة من العناصر في مواقع متجاورة. الوصول a[i] يتم في O(1) لأن العنوان = base + i × size.",
        "A sequence of elements in contiguous memory. Access a[i] is O(1) because address = base + i × size.",
      ),
    },
    {
      title: t("مصفوفة ثنائية البُعد (2D)", "Two-dimensional matrix (2D)"),
      body: t(
        "جدول من الصفوف والأعمدة: a[row][col]. في الذاكرة تُخزَّن غالباً صفاً بصف (row-major). معظم العمليات الشائعة — الجمع، العكس، القطر — تتطلّب حلقات متداخلة.",
        "A table of rows and columns: a[row][col]. In memory it's usually stored row by row (row-major). Most common operations — sums, reversal, diagonal — use nested loops.",
      ),
    },
    {
      title: t("القطر الرئيسي", "Main diagonal"),
      body: t(
        "في مصفوفة مربّعة n×n، القطر الرئيسي يمرّ بالمواضع (0,0), (1,1), …, (n-1,n-1). مجموعه = Σ a[i][i].",
        "In an n×n square matrix, the main diagonal passes through (0,0), (1,1), …, (n-1,n-1). Its sum = Σ a[i][i].",
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        eyebrow={t("هياكل البيانات", "Data Structures")}
        title={t("المصفوفات (1D و 2D)", "Arrays & Matrices (1D & 2D)")}
        description={t(
          "من المصفوفة أحادية البُعد إلى المصفوفة ثنائية البُعد: عكس المصفوفة، جمع كل صف، جمع صف وعمود، ومجموع عناصر القطر الرئيسي — مع رسوم متحركة وكود C++ متزامن.",
          "From 1D arrays to 2D matrices: reverse the matrix, sum each row, sum a row and column, and sum the main diagonal — with step-by-step animation and synchronized C++ code.",
        )}
      />

      <MatrixVisualizer />

      <section className="mt-10 grid gap-4 sm:grid-cols-3">
        {concepts.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="rounded-2xl border border-border bg-surface/50 p-5"
          >
            <h3 className="mb-2 font-bold text-white">{c.title}</h3>
            <p className="text-sm leading-relaxed text-slate-400">{c.body}</p>
          </motion.div>
        ))}
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-extrabold text-white">{t("ملخّص العمليات", "Operations summary")}</h2>
        <div className="overflow-x-auto rounded-2xl border border-border">
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
                  <td className="px-4 py-3">
                    <ComplexityBadge value={row.time} size="sm" />
                  </td>
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
