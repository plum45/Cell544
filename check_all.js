async function checkAll() {
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
        const info = [];
        window.scene.traverse(c => {
          if (c.userData && c.userData.name) {
            c.traverse(ch => {
              if (ch.isMesh && ch.geometry) {
                ch.geometry.computeBoundingBox();
                const s = new (Object.getPrototypeOf(c.position).constructor)();
                ch.geometry.boundingBox.getSize(s);
                info.push({
                  name: c.userData.name,
                  rawGeoSize: { x: +s.x.toFixed(1), y: +s.y.toFixed(1), z: +s.z.toFixed(1) },
                  minY: +ch.geometry.boundingBox.min.y.toFixed(1),
                  maxY: +ch.geometry.boundingBox.max.y.toFixed(1)
                });
              }
            });
          }
        });
        return info;
      })()
    `,
    returnByValue: true
  });
  console.log('All Animal Geometries:', JSON.stringify(res.result.value, null, 2));
  ws.close();
}
checkAll().catch(console.error);
