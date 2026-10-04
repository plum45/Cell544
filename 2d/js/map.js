// ===== Interactive Campus Map & Real-time Mini-Map System =====
import { TILE_SIZE, MAP_COLS, MAP_ROWS, tileMap, collisionMap, GATES, ROOMS } from './world.js';
import { playClickSound } from './audio.js';

let fullMapCanvas, fullMapCtx;
let miniMapCanvas, miniMapCtx;
let isMapModalOpen = false;

export function initMapSystem(playerRef, agentsRef, zombiesRef) {
  fullMapCanvas = document.getElementById('world-map-canvas');
  if (fullMapCanvas) {
    fullMapCtx = fullMapCanvas.getContext('2d');
    fullMapCtx.imageSmoothingEnabled = false;
  }

  miniMapCanvas = document.getElementById('minimap-canvas');
  if (miniMapCanvas) {
    miniMapCtx = miniMapCanvas.getContext('2d');
    miniMapCtx.imageSmoothingEnabled = false;
  }

  // Open / Close events
  document.getElementById('btn-map-hud')?.addEventListener('click', () => {
    playClickSound();
    toggleMapModal(playerRef, agentsRef, zombiesRef);
  });

  document.getElementById('minimap-container')?.addEventListener('click', () => {
    playClickSound();
    openMapModal(playerRef, agentsRef, zombiesRef);
  });

  document.getElementById('btn-close-map')?.addEventListener('click', () => {
    playClickSound();
    closeMapModal();
  });

  // Hotkey 'M' to toggle map
  window.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA'].includes(e.target?.tagName)) return;
    if (e.key === 'm' || e.key === 'M' || e.key === 'ท') {
      playClickSound();
      toggleMapModal(playerRef, agentsRef, zombiesRef);
    }
    if (e.key === 'Escape' && isMapModalOpen) {
      closeMapModal();
    }
  });
}

export function toggleMapModal(player, agents, zombies) {
  if (isMapModalOpen) {
    closeMapModal();
  } else {
    openMapModal(player, agents, zombies);
  }
}

export function openMapModal(player, agents, zombies) {
  isMapModalOpen = true;
  const modal = document.getElementById('map-modal');
  if (modal) modal.classList.add('visible');
  renderFullMap(player, agents, zombies);
}

export function closeMapModal() {
  isMapModalOpen = false;
  const modal = document.getElementById('map-modal');
  if (modal) modal.classList.remove('visible');
}

// Render Mini-Map in HUD corner
export function updateMiniMap(player, agents, zombies) {
  if (!miniMapCtx || !miniMapCanvas) return;

  const w = miniMapCanvas.width;
  const h = miniMapCanvas.height;
  const scaleX = w / MAP_COLS;
  const scaleY = h / MAP_ROWS;

  // Clear
  miniMapCtx.fillStyle = '#0F172A';
  miniMapCtx.fillRect(0, 0, w, h);

  // Draw simplified tiles
  for (let r = 0; r < MAP_ROWS; r += 2) {
    for (let c = 0; c < MAP_COLS; c += 2) {
      if (collisionMap[r][c]) {
        miniMapCtx.fillStyle = '#475569';
        miniMapCtx.fillRect(c * scaleX, r * scaleY, scaleX * 2, scaleY * 2);
      } else if (r >= 24 && c < 34) {
        // Labyrinth paths
        miniMapCtx.fillStyle = '#166534';
        miniMapCtx.fillRect(c * scaleX, r * scaleY, scaleX * 2, scaleY * 2);
      } else if (c >= 38) {
        miniMapCtx.fillStyle = r < 22 ? '#312E81' : '#065F46';
        miniMapCtx.fillRect(c * scaleX, r * scaleY, scaleX * 2, scaleY * 2);
      } else {
        miniMapCtx.fillStyle = '#1E293B';
        miniMapCtx.fillRect(c * scaleX, r * scaleY, scaleX * 2, scaleY * 2);
      }
    }
  }

  // Draw Airlock Gate line
  miniMapCtx.fillStyle = GATES.airlock.locked ? '#EF4444' : '#10B981';
  miniMapCtx.fillRect(17 * scaleX, 20 * scaleY, 5 * scaleX, 2 * scaleY);

  // Draw AI Agents (blue dots)
  if (agents) {
    miniMapCtx.fillStyle = '#38BDF8';
    agents.forEach(a => {
      const ax = (a.x / TILE_SIZE) * scaleX;
      const ay = (a.y / TILE_SIZE) * scaleY;
      miniMapCtx.fillRect(ax - 1, ay - 1, 3, 3);
    });
  }

  // Draw Zombies (red dots)
  if (zombies) {
    miniMapCtx.fillStyle = '#EF4444';
    zombies.forEach(z => {
      if (z.state !== 'defeated') {
        const zx = (z.x / TILE_SIZE) * scaleX;
        const zy = (z.y / TILE_SIZE) * scaleY;
        miniMapCtx.fillRect(zx - 1, zy - 1, 2.5, 2.5);
      }
    });
  }

  // Draw Player (pulsing bright orange dot)
  if (player) {
    const px = (player.x / TILE_SIZE) * scaleX;
    const py = (player.y / TILE_SIZE) * scaleY;
    miniMapCtx.fillStyle = '#F97316';
    miniMapCtx.beginPath();
    miniMapCtx.arc(px, py, 3.5, 0, Math.PI * 2);
    miniMapCtx.fill();
    miniMapCtx.strokeStyle = '#FFFFFF';
    miniMapCtx.lineWidth = 1;
    miniMapCtx.stroke();
  }
}

