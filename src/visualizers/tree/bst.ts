import { buildRun, cloneTree, node, type RawFrame, type TNode, type TreeRun } from "./engine";

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

export function bstInsert(root: TNode | null, value: number): { run: TreeRun; root: TNode | null } {
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
    r.snap({ codeLine: 0, found: [nn.id], message: "الشجرة فارغة، أصبحت العقدة الجديدة هي الجذر." });
    return { run: buildRun({ name: `إدراج ${value}`, time: "O(log n)", space: "O(1)", code }, r.frames), root: r.root };
  }
  let curr: TNode = r.root;
  r.snap({ active: [curr.id], codeLine: 1, message: `نبدأ من الجذر (${curr.value}).` });
  while (true) {
    if (value === curr.value) {
      r.snap({ found: [curr.id], codeLine: 2, message: `القيمة ${value} موجودة مسبقاً — شجرة BST لا تقبل التكرار.` });
      break;
    }
    if (value < curr.value) {
      r.snap({ active: [curr.id], compare: [curr.id], codeLine: 3, message: `${value} < ${curr.value} ← نتجه إلى اليسار.` });
      if (!curr.left) {
        curr.left = node(value);
        r.snap({ found: [curr.left.id], codeLine: 5, message: `المكان الأيسر فارغ ← أدرجنا ${value}. تمّ الإدراج.` });
        break;
      }
      curr = curr.left;
    } else {
      r.snap({ active: [curr.id], compare: [curr.id], codeLine: 4, message: `${value} > ${curr.value} ← نتجه إلى اليمين.` });
      if (!curr.right) {
        curr.right = node(value);
        r.snap({ found: [curr.right.id], codeLine: 5, message: `المكان الأيمن فارغ ← أدرجنا ${value}. تمّ الإدراج.` });
        break;
      }
      curr = curr.right;
    }
  }
  return { run: buildRun({ name: `إدراج ${value}`, time: "O(log n)", space: "O(1)", code }, r.frames), root: r.root };
}

export function bstSearch(root: TNode | null, value: number): { run: TreeRun; root: TNode | null } {
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
    r.snap({ active: [curr.id], compare: [curr.id], codeLine: 2, message: `هل ${value} == ${curr.value}؟` });
    if (value === curr.value) {
      r.snap({ found: [curr.id], codeLine: 2, message: `وُجدت القيمة ${value}!` });
      return { run: buildRun({ name: `بحث عن ${value}`, time: "O(log n)", space: "O(1)", code }, r.frames), root: r.root };
    }
    if (value < curr.value) {
      r.snap({ active: [curr.id], codeLine: 3, message: `${value} < ${curr.value} ← نتجه يساراً.` });
      curr = curr.left;
    } else {
      r.snap({ active: [curr.id], codeLine: 4, message: `${value} > ${curr.value} ← نتجه يميناً.` });
      curr = curr.right;
    }
  }
  r.snap({ codeLine: 5, message: `وصلنا لعقدة فارغة — القيمة ${value} غير موجودة.` });
  return { run: buildRun({ name: `بحث عن ${value}`, time: "O(log n)", space: "O(1)", code }, r.frames), root: r.root };
}

export function bstDelete(root: TNode | null, value: number): { run: TreeRun; root: TNode | null } {
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
    r.snap({ active: [curr.id], compare: [curr.id], codeLine: 0, message: `نبحث عن ${value}... الحالية ${curr.value}.` });
    parent = curr;
    curr = value < curr.value ? curr.left : curr.right;
  }
  if (!curr) {
    r.snap({ codeLine: 0, message: `القيمة ${value} غير موجودة، لا حذف.` });
    return { run: buildRun({ name: `حذف ${value}`, time: "O(log n)", space: "O(1)", code }, r.frames), root: r.root };
  }
  r.snap({ found: [curr.id], codeLine: 0, message: `وجدنا العقدة (${value}) المراد حذفها.` });

  if (curr.left && curr.right) {
    r.snap({ found: [curr.id], codeLine: 3, message: "للعقدة ابنان — نحتاج البديل (inorder successor)." });
    let succParent = curr;
    let succ = curr.right;
    r.snap({ active: [succ.id], codeLine: 4, message: "البديل = أصغر قيمة في الشجرة اليمنى." });
    while (succ.left) {
      succParent = succ;
      succ = succ.left;
      r.snap({ active: [succ.id], codeLine: 4, message: `نتابع يساراً للوصول للأصغر (${succ.value}).` });
    }
    r.snap({ found: [succ.id, curr.id], codeLine: 5, message: `البديل هو ${succ.value} ← ننسخه مكان ${curr.value}.` });
    curr.value = succ.value;
    const child = succ.right;
    if (succParent.left === succ) succParent.left = child;
    else succParent.right = child;
    r.snap({ found: [curr.id], codeLine: 5, message: `حذفنا عقدة البديل الأصلية. تمّ الحذف.` });
  } else {
    const child = curr.left ?? curr.right;
    const kind = child ? "ذات ابن واحد" : "ورقة";
    if (!parent) {
      r.root = child;
    } else if (parent.left === curr) {
      parent.left = child;
    } else {
      parent.right = child;
    }
    r.snap({ codeLine: child ? 2 : 1, message: `العقدة ${kind} ← ${child ? "نربط الأب مباشرة بالابن" : "نفصلها"}. تمّ الحذف.` });
  }
  return { run: buildRun({ name: `حذف ${value}`, time: "O(log n)", space: "O(1)", code }, r.frames), root: r.root };
}

type Order = "inorder" | "preorder" | "postorder" | "levelorder";

const traversalMeta: Record<Order, { name: string; code: string[] }> = {
  inorder: { name: "تنقّل Inorder (يسار → جذر → يمين)", code: ["inorder(node):", "  inorder(node.left)", "  visit(node)", "  inorder(node.right)"] },
  preorder: { name: "تنقّل Preorder (جذر → يسار → يمين)", code: ["preorder(node):", "  visit(node)", "  preorder(node.left)", "  preorder(node.right)"] },
  postorder: { name: "تنقّل Postorder (يسار → يمين → جذر)", code: ["postorder(node):", "  postorder(node.left)", "  postorder(node.right)", "  visit(node)"] },
  levelorder: { name: "تنقّل Level-order (BFS بالطوابق)", code: ["queue = [root]", "while queue not empty:", "  node = queue.dequeue()", "  visit(node)", "  enqueue(node.left, node.right)"] },
};

export function bstTraverse(root: TNode | null, order: Order): { run: TreeRun; root: TNode | null } {
  const r = new TRec(root);
  const visit: number[] = [];
  const visitedIds: string[] = [];
  const push = (n: TNode, codeLine: number) => {
    visit.push(n.value);
    visitedIds.push(n.id);
    r.snap({ active: [n.id], found: [...visitedIds], visit: [...visit], codeLine, message: `نعالج العقدة ${n.value}. التسلسل: [${visit.join("، ")}]` });
  };

  if (!r.root) {
    r.snap({ codeLine: 0, visit: [], message: "الشجرة فارغة." });
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
  r.snap({ found: [...visitedIds], visit: [...visit], codeLine: 0, message: `اكتمل التنقّل. الناتج: [${visit.join("، ")}]` });

  const meta = traversalMeta[order];
  return {
    run: buildRun({ name: meta.name, time: "O(n)", space: "O(n)", code: meta.code, showVisit: true }, r.frames),
    root: r.root,
  };
}
