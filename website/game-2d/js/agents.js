// ===== Autonomous Generative Agents Engine =====
import { TILE_SIZE, isSolid, ROOMS } from './world.js';
import { generateConversation } from './dialogue.js';

export class Agent {
  constructor(config) {
    this.id = config.id;
    this.name = config.name;
    this.initials = config.initials;
    this.role = config.role;
    this.avatarColor = config.avatarColor;
    this.hairColor = config.hairColor;
    this.isRobot = config.isRobot || false;

    // Position in pixel world
    this.x = config.startTileX * TILE_SIZE + 16;
    this.y = config.startTileY * TILE_SIZE + 16;
    this.targetX = this.x;
    this.targetY = this.y;
    this.speed = config.speed || 1.1;

    // Movement direction & animation frame
    this.dir = 'down'; // 'down' | 'up' | 'left' | 'right'
    this.animFrame = 0;
    this.stepTimer = 0;

    // AI state & routine
    this.state = 'idle'; // 'idle' | 'moving' | 'working' | 'talking' | 'sleeping'
    this.stateTimer = 2.0;
    this.currentActivity = config.defaultActivity || 'เดินสำรวจห้องทดลอง';
    this.currentRoom = config.defaultRoom || 'HALLWAY';

    // Dialogue & Speech Bubble (Matching screenshot)
    this.speechBubble = null; // { text, emoji, initials, timer }
    this.partnerAgent = null;

    // Stats & Generative Memory
    this.stats = {
      energy: 95,
      hunger: 30,
      focus: 90,
    };
    this.memories = [
      `[08:00] เริ่มต้นวันใหม่ที่สถาบันวิจัยชีววิทยาโมเลกุลเกาะเซลล์ลอยฟ้า`,
      `[08:15] วางแผนเป้าหมายการทดลองประจำวัน: ${this.currentActivity}`,
    ];
  }

  update(delta, allAgents) {
    // 1. Countdown speech bubble
    if (this.speechBubble) {
      this.speechBubble.timer -= delta;
      if (this.speechBubble.timer <= 0) {
        this.speechBubble = null;
      }
    }

    // 2. State Machine
    if (this.state === 'talking') {
      // Waiting during conversation
      this.stateTimer -= delta;
      if (this.stateTimer <= 0) {
        this.state = 'idle';
        this.partnerAgent = null;
        this.stateTimer = 1.5 + Math.random() * 3;
      }
      return;
    }

    if (this.state === 'working' || this.state === 'sleeping') {
      this.stateTimer -= delta;
      if (this.stateTimer <= 0) {
        this.state = 'idle';
        this.stateTimer = 2.0;
      }
      return;
    }

    if (this.state === 'idle') {
      this.stateTimer -= delta;
      if (this.stateTimer <= 0) {
        this.pickNewTarget(allAgents);
      }
    } else if (this.state === 'moving') {
      this.moveTowardsTarget(delta);

      // Check proximity to other agents for spontaneous conversation
      this.checkForSpontaneousChat(allAgents);
    }
  }

  pickNewTarget(allAgents) {
    // Choose a destination from rooms
    const roomKeys = Object.keys(ROOMS);
    const targetRoomKey = roomKeys[Math.floor(Math.random() * roomKeys.length)];
    const room = ROOMS[targetRoomKey];
    this.currentRoom = targetRoomKey;

    // Pick a random walkable spot within room
    let attempts = 0;
    while (attempts < 15) {
      const rx = (room.x + 1 + Math.floor(Math.random() * (room.w - 2))) * TILE_SIZE + 16;
      const ry = (room.y + 1 + Math.floor(Math.random() * (room.h - 2))) * TILE_SIZE + 16;

      if (!isSolid(rx, ry, 12)) {
        this.targetX = rx;
        this.targetY = ry;
        this.state = 'moving';
        this.updateActivityDescription(targetRoomKey);
        return;
      }
      attempts++;
    }

    this.state = 'idle';
    this.stateTimer = 2.0;
  }

  updateActivityDescription(roomKey) {
    const activities = {
      LOUNGE_LAB: ['วิเคราะห์ผลตรวจ DNA Sequencer', 'ส่องกล้องสลายตัวของเซลล์', 'นั่งผ่อนคลายเล่นเปียโน', 'สนทนาแลกเปลี่ยนวิจัย'],
      KITCHEN: ['แวะชงกาแฟเอสเปรสโซ่หอมกรุ่น', 'เปิดตู้เย็นหาของว่างรองท้อง', 'นั่งคุยสบายๆ ที่เคาน์เตอร์บาร์'],
      DORM_A: ['อ่านบันทึกวิจัยพันธุศาสตร์', 'พักผ่อนบนเตียงนอน A', 'จัดเอกสารบนโต๊ะ'],
      DORM_B: ['เปิดค้นตำราในชั้นหนังสือชีววิทยา', 'พักสายตาบนเตียง B', 'เขียนสมมติฐานการวิจัยใหม่'],
      GARDEN: ['เดินรับลมชมดอกไม้ในสวน', 'สังเกตการสังเคราะห์แสงของพืช', 'สูดอากาศบริสุทธิ์'],
      HALLWAY: ['เดินตรวจความเรียบร้อยตามโถงทางเดิน', 'ทักทายเพื่อนร่วมงาน'],
      BATH_A: ['ล้างมือและจัดระเบียบเสื้อกาวน์'],
    };

    const acts = activities[roomKey] || ['เดินสำรวจ'];
    this.currentActivity = acts[Math.floor(Math.random() * acts.length)];

    // Show emoji thought bubble occasionally
    if (Math.random() < 0.45) {
      const thoughts = ['💡', '🧬', '🔬', '☕', '🎵', '🍕', '📝', '✨'];
      this.showBubble(thoughts[Math.floor(Math.random() * thoughts.length)], 3.5);
    }
  }

