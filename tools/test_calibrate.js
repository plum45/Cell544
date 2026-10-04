const fs = require('fs');

async function calibrate() {
  const tabs = await fetch('http://127.0.0.1:9222/json').then(r => r.json());
  const tab = tabs.find(t => t.url.includes('localhost:3000'));
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);
  let id = 1;
  const send = (m, p={}) => new Promise(res => {
    const i = id++;
    const h = e => { const d = JSON.parse(e.data); if (d.id === i) { ws.removeEventListener('message', h); res(d.result); } };
    ws.addEventListener('message', h);
    ws.send(JSON.stringify({ id: i, method: m, params: p }));
  });

  const res = await send('Runtime.evaluate', {
    expression: `
      (() => {
        let deerObj = null;
        window.scene.traverse(c => {
          if (c.userData && c.userData.name === 'กวางป่าน้อย') deerObj = c;
        });
        if (!deerObj) return 'No deer';
        // Adjust inner model scale and grounding
        const inner = deerObj.children[0];
        inner.scale.set(0.32, 0.32, 0.32);
        inner.position.set(0, -0.65, 0);

        // Also let's orient the camera right at the deer
        window.player.position.set(10.0, window.player.position.y, -4.5);
        if (window.player.mesh) window.player.mesh.position.copy(window.player.position);
        window.controls.target.set(12.0, 1.8, -6.5);
        window.camera.position.set(8.5, 3.2, -2.5);
        window.controls.update();

        return 'Deer adjusted and grounded!';
      })()
    `,
    returnByValue: true
  });
  console.log(res.result.value);

  await new Promise(r => setTimeout(r, 600));

  const ss = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:/Users/lgopl/.gemini/antigravity-ide/brain/edf24109-bedd-4b1d-9d08-98008fc6a128/deer_calibrated.png', Buffer.from(ss.data, 'base64'));
  console.log('Saved deer_calibrated.png');
  ws.close();
}
calibrate().catch(console.error);
