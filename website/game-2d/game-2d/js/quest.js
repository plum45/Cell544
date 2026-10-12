// ===== Multi-Quest Biology System (5 Major Quests) =====
// Handles Quest Selection, Two-Way Quiz Gates (Outbound & Inbound New Questions),
// Timed Deliveries to Lobby Friends, and Reward Distribution

import { triggerTerminalQuiz } from './quiz.js';
import { unlockGate, GATES } from './world.js';
import { playSuccessChime, playClickSound, playNote } from './audio.js';

export const QUESTS = {
  bio_food: {
    id: 'bio_food',
    name: '🍞 ส่งเสบียงอาหารชีวภาพ (Bio-Food Rations)',
    category: 'การลำเลียงสาร & เมแทบอลิซึม (Cell Transport & Metabolism)',
    icon: '🍱',
    color: '#F59E0B',
    brief: 'เพื่อนๆ นักวิจัยในห้องล็อบบี้ (ดร. เอด้า, วัตสัน, โรซาลินด์) กำลังหิวโหยและขาดแคลนเสบียง! ออกไปนำลังเสบียงกลูโคสและกรดอะมิโนจากคลังเสบียงนอกศูนย์วิจัย นำกลับมาแจกจ่ายให้เพื่อนๆ ในล็อบบี้ก่อนเวลาหมด!',
    rewardExp: 500,
    timeLimit: 120,
    item: {
      id: 'food_crate',
      name: '🍱 ลังเสบียงสารอาหารชีวภาพ (Glucose & Nutrients)',
      icon: '🍱',
      color: '#F59E0B',
      tileX: 18,
      tileY: 34,
      collected: false
    },
    outboundQuiz: {
      id: 'quiz_food_out',
      sector: 'ประตูกักกันโรคขาออก (Outbound Quarantine Gate)',
      q: '🚪 ประตูขาออก: ในเซลล์ กระบวนการลำเลียงกลูโคสเข้าสู่เซลล์เยื่อบุผิวลำไส้เล็กต้านความเข้มข้น จัดเป็นการลำเลียงแบบใด?',
      options: [
        'Primary Active Transport (ใช้ ATP โดยตรง)',
        'Secondary Active Transport (Sodium-Glucose Symport)',
        'Simple Diffusion (การแพร่ธรรมดา)',
        'Facilitated Diffusion (การแพร่ฟาซิลลิเทต)'
      ],
      ans: 1,
      timeLimit: 18,
      exp: 'SGLT-1 ใช้ความต่างความเข้มข้นของ Na+ ที่สร้างโดย Na+/K+ Pump ในการดึงกลูโคสเข้าสู่เซลล์'
    },
    inboundQuiz: {
      id: 'quiz_food_in',
      sector: 'ประตูกักกันโรคขากลับ (Inbound Sterilization Gate)',
      q: '🔒 ประตูขากลับ (คำถามใหม่เพื่อฆ่าเชื้อ): เมื่อนำกลูโคสเข้าสู่เซลล์ กระบวนการ Glycolysis ในไซโทซอลจะเปลี่ยนกลูโคส 1 โมเลกุลให้กลายเป็นสารใด 2 โมเลกุล?',
      options: [
        'Pyruvate (กรดไพรูวิก 3 คาร์บอน)',
        'Acetyl-CoA',
        'Lactate (กรดแลกติก)',
        'Oxaloacetate'
      ],
      ans: 0,
      timeLimit: 18,
      exp: 'Glycolysis สลาย 1 Glucose (6C) ได้เป็น 2 Pyruvate (3C) พร้อมกับได้ 2 ATP สุทธิ และ 2 NADH'
    }
  },

  gene_expression: {
    id: 'gene_expression',
    name: '🧬 องค์ประกอบการแสดงออกของยีน (Gene Expression Assembly)',
    category: 'การถอดรหัสและการแปลรหัส (Transcription & Translation)',
    icon: '🧬',
    color: '#0284C7',
    brief: 'รวบรวมชิ้นส่วนสำคัญของกระบวนการแสดงออกของยีน: Promoter, RNA Polymerase II, และ mRNA Transcript จากศูนย์วิจัยชั้นสูง นำกลับมายังแท่นวิจัยในล็อบบี้เพื่อเริ่มการแปลรหัสโปรตีน!',
    rewardExp: 600,
    timeLimit: 150,
    item: {
      id: 'gene_parts',
      name: '🧬 คอมเพล็กซ์ mRNA & RNA Polymerase II',
      icon: '🧬',
      color: '#0284C7',
      tileX: 52,
      tileY: 10,
      collected: false
    },
    outboundQuiz: {
      id: 'quiz_gene_out',
      sector: 'ประตูกักกันโรคขาออก (Gene Lab Outbound Gate)',
      q: '🚪 ประตูขาออก: ลำดับเบสที่เป็นอนุรักษ์ (Consensus Sequence) ในบริเวณ Promoter ของยูแคริโอตซึ่ง Transcription Factors เข้าจับคือบริเวณใด?',
      options: [
        'TATA Box (ประมาณ -25 bp)',
        'Shine-Dalgarno Sequence',
        'Poly-A Tail ท้ายสาย',
        'Stop Codon UAA'
      ],
      ans: 0,
      timeLimit: 18,
      exp: 'TATA Box ทำหน้าที่เป็นจุดเกาะของ TATA-binding protein (TBP) ในกระบวนการเริ่มถอดรหัส (Transcription Initiation)'
    },
    inboundQuiz: {
      id: 'quiz_gene_in',
      sector: 'ประตูกักกันโรคขากลับ (Translation Chamber Return Gate)',
      q: '🔒 ประตูขากลับ (คำถามใหม่): ในกระบวนการ Translation ไรโบโซมอ่านรหัส mRNA จากทิศใด และตำแหน่งใดบนไรโบโซมที่ tRNA ตัวใหม่เข้ามาจับ?',
      options: [
        'อ่าน 3\'->5\' และจับที่ E Site (Exit)',
        'อ่าน 5\'->3\' และจับที่ A Site (Aminoacyl-tRNA Site)',
        'อ่าน 5\'->3\' และจับที่ P Site',
        'อ่านแบบสลับไปมา'
      ],
      ans: 1,
      timeLimit: 18,
      exp: 'Ribosome เคลื่อนอ่าน mRNA จาก 5\' ไป 3\' โดย Aminoacyl-tRNA ใหม่จะเข้ามาจับที่ตำแหน่ง A Site'
    }
  },

  cell_signaling: {
    id: 'cell_signaling',
    name: '📡 ต่อวงจรการสื่อสารของเซลล์ (Cell Signaling Circuit)',
    category: 'การส่งสัญญาณและตัวรับ GPCR (Signal Transduction & Secondary Messengers)',
    icon: '📡',
    color: '#8B5CF6',
    brief: 'ระบบสัญญาณสื่อสารของศูนย์วิจัยถูกตัดขาด! ออกไปกู้คืนตัวรับ GPCR, โมเลกุล Ligand, และ Second Messenger (cAMP Core) เพื่อต่อวงจรเปิดสัญญาณเตือนภัย!',
    rewardExp: 600,
    timeLimit: 150,
    item: {
      id: 'signal_core',
      name: '📡 วงจรส่งสัญญาณ GPCR & cAMP Core',
      icon: '📡',
      color: '#8B5CF6',
      tileX: 54,
      tileY: 33,
      collected: false
    },
    outboundQuiz: {
      id: 'quiz_signal_out',
      sector: 'ประตูกักกันโรคขาออก (Signaling Grid Gate)',
      q: '🚪 ประตูขาออก: เมื่อโมเลกุลสื่อสาร (Ligand) เข้าจับกับ GPCR หน่วยย่อย G-alpha จะทำงานโดยปลดปล่อยโมเลกุลใดและเข้าจับกับโมเลกุลใด?',
      options: [
        'ปล่อย ATP เข้าจับ ADP',
        'ปล่อย GDP เข้าจับ GTP เพื่อเข้าสู่ Active State',
        'ปล่อย GTP เข้าจับ GDP',
        'ปล่อย cAMP เข้าสู่ไซโทพลาซึม'
      ],
      ans: 1,
      timeLimit: 18,
      exp: 'GPCR ทำหน้าที่เป็น GEF (Guanine nucleotide exchange factor) กระตุ้นให้ G-alpha ปล่อย GDP แล้วจับ GTP'
    },
    inboundQuiz: {
      id: 'quiz_signal_in',
      sector: 'ประตูกักกันโรคขากลับ (Signaling Circuit Return Gate)',
      q: '🔒 ประตูขากลับ (คำถามใหม่): เอนไซม์ใดทำหน้าที่เปลี่ยน ATP ให้กลายเป็น Second Messenger คือ cAMP ในวิถีการส่งสัญญาณ?',
      options: [
        'Phospholipase C (PLC)',
        'Adenylyl Cyclase (อะดีนิลิลไซเคลส)',
        'Protein Kinase A (PKA)',
        'Phosphodiesterase'
      ],
      ans: 1,
      timeLimit: 18,
      exp: 'Adenylyl Cyclase ถูกกระตุ้นโดย Gs-alpha จะเปลี่ยน ATP ให้กลายเป็น cyclic AMP (cAMP)'
    }
  },

  antibody_defense: {
    id: 'antibody_defense',
    name: '🛡️ สังเคราะห์แอนติบอดี & วัคซีน (Antibody & Vaccine Defense)',
    category: 'ระบบภูมิคุ้มกัน & อิมมูโนโลยี (Immunology & Antibodies)',
    icon: '💉',
    color: '#10B981',
    brief: 'ฝูงซอมบี้กำลังแพร่กระจายเชื้อ! ฝ่าวงล้อมออกไปเก็บตัวอย่าง Spike Protein Antigen และ Adjuvant นำกลับมาผลิตแอนติบอดีกู้ชีพในล็อบบี้!',
    rewardExp: 550,
    timeLimit: 140,
    item: {
      id: 'antibody_vial',
      name: '💉 เซรั่มแอนติบอดีต้านเชื้อไวรัส (Monoclonal Antibody)',
      icon: '💉',
      color: '#10B981',
      tileX: 10,
      tileY: 36,
      collected: false
    },
    outboundQuiz: {
      id: 'quiz_ab_out',
      sector: 'ประตูกักกันโรคขาออก (Immunology Airlock Gate)',
      q: '🚪 ประตูขาออก: แอนติบอดี (Immunoglobulin) มีโครงสร้างโพลีเปปไทด์แบบใด และบริเวณใดทำหน้าที่จับกับแอนติเจน?',
      options: [
        '2 Heavy Chains + 2 Light Chains จับที่ Fab (Variable Region)',
        '1 Heavy Chain จับที่ Fc Region',
        'เส้นใยเดี่ยวไม่มีกิ่งก้าน',
        'จับแบบไม่จำเพาะเจาะจงที่ส่วนหาง'
      ],
      ans: 0,
      timeLimit: 18,
      exp: 'แอนติบอดีมี 4 สาย (2H + 2L) เชื่อมด้วย Disulfide bonds โดยส่วน Variable Domain ที่ปลาย Fab จับกับ Epitope อย่างจำเพาะ'
    },
    inboundQuiz: {
      id: 'quiz_ab_in',
      sector: 'ประตูกักกันโรคขากลับ (Immunology Return Sterilization)',
      q: '🔒 ประตูขากลับ (คำถามใหม่): แอนติบอดีคลาสใดพบมากที่สุดในซีรัมเลือด (~80%) และสามารถส่งผ่านรกจากแม่สู่ทารกได้?',
      options: [
        'IgA (หลั่งในสารคัดหลั่ง)',
        'IgE (ภูมิแพ้และพยาธิ)',
        'IgM (รูปดาว Pentamer ในการตอบสนองแรก)',
        'IgG (Immunoglobulin G)'
      ],
      ans: 3,
      timeLimit: 18,
      exp: 'IgG เป็นแอนติบอดีหลักในการตอบสนองระยะทุติยภูมิ (Secondary Immune Response) และข้ามรกได้'
    }
  },

  atp_power: {
    id: 'atp_power',
    name: '⚡ ซ่อมแซมไมโทคอนเดรียผลิต ATP (Mitochondria Power Core)',
    category: 'การหายใจระดับเซลล์ & พลังงาน (Cellular Respiration & ATP)',
    icon: '🔋',
    color: '#EC4899',
    brief: 'เครื่องปฏิกรณ์ไมโทคอนเดรียขัดข้อง! เดินทางไปกู้คืนแท่งพลังงาน ATP Synthase & Complex I-IV นำกลับมาจ่ายไฟฟ้าให้ล็อบบี้ปลอดภัย!',
    rewardExp: 550,
    timeLimit: 130,
    item: {
      id: 'atp_core',
      name: '🔋 แท่งพลังงาน ATP ชีวภาพบริสุทธิ์ (Pure ATP Core)',
      icon: '🔋',
      color: '#EC4899',
      tileX: 44,
      tileY: 35,
      collected: false
    },
    outboundQuiz: {
      id: 'quiz_atp_out',
      sector: 'ประตูกักกันโรคขาออก (Reactor Gate Outbound)',
      q: '🚪 ประตูขาออก: ในลูกโซ่การถ่ายทอดอิเล็กตรอน (ETC) โปรตอน H+ ถูกปั๊มไปสะสมที่บริเวณใดเพื่อสร้าง Proton Motive Force?',
      options: [
        'Cytosol (ภายนอกเซลล์)',
        'Intermembrane Space (ช่องว่างระหว่างเยื่อหุ้มไมโทคอนเดรีย)',
        'Mitochondrial Matrix (ด้านในของเหลว)',
        'Thylakoid Lumen'
      ],
      ans: 1,
      timeLimit: 18,
      exp: 'Complex I, III, IV ปั๊ม H+ จาก Matrix ออกมาสะสมที่ Intermembrane Space เกิดความต่างศักย์และ pH gradient'
    },
    inboundQuiz: {
      id: 'quiz_atp_in',
      sector: 'ประตูกักกันโรคขากลับ (Reactor Return Security Gate)',
      q: '🔒 ประตูขากลับ (คำถามใหม่): ในกระบวนการ Chemiosmosis การไหลของโปรตอน H+ ผ่าน ATP Synthase ขับเคลื่อนการหมุนของส่วนประกอบใด?',
      options: [
        'F0 Subunit (Rotor Ring และ Stalk หมุนสร้างแรงบิด)',
        'Hexokinase Domain',
        'Cytochrome c oxidase',
        'Krebs Decarboxylase'
      ],
      ans: 0,
      timeLimit: 18,
      exp: 'โปรตอนไหลผ่าน F0 rotor ring ทำให้ก้านแกนหมุน เปลี่ยนโครงสร้างทางโครงรูปของ F1 subunit สังเคราะห์ ATP'
    }
  }
};

