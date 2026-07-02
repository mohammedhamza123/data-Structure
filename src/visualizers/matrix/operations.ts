import type { ComplexityClass } from "../../data/complexity";
import type { TFunction } from "../../i18n";

export type CellPos = { row: number; col: number };

export type MatrixFrame = {
  matrix: number[][];
  /** 1D array view when mode is array1d */
  array1d: number[] | null;
  highlight: CellPos[];
  highlightRow: number | null;
  highlightCol: number | null;
  rowSums: number[] | null;
  runningSum: number | null;
  swapPair: [CellPos, CellPos] | null;
  codeLine: number;
  message: string;
};

export type MatrixRun = {
  name: string;
  best: ComplexityClass;
  average: ComplexityClass;
  worst: ComplexityClass;
  space: ComplexityClass;
  code: string[];
  frames: MatrixFrame[];
};

export type MatrixOpKey = "array1d" | "reverse" | "rowSums" | "rowColSum" | "diagonal";

export const defaultMatrix = (): number[][] => [
  [3, 7, 2, 9],
  [5, 1, 8, 4],
  [6, 2, 5, 3],
  [9, 4, 1, 7],
];

export const defaultArray1d = (): number[] => [12, 5, 8, 3, 15, 7];

export const randomMatrix = (rows = 4, cols = 4): number[][] =>
  Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => Math.floor(Math.random() * 90) + 1),
  );

export const randomArray1d = (n = 6): number[] =>
  Array.from({ length: n }, () => Math.floor(Math.random() * 90) + 1);

function cloneMatrix(m: number[][]): number[][] {
  return m.map((row) => [...row]);
}

class Recorder {
  matrix: number[][];
  array1d: number[] | null = null;
  frames: MatrixFrame[] = [];

  constructor(matrix: number[][]) {
    this.matrix = cloneMatrix(matrix);
  }

  snap(opts: {
    array1d?: number[] | null;
    highlight?: CellPos[];
    highlightRow?: number | null;
    highlightCol?: number | null;
    rowSums?: number[] | null;
    runningSum?: number | null;
    swapPair?: [CellPos, CellPos] | null;
    codeLine: number;
    message: string;
  }) {
    this.frames.push({
      matrix: cloneMatrix(this.matrix),
      array1d: opts.array1d !== undefined ? (opts.array1d ? [...opts.array1d] : null) : this.array1d,
      highlight: opts.highlight ?? [],
      highlightRow: opts.highlightRow ?? null,
      highlightCol: opts.highlightCol ?? null,
      rowSums: opts.rowSums ?? null,
      runningSum: opts.runningSum ?? null,
      swapPair: opts.swapPair ?? null,
      codeLine: opts.codeLine,
      message: opts.message,
    });
  }
}

export function traverse1DArray(t: TFunction, arr: number[]): MatrixRun {
  const r = new Recorder([[]]);
  r.array1d = [...arr];
  const code = [
    "int a[n];",
    "for (int i = 0; i < n; i++) {",
    "  cout << a[i] << \" \";",
    "  // access by index in O(1)",
    "}",
  ];
  r.snap({
    array1d: r.array1d,
    codeLine: 1,
    message: t(
      "مصفوفة أحادية البُعد: عناصر متجاورة في الذاكرة، الوصول بالمؤشر i.",
      "1D array: contiguous elements in memory, accessed by index i.",
    ),
  });
  for (let i = 0; i < arr.length; i++) {
    r.snap({
      array1d: r.array1d,
      highlight: [{ row: 0, col: i }],
      codeLine: 2,
      message: t(
        `الموضع i = ${i} ← القيمة a[${i}] = ${arr[i]}`,
        `Index i = ${i} ← value a[${i}] = ${arr[i]}`,
      ),
    });
  }
  r.snap({
    array1d: r.array1d,
    codeLine: 3,
    message: t(
      "اكتمل المرور. التعقيد O(n) لزيارة كل عنصر.",
      "Traversal complete. Complexity O(n) to visit every element.",
    ),
  });
  return {
    name: t("مصفوفة أحادية البُعد", "1D Array"),
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    space: "O(1)",
    code,
    frames: r.frames,
  };
}

