/**
 * WHO AM I? (ทายฉันสิ: แฟ้มลับชีววิทยา 3 มิติ)
 * 3D Interactive Card & Dossier Mystery Game Engine
 * Featuring 8 Multi-Card Fan Deck & 15 Deep Academic Cases
 * Powered by Three.js & Web Audio Synth
 */

// --- 1. Sound Effects Engine (Web Audio API) ---
class SoundController {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.2) {
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

  playCardHover() {
    this.playTone(520, 'sine', 0.08, 0.08);
  }

  playCardFlip() {
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(240, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(720, this.ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.2);
    } catch(e) {}
  }

  playClueReveal() {
    this.playTone(587.33, 'sine', 0.15, 0.15);
    setTimeout(() => this.playTone(880, 'sine', 0.25, 0.15), 100);
  }

  playBuzzer() {
    this.playTone(150, 'sawtooth', 0.25, 0.25);
  }

  playShuffle() {
    for (let i = 0; i < 6; i++) {
      setTimeout(() => this.playTone(300 + Math.random() * 400, 'sine', 0.06, 0.08), i * 40);
    }
  }

  playSuccess() {
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'sine', 0.3, 0.2), idx * 90);
    });
  }

  playWrong() {
    this.playTone(220, 'sawtooth', 0.3, 0.25);
    setTimeout(() => this.playTone(164.81, 'sawtooth', 0.4, 0.25), 180);
  }
}

