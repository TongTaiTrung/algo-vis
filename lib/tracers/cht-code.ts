export const CODE_CHT = {
  cpp: `#include <vector>
#include <algorithm>

using namespace std;

struct Line {
    long long m, c;
    long long eval(long long x) const { return m * x + c; }
};

double intersect(const Line& l1, const Line& l2) {
    return (double)(l2.c - l1.c) / (l1.m - l2.m);
}

class ConvexHullTrick {
    vector<Line> hull;
public:
    void insert(long long m, long long c) {
        Line newLine{m, c};
        while (hull.size() >= 2 &&
               intersect(hull.back(), newLine) <= intersect(hull[hull.size() - 2], hull.back())) {
            hull.pop_back();
        }
        hull.push_back(newLine);
    }

    long long query(long long x) {
        int l = 0, r = (int)hull.size() - 1;
        long long ans = hull[0].eval(x);
        while (l <= r) {
            int mid = l + (r - l) / 2;
            ans = min(ans, hull[mid].eval(x));
            if (mid + 1 < (int)hull.size() && hull[mid + 1].eval(x) < hull[mid].eval(x)) {
                l = mid + 1;
            } else {
                r = mid - 1;
            }
        }
        return ans;
    }
};`,
  python: `class Line:
    def __init__(self, m, c):
        self.m = m
        self.c = c

    def eval(self, x):
        return self.m * x + self.c

def intersect(l1, l2):
    return (l2.c - l1.c) / (l1.m - l2.m)

class ConvexHullTrick:
    def __init__(self):
        self.hull = []

    def insert(self, m, c):
        new_line = Line(m, c)
        while len(self.hull) >= 2 and intersect(self.hull[-1], new_line) <= intersect(self.hull[-2], self.hull[-1]):
            self.hull.pop()
        self.hull.append(new_line)

    def query(self, x):
        l, r = 0, len(self.hull) - 1
        ans = self.hull[0].eval(x)
        while l <= r:
            mid = (l + r) // 2
            ans = min(ans, self.hull[mid].eval(x))
            if mid + 1 < len(self.hull) and self.hull[mid + 1].eval(x) < self.hull[mid].eval(x):
                l = mid + 1
            else:
                r = mid - 1
        return ans`,
  javascript: `class ConvexHullTrick {
    constructor() {
        this.hull = [];
    }

    intersect(l1, l2) {
        return (l2.c - l1.c) / (l1.m - l2.m);
    }

    insert(m, c) {
        const newLine = { m, c };
        while (this.hull.length >= 2 &&
               this.intersect(this.hull[this.hull.length - 1], newLine) <=
               this.intersect(this.hull[this.hull.length - 2], this.hull[this.hull.length - 1])) {
            this.hull.pop();
        }
        this.hull.push(newLine);
    }

    query(x) {
        let l = 0, r = this.hull.length - 1;
        let ans = this.hull[0].m * x + this.hull[0].c;
        while (l <= r) {
            const mid = Math.floor((l + r) / 2);
            const val = this.hull[mid].m * x + this.hull[mid].c;
            ans = Math.min(ans, val);
            if (mid + 1 < this.hull.length &&
                this.hull[mid + 1].m * x + this.hull[mid + 1].c < val) {
                l = mid + 1;
            } else {
                r = mid - 1;
            }
        }
        return ans;
    }
}`
};

export const MAPPINGS_CHT = {
  cpp: {
    1: 18,
    2: 20,
    3: 22,
    4: 24,
    5: 27,
    6: 28,
    20: 14 // inside intersect
  },
  python: {
    1: 15,
    2: 17,
    3: 18,
    4: 19,
    5: 21,
    6: 22,
    20: 4  // inside intersect (l2.c - l1.c) / (l1.m - l2.m)
  },
  javascript: {
    1: 10,
    2: 12,
    3: 15,
    4: 17,
    5: 20,
    6: 21,
    20: 7  // inside intersect
  }
};
