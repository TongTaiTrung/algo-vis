export interface QueryRMQ {
  L: number;
  R: number;
}

export interface InputSparseTable {
  arr: number[];
  queries: QueryRMQ[];
}

export interface IntervalInfo {
  start: number;
  length: number;
  label: string;
  type: 'left' | 'right' | 'query' | 'overlap';
}

export interface StateSparseTable {
  arr: number[];
  table: (number | null)[][]; // table[k][i]: min in range [i, i + 2^k - 1]
  maxK: number;
  currentK: number | null;
  currentI: number | null;
  leftSource: { k: number; i: number } | null;
  rightSource: { k: number; i: number } | null;
  currentQueryIdx: number | null;
  currentQuery: {
    L: number;
    R: number;
    k: number;
    len: number;
    leftVal: number;
    rightVal: number;
    result: number;
  } | null;
  queryResults: {
    queryIdx: number;
    L: number;
    R: number;
    ans: number;
  }[];
  activeIntervals: IntervalInfo[];
  phaseType: 
    | 'INIT_K0' 
    | 'BUILD_TABLE' 
    | 'BUILD_ROW_DONE' 
    | 'BUILD_COMPLETE' 
    | 'QUERY_EXEC' 
    | 'QUERY_RESULT' 
    | 'ALL_DONE';
}

export interface StepSparseTable {
  stepId: number;
  phase: string;
  narrative: string;
  activeLine: number;
  memory: Record<string, string | number>;
  state: StateSparseTable;
}

export const PSEUDOCODE_SPARSE_TABLE = [
  "function buildSparseTable(A, N):",
  "    K = floor(log2(N))",
  "    for i = 0 to N - 1:",
  "        st[0][i] = A[i]  // Tầng cơ sở độ dài 2^0 = 1",
  "    for k = 1 to K:",
  "        for i = 0 to N - (1 << k):",
  "            st[k][i] = min(st[k-1][i], st[k-1][i + (1 << (k-1))])",
  "",
  "function queryRMQ(L, R):",
  "    len = R - L + 1",
  "    k = floor(log2(len))",
  "    ans = min(st[k][L], st[k][R - (1 << k) + 1])",
  "    return ans"
];

