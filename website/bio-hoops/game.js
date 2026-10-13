/**
 * CYTO-HOOPS 3D: ชู้ตบอลชีวะ 4 ห่วงประลองปัญญา
 * 4-Hoop Biology Basketball Shootout Arcade
 * Powered by Three.js, TWEEN.js, Canvas-Confetti, and Web Audio API
 */

// --- 1. Sound Synth Engine ---
class HoopsSoundSystem {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.2) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {}
  }

  playSwish() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      // White noise whoosh
      const bufferSize = this.ctx.sampleRate * 0.25;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, this.ctx.currentTime);
      filter.Q.setValueAtTime(3.0, this.ctx.currentTime);
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start();
    } catch(e) {}
    // Chime
    setTimeout(() => this.playTone(880, 'sine', 0.2, 0.25), 60);
    setTimeout(() => this.playTone(1320, 'sine', 0.3, 0.25), 140);
  }

  playRimClang() {
    if (!this.enabled) return;
    // Metallic impact
    this.playTone(480, 'square', 0.1, 0.25);
    setTimeout(() => this.playTone(280, 'triangle', 0.2, 0.2), 30);
  }

  playBounce() {
    if (!this.enabled) return;
    this.playTone(120, 'sine', 0.08, 0.3);
  }

  playWhistle() {
    if (!this.enabled) return;
    this.playTone(2400, 'sine', 0.1, 0.15);
    setTimeout(() => this.playTone(2600, 'sine', 0.18, 0.2), 80);
  }
}

