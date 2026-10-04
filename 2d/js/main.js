// ===== Main Game Loop & Simulation Engine =====
import { initWorld, renderWorld, TILE_SIZE, MAP_COLS, MAP_ROWS } from './world.js';
import { OBJECTS, renderObjects, getNearbyObject } from './objects.js';
import { createAgents } from './agents.js';
import { Player } from './player.js';
import { talkToPlayer } from './dialogue.js';
import { playClickSound, playSuccessChime } from './audio.js';
import { createZombieHorde, ParticleEmitter } from './zombies.js';
import { initMapSystem, updateMiniMap } from './map.js';

let canvas, ctx;
let player, agents, zombies, particleEmitter;
let camera = { x: 0, y: 0, width: 800, height: 600, zoom: 1.25 };
let lastTime = performance.now();
let isSurvivalMode = true; // Obstacle / Zombie survival mode toggle

// Game Time Engine
export const gameState = {
  timeHours: 9,
  timeMinutes: 30,
  timeSpeed: 1, // 0 = pause, 1 = normal, 2 = fast, 5 = ultra
  selectedAgent: null,
  activeModal: null,
  cameraMode: 'follow', // 'follow' | 'free'
};

function init() {
  canvas = document.getElementById('game-canvas');
  ctx = canvas.getContext('2d');

  // Pixel crisp rendering
  ctx.imageSmoothingEnabled = false;

  // Initialize World, Objects, Agents, Player, Zombies & FX
  initWorld();
  agents = createAgents();
  zombies = createZombieHorde();
  particleEmitter = new ParticleEmitter();
  player = new Player(19, 13);

  // Resize canvas
  onResize();
  window.addEventListener('resize', onResize);

  // Set initial camera centered on player
  centerCameraOn(player.x, player.y);

  // Event Listeners
  initUIEvents();
  initCanvasClicks();
  initTouchControls();
  initSurvivalEvents();
  initMapSystem(player, agents, zombies);

  // Start Animation Loop
  requestAnimationFrame(gameLoop);

  showToast('🚨 โหมดเอาชีวิตรอดชีววิทยา: ตอบคำถามปลดล็อกประตู ยิงเลเซอร์ และสังเคราะห์วัคซีนเพื่อกำจัดซอมบี้!');
}

function onResize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  camera.width = canvas.width / camera.zoom;
  camera.height = canvas.height / camera.zoom;
  ctx.imageSmoothingEnabled = false;
}

function centerCameraOn(x, y) {
  camera.x = x - camera.width / 2;
  camera.y = y - camera.height / 2;
  clampCamera();
}

function clampCamera() {
  const maxW = MAP_COLS * TILE_SIZE;
  const maxH = MAP_ROWS * TILE_SIZE;
  camera.x = Math.max(0, Math.min(camera.x, maxW - camera.width));
  camera.y = Math.max(0, Math.min(camera.y, maxH - camera.height));
}

// Main Game Loop
function gameLoop(now) {
  requestAnimationFrame(gameLoop);

  const delta = Math.min((now - lastTime) / 1000, 0.08);
  lastTime = now;

  // Update Game Time
  if (gameState.timeSpeed > 0) {
    gameState.timeMinutes += delta * 1.5 * gameState.timeSpeed;
    if (gameState.timeMinutes >= 60) {
      gameState.timeHours = (gameState.timeHours + 1) % 24;
      gameState.timeMinutes = 0;
    }
    updateTimeUI();
  }

  // Update Player, Autonomous Agents, Zombies & Particles
  player.update(delta);
  agents.forEach(agent => agent.update(delta, agents));
  if (zombies) {
    zombies.forEach(z => z.update(delta, player, isSurvivalMode));
  }
  if (particleEmitter) {
    particleEmitter.update(delta);
  }

  // Camera Follow
  if (gameState.cameraMode === 'follow') {
    const targetCamX = player.x - camera.width / 2;
    const targetCamY = player.y - camera.height / 2;
    camera.x += (targetCamX - camera.x) * 0.1;
    camera.y += (targetCamY - camera.y) * 0.1;
    clampCamera();
  }

  // Check Proximity Prompt
  checkProximityPrompt();

  // Render Scene & Mini-Map
  render();
  updateMiniMap(player, agents, zombies);
}

function render() {
  ctx.save();
  ctx.scale(camera.zoom, camera.zoom);

  // 1. Draw World Tiles
  renderWorld(ctx, camera);

  // 2. Draw Interactive Furniture & Equipment
  renderObjects(ctx, camera);

  // 3. Sort entities by Y for correct top-down 2.5D depth sorting (Agents, Zombies, Player)
  const activeZombies = zombies ? zombies.filter(z => z.state !== 'defeated') : [];
  const entities = [...agents, ...activeZombies, player];
  entities.sort((a, b) => a.y - b.y);
  entities.forEach(ent => ent.render(ctx, camera));

  // 4. Render Particle FX (Laser blasts, cure mist)
  if (particleEmitter) {
    particleEmitter.render(ctx, camera);
  }

  // 5. Day / Night Ambient Lighting Overlay
  renderDayNightLighting(ctx, camera);

  ctx.restore();
}

