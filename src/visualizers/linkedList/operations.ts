import type { ComplexityClass } from "../../data/complexity";

export type LLNode = { id: string; value: number };

export type Frame = {
  nodes: LLNode[];
  pointer: number | null;
  highlightIds: string[];
  fadingIds: string[];
  enteringIds: string[];
  codeLine: number;
  message: string;
};

export type Operation = {
  title: string;
  time: ComplexityClass;
  space: ComplexityClass;
  code: string[];
  frames: Frame[];
  finalNodes: LLNode[];
};

let counter = 0;
export const makeNode = (value: number): LLNode => ({ id: `n${counter++}`, value });

const clone = (nodes: LLNode[]): LLNode[] => nodes.map((n) => ({ ...n }));

type FrameInit = Partial<Frame> & { nodes: LLNode[]; message: string; codeLine: number };
const frame = (f: FrameInit): Frame => ({
  pointer: null,
  highlightIds: [],
  fadingIds: [],
  enteringIds: [],
  ...f,
});

export function insertHead(nodes: LLNode[], value: number): Operation {
  const node = makeNode(value);
  const after = [node, ...nodes];
  const code = [
    "Node newNode = new Node(value)",
    "newNode.next = head",
    "head = newNode",
  ];
  const frames: Frame[] = [
    frame({ nodes: clone(nodes), codeLine: 0, message: `إنشاء عقدة جديدة بالقيمة ${value}.` }),
    frame({
      nodes: clone(after),
      codeLine: 1,
      enteringIds: [node.id],
      highlightIds: [node.id],
      pointer: 0,
      message: "نوجّه مؤشر next للعقدة الجديدة نحو الرأس الحالي.",
    }),
    frame({
      nodes: clone(after),
      codeLine: 2,
      highlightIds: [node.id],
      pointer: 0,
      message: "تحديث head ليشير للعقدة الجديدة. تمت الإضافة في زمن ثابت O(1).",
    }),
  ];
  return { title: `إضافة ${value} للبداية`, time: "O(1)", space: "O(1)", code, frames, finalNodes: after };
}

export function insertTail(nodes: LLNode[], value: number): Operation {
  const node = makeNode(value);
  const after = [...nodes, node];
  const code = [
    "Node newNode = new Node(value)",
    "if (head == null) { head = newNode; return }",
    "Node curr = head",
    "while (curr.next != null) curr = curr.next",
    "curr.next = newNode",
  ];
  const frames: Frame[] = [
    frame({ nodes: clone(nodes), codeLine: 0, message: `إنشاء عقدة جديدة بالقيمة ${value}.` }),
  ];
  if (nodes.length === 0) {
    frames.push(
      frame({
        nodes: clone(after),
        codeLine: 1,
        enteringIds: [node.id],
        highlightIds: [node.id],
        pointer: 0,
        message: "القائمة فارغة، أصبحت العقدة الجديدة هي الرأس. O(1).",
      })
    );
    return { title: `إضافة ${value} للنهاية`, time: "O(1)", space: "O(1)", code, frames, finalNodes: after };
  }
  frames.push(
    frame({ nodes: clone(nodes), codeLine: 2, pointer: 0, message: "نبدأ من الرأس بالمؤشر curr." })
  );
  for (let i = 0; i < nodes.length - 1; i++) {
    frames.push(
      frame({
        nodes: clone(nodes),
        codeLine: 3,
        pointer: i + 1,
        message: `curr.next ليست فارغة، ننتقل للعقدة التالية (${nodes[i + 1].value}).`,
      })
    );
  }
  frames.push(
    frame({
      nodes: clone(after),
      codeLine: 4,
      enteringIds: [node.id],
      highlightIds: [node.id],
      pointer: nodes.length,
      message: `وصلنا للنهاية، نربط آخر عقدة بالعقدة الجديدة. المرور كلّف O(n).`,
    })
  );
  return { title: `إضافة ${value} للنهاية`, time: "O(n)", space: "O(1)", code, frames, finalNodes: after };
}

