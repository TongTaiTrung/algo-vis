"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sample_testcases_1 = require("./lib/sample-testcases");
var cp_parser_1 = require("./lib/cp-parser");
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
var functionMap = {
    DIJKSTRA: dijkstra_1.generateTraces,
    DP: dp_knapsack_1.generateTracesDP,
    MO: mo_algorithm_1.generateTracesMo,
    CENTROID: centroid_1.generateTracesCentroid,
    DP_BS: dp_binary_search_1.generateTracesLIS,
    PBS: parallel_bs_1.generateTracesPBS,
    DIGIT_DP: digit_dp_1.generateTracesDigitDP,
    BRACKET_DP: bracket_dp_1.generateTracesBracketDP,
    SUDOKU: sudoku_1.generateTracesSudoku,
    NQUEENS: n_queens_1.generateTracesNQueens,
    DINIC: dinic_1.generateTracesDinic,
    HLD: hld_1.generateTracesHLD,
    AHO_CORASICK: aho_corasick_1.generateTracesAhoCorasick,
    CHT: cht_1.generateTracesCHT,
    REROOTING: rerooting_1.generateTracesRerooting
};
for (var _i = 0, _a = Object.entries(sample_testcases_1.SAMPLE_TESTCASES); _i < _a.length; _i++) {
    var _b = _a[_i], algo = _b[0], samples = _b[1];
    for (var _c = 0, samples_1 = samples; _c < samples_1.length; _c++) {
        var sample = samples_1[_c];
        try {
            var parsed = (0, cp_parser_1.parseCPText)(algo, sample.data);
            if (!parsed)
                throw new Error("Parsed is null");
            var traces = functionMap[algo](parsed);
            if (!traces || traces.length === 0)
                throw new Error("Traces is empty");
            console.log("".concat(algo, " - ").concat(sample.name, ": OK"));
        }
        catch (e) {
            console.log("".concat(algo, " - ").concat(sample.name, ": FAILED! -> ").concat(e.message));
        }
    }
}
