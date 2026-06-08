import type { ComplexityClass } from "../../data/complexity";

export type CallFrame = {
  id: string;
  label: string;
  depth: number;
  status: "active" | "waiting" | "returned";
  ret?: string;
};

export type RecFrame = {
  stack: CallFrame[];
  codeLine: number;
  message: string;
  result?: string;
};

export type RecRun = {
  name: string;
  kind: string;
  time: ComplexityClass;
  space: ComplexityClass;
  code: string[];
  frames: RecFrame[];
  result: string;
};

class RR {
  stack: CallFrame[] = [];
  frames: RecFrame[] = [];
  private idc = 0;
  private snapStack() {
    return this.stack.map((f) => ({ ...f }));
  }
  snap(codeLine: number, message: string, result?: string) {
    this.frames.push({ stack: this.snapStack(), codeLine, message, result });
  }
  enter(label: string, codeLine: number, message: string): CallFrame {
    for (const f of this.stack) if (f.status === "active") f.status = "waiting";
    const f: CallFrame = { id: `c${this.idc++}`, label, depth: this.stack.length, status: "active" };
    this.stack.push(f);
    this.snap(codeLine, message);
    return f;
  }
  ret(f: CallFrame, value: string, codeLine: number, message: string) {
    f.status = "returned";
    f.ret = value;
    this.snap(codeLine, message);
    this.stack.pop();
    const top = this.stack[this.stack.length - 1];
    if (top) top.status = "active";
  }
}

export type InputField = { name: string; label: string; default: number; min: number; max: number };

export type ExampleDef = {
  key: string;
  label: string;
  kind: string;
  time: ComplexityClass;
  space: ComplexityClass;
  code: string[];
  inputs: InputField[];
  run: (v: Record<string, number>) => RecRun;
};

const factorial: ExampleDef = {
  key: "factorial",
  label: "المضروب (Factorial)",
  kind: "خطي (Linear) · غير ذيلي — العملية تُجرى بعد عودة الاستدعاء",
  time: "O(n)",
  space: "O(n)",
  code: ["fact(n):", "  if (n <= 1) return 1", "  sub = fact(n - 1)", "  return n * sub"],
  inputs: [{ name: "n", label: "n", default: 4, min: 0, max: 9 }],
  run: ({ n }) => {
    const r = new RR();
    const fact = (k: number): number => {
      const f = r.enter(`fact(${k})`, 0, `استدعاء fact(${k}) — يُضاف إطار جديد لأعلى المكدس.`);
      if (k <= 1) {
        r.snap(1, `الحالة الأساسية: ${k} ≤ 1 ← نُرجع 1.`);
        r.ret(f, "1", 1, `fact(${k}) = 1، يُسحب الإطار.`);
        return 1;
      }
      r.snap(2, `${k} > 1 ← نستدعي fact(${k - 1}) وننتظر نتيجته.`);
      const sub = fact(k - 1);
      const result = k * sub;
      r.ret(f, String(result), 3, `fact(${k}) = ${k} × ${sub} = ${result}.`);
      return result;
    };
    const res = fact(n);
    r.snap(0, `انتهى الاستدعاء الذاتي. الناتج النهائي: fact(${n}) = ${res}.`, String(res));
    return { name: `fact(${n})`, kind: factorial.kind, time: factorial.time, space: factorial.space, code: factorial.code, frames: r.frames, result: String(res) };
  },
};

const sumTail: ExampleDef = {
  key: "sum",
  label: "المجموع الذيلي (Tail Sum)",
  kind: "ذيلي (Tail) — الاستدعاء آخر عملية، يمكن تحويله لحلقة",
  time: "O(n)",
  space: "O(n)",
  code: ["sum(n, acc):", "  if (n == 0) return acc", "  return sum(n - 1, acc + n)  // tail call"],
  inputs: [{ name: "n", label: "n", default: 5, min: 0, max: 10 }],
  run: ({ n }) => {
    const r = new RR();
    const sum = (k: number, acc: number): number => {
      const f = r.enter(`sum(${k}, ${acc})`, 0, `استدعاء sum(${k}, acc=${acc}).`);
      if (k === 0) {
        r.snap(1, `k = 0 ← نُرجع المجمّع acc = ${acc}.`);
        r.ret(f, String(acc), 1, `النتيجة النهائية ${acc} تعود مباشرة عبر كل الإطارات.`);
        return acc;
      }
      r.snap(2, `استدعاء ذيلي: sum(${k - 1}, ${acc + k}). لا توجد عملية بعد العودة.`);
      const result = sum(k - 1, acc + k);
      r.ret(f, String(result), 2, `sum(${k}, ${acc}) تُمرّر النتيجة ${result} كما هي.`);
      return result;
    };
    const res = sum(n, 0);
    r.snap(0, `الناتج: مجموع 1..${n} = ${res}.`, String(res));
    return { name: `sum(${n})`, kind: sumTail.kind, time: sumTail.time, space: sumTail.space, code: sumTail.code, frames: r.frames, result: String(res) };
  },
};

