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

const WHO_AM_I_ROUNDS = [
  {
    topic: 'Organelle Identity',
    question: 'ทายซิว่าฉันคือออร์แกเนลล์ใด? (สังเกตคำใบ้ที่ปลดล็อกตามเวลา)',
    clues: [
      'ฉันมีเยื่อหุ้ม 2 ชั้น (Double Membrane)',
      'ฉันมีสารพันธุกรรมและไรโบโซม 70S เป็นของตัวเอง',
      'ฉันคือโรงไฟฟ้าสร้าง ATP ผ่าน Chemiosmosis'
    ],
    choices: [
      { id: 'A', text: 'Mitochondria', correct: true },
      { id: 'B', text: 'Ribosome 80S', correct: false },
      { id: 'C', text: 'Golgi Apparatus', correct: false },
      { id: 'D', text: 'Lysosome', correct: false }
    ]
  },
  {
    topic: 'Molecular Identity',
    question: 'ทายซิว่าฉันคือชีวโมเลกุลใด?',
    clues: [
      'ฉันเป็นตัวรับสัญญาณบนเยื่อหุ้มเซลล์ (Transmembrane)',
      'โครงสร้างของฉันพาดผ่านเยื่อหุ้มเซลล์ 7 ครั้ง (7-TM Spans)',
      'ฉันส่งต่อสัญญาณผ่าน Heterotrimeric G-Protein'
    ],
    choices: [
      { id: 'A', text: 'GPCR Receptor', correct: true },
      { id: 'B', text: 'RNA Polymerase', correct: false },
      { id: 'C', text: 'DNA Polymerase', correct: false },
      { id: 'D', text: 'Sodium Pump', correct: false }
    ]
  },
  {
    topic: 'Guardian Identity',
    question: 'ทายซิว่าฉันคือโปรตีนใดในเซลล์?',
    clues: [
      'ฉันถูกขนานนามว่า "ผู้พิทักษ์จีโนม" (Guardian of Genome)',
      'ฉันทำหน้าที่เป็น Transcription Factor สั่งเปิดยีน p21',
      'หาก DNA เสียหายหนัก ฉันจะสั่งกระตุ้น Apoptosis'
    ],
    choices: [
      { id: 'A', text: 'Cyclin D', correct: false },
      { id: 'B', text: 'p53 Protein', correct: true },
      { id: 'C', text: 'Histone H1', correct: false },
      { id: 'D', text: 'Telomerase', correct: false }
    ]
  }
];

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

    // Keys
    this.keys = { up: false, down: false, left: false, right: false, space: false };

    this.initThreeJS();
    this.initInputs();
    this.initLobbyUI();
  }

  initThreeJS() {
    const container = document.getElementById('threeContainer');
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x060608);
    this.scene.fog = new THREE.FogExp2(0x060608, 0.012);

    // Wide Isometric Camera
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 1000);
    this.camera.position.set(0, 36, 44);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
    dirLight.position.set(20, 45, 30);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    this.scene.add(dirLight);

    // Deep Abyss Grid Helper
    const gridHelper = new THREE.GridHelper(120, 40, 0x333333, 0x141414);
    gridHelper.position.y = -22;
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

    const half = Math.floor(this.gridSize / 2);
    const boxGeo = new THREE.BoxGeometry(this.blockSize * 0.94, 1.4, this.blockSize * 0.94);
    const edgeGeo = new THREE.EdgesGeometry(boxGeo);

    for (let r = -half; r <= half; r++) {
      for (let c = -half; c <= half; c++) {
        const dist = Math.sqrt(r * r + c * c);
        if (dist <= half + 0.4) {
          const mat = new THREE.MeshStandardMaterial({
            color: 0x16161a,
            roughness: 0.35,
            metalness: 0.75
          });

          const mesh = new THREE.Mesh(boxGeo, mat);
          mesh.position.set(c * this.blockSize, 0, r * this.blockSize);
          mesh.castShadow = true;
          mesh.receiveShadow = true;

          const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.28 });
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
  // 4.1 3D Cyber Environment Decorations
  // ==========================================
  build3DDecorations() {
    if (this.decorationsGroup) this.scene.remove(this.decorationsGroup);
    this.decorationsGroup = new THREE.Group();

    // 1. Central Holographic DNA Double Helix Monolith
    this.dnaHelixGroup = new THREE.Group();
    this.dnaHelixGroup.position.set(0, 3.5, 0);

    const sphereGeo = new THREE.SphereGeometry(0.24, 8, 8);
    const sphereMatA = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const sphereMatB = new THREE.MeshBasicMaterial({ color: 0x888888 });
    const rungGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.2, 6);
    const rungMat = new THREE.MeshBasicMaterial({ color: 0xaaaaaa, transparent: true, opacity: 0.7 });

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
    const centerRingGeo = new THREE.TorusGeometry(1.8, 0.05, 8, 32);
    const centerRingMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
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

      // Multi-tier base
      const baseGeo = new THREE.BoxGeometry(2.4, 3.2, 2.4);
      const baseMat = new THREE.MeshStandardMaterial({ color: 0x121216, roughness: 0.2, metalness: 0.9 });
      const base = new THREE.Mesh(baseGeo, baseMat);
      base.position.y = 1.6;
      pylon.add(base);

      // Glowing core crystal
      const crystalGeo = new THREE.OctahedronGeometry(0.9, 0);
      const crystalMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const crystal = new THREE.Mesh(crystalGeo, crystalMat);
      crystal.position.y = 4.2;
      pylon.add(crystal);

      // Vertical Laser Beam Shooting into Sky
      const beamGeo = new THREE.CylinderGeometry(0.12, 0.35, 36, 12);
      const beamMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.45 });
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
      const satMat = new THREE.MeshStandardMaterial({ color: 0x222228, roughness: 0.2, metalness: 0.8 });
      const sat = new THREE.Mesh(satGeo, satMat);

      const edgeMat = new THREE.LineBasicMaterial({ color: 0xffffff });
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
      const tubeMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 });
      const line = new THREE.Mesh(tubeGeo, tubeMat);
      this.decorationsGroup.add(line);
    });

    // 5. 3D Voxel Cyber Sakura Trees (ต้นซากุระบล็อก 3 มิติ)
    const createVoxelSakuraTree = (x, z, scale = 1.0) => {
      const tree = new THREE.Group();
      tree.position.set(x, 0.7, z);
      tree.scale.set(scale, scale, scale);

      // Dark Cyber Trunk
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x1f1b24, roughness: 0.8, metalness: 0.2 });
      
      const mainTrunkGeo = new THREE.BoxGeometry(0.7, 3.2, 0.7);
      const mainTrunk = new THREE.Mesh(mainTrunkGeo, trunkMat);
      mainTrunk.position.y = 1.6;
      mainTrunk.castShadow = true;
      tree.add(mainTrunk);

      // Branches
      const branchGeoA = new THREE.BoxGeometry(1.4, 0.4, 0.5);
      const branchA = new THREE.Mesh(branchGeoA, trunkMat);
      branchA.position.set(0.6, 2.8, 0.3);
      branchA.rotation.z = -0.25;
      tree.add(branchA);

      const branchGeoB = new THREE.BoxGeometry(1.3, 0.4, 0.5);
      const branchB = new THREE.Mesh(branchGeoB, trunkMat);
      branchB.position.set(-0.6, 2.5, -0.3);
      branchB.rotation.z = 0.3;
      tree.add(branchB);

      // Voxel Sakura Blossom Foliage Clouds (Layered White-Sakura Voxels)
      const blossomMatA = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4, metalness: 0.1 });
      const blossomMatB = new THREE.MeshStandardMaterial({ color: 0xf5edf0, roughness: 0.3, metalness: 0.2 });
      const blossomMatC = new THREE.MeshStandardMaterial({ color: 0xe8dce2, roughness: 0.5, metalness: 0.1 });

      const canopyClusters = [
        { x: 0, y: 4.0, z: 0, w: 2.8, h: 1.6, d: 2.8, mat: blossomMatA },
        { x: 0.8, y: 3.6, z: 0.6, w: 2.2, h: 1.4, d: 2.2, mat: blossomMatB },
        { x: -0.8, y: 3.4, z: -0.5, w: 2.0, h: 1.3, d: 2.0, mat: blossomMatC },
        { x: 0, y: 4.8, z: 0, w: 1.8, h: 1.1, d: 1.8, mat: blossomMatA },
        { x: -0.4, y: 3.8, z: 0.8, w: 1.6, h: 1.2, d: 1.6, mat: blossomMatB }
      ];

      canopyClusters.forEach(c => {
        const leafGeo = new THREE.BoxGeometry(c.w, c.h, c.d);
        const leafMesh = new THREE.Mesh(leafGeo, c.mat);
        leafMesh.position.set(c.x, c.y, c.z);
        leafMesh.castShadow = true;
        leafMesh.receiveShadow = true;
        tree.add(leafMesh);
      });

      return tree;
    };

    // Place 4 Scenic Sakura Trees at Island Edges
    const treeCoords = [
      { x: -11, z: -8, scale: 1.15 },
      { x: 11, z: -8, scale: 1.1 },
      { x: -11, z: 8, scale: 1.05 },
      { x: 11, z: 8, scale: 1.2 }
    ];

    treeCoords.forEach(pos => {
      const tree = createVoxelSakuraTree(pos.x, pos.z, pos.scale);
      this.decorationsGroup.add(tree);
    });

    // 6. Falling Sakura Blossom Petals (กลีบซากุระปลิวในสายลม 3 มิติ)
    this.sakuraPetals = [];
    const petalCount = 140;
    const petalGeo = new THREE.PlaneGeometry(0.22, 0.16);
    const petalMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.85 });

    for (let i = 0; i < petalCount; i++) {
      const petal = new THREE.Mesh(petalGeo, petalMat);
      petal.position.set(
        (Math.random() - 0.5) * 36,
        Math.random() * 18 + 1,
        (Math.random() - 0.5) * 36
      );
      petal.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      this.decorationsGroup.add(petal);

      this.sakuraPetals.push({
        mesh: petal,
        fallSpeed: 1.2 + Math.random() * 1.5,
        driftSpeed: 0.8 + Math.random() * 1.2,
        rotSpeedX: Math.random() * 2 - 1,
        rotSpeedY: Math.random() * 2 - 1,
        phase: Math.random() * Math.PI * 2
      });
    }

    // 7. Atmospheric Ambient Stardust Particle Field
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 60;
      particlePositions[i + 1] = Math.random() * 24 - 4;
      particlePositions[i + 2] = (Math.random() - 0.5) * 60;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.2, transparent: true, opacity: 0.7 });
    this.stardustParticles = new THREE.Points(particleGeo, particleMat);
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

    const offset = this.blockSize * 3.4; // Wide distance for spacious arena!
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
      const podiumMat = new THREE.MeshStandardMaterial({ color: 0x0e0e12, roughness: 0.2, metalness: 0.9 });
      const podium = new THREE.Mesh(podiumGeo, podiumMat);
      podium.receiveShadow = true;
      group.add(podium);

      // Glowing Outer Hologram Ring
      const torusGeo = new THREE.TorusGeometry(2.6, 0.08, 8, 32);
      const torusMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
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
        canvas,
        texture,
        billboard
      });
    });
  }

  update3DBillboardText(pad, choiceLetter, choiceText) {
    const ctx = pad.canvas.getContext('2d');
    ctx.clearRect(0, 0, 512, 256);

    // Glass Cyber Background
    ctx.fillStyle = 'rgba(10, 10, 14, 0.92)';
    ctx.roundRect(10, 10, 492, 236, 24);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Choice Badge [A]
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(65, 80, 36, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#000000';
    ctx.font = '800 40px Prompt';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(choiceLetter, 65, 82);

    // Choice Text (Academic biological term)
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 32px Prompt';
    ctx.textAlign = 'left';
    ctx.fillText(choiceText.length > 20 ? choiceText.substring(0, 20) + '...' : choiceText, 120, 80);

    // Sub-caption
    ctx.fillStyle = '#a1a1aa';
    ctx.font = '500 22px Prompt';
    ctx.fillText('แท่นตัวเลือก 3 มิติ · วิ่งมาเหยียบ', 120, 150);

    pad.texture.needsUpdate = true;
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
    const questionList = this.gameType === 'whoami' ? WHO_AM_I_ROUNDS : STANDARD_QUESTIONS;
    this.currentQuestionIdx = idx % questionList.length;
    const q = questionList[this.currentQuestionIdx];
    this.questionTimer = this.questionTimeMax;

    document.getElementById('ribbonTopic').innerText = q.topic;
    document.getElementById('ribbonRound').innerText = `ข้อที่ ${this.round}/${this.totalRounds}`;
    document.getElementById('ribbonQuestion').innerText = q.question;

    // Update 3D In-World Floating Billboards for each pad!
    q.choices.forEach(ch => {
      const pad = this.answerPads.find(p => p.id === ch.id);
      if (pad) {
        this.update3DBillboardText(pad, ch.id, ch.text);
      }
    });

    // Who Am I Clue Cards Handling
    const clueBar = document.getElementById('clueCardsBar');
    if (this.gameType === 'whoami' && q.clues) {
      clueBar.style.display = 'flex';
      document.getElementById('clueText1').innerText = q.clues[0];
      document.getElementById('clueText2').innerText = 'ปลดล็อกใน 12s';
      document.getElementById('clueText3').innerText = 'ปลดล็อกใน 6s';
      document.getElementById('clue2').className = 'clue-pill';
      document.getElementById('clue3').className = 'clue-pill';
    } else {
      clueBar.style.display = 'none';
    }

    // AI Teammates logic
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

      // Progressive Who Am I clues reveal
      if (this.gameType === 'whoami') {
        const q = WHO_AM_I_ROUNDS[this.currentQuestionIdx];
        if (this.questionTimer <= 12 && q.clues[1]) {
          document.getElementById('clueText2').innerText = q.clues[1];
          document.getElementById('clue2').className = 'clue-pill revealed';
        }
        if (this.questionTimer <= 6 && q.clues[2]) {
          document.getElementById('clueText3').innerText = q.clues[2];
          document.getElementById('clue3').className = 'clue-pill revealed';
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

    // Animate Drifting 3D Voxel Sakura Petals (กลีบซากุระปลิวพลิ้วไหว)
    if (this.sakuraPetals) {
      const time = Date.now() * 0.001;
      this.sakuraPetals.forEach((p) => {
        p.mesh.position.y -= p.fallSpeed * dt;
        p.mesh.position.x += Math.sin(time * p.driftSpeed + p.phase) * dt * 1.4;
        p.mesh.position.z += Math.cos(time * p.driftSpeed + p.phase) * dt * 1.4;
        p.mesh.rotation.x += p.rotSpeedX * dt;
        p.mesh.rotation.y += p.rotSpeedY * dt;
        if (p.mesh.position.y < -5) {
          p.mesh.position.y = 18;
          p.mesh.position.x = (Math.random() - 0.5) * 36;
          p.mesh.position.z = (Math.random() - 0.5) * 36;
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

// Global Game Type Switcher
window.switchGameType = function(type) {
  if (window.bioCyber) {
    window.bioCyber.gameType = type;
    document.getElementById('tabSurvival').className = type === 'survival' ? 'mode-tab-btn active' : 'mode-tab-btn';
    document.getElementById('tabWhoAmI').className = type === 'whoami' ? 'mode-tab-btn active' : 'mode-tab-btn';
    window.bioCyber.loadQuestion(0);
  }
};

// Start on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.bioCyber = new BioCyberArena3D();
});
