const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'src', 'App.jsx');
let content = fs.readFileSync(appPath, 'utf8');

// Global Replacements
content = content.replace(/bg-gray-950/g, 'bg-stone-50');
content = content.replace(/bg-gray-900\/90/g, 'bg-white/80'); // Dock
content = content.replace(/bg-gray-900\/95/g, 'bg-white/95'); // Tooltips
content = content.replace(/bg-gray-900/g, 'bg-stone-100');
content = content.replace(/bg-gray-800\/50/g, 'bg-white/50');
content = content.replace(/bg-gray-800/g, 'bg-white');
content = content.replace(/bg-black/g, 'bg-stone-50');

// Text Colors
content = content.replace(/text-white/g, 'text-stone-800');
content = content.replace(/text-gray-200/g, 'text-stone-600');
content = content.replace(/text-gray-300/g, 'text-stone-500');
content = content.replace(/text-gray-400/g, 'text-stone-500');
content = content.replace(/text-gray-500/g, 'text-stone-400');
content = content.replace(/text-gray-600/g, 'text-stone-400');

// Borders
content = content.replace(/border-gray-900/g, 'border-stone-200');
content = content.replace(/border-gray-800/g, 'border-stone-200');
content = content.replace(/border-gray-700\/50/g, 'border-stone-200');
content = content.replace(/border-gray-700/g, 'border-stone-200');
content = content.replace(/border-white\/10/g, 'border-stone-200');
content = content.replace(/border-white\/20/g, 'border-stone-200');
content = content.replace(/border-white/g, 'border-stone-300'); // for clicked states

// specific dark gradients to light
content = content.replace(/from-gray-900 via-gray-950 to-black/g, 'from-stone-50 via-stone-100 to-stone-50');
content = content.replace(/from-black\/60 via-black\/70 to-black\/80/g, 'from-black/20 via-black/40 to-black/60'); // keep image overlays a bit dark but softer
content = content.replace(/from-black\/70 via-black\/80 to-black\/90/g, 'from-black/30 via-black/50 to-black/70');
content = content.replace(/bg-gradient-to-b from-gray-900 to-black/g, 'bg-gradient-to-b from-stone-100 to-stone-50'); // About section

// Shadow fixes
content = content.replace(/shadow-\[0_0_20px_rgba\(255,255,255,0\.2\)\]/g, 'shadow-[0_8px_30px_rgb(0,0,0,0.08)]');
content = content.replace(/shadow-\[0_0_30px_rgba\(255,255,255,0\.3\)\]/g, 'shadow-[0_8px_30px_rgb(0,0,0,0.12)]');
content = content.replace(/ring-white/g, 'ring-blue-400');

// Scrollbar inline styles fix in App.jsx
content = content.replace(/background: #111827/g, 'background: #f5f5f4'); // stone-100
content = content.replace(/background: #374151/g, 'background: #d6d3d1'); // stone-300
content = content.replace(/background: #4B5563/g, 'background: #a8a29e'); // stone-400
content = content.replace(/bg-gray-900/g, 'bg-stone-50'); // for the root div

// Modals/Overlays
content = content.replace(/bg-black\/80/g, 'bg-stone-900/40');

fs.writeFileSync(appPath, content, 'utf8');
console.log('App.jsx updated for Light Theme');