export function insertAt(nodes: LLNode[], index: number, value: number): Operation {
  const idx = Math.max(0, Math.min(index, nodes.length));
  if (idx === 0) return { ...insertHead(nodes, value), title: `إدراج ${value} عند الموضع 0` };
  if (idx >= nodes.length) return { ...insertTail(nodes, value), title: `إدراج ${value} عند الموضع ${idx}` };
  const node = makeNode(value);
  const after = [...nodes.slice(0, idx), node, ...nodes.slice(idx)];
  const code = [
    "Node curr = head",
    "for (i = 0; i < index - 1; i++) curr = curr.next",
    "newNode.next = curr.next",
    "curr.next = newNode",
  ];
  const frames: Frame[] = [
    frame({ nodes: clone(nodes), codeLine: 0, pointer: 0, message: "نبدأ من الرأس للوصول لما قبل موضع الإدراج." }),
  ];
  for (let i = 0; i < idx - 1; i++) {
    frames.push(
      frame({ nodes: clone(nodes), codeLine: 1, pointer: i + 1, message: `الانتقال للعقدة عند الموضع ${i + 1}.` })
    );
  }
  frames.push(
    frame({
      nodes: clone(after),
      codeLine: 2,
      enteringIds: [node.id],
      highlightIds: [node.id],
      pointer: idx,
      message: "توجيه next للعقدة الجديدة نحو العقدة التالية.",
    })
  );
  frames.push(
    frame({
      nodes: clone(after),
      codeLine: 3,
      highlightIds: [node.id],
      pointer: idx,
      message: `ربط العقدة السابقة بالعقدة الجديدة. الإدراج عند موضع وسطي يكلّف O(n).`,
    })
  );
  return { title: `إدراج ${value} عند الموضع ${idx}`, time: "O(n)", space: "O(1)", code, frames, finalNodes: after };
}

export function deleteHead(nodes: LLNode[]): Operation {
  const code = ["if (head == null) return", "Node temp = head", "head = head.next", "free(temp)"];
  if (nodes.length === 0) {
    return {
      title: "حذف البداية",
      time: "O(1)",
      space: "O(1)",
      code,
      frames: [frame({ nodes: [], codeLine: 0, message: "القائمة فارغة، لا شيء لحذفه." })],
      finalNodes: [],
    };
  }
  const removed = nodes[0];
  const after = nodes.slice(1);
  const frames: Frame[] = [
    frame({ nodes: clone(nodes), codeLine: 1, pointer: 0, fadingIds: [removed.id], message: `نحفظ الرأس (${removed.value}) في مؤشر مؤقت.` }),
    frame({ nodes: clone(nodes), codeLine: 2, pointer: 1 <= nodes.length - 1 ? 1 : null, fadingIds: [removed.id], message: "نحرّك head ليشير للعقدة الثانية." }),
    frame({ nodes: clone(after), codeLine: 3, message: `تحرير العقدة المحذوفة. الحذف من البداية O(1).` }),
  ];
  return { title: `حذف البداية (${removed.value})`, time: "O(1)", space: "O(1)", code, frames, finalNodes: after };
}

export function deleteTail(nodes: LLNode[]): Operation {
  const code = [
    "if (head == null) return",
    "if (head.next == null) { head = null; return }",
    "Node curr = head",
    "while (curr.next.next != null) curr = curr.next",
    "curr.next = null",
  ];
  if (nodes.length === 0) {
    return { title: "حذف النهاية", time: "O(1)", space: "O(1)", code, frames: [frame({ nodes: [], codeLine: 0, message: "القائمة فارغة." })], finalNodes: [] };
  }
  if (nodes.length === 1) {
    return {
      title: `حذف النهاية (${nodes[0].value})`,
      time: "O(1)",
      space: "O(1)",
      code,
      frames: [
        frame({ nodes: clone(nodes), codeLine: 1, pointer: 0, fadingIds: [nodes[0].id], message: "عقدة وحيدة، نجعل head فارغاً." }),
        frame({ nodes: [], codeLine: 1, message: "أصبحت القائمة فارغة. O(1)." }),
      ],
      finalNodes: [],
    };
  }
  const removed = nodes[nodes.length - 1];
  const after = nodes.slice(0, -1);
  const frames: Frame[] = [
    frame({ nodes: clone(nodes), codeLine: 2, pointer: 0, message: "نبدأ من الرأس بحثاً عن العقدة قبل الأخيرة." }),
  ];
  for (let i = 0; i < nodes.length - 2; i++) {
    frames.push(
      frame({ nodes: clone(nodes), codeLine: 3, pointer: i + 1, message: `العقدة التالية ليست الأخيرة، ننتقل (${nodes[i + 1].value}).` })
    );
  }
  frames.push(
    frame({ nodes: clone(nodes), codeLine: 4, pointer: nodes.length - 2, fadingIds: [removed.id], message: `وصلنا لما قبل الأخيرة، نفصل العقدة الأخيرة (${removed.value}).` })
  );
  frames.push(
    frame({ nodes: clone(after), codeLine: 4, message: `تم الحذف. المرور للنهاية كلّف O(n).` })
  );
  return { title: `حذف النهاية (${removed.value})`, time: "O(n)", space: "O(1)", code, frames, finalNodes: after };
}

