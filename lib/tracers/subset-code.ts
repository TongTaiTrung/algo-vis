
export const CODE_SUBSET = {
  cpp: `function generate(last):
    process(subset)
    
    for i = last + 1 to n:
        subset.push(i)
        generate(i)
        subset.pop()`,
  python: `function generate(last):
    process(subset)
    
    for i = last + 1 to n:
        subset.push(i)
        generate(i)
        subset.pop()`,
  javascript: `function generate(last):
    process(subset)
    
    for i = last + 1 to n:
        subset.push(i)
        generate(i)
        subset.pop()`
};

export const MAPPINGS_SUBSET = {
  cpp: { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10 },
  python: { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10 },
  javascript: { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10 }
};
