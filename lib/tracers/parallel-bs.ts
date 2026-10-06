export interface QueryPBS { id: number; req: number; targetIdx: number; L: number; R: number; ans: number | null; }
export interface UpdatePBS { idx: number; val: number; }
export interface InputPBS { arrSize: number; updates: UpdatePBS[]; queries: { targetIdx: number; req: number }[]; }

export interface StatePBS {
  arr: number[];
  queries: QueryPBS[];
  updates: UpdatePBS[];
  currentTime: number;
  activeMid: number | null;
  queryCheckList: number[];
}

export interface StepPBS {
  stepId: number; phase: string; narrative: string; activeLine: number;
  memory: Record<string, string | number>; state: StatePBS;
}

export const PSEUDOCODE_PBS = [
  "function PBS(updates, queries):",
  "    for q in queries: q.L = 1, q.R = M",
  "    while check_needed:",
  "        mids = group_queries_by_mid()",
  "        tree = empty_array()",
  "        for time = 1 to M:",
  "            tree.add(updates[time])",
  "            for q in mids[time]:",
  "                if tree[q.target] >= q.req:",
  "                    q.ans = time, q.R = time - 1",
  "                else:",
  "                    q.L = time + 1",
  "    return queries"
];

export function generateTracesPBS(input: InputPBS): StepPBS[] {
  const steps: StepPBS[] = [];
  let stepId = 0; const M = input.updates.length;
  
  const snap = (phase: string, narrative: string, activeLine: number, memory: Record<string, string | number>, st: StatePBS) => {
    steps.push({
      stepId: stepId++, phase, narrative, activeLine, memory: { ...memory },
      state: { arr: [...st.arr], queries: st.queries.map(q => ({ ...q })), updates: [...st.updates], currentTime: st.currentTime, activeMid: st.activeMid, queryCheckList: [...st.queryCheckList] }
    });
  };

  const queries: QueryPBS[] = input.queries.map((q, i) => ({ id: i, req: q.req, targetIdx: q.targetIdx, L: 1, R: M, ans: null }));
  const state: StatePBS = { arr: Array(input.arrSize).fill(0), queries, updates: input.updates, currentTime: 0, activeMid: null, queryCheckList: [], };
  const mem: Record<string, string | number> = { M, Q: queries.length };
  
  snap("Khởi tạo Môi trường PBS", `PBS khởi đầu bằng cách đặt tất cả Q truy vấn với biến kẹp biên thời gian [L, R] = [1, ${M}]. Mỗi truy vấn sẽ không tìm nhị phân độc lập (vì O(Q * M) cộng giá trị mỗi lần là quá lớn). Thay vào đó, ta sẽ gom nhóm hàng loạt Mid của chúng lại!`, 2, mem, state);

  let runCount = 0;
  while (true) {
    let checkNeeded = false;
    const midsMap: Record<number, number[]> = {};

    for (const q of state.queries) {
      if (q.L <= q.R) {
        checkNeeded = true;
        const mid = Math.floor((q.L + q.R) / 2);
        if (!midsMap[mid]) midsMap[mid] = [];
        midsMap[mid].push(q.id);
      }
    }

    if (!checkNeeded) break;
    runCount++; mem['PBS_Pass'] = runCount;
    snap("Gộp Nhóm Theo Khối Mid", `Vòng lặp Pass thứ ${runCount}. Hệ thống phân phối mỗi Truy vấn chưa thỏa mãn vào mốc thời gian t = Mid của nó. Chúng ta sẽ quét mảng 1 lần từ t=1..M, và giải quyết triệt để toàn bộ các Query đang nằm đợi ở thời điểm t đó!`, 4, mem, state);

    state.arr = Array(input.arrSize).fill(0);
    state.currentTime = 0;
    snap("Xóa sổ toàn mảng", `Reset mảng truy vấn về 0 để chuẩn bị thực hiện timeline Cộng - Cập nhật nguyên tố.`, 5, mem, state);

    for (let t = 1; t <= M; t++) {
      state.currentTime = t;
      const u = state.updates[t - 1];
      state.arr[u.idx] += u.val;
      mem['time'] = t; mem['update_idx'] = u.idx; mem['update_val'] = u.val;
      
      if (midsMap[t]) {
        snap(`Kích hoạt Cập nhật (Time = ${t})`, `Cộng ${u.val} vào mốc index ${u.idx}. Mảng thay đổi giá trị. Sau lưng thao tác này, đang có các Query (bị khóa mid ở ${t}) đứng chờ nghiệm thu!`, 7, mem, state);
        
        state.activeMid = t;
        state.queryCheckList = midsMap[t];
        
        for (const qid of midsMap[t]) {
          const q = state.queries.find(x => x.id === qid)!;
          mem['q_req'] = q.req; mem['current_val'] = state.arr[q.targetIdx];
          snap(`Giai đoạn Đánh Giá Q(${q.id})`, `Truy vấn Q(${q.id}) có điểm Mid rơi trúng thời điểm t = ${t}. Ta so sánh: Mục tiêu là ${q.req}, Mảng hiện tại đang có ${state.arr[q.targetIdx]}.`, 8, mem, state);
          
          if (state.arr[q.targetIdx] >= q.req) {
            q.ans = t; q.R = t - 1;
            snap("Thỏa Mãn Nhu Cầu Mảng", `Do target đang là ${state.arr[q.targetIdx]} >= ${q.req}, có nghĩa là tại thời điểm ${t} đã HOÀN THÀNH. Vậy đáp án có thể rơi vào vùng L = ${q.L} đến R = ${t-1} (tức là có thể thoả mãn còn sớm hơn cả t). Thu hẹp trần mảng lại!`, 10, mem, state);
          } else {
            q.L = t + 1;
            snap("Thiếu Hụt Giá Trị", `Trải qua đến tận t = ${t} lần cập nhật, mảng vẫn chưa được cộng đủ số required. Vậy ta phải nới rộng biên Lên tiếp L = ${t+1} nhằm để lần Pass tới, ta check nó ở thời điểm muộn hơn (có nhiều điểm cộng hơn).`, 12, mem, state);
          }
        }
        state.activeMid = null; state.queryCheckList = [];
      } else {
        // Skip dense traces
      }
    }
  }

  delete mem['PBS_Pass']; delete mem['time']; delete mem['update_idx']; delete mem['update_val']; delete mem['q_req']; delete mem['current_val'];
  snap("Cụm PBS Khép Lại", `Vòng lặp PBS kết thúc hoàn toàn. Mọi cận [L, R] của các Truy vấn đã nén chặt và đóng đinh vào mốc L > R. Quá trình kiểm kê chốt hạ Answer. Cực kỳ tốc độ với $O(Q \\log M \\text{ cập nhật})$!`, 13, mem, state);

  return steps;
}