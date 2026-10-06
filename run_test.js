require('ts-node').register({
  compilerOptions: { module: 'commonjs' }
});
try {
  require('tsconfig-paths/register');
} catch(e) {}
const nqueens = require('./lib/tracers/n-queens.ts');
console.log("Nqueens:", nqueens.generateTracesNQueens({N: 4}).length);
