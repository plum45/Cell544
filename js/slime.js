import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { getTerrainHeight } from './world.js';

// ===== Player State =====
export const player = {
  mesh: null,
  position: new THREE.Vector3(3.3, 1.85, 5.0),
  velocity: new THREE.Vector3(0, 0, 0),
  rotationY: 0,
  targetRotationY: 0,
  isGrounded: true,
  isMoving: false,
  walkSpeed: 4.8, // Smooth, gentle, natural quadruped trot across vast map
  runSpeed: 9.6,  // Smooth, exhilarating sprint when Shift is held
  speed: 4.8,
  currentAvatar: 'fox', // 'fox' | 'slime' | 'sprite'
  avatarGroups: {},
  joystickInput: { x: 0, y: 0 }, // Mobile / iPad virtual joystick
};
window.player = player;

// Movement keys state
export const keys = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  jump: false,
  shift: false,
};

let dustParticles = null;
let dustGeo = null;
let dustPositions = null;
let dustIndex = 0;
const DUST_COUNT = 30;

// Setup keyboard listeners
export function initControls() {
  window.addEventListener('keydown', (e) => {
    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
        keys.forward = true;
        break;
      case 'KeyS':
      case 'ArrowDown':
        keys.backward = true;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        keys.left = true;
        break;
      case 'KeyD':
      case 'ArrowRight':
        keys.right = true;
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        keys.shift = true;
        break;
      case 'Space':
        if (player.isGrounded) {
          player.velocity.y = 10.0;
          player.isGrounded = false;
        }
        e.preventDefault();
        break;
      case 'KeyE':
        window.dispatchEvent(new CustomEvent('player-interact'));
        break;
      case 'KeyM':
      case 'KeyV':
        window.dispatchEvent(new CustomEvent('toggle-aerial-view'));
        break;
      case 'KeyT':
        window.dispatchEvent(new CustomEvent('toggle-treasure-map'));
        break;
      case 'KeyH':
        window.dispatchEvent(new CustomEvent('toggle-tutorial'));
        break;
      case 'Digit1':
        switchAvatar('slime');
        break;
      case 'Digit2':
        switchAvatar('fox');
        break;
      case 'Digit3':
        switchAvatar('sprite');
        break;
    }
  });

  window.addEventListener('keyup', (e) => {
    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
        keys.forward = false;
        break;
      case 'KeyS':
      case 'ArrowDown':
        keys.backward = false;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        keys.left = false;
        break;
      case 'KeyD':
      case 'ArrowRight':
        keys.right = false;
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        keys.shift = false;
        break;
    }
  });
}

// ===== 1. Slime Avatar =====
function buildSlimeAvatar() {
  const group = new THREE.Group();

  // Try loading Sketchfab Minecraft Slime model
  const loader = new GLTFLoader();
  loader.load(
    'assets/models/slime/scene.gltf',
    (gltf) => {
      // Clear procedural fallback if model loads
      while (group.children.length > 0) group.remove(group.children[0]);
      const model = gltf.scene;
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      if (maxDim > 0) {
        const scale = 3.2 / maxDim;
        model.scale.set(scale, scale, scale);
      }
      box.setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      model.position.x -= center.x;
      model.position.y -= box.min.y;
      model.position.z -= center.z;

      group.add(model);
    },
    undefined,
    () => {
      // Procedural fallback
      const bodyGeo = new THREE.SphereGeometry(1.4, 16, 12);
      const bodyMat = new THREE.MeshPhongMaterial({
        color: 0x7CFC00,
        transparent: true,
        opacity: 0.85,
        shininess: 90,
      });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.scale.set(1, 0.8, 1);
      body.position.y = 1.1;
      group.add(body);
    }
  );

  return group;
}

// ===== 2. Cute Animated 4-Legged Fox (Skeletal Rigged Animations) =====
let foxMixer = null;
const foxActions = {};
let currentFoxAction = null;

