// ===== Playable Character Controller =====
import { TILE_SIZE, isSolid } from './world.js';
import { playFootstep } from './audio.js';

export class Player {
  constructor(startTileX = 19, startTileY = 13) {
    this.x = startTileX * TILE_SIZE + 16;
    this.y = startTileY * TILE_SIZE + 16;
    this.speed = 2.6;
    this.sprintMultiplier = 1.6;

    this.dir = 'down';
    this.animFrame = 0;
    this.stepTimer = 0;
    this.isMoving = false;

    // Click to move target
    this.targetPos = null;

    // Keys state
    this.keys = {
      up: false,
      down: false,
      left: false,
      right: false,
      shift: false,
    };

    // Virtual joystick input (-1.0 to 1.0)
    this.joystick = { x: 0, y: 0 };

    this.speechBubble = null;
    this.avatarType = 'fox'; // 'fox' | 'human'

    // Survival / Combat properties
    this.hp = 100;
    this.maxHp = 100;
    this.invulnerableTimer = 0;
    this.flashTimer = 0;

    this.initInput();
  }

  takeDamage(amount = 10) {
    if (this.invulnerableTimer > 0 || this.hp <= 0) return;
    this.hp = Math.max(0, this.hp - amount);
    this.invulnerableTimer = 0.8; // 0.8s i-frames
    this.flashTimer = 0.25;

    // Dispatch event to update HUD
    window.dispatchEvent(new CustomEvent('player-hp-change', { detail: { hp: this.hp, maxHp: this.maxHp } }));

    if (this.hp <= 0) {
      window.dispatchEvent(new CustomEvent('player-died'));
    }
  }

  heal(amount = 25) {
    this.hp = Math.min(this.maxHp, this.hp + amount);
    window.dispatchEvent(new CustomEvent('player-hp-change', { detail: { hp: this.hp, maxHp: this.maxHp } }));
  }

  respawn(tileX = 19, tileY = 13) {
    this.x = tileX * TILE_SIZE + 16;
    this.y = tileY * TILE_SIZE + 16;
    this.hp = this.maxHp;
    this.invulnerableTimer = 2.0;
    this.targetPos = null;
    this.keys.up = false;
    this.keys.down = false;
    this.keys.left = false;
    this.keys.right = false;
    this.joystick.x = 0;
    this.joystick.y = 0;
    window.dispatchEvent(new CustomEvent('player-hp-change', { detail: { hp: this.hp, maxHp: this.maxHp } }));
  }

