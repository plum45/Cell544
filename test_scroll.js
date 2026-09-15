const fs = require('fs');
const path = require('path');

async function testScrollAndQuiz() {
  const tabsRes = await fetch('http://127.0.0.1:9222/json');
  const tabs = await tabsRes.json();
  const pageTab = tabs.find(t => t.type === 'page');
  if (!pageTab) return;

  const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);
  let reqId = 1;
  function send(method, params = {}) {
    return new Promise(resolve => {
      const id = reqId++;
      const handler = evt => {
        const msg = JSON.parse(evt.data);
        if (msg.id === id) {
          ws.removeEventListener('message', handler);
          resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  // Navigate directly
  console.log('Navigating to topics/gene-expression.html...');
  await send('Page.navigate', { url: 'http://localhost:3000/topics/gene-expression.html' });
  await new Promise(r => setTimeout(r, 1500));

  // Scroll down to quiz
  await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 1150)' });
  await new Promise(r => setTimeout(r, 600));

  // Click Quiz option A
  await send('Runtime.evaluate', {
    expression: `
      const opt = document.querySelector('.q-option');
      if (opt) opt.click();
    `
  });
  await new Promise(r => setTimeout(r, 600));

  // Take screenshot
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  const outDir = 'C:\\Users\\lgopl\\.gemini\\antigravity-ide\\brain\\edf24109-bedd-4b1d-9d08-98008fc6a128';
  const outPath = path.join(outDir, 'topic_quiz_and_details.png');
  fs.writeFileSync(outPath, Buffer.from(shot.data, 'base64'));
  console.log('Saved quiz screenshot to:', outPath);

  ws.close();
}

testScrollAndQuiz().catch(console.error);