// --- 2. Biological Database (12 Deep Cases with 8 Options Each) ---
const BIO_CASES = [
  {
    id: 1,
    nameTh: "ไมโทคอนเดรีย (Mitochondria)",
    nameEn: "Mitochondria",
    category: "ORGANELLE // ENERGY FACTORY",
    desc: "ออร์แกเนลล์เยื่อหุ้ม 2 ชั้น แหล่งสร้างพลังงาน ATP หลักของเซลล์ผ่าน Krebs Cycle และ Oxidative Phosphorylation มี Circular DNA และ 70S Ribosome เป็นของตัวเอง",
    clues: [
      "ฉันมีเยื่อหุ้ม 2 ชั้น (Double Membrane) โดยเยื่อชั้นในพับทบเป็นรอยหยักเรียกว่า <em>Cristae</em>",
      "ภายในตัวฉันมีของเหลวที่เรียกว่า <em>Matrix</em> บรรจุเอนไซม์สำหรับวัฏจักรเครบส์ (Krebs Cycle)",
      "ฉันมีสารพันธุกรรม (Circular DNA) และไรโบโซมขนาด 70S เป็นของตัวเอง ถ่ายทอดผ่านทางแม่",
      "ฉายาของฉันคือ <em>Powerhouse of the Cell</em> ผลิต ATP มหาศาลให้กับเซลล์ที่มีเมแทบอลิซึมสูง"
    ],
    options: [
      { nameTh: "คลอโรพลาสต์", nameEn: "Chloroplast", tag: "PLANT PLASTID", color: "#10b981", icon: "🍃" },
      { nameTh: "ไมโทคอนเดรีย", nameEn: "Mitochondria", tag: "POWERHOUSE", color: "#f59e0b", icon: "⚡" },
      { nameTh: "กอลจิบอดี", nameEn: "Golgi Complex", tag: "PACKAGING", color: "#a855f7", icon: "📦" },
      { nameTh: "เพอรอกซิโซม", nameEn: "Peroxisome", tag: "DETOX", color: "#00f0ff", icon: "🧪" },
      { nameTh: "ไลโซโซม", nameEn: "Lysosome", tag: "DIGESTION", color: "#ef4444", icon: "✂️" },
      { nameTh: "ไรโบโซม", nameEn: "Ribosome", tag: "TRANSLATION", color: "#ec4899", icon: "🧬" },
      { nameTh: "เซนโทรโซม", nameEn: "Centrosome", tag: "DIVISION", color: "#8b5cf6", icon: "⭐" },
      { nameTh: "SER", nameEn: "Smooth ER", tag: "LIPID SYNTHESIS", color: "#eab308", icon: "🧈" }
    ],
    correctIndex: 1
  },
  {
    id: 2,
    nameTh: "คลอโรพลาสต์ (Chloroplast)",
    nameEn: "Chloroplast",
    category: "ORGANELLE // PHOTOSYNTHESIS",
    desc: "พลาสติดที่พบในพืชและสาหร่าย ภายในมี Thylakoid เรียงซ้อนเป็น Granum บรรจุรงควัตถุ Chlorophyll ดักจับพลังงานแสงเพื่อสร้างน้ำตาล",
    clues: [
      "ฉันพบเฉพาะในเซลล์พืชและสาหร่าย (Algae) แต่ไม่พบในเซลล์สัตว์และเห็ดรา",
      "ภายในฉันมีถุงแบนๆ เรียกว่า <em>Thylakoid</em> ซ้อนกันเป็นตั้งเรียกว่า <em>Granum</em>",
      "มีของเหลวรอบๆ เรียกว่า <em>Stroma</em> ซึ่งเกิดปฏิกิริยาตรึงคาร์บอนไดออกไซด์ (Calvin Cycle)",
      "ฉันมีรงควัตถุสีเขียว (Chlorophyll) ดักจับพลังงานแสงอาทิตย์เปลี่ยนเป็นพลังงานเคมี"
    ],
    options: [
      { nameTh: "ไมโทคอนเดรีย", nameEn: "Mitochondria", tag: "ATP SYNTHESIS", color: "#f59e0b", icon: "⚡" },
      { nameTh: "แวคิวโอลกลาง", nameEn: "Central Vacuole", tag: "TURGOR PRESSURE", color: "#3b82f6", icon: "💧" },
      { nameTh: "คลอโรพลาสต์", nameEn: "Chloroplast", tag: "SOLAR HARVEST", color: "#10b981", icon: "☀️" },
      { nameTh: "โครโมพลาสต์", nameEn: "Chromoplast", tag: "PIGMENT PLASTID", color: "#f97316", icon: "🎨" },
      { nameTh: "อะไมโลพลาสต์", nameEn: "Amyloplast", tag: "STARCH STORAGE", color: "#eab308", icon: "🥔" },
      { nameTh: "โทโนพลาสต์", nameEn: "Tonoplast", tag: "VACUOLE MEMBRANE", color: "#06b6d4", icon: "🫧" },
      { nameTh: "กอลจิบอดี", nameEn: "Golgi Body", tag: "CELL PLATE", color: "#a855f7", icon: "📦" },
      { nameTh: "เพอรอกซิโซม", nameEn: "Peroxisome", tag: "PHOTORESPIRATION", color: "#00f0ff", icon: "🛡️" }
    ],
    correctIndex: 2
  },
  {
    id: 3,
    nameTh: "ไรโบโซม (Ribosome)",
    nameEn: "Ribosome",
    category: "MOLECULAR MACHINE // TRANSLATION",
    desc: "อนุภาคไร้เยื่อหุ้ม (Non-membrane organelle) ประกอบด้วย rRNA และโปรตีน ทำหน้าที่อ่านรหัสพันธุกรรม mRNA เพื่อสังเคราะห์สาย Polypeptide",
    clues: [
      "ฉันไม่มีเยื่อหุ้มเซลล์ (Non-membrane bound) พบได้ในทั้งโพรแคริโอตและยูแคริโอต",
      "ประกอบด้วย 2 หน่วยย่อย (Subunits) คือ หน่วยเล็ก (Small) และหน่วยใหญ่ (Large) จับกันเวลาทำงาน",
      "มีทั้งชนิดที่ลอยอิสระในไซโทพลาซึม และชนิดที่เกาะอยู่บนเยื่อหุ้ม RER",
      "ฉันคือโรงงานประกอบกรดอะมิโนเป็นโปรตีนผ่านกระบวนการ <em>Translation</em>"
    ],
    options: [
      { nameTh: "ไรโบโซม", nameEn: "Ribosome", tag: "PROTEIN SYNTHESIS", color: "#ec4899", icon: "🧬" },
      { nameTh: "ไลโซโซม", nameEn: "Lysosome", tag: "AUTOPHAGY", color: "#ef4444", icon: "✂️" },
      { nameTh: "เซนโทรโซม", nameEn: "Centrosome", tag: "SPINDLE FIBER", color: "#8b5cf6", icon: "⭐" },
      { nameTh: "นิวคลีโอลัส", nameEn: "Nucleolus", tag: "rRNA SYNTHESIS", color: "#06b6d4", icon: "🔵" },
      { nameTh: "โปรตีเอโซม", nameEn: "Proteasome", tag: "PROTEIN DEGRADE", color: "#f97316", icon: "🗑️" },
      { nameTh: "สไปลซีโอโซม", nameEn: "Spliceosome", tag: "INTRON REMOVAL", color: "#10b981", icon: "🎞️" },
      { nameTh: "RER", nameEn: "Rough ER", tag: "MEMBRANE HOST", color: "#3b82f6", icon: "🏗️" },
      { nameTh: "โพลีโซม", nameEn: "Polysome", tag: "TRANSLATION CLUSTER", color: "#a855f7", icon: "📿" }
    ],
    correctIndex: 0
  },
  {
    id: 4,
    nameTh: "ไลโซโซม (Lysosome)",
    nameEn: "Lysosome",
    category: "ORGANELLE // DIGESTION & AUTOPHAGY",
    desc: "เวสิเคิลเยื่อหุ้มเดี่ยวที่สร้างจาก Golgi apparatus ภายในบรรจุ Hydrolytic enzymes ทำงานได้ดีที่ pH เป็นกรด (~5.0) ย่อยสลายสารและออร์แกเนลล์เสื่อมสภาพ",
    clues: [
      "ฉันมีเยื่อหุ้มเดี่ยว หลุดออกมาจาก Golgi Apparatus และพบมากในเซลล์เม็ดเลือดขาวฟาโกไซต์",
      "ภายในตัวฉันมีเอนไซม์กลุ่ม <em>Acid Hydrolases</em> ซึ่งทำงานได้ดีที่สุดที่สภาวะ pH เป็นกรด (~4.5-5.0)",
      "ฉันทำหน้าที่ทำลายเชื้อโรคที่เข้ามาในเซลล์ และย่อยออร์แกเนลล์ที่เสื่อมสภาพ (Autophagy)",
      "ถ้าเยื่อหุ้มของฉันแตกพร้อมกันทั่วเซลล์ เซลล์จะเกิดการย่อยตัวเองตายลง (Autolysis)"
    ],
    options: [
      { nameTh: "เพอรอกซิโซม", nameEn: "Peroxisome", tag: "H2O2 DETOX", color: "#00f0ff", icon: "🧪" },
      { nameTh: "ไลโซโซม", nameEn: "Lysosome", tag: "SUICIDE BAG", color: "#ef4444", icon: "🔥" },
      { nameTh: "กอลจิบอดี", nameEn: "Golgi Body", tag: "SECRETION", color: "#a855f7", icon: "📦" },
      { nameTh: "SER", nameEn: "Smooth ER", tag: "LIPID SYNTHESIS", color: "#f59e0b", icon: "🧈" },
      { nameTh: "เอนโดโซม", nameEn: "Endosome", tag: "SORTING VESICLE", color: "#3b82f6", icon: "📬" },
      { nameTh: "ฟาโกโซม", nameEn: "Phagosome", tag: "ENGULFED VESICLE", color: "#f97316", icon: "🫧" },
      { nameTh: "ไกลออกซิโซม", nameEn: "Glyoxysome", tag: "FAT TO SUGAR", color: "#10b981", icon: "🌱" },
      { nameTh: "แวคิวโอล", nameEn: "Vacuole", tag: "STORAGE", color: "#06b6d4", icon: "💧" }
    ],
    correctIndex: 1
  },
  {
    id: 5,
    nameTh: "กอลจิคอมเพล็กซ์ (Golgi Apparatus)",
    nameEn: "Golgi Apparatus",
    category: "ORGANELLE // PACKAGING & SECRETION",
    desc: "ถุงแบนเรียงซ้อนกันเป็นชั้นๆ เรียกว่า Cisternae มีด้าน Cis-face รับโปรตีนจาก RER มาเติมหมู่น้ำตาล (Glycosylation) แล้วส่งออกทางด้าน Trans-face",
    clues: [
      "โครงสร้างของฉันเป็นถุงเยื่อแบนๆ ซ้อนกันเป็นพับ เรียกว่า <em>Cisternae</em>",
      "ฉันมี 2 ด้านชัดเจน: ด้าน <em>Cis-face</em> รับถุงเวสิเคิลจาก RER และด้าน <em>Trans-face</em> ปล่อยเวสิเคิลส่งออก",
      "หน้าที่หลักของฉันคือดัดแปลง เติมหมู่น้ำตาล (Glycosylation) และแพ็คเกจโปรตีนก่อนส่งออกนอกเซลล์",
      "ฉันยังมีส่วนสำคัญในการสร้าง Acrosome ที่ส่วนหัวของอสุจิ และสร้างแผ่นกั้นเซลล์พืช (Cell Plate)"
    ],
    options: [
      { nameTh: "เอนโดพลาสมิก เรติคิวลัม", nameEn: "Rough ER", tag: "TRANSLATION HOST", color: "#3b82f6", icon: "🏗️" },
      { nameTh: "กอลจิคอมเพล็กซ์", nameEn: "Golgi Apparatus", tag: "POST OFFICE", color: "#a855f7", icon: "📮" },
      { nameTh: "ไมโครทูบูล", nameEn: "Microtubules", tag: "CYTOSKELETON", color: "#10b981", icon: "🪜" },
      { nameTh: "นิวเคลียส", nameEn: "Nucleus", tag: "GENOME VAULT", color: "#f43f5e", icon: "👑" },
      { nameTh: "เวสิเคิลขนส่ง", nameEn: "Transport Vesicle", tag: "CARGO BUBBLE", color: "#00f0ff", icon: "🚐" },
      { nameTh: "พลาสมาเมมเบรน", nameEn: "Plasma Membrane", tag: "OUTER BARRIER", color: "#f59e0b", icon: "🛡️" },
      { nameTh: "เซนโทรโซม", nameEn: "Centrosome", tag: "SPINDLE POLE", color: "#8b5cf6", icon: "⭐" },
      { nameTh: "แอโครโซม", nameEn: "Acrosome", tag: "SPERM CAP", color: "#ec4899", icon: "🏹" }
    ],
    correctIndex: 1
  },
  {
    id: 6,
    nameTh: "เพอรอกซิโซม (Peroxisome)",
    nameEn: "Peroxisome",
    category: "ORGANELLE // OXIDATION & DETOX",
    desc: "ออร์แกเนลล์เยื่อหุ้มเดี่ยว มีเอนไซม์ Catalase ช่วยย่อยสลาย Hydrogen Peroxide (H2O2) ที่เป็นพิษให้กลายเป็นน้ำและออกซิเจน พร้อมสลายกรดไขมันสายยาว (Beta-oxidation)",
    clues: [
      "ฉันมีเยื่อหุ้ม 1 ชั้น ภายในมักเห็นผลึกรูปทรงเรขาคณิตของเอนไซม์ใต้กล้องจุลทรรศน์",
      "ในระหว่างที่ฉันสลายกรดไขมันสายยาว จะเกิดสารพิษคือ <em>ไฮโดรเจนเปอร์ออกไซด์ (H2O2)</em>",
      "แต่ฉันมีเอนไซม์พิเศษคือ <em>Catalase</em> ที่สามารถสลาย H2O2 กลายเป็นน้ำ (H2O) และออกซิเจน (O2) ทันที",
      "พบมากในเซลล์ตับและเซลล์ไตเพื่อทำลายสารพิษและแอลกอฮอล์"
    ],
    options: [
      { nameTh: "เพอรอกซิโซม", nameEn: "Peroxisome", tag: "CATALASE DETOX", color: "#00f0ff", icon: "🛡️" },
      { nameTh: "ไลโซโซม", nameEn: "Lysosome", tag: "HYDROLASES", color: "#ef4444", icon: "✂️" },
      { nameTh: "SER", nameEn: "Smooth ER", tag: "DETOX & LIPID", color: "#eab308", icon: "💊" },
      { nameTh: "แวคิวโอล", nameEn: "Vacuole", tag: "STORAGE", color: "#3b82f6", icon: "💧" },
      { nameTh: "ไกลออกซิโซม", nameEn: "Glyoxysome", tag: "FAT METABOLISM", color: "#10b981", icon: "🌱" },
      { nameTh: "ไมโทคอนเดรีย", nameEn: "Mitochondria", tag: "ATP MATRIX", color: "#f59e0b", icon: "⚡" },
      { nameTh: "คลอโรพลาสต์", nameEn: "Chloroplast", tag: "CALVIN CYCLE", color: "#84cc16", icon: "☀️" },
      { nameTh: "เอนไซม์แคตาเลส", nameEn: "Catalase", tag: "H2O2 ENZYME", color: "#a855f7", icon: "🧪" }
    ],
    correctIndex: 0
  },
  {
    id: 7,
    nameTh: "เอนโดพลาสมิกเรติคิวลัมผิวเรียบ (Smooth ER)",
    nameEn: "Smooth ER",
    category: "ORGANELLE // LIPID & CALCIUM",
    desc: "โครงข่ายท่อเยื่อหุ้มที่ไม่มีไรโบโซมเกาะ ทำหน้าที่สังเคราะห์ไขมัน สเตียรอยด์ฮอร์โมน กำจัดสารพิษในตับ และสะสมแคลเซียมไอออนในเซลล์กล้ามเนื้อ (Sarcoplasmic Reticulum)",
    clues: [
      "โครงสร้างเป็นท่อกลมเชื่อมติดต่อกัน แต่ผิวภายนอกไม่มีเม็ดไรโบโซมมาเกาะ",
      "ฉันทำหน้าที่สังเคราะห์สารกลุ่มลิพิด (Lipids), ฟอสโฟลิพิด และฮอร์โมนสเตียรอยด์ เช่น เทสโทสเตอโรน",
      "ในเซลล์กล้ามเนื้อ ฉันถูกเรียกว่า <em>Sarcoplasmic Reticulum</em> ทำหน้าที่กักเก็บและปล่อย Ca2+",
      "ในเซลล์ตับ ฉันช่วยกำจัดสารพิษจำพวกยาและสารเคมีแปลกปลอม"
    ],
    options: [
      { nameTh: "RER", nameEn: "Rough ER", tag: "RIBOSOME-BOUND", color: "#8b5cf6", icon: "🧱" },
      { nameTh: "SER", nameEn: "Smooth ER", tag: "STEROID & Ca2+", color: "#f59e0b", icon: "🧬" },
      { nameTh: "กอลจิบอดี", nameEn: "Golgi Complex", tag: "SORTING", color: "#a855f7", icon: "📦" },
      { nameTh: "พลาสมาเมมเบรน", nameEn: "Plasma Membrane", tag: "BARRIER", color: "#10b981", icon: "🛡️" },
      { nameTh: "ซาร์โคพลาสมิก", nameEn: "Sarcoplasmic Reticulum", tag: "MUSCLE Ca2+", color: "#ef4444", icon: "💪" },
      { nameTh: "เพอรอกซิโซม", nameEn: "Peroxisome", tag: "BETA-OXIDATION", color: "#00f0ff", icon: "🧪" },
      { nameTh: "นิวเคลียร์เมมเบรน", nameEn: "Nuclear Membrane", tag: "DOUBLE LAYER", color: "#ec4899", icon: "👑" },
      { nameTh: "ไลโซโซม", nameEn: "Lysosome", tag: "AUTOPHAGY", color: "#f97316", icon: "✂️" }
    ],
    correctIndex: 1
  },
  {
    id: 8,
    nameTh: "เซนทริโอล (Centriole / Centrosome)",
    nameEn: "Centriole",
    category: "CYTOSKELETON // CELL DIVISION",
    desc: "ประกอบด้วย Microtubules เรียงตัวแบบ 9+0 จำนวน 1 คู่ วางตั้งฉากกัน ทำหน้าที่เป็นศูนย์กลางกำเนิดเส้นใยสปินเดิล (MTOC) ดึงโครโมโซมในระยะแบ่งเซลล์สัตว์",
    clues: [
      "ฉันไม่มีเยื่อหุ้ม พบในเซลล์สัตว์และโพรทิสต์บางชนิด แต่ไม่พบในเซลล์พืชชั้นสูง",
      "โครงสร้างเกิดจากหลอดไมโครทูบูลเรียงเป็นวงแบบ <em>9+0 (Triplets)</em>",
      "มักอยู่เป็นคู่ตั้งฉากกัน 90 องศา เรียกว่า <em>Centrosome</em>",
      "ทำหน้าที่สร้างและควบคุม <em>Spindle Fiber</em> ดึงโครมาทิดออกจากกันระหว่างระยะ Anaphase"
    ],
    options: [
      { nameTh: "เซนทริโอล", nameEn: "Centriole", tag: "SPINDLE APPARATUS", color: "#ec4899", icon: "🎯" },
      { nameTh: "เบซัลบอดี", nameEn: "Basal Body", tag: "CILIA ROOT", color: "#06b6d4", icon: "⚓" },
      { nameTh: "ไมโครฟิลาเมนต์", nameEn: "Microfilament", tag: "ACTIN CRAWL", color: "#f97316", icon: "🧵" },
      { nameTh: "ไคนีโตคอร์", nameEn: "Kinetochore", tag: "CENTROMERE DISC", color: "#84cc16", icon: "🧲" },
      { nameTh: "ไมโครทูบูล", nameEn: "Microtubule", tag: "TUBULIN TUBE", color: "#3b82f6", icon: "🪵" },
      { nameTh: "อินเตอร์มีเดียต", nameEn: "Intermediate Filament", tag: "KERATIN ROPE", color: "#eab308", icon: "🪢" },
      { nameTh: "ซิเลีย & แฟลกเจลลา", nameEn: "Cilia & Flagella", tag: "9+2 MOTILITY", color: "#10b981", icon: "🏊" },
      { nameTh: "เดสโมโซม", nameEn: "Desmosome", tag: "JUNCTION", color: "#a855f7", icon: "🔒" }
    ],
    correctIndex: 0
  },
  {
    id: 9,
    nameTh: "ATP Synthase",
    nameEn: "ATP Synthase",
    category: "MACROMOLECULE // ROTARY ENZYME",
    desc: "เอนไซม์กังหันโมเลกุลที่เยื่อหุ้มชั้นในไมโทคอนเดรียและไทลาคอยด์ ขับเคลื่อนด้วยแรงเคลื่อนโปรตอน (Proton Motive Force) หมุนสังเคราะห์ ATP จาก ADP + Pi",
    clues: [
      "ฉันไม่ใช่ทั้งเซลล์หรือออร์แกเนลล์ แต่เป็น <em>เอนไซม์โปรตีนเชิงซ้อน</em> ขนาดใหญ่ที่ฝังอยู่ในเยื่อหุ้ม",
      "ฉันมีส่วนประกอบสำคัญคือ F0 (ฝังในเยื่อหุ้ม) และ F1 (ยื่นออกมาทำปฏิกิริยาเคมี)",
      "ฉันทำงานเหมือน <em>กังหันน้ำระดับโมเลกุล</em> หมุนเมื่อมีโปรตอน (H+) ไหลผ่านตามเกรเดียนต์",
      "ผลลัพธ์จากการหมุนของฉันคือการเปลี่ยน ADP + ฟอสเฟต ให้กลายเป็น <em>ATP</em>"
    ],
    options: [
      { nameTh: "Rubisco", nameEn: "Rubisco Enzyme", tag: "CARBON FIXATION", color: "#10b981", icon: "🌱" },
      { nameTh: "ATP Synthase", nameEn: "ATP Synthase", tag: "ROTARY ENGINE", color: "#eab308", icon: "⚙️" },
      { nameTh: "DNA Polymerase", nameEn: "DNA Polymerase", tag: "REPLICATION", color: "#3b82f6", icon: "🧬" },
      { nameTh: "Sodium-Potassium Pump", nameEn: "Na+/K+ Pump", tag: "ACTIVE TRANSPORT", color: "#ef4444", icon: "⚡" },
      { nameTh: "Cytochrome c", nameEn: "Cytochrome c", tag: "ELECTRON CARRIER", color: "#ec4899", icon: "🩸" },
      { nameTh: "Helicase", nameEn: "DNA Helicase", tag: "UNZIP STRAND", color: "#06b6d4", icon: "✂️" },
      { nameTh: "Caspase-3", nameEn: "Caspase-3", tag: "APOPTOSIS", color: "#f97316", icon: "💀" },
      { nameTh: "RNA Polymerase", nameEn: "RNA Polymerase", tag: "TRANSCRIPTION", color: "#a855f7", icon: "📜" }
    ],
    correctIndex: 1
  },
  {
    id: 10,
    nameTh: "โซเดียม-โพแทสเซียม ปั๊ม (Na+/K+ Pump)",
    nameEn: "Sodium-Potassium Pump",
    category: "MEMBRANE TRANSPORT // ACTIVE PUMP",
    desc: "โปรตีนขนส่งแบบปฐมภูมิ (Primary Active Transport) ใช้ 1 ATP ปั๊ม 3 Na+ ออกนอกเซลล์ และนำ 2 K+ เข้าสู่เซลล์ เพื่อรักษาระดับ Resting Membrane Potential ของเซลล์ประสาท",
    clues: [
      "ฉันเป็นโปรตีนขนส่งแบบข้ามเยื่อหุ้มเซลล์ (Transmembrane Protein) ที่ใช้พลังงาน ATP โดยตรง",
      "ฉันเป็นตัวอย่างคลาสสิกของกระบวนการ <em>Active Transport</em> ขนส่งสารต้านความเข้มข้น",
      "ในแต่ละรอบ ฉันจะส่งไอออนโซเดียม <em>3 Na+ ออกนอกเซลล์</em> และดึง <em>2 K+ เข้าสู่เซลล์</em>",
      "หน้าที่สำคัญยิ่งของฉันคือการรักษาระดับความต่างศักย์ขณะพัก (Resting Potential ~-70 mV) ของเซลล์ประสาท"
    ],
    options: [
      { nameTh: "Aquaporin", nameEn: "Aquaporin Channel", tag: "WATER OSMOSIS", color: "#06b6d4", icon: "💧" },
      { nameTh: "โซเดียม-โพแทสเซียม ปั๊ม", nameEn: "Na+/K+ Pump", tag: "RESTING POTENTIAL", color: "#f43f5e", icon: "🔋" },
      { nameTh: "GLUT Transporter", nameEn: "Glucose Transporter", tag: "FACILITATED", color: "#a855f7", icon: "🍬" },
      { nameTh: "Voltage-gated Ca2+", nameEn: "Ca2+ Channel", tag: "ACTION POTENTIAL", color: "#eab308", icon: "⚡" },
      { nameTh: "Proton Pump", nameEn: "H+ ATPase", tag: "STOMACH ACID", color: "#ec4899", icon: "🍋" },
      { nameTh: "CFTR Channel", nameEn: "CFTR Cl- Channel", tag: "CHLORIDE FLUX", color: "#10b981", icon: "🌊" },
      { nameTh: "ABC Transporter", nameEn: "ABC Cassette", tag: "MDR PUMP", color: "#f97316", icon: "📦" },
      { nameTh: "GABA Receptor", nameEn: "GABA-A Channel", tag: "INHIBITORY", color: "#3b82f6", icon: "🧠" }
    ],
    correctIndex: 1
  },
  {
    id: 11,
    nameTh: "แวคิวโอลกลาง (Central Vacuole)",
    nameEn: "Central Vacuole",
    category: "PLANT ORGANELLE // TURGOR PRESSURE",
    desc: "ถุงเยื่อหุ้มเดี่ยวขนาดใหญ่ (Tonoplast) ในเซลล์พืช ทำหน้าที่สะสมน้ำ แร่ธาตุ รงควัตถุแอนโทไซยานิน และสร้างแรงดันเต่ง (Turgor Pressure)",
    clues: [
      "ในเซลล์พืชที่โตเต็มวัย ฉันจะขยายตัวจนกินพื้นที่มากกว่า 80-90% ของปริมาตรเซลล์ทั้งหมด",
      "เยื่อหุ้มของฉันมีชื่อเรียกเฉพาะว่า <em>Tonoplast</em> และของเหลวข้างในเรียกว่า Cell Sap",
      "ฉันสะสมน้ำ ของเสีย ผลึกแคลเซียมออกซาเลต และสารสีแอนโทไซยานิน (Anthocyanin) สีม่วงแดง",
      "การอุ้มน้ำของฉันสร้าง <em>แรงดันเต่ง (Turgor Pressure)</em> ช่วยพยุงให้ลำต้นพืชอวบน้ำตั้งตรงได้"
    ],
    options: [
      { nameTh: "คอนแทร็กไทล์ แวคิวโอล", nameEn: "Contractile Vacuole", tag: "WATER EXPULSION", color: "#3b82f6", icon: "🫧" },
      { nameTh: "ฟู้ด แวคิวโอล", nameEn: "Food Vacuole", tag: "PHAGOCYTOSIS", color: "#f97316", icon: "🍔" },
      { nameTh: "แวคิวโอลกลาง", nameEn: "Central Vacuole", tag: "PLANT TURGIDITY", color: "#10b981", icon: "🌱" },
      { nameTh: "กอลจิบอดี", nameEn: "Golgi Body", tag: "CELL PLATE", color: "#a855f7", icon: "📦" },
      { nameTh: "โทโนพลาสต์", nameEn: "Tonoplast", tag: "VACUOLAR MEMBRANE", color: "#06b6d4", icon: "🛡️" },
      { nameTh: "อะไมโลพลาสต์", nameEn: "Amyloplast", tag: "STARCH GRAIN", color: "#eab308", icon: "🥔" },
      { nameTh: "เพอรอกซิโซม", nameEn: "Peroxisome", tag: "CATALASE", color: "#00f0ff", icon: "🧪" },
      { nameTh: "ไลโซโซม", nameEn: "Lysosome", tag: "HYDROLYTIC", color: "#ef4444", icon: "✂️" }
    ],
    correctIndex: 2
  },
  {
    id: 12,
    nameTh: "นิวคลีโอลัส (Nucleolus)",
    nameEn: "Nucleolus",
    category: "NUCLEAR BODY // RIBOSOME FACTORY",
    desc: "บริเวณทึบแสงภายในนิวเคลียสที่ไม่มีเยื่อหุ้ม เกิดจากการรวมตัวของยีน rRNA ทำหน้าที่สังเคราะห์และประกอบหน่วยย่อยของไรโบโซม",
    clues: [
      "ฉันเป็นโครงสร้างทรงกลมทึบแสงเข้มที่มองเห็นเด่นชัดที่สุดภายในนิวเคลียส",
      "ฉันไม่มีเยื่อหุ้มแยกต่างหาก แต่เกิดจากสายดีเอ็นเอบริเวณ <em>NOR (Nucleolar Organizer Region)</em> มารวมตัวกัน",
      "ฉันเป็นแหล่งถอดรหัสและสังเคราะห์ <em>rRNA (Ribosomal RNA)</em> ปริมาณมหาศาล",
      "ฉันนำ rRNA มาประกอบรวมกับโปรตีน เพื่อสร้างเป็น Subunits ของ <em>Ribosome</em> ส่งออกไปทาง Nuclear Pore"
    ],
    options: [
      { nameTh: "นิวคลีโอลัส", nameEn: "Nucleolus", tag: "rRNA SYNTHESIS", color: "#8b5cf6", icon: "🔵" },
      { nameTh: "โครมาทิน", nameEn: "Chromatin", tag: "GENETIC FIBER", color: "#06b6d4", icon: "🧬" },
      { nameTh: "นิวเคลียร์ลามินา", nameEn: "Nuclear Lamina", tag: "STRUCTURAL MESH", color: "#64748b", icon: "🕸️" },
      { nameTh: "เซนโตรเมียร์", nameEn: "Centromere", tag: "CHROMOSOME WAIST", color: "#f43f5e", icon: "🎀" },
      { nameTh: "เทโลเมียร์", nameEn: "Telomere", tag: "CHROMOSOME CAP", color: "#eab308", icon: "🛡️" },
      { nameTh: "เฮเทอโรโครมาทิน", nameEn: "Heterochromatin", tag: "CONDENSED SILENT", color: "#475569", icon: "🔒" },
      { nameTh: "ยูโครมาทิน", nameEn: "Euchromatin", tag: "ACTIVE TRANSCRIPTION", color: "#10b981", icon: "📖" },
      { nameTh: "นิวเคลียร์พอร์", nameEn: "Nuclear Pore", tag: "GATEWAY", color: "#ec4899", icon: "🚪" }
    ],
    correctIndex: 0
  }
];