  initInput() {
    const isUpKey = (code, key) => code === 'KeyW' || code === 'ArrowUp' || ['w', 'w', 'ไ', 'ำ', 'arrowup'].includes(key);
    const isDownKey = (code, key) => code === 'KeyS' || code === 'ArrowDown' || ['s', 's', 'ห', 'ฆ', 'arrowdown'].includes(key);
    const isLeftKey = (code, key) => code === 'KeyA' || code === 'ArrowLeft' || ['a', 'a', 'ฟ', 'ฤ', 'arrowleft'].includes(key);
    const isRightKey = (code, key) => code === 'KeyD' || code === 'ArrowRight' || ['d', 'd', 'ก', 'ฏ', 'arrowright'].includes(key);

    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target?.tagName)) return;
      const key = (e.key || '').toLowerCase();
      const code = e.code || '';

      if (isUpKey(code, key)) {
        this.keys.up = true;
        this.targetPos = null;
      }
      if (isDownKey(code, key)) {
        this.keys.down = true;
        this.targetPos = null;
      }
      if (isLeftKey(code, key)) {
        this.keys.left = true;
        this.targetPos = null;
      }
      if (isRightKey(code, key)) {
        this.keys.right = true;
        this.targetPos = null;
      }
      if (code === 'ShiftLeft' || code === 'ShiftRight' || key === 'shift') {
        this.keys.shift = true;
      }
      if (code === 'KeyE' || key === 'e' || key === 'ำ' || key === 'ฎ') {
        window.dispatchEvent(new CustomEvent('player-interact-2d'));
      }
    });

    window.addEventListener('keyup', (e) => {
      const key = (e.key || '').toLowerCase();
      const code = e.code || '';

      if (isUpKey(code, key)) this.keys.up = false;
      if (isDownKey(code, key)) this.keys.down = false;
      if (isLeftKey(code, key)) this.keys.left = false;
      if (isRightKey(code, key)) this.keys.right = false;
      if (code === 'ShiftLeft' || code === 'ShiftRight' || key === 'shift') this.keys.shift = false;
    });

    window.addEventListener('blur', () => {
      this.keys.up = false;
      this.keys.down = false;
      this.keys.left = false;
      this.keys.right = false;
      this.keys.shift = false;
    });
  }

  setTargetPos(worldX, worldY) {
    this.targetPos = { x: worldX, y: worldY };
  }

  update(delta) {
    if (this.invulnerableTimer > 0) this.invulnerableTimer -= delta;
    if (this.flashTimer > 0) this.flashTimer -= delta;

    if (this.speechBubble) {
      this.speechBubble.timer -= delta;
      if (this.speechBubble.timer <= 0) this.speechBubble = null;
    }

    let vx = 0;
    let vy = 0;

    // 1. Keyboard
    if (this.keys.left) vx -= 1;
    if (this.keys.right) vx += 1;
    if (this.keys.up) vy -= 1;
    if (this.keys.down) vy += 1;

    // 2. Virtual Joystick
    if (this.joystick.x !== 0 || this.joystick.y !== 0) {
      vx += this.joystick.x;
      vy += this.joystick.y;
    }

    // 3. Click-to-move
    if (this.targetPos && vx === 0 && vy === 0) {
      const dx = this.targetPos.x - this.x;
      const dy = this.targetPos.y - this.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 6) {
        this.targetPos = null;
      } else {
        vx = dx / dist;
        vy = dy / dist;
      }
    }

    this.isMoving = Math.hypot(vx, vy) > 0.05;

    if (this.isMoving) {
      // Normalize
      const mag = Math.hypot(vx, vy);
      vx /= mag;
      vy /= mag;

      const currentSpeed = (this.keys.shift ? this.speed * this.sprintMultiplier : this.speed) * 60 * delta;

      // Update facing
      if (Math.abs(vx) > Math.abs(vy)) {
        this.dir = vx > 0 ? 'right' : 'left';
      } else {
        this.dir = vy > 0 ? 'down' : 'up';
      }

      // Collisions with sliding (radius 7 for smooth navigation)
      const nextX = this.x + vx * currentSpeed;
      const nextY = this.y + vy * currentSpeed;

      if (!isSolid(nextX, this.y, 7)) this.x = nextX;
      if (!isSolid(this.x, nextY, 7)) this.y = nextY;

      // Emergency un-stuck recovery
      if (isSolid(this.x, this.y, 4)) {
        const recoveryOffsets = [[0, -12], [0, 12], [-12, 0], [12, 0], [0, -24], [0, 24]];
        for (const [ox, oy] of recoveryOffsets) {
          if (!isSolid(this.x + ox, this.y + oy, 6)) {
            this.x += ox;
            this.y += oy;
            break;
          }
        }
      }

      // Animation & sound
      this.stepTimer += delta * 10;
      this.animFrame = Math.floor(this.stepTimer) % 4;
      if (Math.floor(this.stepTimer) % 3 === 0 && Math.random() < 0.15) {
        playFootstep();
      }
    }
  }

  showBubble(text, emoji = '🦊', duration = 3.5) {
    this.speechBubble = { text, emoji, timer: duration };
  }

  render(ctx, camera) {
    const rx = this.x - camera.x;
    const ry = this.y - camera.y;

    // Flicker if invulnerable
    if (this.invulnerableTimer > 0 && Math.floor(Date.now() / 80) % 2 === 0) {
      ctx.globalAlpha = 0.45;
    }

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.ellipse(rx, ry + 12, 11, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    const bob = this.isMoving ? Math.sin(this.stepTimer * 2) * 1.5 : 0;

    // Cute Pixel Fox / Researcher Avatar
    if (this.avatarType === 'fox') {
      // Orange Fox Body
      ctx.fillStyle = '#EA580C';
      ctx.beginPath();
      ctx.roundRect(rx - 8, ry - 3 + bob, 16, 14, 4);
      ctx.fill();

      // White Chest Fur
      ctx.fillStyle = '#FFF7ED';
      ctx.fillRect(rx - 4, ry - 1 + bob, 8, 8);

      // Fox Head
      ctx.fillStyle = '#F97316';
      ctx.beginPath();
      ctx.arc(rx, ry - 9 + bob, 8.5, 0, Math.PI * 2);
      ctx.fill();

      // Fox Ears
      ctx.fillStyle = '#EA580C';
      ctx.beginPath();
      ctx.moveTo(rx - 7, ry - 14 + bob); ctx.lineTo(rx - 3, ry - 20 + bob); ctx.lineTo(rx - 1, ry - 13 + bob);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(rx + 7, ry - 14 + bob); ctx.lineTo(rx + 3, ry - 20 + bob); ctx.lineTo(rx + 1, ry - 13 + bob);
      ctx.fill();

      // White inner ear
      ctx.fillStyle = '#FEF08A';
      ctx.fillRect(rx - 5, ry - 17 + bob, 2.5, 3);
      ctx.fillRect(rx + 2.5, ry - 17 + bob, 2.5, 3);

      // Cute Eyes & Black Nose
      ctx.fillStyle = '#1E293B';
      if (this.dir !== 'up') {
        ctx.fillRect(rx - 4, ry - 10 + bob, 2.5, 2.5);
        ctx.fillRect(rx + 1.5, ry - 10 + bob, 2.5, 2.5);
        ctx.fillStyle = '#0F172A';
        ctx.fillRect(rx - 1, ry - 7 + bob, 2, 2);
      }

      // Bushy tail
      ctx.fillStyle = '#EA580C';
      ctx.beginPath();
      ctx.ellipse(rx - 8, ry + 4 + bob, 5, 8, -Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(rx - 10, ry + 1 + bob, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Name Tag
    ctx.fillStyle = 'rgba(234, 88, 12, 0.9)';
    ctx.beginPath();
    ctx.roundRect(rx - 24, ry + 16, 48, 13, 6);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 8.5px "Prompt", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('คุณ (Player)', rx, ry + 26);

    // Speech bubble
    if (this.speechBubble) {
      const text = `YOU: ${this.speechBubble.emoji} ${this.speechBubble.text}`;
      ctx.font = '700 11px "Prompt", sans-serif';
      const textW = ctx.measureText(text).width;
      const bw = textW + 16;
      const bh = 22;
      const bx = rx;
      const by = ry - 22;

      ctx.fillStyle = '#FFF7ED';
      ctx.beginPath();
      ctx.roundRect(bx - bw / 2, by - bh, bw, bh, 6);
      ctx.fill();
      ctx.strokeStyle = '#EA580C';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Pointer
      ctx.fillStyle = '#FFF7ED';
      ctx.beginPath();
      ctx.moveTo(bx - 4, by); ctx.lineTo(bx, by + 4); ctx.lineTo(bx + 4, by);
      ctx.fill();

      ctx.fillStyle = '#7C2D12';
      ctx.textAlign = 'center';
      ctx.fillText(text, bx, by - 6);
    }

    // Overhead Mini HP Bar if damaged
    if (this.hp < this.maxHp) {
      const barW = 28;
      const barH = 4;
      const barX = rx - barW / 2;
      const barY = ry - 24;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(barX - 1, barY - 1, barW + 2, barH + 2);
      ctx.fillStyle = '#EF4444';
      ctx.fillRect(barX, barY, barW, barH);
      ctx.fillStyle = '#22C55E';
      ctx.fillRect(barX, barY, (this.hp / this.maxHp) * barW, barH);
    }

    ctx.globalAlpha = 1.0;
  }
}
