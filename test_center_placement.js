const fs = require('fs');

async function testPlacement() {
  const tabs = await fetch('http://127.0.0.1:9222/json').then(r => r.json());
  const tab = tabs.find(t => t.url.includes('localhost:3000'));
  if (!tab) { console.log('No tab'); return; }
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);
  let id = 1;
  const send = (m, p = {}) => new Promise(res => {
    const cur = id++;
    const h = e => { const d = JSON.parse(e.data); if (d.id === cur) { ws.removeEventListener('message', h); res(d.result); } };
    ws.addEventListener('message', h);
    ws.send(JSON.stringify({ id: cur, method: m, params: p }));
  });

  // Test house rotation and framing
  const res = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const qh = window.landmarks.find(l => l.contentId === 'quiz-hub');
        // Rotate so front entrance faces the road/player
        qh.group.rotation.y = -Math.PI * 0.75; // or Math.PI / 2
        qh.group.position.set(-2.0, 5.2, 2.0);
        qh.worldPosition.set(-2.0, 5.2, 2.0);
        qh.position.set(-2.0, 11.0, 2.0);

        // Position camera back to see the whole house and roof
        window.camera.position.set(16.0, 14.0, 22.0);
        window.controls.target.set(-2.0, 7.0, 2.0);
        window.controls.update();

        return 'Rotation updated';
      })()
    `,
    returnByValue: true
  });

  console.log('Moved house:', res.result ? res.result.value : res);
  await new Promise(r => setTimeout(r, 1000));

  const ss = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:/Users/lgopl/.gemini/antigravity-ide/scratch/cell-life-3d/test_center.png', Buffer.from(ss.data, 'base64'));
  fs.writeFileSync('C:/Users/lgopl/.gemini/antigravity-ide/brain/edf24109-bedd-4b1d-9d08-98008fc6a128/test_center.png', Buffer.from(ss.data, 'base64'));
  console.log('Saved test_center.png');

  ws.close();
}

testPlacement().catch(console.error);
