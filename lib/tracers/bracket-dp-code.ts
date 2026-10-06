export const CODE_BRACKET_DP = {
  cpp: `#include <string>
#include <vector>
#include <algorithm>

using namespace std;

bool matches(char open, char close) {
    return (open == '(' && close == ')') ||
           (open == '[' && close == ']') ||
           (open == '{' && close == '}');
}

int longestValidBraces(const string& S) {
    int n = S.length();
    vector<vector<int>> dp(n, vector<int>(n, 0));

    for (int len = 2; len <= n; len++) {
        for (int i = 0; i <= n - len; i++) {
            int j = i + len - 1;
            if (matches(S[i], S[j])) {
                int inner = (i + 1 <= j - 1) ? dp[i + 1][j - 1] : 0;
                dp[i][j] = inner + 2;
            }
            for (int k = i; k < j; k++) {
                dp[i][j] = max(dp[i][j], dp[i][k] + dp[k + 1][j]);
            }
        }
    }
    return n == 0 ? 0 : dp[0][n - 1];
}`,
  python: `def matches(open_char, close_char):
    pairs = {'(': ')', '[': ']', '{': '}'}
    return pairs.get(open_char) == close_char

def longest_valid_braces(S):
    n = len(S)
    dp = [[0] * n for _ in range(n)]

    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            if matches(S[i], S[j]):
                inner = dp[i + 1][j - 1] if i + 1 <= j - 1 else 0
                dp[i][j] = inner + 2
            for k in range(i, j):
                dp[i][j] = max(dp[i][j], dp[i][k] + dp[k + 1][j])

    return 0 if n == 0 else dp[0][n - 1]`,
  javascript: `function matches(open, close) {
    return (open === '(' && close === ')') ||
           (open === '[' && close === ']') ||
           (open === '{' && close === '}');
}

function longestValidBraces(S) {
    const n = S.length;
    const dp = Array.from({ length: n }, () => new Array(n).fill(0));

    for (let len = 2; len <= n; len++) {
        for (let i = 0; i <= n - len; i++) {
            const j = i + len - 1;
            if (matches(S[i], S[j])) {
                const inner = (i + 1 <= j - 1) ? dp[i + 1][j - 1] : 0;
                dp[i][j] = inner + 2;
            }
            for (let k = i; k < j; k++) {
                dp[i][j] = Math.max(dp[i][j], dp[i][k] + dp[k + 1][j]);
            }
        }
    }
    return n === 0 ? 0 : dp[0][n - 1];
}`
};

export const MAPPINGS_BRACKET_DP = {
  cpp: {
    1: 14,
    2: 15,
    3: 16,
    4: 18,
    5: 19,
    6: 20,
    7: 21,
    8: 23,
    9: 25,
    10: 26,
    11: 30
  },
  python: {
    1: 5,
    2: 6,
    3: 7,
    4: 9,
    5: 10,
    6: 11,
    7: 12,
    8: 14,
    9: 15,
    10: 16,
    11: 18
  },
  javascript: {
    1: 7,
    2: 8,
    3: 9,
    4: 11,
    5: 12,
    6: 13,
    7: 14,
    8: 16,
    9: 18,
    10: 19,
    11: 23
  }
};
