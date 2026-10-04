// ===== Interactive Objects, Furniture & Bio-Defense Terminals =====
import { TILE_SIZE, unlockGate } from './world.js';
import { playPianoNote, playBrewSound, playSuccessChime, playClickSound, playNote } from './audio.js';
import { triggerTerminalQuiz } from './quiz.js';

export const OBJECTS = [
  // ===== 1. Bio-Defense Security Terminals (Obstacles & Gate Quizzes) =====
  {
    id: 'airlock_gate',
    name: 'สถานีควบคุมประตูกักกันโรค (Airlock Security Terminal)',
    room: 'AIRLOCK',
    tileX: 22,
    tileY: 19,
    w: 1,
    h: 1,
    color: '#EF4444',
    actionText: 'ตอบคำถามชีววิทยาเพื่อเปิดประตูกักกันโรค 🔓',
    isQuizTerminal: true,
    onInteract: (onSuccess, onFailure) => {
      triggerTerminalQuiz('airlock_gate', () => {
        unlockGate('airlock');
        playSuccessChime();
        if (onSuccess) onSuccess('ปลดล็อกประตูกักกันโรคสำเร็จ! ทางเข้าสู่โซนกักกันโรคถูกเปิดออกแล้ว 🔓');
      }, () => {
        if (onFailure) onFailure('⚠️ สัญญาณเตือนภัยดังขึ้น! รหัสไม่ถูกต้อง ประตูกักกันโรคยังคงล็อกแน่นหนา!');
      });
      return null;
    }
  },

  {
    id: 'caspase_laser',
    name: 'ป้อมปืนเลเซอร์ Caspase (Caspase Defense Laser)',
    room: 'VIROLOGY_BUNKER',
    tileX: 45,
    tileY: 11,
    w: 2,
    h: 1,
    color: '#38BDF8',
    actionText: 'ตอบคำถามเพื่อยิงเลเซอร์ Caspase สลายซอมบี้ ⚡',
    isQuizTerminal: true,
    onInteract: (onSuccess, onFailure) => {
      triggerTerminalQuiz('caspase_laser', () => {
        unlockGate('bunker');
        playSuccessChime();
        window.dispatchEvent(new CustomEvent('laser-blast-triggered', { detail: { x: 46 * TILE_SIZE, y: 12 * TILE_SIZE } }));
        if (onSuccess) onSuccess('⚡ เลเซอร์ Caspase ถูกยิงออกไป! สลายเซลล์ซอมบี้กลายพันธุ์ในโซนรอบข้าง และเปิดประตูกักกันไวรัสสำเร็จ!');
      }, () => {
        if (onFailure) onFailure('⚠️ เลเซอร์ขัดข้อง! ระบบความร้อนสะสมสูง ซอมบี้กำลังคืบคลานเข้ามาใกล้!');
      });
      return null;
    }
  },

  {
    id: 'cure_synthesis',
    name: 'สถานีสังเคราะห์วัคซีนกู้โลก (Vaccine Synthesis Terminal)',
    room: 'EVAC_LANDING',
    tileX: 50,
    tileY: 30,
    w: 2,
    h: 2,
    color: '#10B981',
    actionText: 'ตอบคำถามเพื่อสังเคราะห์วัคซีนต้านไวรัส 💉',
    isQuizTerminal: true,
    onInteract: (onSuccess, onFailure) => {
      triggerTerminalQuiz('cure_synthesis', () => {
        playSuccessChime();
        window.dispatchEvent(new CustomEvent('vaccine-cure-triggered', { detail: { x: 51 * TILE_SIZE, y: 31 * TILE_SIZE } }));
        if (onSuccess) onSuccess('🎉 มหัศจรรย์มาก! สังเคราะห์วัคซีนต้านไวรัสสำเร็จ ละอองวัคซีนฟื้นฟูเซลล์มนุษย์และขับไล่ซอมบี้ทั้งหมด!');
      }, () => {
        if (onFailure) onFailure('⚠️ สายรหัสสังเคราะห์ผิดพลาด! ไวรัสแพร่กระจายเร็วขึ้น รีบตั้งสติแล้วลองใหม่!');
      });
      return null;
    }
  },

  // ===== 2. Safe Lab Interior Furniture & Equipment =====
  {
    id: 'piano',
    name: 'แกรนด์เปียโน (Grand Piano)',
    room: 'LOUNGE_LAB',
    tileX: 30,
    tileY: 14,
    w: 2,
    h: 2,
    color: '#1E293B',
    actionText: 'กดเล่นเปียโน 🎹',
    onInteract: () => {
      playPianoNote();
      return '🎶 คุณบรรเลงท่วงทำนองเปียโนแสนไพเราะ... เสียงดนตรีช่วยปลอบประโลมจิตใจนักวิจัยในยามวิกฤต!';
    }
  },

  {
    id: 'dna_sequencer',
    name: 'เครื่องวิเคราะห์ลำดับเบส (DNA Sequencer)',
    room: 'LOUNGE_LAB',
    tileX: 24,
    tileY: 11,
    w: 2,
    h: 1,
    color: '#0284C7',
    actionText: 'ตรวจสอบลำดับรหัส DNA 🧬',
    onInteract: () => {
      playSuccessChime();
      const samples = [
        '5\'-AUG GAG UUC CUG-3\' (เบสแปลรหัส Met-Glu-Phe-Leu สมบูรณ์ 100%)',
        'การกลายพันธุ์ในยีน p53 ส่งผลให้เซลล์หลีกเลี่ยงกระบวนการ Apoptosis!',
        'ยีน Lac Operon เปิดทำงานเมื่อไม่มีกลูโคสและมีแลคโตสเข้ามาจับกับ Repressor!',
      ];
      return `🧬 ผลวิเคราะห์รหัสพันธุกรรมล่าสุด:\n"${samples[Math.floor(Math.random() * samples.length)]}"`;
    }
  },

  {
    id: 'microscope',
    name: 'กล้องจุลทรรศน์ฟลูออเรสเซนต์ (Fluorescence Microscope)',
    room: 'LOUNGE_LAB',
    tileX: 27,
    tileY: 11,
    w: 1,
    h: 1,
    color: '#10B981',
    actionText: 'ส่องดูการแบ่งเซลล์ 🔬',
    onInteract: () => {
      playClickSound();
      return '🔬 ส่องกล้อง: เห็นโครโมโซมเรียงตัวที่ Equatorial Plate ในระยะ Metaphase อย่างชัดเจน!';
    }
  },

  {
    id: 'coffee_machine',
    name: 'เครื่องชงกาแฟเอสเปรสโซ่ (Lab Espresso Maker)',
    room: 'KITCHEN',
    tileX: 9,
    tileY: 11,
    w: 1,
    h: 1,
    color: '#B45309',
    actionText: 'ชงกาแฟฟื้นฟูพลังงาน (+25 HP) ☕',
    onInteract: () => {
      playBrewSound();
      window.dispatchEvent(new CustomEvent('player-heal', { detail: { amount: 25 } }));
      return '☕ กาแฟหอมกรุ่นถูกชงเรียบร้อย! คาเฟอีนฟื้นฟูพลังงานร่างกาย +25 HP!';
    }
  },

  {
    id: 'fridge',
    name: 'ตู้เย็นประจำห้องครัว (Kitchen Fridge)',
    room: 'KITCHEN',
    tileX: 8,
    tileY: 11,
    w: 1,
    h: 1,
    color: '#CBD5E1',
    actionText: 'เปิดตู้เย็นหาอาหาร (+15 HP) 🍕',
    onInteract: () => {
      playClickSound();
      window.dispatchEvent(new CustomEvent('player-heal', { detail: { amount: 15 } }));
      return '🍴 คุณหยิบพิซซ่าและอาหารว่างมาทาน เพิ่มพลังชีวิต +15 HP!';
    }
  },

  {
    id: 'dining_bar',
    name: 'เคาน์เตอร์บาร์อาหาร (Breakfast Bar)',
    room: 'KITCHEN',
    tileX: 10,
    tileY: 13,
    w: 6,
    h: 1,
    color: '#D97706',
    actionText: 'นั่งพักผ่อนที่เคาน์เตอร์บาร์ 🪑',
    onInteract: () => {
      playClickSound();
      return '🪑 นั่งพักผ่อนและสังเกตการณ์ความเคลื่อนไหวรอบสถาบันวิจัย';
    }
  },

  {
    id: 'bed_a',
    name: 'เตียงนอนพักผ่อน A (Cozy Bed A)',
    room: 'DORM_A',
    tileX: 7,
    tileY: 4,
    w: 2,
    h: 2,
    color: '#F43F5E',
    actionText: 'นอนพักฟื้นพลังชีวิตเต็มที่ 🛏️',
    onInteract: () => {
      playClickSound();
      window.dispatchEvent(new CustomEvent('player-heal', { detail: { amount: 100 } }));
      return '🛏️ คุณพักผ่อนบนเตียงนอน พลังชีวิตฟื้นฟูเต็ม 100 HP!';
    }
  },

  {
    id: 'bookshelf',
    name: 'ชั้นตำราชีววิทยาโมเลกุล (Molecular Biology Library)',
    room: 'DORM_B',
    tileX: 25,
    tileY: 3,
    w: 2,
    h: 1,
    color: '#78350F',
    actionText: 'เปิดอ่านตำราชีววิทยา 📚',
    onInteract: () => {
      playClickSound();
      return '📚 เปิดอ่าน "คู่มือป้องกันการติดเชื้อ":\n"เซลล์ซอมบี้เกิดจากความผิดปกติของ Mitotic Checkpoint หากกระตุ้นโปรตีน p53 และ Caspase ได้ จะสามารถสลายการติดเชื้อได้ทันที!"';
    }
  },
];