// --- 2. Master Biology Question Bank (From Canva E-books 2 & 3) ---
const HOOPS_QUESTIONS = [
  {
    category: "CELL SIGNALING // SECOND MESSENGERS",
    question: "ตัวส่งสัญญาณลำดับที่สอง (Second Messenger) ที่สร้างขึ้นจาก ATP โดยเอนไซม์ Adenylyl Cyclase คือสารใด?",
    choices: [
      { text: "cAMP (Cyclic AMP)", isCorrect: true },
      { text: "Ca²⁺ (Calcium Ion)", isCorrect: false },
      { text: "IP3 (Inositol Trisphosphate)", isCorrect: false },
      { text: "DAG (Diacylglycerol)", isCorrect: false }
    ],
    explanation: "cAMP ถูกสร้างจาก ATP โดยเอนไซม์ Adenylyl Cyclase เมื่อได้รับการกระตุ้นจาก G-Protein (Gs-alpha) ทำหน้าที่กระตุ้น Protein Kinase A (PKA)"
  },
  {
    category: "SIGNAL TRANSDUCTION // RECEPTORS",
    question: "ตัวรับสัญญาณที่เยื่อหุ้มเซลล์ที่เมื่อจับกับลิแกนด์แล้วจะจับคู่กัน (Dimerization) และเติมฟอสเฟตให้ตัวเองคือข้อใด?",
    choices: [
      { text: "G-Protein Coupled Receptor (GPCR)", isCorrect: false },
      { text: "Receptor Tyrosine Kinase (RTK)", isCorrect: true },
      { text: "Ion Channel Receptor", isCorrect: false },
      { text: "Intracellular Steroid Receptor", isCorrect: false }
    ],
    explanation: "RTK (Receptor Tyrosine Kinase) มีโดเมนเอนไซม์ไคเนสในตัว เมื่อลิแกนด์มาจับ 2 โมเลกุลจะเกิด Dimerization และกระตุ้น Autophosphorylation เติมฟอสเฟตให้กรดอะมิโนไทโรซีน"
  },
  {
    category: "SIGNALING TYPES // CELL-TO-CELL",
    question: "การสื่อสารของเซลล์ที่ส่งสารฮอร์โมนผ่านกระแสเลือดไปยังเซลล์เป้าหมายที่อยู่ห่างไกลทั่วร่างกาย คือการส่งสัญญาณประเภทใด?",
    choices: [
      { text: "Autocrine Signaling", isCorrect: false },
      { text: "Paracrine Signaling", isCorrect: false },
      { text: "Endocrine Signaling", isCorrect: true },
      { text: "Synaptic Signaling", isCorrect: false }
    ],
    explanation: "Endocrine Signaling (การส่งสัญญาณระยะไกลโดยต่อมไร้ท่อ) หลั่งฮอร์โมนเข้าสู่ระบบไหลเวียนเลือดเพื่อไปยังเซลล์เป้าหมายทั่วร่างกาย"
  },
  {
    category: "SECOND MESSENGERS // CALCIUM RELAY",
    question: "สารทุติยภูมิชนิดใดที่ละลายน้ำได้ และทำหน้าที่เปิดช่องแคลเซียม (Ca²⁺ channel) บนเยื่อหุ้ม Endoplasmic Reticulum (ER)?",
    choices: [
      { text: "DAG (Diacylglycerol)", isCorrect: false },
      { text: "IP3 (Inositol 1,4,5-trisphosphate)", isCorrect: true },
      { text: "cAMP (Cyclic AMP)", isCorrect: false },
      { text: "cGMP (Cyclic GMP)", isCorrect: false }
    ],
    explanation: "เอนไซม์ Phospholipase C (PLC) จะตัด PIP2 ออกเป็น DAG (ฝังที่เยื่อหุ้ม) และ IP3 (ละลายน้ำไปเปิดประตู Ca²⁺ บน ER ปล่อยแคลเซียมสู่ไซโทพลาสซึม)"
  },
  {
    category: "CELL CYCLE // CHECKPOINTS",
    question: "จุดตรวจหลัก (Master Checkpoint) ที่ตัดสินว่าเซลล์จะเข้าสู่การจำลอง DNA (S phase) หรือจะถอยออกไปสู่ระยะพัก G0 คือจุดใด?",
    choices: [
      { text: "G1 Checkpoint (Restriction Point)", isCorrect: true },
      { text: "G2/M Checkpoint", isCorrect: false },
      { text: "Spindle / M Checkpoint", isCorrect: false },
      { text: "Cytokinesis Checkpoint", isCorrect: false }
    ],
    explanation: "G1 Checkpoint หรือ Restriction Point เป็นจุดตัดสินใจที่สำคัญที่สุด หากเซลล์ผ่านจุดนี้จะเข้าสู่วัฏจักรเซลล์และแบ่งตัว หากไม่ผ่านจะเข้าสู่ระยะสงบ G0"
  },
  {
    category: "GENOME GUARDIAN // TUMOR SUPPRESSOR",
    question: "โปรตีนที่มีฉายาว่า 'Guardian of the Genome' ทำหน้าที่ตรวจจับ DNA เสียหาย สั่งหยุดเซลล์ที่ G1 หรือสั่ง Apoptosis คือโปรตีนใด?",
    choices: [
      { text: "Ras Protein", isCorrect: false },
      { text: "p53 Tumor Suppressor Protein", isCorrect: true },
      { text: "Cyclin B", isCorrect: false },
      { text: "DNA Polymerase III", isCorrect: false }
    ],
    explanation: "p53 เป็น Transcription factor ที่คอยตรวจจับ DNA เสียหาย หากซ่อมแซมได้จะกระตุ้น p21 มายับยั้ง CDK แต่หากเสียหายหนักจะสั่งทำลายเซลล์ด้วย Apoptosis ป้องกันการเกิดมะเร็ง"
  },
  {
    category: "CELL CYCLE REGULATION // CDK",
    question: "สารควบคุมวัฏจักรเซลล์ที่มีระดับความเข้มข้นแกว่งขึ้นลงเป็นรอบๆ และต้องจับกับ CDK เพื่อให้ทำงานได้คือข้อใด?",
    choices: [
      { text: "ไซคลิน (Cyclin)", isCorrect: true },
      { text: "อะดีนีลิน (Adenine)", isCorrect: false },
      { text: "ฮีโมโกลบิน (Hemoglobin)", isCorrect: false },
      { text: "อินซูลิน (Insulin)", isCorrect: false }
    ],
    explanation: "Cyclin คือโปรตีนที่ความเข้มข้นจะเพิ่มขึ้นและลดลงอย่างเป็นวัฏจักร ทำหน้าที่กระตุ้นเอนไซม์ Cyclin-Dependent Kinase (CDK) เพื่อขับเคลื่อนวัฏจักรเซลล์"
  },
  {
    category: "PROGRAMMED CELL DEATH // APOPTOSIS",
    question: "ข้อใดคือลักษณะสำคัญของกระบวนการตายของเซลล์แบบ Apoptosis ที่แตกต่างจาก Necrosis?",
    choices: [
      { text: "เซลล์บวม แตกออก และเกิดการอักเสบ", isCorrect: false },
      { text: "เยื่อหุ้มเซลล์โป่งพอง (Blebbing) เป็น apoptotic bodies ไม่เกิดการอักเสบ", isCorrect: true },
      { text: "เกิดจากสารเคมีทำลายเยื่อหุ้มเซลล์แบบฉับพลัน", isCorrect: false },
      { text: "ไม่ใช้พลังงาน ATP ในการดำเนินกระบวนการ", isCorrect: false }
    ],
    explanation: "Apoptosis เป็นการตายที่ถูกโปรแกรมไว้ มีการหดตัวของเซลล์, DNA ขาดเป็นท่อน (Fragmentation), เกิด Blebbing และถูก Phagocyte กลืนกินอย่างสะอาดโดยไม่เกิดการอักเสบ"
  },
  {
    category: "CASPASE CASCADE // APOPTOSIS",
    question: "กลุ่มเอนไซม์โพรทีเอส (Proteases) หลักที่เป็นตัวการดำเนินกระบวนการตัดย่อยโปรตีนในกระบวนการ Apoptosis คือเอนไซม์ใด?",
    choices: [
      { text: "Pepsin & Trypsin", isCorrect: false },
      { text: "Caspases (Caspase-8, 9, 3)", isCorrect: true },
      { text: "RNA Polymerase", isCorrect: false },
      { text: "Helicase & Ligase", isCorrect: false }
    ],
    explanation: "Caspases (Cysteine-aspartic proteases) แบ่งเป็น Initiator caspases (8, 9) และ Executioner caspases (3, 6, 7) ซึ่งจะย่อยทำลาย cytoskeleton และ nuclear lamina"
  },
  {
    category: "ORGANELLE // ENERGY FACTORY",
    question: "ออร์แกเนลล์ที่มีเยื่อหุ้ม 2 ชั้น มี Cristae และเป็นแหล่งสร้าง ATP หลักผ่านกระบวนการ Oxidative Phosphorylation คืออะไร?",
    choices: [
      { text: "กอลจิบอดี (Golgi Body)", isCorrect: false },
      { text: "ไมโทคอนเดรีย (Mitochondria)", isCorrect: true },
      { text: "ไรโบโซม (Ribosome)", isCorrect: false },
      { text: "เอนโดพลาสมิกเรติคูลัม (ER)", isCorrect: false }
    ],
    explanation: "ไมโทคอนเดรีย (Mitochondria) ฉายา Powerhouse of the cell มีเยื่อหุ้ม 2 ชั้น เยื่อชั้นในพับทบเป็น Cristae บรรจุ ATP Synthase และมี DNA วงกลมเป็นของตนเอง"
  },
  {
    category: "CELLULAR RESPONSE // TRANSCRIPTION",
    question: "การตอบสนองระดับนิวเคลียส (Nuclear Response) จากการส่งสัญญาณของเซลล์ ส่งผลโดยตรงต่อกระบวนการใด?",
    choices: [
      { text: "การเปิด-ปิดการแสดงออกของยีน (Gene Expression / Transcription)", isCorrect: true },
      { text: "การเพิ่มความดันออสโมซิสของน้ำใน Vacuole", isCorrect: false },
      { text: "การสลายพันธะเพปไทด์ของอาหารในกระเพาะ", isCorrect: false },
      { text: "การสลายตัวของคอเลสเตอรอลในเลือด", isCorrect: false }
    ],
    explanation: "Nuclear Response มักเกี่ยวข้องกับการกระตุ้น Transcription Factor เข้าไปจับกับโปรโมเตอร์ในนิวเคลียส เพื่อเปิดหรือปิดการถอดรหัสของยีนเป้าหมาย"
  },
  {
    category: "MITOSIS // SPINDLE CHECKPOINT",
    question: "ในระยะ Metaphase จุดตรวจสอบ Spindle Checkpoint (M Checkpoint) ตรวจสอบความพร้อมของสิ่งใดก่อนเข้าสู่ Anaphase?",
    choices: [
      { text: "ตรวจสอบว่าโครโมโซมทุกแท่งต่อเข้ากับ Spindle Fiber ที่ Kinetochore ครบถ้วน", isCorrect: true },
      { text: "ตรวจสอบว่ามีการสร้าง ATP เพียงพอหรือไม่", isCorrect: false },
      { text: "ตรวจสอบการสังเคราะห์ RNA ในนิวคลีโอลัส", isCorrect: false },
      { text: "ตรวจสอบขนาดของไมโทคอนเดรีย", isCorrect: false }
    ],
    explanation: "M Checkpoint จะไม่อนุญาตให้เริ่ม Anaphase จนกว่า Kinetochore ของทุกโครมาทิดพี่น้องจะต่อกับ Microtubule จากทั้งสองขั้วอย่างสมบูรณ์ ป้องกันภาวะ Aneuploidy"
  }
];

