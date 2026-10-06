import { InputType as InputDijkstra } from '@/lib/tracers/dijkstra';
import { InputDP } from '@/lib/tracers/dp-knapsack';
import { InputMo } from '@/lib/tracers/mo-algorithm';
import { InputCentroid } from '@/lib/tracers/centroid';
import { InputLIS } from '@/lib/tracers/dp-binary-search';
import { InputPBS } from '@/lib/tracers/parallel-bs';
import { InputDigitDP } from '@/lib/tracers/digit-dp';
import { InputBracketDP } from '@/lib/tracers/bracket-dp';
import { InputSudoku } from '@/lib/tracers/sudoku';
import { InputNQueens } from '@/lib/tracers/n-queens';
import { InputDinic } from '@/lib/tracers/dinic';
import { InputHLD } from '@/lib/tracers/hld';
import { InputAhoCorasick } from '@/lib/tracers/aho-corasick';
import { InputCHT } from '@/lib/tracers/cht';
import { InputRerooting } from '@/lib/tracers/rerooting';
import { InputDiceCombinations } from '@/lib/tracers/dice-combinations';
import { InputMinimizingCoins } from '@/lib/tracers/minimizing-coins';
import { InputCoinCombinations1 } from '@/lib/tracers/coin-combinations-1';
import { InputCoinCombinations2 } from '@/lib/tracers/coin-combinations-2';
import { InputRemovingDigits } from '@/lib/tracers/removing-digits';
import { InputGridPaths } from '@/lib/tracers/grid-paths';
import { InputBookShop } from '@/lib/tracers/book-shop';
import { InputSparseTable } from '@/lib/tracers/sparse-table';
import { InputTrie } from '@/lib/tracers/trie';
import { AllInputs } from '@/types/algorithm';

export const MOCK_DIJKSTRA: InputDijkstra = {
  nodes: [
    { id: "0", x: 20, y: 50 },
    { id: "1", x: 40, y: 20 },
    { id: "2", x: 40, y: 80 },
    { id: "3", x: 70, y: 20 },
    { id: "4", x: 80, y: 60 }
  ],
  edges: [
    { from: "0", to: "1", weight: 4 },
    { from: "0", to: "2", weight: 2 },
    { from: "1", to: "2", weight: 1 },
    { from: "1", to: "3", weight: 5 },
    { from: "2", to: "3", weight: 8 },
    { from: "2", to: "4", weight: 10 },
    { from: "3", to: "4", weight: 2 }
  ],
  startNode: "0"
};

export const MOCK_DP: InputDP = {
  items: [
    { weight: 2, value: 3 },
    { weight: 3, value: 4 },
    { weight: 4, value: 5 },
    { weight: 5, value: 6 }
  ],
  capacity: 8
};

export const MOCK_MO: InputMo = {
  arr: [1, 2, 1, 3, 2, 1, 4, 2],
  queries: [{ L: 0, R: 4 }, { L: 1, R: 5 }, { L: 2, R: 7 }]
};

export const MOCK_CENTROID: InputCentroid = {
  nodes: [
    { id: "0", x: 50, y: 15 },
    { id: "1", x: 30, y: 40 },
    { id: "2", x: 70, y: 40 },
    { id: "3", x: 15, y: 75 },
    { id: "4", x: 40, y: 75 },
    { id: "5", x: 60, y: 75 },
    { id: "6", x: 85, y: 75 }
  ],
  edges: [
    { u: "0", v: "1" }, { u: "0", v: "2" },
    { u: "1", v: "3" }, { u: "1", v: "4" },
    { u: "2", v: "5" }, { u: "2", v: "6" }
  ]
};

export const MOCK_DP_BS: InputLIS = { arr: [10, 9, 2, 5, 3, 7, 101, 18] };

export const MOCK_PBS: InputPBS = {
  arrSize: 5,
  updates: [{ idx: 0, val: 3 }, { idx: 2, val: 5 }, { idx: 4, val: 2 }, { idx: 1, val: 4 }],
  queries: [{ targetIdx: 2, req: 4 }, { targetIdx: 0, req: 3 }]
};

export const MOCK_DIGIT_DP: InputDigitDP = { N: "45", targetSum: 9 };

export const MOCK_BRACKET_DP: InputBracketDP = { s: "([{})" };

export const MOCK_SUDOKU: InputSudoku = {
  board: [
    [1, 0, 0, 4],
    [0, 0, 2, 0],
    [0, 3, 0, 0],
    [2, 0, 0, 3]
  ]
};

