export const CODE_DIJKSTRA = {
  cpp: `#include <vector>
#include <queue>
#include <unordered_map>

using namespace std;

pair<vector<int>, vector<int>> dijkstra(int n, const vector<vector<pair<int, int>>>& adj, int source) {
    const int INF = 1e9;
    vector<int> distances(n, INF);
    vector<int> previous(n, -1);
    vector<bool> visited(n, false);
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;

    distances[source] = 0;
    pq.push({0, source});

    while (!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop();

        if (visited[u]) continue;
        visited[u] = true;

        for (auto& edge : adj[u]) {
            int v = edge.first;
            int weight = edge.second;
            int alt = distances[u] + weight;
            if (alt < distances[v]) {
                distances[v] = alt;
                previous[v] = u;
                pq.push({alt, v});
            }
        }
    }
    return {distances, previous};
}`,
  python: `import heapq

def dijkstra(n, adj, source):
    INF = float('inf')
    distances = [INF] * n
    previous = [-1] * n
    visited = [False] * n
    pq = []

    distances[source] = 0
    heapq.heappush(pq, (0, source))

    while pq:
        d, u = heapq.heappop(pq)

        if visited[u]:
            continue
        visited[u] = True

        for v, weight in adj[u]:
            alt = distances[u] + weight
            if alt < distances[v]:
                distances[v] = alt
                previous[v] = u
                heapq.heappush(pq, (alt, v))

    return distances, previous`,
  javascript: `function dijkstra(n, adj, source) {
    const INF = Infinity;
    const distances = new Array(n).fill(INF);
    const previous = new Array(n).fill(-1);
    const visited = new Array(n).fill(false);
    const pq = []; // Min-Priority Queue [dist, u]

    distances[source] = 0;
    pq.push([0, source]);

    while (pq.length > 0) {
        pq.sort((a, b) => a[0] - b[0]);
        const [d, u] = pq.shift();

        if (visited[u]) continue;
        visited[u] = true;

        for (const [v, weight] of adj[u]) {
            const alt = distances[u] + weight;
            if (alt < distances[v]) {
                distances[v] = alt;
                previous[v] = u;
                pq.push([alt, v]);
            }
        }
    }
    return { distances, previous };
}`
};

export const MAPPINGS_DIJKSTRA = {
  cpp: {
    1: 7,
    2: [9, 10, 11, 12],
    3: 14,
    4: 15,
    5: 17,
    6: [18, 19],
    7: 21,
    8: 22,
    9: 24,
    10: 27,
    11: 28,
    12: 29,
    13: 30,
    14: 31,
    15: 35
  },
  python: {
    1: 3,
    2: [5, 6, 7, 8],
    3: 10,
    4: 11,
    5: 13,
    6: 14,
    7: [16, 17],
    8: 18,
    9: 20,
    10: 21,
    11: 22,
    12: 23,
    13: 24,
    14: 25,
    15: 27
  },
  javascript: {
    1: 1,
    2: [3, 4, 5, 6],
    3: 8,
    4: 9,
    5: 11,
    6: [12, 13],
    7: 15,
    8: 16,
    9: 18,
    10: 19,
    11: 20,
    12: 21,
    13: 22,
    14: 23,
    15: 27
  }
};
