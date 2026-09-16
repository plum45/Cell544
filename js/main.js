import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createWorld, animateWorld } from './world.js';
import { createSlime, animateSlime, player, switchAvatar } from './slime.js';
import { createLandmarks, animateLandmarks } from './landmarks.js';
import { createGuideNPC, animateGuideNPC, isPlayerNearNPC, setNavigationTarget } from './npc.js';
import { createGrass, animateGrass } from './grass.js';
import { createAnimals, animateAnimals, getNearbyAnimal, spawnHeartBurst } from './animals.js';
import { CONTENT_DATA } from './content.js';
import { initTouchControls } from './touch.js';
import {
  createTreasureChests, animateTreasureChests, getNearestChest,
  openTreasureChest, updateTreasureHUD, showTreasureFoundModal,
  closeTreasureFoundModal, closeTreasureCompleteModal, toggleTreasureMap,
  getAllTreasures,
} from './treasure.js';

// ===== State =====
let state = 'loading'; // 'loading' | 'landing' | 'world' | 'content'
let scene, camera, renderer, controls, clock;
let raycaster, mouse;
let slime, landmarks, worldAnimatables, guideNPC;
let grassGroup, animalsGroup;
let fireflies, pollen;
let hoveredLandmark = null;
let nearestLandmark = null;
let nearestAnimal = null;
let nearestTreasureChest = null;
let isNearNPC = false;
let currentContent = null;
let toastTimer = null;
let isTopView = false;

// ===== DOM Elements =====
const canvas = document.getElementById('canvas3d');
const loadingEl = document.getElementById('loading');
const landingEl = document.getElementById('landing');
const labelsOverlay = document.getElementById('labels-overlay');
const minimapEl = document.getElementById('minimap');
const minimapCanvas = document.getElementById('minimap-canvas');
const hudHint = document.getElementById('hud-hint');
const contentModal = document.getElementById('content-modal');
const npcModal = document.getElementById('npc-modal');

