export interface InputDigitDP {
  N: string;
  targetSum: number;
}

export interface StateDigitDP {
  digits: number[];
  pos: number;
  currentSum: number;
  isTight: boolean;
  chosenDigits: (number | null)[];
  chosenDigit: number | null;
  memo: Record<string, number>;
  resultCount: number;
  callStack: string[];
}

export interface StepDigitDP {
  stepId: number;
  phase: string;
  narrative: string;
  activeLine: number;
  memory: Record<string, string | number>;
  state: StateDigitDP;
}

export const PSEUDOCODE_DIGIT_DP = [
  "function count(pos, sum, tight):",
  "    if pos == len(digits):",
  "        return (sum == targetSum) ? 1 : 0",
  "    if memo[pos][sum][tight] exists:",
  "        return memo[pos][sum][tight]",
  "    limit = digits[pos] if tight else 9",
  "    result = 0",
  "    for d = 0 to limit:",
  "        result += count(pos+1, sum+d, tight && d==limit)",
  "    memo[pos][sum][tight] = result",
  "    return result"
];

export function generateTracesDigitDP(input: InputDigitDP): StepDigitDP[] {
  const steps: StepDigitDP[] = [];
  let stepId = 0;

  const digitsArr = input.N.split('').map(Number);
  const target = input.targetSum;

  const snap = (phase: string, narrative: string, activeLine: number, memory: Record<string, string | number>, st: StateDigitDP) => {
    steps.push({
      stepId: stepId++, phase, narrative, activeLine, memory: { ...memory },
      state: {
        digits: [...st.digits], pos: st.pos, currentSum: st.currentSum, isTight: st.isTight,
        chosenDigits: [...st.chosenDigits], chosenDigit: st.chosenDigit, memo: { ...st.memo },
        resultCount: st.resultCount, callStack: [...st.callStack],
      }
    });
  };

  const state: StateDigitDP = {
    digits: digitsArr, pos: 0, currentSum: 0, isTight: true, chosenDigits: [],
    chosenDigit: null, memo: {}, resultCount: 0, callStack: [],
  };

  const memo: Record<string, number> = {};
  const mem: Record<string, string | number> = { N: input.N, target };

  const MAX_TRACE_STEPS = 650;

  function solve(pos: number, sum: number, tight: boolean, chosen: (number | null)[]): number {
    if (stepId >= MAX_TRACE_STEPS) {
      if (pos === digitsArr.length) return sum === target ? 1 : 0;
      const key = `${pos},${sum},${tight ? 1 : 0}`;
      if (memo[key] !== undefined) return memo[key];
      const limit = tight ? digitsArr[pos] : 9;
      let result = 0;
      for (let d = 0; d <= limit; d++) { result += solve(pos + 1, sum + d, tight && d === limit, [...chosen, d]); }
      memo[key] = result;
      return result;
    }

    state.pos = pos; state.currentSum = sum; state.isTight = tight; state.chosenDigits = [...chosen];
    state.callStack.push(`count(${pos}, ${sum}, ${tight ? 'T' : 'F'})`);
    mem['pos'] = pos; mem['sum'] = sum; mem['tight'] = tight ? 'YES' : 'NO';

    if (pos === digitsArr.length) {
      const valid = sum === target ? 1 : 0;
      state.resultCount += valid;
      snap(
        valid ? "Đạt Case Cơ Bản (Hợp Lệ)" : "Đạt Case Cơ Bản (Loại)", 
        valid 
          ? `Tuyệt vời! Ta đã đệ quy xây xong chữ số đến cuối cùng. Tổng các chữ số đang là ${sum}, đúng bằng Target = ${target}. Trả về 1 (Ghi nhận 1 cách chọn hợp lệ).` 
          : `Đã đi hết chữ số gốc nhưng tổng hiện tại chỉ là ${sum}, KHÁC với Target = ${target}. Trả về 0 (Đường đi này không tạo ra số thỏa mãn).`,
        2, mem, state
      );
      state.callStack.pop();
      return valid;
    }

    const key = `${pos},${sum},${tight ? 1 : 0}`;
    if (memo[key] !== undefined) {
      mem['memo_hit'] = memo[key];
      snap("Tái sử dụng Cache (Memoization)", `Phát hiện trạng thái (Vị trí=${pos}, Tổng=${sum}, Kẹp Biên=${tight ? 'YES' : 'NO'}) đã được tính trước đó! Ta KHÔNG CẦN ĐỆ QUY NỮA mà lấy thẳng kết quả ${memo[key]} từ bảng ảo ra dùng. Tốc độ thuật toán tăng vọt nhờ đây!`, 4, mem, state);
      delete mem['memo_hit']; state.callStack.pop();
      return memo[key];
    }

    const limit = tight ? digitsArr[pos] : 9;
    mem['limit'] = limit;
    snap("Xác định Giới hạn (Limit)", `Ta đang tính chữ số ở vị trí ${pos}. ${tight ? `Cờ Tight (Kẹp biên) ĐANG BẬT, ta phải bám sát số nguyên gốc N. Chữ số tối đa ở vị trí này bị nén thành nhánh Limit = ${limit}.` : `Cờ Tight ĐÃ TẮT (Ta đã chọn chữ số nhỏ hơn biên ở mốc trước). Tự do xổ lồng! Limit cho nhánh này đạt đỉnh = 9.`}`, 6, mem, state);

    let result = 0;
    for (let d = 0; d <= limit; d++) {
      state.chosenDigit = d; mem['d'] = d;
      snap(`Phân nhánh chốt số d = ${d}`, `Bắt chốt chọn thử d = ${d} vào vị trí thứ ${pos}. Chuẩn bị đào sâu (đệ quy) tìm các phần đuôi đằng sau...`, 8, mem, state);

      const sub = solve(pos + 1, sum + d, tight && d === limit, [...chosen, d]);
      result += sub; mem['sub_result'] = sub; mem['running_result'] = result;

      state.pos = pos; state.currentSum = sum; state.isTight = tight; state.chosenDigits = [...chosen]; state.chosenDigit = d;
      if (stepId < MAX_TRACE_STEPS) {
        snap("Backtrack (Thu hồi đệ quy)", `Nhánh đệ quy đi từ d = ${d} vừa trả về. Ta thu hoạch được thêm ${sub} số hợp lệ nhánh phụ. Cộng dồn vào biến Result tại nút này. Trở về tiếp tục xét d khác!`, 9, mem, state);
      }
    }

    memo[key] = result; state.memo[key] = result; mem['memo_store'] = `${key} = ${result}`;
    if (stepId < MAX_TRACE_STEPS) {
      snap("Lưu Trí Nhớ (Kho Memo)", `Tất cả các vòng for thử nghiệm cho trạng thái (pos=${pos}, sum=${sum}, tight=${tight}) đã chạy xong xuôi. Tổng cộng gom được ${result} số. Ta đem cất nó vào mảng Memo[${key}] để tránh phải tính rã xác ở tương lai.`, 10, mem, state);
    }
    delete mem['memo_store']; delete mem['sub_result']; delete mem['running_result']; delete mem['d']; delete mem['limit'];

    state.chosenDigit = null; state.callStack.pop();
    return result;
  }

  snap("Khởi tạo Vấn đề Digit DP", `Hệ thống phân tách số N lớn thành một mảng Digits rời rạc. Việc gọi đệ quy sẽ bắt đầu từ Trái qua Phải. Khởi điểm, biến Tight luôn khởi tạo bằng True để không được chạy vọt qua số N ban đầu.`, 1, mem, state);
  const finalAnswer = solve(0, 0, true, []);
  
  state.pos = -1; state.chosenDigit = null; state.callStack = []; mem['answer'] = finalAnswer;
  snap(`Kết thúc Chu trình Digit DP`, `Callstack rỗng! Mạch đệ quy về đến hàm gốc. Tổng cộng có ${finalAnswer} số nằm trong dải [1..${input.N}] thỏa mãn điều kiện tồng các chữ số bằng ${target}. Thuật toán đã chặn O(N) thành công nhờ Memoization $O(\\text{len} \\cdot \\text{sum})$.`, 11, mem, state);

  return steps;
}
