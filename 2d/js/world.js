// ===== Expanded 2D World & Tilemap Engine =====
// 66 x 42 Vast Campus with 5 Sectors: Safe Lab, Airlock, Mutated Garden, Virology Bunker & Evacuation Helipad

export const TILE_SIZE = 32;
export const MAP_COLS = 66;
export const MAP_ROWS = 42;

export const TILE = {
  GRASS: 0,
  PATH: 1,
  FLOOR_WOOD: 2,
  FLOOR_TILE: 3,
  FLOOR_LAB: 4,
  WALL: 5,
  HAZARD_FLOOR: 6,
  DIRT_RUINS: 7,
  LASER_GATE: 8,
};

// Rooms / Sector definitions
export const ROOMS = {
  // Sector 1: Safe Lab & Dorm (Top-Left)
  DORM_A: { name: 'ห้องพักนักวิจัย A', x: 6, y: 3, w: 7, h: 7 },
  BATH_A: { name: 'ห้องน้ำ A', x: 13, y: 3, w: 4, h: 7 },
  KITCHEN: { name: 'ครัวและบาร์กาแฟ', x: 6, y: 11, w: 11, h: 7 },
  HALLWAY: { name: 'โถงทางเดินหลัก', x: 17, y: 4, w: 5, h: 14 },
  DORM_B: { name: 'ห้องพักนักวิจัย B', x: 22, y: 3, w: 8, h: 7 },
  LOUNGE_LAB: { name: 'ห้องทดลองและห้องเปียโน', x: 22, y: 11, w: 12, h: 7 },

  // Sector 2: Security Airlock (Gate 1)
  AIRLOCK: { name: 'ประตูกักกันโรคและฆ่าเชื้อ (Airlock)', x: 17, y: 18, w: 5, h: 5 },

  // Sector 3: Bio-Hazard Mutant Labyrinth (Bottom-Left)
  LABYRINTH: { name: 'เขาวงกตชีวภาพกลายพันธุ์ (Mutant Bio-Labyrinth)', x: 4, y: 24, w: 31, h: 17 },

  // Sector 4: Virology High-Containment Bunker (Top-Right)
  VIROLOGY_BUNKER: { name: 'ศูนย์วิจัยไวรัสวิทยาชั้นสูง (Virology Bunker)', x: 38, y: 3, w: 24, h: 17 },

  // Sector 5: Evacuation Landing Pad & Ruins (Bottom-Right)
  EVAC_LANDING: { name: 'ลานอพยพฉุกเฉิน (Evacuation Helipad)', x: 38, y: 24, w: 24, h: 16 },
};

// Collision map
export const collisionMap = Array.from({ length: MAP_ROWS }, () => Array(MAP_COLS).fill(false));
export const tileMap = Array.from({ length: MAP_ROWS }, () => Array(MAP_COLS).fill(TILE.GRASS));

// Gate States (locked = blocks movement, unlocked = opens passage)
export const GATES = {
  airlock: { locked: true, row: 20, colStart: 18, colEnd: 21 },
  bunker: { locked: true, row: 11, colStart: 37, colEnd: 38 },
};

export function unlockGate(gateKey) {
  if (GATES[gateKey]) {
    GATES[gateKey].locked = false;
    // Rebuild gate collision
    const g = GATES[gateKey];
    for (let c = g.colStart; c <= g.colEnd; c++) {
      collisionMap[g.row][c] = false;
    }
  }
}

