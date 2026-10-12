import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { getTerrainHeight } from './world.js';

export const animalsList = [];
let animalsGroup = null;
const animalMixers = [];

// Particle system for animal interaction bursts
let heartParticles = null;
let heartGeo = null;
let heartPos = null;
let heartIndex = 0;
const HEART_COUNT = 50;

function initHeartParticles(scene) {
  heartGeo = new THREE.BufferGeometry();
  heartPos = new Float32Array(HEART_COUNT * 3);
  for (let i = 0; i < HEART_COUNT * 3; i++) heartPos[i] = 0;
  heartGeo.setAttribute('position', new THREE.BufferAttribute(heartPos, 3));

  const heartMat = new THREE.PointsMaterial({
    color: 0xf472b6,
    size: 0.75,
    transparent: true,
    opacity: 0.9,
  });

  heartParticles = new THREE.Points(heartGeo, heartMat);
  scene.add(heartParticles);
}

export function spawnHeartBurst(x, y, z) {
  if (!heartPos) return;
  for (let i = 0; i < 10; i++) {
    const idx = ((heartIndex + i) % HEART_COUNT) * 3;
    heartPos[idx] = x + (Math.random() - 0.5) * 1.6;
    heartPos[idx + 1] = y + 0.8 + Math.random() * 1.4;
    heartPos[idx + 2] = z + (Math.random() - 0.5) * 1.6;
  }
  heartIndex = (heartIndex + 10) % HEART_COUNT;
  heartGeo.attributes.position.needsUpdate = true;
}

// Helper to normalize and auto-scale models cleanly
function normalizeModel(model, targetHeight) {
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  if (maxDim > 0) {
    const scale = targetHeight / maxDim;
    model.scale.set(scale, scale, scale);
  }
  box.setFromObject(model);
  const center = box.getCenter(new THREE.Vector3());
  model.position.x = -center.x;
  model.position.y = -box.min.y;
  model.position.z = -center.z;

  // Optimize materials
  model.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = false;
      child.receiveShadow = false;
      if (child.material) {
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((m) => {
          m.roughness = 0.8;
          m.metalness = 0.1;
        });
      }
    }
  });

  const wrapper = new THREE.Group();
  wrapper.add(model);
  return wrapper;
}

