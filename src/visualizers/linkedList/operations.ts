import type { ComplexityClass } from "../../data/complexity";
import type { TFunction } from "../../i18n";

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

export function insertHead(t: TFunction, nodes: LLNode[], value: number): Operation {
  const node = makeNode(value);
  const after = [node, ...nodes];
  const code = [
    "Node newNode = new Node(value)",
    "newNode.next = head",
    "head = newNode",
  ];
  const frames: Frame[] = [
    frame({ nodes: clone(nodes), codeLine: 0, message: t(`إنشاء عقدة جديدة بالقيمة ${value}.`, `Create a new node with value ${value}.`) }),
    frame({
      nodes: clone(after),
      codeLine: 1,
      enteringIds: [node.id],
      highlightIds: [node.id],
      pointer: 0,
      message: t("نوجّه مؤشر next للعقدة الجديدة نحو الرأس الحالي.", "Point the new node's next pointer to the current head."),
    }),
    frame({
      nodes: clone(after),
      codeLine: 2,
      highlightIds: [node.id],
      pointer: 0,
      message: t("تحديث head ليشير للعقدة الجديدة. تمت الإضافة في زمن ثابت O(1).", "Update head to point to the new node. Insertion done in constant time O(1)."),
    }),
  ];
  return { title: t(`إضافة ${value} للبداية`, `Insert ${value} at head`), time: "O(1)", space: "O(1)", code, frames, finalNodes: after };
}

export function insertTail(t: TFunction, nodes: LLNode[], value: number): Operation {
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
    frame({ nodes: clone(nodes), codeLine: 0, message: t(`إنشاء عقدة جديدة بالقيمة ${value}.`, `Create a new node with value ${value}.`) }),
  ];
  if (nodes.length === 0) {
    frames.push(
      frame({
        nodes: clone(after),
        codeLine: 1,
        enteringIds: [node.id],
        highlightIds: [node.id],
        pointer: 0,
        message: t("القائمة فارغة، أصبحت العقدة الجديدة هي الرأس. O(1).", "The list is empty, the new node becomes the head. O(1)."),
      })
    );
    return { title: t(`إضافة ${value} للنهاية`, `Insert ${value} at tail`), time: "O(1)", space: "O(1)", code, frames, finalNodes: after };
  }
  frames.push(
    frame({ nodes: clone(nodes), codeLine: 2, pointer: 0, message: t("نبدأ من الرأس بالمؤشر curr.", "Start from the head with the curr pointer.") })
  );
  for (let i = 0; i < nodes.length - 1; i++) {
    frames.push(
      frame({
        nodes: clone(nodes),
        codeLine: 3,
        pointer: i + 1,
        message: t(`curr.next ليست فارغة، ننتقل للعقدة التالية (${nodes[i + 1].value}).`, `curr.next is not null, move to the next node (${nodes[i + 1].value}).`),
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
      message: t(`وصلنا للنهاية، نربط آخر عقدة بالعقدة الجديدة. المرور كلّف O(n).`, `Reached the end, link the last node to the new node. Traversal cost O(n).`),
    })
  );
  return { title: t(`إضافة ${value} للنهاية`, `Insert ${value} at tail`), time: "O(n)", space: "O(1)", code, frames, finalNodes: after };
}