// ===== Initialize =====
function init() {
  clock = new THREE.Clock();
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2(-999, -999);

  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87CEEB);
  scene.fog = new THREE.FogExp2(0xB0D4E8, 0.0035);

  // Camera
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 600);
  camera.position.set(65, 48, 65);
  camera.lookAt(0, 0, 0);

  // Renderer
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace; // Match Sketchfab sRGB color fidelity!
  renderer.shadowMap.enabled = false; // Disable heavy dynamic shadow maps to guarantee 60 FPS
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;

  // Controls
  controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.maxPolarAngle = Math.PI / 2.15;
  controls.minDistance = 6;
  controls.maxDistance = 260;
  controls.target.set(0, 2.5, 0);
  controls.enabled = false; // Disabled until world state

  // Lighting
  setupLighting();

  // Create world
  worldAnimatables = createWorld(scene);

  // Create slime
  slime = createSlime(scene);

  // Create landmarks
  landmarks = createLandmarks(scene);
  window.camera = camera;
  window.controls = controls;
  window.landmarks = landmarks;
  window.scene = scene;

  // Create Guide NPC
  guideNPC = createGuideNPC(scene);

  // Create lush 3D grass & pasture wildflowers
  grassGroup = createGrass(scene);

  // Create wildlife animals & creatures
  animalsGroup = createAnimals(scene);

  // Create treasure chests (Treasure Hunt mini-game)
  createTreasureChests(scene);

  // Create particles
  createFireflies();
  createPollen();

  // Create sky gradient
  createSkyGradient();

  // Initialize mobile & iPad touch controls
  initTouchControls();

  // Events
  window.addEventListener('resize', onResize);
  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('click', onClick);
  document.getElementById('btn-enter').addEventListener('click', enterWorld);
  document.getElementById('modal-close').addEventListener('click', closeContent);
  document.getElementById('modal-backdrop').addEventListener('click', closeContent);

  // NPC Modal Events
  document.getElementById('npc-modal-close')?.addEventListener('click', closeNPCDialog);
  document.getElementById('npc-modal-backdrop')?.addEventListener('click', closeNPCDialog);
  document.getElementById('btn-close-npc')?.addEventListener('click', closeNPCDialog);

  // Guide Navigation Buttons
  document.querySelectorAll('.btn-guide-nav').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      setNavigationTarget(target, landmarks);
      closeNPCDialog();
    });
  });

  // Guide Warp/Teleport Buttons
  document.querySelectorAll('.btn-guide-warp').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      warpToLandmark(target);
    });
  });

  // Character Selector buttons
  ['slime', 'fox', 'sprite'].forEach((type) => {
    const btn = document.getElementById(`btn-char-${type}`);
    if (btn) {
      btn.addEventListener('click', () => switchAvatar(type));
    }
  });

  window.addEventListener('avatar-changed', (e) => {
    ['slime', 'fox', 'sprite'].forEach((type) => {
      const btn = document.getElementById(`btn-char-${type}`);
      if (btn) btn.classList.toggle('active', type === e.detail.type);
    });
  });

  // Aerial Top-Down View Toggle Events
  document.getElementById('btn-toggle-aerial')?.addEventListener('click', toggleTopView);
  document.getElementById('btn-exit-aerial')?.addEventListener('click', () => { if (isTopView) toggleTopView(); });
  document.getElementById('btn-touch-aerial')?.addEventListener('click', toggleTopView);
  window.addEventListener('toggle-aerial-view', toggleTopView);

  // Treasure System Events
  document.getElementById('treasure-counter-btn')?.addEventListener('click', toggleTreasureMap);
  document.getElementById('tf-close-btn')?.addEventListener('click', closeTreasureFoundModal);
  document.getElementById('tc-close-btn')?.addEventListener('click', closeTreasureCompleteModal);
  window.addEventListener('toggle-treasure-map', toggleTreasureMap);

  // Tutorial / Guide Modal Events
  const tutorialModal = document.getElementById('tutorial-modal');
  const btnHelp = document.getElementById('btn-help');
  const btnCloseTutorial = document.getElementById('btn-close-tutorial');

  function openTutorialModal() {
    if (tutorialModal) tutorialModal.classList.add('visible');
  }
  window.openTutorialModal = openTutorialModal;

  function closeTutorialModal() {
    if (tutorialModal) tutorialModal.classList.remove('visible');
    try {
      localStorage.setItem('cell_tutorial_seen', '1');
    } catch (e) {}
  }

  function toggleTutorialModal() {
    if (tutorialModal && tutorialModal.classList.contains('visible')) {
      closeTutorialModal();
    } else {
      openTutorialModal();
    }
  }

  btnHelp?.addEventListener('click', toggleTutorialModal);
  btnCloseTutorial?.addEventListener('click', closeTutorialModal);
  tutorialModal?.addEventListener('click', (e) => {
    if (e.target === tutorialModal) closeTutorialModal();
  });
  window.addEventListener('toggle-tutorial', toggleTutorialModal);

  // Unified Interaction handler (Guide NPC, Animals, Treasure Chests, and Landmark Buildings)
  function handleInteraction() {
    if (state !== 'world') return;
    if (isNearNPC) {
      openNPCDialog();
    } else if (nearestTreasureChest) {
      const treasure = openTreasureChest(nearestTreasureChest, scene);
      if (treasure) {
        showTreasureFoundModal(treasure);
        updateTreasureHUD();
        showPastelToast(`💎 สมบัติ "${treasure.name}" ถูกค้นพบ!`);
      }
    } else if (nearestAnimal) {
      spawnHeartBurst(nearestAnimal.position.x, nearestAnimal.position.y, nearestAnimal.position.z);
      showPastelToast(nearestAnimal.userData.toast || '💖 สัตว์น้อยแสนรู้ส่งเสียงทักทายคุณอย่างเป็นมิตร!');
      // Playful bounce if dog
      if (nearestAnimal.userData.type === 'dog') {
        nearestAnimal.position.y += 0.45;
        setTimeout(() => { nearestAnimal.position.y -= 0.45; }, 220);
      }
    } else if (nearestLandmark) {
      openContent(nearestLandmark.contentId);
    }
  }

  const promptEl = document.getElementById('interact-prompt');
  if (promptEl) {
    promptEl.addEventListener('click', handleInteraction);
  }
  window.addEventListener('player-interact', handleInteraction);

  // Landing particles
  createLandingParticles();

  // Ready
  setTimeout(() => {
    loadingEl.classList.add('hidden');
    state = 'landing';
  }, 1200);

  // Start loop
  animate();
}