// Render Full Interactive Campus Map
export function renderFullMap(player, agents, zombies) {
  if (!fullMapCtx || !fullMapCanvas) return;

  const w = fullMapCanvas.width;
  const h = fullMapCanvas.height;
  const scale = w / MAP_COLS; // ~10 pixels per tile

  fullMapCtx.clearRect(0, 0, w, h);

  // Background
  fullMapCtx.fillStyle = '#0F172A';
  fullMapCtx.fillRect(0, 0, w, h);

  // 1. Draw Sector Background Tint Zones
  // Sector 1: Safe Haven Lab (Top-Left)
  fullMapCtx.fillStyle = 'rgba(2, 132, 199, 0.15)';
  fullMapCtx.fillRect(4 * scale, 2 * scale, 31 * scale, 17 * scale);

  // Sector 3: Bio-Hazard Mutant Labyrinth (Bottom-Left)
  fullMapCtx.fillStyle = 'rgba(220, 38, 38, 0.15)';
  fullMapCtx.fillRect(4 * scale, 24 * scale, 31 * scale, 17 * scale);

  // Sector 4: Virology Bunker (Top-Right)
  fullMapCtx.fillStyle = 'rgba(124, 58, 237, 0.15)';
  fullMapCtx.fillRect(38 * scale, 2 * scale, 25 * scale, 19 * scale);

  // Sector 5: Evacuation Helipad (Bottom-Right)
  fullMapCtx.fillStyle = 'rgba(16, 185, 129, 0.15)';
  fullMapCtx.fillRect(38 * scale, 24 * scale, 25 * scale, 17 * scale);

  // 2. Render Walls & Walkable Tiles
  for (let r = 0; r < MAP_ROWS; r++) {
    for (let c = 0; c < MAP_COLS; c++) {
      const x = c * scale;
      const y = r * scale;

      if (collisionMap[r][c]) {
        // Wall
        fullMapCtx.fillStyle = '#334155';
        fullMapCtx.fillRect(x, y, scale, scale);
        fullMapCtx.strokeStyle = '#475569';
        fullMapCtx.lineWidth = 0.5;
        fullMapCtx.strokeRect(x, y, scale, scale);
      } else {
        // Walkable floor / corridor
        if (r >= 24 && c < 34) {
          // Labyrinth floor
          fullMapCtx.fillStyle = ((r + c) % 2 === 0) ? '#1E293B' : '#0F172A';
        } else if (c >= 38 && r < 22) {
          fullMapCtx.fillStyle = '#1E1B4B';
        } else if (c >= 38 && r >= 22) {
          fullMapCtx.fillStyle = '#064E3B';
        } else {
          fullMapCtx.fillStyle = '#1E293B';
        }
        fullMapCtx.fillRect(x, y, scale, scale);
      }
    }
  }

  // 3. Highlight Recommended Mission Route (Dotted Golden Arrow Path)
  drawMissionPath(fullMapCtx, scale);

  // 4. Sector Labels & Key Landmarks
  fullMapCtx.font = '700 11px "Prompt", sans-serif';
  fullMapCtx.textAlign = 'center';

  // Sector 1 Label
  drawMapBadge(fullMapCtx, 19 * scale, 4 * scale, '🛡️ โซนที่ 1: ห้องวิจัยปลอดภัย & ที่พัก', '#38BDF8');

  // Sector 2 Label (Airlock Gate)
  const airlockStatus = GATES.airlock.locked ? '🔒 ล็อกอยู่ (ต้องตอบคำถาม)' : '🔓 เปิดแล้ว';
  drawMapBadge(fullMapCtx, 19 * scale, 20 * scale, `🚨 ประตูกักกันโรค [${airlockStatus}]`, GATES.airlock.locked ? '#EF4444' : '#10B981');

  // Sector 3 Label (Labyrinth)
  drawMapBadge(fullMapCtx, 19 * scale, 25.5 * scale, '🌀 โซนที่ 3: เขาวงกตชีวภาพ (BIO-LABYRINTH)', '#F59E0B');

  // Sector 4 Label (Virology Bunker)
  drawMapBadge(fullMapCtx, 50 * scale, 4.5 * scale, '🔬 โซนที่ 4: บังเกอร์ไวรัส & ป้อมเลเซอร์', '#A855F7');

  // Sector 5 Label (Helipad)
  drawMapBadge(fullMapCtx, 50 * scale, 25.5 * scale, '🚁 โซนที่ 5: ลานอพยพ & แท่นสังเคราะห์วัคซีน', '#34D399');

  // 5. Landmark Icons (Terminal positions)
  drawLandmarkPin(fullMapCtx, 22 * scale, 19 * scale, '⚡ Airlock Terminal', '#EF4444');
  drawLandmarkPin(fullMapCtx, 45 * scale, 11 * scale, '⚡ Caspase Laser', '#38BDF8');
  drawLandmarkPin(fullMapCtx, 50 * scale, 30 * scale, '💉 Vaccine Synthesizer', '#10B981');
  drawLandmarkPin(fullMapCtx, 34 * scale, 31.5 * scale, '🚪 ทางออกเขาวงกต (Exit)', '#FBBF24');

  // 6. Draw AI Agents (Blue Circles)
  if (agents) {
    agents.forEach(a => {
      const ax = (a.x / TILE_SIZE) * scale;
      const ay = (a.y / TILE_SIZE) * scale;
      fullMapCtx.fillStyle = '#38BDF8';
      fullMapCtx.beginPath();
      fullMapCtx.arc(ax, ay, 4, 0, Math.PI * 2);
      fullMapCtx.fill();
      fullMapCtx.strokeStyle = '#FFFFFF';
      fullMapCtx.lineWidth = 1;
      fullMapCtx.stroke();
    });
  }

  // 7. Draw Zombies (Red Warning Triangles)
  if (zombies) {
    zombies.forEach(z => {
      if (z.state !== 'defeated') {
        const zx = (z.x / TILE_SIZE) * scale;
        const zy = (z.y / TILE_SIZE) * scale;
        fullMapCtx.fillStyle = '#EF4444';
        fullMapCtx.beginPath();
        fullMapCtx.arc(zx, zy, 3.5, 0, Math.PI * 2);
        fullMapCtx.fill();
      }
    });
  }

  // 8. Draw Player Beacon (Pulsing Pin & Label)
  if (player) {
    const px = (player.x / TILE_SIZE) * scale;
    const py = (player.y / TILE_SIZE) * scale;

    // Glowing Pulse
    fullMapCtx.fillStyle = 'rgba(249, 115, 22, 0.35)';
    fullMapCtx.beginPath();
    fullMapCtx.arc(px, py, 11, 0, Math.PI * 2);
    fullMapCtx.fill();

    // Player Pin
    fullMapCtx.fillStyle = '#EA580C';
    fullMapCtx.beginPath();
    fullMapCtx.arc(px, py, 6, 0, Math.PI * 2);
    fullMapCtx.fill();
    fullMapCtx.strokeStyle = '#FFFFFF';
    fullMapCtx.lineWidth = 2;
    fullMapCtx.stroke();

    // "คุณ (YOU)" Tag
    fullMapCtx.fillStyle = '#EA580C';
    fullMapCtx.beginPath();
    fullMapCtx.roundRect(px - 26, py - 20, 52, 14, 4);
    fullMapCtx.fill();
    fullMapCtx.fillStyle = '#FFFFFF';
    fullMapCtx.font = '700 8.5px "Prompt", sans-serif';
    fullMapCtx.textAlign = 'center';
    fullMapCtx.fillText('📍 คุณ (YOU)', px, py - 10);
  }
}

