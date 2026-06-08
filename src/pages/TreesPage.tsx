import { useState } from "react";
import { motion } from "framer-motion";
import { PageHeader } from "../components/PageHeader";
import { ComplexityBadge } from "../components/ComplexityBadge";
import { BSTVisualizer } from "../visualizers/tree/BSTVisualizer";
import { HeapVisualizer } from "../visualizers/tree/HeapVisualizer";
import { TreeCanvas } from "../visualizers/tree/TreeCanvas";
import { buildRun, node, type TNode } from "../visualizers/tree/engine";

type Tab = "bst" | "heap" | "concepts";

const tabs: { id: Tab; label: string }[] = [
  { id: "bst", label: "شجرة البحث الثنائية" },
  { id: "heap", label: "الكومة و Heap Sort" },
  { id: "concepts", label: "شرح الأشجار الكاملة" },
];

function completeTree(): TNode | null {
  const n = (v: number) => node(v);
  const nodes = [50, 30, 70, 20, 40, 60].map(n);
  nodes[0].left = nodes[1];
  nodes[0].right = nodes[2];
  nodes[1].left = nodes[3];
  nodes[1].right = nodes[4];
  nodes[2].left = nodes[5];
  return nodes[0];
}

export function TreesPage() {
  const [tab, setTab] = useState<Tab>("bst");

  return (
    <div>
      <PageHeader
        eyebrow="هياكل البيانات"
        title="الأشجار الثنائية"
        description="من شجرة البحث الثنائية ومرورها، إلى الأشجار الكاملة والكومة والترتيب بالكومة — كل ذلك بأنيميشن تفاعلي وكود زائف متزامن."
      />

      <div className="mb-8 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-xl px-5 py-2.5 text-sm font-bold transition-all ${
              tab === t.id
                ? "bg-gradient-to-l from-brand-500 to-accent-500 text-white shadow-lg shadow-brand-600/30"
                : "border border-border bg-surface text-slate-300 hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
        {tab === "bst" && <BSTVisualizer />}
        {tab === "heap" && <HeapVisualizer />}
        {tab === "concepts" && <Concepts />}
      </motion.div>
    </div>
  );
}

const terms = [
  { term: "الجذر (Root)", desc: "العقدة العليا التي ليس لها أب، نقطة بداية الشجرة." },
  { term: "الورقة (Leaf)", desc: "عقدة بلا أبناء، في أطراف الشجرة." },
  { term: "الارتفاع (Height)", desc: "أطول مسار من الجذر إلى ورقة (عدد الحواف)." },
  { term: "العمق (Depth)", desc: "عدد الحواف من الجذر حتى العقدة المحددة." },
  { term: "الدرجة (Degree)", desc: "عدد أبناء العقدة (0، 1، أو 2 في الثنائية)." },
  { term: "الأخ (Sibling)", desc: "عقد تشترك في الأب نفسه." },
];

const types = [
  { name: "كاملة (Complete)", color: "#34d399", desc: "كل المستويات ممتلئة عدا الأخير، والأخير يُملأ من اليسار لليمين. هذا هو شكل الكومة، ويُخزَّن بكفاءة في مصفوفة." },
  { name: "ممتلئة (Full)", color: "#818cf8", desc: "كل عقدة لها 0 أو 2 ابن بالضبط، لا توجد عقدة بابن واحد." },
  { name: "تامّة (Perfect)", color: "#22d3ee", desc: "كل العقد الداخلية لها ابنان، وكل الأوراق على المستوى نفسه. عدد العقد = 2^(h+1) − 1." },
  { name: "متوازنة (Balanced)", color: "#fbbf24", desc: "فرق الارتفاع بين الشجرتين الفرعيتين محدود، يضمن عمليات O(log n)." },
  { name: "متدهورة (Degenerate)", color: "#f87171", desc: "كل عقدة لها ابن واحد، تتحول لسلسلة وتتدهور العمليات إلى O(n)." },
];

function Concepts() {
  const staticRun = buildRun(
    { name: "complete", time: "O(1)", space: "O(1)", code: [] },
    [{ root: completeTree(), codeLine: 0, message: "" }]
  );

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 text-xl font-extrabold text-white">مصطلحات أساسية</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {terms.map((t, i) => (
              <motion.div
                key={t.term}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-xl border border-border bg-surface/70 p-4"
              >
                <div className="font-bold text-brand-300">{t.term}</div>
                <p className="mt-1 text-sm leading-relaxed text-slate-400">{t.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="mb-3 text-xl font-extrabold text-white">شجرة كاملة (مثال)</h2>
          <TreeCanvas frame={staticRun.frames[0]} width={staticRun.width} height={staticRun.height} />
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            المستويات ممتلئة من اليسار. لاحظ أنها تُخزَّن في المصفوفة
            <span dir="ltr" className="mx-1 font-mono text-slate-200">[50, 30, 70, 20, 40, 60]</span>
            حيث أبناء العقدة <span className="font-mono">i</span> عند <span className="font-mono">2i+1</span> و
            <span className="font-mono"> 2i+2</span>.
          </p>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-extrabold text-white">أنواع الأشجار الثنائية</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {types.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-border bg-surface/70 p-5"
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: t.color }} />
                <h3 className="font-bold text-white">{t.name}</h3>
              </div>
              <p className="text-sm leading-relaxed text-slate-400">{t.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface/70 p-6">
        <h2 className="mb-4 text-xl font-extrabold text-white">لماذا الشجرة الكاملة مهمة للكومة؟</h2>
        <div className="grid gap-4 text-sm leading-relaxed text-slate-300 sm:grid-cols-2">
          <p>
            لأن الشجرة الكاملة ليس بها "فجوات"، يمكن تخزينها في مصفوفة متجاورة دون
            هدر للذاكرة ودون الحاجة لمؤشرات. هذا يجعل التنقل بين الأب والأبناء عملية
            حسابية بسيطة: الأب عند <span dir="ltr" className="font-mono text-accent-400">(i-1)/2</span>،
            والابنان عند <span dir="ltr" className="font-mono text-accent-400">2i+1, 2i+2</span>.
          </p>
          <p>
            الكومة القصوى (Max-Heap) هي شجرة كاملة يكون فيها كل أب أكبر من أو يساوي
            أبناءه، لذا يكون الجذر دائماً أكبر عنصر. هذه الخاصية هي أساس
            <span className="font-bold text-white"> الترتيب بالكومة</span> بزمن
            <ComplexityBadge value="O(n log n)" size="sm" /> ومساحة <ComplexityBadge value="O(1)" size="sm" />.
          </p>
        </div>
      </section>
    </div>
  );
}
