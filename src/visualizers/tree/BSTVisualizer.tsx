import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TreeCanvas } from "./TreeCanvas";
import { PlaybackBar, PseudocodePanel, usePlayer } from "../../components/Player";
import { ComplexityBadge } from "../../components/ComplexityBadge";
import { buildRun, node, type TNode, type TreeRun } from "./engine";
import { bstDelete, bstInsert, bstSearch, bstTraverse } from "./bst";
import { useLang } from "../../i18n";

function plainInsert(root: TNode | null, value: number): TNode {
  if (!root) return node(value);
  let curr = root;
  while (true) {
    if (value === curr.value) return root;
    if (value < curr.value) {
      if (!curr.left) {
        curr.left = node(value);
        return root;
      }
      curr = curr.left;
    } else {
      if (!curr.right) {
        curr.right = node(value);
        return root;
      }
      curr = curr.right;
    }
  }
}

function buildFrom(values: number[]): TNode | null {
  let root: TNode | null = null;
  for (const v of values) root = plainInsert(root, v);
  return root;
}

const initialValues = [50, 30, 70, 20, 40, 60, 80, 35];

function idleRun(root: TNode | null, message: string): TreeRun {
  return buildRun({ name: "—", time: "O(log n)", space: "O(1)", code: ["// اختر عملية لعرض الكود الزائف الخاص بها"] }, [
    { root, codeLine: 0, message },
  ]);
}

