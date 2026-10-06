export const CODE_PBS = {
  cpp: `#include <vector>

using namespace std;

struct Update {
    int idx;
    int val;
};

struct Query {
    int id;
    int target;
    int req;
    int L, R, ans;
};

vector<Query> parallelBinarySearch(int n, int m, const vector<Update>& updates, vector<Query> queries) {
    for (auto& q : queries) {
        q.L = 1;
        q.R = m;
        q.ans = -1;
    }

    bool checkNeeded = true;
    while (checkNeeded) {
        checkNeeded = false;
        vector<vector<int>> mids(m + 1);

        for (int i = 0; i < (int)queries.size(); i++) {
            if (queries[i].L <= queries[i].R) {
                checkNeeded = true;
                int mid = queries[i].L + (queries[i].R - queries[i].L) / 2;
                mids[mid].push_back(i);
            }
        }

        if (!checkNeeded) break;

        vector<long long> tree(n + 1, 0);

        for (int t = 1; t <= m; t++) {
            tree[updates[t - 1].idx] += updates[t - 1].val;

            for (int qIdx : mids[t]) {
                auto& q = queries[qIdx];
                if (tree[q.target] >= q.req) {
                    q.ans = t;
                    q.R = t - 1;
                } else {
                    q.L = t + 1;
                }
            }
        }
    }

    return queries;
}`,
  python: `def parallel_binary_search(n, m, updates, queries):
    for q in queries:
        q['L'] = 1
        q['R'] = m
        q['ans'] = -1

    while True:
        mids = [[] for _ in range(m + 1)]
        check_needed = False

        for q in queries:
            if q['L'] <= q['R']:
                check_needed = True
                mid = (q['L'] + q['R']) // 2
                mids[mid].append(q)

        if not check_needed:
            break

        tree = [0] * (n + 1)

        for t in range(1, m + 1):
            tree[updates[t - 1]['idx']] += updates[t - 1]['val']

            for q in mids[t]:
                if tree[q['target']] >= q['req']:
                    q['ans'] = t
                    q['R'] = t - 1
                else:
                    q['L'] = t + 1

    return queries`,
  javascript: `function parallelBinarySearch(n, m, updates, queries) {
    for (const q of queries) {
        q.L = 1;
        q.R = m;
        q.ans = -1;
    }

    while (true) {
        const mids = Array.from({ length: m + 1 }, () => []);
        let checkNeeded = false;

        for (const q of queries) {
            if (q.L <= q.R) {
                checkNeeded = true;
                const mid = Math.floor((q.L + q.R) / 2);
                mids[mid].push(q);
            }
        }

        if (!checkNeeded) break;

        const tree = new Array(n + 1).fill(0);

        for (let t = 1; t <= m; t++) {
            tree[updates[t - 1].idx] += updates[t - 1].val;

            for (const q of mids[t]) {
                if (tree[q.target] >= q.req) {
                    q.ans = t;
                    q.R = t - 1;
                } else {
                    q.L = t + 1;
                }
            }
        }
    }

    return queries;
}`
};

export const MAPPINGS_PBS = {
  cpp: {
    1: 17,
    2: 18,
    3: 25,
    4: 28,
    5: 39,
    6: 41,
    7: 42,
    8: 44,
    9: 46,
    10: [47, 48],
    11: 49,
    12: 50,
    13: 56
  },
  python: {
    1: 1,
    2: [2, 3, 4, 5],
    3: 7,
    4: 8,
    5: 20,
    6: 22,
    7: 23,
    8: 25,
    9: 26,
    10: [27, 28],
    11: 29,
    12: 30,
    13: 32
  },
  javascript: {
    1: 1,
    2: [2, 3, 4, 5],
    3: 8,
    4: 9,
    5: 22,
    6: 24,
    7: 25,
    8: 27,
    9: 28,
    10: [29, 30],
    11: 31,
    12: 32,
    13: 38
  }
};
