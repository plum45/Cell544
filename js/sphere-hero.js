// Bio-Specimen Archives & Research Dossiers Engine for CYTOLIFE Pro
// Renders the 16 curated biology topics as interactive research files below Hero with Lightbox inspection
(function() {
  'use strict';

  // 16 curated biology topics mapping to local high-res 3D biology renders
  const SHOTS = [
    {
      img: 'img/01_gene_expression.jpg',
      title: 'Gene Expression',
      subtitle: 'Central Dogma · Transcription & Translation',
      tag: 'Topic 01',
      category: 'genetics',
      link: 'topics/gene-expression.html',
      note: 'กระบวนการถอดรหัส DNA เป็น mRNA (Transcription) และแปลรหัสเป็นสายพอลิเพปไทด์ (Translation) ที่ไรโบโซม เพื่อสร้างโปรตีนโครงสร้างและเอนไซม์ควบคุมชีวิตเซลล์'
    },
    {
      img: 'img/02_gene_regulation.jpg',
      title: 'Gene Regulation',
      subtitle: 'Lac Operon · Transcription Factors',
      tag: 'Topic 02',
      category: 'genetics',
      link: 'topics/gene-regulation.html',
      note: 'กลไกควบคุมการเปิด/ปิดยีน ทั้งระบบ Operon ในแบคทีเรีย และการควบคุมระดับ Epigenetics, Histone Modification และ Enhancers ในสิ่งมีชีวิตชั้นสูง'
    },
    {
      img: 'img/03_cell_signaling.jpg',
      title: 'Cell Signaling',
      subtitle: 'Receptor · GPCR & Tyrosine Kinase',
      tag: 'Topic 03',
      category: 'signaling',
      link: 'topics/cell-signaling.html',
      note: 'การสื่อสารระดับเซลล์ผ่าน Ligand จับกับตัวรับสัญญาณบนเยื่อหุ้มเซลล์ ส่งต่อสัญญาณผ่านโมเลกุลสื่อสัญญาณที่สอง (Second Messengers เช่น cAMP, IP3, Ca2+)'
    },
    {
      img: 'img/04_cellular_response.jpg',
      title: 'Cellular Response',
      subtitle: 'Kinase Cascades · Metabolic Shift',
      tag: 'Topic 04',
      category: 'signaling',
      link: 'topics/cell-response.html',
      note: 'การตอบสนองขั้นสุดท้ายของเซลล์ เช่น การกระตุ้นเอนไซม์ การปรับเปลี่ยนเมแทบอลิซึม การจัดรูป Cytoskeleton และการเปิดการถอดรหัสยีนเป้าหมาย'
    },
    {
      img: 'img/05_apoptosis.jpg',
      title: 'Apoptosis Cascade',
      subtitle: 'Caspase Activation · Cytochrome C',
      tag: 'Topic 05',
      category: 'signaling',
      link: 'topics/apoptosis.html',
      note: 'การตายของเซลล์ตามโปรแกรม (Programmed Cell Death) ผ่านกลไก Caspase Cascade เพื่อรักษาสมดุลเนื้อเยื่อ กำจัดเซลล์ติดเชื้อ และป้องกันมะเร็ง'
    },
    {
      img: 'img/06_cell_cycle.jpg',
      title: 'Cell Cycle & Checkpoints',
      subtitle: 'Interphase · Mitosis · p53 Tumor Suppressor',
      tag: 'Topic 06',
      category: 'genetics',
      link: 'topics/cell-cycle.html',
      note: 'วัฏจักรการแบ่งเซลล์: การจำลอง DNA ใน S phase การแบ่งนิวเคลียสใน Mitosis และจุดตรวจความปลอดภัย G1/S, G2/M และ Spindle Checkpoint'
    },
    {
      img: 'img/07_dna_helix.jpg',
      title: 'DNA Double Helix',
      subtitle: 'Molecular Structure · Hydrogen Bonds',
      tag: 'Molecular',
      category: 'genetics',
      link: 'topics/gene-expression.html',
      note: 'โครงสร้างเกลียวคู่ดีเอ็นเอตามแบบจำลองวัตสัน-คริก เบสคู่สม A-T (2 พันธะไฮโดรเจน) และ G-C (3 พันธะไฮโดรเจน) บนสายแกนน้ำตาลดีออกซีไรโบส-ฟอสเฟต'
    },
    {
      img: 'img/08_mitochondria.jpg',
      title: 'Mitochondria & ATP',
      subtitle: 'Oxidative Phosphorylation · ATP Synthase',
      tag: 'Energy',
      category: 'energy',
      link: 'topics/cell-response.html',
      note: 'โรงไฟฟ้าของเซลล์: วัฏจักรเครบส์และการถ่ายทอดอิเล็กตรอนบนเยื่อหุ้มชั้นใน (Cristae) ขับเคลื่อนมอเตอร์ระดับโมเลกุล ATP Synthase สร้างพลังงานให้เซลล์'
    },
    {
      img: 'img/09_ribosome.jpg',
      title: 'Ribosome Translation',
      subtitle: 'mRNA Reading · tRNA Peptide Synthesis',
      tag: 'Synthesis',
      category: 'genetics',
      link: 'topics/gene-expression.html',
      note: 'คอมเพล็กซ์ไรโบโซมขนาดใหญ่ 80S (60S + 40S) อ่านรหัสโคดอนบน mRNA และจับคู่กับแอนติโคดอนของ tRNA เพื่อต่อกรดแอมิโนเป็นสายพอลิเพปไทด์'
    },
    {
      img: 'img/10_membrane.jpg',
      title: 'Membrane Transport',
      subtitle: 'Phospholipid Bilayer · Ion Channels',
      tag: 'Transport',
      category: 'energy',
      link: 'topics/cell-signaling.html',
      note: 'เยื่อหุ้มเซลล์แบบ Fluid Mosaic Model: การลำเลียงแบบใช้พลังงาน (Na+/K+ Pump) และการแพร่แบบฟาซิลิเทตเพื่อรักษาสมดุลแรงดันออสโมติกและประจุไฟฟ้า'
    },
    {
      img: 'img/11_enzyme.jpg',
      title: 'Enzyme Kinetics',
      subtitle: 'Active Site · Allosteric Regulation',
      tag: 'Catalysis',
      category: 'energy',
      link: 'topics/cell-response.html',
      note: 'ตัวเร่งปฏิกิริยาชีวภาพ: โครงสร้างบริเวณเร่ง (Active Site) แบบเหนี่ยวนำให้พอดี (Induced Fit) และกลไกควบคุมแบบ Allosteric Feed-back Inhibition'
    },
    {
      img: 'img/12_nuclear_pore.jpg',
      title: 'Nuclear Pore Complex',
      subtitle: 'Nucleocytoplasmic Transport · Ran GTPase',
      tag: 'Nuclear',
      category: 'genetics',
      link: 'topics/gene-regulation.html',
      note: 'ประตูทางเข้าออกนิวเคลียส: คัดกรองและส่งออกโมเลกุล mRNA สู่ไซโทพลาซึม พร้อมนำเข้าโปรตีนฮิสโตนและเอนไซม์จำลอง DNA ผ่านสัญญาณ NLS/NES'
    },
    {
      img: 'img/13_cytoskeleton.jpg',
      title: 'Cytoskeleton Dynamics',
      subtitle: 'Microtubules · Motor Proteins Kinesin',
      tag: 'Structure',
      category: 'energy',
      link: 'topics/cell-response.html',
      note: 'โครงร่างค้ำจุนเซลล์: เส้นใยไมโครทูบูลและแอกติน พร้อมโปรตีนมอเตอร์ Kinesin/Dynein เดินลำเลียงเวสิเคิลและช่วยในการเคลื่อนที่ของเซลล์'
    },
    {
      img: 'img/island_3d_cover.jpg',
      title: '3D Floating Island',
      subtitle: 'Zelda Forest Temple · 6 Shrines',
      tag: '3D World',
      category: 'worlds',
      link: 'island-3d/index.html',
      note: 'สัมผัสการเรียนรู้โลก 3 มิติเต็มรูปแบบ: สำรวจ 6 ศาลเจ้าชีววิทยา วิ่งเล่นกับสัตว์ป่าสไตล์ Zelda ผจญภัยตามหา 7 ขุมทรัพย์ลับ และตอบคำถามท้าทาย'
    },
    {
      img: 'img/lab_2d_cover.jpg',
      title: '2D Bio-Lab Simulation',
      subtitle: 'Autonomous Stanford Agents · Survival',
      tag: '2D Game',
      category: 'worlds',
      link: 'game-2d/index.html',
      note: 'สถาบันวิจัยแล็บ 2D: จำลองการทดลองชีววิทยา ผสมยาต้านแอนติเจน ควบคุมตัวแปรทางชีวเคมี และเอาชีวิตรอดจากการแพร่ระบาดของเซลล์กลายพันธุ์'
    },
    {
      img: 'img/03_cell_signaling.jpg',
      title: 'Neural AI Mentor',
      subtitle: 'Real-time Biology Assistant',
      tag: 'AI System',
      category: 'worlds',
      link: '#ai-assistant',
      note: 'ปัญญาประดิษฐ์ผู้ช่วยสอนชีววิทยาเซลล์ระดับโปร: ตอบคำถามเชิงลึก อธิบายกลไกปฏิกิริยาเคมีในสิ่งมีชีวิต และติวสรุปเนื้อหาเตรียมสอบได้ตลอด 24 ชม.'
    }
  ];

  window.BIO_SHOTS = SHOTS;

  function initBioSpecimenFiles() {
    const grid = document.getElementById('bio-files-grid');
    const filterBtns = document.querySelectorAll('.bio-filter-btn');
    const lit = document.getElementById('lit');
    const litImg = document.getElementById('litImg');
    const litTitle = document.getElementById('litTitle');
    const litWhere = document.getElementById('litWhere');
    const litNote = document.getElementById('litNote');
    const litLink = document.getElementById('litLink');
    const litTag = document.getElementById('litTag');

    function openLightbox(idx) {
      if (idx < 0 || idx >= SHOTS.length || !lit) return;
      const shot = SHOTS[idx];

      if (litTag) litTag.innerText = shot.tag;
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
      document.body.classList.remove('lit');
    }

    window.openBioDossier = openLightbox;

    document.querySelectorAll('[data-close]').forEach(btn => {
      btn.addEventListener('click', closeLightbox);
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.body.classList.contains('lit')) {
        closeLightbox();
      }
    });

    if (!grid) return;

    // Render 16 Dossier Cards
    grid.innerHTML = '';
    SHOTS.forEach((shot, index) => {
      const card = document.createElement('article');
      card.className = 'bio-file-card';
      card.dataset.category = shot.category;
      card.dataset.idx = index;

      card.innerHTML = `
        <div class="file-card-media" title="คลิกเพื่อขยายดูโครงสร้าง 3 มิติ">
          <img src="${shot.img}" alt="${shot.title}" loading="lazy">
          <span class="file-tag-badge">${shot.tag}</span>
          <button type="button" class="file-quick-zoom" aria-label="ขยายดู">🔍</button>
        </div>
        <div class="file-card-body">
          <div class="file-header">
            <span class="file-category-label">${getCategoryLabel(shot.category)}</span>
            <h3 class="file-title-en">${shot.title}</h3>
            <div class="file-subtitle">${shot.subtitle}</div>
          </div>
          <p class="file-thai-note">${shot.note}</p>
          <div class="file-actions">
            <button type="button" class="btn-inspect-file" data-idx="${index}">
              <span>🔍</span>
              <span>ส่องโครงสร้าง 3D</span>
            </button>
            <a href="${shot.link}" class="btn-goto-lesson">
              <span>บทเรียน</span>
              <span>➔</span>
            </a>
          </div>
        </div>
      `;

      // Click on media or inspect button opens lightbox
      card.querySelector('.file-card-media').addEventListener('click', () => openLightbox(index));
      card.querySelector('.btn-inspect-file').addEventListener('click', (e) => {
        e.stopPropagation();
        openLightbox(index);
      });

      grid.appendChild(card);
    });

    // Category Filter Handler
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filterVal = btn.getAttribute('data-filter');

        const cards = grid.querySelectorAll('.bio-file-card');
        cards.forEach(card => {
          if (filterVal === 'all' || card.dataset.category === filterVal) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  function getCategoryLabel(cat) {
    switch (cat) {
      case 'genetics': return '🧬 DNA & การสร้างโปรตีน';
      case 'signaling': return '📡 การสื่อสารของเซลล์';
      case 'energy': return '⚡ พลังงาน & โครงสร้างเซลล์';
      case 'worlds': return '🎮 โหมดเกม & โลกจำลอง 3D';
      default: return '🔬 โมเลกุลของเซลล์';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBioSpecimenFiles);
  } else {
    initBioSpecimenFiles();
  }
})();
