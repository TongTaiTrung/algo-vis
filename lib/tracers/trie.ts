export interface QueryTrie {
  type: 'SEARCH' | 'PREFIX';
  word: string;
}

export interface InputTrie {
  words: string[];
  queries: QueryTrie[];
}

export interface TrieNodeT {
  id: number;
  char: string;
  isEndOfWord: boolean;
  children: Record<string, number>;
  depth: number;
}

export interface StateTrie {
  nodes: TrieNodeT[];
  activeNode: number;
  activeCharIdx: number | null;
  currentWord: string | null;
  phaseType: 
    | 'INIT' 
    | 'INSERT_WORD' 
    | 'INSERT_CHAR' 
    | 'MARK_END' 
    | 'SEARCH_WORD' 
    | 'SEARCH_CHAR' 
    | 'SEARCH_SUCCESS' 
    | 'SEARCH_FAIL' 
    | 'DONE';
  queryResults: { type: string; word: string; result: boolean }[];
  currentQueryIdx: number | null;
}

export interface StepTrie {
  stepId: number;
  phase: string;
  narrative: string;
  activeLine: number;
  memory: Record<string, string | number>;
  state: StateTrie;
}

export const PSEUDOCODE_TRIE = [
  "class TrieNode:",
  "    children = {}",
  "    isEndOfWord = False",
  "",
  "function insert(word):",
  "    curr = root",
  "    for char in word:",
  "        if char not in curr.children:",
  "            curr.children[char] = new TrieNode()",
  "        curr = curr.children[char]",
  "    curr.isEndOfWord = True",
  "",
  "function search(word):",
  "    curr = root",
  "    for char in word:",
  "        if char not in curr.children:",
  "            return False",
  "        curr = curr.children[char]",
  "    return curr.isEndOfWord",
  "",
  "function startsWith(prefix):",
  "    curr = root",
  "    for char in prefix:",
  "        if char not in curr.children:",
  "            return False",
  "        curr = curr.children[char]",
  "    return True"
];

