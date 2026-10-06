export const CODE_DICE = {
  cpp: `#include <vector>

using namespace std;

int diceCombinations(int n) {
    const int MOD = 1e9 + 7;
    vector<int> dp(n + 1, 0);
    dp[0] = 1;

    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= 6; j++) {
            if (i - j >= 0) {
                dp[i] = (dp[i] + dp[i - j]) % MOD;
            }
        }
    }
    return dp[n];
}`,
  python: `def dice_combinations(n):
    MOD = 10**9 + 7
    dp = [0] * (n + 1)
    dp[0] = 1

    for i in range(1, n + 1):
        for j in range(1, 7):
            if i - j >= 0:
                dp[i] = (dp[i] + dp[i - j]) % MOD

    return dp[n]`,
  javascript: `function diceCombinations(n) {
    const MOD = 1e9 + 7;
    const dp = new Array(n + 1).fill(0);
    dp[0] = 1;

    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= 6; j++) {
            if (i - j >= 0) {
                dp[i] = (dp[i] + dp[i - j]) % MOD;
            }
        }
    }
    return dp[n];
}`
};

export const MAPPINGS_DICE = {
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