// ===== Lighting =====
function setupLighting() {
  // Hemisphere light — sky/ground
  const hemiLight = new THREE.HemisphereLight(0x88BBFF, 0x446633, 0.6);
  scene.add(hemiLight);

  // Directional light — sun
  const sunLight = new THREE.DirectionalLight(0xFFEECC, 1.2);
  sunLight.position.set(30, 40, 20);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.camera.near = 1;
  sunLight.shadow.camera.far = 100;
  sunLight.shadow.camera.left = -50;
  sunLight.shadow.camera.right = 50;
  sunLight.shadow.camera.top = 50;
  sunLight.shadow.camera.bottom = -50;
  sunLight.shadow.bias = -0.001;
  scene.add(sunLight);

  // Ambient
  const ambientLight = new THREE.AmbientLight(0x404050, 0.4);
  scene.add(ambientLight);
}

// ===== Sky Gradient =====
function createSkyGradient() {
  const skyGeo = new THREE.SphereGeometry(450, 16, 12);
  const skyMat = new THREE.ShaderMaterial({
    uniforms: {
      topColor: { value: new THREE.Color(0x4DA6FF) },
      bottomColor: { value: new THREE.Color(0xBFE8FF) },
      offset: { value: 10 },
      exponent: { value: 0.5 },
    },
    vertexShader: `
      varying vec3 vWorldPosition;
      void main() {
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPos.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 topColor;
      uniform vec3 bottomColor;
      uniform float offset;
      uniform float exponent;
      varying vec3 vWorldPosition;
      void main() {
        float h = normalize(vWorldPosition + offset).y;
        gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
      }
    `,
    side: THREE.BackSide,
  });
  const sky = new THREE.Mesh(skyGeo, skyMat);
  scene.add(sky);
}

// ===== Particles =====
function createFireflies() {
  const count = 150;
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 100;
    positions[i * 3 + 1] = 2 + Math.random() * 12;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
    sizes[i] = 0.1 + Math.random() * 0.15;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const mat = new THREE.PointsMaterial({
    color: 0xFFFF88,
    size: 0.3,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });

  fireflies = new THREE.Points(geo, mat);
  scene.add(fireflies);
}

function createPollen() {
  const count = 80;
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 80;
    positions[i * 3 + 1] = 1 + Math.random() * 15;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 80;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const mat = new THREE.PointsMaterial({
    color: 0xFFFFFF,
    size: 0.12,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });

  pollen = new THREE.Points(geo, mat);
  scene.add(pollen);
}

function animateParticles(time) {
  if (fireflies) {
    const pos = fireflies.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      pos.setY(i, pos.getY(i) + Math.sin(time * 2 + i) * 0.005);
      pos.setX(i, pos.getX(i) + Math.cos(time * 1.5 + i * 0.7) * 0.003);
    }
    pos.needsUpdate = true;
    fireflies.material.opacity = 0.4 + Math.sin(time * 3) * 0.3;
  }

  if (pollen) {
    const pos = pollen.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      let y = pos.getY(i) + 0.008;
      if (y > 18) y = 1;
      pos.setY(i, y);
      pos.setX(i, pos.getX(i) + Math.sin(time + i) * 0.002);
    }
    pos.needsUpdate = true;
  }
}

