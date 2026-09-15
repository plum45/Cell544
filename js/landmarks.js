import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { getTerrainHeight } from './world.js';
import { CONTENT_DATA } from './content.js';

// Landmark positions directly along the authentic brown road (Expanded 350-unit Sky Island)
const LANDMARK_CONFIGS = [
  { contentId: 'gene-expression', x: 3.0, z: -45.2, rotY: 0, builder: buildBotanicalCottage },
  { contentId: 'gene-regulation', x: 68.6, z: -45.2, rotY: -Math.PI / 4, builder: buildMagicWindmill },
  { contentId: 'cell-signaling', x: 96.3, z: 3.0, rotY: -Math.PI / 2, builder: buildSignalLighthouse },
  { contentId: 'cell-response', x: 77.4, z: 51.1, rotY: -Math.PI * 0.6, builder: buildEnergyPavilion },
  { contentId: 'cell-cycle', x: 18.9, z: 80.2, rotY: Math.PI * 0.8, builder: buildClockworkObservatory },
  { contentId: 'apoptosis', x: -55.5, z: 32.0, rotY: Math.PI / 2, builder: buildAncientSanctuary },
  { contentId: 'quiz-hub', x: 0.0, z: 0.0, rotY: Math.PI * 0.25, builder: buildQuizHouse },
];

// ===== Common Material Palettes =====
const woodWallMat = new THREE.MeshLambertMaterial({ color: 0x8d5b38, flatShading: true });
const darkWoodMat = new THREE.MeshLambertMaterial({ color: 0x50331f, flatShading: true });
const stoneMat = new THREE.MeshLambertMaterial({ color: 0x8a929a, flatShading: true });
const darkStoneMat = new THREE.MeshLambertMaterial({ color: 0x5a626a, flatShading: true });
const roofTileMat = new THREE.MeshLambertMaterial({ color: 0x9e382b, flatShading: true });
const blueRoofMat = new THREE.MeshLambertMaterial({ color: 0x2b5b84, flatShading: true });
const copperRoofMat = new THREE.MeshLambertMaterial({ color: 0x478978, flatShading: true });
const glowingWindowMat = new THREE.MeshBasicMaterial({ color: 0xffe28a });

// ===== 1. Picturesque Holiday Home / Botanical Cottage (Authentic Sketchfab Model) =====
function buildBotanicalCottage(group, content) {
  // Low-poly fallback while glTF loads
  const tempBody = new THREE.Mesh(new THREE.BoxGeometry(8, 6, 7), woodWallMat);
  tempBody.position.y = 3;
  group.add(tempBody);

  const loader = new GLTFLoader();
  loader.load(
    'assets/models/house/scene.gltf',
    (gltf) => {
      group.remove(tempBody);
      const model = gltf.scene;

      // Lock performance at 60 FPS
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = false;
          child.receiveShadow = false;
          child.matrixAutoUpdate = false;
          child.updateMatrix();
        }
      });

      // Fit to grand diorama scale
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      if (maxDim > 0) {
        const targetScale = 22.0 / maxDim;
        model.scale.set(targetScale, targetScale, targetScale);
      }
      box.setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      model.position.x -= center.x;
      model.position.y -= box.min.y;
      model.position.z -= center.z;

      group.add(model);
    },
    undefined,
    (err) => {
      console.warn('Could not load house gltf, keeping cottage', err);
    }
  );
}

// ===== 2. Magic Windmill (Gene Regulation) =====
function buildMagicWindmill(group, content) {
  // Round stone windmill tower
  const tower = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 3.2, 7.5, 8), stoneMat);
  tower.position.y = 3.75;
  group.add(tower);

  // Conical roof
  const roof = new THREE.Mesh(new THREE.ConeGeometry(3.0, 3.5, 8), blueRoofMat);
  roof.position.y = 9.2;
  group.add(roof);

  // Windmill Blades Center Hub
  const hubMat = new THREE.MeshLambertMaterial({ color: 0x333333 });
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.8, 8), hubMat);
  hub.rotation.x = Math.PI / 2;
  hub.position.set(0, 6.8, 2.5);

  // 4 Windmill Blades
  const bladeGroup = new THREE.Group();
  const bladeMat = new THREE.MeshLambertMaterial({ color: 0xf3f4f6, side: THREE.DoubleSide });
  const woodFrameMat = new THREE.MeshLambertMaterial({ color: 0x5c4033 });

  for (let i = 0; i < 4; i++) {
    const arm = new THREE.Group();
    arm.rotation.z = (i * Math.PI) / 2;

    const stick = new THREE.Mesh(new THREE.BoxGeometry(0.15, 4.5, 0.15), woodFrameMat);
    stick.position.y = 2.25;
    arm.add(stick);

    const sail = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 3.8), bladeMat);
    sail.position.set(0.5, 2.4, 0.05);
    arm.add(sail);

    bladeGroup.add(arm);
  }

  bladeGroup.position.set(0, 6.8, 2.6);
  group.add(hub);
  group.add(bladeGroup);
  group.userData.blades = bladeGroup;

  // Door
  const door = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.9, 0.2), darkWoodMat);
  door.position.set(0, 0.95, 2.9);
  group.add(door);
}

