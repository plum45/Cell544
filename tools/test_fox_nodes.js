const fs = require('fs');
const gltf = JSON.parse(fs.readFileSync('assets/models/fox/scene.gltf', 'utf8'));
console.log('Nodes count:', gltf.nodes.length);
gltf.nodes.forEach((n, i) => {
  console.log(`Node ${i}: name=${n.name} mesh=${n.mesh} rot=${JSON.stringify(n.rotation)}`);
});
