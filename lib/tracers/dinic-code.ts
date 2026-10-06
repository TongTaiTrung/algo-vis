export const CODE_DINIC = {
  cpp: `#include <vector>
#include <queue>
#include <algorithm>

using namespace std;

struct Edge {
    int to;
    int cap;
    int flow;
    int rev;
};

class Dinic {
    int n, s, t;
    vector<vector<Edge>> adj;
    vector<int> level, ptr;

public:
    Dinic(int n, int s, int t) : n(n), s(s), t(t), adj(n), level(n), ptr(n) {}

    void addEdge(int from, int to, int cap) {
        adj[from].push_back({to, cap, 0, (int)adj[to].size()});
        adj[to].push_back({from, 0, 0, (int)adj[from].size() - 1});
    }

    bool bfs() {
        fill(level.begin(), level.end(), -1);
        level[s] = 0;
        queue<int> q;
        q.push(s);
        while (!q.empty()) {
            int u = q.front();
            q.pop();
            for (const auto& edge : adj[u]) {
                if (edge.cap - edge.flow > 0 && level[edge.to] == -1) {
                    level[edge.to] = level[u] + 1;
                    q.push(edge.to);
                }
            }
        }
        return level[t] != -1;
    }

    int dfs(int u, int pushed) {
        if (pushed == 0 || u == t) return pushed;
        for (int& cid = ptr[u]; cid < (int)adj[u].size(); ++cid) {
            auto& edge = adj[u][cid];
            int trg = edge.to;
            if (level[u] + 1 != level[trg] || edge.cap - edge.flow == 0) continue;
            int tr = dfs(trg, min(pushed, edge.cap - edge.flow));
            if (tr == 0) continue;
            edge.flow += tr;
            adj[trg][edge.rev].flow -= tr;
            return tr;
        }
        return 0;
    }

    int maxFlow() {
        int flow = 0;
        while (bfs()) {
            fill(ptr.begin(), ptr.end(), 0);
            while (int pushed = dfs(s, 1e9)) {
                flow += pushed;
            }
        }
        return flow;
    }
};`,
  python: `from collections import deque

class Edge:
    def __init__(self, to, cap, rev):
        self.to = to
        self.cap = cap
        self.flow = 0
        self.rev = rev

class Dinic:
    def __init__(self, n, s, t):
        self.n = n
        self.s = s
        self.t = t
        self.adj = [[] for _ in range(n)]
        self.level = [-1] * n
        self.ptr = [0] * n

    def add_edge(self, u, v, cap):
        self.adj[u].append(Edge(v, cap, len(self.adj[v])))
        self.adj[v].append(Edge(u, 0, len(self.adj[u]) - 1))

    def bfs(self):
        self.level = [-1] * self.n
        self.level[self.s] = 0
        q = deque([self.s])
        while q:
            u = q.popleft()
            for edge in self.adj[u]:
                if edge.cap - edge.flow > 0 and self.level[edge.to] == -1:
                    self.level[edge.to] = self.level[u] + 1
                    q.append(edge.to)
        return self.level[self.t] != -1

    def dfs(self, u, pushed):
        if pushed == 0 or u == self.t:
            return pushed
        while self.ptr[u] < len(self.adj[u]):
            edge = self.adj[u][self.ptr[u]]
            trg = edge.to
            if self.level[u] + 1 == self.level[trg] and edge.cap - edge.flow > 0:
                tr = self.dfs(trg, min(pushed, edge.cap - edge.flow))
                if tr > 0:
                    edge.flow += tr
                    self.adj[trg][edge.rev].flow -= tr
                    return tr
            self.ptr[u] += 1
        return 0

    def max_flow(self):
        flow = 0
        while self.bfs():
            self.ptr = [0] * self.n
            while True:
                pushed = self.dfs(self.s, float('inf'))
                if pushed == 0:
                    break
                flow += pushed
        return flow`,
  javascript: `class Dinic {
    constructor(n, s, t) {
        this.n = n;
        this.s = s;
        this.t = t;
        this.adj = Array.from({ length: n }, () => []);
        this.level = new Array(n).fill(-1);
        this.ptr = new Array(n).fill(0);
    }

    addEdge(u, v, cap) {
        this.adj[u].push({ to: v, cap, flow: 0, rev: this.adj[v].length });
        this.adj[v].push({ to: u, cap: 0, flow: 0, rev: this.adj[u].length - 1 });
    }

    bfs() {
        this.level.fill(-1);
        this.level[this.s] = 0;
        const q = [this.s];
        while (q.length > 0) {
            const u = q.shift();
            for (const edge of this.adj[u]) {
                if (edge.cap - edge.flow > 0 && this.level[edge.to] === -1) {
                    this.level[edge.to] = this.level[u] + 1;
                    q.push(edge.to);
                }
            }
        }
        return this.level[this.t] !== -1;
    }

    dfs(u, pushed) {
        if (pushed === 0 || u === this.t) return pushed;
        for (; this.ptr[u] < this.adj[u].length; this.ptr[u]++) {
            const edge = this.adj[u][this.ptr[u]];
            const trg = edge.to;
            if (this.level[u] + 1 === this.level[trg] && edge.cap - edge.flow > 0) {
                const tr = this.dfs(trg, Math.min(pushed, edge.cap - edge.flow));
                if (tr > 0) {
                    edge.flow += tr;
                    this.adj[trg][edge.rev].flow -= tr;
                    return tr;
                }
            }
        }
        return 0;
    }

    maxFlow() {
        let flow = 0;
        while (this.bfs()) {
            this.ptr.fill(0);
            let pushed = 0;
            while ((pushed = this.dfs(this.s, Infinity)) > 0) {
                flow += pushed;
            }
        }
        return flow;
    }
}`
};

export const MAPPINGS_DINIC = {
  cpp: {
    1: 60,
    2: 61,
    3: 62, // while (bfs())
    4: 64, // while (int pushed = dfs(s, 1e9))
    5: 65, // flow += pushed
    6: 68,
    10: [28, 29, 31],    // bfs() init queue
    11: 33,              // bfs() pop u
    12: [36, 37, 38],    // bfs() update level & push
    13: 42,              // bfs() return level[t] != -1
    20: 46,              // dfs() base check
    21: [50, 51],        // dfs() edge check & recursive dfs
    22: [53, 54]         // dfs() augment flow
  },
  python: {
    1: 50,
    2: 51,
    3: 52, // while self.bfs():
    4: 55, // pushed = self.dfs(...)
    5: 58, // flow += pushed
    6: 59,
    10: [24, 25, 26],    // bfs() init queue
    11: 28,              // bfs() pop u
    12: [30, 31, 32],    // bfs() update level & append
    13: 33,              // bfs() return
    20: 36,              // dfs() base check
    21: [41, 42],        // dfs() edge check & recursive dfs
    22: [44, 45]         // dfs() augment flow
  },
  javascript: {
    1: 49,
    2: 50,
    3: 51, // while (this.bfs())
    4: 54, // while (pushed = this.dfs(...))
    5: 55, // flow += pushed
    6: 58,
    10: [17, 18, 19],    // bfs() init queue
    11: 21,              // bfs() pop u
    12: [23, 24, 25],    // bfs() update level & push
    13: 29,              // bfs() return
    20: 33,              // dfs() base check
    21: [37, 38],        // dfs() edge check & recursive dfs
    22: 40               // dfs() augment flow
  }
};
