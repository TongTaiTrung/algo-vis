export const CODE_COIN_COMBINATIONS_1 = {
  cpp: `#include <vector>

using namespace std;

int coinCombinations1(int n, int x, const vector<int>& coins) {
    const int MOD = 1e9 + 7;
    vector<int> dp(x + 1, 0);
    dp[0] = 1;

    for (int i = 1; i <= x; i++) {
        for (int c : coins) {
            if (i - c >= 0) {
                dp[i] = (dp[i] + dp[i - c]) % MOD;
            }
        }
    }
    return dp[x];
}`,
  python: `def coin_combinations_1(n, x, coins):
    MOD = 10**9 + 7
    dp = [0] * (x + 1)
    dp[0] = 1

    for i in range(1, x + 1):
        for c in coins:
            if i - c >= 0:
                dp[i] = (dp[i] + dp[i - c]) % MOD

    return dp[x]`,
  javascript: `function coinCombinations1(n, x, coins) {
    const MOD = 1e9 + 7;
    const dp = new Array(x + 1).fill(0);
    dp[0] = 1;

    for (let i = 1; i <= x; i++) {
        for (const c of coins) {
            if (i - c >= 0) {
                dp[i] = (dp[i] + dp[i - c]) % MOD;
            }
        }
    }
    return dp[x];
}`
};

export const MAPPINGS_COIN_COMBINATIONS_1 = {
  cpp: {
    1: 5,
    2: 7,
    3: 8,
    4: 10,
    5: 11,
    6: 12,
    7: 13,
    8: 17
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