  moveTowardsTarget(delta) {
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const dist = Math.hypot(dx, dy);

    if (dist < 4) {
      this.x = this.targetX;
      this.y = this.targetY;
      this.state = 'working';
      this.stateTimer = 4.0 + Math.random() * 6.0;
      return;
    }

    // Step calculation
    const step = this.speed * 60 * delta;
    const vx = (dx / dist) * step;
    const vy = (dy / dist) * step;

    // Update facing direction
    if (Math.abs(dx) > Math.abs(dy)) {
      this.dir = dx > 0 ? 'right' : 'left';
    } else {
      this.dir = dy > 0 ? 'down' : 'up';
    }

    // Collision check
    const nextX = this.x + vx;
    const nextY = this.y + vy;

    if (!isSolid(nextX, this.y, 10)) this.x = nextX;
    if (!isSolid(this.x, nextY, 10)) this.y = nextY;

    // Walking animation
    this.stepTimer += delta * 8;
    this.animFrame = Math.floor(this.stepTimer) % 4;
  }

  checkForSpontaneousChat(allAgents) {
    if (this.speechBubble || this.state === 'talking') return;

    for (const other of allAgents) {
      if (other.id !== this.id && other.state !== 'talking') {
        const d = Math.hypot(this.x - other.x, this.y - other.y);
        if (d < 36 && Math.random() < 0.04) {
          // Trigger conversation!
          this.state = 'talking';
          this.stateTimer = 6.0;
          this.partnerAgent = other;

          other.state = 'talking';
          other.stateTimer = 6.0;
          other.partnerAgent = this;

          const conv = generateConversation(this, other);
          this.showBubble(conv.emojiA, 4.5);
          other.showBubble(conv.emojiB, 4.5);
          break;
        }
      }
    }
  }

  showBubble(emoji, duration = 4.0) {
    this.speechBubble = {
      initials: this.initials,
      emoji: emoji,
      timer: duration,
    };
  }

  render(ctx, camera) {
    const rx = this.x - camera.x;
    const ry = this.y - camera.y;

    // Character Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.ellipse(rx, ry + 12, 10, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Robot vs Human Rendering
    if (this.isRobot) {
      this.renderRobot(ctx, rx, ry);
    } else {
      this.renderHuman(ctx, rx, ry);
    }

    // Name Tag (Small cute badge)
    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    ctx.beginPath();
    ctx.roundRect(rx - 22, ry + 16, 44, 13, 6);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 8.5px "Prompt", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(this.name.split(' ')[0], rx, ry + 26);

    // Floating Speech Bubble (Screenshot style: e.g. "AD: 💬 🧬")
    if (this.speechBubble) {
      this.renderSpeechBubble(ctx, rx, ry - 22);
    }
  }

  renderHuman(ctx, rx, ry) {
    const bob = (this.state === 'moving') ? Math.sin(this.stepTimer * 2) * 1.5 : 0;

    // Body / Lab Coat
    ctx.fillStyle = this.avatarColor;
    ctx.beginPath();
    ctx.roundRect(rx - 8, ry - 4 + bob, 16, 16, 4);
    ctx.fill();
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Lab Coat Collar
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(rx - 4, ry - 4 + bob, 8, 8);

    // Head
    ctx.fillStyle = '#FFE4C4';
    ctx.beginPath();
    ctx.arc(rx, ry - 10 + bob, 8, 0, Math.PI * 2);
    ctx.fill();

    // Hair
    ctx.fillStyle = this.hairColor;
    ctx.beginPath();
    ctx.arc(rx, ry - 13 + bob, 8.5, Math.PI, Math.PI * 2);
    ctx.fill();
    if (this.dir === 'left') {
      ctx.fillRect(rx - 8, ry - 14 + bob, 4, 10);
    } else if (this.dir === 'right') {
      ctx.fillRect(rx + 4, ry - 14 + bob, 4, 10);
    }

    // Eyes
    ctx.fillStyle = '#1E293B';
    if (this.dir !== 'up') {
      ctx.fillRect(rx - 4, ry - 11 + bob, 2.5, 3);
      ctx.fillRect(rx + 1.5, ry - 11 + bob, 2.5, 3);
    }

    // Legs / Feet
    const legOffset = (this.state === 'moving') ? Math.sin(this.stepTimer) * 3 : 0;
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(rx - 6, ry + 10 + legOffset, 4, 5);
    ctx.fillRect(rx + 2, ry + 10 - legOffset, 4, 5);
  }

