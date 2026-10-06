export const CODE_LIS = {
  cpp: `#include <vector>
#include <algorithm>

using namespace std;

int longestIncreasingSubsequence(const vector<int>& arr) {
    vector<int> tails;

    for (int i = 0; i < (int)arr.size(); i++) {
        int x = arr[i];
        if (tails.empty() || x > tails.back()) {
            tails.push_back(x);
        } else {
            int L = 0, R = tails.size() - 1;
            while (L < R) {
                int mid = L + (R - L) / 2;
                if (tails[mid] < x) {
                    L = mid + 1;
                } else {
                    R = mid;
                }
            }
            tails[L] = x;
        }
    }
    return tails.size();
}`,
  python: `def lis(arr):
    tails = []

    for i in range(len(arr)):
        x = arr[i]
        if not tails or x > tails[-1]:
            tails.append(x)
        else:
            L, R = 0, len(tails) - 1
            while L < R:
                mid = (L + R) // 2
                if tails[mid] < x:
                    L = mid + 1
                else:
                    R = mid
            tails[L] = x

    return len(tails)`,
  javascript: `function lis(arr) {
    const tails = [];

    for (let i = 0; i < arr.length; i++) {
        const x = arr[i];
        if (tails.length === 0 || x > tails[tails.length - 1]) {
            tails.push(x);
        } else {
            let L = 0, R = tails.length - 1;
            while (L < R) {
                const mid = Math.floor((L + R) / 2);
                if (tails[mid] < x) {
                    L = mid + 1;
                } else {
                    R = mid;
                }
            }
            tails[L] = x;
        }
    }
    return tails.length;
}`
};

export const MAPPINGS_LIS = {
  cpp: {
    1: 6,
    2: 7,
    3: 9,
    4: 10,
    5: 11,
    6: 12,
    7: 13,
    8: 14,
    9: 15,
    10: 16,
    11: 17,
    12: 18,
    13: 19,
    14: 20,
    15: 23,
    16: 26
  },
  python: {
    1: 1,
    2: 2,
    3: 4,
    4: 5,
    5: 6,
    6: 7,
    7: 8,
    8: 9,
    9: 10,
    10: 11,
    11: 12,
    12: 13,
    13: 14,
    14: 15,
    15: 16,
    16: 18
  },
  javascript: {
    1: 1,
    2: 2,
    3: 4,
    4: 5,
    5: 6,
    6: 7,
    7: 8,
    8: 9,
    9: 10,
    10: 11,
    11: 12,
    12: 13,
    13: 14,
    14: 15,
    15: 16,
    16: 19
  }
};
