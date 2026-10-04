// ===== Procedural Dialogue & Generative Agent Memory System =====
import { playSpeechBlip } from './audio.js';

// Biological & Daily Routine topics
const DIALOGUE_TOPICS = {
  gene_expression: [
    'เธอรู้ไหมว่า RNA Polymerase II ทำงานสังเคราะห์สาย mRNA ได้เร็วถึง 50 นิวคลีโอไทด์ต่อวินาทีเลยนะ!',
    'ฉันกำลังวิเคราะห์การต่อหาง Poly-A tail ของ mRNA เพื่อดูว่าช่วยป้องกันการย่อยสลายได้นานแค่ไหน',
    'การตัดต่อ Intron ด้วย Spliceosome ทำให้สิ่งมีชีวิตหนึ่งยีนสามารถสร้างโปรตีนได้หลากหลายชนิด!',
  ],
  cell_signaling: [
    'ตัวรับแบบ GPCR ตอนนี้กำลังส่งสัญญาณกระตุ้น Adenylyl cyclase ผลิตโมเลกุลสื่อสารทุติยภูมิ cAMP อย่างรวดเร็ว',
    'การสื่อสารแบบ Paracrine ช่วยให้เซลล์เนื้อเยื่อข้างเคียงตอบสนองต่อบาดแผลได้ทันท่วงทีเลยล่ะ',
    'ฟอสโฟรีเลชันแบบ Cascade ทำให้สัญญาณจากฮอร์โมนเพียง 1 โมเลกุล ขยายผลได้นับล้านเท่า!',
  ],
  apoptosis: [
    'ถ้า DNA เสียหายเกินจะซ่อมแซม โปรตีน p53 จะสั่งกระตุ้น Caspase Cascade เพื่อเข้าสู่ Apoptosis อย่างปลอดภัย',
    'Apoptosis แตกต่างจาก Necrosis ตรงที่ไม่ทำให้เซลล์แตกและไม่ก่อให้เกิดการอักเสบในเนื้อเยื่อรอบข้าง',
  ],
  daily_life: [
    'กาแฟเอสเปรสโซ่แก้วนี้ช่วยยับยั้ง Adenosine Receptor ได้ดีจริงๆ พร้อมลุยแล็บต่อแล้ว!',
    'ท่วงทำนองเปียโนเพลงเมื่อกี้ช่วยให้สมองผ่อนคลาย คลื่นอัลฟาในเซลล์ประสาทพุ่งสูงเลย',
    'บ่ายนี้อากาศในสวนดีมาก ไปเดินดูดอกไม้สังเคราะห์แสงกันไหม?',
    'ใครแช่พิซซ่าไว้ในตู้เย็นครัวหรือเปล่า? กลิ่นชีสลอยออกมาหอมเตะจมูกมาก!',
  ]
};

// Generative interaction between two agents
export function generateConversation(agentA, agentB) {
  playSpeechBlip();

  const isBioChat = Math.random() < 0.65;
  const pool = isBioChat
    ? [...DIALOGUE_TOPICS.gene_expression, ...DIALOGUE_TOPICS.cell_signaling, ...DIALOGUE_TOPICS.apoptosis]
    : DIALOGUE_TOPICS.daily_life;

  const phraseA = pool[Math.floor(Math.random() * pool.length)];

  // Create reaction for agent B
  const reactions = [
    'เห็นด้วยเลย! ข้อมูลนี้ตรงกับการทดลองตัวอย่างล่าสุดของฉันพอดี',
    'น่าสนใจมาก! เดี๋ยวฉันจะลองเอาสมมติฐานนี้ไปทดสอบกับเครื่อง Sequencer ดูนะ',
    'จริงด้วยสิ! กลไกโมเลกุลของเซลล์นี่ช่างมหัศจรรย์และแม่นยำจริงๆ',
    'ฮ่าๆ ยินดีที่ได้คุยกันนะ ขอตัวไปเตรียมตัวอย่างทดลองรอบบ่ายก่อนล่ะ!'
  ];
  const phraseB = reactions[Math.floor(Math.random() * reactions.length)];

  const emojisA = ['💬', '🧬', '🔬', '💡', '☕', '✨'];
  const emojisB = ['❤️', '👍', '📝', '🧠', '🔍', '😊'];

  const emojiA = emojisA[Math.floor(Math.random() * emojisA.length)];
  const emojiB = emojisB[Math.floor(Math.random() * emojisB.length)];

  // Record into both agents' memory
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const memoryA = `[${timestamp}] สนทนากับ ${agentB.name}: "${phraseA}"`;
  const memoryB = `[${timestamp}] สนทนากับ ${agentA.name}: "${phraseB}"`;

  agentA.memories.unshift(memoryA);
  agentB.memories.unshift(memoryB);

  if (agentA.memories.length > 20) agentA.memories.pop();
  if (agentB.memories.length > 20) agentB.memories.pop();

  return {
    speakerA: agentA,
    speakerB: agentB,
    textA: phraseA,
    textB: phraseB,
    emojiA,
    emojiB,
  };
}

// Conversation with the player
export function talkToPlayer(agent, player) {
  playSpeechBlip();

  const greetings = [
    `สวัสดีคุณนักวิจัย! ตอนนี้ฉันกำลัง ${agent.currentActivity} อยู่พอดีเลย สนใจมาวิจัยด้วยกันไหม?`,
    `ไง! วันนี้เกาะเซลล์ลอยฟ้าอากาศสดใสมาก ตัวอย่างการทดลองของเราทำงานได้อย่างราบรื่นสุดๆ`,
    `ยินดีต้อนรับสู่สถาบันวิจัยชีววิทยาโมเลกุล! ลองเดินสำรวจห้องแล็บและเครื่องมือต่างๆ ได้ตามสบายเลยนะ`,
    `โอ๊ะ สวัสดี! เพิ่งแวะไปชงกาแฟมา ถ้าเหนื่อยก็แวะไปนั่งเล่นเปียโนในห้องรับรองได้นะ`,
  ];

  const speech = greetings[Math.floor(Math.random() * greetings.length)];

  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  agent.memories.unshift(`[${timestamp}] ทักทายผู้เล่น (Player): "${speech}"`);
  if (agent.memories.length > 20) agent.memories.pop();

  return speech;
}
