const fs = require('fs');

async function testHouse() {
  const tabs = await fetch('http://127.0.0.1:9222/json').then(r => r.json());
  const tab = tabs.find(t => t.url.includes('localhost:3000'));
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
        // Find quiz-hub landmark
        const qh = window.landmarks.find(l => l.contentId === 'quiz-hub');
        if (!qh) return 'no qh';
        
        // Let's inspect objects inside qh.group
        const names = [];
        qh.group.traverse(c => {
          if (c.name) names.push(c.name);
        });
        return names;
      })()
    `,
    returnByValue: true
  });
  console.log('Quiz Hub Group Meshes:', res.result.value);
  ws.close();
}

testHouse().catch(console.error);
