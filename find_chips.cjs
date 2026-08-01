const fs = require('fs');
const content = fs.readFileSync('src/App.jsx', 'utf8');
const lines = content.split('\n');
lines.forEach((line, i) => {
  if (line.includes('px-') && line.includes('py-') && line.includes('bg-')) {
    console.log(`Line ${i+1}: ${line.trim()}`);
  }
});
