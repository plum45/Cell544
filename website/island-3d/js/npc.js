import * as THREE from 'three';
import { getTerrainHeight } from './world.js';
import { player } from './slime.js';
import { CONTENT_DATA } from './content.js';

let npcGroup = null;
let guideBeam = null;
let currentTargetId = null;

// Guide NPC Location (situated on the grassy verge right next to the expanded brown road fork)
const NPC_POS = { x: 14.5, z: 10.2 };

export function createGuideNPC(scene) {
  npcGroup = new THREE.Group();

  const y = getTerrainHeight(NPC_POS.x, NPC_POS.z);
  npcGroup.position.set(NPC_POS.x, y, NPC_POS.z);

  // 1. Character Base / Pedestal
  const stoneMat = new THREE.MeshLambertMaterial({ color: 0x8a929a, flatShading: true });
  const base = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.8, 0.4, 8), stoneMat);
  base.position.y = 0.2;
  npcGroup.add(base);

  // 2. Cute Guide Bunny Scholar Body
  const bunnyMat = new THREE.MeshLambertMaterial({ color: 0xfaf5f0, flatShading: true });
  const innerEarMat = new THREE.MeshLambertMaterial({ color: 0xfbcfe8, flatShading: true });
  const vestMat = new THREE.MeshLambertMaterial({ color: 0x3b82f6, flatShading: true });
  const goldMat = new THREE.MeshLambertMaterial({ color: 0xfbbf24, flatShading: true });

  // Body
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.9, 1.4, 8), vestMat);
  body.position.y = 1.0;
  npcGroup.add(body);

  // Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.85, 12, 10), bunnyMat);
  head.position.y = 2.0;
  npcGroup.add(head);

  // Eyes
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x1e293b });
  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.1, 6, 6), eyeMat);
  eyeL.position.set(-0.3, 2.1, 0.75);
  npcGroup.add(eyeL);

  const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.1, 6, 6), eyeMat);
  eyeR.position.set(0.3, 2.1, 0.75);
  npcGroup.add(eyeR);

  // Cute Nose
  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.1, 4), innerEarMat);
  nose.rotation.x = Math.PI / 2;
  nose.position.set(0, 1.95, 0.85);
  npcGroup.add(nose);

  // Bunny Ears
  const earL = new THREE.Group();
  const earOuterL = new THREE.Mesh(new THREE.BoxGeometry(0.25, 1.2, 0.15), bunnyMat);
  earOuterL.position.y = 0.6;
  const earInnerL = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.9, 0.05), innerEarMat);
  earInnerL.position.set(0, 0.6, 0.06);
  earL.add(earOuterL, earInnerL);
  earL.position.set(-0.4, 2.7, 0);
  earL.rotation.z = 0.15;
  npcGroup.add(earL);

  const earR = new THREE.Group();
  const earOuterR = new THREE.Mesh(new THREE.BoxGeometry(0.25, 1.2, 0.15), bunnyMat);
  earOuterR.position.y = 0.6;
  const earInnerR = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.9, 0.05), innerEarMat);
  earInnerR.position.set(0, 0.6, 0.06);
  earR.add(earOuterR, earInnerR);
  earR.position.set(0.4, 2.7, 0);
  earR.rotation.z = -0.15;
  npcGroup.add(earR);

  // Scholar Cape & Tie
  const tie = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.4, 4), goldMat);
  tie.position.set(0, 1.4, 0.8);
  npcGroup.add(tie);

  // Guide Staff / Compass Lantern
  const woodMat = new THREE.MeshLambertMaterial({ color: 0x78350f });
  const staff = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.8, 6), woodMat);
  staff.position.set(1.0, 1.4, 0.4);
  npcGroup.add(staff);

  // Lantern Top with glowing compass crystal
  const lanternMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
  const lantern = new THREE.Mesh(new THREE.OctahedronGeometry(0.35), lanternMat);
  lantern.position.set(1.0, 2.8, 0.4);
  npcGroup.add(lantern);

  const lanternLight = new THREE.PointLight(0x38bdf8, 2.0, 8);
  lanternLight.position.set(1.0, 2.8, 0.4);
  npcGroup.add(lanternLight);

  // Aura Rings under NPC
  const auraMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide,
  });
  const aura = new THREE.Mesh(new THREE.RingGeometry(1.4, 1.6, 16), auraMat);
  aura.rotation.x = -Math.PI / 2;
  aura.position.y = 0.42;
  npcGroup.add(aura);

  // Raycast Hitbox
  const hitMat = new THREE.MeshBasicMaterial({ visible: false });
  const hitbox = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.0, 4, 8), hitMat);
  hitbox.position.y = 2;
  hitbox.userData = { isNPC: true };
  npcGroup.add(hitbox);

  scene.add(npcGroup);

  // Store references for animation
  npcGroup.userData = {
    earL,
    earR,
    lantern,
    aura,
    hitbox,
    baseY: y,
  };

  // Re-snap to terrain when forest finishes loading
  window.addEventListener('forest-ready', () => {
    const realY = getTerrainHeight(NPC_POS.x, NPC_POS.z);
    npcGroup.position.y = realY;
    npcGroup.userData.baseY = realY;
    console.log('✅ Guide NPC snapped to terrain at y =', realY);
  });

  // Setup Waypoint Guide Beam in Scene
  setupGuideBeam(scene);

  return npcGroup;
}

