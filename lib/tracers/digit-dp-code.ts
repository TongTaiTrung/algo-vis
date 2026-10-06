export const CODE_DIGIT_DP = {
  cpp: `#include <string>
#include <vector>
#include <cstring>

using namespace std;

int memo[20][200][2];

int countDigits(int pos, int sum, bool tight, const string& digits, int targetSum) {
    if (pos == (int)digits.length()) {
        return sum == targetSum ? 1 : 0;
    }
    if (memo[pos][sum][tight] != -1) {
        return memo[pos][sum][tight];
    }

    int limit = tight ? (digits[pos] - '0') : 9;
    int result = 0;

    for (int d = 0; d <= limit; d++) {
        result += countDigits(pos + 1, sum + d, tight && (d == limit), digits, targetSum);
    }

    return memo[pos][sum][tight] = result;
}`,
  python: `def count_digits(pos, current_sum, tight, digits, target_sum, memo):
    if pos == len(digits):
        return 1 if current_sum == target_sum else 0

    state = (pos, current_sum, tight)
    if state in memo:
        return memo[state]

    limit = int(digits[pos]) if tight else 9
    result = 0

    for d in range(limit + 1):
        result += count_digits(pos + 1, current_sum + d, tight and (d == limit), digits, target_sum, memo)

    memo[state] = result
    return result`,
  javascript: `function countDigits(pos, sum, tight, digits, targetSum, memo) {
    if (pos === digits.length) {
        return sum === targetSum ? 1 : 0;
    }

    const key = \`\${pos}_\${sum}_\${tight}\`;
    if (memo.has(key)) {
        return memo.get(key);
    }

    const limit = tight ? Number(digits[pos]) : 9;
    let result = 0;

    for (let d = 0; d <= limit; d++) {
        result += countDigits(pos + 1, sum + d, tight && (d === limit), digits, targetSum, memo);
    }

    memo.set(key, result);
    return result;
}`
};

export const MAPPINGS_DIGIT_DP = {
  cpp: {
    1: 9,
    2: 10,
    3: 11,
    4: 13,
    5: 14,
    6: 17,
    7: 18,
    8: 20,
    9: 21,
    10: 24,
    11: 24
  },
  python: {
    1: 1,
    2: 2,
    3: 3,
    4: 6,
    5: 7,
    6: 9,
    7: 10,
    8: 12,
    9: 13,
    10: 15,
    11: 16
  },
  javascript: {
    1: 1,
    2: 2,
    3: 3,
    4: 7,
    5: 8,
    6: 11,
    7: 12,
    8: 14,
    9: 15,
    10: 18,
    11: 19
  }
};
