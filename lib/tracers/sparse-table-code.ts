export const CODE_SPARSE_TABLE = {
  cpp: `#include <vector>
#include <algorithm>
#include <cmath>

using namespace std;

class SparseTable {
    int n, K;
    vector<vector<int>> st;
    vector<int> lg;

public:
    SparseTable(const vector<int>& a) {
        n = a.size();
        K = log2(n);
        st.assign(K + 1, vector<int>(n));

        for (int i = 0; i < n; i++)
            st[0][i] = a[i];

        for (int k = 1; k <= K; k++) {
            for (int i = 0; i + (1 << k) <= n; i++) {
                st[k][i] = min(st[k - 1][i], st[k - 1][i + (1 << (k - 1))]);
            }
        }

        lg.assign(n + 1, 0);
        for (int i = 2; i <= n; i++)
            lg[i] = lg[i / 2] + 1;
    }

    int query(int L, int R) {
        int len = R - L + 1;
        int k = lg[len];
        return min(st[k][L], st[k][R - (1 << k) + 1]);
    }
};`,
  python: `import math

class SparseTable:
    def __init__(self, a):
        self.n = len(a)
        self.K = int(math.log2(self.n))
        self.st = [[0] * self.n for _ in range(self.K + 1)]

        for i in range(self.n):
            self.st[0][i] = a[i]

        for k in range(1, self.K + 1):
            length = 1 << k
            half = 1 << (k - 1)
            for i in range(self.n - length + 1):
                self.st[k][i] = min(self.st[k - 1][i], self.st[k - 1][i + half])

    def query(self, L, R):
        length = R - L + 1
        k = int(math.log2(length))
        return min(self.st[k][L], self.st[k][R - (1 << k) + 1])`,
  javascript: `class SparseTable {
    constructor(a) {
        this.n = a.length;
        this.K = Math.floor(Math.log2(this.n));
        this.st = Array.from({ length: this.K + 1 }, () => new Array(this.n));

        for (let i = 0; i < this.n; i++) {
            this.st[0][i] = a[i];
        }

        for (let k = 1; k <= this.K; k++) {
            const half = 1 << (k - 1);
            for (let i = 0; i + (1 << k) <= this.n; i++) {
                this.st[k][i] = Math.min(this.st[k - 1][i], this.st[k - 1][i + half]);
            }
        }
    }

    query(L, R) {
        const len = R - L + 1;
        const k = Math.floor(Math.log2(len));
        return Math.min(this.st[k][L], this.st[k][R - (1 << k) + 1]);
    }
}`
};

export const MAPPINGS_SPARSE_TABLE = {
  cpp: {
    1: 13,
    2: 15,
    3: 18,
    4: 19,
    5: 21,
    6: 22,
    7: 23,
    8: 27,
    9: 31,
    10: 32,
    11: 33,
    12: 34,
    13: 35
  },
  python: {
    1: 4,
    2: 6,
    3: 9,
    4: 10,
    5: 12,
    6: 15,
    7: 16,
    8: 17,
    9: 18,
    10: 19,
    11: 20,
    12: 21,
    13: 21
  },
  javascript: {
    1: 2,
    2: 4,
    3: 7,
    4: 8,
    5: 11,
    6: 13,
    7: 14,
    8: 17,
    9: 19,
    10: 20,
    11: 21,
    12: 22,
    13: 22
  }
};
