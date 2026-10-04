const fs = require('fs');

async function checkCenter() {
  const tabs = await fetch('http://127.0.0.1:9222/json').then(r => r.json());
  const tab = tabs.find(t => t.url.includes('localhost:3000'));
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);
  let id = 1;
  const send = (m, p={}) => new Promise(res => {
    const cur = id++;
    const h = e => { const d = JSON.parse(e.data); if (d.id === cur) { ws.removeEventListener('message', h); res(d.result); } };
    ws.addEventListener('message', h);
    ws.send(JSON.stringify({ id: cur, method: m, params: p }));
  });

  const res = await send('Runtime.evaluate', {
    expression: `
      (() => {
        // Find terrain mesh in scene
        let terrainMesh = null;
        window.scene.traverse(c => {
          if (c.isMesh && (c.name.includes('Terrain') || c.geometry?.attributes?.position?.count > 10000)) {
            terrainMesh = c;
          }
        });

        // Let's sample Raycaster at (0, 0), (0, 5), (0, -5), (-5, 0), (5, 0)
        const raycaster = new window.THREE.Raycaster();
        const pts = [
          {x: 0, z: 0},
          {x: 0, z: 5},
          {x: 0, z: -5},
          {x: -5, z: 0},
          {x: 5, z: 0},
          {x: 0, z: 10},
          {x: -10, z: 0}
        ];
        const results = [];
        for (const pt of pts) {
          raycaster.set(new window.THREE.Vector3(pt.x, 100, pt.z), new window.THREE.Vector3(0, -1, 0));
          const hits = raycaster.intersectObjects(window.scene.children, true);
          const terrainHit = hits.find(h => !h.object.userData?.isPlayer && !h.object.userData?.contentId && h.point.y < 30);
          results.push({
            x: pt.x,
            z: pt.z,
            hitY: terrainHit ? +terrainHit.point.y.toFixed(2) : null,
            hitObj: terrainHit ? terrainHit.object.name : null
          });
        }
        return results;
      })()
    `,
    returnByValue: true
  });

  console.log('Center Raycast Results:', JSON.stringify(res.result.value, null, 2));
  ws.close();
}

checkCenter().catch(console.error);
