const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'src', 'App.jsx');
let content = fs.readFileSync(appPath, 'utf8');

// Fix buttons and badges with strong backgrounds
content = content.replace(/text-stone-800(?=[^"]*rounded-lg[^"]*bg-blue-600)/g, 'text-white');
content = content.replace(/text-stone-800(?=[^"]*rounded-full[^"]*bg-blue-600)/g, 'text-white');
content = content.replace(/bg-blue-600 text-stone-800/g, 'bg-blue-600 text-white');
content = content.replace(/bg-green-600 text-stone-800/g, 'bg-green-600 text-white');
content = content.replace(/from-purple-600 to-pink-600 text-stone-800/g, 'from-purple-600 to-pink-600 text-white');
content = content.replace(/from-blue-600 to-purple-600 text-stone-800/g, 'from-blue-600 to-purple-600 text-white');
content = content.replace(/bg-blue-600 hover:bg-blue-700 text-stone-800/g, 'bg-blue-600 hover:bg-blue-700 text-white');

// Fix specific hover states that were left behind
content = content.replace(/hover:bg-gray-700 text-stone-800/g, 'hover:bg-stone-100 text-stone-800');

// Fix transparent buttons on light background
content = content.replace(/bg-white\/5 backdrop-blur-sm text-stone-800 border border-stone-200 text-lg font-semibold rounded-full hover:bg-white\/10/g, 'bg-white hover:bg-stone-100 text-stone-800 border border-stone-200 text-lg font-semibold rounded-full shadow-sm');

// Fix chips (tags) to match secondary logo color (teal) or just be clean
content = content.replace(/bg-stone-100 text-stone-500/g, 'bg-teal-50 text-teal-700 border-teal-100');

// Fix main text colors to perfectly match logo Navy (#0B1B2C)
content = content.replace(/text-stone-800/g, 'text-[#0B1B2C]');
content = content.replace(/text-stone-700/g, 'text-[#1A2C42]');
content = content.replace(/text-stone-600/g, 'text-[#2A3E59]');

// Write back
fs.writeFileSync(appPath, content, 'utf8');
console.log('Colors fixed to match logo');
