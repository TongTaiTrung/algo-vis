export const CODE_BOOK_SHOP = {
  cpp: `#include <vector>
#include <algorithm>

using namespace std;

int bookShop(int n, int x, const vector<int>& price, const vector<int>& pages) {
    vector<vector<int>> dp(n + 1, vector<int>(x + 1, 0));

    for (int i = 1; i <= n; i++) {
        for (int w = 0; w <= x; w++) {
            dp[i][w] = dp[i - 1][w];
            if (w >= price[i - 1]) {
                dp[i][w] = max(dp[i][w], dp[i - 1][w - price[i - 1]] + pages[i - 1]);
            }
        }
    }
    return dp[n][x];
}`,
  python: `def book_shop(n, x, price, pages):
    dp = [[0] * (x + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        for w in range(x + 1):
            dp[i][w] = dp[i - 1][w]
            if w >= price[i - 1]:
                dp[i][w] = max(dp[i][w], dp[i - 1][w - price[i - 1]] + pages[i - 1])

    return dp[n][x]`,
  javascript: `function bookShop(n, x, price, pages) {
    const dp = Array.from({ length: n + 1 }, () => new Array(x + 1).fill(0));

    for (let i = 1; i <= n; i++) {
        for (let w = 0; w <= x; w++) {
            dp[i][w] = dp[i - 1][w];
            if (w >= price[i - 1]) {
                dp[i][w] = Math.max(dp[i][w], dp[i - 1][w - price[i - 1]] + pages[i - 1]);
            }
        }
    }
    return dp[n][x];
}`
};

export const MAPPINGS_BOOK_SHOP = {
  cpp: {
    1: 6,
    2: 7,
    3: 9,
    4: 10,
    5: 11,
    6: 12,
    7: 13,
    8: 17
  },
  python: {
    1: 1,
    2: 2,
    3: 4,
    4: 5,
    5: 6,
    6: 7,
    7: 8,
    8: 10
  },
  javascript: {
    1: 1,
    2: 2,
    3: 4,
    4: 5,
    5: 6,
    6: 7,
    7: 8,
    8: 11
  }
};
