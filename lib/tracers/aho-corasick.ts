// Aho-Corasick Automaton Tracer

export interface InputAhoCorasick {
  patterns: string[];
  text: string;
}

export interface TrieNodeAC {
  id: number;
  char: string;
  children: Record<string, number>;
  fail: number;
  output: string[];
}

export interface StateAhoCorasick {
  nodes: TrieNodeAC[];
  text: string;
  charIdx: number | null;
  activeNode: number;
  failLinkActive: { from: number; to: number } | null;
  matchesFound: { pattern: string; idx: number }[];
}

export interface StepAhoCorasick {
  stepId: number; phase: string; narrative: string; activeLine: number;
  callingLine?: number | number[];
  memory: Record<string, string | number>; state: StateAhoCorasick;
}

export const PSEUDOCODE_AHO_CORASICK = [
  "function AhoCorasick(Patterns, Text):",
  "    root = buildTrie(Patterns)",
  "    buildFailLinks_BFS(root)",
  "    curr = root",
  "    for i, char in Text:",
  "        while curr != root and char not in curr.children:",
  "            curr = curr.fail",
  "        curr = curr.children[char] or root",
  "        reportMatches(curr.output)"
];

export function generateTracesAhoCorasick(input: InputAhoCorasick): StepAhoCorasick[] {
  const steps: StepAhoCorasick[] = [];
  let stepId = 0;

  const nodes: TrieNodeAC[] = [
    { id: 0, char: 'ROOT', children: {}, fail: 0, output: [] }
  ];

  // 1. Build Trie
  input.patterns.forEach(pat => {
    let curr = 0;
    for (const ch of pat) {
      if (!(ch in nodes[curr].children)) {
        const nextId = nodes.length;
        nodes[curr].children[ch] = nextId;
        nodes.push({ id: nextId, char: ch, children: {}, fail: 0, output: [] });
      }
      curr = nodes[curr].children[ch];
    }
    nodes[curr].output.push(pat);
  });

  // 2. Build Fail Links via BFS
  const q: number[] = [];
  Object.values(nodes[0].children).forEach(chId => {
    nodes[chId].fail = 0;
    q.push(chId);
  });

  while (q.length > 0) {
    const u = q.shift()!;
    for (const [ch, v] of Object.entries(nodes[u].children)) {
      let f = nodes[u].fail;
      while (f !== 0 && !(ch in nodes[f].children)) {
        f = nodes[f].fail;
      }
      if (ch in nodes[f].children && nodes[f].children[ch] !== v) {
        nodes[v].fail = nodes[f].children[ch];
      } else {
        nodes[v].fail = 0;
      }
      nodes[v].output = [...nodes[v].output, ...nodes[nodes[v].fail].output];
      q.push(v);
    }
  }

  const matchesFound: { pattern: string; idx: number }[] = [];

  const snap = (phase: string, narrative: string, activeLine: number, memory: Record<string, string | number>, st: Partial<StateAhoCorasick>, callingLine?: number | number[]) => {
    steps.push({
      stepId: stepId++, phase, narrative, activeLine, callingLine, memory: { ...memory },
      state: {
        nodes: nodes.map(n => ({ ...n, children: { ...n.children }, output: [...n.output] })),
        text: input.text,
        charIdx: st.charIdx ?? null,
        activeNode: st.activeNode ?? 0,
        failLinkActive: st.failLinkActive ?? null,
        matchesFound: [...matchesFound]
      }
    });
  };

  const mem: Record<string, string | number> = { text_len: input.text.length };
  snap("Dựng cây Trie từ Patterns", `buildTrie(): Dựng cấu trúc Trie từ ${input.patterns.length} từ mẫu [${input.patterns.join(', ')}].`, 20, mem, { activeNode: 0 }, 2);
  snap("Thiết lập Fail Links bằng BFS", `buildFailLinks(): Duyệt BFS từ gốc Root để tạo đường chuyển trạng thái dự phòng khi mismatch.`, 21, mem, { activeNode: 0 }, 3);
  snap("Khởi Tạo Aho-Corasick Automaton", `Automaton sẵn sàng! Bắt đầu quét qua từng ký tự của chuỗi văn bản Text...`, 4, mem, { activeNode: 0 });

  let curr = 0;
  for (let i = 0; i < input.text.length; i++) {
    const ch = input.text[i];
    mem['char'] = ch; mem['i'] = i;

    while (curr !== 0 && !(ch in nodes[curr].children)) {
      const oldCurr = curr;
      curr = nodes[curr].fail;
      snap("Nhảy Qua Fail Link (Mismatch)", `Ký tự '${ch}' không có nhánh con tại node ${oldCurr}. Nhảy qua Fail Link về Node ${curr}...`, 7, mem, { charIdx: i, activeNode: curr, failLinkActive: { from: oldCurr, to: curr } });
    }

    if (ch in nodes[curr].children) {
      curr = nodes[curr].children[ch];
      snap("Tiến Theo Cạnh Trie", `Khớp ký tự '${ch}'! Chuyển sang Node ${curr}.`, 8, mem, { charIdx: i, activeNode: curr });
    } else {
      curr = 0;
      snap("Về Root Trie", `Ký tự '${ch}' không trùng nhánh nào, trở về Root (0).`, 8, mem, { charIdx: i, activeNode: 0 });
    }

    if (nodes[curr].output.length > 0) {
      nodes[curr].output.forEach(pat => {
        matchesFound.push({ pattern: pat, idx: i - pat.length + 1 });
        mem['matches'] = matchesFound.length;
        snap("TÌM THẤY MẪU KHỚP! 🎉", `Khớp thành công mẫu "${pat}" tại vị trí văn bản index = ${i - pat.length + 1}!`, 9, mem, { charIdx: i, activeNode: curr });
      });
    }
  }

  snap("Hoàn Tất Quét Văn Bản", `Quét xong văn bản! Tổng cộng tìm thấy ${matchesFound.length} lượt khớp các từ mẫu trong 1 lượt O(N).`, 9, mem, { activeNode: curr });

  return steps;
}
