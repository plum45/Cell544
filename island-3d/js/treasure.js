// ===== ระบบสะสมสมบัติ (Treasure Collection System) =====
// สมบัติ 7 ชิ้นที่ได้รับจากการเรียนรู้ — เก็บสถานะด้วย localStorage ข้ามหน้า
import * as THREE from 'three';
import { getTerrainHeight } from './world.js';

// ===== Treasure Definitions (7 ชิ้น ตรงกับ 6 หัวข้อ + 1 quiz) =====
const TREASURES = [
  {
    id: 'gene-expression',
    name: '💎 คริสตัล DNA',
    desc: 'ผลึกเรืองแสงที่เก็บรหัสพันธุกรรมไว้ภายใน',
    funFact: '🧬 DNA ของมนุษย์ยาวประมาณ 2 เมตร แต่ขดอัดอยู่ในนิวเคลียสที่มีขนาดเพียง 6 ไมโครเมตร!',
    color: 0x8B5CF6,
    emoji: '💎',
    reward: 'อ่านบทเรียน Gene Expression จบ',
  },
  {
    id: 'gene-regulation',
    name: '📜 ม้วนคัมภีร์ RNA',
    desc: 'ม้วนหนังสือโบราณที่บันทึกคาถาควบคุมยีน',
    funFact: '🎛️ mRNA ตัวเดียวสามารถถูกแปลรหัสสร้างโปรตีนได้หลายพันก็อปปี้พร้อมกัน!',
    color: 0x10B981,
    emoji: '📜',
    reward: 'อ่านบทเรียน Gene Regulation จบ',
  },
  {
    id: 'cell-signaling',
    name: '🔮 ลูกแก้วสัญญาณ',
    desc: 'ออร์บเวทมนตร์ที่ส่งสัญญาณข้ามระยะทาง',
    funFact: '📡 เซลล์ส่งสัญญาณด้วย "จูบเคมี" — โมเลกุลสื่อสารจับกับ Receptor เหมือนกุญแจกับแม่กุญแจ!',
    color: 0xF97316,
    emoji: '🔮',
    reward: 'อ่านบทเรียน Cell Signaling จบ',
  },
  {
    id: 'cell-response',
    name: '⚡ หินพลังชีวิต',
    desc: 'หินที่เปล่งพลังงานชีวิตเรืองแสงสีฟ้า',
    funFact: '⚡ Mitochondria มี DNA ของตัวเอง — สืบทอดจากแม่เพียงฝ่ายเดียวเท่านั้น!',
    color: 0x0284C7,
    emoji: '⚡',
    reward: 'อ่านบทเรียน Cell Response จบ',
  },
  {
    id: 'cell-cycle',
    name: '🔬 แว่นตาจักรกล',
    desc: 'แว่นตาที่มองเห็นการแบ่งเซลล์ได้',
    funFact: '🔬 เซลล์ในร่างกายมนุษย์แบ่งตัวประมาณ 3.8 ล้านครั้งต่อวินาที!',
    color: 0xF43F5E,
    emoji: '🔬',
    reward: 'อ่านบทเรียน Cell Cycle จบ',
  },
  {
    id: 'apoptosis',
    name: '🕯️ เทียนวิญญาณ',
    desc: 'เทียนศักดิ์สิทธิ์ที่ควบคุมชะตากรรมเซลล์',
    funFact: '🕯️ Apoptosis ทำให้นิ้วมือของทารกในครรภ์แยกออกจากกัน — ถ้าไม่มีมัน เราจะมือเป็นพังผืด!',
    color: 0x8B5CF6,
    emoji: '🕯️',
    reward: 'อ่านบทเรียน Apoptosis จบ',
  },
  {
    id: 'quiz-hub',
    name: '🏆 ถ้วยรางวัลมาสเตอร์',
    desc: 'ถ้วยทองคำสำหรับผู้พิชิตข้อสอบทั้งหมด',
    funFact: '🏛️ นักเรียนที่ทำข้อสอบครบทั้ง 15 ข้อ ถือเป็นผู้พิชิตเกาะเซลล์ลอยฟ้าอย่างแท้จริง!',
    color: 0xF59E0B,
    emoji: '🏆',
    reward: 'ทำข้อสอบครบทั้ง 15 ข้อ',
  },
];