// ===== Landing Page =====
function createLandingParticles() {
  const container = document.getElementById('landing-particles');
  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 6 + 's';
    particle.style.animationDuration = (4 + Math.random() * 4) + 's';
    container.appendChild(particle);
  }
}

function enterWorld() {
  landingEl.classList.add('exit');
  setTimeout(() => {
    landingEl.style.display = 'none';
    state = 'world';
    controls.enabled = true;

    // Position camera behind player facing forward towards the clearing and Library
    camera.position.set(player.position.x, player.position.y + 3.2, player.position.z - 7.5);
    controls.target.set(player.position.x, player.position.y + 1.2, player.position.z + 5.0);
    controls.update();
    try { window.focus(); canvas.focus(); } catch (e) {}

    // Show UI
    setTimeout(() => {
      minimapEl.classList.add('visible');
      hudHint.classList.add('visible');
      // Show Treasure HUD
      const treasureHud = document.getElementById('treasure-hud');
      if (treasureHud) treasureHud.classList.add('visible');
      updateTreasureHUD();
      // Hide hint after some time
      setTimeout(() => hudHint.classList.remove('visible'), 8000);

      // Auto-popup tutorial modal on first visit
      try {
        if (!localStorage.getItem('cell_tutorial_seen')) {
          setTimeout(() => {
            if (window.openTutorialModal) window.openTutorialModal();
          }, 1200);
        }
      } catch (e) {}
    }, 1000);
  }, 600);
}

// ===== Camera Animation =====
let cameraAnimation = null;

function animateCameraTo(targetPos, lookAtPos, duration = 1000) {
  const startPos = camera.position.clone();
  const startTarget = controls.target.clone();
  const startTime = clock.getElapsedTime();

  cameraAnimation = {
    startPos,
    targetPos: targetPos.clone(),
    startTarget,
    lookAtPos: lookAtPos.clone(),
    startTime,
    duration: duration / 1000,
  };
}

function updateCameraAnimation(time) {
  if (!cameraAnimation) return;

  const elapsed = time - cameraAnimation.startTime;
  const progress = Math.min(elapsed / cameraAnimation.duration, 1);

  // Ease out cubic
  const ease = 1 - Math.pow(1 - progress, 3);

  camera.position.lerpVectors(cameraAnimation.startPos, cameraAnimation.targetPos, ease);
  controls.target.lerpVectors(cameraAnimation.startTarget, cameraAnimation.lookAtPos, ease);

  if (progress >= 1) {
    cameraAnimation = null;
  }
}

// ===== Raycasting & Interaction =====
let mouseMoved = false;
function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  mouseMoved = true;
}

function onClick(event) {
  if (state !== 'world' || !landmarks) return;

  raycaster.setFromCamera(mouse, camera);
  const hitboxes = landmarks.map(lm => lm.hitbox);
  const intersects = raycaster.intersectObjects(hitboxes, false);
  if (intersects.length > 0) {
    const hitContentId = intersects[0].object.userData.contentId;
    if (hitContentId) openContent(hitContentId);
  }
}

function checkHover() {
  if (state !== 'world' || !landmarks) return;

  raycaster.setFromCamera(mouse, camera);
  const hitboxes = landmarks.map(lm => lm.hitbox);
  const intersects = raycaster.intersectObjects(hitboxes, false);

  const found = intersects.length > 0
    ? landmarks.find(lm => lm.contentId === intersects[0].object.userData.contentId)
    : null;

  if (found !== hoveredLandmark) {
    canvas.style.cursor = found ? 'pointer' : 'default';
    hoveredLandmark = found;
  }
}

// ===== Content Navigation (Direct Link to Dedicated HTML Page) =====
function openContent(contentId) {
  const content = CONTENT_DATA.find(c => c.id === contentId);
  if (!content) return;

  // Navigate directly to dedicated topic HTML lecture page
  window.location.href = `topics/${contentId}.html`;
}

function closeContent() {
  if (contentModal) contentModal.classList.remove('visible');
  currentContent = null;
  state = 'world';
  controls.enabled = true;
}

