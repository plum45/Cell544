import * as THREE from 'three';
import { getTerrainHeight } from './world.js';

let grassMesh = null;
let flowersMesh = null;
const grassUniforms = { uTime: { value: 0 } };
let isGrassGenerated = false;

// Create a stylized low-poly grass tuft geometry (5 curved blades)
function createGrassTuftGeometry() {
  const geom = new THREE.BufferGeometry();
  const vertices = [];
  const normals = [];

  const bladeCount = 5;
  for (let i = 0; i < bladeCount; i++) {
    const angle = (i / bladeCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
    const height = 1.1 + Math.random() * 0.6;
    const width = 0.14 + Math.random() * 0.05;
    const lean = 0.25 + Math.random() * 0.25;

    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);

    // Bottom left, bottom right
    const x0 = -sinA * (width / 2);
    const z0 = cosA * (width / 2);
    const x1 = sinA * (width / 2);
    const z1 = -cosA * (width / 2);

    // Tip position with outward curve
    const tx = cosA * lean;
    const ty = height;
    const tz = sinA * lean;

    // Face 1 (Triangle from bottom to tip)
    vertices.push(
      x0, 0, z0,
      x1, 0, z1,
      tx, ty, tz
    );

    // Back face (so it renders two-sided cleanly)
    vertices.push(
      tx, ty, tz,
      x1, 0, z1,
      x0, 0, z0
    );

    for (let k = 0; k < 6; k++) {
      normals.push(0, 1, 0);
    }
  }

  geom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geom.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  return geom;
}

// Create low-poly little flower geometry (4 petal cross + center)
function createFlowerGeometry() {
  const group = new THREE.BufferGeometry();
  const vertices = [];
  const normals = [];

  const petalCount = 5;
  const radius = 0.22;
  for (let i = 0; i < petalCount; i++) {
    const a0 = (i / petalCount) * Math.PI * 2;
    const a1 = ((i + 1) / petalCount) * Math.PI * 2;
    const amid = (a0 + a1) / 2;

    const x0 = Math.cos(a0) * (radius * 0.3);
    const z0 = Math.sin(a0) * (radius * 0.3);
    const x1 = Math.cos(a1) * (radius * 0.3);
    const z1 = Math.sin(a1) * (radius * 0.3);
    const xm = Math.cos(amid) * radius;
    const zm = Math.sin(amid) * radius;

    vertices.push(0, 0.05, 0, x0, 0.04, z0, xm, 0.06, zm);
    vertices.push(0, 0.05, 0, xm, 0.06, zm, x1, 0.04, z1);
    for (let k = 0; k < 6; k++) normals.push(0, 1, 0);
  }

  group.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  group.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  return group;
}

