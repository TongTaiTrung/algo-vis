import { LucideIcon } from 'lucide-react';
import { InputBinarySequence, StepBinarySequence } from '@/lib/tracers/binary-sequence';
import { InputPermutation, StepPermutation } from '@/lib/tracers/permutation';
import { InputCombination, StepCombination } from '@/lib/tracers/combination';
import { InputSubset, StepSubset } from '@/lib/tracers/subset';

import { InputType as InputDijkstra, Step as StepDijkstra } from '@/lib/tracers/dijkstra';
import { InputDP, StepDP } from '@/lib/tracers/dp-knapsack';
import { InputMo, StepMo } from '@/lib/tracers/mo-algorithm';
import { InputCentroid, StepCentroid } from '@/lib/tracers/centroid';
import { InputLIS, StepLIS } from '@/lib/tracers/dp-binary-search';
import { InputPBS, StepPBS } from '@/lib/tracers/parallel-bs';
import { InputDigitDP, StepDigitDP } from '@/lib/tracers/digit-dp';
import { InputBracketDP, StepBracketDP } from '@/lib/tracers/bracket-dp';
import { InputSudoku, StepSudoku } from '@/lib/tracers/sudoku';
import { InputNQueens, StepNQueens } from '@/lib/tracers/n-queens';
import { InputDinic, StepDinic } from '@/lib/tracers/dinic';
import { InputHLD, StepHLD } from '@/lib/tracers/hld';
import { InputAhoCorasick, StepAhoCorasick } from '@/lib/tracers/aho-corasick';
import { InputCHT, StepCHT } from '@/lib/tracers/cht';
import { InputRerooting, StepRerooting } from '@/lib/tracers/rerooting';
import { InputDiceCombinations, StepDice } from '@/lib/tracers/dice-combinations';
import { InputMinimizingCoins, StepMinimizingCoins } from '@/lib/tracers/minimizing-coins';
import { InputCoinCombinations1, StepCoinCombinations1 } from '@/lib/tracers/coin-combinations-1';
import { InputCoinCombinations2, StepCoinCombinations2 } from '@/lib/tracers/coin-combinations-2';
import { InputRemovingDigits, StepRemovingDigits } from '@/lib/tracers/removing-digits';
import { InputGridPaths, StepGridPaths } from '@/lib/tracers/grid-paths';
import { InputBookShop, StepBookShop } from '@/lib/tracers/book-shop';
import { InputSparseTable, StepSparseTable } from '@/lib/tracers/sparse-table';
import { InputTrie, StepTrie } from '@/lib/tracers/trie';

export type TabType = 
  | 'DIJKSTRA' 
  | 'DP' 
  | 'MO' 
  | 'CENTROID' 
  | 'DP_BS' 
  | 'PBS' 
  | 'DIGIT_DP' 
  | 'BRACKET_DP' 
  | 'SUDOKU' 
  | 'NQUEENS' 
  | 'DINIC' 
  | 'HLD' 
  | 'AHO_CORASICK' 
  | 'CHT' 
  | 'REROOTING' 
  | 'DICE' 
  | 'MINIMIZING_COINS' 
  | 'COIN_COMBINATIONS_1' 
  | 'COIN_COMBINATIONS_2' 
  | 'REMOVING_DIGITS' 
  | 'GRID_PATHS' 
  | 'BOOK_SHOP'
  | 'SPARSE_TABLE'
  | 'TRIE'  | 'BINARY_SEQUENCE'
  | 'PERMUTATION'
  | 'COMBINATION'
  | 'SUBSET';

export type CategoryKey = 
  | 'GRAPH' 
  | 'DP' 
  | 'TREE' 
  | 'BACKTRACKING' 
  | 'STRING' 
  | 'DP_BASIC';

export interface AlgoMeta {
  id: TabType;
  name: string;
  category: CategoryKey;
  complexity: string;
  sourceBadge: string;
  desc: string;
  help: string;
  tags: string[];
  keywords?: string[];
  problemStatement?: string;
}

export interface CategoryItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

export interface CategoryStyle {
  color: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  borderHover: string;
  glow: string;
  accentBar: string;
}

export interface AllInputs {
  DIJKSTRA: InputDijkstra;
  DP: InputDP;
  MO: InputMo;
  CENTROID: InputCentroid;
  DP_BS: InputLIS;
  PBS: InputPBS;
  DIGIT_DP: InputDigitDP;
  BRACKET_DP: InputBracketDP;
  SUDOKU: InputSudoku;
  NQUEENS: InputNQueens;
  DINIC: InputDinic;
  HLD: InputHLD;
  AHO_CORASICK: InputAhoCorasick;
  CHT: InputCHT;
  REROOTING: InputRerooting;
  DICE: InputDiceCombinations;
  MINIMIZING_COINS: InputMinimizingCoins;
  COIN_COMBINATIONS_1: InputCoinCombinations1;
  COIN_COMBINATIONS_2: InputCoinCombinations2;
  REMOVING_DIGITS: InputRemovingDigits;
  GRID_PATHS: InputGridPaths;
  BOOK_SHOP: InputBookShop;
  SPARSE_TABLE: InputSparseTable;
  TRIE: InputTrie;
  BINARY_SEQUENCE: InputBinarySequence;
  PERMUTATION: InputPermutation;
  COMBINATION: InputCombination;
  SUBSET: InputSubset;
}

export interface AllTraces {
  DIJKSTRA: StepDijkstra[];
  DP: StepDP[];
  MO: StepMo[];
  CENTROID: StepCentroid[];
  DP_BS: StepLIS[];
  PBS: StepPBS[];
  DIGIT_DP: StepDigitDP[];
  BRACKET_DP: StepBracketDP[];
  SUDOKU: StepSudoku[];
  NQUEENS: StepNQueens[];
  DINIC: StepDinic[];
  HLD: StepHLD[];
  AHO_CORASICK: StepAhoCorasick[];
  CHT: StepCHT[];
  REROOTING: StepRerooting[];
  DICE: StepDice[];
  MINIMIZING_COINS: StepMinimizingCoins[];
  COIN_COMBINATIONS_1: StepCoinCombinations1[];
  COIN_COMBINATIONS_2: StepCoinCombinations2[];
  REMOVING_DIGITS: StepRemovingDigits[];
  GRID_PATHS: StepGridPaths[];
  BOOK_SHOP: StepBookShop[];
  SPARSE_TABLE: StepSparseTable[];
  TRIE: StepTrie[];
  BINARY_SEQUENCE: StepBinarySequence[];
  PERMUTATION: StepPermutation[];
  COMBINATION: StepCombination[];
  SUBSET: StepSubset[];
}
