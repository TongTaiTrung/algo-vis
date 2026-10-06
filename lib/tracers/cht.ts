// Convex Hull Trick (CHT) Dynamic Line Envelopes Tracer

export interface InputCHT {
  lines: { m: number; c: number }[]; // y = m*x + c
  queries: number[];                  // x values to query min y
}

export interface CHTLine {
  id: number;
  m: number;
  c: number;
}

export interface StateCHT {
  hullLines: CHTLine[];
  activeLine: CHTLine | null;
  queryX: number | null;
  bestY: number | null;
  eliminatedLine: CHTLine | null;
}

export interface StepCHT {
  stepId: number; phase: string; narrative: string; activeLine: number;
  callingLine?: number | number[];
  memory: Record<string, string | number>; state: StateCHT;
}

export const PSEUDOCODE_CHT = [
  "function CHT_Insert(m, c):",
  "    while len >= 2 and intersect(last, new) <= intersect(second_last, last):",
  "        hull.pop()  // Redundant line eliminated!",
  "    hull.push(m, c)",
  "function CHT_Query(x):",
  "    binarySearch / pointer find min y = m*x + c"
];

function intersectX(l1: CHTLine, l2: CHTLine): number {
  return (l2.c - l1.c) / (l1.m - l2.m);
}

export function generateTracesCHT(input: InputCHT): StepCHT[] {
  const steps: StepCHT[] = [];
  let stepId = 0;

  const hull: CHTLine[] = [];

  const snap = (phase: string, narrative: string, activeLine: number, memory: Record<string, string | number>, st: Partial<StateCHT>, callingLine?: number | number[]) => {
    steps.push({
      stepId: stepId++, phase, narrative, activeLine, callingLine, memory: { ...memory },
      state: {
        hullLines: hull.map(l => ({ ...l })),
        activeLine: st.activeLine ?? null,
        queryX: st.queryX ?? null,
        bestY: st.bestY ?? null,
        eliminatedLine: st.eliminatedLine ?? null
      }
    });
  };

  const mem: Record<string, string | number> = {};
  snap("Khởi Tạo Convex Hull Trick (CHT)", "Bắt đầu thuật toán CHT bảo trì Đường bao tối ưu (Lower Envelope) cho Quy hoạch động.", 1, mem, {});

  // Insert lines
  input.lines.forEach((l, idx) => {
    const newLine: CHTLine = { id: idx, m: l.m, c: l.c };
    mem['m'] = l.m; mem['c'] = l.c;

    let eliminated: CHTLine | null = null;
    while (hull.length >= 2) {
      const l1 = hull[hull.length - 2];
      const l2 = hull[hull.length - 1];
      snap("Tính giao điểm intersect()", `Gọi hàm intersect() để so sánh điểm giao của đường mới với bao lồi...`, 20, mem, { activeLine: newLine }, 2);
      if (intersectX(l2, newLine) <= intersectX(l1, l2)) {
        eliminated = hull.pop()!;
        snap("Loại Bỏ Đường Thẳng Thừa (Popped Redundant Line)", `Thêm y = ${l.m}x + ${l.c}: Đường thẳng y = ${eliminated.m}x + ${eliminated.c} bị đè khuất hoàn toàn trên dải bao, bị pop ra khỏi Hull!`, 3, mem, { activeLine: newLine, eliminatedLine: eliminated });
      } else {
        break;
      }
    }

    hull.push(newLine);
    snap("Thêm Đường Thẳng Vào Bao (Inserted Line)", `Thêm thành công đường thẳng y = ${l.m}x + ${l.c} vào dải bao Lower Envelope.`, 4, mem, { activeLine: newLine });
  });

  // Queries
  input.queries.forEach(qX => {
    mem['query_x'] = qX;
    let minY = Infinity;
    let bestLine: any = null;

    hull.forEach(l => {
      const y = l.m * qX + l.c;
      if (y < minY) {
        minY = y;
        bestLine = l;
      }
    });

    mem['min_y'] = minY;
    snap(`Truy Vấn x = ${qX}`, `Tại hoành độ x = ${qX}, đường thẳng y = ${bestLine?.m}x + ${bestLine?.c} cho giá trị cực tiểu Min Y = ${minY}!`, 6, mem, { queryX: qX, bestY: minY, activeLine: bestLine });
  });

  snap("Hoàn Tất Convex Hull Trick", `Đã xử lý xong toàn bộ đường thẳng và truy vấn tối ưu DP với độ phức tạp O(N log N).`, 6, mem, {});

  return steps;
}