export function generateTracesSparseTable(input: InputSparseTable): StepSparseTable[] {
  const steps: StepSparseTable[] = [];
  let stepId = 0;
  const { arr, queries } = input;
  const n = arr.length;

  if (n === 0) return steps;

  const maxK = Math.floor(Math.log2(n));

  // Initialize table with nulls: (maxK + 1) rows, n cols
  const table: (number | null)[][] = Array.from({ length: maxK + 1 }, () => 
    Array.from({ length: n }, () => null)
  );

  const cloneTable = (): (number | null)[][] => {
    return table.map(row => [...row]);
  };

  const snap = (
    phase: string,
    narrative: string,
    activeLine: number,
    memory: Record<string, string | number>,
    stateOverrides: Partial<StateSparseTable>
  ) => {
    steps.push({
      stepId: stepId++,
      phase,
      narrative,
      activeLine,
      memory: { ...memory },
      state: {
        arr: [...arr],
        table: cloneTable(),
        maxK,
        currentK: null,
        currentI: null,
        leftSource: null,
        rightSource: null,
        currentQueryIdx: null,
        currentQuery: null,
        queryResults: [],
        activeIntervals: [],
        phaseType: 'BUILD_TABLE',
        ...stateOverrides
      }
    });
  };

  const mem: Record<string, string | number> = {
    N: n,
    maxK: maxK
  };

  // 1. Initial overview step
  snap(
    "Khởi tạo Bảng Thưa (Sparse Table)",
    `Bắt đầu thuật toán Bảng Thưa với mảng gồm N = ${n} phần tử. Số tầng tối đa cần xây dựng là K = ⌊log₂(N)⌋ = ${maxK}. Mỗi ô st[k][i] sẽ lưu giá trị nhỏ nhất trong đoạn độ dài 2^k bắt đầu từ chỉ số i.`,
    2,
    mem,
    {
      phaseType: 'BUILD_TABLE'
    }
  );

  // 2. Base layer: k = 0
  for (let i = 0; i < n; i++) {
    table[0][i] = arr[i];
    mem['k'] = 0;
    mem['i'] = i;
    mem['st[0][i]'] = arr[i];

    snap(
      "Điền tầng cơ sở k = 0 (Độ dài 2⁰ = 1)",
      `Tại tầng k = 0 (độ dài đoạn 2⁰ = 1), mỗi ô st[0][${i}] lưu giá trị chính phần tử arr[${i}] = ${arr[i]}. Đây là cơ sở quy hoạch động ban đầu.`,
      4,
      mem,
      {
        currentK: 0,
        currentI: i,
        activeIntervals: [
          { start: i, length: 1, label: `arr[${i}]=${arr[i]}`, type: 'left' }
        ],
        phaseType: 'INIT_K0'
      }
    );
  }

  // 3. Build higher layers: k = 1 to maxK
  for (let k = 1; k <= maxK; k++) {
    const halfLen = 1 << (k - 1);
    const fullLen = 1 << k;
    mem['k'] = k;
    mem['2^k'] = fullLen;
    mem['2^(k-1)'] = halfLen;

    snap(
      `Bắt đầu xây dựng tầng k = ${k} (Độ dài 2^${k} = ${fullLen})`,
      `Tại tầng k = ${k}, mỗi ô st[${k}][i] phủ đoạn có độ dài 2^${k} = ${fullLen}. Ta chia đôi đoạn này thành 2 nửa có độ dài 2^${k-1} = ${halfLen} đã được tính toán ở tầng k = ${k-1}.`,
      5,
      mem,
      {
        currentK: k,
        currentI: null,
        phaseType: 'BUILD_TABLE'
      }
    );

    const limitI = n - fullLen;
    for (let i = 0; i <= limitI; i++) {
      const leftVal = table[k - 1][i]!;
      const rightIdx = i + halfLen;
      const rightVal = table[k - 1][rightIdx]!;
      const minVal = Math.min(leftVal, rightVal);

      table[k][i] = minVal;
      mem['i'] = i;
      mem['left_val'] = leftVal;
      mem['right_idx'] = rightIdx;
      mem['right_val'] = rightVal;
      mem['min_val'] = minVal;

      snap(
        `Quy hoạch động st[${k}][${i}] = min(st[${k-1}][${i}], st[${k-1}][${rightIdx}])`,
        `Tính st[${k}][${i}] cho đoạn [${i}, ${i + fullLen - 1}]: Ghép nửa trái st[${k-1}][${i}] = ${leftVal} (đoạn [${i}, ${i + halfLen - 1}]) với nửa phải st[${k-1}][${rightIdx}] = ${rightVal} (đoạn [${rightIdx}, ${i + fullLen - 1}]). Giá trị nhỏ nhất là min(${leftVal}, ${rightVal}) = ${minVal}.`,
        7,
        mem,
        {
          currentK: k,
          currentI: i,
          leftSource: { k: k - 1, i },
          rightSource: { k: k - 1, i: rightIdx },
          activeIntervals: [
            { start: i, length: halfLen, label: `Trái: ${leftVal}`, type: 'left' },
            { start: rightIdx, length: halfLen, label: `Phải: ${rightVal}`, type: 'right' }
          ],
          phaseType: 'BUILD_TABLE'
        }
      );
    }

    snap(
      `Hoàn tất tầng k = ${k}`,
      `Tất cả các đoạn độ dài 2^${k} = ${fullLen} đã được tiền xử lý thành công. Các ô ngoài biên (i > ${limitI}) để trống vì vượt quá kích thước mảng N = ${n}.`,
      5,
      mem,
      {
        currentK: k,
        phaseType: 'BUILD_ROW_DONE'
      }
    );
  }

  // 4. Preprocessing complete
  snap(
    "Hoàn thành tiền xử lý Bảng Thưa (O(N log N))",
    `Bảng Thưa đã sẵn sàng! Tổng thời gian tiền xử lý là O(N log N). Từ bây giờ, bất kỳ truy vấn Range Minimum Query (RMQ) trên đoạn [L, R] nào cũng được trả lời chỉ trong O(1).`,
    8,
    mem,
    {
      phaseType: 'BUILD_COMPLETE'
    }
  );

  // 5. Process queries
  const queryResults: { queryIdx: number; L: number; R: number; ans: number }[] = [];

  for (let qIdx = 0; qIdx < queries.length; qIdx++) {
    const { L, R } = queries[qIdx];
    const len = R - L + 1;
    const k = Math.floor(Math.log2(len));
    const powerLen = 1 << k;
    const rightStart = R - powerLen + 1;

    const leftVal = table[k][L]!;
    const rightVal = table[k][rightStart]!;
    const ans = Math.min(leftVal, rightVal);

    mem['query_idx'] = qIdx + 1;
    mem['L'] = L;
    mem['R'] = R;
    mem['len'] = len;
    mem['k'] = k;
    mem['2^k'] = powerLen;
    mem['left_idx'] = L;
    mem['left_val'] = leftVal;
    mem['right_idx'] = rightStart;
    mem['right_val'] = rightVal;
    mem['RMQ_ans'] = ans;

    // Step 5a: Analyze query
    snap(
      `Truy vấn ${qIdx + 1}: RMQ([${L}, ${R}])`,
      `Nhận truy vấn tìm giá trị nhỏ nhất trên đoạn [${L}, ${R}]. Độ dài đoạn len = ${R} - ${L} + 1 = ${len}. Lũy thừa lớn nhất của 2 không vượt quá len là 2^k với k = ⌊log₂(${len})⌋ = ${k} (độ dài 2^${k} = ${powerLen}).`,
      10,
      mem,
      {
        currentQueryIdx: qIdx,
        currentQuery: {
          L, R, k, len, leftVal, rightVal, result: ans
        },
        queryResults: [...queryResults],
        activeIntervals: [
          { start: L, length: len, label: `Mục tiêu [${L}, ${R}] (len=${len})`, type: 'query' }
        ],
        phaseType: 'QUERY_EXEC'
      }
    );

    // Step 5b: Overlapping intervals & Idempotent property
    const isOverlapping = rightStart < L + powerLen;
    const overlapDesc = isOverlapping
      ? `Hai đoạn [${L}, ${L + powerLen - 1}] và [${rightStart}, ${R}] chồng lấn (overlap) lên nhau. Nhờ tính chất lũy đẳng của phép min (min(x, x) = x), việc các phần tử bị tính 2 lần hoàn toàn không làm sai lệch kết quả!`
      : `Hai đoạn [${L}, ${L + powerLen - 1}] và [${rightStart}, ${R}] ghép kín đoạn [${L}, ${R}] mà không trùng nhau.`;

    snap(
      `Phủ đoạn bằng 2 khối 2^${k}: st[${k}][${L}] & st[${k}][${rightStart}]`,
      `Đoạn trái: st[${k}][${L}] = ${leftVal} (phủ [${L}, ${L + powerLen - 1}]). Đoạn phải: st[${k}][${rightStart}] = ${rightVal} (phủ [${rightStart}, ${R}]). ${overlapDesc}`,
      11,
      mem,
      {
        currentQueryIdx: qIdx,
        currentQuery: {
          L, R, k, len, leftVal, rightVal, result: ans
        },
        leftSource: { k, i: L },
        rightSource: { k, i: rightStart },
        queryResults: [...queryResults],
        activeIntervals: [
          { start: L, length: powerLen, label: `Trái st[${k}][${L}]=${leftVal}`, type: 'left' },
          { start: rightStart, length: powerLen, label: `Phải st[${k}][${rightStart}]=${rightVal}`, type: 'right' }
        ],
        phaseType: 'QUERY_EXEC'
      }
    );

    // Step 5c: Query Answer in O(1)
    queryResults.push({ queryIdx: qIdx, L, R, ans });
    snap(
      `Kết quả RMQ([${L}, ${R}]) = ${ans} trong O(1)`,
      `Đáp án cho đoạn [${L}, ${R}] là min(${leftVal}, ${rightVal}) = ${ans}. Truy vấn được giải quyết tức thì trong thời gian O(1) mà không cần duyệt qua từng phần tử!`,
      12,
      mem,
      {
        currentQueryIdx: qIdx,
        currentQuery: {
          L, R, k, len, leftVal, rightVal, result: ans
        },
        queryResults: [...queryResults],
        activeIntervals: [
          { start: L, length: len, label: `RMQ [${L}, ${R}] = ${ans}`, type: 'query' }
        ],
        phaseType: 'QUERY_RESULT'
      }
    );
  }

  // 6. All queries completed
  snap(
    "Đã hoàn thành tất cả các truy vấn!",
    `Toàn bộ ${queries.length} truy vấn RMQ đã được xử lý thành công. Bảng thưa Sparse Table chứng minh sức mạnh vượt trội cho bài toán Range Minimum Query tĩnh với tiền xử lý O(N log N) và truy vấn O(1).`,
    13,
    mem,
    {
      queryResults: [...queryResults],
      phaseType: 'ALL_DONE'
    }
  );

  return steps;
}