export function insertAt(t: TFunction, nodes: LLNode[], index: number, value: number): Operation {
  const idx = Math.max(0, Math.min(index, nodes.length));
  if (idx === 0) return { ...insertHead(t, nodes, value), title: t(`إدراج ${value} عند الموضع 0`, `Insert ${value} at index 0`) };
  if (idx >= nodes.length) return { ...insertTail(t, nodes, value), title: t(`إدراج ${value} عند الموضع ${idx}`, `Insert ${value} at index ${idx}`) };
  const node = makeNode(value);
  const after = [...nodes.slice(0, idx), node, ...nodes.slice(idx)];
  const code = [
    "Node curr = head",
    "for (i = 0; i < index - 1; i++) curr = curr.next",
    "newNode.next = curr.next",
    "curr.next = newNode",
  ];
  const frames: Frame[] = [
    frame({ nodes: clone(nodes), codeLine: 0, pointer: 0, message: t("نبدأ من الرأس للوصول لما قبل موضع الإدراج.", "Start from the head to reach the node before the insertion point.") }),
  ];
  for (let i = 0; i < idx - 1; i++) {
    frames.push(
      frame({ nodes: clone(nodes), codeLine: 1, pointer: i + 1, message: t(`الانتقال للعقدة عند الموضع ${i + 1}.`, `Move to the node at index ${i + 1}.`) })
    );
  }
  frames.push(
    frame({
      nodes: clone(after),
      codeLine: 2,
      enteringIds: [node.id],
      highlightIds: [node.id],
      pointer: idx,
      message: t("توجيه next للعقدة الجديدة نحو العقدة التالية.", "Point the new node's next to the following node."),
    })
  );
  frames.push(
    frame({
      nodes: clone(after),
      codeLine: 3,
      highlightIds: [node.id],
      pointer: idx,
      message: t(`ربط العقدة السابقة بالعقدة الجديدة. الإدراج عند موضع وسطي يكلّف O(n).`, `Link the previous node to the new node. Insertion at a middle index costs O(n).`),
    })
  );
  return { title: t(`إدراج ${value} عند الموضع ${idx}`, `Insert ${value} at index ${idx}`), time: "O(n)", space: "O(1)", code, frames, finalNodes: after };
}

export function deleteHead(t: TFunction, nodes: LLNode[]): Operation {
  const code = ["if (head == null) return", "Node temp = head", "head = head.next", "free(temp)"];
  if (nodes.length === 0) {
    return {
      title: t("حذف البداية", "Delete head"),
      time: "O(1)",
      space: "O(1)",
      code,
      frames: [frame({ nodes: [], codeLine: 0, message: t("القائمة فارغة، لا شيء لحذفه.", "The list is empty, nothing to delete.") })],
      finalNodes: [],
    };
  }
  const removed = nodes[0];
  const after = nodes.slice(1);
  const frames: Frame[] = [
    frame({ nodes: clone(nodes), codeLine: 1, pointer: 0, fadingIds: [removed.id], message: t(`نحفظ الرأس (${removed.value}) في مؤشر مؤقت.`, `Save the head (${removed.value}) in a temporary pointer.`) }),
    frame({ nodes: clone(nodes), codeLine: 2, pointer: 1 <= nodes.length - 1 ? 1 : null, fadingIds: [removed.id], message: t("نحرّك head ليشير للعقدة الثانية.", "Move head to point to the second node.") }),
    frame({ nodes: clone(after), codeLine: 3, message: t(`تحرير العقدة المحذوفة. الحذف من البداية O(1).`, `Free the removed node. Deleting from the head is O(1).`) }),
  ];
  return { title: t(`حذف البداية (${removed.value})`, `Delete head (${removed.value})`), time: "O(1)", space: "O(1)", code, frames, finalNodes: after };
}

