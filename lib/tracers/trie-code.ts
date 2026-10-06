export const CODE_TRIE = {
  cpp: `#include <string>
#include <vector>

using namespace std;

class TrieNode {
public:
    TrieNode* children[26];
    bool isEndOfWord;
    TrieNode() {
        isEndOfWord = false;
        for (int i = 0; i < 26; i++) {
            children[i] = nullptr;
        }
    }
};

class Trie {
    TrieNode* root;
public:
    Trie() {
        root = new TrieNode();
    }
    
    void insert(string word) {
        TrieNode* curr = root;
        for (char c : word) {
            int idx = c - 'a';
            if (curr->children[idx] == nullptr) {
                curr->children[idx] = new TrieNode();
            }
            curr = curr->children[idx];
        }
        curr->isEndOfWord = true;
    }
    
    bool search(string word) {
        TrieNode* curr = root;
        for (char c : word) {
            int idx = c - 'a';
            if (curr->children[idx] == nullptr) {
                return false;
            }
            curr = curr->children[idx];
        }
        return curr->isEndOfWord;
    }
    
    bool startsWith(string prefix) {
        TrieNode* curr = root;
        for (char c : prefix) {
            int idx = c - 'a';
            if (curr->children[idx] == nullptr) {
                return false;
            }
            curr = curr->children[idx];
        }
        return true;
    }
};`,
  python: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.isEndOfWord = False

class Trie:
    def __init__(self):
        self.root = TrieNode()
        
    def insert(self, word: str) -> None:
        curr = self.root
        for char in word:
            if char not in curr.children:
                curr.children[char] = TrieNode()
            curr = curr.children[char]
        curr.isEndOfWord = True
        
    def search(self, word: str) -> bool:
        curr = self.root
        for char in word:
            if char not in curr.children:
                return False
            curr = curr.children[char]
        return curr.isEndOfWord
        
    def startsWith(self, prefix: str) -> bool:
        curr = self.root
        for char in prefix:
            if char not in curr.children:
                return False
            curr = curr.children[char]
        return True`,
  javascript: `class TrieNode {
    constructor() {
        this.children = {};
        this.isEndOfWord = false;
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    insert(word) {
        let curr = this.root;
        for (const char of word) {
            if (!(char in curr.children)) {
                curr.children[char] = new TrieNode();
            }
            curr = curr.children[char];
        }
        curr.isEndOfWord = true;
    }

    search(word) {
        let curr = this.root;
        for (const char of word) {
            if (!(char in curr.children)) {
                return false;
            }
            curr = curr.children[char];
        }
        return curr.isEndOfWord;
    }

    startsWith(prefix) {
        let curr = this.root;
        for (const char of prefix) {
            if (!(char in curr.children)) {
                return false;
            }
            curr = curr.children[char];
        }
        return true;
    }
}`
};

export const MAPPINGS_TRIE = {
  cpp: {
    1: 22,
    5: 25,
    7: 29,
    8: 30,
    10: 33,
    11: 35,
    13: 38,
    14: 39,
    16: 42,
    17: 43,
    18: 46,
    20: 49,
    21: 50,
    23: 53,
    25: 56,
    26: 57
  },
  python: {
    1: 8,
    5: 11,
    7: 13,
    8: 14,
    10: 15,
    11: 16,
    13: 19,
    14: 20,
    16: 22,
    17: 23,
    18: 24,
    20: 27,
    21: 28,
    23: 30,
    25: 31,
    26: 32
  },
  javascript: {
    1: 9,
    5: 13,
    7: 15,
    8: 16,
    10: 18,
    11: 20,
    13: 24,
    14: 25,
    16: 27,
    17: 29,
    18: 31,
    20: 35,
    21: 36,
    23: 38,
    25: 40,
    26: 41
  }
};
