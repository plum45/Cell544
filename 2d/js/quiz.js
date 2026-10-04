// ===== Timed Biology Survival Quiz System =====
// Answer questions within countdown to unlock security blast doors, activate laser turrets, and synthesize the cure!

import { playSuccessChime, playClickSound, playNote } from './audio.js';

export const QUIZ_QUESTIONS = [
  {
    id: 'airlock_gate',
    sector: 'ประตูกักกันโรค (Quarantine Airlock Gate)',
    q: 'เพื่อเปิดประตูกักกันโรคและปลดล็อกระบบกรองอากาศ: กระบวนการใดที่เซลล์ใช้ในการลำเลียงสารจากความเข้มข้นต่ำไปสูง โดยต้องใช้พลังงาน ATP?',
    options: [
      'Simple Diffusion (การแพร่แบบธรรมดา)',
      'Active Transport (การลำเลียงแบบใช้พลังงาน)',
      'Facilitated Diffusion (การแพร่ฟาซิลลิเทต)',
      'Osmosis (การออสโมซิส)'
    ],
    ans: 1,
    timeLimit: 18,
    exp: 'Active Transport ต้องอาศัยพลังงานจาก ATP และ Protein Carrier ในการลำเลียงสารต้านความเข้มข้น (Concentration Gradient)'
  },
  {
    id: 'caspase_laser',
    sector: 'ป้อมปืนเลเซอร์ Caspase (Caspase Defense Laser)',
    q: 'เพื่อยิงเลเซอร์ Caspase สลายเซลล์ซอมบี้กลายพันธุ์: ยีนยับยั้งการเกิดเนื้องอก (Tumor Suppressor Gene) ที่ทำหน้าที่เป็น "Guardian of the Genome" สั่งเซลล์เข้าสู่ Apoptosis คือยีนใด?',
    options: [
      'ยีน p53 (TP53)',
      'ยีน LacZ',
      'ยีน Insulin',
      'ยีน Rhodopsin'
    ],
    ans: 0,
    timeLimit: 16,
    exp: 'p53 จะตรวจจับความเสียหายของ DNA หากซ่อมแซมไม่ได้จะกระตุ้น Bax/Bak ปล่อย Cytochrome C และสั่งการเอนไซม์ Caspase ทำลายเซลล์ผิดปกติ'
  },
  {
    id: 'bio_shield',
    sector: 'เครื่องกำเนิดม่านพลังงานชีวภาพ (Bio-Shield Generator)',
    q: 'เพื่อสร้างสนามพลังป้องกันซอมบี้: โมเลกุลสื่อสารทุติยภูมิ (Second Messenger) ที่สร้างขึ้นจาก ATP โดยเอนไซม์ Adenylyl Cyclase ในกระบวนการ Cell Signaling คือข้อใด?',
    options: [
      'cGMP',
      'cAMP (Cyclic AMP)',
      'IP3',
      'Diacylglycerol (DAG)'
    ],
    ans: 1,
    timeLimit: 16,
    exp: 'cAMP ถูกกระตุ้นจาก G-protein (Gs) ส่งผลให้เกิดการกระตุ้นเอนไซม์ Protein Kinase A (PKA) ขยายสัญญาณภายในเซลล์'
  },
  {
    id: 'cure_synthesis',
    sector: 'สถานีสังเคราะห์วัคซีนกู้โลก (Vaccine Synthesis Terminal)',
    q: 'เพื่อสังเคราะห์สารแก้พิษไวรัสกลายพันธุ์: ในกระบวนการ Translation ของเซลล์ ยูคาริโอต Start Codon ตัวแรกสุดบนสาย mRNA ที่กำหนดกรดอะมิโน Methionine คือรหัสใด?',
    options: [
      'UAA',
      'UAG',
      'AUG',
      'UGA'
    ],
    ans: 2,
    timeLimit: 15,
    exp: 'AUG คือ Start Codon เพียงรหัสเดียวที่กำหนด Methionine ทำหน้าที่เป็นจุดเริ่มต้นของการแปลรหัสสร้างโปรตีน'
  },
  {
    id: 'mitochondria_power',
    sector: 'เครื่องปั่นไฟสำรองชีวภาพ (Mitochondria Power Core)',
    q: 'เพื่อจ่ายไฟกระตุ้นรั้วไฟฟ้า: ออร์แกเนลล์ใดทำหน้าที่เป็น "Powerhouse of the Cell" ผลิตพลังงาน ATP ผ่านกระบวนการ Cellular Respiration?',
    options: [
      'Golgi Apparatus (กอลจิคอมเพล็กซ์)',
      'Mitochondria (ไมโทคอนเดรีย)',
      'Lysosome (ไลโซโซม)',
      'Ribosome (ไรโบโซม)'
    ],
    ans: 1,
    timeLimit: 15,
    exp: 'Mitochondria ทำหน้าที่สร้าง ATP ผ่าน Krebs Cycle และ Electron Transport Chain'
  }
];

