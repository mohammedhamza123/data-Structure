import type { ComplexityClass } from "../../data/complexity";

export type StackItem = { id: string; value: number };

export type StackFrame = {
  items: StackItem[];
  active: string[];
  entering: string[];
  fading: string[];
  codeLine: number;
  message: string;
};

export type StackRun = {
  name: string;
  time: ComplexityClass;
  space: ComplexityClass;
  code: string[];
  frames: StackFrame[];
  items: StackItem[];
};

let counter = 0;
export const makeStackItem = (value: number): StackItem => ({ id: `st${counter++}`, value });
const clone = (items: StackItem[]) => items.map((i) => ({ ...i }));

type FrameInit = Partial<StackFrame> & { items: StackItem[]; codeLine: number; message: string };
const frame = (f: FrameInit): StackFrame => ({ active: [], entering: [], fading: [], ...f });

export function push(items: StackItem[], value: number): StackRun {
  const node = makeStackItem(value);
  const after = [...items, node];
  const code = ["push(value):", "  top = top + 1", "  stack[top] = value"];
  const frames: StackFrame[] = [
    frame({ items: clone(items), codeLine: 0, message: `نريد إضافة ${value} إلى قمة المكدس.` }),
    frame({ items: clone(after), entering: [node.id], active: [node.id], codeLine: 2, message: `وضعنا ${value} في القمة (top). الإضافة دائماً من الأعلى — LIFO. O(1).` }),
  ];
  return { name: `Push ${value}`, time: "O(1)", space: "O(1)", code, frames, items: after };
}

export function pop(items: StackItem[]): StackRun {
  const code = ["pop():", "  if (isEmpty) underflow", "  value = stack[top]", "  top = top - 1", "  return value"];
  if (items.length === 0) {
    return {
      name: "Pop",
      time: "O(1)",
      space: "O(1)",
      code,
      frames: [frame({ items: [], codeLine: 1, message: "المكدس فارغ — Underflow! لا يمكن السحب." })],
      items: [],
    };
  }
  const top = items[items.length - 1];
  const after = items.slice(0, -1);
  const frames: StackFrame[] = [
    frame({ items: clone(items), active: [top.id], codeLine: 2, message: `نقرأ قيمة القمة: ${top.value}.` }),
    frame({ items: clone(items), fading: [top.id], codeLine: 3, message: `نزيل ${top.value} من القمة وننقص top.` }),
    frame({ items: clone(after), codeLine: 4, message: `سُحبت القيمة ${top.value}. O(1).` }),
  ];
  return { name: "Pop", time: "O(1)", space: "O(1)", code, frames, items: after };
}

export function peek(items: StackItem[]): StackRun {
  const code = ["peek():", "  if (isEmpty) return null", "  return stack[top]"];
  if (items.length === 0) {
    return { name: "Peek", time: "O(1)", space: "O(1)", code, frames: [frame({ items: [], codeLine: 1, message: "المكدس فارغ، لا قيمة في القمة." })], items: [] };
  }
  const top = items[items.length - 1];
  return {
    name: "Peek",
    time: "O(1)",
    space: "O(1)",
    code,
    frames: [frame({ items: clone(items), active: [top.id], codeLine: 2, message: `قيمة القمة هي ${top.value} (دون إزالتها).` })],
    items: clone(items),
  };
}