export function search(nodes: LLNode[], target: number): Operation {
  const code = [
    "Node curr = head; int idx = 0",
    "while (curr != null)",
    "  if (curr.value == target) return idx",
    "  curr = curr.next; idx++",
    "return -1",
  ];
  const frames: Frame[] = [
    frame({ nodes: clone(nodes), codeLine: 0, message: `نبحث عن القيمة ${target} بدءاً من الرأس.` }),
  ];
  let found = -1;
  for (let i = 0; i < nodes.length; i++) {
    frames.push(
      frame({ nodes: clone(nodes), codeLine: 2, pointer: i, message: `مقارنة: هل ${nodes[i].value} == ${target}؟` })
    );
    if (nodes[i].value === target) {
      found = i;
      frames.push(
        frame({ nodes: clone(nodes), codeLine: 2, pointer: i, highlightIds: [nodes[i].id], message: `تطابق! وُجدت القيمة عند الموضع ${i}.` })
      );
      break;
    }
    frames.push(
      frame({ nodes: clone(nodes), codeLine: 3, pointer: i, message: `لا تطابق، ننتقل للعقدة التالية.` })
    );
  }
  if (found === -1) {
    frames.push(frame({ nodes: clone(nodes), codeLine: 4, message: `انتهت القائمة، القيمة ${target} غير موجودة.` }));
  }
  return { title: `البحث عن ${target}`, time: "O(n)", space: "O(1)", code, frames, finalNodes: clone(nodes) };
}

export function reverse(nodes: LLNode[]): Operation {
  const code = [
    "Node prev = null, curr = head",
    "while (curr != null)",
    "  next = curr.next",
    "  curr.next = prev",
    "  prev = curr; curr = next",
    "head = prev",
  ];
  const frames: Frame[] = [
    frame({ nodes: clone(nodes), codeLine: 0, message: "نهيّئ ثلاثة مؤشرات: prev=null و curr=head و next." }),
  ];
  const reversed: LLNode[] = [];
  const remaining = clone(nodes);
  while (remaining.length > 0) {
    const node = remaining.shift()!;
    frames.push(
      frame({
        nodes: [...reversed.map((n) => ({ ...n })), { ...node }, ...remaining.map((n) => ({ ...n }))],
        codeLine: 2,
        pointer: reversed.length,
        highlightIds: [node.id],
        message: `نحفظ next ثم نعكس مؤشر العقدة (${node.value}) نحو الخلف.`,
      })
    );
    reversed.unshift(node);
    frames.push(
      frame({
        nodes: [...reversed.map((n) => ({ ...n })), ...remaining.map((n) => ({ ...n }))],
        codeLine: 4,
        pointer: 0,
        highlightIds: [node.id],
        message: `أصبحت العقدة (${node.value}) في مقدمة الجزء المعكوس. نحرّك prev و curr.`,
      })
    );
  }
  frames.push(
    frame({ nodes: reversed.map((n) => ({ ...n })), codeLine: 5, message: `head يشير الآن للعقدة الأخيرة سابقاً. العكس تمّ في O(n).` })
  );
  return { title: "عكس القائمة", time: "O(n)", space: "O(1)", code, frames, finalNodes: reversed.map((n) => ({ ...n })) };
}