// Global Quest Manager
class QuestManager {
  constructor() {
    this.activeQuest = null;
    this.stage = 'NOT_STARTED'; // 'NOT_STARTED' | 'OUTBOUND_GATE' | 'COLLECTING_ITEM' | 'INBOUND_GATE' | 'DELIVERING_TO_LOBBY' | 'COMPLETED' | 'TIMEOUT'
    this.hasItem = false;
    this.timeRemaining = 0;
    this.outboundGateUnlocked = false;
    this.inboundGateUnlocked = false;
    this.timerInterval = null;
    this.onStateChangeCallbacks = [];
  }

  onStateChange(fn) {
    this.onStateChangeCallbacks.push(fn);
  }

  notifyStateChange() {
    this.onStateChangeCallbacks.forEach(fn => fn(this));
    this.updateHUD();
  }

  startQuest(questId) {
    const qData = QUESTS[questId];
    if (!qData) return;

    this.activeQuest = JSON.parse(JSON.stringify(qData));
    this.stage = 'OUTBOUND_GATE';
    this.hasItem = false;
    this.outboundGateUnlocked = false;
    this.inboundGateUnlocked = false;
    this.timeRemaining = this.activeQuest.timeLimit;

    // Reset World Gate to locked
    GATES.airlock.locked = true;

    // Start Timer
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (this.stage === 'COMPLETED' || this.stage === 'TIMEOUT') {
        clearInterval(this.timerInterval);
        return;
      }
      this.timeRemaining--;
      if (this.timeRemaining <= 0) {
        this.timeRemaining = 0;
        this.handleTimeout();
      }
      this.updateTimerDisplay();
    }, 1000);

    playSuccessChime();
    this.notifyStateChange();
    this.showToast(`🎯 รับเควส: ${this.activeQuest.name}\nรีบไปตอบคำถามปลดล็อกประตูกักกันโรคขาออก!`);
  }

  updateTimerDisplay() {
    const timerEl = document.getElementById('quest-timer-hud');
    if (timerEl) {
      timerEl.textContent = `⏱️ ${this.timeRemaining}s`;
      if (this.timeRemaining <= 20) {
        timerEl.classList.add('urgent');
      } else {
        timerEl.classList.remove('urgent');
      }
    }
  }

  handleTimeout() {
    this.stage = 'TIMEOUT';
    clearInterval(this.timerInterval);
    playNote(140, 'sawtooth', 0.5, 0.3);
    this.notifyStateChange();

    const screen = document.getElementById('quest-timeout-screen');
    if (screen) screen.classList.add('visible');
  }

  // Trigger Outbound Quiz Gate
  triggerOutboundGate(onSuccess, onFailure) {
    if (this.outboundGateUnlocked) {
      if (onSuccess) onSuccess('ประตูเปิดอยู่แล้ว! รีบออกไปตามหาไอเทม');
      return;
    }

    if (!this.activeQuest) {
      this.showToast('⚠️ กรุณากดเลือกเควสก่อนเริ่มออกสำรวจ!');
      return;
    }

    triggerTerminalQuiz(this.activeQuest.outboundQuiz, () => {
      this.outboundGateUnlocked = true;
      unlockGate('airlock');
      this.stage = 'COLLECTING_ITEM';
      playSuccessChime();
      this.notifyStateChange();
      if (onSuccess) onSuccess('🔓 ปลดล็อกประตูกักกันโรคขาออกสำเร็จ! รีบไปเก็บไอเทมเควส ระวังซอมบี้!');
    }, () => {
      if (onFailure) onFailure('⚠️ รหัสไม่ถูกต้อง! ประตูล็อกแน่นหนา รีบตั้งสติแล้วลองใหม่!');
    });
  }

  // Pick up quest item
  collectItem() {
    if (!this.activeQuest || this.hasItem) return;
    this.hasItem = true;
    this.stage = 'INBOUND_GATE';
    this.activeQuest.item.collected = true;

    // Lock gate for return journey!
    GATES.airlock.locked = true;
    this.inboundGateUnlocked = false;

    playSuccessChime();
    this.notifyStateChange();
    this.showToast(`📦 เก็บสำเร็จ: ${this.activeQuest.item.name}!\n🚨 ประตูกลับเข้าล็อบบี้ถูกล็อก ต้องตอบคำถามใหม่เพื่อเข้า!`);
  }

  // Trigger Inbound Return Gate (NEW Question!)
  triggerInboundGate(onSuccess, onFailure) {
    if (this.inboundGateUnlocked) {
      if (onSuccess) onSuccess('ประตูขากลับเปิดแล้ว! นำไอเทมไปส่งเพื่อนในล็อบบี้ด่วน!');
      return;
    }

    if (!this.hasItem) {
      this.showToast('⚠️ คุณยังไม่ได้เก็บไอเทมเควส! ออกไปเก็บไอเทมก่อน');
      return;
    }

    // Trigger NEW Inbound Question
    triggerTerminalQuiz(this.activeQuest.inboundQuiz, () => {
      this.inboundGateUnlocked = true;
      unlockGate('airlock');
      this.stage = 'DELIVERING_TO_LOBBY';
      playSuccessChime();
      this.notifyStateChange();
      if (onSuccess) onSuccess('🎉 ฆ่าเชื้อและปลดล็อกประตูขากลับสำเร็จ! รีบนำไปส่งเพื่อนๆ ในล็อบบี้!');
    }, () => {
      if (onFailure) onFailure('⚠️ รหัสฆ่าเชื้อไม่ถูกต้อง! ประตูทางเข้ายังไม่เปิด ระวังซอมบี้ข้างหลัง!');
    });
  }

  // Deliver to Friends in Lobby
  deliverToLobby(agentName = 'ดร. เอด้า') {
    if (!this.activeQuest || !this.hasItem || this.stage === 'COMPLETED') return false;

    this.stage = 'COMPLETED';
    clearInterval(this.timerInterval);
    playSuccessChime();

    // Reward player
    if (window.confetti) {
      window.confetti({ particleCount: 120, spread: 90, origin: { x: 0.5, y: 0.5 } });
    }

    this.notifyStateChange();
    this.showVictoryModal(agentName);
    return true;
  }

  showVictoryModal(agentName) {
    const modal = document.getElementById('quest-victory-modal');
    if (!modal) return;

    document.getElementById('qv-title').textContent = `🎉 ภารกิจสำเร็จ: ${this.activeQuest.name}`;
    document.getElementById('qv-reward-xp').textContent = `+${this.activeQuest.rewardExp} XP`;
    document.getElementById('qv-time-left').textContent = `${this.timeRemaining}s`;
    document.getElementById('qv-friend-msg').innerHTML = `
      <strong>${agentName}:</strong> "สุดยอดมากคุณนักวิจัย! คุณนำ <em>${this.activeQuest.item.name}</em> กลับมาส่งได้ทันเวลา ทุกคนในศูนย์วิจัยรอดปลอดภัยแล้ว!"
    `;

    modal.classList.add('visible');
  }

  updateHUD() {
    const banner = document.getElementById('quest-status-banner');
    if (!banner) return;

    if (!this.activeQuest) {
      banner.style.display = 'none';
      return;
    }

    banner.style.display = 'flex';
    document.getElementById('quest-tag').textContent = this.activeQuest.name;
    this.updateTimerDisplay();

    const descEl = document.getElementById('quest-desc-text');
    const step1 = document.getElementById('step-gate');
    const step2 = document.getElementById('step-item');
    const step3 = document.getElementById('step-return');
    const step4 = document.getElementById('step-deliver');

    [step1, step2, step3, step4].forEach(s => s && s.classList.remove('active', 'done'));

    if (this.stage === 'OUTBOUND_GATE') {
      if (step1) step1.classList.add('active');
      if (descEl) descEl.textContent = '🚪 ไปที่ประตูกักกันโรค (Airlock) แล้วตอบคำถามชีววิทยาเพื่อเปิดประตูออกไปข้างนอก!';
    } else if (this.stage === 'COLLECTING_ITEM') {
      if (step1) step1.classList.add('done');
      if (step2) step2.classList.add('active');
      if (descEl) descEl.textContent = `🏃 ฝ่าฝูงซอมบี้ไปเก็บ: ${this.activeQuest.item.name} ตามสัญลักษณ์เรดาร์!`;
    } else if (this.stage === 'INBOUND_GATE') {
      if (step1) step1.classList.add('done');
      if (step2) step2.classList.add('done');
      if (step3) step3.classList.add('active');
      if (descEl) descEl.textContent = '🔒 ประตูกักกันโรคขากลับล็อกแล้ว! ไปตอบคำถามใหม่เพื่อเปิดประตูกลับเข้าล็อบบี้!';
    } else if (this.stage === 'DELIVERING_TO_LOBBY') {
      if (step1) step1.classList.add('done');
      if (step2) step2.classList.add('done');
      if (step3) step3.classList.add('done');
      if (step4) step4.classList.add('active');
      if (descEl) descEl.textContent = '🏠 ประตูเปิดแล้ว! นำไอเทมไปส่งให้เพื่อนๆ (ดร.เอด้า / วัตสัน) ในล็อบบี้ปลอดภัย!';
    } else if (this.stage === 'COMPLETED') {
      [step1, step2, step3, step4].forEach(s => s && s.classList.add('done'));
      if (descEl) descEl.textContent = '🌟 ภารกิจสำเร็จลุล่วง! คุณสามารถเลือกทำเควสถัดไปได้ทันที!';
    }
  }

  showToast(msg) {
    const el = document.getElementById('hud-toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('visible');
    setTimeout(() => el.classList.remove('visible'), 4500);
  }
}

export const questManager = new QuestManager();
