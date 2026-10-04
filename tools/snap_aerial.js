const fs = require('fs');

async function snap() {
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

  // Set high scenic camera view
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        window.camera.position.set(120, 95, 120);
        window.controls.target.set(0, 10, 0);
      })()
    `
  });
  await new Promise(r => setTimeout(r, 1000));
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:/Users/lgopl/.gemini/antigravity-ide/brain/edf24109-bedd-4b1d-9d08-98008fc6a128/4_grand_panoramic_island.png', Buffer.from(shot.data, 'base64'));
  console.log('Saved 4_grand_panoramic_island.png');

  // Reset camera back to player third-person view
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        window.player.position.set(5.5, 5.3, 8.0);
        window.camera.position.set(5.5, 8.5, 20.0);
        window.controls.target.set(5.5, 5.5, 8.0);
      })()
    `
  });
  ws.close();
}
snap().catch(console.error);
