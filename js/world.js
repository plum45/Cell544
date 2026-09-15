import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Walkable ground meshes for physical raycasting
export const walkableGroundMeshes = [];
const groundRaycaster = new THREE.Raycaster();
const downVector = new THREE.Vector3(0, -1, 0);
const rayOrigin = new THREE.Vector3();

// Height function for landmark & player placement physically on the actual 3D ground
export function getTerrainHeight(x, z) {
  if (walkableGroundMeshes.length > 0) {
    rayOrigin.set(x, 50, z);
    groundRaycaster.set(rayOrigin, downVector);
    const hits = groundRaycaster.intersectObjects(walkableGroundMeshes, false);
    if (hits.length > 0) {
      return hits[0].point.y;
    }
  }
  const dist = Math.sqrt(x * x + z * z);
  return 1.8 + Math.min(2.0, (dist / 35) ** 2 * 0.5);
}

// Low-poly floating rock stalactites hanging underneath the sky island
function createFloatingUnderIsland(scene) {
  const group = new THREE.Group();
  const rockMat = new THREE.MeshLambertMaterial({
    color: 0x4a3b32,
    flatShading: true,
  });
  const darkRockMat = new THREE.MeshLambertMaterial({
    color: 0x2e231c,
    flatShading: true,
  });

  // Central large hanging rock core
  const mainSpike = new THREE.Mesh(new THREE.ConeGeometry(42, 40, 9), rockMat);
  mainSpike.rotation.x = Math.PI;
  mainSpike.position.y = -20;
  group.add(mainSpike);

  const subSpike = new THREE.Mesh(new THREE.ConeGeometry(25, 52, 7), darkRockMat);
  subSpike.rotation.x = Math.PI;
  subSpike.position.set(5, -26, -4);
  group.add(subSpike);

  // Peripheral hanging rock shards
  const shards = [
    { x: -32, z: 14, r: 14, h: 26 },
    { x: 30, z: -18, r: 16, h: 30 },
    { x: -22, z: -28, r: 17, h: 28 },
    { x: 26, z: 28, r: 15, h: 24 },
    { x: 0, z: -36, r: 13, h: 22 },
    { x: -36, z: -10, r: 12, h: 23 },
    { x: 34, z: 10, r: 14, h: 25 },
  ];

  shards.forEach((s) => {
    const shard = new THREE.Mesh(
      new THREE.ConeGeometry(s.r, s.h, 6),
      Math.random() > 0.5 ? rockMat : darkRockMat
    );
    shard.rotation.x = Math.PI + (Math.random() - 0.5) * 0.2;
    shard.rotation.z = (Math.random() - 0.5) * 0.2;
    shard.position.set(s.x, -s.h / 2, s.z);
    group.add(shard);
  });

  group.scale.set(2.9, 2.2, 2.9);
  scene.add(group);
}

// Distant mini floating islands in the sky
function createDistantFloatingIslands(scene) {
  const isles = [
    { x: -190, y: 25, z: -160, scale: 0.55 },
    { x: 210, y: 35, z: -120, scale: 0.65 },
    { x: -170, y: -5, z: 190, scale: 0.45 },
    { x: 160, y: 15, z: 200, scale: 0.55 },
  ];

  const topMat = new THREE.MeshLambertMaterial({ color: 0x4ade80, flatShading: true });
  const bottomMat = new THREE.MeshLambertMaterial({ color: 0x5c4033, flatShading: true });

  isles.forEach((isle) => {
    const group = new THREE.Group();

    // Island green top
    const top = new THREE.Mesh(new THREE.CylinderGeometry(18, 14, 4, 7), topMat);
    top.position.y = 2;
    group.add(top);

    // Island inverted bottom
    const bottom = new THREE.Mesh(new THREE.ConeGeometry(14, 22, 6), bottomMat);
    bottom.rotation.x = Math.PI;
    bottom.position.y = -11;
    group.add(bottom);

    // Mini voxel trees on distant islands
    const treeMat = new THREE.MeshLambertMaterial({ color: 0x166534, flatShading: true });
    for (let i = 0; i < 3; i++) {
      const tree = new THREE.Mesh(new THREE.ConeGeometry(3, 8, 5), treeMat);
      tree.position.set((i - 1) * 5, 8, (Math.random() - 0.5) * 6);
      group.add(tree);
    }

    group.scale.set(isle.scale, isle.scale, isle.scale);
    group.position.set(isle.x, isle.y, isle.z);
    scene.add(group);
  });
}

// Soft puffy voxel clouds
function createPuffyCloud(scene, x, y, z, scale = 1) {
  const group = new THREE.Group();
  const mat = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.88,
    flatShading: true,
  });

  const puffCount = 5 + Math.floor(Math.random() * 3);
  for (let i = 0; i < puffCount; i++) {
    const w = (4 + Math.random() * 3) * scale;
    const h = (2.2 + Math.random() * 1.5) * scale;
    const d = (3 + Math.random() * 2) * scale;
    const puff = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    puff.position.set(
      (i - puffCount / 2) * 2.8 * scale,
      (Math.random() - 0.5) * 1.2 * scale,
      (Math.random() - 0.5) * 2.5 * scale
    );
    group.add(puff);
  }

  group.position.set(x, y, z);
  group.userData = { speed: (0.12 + Math.random() * 0.1) * (scale > 1.2 ? 0.7 : 1.2) };
  scene.add(group);
  return group;
}

