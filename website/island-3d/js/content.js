// ===== เนื้อหาแต่ละ Landmark (ภาษาไทย + ศัพท์เทคนิคอังกฤษ) =====
export const CONTENT_DATA = [
  {
    id: 'gene-expression',
    icon: '🧬',
    title: 'Gene Expression',
    thaiTitle: 'การแสดงออกของยีน',
    color: '#8B5CF6',
    colorLight: '#C4B5FD',
    summary: 'กระบวนการที่ข้อมูลทางพันธุกรรมจาก DNA ถูกใช้ในการสังเคราะห์ผลผลิตเชิงหน้าที่ เช่น โปรตีน',
    sections: [
      {
        heading: '🔬 Central Dogma of Molecular Biology',
        content: `หลักการพื้นฐานของชีววิทยาระดับโมเลกุล อธิบายการไหลของข้อมูลทางพันธุกรรม:

<strong>DNA → RNA → Protein</strong>

• <em>Replication</em>: DNA สร้างสำเนาตัวเอง
• <em>Transcription</em>: DNA ถูกถอดรหัสเป็น mRNA โดย RNA Polymerase
• <em>Translation</em>: mRNA ถูกแปลรหัสเป็นโปรตีนที่ไรโบโซม`
      },
      {
        heading: '📝 การถอดรหัส (Transcription)',
        content: `เกิดขึ้นในนิวเคลียส โดยเอนไซม์ <strong>RNA Polymerase</strong>:

1. <em>Initiation</em> — RNA Polymerase จับกับ Promoter บน DNA
2. <em>Elongation</em> — สังเคราะห์สาย mRNA ตาม template strand (3'→5')
3. <em>Termination</em> — เมื่อถึง terminator sequence จะหยุดสร้าง mRNA

หลังถอดรหัส mRNA จะถูกปรับแต่ง:
• 5' Capping — ป้องกันการย่อยสลาย
• 3' Polyadenylation — เพิ่ม poly-A tail
• RNA Splicing — ตัด intron ออก เหลือเฉพาะ exon`
      },
      {
        heading: '🧪 การแปลรหัส (Translation)',
        content: `เกิดที่ <strong>ไรโบโซม (Ribosome)</strong> ในไซโทพลาสซึม:

• <em>tRNA</em> นำกรดอะมิโนมาจับคู่กับ codon บน mRNA
• Ribosome อ่านรหัสทีละ 3 เบส (codon)
• กรดอะมิโนเชื่อมต่อกันด้วย peptide bond → สร้างเป็น polypeptide
• เริ่มที่ <strong>AUG</strong> (start codon) → จบที่ <strong>UAA, UAG, UGA</strong> (stop codons)`
      }
    ]
  },
  {
    id: 'gene-regulation',
    icon: '🎛️',
    title: 'Gene Regulation',
    thaiTitle: 'การควบคุมการแสดงออกของยีน',
    color: '#10B981',
    colorLight: '#6EE7B7',
    summary: 'กลไกที่เซลล์ใช้ในการควบคุมว่ายีนใดจะถูกเปิดหรือปิด เมื่อไหร่ และมากน้อยเพียงใด',
    sections: [
      {
        heading: '🎯 ระดับการควบคุม',
        content: `การควบคุมการแสดงออกของยีนเกิดได้หลายระดับ:

1. <strong>Chromatin Level</strong> — การเปลี่ยนโครงสร้างโครมาติน
2. <strong>Transcriptional Level</strong> — ควบคุมการถอดรหัส
3. <strong>Post-transcriptional Level</strong> — ควบคุมหลังถอดรหัส
4. <strong>Translational Level</strong> — ควบคุมการแปลรหัส
5. <strong>Post-translational Level</strong> — ควบคุมหลังแปลรหัส`
      },
      {
        heading: '🧬 Epigenetics',
        content: `การเปลี่ยนแปลงการแสดงออกของยีนโดย<em>ไม่เปลี่ยนลำดับ DNA</em>:

• <strong>DNA Methylation</strong> — เพิ่มหมู่ methyl (-CH₃) ที่ cytosine → ปิดยีน
• <strong>Histone Modification</strong>:
  - Acetylation → เปิดยีน (โครมาตินคลาย)
  - Methylation → เปิดหรือปิดยีน (ขึ้นกับตำแหน่ง)
  - Phosphorylation → ควบคุมการแบ่งเซลล์`
      },
      {
        heading: '🔇 Gene Silencing — RNA interference (RNAi)',
        content: `กลไกการปิดยีนโดย RNA ขนาดเล็ก:

• <strong>siRNA</strong> (small interfering RNA) — จับคู่กับ mRNA เป้าหมาย → ย่อยสลาย mRNA
• <strong>miRNA</strong> (microRNA) — จับกับ 3' UTR ของ mRNA → ยับยั้งการแปลรหัส
• ใช้เป็นเครื่องมือวิจัยและรักษาโรค (RNA therapeutics)`
      }
    ]
  },
  {
    id: 'cell-signaling',
    icon: '📡',
    title: 'Cell Signaling',
    thaiTitle: 'การสื่อสารระหว่างเซลล์',
    color: '#F59E0B',
    colorLight: '#FCD34D',
    summary: 'กระบวนการที่เซลล์รับและส่งสัญญาณเพื่อสื่อสารกันและตอบสนองต่อสภาพแวดล้อม',
    sections: [
      {
        heading: '📡 ประเภทของการสื่อสาร',
        content: `เซลล์สื่อสารกันได้หลายรูปแบบ:

• <strong>Autocrine</strong> — เซลล์ส่งสัญญาณถึงตัวเอง
• <strong>Paracrine</strong> — ส่งสัญญาณถึงเซลล์ข้างเคียง (ระยะใกล้)
• <strong>Endocrine</strong> — ส่งฮอร์โมนผ่านกระแสเลือด (ระยะไกล)
• <strong>Juxtacrine</strong> — สื่อสารผ่านการสัมผัสโดยตรง (contact-dependent)`
      },
      {
        heading: '🔄 Signal Transduction Pathway',
        content: `ขั้นตอนการถ่ายทอดสัญญาณ:

1. <strong>Reception</strong> — Ligand (สารสัญญาณ) จับกับ Receptor บนเยื่อหุ้มเซลล์
2. <strong>Transduction</strong> — สัญญาณถูกถ่ายทอดผ่าน cascade ของโปรตีน
3. <strong>Response</strong> — เซลล์ตอบสนอง เช่น เปลี่ยนการแสดงออกของยีน

<em>ตัวอย่าง Receptor:</em>
• G Protein-Coupled Receptors (GPCRs)
• Receptor Tyrosine Kinases (RTKs)
• Ion Channel Receptors`
      },
      {
        heading: '💊 Second Messengers',
        content: `โมเลกุลขนาดเล็กที่ช่วยขยายสัญญาณภายในเซลล์:

• <strong>cAMP</strong> (cyclic AMP) — สร้างโดย adenylyl cyclase, กระตุ้น PKA
• <strong>Ca²⁺</strong> (แคลเซียมไอออน) — ปลดปล่อยจาก ER, กระตุ้น calmodulin
• <strong>IP₃</strong> (inositol trisphosphate) — เปิดช่อง Ca²⁺ ที่ ER
• <strong>DAG</strong> (diacylglycerol) — กระตุ้น Protein Kinase C (PKC)`
      }
    ]
  },
  {
    id: 'cell-response',
    icon: '⚡',
    title: 'Cell Response',
    thaiTitle: 'การตอบสนองของเซลล์ต่อสิ่งเร้า',
    color: '#3B82F6',
    colorLight: '#93C5FD',
    summary: 'ผลลัพธ์ที่เกิดขึ้นเมื่อเซลล์ได้รับสัญญาณ ทำให้เกิดการเปลี่ยนแปลงพฤติกรรมของเซลล์',
    sections: [
      {
        heading: '⚡ รูปแบบการตอบสนอง',
        content: `เซลล์ตอบสนองต่อสัญญาณได้หลายรูปแบบ:

• <strong>การเปลี่ยนแปลง Gene Expression</strong> — เปิด/ปิดยีนเฉพาะ
• <strong>การเปลี่ยนกิจกรรมของเอนไซม์</strong> — phosphorylation/dephosphorylation
• <strong>การเปลี่ยนรูปร่างเซลล์</strong> — ผ่านการจัดเรียง cytoskeleton ใหม่
• <strong>การเคลื่อนที่ของเซลล์</strong> — Chemotaxis (เคลื่อนตามสารเคมี)
• <strong>การหลั่งสาร</strong> — Exocytosis ปลดปล่อยสารออกจากเซลล์`
      },
      {
        heading: '🔁 Feedback Mechanisms',
        content: `ระบบ feedback ช่วยควบคุมการตอบสนองให้เหมาะสม:

• <strong>Negative Feedback</strong> — ผลลัพธ์ย้อนกลับไปยับยั้งสัญญาณ → รักษาสมดุล
  ตัวอย่าง: ฮอร์โมนไทรอยด์ยับยั้ง TSH

• <strong>Positive Feedback</strong> — ผลลัพธ์ย้อนกลับไปเพิ่มสัญญาณ → ขยายผล
  ตัวอย่าง: Oxytocin ในการคลอดลูก

• <strong>Signal Amplification</strong> — สัญญาณถูกขยายในแต่ละขั้นของ cascade
  → โมเลกุล ligand ตัวเดียว สามารถกระตุ้นการตอบสนองในวงกว้าง`
      }
    ]
  },
  {
    id: 'cell-cycle',
    icon: '🔄',
    title: 'Cell Cycle',
    thaiTitle: 'การควบคุมวัฏจักรเซลล์',
    color: '#EF4444',
    colorLight: '#FCA5A5',
    summary: 'ลำดับเหตุการณ์ที่เซลล์ผ่านตั้งแต่เกิดจนแบ่งตัวเป็นเซลล์ลูก',
    sections: [
      {
        heading: '🔄 เฟสของวัฏจักรเซลล์',
        content: `วัฏจักรเซลล์แบ่งเป็น 2 ช่วงหลัก:

<strong>Interphase</strong> (ระยะเตรียมตัว):
• <em>G1 Phase</em> — เซลล์เติบโต สร้างโปรตีน เตรียมพร้อม
• <em>S Phase</em> — จำลอง DNA (DNA Replication)
• <em>G2 Phase</em> — เตรียมพร้อมสำหรับการแบ่งเซลล์

<strong>M Phase</strong> (ระยะแบ่งเซลล์):
• <em>Mitosis</em> — แบ่งนิวเคลียส (Prophase → Metaphase → Anaphase → Telophase)
• <em>Cytokinesis</em> — แบ่งไซโทพลาสซึม → ได้เซลล์ลูก 2 เซลล์`
      },
      {
        heading: '🚦 Checkpoints',
        content: `จุดตรวจสอบที่ควบคุมการเข้าสู่แต่ละเฟส:

• <strong>G1 Checkpoint</strong> (Restriction Point) — ตรวจขนาดเซลล์, สารอาหาร, สัญญาณ growth factor, ความเสียหายของ DNA
• <strong>G2 Checkpoint</strong> — ตรวจว่า DNA ถูกจำลองสมบูรณ์หรือไม่
• <strong>Spindle Assembly Checkpoint</strong> — ตรวจว่าโครโมโซมเรียงตัวถูกต้องบน metaphase plate

⚠️ หาก checkpoint ทำงานผิดปกติ → อาจนำไปสู่<strong>มะเร็ง</strong>`
      },
      {
        heading: '⚙️ Cyclins & CDKs',
        content: `โปรตีนที่ควบคุมวัฏจักรเซลล์:

• <strong>Cyclins</strong> — โปรตีนที่ระดับขึ้น-ลงตามเฟส (Cyclin D, E, A, B)
• <strong>CDKs</strong> (Cyclin-Dependent Kinases) — เอนไซม์ที่ทำงานเมื่อจับกับ Cyclin
• Cyclin + CDK → <em>Cyclin-CDK Complex</em> → phosphorylate โปรตีนเป้าหมาย → ขับเคลื่อนวัฏจักร

<em>ตัวอย่าง:</em>
• Cyclin D + CDK4/6 → ผ่าน G1 Checkpoint
• Cyclin B + CDK1 → เข้าสู่ Mitosis`
      }
    ]
  },
  {
    id: 'apoptosis',
    icon: '💀',
    title: 'Apoptosis',
    thaiTitle: 'การตายของเซลล์แบบมีแบบแผน',
    color: '#6B7280',
    colorLight: '#D1D5DB',
    summary: 'กระบวนการตายของเซลล์ที่ถูกโปรแกรมไว้ มีบทบาทสำคัญในการพัฒนาและรักษาสมดุลของร่างกาย',
    sections: [
      {
        heading: '💀 ความสำคัญของ Apoptosis',
        content: `Apoptosis เป็นการตายของเซลล์อย่าง "สง่างาม" — ต่างจาก Necrosis (ตายแบบไม่มีแบบแผน):

• <strong>การพัฒนา</strong> — กำจัดเซลล์ที่ไม่จำเป็น เช่น นิ้วมือนิ้วเท้าของตัวอ่อน
• <strong>ภูมิคุ้มกัน</strong> — กำจัด T cells ที่ทำปฏิกิริยากับตัวเอง
• <strong>ป้องกันมะเร็ง</strong> — กำจัดเซลล์ที่ DNA เสียหาย
• <strong>สมดุลเนื้อเยื่อ</strong> — รักษาจำนวนเซลล์ให้คงที่`
      },
      {
        heading: '🔴 Intrinsic Pathway (วิถีภายใน)',
        content: `เริ่มจากสัญญาณภายในเซลล์ (เช่น ความเสียหายของ DNA):

1. สัญญาณเครียด → กระตุ้นโปรตีน <strong>BH3-only</strong> (เช่น Bim, Bad)
2. BH3-only ยับยั้ง <strong>Bcl-2</strong> (anti-apoptotic) → ปลดปล่อย <strong>Bax/Bak</strong>
3. Bax/Bak เจาะรู mitochondria → ปลดปล่อย <strong>Cytochrome c</strong>
4. Cytochrome c + Apaf-1 → สร้าง <strong>Apoptosome</strong>
5. Apoptosome กระตุ้น <strong>Caspase-9</strong> (initiator)
6. Caspase-9 กระตุ้น <strong>Caspase-3, 6, 7</strong> (executioner) → ย่อยสลายเซลล์`
      },
      {
        heading: '🔵 Extrinsic Pathway (วิถีภายนอก)',
        content: `เริ่มจากสัญญาณภายนอกเซลล์ (death ligands):

1. <strong>FasL หรือ TNF</strong> จับกับ <strong>Death Receptor</strong> (Fas หรือ TNFR) บนเยื่อหุ้มเซลล์
2. Death receptor ดึง adaptor protein <strong>FADD</strong>
3. FADD ดึง <strong>Pro-caspase-8</strong> → สร้าง <strong>DISC</strong>
4. Caspase-8 ถูกกระตุ้น
5. Caspase-8 กระตุ้น <strong>Caspase-3</strong> (executioner) → เริ่มทำลายเซลล์

<em>การเปลี่ยนแปลงทางสัณฐานวิทยา:</em>
• เซลล์หดตัว (cell shrinkage)
• โครมาตินอัดแน่น (chromatin condensation)
• เยื่อหุ้มเซลล์พองเป็นถุง (membrane blebbing)
• สร้าง apoptotic bodies → ถูก phagocytes กำจัด`
      }
    ]
  },
  {
    id: 'quiz-hub',
    icon: '📝',
    title: 'Exam & Question Bank',
    thaiTitle: 'คลังข้อสอบชีววิทยาของเซลล์',
    color: '#F59E0B',
    colorLight: '#FDE68A',
    summary: 'ศูนย์รวมคลังข้อสอบและแบบทดสอบประมวลความรู้ครอบคลุมทั้ง 6 บทเรียน พร้อมระบบเฉลยละเอียดและสถิติคลังปัญญา',
    sections: [
      {
        heading: '🏛️ ศูนย์ประมวลความรู้ชีววิทยาของเซลล์',
        content: `ยินดีต้อนรับสู่ <strong>คลังข้อสอบ (Cell Biology Exam Hub)</strong> แหล่งรวบรวมข้อสอบวัดระดับความรู้ทางชีววิทยาระดับเซลล์และการทดลองจริง:

• <strong>ครอบคลุม 6 หัวข้อหลัก</strong>: การแสดงออกของยีน, การควบคุมยีน, การสื่อสารระหว่างเซลล์, การตอบสนองต่อสิ่งเร้า, วัฏจักรเซลล์ และ Apoptosis
• <strong>ระบบตรวจคำตอบทันที</strong>: พร้อมคำอธิบายเหตุผลทางชีววิทยาอย่างละเอียด
• <strong>เหรียญตราเกียรติยศ</strong>: ประเมินระดับความเชี่ยวชาญตั้งแต่ Novice Biologist จนถึง Master Scholar!`
      }
    ]
  }
];
