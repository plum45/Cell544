async function findHouse() {
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
        try {
          const qh = window.landmarks.find(l => l.contentId === 'quiz-hub');
          const info = [];
          qh.group.traverse(c => {
            if (c.isMesh) {
              const wp = c.position.clone();
              c.getWorldPosition(wp);
              info.push({ name: c.name, visible: c.visible, wp: { x: +wp.x.toFixed(1), y: +wp.y.toFixed(1), z: +wp.z.toFixed(1) } });
            }
          });
          return { groupPos: qh.group.position, meshInfo: info };
        } catch(e) {
          return e.message;
        }
      })()
    `,
    returnByValue: true
  });
  console.log('House World Positions:', JSON.stringify(res.result.value, null, 2));
  ws.close();
}

findHouse().catch(console.error);
