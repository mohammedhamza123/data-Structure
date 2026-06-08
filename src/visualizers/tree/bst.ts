import { buildRun, cloneTree, node, type RawFrame, type TNode, type TreeRun } from "./engine";
import type { TFunction } from "../../i18n";

class TRec {
  root: TNode | null;
  frames: RawFrame[] = [];
  constructor(root: TNode | null) {
    this.root = cloneTree(root);
  }
  snap(o: Omit<RawFrame, "root">) {
    this.frames.push({ root: cloneTree(this.root), ...o });
  }
}

export function bstInsert(t: TFunction, root: TNode | null, value: number): { run: TreeRun; root: TNode | null } {
  const code = [
    "if (root == null) root = new Node(value)",
    "curr = root",
    "while (true):",
    "  if (value < curr.value) goLeft",
    "  else goRight",
    "  attach when spot is empty",
  ];
  const r = new TRec(root);
  if (!r.root) {
    const nn = node(value);
    r.root = nn;
    r.snap({ codeLine: 0, found: [nn.id], message: t("الشجرة فارغة، أصبحت العقدة الجديدة هي الجذر.", "The tree is empty, the new node becomes the root.") });
    return { run: buildRun({ name: t(`إدراج ${value}`, `Insert ${value}`), time: "O(log n)", space: "O(1)", code }, r.frames), root: r.root };
  }
  let curr: TNode = r.root;
  r.snap({ active: [curr.id], codeLine: 1, message: t(`نبدأ من الجذر (${curr.value}).`, `Start from the root (${curr.value}).`) });
  while (true) {
    if (value === curr.value) {
      r.snap({ found: [curr.id], codeLine: 2, message: t(`القيمة ${value} موجودة مسبقاً — شجرة BST لا تقبل التكرار.`, `Value ${value} already exists — a BST does not allow duplicates.`) });
      break;
    }
    if (value < curr.value) {
      r.snap({ active: [curr.id], compare: [curr.id], codeLine: 3, message: t(`${value} < ${curr.value} ← نتجه إلى اليسار.`, `${value} < ${curr.value} ← go left.`) });
      if (!curr.left) {
        curr.left = node(value);
        r.snap({ found: [curr.left.id], codeLine: 5, message: t(`المكان الأيسر فارغ ← أدرجنا ${value}. تمّ الإدراج.`, `The left spot is empty ← inserted ${value}. Insertion done.`) });
        break;
      }
      curr = curr.left;
    } else {
      r.snap({ active: [curr.id], compare: [curr.id], codeLine: 4, message: t(`${value} > ${curr.value} ← نتجه إلى اليمين.`, `${value} > ${curr.value} ← go right.`) });
      if (!curr.right) {
        curr.right = node(value);
        r.snap({ found: [curr.right.id], codeLine: 5, message: t(`المكان الأيمن فارغ ← أدرجنا ${value}. تمّ الإدراج.`, `The right spot is empty ← inserted ${value}. Insertion done.`) });
        break;
      }
      curr = curr.right;
    }
  }
  return { run: buildRun({ name: t(`إدراج ${value}`, `Insert ${value}`), time: "O(log n)", space: "O(1)", code }, r.frames), root: r.root };
}

export function bstSearch(t: TFunction, root: TNode | null, value: number): { run: TreeRun; root: TNode | null } {
  const code = [
    "curr = root",
    "while (curr != null):",
    "  if (value == curr.value) return curr",
    "  else if (value < curr.value) curr = curr.left",
    "  else curr = curr.right",
    "return null",
  ];
  const r = new TRec(root);
  let curr = r.root;
  while (curr) {
    r.snap({ active: [curr.id], compare: [curr.id], codeLine: 2, message: t(`هل ${value} == ${curr.value}؟`, `Is ${value} == ${curr.value}?`) });
    if (value === curr.value) {
      r.snap({ found: [curr.id], codeLine: 2, message: t(`وُجدت القيمة ${value}!`, `Found value ${value}!`) });
      return { run: buildRun({ name: t(`بحث عن ${value}`, `Search for ${value}`), time: "O(log n)", space: "O(1)", code }, r.frames), root: r.root };
    }
    if (value < curr.value) {
      r.snap({ active: [curr.id], codeLine: 3, message: t(`${value} < ${curr.value} ← نتجه يساراً.`, `${value} < ${curr.value} ← go left.`) });
      curr = curr.left;
    } else {
      r.snap({ active: [curr.id], codeLine: 4, message: t(`${value} > ${curr.value} ← نتجه يميناً.`, `${value} > ${curr.value} ← go right.`) });
      curr = curr.right;
    }
  }
  r.snap({ codeLine: 5, message: t(`وصلنا لعقدة فارغة — القيمة ${value} غير موجودة.`, `Reached a null node — value ${value} is not present.`) });
  return { run: buildRun({ name: t(`بحث عن ${value}`, `Search for ${value}`), time: "O(log n)", space: "O(1)", code }, r.frames), root: r.root };
}

