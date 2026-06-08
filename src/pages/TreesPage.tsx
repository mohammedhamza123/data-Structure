import { useState } from "react";
import { motion } from "framer-motion";
import { PageHeader } from "../components/PageHeader";
import { ComplexityBadge } from "../components/ComplexityBadge";
import { BSTVisualizer } from "../visualizers/tree/BSTVisualizer";
import { HeapVisualizer } from "../visualizers/tree/HeapVisualizer";
import { TreeCanvas } from "../visualizers/tree/TreeCanvas";
import { buildRun, node, type TNode } from "../visualizers/tree/engine";
import { useLang } from "../i18n";

type Tab = "bst" | "heap" | "concepts";

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
  const { t } = useLang();
  const [tab, setTab] = useState<Tab>("bst");
  const tabs: { id: Tab; label: string }[] = [
    { id: "bst", label: t("شجرة البحث الثنائية", "Binary Search Tree") },
    { id: "heap", label: t("الكومة و Heap Sort", "Heap & Heap Sort") },
    { id: "concepts", label: t("شرح الأشجار الكاملة", "Tree concepts") },
  ];

  return (
    <div>
      <PageHeader
        eyebrow={t("هياكل البيانات", "Data Structures")}
        title={t("الأشجار الثنائية", "Binary Trees")}
        description={t(
          "من شجرة البحث الثنائية ومرورها، إلى الأشجار الكاملة والكومة والترتيب بالكومة — كل ذلك بأنيميشن تفاعلي وكود زائف متزامن.",
          "From the binary search tree and its traversal, to complete trees, heaps, and heap sort — all with interactive animation and synchronized pseudocode."
        )}
      />

      <div className="mb-8 flex flex-wrap gap-2">
        {tabs.map((tb) => (
          <button
            key={tb.id}
            onClick={() => setTab(tb.id)}
            className={`rounded-xl px-5 py-2.5 text-sm font-bold transition-all ${
              tab === tb.id
                ? "bg-gradient-to-l from-brand-500 to-accent-500 text-white shadow-lg shadow-brand-600/30"
                : "border border-border bg-surface text-slate-300 hover:text-white"
            }`}
          >
            {tb.label}
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

function Concepts() {
  const { t } = useLang();
  const terms = [
    { term: t("الجذر (Root)", "Root"), desc: t("العقدة العليا التي ليس لها أب، نقطة بداية الشجرة.", "The top node with no parent, the tree's starting point.") },
    { term: t("الورقة (Leaf)", "Leaf"), desc: t("عقدة بلا أبناء، في أطراف الشجرة.", "A node with no children, at the tree's edges.") },
    { term: t("الارتفاع (Height)", "Height"), desc: t("أطول مسار من الجذر إلى ورقة (عدد الحواف).", "The longest path from the root to a leaf (number of edges).") },
    { term: t("العمق (Depth)", "Depth"), desc: t("عدد الحواف من الجذر حتى العقدة المحددة.", "The number of edges from the root to a given node.") },
    { term: t("الدرجة (Degree)", "Degree"), desc: t("عدد أبناء العقدة (0، 1، أو 2 في الثنائية).", "The number of children of a node (0, 1, or 2 in a binary tree).") },
    { term: t("الأخ (Sibling)", "Sibling"), desc: t("عقد تشترك في الأب نفسه.", "Nodes that share the same parent.") },
  ];

  const types = [
    { name: t("كاملة (Complete)", "Complete"), color: "#34d399", desc: t("كل المستويات ممتلئة عدا الأخير، والأخير يُملأ من اليسار لليمين. هذا هو شكل الكومة، ويُخزَّن بكفاءة في مصفوفة.", "All levels are full except the last, which fills left to right. This is the heap's shape, stored efficiently in an array.") },
    { name: t("ممتلئة (Full)", "Full"), color: "#818cf8", desc: t("كل عقدة لها 0 أو 2 ابن بالضبط، لا توجد عقدة بابن واحد.", "Every node has exactly 0 or 2 children, none with a single child.") },
    { name: t("تامّة (Perfect)", "Perfect"), color: "#22d3ee", desc: t("كل العقد الداخلية لها ابنان، وكل الأوراق على المستوى نفسه. عدد العقد = 2^(h+1) − 1.", "All internal nodes have two children and all leaves are on the same level. Node count = 2^(h+1) − 1.") },
    { name: t("متوازنة (Balanced)", "Balanced"), color: "#fbbf24", desc: t("فرق الارتفاع بين الشجرتين الفرعيتين محدود، يضمن عمليات O(log n).", "The height difference between subtrees is bounded, guaranteeing O(log n) operations.") },
    { name: t("متدهورة (Degenerate)", "Degenerate"), color: "#f87171", desc: t("كل عقدة لها ابن واحد، تتحول لسلسلة وتتدهور العمليات إلى O(n).", "Each node has one child, degrading into a chain with O(n) operations.") },
  ];

  const staticRun = buildRun(
    { name: "complete", time: "O(1)", space: "O(1)", code: [] },
    [{ root: completeTree(), codeLine: 0, message: "" }]
  );

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 text-xl font-extrabold text-white">{t("مصطلحات أساسية", "Key terms")}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {terms.map((item, i) => (
              <motion.div
                key={item.term}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-xl border border-border bg-surface/70 p-4"
              >
                <div className="font-bold text-brand-300">{item.term}</div>
                <p className="mt-1 text-sm leading-relaxed text-slate-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="mb-3 text-xl font-extrabold text-white">{t("شجرة كاملة (مثال)", "Complete tree (example)")}</h2>
          <TreeCanvas frame={staticRun.frames[0]} width={staticRun.width} height={staticRun.height} />
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            {t("المستويات ممتلئة من اليسار. لاحظ أنها تُخزَّن في المصفوفة", "Levels fill from the left. Notice it is stored in the array")}
            <span dir="ltr" className="mx-1 font-mono text-slate-200">[50, 30, 70, 20, 40, 60]</span>
            {t("حيث أبناء العقدة", "where the children of node")} <span className="font-mono">i</span> {t("عند", "are at")} <span className="font-mono">2i+1</span> {t("و", "and")}
            <span className="font-mono"> 2i+2</span>.
          </p>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-extrabold text-white">{t("أنواع الأشجار الثنائية", "Types of binary trees")}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {types.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-border bg-surface/70 p-5"
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                <h3 className="font-bold text-white">{item.name}</h3>
              </div>
              <p className="text-sm leading-relaxed text-slate-400">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface/70 p-6">
        <h2 className="mb-4 text-xl font-extrabold text-white">{t("لماذا الشجرة الكاملة مهمة للكومة؟", "Why is the complete tree important for the heap?")}</h2>
        <div className="grid gap-4 text-sm leading-relaxed text-slate-300 sm:grid-cols-2">
          <p>
            {t("لأن الشجرة الكاملة ليس بها \"فجوات\"، يمكن تخزينها في مصفوفة متجاورة دون هدر للذاكرة ودون الحاجة لمؤشرات. هذا يجعل التنقل بين الأب والأبناء عملية حسابية بسيطة: الأب عند", "Because a complete tree has no \"gaps\", it can be stored in a contiguous array without wasting memory or needing pointers. This makes moving between parent and children simple arithmetic: the parent is at")} <span dir="ltr" className="font-mono text-accent-400">(i-1)/2</span>{t("، والابنان عند", ", and the children at")} <span dir="ltr" className="font-mono text-accent-400">2i+1, 2i+2</span>.
          </p>
          <p>
            {t("الكومة القصوى (Max-Heap) هي شجرة كاملة يكون فيها كل أب أكبر من أو يساوي أبناءه، لذا يكون الجذر دائماً أكبر عنصر. هذه الخاصية هي أساس", "A Max-Heap is a complete tree where every parent is greater than or equal to its children, so the root is always the largest element. This property is the basis of")}
            <span className="font-bold text-white"> {t("الترتيب بالكومة", "heap sort")}</span> {t("بزمن", "in time")}
            <ComplexityBadge value="O(n log n)" size="sm" /> {t("ومساحة", "and space")} <ComplexityBadge value="O(1)" size="sm" />.
          </p>
        </div>
      </section>
    </div>
  );
}