const fibonacci: ExampleDef = {
  key: "fib",
  label: "فيبوناتشي (Fibonacci)",
  kind: "شجري / ثنائي (Tree) — كل استدعاء يولّد استدعاءين",
  time: "O(2ⁿ)",
  space: "O(n)",
  code: ["fib(n):", "  if (n <= 1) return n", "  return fib(n-1) + fib(n-2)"],
  inputs: [{ name: "n", label: "n", default: 5, min: 0, max: 8 }],
  run: ({ n }) => {
    const r = new RR();
    const fib = (k: number): number => {
      const f = r.enter(`fib(${k})`, 0, `استدعاء fib(${k}).`);
      if (k <= 1) {
        r.snap(1, `الحالة الأساسية: fib(${k}) = ${k}.`);
        r.ret(f, String(k), 1, `fib(${k}) = ${k}.`);
        return k;
      }
      r.snap(2, `fib(${k}) = fib(${k - 1}) + fib(${k - 2}) — فرعان.`);
      const a = fib(k - 1);
      const b = fib(k - 2);
      const result = a + b;
      r.ret(f, String(result), 2, `fib(${k}) = ${a} + ${b} = ${result}.`);
      return result;
    };
    const res = fib(n);
    r.snap(0, `الناتج: fib(${n}) = ${res}. لاحظ تكرار الاستدعاءات (لهذا التعقيد أُسّي).`, String(res));
    return { name: `fib(${n})`, kind: fibonacci.kind, time: fibonacci.time, space: fibonacci.space, code: fibonacci.code, frames: r.frames, result: String(res) };
  },
};

const power: ExampleDef = {
  key: "power",
  label: "الأس (Power)",
  kind: "خطي (Linear)",
  time: "O(n)",
  space: "O(n)",
  code: ["power(a, b):", "  if (b == 0) return 1", "  return a * power(a, b - 1)"],
  inputs: [
    { name: "a", label: "a", default: 2, min: 1, max: 5 },
    { name: "b", label: "b", default: 4, min: 0, max: 8 },
  ],
  run: ({ a, b }) => {
    const r = new RR();
    const pw = (base: number, exp: number): number => {
      const f = r.enter(`power(${base}, ${exp})`, 0, `استدعاء power(${base}, ${exp}).`);
      if (exp === 0) {
        r.snap(1, `الأس 0 ← نُرجع 1.`);
        r.ret(f, "1", 1, `power(${base}, 0) = 1.`);
        return 1;
      }
      r.snap(2, `نستدعي power(${base}, ${exp - 1}).`);
      const sub = pw(base, exp - 1);
      const result = base * sub;
      r.ret(f, String(result), 2, `${base} × ${sub} = ${result}.`);
      return result;
    };
    const res = pw(a, b);
    r.snap(0, `الناتج: ${a}^${b} = ${res}.`, String(res));
    return { name: `power(${a}, ${b})`, kind: power.kind, time: power.time, space: power.space, code: power.code, frames: r.frames, result: String(res) };
  },
};

const gcd: ExampleDef = {
  key: "gcd",
  label: "القاسم المشترك (GCD)",
  kind: "ذيلي (Tail) — خوارزمية إقليدس",
  time: "O(log n)",
  space: "O(log n)",
  code: ["gcd(a, b):", "  if (b == 0) return a", "  return gcd(b, a % b)"],
  inputs: [
    { name: "a", label: "a", default: 48, min: 1, max: 200 },
    { name: "b", label: "b", default: 36, min: 0, max: 200 },
  ],
  run: ({ a, b }) => {
    const r = new RR();
    const g = (x: number, y: number): number => {
      const f = r.enter(`gcd(${x}, ${y})`, 0, `استدعاء gcd(${x}, ${y}).`);
      if (y === 0) {
        r.snap(1, `b = 0 ← القاسم المشترك هو ${x}.`);
        r.ret(f, String(x), 1, `gcd = ${x}.`);
        return x;
      }
      r.snap(2, `استدعاء ذيلي: gcd(${y}, ${x} % ${y} = ${x % y}).`);
      const result = g(y, x % y);
      r.ret(f, String(result), 2, `تعود النتيجة ${result}.`);
      return result;
    };
    const res = g(a, b);
    r.snap(0, `الناتج: gcd(${a}, ${b}) = ${res}.`, String(res));
    return { name: `gcd(${a}, ${b})`, kind: gcd.kind, time: gcd.time, space: gcd.space, code: gcd.code, frames: r.frames, result: String(res) };
  },
};