// --- 3. Main 3D Card Detective Game Engine ---
class WhoAmIGame {
  constructor() {
    this.sound = new SoundController();
    this.currentCaseIndex = 0;
    this.score = 0;
    this.streak = 0;
    this.cluesRevealedCount = 1;
    this.attemptsInCase = 0;
    this.isDuoMode = false;
    this.isTransitioning = false;

    // Three.js State
    this.container = document.getElementById('canvas-container');
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.cardMeshes = [];
    this.hoveredCard = null;
    this.selectedCard = null;
    this.deskMesh = null;
    this.particles = null;

    // Center offset to align 3D table perfectly to the right of the dossier panel
    this.tableCenterX = 1.35;

    this.initThree();
    this.initDOM();
    this.loadCase(0);
    this.animate();
  }

  // --- Initialize Three.js 3D Scene ---
  initThree() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x07090e);
    this.scene.fog = new THREE.FogExp2(0x07090e, 0.035);

    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    // Position camera aimed right at tableCenterX
    this.camera.position.set(this.tableCenterX, 4.3, 6.8);
    this.camera.lookAt(this.tableCenterX, 0.5, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    // Dynamic Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    this.scene.add(ambientLight);

    const pointLightCyan = new THREE.PointLight(0x00f0ff, 2.2, 18);
    pointLightCyan.position.set(this.tableCenterX - 3.5, 4.5, 3.5);
    this.scene.add(pointLightCyan);

    const pointLightPurple = new THREE.PointLight(0xa855f7, 2.2, 18);
    pointLightPurple.position.set(this.tableCenterX + 3.5, 4.5, 3.5);
    this.scene.add(pointLightPurple);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.3);
    keyLight.position.set(this.tableCenterX, 9, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    this.scene.add(keyLight);

    // 3D Laboratory Hologram Desk
    this.createDesk();

    // Ambient Cyber Particles
    this.createParticles();

    // Window Resize & Mouse Listeners
    window.addEventListener('resize', () => this.onWindowResize());
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    window.addEventListener('click', (e) => this.onMouseClick(e));
  }

  createDesk() {
    const deskGeo = new THREE.BoxGeometry(11, 0.3, 6.5);
    const deskMat = new THREE.MeshStandardMaterial({
      color: 0x0c101a,
      roughness: 0.25,
      metalness: 0.8,
    });
    this.deskMesh = new THREE.Mesh(deskGeo, deskMat);
    this.deskMesh.position.set(this.tableCenterX, -0.15, 0);
    this.deskMesh.receiveShadow = true;
    this.scene.add(this.deskMesh);

    // Glowing Holographic Desk Grid Lines
    const grid = new THREE.GridHelper(10, 20, 0x00f0ff, 0x1e293b);
    grid.position.set(this.tableCenterX, 0.01, 0);
    this.scene.add(grid);

    // Holographic Cyber Rings
    const ringGeo = new THREE.RingGeometry(2.0, 2.04, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, side: THREE.DoubleSide, transparent: true, opacity: 0.35 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(this.tableCenterX, 0.02, 0.3);
    this.scene.add(ring);
  }

  createParticles() {
    const pCount = 240;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);

    for (let i = 0; i < pCount * 3; i += 3) {
      pPos[i] = (Math.random() - 0.5) * 14 + this.tableCenterX;
      pPos[i + 1] = Math.random() * 6;
      pPos[i + 2] = (Math.random() - 0.5) * 10;
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.04,
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    this.particles = new THREE.Points(pGeo, pMat);
    this.scene.add(this.particles);
  }

  // --- Dynamic Canvas Textures for 3D Cards ---
  createCardTexture(option, isBack = false) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 768;
    const ctx = canvas.getContext('2d');

    if (isBack) {
      // 3D Card Back: Cyber Confidential Bio-Seal
      const grad = ctx.createLinearGradient(0, 0, 512, 768);
      grad.addColorStop(0, '#0c101c');
      grad.addColorStop(0.5, '#161c2d');
      grad.addColorStop(1, '#07090e');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 768);

      // Cyber Frame
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 12;
      ctx.strokeRect(20, 20, 472, 728);

      ctx.strokeStyle = 'rgba(168, 85, 247, 0.5)';
      ctx.lineWidth = 4;
      ctx.strokeRect(36, 36, 440, 696);

      // Central Holographic Hexagon Bio-Hazard Seal
      ctx.save();
      ctx.translate(256, 340);
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const x = 110 * Math.cos(angle);
        const y = 110 * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 6;
      ctx.stroke();

      ctx.fillStyle = 'rgba(0, 240, 255, 0.1)';
      ctx.fill();
      ctx.restore();

      // Big Bio-Mystery Symbol
      ctx.fillStyle = '#00f0ff';
      ctx.font = 'bold 90px "Prompt", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('?', 256, 375);

      // Labels
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 22px "JetBrains Mono", monospace';
      ctx.fillText('CYTO-ARCHIVE // SPECIMEN', 256, 520);

      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 18px "JetBrains Mono", monospace';
      ctx.fillText('TOP SECRET BIOLOGICAL DOSSIER', 256, 555);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.font = '16px "JetBrains Mono", monospace';
      ctx.fillText('CLICK TO ARREST / REVEAL IDENTITY', 256, 680);

    } else {
      // 3D Card Front: Identity Reveal
      const grad = ctx.createLinearGradient(0, 0, 512, 768);
      grad.addColorStop(0, '#101726');
      grad.addColorStop(1, '#070a12');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 768);

      // Glowing Neon Accent Border
      ctx.strokeStyle = option.color || '#00f0ff';
      ctx.lineWidth = 14;
      ctx.strokeRect(20, 20, 472, 728);

      // Category Tag Header
      ctx.fillStyle = option.color || '#00f0ff';
      ctx.fillRect(36, 36, 440, 44);
      ctx.fillStyle = '#000';
      ctx.font = 'bold 20px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(option.tag || 'BIOMOLECULE', 256, 66);

      // Biological Icon / Avatar Box
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 3;
      ctx.fillRect(56, 110, 400, 310);
      ctx.strokeRect(56, 110, 400, 310);

      ctx.font = '130px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(option.icon || '🧬', 256, 315);

      // Specimen Thai Name
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 34px "Prompt", sans-serif';
      ctx.fillText(option.nameTh, 256, 480);

      // Specimen English Name
      ctx.fillStyle = option.color || '#00f0ff';
      ctx.font = 'bold 22px "JetBrains Mono", monospace';
      ctx.fillText(option.nameEn, 256, 525);

      // Cyber bar decoration
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(70, 560, 372, 2);

      // Holographic Verification Stamp
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 20px "Prompt", sans-serif';
      ctx.fillText('✔ ยืนยันพิกัดทางชีววิทยา', 256, 615);

      ctx.fillStyle = '#64748b';
      ctx.font = '16px "JetBrains Mono", monospace';
      ctx.fillText('IDENTITY VERIFIED // CAMPBELL 12TH ED', 256, 655);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 8;
    return texture;
  }

  // --- Spawn & Deal 3D Cards in a Wide Multi-Card Arc (8 Cards) ---
  spawnCards(currCase) {
    // Clear old card meshes
    this.cardMeshes.forEach(mesh => {
      this.scene.remove(mesh);
      if (mesh.geometry) mesh.geometry.dispose();
    });
    this.cardMeshes = [];

    const options = currCase.options;
    const count = options.length;
    
    // Scale cards to comfortably fit 8 cards in a gorgeous fan layout
    const cardWidth = 0.92;
    const cardHeight = 1.45;
    const cardDepth = 0.02;

    // Total arc span centered around this.tableCenterX
    const totalSpan = 5.2;
    const step = totalSpan / (count - 1);
    const startX = this.tableCenterX - totalSpan / 2;

    options.forEach((opt, idx) => {
      const cardGeo = new THREE.BoxGeometry(cardWidth, cardHeight, cardDepth);
      
      const frontTex = this.createCardTexture(opt, false);
      const backTex = this.createCardTexture(opt, true);
      const sideMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.3 });

      const materials = [
        sideMat, // right
        sideMat, // left
        sideMat, // top
        sideMat, // bottom
        new THREE.MeshStandardMaterial({ map: frontTex, roughness: 0.3, metalness: 0.2 }), // Front (+Z)
        new THREE.MeshStandardMaterial({ map: backTex, roughness: 0.3, metalness: 0.2 })  // Back (-Z)
      ];

      const cardMesh = new THREE.Mesh(cardGeo, materials);
      cardMesh.castShadow = true;
      cardMesh.receiveShadow = true;

      // Arc Layout: Cards fan out with a natural parabolic depth curve
      const posX = startX + idx * step;
      const normalizedOffset = (posX - this.tableCenterX) / (totalSpan / 2); // -1 to +1
      
      const posY = 1.05 - Math.abs(normalizedOffset) * 0.12;
      const posZ = 0.6 - Math.pow(Math.abs(normalizedOffset), 1.6) * 0.55; // Curve backward at edges
      
      const rotY = -normalizedOffset * 0.22; // Fan angle facing slightly inward towards center
      const rotZ = -normalizedOffset * 0.08;
      const rotX = -0.18;

      // Start above desk with staggered deal animation
      cardMesh.position.set(posX, posY + 3.0, posZ);
      cardMesh.rotation.set(rotX, rotY, rotZ);

      // Metadata for raycasting & gameplay
      cardMesh.userData = {
        optionIndex: idx,
        isCorrect: idx === currCase.correctIndex,
        optionData: opt,
        origX: posX,
        origY: posY,
        origZ: posZ,
        origRotX: rotX,
        origRotY: rotY,
        origRotZ: rotZ,
        isFlipped: false
      };

      this.scene.add(cardMesh);
      this.cardMeshes.push(cardMesh);

      // Smooth Deal Animation using TWEEN
      new TWEEN.Tween(cardMesh.position)
        .to({ x: posX, y: posY, z: posZ }, 550 + idx * 80)
        .easing(TWEEN.Easing.Back.Out)
        .start();
    });

    this.sound.playShuffle();
  }

  // --- 4. Game Logic & Case Management ---
  loadCase(index) {
    this.currentCaseIndex = index % BIO_CASES.length;
    const currCase = BIO_CASES[this.currentCaseIndex];
    this.cluesRevealedCount = 1;
    this.attemptsInCase = 0;
    this.isTransitioning = false;

    // Update Top Navigation
    document.getElementById('case-val').innerText = `${this.currentCaseIndex + 1} / ${BIO_CASES.length}`;
    document.getElementById('dossier-case-id').innerText = `CASE #${String(this.currentCaseIndex + 1).padStart(2, '0')}`;

    // Render Clues in Dossier Panel
    this.renderClues(currCase);

    // Spawn 8 3D Cards on Desk
    this.spawnCards(currCase);

    // Reset Guidance Message
    document.getElementById('guide-text').innerText = `สำรับ 8 ใบ: หมุนดูการ์ดบนโต๊ะ แล้วคลิกการ์ดที่คุณมั่นใจว่าเป็นคำตอบ!`;
  }

  renderClues(currCase) {
    const cluesContainer = document.getElementById('clues-container');
    cluesContainer.innerHTML = '';

    currCase.clues.forEach((clueText, idx) => {
      const clueDiv = document.createElement('div');
      clueDiv.className = 'clue-item';

      if (idx < this.cluesRevealedCount) {
        clueDiv.innerHTML = `
          <div class="clue-num">
            <span>CLUE #0${idx + 1}</span>
            <span>ความน่าเชื่อถือ 100%</span>
          </div>
          <div class="clue-text">${clueText}</div>
        `;
      } else {
        clueDiv.classList.add('hidden-clue');
        clueDiv.innerHTML = `
          <span>🔒 คำใบ้ระดับลึก #0${idx + 1} (คลิกปุ่มเปิดคำใบ้เพื่อปลดล็อก)</span>
        `;
      }
      cluesContainer.appendChild(clueDiv);
    });

    // Update Clue Button State
    const clueBtn = document.getElementById('reveal-clue-btn');
    if (this.cluesRevealedCount >= currCase.clues.length) {
      clueBtn.disabled = true;
      clueBtn.querySelector('.clue-btn-text').innerText = 'เปิดคำใบ้ครบทุกระดับแล้ว';
    } else {
      clueBtn.disabled = false;
      const penalty = 50 * this.cluesRevealedCount;
      clueBtn.querySelector('.clue-btn-text').innerText = `เปิดคำใบ้ถัดไป (-${penalty} คะแนน)`;
    }
  }

  revealNextClue() {
    const currCase = BIO_CASES[this.currentCaseIndex];
    if (this.cluesRevealedCount < currCase.clues.length) {
      this.cluesRevealedCount++;
      this.sound.playClueReveal();
      this.renderClues(currCase);
    }
  }

  shuffleCurrentCards() {
    const currCase = BIO_CASES[this.currentCaseIndex];
    this.spawnCards(currCase);
    this.triggerHoloSignal('🎴 สับและจัดเรียงสำรับการ์ด 8 ใบใหม่!');
  }

  // --- Player Card Selection Handling ---
  selectCard(cardMesh) {
    if (this.isTransitioning) return;
    this.attemptsInCase++;
    const isCorrect = cardMesh.userData.isCorrect;
    const currCase = BIO_CASES[this.currentCaseIndex];

    // Dramatic 3D Card Flip & Lift Animation
    new TWEEN.Tween(cardMesh.position)
      .to({ y: 1.65, z: 1.5 }, 350)
      .easing(TWEEN.Easing.Cubic.Out)
      .chain(
        new TWEEN.Tween(cardMesh.rotation)
          .to({ y: Math.PI * 2, x: 0, z: 0 }, 500)
          .easing(TWEEN.Easing.Back.Out)
      )
      .start();

    if (isCorrect) {
      this.sound.playSuccess();
      this.streak++;
      const cluePenalty = (this.cluesRevealedCount - 1) * 50;
      const attemptPenalty = (this.attemptsInCase - 1) * 100;
      const earned = Math.max(100, (600 - cluePenalty - attemptPenalty) * (1 + this.streak * 0.2));
      this.score += Math.round(earned);

      this.updateStats();

      // Confetti & Particle Celebration
      if (window.confetti) {
        window.confetti({
          particleCount: 90,
          spread: 80,
          origin: { x: 0.65, y: 0.55 }
        });
      }

      setTimeout(() => {
        this.showVictoryModal(currCase, earned);
      }, 700);

    } else {
      this.sound.playWrong();
      this.streak = 0;
      this.updateStats();

      // Shake Card
      const origX = cardMesh.userData.origX;
      new TWEEN.Tween(cardMesh.position)
        .to({ x: origX + 0.1 }, 60)
        .yoyo(true)
        .repeat(5)
        .chain(
          new TWEEN.Tween(cardMesh.position).to({ x: origX, y: cardMesh.userData.origY, z: cardMesh.userData.origZ }, 200)
        )
        .start();

      document.getElementById('guide-text').innerText = `❌ ยังไม่ถูกต้อง! ลองดูคำใบ้ในแฟ้มและเลือกจากการ์ด 8 ใบอีกครั้ง`;
    }
  }

  showVictoryModal(currCase, earnedScore) {
    const modal = document.getElementById('result-modal');
    document.getElementById('modal-target-name').innerText = currCase.nameEn;
    document.getElementById('modal-bio-tag').innerText = currCase.category;
    document.getElementById('modal-bio-title').innerText = `${currCase.nameTh} (${currCase.nameEn})`;
    document.getElementById('modal-bio-desc').innerText = currCase.desc;
    document.getElementById('modal-round-score').innerText = `+${Math.round(earnedScore)}`;
    document.getElementById('modal-clues-used').innerText = `${this.cluesRevealedCount} / 4`;
    document.getElementById('modal-accuracy').innerText = this.attemptsInCase === 1 ? '100% (ครั้งแรก!)' : `ครั้งที่ ${this.attemptsInCase}`;

    modal.classList.add('show');
  }

  hideVictoryModal() {
    document.getElementById('result-modal').classList.remove('show');
  }

  nextCase() {
    this.hideVictoryModal();
    this.loadCase(this.currentCaseIndex + 1);
  }

  replayCase() {
    this.hideVictoryModal();
    this.loadCase(this.currentCaseIndex);
  }

  updateStats() {
    document.getElementById('score-val').innerText = this.score;
    document.getElementById('streak-val').innerText = `x${this.streak}`;
  }

  // --- Interaction Listeners ---
  initDOM() {
    document.getElementById('reveal-clue-btn').addEventListener('click', () => this.revealNextClue());
    
    document.getElementById('modal-next-btn').addEventListener('click', () => this.nextCase());
    document.getElementById('modal-replay-btn').addEventListener('click', () => this.replayCase());

    // Shuffle Deck Button
    const shuffleBtn = document.getElementById('shuffle-deck-btn');
    if (shuffleBtn) {
      shuffleBtn.addEventListener('click', () => this.shuffleCurrentCards());
    }

    // Toggle Duo / Solo Mode
    const toggleModeBtn = document.getElementById('toggle-mode-btn');
    toggleModeBtn.addEventListener('click', () => {
      this.isDuoMode = !this.isDuoMode;
      const banner = document.getElementById('duo-role-banner');
      const buzzers = document.getElementById('duo-buzzers');
      if (this.isDuoMode) {
        toggleModeBtn.querySelector('.btn-txt').innerText = 'โหมดเล่นเดี่ยว (Solo Detective)';
        banner.style.display = 'flex';
        buzzers.style.display = 'block';
        this.triggerHoloSignal('👥 เข้าสู่โหมดคู่: ผู้เล่น 1 อ่านคำใบ้ & ผู้เล่น 2 เลือกการ์ด');
      } else {
        toggleModeBtn.querySelector('.btn-txt').innerText = 'โหมดคู่ (Co-op Duo)';
        banner.style.display = 'none';
        buzzers.style.display = 'none';
        this.triggerHoloSignal('🕵️ โหมดเล่นเดี่ยว: วิเคราะห์แฟ้มลับ');
      }
    });

    // Bio Signal Quick Buzzers
    document.querySelectorAll('.buzzer-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const text = e.currentTarget.getAttribute('data-buzz');
        this.sound.playBuzzer();
        this.triggerHoloSignal(text);
      });
    });

    // Sound Hint Button
    document.getElementById('sound-hint-btn').addEventListener('click', () => {
      this.sound.playClueReveal();
      this.triggerHoloSignal('🧬 สัญญาณเรดาร์ชีวภาพตรวจพบโครงสร้างเฉพาะตัว!');
    });

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        this.revealNextClue();
      }
    });

    // Default duo banner state
    document.getElementById('duo-role-banner').style.display = 'none';
    document.getElementById('duo-buzzers').style.display = 'none';
  }

  triggerHoloSignal(text) {
    const signal = document.getElementById('holo-signal');
    const signalText = document.getElementById('holo-signal-text');
    signalText.innerText = text;
    signal.classList.add('active');
    setTimeout(() => {
      signal.classList.remove('active');
    }, 2200);
  }

  onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  onMouseMove(event) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.cardMeshes);

    if (intersects.length > 0) {
      const hitCard = intersects[0].object;
      if (this.hoveredCard !== hitCard) {
        if (this.hoveredCard) this.resetCardHover(this.hoveredCard);
        this.hoveredCard = hitCard;
        this.applyCardHover(this.hoveredCard);
        this.sound.playCardHover();
      }
    } else {
      if (this.hoveredCard) {
        this.resetCardHover(this.hoveredCard);
        this.hoveredCard = null;
      }
    }
  }

  applyCardHover(card) {
    document.body.style.cursor = 'pointer';
    new TWEEN.Tween(card.position)
      .to({ y: card.userData.origY + 0.3, z: card.userData.origZ + 0.45 }, 180)
      .easing(TWEEN.Easing.Cubic.Out)
      .start();

    new TWEEN.Tween(card.rotation)
      .to({ x: 0.04, y: 0, z: 0 }, 180)
      .start();
  }

  resetCardHover(card) {
    document.body.style.cursor = 'default';
    new TWEEN.Tween(card.position)
      .to({ y: card.userData.origY, z: card.userData.origZ }, 200)
      .easing(TWEEN.Easing.Cubic.Out)
      .start();

    new TWEEN.Tween(card.rotation)
      .to({ x: card.userData.origRotX, y: card.userData.origRotY, z: card.userData.origRotZ }, 200)
      .start();
  }

  onMouseClick(event) {
    // Only raycast if click didn't land on UI elements
    if (event.target.closest('.dossier-panel') || event.target.closest('.top-nav') || event.target.closest('.result-modal-box') || event.target.closest('.guidance-card')) {
      return;
    }

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.cardMeshes);

    if (intersects.length > 0) {
      const clickedCard = intersects[0].object;
      this.selectCard(clickedCard);
    }
  }

  // --- Main Animation Loop ---
  animate(time) {
    requestAnimationFrame((t) => this.animate(t));
    TWEEN.update();

    // Ambient particle drift
    if (this.particles) {
      this.particles.rotation.y += 0.0008;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

// Instantiate Game on DOM Load
window.addEventListener('DOMContentLoaded', () => {
  window.game = new WhoAmIGame();
});
