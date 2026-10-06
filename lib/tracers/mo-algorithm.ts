export interface Query {
  id: number;
  L: number;
  R: number;
  result?: number;
}

export interface InputMo {
  arr: number[];
  queries: { L: number; R: number }[];
}

export interface StateMo {
  arr: number[];
  queries: Query[];
  activeQueryId: number | null;
  currL: number;
  currR: number;
  freq: Record<number, number>;
  distinctCount: number;
}

export interface StepMo {
  stepId: number;
  phase: string;
  narrative: string;
  activeLine: number;
  memory: Record<string, string | number>;
  state: StateMo;
}

export const PSEUDOCODE_MO = [
  "function MoAlgorithm(arr, queries):",
  "    block_size = sqrt(arr.length)",
  "    sort queries by (L / block_size), then R",
  "    currL = 0, currR = -1",
  "    distinctCount = 0",
  "    freq = {}",
  "    for each query in sorted_queries:",
  "        while currL > query.L:",
  "            currL--, add(arr[currL])",
  "        while currR < query.R:",
  "            currR++, add(arr[currR])",
  "        while currL < query.L:",
  "            remove(arr[currL]), currL++",
  "        while currR > query.R:",
  "            remove(arr[currR]), currR--",
  "        query.result = distinctCount",
  "    return queries"
];

function sortQueries(queries: Query[], blockSize: number) {
  return [...queries].sort((a, b) => {
    const blockA = Math.floor(a.L / blockSize);
    const blockB = Math.floor(b.L / blockSize);
    if (blockA !== blockB) return blockA - blockB;
    return (blockA % 2 === 1) ? a.R - b.R : b.R - a.R; // Optimization
  });
}

export function generateTracesMo(input: InputMo): StepMo[] {
  const steps: StepMo[] = [];
  let stepId = 0;

  const snap = (
    phase: string,
    narrative: string,
    activeLine: number,
    memory: Record<string, string | number>,
    currentState: StateMo
  ) => {
    steps.push({
      stepId: stepId++,
      phase,
      narrative,
      activeLine,
      memory: { ...memory },
      state: {
        arr: [...currentState.arr],
        queries: currentState.queries.map(q => ({ ...q })),
        activeQueryId: currentState.activeQueryId,
        currL: currentState.currL,
        currR: currentState.currR,
        freq: { ...currentState.freq },
        distinctCount: currentState.distinctCount
      }
    });
  };

  const blockSize = Math.max(1, Math.floor(Math.sqrt(input.arr.length)));
  
  // Format initial queries
  let initialQueries: Query[] = input.queries.map((q, i) => ({ id: i, L: q.L, R: q.R }));
  
  const state: StateMo = {
    arr: [...input.arr],
    queries: [...initialQueries],
    activeQueryId: null,
    currL: 0,
    currR: -1,
    freq: {},
    distinctCount: 0
  };

  const memory: Record<string, string | number> = { block_size: blockSize };

  snap("Initialize", "Initialize", 2, memory, state);

  state.queries = sortQueries(initialQueries, blockSize);
  snap("Sort Queries", "Sort Queries", 3, memory, state);

  snap("Setup Pointers", "Setup Pointers", 6, memory, state);

  const add = (idx: number, lineIndex: number) => {
    const val = state.arr[idx];
    if (!state.freq[val]) state.freq[val] = 0;
    state.freq[val]++;
    if (state.freq[val] === 1) {
      state.distinctCount++;
    }
    memory['val_add'] = val;
    memory['count'] = state.distinctCount;
    snap("Add element", "Thêm phần tử vào thùng chứa và cập nhật biến đếm nếu đây là lần đầu xuất hiện.", lineIndex, memory, state);
    delete memory['val_add'];
  };

  const remove = (idx: number, lineIndex: number) => {
    const val = state.arr[idx];
    state.freq[val]--;
    if (state.freq[val] === 0) {
      state.distinctCount--;
    }
    memory['val_rm'] = val;
    memory['count'] = state.distinctCount;
    snap("Remove element", "Bỏ phần tử khỏi thùng chứa, giảm biến đếm nếu tần suất bằng 0.", lineIndex, memory, state);
    delete memory['val_rm'];
  };

  for (let i = 0; i < state.queries.length; i++) {
    const q = state.queries[i];
    state.activeQueryId = q.id;
    memory['q_L'] = q.L;
    memory['q_R'] = q.R;
    
    snap("Process next Query", "Process next Query", 7, memory, state);

    while (state.currL > q.L) {
      state.currL--;
      add(state.currL, 9);
    }
    while (state.currR < q.R) {
      state.currR++;
      add(state.currR, 11);
    }
    while (state.currL < q.L) {
      remove(state.currL, 13);
      state.currL++;
    }
    while (state.currR > q.R) {
      remove(state.currR, 15);
      state.currR--;
    }

    state.queries[i].result = state.distinctCount;
    snap("Record Result", "Record Result", 16, memory, state);
  }

  state.activeQueryId = null;
  delete memory['q_L'];
  delete memory['q_R'];
  delete memory['count'];
  
  snap("Algorithm Complete", "Algorithm Complete", 17, memory, state);

  return steps;
}
