async function testMoose() {
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
        let deerObj = null;
        window.scene.traverse(c => {
          if (c.userData && c.userData.name === 'กวางป่าน้อย') deerObj = c;
        });
        if (!deerObj) return 'No deer found';
        
        const meshes = [];
        deerObj.traverse(c => {
          if (c.isMesh) {
            c.geometry.computeBoundingBox();
            meshes.push({
              name: c.name,
              geoBoxMin: c.geometry.boundingBox.min,
              geoBoxMax: c.geometry.boundingBox.max,
              worldY: c.getWorldPosition(new (c.parent.parent.constructor.Vector3 || Object.getPrototypeOf(c.position).constructor)()).y
            });
          }
        });
        return {
          deerPos: deerObj.position,
          deerScale: deerObj.scale,
          childCount: deerObj.children.length,
          meshes
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Deer Debug:', JSON.stringify(res.result.value, null, 2));
  ws.close();
}
testMoose().catch(console.error);
