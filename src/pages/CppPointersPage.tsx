import { motion } from "framer-motion";
import { PageHeader } from "../components/PageHeader";
import { CppLessonCard, type CppLesson } from "../components/CppLessonCard";
import { useLang } from "../i18n";

export function CppPointersPage() {
  const { t } = useLang();

  const lessons: CppLesson[] = [
    {
      title: t("ما هو المؤشر؟", "What is a pointer?"),
      explanation: t(
        "المؤشر (pointer) هو متغيّر يخزّن عنواناً في الذاكرة — أي «أين» يوجد شيء آخر، وليس القيمة نفسها. مثل رقم غرفة في فندق: الرقم يدلّك على المكان، وليس على محتوى الغرفة. في C++ نكتب int* p; ليعني «p مؤشر على int».",
        "A pointer is a variable that stores a memory address — where something else lives, not the value itself. Like a hotel room number: the number tells you the location, not what's inside the room. In C++ we write int* p; meaning «p is a pointer to int».",
      ),
      code: `int age = 25;
int* ptr;        // pointer to int
// ptr will hold the address of age`,
      note: t(
        "كل متغيّر في الذاكرة له عنوان فريد. المؤشر يحفظ هذا العنوان.",
        "Every variable in memory has a unique address. A pointer stores that address.",
      ),
    },
    {
      title: t("عامل العنوان & (address-of)", "The address-of operator &"),
      explanation: t(
        "الرمز & يعطيك عنوان المتغيّر. إذا كتبت &age تحصل على موقع age في الذاكرة (مثلاً 0x7fff5fbff8ac). ثم يمكنك تخزين هذا العنوان داخل مؤشر: ptr = &age;",
        "The & symbol gives you a variable's address. Writing &age returns where age lives in memory (e.g. 0x7fff5fbff8ac). You can store that address in a pointer: ptr = &age;",
      ),
      code: `int age = 25;
int* ptr = &age;   // ptr holds address of age

cout << &age;      // prints address of age
cout << ptr;       // same address`,
    },
    {
      title: t("عامل الإشارة * (dereference)", "The dereference operator *"),
      explanation: t(
        "عندما تضع * قبل اسم المؤشر، تصل إلى القيمة المخزّنة في العنوان الذي يشير إليه — أي «افتح الغرفة واقرأ ما بداخلها». *ptr يعطيك قيمة age (25) وليس العنوان.",
        "Putting * before a pointer name accesses the value at the address it points to — «open the room and read what's inside». *ptr gives you age's value (25), not the address.",
      ),
      code: `int age = 25;
int* ptr = &age;

cout << *ptr;      // 25  (value at address)
cout << ptr;       // address
cout << &age;      // same address

*ptr = 30;         // change age through pointer
cout << age;       // 30`,
      note: t(
        "الوصول عبر *ptr يُسمّى dereferencing — أي «فك الإشارة».",
        "Accessing via *ptr is called dereferencing — «following the pointer».",
      ),
    },
    {
      title: t("المؤشر الفارغ nullptr", "Null pointer nullptr"),
      explanation: t(
        "المؤشر الفارغ لا يشير إلى أي مكان صالح. في C++ الحديث نستخدم nullptr بدل NULL. قبل استخدام مؤشر، تحقق أنه ليس nullptr لتجنّب الأخطاء.",
        "A null pointer points nowhere valid. In modern C++ we use nullptr instead of NULL. Always check a pointer isn't nullptr before dereferencing to avoid crashes.",
      ),
      code: `int* ptr = nullptr;   // points to nothing

if (ptr != nullptr) {
    cout << *ptr;     // safe
} else {
    cout << "Pointer is null";
}`,
    },
    {
      title: t("المؤشرات والمصفوفات", "Pointers and arrays"),
      explanation: t(
        "اسم المصفوفة يتحوّل ضمنياً إلى مؤشر على أول عنصر. arr و &arr[0] متكافئان. يمكنك التنقّل بين العناصر بـ ptr++ أو arr[i] أو *(arr + i).",
        "An array name implicitly decays to a pointer to its first element. arr and &arr[0] are equivalent. You can move through elements with ptr++ or arr[i] or *(arr + i).",
      ),
      code: `int arr[] = {10, 20, 30, 40};
int* p = arr;          // p -> arr[0]

cout << *p;            // 10
cout << *(p + 2);      // 30
cout << p[1];          // 20  (same as *(p+1))`,
    },
    {
      title: t("تمرير بالمؤشر (Pass by pointer)", "Pass by pointer"),
      explanation: t(
        "عندما تمرّر عنوان متغيّر لدالة، يمكن للدالة تعديل القيمة الأصلية. هذا مفيد عندما تريد أن «ترجع» أكثر من قيمة أو تعدّل المتغيّر الأصلي دون نسخ.",
        "When you pass a variable's address to a function, the function can modify the original value. Useful when you want to «return» multiple values or change the original without copying.",
      ),
      code: `void swap(int* a, int* b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int x = 5, y = 9;
swap(&x, &y);          // pass addresses
// x = 9, y = 5`,
      note: t(
        "الفرق عن pass by value: الدالة تعمل على العنوان الأصلي وليس على نسخة.",
        "Unlike pass by value: the function works on the original address, not a copy.",
      ),
    },
    {
      title: t("new و delete (ذاكرة ديناميكية)", "new and delete (dynamic memory)"),
      explanation: t(
        "new يخصّص ذاكرة في الـ heap ويرجع مؤشراً عليها. delete يحرّر الذاكرة. استخدم delete[] للمصفوفات. نسيان delete يسبب تسريب ذاكرة (memory leak).",
        "new allocates memory on the heap and returns a pointer to it. delete frees the memory. Use delete[] for arrays. Forgetting delete causes a memory leak.",
      ),
      code: `int* p = new int(42);     // one int on heap
cout << *p;                 // 42
delete p;                   // free memory

int* arr = new int[5];    // array on heap
arr[0] = 10;
delete[] arr;               // free array`,
    },
  ];

  const summary = [
    { sym: "&", meaning: t("عنوان المتغيّر", "Variable address") },
    { sym: "*", meaning: t("القيمة عند العنوان (dereference)", "Value at address (dereference)") },
    { sym: "int*", meaning: t("مؤشر على int", "Pointer to int") },
    { sym: "nullptr", meaning: t("مؤشر فارغ", "Null pointer") },
  ];

  return (
    <div>
      <PageHeader
        eyebrow={t("أساسيات C++", "C++ Basics")}
        title={t("المؤشرات (Pointers)", "Pointers")}
        description={t(
          "المؤشرات من أهم مفاهيم C++: تربط بين المتغيّرات والذاكرة، وتُستخدم في القوائم المرتبطة، الأشجار، والمصفوفات الديناميكية. تعلّم & و * و nullptr وتمرير المؤشرات للدوال.",
          "Pointers are central to C++: they connect variables to memory and power linked lists, trees, and dynamic arrays. Learn &, *, nullptr, and passing pointers to functions.",
        )}
      />

      <div className="space-y-6">
        {lessons.map((lesson, i) => (
          <CppLessonCard key={lesson.title} lesson={lesson} index={i} />
        ))}
      </div>

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-extrabold text-white">{t("ملخّص الرموز", "Symbol cheat sheet")}</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {summary.map((row, i) => (
            <motion.div
              key={row.sym}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="rounded-2xl border border-border bg-surface/70 p-4"
            >
              <code dir="ltr" className="font-mono text-lg font-bold text-brand-300">{row.sym}</code>
              <p className="mt-2 text-sm text-slate-400">{row.meaning}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
