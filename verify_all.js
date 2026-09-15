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
  console.log('Reloading page with cache disabled, waiting 4.5s...');
  await new Promise(r => setTimeout(r, 4500));

  // 1. Enter World
  console.log('Entering world...');
  await send('Runtime.evaluate', { expression: 'document.getElementById("btn-enter")?.click()' });
  await new Promise(r => setTimeout(r, 1800));

  // Capture: Initial view on brown road with 4-legged Fox & Guide NPC
  const shot1 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:/Users/lgopl/.gemini/antigravity-ide/brain/edf24109-bedd-4b1d-9d08-98008fc6a128/1_fox_and_guide_npc.png', Buffer.from(shot1.data, 'base64'));
  console.log('Saved 1_fox_and_guide_npc.png');

  // 2. Walk forward with 'KeyW' to trigger 4-legged walking animation towards NPC
  console.log('Walking forward with W...');
  await send('Input.dispatchKeyEvent', { type: 'keyDown', code: 'KeyW', key: 'w' });
  await new Promise(r => setTimeout(r, 1000));
  await send('Input.dispatchKeyEvent', { type: 'keyUp', code: 'KeyW', key: 'w' });
  await new Promise(r => setTimeout(r, 500));

  // Capture: Walking action / approach NPC prompt
  const shot2 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:/Users/lgopl/.gemini/antigravity-ide/brain/edf24109-bedd-4b1d-9d08-98008fc6a128/2_approaching_npc_prompt.png', Buffer.from(shot2.data, 'base64'));
  console.log('Saved 2_approaching_npc_prompt.png');

  // 3. Trigger Interaction with Guide NPC (press E or click prompt)
  console.log('Opening Guide NPC dialogue...');
  await send('Input.dispatchKeyEvent', { type: 'keyDown', code: 'KeyE', key: 'e' });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', code: 'KeyE', key: 'e' });
  await new Promise(r => setTimeout(r, 600));

  // Capture: NPC Dialogue Modal
  const shot3 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:/Users/lgopl/.gemini/antigravity-ide/brain/edf24109-bedd-4b1d-9d08-98008fc6a128/3_npc_guide_dialog.png', Buffer.from(shot3.data, 'base64'));
  console.log('Saved 3_npc_guide_dialog.png');

  // 4. Test Warp/Teleport to Landmark (e.g. Magic Windmill)
  console.log('Teleporting to Magic Windmill (Gene Regulation)...');
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const btn = document.querySelector('.btn-guide-warp[data-target="gene-regulation"]');
        if (btn) btn.click();
      })()
    `
  });
  await new Promise(r => setTimeout(r, 1200));

  // Capture: Warped to Magic Windmill along the brown road
  const shot4 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:/Users/lgopl/.gemini/antigravity-ide/brain/edf24109-bedd-4b1d-9d08-98008fc6a128/4_warped_to_windmill_road.png', Buffer.from(shot4.data, 'base64'));
  console.log('Saved 4_warped_to_windmill_road.png');

  ws.close();
  console.log('All tests completed successfully!');
}
main().catch(console.error);