export function reverseMatrix(t: TFunction, matrix: number[][]): MatrixRun {
  const r = new Recorder(matrix);
  const rows = r.matrix.length;
  const cols = r.matrix[0]?.length ?? 0;
  const code = [
    "for (int i = 0; i < rows; i++) {",
    "  for (int j = 0; j < cols / 2; j++) {",
    "    swap(a[i][j], a[i][cols - 1 - j]);",
    "  }",
    "}",
  ];
  r.snap({
    codeLine: 0,
    message: t(
      "عكس المصفوفة: نعكس كل صف بتبديل العناصر من الطرفين.",
      "Reverse the matrix: flip each row by swapping elements from both ends.",
    ),
  });
  for (let i = 0; i < rows; i++) {
    r.snap({
      highlightRow: i,
      codeLine: 0,
      message: t(`نعمل على الصف ${i}.`, `Working on row ${i}.`),
    });
    for (let j = 0; j < Math.floor(cols / 2); j++) {
      const cj = cols - 1 - j;
      const a = r.matrix[i][j];
      const b = r.matrix[i][cj];
      r.snap({
        highlightRow: i,
        highlight: [
          { row: i, col: j },
          { row: i, col: cj },
        ],
        swapPair: [
          { row: i, col: j },
          { row: i, col: cj },
        ],
        codeLine: 2,
        message: t(
          `تبديل a[${i}][${j}] = ${a} مع a[${i}][${cj}] = ${b}`,
          `Swap a[${i}][${j}] = ${a} with a[${i}][${cj}] = ${b}`,
        ),
      });
      const tmp = r.matrix[i][j];
      r.matrix[i][j] = r.matrix[i][cj];
      r.matrix[i][cj] = tmp;
      r.snap({
        highlightRow: i,
        highlight: [
          { row: i, col: j },
          { row: i, col: cj },
        ],
        codeLine: 2,
        message: t("تمّ التبديل.", "Swapped."),
      });
    }
    r.snap({
      highlightRow: i,
      codeLine: 0,
      message: t(`الصف ${i} أصبح معكوساً.`, `Row ${i} is now reversed.`),
    });
  }
  r.snap({
    codeLine: 0,
    message: t("اكتمل عكس المصفوفة ثنائية البُعد!", "2D matrix reversal complete!"),
  });
  return {
    name: t("عكس المصفوفة", "Reverse Matrix"),
    best: "O(n²)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
    code,
    frames: r.frames,
  };
}

export function sumAllRows(t: TFunction, matrix: number[][]): MatrixRun {
  const r = new Recorder(matrix);
  const rows = r.matrix.length;
  const cols = r.matrix[0]?.length ?? 0;
  const code = [
    "int rowSum[rows];",
    "for (int i = 0; i < rows; i++) {",
    "  int sum = 0;",
    "  for (int j = 0; j < cols; j++) {",
    "    sum += a[i][j];",
    "  }",
    "  rowSum[i] = sum;",
    "}",
  ];
  const rowSums: number[] = [];
  r.snap({
    codeLine: 1,
    message: t("جمع كل صف: نمرّ على كل صف ونجمع عناصره.", "Sum each row: iterate every row and add its elements."),
  });
  for (let i = 0; i < rows; i++) {
    let sum = 0;
    r.snap({
      highlightRow: i,
      rowSums: [...rowSums],
      runningSum: 0,
      codeLine: 2,
      message: t(`الصف ${i}: نبدأ sum = 0`, `Row ${i}: start with sum = 0`),
    });
    for (let j = 0; j < cols; j++) {
      sum += r.matrix[i][j];
      r.snap({
        highlightRow: i,
        highlight: [{ row: i, col: j }],
        rowSums: [...rowSums],
        runningSum: sum,
        codeLine: 4,
        message: t(
          `a[${i}][${j}] = ${r.matrix[i][j]} ← sum = ${sum}`,
          `a[${i}][${j}] = ${r.matrix[i][j]} ← sum = ${sum}`,
        ),
      });
    }
    rowSums.push(sum);
    r.snap({
      highlightRow: i,
      rowSums: [...rowSums],
      runningSum: sum,
      codeLine: 6,
      message: t(`مجموع الصف ${i} = ${sum}`, `Row ${i} sum = ${sum}`),
    });
  }
  r.snap({
    rowSums: [...rowSums],
    codeLine: 1,
    message: t(
      `اكتمل! مجموعات الصفوف: [${rowSums.join(", ")}]`,
      `Done! Row sums: [${rowSums.join(", ")}]`,
    ),
  });
  return {
    name: t("جمع كل صف", "Sum Each Row"),
    best: "O(n²)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(n)",
    code,
    frames: r.frames,
  };
}