export function BSTVisualizer() {
  const { t } = useLang();
  const [root, setRoot] = useState<TNode | null>(() => buildFrom(initialValues));
  const [run, setRun] = useState<TreeRun>(() => idleRun(buildFrom(initialValues), t("اختر عملية لرؤية الشرح خطوة بخطوة على شجرة البحث الثنائية.", "Choose an operation to see a step-by-step explanation on the binary search tree.")));
  const [value, setValue] = useState("45");

  const player = usePlayer(run.frames.length);
  const { idx, setIdx, playing, setPlaying, speed, setSpeed, toggle } = player;
  const frame = run.frames[Math.min(idx, run.frames.length - 1)];

  useEffect(() => {
    setIdx(0);
    setPlaying(run.frames.length > 1);
  }, [run, setIdx, setPlaying]);

  const val = () => {
    const v = parseInt(value, 10);
    return Number.isNaN(v) ? Math.floor(Math.random() * 90) + 5 : v;
  };

  const apply = (res: { run: TreeRun; root: TNode | null }) => {
    setRoot(res.root);
    setRun(res.run);
  };

  const randomTree = () => {
    const set = new Set<number>();
    while (set.size < 8) set.add(Math.floor(Math.random() * 95) + 5);
    const r = buildFrom([...set]);
    setRoot(r);
    setRun(idleRun(r, t("شجرة عشوائية جديدة. جرّب العمليات.", "A new random tree. Try the operations.")));
  };
  const reset = () => {
    const r = buildFrom(initialValues);
    setRoot(r);
    setRun(idleRun(r, t("أُعيدت الشجرة الافتراضية.", "The default tree was restored.")));
  };
  const clear = () => {
    setRoot(null);
    setRun(idleRun(null, t("الشجرة فارغة. أدرج قيمة للبدء.", "The tree is empty. Insert a value to start.")));
  };

  const busy = playing;
  const actionBtn =
    "rounded-xl border border-border bg-surface px-3 py-2 text-sm font-semibold text-slate-200 transition-all hover:border-brand-500/50 hover:bg-surface-2 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 active:scale-95";

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_330px]">
      <div className="space-y-6">
        <TreeCanvas frame={frame} width={run.width} height={run.height} />

        {/* visit output */}
        {run.showVisit && (
          <div className="rounded-2xl border border-border bg-surface/70 p-4">
            <span className="text-xs font-bold text-slate-400">{t("ناتج التنقّل:", "Traversal output:")}</span>
            <div dir="ltr" className="mt-2 flex flex-wrap gap-1.5">
              {frame.visit.length === 0 && <span className="text-sm text-slate-500">—</span>}
              {frame.visit.map((v, i) => (
                <motion.span
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="grid h-8 min-w-8 place-items-center rounded-lg bg-success/15 px-2 font-mono text-sm font-bold text-success"
                >
                  {v}
                </motion.span>
              ))}
            </div>
          </div>
        )}

        {/* message + playback */}
        <div className="rounded-2xl border border-border bg-surface/70 p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-bold text-white">{run.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">{t("زمني", "Time")}</span>
              <ComplexityBadge value={run.time} size="sm" />
              <span className="text-xs text-slate-500">{t("مكاني", "Space")}</span>
              <ComplexityBadge value={run.space} size="sm" />
            </div>
          </div>
          <div className="min-h-[44px] rounded-xl bg-bg-soft px-4 py-3 text-sm leading-relaxed text-slate-200">
            {frame.message}
          </div>
          <div className="mt-4">
            <PlaybackBar
              idx={idx}
              total={run.frames.length}
              playing={playing}
              speed={speed}
              onPrev={() => setIdx((i) => Math.max(0, i - 1))}
              onNext={() => setIdx((i) => Math.min(run.frames.length - 1, i + 1))}
              onToggle={toggle}
              onSpeed={setSpeed}
            />
          </div>
        </div>

        {/* controls */}
        <div className="rounded-2xl border border-border bg-surface/70 p-4">
          <div className="mb-4 flex items-end gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-slate-400">{t("القيمة", "Value")}</span>
              <input type="number" value={value} onChange={(e) => setValue(e.target.value)} className="w-28 rounded-lg border border-border bg-bg-soft px-3 py-2 font-mono text-sm text-white outline-none focus:border-brand-500" />
            </label>
            <button className={actionBtn} disabled={busy} onClick={() => apply(bstInsert(root, val()))}>{t("إدراج", "Insert")}</button>
            <button className={actionBtn} disabled={busy} onClick={() => apply(bstSearch(root, val()))}>{t("بحث", "Search")}</button>
            <button className={actionBtn} disabled={busy} onClick={() => apply(bstDelete(root, val()))}>{t("حذف", "Delete")}</button>
          </div>

          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="w-16 shrink-0 text-xs font-bold text-slate-500">{t("تنقّلات", "Traversals")}</span>
            <button className={actionBtn} disabled={busy} onClick={() => apply(bstTraverse(root, "inorder"))}>Inorder</button>
            <button className={actionBtn} disabled={busy} onClick={() => apply(bstTraverse(root, "preorder"))}>Preorder</button>
            <button className={actionBtn} disabled={busy} onClick={() => apply(bstTraverse(root, "postorder"))}>Postorder</button>
            <button className={actionBtn} disabled={busy} onClick={() => apply(bstTraverse(root, "levelorder"))}>Level-order</button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="w-16 shrink-0 text-xs font-bold text-slate-500">{t("الشجرة", "Tree")}</span>
            <button className={actionBtn} disabled={busy} onClick={randomTree}>{t("شجرة عشوائية", "Random tree")}</button>
            <button className={actionBtn} disabled={busy} onClick={reset}>{t("إعادة تعيين", "Reset")}</button>
            <button className={actionBtn} disabled={busy} onClick={clear}>{t("تفريغ", "Clear")}</button>
          </div>
        </div>
      </div>

      <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <PseudocodePanel code={run.code} activeLine={frame.codeLine} />
        <div className="rounded-2xl border border-border bg-surface/70 p-4 text-sm text-slate-400">
          <h4 className="mb-2 font-bold text-white">{t("خاصية BST", "BST property")}</h4>
          <p className="leading-relaxed">
            {t("في كل عقدة: القيم في الشجرة اليسرى أصغر، واليمنى أكبر. لذلك العمليات تكلّف", "At each node: values in the left subtree are smaller and the right are larger. So operations cost")} <ComplexityBadge value="O(log n)" size="sm" /> {t("في الشجرة المتوازنة، وقد تتدهور إلى", "in a balanced tree, and may degrade to")} <ComplexityBadge value="O(n)" size="sm" /> {t("إن أصبحت بشكل سلسلة.", "if it becomes a chain.")}
          </p>
        </div>
      </div>
    </div>
  );
}
