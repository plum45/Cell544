/**
 * CYTOLIFE: 3D Expansive Cyber Arena & Who Am I
 * Features:
 * - Wide, expansive 3D Cyber Voxel Grid Map
 * - Detailed Cyber Avatar Bots with animated limbs & glowing visors
 * - In-World 3D Holographic Floating Billboards on Answer Pads (Full Choice Text in 3D!)
 * - Who Am I? Biological Mystery Card Mode & Progressive Clues
 * - Minimalist Non-blocking HUD
 * - 3D Elastic Laser Tether Ropes with Spacebar Tactical Yank
 */

// ==========================================
// 1. Biology Question Bank & Who Am I Clues
// ==========================================
const STANDARD_QUESTIONS = [
  {
    topic: 'Gene Expression',
    question: 'กระบวนการถอดรหัส (Transcription) ในยูแคริโอตสังเคราะห์ mRNA โดยเอนไซม์ใด?',
    choices: [
      { id: 'A', text: 'RNA Polymerase II', correct: true },
      { id: 'B', text: 'DNA Helicase', correct: false },
      { id: 'C', text: 'DNA Polymerase III', correct: false },
      { id: 'D', text: 'RNA Primase', correct: false }
    ]
  },
  {
    topic: 'Gene Regulation',
    question: 'ใน Lac Operon ของ E. coli สารใดทำหน้าที่เป็น Inducer จับกับ Repressor?',
    choices: [
      { id: 'A', text: 'Glucose', correct: false },
      { id: 'B', text: 'Allolactose', correct: true },
      { id: 'C', text: 'Tryptophan', correct: false },
      { id: 'D', text: 'cAMP', correct: false }
    ]
  },
  {
    topic: 'Cell Signaling',
    question: 'เมื่อ Ligand จับกับ GPCR โมเลกุลใดถูกเปลี่ยนเพื่อกระตุ้น G-Protein?',
    choices: [
      { id: 'A', text: 'ATP เป็น ADP', correct: false },
      { id: 'B', text: 'GDP แทนที่ด้วย GTP', correct: true },
      { id: 'C', text: 'cAMP เป็น AMP', correct: false },
      { id: 'D', text: 'IP3 เป็น DAG', correct: false }
    ]
  },
  {
    topic: 'Apoptosis',
    question: 'โปรตีนใดรั่วไหลจาก Mitochondria เพื่อกระตุ้น Apoptosome & Caspases?',
    choices: [
      { id: 'A', text: 'Cytochrome c', correct: true },
      { id: 'B', text: 'Hemoglobin', correct: false },
      { id: 'C', text: 'ATP Synthase', correct: false },
      { id: 'D', text: 'Ubiquitin', correct: false }
    ]
  },
  {
    topic: 'Cell Cycle',
    question: 'โปรตีนพิทักษ์จีโนมที่สั่งหยุดวัฏจักรเซลล์ที่ G1/S เมื่อ DNA เสียหายคือข้อใด?',
    choices: [
      { id: 'A', text: 'p53 Tumor Suppressor', correct: true },
      { id: 'B', text: 'Cyclin B', correct: false },
      { id: 'C', text: 'Cohesin', correct: false },
      { id: 'D', text: 'DNA Ligase', correct: false }
    ]
  },
  {
    topic: 'Bio-Energetics',
    question: 'แรงขับเคลื่อนโปรตอน (PMF) ใช้สร้าง ATP ในไมโทคอนเดรียเกิดจากความต่างของอะไร?',
    choices: [
      { id: 'A', text: 'ความเข้มข้นกลูโคส', correct: false },
      { id: 'B', text: 'ความเข้มข้น H⁺ ข้ามเยื่อใน', correct: true },
      { id: 'C', text: 'ปริมาณ Na⁺/K⁺ ปั๊ม', correct: false },
      { id: 'D', text: 'ความดันออสโมติก', correct: false }
    ]
  }
];



// ==========================================
// 1.5 Atmospheric & Cultural Arena Themes
// ==========================================
const ARENA_THEMES = {
  sakura: {
    id: 'sakura',
    name: '🌸 ซากุระญี่ปุ่น (Sakura Spring)',
    bg: 0x140a1c,
    fog: 0x1a0d24,
    fogDensity: 0.012,
    blockTop: 0x22132a,
    blockEdge: 0xff70a6,
    blockEdgeOpacity: 0.7,
    ambientLight: 0xffe6f0,
    ambientIntensity: 0.65,
    dirLight: 0xffadc6,
    dirIntensity: 0.95,
    pylonBeam: 0xff70a6,
    pylonBeamOpacity: 0.6,
    helixA: 0xff70a6,
    helixB: 0xffffff,
    helixRung: 0xffa8cc,
    ring: 0xff4d88,
    satellite: 0x3d1d36,
    satelliteEdge: 0xff70a6,
    padPodium: 0x1e0e24,
    padRing: 0xff4d88,
    billboardBg: 'rgba(28, 12, 34, 0.92)',
    billboardBorder: '#ff70a6',
    billboardBadge: '#ff70a6',
    billboardBadgeText: '#ffffff',
    billboardText: '#ffffff',
    conduit: 0xff70a6,
    stardust: 0xffadc6,
    treeType: 'sakura',
    particleType: 'sakura_petals'
  },
  autumn: {
    id: 'autumn',
    name: '🍁 ใบไม้ร่วงเกียวโต (Kyoto Autumn)',
    bg: 0x1a0c06,
    fog: 0x221008,
    fogDensity: 0.012,
    blockTop: 0x28140c,
    blockEdge: 0xff9f1c,
    blockEdgeOpacity: 0.75,
    ambientLight: 0xfff0db,
    ambientIntensity: 0.65,
    dirLight: 0xff7b00,
    dirIntensity: 1.0,
    pylonBeam: 0xf77f00,
    pylonBeamOpacity: 0.65,
    helixA: 0xe63946,
    helixB: 0xfcb001,
    helixRung: 0xffaa00,
    ring: 0xd90429,
    satellite: 0x3d1a0e,
    satelliteEdge: 0xff9f1c,
    padPodium: 0x241009,
    padRing: 0xf77f00,
    billboardBg: 'rgba(36, 16, 10, 0.92)',
    billboardBorder: '#ff9f1c',
    billboardBadge: '#f77f00',
    billboardBadgeText: '#000000',
    billboardText: '#ffffff',
    conduit: 0xf77f00,
    stardust: 0xffd166,
    treeType: 'autumn',
    particleType: 'autumn_leaves'
  },
  winter: {
    id: 'winter',
    name: '❄️ หิมะ & แสงเหนือ (Arctic Winter)',
    bg: 0x040e1e,
    fog: 0x08182e,
    fogDensity: 0.014,
    blockTop: 0x0c253d,
    blockEdge: 0x00f0ff,
    blockEdgeOpacity: 0.8,
    ambientLight: 0xd0f4ff,
    ambientIntensity: 0.6,
    dirLight: 0x70e000,
    dirIntensity: 0.85,
    pylonBeam: 0x00f0ff,
    pylonBeamOpacity: 0.65,
    helixA: 0x00f0ff,
    helixB: 0xffffff,
    helixRung: 0x80e5ff,
    ring: 0x00f0ff,
    satellite: 0x0f2d48,
    satelliteEdge: 0x00f0ff,
    padPodium: 0x081c2f,
    padRing: 0x00f0ff,
    billboardBg: 'rgba(8, 24, 44, 0.92)',
    billboardBorder: '#00f0ff',
    billboardBadge: '#00f0ff',
    billboardBadgeText: '#000000',
    billboardText: '#ffffff',
    conduit: 0x00f0ff,
    stardust: 0xa0f4ff,
    treeType: 'winter',
    particleType: 'snowflakes'
  },
  lantern: {
    id: 'lantern',
    name: '🏮 เทศกาลโคมลอย (Lantern Festival)',
    bg: 0x0d091a,
    fog: 0x140e24,
    fogDensity: 0.012,
    blockTop: 0x1c142e,
    blockEdge: 0xffd166,
    blockEdgeOpacity: 0.75,
    ambientLight: 0xffeedb,
    ambientIntensity: 0.65,
    dirLight: 0xffaa00,
    dirIntensity: 1.0,
    pylonBeam: 0xffbe0b,
    pylonBeamOpacity: 0.65,
    helixA: 0xffd700,
    helixB: 0xef233c,
    helixRung: 0xffb703,
    ring: 0xff006e,
    satellite: 0x2e1e40,
    satelliteEdge: 0xffd166,
    padPodium: 0x181024,
    padRing: 0xffbe0b,
    billboardBg: 'rgba(26, 16, 40, 0.92)',
    billboardBorder: '#ffd166',
    billboardBadge: '#ffbe0b',
    billboardBadgeText: '#000000',
    billboardText: '#ffffff',
    conduit: 0xffbe0b,
    stardust: 0xffe699,
    treeType: 'lantern',
    particleType: 'sky_lanterns'
  },
  cyber: {
    id: 'cyber',
    name: '⚡ นีออนไซเบอร์ (Neo Cyberpunk)',
    bg: 0x06060f,
    fog: 0x090818,
    fogDensity: 0.012,
    blockTop: 0x10101c,
    blockEdge: 0x00f5d4,
    blockEdgeOpacity: 0.85,
    ambientLight: 0xd8b4fe,
    ambientIntensity: 0.6,
    dirLight: 0x38bdf8,
    dirIntensity: 0.9,
    pylonBeam: 0x00f5d4,
    pylonBeamOpacity: 0.65,
    helixA: 0x00f5d4,
    helixB: 0xf72585,
    helixRung: 0x7b2cbf,
    ring: 0xf72585,
    satellite: 0x18142a,
    satelliteEdge: 0xf72585,
    padPodium: 0x0d0d17,
    padRing: 0x00f5d4,
    billboardBg: 'rgba(12, 10, 24, 0.92)',
    billboardBorder: '#00f5d4',
    billboardBadge: '#f72585',
    billboardBadgeText: '#ffffff',
    billboardText: '#ffffff',
    conduit: 0x00f5d4,
    stardust: 0x00f5d4,
    treeType: 'cyber',
    particleType: 'cyber_sparks'
  }
};

// ==========================================
// 2. Web Audio Synthesizer (Native SFX & Suspense BGM)
// ==========================================
class SoundFX {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.bgmRunning = false;
    this.bgmTimer = null;
    this.tempo = 124; // BPM
    this.step = 0;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
        this.startBGM();
      }
    } else if (this.ctx.state === 'suspended') {
      this.ctx.resume();
      this.startBGM();
    }
  }

  startBGM() {
    if (this.bgmRunning || !this.ctx) return;
    this.bgmRunning = true;
    this.step = 0;
    this.scheduleBGMStep();
  }

  scheduleBGMStep() {
    if (!this.bgmRunning || !this.ctx) return;

    if (this.enabled) {
      const now = this.ctx.currentTime;
      const beatDur = 60 / this.tempo;
      const stepDur = beatDur / 4; // 16th note

      // Cyber Bass & Arpeggio Notes (Cyber D Minor scale: D, F, G, A, C)
      const bassNotes = [73.42, 73.42, 87.31, 73.42, 65.41, 65.41, 82.41, 73.42]; // D2, F2, C2, E2
      const arpNotes = [293.66, 349.23, 440.00, 523.25, 440.00, 349.23, 392.00, 587.33]; // D4, F4, A4, C5...

      // 1. Kick / Heartbeat Sub-Bass on Beats (0, 4, 8, 12)
      if (this.step % 4 === 0) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(110, now);
        osc.frequency.exponentialRampToValueAtTime(32, now + 0.12);
        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
      }

      // 2. Pulsing Synth Bass
      if (this.step % 2 === 0) {
        const bassFreq = bassNotes[Math.floor(this.step / 2) % bassNotes.length];
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(bassFreq, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0.01, now + stepDur * 1.5);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + stepDur * 1.5);
      }

      // 3. Ticking Suspense Hi-Hat
      const hatOsc = this.ctx.createOscillator();
      const hatGain = this.ctx.createGain();
      hatOsc.type = 'square';
      hatOsc.frequency.setValueAtTime(this.step % 4 === 2 ? 8000 : 5000, now);
      hatGain.gain.setValueAtTime(this.step % 2 === 0 ? 0.025 : 0.015, now);
      hatGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      hatOsc.connect(hatGain);
      hatGain.connect(this.ctx.destination);
      hatOsc.start(now);
      hatOsc.stop(now + 0.03);

      // 4. Ethereal Cyber Arpeggio
      if (this.step % 2 === 1) {
        const arpFreq = arpNotes[this.step % arpNotes.length];
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(arpFreq, now);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + stepDur * 2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + stepDur * 2);
      }
    }

    this.step = (this.step + 1) % 16;
    const interval = (60 / this.tempo / 4) * 1000;
    this.bgmTimer = setTimeout(() => this.scheduleBGMStep(), interval);
  }

  setIntensity(isHigh) {
    this.tempo = isHigh ? 154 : 124;
  }

  playJump() {
    if (!this.enabled || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(520, this.ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  playYank() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.18);
    gain.gain.setValueAtTime(0.22, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.18);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(now + 0.18);
  }

  playEarthquake() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(55, now);
    osc.frequency.linearRampToValueAtTime(25, now + 0.45);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(now + 0.45);
  }

  playCorrect() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.12, now + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.07);
      osc.stop(now + i * 0.07 + 0.25);
    });
  }

  playWrong() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.linearRampToValueAtTime(70, now + 0.35);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.35);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.35);
  }

  playRescue() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    [440, 554, 659, 880].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.15, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.3);
    });
  }

  playCrumble() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(75, now);
    osc.frequency.exponentialRampToValueAtTime(28, now + 0.3);
    gain.gain.setValueAtTime(0.14, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(now + 0.3);
  }

  playEMP() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.4);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(now + 0.4);
  }

  playTurbo() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(620, now + 0.35);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.35);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(now + 0.35);
  }

  playShield() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    [659.25, 830.61, 987.77, 1318.51].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.14, now + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.4);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.05);
      osc.stop(now + i * 0.05 + 0.4);
    });
  }

  playShieldPop() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.25);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(now + 0.25);
  }

  playBouncePad() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.22);
    gain.gain.setValueAtTime(0.24, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.22);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(now + 0.22);
  }

  playOrbCollect() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    [587.33, 880, 1174.66].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.12, now + i * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.04 + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.04);
      osc.stop(now + i * 0.04 + 0.18);
    });
  }

  playLaserZap() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(950, now);
    osc.frequency.linearRampToValueAtTime(200, now + 0.12);
    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(now + 0.12);
  }
}

