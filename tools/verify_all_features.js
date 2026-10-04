const fs = require('fs');

async function testAll() {
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

  // Reload page to get all new modules and models
  await send('Page.enable');
  await send('Network.enable');
  await send('Network.setCacheDisabled', { cacheDisabled: true });
  await send('Page.reload', { ignoreCache: true });

  // Wait 4.5 seconds for scene and models to load
  await new Promise(r => setTimeout(r, 4500));

  // Enter 3D world
  await send('Runtime.evaluate', {
    expression: "document.getElementById('btn-enter').click();"
  });
  await new Promise(r => setTimeout(r, 1200));

  // Test 1: Check if Quiz Hub landmark is in the scene
  const landmarkCheck = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const qh = window.landmarks ? window.landmarks.find(l => l.contentId === 'quiz-hub') : null;
        return {
          hasQuizHub: !!qh,
          pos: qh ? qh.worldPosition : null,
          totalLandmarks: window.landmarks ? window.landmarks.length : 0
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Landmark Check:', JSON.stringify(landmarkCheck.result.value, null, 2));

  // Move camera & player to view the new Modular Fantasy House (Quiz Hub)
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        window.player.position.set(-10.0, 5.2, -8.0);
        window.camera.position.set(-3.0, 8.5, -8.0);
        window.controls.target.set(-16.0, 5.5, -8.0);
      })()
    `
  });
  await new Promise(r => setTimeout(r, 1200));

  // Capture Screenshot 1: Modular Fantasy House "คลังข้อสอบ"
  const shot1 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:/Users/lgopl/.gemini/antigravity-ide/brain/edf24109-bedd-4b1d-9d08-98008fc6a128/5_modular_fantasy_house_quiz.png', Buffer.from(shot1.data, 'base64'));
  console.log('Saved 5_modular_fantasy_house_quiz.png');

  // Test 2: Emulate iPad Touch Screen
  await send('Emulation.setDeviceMetricsOverride', {
    width: 820,
    height: 1180,
    deviceScaleFactor: 2,
    mobile: true
  });
  await send('Emulation.setTouchEmulationEnabled', {
    enabled: true,
    maxTouchPoints: 5
  });

  await send('Runtime.evaluate', {
    expression: `
      (() => {
        document.getElementById('touch-controls').classList.add('active');
        // Walk closer to Quiz Hub to show interaction button highlight
        window.player.position.set(-12.0, 5.2, -8.0);
        window.camera.position.set(-4.0, 8.5, -8.0);
        window.controls.target.set(-16.0, 5.5, -8.0);
      })()
    `
  });
  await new Promise(r => setTimeout(r, 1000));

  // Capture Screenshot 2: iPad Touch View with Virtual Joystick & Action Buttons
  const shot2 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:/Users/lgopl/.gemini/antigravity-ide/brain/edf24109-bedd-4b1d-9d08-98008fc6a128/6_ipad_touch_controls.png', Buffer.from(shot2.data, 'base64'));
  console.log('Saved 6_ipad_touch_controls.png');

  // Test 3: Navigate to topics/quiz-hub.html
  await send('Page.navigate', {
    url: 'http://localhost:3000/topics/quiz-hub.html'
  });
  await new Promise(r => setTimeout(r, 1500));

  // Answer 2 questions in the quiz hub to test scoring and explanations
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        // Choose option A for Question 1 (Wrong) and Option B for Question 2 (Correct)
        const b1 = document.querySelector('#card-1 .opt-btn');
        if (b1) b1.click();
        const b2 = document.querySelectorAll('#card-2 .opt-btn')[2];
        if (b2) b2.click();
      })()
    `
  });
  await new Promise(r => setTimeout(r, 800));

  // Capture Screenshot 3: Quiz Hub UI on iPad with instant feedback
  const shot3 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:/Users/lgopl/.gemini/antigravity-ide/brain/edf24109-bedd-4b1d-9d08-98008fc6a128/7_quiz_hub_interactive.png', Buffer.from(shot3.data, 'base64'));
  console.log('Saved 7_quiz_hub_interactive.png');

  // Restore desktop view
  await send('Emulation.clearDeviceMetricsOverride');
  await send('Emulation.setTouchEmulationEnabled', { enabled: false });
  await send('Page.navigate', { url: 'http://localhost:3000/index.html' });

  ws.close();
}

testAll().catch(console.error);
