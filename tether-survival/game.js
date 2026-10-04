/**
 * CYTOLIFE: Bio-Tether Survival Arena
 * Pure Canvas 2D Engine with Elastic Tether Physics, Dynamic Crumbling Floor Grid,
 * Sky Debuff Hazards, Tactical Tether Yanking, Room Co-op & Emergency Rescue QTE
 */

// ==========================================
// 1. Biology Question Bank (Campbell & สสวท.)
// ==========================================
const BIOLOGY_QUESTIONS = [
  {
    topic: 'Gene Expression',
    question: 'กระบวนการถอดรหัส (Transcription) ในยูแคริโอตสังเคราะห์ mRNA จากสายแม่แบบโดยเอนไซม์ใด?',
    choices: [
      { id: 'A', text: 'RNA Polymerase II', correct: true },
      { id: 'B', text: 'DNA Helicase', correct: false },
      { id: 'C', text: 'DNA Polymerase III', correct: false },
      { id: 'D', text: 'RNA Primase', correct: false }
    ],
    explanation: 'RNA Polymerase II ทำหน้าที่หลักในการถอดรหัสยีนที่กำหนดรหัสโปรตีนให้เป็นสาย pre-mRNA'
  },
  {
    topic: 'Gene Regulation',
    question: 'ใน Lac Operon ของแบคทีเรีย E. coli สารใดทำหน้าที่เป็น Inducer เข้าจับกับ Repressor Protein?',
    choices: [
      { id: 'A', text: 'Glucose', correct: false },
      { id: 'B', text: 'Allolactose', correct: true },
      { id: 'C', text: 'Tryptophan', correct: false },
      { id: 'D', text: 'cAMP', correct: false }
    ],
    explanation: 'Allolactose (อนุพันธ์ของ Lactose) จับกับ Lac Repressor ทำให้เปลี่ยนรูปและหลุดออกจาก Operator'
  },
  {
    topic: 'Cell Signaling',
    question: 'เมื่อฮอร์โมนจับกับ G-Protein Coupled Receptor (GPCR) โมเลกุลใดถูกเปลี่ยนเพื่อกระตุ้น G-Protein?',
    choices: [
      { id: 'A', text: 'ATP เป็น ADP', correct: false },
      { id: 'B', text: 'GDP ถูกแทนที่ด้วย GTP', correct: true },
      { id: 'C', text: 'cAMP เป็น AMP', correct: false },
      { id: 'D', text: 'IP3 เป็น DAG', correct: false }
    ],
    explanation: 'เมื่อ GPCR ถูกกระตุ้น จะทำหน้าที่เป็น GEF ทำให้ G-alpha ปลดปล่อย GDP แล้วจับ GTP เข้ามาแทน'
  },
  {
    topic: 'Apoptosis',
    question: 'โปรตีนใดที่รั่วไหลออกจาก Mitochondria เข้าสู่ไซโทซอลเพื่อกระตุ้น Apoptosome และ Caspase Cascade?',
    choices: [
      { id: 'A', text: 'Cytochrome c', correct: true },
      { id: 'B', text: 'Hemoglobin', correct: false },
      { id: 'C', text: 'ATP Synthase', correct: false },
      { id: 'D', text: 'Ubiquitin', correct: false }
    ],
    explanation: 'Cytochrome c เมื่อหลุดจาก Intermembrane space จะจับกับ Apaf-1 ก่อตัวเป็น Apoptosome กระตุ้น Procaspase-9'
  },
  {
    topic: 'Cell Cycle',
    question: 'โปรตีนพิทักษ์จีโนม (Guardian of the Genome) ที่สั่งระงับวัฏจักรเซลล์ที่ G1/S เมื่อ DNA เสียหายคือข้อใด?',
    choices: [
      { id: 'A', text: 'p53 Tumor Suppressor', correct: true },
      { id: 'B', text: 'Cyclin B', correct: false },
      { id: 'C', text: 'Cohesin', correct: false },
      { id: 'D', text: 'DNA Ligase', correct: false }
    ],
    explanation: 'p53 กระตุ้นการถอดรหัส p21 (CDK inhibitor) เพื่อหยุดวัฏจักรเซลล์ให้ซ่อมแซม DNA หรือสั่งทำลายเซลล์หากเสียหายรุนแรง'
  },
  {
    topic: 'Bio-Energetics',
    question: 'แรงขับเคลื่อนโปรตอน (Proton Motive Force) ที่ใช้สังเคราะห์ ATP ในไมโทคอนเดรียเกิดจากความต่างของอะไร?',
    choices: [
      { id: 'A', text: 'ความเข้มข้นกลูโคส', correct: false },
      { id: 'B', text: 'ความเข้มข้น H⁺ ข้ามเยื่อชั้นใน', correct: true },
      { id: 'C', text: 'ปริมาณ Na⁺/K⁺ ปั๊ม', correct: false },
      { id: 'D', text: 'ความดันออสโมติกของน้ำ', correct: false }
    ],
    explanation: 'Complex I, III, IV ปั๊ม H⁺ ไปสะสมใน Intermembrane Space สร้างความต่างศักย์เคมีไฟฟ้าเพื่อหมุน ATP Synthase'
  },
  {
    topic: 'Cytoskeleton',
    question: 'โครงสร้างไซโทสเกเลตันชนิดใดทำหน้าที่เป็นเส้นใย Spindle Fiber แยกโครโมโซมในระยะ Anaphase?',
    choices: [
      { id: 'A', text: 'Microtubules (Tubulin)', correct: true },
      { id: 'B', text: 'Microfilaments (Actin)', correct: false },
      { id: 'C', text: 'Intermediate Filaments', correct: false },
      { id: 'D', text: 'Keratin Fibers', correct: false }
    ],
    explanation: 'Spindle fibers ประกอบด้วยสาย Microtubules สร้างจากโปรตีน Tubulin ดึง Kinetochore ของโครโมโซม'
  },
  {
    topic: 'Cellular Transport',
    question: 'Sodium-Potassium Pump (Na⁺/K⁺ ATPase) ปั๊มไอออนในอัตราส่วนและทิศทางใดต่อ 1 ATP?',
    choices: [
      { id: 'A', text: '3 Na⁺ ออกนอกเซลล์, 2 K⁺ เข้าสู่เซลล์', correct: true },
      { id: 'B', text: '2 Na⁺ ออกนอกเซลล์, 3 K⁺ เข้าสู่เซลล์', correct: false },
      { id: 'C', text: '3 Na⁺ เข้าสู่เซลล์, 3 K⁺ ออกนอกเซลล์', correct: false },
      { id: 'D', text: '1 Na⁺ ออกนอกเซลล์, 1 K⁺ เข้าสู่เซลล์', correct: false }
    ],
    explanation: 'Na⁺/K⁺ pump ใช้พลังงาน ATP ปั๊ม 3 Na⁺ ออกนอกเซลล์ และนำ 2 K⁺ เข้าสู่เซลล์ รักษา Resting Potential'
  }
];

