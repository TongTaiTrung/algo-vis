export const LCS_CODE = {
  cpp: `#include <iostream>
#include <string>
#include <vector>
#include <algorithm>

using namespace std;

string s1, s2;

void solve() {
    int n = s1.length();
    int m = s2.length();
    
    vector<vector<int>> dp(n + 1, vector<int>(m + 1, 0));
    
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            if (s1[i - 1] == s2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    
    string lcs = "";
    int r = n, c = m;
    while (r > 0 && c > 0) {
        if (s1[r - 1] == s2[c - 1]) {
            lcs += s1[r - 1];
            r--; c--;
        } else if (dp[r - 1][c] > dp[r][c - 1]) {
            r--;
        } else {
            c--;
        }
    }
    reverse(lcs.begin(), lcs.end());
    
    cout << lcs << "\\n";
}

int main() {
    cin >> s1 >> s2;
    solve();
    return 0;
}`,
  python: `def solve():
    s1 = input()
    s2 = input()
    n = len(s1)
    m = len(s2)
    
    dp = [[0] * (m + 1) for _ in range(n + 1)]
    
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            if s1[i - 1] == s2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
                
    lcs = []
    r, c = n, m
    while r > 0 and c > 0:
        if s1[r - 1] == s2[c - 1]:
            lcs.append(s1[r - 1])
            r -= 1
            c -= 1
        elif dp[r - 1][c] > dp[r][c - 1]:
            r -= 1
        else:
            c -= 1
            
    print("".join(reversed(lcs)))
    
if __name__ == "__main__":
    solve()`,
  javascript: `function solve(s1, s2) {
    const n = s1.length;
    const m = s2.length;
    
    const dp = Array(n + 1).fill(0).map(() => Array(m + 1).fill(0));
    
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= m; j++) {
            if (s1[i - 1] === s2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    
    let lcs = "";
    let r = n, c = m;
    while (r > 0 && c > 0) {
        if (s1[r - 1] === s2[c - 1]) {
            lcs = s1[r - 1] + lcs;
            r--;
            c--;
        } else if (dp[r - 1][c] > dp[r][c - 1]) {
            r--;
        } else {
            c--;
        }
    }
    console.log(lcs);
}`
};

export const MAPPINGS_LCS = {
  cpp: {
    13: 13,
    18: 18,
    20: 20,
    26: 26,
    29: 29,
    32: 32,
    34: 34,
    38: 38
  },
  python: {
    13: 7,
    18: 12,
    20: 14,
    26: 17,
    29: 19,
    32: 23,
    34: 25,
    38: 27
  },
  javascript: {
    13: 5,
    18: 10,
    20: 12,
    26: 18,
    29: 20,
    32: 24,
    34: 26,
    38: 29
  }
};