export function renderObjects(ctx, camera) {
  OBJECTS.forEach((obj) => {
    const ox = obj.tileX * TILE_SIZE - camera.x;
    const oy = obj.tileY * TILE_SIZE - camera.y;
    const ow = obj.w * TILE_SIZE;
    const oh = obj.h * TILE_SIZE;

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
    ctx.fillRect(ox + 4, oy + oh - 4, ow - 6, 8);

    if (obj.isQuizTerminal) {
      // High-Tech Cyber Security Terminal
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(ox, oy, ow, oh);

      // Flashing Screen
      const blink = Math.sin(Date.now() * 0.008) > 0;
      ctx.fillStyle = obj.id === 'cure_synthesis' ? '#10B981' : (blink ? obj.color : '#475569');
      ctx.fillRect(ox + 3, oy + 3, ow - 6, oh - 10);

      // Terminal Base
      ctx.fillStyle = '#334155';
      ctx.fillRect(ox + 2, oy + oh - 6, ow - 4, 6);

      // Warning Beacon on top
      ctx.fillStyle = obj.color;
      ctx.beginPath();
      ctx.arc(ox + ow / 2, oy - 2, 4, 0, Math.PI * 2);
      ctx.fill();
      return;
    }

    switch (obj.id) {
      case 'piano':
        ctx.fillStyle = '#0F172A';
        ctx.beginPath();
        ctx.roundRect(ox, oy, ow, oh, [12, 4, 16, 4]);
        ctx.fill();
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(ox + 6, oy + oh - 14, ow - 12, 10);
        ctx.fillStyle = '#000000';
        for (let i = 0; i < 7; i++) ctx.fillRect(ox + 9 + i * 7, oy + oh - 14, 4, 6);
        ctx.fillStyle = '#F59E0B';
        ctx.fillRect(ox + 14, oy + 12, ow - 28, 4);
        break;

      case 'bed_a':
        ctx.fillStyle = '#78350F';
        ctx.fillRect(ox, oy, ow, oh);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(ox + 6, oy + 4, ow - 12, 14);
        ctx.fillStyle = obj.color;
        ctx.fillRect(ox + 4, oy + 20, ow - 8, oh - 24);
        break;

      case 'dining_bar':
        ctx.fillStyle = '#D97706';
        ctx.fillRect(ox, oy, ow, oh);
        ctx.fillStyle = '#FDE68A';
        ctx.fillRect(ox + 2, oy + 2, ow - 4, oh - 6);
        for (let s = 0; s < 5; s++) {
          const sx = ox + 14 + s * 34;
          const sy = oy + 28;
          ctx.fillStyle = '#F59E0B';
          ctx.beginPath();
          ctx.arc(sx, sy, 5, 0, Math.PI * 2);
          ctx.fill();
        }
        break;

      case 'fridge':
        ctx.fillStyle = '#CBD5E1';
        ctx.fillRect(ox, oy, ow, oh);
        ctx.fillStyle = '#94A3B8';
        ctx.fillRect(ox + 2, oy + 2, ow - 4, oh / 2 - 3);
        ctx.fillRect(ox + 2, oy + oh / 2 + 1, ow - 4, oh / 2 - 3);
        break;

      case 'coffee_machine':
        ctx.fillStyle = '#78350F';
        ctx.fillRect(ox, oy, ow, oh);
        ctx.fillStyle = '#F59E0B';
        ctx.fillRect(ox + 6, oy + 6, ow - 12, 10);
        break;

      case 'dna_sequencer':
        ctx.fillStyle = '#0284C7';
        ctx.fillRect(ox, oy, ow, oh);
        ctx.fillStyle = '#10B981';
        ctx.fillRect(ox + 6, oy + 4, ow - 12, oh - 10);
        break;

      case 'microscope':
        ctx.fillStyle = '#E2E8F0';
        ctx.fillRect(ox + 6, oy + 12, ow - 12, oh - 14);
        ctx.fillStyle = '#059669';
        ctx.fillRect(ox + 12, oy + 4, 8, 14);
        break;

      case 'bookshelf':
        ctx.fillStyle = '#78350F';
        ctx.fillRect(ox, oy, ow, oh);
        const bookColors = ['#F43F5E', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];
        for (let b = 0; b < 10; b++) {
          ctx.fillStyle = bookColors[b % bookColors.length];
          ctx.fillRect(ox + 4 + b * 5, oy + 3, 4, oh - 6);
        }
        break;

      default:
        ctx.fillStyle = obj.color || '#CBD5E1';
        ctx.fillRect(ox, oy, ow, oh);
        break;
    }
  });
}

export function getNearbyObject(playerX, playerY, maxDist = 52) {
  for (const obj of OBJECTS) {
    const cx = (obj.tileX + obj.w / 2) * TILE_SIZE;
    const cy = (obj.tileY + obj.h / 2) * TILE_SIZE;
    const dist = Math.hypot(playerX - cx, playerY - cy);
    if (dist < maxDist) return obj;
  }
  return null;
}