// --- 3. Main CytoHoops Game Engine ---
class CytoHoopsGame {
  constructor() {
    this.sound = new HoopsSoundSystem();
    this.container = document.getElementById('canvas-container');

    // Game State
    this.currentQIndex = 0;
    this.score = 0;
    this.streak = 1;
    this.maxStreak = 1;
    this.totalAnswered = 0;
    this.totalCorrect = 0;
    this.isShooting = false;

    // Three.js Core
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // 3D Objects
    this.hoops = []; // 4 Hoops (0, 1, 2, 3)
    this.hoopTargets = []; // Clickable meshes
    this.ball = null;
    this.ballInitialPos = new THREE.Vector3(0, 0.9, 2.2);
    this.ballRadius = 0.32;

    // Drag & Swipe Shooting State
    this.isDragging = false;
    this.dragStart = { x: 0, y: 0, time: 0 };
    this.currentAimHoop = 1;
    this.trajectoryGroup = null;
    this.trajectoryDots = [];
    this.swipeCueEl = null;

    this.initThree();
    this.createArena();
    this.createHoops();
    this.createTrajectory();
    this.createBall();
    this.initDOM();
    this.loadQuestion(0);
    this.animate();
  }

  // --- Initialize Three.js Scene, Camera, & Lights ---
  initThree() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x050811, 0.035);

    this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    this.camera.position.set(0, 2.6, 5.2);
    this.camera.lookAt(0, 2.8, -4.5);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    // Arena Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
    mainLight.position.set(0, 12, 6);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    this.scene.add(mainLight);

    // Neon Rim Spotlights (Cyan, Purple, Amber, Green)
    const colors = [0x00f0ff, 0xc084fc, 0xfbbf24, 0x34d399];
    const xOffsets = [-4.5, -1.5, 1.5, 4.5];
    xOffsets.forEach((x, i) => {
      const spot = new THREE.PointLight(colors[i], 1.8, 12);
      spot.position.set(x, 4.5, -6.5);
      this.scene.add(spot);
    });

    window.addEventListener('resize', () => this.onWindowResize());
  }

  // --- Arena Floor & Backdrop ---
  createArena() {
    // Parquet Basketball Court Floor
    const courtGeo = new THREE.PlaneGeometry(28, 28);
    const courtMat = new THREE.MeshStandardMaterial({
      color: 0x0c1322,
      roughness: 0.25,
      metalness: 0.2
    });
    const court = new THREE.Mesh(courtGeo, courtMat);
    court.rotation.x = -Math.PI / 2;
    court.position.y = 0;
    court.receiveShadow = true;
    this.scene.add(court);

    // Glowing Neon Court Grid Lines
    const grid = new THREE.GridHelper(26, 26, 0x00f0ff, 0x1e293b);
    grid.position.y = 0.01;
    this.scene.add(grid);

    // 3-Point Arc Ring on Floor
    const arcGeo = new THREE.RingGeometry(3.8, 3.9, 32, 1, 0, Math.PI);
    const arcMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, side: THREE.DoubleSide });
    const arc = new THREE.Mesh(arcGeo, arcMat);
    arc.rotation.x = -Math.PI / 2;
    arc.position.set(0, 0.02, 0.5);
    this.scene.add(arc);

    // Ambient Crowd Particles
    const pCount = 200;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i += 3) {
      pPos[i] = (Math.random() - 0.5) * 22;
      pPos[i + 1] = Math.random() * 8 + 1;
      pPos[i + 2] = -Math.random() * 12 - 4;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.06,
      transparent: true,
      opacity: 0.6
    });
    this.particles = new THREE.Points(pGeo, pMat);
    this.scene.add(this.particles);
  }

  // --- 4 Basketball Hoops with Dynamic Texture Backboards ---
  createHoops() {
    const hoopConfigs = [
      { id: 0, letter: 'A', color: 0x00f0ff, hex: '#00f0ff', x: -4.5, y: 3.2, z: -7.0 },
      { id: 1, letter: 'B', color: 0xc084fc, hex: '#c084fc', x: -1.5, y: 3.4, z: -7.6 },
      { id: 2, letter: 'C', color: 0xfbbf24, hex: '#fbbf24', x: 1.5, y: 3.4, z: -7.6 },
      { id: 3, letter: 'D', color: 0x34d399, hex: '#34d399', x: 4.5, y: 3.2, z: -7.0 }
    ];

    hoopConfigs.forEach((cfg) => {
      const hoopGroup = new THREE.Group();
      hoopGroup.position.set(cfg.x, cfg.y, cfg.z);

      // Support Post
      const postGeo = new THREE.CylinderGeometry(0.08, 0.09, cfg.y + 0.6, 16);
      const postMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.2 });
      const post = new THREE.Mesh(postGeo, postMat);
      post.position.set(0, -(cfg.y + 0.6) / 2 + 0.6, -0.6);
      hoopGroup.add(post);

      // Backboard Mesh
      const boardWidth = 2.4;
      const boardHeight = 1.6;
      const boardGeo = new THREE.BoxGeometry(boardWidth, boardHeight, 0.08);

      // Canvas Texture for Dynamic Backboard text
      const boardCanvas = document.createElement('canvas');
      boardCanvas.width = 512;
      boardCanvas.height = 340;
      const boardTex = new THREE.CanvasTexture(boardCanvas);

      const boardMat = new THREE.MeshStandardMaterial({
        map: boardTex,
        roughness: 0.2,
        metalness: 0.3
      });
      const boardMesh = new THREE.Mesh(boardGeo, boardMat);
      boardMesh.position.set(0, 0.45, -0.4);
      boardMesh.castShadow = true;
      hoopGroup.add(boardMesh);

      // Rim Ring (Torus)
      const rimRadius = 0.52;
      const rimTube = 0.04;
      const rimGeo = new THREE.TorusGeometry(rimRadius, rimTube, 16, 32);
      const rimMat = new THREE.MeshStandardMaterial({
        color: cfg.color,
        emissive: cfg.color,
        emissiveIntensity: 0.4,
        roughness: 0.2,
        metalness: 0.7
      });
      const rimMesh = new THREE.Mesh(rimGeo, rimMat);
      rimMesh.rotation.x = Math.PI / 2;
      rimMesh.position.set(0, 0, 0.1);
      rimMesh.castShadow = true;
      hoopGroup.add(rimMesh);

      // Net (Cylinder wireframe)
      const netGeo = new THREE.CylinderGeometry(rimRadius, 0.32, 0.7, 16, 4, true);
      const netMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.75
      });
      const netMesh = new THREE.Mesh(netGeo, netMat);
      netMesh.position.set(0, -0.35, 0.1);
      hoopGroup.add(netMesh);

      // Invisible Clickable Target Sphere for Raycasting
      const clickGeo = new THREE.SphereGeometry(0.9, 12, 12);
      const clickMat = new THREE.MeshBasicMaterial({ visible: false });
      const clickTarget = new THREE.Mesh(clickGeo, clickMat);
      clickTarget.position.set(0, 0, 0.1);
      clickTarget.userData = { hoopIndex: cfg.id };
      hoopGroup.add(clickTarget);
      this.hoopTargets.push(clickTarget);

      this.scene.add(hoopGroup);

      this.hoops.push({
        id: cfg.id,
        letter: cfg.letter,
        color: cfg.color,
        hex: cfg.hex,
        group: hoopGroup,
        rimMesh: rimMesh,
        netMesh: netMesh,
        boardMesh: boardMesh,
        canvas: boardCanvas,
        texture: boardTex,
        pos: new THREE.Vector3(cfg.x, cfg.y, cfg.z)
      });
    });
  }

  // --- Draw Text on Backboard Canvas ---
  updateBackboardCanvas(hoop, letter, text) {
    const ctx = hoop.canvas.getContext('2d');
    const w = hoop.canvas.width;
    const h = hoop.canvas.height;

    // Dark sleek background
    ctx.fillStyle = '#0a101d';
    ctx.fillRect(0, 0, w, h);

    // Glowing Neon Border
    ctx.strokeStyle = hoop.hex;
    ctx.lineWidth = 14;
    ctx.strokeRect(7, 7, w - 14, h - 14);

    // Inner Target Square
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 6;
    ctx.strokeRect(w / 2 - 80, h - 140, 160, 110);

    // Choice Letter Badge
    ctx.fillStyle = hoop.hex;
    ctx.beginPath();
    ctx.arc(w / 2, 60, 36, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#000000';
    ctx.font = 'bold 42px "JetBrains Mono", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(letter, w / 2, 60);

    // Choice Description Text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px "Prompt", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    // Word wrap if long
    const maxChars = 22;
    if (text.length > maxChars) {
      const part1 = text.substring(0, maxChars);
      const part2 = text.substring(maxChars);
      ctx.fillText(part1, w / 2, 115);
      ctx.font = '22px "Prompt", sans-serif';
      ctx.fillText(part2, w / 2, 150);
    } else {
      ctx.fillText(text, w / 2, 125);
    }

    hoop.texture.needsUpdate = true;
  }

  // --- Create Basketball Mesh ---
  createBall() {
    const ballGeo = new THREE.SphereGeometry(this.ballRadius, 32, 32);

    // Canvas procedural Basketball texture (orange with black rib lines)
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(0, 0, 512, 256);

    // Rib lines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(0, 128); ctx.lineTo(512, 128);
    ctx.moveTo(256, 0); ctx.lineTo(256, 256);
    ctx.arc(256, 128, 80, 0, Math.PI * 2);
    ctx.stroke();

    const ballTex = new THREE.CanvasTexture(canvas);
    const ballMat = new THREE.MeshStandardMaterial({
      map: ballTex,
      roughness: 0.45,
      metalness: 0.1
    });

    this.ball = new THREE.Mesh(ballGeo, ballMat);
    this.ball.position.copy(this.ballInitialPos);
    this.ball.castShadow = true;
    this.scene.add(this.ball);
  }

  // --- Create Glowing 3D Trajectory Guide Dots ---
  createTrajectory() {
    this.trajectoryDots = [];
    this.trajectoryGroup = new THREE.Group();
    this.trajectoryGroup.visible = false;

    const dotGeo = new THREE.SphereGeometry(0.048, 12, 12);
    for (let i = 0; i < 15; i++) {
      const dotMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.85
      });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      this.trajectoryGroup.add(dot);
      this.trajectoryDots.push(dot);
    }
    this.scene.add(this.trajectoryGroup);
  }

  // --- Update Parabolic Trajectory Curve to Aimed Hoop ---
  updateTrajectory(hoopIndex) {
    if (!this.hoops[hoopIndex]) return;
    const targetHoop = this.hoops[hoopIndex];
    const startPos = this.ball ? this.ball.position.clone() : this.ballInitialPos.clone();
    const rimPos = targetHoop.pos.clone();
    rimPos.y += 0.05;
    rimPos.z += 0.1;
    const apexY = Math.max(rimPos.y + 2.8, 6.2);

    this.trajectoryGroup.visible = true;

    const totalDots = this.trajectoryDots.length;
    for (let i = 0; i < totalDots; i++) {
      const t = (i + 1) / (totalDots + 1);
      const x = startPos.x + (rimPos.x - startPos.x) * t;
      const z = startPos.z + (rimPos.z - startPos.z) * t;
      const y = startPos.y + (rimPos.y - startPos.y) * t + 4 * (apexY - ((startPos.y + rimPos.y) / 2)) * t * (1 - t);

      this.trajectoryDots[i].position.set(x, y, z);
      this.trajectoryDots[i].material.color.setHex(targetHoop.color);

      // Organic pulse scale along arc
      const s = 0.8 + Math.sin(t * Math.PI) * 0.45;
      this.trajectoryDots[i].scale.set(s, s, s);
    }
  }

  hideTrajectory() {
    if (this.trajectoryGroup) {
      this.trajectoryGroup.visible = false;
    }
  }

  // --- Calculate Aimed Hoop from Screen X Coordinate ---
  calculateAimHoop(clientX) {
    const ratio = clientX / window.innerWidth;
    if (ratio < 0.28) return 0; // Hoop A
    if (ratio < 0.50) return 1; // Hoop B
    if (ratio < 0.72) return 2; // Hoop C
    return 3;                   // Hoop D
  }

  // --- Highlight Hoop Rim & Backboard on Aim ---
  highlightHoop(hoopIndex) {
    this.hoops.forEach((h, i) => {
      if (i === hoopIndex) {
        h.rimMesh.material.emissiveIntensity = 0.95;
        h.boardMesh.scale.set(1.06, 1.06, 1.06);
      } else {
        h.rimMesh.material.emissiveIntensity = 0.35;
        h.boardMesh.scale.set(1.0, 1.0, 1.0);
      }
    });
  }

  resetHoopHighlights() {
    this.hoops.forEach((h) => {
      h.rimMesh.material.emissiveIntensity = 0.4;
      h.boardMesh.scale.set(1.0, 1.0, 1.0);
    });
  }

  // --- Aiming HUD Badge ---
  showAimHUD(hoopIndex) {
    const hud = document.getElementById('aim-target-hud');
    const label = document.getElementById('aim-target-label');
    if (!hud || !label) return;

    const currentQ = HOOPS_QUESTIONS[this.currentQIndex];
    if (!currentQ || !currentQ.choices[hoopIndex]) return;

    const hoop = this.hoops[hoopIndex];
    const choice = currentQ.choices[hoopIndex];

    hud.classList.add('visible');
    hud.style.borderColor = hoop.hex;
    hud.style.boxShadow = `0 0 25px ${hoop.hex}80`;
    label.innerHTML = `กำลังเล็ง <span style="color:${hoop.hex}; font-weight:800;">[ห่วง ${hoop.letter}]</span>: <strong>${choice.text}</strong> · ตวัดจอขึ้นเพื่อชู้ต! 🏀`;
  }

  hideAimHUD() {
    const hud = document.getElementById('aim-target-hud');
    if (hud) hud.classList.remove('visible');
  }

  // --- Reset Ball to Shooting Spot ---
  resetBall() {
    this.ball.position.copy(this.ballInitialPos);
    this.ball.rotation.set(0, 0, 0);
    this.isShooting = false;
    this.isDragging = false;
    this.hideTrajectory();
    this.hideAimHUD();
    this.resetHoopHighlights();
    if (this.swipeCueEl) {
      this.swipeCueEl.classList.remove('hidden');
    }
  }

  // --- Load Question & Update Hoops ---
  loadQuestion(index) {
    if (index >= HOOPS_QUESTIONS.length) {
      this.showGameOverModal();
      return;
    }

    this.currentQIndex = index;
    const q = HOOPS_QUESTIONS[index];

    // Update Question Card HUD
    document.getElementById('q-progress-txt').innerText = `${index + 1} / ${HOOPS_QUESTIONS.length}`;
    document.getElementById('q-category-tag').innerText = q.category;
    document.getElementById('q-text').innerText = q.question;

    // Update 4 Hoops and Bottom Buttons
    const letters = ['A', 'B', 'C', 'D'];
    q.choices.forEach((choice, i) => {
      this.updateBackboardCanvas(this.hoops[i], letters[i], choice.text);
      const btnTxt = document.getElementById(`choice-txt-${i}`);
      if (btnTxt) btnTxt.innerText = choice.text;
    });

    this.resetBall();
  }

  // --- Shoot Ball Towards Target Hoop ---
  shootBall(hoopIndex, duration = 880) {
    if (this.isShooting) return;
    this.isShooting = true;
    this.isDragging = false;

    if (this.swipeCueEl) {
      this.swipeCueEl.classList.add('hidden');
    }
    this.hideTrajectory();
    this.hideAimHUD();
    this.resetHoopHighlights();

    const currentQ = HOOPS_QUESTIONS[this.currentQIndex];
    const isCorrect = currentQ.choices[hoopIndex].isCorrect;
    const targetHoop = this.hoops[hoopIndex];

    const startPos = this.ball ? this.ball.position.clone() : this.ballInitialPos.clone();
    const rimPos = targetHoop.pos.clone();
    rimPos.y += 0.05;
    rimPos.z += 0.1;

    // Ball Arc Calculation
    const apexY = Math.max(rimPos.y + 2.8, 6.2);
    const flightDuration = duration;

    this.sound.playBounce();

    // Arc Tween
    const startTime = performance.now();
    const animateShot = () => {
      const elapsed = performance.now() - startTime;
      const t = Math.min(elapsed / flightDuration, 1.0);

      // Parabolic flight: Linear in X and Z, Quadratic peak in Y
      const curX = startPos.x + (rimPos.x - startPos.x) * t;
      const curZ = startPos.z + (rimPos.z - startPos.z) * t;
      const curY = startPos.y + (rimPos.y - startPos.y) * t + 4 * (apexY - ((startPos.y + rimPos.y) / 2)) * t * (1 - t);

      this.ball.position.set(curX, curY, curZ);
      this.ball.rotation.x -= 0.18; // Backspin

      if (t < 1.0) {
        requestAnimationFrame(animateShot);
      } else {
        // Impact with Hoop
        if (isCorrect) {
          this.handleSwishSuccess(targetHoop, currentQ);
        } else {
          this.handleClangMiss(targetHoop, currentQ, hoopIndex);
        }
      }
    };

    requestAnimationFrame(animateShot);
  }

  // --- Handle Swish (Correct Answer) ---
  handleSwishSuccess(hoop, question) {
    this.sound.playSwish();

    // Ripple net animation
    new TWEEN.Tween(hoop.netMesh.scale)
      .to({ x: 1.4, z: 1.4, y: 1.2 }, 150)
      .yoyo(true)
      .repeat(1)
      .start();

    // Ball drops through net to floor
    new TWEEN.Tween(this.ball.position)
      .to({ y: 0.35, z: hoop.pos.z + 0.1 }, 350)
      .easing(TWEEN.Easing.Bounce.Out)
      .start();

    // Confetti burst
    if (window.confetti) {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.6 }
      });
    }

    // Scoring & Streak
    this.totalAnswered++;
    this.totalCorrect++;
    const pointsGained = 100 * this.streak;
    this.score += pointsGained;
    this.streak++;
    if (this.streak > this.maxStreak) this.maxStreak = this.streak;

    this.updateHUD();

    // Feedback Banner
    this.showFeedback('SWISH! +' + pointsGained, 'ชู้ตลงห่วงเป๊ะ! คำตอบถูกต้อง 🎉', true);

    // Open Explanation Modal
    setTimeout(() => {
      this.showExplanationModal(question, true, pointsGained);
    }, 900);
  }

  // --- Handle Clang (Wrong Answer) ---
  handleClangMiss(hoop, question, chosenIndex) {
    this.sound.playRimClang();

    // Shake Rim
    new TWEEN.Tween(hoop.rimMesh.position)
      .to({ y: hoop.rimMesh.position.y - 0.1 }, 80)
      .yoyo(true)
      .repeat(3)
      .start();

    // Ball bounces off rim and falls
    new TWEEN.Tween(this.ball.position)
      .to({ x: this.ball.position.x + (Math.random() - 0.5) * 1.5, y: 0.35, z: hoop.pos.z + 2.5 }, 550)
      .easing(TWEEN.Easing.Bounce.Out)
      .start();

    // Reset Streak
    this.totalAnswered++;
    this.streak = 1;
    this.updateHUD();

    const chosenText = question.choices[chosenIndex].text;
    this.showFeedback('CLANG! ❌', `ยังไม่ใช่! ช้อยส์ "${chosenText}" ไม่ถูกต้อง`, false);

    setTimeout(() => {
      this.showExplanationModal(question, false, 0);
    }, 1000);
  }

  // --- Update HUD Numbers ---
  updateHUD() {
    document.getElementById('score-txt').innerText = this.score;
    document.getElementById('streak-txt').innerText = `x${this.streak}`;
    const acc = this.totalAnswered > 0 ? Math.round((this.totalCorrect / this.totalAnswered) * 100) : 100;
    document.getElementById('accuracy-txt').innerText = `${acc}%`;
  }

  // --- Show Shot Feedback Popup ---
  showFeedback(badge, desc, isSuccess) {
    const fb = document.getElementById('shot-feedback');
    const badgeEl = document.getElementById('feedback-badge');
    const descEl = document.getElementById('feedback-desc');

    badgeEl.innerText = badge;
    descEl.innerText = desc;

    fb.className = 'shot-feedback ' + (isSuccess ? 'show-swish' : 'show-clang');
    setTimeout(() => {
      fb.className = 'shot-feedback';
    }, 1800);
  }

  // --- Show Detailed Explanation Modal ---
  showExplanationModal(question, isCorrect, points) {
    const modal = document.getElementById('explain-modal');
    const icon = document.getElementById('explain-icon');
    const title = document.getElementById('explain-title');
    const correctTxt = document.getElementById('explain-correct-choice');
    const descTxt = document.getElementById('explain-text');
    const ptsVal = document.getElementById('round-points-val');
    const streakVal = document.getElementById('round-streak-val');

    icon.innerText = isCorrect ? '🎉' : '⚠️';
    title.innerText = isCorrect ? 'ถูกต้อง! (SWISH)' : 'ยังไม่ถูกต้อง (CLANG)';
    title.style.color = isCorrect ? '#34d399' : '#f43f5e';

    const correctChoice = question.choices.find(c => c.isCorrect);
    correctTxt.innerText = correctChoice ? correctChoice.text : '';
    descTxt.innerText = question.explanation;
    ptsVal.innerText = isCorrect ? `+${points}` : '+0';
    streakVal.innerText = `x${this.streak} COMBO`;

    modal.classList.add('show');
  }

  // --- Show Game Over Summary Modal ---
  showGameOverModal() {
    this.sound.playWhistle();
    const modal = document.getElementById('gameover-modal');

    document.getElementById('final-score-val').innerText = this.score.toLocaleString();
    document.getElementById('final-correct-val').innerText = `${this.totalCorrect} / ${HOOPS_QUESTIONS.length} ข้อ`;
    const acc = this.totalAnswered > 0 ? ((this.totalCorrect / this.totalAnswered) * 100).toFixed(1) : '100';
    document.getElementById('final-accuracy-val').innerText = `${acc}%`;
    document.getElementById('final-streak-val').innerText = `🔥 ${this.maxStreak}x`;

    const rankEl = document.getElementById('mvp-rank');
    if (this.totalCorrect >= 13) {
      rankEl.innerText = '🏆 MVP ระดับ: ปรมาจารย์ชีววิทยาโมเลกุล (All-Star Master)';
    } else if (this.totalCorrect >= 9) {
      rankEl.innerText = '🌟 MVP ระดับ: นักสืบสัญญาณชีววิทยา (Pro Bio Shooter)';
    } else {
      rankEl.innerText = '🏀 MVP ระดับ: ผู้เริ่มต้นศึกษาเซลล์ (Rookie Detective)';
    }

    modal.classList.add('show');

    if (window.confetti) {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
    }
  }

  // --- DOM Event Listeners ---
  initDOM() {
    this.swipeCueEl = document.getElementById('swipe-cue-indicator');

    // 4 Bottom Choice Buttons (Quick-Shoot)
    for (let i = 0; i < 4; i++) {
      const btn = document.getElementById(`choice-btn-${i}`);
      if (btn) {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.shootBall(i);
        });
      }
    }

    // Touch & Pointer Drag / Swipe to Throw Mechanics
    const handlePointerDown = (event) => {
      if (this.isShooting) return;
      // Do not initiate drag if tapping UI buttons, navigation, modals, or question text
      if (event.target.closest('button, a, .modal-card, .modal-backdrop.show, .question-card, .top-nav')) {
        return;
      }

      this.isDragging = true;
      this.dragStart = { x: event.clientX, y: event.clientY, time: performance.now() };
      this.currentAimHoop = this.calculateAimHoop(event.clientX);
      this.updateTrajectory(this.currentAimHoop);
      this.showAimHUD(this.currentAimHoop);
      this.highlightHoop(this.currentAimHoop);
      this.container.classList.add('grabbing');
      if (this.swipeCueEl) {
        this.swipeCueEl.classList.add('hidden');
      }
    };

    const handlePointerMove = (event) => {
      if (!this.isDragging || this.isShooting) return;

      const deltaX = event.clientX - this.dragStart.x;
      const deltaY = this.dragStart.y - event.clientY; // Positive when moving upward

      const newAim = this.calculateAimHoop(event.clientX);
      if (newAim !== this.currentAimHoop) {
        this.currentAimHoop = newAim;
        if (navigator.vibrate) {
          try { navigator.vibrate(12); } catch (e) {}
        }
      }

      // Tactile ball pullback & slight horizontal aiming offset
      this.ball.position.x = this.ballInitialPos.x + THREE.MathUtils.clamp(deltaX * 0.0018, -1.2, 1.2);
      this.ball.position.y = this.ballInitialPos.y + THREE.MathUtils.clamp(-deltaY * 0.0008, -0.25, 0.35);

      this.updateTrajectory(this.currentAimHoop);
      this.showAimHUD(this.currentAimHoop);
      this.highlightHoop(this.currentAimHoop);
    };

    const handlePointerUp = (event) => {
      if (!this.isDragging) return;
      this.isDragging = false;
      this.container.classList.remove('grabbing');
      this.hideTrajectory();
      this.hideAimHUD();
      this.resetHoopHighlights();

      const swipeDistY = this.dragStart.y - event.clientY; // Upward swipe distance
      const deltaTime = Math.max(1, performance.now() - this.dragStart.time);
      const velocityY = swipeDistY / deltaTime;

      // Throw threshold: swiped up at least 28px or flicked upward fast
      if (swipeDistY > 28 || (swipeDistY > 14 && velocityY > 0.14)) {
        if (navigator.vibrate) {
          try { navigator.vibrate(35); } catch (e) {}
        }
        const duration = Math.max(680, Math.min(1000, 1050 - velocityY * 200));
        this.shootBall(this.currentAimHoop, duration);
      } else {
        // Drag cancelled / too small: Snap ball smoothly back to shooting mark
        new TWEEN.Tween(this.ball.position)
          .to({ x: this.ballInitialPos.x, y: this.ballInitialPos.y, z: this.ballInitialPos.z }, 200)
          .easing(TWEEN.Easing.Quadratic.Out)
          .start();

        // Check if player clicked directly on a 3D hoop target
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.hoopTargets);
        if (intersects.length > 0) {
          const hoopIdx = intersects[0].object.userData.hoopIndex;
          if (typeof hoopIdx === 'number') {
            this.shootBall(hoopIdx);
          }
        }
      }
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', () => {
      if (this.isDragging) {
        this.isDragging = false;
        this.hideTrajectory();
        this.hideAimHUD();
        this.resetHoopHighlights();
        this.ball.position.copy(this.ballInitialPos);
      }
    });

    // Next Question Button
    document.getElementById('next-q-btn').addEventListener('click', () => {
      document.getElementById('explain-modal').classList.remove('show');
      this.loadQuestion(this.currentQIndex + 1);
    });

    // Replay Game Button
    document.getElementById('replay-game-btn').addEventListener('click', () => {
      document.getElementById('gameover-modal').classList.remove('show');
      this.score = 0;
      this.streak = 1;
      this.maxStreak = 1;
      this.totalAnswered = 0;
      this.totalCorrect = 0;
      this.updateHUD();
      this.loadQuestion(0);
    });

    // Sound Toggle
    const soundBtn = document.getElementById('sound-toggle-btn');
    soundBtn.addEventListener('click', () => {
      const on = this.sound.toggle();
      document.getElementById('sound-icon').innerText = on ? '🔊' : '🔇';
    });

    // Rules Modal
    const rulesModal = document.getElementById('rules-modal');
    document.getElementById('open-rules-btn').addEventListener('click', () => {
      rulesModal.classList.add('show');
    });
    document.getElementById('close-rules-btn').addEventListener('click', () => {
      rulesModal.classList.remove('show');
    });
    document.getElementById('start-rules-btn').addEventListener('click', () => {
      rulesModal.classList.remove('show');
    });
  }

  // --- Resize Handler ---
  onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  // --- Animation Loop ---
  animate() {
    requestAnimationFrame(() => this.animate());
    TWEEN.update();

    if (this.particles) {
      this.particles.rotation.y += 0.0004;
    }

    // Dynamic wave animation on trajectory guide dots
    if (this.trajectoryGroup && this.trajectoryGroup.visible) {
      const time = performance.now() * 0.006;
      this.trajectoryDots.forEach((dot, idx) => {
        const pulse = Math.sin(time - idx * 0.45) * 0.25 + 0.75;
        dot.material.opacity = pulse;
      });
    }

    this.renderer.render(this.scene, this.camera);
  }
}

// Start Game on Page Load
window.addEventListener('DOMContentLoaded', () => {
  window.cytoHoopsApp = new CytoHoopsGame();
});