  renderRobot(ctx, rx, ry) {
    const float = Math.sin(Date.now() * 0.006) * 2;

    // Metallic body
    ctx.fillStyle = '#38BDF8';
    ctx.beginPath();
    ctx.arc(rx, ry - 6 + float, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#0284C7';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Digital Visor
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(rx - 6, ry - 8 + float, 12, 5);
    ctx.fillStyle = '#4ADE80';
    ctx.fillRect(rx - 4, ry - 7 + float, 3, 3);
    ctx.fillRect(rx + 1, ry - 7 + float, 3, 3);

    // Cute Antenna
    ctx.strokeStyle = '#64748B';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(rx, ry - 16 + float); ctx.lineTo(rx, ry - 20 + float);
    ctx.stroke();
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.arc(rx, ry - 21 + float, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  renderSpeechBubble(ctx, bx, by) {
    const text = `${this.speechBubble.initials}: 💬 ${this.speechBubble.emoji}`;
    ctx.font = '700 11px "Prompt", monospace';
    const textW = ctx.measureText(text).width;
    const bw = textW + 16;
    const bh = 22;

    // White Bubble Panel with rounded corners
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(bx - bw / 2, by - bh, bw, bh, 6);
    ctx.fill();
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Small bottom triangle pointer
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(bx - 4, by);
    ctx.lineTo(bx, by + 4);
    ctx.lineTo(bx + 4, by);
    ctx.fill();

    ctx.strokeStyle = '#1E293B';
    ctx.beginPath();
    ctx.moveTo(bx - 4, by);
    ctx.lineTo(bx, by + 4);
    ctx.lineTo(bx + 4, by);
    ctx.stroke();

    // Bubble text
    ctx.fillStyle = '#0F172A';
    ctx.textAlign = 'center';
    ctx.fillText(text, bx, by - 6);
  }
}

// Instantiate the Biology Lab Research Team
export function createAgents() {
  return [
    new Agent({
      id: 'ada',
      name: 'ดร. เอด้า (Dr. Ada)',
      initials: 'AD',
      role: 'หัวหน้าทีมพันธุศาสตร์โมเลกุล (Genetics Lead)',
      avatarColor: '#8B5CF6',
      hairColor: '#F59E0B',
      startTileX: 25,
      startTileY: 13,
      defaultRoom: 'LOUNGE_LAB',
      defaultActivity: 'วิเคราะห์การถอดรหัสของยีน mRNA',
    }),
    new Agent({
      id: 'ben',
      name: 'เบน (Ben)',
      initials: 'BN',
      role: 'นักชีวเคมีและเอนไซม์ (Biochemist)',
      avatarColor: '#10B981',
      hairColor: '#78350F',
      startTileX: 11,
      startTileY: 13,
      defaultRoom: 'KITCHEN',
      defaultActivity: 'ชงกาแฟเอสเปรสโซ่และเตรียมอาหารว่าง',
    }),
    new Agent({
      id: 'chloe',
      name: 'โคลอี้ (Chloe)',
      initials: 'CL',
      role: 'ผู้เชี่ยวชาญการสื่อสารของเซลล์ (Cell Signaling Specialist)',
      avatarColor: '#0284C7',
      hairColor: '#1E293B',
      startTileX: 28,
      startTileY: 13,
      defaultRoom: 'LOUNGE_LAB',
      defaultActivity: 'ส่องกล้องจุลทรรศน์สังเกตการส่งสัญญาณระหว่างเซลล์',
    }),
    new Agent({
      id: 'dan',
      name: 'ศ. ดร. แดน (Prof. Dan)',
      initials: 'DN',
      role: 'ผู้อำนวยการสถาบันวิจัยชีววิทยา (Lab Director)',
      avatarColor: '#D97706',
      hairColor: '#64748B',
      startTileX: 26,
      startTileY: 5,
      defaultRoom: 'DORM_B',
      defaultActivity: 'ตรวจสอบบันทึกการวิจัยและวางแผนการทดลอง',
    }),
    new Agent({
      id: 'nano',
      name: 'นาโน (Nano Bot)',
      initials: 'RO',
      role: 'หุ่นยนต์ผู้ช่วยตรวจอุณหภูมิตัวอย่าง (Lab Assistant Bot)',
      avatarColor: '#38BDF8',
      hairColor: '#38BDF8',
      isRobot: true,
      speed: 1.35,
      startTileX: 20,
      startTileY: 9,
      defaultRoom: 'HALLWAY',
      defaultActivity: 'เดินตรวจความปลอดภัยและทำความสะอาดพื้นแล็บ',
    }),
  ];
}
