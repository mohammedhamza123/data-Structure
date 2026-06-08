import type { ComplexityClass } from "../../data/complexity";
import type { TFunction } from "../../i18n";

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

export function push(t: TFunction, items: StackItem[], value: number): StackRun {
  const node = makeStackItem(value);
  const after = [...items, node];
  const code = ["push(value):", "  top = top + 1", "  stack[top] = value"];
  const frames: StackFrame[] = [
    frame({ items: clone(items), codeLine: 0, message: t(`نريد إضافة ${value} إلى قمة المكدس.`, `We want to push ${value} onto the top of the stack.`) }),
    frame({ items: clone(after), entering: [node.id], active: [node.id], codeLine: 2, message: t(`وضعنا ${value} في القمة (top). الإضافة دائماً من الأعلى — LIFO. O(1).`, `Placed ${value} at the top. Push always happens at the top — LIFO. O(1).`) }),
  ];
  return { name: `Push ${value}`, time: "O(1)", space: "O(1)", code, frames, items: after };
}

export function pop(t: TFunction, items: StackItem[]): StackRun {
  const code = ["pop():", "  if (isEmpty) underflow", "  value = stack[top]", "  top = top - 1", "  return value"];
  if (items.length === 0) {
    return {
      name: "Pop",
      time: "O(1)",
      space: "O(1)",
      code,
      frames: [frame({ items: [], codeLine: 1, message: t("المكدس فارغ — Underflow! لا يمكن السحب.", "The stack is empty — Underflow! Cannot pop.") })],
      items: [],
    };
  }
  const top = items[items.length - 1];
  const after = items.slice(0, -1);
  const frames: StackFrame[] = [
    frame({ items: clone(items), active: [top.id], codeLine: 2, message: t(`نقرأ قيمة القمة: ${top.value}.`, `Read the top value: ${top.value}.`) }),
    frame({ items: clone(items), fading: [top.id], codeLine: 3, message: t(`نزيل ${top.value} من القمة وننقص top.`, `Remove ${top.value} from the top and decrement top.`) }),
    frame({ items: clone(after), codeLine: 4, message: t(`سُحبت القيمة ${top.value}. O(1).`, `Popped value ${top.value}. O(1).`) }),
  ];
  return { name: "Pop", time: "O(1)", space: "O(1)", code, frames, items: after };
}

export function peek(t: TFunction, items: StackItem[]): StackRun {
  const code = ["peek():", "  if (isEmpty) return null", "  return stack[top]"];
  if (items.length === 0) {
    return { name: "Peek", time: "O(1)", space: "O(1)", code, frames: [frame({ items: [], codeLine: 1, message: t("المكدس فارغ، لا قيمة في القمة.", "The stack is empty, no value at the top.") })], items: [] };
  }
  const top = items[items.length - 1];
  return {
    name: "Peek",
    time: "O(1)",
    space: "O(1)",
    code,
    frames: [frame({ items: clone(items), active: [top.id], codeLine: 2, message: t(`قيمة القمة هي ${top.value} (دون إزالتها).`, `The top value is ${top.value} (without removing it).`) })],
    items: clone(items),
  };
}
