const fs = require('fs');

async function verifyCenterAndAerial() {
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

  // Wait for loading to finish and landing screen to appear
  console.log('Waiting for world to finish loading...');
  for (let i = 0; i < 20; i++) {
    const isReady = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const loading = document.getElementById('loading');
          const enterBtn = document.getElementById('btn-enter');
          return {
            loadingHidden: loading && (loading.style.display === 'none' || getComputedStyle(loading).display === 'none' || loading.classList.contains('exit')),
            hasEnterBtn: !!enterBtn,
            hasLandmarks: !!window.landmarks && window.landmarks.length >= 6
          };
        })()
      `,
      returnByValue: true
    });
    if (isReady.result?.value?.loadingHidden && isReady.result?.value?.hasLandmarks) {
      console.log('Landing screen ready!');
      break;
    }
    await new Promise(r => setTimeout(r, 1000));
  }

  // Click enter button to enter world
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const btn = document.getElementById('btn-enter');
        if (btn) btn.click();
        return 'Clicked enter';
      })()
    `
  });
  await new Promise(r => setTimeout(r, 2000));

  // 3. Check landmark positions & verify quiz-hub is at center (0, 0)
  const landmarkInfo = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const qh = window.landmarks ? window.landmarks.find(l => l.contentId === 'quiz-hub') : null;
        return {
          totalLandmarks: window.landmarks ? window.landmarks.length : 0,
          quizHubPos: qh ? { x: +qh.worldPosition.x.toFixed(1), y: +qh.worldPosition.y.toFixed(1), z: +qh.worldPosition.z.toFixed(1) } : null,
          playerPos: window.player ? { x: +window.player.position.x.toFixed(1), y: +window.player.position.y.toFixed(1), z: +window.player.position.z.toFixed(1) } : null,
          hasAerialButton: !!document.getElementById('btn-toggle-aerial'),
          hasTouchAerialButton: !!document.getElementById('btn-touch-aerial'),
          hasAerialBanner: !!document.getElementById('aerial-banner')
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Setup Info:', JSON.stringify(landmarkInfo.result.value, null, 2));

  // 4. Capture screenshot showing central fantasy house from player perspective
  await new Promise(r => setTimeout(r, 1000));
  const shot1 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:/Users/lgopl/.gemini/antigravity-ide/brain/edf24109-bedd-4b1d-9d08-98008fc6a128/8_center_fantasy_house_spawn.png', Buffer.from(shot1.data, 'base64'));
  console.log('Saved 8_center_fantasy_house_spawn.png');

  // 5. Test clicking "🦅 ดูแมพมุมบน" button to activate Top-Down Aerial View
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const btn = document.getElementById('btn-toggle-aerial');
        if (btn) btn.click();
        return 'Clicked aerial button';
      })()
    `
  });
  // Wait for smooth 1.2s camera flight animation
  await new Promise(r => setTimeout(r, 1800));

  // Verify top view active state
  const topViewState = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const cam = window.camera;
        const banner = document.getElementById('aerial-banner');
        const btn = document.getElementById('btn-toggle-aerial');
        return {
          cameraY: +cam.position.y.toFixed(1),
          cameraZ: +cam.position.z.toFixed(1),
          bannerVisible: !banner.classList.contains('hidden'),
          btnActive: btn.classList.contains('active'),
          btnText: btn.textContent.trim()
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Top View Active State:', JSON.stringify(topViewState.result.value, null, 2));

  // 6. Capture screenshot of the Top-Down Bird's-Eye View
  const shot2 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:/Users/lgopl/.gemini/antigravity-ide/brain/edf24109-bedd-4b1d-9d08-98008fc6a128/9_aerial_top_down_map_view.png', Buffer.from(shot2.data, 'base64'));
  console.log('Saved 9_aerial_top_down_map_view.png');

  // 7. Test exiting top view by clicking "✕ กลับสู่ตัวละคร" on the banner
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const exitBtn = document.getElementById('btn-exit-aerial');
        if (exitBtn) exitBtn.click();
        return 'Clicked exit aerial button';
      })()
    `
  });
  await new Promise(r => setTimeout(r, 1500));

  // Verify camera returned to player
  const returnState = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const cam = window.camera;
        const p = window.player;
        const banner = document.getElementById('aerial-banner');
        return {
          cameraY: +cam.position.y.toFixed(1),
          playerY: +p.position.y.toFixed(1),
          bannerHidden: banner.classList.contains('hidden')
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Return State:', JSON.stringify(returnState.result.value, null, 2));

  ws.close();
}

verifyCenterAndAerial().catch(console.error);
