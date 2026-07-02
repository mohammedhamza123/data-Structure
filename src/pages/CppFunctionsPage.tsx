import { motion } from "framer-motion";
import { PageHeader } from "../components/PageHeader";
import { CppLessonCard, type CppLesson } from "../components/CppLessonCard";
import { useLang } from "../i18n";

export function CppFunctionsPage() {
  const { t } = useLang();

  const lessons: CppLesson[] = [
    {
      title: t("ما هي الدالة؟", "What is a function?"),
      explanation: t(
        "الدالة (function) كتلة من التعليمات لها اسم — تستدعيها عندما تحتاجها بدل تكرار الكود. int add(int a, int b) تُعرّف دالة ترجع int وتأخذ معاملين. return ترجع النتيجة للمستدعي.",
        "A function is a named block of instructions — you call it when needed instead of repeating code. int add(int a, int b) defines a function returning int with two parameters. return sends the result back to the caller.",
      ),
      code: `int add(int a, int b) {
    return a + b;
}

int main() {
    int sum = add(3, 5);   // call the function
    cout << sum;           // 8
    return 0;
}`,
      note: t(
        "main() هي نقطة بداية البرنامج — أول دالة تُنفَّذ.",
        "main() is the program entry point — the first function that runs.",
      ),
    },
    {
      title: t("إعلان وتعريف الدالة", "Declaration vs definition"),
      explanation: t(
        "الإعلان (prototype) يخبر المترجم أن الدالة موجودة: int max(int, int);. التعريف يحتوي على الجسم { ... }. يمكن وضع الإعلان في أعلى الملف والتعريف لاحقاً.",
        "A declaration (prototype) tells the compiler the function exists: int max(int, int);. The definition contains the body { ... }. You can put the declaration at the top and define it later.",
      ),
      code: `// declaration (prototype)
int square(int x);

int main() {
    cout << square(4);    // 16
    return 0;
}

// definition
int square(int x) {
    return x * x;
}`,
    },
    {
      title: t("التمرير بالقيمة (Pass by value)", "Pass by value"),
      explanation: t(
        "C++ ينسخ قيمة المعامل داخل الدالة. أي تعديل على المعامل داخل الدالة لا يغيّر المتغيّر الأصلي. مناسب عندما لا تحتاج تعديل الأصل.",
        "C++ copies the argument value into the function. Changes to the parameter inside the function don't affect the original variable. Fine when you don't need to modify the original.",
      ),
      code: `void increment(int n) {
    n = n + 1;          // only local copy changes
}

int main() {
    int x = 5;
    increment(x);
    cout << x;          // still 5
    return 0;
}`,
    },
    {
      title: t("التمرير بالمرجع (Pass by reference &)", "Pass by reference &"),
      explanation: t(
        "int& ref يعني «مرجع» — alias لمتغيّر موجود. الدالة تعمل على الأصل مباشرة دون نسخ. void increment(int& n) يغيّر x في main.",
        "int& ref means a «reference» — an alias to an existing variable. The function works on the original directly without copying. void increment(int& n) changes x in main.",
      ),
      code: `void increment(int& n) {
    n = n + 1;          // modifies original
}

int main() {
    int x = 5;
    increment(x);       // pass by reference
    cout << x;          // 6
    return 0;
}`,
      note: t(
        "المرجع & أسرع للـ struct الكبيرة لأنه يتجنّب النسخ.",
        "Reference & is faster for large structs because it avoids copying.",
      ),
    },
    {
      title: t("التمرير بالمؤشر (Pass by pointer)", "Pass by pointer"),
      explanation: t(
        "تمرير عنوان المتغيّر int* p. الدالة تستخدم *p لتعديل القيمة. مشابه للمرجع لكن يمكن أن يكون nullptr. شائع في C-style APIs.",
        "Pass the variable's address as int* p. The function uses *p to modify the value. Similar to reference but can be nullptr. Common in C-style APIs.",
      ),
      code: `void increment(int* p) {
    if (p != nullptr)
        *p = *p + 1;
}

int main() {
    int x = 5;
    increment(&x);      // pass address
    cout << x;          // 6
    return 0;
}`,
    },
    {
      title: t("void — دالة بلا قيمة راجعة", "void — no return value"),
      explanation: t(
        "void تعني الدالة لا ترجع شيئاً — تنفّذ عملاً فقط (طباعة، تعديل، إلخ). لا تستخدم return value; بل return; أو بدون return.",
        "void means the function returns nothing — it only performs an action (print, modify, etc.). Don't use return value; use return; or omit return.",
      ),
      code: `void greet(string name) {
    cout << "Hello, " << name << "!";
    // no return value
}

void printLine() {
    cout << "----------";
    return;             // optional early exit
}`,
    },
    {
      title: t("قيمة افتراضية للمعاملات", "Default parameter values"),
      explanation: t(
        "يمكن إعطاء معامل قيمة افتراضية: void print(int times = 1). إذا لم تمرّر times، يُستخدم 1. المعاملات الافتراضية يجب أن تكون في نهاية القائمة.",
        "You can give a parameter a default value: void print(int times = 1). If you omit times, 1 is used. Default parameters must come at the end of the list.",
      ),
      code: `int power(int base, int exp = 2) {
    int result = 1;
    for (int i = 0; i < exp; i++)
        result *= base;
    return result;
}

cout << power(3);      // 9  (3^2)
cout << power(2, 5);   // 32 (2^5)`,
    },
    {
      title: t("النطاق (Scope) — محلي وعام", "Scope — local vs global"),
      explanation: t(
        "المتغيّر المحلي يُعرَف داخل الدالة أو الكتلة { } ويُدمَّر عند الخروج. المتغيّر العام خارج كل الدوال — يُرى من أي مكان (يُفضّل تجنّبه).",
        "A local variable is declared inside a function or block { } and is destroyed when you leave. A global variable lives outside all functions — visible everywhere (best avoided).",
      ),
      code: `int global = 100;        // global scope

void foo() {
    int local = 10;        // local to foo
    cout << global;        // OK: can read global
    cout << local;
}

int main() {
    // cout << local;      // ERROR: local not visible here
    foo();
    return 0;
}`,
    },
  ];

  const passComparison = [
    {
      method: t("بالقيمة", "By value"),
      syntax: "void f(int x)",
      effect: t("نسخ — الأصل لا يتغيّر", "Copy — original unchanged"),
    },
    {
      method: t("بالمرجع", "By reference"),
      syntax: "void f(int& x)",
      effect: t("يعمل على الأصل مباشرة", "Works on original directly"),
    },
    {
      method: t("بالمؤشر", "By pointer"),
      syntax: "void f(int* x)",
      effect: t("عبر العنوان — قد يكون null", "Via address — may be null"),
    },
  ];

  return (
    <div>
      <PageHeader
        eyebrow={t("أساسيات C++", "C++ Basics")}
        title={t("الدوال (Functions)", "Functions")}
        description={t(
          "الدوال تنظّم البرنامج وتمنع تكرار الكود. تعلّم التعريف والاستدعاء، أنواع التمرير (قيمة، مرجع، مؤشر)، void، والقيم الافتراضية والنطاق.",
          "Functions organize your program and avoid code duplication. Learn definition and calls, pass styles (value, reference, pointer), void, default arguments, and scope.",
        )}
      />

      <div className="space-y-6">
        {lessons.map((lesson, i) => (
          <CppLessonCard key={lesson.title} lesson={lesson} index={i} />
        ))}
      </div>

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-extrabold text-white">{t("مقارنة طرق التمرير", "Passing methods compared")}</h2>
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm text-left">
            <thead className="bg-surface-2 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-bold">{t("الطريقة", "Method")}</th>
                <th className="px-4 py-3 font-bold">{t("الصيغة", "Syntax")}</th>
                <th className="px-4 py-3 font-bold">{t("الأثر", "Effect")}</th>
              </tr>
            </thead>
            <tbody>
              {passComparison.map((row, i) => (
                <motion.tr
                  key={row.method}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="border-t border-border bg-surface/40"
                >
                  <td className="px-4 py-3 font-semibold text-white">{row.method}</td>
                  <td className="px-4 py-3">
                    <code dir="ltr" className="font-mono text-xs text-brand-300">{row.syntax}</code>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{row.effect}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
