const fs = require('fs');

async function check() {
  const tabs = await fetch('http://127.0.0.1:9222/json').then(r => r.json());
  const pageTab = tabs.find(t => t.url.includes('localhost:3000'));
  const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);
  let id = 1;
  function send(m, p={}) {
    return new Promise(res => {
      const i = id++;
      const h = (e) => {
        const d = JSON.parse(e.data);
        if (d.id === i) { ws.removeEventListener('message', h); res(d.result); };
      };
      ws.addEventListener('message', h);
      ws.send(JSON.stringify({ id: i, method: m, params: p }));
    });
  }

  // Click btn-enter
  console.log('Dispatching click to btn-enter...');
  const res = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const btn = document.getElementById('btn-enter');
        if (!btn) return 'no btn';
        btn.click();
        return 'clicked';
      })()
    `,
    returnByValue: true
  });
  console.log('Click result:', res.result.value);

  // Wait 1.5s for transition to finish
  await new Promise(r => setTimeout(r, 1500));

  // Capture screenshot of world
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:/Users/lgopl/.gemini/antigravity-ide/brain/edf24109-bedd-4b1d-9d08-98008fc6a128/world_active.png', Buffer.from(shot.data, 'base64'));
  console.log('Saved world_active.png');

  ws.close();
}
check().catch(console.error);