export function initWorld() {
  // 1. Fill base terrain
  for (let r = 0; r < MAP_ROWS; r++) {
    for (let c = 0; c < MAP_COLS; c++) {
      if (r > 23 && c < 36) {
        tileMap[r][c] = TILE.DIRT_RUINS; // Mutated garden
      } else if (c >= 36) {
        tileMap[r][c] = (r < 22) ? TILE.HAZARD_FLOOR : TILE.PATH;
      } else {
        tileMap[r][c] = TILE.GRASS;
      }
      collisionMap[r][c] = false;
    }
  }

  // Paths
  for (let c = 8; c < 35; c++) tileMap[22][c] = TILE.PATH;
  for (let r = 18; r <= 38; r++) tileMap[r][19] = TILE.PATH;
  for (let c = 20; c <= 48; c++) tileMap[23][c] = TILE.PATH;

  // 2. Sector 1: Main Safe Lab & Dorm (Cols 5 to 34, Rows 2 to 18)
  buildSafeLab();

  // 3. Sector 2: Security Airlock Gate
  buildAirlock();

  // 4. Sector 3: Bio-Hazard Mutant Labyrinth (Cols 4 to 34, Rows 24 to 40)
  buildBioLabyrinth();

  // 5. Sector 4: Virology High-Containment Bunker (Cols 38 to 62, Rows 3 to 20)
  buildVirologyBunker();

  // 6. Sector 5: Evacuation Landing Pad (Helipad)
  buildEvacPad();

  // Map Outer Boundaries
  for (let c = 0; c < MAP_COLS; c++) {
    setWall(0, c);
    setWall(MAP_ROWS - 1, c);
  }
  for (let r = 0; r < MAP_ROWS; r++) {
    setWall(r, 0);
    setWall(r, MAP_COLS - 1);
  }
}

function buildBioLabyrinth() {
  const left = 4, right = 34, top = 24, bottom = 40;

  // 1. Perimeter walls with entrance (top col 19, 20) and exit (right row 31, 32)
  for (let c = left; c <= right; c++) {
    if (c !== 19 && c !== 20) setWall(top, c);
    setWall(bottom, c);
  }
  for (let r = top; r <= bottom; r++) {
    setWall(r, left);
    if (r !== 31 && r !== 32) setWall(r, right);
  }

  // 2. Interior maze walls (hedges and bio-containment walls)
  const hWalls = [
    [26, 6, 17], [26, 22, 32],
    [28, 8, 14], [28, 17, 20], [28, 24, 30],
    [30, 6, 10], [30, 13, 22], [30, 26, 32],
    [32, 8, 14], [32, 17, 24], [32, 27, 32],
    [34, 6, 11], [34, 14, 21], [34, 24, 29],
    [36, 8, 15], [36, 18, 25], [36, 28, 32],
    [38, 6, 12], [38, 15, 22], [38, 25, 30],
  ];
  hWalls.forEach(([r, s, e]) => {
    for (let c = s; c <= e; c++) setWall(r, c);
  });

  const vWalls = [
    [7, 29, 33],
    [11, 25, 28], [11, 35, 39],
    [15, 29, 33],
    [18, 33, 37],
    [22, 27, 31],
    [25, 31, 35],
    [29, 27, 31], [29, 35, 38],
  ];
  vWalls.forEach(([c, s, e]) => {
    for (let r = s; r <= e; r++) setWall(r, c);
  });

  // Floor of labyrinth: walkable paths & mutated grounds
  for (let r = top + 1; r < bottom; r++) {
    for (let c = left + 1; c < right; c++) {
      if (!collisionMap[r][c]) {
        tileMap[r][c] = ((r + c) % 3 === 0) ? TILE.PATH : TILE.DIRT_RUINS;
      }
    }
  }

  // Connecting path from exit (row 31, 32, col 34) towards Sector 4 & 5
  for (let c = 34; c <= 40; c++) {
    tileMap[31][c] = TILE.PATH;
    tileMap[32][c] = TILE.PATH;
    collisionMap[31][c] = false;
    collisionMap[32][c] = false;
  }
}

function buildSafeLab() {
  const left = 5, right = 34, top = 2, bottom = 18;

  for (let r = top; r <= bottom; r++) {
    for (let c = left; c <= right; c++) {
      if (c <= 17 && r <= 10) tileMap[r][c] = TILE.FLOOR_TILE;
      else if (c <= 17 && r > 10) tileMap[r][c] = TILE.FLOOR_WOOD;
      else if (c > 17 && c <= 21) tileMap[r][c] = TILE.FLOOR_LAB;
      else if (c > 21 && r <= 10) tileMap[r][c] = TILE.FLOOR_TILE;
      else tileMap[r][c] = TILE.FLOOR_WOOD;
    }
  }

  // Outer Walls
  for (let c = left; c <= right; c++) {
    setWall(top, c);
    if (c !== 19 && c !== 20) setWall(bottom, c);
  }
  for (let r = top; r <= bottom; r++) {
    setWall(r, left);
    setWall(r, right);
  }

  // Partitions
  for (let c = left; c <= right; c++) {
    if (![11, 19, 20, 27].includes(c)) setWall(10, c);
  }
  for (let r = top; r <= bottom; r++) {
    if (![6, 14].includes(r)) setWall(r, 17);
    if (![6, 14].includes(r)) setWall(r, 21);
  }
}