// ==========================================
// 2. Web Audio Synthesizer (Pure Native SFX)
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
    osc.frequency.setValueAtTime(220, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  playYank() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.18);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.18);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(now + 0.18);
  }

  playDebuffHit() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(500, now);
    osc.frequency.linearRampToValueAtTime(100, now + 0.3);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(now + 0.3);
  }

  playCorrect() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.15, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.3);
    });
  }

  playWrong() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.linearRampToValueAtTime(80, now + 0.4);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.4);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.4);
  }

  playCrumble() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(60, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.3);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  }

  playRescue() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.linearRampToValueAtTime(880, now + 0.25);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  }
}

// ==========================================
// 3. Main Arena Engine
// ==========================================
class BioTetherGame {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.sfx = new SoundFX();

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.resizeCanvas();

    // Game state
    this.state = 'LOBBY'; // LOBBY, PLAYING, RESCUE, GAMEOVER, VICTORY
    this.playerName = 'Player 1';
    this.roomCode = 'ROOM-774';
    this.teamMode = 'ai'; // 'ai' or 'solo'

    this.score = 0;
    this.round = 1;
    this.totalRounds = 8;
    this.currentQuestionIdx = 0;
    this.questionTimeMax = 18;
    this.questionTimer = this.questionTimeMax;

