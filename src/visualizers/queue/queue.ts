import type { ComplexityClass } from "../../data/complexity";

export type QueueState = {
  cells: (number | null)[];
  front: number;
  rear: number;
  count: number;
  capacity: number;
  circular: boolean;
};

export type QueueFrame = {
  cells: (number | null)[];
  front: number;
  rear: number;
  count: number;
  capacity: number;
  circular: boolean;
  active: number[];
  enter: number | null;
  exit: number | null;
  codeLine: number;
  message: string;
};

export type QueueRun = {
  name: string;
  time: ComplexityClass;
  space: ComplexityClass;
  code: string[];
  frames: QueueFrame[];
  state: QueueState;
};

export const emptyQueue = (capacity: number, circular: boolean): QueueState => ({
  cells: Array(capacity).fill(null),
  front: 0,
  rear: -1,
  count: 0,
  capacity,
  circular,
});

const snap = (s: QueueState, extra: { active?: number[]; enter?: number | null; exit?: number | null; codeLine: number; message: string }): QueueFrame => ({
  cells: [...s.cells],
  front: s.front,
  rear: s.rear,
  count: s.count,
  capacity: s.capacity,
  circular: s.circular,
  active: extra.active ?? [],
  enter: extra.enter ?? null,
  exit: extra.exit ?? null,
  codeLine: extra.codeLine,
  message: extra.message,
});

const linearEnqCode = ["enqueue(x):", "  if (rear == capacity-1) overflow", "  rear++", "  queue[rear] = x; count++"];
const circularEnqCode = ["enqueue(x):", "  if (count == capacity) full", "  rear = (rear + 1) % capacity", "  queue[rear] = x; count++"];
const linearDeqCode = ["dequeue():", "  if (count == 0) underflow", "  x = queue[front]", "  front++; count--", "  return x"];
const circularDeqCode = ["dequeue():", "  if (count == 0) empty", "  x = queue[front]", "  front = (front + 1) % capacity", "  count--; return x"];

export function enqueue(state: QueueState, value: number): QueueRun {
  const s: QueueState = { ...state, cells: [...state.cells] };
  const code = s.circular ? circularEnqCode : linearEnqCode;
  const frames: QueueFrame[] = [snap(s, { codeLine: 0, message: `نريد إضافة ${value} إلى مؤخرة الطابور (rear).` })];

  const full = s.circular ? s.count === s.capacity : s.rear === s.capacity - 1;
  if (full) {
    const msg = s.circular
      ? "الطابور ممتلئ (count == capacity) — Overflow!"
      : "الطابور ممتلئ من جهة الـ rear — Overflow! (حتى لو توجد مساحة بعد front، الطابور الخطي لا يعيد استخدامها).";
    frames.push(snap(s, { codeLine: 1, message: msg }));
    return { name: `Enqueue ${value}`, time: "O(1)", space: "O(1)", code, frames, state: s };
  }

  if (s.circular) s.rear = (s.rear + 1) % s.capacity;
  else s.rear = s.rear + 1;
  s.cells[s.rear] = value;
  s.count += 1;
  frames.push(snap(s, { active: [s.rear], enter: s.rear, codeLine: 3, message: `وضعنا ${value} عند rear=${s.rear}. O(1).` }));
  return { name: `Enqueue ${value}`, time: "O(1)", space: "O(1)", code, frames, state: s };
}

export function dequeue(state: QueueState): QueueRun {
  const s: QueueState = { ...state, cells: [...state.cells] };
  const code = s.circular ? circularDeqCode : linearDeqCode;
  if (s.count === 0) {
    return {
      name: "Dequeue",
      time: "O(1)",
      space: "O(1)",
      code,
      frames: [snap(s, { codeLine: 1, message: "الطابور فارغ — Underflow! لا شيء لإخراجه." })],
      state: s,
    };
  }
  const oldFront = s.front;
  const value = s.cells[oldFront];
  const frames: QueueFrame[] = [snap(s, { active: [oldFront], codeLine: 2, message: `نقرأ القيمة من المقدمة front=${oldFront}: ${value}.` })];
  s.cells[oldFront] = null;
  s.front = s.circular ? (s.front + 1) % s.capacity : s.front + 1;
  s.count -= 1;
  frames.push(snap(s, { exit: oldFront, codeLine: 3, message: `أخرجنا ${value}، وتقدّم front إلى ${s.front}. O(1).` }));
  return { name: "Dequeue", time: "O(1)", space: "O(1)", code, frames, state: s };
}