// ===== 3. Signal Lighthouse (Cell Signaling) =====
function buildSignalLighthouse(group, content) {
  // Stepped octagonal stone lighthouse tower
  const base = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.8, 3, 8), darkStoneMat);
  base.position.y = 1.5;
  group.add(base);

  const middle = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 3.1, 7, 8), stoneMat);
  middle.position.y = 6.5;
  group.add(middle);

  // Top observation deck
  const deck = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 2.8, 0.5, 8), darkStoneMat);
  deck.position.y = 10.25;
  group.add(deck);

  // Glass lantern room
  const glassMat = new THREE.MeshLambertMaterial({
    color: 0xfde047,
    transparent: true,
    opacity: 0.7,
    emissive: 0xeab308,
    emissiveIntensity: 0.6,
  });
  const lanternRoom = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 2.0, 8), glassMat);
  lanternRoom.position.y = 11.5;
  group.add(lanternRoom);

  // Point light radiating signals
  const beaconLight = new THREE.PointLight(0xf59e0b, 3.0, 20);
  beaconLight.position.y = 11.5;
  group.add(beaconLight);

  // Dome cap
  const dome = new THREE.Mesh(new THREE.ConeGeometry(2.2, 1.8, 8), copperRoofMat);
  dome.position.y = 13.4;
  group.add(dome);

  // Signal waves (concentric expanding rings)
  for (let i = 0; i < 2; i++) {
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(new THREE.RingGeometry(3 + i * 2, 3.4 + i * 2, 24), ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 11.5;
    group.add(ring);
    group.userData[`signalRing${i}`] = ring;
  }
}

// ===== 4. Arcane Energy Pavilion (Cell Response) =====
function buildEnergyPavilion(group, content) {
  // Stepped octagonal marble base
  const step1 = new THREE.Mesh(new THREE.CylinderGeometry(4.8, 5.2, 0.5, 8), darkStoneMat);
  step1.position.y = 0.25;
  group.add(step1);

  const step2 = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.5, 0.4, 8), stoneMat);
  step2.position.y = 0.7;
  group.add(step2);

  // 6 Classical Pillars
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI * 2) / 6;
    const px = Math.cos(angle) * 3.4;
    const pz = Math.sin(angle) * 3.4;

    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, 5.0, 6), stoneMat);
    pillar.position.set(px, 3.4, pz);
    group.add(pillar);
  }

  // Stone dome canopy
  const canopy = new THREE.Mesh(new THREE.ConeGeometry(4.2, 2.2, 8), copperRoofMat);
  canopy.position.y = 6.9;
  group.add(canopy);

  // Floating Arcane Energy Orb in the center
  const orbMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
  const orb = new THREE.Mesh(new THREE.SphereGeometry(0.9, 14, 10), orbMat);
  orb.position.y = 3.5;
  group.add(orb);
  group.userData.energyOrb = orb;

  const orbLight = new THREE.PointLight(0x38bdf8, 2.5, 14);
  orbLight.position.y = 3.5;
  group.add(orbLight);
}

