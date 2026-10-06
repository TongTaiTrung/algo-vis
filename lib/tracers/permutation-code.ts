
export const CODE_PERMUTATION = {
  cpp: `function generate(k):
    if k == n:
        process(permutation)
        return
    for i = 1 to n:
        if not used[i]:
            used[i] = true
            permutation[k] = i
            generate(k + 1)
            used[i] = false`,
  python: `function generate(k):
    if k == n:
        process(permutation)
        return
    for i = 1 to n:
        if not used[i]:
            used[i] = true
            permutation[k] = i
            generate(k + 1)
            used[i] = false`,
  javascript: `function generate(k):
    if k == n:
        process(permutation)
        return
    for i = 1 to n:
        if not used[i]:
            used[i] = true
            permutation[k] = i
            generate(k + 1)
            used[i] = false`
};

export const MAPPINGS_PERMUTATION = {
  cpp: { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10 },
  python: { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10 },
  javascript: { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10 }
};