// ===== Initialize All Wildlife Animals with Real 3D GLB Models =====
export function createAnimals(scene) {
  animalsGroup = new THREE.Group();
  initHeartParticles(scene);

  const loader = new GLTFLoader();

  // 1. Authentic Animated Deer / Moose (In the Sunlit Glade beside the expanded road)
  loader.load('assets/models/animals/Moose.glb', (gltf) => {
    console.log('✅ Real 3D Animated Deer/Moose loaded!');
    const raw = gltf.scene;

    // Grounded hooves calibration (no floating, standing firmly on the grass)
    raw.scale.set(0.38, 0.38, 0.38);
    raw.position.set(0, -0.65, 0);

    const deer = new THREE.Group();
    deer.add(raw);

    const pos = { x: 31.0, z: -15.0 };
    const y = getTerrainHeight(pos.x, pos.z);
    deer.position.set(pos.x, y, pos.z);
    deer.rotation.y = Math.PI * 0.75; // face gently towards the road

    deer.userData = {
      name: 'กวางป่าน้อย',
      prompt: 'ลูบหัวกวางป่าน้อย 🦌',
      toast: '✨ กวางป่าน้อยกระพริบตาปริบๆ และเอาหัวมาคลอเคลียมือคุณอย่างอ่อนโยน 🦌💖',
      type: 'moose',
      baseY: y,
    };

    if (gltf.animations && gltf.animations.length > 0) {
      const mixer = new THREE.AnimationMixer(raw);
      const action = mixer.clipAction(gltf.animations[0]);
      action.timeScale = 0.55;
      action.play();
      animalMixers.push(mixer);
    }

    animalsList.push(deer);
    animalsGroup.add(deer);
  }, undefined, (err) => console.warn('Could not load Moose.glb', err));

  // 2. Authentic Animated Wild Horse (On the spacious meadow lawn near the Windmill)
  loader.load('assets/models/animals/Horse.glb', (gltf) => {
    console.log('✅ Real 3D Animated Horse loaded!');
    const raw = gltf.scene;

    // Direct proportional calibration (height 2.4 units, hooves grounded at y = 0)
    raw.scale.set(0.0022, 0.0022, 0.0022);
    raw.position.set(0, 0.76, 0);

    const horse = new THREE.Group();
    horse.add(raw);

    const pos = { x: 52.0, z: -25.0 };
    const y = getTerrainHeight(pos.x, pos.z);
    horse.position.set(pos.x, y, pos.z);
    horse.rotation.y = -Math.PI / 3;

    horse.userData = {
      name: 'ม้าป่าสีน้ำตาล',
      prompt: 'ลูบแผงคอม้าป่า 🐎',
      toast: '🌾 ม้าป่าส่งเสียงร้องทักทายอย่างสง่างาม แล้วกระดิกหูรับสัมผัสของคุณ! 🐎✨',
      type: 'horse',
      baseY: y,
    };

    if (gltf.animations && gltf.animations.length > 0) {
      const mixer = new THREE.AnimationMixer(raw);
      const action = mixer.clipAction(gltf.animations[0]);
      action.timeScale = 0.35;
      action.play();
      animalMixers.push(mixer);
    }

    animalsList.push(horse);
    animalsGroup.add(horse);
  }, undefined, (err) => console.warn('Could not load Horse.glb', err));

  // 3. Authentic Animated Bear Cub (In the berry garden near the Botanical Cottage)
  loader.load('assets/models/animals/Bear.glb', (gltf) => {
    console.log('✅ Real 3D Animated Bear loaded!');
    const raw = gltf.scene;

    raw.scale.set(0.65, 0.65, 0.65);
    raw.position.set(0, 0, 0);

    const bear = new THREE.Group();
    bear.add(raw);

    const pos = { x: 12.0, z: -35.0 };
    const y = getTerrainHeight(pos.x, pos.z);
    bear.position.set(pos.x, y, pos.z);
    bear.rotation.y = Math.PI / 2.5;

    bear.userData = {
      name: 'หมีน้อยใจดี',
      prompt: 'ทักทายลูกหมีน้อย 🐻',
      toast: '🍓 ลูกหมีน้อยกำลังแทะผลเบอร์รี่หวานฉ่ำ แล้วหันมาโบกอุ้งมือทักทายคุณ! 🐻⭐',
      type: 'bear',
      baseY: y,
    };

    if (gltf.animations && gltf.animations.length > 0) {
      const mixer = new THREE.AnimationMixer(raw);
      const action = mixer.clipAction(gltf.animations[0]);
      action.timeScale = 0.45;
      action.play();
      animalMixers.push(mixer);
    }

    animalsList.push(bear);
    animalsGroup.add(bear);
  }, undefined, (err) => console.warn('Could not load Bear.glb', err));

  // 4. Authentic Animated Pink Flamingo (In the expanded forest lake)
  loader.load('assets/models/animals/Flamingo.glb', (gltf) => {
    console.log('✅ Real 3D Animated Flamingo loaded!');
    const raw = gltf.scene;
    raw.scale.set(0.012, 0.012, 0.012);

    const flamingo = new THREE.Group();
    flamingo.add(raw);

    flamingo.position.set(-14.0, 1.35, 38.5);
    flamingo.rotation.y = -Math.PI / 4;

    flamingo.userData = {
      name: 'นกฟลามิงโกสีชมพู',
      prompt: 'ทักทายนกฟลามิงโก 🦩',
      toast: '💖 นกฟลามิงโกสีชมพูกระพือปีกสวยงามและก้มคำนับต้อนรับคุณริมสระน้ำ! 🦩🌊',
      type: 'flamingo',
      baseY: 1.35,
    };

    if (gltf.animations && gltf.animations.length > 0) {
      const mixer = new THREE.AnimationMixer(raw);
      const action = mixer.clipAction(gltf.animations[0]);
      action.timeScale = 0.5;
      action.play();
      animalMixers.push(mixer);
    }

    animalsList.push(flamingo);
    animalsGroup.add(flamingo);
  }, undefined, (err) => console.warn('Could not load Flamingo.glb', err));

  // 5. Authentic Animated White Stork (Standing at lake edge)
  loader.load('assets/models/animals/Stork.glb', (gltf) => {
    console.log('✅ Real 3D Animated Stork loaded!');
    const raw = gltf.scene;
    raw.scale.set(0.012, 0.012, 0.012);

    const stork = new THREE.Group();
    stork.add(raw);

    stork.position.set(-24.5, 1.4, 45.5);
    stork.rotation.y = Math.PI / 3;

    stork.userData = {
      name: 'นกกระสาขาว',
      prompt: 'ทักทายนกกระสาขาว 🪶',
      toast: '🪶 นกกระสาขาวขยับปีกสีขาวบริสุทธิ์และมองดูสายน้ำอันสงบเงียบ 🪶✨',
      type: 'stork',
      baseY: 1.4,
    };

    if (gltf.animations && gltf.animations.length > 0) {
      const mixer = new THREE.AnimationMixer(raw);
      const action = mixer.clipAction(gltf.animations[0]);
      action.timeScale = 0.4;
      action.play();
      animalMixers.push(mixer);
    }

    animalsList.push(stork);
    animalsGroup.add(stork);
  }, undefined, (err) => console.warn('Could not load Stork.glb', err));

  // 6. Authentic Animated Colorful Parrot (Perched near Guide Bunny's compass lantern)
  loader.load('assets/models/animals/Parrot.glb', (gltf) => {
    console.log('✅ Real 3D Animated Parrot loaded!');
    const raw = gltf.scene;
    raw.scale.set(0.009, 0.009, 0.009);

    const parrot = new THREE.Group();
    parrot.add(raw);

    const pos = { x: 16.5, z: 11.2 };
    const y = getTerrainHeight(pos.x, pos.z) + 0.5;
    parrot.position.set(pos.x, y, pos.z);
    parrot.rotation.y = -Math.PI / 2;

    parrot.userData = {
      name: 'นกแก้วสีสดใส',
      prompt: 'ฟังเสียงนกแก้ว 🦜',
      toast: '🎶 นกแก้วส่งเสียงร้องทักทาย "ยินดีต้อนรับสู่เกาะเซลล์ลอยฟ้า!" 🦜🎵',
      type: 'parrot',
      baseY: y,
    };

    if (gltf.animations && gltf.animations.length > 0) {
      const mixer = new THREE.AnimationMixer(raw);
      const action = mixer.clipAction(gltf.animations[0]);
      action.timeScale = 0.6;
      action.play();
      animalMixers.push(mixer);
    }

    animalsList.push(parrot);
    animalsGroup.add(parrot);
  }, undefined, (err) => console.warn('Could not load Parrot.glb', err));

  // 7. Authentic Khronos Swimming Duck (Paddling on the expanded lake)
  loader.load('assets/models/duck/Duck.glb', (gltf) => {
    console.log('✅ Real 3D Swimming Duck loaded!');
    const raw = gltf.scene;
    const duck = normalizeModel(raw, 0.95);

    duck.position.set(-19.0, 1.35, 35.0);
    duck.userData = {
      name: 'เป็ดน้อยลอยน้ำ',
      type: 'duck',
      center: { x: -19.0, z: 35.0 },
      radius: 4.8,
      speed: 0.45,
      prompt: 'ให้อาหารเป็ดน้อย 🦆',
      toast: '✨ "กว๊าก กว๊าก!" เป็ดน้อยว่ายน้ำวนรอบแล้วก้มขอบคุณอย่างร่าเริง! 🦆🌊',
      baseY: 1.35,
    };

    animalsList.push(duck);
    animalsGroup.add(duck);
  }, undefined, (err) => console.warn('Could not load Duck.glb', err));

  // Snap land animals to physical terrain once forest loads
  window.addEventListener('forest-ready', () => {
    animalsList.forEach((a) => {
      if (a.userData && a.userData.type !== 'duck' && a.userData.type !== 'flamingo') {
        const realY = getTerrainHeight(a.position.x, a.position.z);
        if (a.userData.type === 'parrot') {
          a.position.y = realY + 0.5;
        } else {
          a.position.y = realY;
        }
      }
    });
    console.log('✅ Real 3D animals snapped to terrain!');
  });

  scene.add(animalsGroup);
  return animalsGroup;
}

