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

  await send('Network.enable');
  await send('Network.setCacheDisabled', { cacheDisabled: true });
  await send('Runtime.enable');
  await send('Page.enable');
  await send('Page.reload', { ignoreCache: true });
  console.log('Reloaded page, waiting 4s...');
  await new Promise(r => setTimeout(r, 4000));

  // Click Enter button
  console.log('Clicking Enter World...');
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const btn = document.getElementById('btn-enter');
        if (btn) btn.click();
      })()
    `
  });

  await new Promise(r => setTimeout(r, 1500));

  // Switch to cute Fox
  console.log('Switching to Fox avatar...');
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const btn = document.getElementById('btn-char-fox');
        if (btn) btn.click();
      })()
    `
  });

  await new Promise(r => setTimeout(r, 1000));

  // Capture screenshot standing on brown road
  const standingShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:/Users/lgopl/.gemini/antigravity-ide/brain/edf24109-bedd-4b1d-9d08-98008fc6a128/standing_on_brown_road.png', Buffer.from(standingShot.data, 'base64'));
  console.log('Saved standing_on_brown_road.png');

  // Check player and landmark heights
  const info = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const p = window.player || {};
        return {
          playerY: +(document.querySelector('canvas') ? window.__lastPlayerY || p.position?.y : 0).toFixed(2)
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Player info:', info.result.value);

  // Walk forward for 1.8 seconds with 'KeyW'
  console.log('Walking forward along brown road...');
  await send('Input.dispatchKeyEvent', { type: 'keyDown', code: 'KeyW', key: 'w' });
  await new Promise(r => setTimeout(r, 1800));
  await send('Input.dispatchKeyEvent', { type: 'keyUp', code: 'KeyW', key: 'w' });

  await new Promise(r => setTimeout(r, 500));

  // Capture screenshot after walking
  const walkedShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:/Users/lgopl/.gemini/antigravity-ide/brain/edf24109-bedd-4b1d-9d08-98008fc6a128/walked_on_brown_road.png', Buffer.from(walkedShot.data, 'base64'));
  console.log('Saved walked_on_brown_road.png');

  ws.close();
}
test().catch(console.error);