// ===== Guide NPC Dialogue Modal =====
function openNPCDialog() {
  if (npcModal) npcModal.classList.add('visible');
  controls.enabled = false;
}

function closeNPCDialog() {
  if (npcModal) npcModal.classList.remove('visible');
  controls.enabled = true;
}

// Show charming pastel toast message
function showPastelToast(msg) {
  const toastEl = document.getElementById('pastel-toast');
  const toastText = document.getElementById('toast-text');
  if (!toastEl || !toastText) return;
  toastText.innerHTML = msg;
  toastEl.classList.add('visible');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastEl.classList.remove('visible');
  }, 4000);
}

// Fast travel teleport along the brown road in front of landmark
function warpToLandmark(contentId) {
  const lm = landmarks.find((l) => l.contentId === contentId);
  if (!lm) return;

  // Move player right onto the road in front of the landmark
  player.position.set(lm.worldPosition.x, lm.worldPosition.y, lm.worldPosition.z);
  if (player.mesh) player.mesh.position.copy(player.position);
  camera.position.set(lm.worldPosition.x - 3.5, lm.worldPosition.y + 3.2, lm.worldPosition.z - 7.0);
  controls.target.set(lm.worldPosition.x, lm.worldPosition.y + 1.2, lm.worldPosition.z);
  controls.update();

  closeNPCDialog();
  console.log('🚀 Warped to landmark along road:', contentId);
}

// ===== Aerial Top-Down Map View (Bird's-Eye Perspective) =====
function toggleTopView() {
  if (state !== 'world') return;
  isTopView = !isTopView;

  const btn = document.getElementById('btn-toggle-aerial');
  const banner = document.getElementById('aerial-banner');
  const touchBtn = document.getElementById('btn-touch-aerial');

  if (isTopView) {
    if (btn) {
      btn.classList.add('active');
      btn.innerHTML = '<span class="aerial-icon">🚶</span><span class="aerial-text">มุมมองปกติ</span>';
      btn.title = 'กลับสู่มุมมองตัวละคร (Normal View) [กด M]';
    }
    if (touchBtn) {
      touchBtn.classList.add('active');
      const icon = touchBtn.querySelector('.touch-btn-icon');
      const label = touchBtn.querySelector('.touch-btn-label');
      if (icon) icon.textContent = '🚶';
      if (label) label.textContent = 'ปกติ';
    }
    if (banner) banner.classList.remove('hidden');

    // Bird's-eye camera high above the central plaza
    controls.maxPolarAngle = Math.PI / 2.05;
    controls.minDistance = 25;
    controls.maxDistance = 350;
    const highCamPos = new THREE.Vector3(0, 160, 45);
    const centerTarget = new THREE.Vector3(0, 6, 0);
    animateCameraTo(highCamPos, centerTarget, 1200);
    showPastelToast('🦅 เข้าสู่โหมดมุมมองแผนที่มุมสูง: หมุนจอเพื่อชมรอบเกาะ หรือคลิกแลนด์มาร์คเพื่อสำรวจ!');
  } else {
    if (btn) {
      btn.classList.remove('active');
      btn.innerHTML = '<span class="aerial-icon">🦅</span><span class="aerial-text">ดูแมพมุมบน</span>';
      btn.title = 'ดูแมพจากด้านบน (Bird\'s-Eye View) [กด M]';
    }
    if (touchBtn) {
      touchBtn.classList.remove('active');
      const icon = touchBtn.querySelector('.touch-btn-icon');
      const label = touchBtn.querySelector('.touch-btn-label');
      if (icon) icon.textContent = '🦅';
      if (label) label.textContent = 'มุมสูง';
    }
    if (banner) banner.classList.add('hidden');

    // Return to third-person follow
    controls.maxPolarAngle = Math.PI / 2.1;
    controls.minDistance = 3.5;
    controls.maxDistance = 45;
    const returnPos = new THREE.Vector3(player.position.x, player.position.y + 3.8, player.position.z + 8.5);
    const returnTarget = new THREE.Vector3(player.position.x, player.position.y + 1.2, player.position.z);
    animateCameraTo(returnPos, returnTarget, 1000);
    showPastelToast('🚶 กลับสู่มุมมองตัวละคร');
  }
}
window.toggleTopView = toggleTopView;

