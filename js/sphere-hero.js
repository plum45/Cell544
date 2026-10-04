// 3D Fibonacci Sphere Hero Engine for CYTOLIFE Pro
// High-performance 3D Carousel with zero camera-plane clipping
(function() {
  'use strict';

  // 16 curated biology topics mapping to local high-res 3D biology renders
  const SHOTS = [
    {
      img: 'img/01_gene_expression.jpg',
      title: 'Gene Expression',
      subtitle: 'Central Dogma · Transcription & Translation',
      tag: 'Topic 01',
      link: 'topics/topic1.html',
      note: 'กระบวนการถอดรหัส DNA เป็น mRNA (Transcription) และแปลรหัสเป็นสายพอลิเพปไทด์ (Translation) ที่ไรโบโซม เพื่อสร้างโปรตีนโครงสร้างและเอนไซม์ควบคุมชีวิตเซลล์'
    },
    {
      img: 'img/02_gene_regulation.jpg',
      title: 'Gene Regulation',
      subtitle: 'Lac Operon · Transcription Factors',
      tag: 'Topic 02',
      link: 'topics/topic2.html',
      note: 'กลไกควบคุมการเปิด/ปิดยีน ทั้งระบบ Operon ในแบคทีเรีย และการควบคุมระดับ Epigenetics, Histone Modification และ Enhancers ในสิ่งมีชีวิตชั้นสูง'
    },
    {
      img: 'img/03_cell_signaling.jpg',
      title: 'Cell Signaling',
      subtitle: 'Receptor · GPCR & Tyrosine Kinase',
      tag: 'Topic 03',
      link: 'topics/topic3.html',
      note: 'การสื่อสารระดับเซลล์ผ่าน Ligand จับกับตัวรับสัญญาณบนเยื่อหุ้มเซลล์ ส่งต่อสัญญาณผ่านโมเลกุลสื่อสัญญาณที่สอง (Second Messengers เช่น cAMP, IP3, Ca2+)'
    },
    {
      img: 'img/04_cellular_response.jpg',
      title: 'Cellular Response',
      subtitle: 'Kinase Cascades · Metabolic Shift',
      tag: 'Topic 04',
      link: 'topics/topic4.html',
      note: 'การตอบสนองขั้นสุดท้ายของเซลล์ เช่น การกระตุ้นเอนไซม์ การปรับเปลี่ยนเมแทบอลิซึม การจัดรูป Cytoskeleton และการเปิดการถอดรหัสยีนเป้าหมาย'
    },
    {
      img: 'img/05_apoptosis.jpg',
      title: 'Apoptosis Cascade',
      subtitle: 'Caspase Activation · Cytochrome C',
      tag: 'Topic 05',
      link: 'topics/topic5.html',
      note: 'การตายของเซลล์ตามโปรแกรม (Programmed Cell Death) ผ่านกลไก Caspase Cascade เพื่อรักษาสมดุลเนื้อเยื่อ กำจัดเซลล์ติดเชื้อ และป้องกันมะเร็ง'
    },
    {
      img: 'img/06_cell_cycle.jpg',
      title: 'Cell Cycle & Checkpoints',
      subtitle: 'Interphase · Mitosis · p53 Tumor Suppressor',
      tag: 'Topic 06',
      link: 'topics/topic6.html',
      note: 'วัฏจักรการแบ่งเซลล์: การจำลอง DNA ใน S phase การแบ่งนิวเคลียสใน Mitosis และจุดตรวจความปลอดภัย G1/S, G2/M และ Spindle Checkpoint'
    },
    {
      img: 'img/07_dna_helix.jpg',
      title: 'DNA Double Helix',
      subtitle: 'Molecular Structure · Hydrogen Bonds',
      tag: 'Molecular',
      link: 'topics/topic1.html',
      note: 'โครงสร้างเกลียวคู่ดีเอ็นเอตามแบบจำลองวัตสัน-คริก เบสคู่สม A-T (2 พันธะไฮโดรเจน) และ G-C (3 พันธะไฮโดรเจน) บนสายแกนน้ำตาลดีออกซีไรโบส-ฟอสเฟต'
    },
    {
      img: 'img/08_mitochondria.jpg',
      title: 'Mitochondria & ATP',
      subtitle: 'Oxidative Phosphorylation · ATP Synthase',
      tag: 'Energy',
      link: 'topics/topic4.html',
      note: 'โรงไฟฟ้าของเซลล์: วัฏจักรเครบส์และการถ่ายทอดอิเล็กตรอนบนเยื่อหุ้มชั้นใน (Cristae) ขับเคลื่อนมอเตอร์ระดับโมเลกุล ATP Synthase สร้างพลังงานให้เซลล์'
    },
    {
      img: 'img/09_ribosome.jpg',
      title: 'Ribosome Translation',
      subtitle: 'mRNA Reading · tRNA Peptide Synthesis',
      tag: 'Synthesis',
      link: 'topics/topic1.html',
      note: 'คอมเพล็กซ์ไรโบโซมขนาดใหญ่ 80S (60S + 40S) อ่านรหัสโคดอนบน mRNA และจับคู่กับแอนติโคดอนของ tRNA เพื่อต่อกรดแอมิโนเป็นสายพอลิเพปไทด์'
    },
    {
      img: 'img/10_membrane.jpg',
      title: 'Membrane Transport',
      subtitle: 'Phospholipid Bilayer · Ion Channels',
      tag: 'Transport',
      link: 'topics/topic3.html',
      note: 'เยื่อหุ้มเซลล์แบบ Fluid Mosaic Model: การลำเลียงแบบใช้พลังงาน (Na+/K+ Pump) และการแพร่แบบฟาซิลิเทตเพื่อรักษาสมดุลแรงดันออสโมติกและประจุไฟฟ้า'
    },
    {
      img: 'img/11_enzyme.jpg',
      title: 'Enzyme Kinetics',
      subtitle: 'Active Site · Allosteric Regulation',
      tag: 'Catalysis',
      link: 'topics/topic4.html',
      note: 'ตัวเร่งปฏิกิริยาชีวภาพ: โครงสร้างบริเวณเร่ง (Active Site) แบบเหนี่ยวนำให้พอดี (Induced Fit) และกลไกควบคุมแบบ Allosteric Feed-back Inhibition'
    },
    {
      img: 'img/12_nuclear_pore.jpg',
      title: 'Nuclear Pore Complex',
      subtitle: 'Nucleocytoplasmic Transport · Ran GTPase',
      tag: 'Nuclear',
      link: 'topics/topic2.html',
      note: 'ประตูทางเข้าออกนิวเคลียส: คัดกรองและส่งออกโมเลกุล mRNA สู่ไซโทพลาซึม พร้อมนำเข้าโปรตีนฮิสโตนและเอนไซม์จำลอง DNA ผ่านสัญญาณ NLS/NES'
    },
    {
      img: 'img/13_cytoskeleton.jpg',
      title: 'Cytoskeleton Dynamics',
      subtitle: 'Microtubules · Motor Proteins Kinesin',
      tag: 'Structure',
      link: 'topics/topic4.html',
      note: 'โครงร่างค้ำจุนเซลล์: เส้นใยไมโครทูบูลและแอกติน พร้อมโปรตีนมอเตอร์ Kinesin/Dynein เดินลำเลียงเวสิเคิลและช่วยในการเคลื่อนที่ของเซลล์'
    },
    {
      img: 'img/07_dna_helix.jpg',
      title: '3D Floating Island',
      subtitle: 'Zelda Forest Temple · 6 Shrines',
      tag: '3D World',
      link: 'island-3d/index.html',
      note: 'สัมผัสการเรียนรู้โลก 3 มิติเต็มรูปแบบ: สำรวจ 6 ศาลเจ้าชีววิทยา วิ่งเล่นกับสัตว์ป่าสไตล์ Zelda ผจญภัยตามหา 7 ขุมทรัพย์ลับ และตอบคำถามท้าทาย'
    },
    {
      img: 'img/04_cellular_response.jpg',
      title: '2D Bio-Lab Simulation',
      subtitle: 'Autonomous Stanford Agents · Survival',
      tag: '2D Game',
      link: 'game-2d/index.html',
      note: 'สถาบันวิจัยแล็บ 2D: จำลองการทดลองชีววิทยา ผสมยาต้านแอนติเจน ควบคุมตัวแปรทางชีวเคมี และเอาชีวิตรอดจากการแพร่ระบาดของเซลล์กลายพันธุ์'
    },
    {
      img: 'img/03_cell_signaling.jpg',
      title: 'Neural AI Mentor',
      subtitle: 'Real-time Biology Assistant',
      tag: 'AI System',
      link: '#ai-assistant',
      note: 'ปัญญาประดิษฐ์ผู้ช่วยสอนชีววิทยาเซลล์ระดับโปร: ตอบคำถามเชิงลึก อธิบายกลไกปฏิกิริยาเคมีในสิ่งมีชีวิต และติวสรุปเนื้อหาเตรียมสอบได้ตลอด 24 ชม.'
    }
  ];

  const N = SHOTS.length;
  // Golden ratio angle for uniform spherical distribution
  const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

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
    const litLink = document.getElementById('litLink');

    if (!stage || !world || !orb) return;

    // Sphere dimensions & safety constraints
    let R = 320;
    let cw = 140;
    let ch = 92;
    let persp = 1200;
    let baseCamZ = -140; // Safely push back so front cards NEVER clip into camera
    let spin = 0;
    let tilt = -2;
    let dragX = 0;
    let dragY = 0;
    let velX = 0.12; // Smooth steady orbit
    let velY = 0;
    let isDragging = false;
    let isHovered = false;
    let focusedIndex = -1;

    const cardNodes = [];
    const cardVectors = [];

    // Clear any previous nodes inside orb
    orb.innerHTML = '';

    // 1. Calculate Fibonacci Points on Sphere
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2; // -1 to +1
      const rad = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = i * GOLDEN_ANGLE;
      const x = Math.cos(theta) * rad;
      const z = Math.sin(theta) * rad;
      const lat = Math.asin(y) * (180 / Math.PI);
      const lon = Math.atan2(x, z) * (180 / Math.PI);

      cardVectors.push({ x, y, z, lat, lon });

      // Create Card Element
      const card = document.createElement('div');
      card.className = 'sphere-card';
      card.dataset.idx = i;

      const fig = document.createElement('div');
      fig.className = 'sphere-card-inner';

      const img = document.createElement('img');
      img.src = SHOTS[i].img;
      img.alt = SHOTS[i].title;
      img.loading = 'eager';

      const badge = document.createElement('div');
      badge.className = 'sphere-card-badge';
      badge.innerText = SHOTS[i].tag;

      const label = document.createElement('div');
      label.className = 'sphere-card-label';
      label.innerHTML = `<span class="title">${SHOTS[i].title}</span><span class="sub">${SHOTS[i].subtitle.split('·')[0]}</span>`;

      fig.appendChild(img);
      fig.appendChild(badge);
      fig.appendChild(label);
      card.appendChild(fig);
      orb.appendChild(card);

      cardNodes.push({ card, img, fig, curOpacity: -1, curD: -1 });

      // Hover interaction on card
      card.addEventListener('mouseenter', () => {
        isHovered = true;
        card.classList.add('is-hovered');
      });

      card.addEventListener('mouseleave', () => {
        isHovered = false;
        card.classList.remove('is-hovered');
      });
    }

    // 2. Responsive Layout & Sizing
    function layoutSphere() {
      const w = stage.clientWidth || window.innerWidth;
      const h = stage.clientHeight || (window.innerHeight * 0.85);

      if (w <= 480) {
        persp = 800;
        R = Math.max(130, Math.min(200, w * 0.42));
        cw = 110;
        ch = 74;
        baseCamZ = -90;
      } else if (w <= 768) {
        persp = 1000;
        R = Math.max(180, Math.min(250, w * 0.36));
        cw = 125;
        ch = 82;
        baseCamZ = -110;
      } else {
        persp = 1200;
        R = Math.max(240, Math.min(350, Math.min(w * 0.28, h * 0.44)));
        cw = 145;
        ch = 96;
        baseCamZ = -140;
      }

      stage.style.perspective = `${persp}px`;
      document.documentElement.style.setProperty('--cw', cw);
      document.documentElement.style.setProperty('--ch', ch);

      for (let i = 0; i < N; i++) {
        const v = cardVectors[i];
        const tx = v.x * R;
        const ty = -v.y * R;
        const tz = v.z * R;
        cardNodes[i].card.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, ${tz.toFixed(1)}px) rotateY(${v.lon.toFixed(1)}deg) rotateX(${v.lat.toFixed(1)}deg)`;
      }
    }

    layoutSphere();
    window.addEventListener('resize', layoutSphere);

    // 3. Smooth Animation Loop
    function cameraLoop() {
      if (!isDragging && !isHovered && focusedIndex === -1) {
        dragX += velX;
        dragY += velY;
        velX *= 0.98;
        velY *= 0.98;
        if (Math.abs(velX) < 0.08) velX = 0.12; // Maintain gentle continuous orbit
        if (Math.abs(velY) < 0.01) velY = 0;
      }

      // Clamp vertical tilt so the sphere stays upright and legible
      const maxDragY = 22 - tilt;
      const minDragY = -22 - tilt;
      dragY = Math.max(minDragY, Math.min(maxDragY, dragY));

      const sx = tilt + dragY;
      const sy = spin + dragX;

      world.style.transform = `translateZ(${baseCamZ}px) rotateY(${sy}deg) rotateX(${sx}deg)`;
      if (headline) {
        headline.style.transform = `rotateX(${-sx}deg) rotateY(${-sy}deg) translateZ(${R * 0.7}px)`;
      }

      // Mathematical depth shading & near-plane fading
      const radX = (sx * Math.PI) / 180;
      const radY = (sy * Math.PI) / 180;
      const cosX = Math.cos(radX), sinX = Math.sin(radX);
      const cosY = Math.cos(radY), sinY = Math.sin(radY);

      for (let i = 0; i < N; i++) {
        const v = cardVectors[i];
        const node = cardNodes[i];

        // Transformed Z in world space
        const x1 = v.x * cosY + v.z * sinY;
        const z1 = -v.x * sinY + v.z * cosY;
        const zf = v.y * sinX + z1 * cosX;

        // Front vs back depth factor (-1 to +1)
        const depthNorm = (zf + 1) / 2; // 0 = back, 1 = front
        const opacity = 0.28 + 0.72 * Math.pow(depthNorm, 1.2);
        const blur = depthNorm < 0.35 ? (1 - depthNorm / 0.35) * 2.5 : 0;

        node.card.style.opacity = opacity.toFixed(2);
        node.card.style.filter = blur > 0.5 ? `blur(${blur.toFixed(1)}px)` : 'none';
        node.card.style.zIndex = Math.round(depthNorm * 100);
      }

      requestAnimationFrame(cameraLoop);
    }

    requestAnimationFrame(cameraLoop);

    // 4. Mouse Drag & Touch Swipe Controls
    let pointerStartX = 0;
    let pointerStartY = 0;
    let lastPointerX = 0;
    let lastPointerY = 0;
    let initialCardUnderCursor = null;

    stage.addEventListener('pointerdown', (e) => {
      if (document.body.classList.contains('lit')) return;
      initialCardUnderCursor = e.target.closest('.sphere-card');
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

      dragX += dx * 0.16;
      dragY += -dy * 0.16;
      velX = dx * 0.16;
      velY = -dy * 0.16;

      lastPointerX = e.clientX;
      lastPointerY = e.clientY;
    });

    function endDrag(e) {
      if (!isDragging) return;
      const totalDist = Math.hypot(e.clientX - pointerStartX, e.clientY - pointerStartY);
      if (totalDist < 6 && initialCardUnderCursor) {
        const idx = parseInt(initialCardUnderCursor.dataset.idx, 10);
        openLightbox(idx);
      }
      isDragging = false;
      initialCardUnderCursor = null;
    }

    stage.addEventListener('pointerup', endDrag);
    stage.addEventListener('pointercancel', endDrag);

    // Pause on stage hover
    stage.addEventListener('mouseenter', () => { isHovered = true; });
    stage.addEventListener('mouseleave', () => { isHovered = false; });

    // 5. Lightbox Modal
    function openLightbox(idx) {
      if (idx < 0 || idx >= N || !lit) return;
      focusedIndex = idx;
      const shot = SHOTS[idx];

      if (litTitle) litTitle.innerText = shot.title;
      if (litWhere) litWhere.innerText = shot.subtitle;
      if (litNote) litNote.innerText = shot.note;
      if (litImg) {
        litImg.src = shot.img;
        litImg.alt = shot.title;
      }
      if (litLink) {
        litLink.href = shot.link;
        litLink.innerText = `เข้าสู่เนื้อหา ${shot.title} ➔`;
      }

      document.body.classList.add('lit');
    }

    function closeLightbox() {
      if (!lit) return;
      focusedIndex = -1;
      document.body.classList.remove('lit');
    }

    document.querySelectorAll('[data-close]').forEach(btn => {
      btn.addEventListener('click', closeLightbox);
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.body.classList.contains('lit')) {
        closeLightbox();
      }
      if (e.code === 'Space' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        e.preventDefault();
        velX = velX === 0 ? 0.12 : 0;
      }
    });

    // Make openLightbox available globally
    window.openSphereCard = openLightbox;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSphereHero);
  } else {
    initSphereHero();
  }
})();