// ===== 5. Clockwork Observatory (Cell Cycle) =====
function buildClockworkObservatory(group, content) {
  // Hexagonal observatory base
  const base = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 4.0, 4.5, 6), darkStoneMat);
  base.position.y = 2.25;
  group.add(base);

  // Rotating brass dome
  const domeMat = new THREE.MeshLambertMaterial({ color: 0xd97706, flatShading: true });
  const dome = new THREE.Mesh(new THREE.SphereGeometry(3.2, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), domeMat);
  dome.position.y = 4.5;
  group.add(dome);

  // Big Astronomical Telescope sticking out
  const scopeMat = new THREE.MeshLambertMaterial({ color: 0x475569 });
  const telescope = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.6, 5.5, 8), scopeMat);
  telescope.position.set(0.8, 6.2, 1.2);
  telescope.rotation.x = Math.PI / 4;
  telescope.rotation.z = -Math.PI / 8;
  group.add(telescope);

  // 4-Phase Cycle Ring above the dome (G1, S, G2, M)
  const ringGroup = new THREE.Group();
  const phaseColors = [0x4ade80, 0x38bdf8, 0xf59e0b, 0xef4444]; // Green, Blue, Amber, Red
  for (let i = 0; i < 4; i++) {
    const arcMat = new THREE.MeshBasicMaterial({
      color: phaseColors[i],
      side: THREE.DoubleSide,
    });
    const arc = new THREE.Mesh(new THREE.TorusGeometry(3.6, 0.18, 6, 12, Math.PI / 2.2), arcMat);
    arc.rotation.z = (i * Math.PI) / 2;
    ringGroup.add(arc);
  }
  ringGroup.rotation.x = Math.PI / 2;
  ringGroup.position.y = 4.6;
  group.add(ringGroup);
  group.userData.cycleRing = ringGroup;
}

// ===== 6. Ancient Stone Sanctuary (Apoptosis) =====
function buildAncientSanctuary(group, content) {
  // Sunken stone altar foundation
  const foundation = new THREE.Mesh(new THREE.BoxGeometry(8, 0.6, 7), darkStoneMat);
  foundation.position.y = 0.3;
  group.add(foundation);

  // 2 Giant Obelisk Gateway Pillars
  const obeliskL = new THREE.Mesh(new THREE.BoxGeometry(1.2, 7.5, 1.2), stoneMat);
  obeliskL.position.set(-2.6, 4.0, 0);
  group.add(obeliskL);

  const obeliskR = new THREE.Mesh(new THREE.BoxGeometry(1.2, 7.5, 1.2), stoneMat);
  obeliskR.position.set(2.6, 4.0, 0);
  group.add(obeliskR);

  // Top lintel stone
  const archTop = new THREE.Mesh(new THREE.BoxGeometry(6.6, 1.1, 1.4), darkStoneMat);
  archTop.position.set(0, 8.0, 0);
  group.add(archTop);

  // Mystic Soul Brazier in center
  const brazierMat = new THREE.MeshLambertMaterial({ color: 0x332244 });
  const brazier = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.5, 1.4, 6), brazierMat);
  brazier.position.y = 1.0;
  group.add(brazier);

  // Glowing Purple Soul Flame
  const flameMat = new THREE.MeshBasicMaterial({ color: 0xc084fc });
  const flame = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1.2, 6), flameMat);
  flame.position.y = 2.2;
  group.add(flame);
  group.userData.soulFlame = flame;

  const soulLight = new THREE.PointLight(0xa855f7, 2.5, 12);
  soulLight.position.y = 2.2;
  group.add(soulLight);
}

