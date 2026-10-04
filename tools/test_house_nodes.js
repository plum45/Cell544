const fs = require('fs');
const gltf = JSON.parse(fs.readFileSync('assets/models/house/scene.gltf', 'utf8'));
console.log('House Nodes count:', gltf.nodes.length);
console.log('House Meshes count:', gltf.meshes.length);
console.log('House Materials count:', gltf.materials.length);
