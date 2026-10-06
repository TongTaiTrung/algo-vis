export const CODE_HLD = {
  cpp: `#include <vector>
#include <algorithm>

using namespace std;

vector<vector<int>> adj;
vector<int> parentNode, depth, sz, heavy, head, pos;
int curPos = 0;

void dfs1(int v, int p, int d) {
    parentNode[v] = p;
    depth[v] = d;
    sz[v] = 1;
    int maxSubtree = 0;
    for (int c : adj[v]) {
        if (c != p) {
            dfs1(c, v, d + 1);
            sz[v] += sz[c];
            if (sz[c] > maxSubtree) {
                maxSubtree = sz[c];
                heavy[v] = c;
            }
        }
    }
}

void dfs2(int v, int h) {
    head[v] = h;
    pos[v] = ++curPos;
    if (heavy[v] != -1) {
        dfs2(heavy[v], h);
    }
    for (int c : adj[v]) {
        if (c != parentNode[v] && c != heavy[v]) {
            dfs2(c, c);
        }
    }
}

void hldDecompose(int root) {
    dfs1(root, -1, 0);
    dfs2(root, root);
}

void queryPath(int u, int v) {
    while (head[u] != head[v]) {
        if (depth[head[u]] < depth[head[v]]) swap(u, v);
        // segQuery(pos[head[u]], pos[u]);
        u = parentNode[head[u]];
    }
    if (depth[u] > depth[v]) swap(u, v);
    // segQuery(pos[u], pos[v]);
}`,
  python: `def hld_decompose(n, adj, root):
    parent = [-1] * n
    depth = [0] * n
    sz = [0] * n
    heavy = [-1] * n
    head = [0] * n
    pos = [0] * n
    cur_pos = 0

    def dfs1(v, p, d):
        parent[v] = p
        depth[v] = d
        sz[v] = 1
        max_sub = 0
        for c in adj[v]:
            if c != p:
                dfs1(c, v, d + 1)
                sz[v] += sz[c]
                if sz[c] > max_sub:
                    max_sub = sz[c]
                    heavy[v] = c

    def dfs2(v, h):
        nonlocal cur_pos
        head[v] = h
        cur_pos += 1
        pos[v] = cur_pos
        if heavy[v] != -1:
            dfs2(heavy[v], h)
        for c in adj[v]:
            if c != parent[v] and c != heavy[v]:
                dfs2(c, c)

    dfs1(root, -1, 0)
    dfs2(root, root)

    def query_path(u, v):
        while head[u] != head[v]:
            if depth[head[u]] < depth[head[v]]:
                u, v = v, u
            # seg_query(pos[head[u]], pos[u])
            u = parent[head[u]]
        if depth[u] > depth[v]:
            u, v = v, u
        # seg_query(pos[u], pos[v])

    return query_path`,
  javascript: `function hldDecompose(n, adj, root) {
    const parent = new Array(n).fill(-1);
    const depth = new Array(n).fill(0);
    const sz = new Array(n).fill(0);
    const heavy = new Array(n).fill(-1);
    const head = new Array(n).fill(0);
    const pos = new Array(n).fill(0);
    let curPos = 0;

    function dfs1(v, p, d) {
        parent[v] = p;
        depth[v] = d;
        sz[v] = 1;
        let maxSub = 0;
        for (const c of adj[v]) {
            if (c !== p) {
                dfs1(c, v, d + 1);
                sz[v] += sz[c];
                if (sz[c] > maxSub) {
                    maxSub = sz[c];
                    heavy[v] = c;
                }
            }
        }
    }

    function dfs2(v, h) {
        head[v] = h;
        pos[v] = ++curPos;
        if (heavy[v] !== -1) {
            dfs2(heavy[v], h);
        }
        for (const c of adj[v]) {
            if (c !== parent[v] && c !== heavy[v]) {
                dfs2(c, c);
            }
        }
    }

    dfs1(root, -1, 0);
    dfs2(root, root);

    function queryPath(u, v) {
        while (head[u] !== head[v]) {
            if (depth[head[u]] < depth[head[v]]) {
                const tmp = u; u = v; v = tmp;
            }
            // segQuery(pos[head[u]], pos[u])
            u = parent[head[u]];
        }
        // segQuery(pos[u], pos[v])
    }

    return { queryPath };
}`
};

export const MAPPINGS_HLD = {
  cpp: {
    1: 41,
    2: 42,
    3: 43,
    4: 46,
    5: 47,
    6: 48,
    7: 49,
    8: 50,
    9: 53,
    20: [12, 13, 14], // inside dfs1 setup
    21: 22,          // inside dfs1 heavy child
    22: [29, 30]     // inside dfs2 head & pos
  },
  python: {
    1: 1,
    2: 34,
    3: 35,
    4: 37,
    5: 38,
    6: [39, 40],
    7: 41,
    8: 42,
    9: 45,
    20: [17, 18, 19],
    21: 25,
    22: [29, 31]
  },
  javascript: {
    1: 1,
    2: 40,
    3: 41,
    4: 43,
    5: 44,
    6: [45, 46],
    7: 48,
    8: 49,
    9: 51,
    20: [14, 15, 16],
    21: 23,
    22: [29, 30]
  }
};
