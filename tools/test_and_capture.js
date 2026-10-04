const fs = require('fs');

async function main() {
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

  await send('Network.enable');
  await send('Network.setCacheDisabled', { cacheDisabled: true });
  await send('Runtime.enable');
  await send('Page.enable');
  await send('Page.reload', { ignoreCache: true });
  console.log('Reloading page...');
  await new Promise(r => setTimeout(r, 4500));

  // Enter world
  console.log('Entering world...');
  await send('Runtime.evaluate', {
    expression: 'document.getElementById("btn-enter")?.click()'
  });

  await new Promise(r => setTimeout(r, 2000));

  // Capture initial 3D world view with character on brown road
  const shot1 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:/Users/lgopl/.gemini/antigravity-ide/brain/edf24109-bedd-4b1d-9d08-98008fc6a128/fox_walking_on_brown_road.png', Buffer.from(shot1.data, 'base64'));
  console.log('Saved fox_walking_on_brown_road.png');

  // Walk forward for 1.2 seconds along the road
  console.log('Walking forward with W...');
  await send('Input.dispatchKeyEvent', { type: 'keyDown', code: 'KeyW', key: 'w' });
  await new Promise(r => setTimeout(r, 1200));
  await send('Input.dispatchKeyEvent', { type: 'keyUp', code: 'KeyW', key: 'w' });

  await new Promise(r => setTimeout(r, 800));

  // Capture screenshot after walking along road
  const shot2 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:/Users/lgopl/.gemini/antigravity-ide/brain/edf24109-bedd-4b1d-9d08-98008fc6a128/fox_walked_along_road.png', Buffer.from(shot2.data, 'base64'));
  console.log('Saved fox_walked_along_road.png');

  // Turn camera slightly to see panoramic landscape and landmarks
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        // Orbit camera around player to look at landmarks along the brown road
        const p = window.player.position;
        window.camera.position.set(p.x - 10, p.y + 6, p.z - 8);
        window.controls.target.set(p.x, p.y + 1.2, p.z);
        window.controls.update();
      })()
    `
  });

  await new Promise(r => setTimeout(r, 600));

  const shot3 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:/Users/lgopl/.gemini/antigravity-ide/brain/edf24109-bedd-4b1d-9d08-98008fc6a128/panoramic_landmarks_road.png', Buffer.from(shot3.data, 'base64'));
  console.log('Saved panoramic_landmarks_road.png');

  ws.close();
}
main().catch(console.error);
