"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const n_queens_1 = require("./lib/tracers/n-queens");
const sudoku_1 = require("./lib/tracers/sudoku");
console.log('NQueens:', (0, n_queens_1.generateTracesNQueens)({ N: 4 }).length);
console.log('Sudoku:', (0, sudoku_1.generateTracesSudoku)({ grid: [[0]] }).length);
