export const CODE_REMOVING_DIGITS = {
  cpp: `#include <vector>
#include <algorithm>

using namespace std;

int removingDigits(int n) {
    const int INF = 1e9;
    vector<int> dp(n + 1, INF);
    dp[0] = 0;

    for (int i = 1; i <= n; i++) {
        int temp = i;
        while (temp > 0) {
            int d = temp % 10;
            if (d > 0) {
                dp[i] = min(dp[i], dp[i - d] + 1);
            }
            temp /= 10;
        }
    }
    return dp[n];
}`,
  python: `def removing_digits(n):
    INF = 10**9
    dp = [INF] * (n + 1)
    dp[0] = 0

    for i in range(1, n + 1):
        for ch in str(i):
            d = int(ch)
            if d > 0:
                dp[i] = min(dp[i], dp[i - d] + 1)

    return dp[n]`,
  javascript: `function removingDigits(n) {
    const INF = 1e9;
    const dp = new Array(n + 1).fill(INF);
    dp[0] = 0;

    for (let i = 1; i <= n; i++) {
        const digits = String(i).split('').map(Number);
        for (const d of digits) {
            if (d > 0) {
                dp[i] = Math.min(dp[i], dp[i - d] + 1);
            }
        }
    }
    return dp[n];
}`
};

export const MAPPINGS_REMOVING_DIGITS = {
  cpp: {
    1: 6,
    2: 8,
    3: 9,
    4: 11,
    5: 14,
    6: 15,
    7: 16,
    8: 21
  },
  python: {
    1: 1,
    2: 3,
    3: 4,
    4: 6,
    5: 8,
    6: 9,
    7: 10,
    8: 12
  },
  javascript: {
    1: 1,
    2: 3,
    3: 4,
    4: 6,
    5: 8,
    6: 9,
    7: 10,
    8: 13
  }
};
