const fs = require('fs');

async function testMap() {
  const tabs = await fetch('http://127.0.0.1:9222/json').then(r => r.json());
  const tab = tabs.find(t => t.url.includes('localhost:3000'));
  if (!tab) { console.log('No localhost:3000 tab found'); return; }

  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let id = 1;
  function send(method, params = {}) {
    return new Promise(res => {
      const cur = id++;
      const handler = (msg) => {
        const data = JSON.parse(msg.data);
        if (data.id === cur) {
          ws.removeEventListener('message', handler);
          res(data.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: cur, method, params }));
    });
  }

  // Reload page to get fresh assets
  await send('Page.enable');
  await send('Network.enable');
  await send('Network.setCacheDisabled', { cacheDisabled: true });
  await send('Page.reload', { ignoreCache: true });

  // Wait 4 seconds for 3D world to construct
  await new Promise(r => setTimeout(r, 4000));

  // Enter world
  await send('Runtime.evaluate', {
    expression: "document.getElementById('btn-enter').click();"
  });

  await new Promise(r => setTimeout(r, 1500));

  // Capture Screenshot 1: Expanded Island Overview / Spawn
  const shot1 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:/Users/lgopl/.gemini/antigravity-ide/brain/edf24109-bedd-4b1d-9d08-98008fc6a128/1_expanded_350_overview.png', Buffer.from(shot1.data, 'base64'));
  console.log('Saved 1_expanded_350_overview.png');

  // Check scene objects and positions
  const evalRes = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const p = window.player ? window.player.position : null;
        const lms = window.landmarks ? window.landmarks.map(l => ({
          id: l.contentId,
          pos: { x: +l.worldPosition.x.toFixed(1), y: +l.worldPosition.y.toFixed(1), z: +l.worldPosition.z.toFixed(1) }
        })) : [];
        const roadCount = window.__roadPositions ? window.__roadPositions.length : 0;
        return { p, lms, roadCount };
      })()
    `,
    returnByValue: true
  });
  console.log('Scene Data:', JSON.stringify(evalRes.result.value, null, 2));

  // Walk player towards the Botanical Cottage
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        window.player.position.set(3.0, 3.2, -35.0);
        window.camera.position.set(3.0, 10.0, -18.0);
        window.controls.target.set(3.0, 3.2, -35.0);
      })()
    `
  });

  await new Promise(r => setTimeout(r, 1000));

  // Capture Screenshot 2: Botanical Cottage & Bear on Expanded Island
  const shot2 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:/Users/lgopl/.gemini/antigravity-ide/brain/edf24109-bedd-4b1d-9d08-98008fc6a128/2_expanded_cottage_and_bear.png', Buffer.from(shot2.data, 'base64'));
  console.log('Saved 2_expanded_cottage_and_bear.png');

  // Move player towards the Magic Windmill & Horse
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        window.player.position.set(50.0, 3.2, -32.0);
        window.camera.position.set(40.0, 11.0, -16.0);
        window.controls.target.set(52.0, 3.2, -32.0);
      })()
    `
  });

  await new Promise(r => setTimeout(r, 1000));

  // Capture Screenshot 3: Windmill & Horse
  const shot3 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:/Users/lgopl/.gemini/antigravity-ide/scratch/cell-life-3d/shot3.png', Buffer.from(shot3.data, 'base64'));
  fs.writeFileSync('C:/Users/lgopl/.gemini/antigravity-ide/brain/edf24109-bedd-4b1d-9d08-98008fc6a128/3_expanded_windmill_and_horse.png', Buffer.from(shot3.data, 'base64'));
  console.log('Saved 3_expanded_windmill_and_horse.png');

  ws.close();
}

testMap().catch(console.error);
