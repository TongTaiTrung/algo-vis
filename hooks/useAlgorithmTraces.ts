import { useMemo } from 'react';
import { AllInputs, AllTraces } from '@/types/algorithm';

import { generateTraces as generateDijkstra } from '@/lib/tracers/dijkstra';
import { generateTracesDP } from '@/lib/tracers/dp-knapsack';
import { generateTracesMo } from '@/lib/tracers/mo-algorithm';
import { generateTracesCentroid } from '@/lib/tracers/centroid';
import { generateTracesLIS } from '@/lib/tracers/dp-binary-search';
import { generateTracesPBS } from '@/lib/tracers/parallel-bs';
import { generateTracesDigitDP } from '@/lib/tracers/digit-dp';
import { generateTracesBracketDP } from '@/lib/tracers/bracket-dp';
import { generateTracesSudoku } from '@/lib/tracers/sudoku';
import { generateTracesNQueens } from '@/lib/tracers/n-queens';
import { generateTracesDinic } from '@/lib/tracers/dinic';
import { generateTracesHLD } from '@/lib/tracers/hld';
import { generateTracesAhoCorasick } from '@/lib/tracers/aho-corasick';
import { generateTracesCHT } from '@/lib/tracers/cht';
import { generateTracesRerooting } from '@/lib/tracers/rerooting';
import { generateTracesDice } from '@/lib/tracers/dice-combinations';
import { generateTracesMinimizingCoins } from '@/lib/tracers/minimizing-coins';
import { generateTracesCoinCombinations1 } from '@/lib/tracers/coin-combinations-1';
import { generateTracesCoinCombinations2 } from '@/lib/tracers/coin-combinations-2';
import { generateTracesRemovingDigits } from '@/lib/tracers/removing-digits';
import { generateTracesGridPaths } from '@/lib/tracers/grid-paths';
import { generateTracesBinarySequence } from '@/lib/tracers/binary-sequence';
import { generateTracesPermutation } from '@/lib/tracers/permutation';
import { generateTracesCombination } from '@/lib/tracers/combination';
import { generateTracesSubset } from '@/lib/tracers/subset';

import { generateTracesBookShop } from '@/lib/tracers/book-shop';
import { generateTracesSparseTable } from '@/lib/tracers/sparse-table';
import { generateTracesTrie } from '@/lib/tracers/trie';