export const MOCK_NQUEENS: InputNQueens = { N: 4 };

export const MOCK_DINIC: InputDinic = {
  N: 6, source: 0, sink: 5,
  edges: [
    { u: 0, v: 1, cap: 10 }, { u: 0, v: 2, cap: 10 },
    { u: 1, v: 2, cap: 2 },  { u: 1, v: 3, cap: 4 },
    { u: 1, v: 4, cap: 8 },  { u: 2, v: 4, cap: 9 },
    { u: 3, v: 5, cap: 10 }, { u: 4, v: 3, cap: 6 },
    { u: 4, v: 5, cap: 10 }
  ]
};

export const MOCK_HLD: InputHLD = {
  N: 7,
  edges: [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6]],
  queryPath: [3, 6]
};

export const MOCK_AHO_CORASICK: InputAhoCorasick = {
  patterns: ["he", "she", "his", "hers"],
  text: "ahishers"
};

export const MOCK_CHT: InputCHT = {
  lines: [{ m: -2, c: 3 }, { m: -1, c: 1 }, { m: 1, c: -2 }],
  queries: [-2, 0, 2, 4]
};

export const MOCK_REROOTING: InputRerooting = {
  N: 6,
  edges: [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5]]
};

export const MOCK_DICE: InputDiceCombinations = { N: 5 };

export const MOCK_MIN_COINS: InputMinimizingCoins = { target: 11, coins: [1, 5, 7] };

export const MOCK_COIN_COMB_1: InputCoinCombinations1 = { target: 9, coins: [2, 3, 5] };

export const MOCK_COIN_COMB_2: InputCoinCombinations2 = { target: 9, coins: [2, 3, 5] };

export const MOCK_REMOVING_DIGITS: InputRemovingDigits = { N: 27 };

export const MOCK_GRID_PATHS: InputGridPaths = { n: 4, grid: ["....", ".*..", "...*", "...."] };

export const MOCK_BOOK_SHOP: InputBookShop = { budget: 10, prices: [4, 8, 5, 3], pages: [5, 12, 8, 1] };

export const MOCK_SPARSE_TABLE: InputSparseTable = {
  arr: [4, 2, 7, 1, 9, 3, 6, 5],
  queries: [
    { L: 1, R: 5 },
    { L: 4, R: 7 },
    { L: 0, R: 2 },
    { L: 2, R: 6 }
  ]
};

export const MOCK_TRIE: InputTrie = {
  words: ["app", "apple", "beer", "add", "jam", "rental"],
  queries: [
    { type: 'SEARCH', word: 'apps' },
    { type: 'SEARCH', word: 'app' },
    { type: 'PREFIX', word: 'ad' },
    { type: 'SEARCH', word: 'applepie' },
    { type: 'PREFIX', word: 'rest' }
  ]
};

export const DEFAULT_INPUTS: AllInputs = {

  BINARY_SEQUENCE: { n: 4 },
  PERMUTATION: { n: 3 },
  COMBINATION: { n: 5, c: 3 },
  SUBSET: { n: 3 },

  DIJKSTRA: MOCK_DIJKSTRA,
  DP: MOCK_DP,
  MO: MOCK_MO,
  CENTROID: MOCK_CENTROID,
  DP_BS: MOCK_DP_BS,
  PBS: MOCK_PBS,
  DIGIT_DP: MOCK_DIGIT_DP,
  BRACKET_DP: MOCK_BRACKET_DP,
  SUDOKU: MOCK_SUDOKU,
  NQUEENS: MOCK_NQUEENS,
  DINIC: MOCK_DINIC,
  HLD: MOCK_HLD,
  AHO_CORASICK: MOCK_AHO_CORASICK,
  CHT: MOCK_CHT,
  REROOTING: MOCK_REROOTING,
  DICE: MOCK_DICE,
  MINIMIZING_COINS: MOCK_MIN_COINS,
  COIN_COMBINATIONS_1: MOCK_COIN_COMB_1,
  COIN_COMBINATIONS_2: MOCK_COIN_COMB_2,
  REMOVING_DIGITS: MOCK_REMOVING_DIGITS,
  GRID_PATHS: MOCK_GRID_PATHS,
  BOOK_SHOP: MOCK_BOOK_SHOP,
  SPARSE_TABLE: MOCK_SPARSE_TABLE,
  TRIE: MOCK_TRIE
};
