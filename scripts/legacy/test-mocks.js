"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dijkstra_1 = require("./lib/tracers/dijkstra");
var dp_knapsack_1 = require("./lib/tracers/dp-knapsack");
var mo_algorithm_1 = require("./lib/tracers/mo-algorithm");
var centroid_1 = require("./lib/tracers/centroid");
var dp_binary_search_1 = require("./lib/tracers/dp-binary-search");
var parallel_bs_1 = require("./lib/tracers/parallel-bs");
var digit_dp_1 = require("./lib/tracers/digit-dp");
var bracket_dp_1 = require("./lib/tracers/bracket-dp");
var sudoku_1 = require("./lib/tracers/sudoku");
var n_queens_1 = require("./lib/tracers/n-queens");
var dinic_1 = require("./lib/tracers/dinic");
var hld_1 = require("./lib/tracers/hld");
var aho_corasick_1 = require("./lib/tracers/aho-corasick");
var cht_1 = require("./lib/tracers/cht");
var rerooting_1 = require("./lib/tracers/rerooting");
var MOCK_DIJKSTRA = {
    nodes: [{ id: "0", x: 20, y: 50 }, { id: "1", x: 40, y: 20 }, { id: "2", x: 40, y: 80 }, { id: "3", x: 70, y: 20 }, { id: "4", x: 80, y: 60 }],
    edges: [{ from: "0", to: "1", weight: 4 }, { from: "0", to: "2", weight: 2 }, { from: "1", to: "2", weight: 1 }, { from: "1", to: "3", weight: 5 }, { from: "2", to: "3", weight: 8 }, { from: "2", to: "4", weight: 10 }, { from: "3", to: "4", weight: 2 }],
    startNode: "0"
};
var MOCK_DP = { items: [{ weight: 2, value: 3 }, { weight: 3, value: 4 }, { weight: 4, value: 5 }, { weight: 5, value: 6 }], capacity: 8 };
var MOCK_MO = { arr: [1, 2, 1, 3, 2, 1, 4, 2], queries: [{ L: 0, R: 4 }, { L: 1, R: 5 }, { L: 2, R: 7 }] };
var MOCK_CENTROID = {
    nodes: [{ id: "0", x: 50, y: 15 }, { id: "1", x: 30, y: 40 }, { id: "2", x: 70, y: 40 }, { id: "3", x: 15, y: 75 }, { id: "4", x: 40, y: 75 }, { id: "5", x: 60, y: 75 }, { id: "6", x: 85, y: 75 }],
    edges: [{ u: "0", v: "1" }, { u: "0", v: "2" }, { u: "1", v: "3" }, { u: "1", v: "4" }, { u: "2", v: "5" }, { u: "2", v: "6" }]
};
var MOCK_DP_BS = { arr: [10, 9, 2, 5, 3, 7, 101, 18] };
var MOCK_PBS = { arrSize: 5, updates: [{ idx: 0, val: 3 }, { idx: 2, val: 5 }, { idx: 4, val: 2 }, { idx: 1, val: 4 }], queries: [{ targetIdx: 2, req: 4 }, { targetIdx: 0, req: 3 }] };
var MOCK_DIGIT_DP = { N: "45", targetSum: 9 };
var MOCK_BRACKET_DP = { s: "([{})" };
var MOCK_SUDOKU = { board: [[1, 0, 0, 4], [0, 0, 2, 0], [0, 3, 0, 0], [2, 0, 0, 1]] };
var MOCK_NQUEENS = { N: 4 };
var MOCK_DINIC = { N: 6, source: 0, sink: 5, edges: [{ u: 0, v: 1, cap: 10 }, { u: 0, v: 2, cap: 10 }, { u: 1, v: 2, cap: 2 }, { u: 1, v: 3, cap: 4 }, { u: 1, v: 4, cap: 8 }, { u: 2, v: 4, cap: 9 }, { u: 3, v: 5, cap: 10 }, { u: 4, v: 3, cap: 6 }, { u: 4, v: 5, cap: 10 }] };
var MOCK_HLD = { N: 7, edges: [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6]], queryPath: [3, 6] };
var MOCK_AHO_CORASICK = { patterns: ["he", "she", "his", "hers"], text: "ahishers" };
var MOCK_CHT = { lines: [{ m: -2, c: 3 }, { m: -1, c: 1 }, { m: 1, c: -2 }], queries: [-2, 0, 2, 4] };
var MOCK_REROOTING = { N: 6, edges: [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5]] };
var run = function (name, fn, mock) {
    try {
        var res = fn(mock);
        if (!res || res.length === 0)
            console.log("".concat(name, ": ERRORED/EMPTY!"));
        else
            console.log("".concat(name, ": OK (").concat(res.length, " steps)"));
    }
    catch (e) {
        console.log("".concat(name, ": EXCEPTION -> ").concat(e.message));
    }
};
run('DIJKSTRA', dijkstra_1.generateTraces, MOCK_DIJKSTRA);
run('DP', dp_knapsack_1.generateTracesDP, MOCK_DP);
run('MO', mo_algorithm_1.generateTracesMo, MOCK_MO);
run('CENTROID', centroid_1.generateTracesCentroid, MOCK_CENTROID);
run('DP_BS', dp_binary_search_1.generateTracesLIS, MOCK_DP_BS);
run('PBS', parallel_bs_1.generateTracesPBS, MOCK_PBS);
run('DIGIT_DP', digit_dp_1.generateTracesDigitDP, MOCK_DIGIT_DP);
run('BRACKET_DP', bracket_dp_1.generateTracesBracketDP, MOCK_BRACKET_DP);
run('SUDOKU', sudoku_1.generateTracesSudoku, MOCK_SUDOKU);
run('NQUEENS', n_queens_1.generateTracesNQueens, MOCK_NQUEENS);
run('DINIC', dinic_1.generateTracesDinic, MOCK_DINIC);
run('HLD', hld_1.generateTracesHLD, MOCK_HLD);
run('AHO_CORASICK', aho_corasick_1.generateTracesAhoCorasick, MOCK_AHO_CORASICK);
run('CHT', cht_1.generateTracesCHT, MOCK_CHT);
run('REROOTING', rerooting_1.generateTracesRerooting, MOCK_REROOTING);
