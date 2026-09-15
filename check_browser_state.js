async function test() {
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

  const check = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const meshes = window.__walkableGroundMeshes || [];
        const spots = [
          { name: 'Spawn', x: -3.5, z: 0.5 },
          { name: 'Gene Expression (House)', x: 1.0, z: -15.5 },
          { name: 'Gene Regulation (Windmill)', x: 23.5, z: -15.5 },
          { name: 'Cell Signaling (Lighthouse)', x: 33.0, z: 1.0 },
          { name: 'Cell Response (Pavilion)', x: 26.5, z: 17.5 },
          { name: 'Cell Cycle (Observatory)', x: 6.5, z: 27.5 },
          { name: 'Apoptosis (Sanctuary)', x: -19.0, z: 11.0 },
        ];

        // Raycast down
        const raycaster = new (window.__forest?.constructor?.name ? window.__forest : meshes[0].parent.parent).constructor;
        // Or simpler: project via Ray
        const results = [];
        for (const s of spots) {
          // Find closest vertex in meshes
          let closestDist = 1e9;
          let groundY = 1.0;
          for (const m of meshes) {
            const geo = m.geometry;
            const pos = geo.attributes.position;
            m.updateMatrixWorld(true);
            const v = new (m.position.constructor)();
            for (let i = 0; i < pos.count; i += 3) {
              v.fromBufferAttribute(pos, i);
              v.applyMatrix4(m.matrixWorld);
              const d = Math.hypot(v.x - s.x, v.z - s.z);
              if (d < closestDist) {
                closestDist = d;
                groundY = v.y;
              }
            }
          }
          results.push({ name: s.name, x: s.x, z: s.z, groundY: +groundY.toFixed(2), vertexDist: +closestDist.toFixed(2) });
        }
        return results;
      })()
    `,
    returnByValue: true
  });

  console.log('Ground heights at landmark spots:');
  console.log(check.result.value);
  ws.close();
}
test().catch(console.error);