export function bstDelete(t: TFunction, root: TNode | null, value: number): { run: TreeRun; root: TNode | null } {
  const code = [
    "find node with value (track parent)",
    "case A: leaf → detach",
    "case B: one child → bypass node",
    "case C: two children →",
    "  find inorder successor (min of right)",
    "  copy successor value, delete successor",
  ];
  const r = new TRec(root);
  let curr = r.root;
  let parent: TNode | null = null;
  while (curr && curr.value !== value) {
    r.snap({ active: [curr.id], compare: [curr.id], codeLine: 0, message: t(`نبحث عن ${value}... الحالية ${curr.value}.`, `Searching for ${value}... current is ${curr.value}.`) });
    parent = curr;
    curr = value < curr.value ? curr.left : curr.right;
  }
  if (!curr) {
    r.snap({ codeLine: 0, message: t(`القيمة ${value} غير موجودة، لا حذف.`, `Value ${value} is not present, nothing to delete.`) });
    return { run: buildRun({ name: t(`حذف ${value}`, `Delete ${value}`), time: "O(log n)", space: "O(1)", code }, r.frames), root: r.root };
  }
  r.snap({ found: [curr.id], codeLine: 0, message: t(`وجدنا العقدة (${value}) المراد حذفها.`, `Found the node (${value}) to delete.`) });

  if (curr.left && curr.right) {
    r.snap({ found: [curr.id], codeLine: 3, message: t("للعقدة ابنان — نحتاج البديل (inorder successor).", "The node has two children — we need the inorder successor.") });
    let succParent = curr;
    let succ = curr.right;
    r.snap({ active: [succ.id], codeLine: 4, message: t("البديل = أصغر قيمة في الشجرة اليمنى.", "The successor = the smallest value in the right subtree.") });
    while (succ.left) {
      succParent = succ;
      succ = succ.left;
      r.snap({ active: [succ.id], codeLine: 4, message: t(`نتابع يساراً للوصول للأصغر (${succ.value}).`, `Keep going left to reach the smallest (${succ.value}).`) });
    }
    r.snap({ found: [succ.id, curr.id], codeLine: 5, message: t(`البديل هو ${succ.value} ← ننسخه مكان ${curr.value}.`, `The successor is ${succ.value} ← copy it in place of ${curr.value}.`) });
    curr.value = succ.value;
    const child = succ.right;
    if (succParent.left === succ) succParent.left = child;
    else succParent.right = child;
    r.snap({ found: [curr.id], codeLine: 5, message: t(`حذفنا عقدة البديل الأصلية. تمّ الحذف.`, `Removed the original successor node. Deletion done.`) });
  } else {
    const child = curr.left ?? curr.right;
    const kind = child ? t("ذات ابن واحد", "with one child") : t("ورقة", "a leaf");
    if (!parent) {
      r.root = child;
    } else if (parent.left === curr) {
      parent.left = child;
    } else {
      parent.right = child;
    }
    r.snap({ codeLine: child ? 2 : 1, message: t(`العقدة ${kind} ← ${child ? "نربط الأب مباشرة بالابن" : "نفصلها"}. تمّ الحذف.`, `The node is ${kind} ← ${child ? "link the parent directly to the child" : "detach it"}. Deletion done.`) });
  }
  return { run: buildRun({ name: t(`حذف ${value}`, `Delete ${value}`), time: "O(log n)", space: "O(1)", code }, r.frames), root: r.root };
}

type Order = "inorder" | "preorder" | "postorder" | "levelorder";

export function bstTraverse(t: TFunction, root: TNode | null, order: Order): { run: TreeRun; root: TNode | null } {
  const traversalMeta: Record<Order, { name: string; code: string[] }> = {
    inorder: { name: t("تنقّل Inorder (يسار → جذر → يمين)", "Inorder traversal (left → root → right)"), code: ["inorder(node):", "  inorder(node.left)", "  visit(node)", "  inorder(node.right)"] },
    preorder: { name: t("تنقّل Preorder (جذر → يسار → يمين)", "Preorder traversal (root → left → right)"), code: ["preorder(node):", "  visit(node)", "  preorder(node.left)", "  preorder(node.right)"] },
    postorder: { name: t("تنقّل Postorder (يسار → يمين → جذر)", "Postorder traversal (left → right → root)"), code: ["postorder(node):", "  postorder(node.left)", "  postorder(node.right)", "  visit(node)"] },
    levelorder: { name: t("تنقّل Level-order (BFS بالطوابق)", "Level-order traversal (BFS by levels)"), code: ["queue = [root]", "while queue not empty:", "  node = queue.dequeue()", "  visit(node)", "  enqueue(node.left, node.right)"] },
  };
  const r = new TRec(root);
  const visit: number[] = [];
  const visitedIds: string[] = [];
  const push = (n: TNode, codeLine: number) => {
    visit.push(n.value);
    visitedIds.push(n.id);
    r.snap({ active: [n.id], found: [...visitedIds], visit: [...visit], codeLine, message: t(`نعالج العقدة ${n.value}. التسلسل: [${visit.join("، ")}]`, `Visit node ${n.value}. Sequence: [${visit.join(", ")}]`) });
  };

  if (!r.root) {
    r.snap({ codeLine: 0, visit: [], message: t("الشجرة فارغة.", "The tree is empty.") });
  } else if (order === "levelorder") {
    const queue: TNode[] = [r.root];
    while (queue.length) {
      const n = queue.shift()!;
      push(n, 3);
      if (n.left) queue.push(n.left);
      if (n.right) queue.push(n.right);
    }
  } else {
    const rec = (n: TNode | null) => {
      if (!n) return;
      if (order === "preorder") push(n, 1);
      rec(n.left);
      if (order === "inorder") push(n, 2);
      rec(n.right);
      if (order === "postorder") push(n, 3);
    };
    rec(r.root);
  }
  r.snap({ found: [...visitedIds], visit: [...visit], codeLine: 0, message: t(`اكتمل التنقّل. الناتج: [${visit.join("، ")}]`, `Traversal complete. Output: [${visit.join(", ")}]`) });

  const meta = traversalMeta[order];
  return {
    run: buildRun({ name: meta.name, time: "O(n)", space: "O(n)", code: meta.code, showVisit: true }, r.frames),
    root: r.root,
  };
}