// ==========================================
// 3. Main 3D Cyber Game Engine
// ==========================================
class BioCyberArena3D {
  constructor() {
    this.sfx = new SoundFX();
    this.gameType = 'survival'; // 'survival' or 'whoami'
    this.currentTheme = 'sakura'; // Active theme

    // State
    this.state = 'PLAYING'; // Start immediately active
    this.playerName = 'CyberBot-01';
    this.roomCode = 'CYBER-774';
    this.teamMode = 'ai';

    // Camera & Minecraft First-Person
    this.cameraMode = 'fp'; // 'fp' (1st Person Minecraft), 'tp' (3rd Person), 'iso' (Overview)
    this.yaw = 0;
    this.pitch = -0.12;
    this.isDraggingLook = false;
    this.dragStart = { x: 0, y: 0 };
    this.cameraShake = 0; // Camera earthquake shake intensity

    this.score = 0;
    this.round = 1;
    this.totalRounds = 8;
    this.currentQuestionIdx = 0;
    this.questionTimeMax = 18;
    this.questionTimer = this.questionTimeMax;

    // Random Falling Block Mechanic (สุ่มบล็อคร่วงทีละ 1 บล็อก)
    this.randomFallInterval = 1.6; // Seconds between random block drops
    this.randomFallTimer = 1.0;

    // Map & Blocks (Wider 15x15 Expansive Cyber Island)
    this.gridSize = 15;
    this.blockSize = 3.8;
    this.blocks = [];

    // 4 Answer Pads & 3D Holographic Billboards
    this.answerPads = [];

    // Players & 3D Voxel Models
    this.players = [];
    this.tetherRopes = [];
    this.tetherRestLength = 6.5;
    this.tetherStiffness = 0.07;
    this.yankCooldown = 0;

    // Power-Up Skills & Hazards Mechanics (ลูกเล่นใหม่สุดแจ่ม!)
    this.skills = { hack: 1, speed: 2, shield: 1 };
    this.speedBoostTimer = 0;
    this.shieldActive = false;
    this.shieldMesh = null;
    this.bouncePads = [];
    this.cyberOrbs = [];
    this.orbSpawnTimer = 4.0;
    this.laserSweeperGroup = null;
    this.laserSweeperAngle = 0;
    this.comboStreak = 0;

    // Rescue QTE
    this.fallenPlayer = null;
    this.rescueProgress = 0;
    this.rescueTarget = 100;
    this.rescueTimer = 8.5;

    // Particles array
    this.activeParticles = [];

    // Keys
    this.keys = { up: false, down: false, left: false, right: false, space: false };

    this.initThreeJS();
    this.initInputs();
    this.initLobbyUI();

    // Build the 3D scene immediately on page load so it is NEVER a black screen!
    this.buildWidePlatformGrid();
    this.build3DAnswerPads();
    this.buildBouncePads();
    this.buildLaserSweeper();
    this.build3DDecorations();
    this.build3DPlayers();
    this.updateSkillsUI();
    this.loadQuestion(0);

    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.gameLoop(t));
  }

  addCameraShake(amount) {
    this.cameraShake = Math.min(1.2, this.cameraShake + amount);
  }

  initThreeJS() {
    const container = document.getElementById('threeContainer');
    this.scene = new THREE.Scene();
    
    const theme = ARENA_THEMES[this.currentTheme] || ARENA_THEMES.sakura;
    this.scene.background = new THREE.Color(theme.bg);
    this.scene.fog = new THREE.FogExp2(theme.fog, theme.fogDensity);

    // Camera (Supports 1st Person Minecraft perspective)
    const aspect = (window.innerWidth || 1200) / (window.innerHeight || 800);
    this.camera = new THREE.PerspectiveCamera(65, aspect, 0.1, 1000);
    this.camera.position.set(0, 2.5, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setClearColor(theme.bg, 1);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    if (container) {
      container.appendChild(this.renderer.domElement);
    } else {
      document.body.appendChild(this.renderer.domElement);
    }

    // Dynamic Lights
    this.ambientLight = new THREE.AmbientLight(theme.ambientLight, theme.ambientIntensity);
    this.scene.add(this.ambientLight);

    this.dirLight = new THREE.DirectionalLight(theme.dirLight, theme.dirIntensity);
    this.dirLight.position.set(20, 45, 30);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 1024;
    this.dirLight.shadow.mapSize.height = 1024;
    this.scene.add(this.dirLight);

    // Deep Abyss Grid Helper
    this.gridHelper = new THREE.GridHelper(120, 40, 0x444444, 0x141414);
    this.gridHelper.position.y = -22;
    this.scene.add(this.gridHelper);

    window.addEventListener('resize', () => this.onWindowResize());
  }

  toggleCameraMode() {
    if (this.cameraMode === 'fp') {
      this.cameraMode = 'tp';
    } else if (this.cameraMode === 'tp') {
      this.cameraMode = 'iso';
    } else {
      this.cameraMode = 'fp';
    }

    const btn = document.getElementById('camToggleBtn');
    if (btn) {
      const modeLabel = this.cameraMode === 'fp' ? '1st Person' : (this.cameraMode === 'tp' ? '3rd Person' : 'Overview (Iso)');
      btn.innerHTML = `🎥 <span>${modeLabel}</span>`;
    }

    const crosshair = document.getElementById('minecraftCrosshair');
    if (crosshair) {
      crosshair.className = this.cameraMode === 'fp' ? 'minecraft-crosshair' : 'minecraft-crosshair hidden';
    }

    // Hide human player model mesh in 1st person mode so it doesn't block player's eyes
    const human = this.players.find(p => p.isHuman);
    if (human && human.group) {
      human.group.traverse(child => {
        if (child.isMesh) {
          child.visible = this.cameraMode !== 'fp';
        }
      });
    }
  }

  selectChoiceAndRun(choiceId) {
    this.sfx.init();
    const pad = this.answerPads.find(p => p.id === choiceId);
    if (!pad) return;

    // Highlight active card in bottom HUD
    document.querySelectorAll('.choice-hud-card').forEach(c => c.classList.remove('active-target'));
    const btn = document.getElementById(`choiceBtn-${choiceId}`);
    if (btn) btn.classList.add('active-target');

    // Command player to sprint to the pad
    const human = this.players.find(p => p.isHuman);
    if (human && human.status === 'SAFE') {
      human.autoTarget = { x: pad.x, z: pad.z };
    }
  }

  clearAutoRun() {
    const human = this.players.find(p => p.isHuman);
    if (human) human.autoTarget = null;
    document.querySelectorAll('.choice-hud-card').forEach(c => c.classList.remove('active-target'));
  }

  applyTheme(themeKey) {
    if (!ARENA_THEMES[themeKey]) return;
    this.currentTheme = themeKey;
    const theme = ARENA_THEMES[themeKey];

    // Scene & Fog
    if (this.scene) {
      this.scene.background.setHex(theme.bg);
      if (this.scene.fog) {
        this.scene.fog.color.setHex(theme.fog);
        this.scene.fog.density = theme.fogDensity;
      }
    }

    // Lights
    if (this.ambientLight) {
      this.ambientLight.color.setHex(theme.ambientLight);
      this.ambientLight.intensity = theme.ambientIntensity;
    }
    if (this.dirLight) {
      this.dirLight.color.setHex(theme.dirLight);
      this.dirLight.intensity = theme.dirIntensity;
    }

    // Blocks
    this.blocks.forEach(b => {
      if (b.mesh) {
        b.mesh.material.color.setHex(theme.blockTop);
        const wire = b.mesh.children.find(c => c.isLineSegments);
        if (wire) {
          wire.material.color.setHex(theme.blockEdge);
          wire.material.opacity = theme.blockEdgeOpacity;
        }
      }
    });

    // Answer Pads & Billboards
    this.answerPads.forEach(pad => {
      if (pad.podium) pad.podium.material.color.setHex(theme.padPodium);
      if (pad.torus) pad.torus.material.color.setHex(theme.padRing);
    });

    // Re-render Question Billboards
    const questionList = this.gameType === 'whoami' ? WHO_AM_I_ROUNDS : STANDARD_QUESTIONS;
    const q = questionList[this.currentQuestionIdx];
    if (q) {
      q.choices.forEach(ch => {
        const pad = this.answerPads.find(p => p.id === ch.id);
        if (pad) this.update3DBillboardText(pad, ch.id, ch.text);
      });
    }

    // Rebuild 3D Decorations (Trees & Atmosphere Particles)
    this.build3DDecorations();

    // Update Dock UI Buttons & Lobby Cards
    document.querySelectorAll('.theme-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById(`themeBtn-${themeKey}`);
    if (activeBtn) activeBtn.classList.add('active');

    document.querySelectorAll('.theme-card').forEach(card => {
      if (card.getAttribute('data-theme') === themeKey) card.classList.add('selected');
      else card.classList.remove('selected');
    });
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  initInputs() {
    // Keyboard WASD, Jump, Skills & Space
    window.addEventListener('keydown', (e) => {
      this.sfx.init();
      if (e.code === 'KeyW' || e.code === 'ArrowUp') { this.keys.up = true; this.clearAutoRun(); }
      if (e.code === 'KeyS' || e.code === 'ArrowDown') { this.keys.down = true; this.clearAutoRun(); }
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') { this.keys.left = true; this.clearAutoRun(); }
      if (e.code === 'KeyD' || e.code === 'ArrowRight') { this.keys.right = true; this.clearAutoRun(); }
      if (e.code === 'Space') {
        this.keys.space = true;
        if (this.state === 'RESCUE') {
          this.performRescuePull();
        } else if (this.state === 'PLAYING') {
          this.performJump();
        }
      }
      if (e.code === 'KeyE') {
        if (this.state === 'PLAYING') {
          this.performTetherYank(0);
        }
      }
      if (e.code === 'Digit1') {
        this.useSkill('hack');
      }
      if (e.code === 'Digit2') {
        this.useSkill('speed');
      }
      if (e.code === 'Digit3') {
        this.useSkill('shield');
      }
      if (e.code === 'KeyF' || e.code === 'KeyV') {
        this.toggleCameraMode();
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'KeyW' || e.code === 'ArrowUp') this.keys.up = false;
      if (e.code === 'KeyS' || e.code === 'ArrowDown') this.keys.down = false;
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') this.keys.left = false;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') this.keys.right = false;
      if (e.code === 'Space') this.keys.space = false;
    });

    // Mouse Drag to Look Around (Minecraft style)
    const dom = this.renderer.domElement;
    dom.addEventListener('mousedown', (e) => {
      if (e.button === 0) {
        this.isDraggingLook = true;
        this.dragStart = { x: e.clientX, y: e.clientY };
      }
    });
    window.addEventListener('mousemove', (e) => {
      if (this.isDraggingLook) {
        const dx = e.clientX - this.dragStart.x;
        const dy = e.clientY - this.dragStart.y;
        this.dragStart = { x: e.clientX, y: e.clientY };

        const sens = 0.004;
        this.yaw -= dx * sens;
        this.pitch = Math.max(-0.85, Math.min(0.85, this.pitch - dy * sens));
      }
    });
    window.addEventListener('mouseup', () => {
      this.isDraggingLook = false;
    });

    // Touch Swipe to Look Around (Right half of screen for mobile)
    let touchLookId = null;
    let touchLookPos = { x: 0, y: 0 };

    window.addEventListener('touchstart', (e) => {
      this.sfx.init();
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        if (t.clientX > window.innerWidth * 0.35 && !t.target.closest('button') && !t.target.closest('input') && !t.target.closest('.choice-hud-card')) {
          touchLookId = t.identifier;
          touchLookPos = { x: t.clientX, y: t.clientY };
          break;
        }
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        if (t.identifier === touchLookId) {
          const dx = t.clientX - touchLookPos.x;
          const dy = t.clientY - touchLookPos.y;
          touchLookPos = { x: t.clientX, y: t.clientY };

          const sens = 0.005;
          this.yaw -= dx * sens;
          this.pitch = Math.max(-0.85, Math.min(0.85, this.pitch - dy * sens));
          break;
        }
      }
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchLookId) {
          touchLookId = null;
          break;
        }
      }
    }, { passive: true });

    // Virtual D-Pad Touch Buttons for Mobile
    const bindDpad = (id, keyName) => {
      const btn = document.getElementById(id);
      if (!btn) return;
      const start = (e) => {
        e.preventDefault();
        this.sfx.init();
        this.keys[keyName] = true;
        this.clearAutoRun();
        btn.classList.add('pressed');
      };
      const end = (e) => {
        e.preventDefault();
        this.keys[keyName] = false;
        btn.classList.remove('pressed');
      };
      btn.addEventListener('touchstart', start, { passive: false });
      btn.addEventListener('touchend', end, { passive: false });
      btn.addEventListener('mousedown', start);
      btn.addEventListener('mouseup', end);
      btn.addEventListener('mouseleave', end);
    };

    bindDpad('dpadUp', 'up');
    bindDpad('dpadDown', 'down');
    bindDpad('dpadLeft', 'left');
    bindDpad('dpadRight', 'right');

    // Mobile Jump Button
    const mobileJumpBtn = document.getElementById('mobileJumpBtn');
    if (mobileJumpBtn) {
      const handleJump = (e) => {
        e.preventDefault();
        this.sfx.init();
        if (this.state === 'RESCUE') {
          this.performRescuePull();
        } else if (this.state === 'PLAYING') {
          this.performJump();
        }
      };
      mobileJumpBtn.addEventListener('touchstart', handleJump, { passive: false });
      mobileJumpBtn.addEventListener('click', handleJump);
    }

    // Mobile Yank Button
    const mobileYankBtn = document.getElementById('mobileYankBtn');
    if (mobileYankBtn) {
      const handleYank = (e) => {
        e.preventDefault();
        this.sfx.init();
        if (this.state === 'RESCUE') {
          this.performRescuePull();
        } else if (this.state === 'PLAYING') {
          this.performTetherYank(0);
        }
      };
      mobileYankBtn.addEventListener('touchstart', handleYank, { passive: false });
      mobileYankBtn.addEventListener('click', handleYank);
    }

    const pullBtn = document.getElementById('pullBtn');
    if (pullBtn) {
      pullBtn.addEventListener('click', () => {
        this.sfx.init();
        if (this.state === 'RESCUE') this.performRescuePull();
      });
    }

    const soundBtn = document.getElementById('soundBtn');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        this.sfx.enabled = !this.sfx.enabled;
        soundBtn.innerHTML = this.sfx.enabled ? '🔊' : '🔇';
      });
    }
  }

  initLobbyUI() {
    const startBtn = document.getElementById('startArenaBtn');
    const lobbyOverlay = document.getElementById('lobbyOverlay');
    const nameInput = document.getElementById('playerNameInput');
    const hostPreview = document.getElementById('lobbyHostNamePreview');

    if (nameInput) {
      nameInput.addEventListener('input', () => {
        this.playerName = nameInput.value.trim() || 'CyberBot-01';
        if (hostPreview) hostPreview.innerText = `${this.playerName} (คุณ)`;
      });
    }

    if (startBtn && lobbyOverlay) {
      startBtn.addEventListener('click', () => {
        this.sfx.init();
        if (nameInput) this.playerName = nameInput.value.trim() || 'CyberBot-01';
        const roomInput = document.getElementById('roomCodeInput');
        if (roomInput) this.roomCode = roomInput.value.trim() || 'CYBER-774';

        const roomBadge = document.getElementById('roomBadge');
        if (roomBadge) roomBadge.innerText = this.roomCode;

        lobbyOverlay.classList.add('hidden');
        this.startNewGame();
      });
    }
  }

  openLobby() {
    const lobbyOverlay = document.getElementById('lobbyOverlay');
    if (lobbyOverlay) lobbyOverlay.classList.remove('hidden');
  }

  startNewGame() {
    this.state = 'PLAYING';
    this.score = 0;
    this.round = 1;
    this.skills = { hack: 1, speed: 2, shield: 1 };
    this.speedBoostTimer = 0;
    this.shieldActive = false;
    if (this.shieldMesh) {
      const human = this.players.find(p => p.isHuman);
      if (human && human.group) human.group.remove(this.shieldMesh);
      this.shieldMesh = null;
    }
    this.currentQuestionIdx = 0;
    this.questionTimer = this.questionTimeMax;

    this.buildWidePlatformGrid();
    this.build3DAnswerPads();
    this.buildBouncePads();
    this.buildLaserSweeper();
    this.build3DDecorations();
    this.build3DPlayers();
    this.updateSkillsUI();
    this.loadQuestion(0);

    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.gameLoop(t));
  }

  // ==========================================
  // 4. Wide Expansive 3D Cyber Grid Platform
  // ==========================================
  buildWidePlatformGrid() {
    this.blocks.forEach(b => this.scene.remove(b.mesh));
    this.blocks = [];

    const theme = ARENA_THEMES[this.currentTheme];
    const half = Math.floor(this.gridSize / 2);
    const boxGeo = new THREE.BoxGeometry(this.blockSize * 0.94, 1.4, this.blockSize * 0.94);
    const edgeGeo = new THREE.EdgesGeometry(boxGeo);

    for (let r = -half; r <= half; r++) {
      for (let c = -half; c <= half; c++) {
        const dist = Math.sqrt(r * r + c * c);
        if (dist <= half + 0.4) {
          const mat = new THREE.MeshStandardMaterial({
            color: theme.blockTop,
            roughness: 0.35,
            metalness: 0.75
          });

          const mesh = new THREE.Mesh(boxGeo, mat);
          mesh.position.set(c * this.blockSize, 0, r * this.blockSize);
          mesh.castShadow = true;
          mesh.receiveShadow = true;

          const lineMat = new THREE.LineBasicMaterial({
            color: theme.blockEdge,
            transparent: true,
            opacity: theme.blockEdgeOpacity
          });
          const wireframe = new THREE.LineSegments(edgeGeo, lineMat);
          mesh.add(wireframe);

          this.scene.add(mesh);

          this.blocks.push({
            r, c,
            x: mesh.position.x,
            z: mesh.position.z,
            dist,
            mesh,
            alive: true,
            isFalling: false,
            fallVelocity: 0,
            rotSpeed: { x: 0, y: 0, z: 0 },
            shakeTimer: 0
          });
        }
      }
    }
  }

  // ==========================================
  // 4.1 3D Multi-Theme Decorations & Atmosphere
  // ==========================================
  build3DDecorations() {
    if (this.decorationsGroup) this.scene.remove(this.decorationsGroup);
    this.decorationsGroup = new THREE.Group();
    const theme = ARENA_THEMES[this.currentTheme];

    // 1. Central Holographic DNA Double Helix Monolith
    this.dnaHelixGroup = new THREE.Group();
    this.dnaHelixGroup.position.set(0, 3.5, 0);

    const sphereGeo = new THREE.SphereGeometry(0.24, 8, 8);
    const sphereMatA = new THREE.MeshBasicMaterial({ color: theme.helixA });
    const sphereMatB = new THREE.MeshBasicMaterial({ color: theme.helixB });
    const rungGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.2, 6);
    const rungMat = new THREE.MeshBasicMaterial({ color: theme.helixRung, transparent: true, opacity: 0.75 });

    const totalNodes = 20;
    for (let i = 0; i < totalNodes; i++) {
      const angle = i * 0.45;
      const y = (i - totalNodes / 2) * 0.35;
      const radius = 1.1;

      const pA = new THREE.Mesh(sphereGeo, sphereMatA);
      pA.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
      this.dnaHelixGroup.add(pA);

      const pB = new THREE.Mesh(sphereGeo, sphereMatB);
      pB.position.set(Math.cos(angle + Math.PI) * radius, y, Math.sin(angle + Math.PI) * radius);
      this.dnaHelixGroup.add(pB);

      if (i % 2 === 0) {
        const rung = new THREE.Mesh(rungGeo, rungMat);
        rung.position.set(0, y, 0);
        rung.rotation.z = Math.PI / 2;
        rung.rotation.y = -angle;
        this.dnaHelixGroup.add(rung);
      }
    }

    // Orbiting Central Ring
    const centerRingGeo = new THREE.TorusGeometry(1.8, 0.06, 8, 32);
    const centerRingMat = new THREE.MeshBasicMaterial({ color: theme.ring });
    this.centerRing = new THREE.Mesh(centerRingGeo, centerRingMat);
    this.centerRing.rotation.x = Math.PI / 2;
    this.dnaHelixGroup.add(this.centerRing);

    this.decorationsGroup.add(this.dnaHelixGroup);

    // 2. 4 Cyber Energy Pylon Beacons at 4 Diagonal Corners
    const pylonCorners = [
      { x: -16, z: -16 },
      { x: 16, z: -16 },
      { x: -16, z: 16 },
      { x: 16, z: 16 }
    ];

    pylonCorners.forEach(pos => {
      const pylon = new THREE.Group();
      pylon.position.set(pos.x, 0, pos.z);

      const baseGeo = new THREE.BoxGeometry(2.4, 3.2, 2.4);
      const baseMat = new THREE.MeshStandardMaterial({ color: 0x121218, roughness: 0.2, metalness: 0.9 });
      const base = new THREE.Mesh(baseGeo, baseMat);
      base.position.y = 1.6;
      pylon.add(base);

      const crystalGeo = new THREE.OctahedronGeometry(0.9, 0);
      const crystalMat = new THREE.MeshBasicMaterial({ color: theme.pylonBeam });
      const crystal = new THREE.Mesh(crystalGeo, crystalMat);
      crystal.position.y = 4.2;
      pylon.add(crystal);

      const beamGeo = new THREE.CylinderGeometry(0.12, 0.4, 36, 12);
      const beamMat = new THREE.MeshBasicMaterial({ color: theme.pylonBeam, transparent: true, opacity: theme.pylonBeamOpacity });
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.y = 20;
      pylon.add(beam);

      this.decorationsGroup.add(pylon);
    });

    // 3. Floating Orbital Satellite Data Cubes
    this.satelliteCubes = [];
    const numSats = 6;
    const satGeo = new THREE.BoxGeometry(0.9, 0.9, 0.9);
    const satEdgeGeo = new THREE.EdgesGeometry(satGeo);

    for (let i = 0; i < numSats; i++) {
      const satMat = new THREE.MeshStandardMaterial({ color: theme.satellite, roughness: 0.2, metalness: 0.8 });
      const sat = new THREE.Mesh(satGeo, satMat);

      const edgeMat = new THREE.LineBasicMaterial({ color: theme.satelliteEdge });
      sat.add(new THREE.LineSegments(satEdgeGeo, edgeMat));

      const angle = (i / numSats) * Math.PI * 2;
      const radius = 22 + Math.random() * 4;
      sat.position.set(Math.cos(angle) * radius, 4.5 + Math.random() * 3, Math.sin(angle) * radius);

      this.decorationsGroup.add(sat);
      this.satelliteCubes.push({ mesh: sat, baseAngle: angle, radius, speed: 0.25 + Math.random() * 0.2, yOffset: sat.position.y });
    }

    // 4. Floor Glowing Laser Conduits connecting Center to 4 Answer Pads
    const padOffset = this.blockSize * 3.4;
    const conduitCoords = [
      [0, 0, 0, -padOffset],
      [0, 0, padOffset, 0],
      [0, 0, 0, padOffset],
      [0, 0, -padOffset, 0]
    ];

    conduitCoords.forEach(([x1, z1, x2, z2]) => {
      const p1 = new THREE.Vector3(x1, 0.72, z1);
      const p2 = new THREE.Vector3(x2, 0.72, z2);
      const curve = new THREE.LineCurve3(p1, p2);
      const tubeGeo = new THREE.TubeGeometry(curve, 16, 0.06, 6, false);
      const tubeMat = new THREE.MeshBasicMaterial({ color: theme.conduit, transparent: true, opacity: 0.7 });
      const line = new THREE.Mesh(tubeGeo, tubeMat);
      this.decorationsGroup.add(line);
    });

    // 5. Theme Specific 3D Voxel Trees
    const buildThemeTree = (x, z, scale = 1.0) => {
      const tree = new THREE.Group();
      tree.position.set(x, 0.7, z);
      tree.scale.set(scale, scale, scale);

      if (theme.treeType === 'sakura') {
        // 🌸 Sakura Tree
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x241724, roughness: 0.8, metalness: 0.1 });
        const trunk = new THREE.Mesh(new THREE.BoxGeometry(0.7, 3.2, 0.7), trunkMat);
        trunk.position.y = 1.6;
        tree.add(trunk);

        const b1 = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.4, 0.5), trunkMat);
        b1.position.set(0.6, 2.8, 0.3); b1.rotation.z = -0.25; tree.add(b1);

        const m1 = new THREE.MeshStandardMaterial({ color: 0xff70a6, roughness: 0.4 });
        const m2 = new THREE.MeshStandardMaterial({ color: 0xff9ebb, roughness: 0.3 });
        const m3 = new THREE.MeshStandardMaterial({ color: 0xffd1dc, roughness: 0.5 });

        [{ x: 0, y: 4.0, z: 0, w: 3.0, h: 1.6, d: 3.0, m: m1 },
         { x: 0.8, y: 3.6, z: 0.6, w: 2.2, h: 1.4, d: 2.2, m: m2 },
         { x: -0.8, y: 3.4, z: -0.5, w: 2.0, h: 1.3, d: 2.0, m: m3 },
         { x: 0, y: 4.8, z: 0, w: 1.8, h: 1.1, d: 1.8, m: m1 }
        ].forEach(c => {
          const leaf = new THREE.Mesh(new THREE.BoxGeometry(c.w, c.h, c.d), c.m);
          leaf.position.set(c.x, c.y, c.z);
          tree.add(leaf);
        });
      } else if (theme.treeType === 'autumn') {
        // 🍁 Kyoto Autumn Maple Tree
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x261408, roughness: 0.8 });
        const trunk = new THREE.Mesh(new THREE.BoxGeometry(0.7, 3.2, 0.7), trunkMat);
        trunk.position.y = 1.6;
        tree.add(trunk);

        const m1 = new THREE.MeshStandardMaterial({ color: 0xe63946, roughness: 0.4 });
        const m2 = new THREE.MeshStandardMaterial({ color: 0xf77f00, roughness: 0.3 });
        const m3 = new THREE.MeshStandardMaterial({ color: 0xfcbf49, roughness: 0.4 });

        [{ x: 0, y: 4.0, z: 0, w: 2.9, h: 1.6, d: 2.9, m: m1 },
         { x: 0.8, y: 3.5, z: 0.6, w: 2.1, h: 1.3, d: 2.1, m: m2 },
         { x: -0.8, y: 3.3, z: -0.5, w: 2.0, h: 1.2, d: 2.0, m: m3 },
         { x: 0, y: 4.8, z: 0, w: 1.7, h: 1.1, d: 1.7, m: m2 }
        ].forEach(c => {
          const leaf = new THREE.Mesh(new THREE.BoxGeometry(c.w, c.h, c.d), c.m);
          leaf.position.set(c.x, c.y, c.z);
          tree.add(leaf);
        });
      } else if (theme.treeType === 'winter') {
        // ❄️ Arctic Snow Covered Pine Tree
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x141e28, roughness: 0.8 });
        const trunk = new THREE.Mesh(new THREE.BoxGeometry(0.6, 3.0, 0.6), trunkMat);
        trunk.position.y = 1.5;
        tree.add(trunk);

        const pineMat = new THREE.MeshStandardMaterial({ color: 0x0f3b4c, roughness: 0.5 });
        const snowMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });

        // Tiered Conical Pine with Snow Caps
        const tier1 = new THREE.Mesh(new THREE.BoxGeometry(3.0, 1.2, 3.0), pineMat); tier1.position.y = 2.6; tree.add(tier1);
        const snow1 = new THREE.Mesh(new THREE.BoxGeometry(3.1, 0.3, 3.1), snowMat); snow1.position.y = 3.2; tree.add(snow1);

        const tier2 = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.1, 2.2), pineMat); tier2.position.y = 3.8; tree.add(tier2);
        const snow2 = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.3, 2.3), snowMat); snow2.position.y = 4.4; tree.add(snow2);

        const tier3 = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.0, 1.4), pineMat); tier3.position.y = 4.9; tree.add(tier3);
        const snow3 = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.3, 1.5), snowMat); snow3.position.y = 5.5; tree.add(snow3);
      } else if (theme.treeType === 'lantern') {
        // 🏮 Festive Shrine / Lantern Tree
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x3d0c11, roughness: 0.5 });
        const trunk = new THREE.Mesh(new THREE.BoxGeometry(0.7, 3.4, 0.7), trunkMat);
        trunk.position.y = 1.7;
        tree.add(trunk);

        const roofMat = new THREE.MeshStandardMaterial({ color: 0xef233c, roughness: 0.3 });
        const roof = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.4, 2.6), roofMat);
        roof.position.y = 3.4;
        tree.add(roof);

        // Glowing Hanging Mini-Lanterns
        const lanternMat = new THREE.MeshBasicMaterial({ color: 0xffbe0b });
        const miniL1 = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.6, 0.4), lanternMat);
        miniL1.position.set(1.0, 2.7, 1.0); tree.add(miniL1);
        const miniL2 = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.6, 0.4), lanternMat);
        miniL2.position.set(-1.0, 2.7, -1.0); tree.add(miniL2);

        const leafMat = new THREE.MeshStandardMaterial({ color: 0xffd166, roughness: 0.4 });
        const canopy = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.6, 2.0), leafMat);
        canopy.position.y = 4.4;
        tree.add(canopy);
      } else {
        // ⚡ Cyber Matrix Holographic Tree
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x050510, roughness: 0.1, metalness: 0.9 });
        const trunk = new THREE.Mesh(new THREE.BoxGeometry(0.6, 3.4, 0.6), trunkMat);
        trunk.position.y = 1.7;
        tree.add(trunk);

        const cyberMatA = new THREE.MeshBasicMaterial({ color: 0x00f5d4, wireframe: true });
        const cyberMatB = new THREE.MeshBasicMaterial({ color: 0xf72585, transparent: true, opacity: 0.85 });

        const node1 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.4, 2.4), cyberMatA);
        node1.position.y = 3.6; tree.add(node1);

        const node2 = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.4, 1.4), cyberMatB);
        node2.position.y = 4.6; tree.add(node2);
      }

      return tree;
    };

    const treeCoords = [
      { x: -11, z: -8, scale: 1.15 },
      { x: 11, z: -8, scale: 1.1 },
      { x: -11, z: 8, scale: 1.05 },
      { x: 11, z: 8, scale: 1.2 }
    ];

    treeCoords.forEach(pos => {
      const tree = buildThemeTree(pos.x, pos.z, pos.scale);
      this.decorationsGroup.add(tree);
    });

    // 6. Dynamic Atmosphere Particle Simulator
    this.activeParticles = [];
    const pType = theme.particleType;

    if (pType === 'sakura_petals') {
      // 🌸 160 Drifting Pink Sakura Petals
      const count = 160;
      const geo = new THREE.PlaneGeometry(0.24, 0.18);
      const mat = new THREE.MeshBasicMaterial({ color: 0xffa8cc, side: THREE.DoubleSide, transparent: true, opacity: 0.88 });

      for (let i = 0; i < count; i++) {
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set((Math.random() - 0.5) * 40, Math.random() * 20 + 1, (Math.random() - 0.5) * 40);
        this.decorationsGroup.add(mesh);
        this.activeParticles.push({
          type: 'sakura_petals',
          mesh,
          fallSpeed: 1.2 + Math.random() * 1.6,
          driftSpeed: 0.8 + Math.random() * 1.2,
          rotSpeedX: Math.random() * 2 - 1,
          rotSpeedY: Math.random() * 2 - 1,
          phase: Math.random() * Math.PI * 2
        });
      }
    } else if (pType === 'autumn_leaves') {
      // 🍁 150 Golden & Crimson Maple Leaves
      const count = 150;
      const geo = new THREE.PlaneGeometry(0.28, 0.28);
      const leafColors = [0xe63946, 0xf77f00, 0xfcbf49];

      for (let i = 0; i < count; i++) {
        const col = leafColors[Math.floor(Math.random() * leafColors.length)];
        const mat = new THREE.MeshBasicMaterial({ color: col, side: THREE.DoubleSide, transparent: true, opacity: 0.9 });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set((Math.random() - 0.5) * 40, Math.random() * 20 + 1, (Math.random() - 0.5) * 40);
        this.decorationsGroup.add(mesh);
        this.activeParticles.push({
          type: 'autumn_leaves',
          mesh,
          fallSpeed: 1.4 + Math.random() * 1.8,
          driftSpeed: 1.1 + Math.random() * 1.5,
          rotSpeedX: Math.random() * 3 - 1.5,
          rotSpeedY: Math.random() * 2 - 1,
          phase: Math.random() * Math.PI * 2
        });
      }
    } else if (pType === 'snowflakes') {
      // ❄️ 240 Swirling Blizzard Snow Crystals
      const count = 240;
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count * 3; i += 3) {
        pos[i] = (Math.random() - 0.5) * 50;
        pos[i + 1] = Math.random() * 24 - 2;
        pos[i + 2] = (Math.random() - 0.5) * 50;
      }
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const mat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.28, transparent: true, opacity: 0.95 });
      const points = new THREE.Points(geo, mat);
      this.decorationsGroup.add(points);
      this.activeParticles.push({ type: 'snowflakes_points', points, count });
    } else if (pType === 'sky_lanterns') {
      // 🏮 50 Glowing Asian Sky Lanterns Ascending into the Heavens
      const count = 50;
      const lanternGeo = new THREE.CylinderGeometry(0.35, 0.28, 0.65, 8);
      const lanternColors = [0xffbe0b, 0xfb5607, 0xff006e, 0xffd166];

      for (let i = 0; i < count; i++) {
        const col = lanternColors[Math.floor(Math.random() * lanternColors.length)];
        const mat = new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.88 });
        const mesh = new THREE.Mesh(lanternGeo, mat);
        mesh.position.set((Math.random() - 0.5) * 44, Math.random() * 28 - 6, (Math.random() - 0.5) * 44);
        this.decorationsGroup.add(mesh);
        this.activeParticles.push({
          type: 'sky_lanterns',
          mesh,
          riseSpeed: 1.2 + Math.random() * 1.4,
          driftSpeed: 0.5 + Math.random() * 0.8,
          phase: Math.random() * Math.PI * 2
        });
      }
    } else {
      // ⚡ 180 Cyber Neon Data Sparks
      const count = 180;
      const geo = new THREE.BoxGeometry(0.18, 0.18, 0.18);
      const colors = [0x00f5d4, 0xf72585, 0x7b2cbf];

      for (let i = 0; i < count; i++) {
        const mat = new THREE.MeshBasicMaterial({ color: colors[i % colors.length] });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set((Math.random() - 0.5) * 40, Math.random() * 22, (Math.random() - 0.5) * 40);
        this.decorationsGroup.add(mesh);
        this.activeParticles.push({
          type: 'cyber_sparks',
          mesh,
          riseSpeed: 1.5 + Math.random() * 2.0,
          driftSpeed: 1.2,
          phase: Math.random() * Math.PI * 2
        });
      }
    }

    // 7. Ambient Stardust Field
    const stardustCount = 160;
    const stardustGeo = new THREE.BufferGeometry();
    const stardustPos = new Float32Array(stardustCount * 3);

    for (let i = 0; i < stardustCount * 3; i += 3) {
      stardustPos[i] = (Math.random() - 0.5) * 60;
      stardustPos[i + 1] = Math.random() * 24 - 4;
      stardustPos[i + 2] = (Math.random() - 0.5) * 60;
    }

    stardustGeo.setAttribute('position', new THREE.BufferAttribute(stardustPos, 3));
    const stardustMat = new THREE.PointsMaterial({ color: theme.stardust, size: 0.2, transparent: true, opacity: 0.75 });
    this.stardustParticles = new THREE.Points(stardustGeo, stardustMat);
    this.decorationsGroup.add(this.stardustParticles);

    this.scene.add(this.decorationsGroup);
  }

  // ==========================================
  // 5. 3D Answer Pads with High-Res Floating Billboards
  // ==========================================
  build3DAnswerPads() {
    this.answerPads.forEach(pad => {
      this.scene.remove(pad.group);
      if (pad.billboardTexture) pad.billboardTexture.dispose();
    });
    this.answerPads = [];

    const theme = ARENA_THEMES[this.currentTheme] || ARENA_THEMES.sakura;
    const offset = this.blockSize * 3.4;
    const padPositions = [
      { id: 'A', x: 0, z: -offset, label: 'A' },
      { id: 'B', x: offset, z: 0, label: 'B' },
      { id: 'C', x: 0, z: offset, label: 'C' },
      { id: 'D', x: -offset, z: 0, label: 'D' }
    ];

    padPositions.forEach(pos => {
      const group = new THREE.Group();
      group.position.set(pos.x, 0.8, pos.z);

      // Raised 3D Cyber Podium
      const podiumGeo = new THREE.CylinderGeometry(2.5, 2.8, 0.8, 24);
      const podiumMat = new THREE.MeshStandardMaterial({ color: theme.padPodium, roughness: 0.2, metalness: 0.9 });
      const podium = new THREE.Mesh(podiumGeo, podiumMat);
      podium.receiveShadow = true;
      group.add(podium);

      // Glowing Outer Hologram Ring
      const torusGeo = new THREE.TorusGeometry(2.7, 0.09, 8, 32);
      const torusMat = new THREE.MeshBasicMaterial({ color: theme.padRing });
      const torus = new THREE.Mesh(torusGeo, torusMat);
      torus.rotation.x = Math.PI / 2;
      torus.position.y = 0.45;
      group.add(torus);

      // Light Beam Stem
      const beamGeo = new THREE.CylinderGeometry(0.08, 0.08, 3.2, 8);
      const beamMat = new THREE.MeshBasicMaterial({ color: theme.padRing, transparent: true, opacity: 0.65 });
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.y = 2.0;
      group.add(beam);

      // 3D In-World Floating Hologram Billboard (1024x512 High-Res Canvas Texture)
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 512;
      const texture = new THREE.CanvasTexture(canvas);

      const billboardGeo = new THREE.PlaneGeometry(6.6, 3.3);
      const billboardMat = new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide });
      const billboard = new THREE.Mesh(billboardGeo, billboardMat);
      billboard.position.set(0, 4.2, 0);
      group.add(billboard);

      this.scene.add(group);

      this.answerPads.push({
        id: pos.id,
        x: pos.x,
        z: pos.z,
        radius: 2.8,
        group,
        podium,
        torus,
        canvas,
        texture,
        billboard
      });
    });
  }

  update3DBillboardText(pad, choiceLetter, choiceText) {
    if (!pad || !pad.canvas) return;
    const ctx = pad.canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, 1024, 512);
    const theme = ARENA_THEMES[this.currentTheme] || ARENA_THEMES.sakura;

    // Theme Glass Gradient Background
    ctx.fillStyle = theme.billboardBg || 'rgba(20, 10, 28, 0.94)';
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(16, 16, 992, 480, 36);
      ctx.fill();
      ctx.strokeStyle = theme.billboardBorder || '#ffffff';
      ctx.lineWidth = 8;
      ctx.stroke();
    } else {
      ctx.fillRect(16, 16, 992, 480);
      ctx.strokeStyle = theme.billboardBorder || '#ffffff';
      ctx.lineWidth = 8;
      ctx.strokeRect(16, 16, 992, 480);
    }

    // Choice Badge [A]
    ctx.fillStyle = theme.billboardBadge || '#ff70a6';
    ctx.beginPath();
    ctx.arc(120, 160, 68, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = theme.billboardBadgeText || '#ffffff';
    ctx.font = '800 76px Prompt, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(choiceLetter, 120, 164);

    // Choice Text (Large, High Contrast with Smart Wrap)
    ctx.fillStyle = theme.billboardText || '#ffffff';
    ctx.font = '700 56px Prompt, sans-serif';
    ctx.textAlign = 'left';
    const textStr = String(choiceText || '');
    if (textStr.length > 20) {
      const mid = Math.ceil(textStr.length / 2);
      ctx.fillText(textStr.substring(0, mid), 220, 130);
      ctx.fillText(textStr.substring(mid), 220, 200);
    } else {
      ctx.fillText(textStr, 220, 160);
    }

    // Sub-caption
    ctx.fillStyle = '#00f0ff';
    ctx.font = '600 36px Prompt, sans-serif';
    ctx.fillText('⚡ แท่นคำตอบ 3 มิติ · วิ่งมาเหยียบตรงนี้', 120, 320);

    ctx.fillStyle = '#a1a1aa';
    ctx.font = '500 28px Prompt, sans-serif';
    ctx.fillText('กดที่ช้อยส์ด้านล่างเพื่อวิ่งมาอัตโนมัติ', 120, 380);

    if (pad.texture) {
      pad.texture.needsUpdate = true;
    }
  }

  // ==========================================
  // 6. Detailed 3D Cyber Bot Avatars
  // ==========================================
  build3DPlayers() {
    this.players.forEach(p => this.scene.remove(p.group));
    this.players = [];

    const createDetailedCyberBot = (name, primaryColor, isHuman, startPos) => {
      const group = new THREE.Group();
      group.position.copy(startPos);

      // Head
      const headGeo = new THREE.BoxGeometry(0.9, 0.9, 0.9);
      const headMat = new THREE.MeshStandardMaterial({ color: primaryColor, roughness: 0.3, metalness: 0.7 });
      const head = new THREE.Mesh(headGeo, headMat);
      head.position.y = 2.0;
      head.castShadow = true;
      group.add(head);

      // Visor
      const visorGeo = new THREE.BoxGeometry(0.75, 0.28, 0.2);
      const visorMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const visor = new THREE.Mesh(visorGeo, visorMat);
      visor.position.set(0, 2.05, 0.42);
      group.add(visor);

      // Torso
      const bodyGeo = new THREE.BoxGeometry(1.2, 1.3, 0.8);
      const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1c1c22, roughness: 0.4, metalness: 0.8 });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.position.y = 1.0;
      body.castShadow = true;
      group.add(body);

      // Backpack Battery & Tether Anchor
      const packGeo = new THREE.BoxGeometry(0.5, 0.6, 0.35);
      const packMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const pack = new THREE.Mesh(packGeo, packMat);
      pack.position.set(0, 1.1, -0.48);
      group.add(pack);

      // Left & Right Arms
      const armGeo = new THREE.BoxGeometry(0.32, 0.9, 0.32);
      const armMat = new THREE.MeshStandardMaterial({ color: primaryColor });
      const leftArm = new THREE.Mesh(armGeo, armMat);
      leftArm.position.set(-0.8, 1.0, 0);
      group.add(leftArm);

      const rightArm = new THREE.Mesh(armGeo, armMat);
      rightArm.position.set(0.8, 1.0, 0);
      group.add(rightArm);

      // Left & Right Legs
      const legGeo = new THREE.BoxGeometry(0.36, 0.8, 0.36);
      const legMat = new THREE.MeshStandardMaterial({ color: 0x24242a });
      const leftLeg = new THREE.Mesh(legGeo, legMat);
      leftLeg.position.set(-0.35, 0.35, 0);
      group.add(leftLeg);

      const rightLeg = new THREE.Mesh(legGeo, legMat);
      rightLeg.position.set(0.35, 0.35, 0);
      group.add(rightLeg);

      this.scene.add(group);

      // In 1st Person mode, hide player's own body so it doesn't block camera
      if (isHuman && this.cameraMode === 'fp') {
        group.traverse(child => {
          if (child.isMesh) child.visible = false;
        });
      }

      return {
        name,
        isHuman,
        group,
        leftArm,
        rightArm,
        leftLeg,
        rightLeg,
        vx: 0,
        vz: 0,
        vy: 0,
        isGrounded: true,
        radius: 1.1,
        status: 'SAFE',
        slowTimer: 0,
        targetPad: null,
        autoTarget: null,
        yankTimer: Math.random() * 5 + 3
      };
    };

    this.players.push(createDetailedCyberBot(this.playerName, 0xffffff, true, new THREE.Vector3(0, 0.8, 0)));

    if (this.teamMode === 'ai') {
      this.players.push(createDetailedCyberBot('Dr. Watson (AI)', 0xd4d4d8, false, new THREE.Vector3(2, 0.8, -1.8)));
      this.players.push(createDetailedCyberBot('Prof. Rosalind (AI)', 0xa1a1aa, false, new THREE.Vector3(-2, 0.8, 2.2)));
    }

    this.init3DTetherRopes();
    this.updateTeamUI();
  }

  init3DTetherRopes() {
    this.tetherRopes.forEach(r => this.scene.remove(r.line));
    this.tetherRopes = [];

    const active = this.players.filter(p => p.status !== 'LOST');
    if (active.length < 2) return;

    for (let i = 0; i < active.length; i++) {
      const p1 = active[i];
      const p2 = active[(i + 1) % active.length];

      const points = [p1.group.position, p2.group.position];
      const curve = new THREE.CatmullRomCurve3(points);
      const tubeGeo = new THREE.TubeGeometry(curve, 14, 0.08, 6, false);
      const tubeMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 });
      const line = new THREE.Mesh(tubeGeo, tubeMat);

      this.scene.add(line);
      this.tetherRopes.push({ p1, p2, line });
    }
  }

  loadQuestion(idx) {
    const questionList = (this.gameType === 'whoami' && typeof WHO_AM_I_ROUNDS !== 'undefined') ? WHO_AM_I_ROUNDS : STANDARD_QUESTIONS;
    this.currentQuestionIdx = idx % questionList.length;
    const q = questionList[this.currentQuestionIdx];
    if (!q) return;
    this.questionTimer = this.questionTimeMax;

    const topicEl = document.getElementById('ribbonTopic');
    if (topicEl) topicEl.innerText = q.topic;
    const roundEl = document.getElementById('ribbonRound');
    if (roundEl) roundEl.innerText = `ข้อที่ ${this.round}/${this.totalRounds}`;
    const questionEl = document.getElementById('ribbonQuestion');
    if (questionEl) questionEl.innerText = q.question;

    // Update 3D In-World Floating Billboards for each pad!
    if (q.choices && Array.isArray(q.choices)) {
      q.choices.forEach(ch => {
        const pad = this.answerPads.find(p => p.id === ch.id);
        if (pad) {
          this.update3DBillboardText(pad, ch.id, ch.text);
        }
        // Update Bottom HUD Choice Button Texts
        const hudTextEl = document.getElementById(`choiceText-${ch.id}`);
        if (hudTextEl) {
          hudTextEl.innerText = ch.text;
        }
      });
    }

    this.clearAutoRun();

    // Who Am I Clue Cards Handling (Safe check)
    const clueBar = document.getElementById('clueCardsBar');
    if (clueBar) {
      if (this.gameType === 'whoami' && q.clues) {
        clueBar.style.display = 'flex';
        const ct1 = document.getElementById('clueText1');
        if (ct1) ct1.innerText = q.clues[0];
        const ct2 = document.getElementById('clueText2');
        if (ct2) ct2.innerText = 'ปลดล็อกใน 12s';
        const ct3 = document.getElementById('clueText3');
        if (ct3) ct3.innerText = 'ปลดล็อกใน 6s';
        const c2 = document.getElementById('clue2');
        if (c2) c2.className = 'clue-pill';
        const c3 = document.getElementById('clue3');
        if (c3) c3.className = 'clue-pill';
      } else {
        clueBar.style.display = 'none';
      }
    }

    // AI Teammates logic
    this.players.forEach(p => {
      if (!p.isHuman && q.choices) {
        const isSmart = Math.random() < 0.85;
        const correctChoice = (q.choices.find(c => c.correct) || q.choices[0]).id;
        const targetId = isSmart ? correctChoice : q.choices[Math.floor(Math.random() * q.choices.length)].id;
        p.targetPad = this.answerPads.find(pad => pad.id === targetId);
      }
    });
  }

  gameLoop(timestamp) {
    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1);
    this.lastTime = timestamp;

    this.update(dt);
    this.render();

    if (this.state !== 'GAMEOVER' && this.state !== 'VICTORY') {
      requestAnimationFrame((t) => this.gameLoop(t));
    }
  }

  update(dt) {
    if (this.state === 'PLAYING') {
      this.questionTimer -= dt;
      const pct = Math.max(0, (this.questionTimer / this.questionTimeMax) * 100);
      const timerFill = document.getElementById('timerBarFill');
      const timerPill = document.getElementById('timerPill');
      if (timerFill) timerFill.style.width = pct + '%';
      if (timerPill) timerPill.innerText = Math.ceil(this.questionTimer) + 's';

      // Progressive Who Am I clues reveal
      if (this.gameType === 'whoami' && typeof WHO_AM_I_ROUNDS !== 'undefined') {
        const q = WHO_AM_I_ROUNDS[this.currentQuestionIdx];
        if (q && q.clues) {
          if (this.questionTimer <= 12 && q.clues[1]) {
            const ct2 = document.getElementById('clueText2');
            if (ct2) ct2.innerText = q.clues[1];
            const c2 = document.getElementById('clue2');
            if (c2) c2.className = 'clue-pill revealed';
          }
          if (this.questionTimer <= 6 && q.clues[2]) {
            const ct3 = document.getElementById('clueText3');
            if (ct3) ct3.innerText = q.clues[2];
            const c3 = document.getElementById('clue3');
            if (c3) c3.className = 'clue-pill revealed';
          }
        }
      }

      // Random single block falling mechanic throughout the round (สุ่มบล็อคร่วงทีละ 1 บล็อก)
      this.triggerRandomBlockFall(dt);

      if (this.questionTimer <= 4) {
        this.crumbleWideBlocks(dt);
      }

      if (this.questionTimer <= 0) {
        this.evaluateAnswer();
      }

      this.update3DPlayersPhysics(dt);
      this.apply3DTetherSpringForces();
      this.checkPlayerBlockSupport();

      if (this.yankCooldown > 0) this.yankCooldown -= dt;
    } else if (this.state === 'RESCUE') {
      this.updateRescueEvent(dt);
    }

    this.update3DFallingBlocks(dt);
    this.update3DTetherRopeGeometry();

    // Animate 3D Map Decorations
    if (this.dnaHelixGroup) {
      this.dnaHelixGroup.rotation.y += dt * 0.8;
      if (this.centerRing) this.centerRing.rotation.z += dt * 1.2;
    }

    if (this.satelliteCubes) {
      this.satelliteCubes.forEach((sat, i) => {
        sat.baseAngle += sat.speed * dt;
        sat.mesh.position.x = Math.cos(sat.baseAngle) * sat.radius;
        sat.mesh.position.z = Math.sin(sat.baseAngle) * sat.radius;
        sat.mesh.position.y = sat.yOffset + Math.sin(Date.now() * 0.002 + i * 1.5) * 0.8;
        sat.mesh.rotation.x += dt * 1.5;
        sat.mesh.rotation.y += dt * 2.0;
      });
    }

    if (this.stardustParticles) {
      this.stardustParticles.rotation.y += dt * 0.04;
    }

    // Animate Dynamic Theme Atmosphere Particles
    if (this.activeParticles && this.activeParticles.length > 0) {
      const time = Date.now() * 0.001;
      this.activeParticles.forEach((p) => {
        if (p.type === 'sakura_petals' || p.type === 'autumn_leaves') {
          p.mesh.position.y -= p.fallSpeed * dt;
          p.mesh.position.x += Math.sin(time * p.driftSpeed + p.phase) * dt * 1.5;
          p.mesh.position.z += Math.cos(time * p.driftSpeed + p.phase) * dt * 1.5;
          p.mesh.rotation.x += p.rotSpeedX * dt;
          p.mesh.rotation.y += p.rotSpeedY * dt;
          if (p.mesh.position.y < -5) {
            p.mesh.position.y = 19;
            p.mesh.position.x = (Math.random() - 0.5) * 40;
            p.mesh.position.z = (Math.random() - 0.5) * 40;
          }
        } else if (p.type === 'sky_lanterns') {
          p.mesh.position.y += p.riseSpeed * dt;
          p.mesh.position.x += Math.sin(time * 0.8 + p.phase) * dt * 0.6;
          p.mesh.position.z += Math.cos(time * 0.8 + p.phase) * dt * 0.6;
          p.mesh.rotation.y += dt * 0.3;
          if (p.mesh.position.y > 32) {
            p.mesh.position.y = -6;
            p.mesh.position.x = (Math.random() - 0.5) * 44;
            p.mesh.position.z = (Math.random() - 0.5) * 44;
          }
        } else if (p.type === 'cyber_sparks') {
          p.mesh.position.y += p.riseSpeed * dt;
          p.mesh.rotation.x += dt * 2.0;
          p.mesh.rotation.y += dt * 3.0;
          if (p.mesh.position.y > 24) {
            p.mesh.position.y = 0;
            p.mesh.position.x = (Math.random() - 0.5) * 40;
            p.mesh.position.z = (Math.random() - 0.5) * 40;
          }
        } else if (p.type === 'snowflakes_points') {
          const pos = p.points.geometry.attributes.position.array;
          for (let i = 1; i < pos.length; i += 3) {
            pos[i] -= dt * 4.5;
            pos[i - 1] += Math.sin(time * 2 + i) * dt * 0.8;
            if (pos[i] < -6) {
              pos[i] = 22;
              pos[i - 1] = (Math.random() - 0.5) * 50;
              pos[i + 1] = (Math.random() - 0.5) * 50;
            }
          }
          p.points.geometry.attributes.position.needsUpdate = true;
          p.points.rotation.y += dt * 0.05;
        }
      });
    }

    // Update In-Game Power-Up Orbs
    this.updateCyberOrbs(dt);

    // Rotate Central Hazard Laser Sweeper
    if (this.laserSweeperGroup) {
      this.laserSweeperAngle += dt * 0.95;
      this.laserSweeperGroup.rotation.y = this.laserSweeperAngle;
    }

    // Pulse 3D Bounce Pads
    this.bouncePads.forEach(bp => {
      bp.pulse += dt * 4;
      if (bp.ringMesh) bp.ringMesh.scale.setScalar(1 + Math.sin(bp.pulse) * 0.08);
    });

    // Billboard orientation facing camera in all views
    this.answerPads.forEach(pad => {
      if (pad.billboard) {
        pad.billboard.quaternion.copy(this.camera.quaternion);
      }
    });
  }

  // ==========================================
  // 5.1 3D Bounce / Spring Launch Pads
  // ==========================================
  buildBouncePads() {
    this.bouncePads.forEach(bp => this.scene.remove(bp.group));
    this.bouncePads = [];

    const coords = [
      { x: 13.5, z: 13.5 },
      { x: -13.5, z: 13.5 },
      { x: 13.5, z: -13.5 },
      { x: -13.5, z: -13.5 }
    ];

    coords.forEach(pos => {
      const group = new THREE.Group();
      group.position.set(pos.x, 0.4, pos.z);

      const baseGeo = new THREE.CylinderGeometry(1.6, 1.8, 0.3, 16);
      const baseMat = new THREE.MeshStandardMaterial({ color: 0x22222a, roughness: 0.3, metalness: 0.8 });
      const baseMesh = new THREE.Mesh(baseGeo, baseMat);
      group.add(baseMesh);

      const ringGeo = new THREE.TorusGeometry(1.4, 0.12, 8, 24);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      ringMesh.position.y = 0.2;
      group.add(ringMesh);

      const springGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.4, 12);
      const springMat = new THREE.MeshBasicMaterial({ color: 0xff007f });
      const springMesh = new THREE.Mesh(springGeo, springMat);
      springMesh.position.y = 0.25;
      group.add(springMesh);

      this.scene.add(group);
      this.bouncePads.push({ x: pos.x, z: pos.z, radius: 1.9, group, ringMesh, springMesh, pulse: Math.random() * Math.PI });
    });
  }

  // ==========================================
  // 5.2 Central Rotating Hazard Laser Sweeper
  // ==========================================
  buildLaserSweeper() {
    if (this.laserSweeperGroup) this.scene.remove(this.laserSweeperGroup);
    this.laserSweeperGroup = new THREE.Group();
    this.laserSweeperGroup.position.set(0, 0.5, 0);

    const emitterGeo = new THREE.CylinderGeometry(0.6, 0.7, 0.8, 16);
    const emitterMat = new THREE.MeshStandardMaterial({ color: 0x111118, metalness: 0.9, roughness: 0.2 });
    const emitter = new THREE.Mesh(emitterGeo, emitterMat);
    this.laserSweeperGroup.add(emitter);

    const beamGeo = new THREE.CylinderGeometry(0.08, 0.08, 38, 8);
    beamGeo.rotateZ(Math.PI / 2);
    const beamMat = new THREE.MeshBasicMaterial({ color: 0xff0055, transparent: true, opacity: 0.85 });
    const beamMesh = new THREE.Mesh(beamGeo, beamMat);
    beamMesh.position.y = 0.2;
    this.laserSweeperGroup.add(beamMesh);

    this.scene.add(this.laserSweeperGroup);
  }

  // ==========================================
  // 5.3 Spawning Cyber Orbs & Pickups
  // ==========================================
  spawnCyberOrb() {
    if (this.cyberOrbs.length >= 4) return;
    const livingBlocks = this.blocks.filter(b => b.alive && !b.isFalling && b.dist > 1.2 && b.dist < 5.8);
    if (livingBlocks.length === 0) return;
    const block = livingBlocks[Math.floor(Math.random() * livingBlocks.length)];

    const orbTypes = [
      { type: 'points', color: 0xffd166, icon: '💎', label: '+200 คะแนนโบนัส' },
      { type: 'speed', color: 0x00f0ff, icon: '⚡', label: '+1 สปีดไนโตร' },
      { type: 'shield', color: 0x00ff88, icon: '🛡️', label: '+1 โล่พลังงาน' },
      { type: 'hack', color: 0xff007f, icon: '💡', label: '+1 EMP Hack' }
    ];
    const orbInfo = orbTypes[Math.floor(Math.random() * orbTypes.length)];

    const group = new THREE.Group();
    group.position.set(block.x, 1.4, block.z);

    const geo = new THREE.OctahedronGeometry(0.45, 0);
    const mat = new THREE.MeshBasicMaterial({ color: orbInfo.color, wireframe: false });
    const mesh = new THREE.Mesh(geo, mat);
    group.add(mesh);

    const ringGeo = new THREE.TorusGeometry(0.65, 0.04, 6, 16);
    const ringMat = new THREE.MeshBasicMaterial({ color: orbInfo.color, transparent: true, opacity: 0.7 });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    group.add(ringMesh);

    this.scene.add(group);
    this.cyberOrbs.push({
      info: orbInfo,
      group,
      mesh,
      ringMesh,
      x: block.x,
      z: block.z,
      baseY: 1.4,
      age: 0
    });
  }

  updateCyberOrbs(dt) {
    this.orbSpawnTimer -= dt;
    if (this.orbSpawnTimer <= 0) {
      this.orbSpawnTimer = 6.0;
      this.spawnCyberOrb();
    }

    const human = this.players.find(p => p.isHuman);

    for (let i = this.cyberOrbs.length - 1; i >= 0; i--) {
      const orb = this.cyberOrbs[i];
      orb.age += dt;
      orb.mesh.rotation.y += dt * 2.5;
      orb.mesh.rotation.x += dt * 1.5;
      orb.ringMesh.rotation.z += dt * 1.8;
      orb.group.position.y = orb.baseY + Math.sin(orb.age * 3.5) * 0.25;

      if (human && human.status === 'SAFE') {
        const dx = human.group.position.x - orb.x;
        const dz = human.group.position.z - orb.z;
        const dist = Math.hypot(dx, dz);
        if (dist < 1.7) {
          this.sfx.playOrbCollect();
          this.scene.remove(orb.group);
          this.cyberOrbs.splice(i, 1);

          if (orb.info.type === 'points') {
            this.score += 200;
            this.showFloatingToast(`💎 +200 PTS! (โบนัสคริสตัล)`, '#ffd166');
          } else if (orb.info.type === 'speed') {
            this.skills.speed = Math.min(5, this.skills.speed + 1);
            this.showFloatingToast(`⚡ เก็บไอเทม: +1 ไนโตรสปีด`, '#00f0ff');
          } else if (orb.info.type === 'shield') {
            this.skills.shield = Math.min(3, this.skills.shield + 1);
            this.showFloatingToast(`🛡️ เก็บไอเทม: +1 โล่คุ้มกัน`, '#00ff88');
          } else if (orb.info.type === 'hack') {
            this.skills.hack = Math.min(3, this.skills.hack + 1);
            this.showFloatingToast(`💡 เก็บไอเทม: +1 EMP Hack`, '#ff007f');
          }
          this.updateSkillsUI();
        }
      }
    }
  }

  // ==========================================
  // 5.4 Active Skills (Hack, Speed, Shield)
  // ==========================================
  useSkill(type) {
    this.sfx.init();
    if (this.state !== 'PLAYING') return;

    if (type === 'hack') {
      if (this.skills.hack <= 0) {
        this.showFloatingToast('⚠️ จำนวน EMP Hack หมดแล้ว!', '#ff4444');
        return;
      }
      this.skills.hack--;
      this.sfx.playEMP();
      this.addCameraShake(0.4);

      const questionList = this.gameType === 'whoami' ? WHO_AM_I_ROUNDS : STANDARD_QUESTIONS;
      const q = questionList[this.currentQuestionIdx];
      if (q && q.choices) {
        const wrongChoices = q.choices.filter(c => !c.correct);
        const shuffled = wrongChoices.sort(() => 0.5 - Math.random()).slice(0, 2);
        shuffled.forEach(choice => {
          const pad = this.answerPads.find(p => p.id === choice.id);
          if (pad) {
            if (pad.billboard) pad.billboard.visible = false;
            if (pad.torus) pad.torus.material.color.setHex(0x330011);
            const btn = document.getElementById(`choiceBtn-${choice.id}`);
            if (btn) {
              btn.classList.add('disabled-choice');
              btn.disabled = true;
            }
          }
        });
      }
      this.showFloatingToast('💡 EMP HACK! ลบ 2 ช้อยส์ผิดทิ้งสำเร็จ', '#00f0ff');
      this.updateSkillsUI();
    } else if (type === 'speed') {
      if (this.skills.speed <= 0) {
        this.showFloatingToast('⚠️ จำนวนไนโตรหมดแล้ว!', '#ff4444');
        return;
      }
      this.skills.speed--;
      this.speedBoostTimer = 6.0;
      this.sfx.playTurbo();
      this.addCameraShake(0.2);
      this.showFloatingToast('💨 TURBO NITRO! สปีดติดจรวด 6 วินาที', '#00f0ff');
      this.updateSkillsUI();
    } else if (type === 'shield') {
      if (this.skills.shield <= 0) {
        this.showFloatingToast('⚠️ จำนวนโล่หมดแล้ว!', '#ff4444');
        return;
      }
      if (this.shieldActive) {
        this.showFloatingToast('⚠️ โล่พลังงานทำงานอยู่แล้ว!', '#ffd166');
        return;
      }
      this.skills.shield--;
      this.shieldActive = true;
      this.sfx.playShield();

      const human = this.players.find(p => p.isHuman);
      if (human && human.group) {
        const shieldGeo = new THREE.SphereGeometry(1.8, 16, 16);
        const shieldMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true, transparent: true, opacity: 0.65 });
        this.shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
        this.shieldMesh.position.y = 1.2;
        human.group.add(this.shieldMesh);
      }
      this.showFloatingToast('🛡️ NANO SHIELD! เปิดใช้งานโล่เซฟตี้กันตกเหว', '#00ff88');
      this.updateSkillsUI();
    }
  }

  performJump() {
    const human = this.players.find(p => p.isHuman);
    if (!human || human.status !== 'SAFE') return;
    if (human.isGrounded) {
      human.vy = 13.5;
      human.isGrounded = false;
      this.sfx.playJump();
    }
  }

  updateSkillsUI() {
    const btnH = document.getElementById('skillHackBtn');
    if (btnH) {
      const badge = btnH.querySelector('.powerup-badge');
      if (badge) badge.innerText = `EMP ตัดช้อยส์ (${this.skills.hack})`;
      btnH.style.opacity = this.skills.hack > 0 ? '1.0' : '0.45';
    }
    const btnS = document.getElementById('skillSpeedBtn');
    if (btnS) {
      const badge = btnS.querySelector('.powerup-badge');
      if (badge) badge.innerText = `เทอร์โบ (${this.skills.speed})`;
      btnS.style.opacity = this.skills.speed > 0 ? '1.0' : '0.45';
    }
    const btnSh = document.getElementById('skillShieldBtn');
    if (btnSh) {
      const badge = btnSh.querySelector('.powerup-badge');
      if (badge) badge.innerText = `โล่กันตก (${this.skills.shield})`;
      btnSh.style.opacity = this.skills.shield > 0 ? '1.0' : '0.45';
    }
  }

  showFloatingToast(text, color = '#00f0ff') {
    const toast = document.createElement('div');
    toast.className = 'floating-game-toast';
    toast.style.borderColor = color;
    toast.style.boxShadow = `0 8px 30px ${color}55`;
    toast.innerText = text;
    document.body.appendChild(toast);
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 2200);
  }

  // Random Single Block Falling Mechanic (สุ่มบล็อคร่วงทีละ 1 บล็อก)
  triggerRandomBlockFall(dt) {
    this.randomFallTimer -= dt;
    if (this.randomFallTimer > 0) return;

    this.randomFallTimer = this.randomFallInterval;

    const eligible = this.blocks.filter(b => b.alive && !b.isFalling && b.shakeTimer === 0 && b.dist > 1.8);
    if (eligible.length === 0) return;

    const block = eligible[Math.floor(Math.random() * eligible.length)];
    block.shakeTimer = 0.01;
    this.sfx.playCrumble();

    if (block.mesh) {
      const wire = block.mesh.children.find(c => c.isLineSegments);
      if (wire) {
        wire.material.color.setHex(0xff0055);
        wire.material.opacity = 1.0;
      }
    }
  }

  performTetherYank(playerIdx) {
    if (this.yankCooldown > 0) return;
    this.yankCooldown = 1.2;
    this.sfx.playYank();

    const puller = this.players[playerIdx];
    if (!puller || puller.status !== 'SAFE') return;

    this.players.forEach((other, i) => {
      if (i !== playerIdx && other.status === 'SAFE') {
        const dx = puller.group.position.x - other.group.position.x;
        const dz = puller.group.position.z - other.group.position.z;
        const dist = Math.hypot(dx, dz) || 1;
        const impulse = 20;
        other.vx += (dx / dist) * impulse;
        other.vz += (dz / dist) * impulse;
      }
    });
  }

  update3DPlayersPhysics(dt) {
    const baseSpeed = 16;
    const human = this.players.find(p => p.isHuman);

    if (this.speedBoostTimer > 0) {
      this.speedBoostTimer = Math.max(0, this.speedBoostTimer - dt);
    }

    this.players.forEach((p, idx) => {
      if (p.status === 'FALLING' || p.status === 'LOST') return;

      const speed = (p.isHuman && this.speedBoostTimer > 0) ? baseSpeed * 2.2 : baseSpeed;

      if (p.isHuman) {
        let inputX = 0;
        let inputZ = 0;

        if (this.keys.up) inputZ -= 1;
        if (this.keys.down) inputZ += 1;
        if (this.keys.left) inputX -= 1;
        if (this.keys.right) inputX += 1;

        if (inputX !== 0 || inputZ !== 0) {
          if (inputX !== 0 && inputZ !== 0) {
            inputX *= 0.7071;
            inputZ *= 0.7071;
          }

          if (this.cameraMode === 'fp' || this.cameraMode === 'tp') {
            const forwardX = -Math.sin(this.yaw);
            const forwardZ = -Math.cos(this.yaw);
            const rightX = Math.cos(this.yaw);
            const rightZ = -Math.sin(this.yaw);

            const moveX = forwardX * (-inputZ) + rightX * inputX;
            const moveZ = forwardZ * (-inputZ) + rightZ * inputX;

            p.vx += moveX * speed * dt * 5;
            p.vz += moveZ * speed * dt * 5;
          } else {
            p.vx += inputX * speed * dt * 5;
            p.vz += inputZ * speed * dt * 5;
          }
        } else if (p.autoTarget) {
          const dx = p.autoTarget.x - p.group.position.x;
          const dz = p.autoTarget.z - p.group.position.z;
          const dist = Math.hypot(dx, dz);
          if (dist > 0.6) {
            p.vx += (dx / dist) * speed * dt * 4;
            p.vz += (dz / dist) * speed * dt * 4;
            if (this.cameraMode === 'fp') {
              const targetYaw = Math.atan2(-dx, -dz);
              let diff = targetYaw - this.yaw;
              while (diff < -Math.PI) diff += Math.PI * 2;
              while (diff > Math.PI) diff -= Math.PI * 2;
              this.yaw += diff * dt * 4;
            }
          } else {
            p.autoTarget = null;
          }
        }
      } else {
        if (p.targetPad) {
          const dx = p.targetPad.x - p.group.position.x;
          const dz = p.targetPad.z - p.group.position.z;
          const dist = Math.sqrt(dx * dx + dz * dz);
          if (dist > 0.5) {
            p.vx += (dx / dist) * speed * dt * 4;
            p.vz += (dz / dist) * speed * dt * 4;
          }
        }

        p.yankTimer -= dt;
        if (p.yankTimer <= 0) {
          p.yankTimer = Math.random() * 6 + 4;
          this.performTetherYank(idx);
        }
      }

      p.vx *= 0.88;
      p.vz *= 0.88;

      p.group.position.x += p.vx * dt;
      p.group.position.z += p.vz * dt;

      // Vertical Gravity & Jumping Physics
      p.group.position.y += (p.vy || 0) * dt;
      p.vy = (p.vy || 0) - 32 * dt;
      if (p.group.position.y <= 0.8 && p.status === 'SAFE') {
        p.group.position.y = 0.8;
        p.vy = 0;
        p.isGrounded = true;
      }

      // Check Stepping on 3D Bounce / Spring Pads
      this.bouncePads.forEach(bp => {
        const dist = Math.hypot(p.group.position.x - bp.x, p.group.position.z - bp.z);
        if (dist <= bp.radius && p.group.position.y <= 1.2) {
          p.vy = 24;
          p.isGrounded = false;
          this.sfx.playBouncePad();
          this.addCameraShake(0.35);
          if (p.isHuman) {
            this.showFloatingToast('🚀 SUPER BOUNCE PAD! เด้งสปริงสูงเสียดฟ้า', '#ff007f');
          }
        }
      });

      // Check Hazard Laser Sweeper Collision (if on ground)
      if (this.laserSweeperGroup && p.group.position.y <= 1.4 && p.status === 'SAFE') {
        const px = p.group.position.x;
        const pz = p.group.position.z;
        const distCenter = Math.hypot(px, pz);
        if (distCenter > 1.0 && distCenter < 19.0) {
          const playerAngle = Math.atan2(pz, px);
          let angleDiff = Math.abs(((playerAngle - this.laserSweeperAngle) % Math.PI + Math.PI) % Math.PI);
          if (angleDiff > Math.PI / 2) angleDiff = Math.PI - angleDiff;
          if (angleDiff < 0.14) {
            const pushDir = Math.atan2(pz, px);
            p.vx += Math.cos(pushDir) * 16;
            p.vz += Math.sin(pushDir) * 16;
            this.sfx.playLaserZap();
            this.addCameraShake(0.3);
            if (p.isHuman) {
              this.showFloatingToast('⚡ โดนลำแสงเลเซอร์กวาด! (กระโดด SPACE ข้ามได้)', '#ff0055');
            }
          }
        }
      }

      // Leg & Arm swing animations
      const isMoving = Math.hypot(p.vx, p.vz) > 0.5;
      if (isMoving) {
        const t = Date.now() * 0.015;
        p.leftLeg.rotation.x = Math.sin(t) * 0.6;
        p.rightLeg.rotation.x = -Math.sin(t) * 0.6;
        p.leftArm.rotation.x = -Math.sin(t) * 0.5;
        p.rightArm.rotation.x = Math.sin(t) * 0.5;
        p.group.rotation.y = Math.atan2(p.vx, p.vz);
      } else {
        p.leftLeg.rotation.x = 0;
        p.rightLeg.rotation.x = 0;
        p.leftArm.rotation.x = 0;
        p.rightArm.rotation.x = 0;
      }
    });

    // Update Shield Mesh Rotation
    if (this.shieldMesh) {
      this.shieldMesh.rotation.y += dt * 2.0;
      this.shieldMesh.rotation.x += dt * 1.2;
    }

    // Camera Shake Decay
    if (this.cameraShake > 0) {
      this.cameraShake = Math.max(0, this.cameraShake - dt * 2.2);
    }

    // Update Camera position based on Camera Mode (First Person / 3rd Person / Iso)
    if (human && human.group) {
      const shakeOffset = (Math.random() - 0.5) * this.cameraShake * 0.5;
      if (this.cameraMode === 'fp') {
        this.camera.position.set(human.group.position.x, human.group.position.y + 1.8 + shakeOffset, human.group.position.z);
        this.camera.rotation.set(this.pitch, this.yaw, shakeOffset * 0.2, 'YXZ');
      } else if (this.cameraMode === 'tp') {
        const dist = 9;
        const camX = human.group.position.x + Math.sin(this.yaw) * dist;
        const camZ = human.group.position.z + Math.cos(this.yaw) * dist;
        const camY = human.group.position.y + 4.5 - this.pitch * 6 + shakeOffset;
        this.camera.position.set(camX, camY, camZ);
        this.camera.lookAt(human.group.position.x, human.group.position.y + 1.5, human.group.position.z);
      } else {
        this.camera.position.set(0, 36 + shakeOffset, 44);
        this.camera.lookAt(0, 0, 0);
      }
    }
  }

  apply3DTetherSpringForces() {
    const active = this.players.filter(p => p.status !== 'LOST');
    if (active.length < 2) return;

    for (let i = 0; i < active.length; i++) {
      const p1 = active[i];
      const p2 = active[(i + 1) % active.length];

      const dx = p2.group.position.x - p1.group.position.x;
      const dz = p2.group.position.z - p1.group.position.z;
      const dist = Math.hypot(dx, dz) || 0.1;

      if (dist > this.tetherRestLength) {
        const force = (dist - this.tetherRestLength) * this.tetherStiffness;
        const fx = (dx / dist) * force;
        const fz = (dz / dist) * force;

        if (p1.status === 'SAFE') {
          p1.vx += fx;
          p1.vz += fz;
        }
        if (p2.status === 'SAFE') {
          p2.vx -= fx;
          p2.vz -= fz;
        }
      }
    }
  }

  update3DTetherRopeGeometry() {
    this.tetherRopes.forEach(rope => {
      if (rope.p1.status === 'LOST' || rope.p2.status === 'LOST') {
        rope.line.visible = false;
        return;
      }
      rope.line.visible = true;

      const p1Pos = rope.p1.group.position.clone().add(new THREE.Vector3(0, 1.2, 0));
      const p2Pos = rope.p2.group.position.clone().add(new THREE.Vector3(0, 1.2, 0));
      const midPos = p1Pos.clone().lerp(p2Pos, 0.5).add(new THREE.Vector3(0, -0.4, 0));

      const curve = new THREE.CatmullRomCurve3([p1Pos, midPos, p2Pos]);
      rope.line.geometry.dispose();
      rope.line.geometry = new THREE.TubeGeometry(curve, 12, 0.08, 6, false);
    });
  }

  crumbleWideBlocks(dt) {
    this.blocks.forEach(b => {
      if (b.alive && b.dist > 3.2 && b.shakeTimer === 0) {
        b.shakeTimer = 0.01;
      }
    });
  }

  update3DFallingBlocks(dt) {
    this.blocks.forEach(b => {
      if (b.alive && b.shakeTimer > 0) {
        b.shakeTimer += dt;
        b.mesh.position.x = b.x + Math.sin(b.shakeTimer * 28) * 0.14;
        b.mesh.position.z = b.z + Math.cos(b.shakeTimer * 28) * 0.14;

        if (b.shakeTimer > 1.8) {
          b.alive = false;
          b.isFalling = true;
          b.fallVelocity = 3.5;
          b.rotSpeed = {
            x: (Math.random() - 0.5) * 4,
            y: (Math.random() - 0.5) * 4,
            z: (Math.random() - 0.5) * 4
          };
          this.sfx.playCrumble();
        }
      }

      if (b.isFalling) {
        b.fallVelocity += dt * 32;
        b.mesh.position.y -= b.fallVelocity * dt;
        b.mesh.rotation.x += b.rotSpeed.x * dt;
        b.mesh.rotation.y += b.rotSpeed.y * dt;
        b.mesh.rotation.z += b.rotSpeed.z * dt;

        if (b.mesh.position.y < -35) {
          b.isFalling = false;
          this.scene.remove(b.mesh);
        }
      }
    });
  }

  checkPlayerBlockSupport() {
    this.players.forEach(p => {
      if (p.status !== 'SAFE') return;

      let onSolidGround = false;
      const px = p.group.position.x;
      const pz = p.group.position.z;

      for (const b of this.blocks) {
        if (b.alive && !b.isFalling) {
          const half = this.blockSize / 2;
          if (px >= b.x - half && px <= b.x + half &&
              pz >= b.z - half && pz <= b.z + half) {
            onSolidGround = true;
            break;
          }
        }
      }

      if (!onSolidGround) {
        for (const pad of this.answerPads) {
          const dist = Math.hypot(px - pad.x, pz - pad.z);
          if (dist <= pad.radius) {
            onSolidGround = true;
            break;
          }
        }
      }

      if (!onSolidGround) {
        // Check Shield Rescue Protection!
        if (p.isHuman && this.shieldActive) {
          this.shieldActive = false;
          if (this.shieldMesh && p.group) {
            p.group.remove(this.shieldMesh);
            this.shieldMesh = null;
          }
          this.sfx.playShieldPop();
          this.addCameraShake(0.5);
          p.group.position.set(0, 0.8, 0);
          p.vx = 0;
          p.vz = 0;
          p.vy = 0;
          this.showFloatingToast('🛡️ NANO SHIELD คุ้มกันชีวิตสำเร็จ! (วาร์ปกลับจุดปลอดภัย)', '#00ff88');
          this.updateSkillsUI();
          return;
        }

        this.triggerTeammateFall(p, 'ก้าวพลาดตกจากบล็อก 3 มิติ!');
      }
    });
  }

  evaluateAnswer() {
    const questionList = this.gameType === 'whoami' ? WHO_AM_I_ROUNDS : STANDARD_QUESTIONS;
    const q = questionList[this.currentQuestionIdx];
    const correctPad = this.answerPads.find(pad => {
      const ch = q.choices.find(c => c.id === pad.id);
      return ch && ch.correct;
    });

    const mainPlayer = this.players.find(p => p.isHuman);
    const distToCorrect = Math.hypot(mainPlayer.group.position.x - correctPad.x, mainPlayer.group.position.z - correctPad.z);
    const isCorrect = distToCorrect <= correctPad.radius + 1.0;

    if (isCorrect) {
      this.sfx.playCorrect();
      this.comboStreak = (this.comboStreak || 0) + 1;
      const bonus = this.comboStreak > 1 ? ` (+COMBO x${this.comboStreak})` : '';
      this.score += 100 * this.round * (this.comboStreak > 1 ? 1.5 : 1);
      this.showFloatingToast(`🌟 ถูกต้อง! +${100 * this.round} PTS${bonus}`, '#00ff88');

      this.round++;
      if (this.round > this.totalRounds) {
        this.showVictoryModal();
      } else {
        setTimeout(() => {
          this.loadQuestion(this.currentQuestionIdx + 1);
        }, 1200);
      }
    } else {
      this.sfx.playWrong();
      this.comboStreak = 0;
      const safePlayers = this.players.filter(p => p.status === 'SAFE');
      if (safePlayers.length > 0) {
        const victim = safePlayers[Math.floor(Math.random() * safePlayers.length)];
        this.triggerTeammateFall(victim, `ตอบผิด! แรงสั่นสะเทือนทำให้ ${victim.name} ร่วงลงสู่ขอบเหว 3D!`);
      } else {
        this.showGameOverModal('สมาชิกในทีมทุกคนร่วงหล่นลงสู่อเวจี 3D!');
      }
    }
  }

  triggerTeammateFall(player, reason) {
    if (this.state === 'RESCUE') return;
    player.status = 'FALLING';
    player.group.position.y = -2.8;
    this.fallenPlayer = player;
    this.state = 'RESCUE';
    this.rescueProgress = 20;
    this.rescueTimer = 8.5;

    this.sfx.playWrong();
    this.updateTeamUI();

    const overlay = document.getElementById('rescueOverlay');
    const titleEl = document.getElementById('rescueTitle');
    const subEl = document.getElementById('rescueSub');
    if (overlay && titleEl && subEl) {
      titleEl.innerText = `⚠️ ${player.name} กำลังจะร่วงตกเหว 3D!`;
      subEl.innerText = `${reason} ทุกคนต้องช่วยกันดึงเชือก 3D กู้ชีพขึ้นมาด่วน!`;
      overlay.classList.add('active');
    }
  }

  performRescuePull() {
    this.rescueProgress += 14;
    this.sfx.playJump();
    const fill = document.getElementById('rescueProgressFill');
    if (fill) fill.style.width = Math.min(100, this.rescueProgress) + '%';

    if (this.rescueProgress >= this.rescueTarget) {
      this.completeRescueSuccess();
    }
  }

  updateRescueEvent(dt) {
    this.rescueTimer -= dt;
    this.rescueProgress -= dt * 6;
    this.rescueProgress = Math.max(0, this.rescueProgress);

    const fill = document.getElementById('rescueProgressFill');
    if (fill) fill.style.width = this.rescueProgress + '%';

    if (this.rescueTimer <= 0) {
      this.failRescue();
    }
  }

  completeRescueSuccess() {
    this.sfx.playRescue();
    if (this.fallenPlayer) {
      this.fallenPlayer.status = 'SAFE';
      this.fallenPlayer.group.position.set(0, 0.8, 0);
      this.fallenPlayer.vx = 0;
      this.fallenPlayer.vz = 0;
      this.fallenPlayer.vy = 0;
    }

    const overlay = document.getElementById('rescueOverlay');
    if (overlay) overlay.classList.remove('active');

    this.state = 'PLAYING';
    this.fallenPlayer = null;
    this.updateTeamUI();
    this.loadQuestion(this.currentQuestionIdx + 1);
  }

  failRescue() {
    if (this.fallenPlayer) {
      this.fallenPlayer.status = 'LOST';
      this.scene.remove(this.fallenPlayer.group);
    }

    const overlay = document.getElementById('rescueOverlay');
    if (overlay) overlay.classList.remove('active');

    const remaining = this.players.filter(p => p.status === 'SAFE');
    if (remaining.length === 0) {
      this.showGameOverModal('สมาชิกทุกคนในทีมตกลงไปทั้งหมด!');
    } else {
      this.state = 'PLAYING';
      this.fallenPlayer = null;
      this.updateTeamUI();
      this.loadQuestion(this.currentQuestionIdx + 1);
    }
  }

  updateTeamUI() {
    const list = document.getElementById('teamMemberList');
    if (!list) return;
    list.innerHTML = '';
    this.players.forEach(p => {
      const row = document.createElement('div');
      row.className = 'member-row';
      row.innerHTML = `
        <div class="member-info">
          <div class="member-dot" style="background: ${p.status === 'SAFE' ? '#ffffff' : (p.status === 'FALLING' ? '#ffffff' : '#555')}"></div>
          <span>${p.name}</span>
        </div>
        <div class="member-status ${p.status === 'FALLING' ? 'falling' : ''}">
          ${p.status === 'SAFE' ? 'ปลอดภัย' : (p.status === 'FALLING' ? 'กำลังตก!' : 'สูญหาย')}
        </div>
      `;
      list.appendChild(row);
    });
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  showVictoryModal() {
    this.state = 'VICTORY';
    const overlay = document.getElementById('victoryOverlay');
    const scoreEl = document.getElementById('victoryScore');
    if (scoreEl) scoreEl.innerText = this.score + ' PTS';
    if (overlay) overlay.classList.remove('hidden');
  }

  showGameOverModal(reason) {
    this.state = 'GAMEOVER';
    const overlay = document.getElementById('gameOverOverlay');
    const reasonEl = document.getElementById('gameOverReason');
    const scoreEl = document.getElementById('gameOverScore');
    if (reasonEl) reasonEl.innerText = reason;
    if (scoreEl) scoreEl.innerText = this.score + ' PTS';
    if (overlay) overlay.classList.remove('hidden');
  }
}