export function deleteTail(t: TFunction, nodes: LLNode[]): Operation {
  const code = [
    "if (head == null) return",
    "if (head.next == null) { head = null; return }",
    "Node curr = head",
    "while (curr.next.next != null) curr = curr.next",
    "curr.next = null",
  ];
  if (nodes.length === 0) {
    return { title: t("حذف النهاية", "Delete tail"), time: "O(1)", space: "O(1)", code, frames: [frame({ nodes: [], codeLine: 0, message: t("القائمة فارغة.", "The list is empty.") })], finalNodes: [] };
  }
  if (nodes.length === 1) {
    return {
      title: t(`حذف النهاية (${nodes[0].value})`, `Delete tail (${nodes[0].value})`),
      time: "O(1)",
      space: "O(1)",
      code,
      frames: [
        frame({ nodes: clone(nodes), codeLine: 1, pointer: 0, fadingIds: [nodes[0].id], message: t("عقدة وحيدة، نجعل head فارغاً.", "Single node, set head to null.") }),
        frame({ nodes: [], codeLine: 1, message: t("أصبحت القائمة فارغة. O(1).", "The list is now empty. O(1).") }),
      ],
      finalNodes: [],
    };
  }
  const removed = nodes[nodes.length - 1];
  const after = nodes.slice(0, -1);
  const frames: Frame[] = [
    frame({ nodes: clone(nodes), codeLine: 2, pointer: 0, message: t("نبدأ من الرأس بحثاً عن العقدة قبل الأخيرة.", "Start from the head to find the second-to-last node.") }),
  ];
  for (let i = 0; i < nodes.length - 2; i++) {
    frames.push(
      frame({ nodes: clone(nodes), codeLine: 3, pointer: i + 1, message: t(`العقدة التالية ليست الأخيرة, ننتقل (${nodes[i + 1].value}).`, `The next node is not the last, move on (${nodes[i + 1].value}).`) })
    );
  }
  frames.push(
    frame({ nodes: clone(nodes), codeLine: 4, pointer: nodes.length - 2, fadingIds: [removed.id], message: t(`وصلنا لما قبل الأخيرة، نفصل العقدة الأخيرة (${removed.value}).`, `Reached the second-to-last, detach the last node (${removed.value}).`) })
  );
  frames.push(
    frame({ nodes: clone(after), codeLine: 4, message: t(`تم الحذف. المرور للنهاية كلّف O(n).`, `Deleted. Traversing to the end cost O(n).`) })
  );
  return { title: t(`حذف النهاية (${removed.value})`, `Delete tail (${removed.value})`), time: "O(n)", space: "O(1)", code, frames, finalNodes: after };
}

export function search(t: TFunction, nodes: LLNode[], target: number): Operation {
  const code = [
    "Node curr = head; int idx = 0",
    "while (curr != null)",
    "  if (curr.value == target) return idx",
    "  curr = curr.next; idx++",
    "return -1",
  ];
  const frames: Frame[] = [
    frame({ nodes: clone(nodes), codeLine: 0, message: t(`نبحث عن القيمة ${target} بدءاً من الرأس.`, `Search for value ${target} starting from the head.`) }),
  ];
  let found = -1;
  for (let i = 0; i < nodes.length; i++) {
    frames.push(
      frame({ nodes: clone(nodes), codeLine: 2, pointer: i, message: t(`مقارنة: هل ${nodes[i].value} == ${target}؟`, `Compare: is ${nodes[i].value} == ${target}?`) })
    );
    if (nodes[i].value === target) {
      found = i;
      frames.push(
        frame({ nodes: clone(nodes), codeLine: 2, pointer: i, highlightIds: [nodes[i].id], message: t(`تطابق! وُجدت القيمة عند الموضع ${i}.`, `Match! Value found at index ${i}.`) })
      );
      break;
    }
    frames.push(
      frame({ nodes: clone(nodes), codeLine: 3, pointer: i, message: t(`لا تطابق، ننتقل للعقدة التالية.`, `No match, move to the next node.`) })
    );
  }
  if (found === -1) {
    frames.push(frame({ nodes: clone(nodes), codeLine: 4, message: t(`انتهت القائمة، القيمة ${target} غير موجودة.`, `End of list, value ${target} not found.`) }));
  }
  return { title: t(`البحث عن ${target}`, `Search for ${target}`), time: "O(n)", space: "O(1)", code, frames, finalNodes: clone(nodes) };
}