// Build Grass & Wildflower Fields
export function createGrass(scene) {
  const GRASS_COUNT = 180;
  const FLOWER_COUNT = 60;

  // Material with wind sway vertex shader
  const grassMat = new THREE.MeshLambertMaterial({
    side: THREE.DoubleSide,
    flatShading: true,
  });

  grassMat.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = grassUniforms.uTime;
    shader.vertexShader = `
      uniform float uTime;
      ${shader.vertexShader}
    `.replace(
      '#include <begin_vertex>',
      `
      #include <begin_vertex>
      if (position.y > 0.25) {
        float windSway = sin(uTime * 2.2 + transformed.x * 0.35 + transformed.z * 0.35) * 0.22 * (position.y / 1.5);
        transformed.x += windSway;
        transformed.z += windSway * 0.6;
      }
      `
    );
  };

  const flowerMat = new THREE.MeshLambertMaterial({
    side: THREE.DoubleSide,
    flatShading: true,
  });

  flowerMat.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = grassUniforms.uTime;
    shader.vertexShader = `
      uniform float uTime;
      ${shader.vertexShader}
    `.replace(
      '#include <begin_vertex>',
      `
      #include <begin_vertex>
      float windSway = sin(uTime * 2.2 + transformed.x * 0.35 + transformed.z * 0.35) * 0.18;
      transformed.x += windSway;
      transformed.z += windSway * 0.6;
      `
    );
  };

  const grassGeo = createGrassTuftGeometry();
  const flowerGeo = createFlowerGeometry();

  grassMesh = new THREE.InstancedMesh(grassGeo, grassMat, GRASS_COUNT);
  flowersMesh = new THREE.InstancedMesh(flowerGeo, flowerMat, FLOWER_COUNT);

  grassMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  flowersMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

  scene.add(grassMesh);
  scene.add(flowersMesh);

  // Natural Pastel Grass Palette
  const grassColors = [
    new THREE.Color(0x48bb78), // Fresh Meadow
    new THREE.Color(0x68d391), // Soft Mint
    new THREE.Color(0x38a169), // Spring Green
    new THREE.Color(0x84cc16), // Sunlit Lime
    new THREE.Color(0x52b788), // Forest Glade
    new THREE.Color(0x74c69d), // Pastel Sage
  ];

  // Sweet Pastel Flower Palette
  const flowerColors = [
    new THREE.Color(0xfde047), // Buttercup Yellow
    new THREE.Color(0xf472b6), // Pastel Rose
    new THREE.Color(0x38bdf8), // Sky Blue
    new THREE.Color(0xc084fc), // Soft Lavender
    new THREE.Color(0xfef08a), // Cream Daisy
    new THREE.Color(0xfb7185), // Coral Blossom
  ];

  // Populate grass instances efficiently without main thread freeze
  function populateGrass() {
    if (isGrassGenerated) return;

    const dummy = new THREE.Object3D();
    let grassIdx = 0;
    let flowerIdx = 0;

    let attempts = 0;
    while (grassIdx < GRASS_COUNT && attempts < 400) {
      attempts++;

      // Distribute naturally around the clearing & meadow
      const angle = (attempts / 50) * Math.PI * 2 + Math.random() * 0.5;
      const dist = 6.0 + Math.random() * 45.0;
      const x = Math.cos(angle) * dist;
      const z = Math.sin(angle) * dist;

      // Avoid lake water surface
      if (x > -35 && x < 8 && z > 20 && z < 60) continue;

      const y = getTerrainHeight(x, z);
      if (y < 1.0 || y > 6.0) continue;

      dummy.position.set(x, y, z);
      dummy.rotation.y = Math.random() * Math.PI * 2;
      const scale = 0.7 + Math.random() * 0.4;
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();

      grassMesh.setMatrixAt(grassIdx, dummy.matrix);

      // Random grass color tint
      const col = grassColors[Math.floor(Math.random() * grassColors.length)];
      grassMesh.setColorAt(grassIdx, col);

      // Sprinkle a flower on some tufts
      if (flowerIdx < FLOWER_COUNT && Math.random() < 0.35) {
        dummy.position.set(x + (Math.random() - 0.5) * 0.3, y + scale * 0.85, z + (Math.random() - 0.5) * 0.3);
        dummy.scale.set(scale * 1.1, scale * 1.1, scale * 1.1);
        dummy.updateMatrix();

        flowersMesh.setMatrixAt(flowerIdx, dummy.matrix);
        const fCol = flowerColors[Math.floor(Math.random() * flowerColors.length)];
        flowersMesh.setColorAt(flowerIdx, fCol);
        flowerIdx++;
      }

      grassIdx++;
    }

    grassMesh.count = grassIdx;
    flowersMesh.count = flowerIdx;

    grassMesh.instanceMatrix.needsUpdate = true;
    flowersMesh.instanceMatrix.needsUpdate = true;
    if (grassMesh.instanceColor) grassMesh.instanceColor.needsUpdate = true;
    if (flowersMesh.instanceColor) flowersMesh.instanceColor.needsUpdate = true;

    isGrassGenerated = true;
  }

  // Populate as soon as forest ready or immediately if already loaded
  if (window.__roadPositions && window.__roadPositions.length > 0) {
    populateGrass();
  } else {
    window.addEventListener('forest-ready', () => {
      populateGrass();
    });
  }

  return { grassMesh, flowersMesh };
}

// Animate wind swaying
export function animateGrass(time) {
  grassUniforms.uTime.value = time;
}
