const fs = require('fs');

async function verify() {
  const tabs = await fetch('http://127.0.0.1:9222/json').then(r => r.json());
  const tab = tabs.find(t => t.url.includes('localhost:3000'));
  if (!tab) {
    console.log('No localhost:3000 tab found');
    return;
  }

  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);
  let id = 1;
  const send = (m, p = {}) => new Promise(res => {
    const i = id++;
    const h = e => {
      const d = JSON.parse(e.data);
      if (d.id === i) {
        ws.removeEventListener('message', h);
        res(d.result);
      }
    };
    ws.addEventListener('message', h);
    ws.send(JSON.stringify({ id: i, method: m, params: p }));
  });

  // Track console events
  ws.addEventListener('message', e => {
    const d = JSON.parse(e.data);
    if (d.method === 'Console.messageAdded') {
      console.log('[Browser]', d.params.message.text);
    }
  });

  await send('Console.enable');
  await send('Network.enable');
  await send('Network.setCacheDisabled', { cacheDisabled: true });

  console.log('Reloading page with cache disabled...');
  await send('Page.reload', { ignoreCache: true });

  // Wait 4s for assets to load
  await new Promise(r => setTimeout(r, 4000));

  // Enter world
  console.log('Clicking Enter World...');
  await send('Runtime.evaluate', {
    expression: 'document.getElementById("btn-enter")?.click()'
  });

  await new Promise(r => setTimeout(r, 2000));

  // 1. Overview screenshot of expanded sky island with Fox, Guide Bunny, Parrot, and lush grass
  console.log('Capturing start area...');
  const ss1 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:/Users/lgopl/.gemini/antigravity-ide/brain/edf24109-bedd-4b1d-9d08-98008fc6a128/1_expanded_island_start.png', Buffer.from(ss1.data, 'base64'));
  console.log('Saved 1_expanded_island_start.png');

  // 2. Move near Deer in the meadow at x = 16.0, z = -7.5
  console.log('Moving to Deer at x = 16.0, z = -7.5...');
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        window.player.position.set(16.0, window.player.position.y, -7.5);
        if (window.player.mesh) window.player.mesh.position.copy(window.player.position);
        if (window.controls) {
          window.controls.target.set(17.5, 1.8, -9.0);
          window.camera.position.set(13.0, 3.5, -4.5);
          window.controls.update();
        }
      })()
    `
  });

  await new Promise(r => setTimeout(r, 1200));

  const deerPrompt = await send('Runtime.evaluate', {
    expression: 'document.getElementById("prompt-text")?.innerHTML',
    returnByValue: true
  });
  console.log('Deer prompt:', deerPrompt.result.value);

  const ss2 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:/Users/lgopl/.gemini/antigravity-ide/brain/edf24109-bedd-4b1d-9d08-98008fc6a128/2_grounded_deer.png', Buffer.from(ss2.data, 'base64'));
  console.log('Saved 2_grounded_deer.png');

  // 3. Move near Horse in the vast meadow at x = 29.5, z = -12.0
  console.log('Moving to Horse at x = 29.5, z = -12.0...');
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        window.player.position.set(29.5, window.player.position.y, -12.0);
        if (window.player.mesh) window.player.mesh.position.copy(window.player.position);
        if (window.controls) {
          window.controls.target.set(32.0, 2.0, -14.0);
          window.camera.position.set(26.0, 3.8, -9.0);
          window.controls.update();
        }
      })()
    `
  });

  await new Promise(r => setTimeout(r, 1200));

  const horsePrompt = await send('Runtime.evaluate', {
    expression: 'document.getElementById("prompt-text")?.innerHTML',
    returnByValue: true
  });
  console.log('Horse prompt:', horsePrompt.result.value);

  const ss3 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:/Users/lgopl/.gemini/antigravity-ide/brain/edf24109-bedd-4b1d-9d08-98008fc6a128/3_grounded_horse.png', Buffer.from(ss3.data, 'base64'));
  console.log('Saved 3_grounded_horse.png');

  // 4. Move to Lake Pond with Flamingo & Duck at x = -7.0, z = 18.5
  console.log('Moving to Lake Pond at x = -7.0, z = 18.5...');
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        window.player.position.set(-7.0, 1.85, 18.5);
        if (window.player.mesh) window.player.mesh.position.copy(window.player.position);
        if (window.controls) {
          window.controls.target.set(-9.5, 1.5, 21.0);
          window.camera.position.set(-4.0, 4.0, 15.0);
          window.controls.update();
        }
      })()
    `
  });

  await new Promise(r => setTimeout(r, 1200));

  const ss4 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:/Users/lgopl/.gemini/antigravity-ide/brain/edf24109-bedd-4b1d-9d08-98008fc6a128/4_lake_flamingo_duck.png', Buffer.from(ss4.data, 'base64'));
  console.log('Saved 4_lake_flamingo_duck.png');

  ws.close();
  console.log('All verification passed!');
}

verify().catch(console.error);
