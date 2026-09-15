const fs = require('fs');

async function snapHouse() {
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

  // Position player standing on the road and camera framed nicely back showing full house
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        window.player.position.set(-6.0, 5.2, -8.0);
        window.camera.position.set(4.0, 11.5, -8.0);
        window.controls.target.set(-16.0, 8.5, -8.0);
      })()
    `
  });
  await new Promise(r => setTimeout(r, 1000));
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:/Users/lgopl/.gemini/antigravity-ide/brain/edf24109-bedd-4b1d-9d08-98008fc6a128/5_modular_fantasy_house_quiz.png', Buffer.from(shot.data, 'base64'));
  console.log('Saved 5_modular_fantasy_house_quiz.png');

  // Also test camera-relative movement verification:
  // Rotate camera 90 deg, test movement direction
  const moveTest = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const cam = window.camera;
        const p = window.player;
        const camForward = new cam.position.constructor();
        cam.getWorldDirection(camForward);
        return {
          cameraDirection: { x: +camForward.x.toFixed(2), y: +camForward.y.toFixed(2), z: +camForward.z.toFixed(2) },
          hasTouchControls: !!document.getElementById('touch-controls'),
          hasJoystick: !!document.getElementById('joystick-knob')
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Control Verification:', JSON.stringify(moveTest.result.value, null, 2));

  ws.close();
}

snapHouse().catch(console.error);
