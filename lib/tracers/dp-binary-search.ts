export interface InputLIS {
  arr: number[];
}

export interface StateLIS {
  arr: number[];
  tails: number[];
  tailsLen: number;
  currentIdx: number;
  bsL: number | null;
  bsR: number | null;
  bsMid: number | null;
  insertPos: number | null;
  lis: number[];
}

export interface StepLIS {
  stepId: number;
  phase: string;
  narrative: string;
  activeLine: number;
  memory: Record<string, string | number>;
  state: StateLIS;
}

export const PSEUDOCODE_LIS = [
  "function LIS(arr):",
  "    tails = []",
  "    for i = 0 to n-1:",
  "        x = arr[i]",
  "        if tails is empty or x > tails.last:",
  "            tails.append(x)  // extend LIS",
  "        else:",
  "            L = 0, R = tails.length - 1",
  "            while L < R:",
  "                mid = (L + R) / 2",
  "                if tails[mid] < x:",
  "                    L = mid + 1",
  "                else:",
  "                    R = mid",
  "            tails[L] = x  // replace to keep smallest",
  "    return tails.length"
];

export function generateTracesLIS(input: InputLIS): StepLIS[] {
  const steps: StepLIS[] = [];
  let stepId = 0;
  const { arr } = input;
  const n = arr.length;

  const snap = (phase: string, narrative: string, activeLine: number, memory: Record<string, string | number>, st: StateLIS) => {
    steps.push({
      stepId: stepId++, phase, narrative, activeLine, memory: { ...memory },
      state: {
        arr: [...st.arr], tails: [...st.tails], tailsLen: st.tailsLen,
        currentIdx: st.currentIdx, bsL: st.bsL, bsR: st.bsR, bsMid: st.bsMid,
        insertPos: st.insertPos, lis: [...st.lis],
      }
    });
  };

  const state: StateLIS = { arr: [...arr], tails: [], tailsLen: 0, currentIdx: -1, bsL: null, bsR: null, bsMid: null, insertPos: null, lis: [], };
  const mem: Record<string, string | number> = {};
  
  snap("Khởi tạo Mảng Tails", "Bắt đầu thuật toán LIS. Mảng tails[i] sẽ dùng để lưu phần tử kết thúc nhỏ nhất của các dãy con tăng dần có độ dài i+1. Việc giữ cho Tails luôn tăng giúp ta có thể tìm kiếm nhị phân (Binary Search) trên nó.", 2, mem, state);

  for (let i = 0; i < n; i++) {
    state.currentIdx = i; const x = arr[i]; mem['i'] = i; mem['x'] = x;
    state.bsL = null; state.bsR = null; state.bsMid = null; state.insertPos = null;
    snap("Đọc con trỏ Mốc", `Đang duyệt phần tử x = ${x}. Mảng Tails đang lưu cấu trúc LIS tiềm năng tốt nhất tính đến hiện tại.`, 3, mem, state);

    if (state.tails.length === 0 || x > state.tails[state.tails.length - 1]) {
      state.tails.push(x);
      state.tailsLen = state.tails.length;
      state.insertPos = state.tails.length - 1;
      snap("Mở Rộng Tails (Extend LIS)", `Do tails đang trống hoặc x = ${x} LỚN HƠN phần tử cuối chốt hạ của tails (${state.tails[state.tails.length - 2] ?? 'Rỗng'}), ta có thể kéo dài dãy LIS thêm 1 đơn vị. Gắn thẳng x vào cối mảng Tails!`, 6, mem, state);
    } else {
      let L = 0, R = state.tails.length - 1;
      state.bsL = L; state.bsR = R; mem['bs_L'] = L; mem['bs_R'] = R;
      snap("Khởi động Tìm kiếm Nhị Phân", `x = ${x} không thể kéo dài kỷ lục LIS lúc này. Nhưng nó LÀ MỘT SỐ NHỎ, ta cần NHÉT nó tráo vào mảng tails để hạ thấp chốt chặn, mở cơ hội cho các số phía sau dễ nối thêm hơn. Phải dùng Binary Search để tìm chỗ nhét.`, 8, mem, state);

      while (L < R) {
        const mid = Math.floor((L + R) / 2);
        state.bsMid = mid; mem['mid'] = mid; mem['tails_mid'] = state.tails[mid];
        snap("Kiểm tra chỉ mục Mid", `Chia bộ nhớ Tails làm hai tại mid = ${mid}. Cần xem phần tử tails[mid] là ${state.tails[mid]} có đủ chỗ đè bằng x = ${x} chưa.`, 10, mem, state);

        if (state.tails[mid] < x) {
          L = mid + 1; state.bsL = L; mem['bs_L'] = L;
          snap("Thu hẹp Cận Trái", `Vì tails[mid] = ${state.tails[mid]} vẫn còn NHỎ HƠN x = ${x}, x chỉ có thể đè vào nửa bên phải. Dời L = mid + 1.`, 12, mem, state);
        } else {
          R = mid; state.bsR = R; mem['bs_R'] = R;
          snap("Giữ Cận Phải", `Vì tails[mid] = ${state.tails[mid]} ĐÃ LỚN HƠN HOẶC BẰNG x = ${x}, nó là ứng viên bị đè. Dời R = mid, giữ nguyên mốc tiềm năng này.`, 14, mem, state);
        }
      }

      state.insertPos = L; state.bsMid = null; state.tails[L] = x; mem['insert_pos'] = L;
      snap("Chèn đè Phần tử", `Tìm thấy vị trí phù hợp! Đè (Ghi đè) x = ${x} vào vị trí tails[${L}]. Độ dài LIS không tăng, nhưng con chốt chặn tại vị trí ${L} đã trở nên xịn hơn (thấp đi), dễ nối đuôi hơn ở tương lai!`, 15, mem, state);
    }

    state.bsL = null; state.bsR = null; state.bsMid = null;
    delete mem['bs_L']; delete mem['bs_R']; delete mem['mid']; delete mem['tails_mid']; delete mem['insert_pos'];
  }

  state.currentIdx = -1; mem['LIS_length'] = state.tails.length;
  snap("Hoàn tất Thuật Toán", `Đã duyệt xong mảng gốc. Số phần tử đang nằm trong Tails chính là kỷ lục độ dài dãy con tăng dài nhất tìm được! Kết quả = ${state.tails.length}. (Lưu ý: Các số trong Tails không nhất thiết là mảng LIS thật).`, 16, mem, state);

  return steps;
}