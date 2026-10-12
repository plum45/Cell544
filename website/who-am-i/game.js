/**
 * WHO AM I? (ทายฉันสิ: แฟ้มลับชีววิทยา 3 มิติ)
 * 24+ Biological Cards Unified Master Deck & Multi-Room Matchmaking Engine
 * Featuring Real Biological Specimen Photography & Clean Crisp White Card Design
 * Powered by Three.js, Web Audio Synth, PeerJS (WebRTC), & BroadcastChannel
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
    this.playTone(520, 'sine', 0.06, 0.06);
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

  playCardEliminate() {
    this.playTone(280, 'sine', 0.12, 0.1);
  }

  playMessageChime() {
    this.playTone(659.25, 'sine', 0.12, 0.12);
    setTimeout(() => this.playTone(880, 'sine', 0.18, 0.12), 80);
  }

  playSuccess() {
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'sine', 0.3, 0.2), idx * 90);
    });
  }

  playWrong() {
    this.playTone(220, 'sawtooth', 0.25, 0.2);
    setTimeout(() => this.playTone(164.81, 'sawtooth', 0.35, 0.2), 160);
  }
}

// --- 2. Master Pool of 24+ Biological Cards (with Real Photography on Crisp White Background) ---
const MASTER_CARD_POOL = [
  {
    id: 1,
    nameTh: "ไมโทคอนเดรีย",
    nameEn: "Mitochondria",
    tag: "POWERHOUSE",
    color: "#ea580c",
    icon: "⚡",
    img: "../img/08_mitochondria.jpg",
    category: "ORGANELLE // ENERGY FACTORY",
    desc: "ออร์แกเนลล์เยื่อหุ้ม 2 ชั้น แหล่งสร้าง ATP หลักของเซลล์ผ่าน Krebs Cycle และ Oxidative Phosphorylation มี Circular DNA และ 70S Ribosome เป็นของตัวเอง",
    clues: [
      "ฉันมีเยื่อหุ้ม 2 ชั้น (Double Membrane) โดยเยื่อชั้นในพับทบเป็นรอยหยักเรียกว่า <em>Cristae</em>",
      "ภายในตัวฉันมีของเหลวที่เรียกว่า <em>Matrix</em> บรรจุเอนไซม์สำหรับวัฏจักรเครบส์ (Krebs Cycle)",
      "ฉันมีสารพันธุกรรม (Circular DNA) และไรโบโซมขนาด 70S เป็นของตัวเอง ถ่ายทอดผ่านทางแม่",
      "ฉายาของฉันคือ <em>Powerhouse of the Cell</em> ผลิต ATP มหาศาลให้กับเซลล์ที่มีเมแทบอลิซึมสูง"
    ]
  },
  {
    id: 2,
    nameTh: "คลอโรพลาสต์",
    nameEn: "Chloroplast",
    tag: "SOLAR HARVEST",
    color: "#16a34a",
    icon: "🍃",
    img: "../img/02_gene_regulation.jpg",
    category: "ORGANELLE // PHOTOSYNTHESIS",
    desc: "พลาสติดที่พบในพืชและสาหร่าย ภายในมี Thylakoid เรียงซ้อนเป็น Granum บรรจุรงควัตถุ Chlorophyll ดักจับพลังงานแสงเพื่อสร้างน้ำตาล",
    clues: [
      "ฉันพบเฉพาะในเซลล์พืชและสาหร่าย (Algae) แต่ไม่พบในเซลล์สัตว์และเห็ดรา",
      "ภายในฉันมีถุงแบนๆ เรียกว่า <em>Thylakoid</em> ซ้อนกันเป็นตั้งเรียกว่า <em>Granum</em>",
      "มีของเหลวรอบๆ เรียกว่า <em>Stroma</em> ซึ่งเกิดปฏิกิริยาตรึงคาร์บอนไดออกไซด์ (Calvin Cycle)",
      "ฉันมีรงควัตถุสีเขียว (Chlorophyll) ดักจับพลังงานแสงอาทิตย์เปลี่ยนเป็นพลังงานเคมี"
    ]
  },
  {
    id: 3,
    nameTh: "ไรโบโซม",
    nameEn: "Ribosome",
    tag: "TRANSLATION",
    color: "#db2777",
    icon: "🧬",
    img: "../img/09_ribosome.jpg",
    category: "MOLECULAR MACHINE // TRANSLATION",
    desc: "อนุภาคไร้เยื่อหุ้ม ประกอบด้วย rRNA และโปรตีน ทำหน้าที่อ่านรหัสพันธุกรรม mRNA เพื่อสังเคราะห์สาย Polypeptide",
    clues: [
      "ฉันไม่มีเยื่อหุ้มเซลล์ (Non-membrane bound) พบได้ทั้งในโพรแคริโอตและยูแคริโอต",
      "ประกอบด้วย 2 หน่วยย่อย (Subunits) คือ หน่วยเล็ก (Small) และหน่วยใหญ่ (Large)",
      "มีทั้งชนิดที่ลอยอิสระในไซโทพลาซึม และชนิดที่เกาะอยู่บนเยื่อหุ้ม RER",
      "ฉันคือโรงงานประกอบกรดอะมิโนเป็นโปรตีนผ่านกระบวนการ <em>Translation</em>"
    ]
  },
  {
    id: 4,
    nameTh: "ไลโซโซม",
    nameEn: "Lysosome",
    tag: "SUICIDE BAG",
    color: "#dc2626",
    icon: "✂️",
    img: "../img/05_apoptosis.jpg",
    category: "ORGANELLE // DIGESTION & AUTOPHAGY",
    desc: "เวสิเคิลเยื่อหุ้มเดี่ยว ภายในบรรจุ Hydrolytic enzymes ทำงานได้ดีที่ pH เป็นกรด (~5.0) ย่อยสลายสารและออร์แกเนลล์เสื่อมสภาพ",
    clues: [
      "ฉันมีเยื่อหุ้มเดี่ยว หลุดออกมาจาก Golgi Apparatus และพบมากในเซลล์เม็ดเลือดขาวฟาโกไซต์",
      "ภายในตัวฉันมีเอนไซม์กลุ่ม <em>Acid Hydrolases</em> ซึ่งทำงานได้ดีที่สุดที่สภาวะ pH เป็นกรด (~4.5-5.0)",
      "ฉันทำหน้าที่ทำลายเชื้อโรคที่เข้ามาในเซลล์ และย่อยออร์แกเนลล์ที่เสื่อมสภาพ (Autophagy)",
      "ถ้าเยื่อหุ้มของฉันแตกพร้อมกันทั่วเซลล์ เซลล์จะเกิดการย่อยตัวเองตายลง (Autolysis)"
    ]
  },
  {
    id: 5,
    nameTh: "กอลจิคอมเพล็กซ์",
    nameEn: "Golgi Complex",
    tag: "POST OFFICE",
    color: "#9333ea",
    icon: "📦",
    img: "../img/04_cellular_response.jpg",
    category: "ORGANELLE // PACKAGING & SECRETION",
    desc: "ถุงแบนเรียงซ้อนกันเป็นชั้นๆ Cisternae ด้าน Cis-face รับโปรตีนจาก RER มาเติมหมู่น้ำตาล (Glycosylation) แล้วส่งออกทาง Trans-face",
    clues: [
      "โครงสร้างของฉันเป็นถุงเยื่อแบนๆ ซ้อนกันเป็นพับ เรียกว่า <em>Cisternae</em>",
      "ฉันมี 2 ด้านชัดเจน: ด้าน <em>Cis-face</em> รับถุงเวสิเคิล และด้าน <em>Trans-face</em> ปล่อยเวสิเคิลส่งออก",
      "หน้าที่หลักของฉันคือดัดแปลง เติมหมู่น้ำตาล (Glycosylation) และแพ็คเกจโปรตีนก่อนส่งออก",
      "ฉันยังมีส่วนสำคัญในการสร้าง Acrosome ที่ส่วนหัวของอสุจิ และสร้างแผ่นกั้นเซลล์พืช (Cell Plate)"
    ]
  },
  {
    id: 6,
    nameTh: "เพอรอกซิโซม",
    nameEn: "Peroxisome",
    tag: "CATALASE DETOX",
    color: "#0284c7",
    icon: "🧪",
    img: "../img/11_enzyme.jpg",
    category: "ORGANELLE // OXIDATION & DETOX",
    desc: "ออร์แกเนลล์เยื่อหุ้มเดี่ยว มีเอนไซม์ Catalase ช่วยย่อยสลาย Hydrogen Peroxide (H2O2) ที่เป็นพิษให้กลายเป็นน้ำและออกซิเจน",
    clues: [
      "ฉันมีเยื่อหุ้ม 1 ชั้น ภายในมักเห็นผลึกรูปทรงเรขาคณิตของเอนไซม์ใต้กล้องจุลทรรศน์",
      "ในระหว่างที่ฉันสลายกรดไขมันสายยาว จะเกิดสารพิษคือ <em>ไฮโดรเจนเปอร์ออกไซด์ (H2O2)</em>",
      "แต่ฉันมีเอนไซม์พิเศษคือ <em>Catalase</em> ที่สามารถสลาย H2O2 กลายเป็นน้ำและออกซิเจนทันที",
      "พบมากในเซลล์ตับและเซลล์ไตเพื่อทำลายสารพิษและแอลกอฮอล์"
    ]
  },
  {
    id: 7,
    nameTh: "SER (ผิวเรียบ)",
    nameEn: "Smooth ER",
    tag: "STEROID & Ca2+",
    color: "#d97706",
    icon: "🧈",
    img: "../img/10_membrane.jpg",
    category: "ORGANELLE // LIPID & CALCIUM",
    desc: "โครงข่ายท่อเยื่อหุ้มที่ไม่มีไรโบโซมเกาะ ทำหน้าที่สังเคราะห์ไขมัน สเตียรอยด์ฮอร์โมน กำจัดสารพิษ และสะสมแคลเซียมไอออน",
    clues: [
      "โครงสร้างเป็นท่อกลมเชื่อมติดต่อกัน ผิวภายนอกไม่มีเม็ดไรโบโซมมาเกาะ",
      "ฉันทำหน้าที่สังเคราะห์สารกลุ่มลิพิด (Lipids) และฮอร์โมนสเตียรอยด์ เช่น เทสโทสเตอโรน",
      "ในเซลล์กล้ามเนื้อ ฉันทำหน้าที่กักเก็บและปล่อย Ca2+ สำหรับการหดตัว",
      "ในเซลล์ตับ ฉันช่วยกำจัดสารพิษจำพวกยาและสารเคมีแปลกปลอม"
    ]
  },
  {
    id: 8,
    nameTh: "RER (ผิวขรุขระ)",
    nameEn: "Rough ER",
    tag: "MEMBRANE PROTEIN",
    color: "#2563eb",
    icon: "🏗️",
    img: "../img/01_gene_expression.jpg",
    category: "ORGANELLE // SECRETORY PROTEIN",
    desc: "ถุงแบนเชื่อมต่อกับเยื่อหุ้มนิวเคลียส มีไรโบโซมเกาะที่ผิวด้านนอก ทำหน้าที่สังเคราะห์โปรตีนที่จะส่งออกนอกเซลล์",
    clues: [
      "โครงสร้างของฉันเชื่อมต่อโดยตรงกับเยื่อหุ้มชั้นนอกของนิวเคลียส",
      "ผิวด้านนอกของฉันมีเม็ดไรโบโซมเกาะอยู่หนาแน่น ทำให้ดูขรุขระ",
      "ฉันทำหน้าที่สังเคราะห์โปรตีนสำหรับส่งออกนอกเซลล์และโปรตีนแทรกในเยื่อหุ้ม",
      "โปรตีนที่สังเคราะห์จะถูกบรรจุลงใน Transport Vesicle เพื่อส่งต่อไปยังกอลจิคอมเพล็กซ์"
    ]
  },
  {
    id: 9,
    nameTh: "เซนทริโอล",
    nameEn: "Centriole",
    tag: "SPINDLE APPARATUS",
    color: "#7c3aed",
    icon: "⭐",
    img: "../img/06_cell_cycle.jpg",
    category: "CYTOSKELETON // CELL DIVISION",
    desc: "ประกอบด้วย Microtubules เรียงตัวแบบ 9+0 จำนวน 1 คู่ วางตั้งฉากกัน ทำหน้าที่สร้างเส้นใยสปินเดิลดึงโครโมโซมในเซลล์สัตว์",
    clues: [
      "ฉันไม่มีเยื่อหุ้ม พบในเซลล์สัตว์แต่ไม่พบในเซลล์พืชชั้นสูง",
      "โครงสร้างเกิดจากหลอดไมโครทูบูลเรียงเป็นวงแบบ <em>9+0 (Triplets)</em>",
      "มักอยู่เป็นคู่ตั้งฉากกัน 90 องศา เรียกว่า <em>Centrosome</em>",
      "ทำหน้าที่สร้าง <em>Spindle Fiber</em> ดึงโครมาทิดออกจากกันระหว่างระยะ Anaphase"
    ]
  },
  {
    id: 10,
    nameTh: "นิวคลีโอลัส",
    nameEn: "Nucleolus",
    tag: "rRNA SYNTHESIS",
    color: "#0891b2",
    icon: "🔵",
    img: "../img/12_nuclear_pore.jpg",
    category: "NUCLEAR BODY // RIBOSOME FACTORY",
    desc: "บริเวณทึบแสงภายในนิวเคลียสที่ไม่มีเยื่อหุ้ม เกิดจากการรวมตัวของยีน rRNA ทำหน้าที่สังเคราะห์และประกอบ Subunits ของไรโบโซม",
    clues: [
      "ฉันเป็นโครงสร้างทรงกลมทึบแสงเข้มที่มองเห็นเด่นชัดที่สุดภายในนิวเคลียส",
      "ฉันไม่มีเยื่อหุ้ม เกิดจากสายดีเอ็นเอบริเวณ <em>NOR</em> มารวมตัวกัน",
      "ฉันเป็นแหล่งถอดรหัสและสังเคราะห์ <em>rRNA</em> ปริมาณมหาศาล",
      "ฉันนำ rRNA มาประกอบกับโปรตีน เพื่อสร้างเป็น Subunits ของ <em>Ribosome</em>"
    ]
  },
  {
    id: 11,
    nameTh: "ATP Synthase",
    nameEn: "ATP Synthase",
    tag: "ROTARY ENGINE",
    color: "#ea580c",
    icon: "⚙️",
    img: "/img/08_mitochondria.jpg",
    category: "MACROMOLECULE // ROTARY ENZYME",
    desc: "เอนไซม์กังหันโมเลกุลที่เยื่อหุ้มชั้นในไมโทคอนเดรียและไทลาคอยด์ ขับเคลื่อนด้วยแรงเคลื่อนโปรตอน หมุนสังเคราะห์ ATP",
    clues: [
      "ฉันไม่ใช่ทั้งเซลล์หรือออร์แกเนลล์ แต่เป็น <em>เอนไซม์โปรตีนเชิงซ้อน</em> ขนาดใหญ่ที่ฝังอยู่ในเยื่อหุ้ม",
      "ฉันมีส่วนประกอบสำคัญคือ F0 (ฝังในเยื่อหุ้ม) และ F1 (ยื่นออกมาทำปฏิกิริยาเคมี)",
      "ฉันทำงานเหมือน <em>กังหันน้ำระดับโมเลกุล</em> หมุนเมื่อมีโปรตอน (H+) ไหลผ่าน",
      "ผลลัพธ์จากการหมุนของฉันคือการเปลี่ยน ADP + Pi ให้กลายเป็น <em>ATP</em>"
    ]
  },
  {
    id: 12,
    nameTh: "Na+/K+ Pump",
    nameEn: "Na+/K+ Pump",
    tag: "RESTING POTENTIAL",
    color: "#e11d48",
    icon: "🔋",
    img: "../img/10_membrane.jpg",
    category: "MEMBRANE TRANSPORT // ACTIVE PUMP",
    desc: "โปรตีนขนส่งแบบ Primary Active Transport ใช้ 1 ATP ปั๊ม 3 Na+ ออกนอกเซลล์ และนำ 2 K+ เข้าสู่เซลล์",
    clues: [
      "ฉันเป็นโปรตีนขนส่งแบบข้ามเยื่อหุ้มเซลล์ที่ใช้พลังงาน ATP โดยตรง",
      "ฉันเป็นตัวอย่างคลาสสิกของกระบวนการ <em>Active Transport</em> ขนส่งสารต้านเกรเดียนต์",
      "ในแต่ละรอบ ฉันจะส่งไอออนโซเดียม <em>3 Na+ ออกนอกเซลล์</em> และดึง <em>2 K+ เข้าสู่เซลล์</em>",
      "หน้าที่สำคัญยิ่งของฉันคือการรักษาระดับความต่างศักย์ขณะพัก (~-70 mV) ของเซลล์ประสาท"
    ]
  },
  {
    id: 13,
    nameTh: "แวคิวโอลกลาง",
    nameEn: "Central Vacuole",
    tag: "TURGOR PRESSURE",
    color: "#0284c7",
    icon: "💧",
    img: "../img/04_cellular_response.jpg",
    category: "PLANT ORGANELLE // STORAGE",
    desc: "ถุงเยื่อหุ้มเดี่ยวขนาดใหญ่ (Tonoplast) ในเซลล์พืช ทำหน้าที่สะสมน้ำ แร่ธาตุ สารสี และสร้างแรงดันเต่ง",
    clues: [
      "ในเซลล์พืชที่โตเต็มวัย ฉันจะขยายตัวจนกินพื้นที่มากกว่า 80-90% ของปริมาตรเซลล์",
      "เยื่อหุ้มของฉันมีชื่อเรียกเฉพาะว่า <em>Tonoplast</em>",
      "ฉันสะสมน้ำ ของเสีย ผลึกแคลเซียมออกซาเลต และสารสีแอนโทไซยานินสีม่วงแดง",
      "การอุ้มน้ำของฉันสร้าง <em>แรงดันเต่ง (Turgor Pressure)</em> ช่วยพยุงลำต้นพืชให้ตั้งตรง"
    ]
  },
  {
    id: 14,
    nameTh: "เอนไซม์รูบิสโก",
    nameEn: "Rubisco",
    tag: "CARBON FIXATION",
    color: "#16a34a",
    icon: "🌱",
    img: "../img/11_enzyme.jpg",
    category: "ENZYME // CALVIN CYCLE",
    desc: "เอนไซม์ที่มีปริมาณมากที่สุดในโลก ทำหน้าที่ตรึง CO2 เข้ากับ RuBP ในวัฏจักรคัลวินของพืช",
    clues: [
      "ฉันเป็นโปรตีนเอนไซม์ที่มีปริมาณมากที่สุดในโลกชีวภาพ (คิดเป็น 50% ของโปรตีนในใบพืช)",
      "ฉันอยู่ในสโตรมา (Stroma) ของคลอโรพลาสต์",
      "หน้าที่หลักของฉันคือการเร่งปฏิกิริยาตรึงคาร์บอนไดออกไซด์ (CO2) เข้ากับสาร RuBP",
      "แต่ในสภาวะที่ร้อนและแล้ง ฉันอาจจับกับ O2 แทนทำให้เกิดกระบวนการ Photorespiration"
    ]
  },
  {
    id: 15,
    nameTh: "แคสเปส-3",
    nameEn: "Caspase-3",
    tag: "APOPTOSIS",
    color: "#ea580c",
    icon: "💀",
    img: "../img/05_apoptosis.jpg",
    category: "ENZYME // PROGRAMMED CELL DEATH",
    desc: "เอนไซม์โปรตีเอสสำคัญในกระบวนการ Apoptosis ทำหน้าที่ตัดโปรตีนโครงสร้างเซลล์และกระตุ้นการทำลาย DNA",
    clues: [
      "ฉันเป็นเอนไซม์กลุ่ม Cysteine Protease ที่ทำหน้าที่เป็นเพชฌฆาตระดับโมเลกุล (Executioner)",
      "ฉันถูกกระตุ้นเมื่อเซลล์ได้รับสัญญาณเข้าสู่วิถีการตายแบบมีแบบแผน (Apoptosis)",
      "ฉันเข้าตัดทำลาย Cytoskeleton และ Nuclear Lamina ทำให้เซลล์หดตัวและเกิด Blebbing",
      "ช่วยควบคุมจำนวนเซลล์และกำจัดเซลล์ที่มีการกลายพันธุ์หรือติดเชื้อไวรัส"
    ]
  },
  {
    id: 16,
    nameTh: "อควาพอริน",
    nameEn: "Aquaporin",
    tag: "WATER CHANNEL",
    color: "#0891b2",
    icon: "🌊",
    img: "../img/10_membrane.jpg",
    category: "MEMBRANE PROTEIN // OSMOSIS",
    desc: "ช่องโปรตีนจำเพาะสำหรับการลำเลียงน้ำผ่านเยื่อหุ้มเซลล์แบบ Facilitated Diffusion ด้วยความเร็วสูง",
    clues: [
      "ฉันเป็นโปรตีนช่อง (Channel Protein) ฝังตัวบนเยื่อหุ้มเซลล์",
      "ฉันยอมให้โมเลกุลของ <em>น้ำ (H2O)</em> ไหลผ่านเข้าออกเซลล์ด้วยความเร็วระดับพันล้านโมเลกุลต่อวินาที",
      "การลำเลียงน้ำผ่านตัวฉันเป็นแบบ <em>Facilitated Diffusion</em> โดยไม่ต้องใช้พลังงาน ATP",
      "พบหนาแน่นมากที่ท่อหน่วยไต (Kidney Tubules) และเซลล์เม็ดเลือดแดง"
    ]
  },
  {
    id: 17,
    nameTh: "DNA Polymerase",
    nameEn: "DNA Polymerase",
    tag: "REPLICATION",
    color: "#2563eb",
    icon: "🧬",
    img: "../img/07_dna_helix.jpg",
    category: "ENZYME // DNA REPLICATION",
    desc: "เอนไซม์หลักในการจำลองสายดีเอ็นเอ สังเคราะห์สายนิวคลีโอไทด์ใหม่ในทิศทาง 5' -> 3' พร้อมระบบตรวจทาน Proofreading",
    clues: [
      "ฉันเป็นเอนไซม์หลักที่ทำหน้าที่ในกระบวนการ <em>DNA Replication</em> ในระยะ S phase",
      "ฉันสามารถต่อสายดีเอ็นเอใหม่ได้เฉพาะในทิศทาง <em>5' ไปยัง 3'</em> เท่านั้น",
      "ฉันต้องการ RNA Primer ในการเริ่มต้นสังเคราะห์สายใหม่",
      "ฉันมีคุณสมบัติพิเศษในการตรวจทานและแก้ไขข้อผิดพลาด (Proofreading 3'->5' exonuclease)"
    ]
  },
  {
    id: 18,
    nameTh: "DNA Helicase",
    nameEn: "DNA Helicase",
    tag: "UNZIP STRAND",
    color: "#db2777",
    icon: "✂️",
    img: "../img/07_dna_helix.jpg",
    category: "ENZYME // REPLICATION FORK",
    desc: "เอนไซม์คลายเกลียวคู่ DNA โดยการสลายพันธะไฮโดรเจนระหว่างคู่เบส เพื่อสร้าง Replication Fork",
    clues: [
      "ฉันทำหน้าที่เหมือน <em>ซิปรูดเปิด</em> สายคู่ของกรดนิวคลีอิก",
      "ฉันใช้พลังงานจาก ATP เพื่อเข้าสลาย <em>พันธะไฮโดรเจน (Hydrogen Bonds)</em> ระหว่างคู่เบส",
      "การทำงานของฉันทำให้เกิดโครงสร้างง่ามจำลอง (Replication Fork)",
      "ถ้าฉันไม่ทำงาน DNA Polymerase จะไม่สามารถเข้าถึงแม่แบบดีเอ็นเอเพื่อจำลองสายได้"
    ]
  },
  {
    id: 19,
    nameTh: "โทโนพลาสต์",
    nameEn: "Tonoplast",
    tag: "VACUOLE MEMBRANE",
    color: "#16a34a",
    icon: "🛡️",
    img: "../img/10_membrane.jpg",
    category: "MEMBRANE // PLANT VACUOLE",
    desc: "เยื่อหุ้มเดี่ยวที่ล้อมรอบแวคิวโอลกลางในเซลล์พืช ควบคุมการเข้าออกของสารและรักษาความดันออสโมซิส",
    clues: [
      "ฉันเป็น <em>เยื่อหุ้มเดี่ยว (Single Membrane)</em> ที่ห่อหุ้มออร์แกเนลล์ขนาดใหญ่ในเซลล์พืช",
      "ฉันทำหน้าที่กั้นระหว่างของเหลว Cytosol กับน้ำ Cell Sap ภายในแวคิวโอล",
      "ฉันมีปั๊มโปรตอน (Proton Pumps) ปั๊ม H+ เข้าไปข้างในทำให้ภายในมีสภาพเป็นกรด",
      "ฉันช่วยรักษาสภาพเต่งและความดันออสโมซิสของเซลล์พืช"
    ]
  },
  {
    id: 20,
    nameTh: "อะไมโลพลาสต์",
    nameEn: "Amyloplast",
    tag: "STARCH STORAGE",
    color: "#d97706",
    icon: "🥔",
    img: "../img/02_gene_regulation.jpg",
    category: "PLASTID // LEUCOPLAST",
    desc: "พลาสติดไม่มีสีในเซลล์พืช ทำหน้าที่สังเคราะห์และสะสมแป้ง และทำหน้าที่เป็น Statolith รับรู้แรงโน้มถ่วงที่ปลายราก",
    clues: [
      "ฉันเป็นพลาสติดชนิดที่ไม่มีสี (Leucoplast) พบมากในหัวมันฝรั่งและเมล็ดพืช",
      "หน้าที่หลักของฉันคือการเปลี่ยนน้ำตาลกลูโคสให้กลายเป็น <em>เม็ดแป้ง (Starch Grains)</em> สะสมไว้",
      "เมื่อย้อมด้วยสารละลายไอโอดีน เม็ดแป้งในตัวฉันจะเปลี่ยนเป็นสีน้ำเงินเข้ม",
      "ที่บริเวณหมวกราก (Root Cap) ฉันทำหน้าที่เป็น <em>Statolith</em> ช่วยให้รากพืชรับรู้ทิศทางแรงโน้มถ่วง"
    ]
  },
  {
    id: 21,
    nameTh: "ไมโครทูบูล",
    nameEn: "Microtubules",
    tag: "TUBULIN TUBE",
    color: "#7c3aed",
    icon: "🪵",
    img: "../img/13_cytoskeleton.jpg",
    category: "CYTOSKELETON // STRUCTURAL TUBE",
    desc: "ท่อกลวงขนาดเส้นผ่านศูนย์กลาง 25 nm ประกอบจากโปรตีน Tubulin ทำหน้าที่เป็นรางขนส่งเวสิเคิลและแกนซิเลีย-แฟลกเจลลา",
    clues: [
      "ฉันเป็นเส้นใยไซโทสเกเลตันที่มีขนาดเส้นผ่านศูนย์กลาง <em>ใหญ่ที่สุด (~25 นาโนเมตร)</em>",
      "โครงสร้างของฉันเป็นท่อกลวงทรงกระบอก เกิดจากการประกอบกันของโปรตีน <em>Tubulin</em>",
      "ฉันทำหน้าที่เป็น <em>รางรถไฟโมเลกุล</em> ให้โปรตีน Kinesin และ Dynein เดินขนส่งเวสิเคิล",
      "ฉันเป็นโครงสร้างหลักของ Spindle Fiber, Centriole และแกน 9+2 ของ Cilia และ Flagella"
    ]
  },
  {
    id: 22,
    nameTh: "โปรตีเอโซม",
    nameEn: "Proteasome",
    tag: "PROTEIN RECYCLING",
    color: "#ea580c",
    icon: "🗑️",
    img: "../img/11_enzyme.jpg",
    category: "COMPLEX // QUALITY CONTROL",
    desc: "ถังโปรตีนเชิงซ้อนขนาดใหญ่ ทำหน้าที่ย่อยสลายโปรตีนที่ติดฉลาก Ubiquitin ให้กลายเป็นเปปไทด์สั้นๆ",
    clues: [
      "ฉันมีรูปร่างคล้าย <em>ถังขยะทรงกระบอกระดับโมเลกุล</em> อยู่ในไซโทพลาซึมและนิวเคลียส",
      "ฉันทำหน้าที่กำจัดโปรตีนที่พับผิดรูปหรือโปรตีนที่เซลล์ไม่ต้องการแล้ว",
      "ฉันจะเข้าย่อยสลายเฉพาะโปรตีนที่ถูกติดแท็กด้วยโมเลกุล <em>Ubiquitin</em> เท่านั้น",
      "ผลผลิตที่ได้จากการย่อยของฉันคือกรดอะมิโนและเปปไทด์สั้นๆ ที่นำกลับมาหมุนเวียนใช้ใหม่ได้"
    ]
  },
  {
    id: 23,
    nameTh: "สไปลซีโอโซม",
    nameEn: "Spliceosome",
    tag: "RNA SPLICING",
    color: "#db2777",
    icon: "🎞️",
    img: "../img/01_gene_expression.jpg",
    category: "COMPLEX // PRE-mRNA EDIT",
    desc: "อนุภาคไรโบนิวคลีโอโปรตีน (snRNP) ทำหน้าที่ตัด Intron ที่ไม่ต้องการออก และต่อ Exon เข้าด้วยกันในการแต่งเติม pre-mRNA",
    clues: [
      "ฉันเป็นอนุภาคเชิงซ้อนขนาดใหญ่ที่ประกอบด้วยโปรตีนและโมเลกุล <em>snRNA (snRNPs)</em>",
      "ฉันทำงานอยู่ภายในนิวเคลียสของเซลล์ยูแคริโอตในขั้นตอน Post-transcriptional Modification",
      "หน้าที่ของฉันคือการตัดช่วงลำดับเบสที่ไม่เข้ารหัสโปรตีนคือ <em>Introns</em> ทิ้งไป",
      "แล้วทำการเชื่อมต่อท่อน <em>Exons</em> เข้าด้วยกันจนได้โมเลกุล Mature mRNA ที่สมบูรณ์"
    ]
  },
  {
    id: 24,
    nameTh: "ซาร์โคพลาสมิก",
    nameEn: "Sarcoplasmic Reticulum",
    tag: "CALCIUM RESERVOIR",
    color: "#dc2626",
    icon: "💪",
    img: "../img/13_cytoskeleton.jpg",
    category: "ORGANELLE // MUSCLE CONTRACTION",
    desc: "SER รูปแบบพิเศษในเซลล์กล้ามเนื้อลาย ทำหน้าที่กักเก็บไอออน Ca2+ และปล่อยออกมาเมื่อมีกระแสประสาทมากระตุ้นการหดตัว",
    clues: [
      "ฉันเป็นรูปแบบพิเศษของ Smooth ER ที่พบเฉพาะในเซลล์กล้ามเนื้อ (Muscle Fibers)",
      "ฉันล้อมรอบเส้นใยไมโอไฟบริล (Myofibrils) ไว้อย่างแนบแน่น",
      "หน้าที่สำคัญที่สุดของฉันคือการ <em>กักเก็บไอออนแคลเซียม (Ca2+)</em> ด้วยปั๊ม SERCA",
      "เมื่อเซลล์ประสาทส่ง Action Potential มา ฉันจะปล่อย Ca2+ ออกไปกระตุ้นให้กล้ามเนื้อหดตัวทันที"
    ]
  }
];

// --- 3. Image Preloader Cache ---
const IMAGE_CACHE = {};
MASTER_CARD_POOL.forEach(card => {
  if (card.img) {
    const img = new Image();
    img.src = card.img;
    IMAGE_CACHE[card.id] = img;
  }
});

// Custom Detective Card Art Back Cover
const CUSTOM_CARD_BACK_IMG = new Image();
CUSTOM_CARD_BACK_IMG.src = 'card_art_custom.jpg';

// --- 4. Main Multi-Card & Room Matchmaking Engine ---
class WhoAmIGame {
  constructor() {
    this.sound = new SoundController();
    this.currentCaseIndex = 0;
    this.targetCard = null;
    this.score = 0;
    this.streak = 0;
    this.cluesRevealedCount = 1;
    this.attemptsInCase = 0;
    this.isTransitioning = false;
    this.myRole = 'guesser'; // 'host', 'guesser', 'spectator'
    this.roomCode = 'CYTO-' + Math.floor(100 + Math.random() * 900);

    // Touch Mode for Mobile/iPad: 'guess' | 'eliminate'
    this.touchMode = 'guess';
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchStartTime = 0;
    this.isTouchDevice = ('ontouchstart' in window || navigator.maxTouchPoints > 0);

    // Three.js State
    this.container = document.getElementById('canvas-container');
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.cardMeshes = [];
    this.eliminatedCardIds = new Set();
    this.hoveredCard = null;
    this.deskMesh = null;
    this.particles = null;

    // View Angle State
    this.viewMode = 'perspective';
    this.tableCenterX = 0.6;

    // Networking (BroadcastChannel + PeerJS)
    this.broadcastChannel = null;
    this.peer = null;
    this.peerConnections = [];

    this.initNetworking();
    this.initThree();
    this.initDOM();
    this.startNewGameRound(0);
    this.animate();
  }

  // --- Networking: BroadcastChannel & PeerJS WebRTC ---
  initNetworking() {
    try {
      this.broadcastChannel = new BroadcastChannel('whoami_room_channel');
      this.broadcastChannel.onmessage = (event) => this.handleNetworkMessage(event.data);
    } catch(e) {}

    if (window.Peer) {
      try {
        const peerId = 'cell544-' + this.roomCode.toLowerCase() + '-' + Math.floor(Math.random() * 1000);
        this.peer = new Peer(peerId);
        this.peer.on('connection', (conn) => {
          this.peerConnections.push(conn);
          conn.on('data', (data) => this.handleNetworkMessage(data));
          conn.on('open', () => {
            conn.send({
              type: 'SYNC_STATE',
              roomCode: this.roomCode,
              targetId: this.targetCard ? this.targetCard.id : 1,
              eliminated: Array.from(this.eliminatedCardIds),
              cluesRevealed: this.cluesRevealedCount
            });
          });
        });
      } catch(e) {}
    }
  }

  broadcast(msg) {
    msg.sender = this.myRole;
    msg.room = this.roomCode;
    msg.time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (this.broadcastChannel) {
      try { this.broadcastChannel.postMessage(msg); } catch(e) {}
    }

    this.peerConnections.forEach(conn => {
      try { conn.send(msg); } catch(e) {}
    });
  }

  handleNetworkMessage(data) {
    if (!data || data.room !== this.roomCode) return;

    if (data.type === 'CHAT_MSG') {
      this.addChatMessage(data.text, data.senderRole, data.time);
      this.sound.playMessageChime();
    } else if (data.type === 'SYNC_STATE') {
      if (this.myRole !== 'host' && data.targetId) {
        const found = MASTER_CARD_POOL.find(c => c.id === data.targetId);
        if (found) this.targetCard = found;
        if (data.cluesRevealed) {
          this.cluesRevealedCount = data.cluesRevealed;
          this.renderClues();
        }
      }
    } else if (data.type === 'CARD_ELIMINATED') {
      this.eliminateCardById(data.cardId, false);
    } else if (data.type === 'CLUE_REVEALED') {
      this.cluesRevealedCount = data.count;
      this.renderClues();
      this.sound.playTone(587.33, 'sine', 0.15, 0.15);
    } else if (data.type === 'GAME_WON') {
      this.sound.playSuccess();
      this.showVictoryModal(this.targetCard, data.score);
    }
  }

  // --- Initialize Three.js 3D Scene ---
  initThree() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x07090e);
    this.scene.fog = new THREE.FogExp2(0x07090e, 0.03);

    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    this.camera.position.set(this.tableCenterX, 4.8, 7.6);
    this.camera.lookAt(this.tableCenterX, 0.3, 0.2);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    // Dynamic Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    this.scene.add(ambientLight);

    const pointLightCyan = new THREE.PointLight(0x00f0ff, 2.2, 20);
    pointLightCyan.position.set(this.tableCenterX - 4.5, 5, 4);
    this.scene.add(pointLightCyan);

    const pointLightPurple = new THREE.PointLight(0xa855f7, 2.2, 20);
    pointLightPurple.position.set(this.tableCenterX + 4.5, 5, 4);
    this.scene.add(pointLightPurple);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    keyLight.position.set(this.tableCenterX, 10, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    this.scene.add(keyLight);

    // 3D Laboratory Hologram Desk
    this.createDesk();

    // Ambient Cyber Particles
    this.createParticles();

    // Event Listeners
    window.addEventListener('resize', () => this.onWindowResize());
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    window.addEventListener('click', (e) => this.onMouseClick(e));
    window.addEventListener('contextmenu', (e) => this.onRightClick(e));
    window.addEventListener('touchstart', (e) => this.onTouchStart(e), { passive: true });
    window.addEventListener('touchend', (e) => this.onTouchEnd(e), { passive: false });
  }

  createDesk() {
    const deskGeo = new THREE.BoxGeometry(13, 0.3, 8.5);
    const deskMat = new THREE.MeshStandardMaterial({
      color: 0x0c101a,
      roughness: 0.25,
      metalness: 0.85,
    });
    this.deskMesh = new THREE.Mesh(deskGeo, deskMat);
    this.deskMesh.position.set(this.tableCenterX, -0.15, 0);
    this.deskMesh.receiveShadow = true;
    this.scene.add(this.deskMesh);

    // Glowing Holographic Desk Grid Lines
    const grid = new THREE.GridHelper(12, 24, 0x00f0ff, 0x1e293b);
    grid.position.set(this.tableCenterX, 0.01, 0);
    this.scene.add(grid);

    // Holographic Cyber Ring
    const ringGeo = new THREE.RingGeometry(2.4, 2.44, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, side: THREE.DoubleSide, transparent: true, opacity: 0.3 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(this.tableCenterX, 0.02, 0);
    this.scene.add(ring);
  }

  createParticles() {
    const pCount = 280;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);

    for (let i = 0; i < pCount * 3; i += 3) {
      pPos[i] = (Math.random() - 0.5) * 16 + this.tableCenterX;
      pPos[i + 1] = Math.random() * 7;
      pPos[i + 2] = (Math.random() - 0.5) * 12;
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.04,
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });
    this.particles = new THREE.Points(pGeo, pMat);
    this.scene.add(this.particles);
  }

  // --- Dynamic Canvas Textures with Real Image & Crisp Pure White High-Contrast Background ---
  createCardTexture(cardData, isBack = false) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1536;
    const ctx = canvas.getContext('2d');

    if (isBack) {
      if (CUSTOM_CARD_BACK_IMG.complete && CUSTOM_CARD_BACK_IMG.naturalWidth > 0) {
        // Render Custom Detective Card Art Back Cover
        ctx.fillStyle = '#0a0f1d';
        ctx.fillRect(0, 0, 1024, 1536);

        // Draw Custom Detective Art in center frame
        ctx.save();
        ctx.drawImage(CUSTOM_CARD_BACK_IMG, 32, 32, 960, 1472);
        ctx.restore();

        // Sleek Cyber Gold Outer Border
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 14;
        ctx.strokeRect(26, 26, 972, 1484);

        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 4;
        ctx.strokeRect(44, 44, 936, 1448);

        // Bottom Dossier Badge
        ctx.fillStyle = 'rgba(10, 15, 29, 0.88)';
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(160, 1370, 704, 76, 20) : ctx.rect(160, 1370, 704, 76);
        ctx.fill();
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 32px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('CYTO-DETECTIVE // DOSSIER #24', 512, 1420);
      } else {
        // Fallback: Crisp Pure White & Cyan Shield Hologram
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 1024, 1536);

        // Cyber Neon Frame
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 24;
        ctx.strokeRect(28, 28, 968, 1480);

        ctx.strokeStyle = 'rgba(14, 165, 233, 0.4)';
        ctx.lineWidth = 6;
        ctx.strokeRect(52, 52, 920, 1432);

        // Central Bio-Hazard Holographic Seal
        ctx.save();
        ctx.translate(512, 660);
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          const x = 230 * Math.cos(angle);
          const y = 230 * Math.sin(angle);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 12;
        ctx.stroke();

        ctx.fillStyle = 'rgba(2, 132, 199, 0.08)';
        ctx.fill();
        ctx.restore();

        ctx.fillStyle = '#0284c7';
        ctx.font = 'bold 180px "Prompt", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('?', 512, 730);

        // Labels
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 44px "JetBrains Mono", monospace';
        ctx.fillText('CYTO-ARCHIVE // SPECIMEN', 512, 1020);

        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 36px "JetBrains Mono", monospace';
        ctx.fillText('24+ UNIFIED MASTER DECK', 512, 1090);

        ctx.fillStyle = '#64748b';
        ctx.font = '32px "Prompt", sans-serif';
        ctx.fillText('TOP SECRET BIOLOGICAL DOSSIER', 512, 1350);
      }

    } else {
      // 3D Card Front: CRISP PURE WHITE LUXURY BACKGROUND WITH REAL HIGH-CONTRAST PHOTOGRAPHY
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 1024, 1536);

      // Outer Thick Accent Border
      const cardColor = cardData.color || '#0284c7';
      ctx.strokeStyle = cardColor;
      ctx.lineWidth = 26;
      ctx.strokeRect(26, 26, 972, 1484);

      // Inner Clean Border
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.12)';
      ctx.lineWidth = 4;
      ctx.strokeRect(50, 50, 924, 1436);

      // Category Tag Header Bar
      ctx.fillStyle = cardColor;
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(64, 68, 896, 90, 16) : ctx.rect(64, 68, 896, 90);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 40px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(cardData.tag || 'BIOMOLECULE', 512, 130);

      // Real Photography Image Window (Huge & High-Contrast)
      const imgBoxX = 72;
      const imgBoxY = 184;
      const imgBoxW = 880;
      const imgBoxH = 720;

      // Draw real specimen image if loaded in cache
      const cachedImg = IMAGE_CACHE[cardData.id];
      if (cachedImg && cachedImg.complete && cachedImg.naturalWidth > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(imgBoxX, imgBoxY, imgBoxW, imgBoxH, 20) : ctx.rect(imgBoxX, imgBoxY, imgBoxW, imgBoxH);
        ctx.clip();
        ctx.drawImage(cachedImg, imgBoxX, imgBoxY, imgBoxW, imgBoxH);
        ctx.restore();

        // Image Frame Overlay
        ctx.strokeStyle = cardColor;
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(imgBoxX, imgBoxY, imgBoxW, imgBoxH, 20) : ctx.rect(imgBoxX, imgBoxY, imgBoxW, imgBoxH);
        ctx.stroke();

        // Small floating biology icon badge
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.beginPath();
        ctx.arc(imgBoxX + 64, imgBoxY + 64, 46, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = cardColor;
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.font = '48px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(cardData.icon || '🧬', imgBoxX + 64, imgBoxY + 80);

      } else {
        // Fallback placeholder container with soft light background
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(imgBoxX, imgBoxY, imgBoxW, imgBoxH);
        ctx.strokeStyle = cardColor;
        ctx.lineWidth = 6;
        ctx.strokeRect(imgBoxX, imgBoxY, imgBoxW, imgBoxH);

        ctx.font = '240px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(cardData.icon || '🧬', 512, 600);
      }

      // Specimen Thai Name (CRYSTAL CLEAR PITCH BLACK ON PURE WHITE - HUGE HIGH CONTRAST)
      ctx.fillStyle = '#09090b';
      ctx.font = 'bold 74px "Prompt", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(cardData.nameTh, 512, 1005);

      // Specimen English Name (Vibrant Accent Color)
      ctx.fillStyle = cardColor;
      ctx.font = 'bold 44px "JetBrains Mono", monospace';
      ctx.fillText(cardData.nameEn, 512, 1090);

      // Subtle Divider
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(120, 1150, 784, 4);

      // Scientific Verification Stamp
      ctx.fillStyle = '#475569';
      ctx.font = 'bold 34px "Prompt", sans-serif';
      ctx.fillText(`SPECIMEN #${String(cardData.id).padStart(2, '0')} · CAMPBELL BIOLOGY 12TH`, 512, 1240);

      ctx.fillStyle = '#16a34a';
      ctx.font = 'bold 36px "Prompt", sans-serif';
      ctx.fillText('✔ ยืนยันพิกัดโครงสร้างชีววิทยา', 512, 1320);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 16;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    return texture;
  }

  // --- Spawn & Layout 24 Biological Cards on the 3D Table ---
  spawn24Cards() {
    this.cardMeshes.forEach(mesh => {
      this.scene.remove(mesh);
      if (mesh.geometry) mesh.geometry.dispose();
    });
    this.cardMeshes = [];
    this.eliminatedCardIds.clear();

    const cardWidth = 0.88;
    const cardHeight = 1.38;
    const cardDepth = 0.015;

    // Arrange 24 cards in a 4 rows x 6 columns laboratory grid on the desk
    const cols = 6;
    const spacingX = 1.05;
    const spacingZ = 1.52;
    const startX = this.tableCenterX - ((cols - 1) * spacingX) / 2;
    const startZ = -1.6;

    MASTER_CARD_POOL.forEach((cardData, idx) => {
      const row = Math.floor(idx / cols);
      const col = idx % cols;

      const cardGeo = new THREE.BoxGeometry(cardWidth, cardHeight, cardDepth);
      const frontTex = this.createCardTexture(cardData, false);
      const backTex = this.createCardTexture(cardData, true);
      const sideMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.1, roughness: 0.2 });

      const materials = [
        sideMat, sideMat, sideMat, sideMat,
        new THREE.MeshStandardMaterial({ map: frontTex, roughness: 0.25, metalness: 0.1 }),
        new THREE.MeshStandardMaterial({ map: backTex, roughness: 0.25, metalness: 0.1 })
      ];

      const cardMesh = new THREE.Mesh(cardGeo, materials);
      cardMesh.castShadow = true;
      cardMesh.receiveShadow = true;

      const posX = startX + col * spacingX;
      const posY = 0.85 + (3 - row) * 0.1;
      const posZ = startZ + row * spacingZ;
      const rotX = -0.32; // tilted towards camera
      const rotY = (col - 2.5) * 0.04;
      const rotZ = 0;

      // Drop animation from sky
      cardMesh.position.set(posX, posY + 4.0, posZ);
      cardMesh.rotation.set(rotX, rotY, rotZ);

      cardMesh.userData = {
        cardId: cardData.id,
        cardData: cardData,
        isTarget: this.targetCard ? (cardData.id === this.targetCard.id) : false,
        origX: posX,
        origY: posY,
        origZ: posZ,
        origRotX: rotX,
        origRotY: rotY,
        origRotZ: rotZ,
        isEliminated: false
      };

      this.scene.add(cardMesh);
      this.cardMeshes.push(cardMesh);

      // Staggered deal animation
      new TWEEN.Tween(cardMesh.position)
        .to({ x: posX, y: posY, z: posZ }, 500 + idx * 30)
        .easing(TWEEN.Easing.Back.Out)
        .start();
    });

    this.updateCardCount();
    this.sound.playTone(320, 'sine', 0.15, 0.1);
  }

  // --- Start New Game Round ---
  startNewGameRound(caseIndex = 0) {
    this.currentCaseIndex = caseIndex % MASTER_CARD_POOL.length;
    // Pick exactly 1 target card
    this.targetCard = MASTER_CARD_POOL[this.currentCaseIndex];
    this.cluesRevealedCount = 1;
    this.attemptsInCase = 0;
    this.isTransitioning = false;

    // Update Room & Case Indicators
    document.getElementById('room-code-txt').innerText = this.roomCode;
    document.getElementById('dossier-case-id').innerText = `CASE #${String(this.currentCaseIndex + 1).padStart(2, '0')}`;

    // Update Host Secret Target Preview
    const secretBox = document.getElementById('secret-target-box');
    if (this.myRole === 'host') {
      secretBox.style.display = 'block';
      document.getElementById('st-name').innerText = `${this.targetCard.nameTh} (${this.targetCard.nameEn})`;
    } else {
      secretBox.style.display = 'none';
    }

    // Render Clues
    this.renderClues();

    // Spawn All 24 Cards
    this.spawn24Cards();

    // Sync state
    this.broadcast({
      type: 'SYNC_STATE',
      targetId: this.targetCard.id,
      cluesRevealed: this.cluesRevealedCount
    });

    document.getElementById('guide-text').innerText = 'สำรับรวม 24 ใบ (การ์ดสีดำพร้อมภาพจริง): คลิกขวาเพื่อคว่ำการ์ดตัดช้อยส์ / คลิกซ้ายเพื่อทายคำตอบสุดท้าย';
  }

  renderClues() {
    if (!this.targetCard) return;
    const cluesContainer = document.getElementById('clues-container');
    cluesContainer.innerHTML = '';

    this.targetCard.clues.forEach((clueText, idx) => {
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
          <span>🔒 คำใบ้ระดับลึก #0${idx + 1} (คลิกเพื่อปลดล็อก)</span>
        `;
      }
      cluesContainer.appendChild(clueDiv);
    });

    const clueBtn = document.getElementById('reveal-clue-btn');
    if (this.cluesRevealedCount >= this.targetCard.clues.length) {
      clueBtn.disabled = true;
      clueBtn.querySelector('.clue-btn-text').innerText = 'เปิดคำใบ้ครบ 4 ระดับแล้ว';
    } else {
      clueBtn.disabled = false;
      const penalty = 50 * this.cluesRevealedCount;
      clueBtn.querySelector('.clue-btn-text').innerText = `เปิดคำใบ้ถัดไป (-${penalty} คะแนน)`;
    }
  }

  revealNextClue() {
    if (!this.targetCard) return;
    if (this.cluesRevealedCount < this.targetCard.clues.length) {
      this.cluesRevealedCount++;
      this.sound.playTone(587.33, 'sine', 0.15, 0.15);
      this.renderClues();
      this.broadcast({ type: 'CLUE_REVEALED', count: this.cluesRevealedCount });
    }
  }

  // --- Eliminate / Flip Down Card ---
  eliminateCard(cardMesh) {
    if (cardMesh.userData.isEliminated) {
      // Restore card
      cardMesh.userData.isEliminated = false;
      this.eliminatedCardIds.delete(cardMesh.userData.cardId);

      new TWEEN.Tween(cardMesh.rotation)
        .to({ x: cardMesh.userData.origRotX, y: cardMesh.userData.origRotY, z: 0 }, 300)
        .start();

      new TWEEN.Tween(cardMesh.position)
        .to({ y: cardMesh.userData.origY }, 300)
        .start();

      this.sound.playCardHover();
    } else {
      // Flip face-down & dim
      cardMesh.userData.isEliminated = true;
      this.eliminatedCardIds.add(cardMesh.userData.cardId);

      new TWEEN.Tween(cardMesh.rotation)
        .to({ x: Math.PI / 2, y: 0, z: 0 }, 350)
        .easing(TWEEN.Easing.Cubic.Out)
        .start();

      new TWEEN.Tween(cardMesh.position)
        .to({ y: cardMesh.userData.origY - 0.2 }, 350)
        .start();

      this.sound.playCardEliminate();
      this.triggerHoloSignal(`ตัดช้อยส์: ${cardMesh.userData.cardData.nameTh} ❌`);
    }

    this.updateCardCount();
    this.broadcast({ type: 'CARD_ELIMINATED', cardId: cardMesh.userData.cardId });
  }

  eliminateCardById(cardId, shouldBroadcast = true) {
    const mesh = this.cardMeshes.find(m => m.userData.cardId === cardId);
    if (mesh) {
      this.eliminateCard(mesh);
    }
  }

  resetAllEliminations() {
    this.cardMeshes.forEach(mesh => {
      if (mesh.userData.isEliminated) {
        mesh.userData.isEliminated = false;
        new TWEEN.Tween(mesh.rotation)
          .to({ x: mesh.userData.origRotX, y: mesh.userData.origRotY, z: 0 }, 300)
          .start();
        new TWEEN.Tween(mesh.position)
          .to({ y: mesh.userData.origY }, 300)
          .start();
      }
    });
    this.eliminatedCardIds.clear();
    this.updateCardCount();
    this.triggerHoloSignal('🔄 รีเซ็ตการ์ด 24 ใบกลับมาเปิดทั้งหมด');
  }

  // --- Guess Final Answer ---
  guessCard(cardMesh) {
    if (this.isTransitioning) return;
    this.attemptsInCase++;
    const isCorrect = cardMesh.userData.cardId === this.targetCard.id;

    // Dramatic Flip
    new TWEEN.Tween(cardMesh.position)
      .to({ y: 1.8, z: 2.2 }, 350)
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
      const earned = Math.max(100, (800 - cluePenalty - attemptPenalty) * (1 + this.streak * 0.2));
      this.score += Math.round(earned);

      this.updateStats();

      if (window.confetti) {
        window.confetti({
          particleCount: 100,
          spread: 80,
          origin: { x: 0.5, y: 0.5 }
        });
      }

      this.broadcast({ type: 'GAME_WON', score: earned });

      setTimeout(() => {
        this.showVictoryModal(this.targetCard, earned);
      }, 750);

    } else {
      this.sound.playWrong();
      this.streak = 0;
      this.updateStats();

      // Auto eliminate wrong guess
      this.eliminateCard(cardMesh);
      document.getElementById('guide-text').innerText = `❌ ${cardMesh.userData.cardData.nameTh} ไม่ใช่คำตอบ! ตัดช้อยส์ออกแล้ว`;
    }
  }

  updateCardCount() {
    const remain = MASTER_CARD_POOL.length - this.eliminatedCardIds.size;
    document.getElementById('cards-remain-val').innerText = `${remain} / ${MASTER_CARD_POOL.length}`;
  }

  updateStats() {
    document.getElementById('score-val').innerText = this.score;
  }

  showVictoryModal(target, earned) {
    const modal = document.getElementById('result-modal');
    document.getElementById('modal-target-name').innerText = target.nameEn;
    document.getElementById('modal-bio-tag').innerText = target.category;
    document.getElementById('modal-bio-title').innerText = `${target.nameTh} (${target.nameEn})`;
    document.getElementById('modal-bio-desc').innerText = target.desc;
    document.getElementById('modal-round-score').innerText = `+${Math.round(earned)}`;
    document.getElementById('modal-elim-count').innerText = `${this.eliminatedCardIds.size} / 24 ใบ`;
    document.getElementById('modal-accuracy').innerText = this.attemptsInCase <= 1 ? '100% (ครั้งแรก!)' : `ทายครั้งที่ ${this.attemptsInCase}`;

    modal.classList.add('show');
  }

  hideVictoryModal() {
    document.getElementById('result-modal').classList.remove('show');
  }

  // --- Live Chat & Messaging ---
  addChatMessage(text, role, time = null) {
    const container = document.getElementById('chat-messages');
    const msgDiv = document.createElement('div');
    const roleClass = role === 'host' ? 'host-msg' : (role === 'spectator' ? 'spectator-msg' : '');
    msgDiv.className = `chat-msg ${roleClass}`;

    const timeStr = time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const roleLabel = role === 'host' ? '👑 ผู้ถือคำตอบ' : (role === 'spectator' ? '🍿 ผู้ชม' : '🕵️ ผู้ทาย');

    msgDiv.innerHTML = `<span class="msg-sender">[${timeStr}] ${roleLabel}:</span> ${text}`;
    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
  }

  sendChatMessage(text) {
    if (!text.trim()) return;
    this.addChatMessage(text, this.myRole);
    this.broadcast({
      type: 'CHAT_MSG',
      text: text,
      senderRole: this.myRole
    });
  }

  // --- DOM Listeners ---
  initDOM() {
    // Clue & Elim Actions
    document.getElementById('reveal-clue-btn').addEventListener('click', () => this.revealNextClue());
    document.getElementById('reset-elim-btn').addEventListener('click', () => this.resetAllEliminations());

    // Modal Actions
    document.getElementById('modal-next-btn').addEventListener('click', () => {
      this.hideVictoryModal();
      this.startNewGameRound(this.currentCaseIndex + 1);
    });
    document.getElementById('modal-replay-btn').addEventListener('click', () => {
      this.hideVictoryModal();
      this.startNewGameRound(this.currentCaseIndex);
    });

    // Shuffle / Re-arrange 24 Cards
    document.getElementById('shuffle-deck-btn').addEventListener('click', () => {
      this.spawn24Cards();
      this.triggerHoloSignal('🎴 จัดเรียงสำรับ 24 ใบใหม่บนโต๊ะทดลอง');
    });

    // Camera View Mode Toggle
    document.getElementById('view-mode-btn').addEventListener('click', () => {
      if (this.viewMode === 'perspective') {
        this.viewMode = 'topdown';
        new TWEEN.Tween(this.camera.position)
          .to({ x: this.tableCenterX, y: 7.2, z: 3.5 }, 600)
          .easing(TWEEN.Easing.Cubic.InOut)
          .start();
      } else {
        this.viewMode = 'perspective';
        new TWEEN.Tween(this.camera.position)
          .to({ x: this.tableCenterX, y: 4.8, z: 7.6 }, 600)
          .easing(TWEEN.Easing.Cubic.InOut)
          .start();
      }
    });

    // Touch Mode Toggle (for Mobile & iPad: Guess vs Eliminate)
    const touchModeBtn = document.getElementById('touch-mode-btn');
    if (touchModeBtn) {
      touchModeBtn.addEventListener('click', () => {
        this.touchMode = this.touchMode === 'guess' ? 'eliminate' : 'guess';
        const iconEl = document.getElementById('touch-mode-icon');
        const textEl = document.getElementById('touch-mode-text');
        if (this.touchMode === 'eliminate') {
          touchModeBtn.classList.add('mode-elim');
          if (iconEl) iconEl.innerText = '✂️';
          if (textEl) textEl.innerText = 'โหมดคว่ำช้อยส์';
          this.triggerHoloSignal('✂️ แตะการ์ดเพื่อคว่ำตัดช้อยส์');
        } else {
          touchModeBtn.classList.remove('mode-elim');
          if (iconEl) iconEl.innerText = '🎯';
          if (textEl) textEl.innerText = 'โหมดทายคำตอบ';
          this.triggerHoloSignal('🎯 แตะการ์ดเพื่อทายคำตอบสุดท้าย');
        }
      });
    }

    // Chat Form Submit
    document.getElementById('chat-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('chat-input');
      this.sendChatMessage(input.value);
      input.value = '';
    });

    // Toggle Chat Panel
    document.getElementById('toggle-chat-btn').addEventListener('click', () => {
      const panel = document.getElementById('live-chat-panel');
      panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
    });
    document.getElementById('close-chat-btn').addEventListener('click', () => {
      document.getElementById('live-chat-panel').style.display = 'none';
    });

    // Quick Inquiry Probes
    document.querySelectorAll('.probe-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const text = e.currentTarget.getAttribute('data-ask');
        this.sendChatMessage(`❓ คำถาม: "${text}"`);
        this.triggerHoloSignal(`ส่งคำถาม: ${text}`);
      });
    });

    // Host Quick Reply Bar
    document.querySelectorAll('.hr-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const reply = e.currentTarget.getAttribute('data-answer');
        this.sendChatMessage(`📢 คำตอบ: ${reply}`);
      });
    });

    // Copy Room Code
    document.getElementById('copy-room-btn').addEventListener('click', () => {
      navigator.clipboard.writeText(this.roomCode);
      this.triggerHoloSignal(`📋 คัดลอกรหัสห้อง: ${this.roomCode}`);
    });

    // Lobby Modal
    const lobbyModal = document.getElementById('lobby-modal');
    document.getElementById('open-lobby-btn').addEventListener('click', () => {
      document.getElementById('gen-room-code').innerText = this.roomCode;
      lobbyModal.classList.add('show');
    });
    document.getElementById('close-lobby-modal').addEventListener('click', () => {
      lobbyModal.classList.remove('show');
    });

    // Create Room (Host)
    document.getElementById('create-room-btn').addEventListener('click', () => {
      this.myRole = 'host';
      document.getElementById('role-val').innerText = '👑 ผู้ถือคำตอบ (Host)';
      document.getElementById('host-reply-bar').style.display = 'block';
      lobbyModal.classList.remove('show');
      this.startNewGameRound(Math.floor(Math.random() * MASTER_CARD_POOL.length));
      this.triggerHoloSignal(`สร้างห้อง ${this.roomCode} สำเร็จ! คุณคือผู้ถือคำตอบ`);
    });

    // Join Room by Code
    document.getElementById('join-room-btn').addEventListener('click', () => {
      const inputCode = document.getElementById('join-room-input').value.trim().toUpperCase();
      if (inputCode) {
        this.roomCode = inputCode;
        const selectedRole = document.querySelector('input[name="join-role"]:checked').value;
        this.myRole = selectedRole;
        document.getElementById('role-val').innerText = selectedRole === 'spectator' ? '🍿 ผู้ชม (Spectator)' : '🕵️ ผู้ทาย (Guesser)';
        document.getElementById('host-reply-bar').style.display = 'none';
        lobbyModal.classList.remove('show');
        this.startNewGameRound(0);
        this.triggerHoloSignal(`เข้าร่วมห้อง ${this.roomCode} แล้ว!`);
      }
    });

    // Rules Modal
    const rulesModal = document.getElementById('whoami-rules-modal');
    const openRulesBtn = document.getElementById('open-rules-btn');
    const closeRulesModal = document.getElementById('close-rules-modal');
    const closeRulesBtnBottom = document.getElementById('close-rules-btn-bottom');
    if (openRulesBtn && rulesModal) {
      openRulesBtn.addEventListener('click', () => rulesModal.classList.add('show'));
    }
    if (closeRulesModal && rulesModal) {
      closeRulesModal.addEventListener('click', () => rulesModal.classList.remove('show'));
    }
    if (closeRulesBtnBottom && rulesModal) {
      closeRulesBtnBottom.addEventListener('click', () => rulesModal.classList.remove('show'));
    }

    const openRulesFromLobby = document.getElementById('open-rules-from-lobby');
    if (openRulesFromLobby && rulesModal && lobbyModal) {
      openRulesFromLobby.addEventListener('click', () => {
        lobbyModal.classList.remove('show');
        rulesModal.classList.add('show');
      });
    }
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

  updatePointerFromEvent(event) {
    const clientX = event.clientX !== undefined ? event.clientX : (event.touches && event.touches[0] ? event.touches[0].clientX : (event.changedTouches && event.changedTouches[0] ? event.changedTouches[0].clientX : 0));
    const clientY = event.clientY !== undefined ? event.clientY : (event.touches && event.touches[0] ? event.touches[0].clientY : (event.changedTouches && event.changedTouches[0] ? event.changedTouches[0].clientY : 0));
    this.mouse.x = (clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(clientY / window.innerHeight) * 2 + 1;
  }

  checkHoverRaycast() {
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

  onMouseMove(event) {
    this.updatePointerFromEvent(event);
    this.checkHoverRaycast();
  }

  onTouchStart(e) {
    if (e.target.closest('.dossier-panel') || e.target.closest('.top-nav') || e.target.closest('.live-chat-panel') || e.target.closest('.modal-card') || e.target.closest('.guidance-card') || e.target.closest('.deck-actions')) {
      return;
    }
    const touch = e.touches[0];
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
    this.touchStartTime = performance.now();
    this.updatePointerFromEvent(touch);
    this.checkHoverRaycast();
  }

  onTouchEnd(e) {
    if (e.target.closest('.dossier-panel') || e.target.closest('.top-nav') || e.target.closest('.live-chat-panel') || e.target.closest('.modal-card') || e.target.closest('.guidance-card') || e.target.closest('.deck-actions')) {
      return;
    }
    const touch = e.changedTouches[0];
    const dx = Math.abs(touch.clientX - this.touchStartX);
    const dy = Math.abs(touch.clientY - this.touchStartY);
    const duration = performance.now() - this.touchStartTime;

    // Mobile / iPad Tap Detection
    if (dx < 18 && dy < 18 && duration < 650) {
      this.updatePointerFromEvent(touch);
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.cardMeshes);
      if (intersects.length > 0) {
        if (e.cancelable) e.preventDefault();
        const clickedCard = intersects[0].object;
        if (this.touchMode === 'eliminate') {
          this.eliminateCard(clickedCard);
        } else {
          this.guessCard(clickedCard);
        }
      }
    }
  }

  applyCardHover(card) {
    if (card.userData.isEliminated) return;
    document.body.style.cursor = 'pointer';
    new TWEEN.Tween(card.position)
      .to({ y: card.userData.origY + 0.3, z: card.userData.origZ + 0.35 }, 180)
      .easing(TWEEN.Easing.Cubic.Out)
      .start();

    if (card.userData.cardData) {
      this.showCardInspector(card.userData.cardData);
    }
  }

  resetCardHover(card) {
    if (card.userData.isEliminated) return;
    document.body.style.cursor = 'default';
    new TWEEN.Tween(card.position)
      .to({ y: card.userData.origY, z: card.userData.origZ }, 200)
      .easing(TWEEN.Easing.Cubic.Out)
      .start();
  }

  showCardInspector(cardData) {
    let hud = document.getElementById('card-inspect-hud');
    if (!hud) {
      hud = document.createElement('div');
      hud.id = 'card-inspect-hud';
      hud.className = 'card-inspect-hud';
      document.body.appendChild(hud);
    }
    const cachedImg = IMAGE_CACHE[cardData.id];
    const imgSrc = (cachedImg && cachedImg.complete && cachedImg.naturalWidth > 0) ? cachedImg.src : null;

    hud.innerHTML = `
      <div class="inspect-inner">
        <div class="inspect-media">
          ${imgSrc ? `<img src="${imgSrc}" class="inspect-img" alt="${cardData.nameTh}">` : `<div class="inspect-fallback">${cardData.icon || '🧬'}</div>`}
        </div>
        <div class="inspect-info">
          <div class="inspect-badge" style="background:${cardData.color || '#0284c7'}">${cardData.tag || 'SPECIMEN'}</div>
          <div class="inspect-title-th">${cardData.nameTh}</div>
          <div class="inspect-title-en">${cardData.nameEn}</div>
          <div class="inspect-clue"><strong>ลักษณะชีววิทยา:</strong> ${cardData.clues && cardData.clues[0] ? cardData.clues[0] : 'โครงสร้างชีววิทยาเซลล์ Campbell'}</div>
        </div>
      </div>
    `;
    hud.classList.add('visible');
  }

  onMouseClick(event) {
    if (event.target.closest('.dossier-panel') || event.target.closest('.top-nav') || event.target.closest('.live-chat-panel') || event.target.closest('.modal-card') || event.target.closest('.guidance-card') || event.target.closest('.deck-actions')) {
      return;
    }

    this.updatePointerFromEvent(event);
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.cardMeshes);

    if (intersects.length > 0) {
      const clickedCard = intersects[0].object;
      if (event.shiftKey || this.touchMode === 'eliminate') {
        this.eliminateCard(clickedCard);
      } else {
        this.guessCard(clickedCard);
      }
    }
  }

  onRightClick(event) {
    event.preventDefault();
    this.updatePointerFromEvent(event);
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.cardMeshes);
    if (intersects.length > 0) {
      const clickedCard = intersects[0].object;
      this.eliminateCard(clickedCard);
    }
  }

  // --- Animation Loop ---
  animate(time) {
    requestAnimationFrame((t) => this.animate(t));
    TWEEN.update();

    if (this.particles) {
      this.particles.rotation.y += 0.0006;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

// Start Game
window.addEventListener('DOMContentLoaded', () => {
  window.game = new WhoAmIGame();
});
