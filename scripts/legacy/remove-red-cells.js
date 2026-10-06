const fs = require('fs');
let content = fs.readFileSync('components/visualizers/NQueens.tsx', 'utf-8');

// Replace the specific background logic for threatened squares
const target = `if (isThreatened && !hasQueen) {
                       bgClass = 'bg-rose-500/20'; 
                    }`;

if (content.includes(target)) {
    content = content.replace(target, `// if (isThreatened && !hasQueen) { bgClass = 'bg-rose-500/20'; } // Disabled per user request (lasers only)`);
    fs.writeFileSync('components/visualizers/NQueens.tsx', content, 'utf-8');
    console.log("Successfully removed red square background logic.");
} else {
    // Fallback regex if spacing differs
    content = content.replace(
        /if\s*\(\s*isThreatened\s*&&\s*!hasQueen\s*\)\s*\{\s*bgClass\s*=\s*'bg-rose-500\/20';\s*\}/g,
        "// Red background disabled per user request"
    );
    fs.writeFileSync('components/visualizers/NQueens.tsx', content, 'utf-8');
    console.log("Applied fallback regex.");
}
