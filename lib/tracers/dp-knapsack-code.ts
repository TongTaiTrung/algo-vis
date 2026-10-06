export const CODE_DP = {
  cpp: `#include <vector>
#include <algorithm>

using namespace std;

struct Item {
    int weight;
    int value;
};

int knapsack(const vector<Item>& items, int W) {
    int n = items.size();
    vector<vector<int>> dp(n + 1, vector<int>(W + 1, 0));

    for (int i = 1; i <= n; i++) {
        for (int w = 1; w <= W; w++) {
            if (items[i - 1].weight <= w) {
                int take = dp[i - 1][w - items[i - 1].weight] + items[i - 1].value;
                int skip = dp[i - 1][w];
                dp[i][w] = max(take, skip);
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }
    return dp[n][W];
}`,
  python: `def knapsack(items, W):
    n = len(items)
    dp = [[0] * (W + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        for w in range(1, W + 1):
            if items[i - 1]['weight'] <= w:
                take = dp[i - 1][w - items[i - 1]['weight']] + items[i - 1]['value']
                skip = dp[i - 1][w]
                dp[i][w] = max(take, skip)
            else:
                dp[i][w] = dp[i - 1][w]

    return dp[n][W]`,
  javascript: `function knapsack(items, W) {
    const n = items.length;
    const dp = Array.from({ length: n + 1 }, () => new Array(W + 1).fill(0));

    for (let i = 1; i <= n; i++) {
        for (let w = 1; w <= W; w++) {
            if (items[i - 1].weight <= w) {
                const take = dp[i - 1][w - items[i - 1].weight] + items[i - 1].value;
                const skip = dp[i - 1][w];
                dp[i][w] = Math.max(take, skip);
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }
    return dp[n][W];
}`
};

export const MAPPINGS_DP = {
  cpp: {
    1: 11,
    2: 13,
    3: 15,
    4: 16,
    5: 17,
    6: 18,
    7: 19,
    8: 20,
    9: 21,
    10: 22,
    11: 26
  },
  python: {
    1: 1,
    2: 3,
    3: 5,
    4: 6,
    5: 7,
    6: 8,
    7: 9,
    8: 10,
    9: 11,
    10: 12,
    11: 14
  },
  javascript: {
    1: 1,
    2: 3,
    3: 5,
    4: 6,
    5: 7,
    6: 8,
    7: 9,
    8: 10,
    9: 11,
    10: 12,
    11: 15
  }
};