export function generateTracesTrie(input: InputTrie): StepTrie[] {
  const steps: StepTrie[] = [];
  let stepId = 0;
  
  const nodes: TrieNodeT[] = [{ id: 0, char: 'root', isEndOfWord: false, children: {}, depth: 0 }];
  let nodeCount = 1;
  const cloneNodes = () => JSON.parse(JSON.stringify(nodes)) as TrieNodeT[];

  const queryResults: { type: string; word: string; result: boolean }[] = [];

  const snap = (
    phase: string,
    narrative: string,
    activeLine: number,
    memory: Record<string, string | number>,
    stateOverrides: Partial<StateTrie>
  ) => {
    steps.push({
      stepId: stepId++,
      phase,
      narrative,
      activeLine,
      memory: { ...memory },
      state: {
        nodes: cloneNodes(),
        activeNode: 0,
        activeCharIdx: null,
        currentWord: null,
        phaseType: 'INIT',
        queryResults: [...queryResults],
        currentQueryIdx: null,
        ...stateOverrides
      }
    });
  };

  let mem: Record<string, string | number> = {};

  snap("Khởi tạo Cây Tiền Tố (Trie)", "Tạo Node gốc (root) không chứa ký tự. Root đóng vai trò là điểm xuất phát chung cho tất cả các từ trong từ điển.", 1, mem, { activeNode: 0, phaseType: 'INIT' });

  // 1. Insert words
  input.words.forEach((word) => {
    mem = { ...mem, word };
    let curr = 0;
    mem['curr'] = curr;

    snap(`Thêm từ mới: "${word}"`, `Bắt đầu quá trình chèn từ "${word}" vào cây bắt đầu từ root.`, 5, mem, { activeNode: 0, currentWord: word, phaseType: 'INSERT_WORD' });

    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      mem['char'] = char;
      mem['char_idx'] = i;

      let narrative = `Duyệt ký tự '${char}' của từ "${word}". Kiểm tra xem Node hiện tại có chứa cạnh mang ký tự '${char}' hay chưa.`;
      
      if (!nodes[curr].children[char]) {
        nodes[curr].children[char] = nodeCount;
        nodes.push({ id: nodeCount, char, isEndOfWord: false, children: {}, depth: nodes[curr].depth + 1 });
        mem['new_node_id'] = nodeCount;
        nodeCount++;
        narrative += ` Ký tự này CHƯA tồn tại. Ta tạo một Node mới (ID=${nodeCount - 1}) và nối vào.`;
        snap(`Thiếu đường đi, tạo Node '${char}'`, narrative, 8, mem, { activeNode: curr, currentWord: word, activeCharIdx: i, phaseType: 'INSERT_CHAR' });
      } else {
        narrative += ` Ký tự KHỚP với Node con (ID=${nodes[curr].children[char]}). Tái sử dụng tiền tố thay vì tạo mới (chia sẻ bộ nhớ hiệu quả!).`;
        snap(`Đi theo nhánh có sẵn '${char}'`, narrative, 7, mem, { activeNode: curr, currentWord: word, activeCharIdx: i, phaseType: 'INSERT_CHAR' });
      }

      curr = nodes[curr].children[char];
      mem['curr'] = curr;
      snap(`Dịch chuyển con trỏ (curr = con)`, `Cập nhật curr tới Node '${char}' (ID=${curr}) để tiếp tục rẽ nhánh ký tự tiếp theo.`, 10, mem, { activeNode: curr, currentWord: word, activeCharIdx: i, phaseType: 'INSERT_CHAR' });
    }

    nodes[curr].isEndOfWord = true;
    snap(`Đánh dấu kết thúc từ (isEndOfWord)`, `Đã duyệt hết từ "${word}". Đánh dấu Node cuối (ID=${curr}) có cờ isEndOfWord = True để xác nhận có một từ hoàn chỉnh kết thúc tại đây.`, 11, mem, { activeNode: curr, currentWord: word, activeCharIdx: word.length, phaseType: 'MARK_END' });
  });

  // 2. Process Queries
  input.queries.forEach((q, qIdx) => {
    const { type, word } = q;
    mem = { query: `${type} "${word}"` };
    let curr = 0;
    mem['curr'] = curr;

    const baseLine = type === 'SEARCH' ? 13 : 20;
    const isSearch = type === 'SEARCH';
    
    snap(
      `Truy vấn: ${type}("${word}")`, 
      `Bắt đầu truy vấn ${isSearch ? "Tìm từ chính xác" : "Tìm tiền tố"} cho chuỗi "${word}". Đặt curr tại root.`, 
      baseLine + 1, 
      mem, 
      { activeNode: 0, currentWord: word, currentQueryIdx: qIdx, phaseType: 'SEARCH_WORD' }
    );

    let found = true;
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      mem['char'] = char;
      mem['char_idx'] = i;

      if (!nodes[curr].children[char]) {
        found = false;
        snap(
          `Truy vấn thất bại đỉnh '${char}'`, 
          `Từ Node hiện tại (ID=${curr}), không tồn tại đường đi cho ký tự '${char}'. Vậy chắc chắn ${isSearch ? "từ này" : "tiền tố này"} không có trong Trie. Kết thúc ngay lập tức (Thời gian O(độ dài tiền tố)).`, 
          baseLine + 4, 
          mem, 
          { activeNode: curr, currentWord: word, activeCharIdx: i, currentQueryIdx: qIdx, phaseType: 'SEARCH_FAIL' }
        );
        break;
      }

      curr = nodes[curr].children[char];
      mem['curr'] = curr;
      snap(
        `Ký tự '${char}' khớp!`, 
        `Có đường rẽ ứng với '${char}'. Con trỏ nhảy đến Node (ID=${curr}). Tiếp tục duyệt.`, 
        baseLine + 5, 
        mem, 
        { activeNode: curr, currentWord: word, activeCharIdx: i, currentQueryIdx: qIdx, phaseType: 'SEARCH_CHAR' }
      );
    }

    let finalAns = false;
    if (found) {
      if (isSearch) {
        finalAns = nodes[curr].isEndOfWord;
        snap(
          `Kiểm tra cờ isEndOfWord`, 
          `Đã duyệt xong toàn bộ ký tự "${word}". Để là một TỪ HOÀN CHỈNH, Node cuối cùng (ID=${curr}) phải được đánh dấu isEndOfWord. Tại đây cờ là: ${finalAns}.`, 
          baseLine + 6, 
          mem, 
          { activeNode: curr, currentWord: word, activeCharIdx: word.length, currentQueryIdx: qIdx, phaseType: finalAns ? 'SEARCH_SUCCESS' : 'SEARCH_FAIL' }
        );
      } else {
        finalAns = true;
        snap(
          `Tiền tố hợp lệ!`, 
          `Đã duyệt qua toàn bộ chuỗi "${word}" mà không gặp bế tắc. Vì đây là hàm startsWith, ta không quan tâm isEndOfWord, do vậy trả về True!`, 
          baseLine + 6, 
          mem, 
          { activeNode: curr, currentWord: word, activeCharIdx: word.length, currentQueryIdx: qIdx, phaseType: 'SEARCH_SUCCESS' }
        );
      }
    }

    queryResults.push({ type, word, result: finalAns });
    snap(
      `Hoàn thành Truy vấn`, 
      `Dừng thuật toán ${type}. Kết quả trả về cho "${word}" là: ${finalAns}. Độ phức tạp thuật toán hoàn toàn chỉ phụ thuộc độ dài từ truy vấn O(L).`, 
      isSearch ? 18 : 25, 
      mem, 
      { activeNode: curr, currentWord: word, currentQueryIdx: qIdx, phaseType: 'DONE' }
    );
  });

  return steps;
}