function buildAirlock() {
  // Airlock gate walls
  for (let r = 18; r <= 22; r++) {
    setWall(r, 17);
    setWall(r, 22);
  }

  // Gate 1: Laser Airlock Gate
  const g = GATES.airlock;
  for (let c = g.colStart; c <= g.colEnd; c++) {
    tileMap[g.row][c] = TILE.LASER_GATE;
    if (g.locked) collisionMap[g.row][c] = true;
  }
}

function buildVirologyBunker() {
  const left = 38, right = 62, top = 3, bottom = 20;

  for (let r = top; r <= bottom; r++) {
    for (let c = left; c <= right; c++) {
      tileMap[r][c] = TILE.HAZARD_FLOOR;
    }
  }

  // Outer Bunker Walls
  for (let c = left; c <= right; c++) {
    setWall(top, c);
    setWall(bottom, c);
  }
  for (let r = top; r <= bottom; r++) {
    if (r !== 11 && r !== 12) setWall(r, left);
    setWall(r, right);
  }

  // Bunker Entrance Gate
  const g = GATES.bunker;
  for (let c = g.colStart; c <= g.colEnd; c++) {
    tileMap[g.row][c] = TILE.LASER_GATE;
    if (g.locked) collisionMap[g.row][c] = true;
  }
}

function buildEvacPad() {
  const left = 40, right = 60, top = 25, bottom = 37;
  for (let r = top; r <= bottom; r++) {
    for (let c = left; c <= right; c++) {
      tileMap[r][c] = TILE.PATH;
    }
  }

  // Giant yellow 'H' on Helipad
  const cx = 50, cy = 31;
  for (let r = cy - 3; r <= cy + 3; r++) {
    tileMap[r][cx - 3] = TILE.FLOOR_WOOD;
    tileMap[r][cx + 3] = TILE.FLOOR_WOOD;
  }
  for (let c = cx - 3; c <= cx + 3; c++) {
    tileMap[cy][c] = TILE.FLOOR_WOOD;
  }
}

function setWall(r, c) {
  if (r >= 0 && r < MAP_ROWS && c >= 0 && c < MAP_COLS) {
    tileMap[r][c] = TILE.WALL;
    collisionMap[r][c] = true;
  }
}

export function isSolid(x, y, radius = 10) {
  const points = [
    { x: x - radius, y: y - radius },
    { x: x + radius, y: y - radius },
    { x: x - radius, y: y + radius },
    { x: x + radius, y: y + radius },
  ];

  for (const p of points) {
    const col = Math.floor(p.x / TILE_SIZE);
    const row = Math.floor(p.y / TILE_SIZE);

    if (row < 0 || row >= MAP_ROWS || col < 0 || col >= MAP_COLS) return true;
    if (collisionMap[row][col]) return true;
  }
  return false;
}

export function renderWorld(ctx, camera) {
  const startCol = Math.max(0, Math.floor(camera.x / TILE_SIZE));
  const endCol = Math.min(MAP_COLS - 1, Math.ceil((camera.x + camera.width) / TILE_SIZE));
  const startRow = Math.max(0, Math.floor(camera.y / TILE_SIZE));
  const endRow = Math.min(MAP_ROWS - 1, Math.ceil((camera.y + camera.height) / TILE_SIZE));

  for (let r = startRow; r <= endRow; r++) {
    for (let c = startCol; c <= endCol; c++) {
      const x = c * TILE_SIZE - camera.x;
      const y = r * TILE_SIZE - camera.y;
      drawTile(ctx, tileMap[r][c], x, y, r, c);
    }
  }

  // Draw Sector Banners on ground
  drawSectorLabels(ctx, camera);
}