export function sumRowAndColumn(
  t: TFunction,
  matrix: number[][],
  targetRow: number,
  targetCol: number,
): MatrixRun {
  const r = new Recorder(matrix);
  const rows = r.matrix.length;
  const cols = r.matrix[0]?.length ?? 0;
  const ri = Math.max(0, Math.min(rows - 1, targetRow));
  const ci = Math.max(0, Math.min(cols - 1, targetCol));
  const code = [
    "int rowSum = 0;",
    "for (int j = 0; j < cols; j++) {",
    "  rowSum += a[row][j];",
    "}",
    "int colSum = 0;",
    "for (int i = 0; i < rows; i++) {",
    "  colSum += a[i][col];",
    "}",
  ];
  let rowSum = 0;
  r.snap({
    highlightRow: ri,
    highlightCol: ci,
    codeLine: 0,
    message: t(
      `جمع الصف ${ri} والعمود ${ci}.`,
      `Sum row ${ri} and column ${ci}.`,
    ),
  });
  r.snap({ highlightRow: ri, codeLine: 0, message: t("rowSum = 0", "rowSum = 0") });
  for (let j = 0; j < cols; j++) {
    rowSum += r.matrix[ri][j];
    r.snap({
      highlightRow: ri,
      highlight: [{ row: ri, col: j }],
      runningSum: rowSum,
      codeLine: 2,
      message: t(
        `a[${ri}][${j}] = ${r.matrix[ri][j]} ← rowSum = ${rowSum}`,
        `a[${ri}][${j}] = ${r.matrix[ri][j]} ← rowSum = ${rowSum}`,
      ),
    });
  }
  r.snap({
    highlightRow: ri,
    runningSum: rowSum,
    codeLine: 2,
    message: t(`مجموع الصف ${ri} = ${rowSum}`, `Row ${ri} sum = ${rowSum}`),
  });
  let colSum = 0;
  r.snap({
    highlightCol: ci,
    runningSum: rowSum,
    codeLine: 4,
    message: t("colSum = 0", "colSum = 0"),
  });
  for (let i = 0; i < rows; i++) {
    colSum += r.matrix[i][ci];
    r.snap({
      highlightCol: ci,
      highlight: [{ row: i, col: ci }],
      runningSum: colSum,
      codeLine: 6,
      message: t(
        `a[${i}][${ci}] = ${r.matrix[i][ci]} ← colSum = ${colSum}`,
        `a[${i}][${ci}] = ${r.matrix[i][ci]} ← colSum = ${colSum}`,
      ),
    });
  }
  r.snap({
    highlightRow: ri,
    highlightCol: ci,
    runningSum: colSum,
    codeLine: 6,
    message: t(
      `مجموع الصف ${ri} = ${rowSum} · مجموع العمود ${ci} = ${colSum}`,
      `Row ${ri} sum = ${rowSum} · Column ${ci} sum = ${colSum}`,
    ),
  });
  return {
    name: t("جمع صف وعمود", "Row & Column Sum"),
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    space: "O(1)",
    code,
    frames: r.frames,
  };
}

export function sumMainDiagonal(t: TFunction, matrix: number[][]): MatrixRun {
  const r = new Recorder(matrix);
  const n = Math.min(r.matrix.length, r.matrix[0]?.length ?? 0);
  const code = [
    "int sum = 0;",
    "for (int i = 0; i < n; i++) {",
    "  sum += a[i][i];  // main diagonal",
    "}",
  ];
  let sum = 0;
  r.snap({
    codeLine: 0,
    message: t(
      "مجموع عناصر القطر الرئيسي: المواضع حيث i = j.",
      "Main diagonal sum: positions where i = j.",
    ),
  });
  r.snap({ codeLine: 0, message: t("sum = 0", "sum = 0") });
  for (let i = 0; i < n; i++) {
    sum += r.matrix[i][i];
    r.snap({
      highlight: [{ row: i, col: i }],
      runningSum: sum,
      codeLine: 2,
      message: t(
        `a[${i}][${i}] = ${r.matrix[i][i]} ← sum = ${sum}`,
        `a[${i}][${i}] = ${r.matrix[i][i]} ← sum = ${sum}`,
      ),
    });
  }
  r.snap({
    runningSum: sum,
    codeLine: 2,
    message: t(
      `مجموع القطر الرئيسي = ${sum}`,
      `Main diagonal sum = ${sum}`,
    ),
  });
  return {
    name: t("مجموع القطر الرئيسي", "Main Diagonal Sum"),
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    space: "O(1)",
    code,
    frames: r.frames,
  };
}

export type MatrixOpDef = {
  key: MatrixOpKey;
  label: string;
  run: (matrix: number[][], array1d: number[], row: number, col: number) => MatrixRun;
};

export function getMatrixOperations(t: TFunction): MatrixOpDef[] {
  return [
    {
      key: "array1d",
      label: t("مصفوفة 1D", "1D Array"),
      run: (_m, arr) => traverse1DArray(t, arr),
    },
    {
      key: "reverse",
      label: t("عكس المصفوفة", "Reverse Matrix"),
      run: (m) => reverseMatrix(t, m),
    },
    {
      key: "rowSums",
      label: t("جمع كل صف", "Sum Each Row"),
      run: (m) => sumAllRows(t, m),
    },
    {
      key: "rowColSum",
      label: t("جمع صف وعمود", "Row & Column Sum"),
      run: (m, _a, row, col) => sumRowAndColumn(t, m, row, col),
    },
    {
      key: "diagonal",
      label: t("القطر الرئيسي", "Main Diagonal"),
      run: (m) => sumMainDiagonal(t, m),
    },
  ];
}
