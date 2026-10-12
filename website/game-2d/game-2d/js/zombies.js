// ===== Bio-Hazard Zombie Mutants System =====
import { TILE_SIZE, isSolid } from './world.js';
import { playNote } from './audio.js';

export class Zombie {
  constructor(x, y, type = 'walker') {
    this.x = x;
    this.y = y;
    this.type = type; // 'walker' | 'spitter' | 'brute'
    this.speed = type === 'brute' ? 0.75 : 1.15;
    this.hp = type === 'brute' ? 3 : 1;
    this.maxHp = this.hp;

    this.dir = 'down';
    this.state = 'roam'; // 'roam' | 'chase' | 'stunned' | 'defeated'
    this.roamTimer = Math.random() * 3;
    this.roamVx = 0;
    this.roamVy = 0;

    this.groanTimer = 3 + Math.random() * 8;
    this.speechBubble = null;
    this.animTimer = 0;
    this.flashTimer = 0;
  }

  update(delta, player, isSurvivalMode) {
    if (this.state === 'defeated') return;

    this.animTimer += delta * 6;

    if (this.flashTimer > 0) this.flashTimer -= delta;

    if (this.speechBubble) {
      this.speechBubble.timer -= delta;
      if (this.speechBubble.timer <= 0) this.speechBubble = null;
    }

    // Groan timer
    this.groanTimer -= delta;
    if (this.groanTimer <= 0) {
      this.groanTimer = 6 + Math.random() * 8;
      const groans = ['🧟', '🧠', '☣️', '🩸', '🥩'];
      this.speechBubble = {
        emoji: groans[Math.floor(Math.random() * groans.length)],
        timer: 3.0,
      };
      if (Math.hypot(player.x - this.x, player.y - this.y) < 220) {
        playZombieGroan();
      }
    }

    if (!isSurvivalMode) {
      // In peaceful cozy mode, zombies remain stationary or roam slowly inside quarantined ruins
      this.roam(delta, 0.4);
      return;
    }

    // Check distance to player
    const dist = Math.hypot(player.x - this.x, player.y - this.y);

    if (dist < 180) {
      // Chase player!
      this.state = 'chase';
      const dx = player.x - this.x;
      const dy = player.y - this.y;
      const mag = Math.hypot(dx, dy);

      if (mag > 2) {
        const vx = (dx / mag) * this.speed * 60 * delta;
        const vy = (dy / mag) * this.speed * 60 * delta;

        this.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');

        if (!isSolid(this.x + vx, this.y, 10)) this.x += vx;
        if (!isSolid(this.x, this.y + vy, 10)) this.y += vy;
      }

      // Attack contact check
      if (dist < 18) {
        player.takeDamage(12);
        // Small recoil
        this.x -= (dx / mag) * 16;
        this.y -= (dy / mag) * 16;
      }
    } else {
      this.state = 'roam';
      this.roam(delta, 1.0);
    }
  }

  roam(delta, speedFactor = 1.0) {
    this.roamTimer -= delta;
    if (this.roamTimer <= 0) {
      this.roamTimer = 2 + Math.random() * 4;
      const angle = Math.random() * Math.PI * 2;
      this.roamVx = Math.cos(angle) * (this.speed * 0.5 * speedFactor);
      this.roamVy = Math.sin(angle) * (this.speed * 0.5 * speedFactor);
      this.dir = Math.abs(this.roamVx) > Math.abs(this.roamVy) ? (this.roamVx > 0 ? 'right' : 'left') : (this.roamVy > 0 ? 'down' : 'up');
    }

    const nextX = this.x + this.roamVx * 60 * delta;
    const nextY = this.y + this.roamVy * 60 * delta;

    if (!isSolid(nextX, this.y, 10)) this.x = nextX;
    else this.roamVx = -this.roamVx;

    if (!isSolid(this.x, nextY, 10)) this.y = nextY;
    else this.roamVy = -this.roamVy;
  }

  takeDamage(amount = 1) {
    this.hp -= amount;
    this.flashTimer = 0.25;
    if (this.hp <= 0) {
      this.state = 'defeated';
    }
  }

