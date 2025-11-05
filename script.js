const PROXIES_URL = 'https://raw.githubusercontent.com/Durgaa17/cf-sg-proxies/refs/heads/main/proxies.txt';
const proxyList = document.getElementById('proxy-list');
const updatedSpan = document.getElementById('updated').querySelector('span');
const sgCountEl = document.getElementById('sg-count');
const myCountEl = document.getElementById('my-count');
const totalCountEl = document.getElementById('total-count');

let proxies = [];
let updatedTime = 'Unknown';

async function fetchProxies() {
  try {
    const response = await fetch(PROXIES_URL);
    const text = await response.text();
    parseProxies(text);
  } catch (err) {
    proxyList.innerHTML = `<div class="loading">Failed to load proxies. Check internet or URL.</div>`;
    console.error(err);
  }
}

function parseProxies(text) {
  const lines = text.split('\n');
  const proxyData = [];
  let sgCount = 0, myCount = 0;

  lines.forEach(line => {
    line = line.trim();
    if (!line) return;

    if (line.startsWith('# Updated:')) {
      updatedTime = line.replace('# Updated:', '').trim();
    } else if (line.includes(':')) {
      const parts = line.split(' : ');
      if (parts.length === 4) {
        const [ip, port, country, provider] = parts;
        proxyData.push({ ip, port: parseInt(port), country, provider: provider.trim() });
        if (country === 'SG') sgCount++;
        if (country === 'MY') myCount++;
      }
    }
  });

  proxies = proxyData;
  updatedSpan.textContent = updatedTime;
  sgCountEl.textContent = sgCount;
  myCountEl.textContent = myCount;
  totalCountEl.textContent = proxyData.length;

  renderProxies();
}

function renderProxies() {
  if (proxies.length === 0) {
    proxyList.innerHTML = `<div class="loading">No proxies found.</div>`;
    return;
  }

  proxyList.innerHTML = proxies.map(proxy => `
    <div class="proxy-card">
      <div class="proxy-info">
        <div class="proxy-ip">${proxy.ip}:${proxy.port}</div>
        <span class="tag ${proxy.country.toLowerCase()}">${proxy.country}</span>
        <span class="provider">${escapeHtml(proxy.provider)}</span>
      </div>
      <div class="actions">
        <button class="copy-btn" onclick="copyProxy('${proxy.ip}:${proxy.port}')">Copy</button>
        <button class="check-btn" onclick="checkLatency(this, '${proxy.ip}', ${proxy.port})">Check</button>
        <span class="result">—</span>
      </div>
    </div>
  `).join('');
}

function copyProxy(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert(`Copied: ${text}`);
  }).catch(() => {
    prompt('Copy this:', text);
  });
}

async function checkLatency(button, ip, port) {
  const resultEl = button.parentElement.querySelector('.result');
  button.disabled = true;
  resultEl.textContent = 'Testing...';
  resultEl.style.color = '#f39c12';

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 7000);

  const startTime = performance.now();

  try {
    const response = await fetch('http://httpbin.org/get', {
      signal: controller.signal,
      cache: 'no-store'
    });

    clearTimeout(timeoutId);
    const endTime = performance.now();
    const latency = Math.round(endTime - startTime);

    if (response.ok) {
      resultEl.textContent = `${latency}ms`;
      resultEl.style.color = '#27ae60';
    } else {
      throw new Error('Bad response');
    }
  } catch (err) {
    clearTimeout(timeoutId);
    resultEl.textContent = 'Failed';
    resultEl.style.color = '#e74c3c';
    resultEl.title = 'Set browser proxy to this IP:Port first';
  } finally {
    button.disabled = false;
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Start
fetchProxies();
