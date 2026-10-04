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
// 2. Web Audio Synthesizer (Native SFX)
// ==========================================
class SoundFX {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) this.ctx = new AudioContext();
    }
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
    osc.frequency.setValueAtTime(380, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.16);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.16);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(now + 0.16);
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
    osc.frequency.setValueAtTime(65, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.25);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
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
    this.state = 'LOBBY';
    this.playerName = 'CyberBot-01';
    this.roomCode = 'CYBER-774';
    this.teamMode = 'ai';

    this.score = 0;
    this.round = 1;
    this.totalRounds = 8;
    this.currentQuestionIdx = 0;
    this.questionTimeMax = 18;
    this.questionTimer = this.questionTimeMax;

    // Map & Blocks (Wider 11x11 Cyber Island)
    this.gridSize = 11;
    this.blockSize = 3.6;
    this.blocks = [];

    // 4 Answer Pads & 3D Holographic Billboards
    this.answerPads = [];

    // Players & 3D Voxel Models
    this.players = [];
    this.tetherRopes = [];
    this.tetherRestLength = 5.5;
    this.tetherStiffness = 0.07;
    this.yankCooldown = 0;

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
    this.build3DDecorations();
    this.build3DPlayers();
    this.loadQuestion(0);

    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.gameLoop(t));
  }

  initThreeJS() {
    const container = document.getElementById('threeContainer');
    this.scene = new THREE.Scene();
    
    const theme = ARENA_THEMES[this.currentTheme] || ARENA_THEMES.sakura;
    this.scene.background = new THREE.Color(theme.bg);
    this.scene.fog = new THREE.FogExp2(theme.fog, theme.fogDensity);

    // Wide Isometric Camera
    const aspect = (window.innerWidth || 1200) / (window.innerHeight || 800);
    this.camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 1000);
    this.camera.position.set(0, 36, 44);
    this.camera.lookAt(0, 0, 0);

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
    window.addEventListener('keydown', (e) => {
      this.sfx.init();
      if (e.code === 'KeyW' || e.code === 'ArrowUp') this.keys.up = true;
      if (e.code === 'KeyS' || e.code === 'ArrowDown') this.keys.down = true;
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') this.keys.left = true;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') this.keys.right = true;
      if (e.code === 'Space') {
        this.keys.space = true;
        if (this.state === 'RESCUE') {
          this.performRescuePull();
        } else if (this.state === 'PLAYING') {
          this.performTetherYank(0);
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'KeyW' || e.code === 'ArrowUp') this.keys.up = false;
      if (e.code === 'KeyS' || e.code === 'ArrowDown') this.keys.down = false;
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') this.keys.left = false;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') this.keys.right = false;
      if (e.code === 'Space') this.keys.space = false;
    });

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
    const roomInput = document.getElementById('roomCodeInput');

    const modeCards = document.querySelectorAll('.mode-card');
    modeCards.forEach(card => {
      card.addEventListener('click', () => {
        modeCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this.teamMode = card.getAttribute('data-mode');
      });
    });

    if (startBtn && lobbyOverlay) {
      startBtn.addEventListener('click', () => {
        this.sfx.init();
        this.playerName = nameInput.value.trim() || 'CyberBot-01';
        this.roomCode = roomInput.value.trim() || 'CYBER-774';
        
        const roomBadge = document.getElementById('roomBadge');
        if (roomBadge) roomBadge.innerText = this.roomCode;

        lobbyOverlay.classList.add('hidden');
        this.startNewGame();
      });
    }
  }

  startNewGame() {
    this.state = 'PLAYING';
    this.score = 0;
    this.round = 1;
    this.currentQuestionIdx = 0;
    this.questionTimer = this.questionTimeMax;

    this.buildWidePlatformGrid();
    this.build3DAnswerPads();
    this.build3DDecorations();
    this.build3DPlayers();
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
  // 5. 3D Answer Pads with Floating Billboards
  // ==========================================
  build3DAnswerPads() {
    this.answerPads.forEach(pad => {
      this.scene.remove(pad.group);
      if (pad.billboardTexture) pad.billboardTexture.dispose();
    });
    this.answerPads = [];

    const theme = ARENA_THEMES[this.currentTheme];
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
      const podiumGeo = new THREE.CylinderGeometry(2.4, 2.7, 0.8, 20);
      const podiumMat = new THREE.MeshStandardMaterial({ color: theme.padPodium, roughness: 0.2, metalness: 0.9 });
      const podium = new THREE.Mesh(podiumGeo, podiumMat);
      podium.receiveShadow = true;
      group.add(podium);

      // Glowing Outer Hologram Ring
      const torusGeo = new THREE.TorusGeometry(2.6, 0.08, 8, 32);
      const torusMat = new THREE.MeshBasicMaterial({ color: theme.padRing });
      const torus = new THREE.Mesh(torusGeo, torusMat);
      torus.rotation.x = Math.PI / 2;
      torus.position.y = 0.45;
      group.add(torus);

      // 3D In-World Floating Hologram Billboard (Canvas Texture with Full Choice Text)
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 256;
      const texture = new THREE.CanvasTexture(canvas);

      const billboardGeo = new THREE.PlaneGeometry(5.2, 2.6);
      const billboardMat = new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide });
      const billboard = new THREE.Mesh(billboardGeo, billboardMat);
      billboard.position.set(0, 3.2, 0);
      group.add(billboard);

      this.scene.add(group);

      this.answerPads.push({
        id: pos.id,
        x: pos.x,
        z: pos.z,
        radius: 2.7,
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
    ctx.clearRect(0, 0, 512, 256);
    const theme = ARENA_THEMES[this.currentTheme] || ARENA_THEMES.sakura;

    // Theme Glass Gradient Background
    ctx.fillStyle = theme.billboardBg || 'rgba(28, 12, 34, 0.92)';
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(10, 10, 492, 236, 24);
      ctx.fill();
      ctx.strokeStyle = theme.billboardBorder || '#ffffff';
      ctx.lineWidth = 4;
      ctx.stroke();
    } else {
      ctx.fillRect(10, 10, 492, 236);
      ctx.strokeStyle = theme.billboardBorder || '#ffffff';
      ctx.lineWidth = 4;
      ctx.strokeRect(10, 10, 492, 236);
    }

    // Choice Badge [A]
    ctx.fillStyle = theme.billboardBadge || '#ff70a6';
    ctx.beginPath();
    ctx.arc(65, 80, 36, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = theme.billboardBadgeText || '#ffffff';
    ctx.font = '800 40px Prompt, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(choiceLetter, 65, 82);

    // Choice Text (Academic biological term)
    ctx.fillStyle = theme.billboardText || '#ffffff';
    ctx.font = '700 30px Prompt, sans-serif';
    ctx.textAlign = 'left';
    const textStr = String(choiceText || '');
    ctx.fillText(textStr.length > 22 ? textStr.substring(0, 22) + '...' : textStr, 115, 80);

    // Sub-caption
    ctx.fillStyle = '#d4d4d8';
    ctx.font = '500 20px Prompt, sans-serif';
    ctx.fillText('แท่นตัวเลือก 3 มิติ · วิ่งมาเหยียบ', 115, 150);

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
        radius: 1.1,
        status: 'SAFE',
        slowTimer: 0,
        targetPad: null,
        yankTimer: Math.random() * 5 + 3
      };
    };

    this.players.push(createDetailedCyberBot(this.playerName, 0xffffff, true, new THREE.Vector3(-2, 0.8, 0)));

    if (this.teamMode === 'ai') {
      this.players.push(createDetailedCyberBot('Dr. Watson (AI)', 0xd4d4d8, false, new THREE.Vector3(2, 0.8, -1.8)));
      this.players.push(createDetailedCyberBot('Prof. Rosalind (AI)', 0xa1a1aa, false, new THREE.Vector3(0, 0.8, 2.2)));
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
      });
    }

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

      if (this.questionTimer <= 5) {
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
          // Floating lanterns ascending gently to the sky
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

    // Billboard orientation facing camera
    this.answerPads.forEach(pad => {
      if (pad.billboard) {
        pad.billboard.quaternion.copy(this.camera.quaternion);
      }
    });
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
    this.players.forEach((p, idx) => {
      if (p.status === 'FALLING' || p.status === 'LOST') return;

      const speed = baseSpeed;

      if (p.isHuman) {
        let moveX = 0;
        let moveZ = 0;
        if (this.keys.up) moveZ -= 1;
        if (this.keys.down) moveZ += 1;
        if (this.keys.left) moveX -= 1;
        if (this.keys.right) moveX += 1;

        if (moveX !== 0 && moveZ !== 0) {
          moveX *= 0.7071;
          moveZ *= 0.7071;
        }

        p.vx += moveX * speed * dt * 5;
        p.vz += moveZ * speed * dt * 5;
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
      if (b.alive && b.dist > 3.2) {
        b.shakeTimer += dt;
        b.mesh.position.x = b.x + Math.sin(b.shakeTimer * 25) * 0.14;
        b.mesh.position.z = b.z + Math.cos(b.shakeTimer * 25) * 0.14;

        if (b.shakeTimer > 3.0) {
          b.alive = false;
          b.isFalling = true;
          b.fallVelocity = 3;
          b.rotSpeed = {
            x: (Math.random() - 0.5) * 4,
            y: (Math.random() - 0.5) * 4,
            z: (Math.random() - 0.5) * 4
          };
          this.sfx.playCrumble();
        }
      }
    });
  }

  update3DFallingBlocks(dt) {
    this.blocks.forEach(b => {
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
      this.score += 100 * this.round;

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

// Start on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.bioCyber = new BioCyberArena3D();
});

