const fs = require('fs');

// We can inspect the scene.gltf JSON structure
const gltf = JSON.parse(fs.readFileSync('assets/models/quiz_house/scene.gltf', 'utf8'));
console.log('Meshes count:', gltf.meshes ? gltf.meshes.length : 0);
console.log('Nodes count:', gltf.nodes ? gltf.nodes.length : 0);
console.log('Materials:', gltf.materials ? gltf.materials.map(m => m.name) : []);