function renderDayNightLighting(ctx, camera) {
  const h = gameState.timeHours + gameState.timeMinutes / 60;
  let alpha = 0;
  let color = 'rgba(15, 23, 42, 0)';

  if (h >= 18 || h < 6) {
    // Night
    alpha = h >= 21 || h < 4 ? 0.38 : 0.22;
    color = `rgba(15, 23, 42, ${alpha})`;
  } else if (h >= 17 && h < 18) {
    // Sunset golden hour
    alpha = 0.15;
    color = `rgba(249, 115, 22, ${alpha})`;
  }

  if (alpha > 0) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, camera.width, camera.height);
  }
}

// Proximity prompt (talk to agent or interact with furniture)
function checkProximityPrompt() {
  const promptEl = document.getElementById('interact-prompt');
  const promptText = document.getElementById('prompt-text');
  if (!promptEl || !promptText) return;

  // 1. Check nearby agent
  let nearestAgent = null;
  let minDist = 40;
  agents.forEach(a => {
    const d = Math.hypot(player.x - a.x, player.y - a.y);
    if (d < minDist) {
      minDist = d;
      nearestAgent = a;
    }
  });

  if (nearestAgent) {
    promptText.innerHTML = `💬 คุยกับ <strong>${nearestAgent.name}</strong> [กด E]`;
    promptEl.classList.add('visible');
    return;
  }

  // 2. Check nearby object
  const nearbyObj = getNearbyObject(player.x, player.y, 44);
  if (nearbyObj) {
    promptText.innerHTML = `${nearbyObj.actionText} [กด E]`;
    promptEl.classList.add('visible');
    return;
  }

  promptEl.classList.remove('visible');
}

// Handle Interaction Trigger (E key or Button)
function handleInteraction() {
  playClickSound();

  // 1. Check agent
  let nearestAgent = null;
  let minDist = 45;
  agents.forEach(a => {
    const d = Math.hypot(player.x - a.x, player.y - a.y);
    if (d < minDist) {
      minDist = d;
      nearestAgent = a;
    }
  });

  if (nearestAgent) {
    const speech = talkToPlayer(nearestAgent, player);
    player.showBubble('สวัสดีครับ!', '🦊');
    nearestAgent.showBubble(speech.slice(0, 16) + '...', 4.5);
    openAgentInspector(nearestAgent, speech);
    return;
  }

  // 2. Check object
  const nearbyObj = getNearbyObject(player.x, player.y, 48);
  if (nearbyObj) {
    const resultMsg = nearbyObj.onInteract(
      (succ) => showActionToast(nearbyObj.name, succ),
      (fail) => showActionToast(nearbyObj.name, fail)
    );
    if (resultMsg) {
      player.showBubble('✨ สำรวจสำเร็จ!', '🔬');
      showActionToast(nearbyObj.name, resultMsg);
    }
  }
}
window.addEventListener('player-interact-2d', handleInteraction);

// Canvas Mouse / Tap Clicks & Pointer Drag to move
function initCanvasClicks() {
  let isPointerMoving = false;

  function updateMoveTarget(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const clickX = (clientX - rect.left) / camera.zoom + camera.x;
    const clickY = (clientY - rect.top) / camera.zoom + camera.y;
    player.setTargetPos(clickX, clickY);
  }

  // Pointer drag to move (supports both mouse and mobile touch!)
  canvas.addEventListener('pointerdown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) / camera.zoom + camera.x;
    const clickY = (e.clientY - rect.top) / camera.zoom + camera.y;

    // Check if clicked an Agent
    for (const a of agents) {
      if (Math.hypot(clickX - a.x, clickY - a.y) < 24) {
        playClickSound();
        openAgentInspector(a);
        return;
      }
    }

    // Check if clicked an Object
    const clickedObj = getNearbyObject(clickX, clickY, 32);
    if (clickedObj) {
      playClickSound();
      const msg = clickedObj.onInteract(
        (succ) => showActionToast(clickedObj.name, succ),
        (fail) => showActionToast(clickedObj.name, fail)
      );
      if (msg) showActionToast(clickedObj.name, msg);
      return;
    }

    isPointerMoving = true;
    updateMoveTarget(e.clientX, e.clientY);
  });

  window.addEventListener('pointermove', (e) => {
    if (!isPointerMoving) return;
    updateMoveTarget(e.clientX, e.clientY);
  });

  window.addEventListener('pointerup', () => {
    isPointerMoving = false;
  });
  window.addEventListener('pointercancel', () => {
    isPointerMoving = false;
  });

  // Prevent iPhone / Safari page pull-down and rubber-banding
  document.addEventListener('touchmove', (e) => {
    if (!e.target.closest('.modal-panel') && !e.target.closest('.memory-list')) {
      e.preventDefault();
    }
  }, { passive: false });
}

