import { InputLcs } from '@/lib/tracers/lcs';
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
import { InputTrie, QueryTrie } from '@/lib/tracers/trie';

export function parseCPText(tab: string, rawText: string): any {
  const text = rawText.trim();
  if (!text) throw new Error("Input rỗng!");
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const nextLine = () => lines.shift() || "";
  const nextNumbers = () => nextLine().split(/\s+/).map(Number);
  
  try {
    switch (tab) {
      case 'LCS': {
        const s1 = nextLine();
        const s2 = nextLine();
        return { s1, s2 } as InputLcs;
      }
      case 'DIJKSTRA': {
        const [N, M, source] = nextNumbers();
        const nodes = Array.from({length: N}).map((_, i) => ({ id: `${i}`, x: 10 + Math.random() * 80, y: 10 + Math.random() * 80 }));
        const edges = [];
        for (let i = 0; i < M; i++) {
          const [u, v, w] = nextNumbers();
          edges.push({ from: `${u}`, to: `${v}`, weight: w });
        }
        return { nodes, edges, startNode: `${source}` } as InputDijkstra;
      }
      case 'DP': {
        const [capacity] = nextNumbers();
        const weights = nextNumbers();
        const values = nextNumbers();
        const items = weights.map((w, i) => ({ weight: w, value: values[i] }));
        return { items, capacity } as InputDP;
      }
      case 'MO': {
        const [N] = nextNumbers();
        const arr = nextNumbers();
        const [Q] = nextNumbers();
        const queries = [];
        for (let i = 0; i < Q; i++) {
          const [L, R] = nextNumbers();
          queries.push({ L, R });
        }
        return { arr, queries } as InputMo;
      }
      case 'CENTROID': {
        const [N] = nextNumbers();
        const nodes = Array.from({length: N}).map((_, i) => ({ id: `${i}`, x: 10 + Math.random() * 80, y: 10 + Math.random() * 80 }));
        const edges = [];
        for (let i = 0; i < N - 1; i++) {
          const [u, v] = nextNumbers();
          edges.push({ u: `${u}`, v: `${v}` });
        }
        return { nodes, edges } as InputCentroid;
      }
      case 'DP_BS': {
        const [N] = nextNumbers();
        const arr = nextNumbers();
        return { arr } as InputLIS;
      }
      case 'PBS': {
        const [N] = nextNumbers();
        const [U] = nextNumbers();
        const updates = [];
        for (let i = 0; i < U; i++) {
          const [idx, val] = nextNumbers();
          updates.push({ idx, val });
        }
        const [Q] = nextNumbers();
        const queries = [];
        for (let i = 0; i < Q; i++) {
          const [targetIdx, req] = nextNumbers();
          queries.push({ targetIdx, req });
        }
        return { arrSize: N, updates, queries } as InputPBS;
      }
      case 'DIGIT_DP': {
        const [N] = nextLine().split(/\s+/);
        const [targetSum] = nextNumbers();
        return { N, targetSum } as InputDigitDP;
      }
      case 'BRACKET_DP': {
        const s = nextLine();
        return { s } as InputBracketDP;
      }
      case 'SUDOKU': {
        const [n1, n2] = nextNumbers();
        const board = [];
        for(let i = 0; i < n1; i++) {
          board.push(nextNumbers());
        }
        return { board } as InputSudoku;
      }
      case 'NQUEENS': {
        const [N] = nextNumbers();
        return { N } as InputNQueens;
      }
      case 'DINIC': {
        const [N, S, T, M] = nextNumbers();
        const edges = [];
        for(let i = 0; i < M; i++) {
          const [u, v, cap] = nextNumbers();
          edges.push({ u, v, cap });
        }
        return { N, source: S, sink: T, edges } as InputDinic;
      }
      case 'HLD': {
        const [N] = nextNumbers();
        const edges = [];
        for(let i = 0; i < N - 1; i++) {
          const [u, v] = nextNumbers();
          edges.push([u, v]);
        }
        const [qu, qv] = nextNumbers();
        return { N, edges, queryPath: [qu, qv] } as InputHLD;
      }
      case 'AHO_CORASICK': {
        const [K] = nextNumbers();
        const patterns = [];
        for(let i = 0; i < K; i++) patterns.push(nextLine());
        const text = nextLine();
        return { patterns, text } as InputAhoCorasick;
      }
      case 'CHT': {
        const [K] = nextNumbers();
        const linesArr = [];
        for (let i=0; i<K; i++) {
          const [m, c] = nextNumbers();
          linesArr.push({ m, c });
        }
        const [Q] = nextNumbers();
        const queries = [];
        for(let i=0; i<Q; i++) {
          const [qX] = nextNumbers();
          queries.push(qX);
        }
        return { lines: linesArr, queries } as InputCHT;
      }
      case 'REROOTING': {
        const [N] = nextNumbers();
        const edges = [];
        for(let i = 0; i < N - 1; i++) {
          const [u, v] = nextNumbers();
          edges.push([u, v]);
        }
        return { N, edges } as InputRerooting;
      }
      case 'DICE': {
        const [N] = nextNumbers();
        return { N } as InputDiceCombinations;
      }
      case 'MINIMIZING_COINS': {
        const [N, X] = nextNumbers();
        const coins = nextNumbers();
        return { target: X, coins: coins.slice(0, N) } as InputMinimizingCoins;
      }
      case 'COIN_COMBINATIONS_1': {
        const [N, X] = nextNumbers();
        const coins = nextNumbers();
        return { target: X, coins: coins.slice(0, N) } as InputCoinCombinations1;
      }
      case 'COIN_COMBINATIONS_2': {
        const [N, X] = nextNumbers();
        const coins = nextNumbers();
        return { target: X, coins: coins.slice(0, N) } as InputCoinCombinations2;
      }
      case 'REMOVING_DIGITS': {
        const [N] = nextNumbers();
        return { N } as InputRemovingDigits;
      }
      case 'GRID_PATHS': {
        const [N] = nextNumbers();
        const grid: string[] = [];
        for (let i = 0; i < N; i++) {
          grid.push(nextLine());
        }
        return { n: N, grid } as InputGridPaths;
      }
      case 'BOOK_SHOP': {
        const [N, X] = nextNumbers();
        const prices = nextNumbers();
        const pages = nextNumbers();
        return { budget: X, prices: prices.slice(0, N), pages: pages.slice(0, N) } as InputBookShop;
      }
      case 'SPARSE_TABLE': {
        const [N] = nextNumbers();
        const arr = nextNumbers();
        const [Q] = nextNumbers();
        const queries = [];
        for (let i = 0; i < Q; i++) {
          const [L, R] = nextNumbers();
          queries.push({ L, R });
        }
        return { arr: arr.slice(0, N), queries } as InputSparseTable;
      }
      case 'TRIE': {
        const [N] = nextNumbers();
        const words = [];
        for (let i = 0; i < N; i++) {
          words.push(nextLine());
        }
        const [Q] = nextNumbers();
        const queries: QueryTrie[] = [];
        for (let i = 0; i < Q; i++) {
          const [typeStr, word] = nextLine().split(/\s+/);
          const type = typeStr.toUpperCase() === 'PREFIX' ? 'PREFIX' : 'SEARCH';
          queries.push({ type, word });
        }
        return { words, queries } as InputTrie;
      }
      case 'BINARY_SEQUENCE': { return { n: nextNumbers()[0] }; }
      case 'PERMUTATION': { return { n: nextNumbers()[0] }; }
      case 'COMBINATION': { const [n, c] = nextNumbers(); return { n, c }; }
      case 'SUBSET': { return { n: nextNumbers()[0] }; }

    }
  } catch(e: any) {
    throw new Error("Lỗi định dạng đầu vào: " + e.message);
  }
}