// ===== 3D Treasure Chest Positions (ไม่ซ้ำ landmark — ซ่อนตามจุดต่างๆ) =====
const CHEST_POSITIONS = [
  { id: 'gene-expression', x: -25, z: -35 },
  { id: 'gene-regulation', x: 45, z: -60 },
  { id: 'cell-signaling', x: 80, z: 30 },
  { id: 'cell-response', x: 50, z: 65 },
  { id: 'cell-cycle', x: -10, z: 70 },
  { id: 'apoptosis', x: -45, z: 10 },
  { id: 'quiz-hub', x: 15, z: 20 },
];

// ===== localStorage Key =====
const STORAGE_KEY = 'cell-life-treasures';

// ===== Get / Set Collected Treasures =====
export function getCollectedTreasures() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function collectTreasure(treasureId) {
  const collected = getCollectedTreasures();
  if (!collected.includes(treasureId)) {
    collected.push(treasureId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collected));
  }
  return collected;
}

export function isTreasureCollected(treasureId) {
  return getCollectedTreasures().includes(treasureId);
}

export function getTreasureCount() {
  return getCollectedTreasures().length;
}

export function getTotalTreasures() {
  return TREASURES.length;
}

export function getTreasureById(id) {
  return TREASURES.find(t => t.id === id);
}

export function getAllTreasures() {
  return TREASURES;
}

// ===== 3D Treasure Chests in the World =====
let chestGroup = null;
let chests = [];
let chestParticles = [];
let nearestChest = null;

export function createTreasureChests(scene) {
  chestGroup = new THREE.Group();
  chests = [];
  chestParticles = [];

  const collected = getCollectedTreasures();

  CHEST_POSITIONS.forEach((pos) => {
    const treasure = getTreasureById(pos.id);
    if (!treasure) return;
    const isCollected = collected.includes(pos.id);

    const group = new THREE.Group();
    const y = getTerrainHeight(pos.x, pos.z);

    // Chest body (wooden box)
    const bodyMat = new THREE.MeshLambertMaterial({
      color: isCollected ? 0x665544 : 0xCD853F,
      flatShading: true,
    });
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.0, 1.0), bodyMat);
    body.position.y = 0.5;
    group.add(body);

    // Chest lid (half-round top)
    const lidMat = new THREE.MeshLambertMaterial({
      color: isCollected ? 0x554433 : 0xB8860B,
      flatShading: true,
    });
    const lid = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.35, 1.1), lidMat);
    lid.position.y = 1.17;
    group.add(lid);

    // Golden lock/clasp
    const claspMat = new THREE.MeshBasicMaterial({
      color: isCollected ? 0x888877 : 0xFFD700,
    });
    const clasp = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.25, 0.15), claspMat);
    clasp.position.set(0, 0.85, 0.55);
    group.add(clasp);

    if (!isCollected) {
      // Glow pillar beam of light
      const beamMat = new THREE.MeshBasicMaterial({
        color: treasure.color,
        transparent: true,
        opacity: 0.18,
        side: THREE.DoubleSide,
      });
      const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.8, 6, 8, 1, true), beamMat);
      beam.position.y = 4;
      group.add(beam);
      group.userData.beam = beam;

      // Floating sparkle particles
      const sparkleCount = 12;
      const sparkleGeo = new THREE.BufferGeometry();
      const sparklePositions = new Float32Array(sparkleCount * 3);
      for (let i = 0; i < sparkleCount; i++) {
        sparklePositions[i * 3] = (Math.random() - 0.5) * 2;
        sparklePositions[i * 3 + 1] = 0.5 + Math.random() * 5;
        sparklePositions[i * 3 + 2] = (Math.random() - 0.5) * 2;
      }
      sparkleGeo.setAttribute('position', new THREE.BufferAttribute(sparklePositions, 3));
      const sparkleMat = new THREE.PointsMaterial({
        color: treasure.color,
        size: 0.18,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
      });
      const sparkles = new THREE.Points(sparkleGeo, sparkleMat);
      group.add(sparkles);
      group.userData.sparkles = sparkles;

      // Point light
      const glow = new THREE.PointLight(treasure.color, 1.5, 10);
      glow.position.y = 2;
      group.add(glow);
      group.userData.glow = glow;
    }

    group.position.set(pos.x, y, pos.z);
    group.userData.treasureId = pos.id;
    group.userData.isCollected = isCollected;

    chestGroup.add(group);
    chests.push({
      group,
      treasureId: pos.id,
      worldPosition: new THREE.Vector3(pos.x, y, pos.z),
      isCollected,
    });
  });

  scene.add(chestGroup);

  // Re-snap when forest is ready
  window.addEventListener('forest-ready', () => {
    chests.forEach((c) => {
      const pos = CHEST_POSITIONS.find(p => p.id === c.treasureId);
      if (!pos) return;
      const realY = getTerrainHeight(pos.x, pos.z);
      c.group.position.y = realY;
      c.worldPosition.y = realY;
    });
  });

  return chests;
}