export function mergeSortList(t: TFunction, nodes: LLNode[]): Operation {
  const code = [
    "mergeSort(head):",
    "  if (head == null || head.next == null) return head",
    "  mid = split(head)           // slow/fast pointers",
    "  left = mergeSort(firstHalf)",
    "  right = mergeSort(secondHalf)",
    "  return merge(left, right)",
  ];
  const work = clone(nodes);
  const frames: Frame[] = [];
  const snap = (f: Partial<Frame> & { codeLine: number; message: string }) =>
    frames.push(frame({ nodes: clone(work), ...f }));
  const rangeIds = (lo: number, hi: number) => work.slice(lo, hi + 1).map((n) => n.id);

  if (work.length <= 1) {
    snap({ codeLine: 1, highlightIds: work.map((n) => n.id), message: t("القائمة فيها عنصر واحد أو فارغة ← مرتّبة أصلاً.", "The list has one element or is empty ← already sorted.") });
    return { title: t("ترتيب الدمج", "Merge sort"), time: "O(n log n)", space: "O(log n)", code, frames, finalNodes: clone(work) };
  }

  snap({ codeLine: 0, message: t("ترتيب الدمج: نقسّم القائمة لنصفين ثم ندمجهما مرتّبين.", "Merge sort: split the list into two halves, then merge them in order.") });

  const merge = (lo: number, mid: number, hi: number) => {
    const left = work.slice(lo, mid + 1);
    const right = work.slice(mid + 1, hi + 1);
    const merged: LLNode[] = [];
    let i = 0;
    let j = 0;
    while (i < left.length && j < right.length) {
      snap({
        codeLine: 5,
        highlightIds: [left[i].id, right[j].id],
        pointer: lo + merged.length,
        message: t(`دمج: نقارن ${left[i].value} و ${right[j].value} ونأخذ الأصغر.`, `Merge: compare ${left[i].value} and ${right[j].value} and take the smaller.`),
      });
      if (left[i].value <= right[j].value) merged.push(left[i++]);
      else merged.push(right[j++]);
    }
    while (i < left.length) merged.push(left[i++]);
    while (j < right.length) merged.push(right[j++]);
    for (let k = 0; k < merged.length; k++) work[lo + k] = merged[k];
    snap({
      codeLine: 5,
      highlightIds: rangeIds(lo, hi),
      message: t(`دُمج المجال [${lo}..${hi}] بترتيب صحيح.`, `Merged the range [${lo}..${hi}] in correct order.`),
    });
  };

  const ms = (lo: number, hi: number) => {
    if (lo >= hi) return;
    const mid = Math.floor((lo + hi) / 2);
    snap({
      codeLine: 2,
      highlightIds: rangeIds(lo, hi),
      pointer: mid,
      message: t(`نقسّم المجال [${lo}..${hi}] عند المنتصف ${mid} (مؤشرا slow/fast).`, `Split the range [${lo}..${hi}] at the middle ${mid} (slow/fast pointers).`),
    });
    ms(lo, mid);
    ms(mid + 1, hi);
    merge(lo, mid, hi);
  };

  ms(0, work.length - 1);
  snap({ codeLine: 5, highlightIds: work.map((n) => n.id), message: t("اكتمل الترتيب! القائمة مرتّبة تصاعدياً.", "Sorting complete! The list is sorted in ascending order.") });
  return { title: t("ترتيب الدمج", "Merge sort"), time: "O(n log n)", space: "O(log n)", code, frames, finalNodes: clone(work) };
}

export function reverse(t: TFunction, nodes: LLNode[]): Operation {
  const code = [
    "Node prev = null, curr = head",
    "while (curr != null)",
    "  next = curr.next",
    "  curr.next = prev",
    "  prev = curr; curr = next",
    "head = prev",
  ];
  const frames: Frame[] = [
    frame({ nodes: clone(nodes), codeLine: 0, message: t("نهيّئ ثلاثة مؤشرات: prev=null و curr=head و next.", "Initialize three pointers: prev=null, curr=head, and next.") }),
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
        message: t(`نحفظ next ثم نعكس مؤشر العقدة (${node.value}) نحو الخلف.`, `Save next, then reverse the node's pointer (${node.value}) backwards.`),
      })
    );
    reversed.unshift(node);
    frames.push(
      frame({
        nodes: [...reversed.map((n) => ({ ...n })), ...remaining.map((n) => ({ ...n }))],
        codeLine: 4,
        pointer: 0,
        highlightIds: [node.id],
        message: t(`أصبحت العقدة (${node.value}) في مقدمة الجزء المعكوس. نحرّك prev و curr.`, `Node (${node.value}) is now at the front of the reversed part. Move prev and curr.`),
      })
    );
  }
  frames.push(
    frame({ nodes: reversed.map((n) => ({ ...n })), codeLine: 5, message: t(`head يشير الآن للعقدة الأخيرة سابقاً. العكس تمّ في O(n).`, `head now points to the previously last node. Reversal done in O(n).`) })
  );
  return { title: t("عكس القائمة", "Reverse list"), time: "O(n)", space: "O(1)", code, frames, finalNodes: reversed.map((n) => ({ ...n })) };
}