export let activeQuiz = null;
let quizTimer = null;
let remainingSeconds = 0;

export function triggerTerminalQuiz(terminalId, onSuccess, onFailure) {
  const questionData = QUIZ_QUESTIONS.find(q => q.id === terminalId) || QUIZ_QUESTIONS[0];
  activeQuiz = {
    ...questionData,
    onSuccess,
    onFailure,
  };

  remainingSeconds = activeQuiz.timeLimit;

  // Sound alert
  playAlarmChime();

  // Render Quiz Modal
  const modal = document.getElementById('quiz-terminal-modal');
  if (!modal) return;

  document.getElementById('quiz-sector-name').textContent = activeQuiz.sector;
  document.getElementById('quiz-question-text').textContent = activeQuiz.q;
  document.getElementById('quiz-timer-text').textContent = `${remainingSeconds}s`;
  document.getElementById('quiz-timer-bar').style.width = '100%';

  const optsContainer = document.getElementById('quiz-options-grid');
  optsContainer.innerHTML = '';

  activeQuiz.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-opt-btn';
    btn.innerHTML = `<span class="opt-key">${String.fromCharCode(65 + idx)}.</span> <span>${opt}</span>`;
    btn.onclick = () => submitQuizAnswer(idx);
    optsContainer.appendChild(btn);
  });

  modal.classList.add('visible');

  // Start Countdown
  if (quizTimer) clearInterval(quizTimer);
  quizTimer = setInterval(() => {
    remainingSeconds--;
    document.getElementById('quiz-timer-text').textContent = `${remainingSeconds}s`;
    const pct = Math.max(0, (remainingSeconds / activeQuiz.timeLimit) * 100);
    document.getElementById('quiz-timer-bar').style.width = `${pct}%`;

    // Beep sound
    if (remainingSeconds <= 5) {
      playNote(880, 'square', 0.08, 0.1);
    } else {
      playNote(440, 'sine', 0.04, 0.03);
    }

    if (remainingSeconds <= 0) {
      clearInterval(quizTimer);
      handleQuizTimeout();
    }
  }, 1000);
}

function submitQuizAnswer(chosenIdx) {
  if (!activeQuiz) return;
  clearInterval(quizTimer);

  const isCorrect = chosenIdx === activeQuiz.ans;
  const buttons = document.querySelectorAll('.quiz-opt-btn');
  buttons.forEach((b, i) => {
    b.disabled = true;
    if (i === activeQuiz.ans) b.classList.add('correct');
    else if (i === chosenIdx) b.classList.add('wrong');
  });

  if (isCorrect) {
    playSuccessChime();
    setTimeout(() => {
      closeQuizModal();
      if (activeQuiz && activeQuiz.onSuccess) activeQuiz.onSuccess(activeQuiz);
    }, 1200);
  } else {
    playBuzzerSound();
    setTimeout(() => {
      closeQuizModal();
      if (activeQuiz && activeQuiz.onFailure) activeQuiz.onFailure(activeQuiz);
    }, 1500);
  }
}

function handleQuizTimeout() {
  playBuzzerSound();
  const buttons = document.querySelectorAll('.quiz-opt-btn');
  buttons.forEach((b, i) => {
    b.disabled = true;
    if (i === activeQuiz.ans) b.classList.add('correct');
  });

  setTimeout(() => {
    closeQuizModal();
    if (activeQuiz && activeQuiz.onFailure) activeQuiz.onFailure(activeQuiz);
  }, 1500);
}

function closeQuizModal() {
  const modal = document.getElementById('quiz-terminal-modal');
  if (modal) modal.classList.remove('visible');
  if (quizTimer) clearInterval(quizTimer);
}

function playAlarmChime() {
  playNote(659.25, 'sawtooth', 0.25, 0.15);
  setTimeout(() => playNote(587.33, 'sawtooth', 0.25, 0.15), 180);
}

function playBuzzerSound() {
  playNote(130, 'sawtooth', 0.4, 0.25);
  setTimeout(() => playNote(110, 'sawtooth', 0.5, 0.25), 250);
}
