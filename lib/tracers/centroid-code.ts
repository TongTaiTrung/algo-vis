export const CODE_CENTROID = {
  cpp: `#include <vector>

using namespace std;

vector<vector<int>> adj, centroidTree;
vector<int> sz, level;
vector<bool> isRemoved;

void getSizes(int u, int p) {
    sz[u] = 1;
    for (int v : adj[u]) {
        if (v != p && !isRemoved[v]) {
            getSizes(v, u);
            sz[u] += sz[v];
        }
    }
}

int getCentroid(int u, int p, int total) {
    for (int v : adj[u]) {
        if (v != p && !isRemoved[v] && sz[v] > total / 2) {
            return getCentroid(v, u, total);
        }
    }
    return u;
}

void solve(int entry, int parentCentroid, int currentLevel) {
    getSizes(entry, -1);
    int total = sz[entry];
    int centroid = getCentroid(entry, -1, total);

    isRemoved[centroid] = true;
    level[centroid] = currentLevel;

    if (parentCentroid != -1) {
        centroidTree[parentCentroid].push_back(centroid);
    }

    for (int v : adj[centroid]) {
        if (!isRemoved[v]) {
            solve(v, centroid, currentLevel + 1);
        }
    }
}`,
  python: `def decompose(n, adj):
    sz = [0] * n
    is_removed = [False] * n
    centroid_tree = [[] for _ in range(n)]
    levels = [0] * n

    def get_sizes(u, p):
        sz[u] = 1
        for v in adj[u]:
            if v != p and not is_removed[v]:
                get_sizes(v, u)
                sz[u] += sz[v]

    def get_centroid(u, p, total):
        for v in adj[u]:
            if v != p and not is_removed[v] and sz[v] > total // 2:
                return get_centroid(v, u, total)
        return u

    def solve(entry, parent_centroid, level):
        get_sizes(entry, -1)
        total = sz[entry]
        centroid = get_centroid(entry, -1, total)

        is_removed[centroid] = True
        levels[centroid] = level

        if parent_centroid != -1:
            centroid_tree[parent_centroid].append(centroid)

        for v in adj[centroid]:
            if not is_removed[v]:
                solve(v, centroid, level + 1)

    solve(0, -1, 0)
    return centroid_tree, levels`,
  javascript: `function centroidDecomposition(n, adj) {
    const sz = new Array(n).fill(0);
    const isRemoved = new Array(n).fill(false);
    const centroidTree = Array.from({ length: n }, () => []);
    const levels = new Array(n).fill(0);

    function getSizes(u, p) {
        sz[u] = 1;
        for (const v of adj[u]) {
            if (v !== p && !isRemoved[v]) {
                getSizes(v, u);
                sz[u] += sz[v];
            }
        }
    }

    function getCentroid(u, p, total) {
        for (const v of adj[u]) {
            if (v !== p && !isRemoved[v] && sz[v] > Math.floor(total / 2)) {
                return getCentroid(v, u, total);
            }
        }
        return u;
    }

    function solve(entry, parentCentroid, level) {
        getSizes(entry, -1);
        const total = sz[entry];
        const centroid = getCentroid(entry, -1, total);

        isRemoved[centroid] = true;
        levels[centroid] = level;

        if (parentCentroid !== -1) {
            centroidTree[parentCentroid].push(centroid);
        }

        for (const v of adj[centroid]) {
            if (!isRemoved[v]) {
                solve(v, centroid, level + 1);
            }
        }
    }

    solve(0, -1, 0);
    return { centroidTree, levels };
}`
};

export const MAPPINGS_CENTROID = {
  cpp: {
    1: 29,
    2: 30, // getSizes caller
    3: 31,
    4: 32, // getCentroid caller
    5: 34,
    6: 35,
    7: 37,
    8: 38,
    9: 41,
    10: 42,
    11: 43, // solve recursive caller
    20: 11, // getSizes sz[u] = 1
    21: 15, // getSizes sz[u] += sz[v]
    22: 22, // getCentroid check
    23: 26  // getCentroid return
  },
  python: {
    1: 66,
    2: 67, // get_sizes caller
    3: 68,
    4: 69, // get_centroid caller
    5: 71,
    6: 72,
    7: 74,
    8: 75,
    9: 77,
    10: 78,
    11: 79, // solve recursive caller
    20: 54,
    21: 58,
    22: 62,
    23: 64
  },
  javascript: {
    1: 25,
    2: 26, // getSizes caller
    3: 27,
    4: 28, // getCentroid caller
    5: 30,
    6: 31,
    7: 33,
    8: 34,
    9: 37,
    10: 38,
    11: 39, // solve recursive caller
    20: 8,
    21: 12,
    22: 19,
    23: 22
  }
};
