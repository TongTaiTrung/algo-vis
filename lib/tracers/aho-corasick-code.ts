export const CODE_AHO_CORASICK = {
  cpp: `#include <vector>
#include <string>
#include <queue>
#include <unordered_map>
#include <iostream>

using namespace std;

struct Node {
    unordered_map<char, int> children;
    int fail = 0;
    vector<string> output;
};

vector<Node> trie;

void buildTrie(const vector<string>& patterns) {
    trie.clear();
    trie.push_back(Node());
    for (const string& pat : patterns) {
        int curr = 0;
        for (char ch : pat) {
            if (!trie[curr].children.count(ch)) {
                trie[curr].children[ch] = trie.size();
                trie.push_back(Node());
            }
            curr = trie[curr].children[ch];
        }
        trie[curr].output.push_back(pat);
    }
}

void buildFailLinks() {
    queue<int> q;
    for (auto& [ch, nxt] : trie[0].children) {
        trie[nxt].fail = 0;
        q.push(nxt);
    }
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        for (auto& [ch, v] : trie[u].children) {
            int f = trie[u].fail;
            while (f > 0 && !trie[f].children.count(ch)) {
                f = trie[f].fail;
            }
            if (trie[f].children.count(ch)) {
                trie[v].fail = trie[f].children[ch];
            } else {
                trie[v].fail = 0;
            }
            for (const auto& out : trie[trie[v].fail].output) {
                trie[v].output.push_back(out);
            }
            q.push(v);
        }
    }
}

void ahoCorasick(const vector<string>& patterns, const string& text) {
    buildTrie(patterns);
    buildFailLinks();
    int curr = 0;

    for (int i = 0; i < (int)text.length(); i++) {
        char ch = text[i];
        while (curr > 0 && !trie[curr].children.count(ch)) {
            curr = trie[curr].fail;
        }
        if (trie[curr].children.count(ch)) {
            curr = trie[curr].children[ch];
        } else {
            curr = 0;
        }
        for (const string& match : trie[curr].output) {
            cout << "Match " << match << " ending at " << i << "\\n";
        }
    }
}`,
  python: `from collections import deque

class Node:
    def __init__(self):
        self.children = {}
        self.fail = 0
        self.output = []

def aho_corasick(patterns, text):
    trie = [Node()]

    # 1. Build Trie
    for pat in patterns:
        curr = 0
        for ch in pat:
            if ch not in trie[curr].children:
                trie[curr].children[ch] = len(trie)
                trie.append(Node())
            curr = trie[curr].children[ch]
        trie[curr].output.append(pat)

    # 2. Build Fail Links
    q = deque()
    for ch, nxt in trie[0].children.items():
        trie[nxt].fail = 0
        q.append(nxt)

    while q:
        u = q.popleft()
        for ch, v in trie[u].children.items():
            f = trie[u].fail
            while f > 0 and ch not in trie[f].children:
                f = trie[f].fail
            trie[v].fail = trie[f].children.get(ch, 0)
            trie[v].output.extend(trie[trie[v].fail].output)
            q.append(v)

    # 3. Search text
    curr = 0
    matches = []
    for i, ch in enumerate(text):
        while curr > 0 and ch not in trie[curr].children:
            curr = trie[curr].fail
        curr = trie[curr].children.get(ch, 0)
        for pat in trie[curr].output:
            matches.append((pat, i - len(pat) + 1))

    return matches`,
  javascript: `function ahoCorasick(patterns, text) {
    const trie = [{ children: {}, fail: 0, output: [] }];

    // 1. Build Trie
    for (const pat of patterns) {
        let curr = 0;
        for (const ch of pat) {
            if (!(ch in trie[curr].children)) {
                trie[curr].children[ch] = trie.length;
                trie.push({ children: {}, fail: 0, output: [] });
            }
            curr = trie[curr].children[ch];
        }
        trie[curr].output.push(pat);
    }

    // 2. Build Fail Links (BFS)
    const queue = [];
    for (const ch in trie[0].children) {
        const nxt = trie[0].children[ch];
        trie[nxt].fail = 0;
        queue.push(nxt);
    }

    while (queue.length > 0) {
        const u = queue.shift();
        for (const ch in trie[u].children) {
            const v = trie[u].children[ch];
            let f = trie[u].fail;
            while (f > 0 && !(ch in trie[f].children)) {
                f = trie[f].fail;
            }
            trie[v].fail = (ch in trie[f].children) ? trie[f].children[ch] : 0;
            trie[v].output.push(...trie[trie[v].fail].output);
            queue.push(v);
        }
    }

    // 3. Search Text
    let curr = 0;
    const matches = [];
    for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        while (curr > 0 && !(ch in trie[curr].children)) {
            curr = trie[curr].fail;
        }
        curr = (ch in trie[curr].children) ? trie[curr].children[ch] : 0;
        for (const pat of trie[curr].output) {
            matches.push({ pattern: pat, index: i - pat.length + 1 });
        }
    }
    return matches;
}`
};

export const MAPPINGS_AHO_CORASICK = {
  cpp: {
    1: 61,
    2: 62,
    3: 63,
    4: 64,
    5: 66,
    6: 68,
    7: 69,
    8: [71, 72, 73, 74, 75],
    9: [76, 77, 78],
    20: [19, 20, 21], // inside buildTrie
    21: [35, 36, 40]  // inside buildFailLinks
  },
  python: {
    1: 8,
    2: 12,
    3: 22,
    4: 38,
    5: 40,
    6: 41,
    7: 42,
    8: 43,
    9: [44, 45],
    20: [12, 13, 14], // inside build_trie
    21: [22, 23, 27]  // inside build_fail_links
  },
  javascript: {
    1: 1,
    2: 5,
    3: 18,
    4: 39,
    5: 41,
    6: 43,
    7: 44,
    8: 46,
    9: [47, 48, 49],
    20: [5, 6, 7],    // inside buildTrie
    21: [18, 19, 25]  // inside buildFailLinks
  }
};
