
export const CODE_COMBINATION = {
  cpp: `function generate(k, last):
    if k == C:
        process(combination)
        return
    for i = last + 1 to n:
        combination[k] = i
        generate(k + 1, i)`,
  python: `function generate(k, last):
    if k == C:
        process(combination)
        return
    for i = last + 1 to n:
        combination[k] = i
        generate(k + 1, i)`,
  javascript: `function generate(k, last):
    if k == C:
        process(combination)
        return
    for i = last + 1 to n:
        combination[k] = i
        generate(k + 1, i)`
};

export const MAPPINGS_COMBINATION = {
  cpp: { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10 },
  python: { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10 },
  javascript: { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10 }
};
