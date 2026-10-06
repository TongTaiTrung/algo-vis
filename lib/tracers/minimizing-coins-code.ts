export const CODE_MIN_COINS = {
  cpp: `#include <vector>
#include <algorithm>

using namespace std;

int minimizingCoins(int n, int x, const vector<int>& coins) {
    const int INF = 1e9;
    vector<int> dp(x + 1, INF);
    dp[0] = 0;

    for (int i = 1; i <= x; i++) {
        for (int c : coins) {
            if (i - c >= 0 && dp[i - c] != INF) {
                dp[i] = min(dp[i], dp[i - c] + 1);
            }
        }
    }
    return dp[x] == INF ? -1 : dp[x];
}`,
  python: `def minimizing_coins(n, x, coins):
    INF = 10**9
    dp = [INF] * (x + 1)
    dp[0] = 0

    for i in range(1, x + 1):
        for c in coins:
            if i - c >= 0 and dp[i - c] != INF:
                dp[i] = min(dp[i], dp[i - c] + 1)

    return -1 if dp[x] == INF else dp[x]`,
  javascript: `function minimizingCoins(n, x, coins) {
    const INF = 1e9;
    const dp = new Array(x + 1).fill(INF);
    dp[0] = 0;

    for (let i = 1; i <= x; i++) {
        for (const c of coins) {
            if (i - c >= 0 && dp[i - c] !== INF) {
                dp[i] = Math.min(dp[i], dp[i - c] + 1);
            }
        }
    }
    return dp[x] === INF ? -1 : dp[x];
}`
};

export const MAPPINGS_MIN_COINS = {
  cpp: {
    1: 6,
    2: 8,
    3: 9,
    4: 11,
    5: 12,
    6: 13,
    7: 14,
    8: 18
  },
  python: {
    1: 1,
    2: 3,
    3: 4,
    4: 6,
    5: 7,
    6: 8,
    7: 9,
    8: 11
  },
  javascript: {
    1: 1,
    2: 3,
    3: 4,
    4: 6,
    5: 7,
    6: 8,
    7: 9,
    8: 12
  }
};
