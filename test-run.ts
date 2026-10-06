import { generateTracesNQueens } from './lib/tracers/n-queens';
import { generateTracesSudoku } from './lib/tracers/sudoku';
import { generateTracesBinarySequence } from './lib/tracers/binary-sequence';
import { generateTracesSubset } from './lib/tracers/subset';
import { generateTracesCombination } from './lib/tracers/combination';
import { generateTracesPermutation } from './lib/tracers/permutation';
import { MOCK_NQUEENS, MOCK_SUDOKU } from './constants/mock-inputs';

console.log("NQueens traces:", generateTracesNQueens(MOCK_NQUEENS).length);
console.log("Sudoku traces:", generateTracesSudoku(MOCK_SUDOKU).length);
console.log("BinarySequence:", generateTracesBinarySequence({n:4}).length);
console.log("Combination:", generateTracesCombination({n:5, c:3}).length);
console.log("Subset:", generateTracesSubset({n:3}).length);
console.log("Permutation:", generateTracesPermutation({n:3}).length);
