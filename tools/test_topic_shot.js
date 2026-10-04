const fs = require('fs');
const path = require('path');

async function testTopicPage() {
  const tabsRes = await fetch('http://127.0.0.1:9222/json');
  const tabs = await tabsRes.json();
  const pageTab = tabs.find(t => t.type === 'page');
  if (!pageTab) {
    console.log('No page tab found');
    return;
  }

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

  // Navigate to gene-expression.html
  console.log('Navigating to http://localhost:3000/topics/gene-expression.html...');
  await send('Page.navigate', { url: 'http://localhost:3000/topics/gene-expression.html' });
  await new Promise(r => setTimeout(r, 2000));

  // Take screenshot
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  const outDir = 'C:\\Users\\lgopl\\.gemini\\antigravity-ide\\brain\\edf24109-bedd-4b1d-9d08-98008fc6a128';
  const outPath = path.join(outDir, 'topic_gene_expression_page.png');
  fs.writeFileSync(outPath, Buffer.from(shot.data, 'base64'));
  console.log('Saved screenshot to:', outPath);

  ws.close();
}

testTopicPage().catch(console.error);