// Global Mode Switcher
window.switchGameType = function(type) {
  if (window.bioCyber) {
    window.bioCyber.gameType = type;
    const tabSurv = document.getElementById('tabSurvival');
    if (tabSurv) tabSurv.className = type === 'survival' ? 'mode-tab-btn active' : 'mode-tab-btn';
    const tabWho = document.getElementById('tabWhoAmI');
    if (tabWho) tabWho.className = type === 'whoami' ? 'mode-tab-btn active' : 'mode-tab-btn';
    window.bioCyber.loadQuestion(0);
  }
};

// Global Theme Switcher
window.switchTheme = function(themeKey) {
  if (window.bioCyber) {
    window.bioCyber.applyTheme(themeKey);
  }
};

window.selectLobbyTheme = function(themeKey) {
  document.querySelectorAll('.theme-card').forEach(c => c.classList.remove('selected'));
  const card = document.querySelector(`.theme-card[data-theme="${themeKey}"]`);
  if (card) card.classList.add('selected');
  if (window.bioCyber) {
    window.bioCyber.applyTheme(themeKey);
  }
};

window.selectChoiceAndRun = function(choiceId) {
  if (window.bioCyber) {
    window.bioCyber.selectChoiceAndRun(choiceId);
  }
};

// Lobby Helpers
window.randomizePlayerName = function() {
  const coolNames = ['BioKnight-77', 'QuantumDNA', 'HelixRunner', 'CyberSynapse', 'NanoCell', 'GeneStriker', 'AeroMito', 'ChronoRibosome'];
  const name = coolNames[Math.floor(Math.random() * coolNames.length)];
  const input = document.getElementById('playerNameInput');
  const preview = document.getElementById('lobbyHostNamePreview');
  if (input) input.value = name;
  if (preview) preview.innerText = `${name} (คุณ)`;
  if (window.bioCyber) window.bioCyber.playerName = name;
};