export function createWorld(scene) {
  const animatables = { clouds: [] };

  // 1. Hanging rock core underneath the floating sky island
  createFloatingUnderIsland(scene);

  // 2. Distant mini floating islands
  createDistantFloatingIslands(scene);

  // 3. Lower Under-Island Cloud Layer (drifting deep below at y = -30 to -45)
  for (let i = 0; i < 12; i++) {
    const x = (Math.random() - 0.5) * 320;
    const y = -28 - Math.random() * 15;
    const z = (Math.random() - 0.5) * 320;
    animatables.clouds.push(createPuffyCloud(scene, x, y, z, 2.2));
  }

  // 4. Upper Atmosphere Clouds (drifting above at y = 45 to 65)
  for (let i = 0; i < 10; i++) {
    const x = (Math.random() - 0.5) * 300;
    const y = 45 + Math.random() * 20;
    const z = (Math.random() - 0.5) * 300;
    animatables.clouds.push(createPuffyCloud(scene, x, y, z, 1.5));
  }

  // 5. Load Authentic Sketchfab Models
  const loader = new GLTFLoader();

  // Load Main Low Poly Forest Model
  loader.load(
    'assets/models/forest/scene.gltf',
    (gltf) => {
      console.log('✅ Low Poly Forest loaded onto Sky Island!');
      try {
        const forest = gltf.scene;

        // Auto-scale to ~350 units (Vast, spacious, grand RPG sky realm!)
        const box = new THREE.Box3().setFromObject(forest);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.z);
        if (maxDim > 0) {
          const scale = 350.0 / maxDim;
          forest.scale.set(scale, scale, scale);
        }

        // Center horizontally and align base
        const scaledBox = new THREE.Box3().setFromObject(forest);
        const center = scaledBox.getCenter(new THREE.Vector3());
        forest.position.x = -center.x;
        forest.position.z = -center.z;
        forest.position.y = -scaledBox.min.y;

        scene.add(forest);
        forest.updateMatrixWorld(true);

        // PERFORMANCE & COLOR FIDELITY + Extract Walkable Ground & Road Positions
        const roadPositions = [];
        forest.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = false;
            child.receiveShadow = false;

            const materials = Array.isArray(child.material) ? child.material : [child.material];
            materials.forEach((mat) => {
              if (mat) {
                mat.roughness = 0.85;
                mat.metalness = 0.05;
                if (mat.map) {
                  mat.map.colorSpace = THREE.SRGBColorSpace;
                }
              }
            });

            const name = (child.name || '').toLowerCase();
            const parentName = (child.parent && child.parent.name ? child.parent.name : '').toLowerCase();
            const isRoad = name.includes('path') || parentName.includes('path');
            const isTerrain = name.includes('meadow') || parentName.includes('meadow') || name.includes('ground') || parentName.includes('ground');

            if (isRoad || isTerrain) {
              walkableGroundMeshes.push(child);
            }

            if (isRoad) {
              const wp = new THREE.Vector3();
              child.getWorldPosition(wp);
              roadPositions.push({
                name: child.name || (child.parent ? child.parent.name : ''),
                x: +wp.x.toFixed(2),
                y: +wp.y.toFixed(2),
                z: +wp.z.toFixed(2)
              });
            }
          }
        });

        console.log('✅ Walkable ground meshes:', walkableGroundMeshes.length, 'Road points:', roadPositions.length);
        window.__roadPositions = roadPositions;
        window.__walkableGroundMeshes = walkableGroundMeshes;

        // Dispatch event so landmarks and player can immediately snap to the physical road & terrain
        window.dispatchEvent(new CustomEvent('forest-ready', { detail: { roadPositions } }));
      } catch (err) {
        console.error('Error processing forest model:', err);
      }
    },
    undefined,
    (err) => console.error('Error loading forest:', err)
  );

  // Load Voxel Trees Model
  loader.load(
    'assets/models/trees/scene.gltf',
    (gltf) => {
      console.log('✅ Voxel Trees loaded on Sky Island!');
      const treeModel = gltf.scene;
      const box = new THREE.Box3().setFromObject(treeModel);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      if (maxDim > 0) {
        const baseScale = 5.0 / maxDim;
        treeModel.scale.set(baseScale, baseScale, baseScale);
      }
      treeModel.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = false;
          child.receiveShadow = false;
          child.matrixAutoUpdate = false;
          child.updateMatrix();
        }
      });

      const treeSpots = [
        { x: -15, z: 12, s: 1.0, r: 0.3 },
        { x: 18, z: -14, s: 0.9, r: 1.4 },
        { x: -20, z: -20, s: 1.1, r: 2.7 },
        { x: 14, z: 20, s: 1.0, r: 4.0 },
      ];

      treeSpots.forEach((spot) => {
        const clone = treeModel.clone(true);
        const y = getTerrainHeight(spot.x, spot.z);
        clone.position.set(spot.x, y, spot.z);
        clone.rotation.y = spot.r;
        clone.scale.multiplyScalar(spot.s);
        scene.add(clone);
      });
    },
    undefined,
    (err) => console.error('Error loading trees:', err)
  );

  return animatables;
}

export function animateWorld(animatables, time) {
  if (!animatables || !animatables.clouds) return;
  animatables.clouds.forEach((cloud) => {
    cloud.position.x += cloud.userData.speed * 0.03;
    if (cloud.position.x > 95) cloud.position.x = -95;
  });
}