// Agent Inspector Modal
export function openAgentInspector(agent, customDialogue = null) {
  gameState.selectedAgent = agent;
  const modal = document.getElementById('agent-modal');
  if (!modal) return;

  document.getElementById('agent-modal-name').textContent = agent.name;
  document.getElementById('agent-modal-role').textContent = agent.role;
  document.getElementById('agent-modal-activity').textContent = agent.currentActivity;
  document.getElementById('agent-modal-room').textContent = agent.currentRoom;
  document.getElementById('agent-modal-energy').textContent = `${agent.stats.energy}%`;
  document.getElementById('agent-modal-hunger').textContent = `${agent.stats.hunger}%`;
  document.getElementById('agent-modal-focus').textContent = `${agent.stats.focus}%`;

  // Dialogue speech box
  const speechBox = document.getElementById('agent-modal-speech');
  if (customDialogue) {
    speechBox.style.display = 'block';
    speechBox.textContent = `"${customDialogue}"`;
  } else {
    speechBox.style.display = 'none';
  }

  // Memory list
  const memList = document.getElementById('agent-modal-memories');
  memList.innerHTML = agent.memories.map(m => `<li>${m}</li>`).join('');

  modal.classList.add('visible');
}

function updateTimeUI() {
  const el = document.getElementById('time-display');
  if (!el) return;
  const hh = String(Math.floor(gameState.timeHours)).padStart(2, '0');
  const mm = String(Math.floor(gameState.timeMinutes)).padStart(2, '0');
  const icon = (gameState.timeHours >= 6 && gameState.timeHours < 18) ? '☀️' : '🌙';
  el.textContent = `${icon} ${hh}:${mm}`;
}

function showToast(msg) {
  const el = document.getElementById('hud-toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('visible');
  setTimeout(() => el.classList.remove('visible'), 4000);
}

function showActionToast(title, body) {
  const modal = document.getElementById('action-modal');
  if (!modal) return;
  document.getElementById('action-title').textContent = title;
  document.getElementById('action-body').innerText = body;
  modal.classList.add('visible');
}

function initUIEvents() {
  document.getElementById('btn-interact-hud')?.addEventListener('click', handleInteraction);
  document.getElementById('interact-prompt')?.addEventListener('click', handleInteraction);

  // Close modals
  document.getElementById('btn-close-agent')?.addEventListener('click', () => {
    document.getElementById('agent-modal')?.classList.remove('visible');
  });
  document.getElementById('btn-close-action')?.addEventListener('click', () => {
    document.getElementById('action-modal')?.classList.remove('visible');
  });
  document.getElementById('btn-close-guide')?.addEventListener('click', () => {
    document.getElementById('guide-modal')?.classList.remove('visible');
  });
  document.getElementById('btn-help-2d')?.addEventListener('click', () => {
    document.getElementById('guide-modal')?.classList.add('visible');
  });

  // Time speed controls
  document.querySelectorAll('.btn-speed').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.btn-speed').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      gameState.timeSpeed = parseFloat(btn.dataset.speed || '1');
    });
  });

  // Avatar switch
  document.getElementById('btn-avatar-fox')?.addEventListener('click', () => {
    player.avatarType = 'fox';
    showToast('🦊 เปลี่ยนเป็นตัวละคร: จิ้งจอกน้อยนักวิจัย');
  });

  // Camera Zoom Buttons
  document.getElementById('btn-zoom-in')?.addEventListener('click', () => {
    camera.zoom = Math.min(camera.zoom + 0.25, 2.0);
    onResize();
  });
  document.getElementById('btn-zoom-out')?.addEventListener('click', () => {
    camera.zoom = Math.max(camera.zoom - 0.25, 0.75);
    onResize();
  });
}