    // Platform & Floor grid (Crumbling platform)
    this.platformCenter = { x: this.width / 2, y: this.height / 2 + 40 };
    this.gridSize = 7;
    this.tileSize = 64;
    this.tiles = [];

    // Answer Pads (4 Zones: A, B, C, D)
    this.answerPads = [];

    // Players & Teammates tethered together
    this.players = [];
    this.tetherRestLength = 85;
    this.tetherStiffness = 0.055;
    this.yankCooldown = 0;

    // Falling / Rescue Event
    this.fallenPlayer = null;
    this.rescueProgress = 0;
    this.rescueTarget = 100;
    this.rescueTimer = 8.5;

    // Sky Debuffs System
    this.debuffs = [];
    this.debuffSpawnTimer = 3.5;
    this.floatingTexts = [];

    // Input keys
    this.keys = {
      up: false,
      down: false,
      left: false,
      right: false,
      space: false
    };

    // Particle FX
    this.particles = [];

    // Bindings
    window.addEventListener('resize', () => this.resizeCanvas());
    this.initInputs();
    this.initLobbyUI();
  }

  resizeCanvas() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.platformCenter = { x: this.width / 2, y: this.height / 2 + 40 };
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
          this.performTetherYank(0); // Player 1 yanks
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

    // Touch button handlers
    const bindTouch = (id, key) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('touchstart', (e) => { e.preventDefault(); this.keys[key] = true; });
      el.addEventListener('touchend', (e) => { e.preventDefault(); this.keys[key] = false; });
    };
    bindTouch('btnUp', 'up');
    bindTouch('btnDown', 'down');
    bindTouch('btnLeft', 'left');
    bindTouch('btnRight', 'right');

    const btnAction = document.getElementById('btnAction');
    if (btnAction) {
      btnAction.addEventListener('click', () => {
        this.sfx.init();
        if (this.state === 'RESCUE') {
          this.performRescuePull();
        } else if (this.state === 'PLAYING') {
          this.performTetherYank(0);
        }
      });
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
    const roomInput = document.getElementById('roomCodeInput');

    if (roomInput && !roomInput.value) {
      roomInput.value = 'BIO-' + Math.floor(100 + Math.random() * 900);
    }

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
        this.playerName = nameInput.value.trim() || 'Player 1';
        this.roomCode = roomInput.value.trim() || 'BIO-774';
        
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
    this.debuffs = [];
    this.floatingTexts = [];

    this.initPlatformTiles();
    this.initAnswerPads();
    this.initPlayers();
    this.loadQuestion(0);

    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.gameLoop(t));
  }

  initPlatformTiles() {
    this.tiles = [];
    const half = Math.floor(this.gridSize / 2);
    for (let r = -half; r <= half; r++) {
      for (let c = -half; c <= half; c++) {
        const distFromCenter = Math.sqrt(r * r + c * c);
        if (distFromCenter <= half + 0.4) {
          this.tiles.push({
            r, c,
            x: this.platformCenter.x + c * this.tileSize,
            y: this.platformCenter.y + r * this.tileSize,
            size: this.tileSize - 4,
            dist: distFromCenter,
            alive: true,
            crumbleTimer: 0,
            opacity: 1,
            wobble: 0
          });
        }
      }
    }
  }

  initAnswerPads() {
    const offset = this.tileSize * 2.2;
    this.answerPads = [
      { id: 'A', x: this.platformCenter.x, y: this.platformCenter.y - offset, radius: 36, label: 'A' },
      { id: 'B', x: this.platformCenter.x + offset, y: this.platformCenter.y, radius: 36, label: 'B' },
      { id: 'C', x: this.platformCenter.x, y: this.platformCenter.y + offset, radius: 36, label: 'C' },
      { id: 'D', x: this.platformCenter.x - offset, y: this.platformCenter.y, radius: 36, label: 'D' }
    ];
  }

  initPlayers() {
    this.players = [];
    this.players.push({
      id: 1,
      name: this.playerName,
      isHuman: true,
      x: this.platformCenter.x - 25,
      y: this.platformCenter.y,
      vx: 0,
      vy: 0,
      radius: 14,
      status: 'SAFE',
      color: '#ffffff',
      slowTimer: 0
    });

    if (this.teamMode === 'ai') {
      this.players.push({
        id: 2,
        name: 'Dr. Watson (AI)',
        isHuman: false,
        x: this.platformCenter.x + 25,
        y: this.platformCenter.y - 20,
        vx: 0,
        vy: 0,
        radius: 13,
        status: 'SAFE',
        color: '#d4d4d8',
        targetPad: null,
        slowTimer: 0,
        yankTimer: Math.random() * 4 + 2
      });

      this.players.push({
        id: 3,
        name: 'Prof. Rosalind (AI)',
        isHuman: false,
        x: this.platformCenter.x,
        y: this.platformCenter.y + 30,
        vx: 0,
        vy: 0,
        radius: 13,
        status: 'SAFE',
        color: '#a1a1aa',
        targetPad: null,
        slowTimer: 0,
        yankTimer: Math.random() * 4 + 3
      });
    }

    this.updateTeamUI();
  }

  loadQuestion(idx) {
    this.currentQuestionIdx = idx % BIOLOGY_QUESTIONS.length;
    const q = BIOLOGY_QUESTIONS[this.currentQuestionIdx];
    this.questionTimer = this.questionTimeMax;

    document.getElementById('hudTopic').innerText = `${q.topic} · ข้อที่ ${this.round}/${this.totalRounds}`;
    document.getElementById('hudQuestion').innerText = q.question;

    q.choices.forEach(ch => {
      const el = document.getElementById('choiceText' + ch.id);
      if (el) el.innerText = ch.text;
    });

    this.tiles.forEach(t => {
      if (t.alive && t.dist >= Math.max(1.8, 3.5 - this.round * 0.3)) {
        t.wobble = Math.random() * 5;
      }
    });

    this.players.forEach(p => {
      if (!p.isHuman) {
        const isSmart = Math.random() < 0.85;
        const correctChoice = q.choices.find(c => c.correct).id;
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

      if (this.questionTimer <= 6) {
        this.crumbleOuterTiles(dt);
      }

      if (this.questionTimer <= 0) {
        this.evaluateAnswer();
      }

      // Update Sky Debuffs
      this.updateSkyDebuffs(dt);

      // Update Player Movement & Physics
      this.updatePlayersPhysics(dt);

      // Apply Spring Tether Physics between all alive team members
      this.applyTetherForces();

      // Check if players stepped on crumbling or void area
      this.checkPlayerTileSupport();

      if (this.yankCooldown > 0) this.yankCooldown -= dt;
    } else if (this.state === 'RESCUE') {
      this.updateRescueEvent(dt);
    }

    // Update Floating Text & Particles
    this.updateFloatingTexts(dt);
    this.updateParticles(dt);
  }

  // ==========================================
  // Tactical Tether Yank (กระตุกเชือกแย่งตำแหน่ง)
  // ==========================================
  performTetherYank(playerIdx) {
    if (this.yankCooldown > 0) return;
    this.yankCooldown = 1.2;
    this.sfx.playYank();

    const puller = this.players[playerIdx];
    if (!puller || puller.status !== 'SAFE') return;

    this.spawnFloatingText(puller.x, puller.y - 20, '⚡ TETHER YANK!', '#ffffff');

    // Apply strong impulse force dragging other teammates towards puller
    this.players.forEach((other, i) => {
      if (i !== playerIdx && other.status === 'SAFE') {
        const dx = puller.x - other.x;
        const dy = puller.y - other.y;
        const dist = Math.hypot(dx, dy) || 1;
        const impulse = 320;
        other.vx += (dx / dist) * impulse;
        other.vy += (dy / dist) * impulse;
      }
    });
  }

  // ==========================================
  // Sky Debuffs System (ดีบัพตกจากฟ้า)
  // ==========================================
  updateSkyDebuffs(dt) {
    this.debuffSpawnTimer -= dt;
    if (this.debuffSpawnTimer <= 0) {
      this.debuffSpawnTimer = Math.random() * 3.5 + 2.5;
      this.spawnSkyDebuff();
    }

    for (let i = this.debuffs.length - 1; i >= 0; i--) {
      const d = this.debuffs[i];
      d.altitude -= dt * 260; // falls down from sky

      // When reaching ground (altitude <= 0)
      if (d.altitude <= 0) {
        this.triggerDebuffImpact(d);
        this.debuffs.splice(i, 1);
      }
    }
  }

  spawnSkyDebuff() {
    const types = [
      { name: 'ไซโทพลาสซึมหนืด (Slow)', effect: 'SLOW', color: '#ffffff' },
      { name: 'เวลาบิดเบี้ยว (-3s)', effect: 'TIME', color: '#d4d4d8' },
      { name: 'แรงกระแทกแผ่นดิน (Shock)', effect: 'SHOCK', color: '#a1a1aa' }
    ];
    const picked = types[Math.floor(Math.random() * types.length)];

    // Target random position near center platform
    const targetX = this.platformCenter.x + (Math.random() - 0.5) * (this.tileSize * 4);
    const targetY = this.platformCenter.y + (Math.random() - 0.5) * (this.tileSize * 4);

    this.debuffs.push({
      x: targetX,
      y: targetY,
      altitude: 350,
      radius: 18,
      effect: picked.effect,
      name: picked.name,
      color: picked.color
    });
  }

  triggerDebuffImpact(debuff) {
    this.sfx.playDebuffHit();
    this.spawnTileCrumbleParticles(debuff.x, debuff.y);

    // Check hit players in radius
    this.players.forEach(p => {
      if (p.status !== 'SAFE') return;
      const dist = Math.hypot(p.x - debuff.x, p.y - debuff.y);
      if (dist <= debuff.radius + p.radius + 15) {
        // Hit by debuff!
        if (debuff.effect === 'SLOW') {
          p.slowTimer = 3.5;
          this.spawnFloatingText(p.x, p.y - 20, '❄️ ความเร็วลดลง 65%!', '#ffffff');
        } else if (debuff.effect === 'TIME') {
          this.questionTimer = Math.max(1, this.questionTimer - 3);
          this.spawnFloatingText(p.x, p.y - 20, '⏳ เวลาลดลง -3s!', '#ffffff');
        } else if (debuff.effect === 'SHOCK') {
          // Push player away
          const angle = Math.atan2(p.y - debuff.y, p.x - debuff.x);
          p.vx += Math.cos(angle) * 350;
          p.vy += Math.sin(angle) * 350;
          this.spawnFloatingText(p.x, p.y - 20, '💥 คลื่นกระแทกผลักกระเด็น!', '#ffffff');
        }
      }
    });
  }

  updatePlayersPhysics(dt) {
    const baseSpeed = 260;
    this.players.forEach((p, idx) => {
      if (p.status === 'FALLING' || p.status === 'LOST') return;

      if (p.slowTimer > 0) p.slowTimer -= dt;
      const speed = p.slowTimer > 0 ? baseSpeed * 0.35 : baseSpeed;

      if (p.isHuman) {
        let moveX = 0;
        let moveY = 0;
        if (this.keys.up) moveY -= 1;
        if (this.keys.down) moveY += 1;
        if (this.keys.left) moveX -= 1;
        if (this.keys.right) moveX += 1;

        if (moveX !== 0 && moveY !== 0) {
          moveX *= 0.7071;
          moveY *= 0.7071;
        }

        p.vx += moveX * speed * dt * 5;
        p.vy += moveY * speed * dt * 5;
      } else {
        // AI Teammate movement & tactical yanks
        if (p.targetPad) {
          const dx = p.targetPad.x - p.x;
          const dy = p.targetPad.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 8) {
            p.vx += (dx / dist) * speed * dt * 4;
            p.vy += (dy / dist) * speed * dt * 4;
          }
        }

        p.yankTimer -= dt;
        if (p.yankTimer <= 0) {
          p.yankTimer = Math.random() * 6 + 4;
          this.performTetherYank(idx);
        }
      }

      p.vx *= 0.88;
      p.vy *= 0.88;

      p.x += p.vx * dt;
      p.y += p.vy * dt;
    });
  }

  applyTetherForces() {
    const activePlayers = this.players.filter(p => p.status !== 'LOST');
    if (activePlayers.length < 2) return;

    for (let i = 0; i < activePlayers.length; i++) {
      const p1 = activePlayers[i];
      const p2 = activePlayers[(i + 1) % activePlayers.length];

      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;

      if (dist > this.tetherRestLength) {
        const force = (dist - this.tetherRestLength) * this.tetherStiffness;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;

        if (p1.status === 'SAFE') {
          p1.vx += fx;
          p1.vy += fy;
        }
        if (p2.status === 'SAFE') {
          p2.vx -= fx;
          p2.vy -= fy;
        }
      }
    }
  }

  crumbleOuterTiles(dt) {
    this.tiles.forEach(t => {
      if (t.alive && t.dist > 2.2) {
        t.crumbleTimer += dt;
        t.wobble = Math.sin(t.crumbleTimer * 20) * 4;
        if (t.crumbleTimer > 3.5) {
          t.alive = false;
          this.sfx.playCrumble();
          this.spawnTileCrumbleParticles(t.x, t.y);
        }
      }
    });
  }

  checkPlayerTileSupport() {
    this.players.forEach(p => {
      if (p.status !== 'SAFE') return;

      let onSolidGround = false;
      for (const t of this.tiles) {
        if (t.alive) {
          const half = t.size / 2;
          if (p.x >= t.x - half && p.x <= t.x + half &&
              p.y >= t.y - half && p.y <= t.y + half) {
            onSolidGround = true;
            break;
          }
        }
      }

      if (!onSolidGround) {
        for (const pad of this.answerPads) {
          const dist = Math.hypot(p.x - pad.x, p.y - pad.y);
          if (dist <= pad.radius + 8) {
            onSolidGround = true;
            break;
          }
        }
      }

      if (!onSolidGround) {
        this.triggerTeammateFall(p, 'ก้าวพลาดตกจากแท่นหินที่พังทลาย!');
      }
    });
  }

  evaluateAnswer() {
    const q = BIOLOGY_QUESTIONS[this.currentQuestionIdx];
    const correctPad = this.answerPads.find(pad => {
      const ch = q.choices.find(c => c.id === pad.id);
      return ch && ch.correct;
    });

    const mainPlayer = this.players.find(p => p.isHuman);
    const distToCorrect = Math.hypot(mainPlayer.x - correctPad.x, mainPlayer.y - correctPad.y);
    const isCorrect = distToCorrect <= correctPad.radius + 20;

    if (isCorrect) {
      this.sfx.playCorrect();
      this.score += 100 * this.round;
      this.spawnVictoryBurst(correctPad.x, correctPad.y);
      this.spawnFloatingText(correctPad.x, correctPad.y - 30, '+100 PTS! ถูกต้อง', '#ffffff');

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
        this.triggerTeammateFall(victim, `ตอบผิด! แรงสั่นสะเทือนทำให้ ${victim.name} ร่วงลงสู่ขอบเหว!`);
      } else {
        this.showGameOverModal('สมาชิกในทีมทุกคนร่วงหล่นลงสู่อเวจี!');
      }
    }
  }

  triggerTeammateFall(player, reason) {
    if (this.state === 'RESCUE') return;
    player.status = 'FALLING';
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
      titleEl.innerText = `⚠️ ${player.name} กำลังจะร่วงตกเหว!`;
      subEl.innerText = `${reason} ทุกคนต้องช่วยกันดึงเชือกกู้ชีพขึ้นมาด่วน!`;
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
      this.fallenPlayer.x = this.platformCenter.x;
      this.fallenPlayer.y = this.platformCenter.y;
      this.fallenPlayer.vx = 0;
      this.fallenPlayer.vy = 0;
      this.spawnFloatingText(this.platformCenter.x, this.platformCenter.y - 30, '🎉 ช่วยเพื่อนสำเร็จ!', '#ffffff');
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
      this.spawnTileCrumbleParticles(this.fallenPlayer.x, this.fallenPlayer.y);
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
          ${p.status === 'SAFE' ? 'ปลอดภัย' : (p.status === 'FALLING' ? 'กำลังตก!' : 'เสียชีวิต')}
        </div>
      `;
      list.appendChild(row);
    });
  }

  spawnFloatingText(x, y, text, color) {
    this.floatingTexts.push({
      x, y,
      text,
      color,
      life: 1.2,
      vy: -35
    });
  }

  updateFloatingTexts(dt) {
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y += ft.vy * dt;
      ft.life -= dt;
      if (ft.life <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }
  }

  // ==========================================
  // 4. Render Engine
  // ==========================================
  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    this.drawBackgroundAbyss();
    this.drawPlatformTiles();
    this.drawAnswerPads();
    this.drawSkyDebuffs();
    this.drawTetherRopes();
    this.drawPlayers();
    this.drawFloatingTexts();
    this.drawParticles();
  }

  drawBackgroundAbyss() {
    this.ctx.save();
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    this.ctx.lineWidth = 1;
    for (let r = 80; r <= 380; r += 60) {
      this.ctx.beginPath();
      this.ctx.arc(this.platformCenter.x, this.platformCenter.y, r, 0, Math.PI * 2);
      this.ctx.stroke();
    }
    this.ctx.restore();
  }

  drawPlatformTiles() {
    this.ctx.save();
    this.tiles.forEach(t => {
      if (!t.alive) return;
      this.ctx.save();
      this.ctx.translate(t.x + (t.wobble || 0), t.y);

      this.ctx.fillStyle = '#141418';
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
      this.ctx.lineWidth = 1.5;

      const half = t.size / 2;
      this.ctx.beginPath();
      this.ctx.roundRect(-half, -half, t.size, t.size, 6);
      this.ctx.fill();
      this.ctx.stroke();

      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      this.ctx.beginPath();
      this.ctx.arc(0, 0, half * 0.4, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.restore();
    });
    this.ctx.restore();
  }

  drawAnswerPads() {
    this.answerPads.forEach(pad => {
      this.ctx.save();
      this.ctx.translate(pad.x, pad.y);

      this.ctx.beginPath();
      this.ctx.arc(0, 0, pad.radius + 6, 0, Math.PI * 2);
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.arc(0, 0, pad.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = '#000000';
      this.ctx.fill();
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = 2.5;
      this.ctx.stroke();

      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = '700 20px Prompt';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(pad.label, 0, 1);

      this.ctx.restore();
    });
  }

  drawSkyDebuffs() {
    this.debuffs.forEach(d => {
      this.ctx.save();

      // Shadow on ground
      const shadowScale = Math.max(0.3, 1 - d.altitude / 350);
      this.ctx.beginPath();
      this.ctx.ellipse(d.x, d.y, d.radius * shadowScale, d.radius * 0.5 * shadowScale, 0, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 255, 255, ${shadowScale * 0.35})`;
      this.ctx.fill();

      // Falling Debuff Spore in Sky
      const renderY = d.y - d.altitude;
      this.ctx.beginPath();
      this.ctx.arc(d.x, renderY, d.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = d.color;
      this.ctx.fill();
      this.ctx.strokeStyle = '#000000';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();

      // Warning Symbol
      this.ctx.fillStyle = '#000000';
      this.ctx.font = '800 12px Prompt';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText('⚡', d.x, renderY);

      this.ctx.restore();
    });
  }

  drawTetherRopes() {
    const activePlayers = this.players.filter(p => p.status !== 'LOST');
    if (activePlayers.length < 2) return;

    this.ctx.save();
    for (let i = 0; i < activePlayers.length; i++) {
      const p1 = activePlayers[i];
      const p2 = activePlayers[(i + 1) % activePlayers.length];

      const midX = (p1.x + p2.x) / 2;
      const midY = (p1.y + p2.y) / 2 + (this.yankCooldown > 0 ? -12 : 8);

      this.ctx.strokeStyle = p1.status === 'FALLING' || p2.status === 'FALLING' ? '#ffffff' : 'rgba(255, 255, 255, 0.7)';
      this.ctx.lineWidth = this.yankCooldown > 0 ? 3.5 : 2.2;
      this.ctx.setLineDash(p1.status === 'FALLING' || p2.status === 'FALLING' ? [4, 4] : []);

      this.ctx.beginPath();
      this.ctx.moveTo(p1.x, p1.y);
      this.ctx.quadraticCurveTo(midX, midY, p2.x, p2.y);
      this.ctx.stroke();
    }
    this.ctx.restore();
  }

  drawPlayers() {
    this.players.forEach(p => {
      if (p.status === 'LOST') return;

      this.ctx.save();
      this.ctx.translate(p.x, p.y);

      if (p.status === 'FALLING') {
        this.ctx.scale(0.8, 0.8);
        this.ctx.globalAlpha = 0.7;
      }

      this.ctx.beginPath();
      this.ctx.arc(0, 4, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      this.ctx.fill();

      this.ctx.beginPath();
      this.ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = p.slowTimer > 0 ? '#71717a' : p.color;
      this.ctx.fill();
      this.ctx.strokeStyle = '#000000';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.arc(0, 0, p.radius * 0.45, 0, Math.PI * 2);
      this.ctx.fillStyle = '#000000';
      this.ctx.fill();

      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = '600 11px Prompt';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(p.name, 0, -p.radius - 8);

      this.ctx.restore();
    });
  }

  drawFloatingTexts() {
    this.ctx.save();
    this.floatingTexts.forEach(ft => {
      this.ctx.fillStyle = ft.color;
      this.ctx.font = '700 13px Prompt';
      this.ctx.textAlign = 'center';
      this.ctx.globalAlpha = Math.min(1, ft.life);
      this.ctx.fillText(ft.text, ft.x, ft.y);
    });
    this.ctx.restore();
  }

  spawnTileCrumbleParticles(x, y) {
    for (let i = 0; i < 16; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 30,
        y: y + (Math.random() - 0.5) * 30,
        vx: (Math.random() - 0.5) * 80,
        vy: Math.random() * 80 + 30,
        size: Math.random() * 5 + 2,
        life: 1,
        decay: Math.random() * 1.5 + 0.8
      });
    }
  }

  spawnVictoryBurst(x, y) {
    for (let i = 0; i < 28; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = Math.random() * 120 + 40;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        size: Math.random() * 4 + 2,
        life: 1,
        decay: 1.2
      });
    }
  }

  updateParticles(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const pt = this.particles[i];
      pt.x += pt.vx * dt;
      pt.y += pt.vy * dt;
      pt.life -= pt.decay * dt;
      if (pt.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  drawParticles() {
    this.ctx.save();
    this.particles.forEach(pt => {
      this.ctx.fillStyle = `rgba(255, 255, 255, ${pt.life})`;
      this.ctx.fillRect(pt.x, pt.y, pt.size, pt.size);
    });
    this.ctx.restore();
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

// Start on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.bioTether = new BioTetherGame();
});
