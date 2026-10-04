// 3D Fibonacci Sphere Hero Engine for CYTOLIFE Pro
(function() {
  'use strict';

  const CDN = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/';

  const SHOTS = [
    {
      id: 'hf_20260922_194349_26ffdbfd-ac5e-49e9-a07d-c06d3f7cb4cb',
      title: 'Gene Expression',
      place: 'Central Dogma · Transcription & Translation',
      note: 'การแสดงออกของยีน: ถอดรหัส DNA เป็น mRNA และแปลรหัสเป็นสายพอลิเพปไทด์เพื่อสังเคราะห์โปรตีนตามคำสั่งพันธุกรรม'
    },
    {
      id: 'hf_20260922_194350_5546ea3d-6336-42c7-a59f-06165c5802be',
      title: 'Gene Regulation',
      place: 'Lac Operon · Transcription Factors',
      note: 'ระบบควบคุมการแสดงออกของยีน: โครงสร้าง Operon ในแบคทีเรีย และการเปิด/ปิดยีนในยูแคริโอตด้วย Epigenetics'
    },
    {
      id: 'hf_20260922_194349_b4533691-cb49-41d4-b56c-51f0fdcbe250',
      title: 'Cell Signaling',
      place: 'Receptor · GPCR & Tyrosine Kinase',
      note: 'การสื่อสารระดับเซลล์: การจับของ Ligand กับตัวรับสัญญาณบนเยื่อหุ้มเซลล์ และการส่งต่อสัญญาณด้วย Secondary Messengers'
    },
    {
      id: 'hf_20260922_194349_e588abd3-1bfa-4918-894f-05632cc51ccc',
      title: 'Cellular Response',
      place: 'Kinase Cascades · Metabolic Shift',
      note: 'การตอบสนองของเซลล์: การกระตุ้นเอนไซม์ การปรับเปลี่ยนเมแทบอลิซึม และการจัดระเบียบ Cytoskeleton เพื่อการเคลื่อนที่'
    },
    {
      id: 'hf_20260922_194350_28d92c80-de66-41cb-911e-b3b44aebe1f5',
      title: 'Apoptosis Cascade',
      place: 'Caspase Activation · Cytochrome C',
      note: 'การตายของเซลล์ตามโปรแกรม: กลไกกำจัดเซลล์ที่เสียหายหรือติดเชื้อ รักษาดุลยภาพของเนื้อเยื่อ และป้องกันมะเร็ง'
    },
    {
      id: 'hf_20260922_194349_04e89718-4214-4aff-bac5-490462bbfe2f',
      title: 'Cell Cycle & Checkpoints',
      place: 'Interphase · Mitosis · p53 Tumor Suppressor',
      note: 'วัฏจักรเซลล์: การจำลอง DNA ใน S-phase การแบ่งนิวเคลียสใน M-phase และจุดตรวจความปลอดภัย G1/S/G2-M'
    },
    {
      id: 'hf_20260922_194417_2c031e22-2fad-4c81-a544-83cd6bba1c33',
      title: '2D Bio-Lab Simulation',
      place: 'Autonomous Stanford Agents · Zombie Outbreak',
      note: 'สถาบันวิจัยแล็บ 2D: จำลองการทดลองชีววิทยาโมเลกุล ผสมยาต้านแอนติเจน และเอาชีวิตรอดจากซอมบี้เซลล์กลายพันธุ์'
    },
    {
      id: 'hf_20260922_194349_a39c3226-7848-4b15-b840-98ad8aec467b',
      title: '3D Floating Island',
      place: 'Zelda Forest Temple · Open World Spatial',
      note: 'เกาะลอยฟ้าแฟนตาซี 3 มิติ: สำรวจ 6 ศาลเจ้าชีววิทยา วิ่งเล่นกับสัตว์ป่า และล่า 7 ขุมทรัพย์ลับของเซลล์'
    },
    {
      id: 'hf_20260922_194417_555e4d90-f35f-4a1a-8c75-def1e8b71988',
      title: 'DNA Double Helix',
      place: 'Molecular Structure · Base Pairing',
      note: 'โครงสร้างเกลียวคู่ดีเอ็นเอ: เบสคู่สม A-T และ G-C เชื่อมด้วยพันธะไฮโดรเจนบนสายแกนน้ำตาลฟอสเฟต'
    },
    {
      id: 'hf_20260922_194417_e525a243-03c8-454b-83b4-60f541baf70a',
      title: 'Mitochondrial Matrix',
      place: 'Cellular Respiration · ATP Synthase',
      note: 'การหายใจระดับเซลล์: วัฏจักรเครบส์และการถ่ายทอดอิเล็กตรอนบนเยื่อหุ้มชั้นในไมโทคอนเดรียเพื่อสร้างพลังงาน ATP'
    },
    {
      id: 'hf_20260922_194349_ec830e6f-b8e6-4569-8540-ee7f33902c53',
      title: 'Ribosome Translation',
      place: 'mRNA Reading · tRNA Peptide Chain',
      note: 'โรงงานสังเคราะห์โปรตีน: ไรโบโซมจับกับ mRNA และนำกรดแอมิโนมาต่อกันเป็นสายโปรตีนตามรหัสโคดอน'
    },
    {
      id: 'hf_20260922_194417_35a9af5f-bd07-45a7-bb73-08b47d19d530',
      title: 'Membrane Transport',
      place: 'Ion Channels · Active Transport Pump',
      note: 'การลำเลียงสารผ่านเยื่อหุ้มเซลล์: Sodium-Potassium Pump และการแพร่แบบฟาซิลิเทตเพื่อรักษาสมดุลไอออน'
    },
    {
      id: 'hf_20260922_194416_30e307a9-1265-45c3-a1a0-5c6fa5bb9f8d',
      title: 'Enzyme Kinetics',
      place: 'Active Site · Allosteric Regulation',
      note: 'การทำงานของเอนไซม์: ตัวเร่งปฏิกิริยาชีวภาพที่จำเพาะกับสารตั้งต้น และการยับยั้งแบบแข่งขันและไม่แข่งขัน'
    },
    {
      id: 'hf_20260922_194417_ff5cb9f8-8eed-4bfb-bb08-11256da92eae',
      title: 'Nuclear Pore Complex',
      place: 'Nuclear Envelope · RNA Export',
      note: 'ช่องขนส่งสารเข้า-ออกนิวเคลียส: ควบคุมการนำเข้าโปรตีนและส่งออก mRNA สู่ไซโทพลาซึมอย่างแม่นยำ'
    },
    {
      id: 'hf_20260922_194418_1d9bff4a-4971-4944-9e49-d72e755ceeb0',
      title: 'Cytoskeleton Dynamics',
      place: 'Microtubules · Actin Filaments',
      note: 'โครงร่างค้ำจุนเซลล์: เส้นใยโปรตีนที่ทำหน้าที่คงรูปร่างเซลล์ ลำเลียงเวสิเคิล และช่วยในการแบ่งเซลล์'
    },
    {
      id: 'hf_20260922_194349_75e53821-0807-4ebc-992d-34bae0ec2ce6',
      title: 'Epigenetic Methylation',
      place: 'Histone Acetylation · Chromatin Remodeling',
      note: 'พันธุศาสตร์เหนือพันธุกรรม: การปรับโครงสร้างโครมาทินโดยไม่เปลี่ยนลำดับ DNA เพื่อควบคุมการเปิด/ปิดยีน'
    },
    {
      id: 'hf_20260922_194417_5a227847-3796-4438-805d-7e66e9538205',
      title: 'Immune Antigen Presentation',
      place: 'MHC Complex · T-Cell Recognition',
      note: 'ระบบภูมิคุ้มกันระดับเซลล์: การนำเสนอแอนติเจนบนโมเลกุล MHC เพื่อกระตุ้นการตอบสนองของเม็ดเลือดขาว'
    },
    {
      id: 'hf_20260922_194350_b49aa67e-0401-4029-af4f-f6ac3ee83398',
      title: 'Stem Cell Differentiation',
      place: 'Pluripotency · Cell Fate Determination',
      note: 'การเปลี่ยนแปลงรูปร่างเซลล์ต้นกำเนิด: กระบวนการพัฒนาจากเซลล์ตั้งต้นไปเป็นเซลล์เฉพาะทางของอวัยวะต่างๆ'
    },
    {
      id: 'hf_20260922_194349_89b82779-3a46-4c55-b7c5-f4a0fd955874',
      title: 'Endoplasmic Reticulum',
      place: 'Rough ER & Smooth ER · Protein Folding',
      note: 'ร่างแหเอนโดพลาซึม: แหล่งสังเคราะห์และพับม้วนโปรตีน (RER) และสังเคราะห์ลิพิดพร้อมกำจัดสารพิษ (SER)'
    },
    {
      id: 'hf_20260922_194416_47e18c62-253a-42e1-97a9-9e5f6a6b8d59',
      title: 'Golgi Apparatus',
      place: 'Protein Sorting · Vesicle Secretion',
      note: 'กอลจิคอมเพล็กซ์: ทำหน้าที่ดัดแปลง เติมหมู่น้ำตาล และบรรจุโปรตีนใส่ถุงเวสิเคิลเพื่อส่งออกนอกเซลล์',
      tall: true
    },
    {
      id: 'hf_20260922_194417_a455843c-d8db-461c-8ef6-74a325d2472c',
      title: 'Lysosome Digestion',
      place: 'Hydrolytic Enzymes · Autophagy',
      note: 'ไลโซโซม: ถุงเอนไซม์ย่อยสลายสารโมเลกุลใหญ่และออร์แกเนลล์ที่เสื่อมสภาพในกระบวนการ Autophagy'
    }
  ];

  const N = SHOTS.length;
  const GA = Math.PI * (3 - Math.sqrt(5));

  function initSphereHero() {
    const stage = document.getElementById('stage-hero');
    const world = document.getElementById('world');
    const orb = document.getElementById('orb');
    const headline = document.getElementById('headline');
    const lit = document.getElementById('lit');
    const litPlate = document.getElementById('litPlate');
    const litImg = document.getElementById('litImg');
    const litTitle = document.getElementById('litTitle');
    const litWhere = document.getElementById('litWhere');
    const litNote = document.getElementById('litNote');

    if (!stage || !world || !orb || !headline) return;

    let R = 300;
    let cw = 140;
    let persp = 1150;
    let spin = 0;
    let tilt = -4;
    let camZ = 0;
    let dragX = 0;
    let dragY = 0;
    let velX = 0.05; // Gentle subtle idle drift
    let velY = 0;
    let isDragging = false;
    let focusedIndex = -1;
    let openToken = 0;
    let lastSourceCard = null;

    const cardNodes = [];
    const cardVectors = [];
    const imageBlobs = new Map();

    // 1. Compute Fibonacci Vectors & DOM Cards
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const rad = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = i * GA;
      const x = Math.cos(theta) * rad;
      const z = Math.sin(theta) * rad;
      const lat = Math.asin(y) * (180 / Math.PI);
      const lon = Math.atan2(x, z) * (180 / Math.PI);

      cardVectors.push({ x, y, z, lat, lon });

      const card = document.createElement('div');
      card.className = 'card' + (SHOTS[i].tall ? ' tall' : '');
      card.dataset.idx = i;

      const fig = document.createElement('figure');
      const img = document.createElement('img');
      img.alt = SHOTS[i].title;

      fig.appendChild(img);
      card.appendChild(fig);
      orb.appendChild(card);
      cardNodes.push({ card, img, fig, curOpacity: -1, curD: -1 });
    }

    // 2. Measure & Layout
    function layoutSphere() {
      const w = stage.clientWidth || window.innerWidth;
      const h = stage.clientHeight || (window.innerHeight * 0.85);

      if (w <= 380) persp = 620;
      else if (w <= 640) persp = 760;
      else if (w <= 900) persp = 920;
      else persp = 1150;

      document.documentElement.style.setProperty('--persp', persp + 'px');

      const hr = w <= 380 ? 0.38 : (w <= 640 ? 0.42 : 0.46);
      const wr = w <= 380 ? 0.48 : (w <= 640 ? 0.52 : 0.58);
      const floor = w <= 380 ? 108 : (w <= 640 ? 120 : 155);
      R = Math.max(floor, Math.min(480, h * hr, w * wr));

      const scale = w <= 380 ? 0.44 : (w <= 640 ? 0.46 : 0.47);
      cw = Math.round(Math.max(72, R * scale));
      document.documentElement.style.setProperty('--cw', cw);

      for (let i = 0; i < N; i++) {
        const v = cardVectors[i];
        const tx = v.x * R;
        const ty = -v.y * R;
        const tz = v.z * R;
        cardNodes[i].card.style.transform = `translate3d(${tx}px, ${ty}px, ${tz}px) rotateY(${v.lon}deg) rotateX(${v.lat}deg)`;
      }
    }

    layoutSphere();
    window.addEventListener('resize', layoutSphere);

    // 3. Preload Thumbnail Images
    SHOTS.forEach((shot, i) => {
      const thumbUrl = `${CDN}${shot.id}_min.webp`;
      const img = new Image();
      img.src = thumbUrl;
      img.onload = () => {
        cardNodes[i].img.src = thumbUrl;
        cardNodes[i].img.classList.add('in');
      };
      cardNodes[i].img.src = thumbUrl;
      cardNodes[i].img.classList.add('in');
    });

    document.body.classList.add('revealed');

    // 4. Camera Loop
    function cameraLoop() {
      if (!isDragging && focusedIndex === -1) {
        dragX += velX;
        dragY += velY;
        velX *= 0.96;
        velY *= 0.96;
        if (Math.abs(velX) < 0.001) velX = 0.04; // Keep soft continuous orbit
        if (Math.abs(velY) < 0.001) velY = 0;
      }

      const maxDragY = 32 - tilt;
      const minDragY = -32 - tilt;
      dragY = Math.max(minDragY, Math.min(maxDragY, dragY));

      const sx = tilt + dragY;
      const sy = spin + dragX;

      world.style.transform = `translateZ(${camZ}px) rotateY(${sy}deg) rotateX(${sx}deg)`;
      headline.style.transform = `rotateX(${-sx}deg) rotateY(${-sy}deg) translateZ(${R * 0.62}px)`;

      const radX = (sx * Math.PI) / 180;
      const radY = (sy * Math.PI) / 180;
      const cosX = Math.cos(radX), sinX = Math.sin(radX);
      const cosY = Math.cos(radY), sinY = Math.sin(radY);

      const nearThresh = persp * 0.66;
      const isLitOpen = document.body.classList.contains('lit');

      for (let i = 0; i < N; i++) {
        const v = cardVectors[i];
        const node = cardNodes[i];

        const x1 = v.x * cosY + v.z * sinY;
        const z1 = -v.x * sinY + v.z * cosY;
        const y1 = v.y * cosX - z1 * sinX;
        const zf = v.y * sinX + z1 * cosX;

        const base = 0.14 + 0.86 * Math.pow((zf + 1) / 2, 0.85);
        let dim = 1 - base;

        const cardWorldZ = zf * R + camZ;
        let fade = 1;
        if (cardWorldZ > nearThresh) {
          fade = Math.max(0, 1 - (cardWorldZ - nearThresh) / 190);
        }

        if (isLitOpen) {
          dim = Math.min(1, dim + 0.78);
          if (i === focusedIndex) {
            fade = 0;
          }
        }

        const roundedFade = Math.round(fade * 100) / 100;
        const roundedDim = Math.round(dim * 100) / 100;

        if (node.curOpacity !== roundedFade) {
          node.card.style.opacity = roundedFade;
          node.curOpacity = roundedFade;
        }

        if (node.curD !== roundedDim) {
          node.card.style.setProperty('--d', roundedDim);
          node.curD = roundedDim;
        }
      }

      requestAnimationFrame(cameraLoop);
    }

    cameraLoop();

    // 5. Drag & Click Interaction
    let pointerStartX = 0;
    let pointerStartY = 0;
    let lastPointerX = 0;
    let lastPointerY = 0;
    let initialCardUnderCursor = null;

    stage.addEventListener('pointerdown', (e) => {
      if (document.body.classList.contains('lit')) return;
      initialCardUnderCursor = e.target.closest('.card');
      pointerStartX = e.clientX;
      pointerStartY = e.clientY;
      lastPointerX = e.clientX;
      lastPointerY = e.clientY;
      isDragging = true;
      velX = 0;
      velY = 0;
      try { stage.setPointerCapture(e.pointerId); } catch (err) {}
    });

    stage.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - lastPointerX;
      const dy = e.clientY - lastPointerY;

      dragX += dx * 0.13;
      dragY += -dy * 0.13;
      velX = dx * 0.13;
      velY = -dy * 0.13;

      lastPointerX = e.clientX;
      lastPointerY = e.clientY;
    });

    function endDrag(e) {
      if (!isDragging) return;
      const totalDist = Math.hypot(e.clientX - pointerStartX, e.clientY - pointerStartY);
      if (totalDist < 8 && initialCardUnderCursor) {
        const idx = parseInt(initialCardUnderCursor.dataset.idx, 10);
        openLightbox(idx, initialCardUnderCursor);
      }
      isDragging = false;
      initialCardUnderCursor = null;
    }

    stage.addEventListener('pointerup', endDrag);
    stage.addEventListener('pointercancel', endDrag);

    // 6. FLIP Lightbox Functionality
    function openLightbox(idx, sourceElem) {
      if (idx < 0 || idx >= N || !lit) return;
      focusedIndex = idx;
      lastSourceCard = sourceElem;
      const shot = SHOTS[idx];
      const token = ++openToken;

      litTitle.innerText = shot.title;
      litWhere.innerText = shot.place;
      litNote.innerText = shot.note;

      const thumbUrl = `${CDN}${shot.id}_min.webp`;
      litImg.src = thumbUrl;

      const fullImg = new Image();
      fullImg.src = `${CDN}${shot.id}.png`;
      fullImg.onload = () => {
        if (openToken === token) {
          litImg.src = fullImg.src;
        }
      };

      document.body.classList.add('lit');

      if (sourceElem && litPlate) {
        const srcRect = sourceElem.getBoundingClientRect();
        const targetRect = litPlate.getBoundingClientRect();

        const scale = Math.max(0.04, srcRect.width / (targetRect.width || 1));
        const dx = (srcRect.left + srcRect.width / 2) - (targetRect.left + targetRect.width / 2);
        const dy = (srcRect.top + srcRect.height / 2) - (targetRect.top + targetRect.height / 2);

        litPlate.style.transition = 'none';
        litPlate.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
        litPlate.style.opacity = '0';

        void litPlate.offsetWidth; // Force reflow

        litPlate.style.transition = '';
        litPlate.style.transform = '';
        litPlate.style.opacity = '';
      }
    }

    function closeLightbox() {
      if (!document.body.classList.contains('lit') || !lit) return;
      focusedIndex = -1;
      document.body.classList.remove('lit');

      if (lastSourceCard && litPlate) {
        const srcRect = lastSourceCard.getBoundingClientRect();
        const targetRect = litPlate.getBoundingClientRect();

        const scale = Math.max(0.04, srcRect.width / (targetRect.width || 1));
        const dx = (srcRect.left + srcRect.width / 2) - (targetRect.left + targetRect.width / 2);
        const dy = (srcRect.top + srcRect.height / 2) - (targetRect.top + targetRect.height / 2);

        litPlate.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
        litPlate.style.opacity = '0';

        setTimeout(() => {
          litPlate.style.transition = 'none';
          litPlate.style.transform = '';
          litPlate.style.opacity = '';
          void litPlate.offsetWidth;
          litPlate.style.transition = '';
        }, 640);
      }
    }

    document.querySelectorAll('[data-close]').forEach(btn => {
      btn.addEventListener('click', closeLightbox);
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.body.classList.contains('lit')) {
        closeLightbox();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSphereHero);
  } else {
    initSphereHero();
  }
})();
