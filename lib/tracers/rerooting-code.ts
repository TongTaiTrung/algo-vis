export const CODE_REROOTING = {
  cpp: `#include <vector>

using namespace std;

vector<vector<int>> adj;
vector<int> subtreeSize, dp, ans;
int n;

void dfs1(int u, int p) {
    subtreeSize[u] = 1;
    dp[u] = 0;
    for (int v : adj[u]) {
        if (v != p) {
            dfs1(v, u);
            subtreeSize[u] += subtreeSize[v];
            dp[u] += dp[v] + subtreeSize[v];
        }
    }
}

void dfs2(int u, int p) {
    for (int v : adj[u]) {
        if (v != p) {
            ans[v] = ans[u] - subtreeSize[v] + (n - subtreeSize[v]);
            dfs2(v, u);
        }
    }
}

vector<int> sumOfDistancesInTree(int nNodes, const vector<vector<int>>& edges) {
    n = nNodes;
    adj.assign(n, vector<int>());
    for (const auto& e : edges) {
        adj[e[0]].push_back(e[1]);
        adj[e[1]].push_back(e[0]);
    }
    subtreeSize.assign(n, 0);
    dp.assign(n, 0);
    ans.assign(n, 0);

    // Pass 1: Bottom-up DFS
    dfs1(0, -1);
    ans[0] = dp[0];

    // Pass 2: Top-down Rerooting
    dfs2(0, -1);

    return ans;
}`,
  python: `def sum_of_distances_in_tree(n, edges):
    adj = [[] for _ in range(n)]
    for u, v in edges:
        adj[u].append(v)
        adj[v].append(u)

    count = [1] * n
    dp = [0] * n
    ans = [0] * n

    # Pass 1: Bottom-up DFS
    def dfs1(u, p):
        for v in adj[u]:
            if v != p:
                dfs1(v, u)
                count[u] += count[v]
                dp[u] += dp[v] + count[v]

    # Pass 2: Top-down Rerooting
    def dfs2(u, p):
        for v in adj[u]:
            if v != p:
                ans[v] = ans[u] - count[v] + (n - count[v])
                dfs2(v, u)

    dfs1(0, -1)
    ans[0] = dp[0]
    dfs2(0, -1)

    return ans`,
  javascript: `function sumOfDistancesInTree(n, edges) {
    const adj = Array.from({ length: n }, () => []);
    for (const [u, v] of edges) {
        adj[u].push(v);
        adj[v].push(u);
    }

    const count = new Array(n).fill(1);
    const dp = new Array(n).fill(0);
    const ans = new Array(n).fill(0);

    // Pass 1: Bottom-up DFS
    function dfs1(u, p) {
        for (const v of adj[u]) {
            if (v !== p) {
                dfs1(v, u);
                count[u] += count[v];
                dp[u] += dp[v] + count[v];
            }
        }
    }

    // Pass 2: Top-down Rerooting
    function dfs2(u, p) {
        for (const v of adj[u]) {
            if (v !== p) {
                ans[v] = ans[u] - count[v] + (n - count[v]);
                dfs2(v, u);
            }
        }
    }

    dfs1(0, -1);
    ans[0] = dp[0];
    dfs2(0, -1);

    return ans;
}`
};

export const MAPPINGS_REROOTING = {
  cpp: {
    1: 31,
    2: 42,
    3: 43, // dfs1 caller
    4: 46,
    5: 47, // dfs2 caller
    20: [11, 12, 16, 17], // inside dfs1
    21: 25                // inside dfs2
  },
  python: {
    1: 1,
    2: 9,
    3: 26, // dfs1 caller
    4: 17,
    5: 28, // dfs2 caller
    20: [10, 11, 15, 16], // inside dfs1
    21: 21                // inside dfs2
  },
  javascript: {
    1: 1,
    2: 10,
    3: 32, // dfs1 caller
    4: 21,
    5: 34, // dfs2 caller
    20: [14, 15, 19, 20], // inside dfs1
    21: 26                // inside dfs2
  }
};
