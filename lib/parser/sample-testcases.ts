export const SAMPLE_TESTCASES: Record<string, { name: string; data: string }[]> = {
  DIJKSTRA: [
    { name: "Sample 1 (Basic)", data: "5 7 0\n0 1 4\n0 2 2\n1 2 1\n1 3 5\n2 3 8\n2 4 10\n3 4 2" },
    { name: "Sample 2 (Linear Path)", data: "4 3 0\n0 1 10\n1 2 20\n2 3 30" },
    { name: "Sample 3 (Unreachable)", data: "6 4 0\n0 1 5\n1 2 2\n3 4 10\n4 5 15\n" }
  ],
  DP: [
    { name: "Sample 1 (Basic 0/1)", data: "8\n2 3 4 5\n3 4 5 6" },
    { name: "Sample 2 (Large Values)", data: "15\n5 8 3 4 2\n10 12 5 7 4" }
  ],
  MO: [
    { name: "Sample 1 (Mode)", data: "8\n1 2 1 3 2 1 4 2\n3\n0 4\n1 5\n2 7" },
    { name: "Sample 2 (All Distinct)", data: "5\n10 20 30 40 50\n2\n0 2\n1 4" }
  ],
  CENTROID: [
    { name: "Sample 1 (Star Graph)", data: "7\n0 1\n0 2\n1 3\n1 4\n2 5\n2 6" },
    { name: "Sample 2 (Line Tree)", data: "5\n0 1\n1 2\n2 3\n3 4" }
  ],
  DP_BS: [
    { name: "Sample 1 (LIS Standard)", data: "8\n10 9 2 5 3 7 101 18" },
    { name: "Sample 2 (Decreasing)", data: "5\n5 4 3 2 1" }
  ],
  PBS: [
    { name: "Sample 1 (Meteors)", data: "5\n4\n0 3\n2 5\n4 2\n1 4\n2\n2 4\n0 3" }
  ],
  DIGIT_DP: [
    { name: "Sample 1 (Sum = 9)", data: "45\n9" },
    { name: "Sample 2 (Sum = 15)", data: "200\n15" }
  ],
  BRACKET_DP: [
    { name: "Sample 1 (Valid Match)", data: "([{}])" },
    { name: "Sample 2 (Invalid)", data: "([)]" },
    { name: "Sample 3 (Long)", data: "((({{{[[[()]]]}}})))" }
  ],
  SUDOKU: [
    { name: "Sample 1 (4x4)", data: "4 4\n1 0 0 4\n0 0 2 0\n0 3 0 0\n2 0 0 3" },
    { name: "Sample 2 (9x9 Standard)", data: "9 9\n5 3 0 0 7 0 0 0 0\n6 0 0 1 9 5 0 0 0\n0 9 8 0 0 0 0 6 0\n8 0 0 0 6 0 0 0 3\n4 0 0 8 0 3 0 0 1\n7 0 0 0 2 0 0 0 6\n0 6 0 0 0 0 2 8 0\n0 0 0 4 1 9 0 0 5\n0 0 0 0 8 0 0 7 9" }
  ],
  NQUEENS: [
    { name: "Sample 1 (4 Queens)", data: "4" },
    { name: "Sample 2 (8 Queens)", data: "8" }
  ],
  DINIC: [
    { name: "Sample 1 (Basic Graph)", data: "6 0 5 9\n0 1 10\n0 2 10\n1 2 2\n1 3 4\n1 4 8\n2 4 9\n3 5 10\n4 3 6\n4 5 10" },
    { name: "Sample 2 (Bipartite Matching)", data: "4 0 3 4\n0 1 1\n0 2 1\n1 3 1\n2 3 1" }
  ],
  HLD: [
    { name: "Sample 1 (Binary Tree)", data: "7\n0 1\n0 2\n1 3\n1 4\n2 5\n2 6\n3 6" },
    { name: "Sample 2 (Imbalanced)", data: "6\n0 1\n1 2\n2 3\n3 4\n0 5\n4 5" }
  ],
  AHO_CORASICK: [
    { name: "Sample 1 (Classic)", data: "4\nhe\nshe\nhis\nhers\nahishers" },
    { name: "Sample 2 (Repeated Patterns)", data: "3\na\naa\naaa\naaaaa" }
  ],
  CHT: [
    { name: "Sample 1 (3 Lines)", data: "3\n-2 3\n-1 1\n1 -2\n4\n-2 0 2 4" },
    { name: "Sample 2 (Steep Lines)", data: "2\n-5 10\n2 -4\n3\n-1 0 3" }
  ],
  REROOTING: [
    { name: "Sample 1 (Star Tree)", data: "5\n0 1\n0 2\n0 3\n0 4" },
    { name: "Sample 2 (Line Graph)", data: "6\n0 1\n1 2\n2 3\n3 4\n4 5" }
  ],
  DICE: [
    { name: "Sample 1 (CSES n=3)", data: "3" },
    { name: "Sample 2 (CSES n=8)", data: "8" },
    { name: "Sample 3 (CSES n=12)", data: "12" }
  ],
  MINIMIZING_COINS: [
    { name: "Sample 1 (CSES 3 coins, x=11)", data: "3 11\n1 5 7" },
    { name: "Sample 2 (Unreachable target)", data: "2 7\n2 4" },
    { name: "Sample 3 (Large target)", data: "4 15\n2 3 5 10" }
  ],
  COIN_COMBINATIONS_1: [
    { name: "Sample 1 (CSES 3 coins, x=9)", data: "3 9\n2 3 5" },
    { name: "Sample 2 (Target 10)", data: "3 10\n2 4 6" },
    { name: "Sample 3 (Single coin)", data: "1 5\n1" }
  ],
  COIN_COMBINATIONS_2: [
    { name: "Sample 1 (CSES 3 coins, x=9)", data: "3 9\n2 3 5" },
    { name: "Sample 2 (Target 10)", data: "2 10\n2 5" },
    { name: "Sample 3 (Target 6)", data: "3 6\n1 2 3" }
  ],
  REMOVING_DIGITS: [
    { name: "Sample 1 (CSES n=27)", data: "27" },
    { name: "Sample 2 (CSES n=42)", data: "42" },
    { name: "Sample 3 (CSES n=99)", data: "99" }
  ],
  GRID_PATHS: [
    { name: "Sample 1 (CSES 4x4 Grid)", data: "4\n....\n.*..\n...*\n...." },
    { name: "Sample 2 (3x3 Diagonal Trap)", data: "3\n...\n.*.\n..." },
    { name: "Sample 3 (Blocked Exit)", data: "4\n....\n....\n....\n...*" }
  ],
  BOOK_SHOP: [
    { name: "Sample 1 (CSES 4 books, x=10)", data: "4 10\n4 8 5 3\n5 12 8 1" },
    { name: "Sample 2 (Tight budget)", data: "3 5\n2 3 4\n3 4 5" },
    { name: "Sample 3 (Large Pages)", data: "3 8\n3 4 5\n10 20 30" }
  ],
  SPARSE_TABLE: [
    { name: "Sample 1 (Cơ bản N=8)", data: "8\n4 2 7 1 9 3 6 5\n4\n1 5\n4 7\n0 2\n2 6" },
    { name: "Sample 2 (Đoạn truy vấn trùng lặp lớn)", data: "6\n10 20 15 5 30 25\n3\n0 5\n2 4\n0 1" },
    { name: "Sample 3 (Một phần tử & Dãy tăng)", data: "5\n1 2 3 4 5\n4\n0 0\n4 4\n0 2\n2 4" }
  ]
};
