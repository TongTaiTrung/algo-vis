
export const CODE_BINARY_SEQUENCE = {
  cpp: `function generate(k):
    if k == n:
        process(sequence)
        return
    for iter in [0, 1]:
        sequence[k] = iter
        generate(k + 1)`,
  python: `function generate(k):
    if k == n:
        process(sequence)
        return
    for iter in [0, 1]:
        sequence[k] = iter
        generate(k + 1)`,
  javascript: `function generate(k):
    if k == n:
        process(sequence)
        return
    for iter in [0, 1]:
        sequence[k] = iter
        generate(k + 1)`
};

export const MAPPINGS_BINARY_SEQUENCE = {
  cpp: { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10 },
  python: { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10 },
  javascript: { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10 }
};
