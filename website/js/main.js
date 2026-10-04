// Apple Cupertino Interactive Features & Dynamics for CYTOLIFE
document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Island Expansion & Stats
  const dynamicIsland = document.getElementById('dynamic-island');
  const islandText = document.getElementById('island-text');
  const islandBadge = document.getElementById('island-badge');

  const islandStates = [
    { text: 'CELLULAR OS 18 PRO &bull; 60 FPS', badge: 'LIVE' },
    { text: '6 MODULES READY &bull; NEMOTRON AI', badge: 'ONLINE' },
    { text: 'ZELDA 3D ENGINE &bull; 7 TREASURES', badge: 'READY' }
  ];
  let stateIdx = 0;

  if (dynamicIsland) {
    dynamicIsland.addEventListener('click', () => {
      stateIdx = (stateIdx + 1) % islandStates.length;
      dynamicIsland.style.transform = 'scale(0.95)';
      setTimeout(() => {
        islandText.innerHTML = islandStates[stateIdx].text;
        islandBadge.innerText = islandStates[stateIdx].badge;
        dynamicIsland.style.transform = 'scale(1.05)';
        setTimeout(() => dynamicIsland.style.transform = 'scale(1)', 150);
      }, 100);
    });
  }

  // 2. Interactive Color / Reality Palette Switcher
  const dots = document.querySelectorAll('.switcher-dot');
  const captionTitle = document.getElementById('caption-title');
  const captionSub = document.getElementById('caption-sub');
  const captionBtn = document.getElementById('caption-btn');

  const realityThemes = {
    '3d': {
      title: 'เกาะลอยฟ้าแฟนตาซี 3 มิติ (Titanium Spatial)',
      sub: 'Open-world spatial exploration rendered in full WebGL 60 FPS',
      btnText: 'เปิดโลก 3D เต็มจอ ➔',
      btnLink: '../island-3d/index.html',
      color: '#38bdf8'
    },
    '2d': {
      title: 'สถาบันวิจัยชีววิทยา 2D Lab (Bio-Simulation)',
      sub: 'Autonomous Stanford Agents sandbox & zombie cellular outbreak',
      btnText: 'เข้าเล่นเกมแล็บ 2D ➔',
      btnLink: '../game-2d/index.html',
      color: '#0284c7'
    },
    'ai': {
      title: 'AI Neural Bio-Assistant (Neural Core)',
      sub: 'Interactive NVIDIA Nemotron molecular question-answering',
      btnText: 'สนทนากับ AI Guide ➔',
      btnLink: '#ai-assistant',
      color: '#00d2ff'
    }
  };

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      dots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
      const mode = dot.getAttribute('data-mode');
      const info = realityThemes[mode];
      if (info && captionTitle && captionSub && captionBtn) {
        captionTitle.innerText = info.title;
        captionSub.innerText = info.sub;
        captionBtn.innerText = info.btnText;
        captionBtn.href = info.btnLink;
        captionBtn.style.backgroundColor = info.color;

        // Broadcast color event to 3D canvas if available
        if (window.setDnaColor) {
          window.setDnaColor(info.color);
        }
      }
    });
  });

  // 3. Apple Spec Counter Animation
  const specNumbers = document.querySelectorAll('.spec-number');
  specNumbers.forEach(numEl => {
    const text = numEl.innerText;
    const match = text.match(/\d+/);
    if (!match) return;
    const targetNum = parseInt(match[0], 10);
    const prefix = text.split(match[0])[0];
    const suffix = text.split(match[0])[1] || '';
    let current = 0;
    const step = Math.max(1, Math.ceil(targetNum / 25));

    const timer = setInterval(() => {
      current += step;
      if (current >= targetNum) {
        current = targetNum;
        clearInterval(timer);
      }
      numEl.innerText = prefix + current + suffix;
    }, 45);
  });

  // 4. Apple-style Mini AI Chat Console
  const aiForm = document.getElementById('ai-apple-form');
  const aiInput = document.getElementById('ai-apple-input');
  const aiThread = document.getElementById('ai-chat-thread');

  const knowledgeBase = {
    'apoptosis': 'Apoptosis คือกลไกการตายของเซลล์ที่ถูกโปรแกรมไว้ (Programmed Cell Death) เพื่อกำจัดเซลล์ที่ผิดปกติ รักษาดุลยภาพของเนื้อเยื่อ และป้องกันมะเร็ง ผ่าน Caspase Cascade และ Cytochrome C',
    'ตาย': 'Apoptosis คือกระบวนการตายของเซลล์ตามโปรแกรมเพื่อความอยู่รอดของสิ่งมีชีวิต',
    'signaling': 'Cell Signaling ทำงาน 3 ขั้นตอน: 1. Reception (จับตัวรับ) 2. Transduction (ส่งต่อสัญญาณ) 3. Response (การตอบสนอง เช่น เปิดยีนสร้างโปรตีน)',
    'ส่งสัญญาณ': 'Cell Signaling คือการสื่อสารระหว่างเซลล์ผ่าน Ligand และ Receptor เช่น GPCR และ Tyrosine Kinase',
    'expression': 'Gene Expression คือกระบวนการแสดงออกของยีน: ถอดรหัส DNA เป็น mRNA (Transcription) และแปลรหัสเป็นโปรตีน (Translation)',
    'ยีน': 'Gene Regulation ถูกควบคุมอย่างประณีตด้วย Transcription Factors และ Epigenetics',
    'cycle': 'Cell Cycle ควบคุมด้วยจุดตรวจ (Checkpoints: G1, G2/M, Spindle) โดยมีโปรตีน Cyclin, CDK และ p53 คอยตรวจสอบความปลอดภัยของสารพันธุกรรม'
  };

  if (aiForm && aiInput && aiThread) {
    aiForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = aiInput.value.trim();
      if (!q) return;

      // Append user msg
      const userMsg = document.createElement('div');
      userMsg.className = 'apple-ai-msg';
      userMsg.style.justifyContent = 'flex-end';
      userMsg.innerHTML = `
        <div class="apple-ai-bubble" style="background: var(--apple-blue); color: #fff;">
          ${escapeHtml(q)}
        </div>
      `;
      aiThread.appendChild(userMsg);
      aiInput.value = '';
      aiThread.scrollTop = aiThread.scrollHeight;

      // Thinking indicator
      const botMsg = document.createElement('div');
      botMsg.className = 'apple-ai-msg';
      botMsg.innerHTML = `
        <div class="apple-ai-bubble" style="color: var(--apple-blue); font-style: italic;">
          AI กำลังวิเคราะห์ข้อมูลชีวโมเลกุล...
        </div>
      `;
      aiThread.appendChild(botMsg);
      aiThread.scrollTop = aiThread.scrollHeight;

      setTimeout(() => {
        let ans = 'คุณสามารถสำรวจโครงสร้าง 3D และเนื้อหาเจาะลึกได้ในหน้าโมดูลหลักด้านบน';
        const lower = q.toLowerCase();
        for (const [k, v] of Object.entries(knowledgeBase)) {
          if (lower.includes(k)) {
            ans = v;
            break;
          }
        }
        botMsg.innerHTML = `
          <div class="apple-ai-bubble">
            ${ans}
          </div>
        `;
        aiThread.scrollTop = aiThread.scrollHeight;
      }, 500);
    });
  }

  function escapeHtml(text) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return text.replace(/[&<>"']/g, m => map[m]);
  }
});