// Glowing Waypoint Beam over currently targeted landmark
function setupGuideBeam(scene) {
  const group = new THREE.Group();

  // Vertical light pillar
  const beamMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.6,
    side: THREE.DoubleSide,
  });
  const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.8, 40, 12), beamMat);
  pillar.position.y = 20;
  group.add(pillar);

  // Chevron floating arrow
  const arrowMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
  const arrow = new THREE.Mesh(new THREE.ConeGeometry(1.5, 3.0, 4), arrowMat);
  arrow.rotation.x = Math.PI; // point downwards
  arrow.position.y = 12;
  group.add(arrow);

  group.visible = false;
  scene.add(group);
  guideBeam = group;
}

// Animate NPC idle motions
export function animateGuideNPC(time) {
  if (!npcGroup) return;

  // Gentle floating & ear wiggling
  const earL = npcGroup.userData.earL;
  const earR = npcGroup.userData.earR;
  if (earL && earR) {
    earL.rotation.x = Math.sin(time * 3) * 0.15;
    earR.rotation.x = Math.cos(time * 3) * 0.15;
  }

  // Lantern floating pulse
  if (npcGroup.userData.lantern) {
    npcGroup.userData.lantern.rotation.y = time * 2;
    npcGroup.userData.lantern.position.y = 2.8 + Math.sin(time * 4) * 0.15;
  }

  // Aura slow spin
  if (npcGroup.userData.aura) {
    npcGroup.userData.aura.rotation.z = time * 0.5;
  }

  // Animate Waypoint Guide Beam
  if (guideBeam && guideBeam.visible) {
    guideBeam.rotation.y = time * 1.5;
    const arrow = guideBeam.children[1];
    if (arrow) {
      arrow.position.y = 12 + Math.sin(time * 5) * 0.8;
    }
  }

  // If player is close, turn to look at player
  if (player && player.position) {
    const dist = player.position.distanceTo(npcGroup.position);
    if (dist < 10) {
      const angle = Math.atan2(player.position.x - npcGroup.position.x, player.position.z - npcGroup.position.z);
      npcGroup.rotation.y = THREE.MathUtils.lerp(npcGroup.rotation.y, angle, 0.08);
    }
  }
}

// Check if player is near Guide NPC (only when standing close)
export function isPlayerNearNPC() {
  if (!npcGroup || !player) return false;
  return player.position.distanceTo(npcGroup.position) < 3.2;
}

// Set active navigation destination along the brown road
export function setNavigationTarget(contentId, landmarks) {
  currentTargetId = contentId;
  const lm = landmarks.find((l) => l.contentId === contentId);
  if (!lm || !guideBeam) return;

  // Position guide beam directly over the landmark
  guideBeam.position.set(lm.worldPosition.x, lm.worldPosition.y, lm.worldPosition.z);
  guideBeam.visible = true;

  console.log('🧭 Navigation beacon set for:', contentId, lm.worldPosition);
}