function buildFoxAvatar() {
  const group = new THREE.Group();

  const loader = new GLTFLoader();
  loader.load(
    'assets/models/fox_animated/Fox.glb',
    (gltf) => {
      console.log('✅ Animated 4-legged Fox loaded! Clips:', gltf.animations.map(a => a.name));
      const model = gltf.scene;
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = false;
          child.receiveShadow = false;
        }
      });

      // Khronos Fox standard scale adjustment (~2.0 units tall)
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      if (maxDim > 0) {
        const targetHeight = 2.0;
        const scale = targetHeight / maxDim;
        model.scale.set(scale, scale, scale);
      }
      box.setFromObject(model);
      model.position.x = 0;
      model.position.y = -box.min.y;
      model.position.z = 0;

      // Skeletal AnimationMixer setup
      foxMixer = new THREE.AnimationMixer(model);
      gltf.animations.forEach((clip) => {
        foxActions[clip.name] = foxMixer.clipAction(clip);
      });

      // Calibrate playback rates for organic step pacing
      if (foxActions['Walk']) foxActions['Walk'].timeScale = 1.05;
      if (foxActions['Run']) foxActions['Run'].timeScale = 1.15;
      if (foxActions['Survey']) foxActions['Survey'].timeScale = 0.85;

      // Start with 4-legged idle 'Survey'
      if (foxActions['Survey']) {
        foxActions['Survey'].play();
        currentFoxAction = 'Survey';
      }

      group.add(model);
    },
    undefined,
    (err) => {
      console.warn('Could not load animated fox glb model', err);
    }
  );

  return group;
}

// ===== 3. Forest Fairy / Sprite Avatar =====
function buildSpriteAvatar() {
  const group = new THREE.Group();

  const bodyMat = new THREE.MeshPhongMaterial({
    color: 0x9333EA,
    emissive: 0xA855F7,
    emissiveIntensity: 0.6,
    shininess: 100,
  });

  // Glowing orb body
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.8, 16, 12), bodyMat);
  body.position.y = 1.6;
  group.add(body);

  // Cute Little Witch/Wizard Hat
  const brimMat = new THREE.MeshPhongMaterial({ color: 0x3B0764 });
  const brim = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.1, 12), brimMat);
  brim.position.y = 2.2;
  group.add(brim);

  const cone = new THREE.Mesh(new THREE.ConeGeometry(0.7, 1.5, 8), brimMat);
  cone.position.set(0, 2.9, -0.1);
  cone.rotation.x = -0.15;
  group.add(cone);

  // Glowing Wings
  const wingMat = new THREE.MeshBasicMaterial({
    color: 0x67E8F9,
    transparent: true,
    opacity: 0.7,
    side: THREE.DoubleSide,
  });
  const wingL = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 1.4), wingMat);
  wingL.position.set(-0.7, 1.7, -0.5);
  wingL.rotation.y = Math.PI / 4;
  group.add(wingL);

  const wingR = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 1.4), wingMat);
  wingR.position.set(0.7, 1.7, -0.5);
  wingR.rotation.y = -Math.PI / 4;
  group.add(wingR);

  // Sparkle light
  const light = new THREE.PointLight(0xA855F7, 2, 8);
  light.position.y = 1.6;
  group.add(light);

  group.userData.wingL = wingL;
  group.userData.wingR = wingR;

  return group;
}

// ===== Dust Particles =====
function initDustParticles(scene) {
  dustGeo = new THREE.BufferGeometry();
  dustPositions = new Float32Array(DUST_COUNT * 3);
  for (let i = 0; i < DUST_COUNT * 3; i++) dustPositions[i] = 0;
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));

  const dustMat = new THREE.PointsMaterial({
    color: 0xFFE082,
    size: 0.4,
    transparent: true,
    opacity: 0.6,
  });

  dustParticles = new THREE.Points(dustGeo, dustMat);
  scene.add(dustParticles);
}