// Touch joystick & buttons for Mobile
function initTouchControls() {
  const joyZone = document.getElementById('joystick-zone-2d');
  const joyKnob = document.getElementById('joystick-knob-2d');
  if (!joyZone || !joyKnob) return;

  let touchId = null;
  let startX = 0, startY = 0;
  const maxR = 36;

  joyZone.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (touchId !== null) return;
    const t = e.changedTouches[0];
    touchId = t.identifier;
    const rect = joyZone.getBoundingClientRect();
    startX = rect.left + rect.width / 2;
    startY = rect.top + rect.height / 2;
    updateJoy(t.clientX, t.clientY);
  }, { passive: false });

  window.addEventListener('touchmove', (e) => {
    if (touchId === null) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      if (t.identifier === touchId) {
        updateJoy(t.clientX, t.clientY);
        break;
      }
    }
  }, { passive: false });

  function endJoy(e) {
    if (touchId === null) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === touchId) {
        touchId = null;
        joyKnob.style.transform = 'translate(0px, 0px)';
        player.joystick.x = 0;
        player.joystick.y = 0;
        break;
      }
    }
  }

  window.addEventListener('touchend', endJoy);
  window.addEventListener('touchcancel', endJoy);

  function updateJoy(cx, cy) {
    const dx = cx - startX;
    const dy = cy - startY;
    const dist = Math.hypot(dx, dy);
    const clamped = Math.min(dist, maxR);
    const angle = Math.atan2(dy, dx);
    const kx = Math.cos(angle) * clamped;
    const ky = Math.sin(angle) * clamped;

    joyKnob.style.transform = `translate(${kx}px, ${ky}px)`;
    player.joystick.x = kx / maxR;
    player.joystick.y = ky / maxR;
  }
}

// ===== Survival Events, Combat, Quizzes & Game Over/Victory =====
function initSurvivalEvents() {
  // 1. Laser blast triggered
  window.addEventListener('laser-blast-triggered', (e) => {
    const { x, y } = e.detail;
    if (particleEmitter) {
      particleEmitter.spawnLaserBlast(x, y, 40);
    }
    // Damage nearby zombies in 260px radius
    let hitCount = 0;
    if (zombies) {
      zombies.forEach(z => {
        if (z.state !== 'defeated' && Math.hypot(z.x - x, z.y - y) < 260) {
          z.takeDamage(5);
          hitCount++;
        }
      });
    }
    showToast(`⚡ ป้อมปืนเลเซอร์ Caspase ปลดปล่อยลำแสง! สลายซอมบี้ไป ${hitCount} ตัว!`);
  });

  // 2. Vaccine cure triggered (Victory)
  window.addEventListener('vaccine-cure-triggered', (e) => {
    const { x, y } = e.detail;
    if (particleEmitter) {
      particleEmitter.spawnCureMist(x, y, 60);
    }
    // Cleanse all zombies
    if (zombies) {
      zombies.forEach(z => z.takeDamage(10));
    }
    showToast('🎉 สังเคราะห์วัคซีนสำเร็จ! ละอองวัคซีนฟื้นฟูเซลล์สถาบันวิจัยชีววิทยา!');
    setTimeout(() => {
      document.getElementById('victory-screen')?.classList.add('visible');
    }, 1200);
  });

  // 3. Player HP change
  window.addEventListener('player-hp-change', (e) => {
    const { hp, maxHp } = e.detail;
    const hpFill = document.getElementById('player-hp-fill');
    const hpText = document.getElementById('player-hp-text');
    if (hpFill) {
      const pct = Math.max(0, (hp / maxHp) * 100);
      hpFill.style.width = `${pct}%`;
      if (pct > 50) hpFill.style.background = '#22C55E';
      else if (pct > 25) hpFill.style.background = '#EAB308';
      else hpFill.style.background = '#EF4444';
    }
    if (hpText) {
      hpText.textContent = `${hp}/${maxHp}`;
    }
  });

  // 4. Player died (Game Over)
  window.addEventListener('player-died', () => {
    document.getElementById('game-over-screen')?.classList.add('visible');
  });

  // 5. Respawn button
  document.getElementById('btn-respawn')?.addEventListener('click', () => {
    document.getElementById('game-over-screen')?.classList.remove('visible');
    player.respawn(19, 13);
    showToast('🔄 คุณได้รับการช่วยเหลือกลับสู่ห้องทดลองปลอดภัยแล้ว!');
  });

  // 6. Victory continue button
  document.getElementById('btn-victory-continue')?.addEventListener('click', () => {
    document.getElementById('victory-screen')?.classList.remove('visible');
  });

  // 7. Survival Mode Switcher Button
  document.getElementById('btn-mode-toggle')?.addEventListener('click', () => {
    isSurvivalMode = !isSurvivalMode;
    const iconEl = document.getElementById('mode-icon');
    const nameEl = document.getElementById('mode-name');
    if (isSurvivalMode) {
      if (iconEl) iconEl.textContent = '🚨';
      if (nameEl) nameEl.textContent = 'โหมดซอมบี้';
      showToast('🚨 สลับเป็นโหมดซอมบี้เอาชีวิตรอด! ซอมบี้จะเคลื่อนไหวและไล่ตาม');
    } else {
      if (iconEl) iconEl.textContent = '🌿';
      if (nameEl) nameEl.textContent = 'โหมดพักผ่อน';
      showToast('🌿 สลับเป็นโหมดพักผ่อนสบายๆ! ซอมบี้อยู่นิ่งในเขตกักกัน');
    }
  });
}

// Start
window.addEventListener('DOMContentLoaded', init);