// ===== Animate Animals =====
export function animateAnimals(time, delta) {
  // Update all real skeletal & morph target mixers
  animalMixers.forEach((mixer) => mixer.update(delta));

  // Duck swimming circular path
  animalsList.forEach((animal) => {
    const ud = animal.userData;
    if (!ud) return;

    if (ud.type === 'duck') {
      const angle = time * ud.speed;
      animal.position.x = ud.center.x + Math.cos(angle) * ud.radius;
      animal.position.z = ud.center.z + Math.sin(angle) * ud.radius;
      animal.position.y = 1.35 + Math.sin(time * 3) * 0.03;
      animal.rotation.y = -angle + Math.PI / 2;
    }
  });

  // Float heart particles gently upward
  if (heartPos) {
    for (let i = 0; i < HEART_COUNT; i++) {
      const idx = i * 3 + 1;
      if (heartPos[idx] > 0) {
        heartPos[idx] += 0.03;
      }
    }
    heartGeo.attributes.position.needsUpdate = true;
  }
}

// ===== Proximity Check for Animals =====
export function getNearbyAnimal(playerPos, maxDist = 5.5) {
  if (!playerPos) return null;
  let closest = null;
  let minDist = maxDist;

  animalsList.forEach((a) => {
    const d = playerPos.distanceTo(a.position);
    if (d < minDist) {
      minDist = d;
      closest = a;
    }
  });

  return closest;
}