// ===== Animate Treasure Chests =====
export function animateTreasureChests(time) {
  if (!chests) return;
  chests.forEach((c) => {
    if (c.isCollected) return;
    const g = c.group;

    // Gentle float
    g.position.y = c.worldPosition.y + Math.sin(time * 2 + c.worldPosition.x) * 0.15;

    // Beam pulse
    if (g.userData.beam) {
      g.userData.beam.material.opacity = 0.12 + Math.sin(time * 3) * 0.08;
    }

    // Sparkle rise
    if (g.userData.sparkles) {
      const pos = g.userData.sparkles.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        let sy = pos.getY(i) + 0.015;
        if (sy > 5.5) sy = 0.5;
        pos.setY(i, sy);
        pos.setX(i, pos.getX(i) + Math.sin(time * 2 + i) * 0.003);
      }
      pos.needsUpdate = true;
    }

    // Glow pulse
    if (g.userData.glow) {
      g.userData.glow.intensity = 1.2 + Math.sin(time * 4) * 0.5;
    }
  });
}

// ===== Get nearest uncollected chest =====
export function getNearestChest(playerPos, maxDist = 5.0) {
  nearestChest = null;
  let minDist = maxDist;
  chests.forEach((c) => {
    if (c.isCollected) return;
    const d = playerPos.distanceTo(c.worldPosition);
    if (d < minDist) {
      minDist = d;
      nearestChest = c;
    }
  });
  return nearestChest;
}

// ===== Open a treasure chest (called from main.js) =====
export function openTreasureChest(chest, scene) {
  if (!chest || chest.isCollected) return null;

  const treasure = getTreasureById(chest.treasureId);
  if (!treasure) return null;

  // Mark collected
  chest.isCollected = true;
  chest.group.userData.isCollected = true;
  collectTreasure(chest.treasureId);

  // Remove glow effects
  if (chest.group.userData.beam) {
    chest.group.remove(chest.group.userData.beam);
    chest.group.userData.beam = null;
  }
  if (chest.group.userData.sparkles) {
    chest.group.remove(chest.group.userData.sparkles);
    chest.group.userData.sparkles = null;
  }
  if (chest.group.userData.glow) {
    chest.group.remove(chest.group.userData.glow);
    chest.group.userData.glow = null;
  }

  // Darken the chest
  chest.group.children.forEach((child) => {
    if (child.isMesh && child.material) {
      child.material.color.multiplyScalar(0.6);
    }
  });

  // Create celebration burst particles
  spawnTreasureBurst(chest.worldPosition.x, chest.worldPosition.y + 1.5, chest.worldPosition.z, treasure.color, scene);

  return treasure;
}