// ===== Labels =====
function updateLabels() {
  if (state !== 'world') {
    labelsOverlay.style.display = 'none';
    return;
  }
  labelsOverlay.style.display = 'block';

  // Create labels if not exist
  if (labelsOverlay.children.length === 0) {
    landmarks.forEach(lm => {
      const label = document.createElement('div');
      label.className = 'landmark-label';
      label.innerHTML = `
        <div class="landmark-label-inner" style="border-color: ${lm.content.color}40">
          <span class="landmark-label-icon">${lm.content.icon}</span>
          <span>${lm.content.thaiTitle}</span>
        </div>
        <div class="landmark-label-arrow" style="border-top-color: ${lm.content.color}60"></div>
      `;
      label.addEventListener('click', () => openContent(lm.contentId));
      labelsOverlay.appendChild(label);
    });
  }

  // Update positions
  const labels = labelsOverlay.children;
  landmarks.forEach((lm, i) => {
    const labelPos = lm.position.clone();
    labelPos.project(camera);

    const x = (labelPos.x * 0.5 + 0.5) * window.innerWidth;
    const y = (-labelPos.y * 0.5 + 0.5) * window.innerHeight;

    const label = labels[i];
    if (labelPos.z < 1 && x > -100 && x < window.innerWidth + 100) {
      label.style.display = 'block';
      const dist = camera.position.distanceTo(lm.worldPosition);
      const scale = Math.max(0.6, Math.min(1.2, 30 / dist));
      label.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -100%) scale(${scale.toFixed(2)})`;
    } else {
      label.style.display = 'none';
    }
  });
}

// ===== Minimap =====
function updateMinimap() {
  if (state !== 'world') return;

  const ctx = minimapCanvas.getContext('2d');
  const w = minimapCanvas.width;
  const h = minimapCanvas.height;

  ctx.clearRect(0, 0, w, h);

  // Background
  ctx.fillStyle = 'rgba(20, 40, 30, 0.8)';
  ctx.fillRect(0, 0, w, h);

  // Grid
  ctx.strokeStyle = 'rgba(74, 222, 128, 0.1)';
  ctx.lineWidth = 0.5;
  for (let i = 0; i < w; i += 20) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke();
  }
  for (let i = 0; i < h; i += 20) {
    ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke();
  }

  // Scale factor: world coords to minimap pixels (adjusted for 350-unit island)
  const scale = w / 390;
  const cx = w / 2;
  const cy = h / 2;

  // Draw landmarks
  landmarks.forEach(lm => {
    const mx = cx + lm.worldPosition.x * scale;
    const my = cy + lm.worldPosition.z * scale;

    ctx.fillStyle = lm.content.color;
    ctx.shadowColor = lm.content.color;
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(mx, my, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Label
    ctx.fillStyle = '#E5E7EB';
    ctx.font = '7px "Pixelify Sans", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(lm.content.icon, mx, my - 7);
  });

  // Player position on minimap
  const playerX = player ? player.position.x : 0;
  const playerZ = player ? player.position.z : 0;
  const px = cx + playerX * scale;
  const py = cy + playerZ * scale;
  ctx.fillStyle = '#7CFC00';
  ctx.shadowColor = '#7CFC00';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.arc(px, py, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Camera direction indicator
  const camDir = new THREE.Vector3();
  camera.getWorldDirection(camDir);
  const camMx = px + camDir.x * 10;
  const camMy = py + camDir.z * 10;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(px, py);
  ctx.lineTo(camMx, camMy);
  ctx.stroke();
}

// ===== Proximity to NPC, Animals, and Landmark Buildings =====
function checkProximity() {
  if (state !== 'world' || !landmarks || !player.mesh) return;

  const promptEl = document.getElementById('interact-prompt');
  const promptText = document.getElementById('prompt-text');
  if (!promptEl || !promptText) return;

  // 1. Check if near Guide NPC
  if (isPlayerNearNPC()) {
    isNearNPC = true;
    nearestLandmark = null;
    nearestAnimal = null;
    promptText.innerHTML = 'คุยกับ <strong>ศาสตราจารย์บันนี่ (ผู้นำทาง) 🧭</strong>';
    promptEl.classList.add('visible');
    return;
  }

  isNearNPC = false;

  // 2. Check if near any treasure chest
  nearestTreasureChest = getNearestChest(player.position, 5.0);
  if (nearestTreasureChest) {
    nearestLandmark = null;
    nearestAnimal = null;
    const t = getAllTreasures().find(t => t.id === nearestTreasureChest.treasureId);
    promptText.innerHTML = `เปิดหีบสมบัติ <strong>${t ? t.emoji + ' ' + t.name : '💎'}</strong>`;
    promptEl.classList.add('visible');
    return;
  }

  // 3. Check if near any friendly wildlife animal
  nearestAnimal = getNearbyAnimal(player.position, 5.2);
  if (nearestAnimal) {
    nearestLandmark = null;
    promptText.innerHTML = nearestAnimal.userData.prompt || 'ทักทายสัตว์น้อย 🐾';
    promptEl.classList.add('visible');
    return;
  }

  // 4. Check closest landmark
  let closest = null;
  let minDist = 8.5;

  landmarks.forEach((lm) => {
    const d = player.position.distanceTo(lm.worldPosition);
    if (d < minDist) {
      minDist = d;
      closest = lm;
    }
  });

  nearestLandmark = closest;
  if (nearestLandmark) {
    promptText.innerHTML = `สำรวจ <strong>${nearestLandmark.content.thaiTitle}</strong>`;
    promptEl.classList.add('visible');
  } else {
    promptEl.classList.remove('visible');
  }
}

// ===== Resize =====
function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// ===== Animation Loop (Locked 60 FPS) =====
function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  const time = clock.getElapsedTime();

  // Third-person smooth follow (when not in top-down aerial map mode)
  if (state === 'world' && player.mesh && !cameraAnimation && !isTopView) {
    const targetY = player.position.y + 1.2;
    const lerpSpeed = 0.08;

    const dx = player.position.x - controls.target.x;
    const dz = player.position.z - controls.target.z;

    controls.target.x += dx * lerpSpeed;
    controls.target.y += (targetY - controls.target.y) * lerpSpeed;
    controls.target.z += dz * lerpSpeed;

    if (player.isMoving) {
      camera.position.x += dx * lerpSpeed;
      camera.position.z += dz * lerpSpeed;
    }
  }

  // Update controls
  controls.update();

  // Camera animation
  updateCameraAnimation(time);

  // Animate world (clouds)
  if (worldAnimatables) animateWorld(worldAnimatables, time);

  // Animate lush grass & wildflowers
  animateGrass(time);

  // Animate wildlife animals
  animateAnimals(time, delta);

  // Animate Guide NPC
  animateGuideNPC(time);

  // Animate treasure chests
  animateTreasureChests(time);

  // Animate player character with camera perspective
  if (slime) animateSlime(slime, time, delta, camera);

  // Animate landmarks
  if (landmarks) animateLandmarks(landmarks, time);

  // Animate particles
  animateParticles(time);

  // Hover check only on mouse movement
  if (mouseMoved) {
    checkHover();
    mouseMoved = false;
  }

  // Check proximity to buildings every 6 frames
  if (Math.floor(time * 30) % 6 === 0) checkProximity();

  // Update labels
  updateLabels();

  // Update minimap at 10 FPS
  if (Math.floor(time * 10) % 3 === 0) updateMinimap();

  // Render
  renderer.render(scene, camera);
}

// ===== Start =====
init();
