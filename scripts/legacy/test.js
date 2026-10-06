const n = 8;
const qRow = 2;
const qCol = 3;

// Horizontal
console.log(`M 0 ${qRow*100+50} L ${n*100} ${qRow*100+50}`);
// Vertical
console.log(`M ${qCol*100+50} 0 L ${qCol*100+50} ${n*100}`);

// Main diagonal (r - c = qRow - qCol)
// r = c + (qRow - qCol). If c=0, r = qRow - qCol. If c=N, r = N + qRow - qCol.
const mdY1 = (0 + (qRow - qCol)) * 100 + 50;
const mdX1 = 0 * 100 + 50; // no, let's just project far away.

// Since viewBox handles clipping, we can just draw lines from way outside the board, e.g. from -N*100 to 2*N*100
console.log(`M ${qCol*100+50 - 2000} ${qRow*100+50 - 2000} L ${qCol*100+50 + 2000} ${qRow*100+50 + 2000}`); // Main
console.log(`M ${qCol*100+50 - 2000} ${qRow*100+50 + 2000} L ${qCol*100+50 + 2000} ${qRow*100+50 - 2000}`); // Anti
