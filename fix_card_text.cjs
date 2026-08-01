const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'src', 'App.jsx');
let content = fs.readFileSync(appPath, 'utf8');

// Fix ServiceCard text
content = content.replace(/isClicked \? 'text-\[#0B1B2C\]' : 'text-\[#0B1B2C\]'/g, "isClicked ? 'text-white' : 'text-white'");
content = content.replace(/className="text-\[#2A3E59\] leading-relaxed relative z-10"/g, 'className="text-gray-200 leading-relaxed relative z-10"');

// Fix WhyUs Feature card text
content = content.replace(/clickedFeature === idx \? 'text-\[#0B1B2C\]' : 'text-\[#0B1B2C\]'/g, "clickedFeature === idx ? 'text-white' : 'text-white'");
content = content.replace(/className="text-\[#2A3E59\] text-sm leading-relaxed"/g, 'className="text-gray-200 text-sm leading-relaxed"');

// Fix Portfolio card description text
content = content.replace(/text-\[#2A3E59\] text-sm mb-5 drop-shadow-sm line-clamp-2/g, 'text-gray-300 text-sm mb-5 drop-shadow-sm line-clamp-2');

// Fix Portfolio Title which might be broken? Let's make sure it's white. It's already 'text-white' as seen in the view_file.

// Also make sure 'Why Work With Us' chip in WhyUs is visible.
// Currently: className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900/30 border border-blue-500/30 rounded-full mb-4"
// The text inside was `<span className="text-blue-300 text-sm font-semibold">`.
// Since the background of the section is now `bg-stone-50`, `bg-blue-900/30` with `text-blue-300` is bad contrast.
// Let's change it to a nice blue badge for light mode.
content = content.replace(/bg-blue-900\/30 border border-blue-500\/30 rounded-full/g, 'bg-blue-50 border border-blue-200 rounded-full');
content = content.replace(/text-blue-300 text-sm font-semibold/g, 'text-blue-700 text-sm font-semibold');

// And the Sparkles icon:
content = content.replace(/<Sparkles size=\{16\} className="text-blue-400" \/>/g, '<Sparkles size={16} className="text-blue-600" />');


fs.writeFileSync(appPath, content, 'utf8');
console.log('Card and badge contrast fixed');