window.generateRandomRoom = function() {
  const pin = 'CYBER-' + Math.floor(100 + Math.random() * 900);
  const input = document.getElementById('roomCodeInput');
  if (input) input.value = pin;
  if (window.bioCyber) window.bioCyber.roomCode = pin;
};

window.selectAvatarColor = function(hexColor, btn) {
  document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const human = window.bioCyber && window.bioCyber.players.find(p => p.isHuman);
  if (human && human.group) {
    human.group.traverse(child => {
      if (child.isMesh && child.material && child.material.color) {
        if (child.material.metalness > 0.5) {
          child.material.color.setStyle(hexColor);
        }
      }
    });
  }
};

window.selectGameMode = function(mode) {
  document.querySelectorAll('.team-mode-selector .mode-card').forEach(c => c.classList.remove('selected'));
  const card = document.querySelector(`.team-mode-selector .mode-card[data-mode="${mode}"]`);
  if (card) card.classList.add('selected');
  if (window.bioCyber) window.bioCyber.teamMode = mode;

  const wSlot = document.getElementById('slotWatsonCard');
  const rSlot = document.getElementById('slotRosalindCard');
  if (wSlot) wSlot.style.display = mode === 'solo' ? 'none' : 'flex';
  if (rSlot) rSlot.style.display = mode === 'solo' ? 'none' : 'flex';
};

window.useSkill = function(type) {
  if (window.bioCyber) window.bioCyber.useSkill(type);
};

window.performJump = function() {
  if (window.bioCyber) window.bioCyber.performJump();
};

// Start on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.bioCyber = new BioCyberArena3D();
});