// ===== Burst Particles when treasure is found =====
function spawnTreasureBurst(x, y, z, color, scene) {
  const count = 40;
  const geo = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const velocities = [];

  for (let i = 0; i < count; i++) {
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    velocities.push({
      vx: (Math.random() - 0.5) * 0.3,
      vy: 0.1 + Math.random() * 0.25,
      vz: (Math.random() - 0.5) * 0.3,
    });
  }

  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const mat = new THREE.PointsMaterial({
    color: color,
    size: 0.25,
    transparent: true,
    opacity: 1.0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });

  const points = new THREE.Points(geo, mat);
  scene.add(points);

  let frame = 0;
  const maxFrames = 90;

  function animBurst() {
    frame++;
    if (frame > maxFrames) {
      scene.remove(points);
      geo.dispose();
      mat.dispose();
      return;
    }
    const pos = points.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      pos.setX(i, pos.getX(i) + velocities[i].vx);
      pos.setY(i, pos.getY(i) + velocities[i].vy);
      pos.setZ(i, pos.getZ(i) + velocities[i].vz);
      velocities[i].vy -= 0.004; // gravity
    }
    pos.needsUpdate = true;
    mat.opacity = 1 - frame / maxFrames;
    requestAnimationFrame(animBurst);
  }
  animBurst();
}

// ===== HUD Update Functions =====
export function updateTreasureHUD() {
  const collected = getCollectedTreasures();
  const count = collected.length;
  const total = TREASURES.length;

  // Counter text
  const counterEl = document.getElementById('treasure-count');
  if (counterEl) counterEl.textContent = `${count} / ${total}`;

  // Progress bar
  const progressEl = document.getElementById('treasure-progress');
  if (progressEl) progressEl.style.width = `${(count / total) * 100}%`;

  // Map checklist
  const listEl = document.getElementById('treasure-checklist');
  if (listEl) {
    listEl.innerHTML = TREASURES.map((t) => {
      const found = collected.includes(t.id);
      return `
        <div class="treasure-checklist-item ${found ? 'found' : ''}">
          <span class="treasure-check-icon">${found ? '✅' : '🔒'}</span>
          <span class="treasure-check-emoji">${t.emoji}</span>
          <span class="treasure-check-name">${t.name}</span>
          ${found ? `<span class="treasure-check-tag">ได้แล้ว!</span>` : `<span class="treasure-check-hint">${t.reward}</span>`}
        </div>
      `;
    }).join('');
  }
}

// ===== Show Treasure Found Modal =====
export function showTreasureFoundModal(treasure) {
  const modal = document.getElementById('treasure-found-modal');
  if (!modal) return;

  document.getElementById('tf-emoji').textContent = treasure.emoji;
  document.getElementById('tf-name').textContent = treasure.name;
  document.getElementById('tf-desc').textContent = treasure.desc;
  document.getElementById('tf-funfact').textContent = treasure.funFact;

  const collected = getCollectedTreasures();
  document.getElementById('tf-count').textContent = `${collected.length} / ${TREASURES.length}`;

  modal.classList.add('visible');

  // Auto-check if all collected
  if (collected.length >= TREASURES.length) {
    setTimeout(() => {
      modal.classList.remove('visible');
      showTreasureCompleteModal();
    }, 3000);
  }
}

export function closeTreasureFoundModal() {
  const modal = document.getElementById('treasure-found-modal');
  if (modal) modal.classList.remove('visible');

  // Check completion after closing
  const collected = getCollectedTreasures();
  if (collected.length >= TREASURES.length) {
    setTimeout(showTreasureCompleteModal, 500);
  }
}

// ===== Show Full Completion Celebration =====
export function showTreasureCompleteModal() {
  const modal = document.getElementById('treasure-complete-modal');
  if (modal) modal.classList.add('visible');
}

export function closeTreasureCompleteModal() {
  const modal = document.getElementById('treasure-complete-modal');
  if (modal) modal.classList.remove('visible');
}

// ===== Toggle Treasure Map =====
export function toggleTreasureMap() {
  const panel = document.getElementById('treasure-map-panel');
  if (panel) panel.classList.toggle('visible');
  updateTreasureHUD();
}
