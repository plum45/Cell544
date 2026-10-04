async function checkHorse() {
  const tabs = await fetch('http://127.0.0.1:9222/json').then(r => r.json());
  const tab = tabs.find(t => t.url.includes('localhost:3000'));
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);
  let id = 1;
  const send = (m, p={}) => new Promise(res => {
    const i = id++;
    const h = e => { const d = JSON.parse(e.data); if (d.id === i) { ws.removeEventListener('message', h); res(d.result); } };
    ws.addEventListener('message', h);
    ws.send(JSON.stringify({ id: i, method: m, params: p }));
  });

  const res = await send('Runtime.evaluate', {
    expression: `
      (() => {
        let horseObj = null;
        window.scene.traverse(c => {
          if (c.userData && c.userData.name === 'ม้าป่าสีน้ำตาล') horseObj = c;
        });
        if (!horseObj) return 'No horse found';
        
        let meshInfo = null;
        horseObj.traverse(c => {
          if (c.isMesh) {
            c.geometry.computeBoundingBox();
            meshInfo = {
              geoMin: c.geometry.boundingBox.min,
              geoMax: c.geometry.boundingBox.max,
              scale: c.scale,
              rawScale: c.parent ? c.parent.scale : null,
              parentPos: horseObj.position
            };
          }
        });
        return meshInfo;
      })()
    `,
    returnByValue: true
  });
  console.log('Horse info:', JSON.stringify(res.result.value, null, 2));
  ws.close();
}
checkHorse().catch(console.error);
