// Main Interactive Logic for Next-Gen Bio-Tech Portal
document.addEventListener('DOMContentLoaded', () => {
  // Tab Switching in Hero Preview
  const tabs = document.querySelectorAll('.preview-tab');
  const panels = document.querySelectorAll('.stage-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-stage');
      
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPanel = document.getElementById(`stage-${target}`);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  // Telemetry Number Counter Animation
  const counters = document.querySelectorAll('.telemetry-val');
  counters.forEach(counter => {
    const text = counter.innerText;
    const match = text.match(/\d+/);
    if (!match) return;
    const targetNum = parseInt(match[0], 10);
    const suffix = text.replace(match[0], '');
    let current = 0;
    const step = Math.max(1, Math.ceil(targetNum / 30));

    const timer = setInterval(() => {
      current += step;
      if (current >= targetNum) {
        current = targetNum;
        clearInterval(timer);
      }
      counter.innerText = current + suffix;
    }, 40);
  });

  // Mini AI Live Assistant Demo Box
  const aiForm = document.getElementById('ai-mini-form');
  const aiInput = document.getElementById('ai-mini-input');
  const aiHistory = document.getElementById('ai-chat-history');

  const knowledgeBase = {
    'apoptosis': 'Apoptosis คือกระบวนการตายของเซลล์ที่ถูกโปรแกรมไว้ (Programmed Cell Death) ทำหน้าที่กำจัดเซลล์ที่ผิดปกติ แก่ตัว หรือติดเชื้อ เพื่อรักษาสมดุลและป้องกันมะเร็ง ผ่าน Caspase Cascade และ Cytochrome C.',
    'ตาย': 'Apoptosis คือกระบวนการตายของเซลล์ตามโปรแกรม ช่วยรักษาสมดุลของร่างกายและกำจัดเซลล์ที่มี DNA เสียหาย',
    'signaling': 'Cell Signaling คือระบบสื่อสารระดับเซลล์ เริ่มจาก Ligand จับกับ Receptor -> ส่งต่อสัญญาณผ่าน Kinase Cascades / Secondary Messengers -> เกิด Cellular Response เช่น การเปิด/ปิดยีน',
    'ส่งสัญญาณ': 'Cell Signaling ประกอบด้วย 3 ขั้นตอนหลัก: 1. Reception (รับสัญญาณ) 2. Transduction (ถ่ายทอดสัญญาณ) 3. Response (การตอบสนอง)',
    'expression': 'Gene Expression คือกระบวนการแสดงออกของยีน แปลงรหัส DNA เป็น mRNA (Transcription) และสังเคราะห์เป็นโปรตีน (Translation)',
    'ยีน': 'Gene Expression ควบคุมโดย Transcription Factors และ Epigenetics เพื่อสร้างโปรตีนตามความต้องการของเซลล์',
    'cycle': 'Cell Cycle คือวงจรชีวิตของเซลล์ แบ่งเป็น Interphase (G1, S, G2) และ M-Phase (Mitosis + Cytokinesis) โดยมี Checkpoints คอยตรวจสอบความสมบูรณ์ของ DNA',
    'operon': 'Lac Operon คือระบบควบคุมการแสดงออกของยีนในแบคทีเรีย ทำงานเมื่อมี Lactose เข้ามาจับกับ Repressor ทำให้ RNA Polymerase สามารถถอดรหัสได้'
  };

  if (aiForm && aiInput && aiHistory) {
    aiForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = aiInput.value.trim();
      if (!query) return;

      // Append user msg
      const userDiv = document.createElement('div');
      userDiv.className = 'ai-msg';
      userDiv.style.justifyContent = 'flex-end';
      userDiv.innerHTML = `
        <div class="ai-bubble" style="background: rgba(0, 242, 254, 0.15); border: 1px solid rgba(0, 242, 254, 0.3); color: #fff;">
          ${escapeHtml(query)}
        </div>
      `;
      aiHistory.appendChild(userDiv);
      aiInput.value = '';

      // Scroll to bottom
      aiHistory.scrollTop = aiHistory.scrollHeight;

      // Thinking indicator
      const botDiv = document.createElement('div');
      botDiv.className = 'ai-msg';
      botDiv.innerHTML = `
        <div class="ai-avatar-badge">🤖</div>
        <div class="ai-bubble" style="color: var(--accent-cyan); font-style: italic;">
          กำลังประมวลผลคำตอบชีวโมเลกุล...
        </div>
      `;
      aiHistory.appendChild(botDiv);
      aiHistory.scrollTop = aiHistory.scrollHeight;

      // Find response
      setTimeout(() => {
        let answer = 'ขออภัย ฉันกำลังค้นคว้าข้อมูลเพิ่มเติม คุณสามารถคลิกสำรวจเนื้อหาแบบละเอียดในโหมดเกาะลอยฟ้า 3D หรือบทความ 6 ฐานความรู้ด้านล่างได้ทันที!';
        const lowerQ = query.toLowerCase();
        for (const [k, v] of Object.entries(knowledgeBase)) {
          if (lowerQ.includes(k)) {
            answer = v;
            break;
          }
        }

        botDiv.innerHTML = `
          <div class="ai-avatar-badge">🤖</div>
          <div class="ai-bubble">
            ${answer}
          </div>
        `;
        aiHistory.scrollTop = aiHistory.scrollHeight;
      }, 600);
    });
  }

  function escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }
});
