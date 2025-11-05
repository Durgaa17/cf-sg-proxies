// scripts/generate-data.js
const fs = require('fs');
const path = require('path');

const PROXIES_TXT = path.join(__dirname, '../proxies.txt');
const DATA_JS = path.join(__dirname, '../data.js');

function parse() {
    const content = fs.readFileSync(PROXIES_TXT, 'utf8');
    const lines = content.split('\n');
    const sg = [], my = [];
    let inSG = false, inMY = false;

    for (const line of lines) {
        const t = line.trim();
        if (t.includes('Singapore Proxies (SG)')) inSG = true, inMY = false;
        if (t.includes('Malaysia Proxies (MY)')) inMY = true, inSG = false;
        if (!t || t.startsWith('#')) continue;

        const m = t.match(/^([^:]+)\s*:\s*(\d+)\s*:\s*(SG|MY)/);
        if (!m) continue;
        const proxy = `${m[1].trim()}:${m[2]}`;
        if (m[3] === 'SG') sg.push(proxy);
        if (m[3] === 'MY') my.push(proxy);
    }

    const all = [...sg, ...my];
    const stats = {
        totalProxies: all.length,
        workingProxies: all.length,
        successRate: all.length > 0 ? 100 : 0
    };

    return { sg, my, working: all, stats, lastUpdated: new Date().toISOString() };
}

const data = parse();
const js = `\
// data.js - AUTO-GENERATED from proxies.txt
// DO NOT EDIT
// Updated: ${new Date().toUTCString()}

const proxyData = ${JSON.stringify(data, null, 4)};
if (typeof window !== 'undefined') window.proxyData = proxyData;
if (typeof module !== 'undefined') module.exports = proxyData;
`;

fs.writeFileSync(DATA_JS, js);
console.log(`Generated data.js: ${data.sg.length} SG, ${data.my.length} MY`);
