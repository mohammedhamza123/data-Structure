import { motion } from "framer-motion";
import { PageHeader } from "../components/PageHeader";
import { CppLessonCard, type CppLesson } from "../components/CppLessonCard";
import { useLang } from "../i18n";

export function CppStructPage() {
  const { t } = useLang();

  const lessons: CppLesson[] = [
    {
      title: t("ما هو struct؟", "What is struct?"),
      explanation: t(
        "struct (البنية) يجمع عدة حقول من أنواع مختلفة تحت اسم واحد — مثل «بطاقة طالب» فيها رقم، اسم، ومعدل. بدلاً من ثلاث متغيّرات منفصلة، تُنشئ نوعاً واحداً Student يحملها معاً.",
        "A struct groups multiple fields of different types under one name — like a «student card» with id, name, and GPA. Instead of three separate variables, you create one Student type that holds them together.",
      ),
      code: `struct Student {
    int id;
    string name;
    float gpa;
};

Student s;
s.id = 101;
s.name = "Ali";
s.gpa = 3.8;`,
      note: t(
        "struct يُستخدم لتجميع بيانات مترابطة — أساس هياكل مثل Node في القائمة المرتبطة.",
        "struct groups related data — the foundation of structures like a linked-list Node.",
      ),
    },
    {
      title: t("تعريف وتهيئة struct", "Defining and initializing struct"),
      explanation: t(
        "يمكنك تعريف struct ثم إنشاء متغيّرات منه. التهيئة المباشرة { } تملأ الحقول بالترتيب. في C++11+ يمكنك استخدام = {101, \"Sara\", 3.9}.",
        "Define a struct then create variables of that type. Brace initialization { } fills fields in order. In C++11+ you can use = {101, \"Sara\", 3.9}.",
      ),
      code: `struct Point {
    int x;
    int y;
};

Point p1 = {3, 7};       // x=3, y=7
Point p2{10, 20};        // uniform init

cout << p1.x << ", " << p1.y;`,
    },
    {
      title: t("الوصول للحقول بـ .", "Accessing members with ."),
      explanation: t(
        "النقطة . تصل إلى حقل داخل struct عندما يكون المتغيّر struct مباشرة (وليس مؤشراً). s.name يقرأ أو يكتب حقل name.",
        "The dot . accesses a struct member when the variable is a struct directly (not a pointer). s.name reads or writes the name field.",
      ),
      code: `struct Book {
    string title;
    int pages;
};

Book b;
b.title = "Algorithms";
b.pages = 450;

cout << b.title << " (" << b.pages << " pages)";`,
    },
    {
      title: t("struct ومؤشر →", "struct and pointer →"),
      explanation: t(
        "إذا كان لديك مؤشر على struct، تستخدم -> بدل . للوصول للحقول. ptr->name يعادل (*ptr).name. هذا شائع في القوائم المرتبطة: Node* next;",
        "If you have a pointer to a struct, use -> instead of . to access members. ptr->name equals (*ptr).name. Common in linked lists: Node* next;",
      ),
      code: `struct Node {
    int data;
    Node* next;    // pointer to next node
};

Node n;
n.data = 42;
n.next = nullptr;

Node* ptr = &n;
cout << ptr->data;     // 42
cout << (*ptr).data;  // same`,
      note: t(
        "في القائمة المرتبطة، كل Node struct يحمل data و next.",
        "In a linked list, each Node struct holds data and next.",
      ),
    },
    {
      title: t("struct متداخل (Nested struct)", "Nested struct"),
      explanation: t(
        "يمكن أن يحتوي struct على struct آخر كحقل. مثلاً Address داخل Employee. الوصول: emp.address.city",
        "A struct can contain another struct as a field. E.g. Address inside Employee. Access: emp.address.city",
      ),
      code: `struct Address {
    string city;
    int zip;
};

struct Employee {
    string name;
    Address address;
};

Employee emp;
emp.name = "Omar";
emp.address.city = "Cairo";
emp.address.zip = 11511;`,
    },
    {
      title: t("مصفوفة من struct", "Array of struct"),
      explanation: t(
        "يمكنك إنشاء مصفوفة من structs — مثل قائمة طلاب. الوصول: students[i].gpa. مفيد لتخزين سجلات متعددة من نفس النوع.",
        "You can create an array of structs — e.g. a list of students. Access: students[i].gpa. Useful for storing many records of the same type.",
      ),
      code: `struct Student {
    int id;
    string name;
};

Student students[3] = {
    {1, "Ali"},
    {2, "Sara"},
    {3, "Omar"}
};

cout << students[1].name;   // Sara`,
    },
    {
      title: t("typedef struct", "typedef struct"),
      explanation: t(
        "typedef يعطي اسماً مختصراً للنوع. typedef struct Node Node; يسمح بكتابة Node بدل struct Node في كل مرة. في C++ غالباً struct Node { ... }; كافٍ بدون typedef.",
        "typedef gives a short alias for a type. typedef struct Node Node; lets you write Node instead of struct Node everywhere. In C++ usually struct Node { ... }; is enough without typedef.",
      ),
      code: `typedef struct {
    int x;
    int y;
} Point;              // Point is the type name

Point p = {5, 10};

// C++ style (preferred):
struct Point2 {
    int x, y;
};
Point2 q{1, 2};`,
    },
  ];

  const comparison = [
    { field: t("تجميع بيانات", "Group data"), struct: t("نعم — حقول متعددة", "Yes — multiple fields"), array: t("عناصر من نوع واحد", "Same-type elements only") },
    { field: t("الوصول", "Access"), struct: t("s.field أو ptr->field", "s.field or ptr->field"), array: t("arr[i]", "arr[i]") },
    { field: t("الاستخدام", "Use case"), struct: t("سجل، عقدة، كائن", "Record, node, object"), array: t("قائمة أرقام", "List of numbers") },
  ];

  return (
    <div>
      <PageHeader
        eyebrow={t("أساسيات C++", "C++ Basics")}
        title={t("البنية struct", "The struct Type")}
        description={t(
          "struct يجمّع حقولاً متعددة في نوع واحد — أساس العقد في القوائم المرتبطة والأشجار. تعلّم التعريف، الوصول بـ . و ->، والـ struct المتداخل ومصفوفات الـ struct.",
          "struct groups multiple fields into one type — the basis of nodes in linked lists and trees. Learn definition, access with . and ->, nested structs, and struct arrays.",
        )}
      />

      <div className="space-y-6">
        {lessons.map((lesson, i) => (
          <CppLessonCard key={lesson.title} lesson={lesson} index={i} />
        ))}
      </div>

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-extrabold text-white">{t("struct مقابل المصفوفة", "struct vs array")}</h2>
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm text-left">
            <thead className="bg-surface-2 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-bold">{t("الميزة", "Aspect")}</th>
                <th className="px-4 py-3 font-bold">struct</th>
                <th className="px-4 py-3 font-bold">{t("مصفوفة", "Array")}</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row, i) => (
                <motion.tr
                  key={row.field}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="border-t border-border bg-surface/40"
                >
                  <td className="px-4 py-3 font-semibold text-white">{row.field}</td>
                  <td className="px-4 py-3 text-slate-400">{row.struct}</td>
                  <td className="px-4 py-3 text-slate-400">{row.array}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