// ===== 7. Modular Fantasy House (คลังข้อสอบ / Exam Hub) =====
function buildQuizHouse(group, content) {
  // Low-poly fallback while glTF loads
  const tempBody = new THREE.Mesh(new THREE.BoxGeometry(8, 7, 8), woodWallMat);
  tempBody.position.y = 3.5;
  group.add(tempBody);

  const loader = new GLTFLoader();
  loader.load(
    'assets/models/quiz_house/scene.gltf',
    (gltf) => {
      group.remove(tempBody);
      const model = gltf.scene;

      // Remove loose modular kit parts, keep only the assembled fantasy house
      const toRemove = [];
      model.traverse((child) => {
        if (child.isMesh) {
          let isHouse = false;
          let p = child;
          while (p && p !== model) {
            if (p.name && p.name.includes('obj_house')) {
              isHouse = true;
              break;
            }
            p = p.parent;
          }
          if (!isHouse) {
            toRemove.push(child);
          } else {
            child.castShadow = false;
            child.receiveShadow = false;
            if (child.material) {
              const mats = Array.isArray(child.material) ? child.material : [child.material];
              mats.forEach((m) => {
                if (m) {
                  m.roughness = 0.85;
                  m.metalness = 0.05;
                  if (m.map) m.map.colorSpace = THREE.SRGBColorSpace;
                }
              });
            }
          }
        }
      });
      toRemove.forEach((c) => {
        if (c.parent) c.parent.remove(c);
      });

      // Fit to grand diorama scale
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      if (maxDim > 0) {
        const targetScale = 22.0 / maxDim;
        model.scale.set(targetScale, targetScale, targetScale);
      }

      box.setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      model.position.x -= center.x;
      model.position.y -= box.min.y;
      model.position.z -= center.z;

      group.add(model);

      // Add golden glowing quest beacon right atop the roof peak
      const houseHeight = box.max.y - box.min.y;
      const beaconMat = new THREE.MeshBasicMaterial({ color: 0xF59E0B });
      const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.8, 8, 8), beaconMat);
      beacon.position.set(0, houseHeight + 0.8, 0);
      group.add(beacon);

      const light = new THREE.PointLight(0xFBBF24, 1.4, 25);
      light.position.set(0, houseHeight + 0.8, 0);
      group.add(light);

      console.log('✅ Modular Fantasy House (คลังข้อสอบ) assembled & added to Sky Island!');
    },
    undefined,
    (err) => {
      console.warn('Could not load quiz house model', err);
    }
  );
}

// ===== Create All Landmark Buildings =====
export function createLandmarks(scene) {
  const landmarks = [];

  LANDMARK_CONFIGS.forEach((config) => {
    const group = new THREE.Group();
    const content = CONTENT_DATA.find((c) => c.id === config.contentId);

    // Build the architectural landmark
    config.builder(group, content);

    // Position securely on terrain
    const y = getTerrainHeight(config.x, config.z);
    group.position.set(config.x, y, config.z);
    if (config.rotY) group.rotation.y = config.rotY;

    // Lightweight Raycasting Hitbox
    const hitGeo = new THREE.CylinderGeometry(5.0, 5.0, 14, 8);
    const hitMat = new THREE.MeshBasicMaterial({ visible: false });
    const hitbox = new THREE.Mesh(hitGeo, hitMat);
    hitbox.position.y = 5;
    hitbox.userData.contentId = config.contentId;
    group.add(hitbox);

    scene.add(group);

    landmarks.push({
      group,
      hitbox,
      contentId: config.contentId,
      content,
      position: new THREE.Vector3(config.x, y + 5.5, config.z),
      worldPosition: new THREE.Vector3(config.x, y, config.z),
    });
  });

  // Re-snap to exact ground when forest model finishes loading
  window.addEventListener('forest-ready', () => {
    // Clear center birch trees right around (0, 0) so the quiz house stands clear & magnificent
    scene.traverse((child) => {
      if (child.parent && (child.parent.name === 'PP_Birch_Tree_06_8' || child.parent.name === 'PP_Birch_Tree_05_8' || child.parent.name === 'PP_Tree_10_14')) {
        child.visible = false;
      }
    });

    landmarks.forEach((lm) => {
      const realY = getTerrainHeight(lm.worldPosition.x, lm.worldPosition.z);
      lm.group.position.y = realY;
      lm.worldPosition.y = realY;
      lm.position.y = realY + 5.5;
    });
    console.log('✅ Landmarks re-snapped to physical terrain!');
  });

  return landmarks;
}

// ===== Animate Landmark Structures =====
export function animateLandmarks(landmarks, time) {
  landmarks.forEach((lm) => {
    const group = lm.group;

    // Windmill blades rotation
    if (group.userData.blades) {
      group.userData.blades.rotation.z = -time * 0.8;
    }

    // Energy Orb hovering & pulse
    if (group.userData.energyOrb) {
      group.userData.energyOrb.position.y = 3.5 + Math.sin(time * 3) * 0.25;
      group.userData.energyOrb.rotation.y = time * 1.5;
    }

    // Cycle Ring rotation
    if (group.userData.cycleRing) {
      group.userData.cycleRing.rotation.z = time * 0.3;
    }

    // Soul Flame flickering
    if (group.userData.soulFlame) {
      const flicker = 1 + Math.sin(time * 8) * 0.15;
      group.userData.soulFlame.scale.set(flicker, 1 + Math.sin(time * 12) * 0.2, flicker);
    }
  });
}