const evenOdd: ExampleDef = {
  key: "evenodd",
  label: "زوجي/فردي (Mutual)",
  kind: "متبادل / غير مباشر (Mutual) — دالتان تستدعيان بعضهما",
  time: "O(n)",
  space: "O(n)",
  code: ["isEven(n):", "  if (n == 0) return true", "  return isOdd(n - 1)", "isOdd(n):", "  if (n == 0) return false", "  return isEven(n - 1)"],
  inputs: [{ name: "n", label: "n", default: 4, min: 0, max: 10 }],
  run: ({ n }) => {
    const r = new RR();
    const isEven = (k: number): boolean => {
      const f = r.enter(`isEven(${k})`, 0, `استدعاء isEven(${k}).`);
      if (k === 0) {
        r.snap(1, `0 زوجي ← نُرجع صحيح.`);
        r.ret(f, "صحيح", 1, `isEven(0) = صحيح.`);
        return true;
      }
      r.snap(2, `isEven(${k}) تستدعي isOdd(${k - 1}).`);
      const res = isOdd(k - 1);
      r.ret(f, res ? "صحيح" : "خطأ", 2, `isEven(${k}) = ${res ? "صحيح" : "خطأ"}.`);
      return res;
    };
    const isOdd = (k: number): boolean => {
      const f = r.enter(`isOdd(${k})`, 3, `استدعاء isOdd(${k}).`);
      if (k === 0) {
        r.snap(4, `0 ليس فردياً ← نُرجع خطأ.`);
        r.ret(f, "خطأ", 4, `isOdd(0) = خطأ.`);
        return false;
      }
      r.snap(5, `isOdd(${k}) تستدعي isEven(${k - 1}).`);
      const res = isEven(k - 1);
      r.ret(f, res ? "صحيح" : "خطأ", 5, `isOdd(${k}) = ${res ? "صحيح" : "خطأ"}.`);
      return res;
    };
    const res = isEven(n);
    r.snap(0, `الناتج: ${n} ${res ? "زوجي" : "فردي"}.`, res ? "زوجي" : "فردي");
    return { name: `isEven(${n})`, kind: evenOdd.kind, time: evenOdd.time, space: evenOdd.space, code: evenOdd.code, frames: r.frames, result: res ? "زوجي" : "فردي" };
  },
};

const ackermann: ExampleDef = {
  key: "ackermann",
  label: "أكرمان (Ackermann)",
  kind: "متداخل (Nested) — استدعاء داخل وسيط استدعاء آخر",
  time: "O(2ⁿ)",
  space: "O(n)",
  code: ["ack(m, n):", "  if (m == 0) return n + 1", "  if (n == 0) return ack(m-1, 1)", "  return ack(m-1, ack(m, n-1))"],
  inputs: [
    { name: "m", label: "m", default: 2, min: 0, max: 3 },
    { name: "n", label: "n", default: 2, min: 0, max: 4 },
  ],
  run: ({ m, n }) => {
    const r = new RR();
    const ack = (mm: number, nn: number): number => {
      const f = r.enter(`ack(${mm}, ${nn})`, 0, `استدعاء ack(${mm}, ${nn}).`);
      if (mm === 0) {
        r.snap(1, `m = 0 ← نُرجع n + 1 = ${nn + 1}.`);
        r.ret(f, String(nn + 1), 1, `ack(${mm}, ${nn}) = ${nn + 1}.`);
        return nn + 1;
      }
      if (nn === 0) {
        r.snap(2, `n = 0 ← نستدعي ack(${mm - 1}, 1).`);
        const res0 = ack(mm - 1, 1);
        r.ret(f, String(res0), 2, `ack(${mm}, 0) = ${res0}.`);
        return res0;
      }
      r.snap(3, `استدعاء متداخل: ack(${mm - 1}, ack(${mm}, ${nn - 1})).`);
      const inner = ack(mm, nn - 1);
      const result = ack(mm - 1, inner);
      r.ret(f, String(result), 3, `ack(${mm}, ${nn}) = ${result}.`);
      return result;
    };
    const res = ack(m, n);
    r.snap(0, `الناتج: ack(${m}, ${n}) = ${res}.`, String(res));
    return { name: `ack(${m}, ${n})`, kind: ackermann.kind, time: ackermann.time, space: ackermann.space, code: ackermann.code, frames: r.frames, result: String(res) };
  },
};

export const recursionExamples: ExampleDef[] = [factorial, sumTail, fibonacci, power, gcd, evenOdd, ackermann];