function drawTile(ctx, type, x, y, r, c) {
  switch (type) {
    case TILE.GRASS:
      ctx.fillStyle = (r + c) % 2 === 0 ? '#86EFAC' : '#4ADE80';
      ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
      break;

    case TILE.PATH:
      ctx.fillStyle = '#FEF08A';
      ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
      ctx.fillStyle = '#FDE047';
      ctx.fillRect(x + 4, y + 4, 8, 8);
      break;

    case TILE.FLOOR_WOOD:
      ctx.fillStyle = (r % 2 === 0) ? '#FDE68A' : '#FCD34D';
      ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
      ctx.strokeStyle = 'rgba(180, 83, 9, 0.25)';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, TILE_SIZE, TILE_SIZE);
      break;

    case TILE.FLOOR_TILE:
      ctx.fillStyle = '#FEE2E2';
      ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
      ctx.strokeStyle = 'rgba(200, 100, 100, 0.2)';
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 2, y + 2, TILE_SIZE - 4, TILE_SIZE - 4);
      break;

    case TILE.FLOOR_LAB:
      ctx.fillStyle = '#F3F4F6';
      ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
      ctx.strokeStyle = 'rgba(156, 163, 175, 0.3)';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, TILE_SIZE, TILE_SIZE);
      break;

    case TILE.HAZARD_FLOOR:
      // Dark high-tech hazard steel floor with yellow caution stripes
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
      if ((r + c) % 3 === 0) {
        ctx.fillStyle = '#EAB308';
        ctx.fillRect(x + 4, y + 4, 10, 3);
        ctx.fillRect(x + 16, y + 16, 10, 3);
      }
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, TILE_SIZE, TILE_SIZE);
      break;

    case TILE.DIRT_RUINS:
      // Mutated overgrown earth
      ctx.fillStyle = '#422006';
      ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
      if ((r * 3 + c * 7) % 5 === 0) {
        ctx.fillStyle = '#15803D';
        ctx.fillRect(x + 6, y + 6, 8, 4);
      }
      break;

    case TILE.WALL:
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(x + 3, y + 3, TILE_SIZE - 6, TILE_SIZE - 6);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x + 1, y + 1, TILE_SIZE - 2, TILE_SIZE - 2);
      break;

    case TILE.LASER_GATE:
      // Electric laser beam fence
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
      const isAirlockLocked = GATES.airlock.locked;
      ctx.strokeStyle = isAirlockLocked ? '#EF4444' : '#10B981';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x, y + 16); ctx.lineTo(x + TILE_SIZE, y + 16);
      ctx.stroke();
      break;
  }
}

function drawSectorLabels(ctx, camera) {
  const sectors = [
    { text: '🛡️ SECTOR 1: SAFE HAVEN LAB', x: 19 * TILE_SIZE, y: 2.5 * TILE_SIZE, color: '#0284C7' },
    { text: '🌀 SECTOR 3: เขาวงกตชีวภาพ (BIO-LABYRINTH)', x: 19 * TILE_SIZE, y: 24.5 * TILE_SIZE, color: '#EF4444' },
    { text: '🔬 SECTOR 4: VIROLOGY BUNKER', x: 50 * TILE_SIZE, y: 3.5 * TILE_SIZE, color: '#7C3AED' },
    { text: '🚁 SECTOR 5: EVACUATION HELIPAD', x: 50 * TILE_SIZE, y: 24.5 * TILE_SIZE, color: '#16A34A' },
  ];

  ctx.font = '700 13px "Prompt", sans-serif';
  ctx.textAlign = 'center';
  sectors.forEach((s) => {
    const sx = s.x - camera.x;
    const sy = s.y - camera.y;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    ctx.beginPath();
    ctx.roundRect(sx - 120, sy - 14, 240, 22, 6);
    ctx.fill();
    ctx.fillStyle = s.color;
    ctx.fillText(s.text, sx, sy + 2);
  });
}