  render(ctx, camera) {
    if (this.state === 'defeated') return;

    const rx = this.x - camera.x;
    const ry = this.y - camera.y;

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.ellipse(rx, ry + 12, 10, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    const wobble = Math.sin(this.animTimer) * 2;

    // Mutant Skin (Green / Toxic Purple)
    ctx.fillStyle = this.flashTimer > 0 ? '#FFFFFF' : (this.type === 'brute' ? '#7E22CE' : '#15803D');

    // Body
    ctx.beginPath();
    ctx.roundRect(rx - 8, ry - 3 + wobble, 16, 15, 4);
    ctx.fill();

    // Tattered clothes
    ctx.fillStyle = '#334155';
    ctx.fillRect(rx - 6, ry + 3 + wobble, 12, 6);

    // Mutant Head
    ctx.fillStyle = this.flashTimer > 0 ? '#FFFFFF' : (this.type === 'brute' ? '#A855F7' : '#22C55E');
    ctx.beginPath();
    ctx.arc(rx, ry - 9 + wobble, 8, 0, Math.PI * 2);
    ctx.fill();

    // Glowing Red Mutant Eyes
    ctx.fillStyle = '#EF4444';
    if (this.dir !== 'up') {
      ctx.fillRect(rx - 4, ry - 11 + wobble, 2.5, 2.5);
      ctx.fillRect(rx + 1.5, ry - 11 + wobble, 2.5, 2.5);
    }

    // Mutant Arms reaching forward
    ctx.fillStyle = '#166534';
    if (this.dir === 'right') {
      ctx.fillRect(rx + 5, ry - 1 + wobble, 8, 4);
    } else if (this.dir === 'left') {
      ctx.fillRect(rx - 13, ry - 1 + wobble, 8, 4);
    } else {
      ctx.fillRect(rx - 9, ry + 1 + wobble, 4, 8);
      ctx.fillRect(rx + 5, ry + 1 + wobble, 4, 8);
    }

    // Floating Groan Bubble
    if (this.speechBubble) {
      const text = `INF: ${this.speechBubble.emoji}`;
      ctx.font = '700 10.5px "Prompt", monospace';
      const textW = ctx.measureText(text).width;
      const bw = textW + 14;
      const bh = 20;
      const bx = rx;
      const by = ry - 24;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.beginPath();
      ctx.roundRect(bx - bw / 2, by - bh, bw, bh, 5);
      ctx.fill();
      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#FEF2F2';
      ctx.textAlign = 'center';
      ctx.fillText(text, bx, by - 5);
    }
  }
}

// Particle Bursts on Laser / Vaccine Cleansing
export class ParticleEmitter {
  constructor() {
    this.particles = [];
  }

  spawnLaserBlast(x, y, count = 25) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 4;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: Math.random() > 0.5 ? '#38BDF8' : '#818CF8',
        size: 3 + Math.random() * 3,
        life: 0.6 + Math.random() * 0.4,
        maxLife: 1.0,
      });
    }
  }

  spawnCureMist(x, y, count = 30) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 3;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: '#34D399',
        size: 3 + Math.random() * 3,
        life: 0.8 + Math.random() * 0.5,
        maxLife: 1.2,
      });
    }
  }

  update(delta) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * 60 * delta;
      p.y += p.vy * 60 * delta;
      p.life -= delta;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  render(ctx, camera) {
    this.particles.forEach((p) => {
      const alpha = Math.max(0, p.life / p.maxLife);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(p.x - camera.x, p.y - camera.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1.0;
  }
}

export function createZombieHorde() {
  const horde = [
    // Sector 3 (Bio-Hazard Mutant Labyrinth, cols 4 to 34, rows 24 to 40)
    new Zombie(19 * TILE_SIZE, 25 * TILE_SIZE, 'walker'), // Patrolling near maze entry
    new Zombie(9 * TILE_SIZE, 27 * TILE_SIZE, 'spitter'), // Patrolling west corridor
    new Zombie(16 * TILE_SIZE, 31 * TILE_SIZE, 'walker'), // Patrolling central maze loop
    new Zombie(23 * TILE_SIZE, 29 * TILE_SIZE, 'walker'), // Patrolling east corridor
    new Zombie(19 * TILE_SIZE, 37 * TILE_SIZE, 'brute'),  // Lurking in deep southern maze
    new Zombie(32 * TILE_SIZE, 31 * TILE_SIZE, 'walker'), // Guarding maze exit

    // Sector 4 (Virology Bunker Ruins, cols 40 to 58)
    new Zombie(42 * TILE_SIZE, 8 * TILE_SIZE, 'walker'),
    new Zombie(50 * TILE_SIZE, 12 * TILE_SIZE, 'brute'),
    new Zombie(46 * TILE_SIZE, 18 * TILE_SIZE, 'walker'),

    // Sector 5 (Evacuation Landing Ruins)
    new Zombie(44 * TILE_SIZE, 32 * TILE_SIZE, 'walker'),
    new Zombie(52 * TILE_SIZE, 35 * TILE_SIZE, 'spitter'),
    new Zombie(56 * TILE_SIZE, 28 * TILE_SIZE, 'brute'),
  ];
  return horde;
}

function playZombieGroan() {
  playNote(90 + Math.random() * 25, 'sawtooth', 0.22, 0.05);
}
