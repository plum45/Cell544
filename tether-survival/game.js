/**
 * CYTOLIFE: 3D Cyber Tether Arena
 * Full 3D WebGL (Three.js) Isometric Cyber Voxel Engine
 * - 3D Crumbling Cyber Blocks that fall into the abyss
 * - 3D Voxel Cyber Bots with glowing visors
 * - Dynamic 3D Physics Elastic Tether Cables
 * - 3D Sky Glitch Debuff Cubes & Impact Waves
 * - Tactical Tether Yank & 3D Emergency Rescue QTE
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
    osc.frequency.setValueAtTime(260, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(520, this.ctx.currentTime + 0.1);
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
    osc.frequency.setValueAtTime(360, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.18);
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
    osc.frequency.setValueAtTime(550, now);
    osc.frequency.linearRampToValueAtTime(120, now + 0.3);
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
    osc.frequency.setValueAtTime(65, now);
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
// 3. Three.js 3D Cyber Voxel Engine
// ==========================================
class BioTether3DGame {
  constructor() {
    this.sfx = new SoundFX();

    // Game state
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

    // Platform settings
    this.gridSize = 7; // 7x7 3D Cubes
    this.blockSize = 3.2;
    this.blocks = [];

    // 3D Answer Pads (A, B, C, D)
    this.answerPads = [];

    // 3D Players & Teammates
    this.players = [];
    this.tetherRopes = [];
    this.tetherRestLength = 4.2;
    this.tetherStiffness = 0.08;
    this.yankCooldown = 0;

    // Falling / Rescue Event
    this.fallenPlayer = null;
    this.rescueProgress = 0;
    this.rescueTarget = 100;
    this.rescueTimer = 8.5;

    // 3D Sky Debuffs
    this.skyDebuffs = [];
    this.debuffSpawnTimer = 3.5;

    // Input keys
    this.keys = {
      up: false,
      down: false,
      left: false,
      right: false,
      space: false
    };

    this.initThreeJS();
    this.initInputs();
    this.initLobbyUI();
  }

  initThreeJS() {
    const container = document.getElementById('threeContainer');
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x050508);
    this.scene.fog = new THREE.FogExp2(0x050508, 0.018);

    // Isometric Camera setup
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    this.camera.position.set(0, 24, 28);
    this.camera.lookAt(0, 0, 0);

    // WebGL Renderer with antialiasing
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);

    // Ambient & Directional Titanium Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.85);
    dirLight.position.set(15, 30, 20);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    this.scene.add(dirLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.5, 40);
    pointLight.position.set(0, 10, 0);
    this.scene.add(pointLight);

    // Deep Abyss Grid Floor
    const gridHelper = new THREE.GridHelper(80, 40, 0x333333, 0x111111);
    gridHelper.position.y = -18;
    this.scene.add(gridHelper);

    window.addEventListener('resize', () => this.onWindowResize());
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
      roomInput.value = 'CYBER-' + Math.floor(100 + Math.random() * 900);
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

    this.build3DPlatformGrid();
    this.build3DAnswerPads();
    this.build3DPlayers();
    this.loadQuestion(0);

    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.gameLoop(t));
  }

  // ==========================================
  // 4. Build 3D Voxel Cyber Grid Platform
  // ==========================================
  build3DPlatformGrid() {
    // Clear old blocks if any
    this.blocks.forEach(b => this.scene.remove(b.mesh));
    this.blocks = [];

    const half = Math.floor(this.gridSize / 2);
    const boxGeo = new THREE.BoxGeometry(this.blockSize * 0.94, 1.2, this.blockSize * 0.94);
    const edgeGeo = new THREE.EdgesGeometry(boxGeo);

    for (let r = -half; r <= half; r++) {
      for (let c = -half; c <= half; c++) {
        const dist = Math.sqrt(r * r + c * c);
        if (dist <= half + 0.35) {
          // Cyber Titanium Material
          const mat = new THREE.MeshStandardMaterial({
            color: 0x18181c,
            roughness: 0.3,
            metalness: 0.8
          });

          const mesh = new THREE.Mesh(boxGeo, mat);
          mesh.position.set(c * this.blockSize, 0, r * this.blockSize);
          mesh.castShadow = true;
          mesh.receiveShadow = true;

          // Glowing Wireframe Edges
          const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35 });
          const wireframe = new THREE.LineSegments(edgeGeo, lineMat);
          mesh.add(wireframe);

          this.scene.add(mesh);

          this.blocks.push({
            r, c,
            x: mesh.position.x,
            z: mesh.position.z,
            dist,
            mesh,
            wireframe,
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

  build3DAnswerPads() {
    this.answerPads.forEach(pad => this.scene.remove(pad.group));
    this.answerPads = [];

    const offset = this.blockSize * 2.35;
    const padPositions = [
      { id: 'A', x: 0, z: -offset, label: 'A' },
      { id: 'B', x: offset, z: 0, label: 'B' },
      { id: 'C', x: 0, z: offset, label: 'C' },
      { id: 'D', x: -offset, z: 0, label: 'D' }
    ];

    padPositions.forEach(pos => {
      const group = new THREE.Group();
      group.position.set(pos.x, 0.7, pos.z);

      // Raised 3D Cyber Pillar
      const cylinderGeo = new THREE.CylinderGeometry(1.5, 1.7, 0.6, 16);
      const cylinderMat = new THREE.MeshStandardMaterial({
        color: 0x0a0a0c,
        roughness: 0.2,
        metalness: 0.9
      });
      const cylinder = new THREE.Mesh(cylinderGeo, cylinderMat);
      cylinder.receiveShadow = true;
      group.add(cylinder);

      // Glowing Hologram Ring
      const torusGeo = new THREE.TorusGeometry(1.6, 0.06, 8, 24);
      const torusMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const torus = new THREE.Mesh(torusGeo, torusMat);
      torus.rotation.x = Math.PI / 2;
      torus.position.y = 0.35;
      group.add(torus);

      // 3D Choice Letter Marker (Floating Cube with Badge)
      const badgeGeo = new THREE.BoxGeometry(0.9, 0.9, 0.9);
      const badgeMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.1,
        metalness: 0.5
      });
      const badge = new THREE.Mesh(badgeGeo, badgeMat);
      badge.position.y = 1.6;
      group.add(badge);

      this.scene.add(group);

      this.answerPads.push({
        id: pos.id,
        x: pos.x,
        z: pos.z,
        radius: 1.8,
        group,
        badge
      });
    });
  }

  build3DPlayers() {
    this.players.forEach(p => this.scene.remove(p.group));
    this.players = [];

    // Helper to create a 3D Voxel Cyber Bot
    const createVoxelBot = (name, color, isHuman, startPos) => {
      const group = new THREE.Group();
      group.position.copy(startPos);

      // Head Voxel
      const headGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
      const headMat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.3, metalness: 0.7 });
      const head = new THREE.Mesh(headGeo, headMat);
      head.position.y = 1.7;
      head.castShadow = true;
      group.add(head);

      // Glowing Cyber Visor
      const visorGeo = new THREE.BoxGeometry(0.65, 0.25, 0.2);
      const visorMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const visor = new THREE.Mesh(visorGeo, visorMat);
      visor.position.set(0, 1.75, 0.38);
      group.add(visor);

      // Torso Voxel
      const bodyGeo = new THREE.BoxGeometry(1.0, 1.1, 0.7);
      const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1e, roughness: 0.4, metalness: 0.8 });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.position.y = 0.9;
      body.castShadow = true;
      group.add(body);

      // Jetpack / Tether Core
      const coreGeo = new THREE.BoxGeometry(0.4, 0.4, 0.4);
      const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const core = new THREE.Mesh(coreGeo, coreMat);
      core.position.set(0, 1.0, -0.4);
      group.add(core);

      this.scene.add(group);

      return {
        name,
        isHuman,
        group,
        vx: 0,
        vz: 0,
        radius: 0.9,
        status: 'SAFE',
        slowTimer: 0,
        targetPad: null,
        yankTimer: Math.random() * 5 + 3
      };
    };

    // Player 1 (Main user)
    this.players.push(createVoxelBot(this.playerName, 0xffffff, true, new THREE.Vector3(-1.5, 0.6, 0)));

    if (this.teamMode === 'ai') {
      this.players.push(createVoxelBot('Dr. Watson (AI)', 0xd4d4d8, false, new THREE.Vector3(1.5, 0.6, -1.2)));
      this.players.push(createVoxelBot('Prof. Rosalind (AI)', 0xa1a1aa, false, new THREE.Vector3(0, 0.6, 1.8)));
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

      // Dynamic 3D Laser Tube / Line
      const points = [p1.group.position, p2.group.position];
      const curve = new THREE.CatmullRomCurve3(points);
      const tubeGeo = new THREE.TubeGeometry(curve, 12, 0.07, 6, false);
      const tubeMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 });
      const line = new THREE.Mesh(tubeGeo, tubeMat);

      this.scene.add(line);
      this.tetherRopes.push({ p1, p2, line, tubeMat });
    }
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

    // Reset crumble shake on outer blocks
    this.blocks.forEach(b => {
      if (b.alive && b.dist >= Math.max(1.8, 3.5 - this.round * 0.3)) {
        b.shakeTimer = 1.0;
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
        this.crumble3DOuterBlocks(dt);
      }

      if (this.questionTimer <= 0) {
        this.evaluateAnswer();
      }

      this.updateSkyGlitchDebuffs(dt);
      this.update3DPlayersPhysics(dt);
      this.apply3DTetherSpringForces();
      this.checkPlayerBlockSupport();

      if (this.yankCooldown > 0) this.yankCooldown -= dt;
    } else if (this.state === 'RESCUE') {
      this.updateRescueEvent(dt);
    }

    // Animate 3D Falling Blocks
    this.update3DFallingBlocks(dt);

    // Update 3D Tether Rope Curves
    this.update3DTetherRopeGeometry();

    // Rotate holographic badges
    this.answerPads.forEach((pad, i) => {
      if (pad.badge) {
        pad.badge.rotation.y += 0.03;
        pad.badge.position.y = 1.6 + Math.sin(Date.now() * 0.003 + i) * 0.15;
      }
    });
  }

  // ==========================================
  // Tactical 3D Tether Yank (กระตุกเชือก 3 มิติ)
  // ==========================================
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
        const impulse = 18;
        other.vx += (dx / dist) * impulse;
        other.vz += (dz / dist) * impulse;
      }
    });
  }

  // ==========================================
  // 3D Sky Glitch Debuffs (ดีบัพลูกบาศก์ 3D ตกจากฟ้า)
  // ==========================================
  updateSkyGlitchDebuffs(dt) {
    this.debuffSpawnTimer -= dt;
    if (this.debuffSpawnTimer <= 0) {
      this.debuffSpawnTimer = Math.random() * 3.5 + 2.5;
      this.spawn3DSkyDebuff();
    }

    for (let i = this.skyDebuffs.length - 1; i >= 0; i--) {
      const d = this.skyDebuffs[i];
      d.mesh.position.y -= dt * 18; // falls down
      d.mesh.rotation.x += dt * 3;
      d.mesh.rotation.y += dt * 4;

      if (d.mesh.position.y <= 0.8) {
        this.trigger3DDebuffImpact(d);
        this.scene.remove(d.mesh);
        this.scene.remove(d.shadow);
        this.skyDebuffs.splice(i, 1);
      }
    }
  }

  spawn3DSkyDebuff() {
    const types = [
      { name: 'SLOW', color: 0xffffff },
      { name: 'TIME', color: 0xd4d4d8 },
      { name: 'SHOCK', color: 0xa1a1aa }
    ];
    const picked = types[Math.floor(Math.random() * types.length)];

    const targetX = (Math.random() - 0.5) * (this.blockSize * 3.8);
    const targetZ = (Math.random() - 0.5) * (this.blockSize * 3.8);

    // 3D Glitch Cube
    const cubeGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const cubeMat = new THREE.MeshStandardMaterial({
      color: picked.color,
      roughness: 0.2,
      metalness: 0.9,
      emissive: 0x444444
    });
    const mesh = new THREE.Mesh(cubeGeo, cubeMat);
    mesh.position.set(targetX, 22, targetZ);
    this.scene.add(mesh);

    // 3D Target Shadow on floor
    const shadowGeo = new THREE.RingGeometry(0.2, 1.2, 16);
    const shadowMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.4 });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = Math.PI / 2;
    shadow.position.set(targetX, 0.62, targetZ);
    this.scene.add(shadow);

    this.skyDebuffs.push({
      mesh,
      shadow,
      x: targetX,
      z: targetZ,
      effect: picked.name
    });
  }

  trigger3DDebuffImpact(debuff) {
    this.sfx.playDebuffHit();

    this.players.forEach(p => {
      if (p.status !== 'SAFE') return;
      const dist = Math.hypot(p.group.position.x - debuff.x, p.group.position.z - debuff.z);
      if (dist <= 2.2) {
        if (debuff.effect === 'SLOW') {
          p.slowTimer = 3.5;
        } else if (debuff.effect === 'TIME') {
          this.questionTimer = Math.max(1, this.questionTimer - 3);
        } else if (debuff.effect === 'SHOCK') {
          const angle = Math.atan2(p.group.position.z - debuff.z, p.group.position.x - debuff.x);
          p.vx += Math.cos(angle) * 22;
          p.vz += Math.sin(angle) * 22;
        }
      }
    });
  }

  update3DPlayersPhysics(dt) {
    const baseSpeed = 14;
    this.players.forEach((p, idx) => {
      if (p.status === 'FALLING' || p.status === 'LOST') return;

      if (p.slowTimer > 0) p.slowTimer -= dt;
      const speed = p.slowTimer > 0 ? baseSpeed * 0.35 : baseSpeed;

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
          if (dist > 0.4) {
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

      // Gentle walking bobbing
      if (Math.hypot(p.vx, p.vz) > 0.5) {
        p.group.position.y = 0.6 + Math.abs(Math.sin(Date.now() * 0.015)) * 0.2;
        p.group.rotation.y = Math.atan2(p.vx, p.vz);
      } else {
        p.group.position.y = 0.6;
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

      const p1Pos = rope.p1.group.position.clone().add(new THREE.Vector3(0, 1.0, 0));
      const p2Pos = rope.p2.group.position.clone().add(new THREE.Vector3(0, 1.0, 0));
      const midPos = p1Pos.clone().lerp(p2Pos, 0.5).add(new THREE.Vector3(0, -0.4, 0));

      const curve = new THREE.CatmullRomCurve3([p1Pos, midPos, p2Pos]);
      rope.line.geometry.dispose();
      rope.line.geometry = new THREE.TubeGeometry(curve, 10, 0.06, 6, false);
    });
  }

  crumble3DOuterBlocks(dt) {
    this.blocks.forEach(b => {
      if (b.alive && b.dist > 2.1) {
        b.shakeTimer += dt;
        b.mesh.position.x = b.x + Math.sin(b.shakeTimer * 25) * 0.12;
        b.mesh.position.z = b.z + Math.cos(b.shakeTimer * 25) * 0.12;

        if (b.shakeTimer > 3.2) {
          b.alive = false;
          b.isFalling = true;
          b.fallVelocity = 2;
          b.rotSpeed = {
            x: (Math.random() - 0.5) * 3,
            y: (Math.random() - 0.5) * 3,
            z: (Math.random() - 0.5) * 3
          };
          this.sfx.playCrumble();
        }
      }
    });
  }

  update3DFallingBlocks(dt) {
    this.blocks.forEach(b => {
      if (b.isFalling) {
        b.fallVelocity += dt * 30; // 3D gravity
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
        this.triggerTeammateFall(p, 'ก้าวพลาดตกจากบล็อก 3 มิติที่พังทลาย!');
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
    const distToCorrect = Math.hypot(mainPlayer.group.position.x - correctPad.x, mainPlayer.group.position.z - correctPad.z);
    const isCorrect = distToCorrect <= correctPad.radius + 0.8;

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
    player.group.position.y = -2.5; // Dangles over 3D cliff
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
      this.fallenPlayer.group.position.set(0, 0.6, 0);
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

// Start on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.bioTether3D = new BioTether3DGame();
});