function drawMissionPath(ctx, scale) {
  ctx.save();
  ctx.strokeStyle = 'rgba(250, 204, 21, 0.75)';
  ctx.lineWidth = 2.5;
  ctx.setLineDash([5, 5]);

  ctx.beginPath();
  // Start from Safe Lab Hallway
  ctx.moveTo(19 * scale, 14 * scale);
  // Through Airlock
  ctx.lineTo(19 * scale, 20 * scale);
  // Down into Labyrinth Entrance
  ctx.lineTo(19 * scale, 25 * scale);
  // Through Labyrinth Winding Corridors
  ctx.lineTo(13 * scale, 25 * scale);
  ctx.lineTo(13 * scale, 29 * scale);
  ctx.lineTo(23 * scale, 29 * scale);
  ctx.lineTo(23 * scale, 33 * scale);
  ctx.lineTo(31 * scale, 33 * scale);
  ctx.lineTo(34 * scale, 31.5 * scale); // Maze Exit
  // Path to Laser Turret & Bunker
  ctx.lineTo(44 * scale, 31.5 * scale);
  ctx.lineTo(45 * scale, 12 * scale); // Caspase Laser
  // Down to Helipad
  ctx.lineTo(45 * scale, 30 * scale);
  ctx.lineTo(50 * scale, 30 * scale); // Vaccine Terminal
  ctx.stroke();

  ctx.restore();
}

function drawMapBadge(ctx, x, y, text, color) {
  ctx.font = '700 10.5px "Prompt", sans-serif';
  const tw = ctx.measureText(text).width;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
  ctx.beginPath();
  ctx.roundRect(x - tw / 2 - 8, y - 8, tw + 16, 16, 4);
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.fillText(text, x, y + 4);
}

function drawLandmarkPin(ctx, x, y, label, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = '#F8FAFC';
  ctx.font = '600 8.5px "Prompt", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(label, x, y + 10);
}
