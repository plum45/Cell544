const fs = require('fs');

async function test() {
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

  // Adjust camera to look along the road from south to north
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const p = window.player.position;
        window.camera.position.set(p.x - 1.5, p.y + 2.8, p.z - 6.5);
        window.controls.target.set(p.x, p.y + 1.1, p.z);
        window.controls.update();
      })()
    `
  });

  const shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:/Users/lgopl/.gemini/antigravity-ide/brain/edf24109-bedd-4b1d-9d08-98008fc6a128/test_road_forward_cam.png', Buffer.from(shot.data, 'base64'));
  console.log('Saved test_road_forward_cam.png');
  ws.close();
}
test().catch(console.error);
