import { generateTracesSudoku } from "./lib/tracers/sudoku";
import { SAMPLE_TESTCASES } from "./lib/sample-testcases";
import { parseCPText } from "./lib/cp-parser";

const input = parseCPText("SUDOKU", SAMPLE_TESTCASES.SUDOKU[1].data);
const steps = generateTracesSudoku(input);
console.log("Steps length:", steps.length);
console.log("Final narrative:", steps[steps.length - 1].narrative);
const b = steps[steps.length - 1].state.board;
console.log("Empty cells?", b.some(r => r.includes(0)));
