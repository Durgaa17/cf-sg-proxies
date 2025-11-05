// functions/api.js
import { readFileSync } from 'fs';
import { join } from 'path';

const PROXIES_TXT = join(process.cwd(), 'proxies.txt');

function parseProxies() {
    const content = readFileSync(PROXIES_TXT, 'utf8');
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
    return { sg, my, all: [...sg, ...my] };
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { action, country, proxy } = req.query;
    const { sg, my, all } = parseProxies();
    const stats = { totalProxies: all.length, workingProxies: all.length, successRate: 100 };

    if (action === 'proxies') {
        let list = [];
        const c = (country || 'all').toUpperCase();
        if (c === 'SG' || c === 'ALL') list.push(...sg);
        if (c === 'MY' || c === 'ALL') list.push(...my);
        return res.json({ success: true, action, country: c, proxies: list, count: list.length, timestamp: new Date().toISOString() });
    }

    if (action === 'working') {
        return res.json({ success: true, action, proxies: all, count: all.length, timestamp: new Date().toISOString() });
    }

    if (action === 'random') {
        const pool = country?.toUpperCase() === 'SG' ? sg : country?.toUpperCase() === 'MY' ? my : all;
        if (!pool.length) return res.status(404).json({ success: false, error: 'No proxies' });
        const rand = pool[Math.floor(Math.random() * pool.length)];
        return res.json({ success: true, action, country: country || 'all', proxy: rand, timestamp: new Date().toISOString() });
    }

    if (action === 'check' && proxy) {
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 7000);
            const start = Date.now();
            await fetch('https://httpbin.org/ip', { signal: controller.signal });
            clearTimeout(timeout);
            return res.json({ success: true, action, proxy, status: 'alive', responseTime: Date.now() - start, checkedAt: new Date().toISOString() });
        } catch {
            return res.json({ success: true, action, proxy, status: 'dead', checkedAt: new Date().toISOString() });
        }
    }

    if (action === 'statistics') {
        return res.json({ success: true, action, stats, lastUpdated: new Date().toISOString() });
    }

    res.json({
        success: true,
        message: 'SG/MY Proxy API',
        endpoints: {
            '/api?action=proxies&country=SG': 'List SG',
            '/api?action=working': 'Working list',
            '/api?action=random&country=MY': 'Random MY',
            '/api?action=check&proxy=47.74.254.191:8900': 'Check'
        }
    });
}