export function useAlgorithmTraces(inputs: AllInputs): AllTraces {
  const tracesDijkstra = useMemo(() => { try { return generateDijkstra(inputs.DIJKSTRA); } catch { return []; } }, [inputs.DIJKSTRA]);
  const tracesDp = useMemo(() => { try { return generateTracesDP(inputs.DP); } catch { return []; } }, [inputs.DP]);
  const tracesMo = useMemo(() => { try { return generateTracesMo(inputs.MO); } catch { return []; } }, [inputs.MO]);
  const tracesCentroid = useMemo(() => { try { return generateTracesCentroid(inputs.CENTROID); } catch { return []; } }, [inputs.CENTROID]);
  const tracesLis = useMemo(() => { try { return generateTracesLIS(inputs.DP_BS); } catch { return []; } }, [inputs.DP_BS]);
  const tracesPbs = useMemo(() => { try { return generateTracesPBS(inputs.PBS); } catch { return []; } }, [inputs.PBS]);
  const tracesDigitDp = useMemo(() => { try { return generateTracesDigitDP(inputs.DIGIT_DP); } catch { return []; } }, [inputs.DIGIT_DP]);
  const tracesBracketDp = useMemo(() => { try { return generateTracesBracketDP(inputs.BRACKET_DP); } catch { return []; } }, [inputs.BRACKET_DP]);
  const tracesSudoku = useMemo(() => { try { return generateTracesSudoku(inputs.SUDOKU); } catch { return []; } }, [inputs.SUDOKU]);
  const tracesNQueens = useMemo(() => { try { return generateTracesNQueens(inputs.NQUEENS); } catch { return []; } }, [inputs.NQUEENS]);
  const tracesDinic = useMemo(() => { try { return generateTracesDinic(inputs.DINIC); } catch { return []; } }, [inputs.DINIC]);
  const tracesHld = useMemo(() => { try { return generateTracesHLD(inputs.HLD); } catch { return []; } }, [inputs.HLD]);
  const tracesAhoCorasick = useMemo(() => { try { return generateTracesAhoCorasick(inputs.AHO_CORASICK); } catch { return []; } }, [inputs.AHO_CORASICK]);
  const tracesCht = useMemo(() => { try { return generateTracesCHT(inputs.CHT); } catch { return []; } }, [inputs.CHT]);
  const tracesRerooting = useMemo(() => { try { return generateTracesRerooting(inputs.REROOTING); } catch { return []; } }, [inputs.REROOTING]);
  const tracesDice = useMemo(() => { try { return generateTracesDice(inputs.DICE); } catch { return []; } }, [inputs.DICE]);
  const tracesMinCoins = useMemo(() => { try { return generateTracesMinimizingCoins(inputs.MINIMIZING_COINS); } catch { return []; } }, [inputs.MINIMIZING_COINS]);
  const tracesCoinComb1 = useMemo(() => { try { return generateTracesCoinCombinations1(inputs.COIN_COMBINATIONS_1); } catch { return []; } }, [inputs.COIN_COMBINATIONS_1]);
  const tracesCoinComb2 = useMemo(() => { try { return generateTracesCoinCombinations2(inputs.COIN_COMBINATIONS_2); } catch { return []; } }, [inputs.COIN_COMBINATIONS_2]);
  const tracesRemovingDigits = useMemo(() => { try { return generateTracesRemovingDigits(inputs.REMOVING_DIGITS); } catch { return []; } }, [inputs.REMOVING_DIGITS]);
  const tracesGridPaths = useMemo(() => { try { return generateTracesGridPaths(inputs.GRID_PATHS); } catch { return []; } }, [inputs.GRID_PATHS]);
  const tracesBookShop = useMemo(() => { try { return generateTracesBookShop(inputs.BOOK_SHOP); } catch { return []; } }, [inputs.BOOK_SHOP]);
  const tracesSparseTable = useMemo(() => { try { return generateTracesSparseTable(inputs.SPARSE_TABLE); } catch { return []; } }, [inputs.SPARSE_TABLE]);
  const tracesTrie = useMemo(() => { try { return generateTracesTrie(inputs.TRIE); } catch { return []; } }, [inputs.TRIE]);

  
  const tracesBinarySequence = useMemo(() => { try { return generateTracesBinarySequence(inputs.BINARY_SEQUENCE); } catch { return []; } }, [inputs.BINARY_SEQUENCE]);
  const tracesPermutation = useMemo(() => { try { return generateTracesPermutation(inputs.PERMUTATION); } catch { return []; } }, [inputs.PERMUTATION]);
  const tracesCombination = useMemo(() => { try { return generateTracesCombination(inputs.COMBINATION); } catch { return []; } }, [inputs.COMBINATION]);
  const tracesSubset = useMemo(() => { try { return generateTracesSubset(inputs.SUBSET); } catch { return []; } }, [inputs.SUBSET]);

  return {

    DIJKSTRA: tracesDijkstra,
    DP: tracesDp,
    MO: tracesMo,
    CENTROID: tracesCentroid,
    DP_BS: tracesLis,
    PBS: tracesPbs,
    DIGIT_DP: tracesDigitDp,
    BRACKET_DP: tracesBracketDp,
    SUDOKU: tracesSudoku,
    NQUEENS: tracesNQueens,
    DINIC: tracesDinic,
    HLD: tracesHld,
    AHO_CORASICK: tracesAhoCorasick,
    CHT: tracesCht,
    REROOTING: tracesRerooting,
    DICE: tracesDice,
    MINIMIZING_COINS: tracesMinCoins,
    COIN_COMBINATIONS_1: tracesCoinComb1,
    COIN_COMBINATIONS_2: tracesCoinComb2,
    REMOVING_DIGITS: tracesRemovingDigits,
    GRID_PATHS: tracesGridPaths,
    BOOK_SHOP: tracesBookShop,
    SPARSE_TABLE: tracesSparseTable,
    TRIE: tracesTrie,
      BINARY_SEQUENCE: tracesBinarySequence,
    PERMUTATION: tracesPermutation,
    COMBINATION: tracesCombination,
    SUBSET: tracesSubset,
  };
}
