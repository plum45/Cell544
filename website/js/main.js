// Apple Cupertino Interactive Features & Dynamics for CYTOLIFE (Academic & Biological Edition)
document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Island Expansion & Academic Status
  const dynamicIsland = document.getElementById('dynamic-island');
  const islandText = document.getElementById('island-text');
  const islandBadge = document.getElementById('island-badge');

  const islandStates = [
    { text: 'ระบบควบคุมชีวิตของเซลล์ &bull; สื่อการเรียนรู้ชีววิทยาโมเลกุล', badge: 'มาตรฐาน สสวท.' },
    { text: '6 บทเรียนกลไกระดับเซลล์ &bull; แบบจำลองโครงสร้าง 3 มิติ', badge: 'CAMPBELL BIOLOGY' },
    { text: 'ระบบวิเคราะห์และประเมินผลการเรียนรู้ &bull; Bio-AI Mentor', badge: 'ACTIVE' }
  ];
  let stateIdx = 0;

  if (dynamicIsland && islandText && islandBadge) {
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

  // 2. Interactive Reality Palette Switcher
  const dots = document.querySelectorAll('.switcher-dot');
  const captionTitle = document.getElementById('caption-title');
  const captionSub = document.getElementById('caption-sub');
  const captionBtn = document.getElementById('caption-btn');

  const realityThemes = {
    '3d': {
      title: 'เกาะลอยฟ้าจำลองชีวโมเลกุล 3 มิติ',
      sub: 'สำรวจโครงสร้างและตำแหน่งของออร์แกเนลล์ชีวโมเลกุลสำคัญในรูปแบบ 3 มิติเสมือนจริง',
      btnText: 'เปิดแบบจำลอง 3D เต็มจอ ➔',
      btnLink: 'island-3d/index.html'
    },
    '2d': {
      title: 'ห้องปฏิบัติการชีววิทยาเซลล์จำลอง 2D',
      sub: 'แบบจำลองการทดลองทางชีวเคมี ศึกษาปฏิกิริยาภูมิคุ้มกันและการรักษาสมดุลเซลล์',
      btnText: 'เข้าสู่ห้องทดลองจำลอง ➔',
      btnLink: 'game-2d/index.html'
    },
    'ai': {
      title: 'ผู้ช่วยสอนชีววิทยาอัจฉริยะ (AI Bio-Tutor)',
      sub: 'วิเคราะห์และไขข้อข้องใจทางชีววิทยาโมเลกุลและพันธุศาสตร์ระดับเซลล์แบบเจาะลึก',
      btnText: 'สนทนากับผู้ช่วยสอน AI ➔',
      btnLink: '#ai-assistant'
    }
  };

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      dots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
      const mode = dot.getAttribute('data-mode');
      if (realityThemes[mode]) {
        if (captionTitle) captionTitle.innerText = realityThemes[mode].title;
        if (captionSub) captionSub.innerText = realityThemes[mode].sub;
        if (captionBtn) {
          captionBtn.innerText = realityThemes[mode].btnText;
          captionBtn.setAttribute('href', realityThemes[mode].btnLink);
        }
      }
    });
  });

  // 3. AI Assistant Chat Simulator
  const aiForm = document.getElementById('ai-apple-form');
  const aiInput = document.getElementById('ai-apple-input');
  const aiThread = document.getElementById('ai-chat-thread');

  const BIO_KNOWLEDGE = [
    {
      keywords: ['transcription', 'ถอดรหัส', 'rna polymerase', 'mrna'],
      answer: 'การถอดรหัส (Transcription) เกิดขึ้นในนิวเคลียส โดยเอนไซม์ RNA Polymerase II จะใช้สาย DNA แม่แบบ (Template strand) สังเคราะห์สาย mRNA ตามลำดับเบสคู่สม จากนั้น mRNA จะผ่านกระบวนการ Post-transcriptional modification (เติม 5\' cap, poly-A tail และ Splicing) ก่อนส่งออกไปยังไซโทพลาซึมครับ'
    },
    {
      keywords: ['translation', 'แปลรหัส', 'ribosome', 'ไรโบโซม', 'โปรตีน'],
      answer: 'การแปลรหัส (Translation) เกิดขึ้นที่ไรโบโซม 80S โดยเริ่มจาก tRNA นำกรดแอมิโนตัวแรก (Methionine ที่รหัสเริ่มต้น AUG) เข้ามาจับที่ P-site จากนั้น tRNA ตัวถัดไปจะเข้ามาที่ A-site และเกิดการสร้างพันธะเพปไทด์ (Peptide bond) ต่อสายพอลิเพปไทด์จนถึงรหัสหยุด (Stop codon: UAA, UAG, UGA) ครับ'
    },
    {
      keywords: ['operon', 'lac operon', 'การควบคุมยีน', 'gene regulation'],
      answer: 'Lac Operon ในแบคทีเรีย E. coli เป็นโมเดลการควบคุมยีนแบบเหนี่ยวนำ (Inducible operon) ในสภาวะที่ไม่มีแลกโทส โปรตีน Repressor จะจับกับ Operator ยับยั้งการทำงานของ RNA Polymerase แต่เมื่อมีแลกโทส Allolactose จะจับกับ Repressor ทำให้หลุดออกจาก Operator และเกิดการถอดรหัสยีนสร้างเอนไซม์ย่อยแลกโทสได้ครับ'
    },
    {
      keywords: ['signaling', 'gpcr', 'cAMP', 'การสื่อสาร', 'ส่งสัญญาณ'],
      answer: 'การสื่อสารระดับเซลล์ผ่าน GPCR เริ่มจาก Ligand จับกับตัวรับบนเยื่อหุ้มเซลล์ ทำให้ G-protein เกิดการกระตุ้นและปล่อยหน่วยย่อยแอลฟาไปกระตุ้นเอนไซม์ Adenylyl cyclase เปลี่ยน ATP เป็น cAMP ซึ่งทำหน้าที่เป็น Second Messenger ไปกระตุ้น Protein Kinase A (PKA) ส่งต่อสัญญาณเป็นทอดๆ ครับ'
    },
    {
      keywords: ['apoptosis', 'การตาย', 'caspase', 'cytochrome'],
      answer: 'Apoptosis คือการตายของเซลล์ตามโปรแกรมที่ถูกควบคุมอย่างเข้มงวด โดยในวิถีภายใน (Intrinsic pathway) ความเสียหายของ DNA จะกระตุ้นให้เยื่อหุ้มไมโทคอนเดรียรั่ว ปล่อย Cytochrome c ออกมาจับกับ Apaf-1 เกิดเป็น Apoptosome กระตุ้น Caspase-9 และ Caspase-3 ย่อยสลายโครงสร้างเซลล์อย่างเป็นระเบียบโดยไม่ก่อให้เกิดการอักเสบครับ'
    },
    {
      keywords: ['cycle', 'วัฏจักร', 'mitosis', 'checkpoint', 'p53'],
      answer: 'วัฏจักรเซลล์ประกอบด้วย Interphase (G1, S, G2) และ M Phase (Mitosis) มีจุดตรวจความปลอดภัยหลัก 3 จุดคือ G1/S, G2/M และ Spindle Checkpoint โดยมี Cyclin-CDK Complex ควบคุม และโปรตีน p53 ทำหน้าที่ตรวจจับความเสียหายของ DNA หากตรวจพบความเสียหายจะหยุดวัฏจักรเซลล์เพื่อซ่อมแซม หรือสั่งเซลล์เข้าสู่กระบวนการ Apoptosis ครับ'
    }
  ];

  if (aiForm && aiInput && aiThread) {
    aiForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = aiInput.value.trim();
      if (!q) return;

      // Append User message
      const userMsg = document.createElement('div');
      userMsg.className = 'apple-ai-msg user';
      userMsg.innerHTML = `<div class="apple-ai-bubble">${escapeHtml(q)}</div>`;
      aiThread.appendChild(userMsg);
      aiInput.value = '';
      aiThread.scrollTop = aiThread.scrollHeight;

      // Generate Bio response
      setTimeout(() => {
        let matched = BIO_KNOWLEDGE.find(item => 
          item.keywords.some(k => q.toLowerCase().includes(k))
        );
        let respText = matched 
          ? matched.answer 
          : `สำหรับคำถาม "${escapeHtml(q)}" ในทางชีววิทยาเซลล์ กระบวนการนี้เกี่ยวข้องกับกลไกการส่งสัญญาณ การควบคุมการแสดงออกของยีน และการรักษาดุลยภาพของเซลล์ครับ คุณสามารถคลิกดูเนื้อหาเจาะลึกได้ที่เมนู "ศูนย์รวมเนื้อหา" ด้านบนครับ`;

        const botMsg = document.createElement('div');
        botMsg.className = 'apple-ai-msg';
        botMsg.innerHTML = `<div class="apple-ai-bubble">${respText}</div>`;
        aiThread.appendChild(botMsg);
        aiThread.scrollTop = aiThread.scrollHeight;
      }, 400);
    });
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
});
