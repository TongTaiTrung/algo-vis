export const CODE_COIN_COMBINATIONS_2 = {
  cpp: `#include <vector>

using namespace std;

int coinCombinations2(int n, int x, const vector<int>& coins) {
    const int MOD = 1e9 + 7;
    vector<int> dp(x + 1, 0);
    dp[0] = 1;

    for (int c : coins) {
        for (int i = c; i <= x; i++) {
            dp[i] = (dp[i] + dp[i - c]) % MOD;
        }
    }
    return dp[x];
}`,
  python: `def coin_combinations_2(n, x, coins):
    MOD = 10**9 + 7
    dp = [0] * (x + 1)
    dp[0] = 1

    for c in coins:
        for i in range(c, x + 1):
            dp[i] = (dp[i] + dp[i - c]) % MOD

    return dp[x]`,
  javascript: `function coinCombinations2(n, x, coins) {
    const MOD = 1e9 + 7;
    const dp = new Array(x + 1).fill(0);
    dp[0] = 1;

    for (const c of coins) {
        for (let i = c; i <= x; i++) {
            dp[i] = (dp[i] + dp[i - c]) % MOD;
        }
    }
    return dp[x];
}`
};

export const MAPPINGS_COIN_COMBINATIONS_2 = {
  cpp: {
    1: 5,
    2: 7,
    3: 8,
    4: 10,
    5: 11,
    6: 12,
    7: 15
  },
  python: {
    1: 1,
    2: 3,
    3: 4,
    4: 6,
    5: 7,
    6: 8,
    7: 10
  },
  javascript: {
    1: 1,
    2: 3,
    3: 4,
    4: 6,
    5: 7,
    6: 8,
    7: 11
  }
};
