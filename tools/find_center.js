const fs = require('fs');

async function findCenter() {
  const tabs = await fetch('http://127.0.0.1:9222/json').then(r => r.json());
  const tab = tabs.find(t => t.url.includes('localhost:3000'));
  if (!tab) return;
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);
  let id = 1;
  const send = (m, p = {}) => new Promise(res => {
    const cur = id++;
    const h = e => { const d = JSON.parse(e.data); if (d.id === cur) { ws.removeEventListener('message', h); res(d.result); } };
    ws.addEventListener('message', h);
    ws.send(JSON.stringify({ id: cur, method: m, params: p }));
  });

  const res = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const heights = [];
        for (let x = -20; x <= 20; x += 5) {
          for (let z = -20; z <= 20; z += 5) {
            heights.push({ x, z, y: +window.getTerrainHeight(x, z).toFixed(2) });
          }
        }
        return { heights };
      })()
    `,
    returnByValue: true
  });
  console.log('Result:', JSON.stringify(res, null, 2));
  ws.close();
}

findCenter().catch(console.error);