function spawnDust(x, y, z) {
  if (!dustPositions) return;
  const idx = dustIndex * 3;
  dustPositions[idx] = x + (Math.random() - 0.5) * 0.5;
  dustPositions[idx + 1] = y + 0.2;
  dustPositions[idx + 2] = z + (Math.random() - 0.5) * 0.5;
  dustGeo.attributes.position.needsUpdate = true;
  dustIndex = (dustIndex + 1) % DUST_COUNT;
}

// ===== Create Main Player =====
export function createSlime(scene) {
  initControls();
  initDustParticles(scene);

  const container = new THREE.Group();

  // Build the 3 avatars
  player.avatarGroups.slime = buildSlimeAvatar();
  player.avatarGroups.fox = buildFoxAvatar();
  player.avatarGroups.sprite = buildSpriteAvatar();

  // Default to cute fox
  player.avatarGroups.slime.visible = false;
  player.avatarGroups.fox.visible = true;
  player.avatarGroups.sprite.visible = false;

  container.add(player.avatarGroups.slime);
  container.add(player.avatarGroups.fox);
  container.add(player.avatarGroups.sprite);

  // Initial position directly on the open brown road facing central plaza
  const startY = getTerrainHeight(8.0, 18.0);
  player.position.set(8.0, startY, 18.0);
  container.position.copy(player.position);

  // Snap to exact ground when forest model finishes loading
  window.addEventListener('forest-ready', () => {
    player.position.y = getTerrainHeight(player.position.x, player.position.z);
    container.position.y = player.position.y;
    console.log('✅ Player snapped to physical terrain at y =', player.position.y);
  });

  scene.add(container);
  player.mesh = container;

  return container;
}

// ===== Switch Avatar =====
export function switchAvatar(type) {
  if (!player.avatarGroups[type]) return;
  player.currentAvatar = type;
  Object.keys(player.avatarGroups).forEach((k) => {
    player.avatarGroups[k].visible = k === type;
  });
  console.log('Switched avatar to:', type);

  // Dispatch event for UI highlight
  window.dispatchEvent(new CustomEvent('avatar-changed', { detail: { type } }));
}

