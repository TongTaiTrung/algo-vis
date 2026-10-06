export const CODE_MO = {
  cpp: `#include <vector>
#include <cmath>
#include <algorithm>
#include <unordered_map>

using namespace std;

struct Query {
    int id, L, R, result;
};

vector<Query> moAlgorithm(const vector<int>& arr, vector<Query>& queries) {
    int n = arr.size();
    int blockSize = max(1, (int)sqrt(n));

    sort(queries.begin(), queries.end(), [&](const Query& a, const Query& b) {
        int blockA = a.L / blockSize;
        int blockB = b.L / blockSize;
        if (blockA != blockB) return blockA < blockB;
        return (blockA & 1) ? a.R < b.R : a.R > b.R;
    });

    int currL = 0, currR = -1;
    int distinctCount = 0;
    unordered_map<int, int> freq;

    auto add = [&](int val) {
        if (++freq[val] == 1) distinctCount++;
    };

    auto remove = [&](int val) {
        if (--freq[val] == 0) distinctCount--;
    };

    for (auto& q : queries) {
        while (currL > q.L) {
            currL--;
            add(arr[currL]);
        }
        while (currR < q.R) {
            currR++;
            add(arr[currR]);
        }
        while (currL < q.L) {
            remove(arr[currL]);
            currL++;
        }
        while (currR > q.R) {
            remove(arr[currR]);
            currR--;
        }
        q.result = distinctCount;
    }

    return queries;
}`,
  python: `import math

def mo_algorithm(arr, queries):
    n = len(arr)
    block_size = max(1, int(math.isqrt(n)))

    # Sort queries by block of L, then R
    queries.sort(key=lambda q: (q['L'] // block_size, q['R']))

    curr_L, curr_R = 0, -1
    distinct_count = 0
    freq = {}

    def add(x):
        nonlocal distinct_count
        freq[x] = freq.get(x, 0) + 1
        if freq[x] == 1:
            distinct_count += 1

    def remove(x):
        nonlocal distinct_count
        freq[x] -= 1
        if freq[x] == 0:
            distinct_count -= 1

    for q in queries:
        while curr_L > q['L']:
            curr_L -= 1
            add(arr[curr_L])
        while curr_R < q['R']:
            curr_R += 1
            add(arr[curr_R])
        while curr_L < q['L']:
            remove(arr[curr_L])
            curr_L += 1
        while curr_R > q['R']:
            remove(arr[curr_R])
            curr_R -= 1
        q['result'] = distinct_count

    return queries`,
  javascript: `function moAlgorithm(arr, queries) {
    const n = arr.length;
    const blockSize = Math.max(1, Math.floor(Math.sqrt(n)));

    queries.sort((a, b) => {
        const blockA = Math.floor(a.L / blockSize);
        const blockB = Math.floor(b.L / blockSize);
        if (blockA !== blockB) return blockA - blockB;
        return a.R - b.R;
    });

    let currL = 0, currR = -1;
    let distinctCount = 0;
    const freq = new Map();

    function add(val) {
        const count = (freq.get(val) || 0) + 1;
        freq.set(val, count);
        if (count === 1) distinctCount++;
    }

    function remove(val) {
        const count = freq.get(val) - 1;
        freq.set(val, count);
        if (count === 0) distinctCount--;
    }

    for (const q of queries) {
        while (currL > q.L) {
            currL--;
            add(arr[currL]);
        }
        while (currR < q.R) {
            currR++;
            add(arr[currR]);
        }
        while (currL < q.L) {
            remove(arr[currL]);
            currL++;
        }
        while (currR > q.R) {
            remove(arr[currR]);
            currR--;
        }
        q.result = distinctCount;
    }

    return queries;
}`
};

export const MAPPINGS_MO = {
  cpp: {
    1: 13,
    2: 15,
    3: 17,
    4: 24,
    5: 25,
    6: 26,
    7: 36,
    8: 37,
    9: 38,
    10: 41,
    11: 42,
    12: 45,
    13: 46,
    14: 49,
    15: 50,
    16: 53,
    17: 56
  },
  python: {
    1: 3,
    2: 5,
    3: 8,
    4: 10,
    5: 11,
    6: 12,
    7: 26,
    8: 27,
    9: 28,
    10: 30,
    11: 31,
    12: 33,
    13: 34,
    14: 36,
    15: 37,
    16: 39,
    17: 41
  },
  javascript: {
    1: 1,
    2: 3,
    3: 5,
    4: 12,
    5: 13,
    6: 14,
    7: 28,
    8: 29,
    9: 30,
    10: 33,
    11: 34,
    12: 37,
    13: 38,
    14: 41,
    15: 42,
    16: 45,
    17: 48
  }
};