// ===== Update Player Logic in Animation Loop =====
export function animateSlime(mesh, time, delta, camera) {
  if (!mesh) return;

  const currentDelta = Math.min(delta, 0.05); // cap delta

  // True Camera-Relative Direction (Forward = where screen/camera faces)
  const camForward = new THREE.Vector3();
  const camRight = new THREE.Vector3();

  if (camera) {
    camera.getWorldDirection(camForward);
    camForward.y = 0;
    camForward.normalize();
    // camRight is 90 deg clockwise in XZ plane: (x, z) -> (-z, x) or cross with Up
    camRight.set(-camForward.z, 0, camForward.x).normalize();
  } else {
    camForward.set(0, 0, -1);
    camRight.set(1, 0, 0);
  }

  const moveDir = new THREE.Vector3();

  // Keyboard controls
  if (keys.forward) moveDir.add(camForward);
  if (keys.backward) moveDir.sub(camForward);
  if (keys.right) moveDir.add(camRight);
  if (keys.left) moveDir.sub(camRight);

  // Virtual Joystick input from mobile/iPad
  if (player.joystickInput && (player.joystickInput.x !== 0 || player.joystickInput.y !== 0)) {
    // joystickInput.y is negative when pushed forward/up, positive when pulled backward/down
    moveDir.addScaledVector(camForward, -player.joystickInput.y);
    moveDir.addScaledVector(camRight, player.joystickInput.x);
  }

  player.isMoving = moveDir.lengthSq() > 0.001;

  if (player.isMoving) {
    moveDir.normalize();

    // Smooth rotation towards movement direction
    player.targetRotationY = Math.atan2(moveDir.x, moveDir.z);
    let diff = player.targetRotationY - player.rotationY;
    while (diff < -Math.PI) diff += Math.PI * 2;
    while (diff > Math.PI) diff -= Math.PI * 2;
    player.rotationY += diff * 8.5 * currentDelta;

    // Spawn dust particles
    const isRunning = keys.shift && player.isMoving;
    if (Math.random() < (isRunning ? 0.35 : 0.15)) {
      spawnDust(player.position.x, player.position.y, player.position.z);
    }
  }

  // Smooth Organic Acceleration & Deceleration (No rocket rush!)
  const isRunning = keys.shift && player.isMoving;
  const currentSpeed = isRunning ? player.runSpeed : player.walkSpeed;
  const targetVx = player.isMoving ? moveDir.x * currentSpeed : 0;
  const targetVz = player.isMoving ? moveDir.z * currentSpeed : 0;

  // Gentle, cushioned acceleration and smooth braking
  const accelRate = player.isMoving ? 4.2 : 5.2;

  player.velocity.x = THREE.MathUtils.lerp(player.velocity.x, targetVx, accelRate * currentDelta);
  player.velocity.z = THREE.MathUtils.lerp(player.velocity.z, targetVz, accelRate * currentDelta);

  player.position.x += player.velocity.x * currentDelta;
  player.position.z += player.velocity.z * currentDelta;

  // Boundary constraint (keep inside expanded island radius ~136)
  const distFromCenter = Math.sqrt(player.position.x ** 2 + player.position.z ** 2);
  if (distFromCenter > 136) {
    const angle = Math.atan2(player.position.z, player.position.x);
    player.position.x = Math.cos(angle) * 136;
    player.position.z = Math.sin(angle) * 136;
    player.velocity.x = 0;
    player.velocity.z = 0;
  }

  // Apply Gravity & Ground Collision
  const groundY = getTerrainHeight(player.position.x, player.position.z);
  player.velocity.y -= 26.0 * currentDelta; // gravity
  player.position.y += player.velocity.y * currentDelta;

  if (player.position.y <= groundY) {
    player.position.y = groundY;
    player.velocity.y = 0;
    player.isGrounded = true;
  }

  // Update Mesh Position & Rotation
  mesh.position.copy(player.position);
  mesh.rotation.y = player.rotationY;

  // Visual Animation Per Avatar
  if (player.currentAvatar === 'slime') {
    const bounceSpeed = player.isMoving ? (isRunning ? 18 : 12) : 3;
    const bounceAmp = player.isMoving ? (isRunning ? 0.45 : 0.3) : 0.12;
    const squash = Math.sin(time * bounceSpeed);
    const sy = 1 + squash * bounceAmp;
    const sxz = 1 - squash * (bounceAmp * 0.5);
    player.avatarGroups.slime.scale.set(sxz, sy, sxz);
  } else if (player.currentAvatar === 'fox') {
    if (foxMixer) {
      foxMixer.update(currentDelta);
      // Seamlessly switch between idle (Survey), gentle walk (Walk), and sprint (Run)
      const targetAction = player.isMoving ? (isRunning ? 'Run' : 'Walk') : 'Survey';
      if (currentFoxAction !== targetAction && foxActions[targetAction]) {
        const prev = foxActions[currentFoxAction];
        const next = foxActions[targetAction];
        if (prev) prev.fadeOut(0.24);
        next.reset().fadeIn(0.24).play();
        currentFoxAction = targetAction;
      }
    }
  } else if (player.currentAvatar === 'sprite') {
    // Hovering fairy motion
    player.avatarGroups.sprite.position.y = Math.sin(time * 4) * 0.3 + 0.3;
    const wingL = player.avatarGroups.sprite.userData.wingL;
    const wingR = player.avatarGroups.sprite.userData.wingR;
    if (wingL && wingR) {
      const wingFlap = Math.sin(time * 25) * 0.5;
      wingL.rotation.y = Math.PI / 4 + wingFlap;
      wingR.rotation.y = -Math.PI / 4 - wingFlap;
    }
  }
}
