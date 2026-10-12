import { AIAvatar3D } from './ai-avatar.js';

// ============================================================
// AI Guide Module — "Professor Bunny" (ศาสตราจารย์บันนี่)
// NVIDIA Nemotron AI-powered Chat System + 3D Half-Body Avatar
// ============================================================

const AI_CONFIG = {
  proxyUrl: '/api/chat',
  baseUrl: 'https://integrate.api.nvidia.com/v1/chat/completions',
  apiKey: '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',
  model: 'nvidia/nemotron-3-ultra-550b-a55b',
  temperature: 0.85,
  topP: 0.95,
  maxTokens: 2048,
  systemPrompt: `คุณคือ "ศาสตราจารย์บันนี่" (Professor Bunny) 🐰 — AI Guide ประจำเกาะลอยฟ้าแห่งชีวิตเซลล์ (Cell Life 3D)

บุคลิกภาพ:
- สุภาพ เป็นกันเอง อบอุ่น พูดคุยเหมือนอาจารย์ที่ใจดี
- ใช้ภาษาไทยเป็นหลัก แทรกศัพท์อังกฤษทางวิทยาศาสตร์ที่สำคัญ
- ตอบกระชับ ชัดเจน ไม่ยาวเกินไป (ไม่เกิน 120 คำ เพื่อความกระชับในการพูดบรรยายด้วยเสียง)
- ใช้อิโมจิเล็กน้อยให้น่ารักแต่ไม่มากเกินไป

ความเชี่ยวชาญ:
1. การแสดงออกของยีน (Gene Expression) — DNA → Transcription → Translation → Protein
2. การควบคุมการแสดงออกของยีน (Gene Regulation) — Operons, Epigenetics, Transcription Factors
3. การสื่อสารระหว่างเซลล์ (Cell Signaling) — Ligand-Receptor, Signal Transduction, Second Messengers
4. การตอบสนองของเซลล์ (Cell Response) — Gene activation, Enzyme regulation, Adaptation
5. วัฏจักรของเซลล์ (Cell Cycle) — G1, S, G2, M phase, Checkpoints (p53)
6. การตายของเซลล์ (Apoptosis) — Intrinsic/Extrinsic pathways, Caspases cascade

กฎ:
- ตอบตรงประเด็น เข้าใจง่าย และให้กำลังใจผู้เรียนเสมอ
- ห้ามให้ข้อมูลที่ผิดพลาดทางวิทยาศาสตร์`
};

// ===== State =====
let chatHistory = [];
let isStreaming = false;
let isPanelOpen = false;
let avatar3D = null;
let isVoiceMuted = false;

// ===== DOM Setup =====
export function initAIGuide() {
  createBubble();
  createChatPanel();
  setupEventListeners();
  
  // Initialize 3D Avatar in container
  const avatarContainer = document.getElementById('ai-avatar-viewport');
  if (avatarContainer && !avatar3D) {
    avatar3D = new AIAvatar3D(avatarContainer);
    
    avatar3D.onStateChange = (state) => {
      updateAvatarStatusBadge(state);
    };
  }

  // Add welcome message
  addBotMessage('สวัสดีครับนักสำรวจ! 🐰✨\n\nผมคือ **ศาสตราจารย์บันนี่** AI Guide ประจำเกาะลอยฟ้า 3D แห่งนี้\n\nสามารถพิมพ์คำถาม หรือกดปุ่ม 🎤 เพื่อพูดคุยเรื่องชีววิทยาเซลล์กับผมได้เลยครับ!');
}

function createBubble() {
  if (document.getElementById('ai-guide-bubble')) return;

  const bubble = document.createElement('div');
  bubble.className = 'ai-guide-bubble';
  bubble.id = 'ai-guide-bubble';
  bubble.innerHTML = `
    <div class="ai-guide-avatar-btn" id="ai-guide-open" title="เปิดหน้าต่างสนทนา 3D AI Guide">
      <span class="avatar-emoji">🐰</span>
      <div class="ai-guide-notification" id="ai-notif"></div>
    </div>
    <div class="ai-guide-greeting">
      สวัสดี! ผมคือศาสตราจารย์บันนี่ 🐰 ถามเรื่องชีววิทยาเซลล์ได้เลย!
    </div>
  `;
  document.body.appendChild(bubble);
}

function createChatPanel() {
  if (document.getElementById('ai-chat-panel')) return;

  const panel = document.createElement('div');
  panel.className = 'ai-chat-panel';
  panel.id = 'ai-chat-panel';
  panel.innerHTML = `
    <!-- Top Header Bar -->
    <div class="ai-chat-header">
      <div class="ai-header-left">
        <div class="ai-chat-avatar">🐰</div>
        <div class="ai-chat-header-info">
          <div class="ai-chat-name">
            ศาสตราจารย์บันนี่ (Professor Bunny)
            <span class="ai-chat-model-tag">3D AVATAR &bull; NEMOTRON 550B</span>
          </div>
          <div class="ai-chat-status">
            <span class="ai-status-dot"></span>
            <span id="ai-status-text">พร้อมตอบคำถาม & สนทนาด้วยเสียง</span>
          </div>
        </div>
      </div>
      <div class="ai-header-actions">
        <button class="ai-voice-toggle" id="ai-btn-voice-toggle" title="เปิด/ปิดเสียงพูดบรรยาย">
          <span class="voice-icon" id="ai-voice-icon">🔊</span>
          <span class="voice-text" id="ai-voice-text">เสียงเปิด</span>
        </button>
        <button class="ai-chat-close" id="ai-chat-close" title="ปิดแชท">✕</button>
      </div>
    </div>

    <!-- Main Body: 2-Column (3D Avatar Stage + Conversation Stream) -->
    <div class="ai-chat-body">
      
      <!-- Left Column: 3D Upper-Body Avatar Stage -->
      <div class="ai-avatar-stage">
        <!-- 3D Canvas Viewport -->
        <div class="ai-avatar-viewport" id="ai-avatar-viewport">
          <!-- Three.js Canvas mounts here -->
        </div>

        <!-- Avatar Status & Wave Visualizer -->
        <div class="ai-avatar-meta">
          <div class="ai-avatar-state-pill" id="ai-avatar-state-pill">
            <span class="state-dot" id="ai-state-dot"></span>
            <span class="state-label" id="ai-state-label">IDLE &bull; พร้อมคุย</span>
          </div>

          <!-- Sound Wave Animation -->
          <div class="ai-avatar-audio-wave" id="ai-audio-wave">
            <div class="wave-bar"></div>
            <div class="wave-bar"></div>
            <div class="wave-bar"></div>
            <div class="wave-bar"></div>
            <div class="wave-bar"></div>
          </div>
        </div>

        <!-- 3D Avatar Actions -->
        <div class="ai-avatar-controls">
          <button class="ai-avatar-btn btn-mic" id="ai-btn-mic" title="กดเพื่อพูดด้วยเสียงภาษาไทย">
            <span class="mic-icon">🎤</span>
            <span class="mic-text" id="ai-mic-label">กดเพื่อพูด (Thai)</span>
          </button>
          <button class="ai-avatar-btn btn-intro" id="ai-btn-intro" title="ให้ศาสตราจารย์แนะนำตัว">
            <span>✨ แนะนำตัว</span>
          </button>
        </div>
      </div>

      <!-- Right Column: Conversation Stream & Intelligence -->
      <div class="ai-chat-col">
        <!-- Quick Action Chips -->
        <div class="ai-chat-quick-actions">
          <button class="ai-quick-chip" data-q="Gene Expression คืออะไร?">🧬 Gene Expression</button>
          <button class="ai-quick-chip" data-q="อธิบาย Cell Signaling แบบเข้าใจง่าย">📡 Cell Signaling</button>
          <button class="ai-quick-chip" data-q="Apoptosis มีขั้นตอนอย่างไร?">🕯️ Apoptosis</button>
          <button class="ai-quick-chip" data-q="จุดตรวจ Cell Cycle Checkpoints สำคัญยังไง?">🔬 Cell Cycle</button>
          <button class="ai-quick-chip" data-q="แนะนำจุดสำรวจบนเกาะ 3D หน่อย">🗺️ แนะนำเกาะ</button>
        </div>

        <!-- Messages History -->
        <div class="ai-chat-messages" id="ai-chat-messages"></div>

        <!-- Input Area -->
        <div class="ai-chat-input-area">
          <div class="ai-chat-input-wrap">
            <input 
              type="text" 
              class="ai-chat-input" 
              id="ai-chat-input" 
              placeholder="พิมพ์คำถาม หรือกด 🎤 เพื่อพูด..." 
              autocomplete="off"
              maxlength="500"
            />
            <button class="ai-input-mic-btn" id="ai-input-mic" title="พูดด้วยเสียง">
              🎤
            </button>
            <button class="ai-chat-send" id="ai-chat-send" title="ส่งคำถาม">
              ➤
            </button>
          </div>
          <div class="ai-chat-footer-hint">
            <span>💡 3D Avatar ขยับปากและพูดตอบ &bull; รองรับ Web Speech STT/TTS ภาษาไทย</span>
          </div>
        </div>
      </div>

    </div>
  `;
  document.body.appendChild(panel);
}

function updateAvatarStatusBadge(state) {
  const pill = document.getElementById('ai-avatar-state-pill');
  const dot = document.getElementById('ai-state-dot');
  const label = document.getElementById('ai-state-label');
  const wave = document.getElementById('ai-audio-wave');

  if (!pill || !label || !dot) return;

  pill.className = 'ai-avatar-state-pill ' + state;
  if (wave) {
    wave.classList.toggle('active', state === 'speaking' || state === 'listening');
  }

  if (state === 'speaking') {
    label.textContent = 'SPEAKING • กำลังพูดบรรยาย 🔊';
    dot.style.background = '#06d6a0';
  } else if (state === 'thinking') {
    label.textContent = 'THINKING • กำลังประมวลผล 🧠';
    dot.style.background = '#a855f7';
  } else if (state === 'listening') {
    label.textContent = 'LISTENING • กำลังรับฟังเสียง 🎤';
    dot.style.background = '#38bdf8';
  } else {
    label.textContent = 'IDLE • พร้อมพูดคุย ✨';
    dot.style.background = '#06d6a0';
  }
}

function setupEventListeners() {
  // Open chat
  document.getElementById('ai-guide-open')?.addEventListener('click', toggleChat);
  
  // Close chat
  document.getElementById('ai-chat-close')?.addEventListener('click', toggleChat);
  
  // Send message
  document.getElementById('ai-chat-send')?.addEventListener('click', sendMessage);
  
  // Enter key to send
  document.getElementById('ai-chat-input')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Voice Toggle (Mute / Unmute)
  document.getElementById('ai-btn-voice-toggle')?.addEventListener('click', () => {
    if (!avatar3D) return;
    isVoiceMuted = avatar3D.toggleMute();
    const icon = document.getElementById('ai-voice-icon');
    const text = document.getElementById('ai-voice-text');
    if (icon && text) {
      icon.textContent = isVoiceMuted ? '🔇' : '🔊';
      text.textContent = isVoiceMuted ? 'เสียงปิด' : 'เสียงเปิด';
    }
  });

  // Microphone Voice Input (Both from stage button and input bar)
  const triggerVoiceInput = () => {
    if (!avatar3D) return;
    const micLabel = document.getElementById('ai-mic-label');
    const micBtn = document.getElementById('ai-btn-mic');

    if (avatar3D.isListening) {
      avatar3D.stopVoiceInput();
      if (micLabel) micLabel.textContent = 'กดเพื่อพูด (Thai)';
      if (micBtn) micBtn.classList.remove('recording');
      return;
    }

    if (micLabel) micLabel.textContent = 'กำลังฟังเสียง... 🔴';
    if (micBtn) micBtn.classList.add('recording');

    const started = avatar3D.startVoiceInput((transcript) => {
      if (micLabel) micLabel.textContent = 'กดเพื่อพูด (Thai)';
      if (micBtn) micBtn.classList.remove('recording');
      
      const input = document.getElementById('ai-chat-input');
      if (input && transcript) {
        input.value = transcript;
        sendMessage();
      }
    });

    if (!started) {
      if (micLabel) micLabel.textContent = 'กดเพื่อพูด (Thai)';
      if (micBtn) micBtn.classList.remove('recording');
    }
  };

  document.getElementById('ai-btn-mic')?.addEventListener('click', triggerVoiceInput);
  document.getElementById('ai-input-mic')?.addEventListener('click', triggerVoiceInput);

  // Self Introduction Button
  document.getElementById('ai-btn-intro')?.addEventListener('click', () => {
    const input = document.getElementById('ai-chat-input');
    if (input) {
      input.value = 'แนะนำตัวหน่อยครับอาจารย์บันนี่!';
      sendMessage();
    }
  });
  
  // Quick action chips
  document.querySelectorAll('.ai-quick-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.getAttribute('data-q');
      if (q) {
        const input = document.getElementById('ai-chat-input');
        if (input) input.value = q;
        sendMessage();
      }
    });
  });
  
  // Keyboard shortcut: Ctrl+Shift+A to toggle
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
      e.preventDefault();
      toggleChat();
    }
  });
}

// ===== Chat Logic =====
export function toggleChat() {
  const panel = document.getElementById('ai-chat-panel');
  const bubble = document.getElementById('ai-guide-bubble');
  const notif = document.getElementById('ai-notif');
  
  isPanelOpen = !isPanelOpen;
  
  if (isPanelOpen) {
    panel?.classList.add('open');
    bubble?.classList.add('hidden');
    if (notif) notif.style.display = 'none';

    // Trigger avatar canvas resize when panel reveals
    setTimeout(() => {
      if (avatar3D) avatar3D.onResize();
      document.getElementById('ai-chat-input')?.focus();
    }, 250);
  } else {
    panel?.classList.remove('open');
    bubble?.classList.remove('hidden');
    if (avatar3D) {
      avatar3D.stopSpeaking();
      avatar3D.stopVoiceInput();
    }
  }
}

function addBotMessage(text, reasoning = null) {
  const container = document.getElementById('ai-chat-messages');
  if (!container) return;
  
  const msgEl = document.createElement('div');
  msgEl.className = 'ai-msg ai-msg-bot';
  
  let reasoningHTML = '';
  if (reasoning && reasoning.trim()) {
    reasoningHTML = `
      <button class="ai-msg-reasoning-toggle" onclick="this.nextElementSibling.classList.toggle('collapsed')">
        🧠 กระบวนการคิด (NVIDIA Nemotron) ▾
      </button>
      <div class="ai-msg-reasoning collapsed">${escapeHtml(reasoning)}</div>
    `;
  }
  
  msgEl.innerHTML = `
    <div class="ai-msg-avatar">🐰</div>
    <div class="ai-msg-content-wrap">
      ${reasoningHTML}
      <div class="ai-msg-bubble">${formatMessage(text)}</div>
      <button class="ai-msg-replay-btn" title="ฟังเสียงอ่านข้อความนี้อีกครั้ง">🔊 ฟังเสียง</button>
    </div>
  `;

  // Replay speech button listener
  msgEl.querySelector('.ai-msg-replay-btn')?.addEventListener('click', () => {
    if (avatar3D) avatar3D.speak(text);
  });
  
  container.appendChild(msgEl);
  container.scrollTop = container.scrollHeight;
}

function addUserMessage(text) {
  const container = document.getElementById('ai-chat-messages');
  if (!container) return;
  
  const msgEl = document.createElement('div');
  msgEl.className = 'ai-msg ai-msg-user';
  msgEl.innerHTML = `
    <div class="ai-msg-avatar">👤</div>
    <div class="ai-msg-bubble">${escapeHtml(text)}</div>
  `;
  
  container.appendChild(msgEl);
  container.scrollTop = container.scrollHeight;
}

function addThinkingIndicator() {
  const container = document.getElementById('ai-chat-messages');
  if (!container) return;
  
  const thinkEl = document.createElement('div');
  thinkEl.className = 'ai-msg ai-msg-bot';
  thinkEl.id = 'ai-thinking';
  thinkEl.innerHTML = `
    <div class="ai-msg-avatar">🐰</div>
    <div class="ai-msg-bubble">
      <div class="ai-msg-thinking">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
    </div>
  `;
  
  container.appendChild(thinkEl);
  container.scrollTop = container.scrollHeight;
}

function removeThinkingIndicator() {
  document.getElementById('ai-thinking')?.remove();
}

function setStatus(text) {
  const el = document.getElementById('ai-status-text');
  if (el) el.textContent = text;
}

async function sendMessage() {
  const input = document.getElementById('ai-chat-input');
  const sendBtn = document.getElementById('ai-chat-send');
  if (!input || isStreaming) return;
  
  const text = input.value.trim();
  if (!text) return;
  
  // Clear input
  input.value = '';
  
  // Add user message to UI
  addUserMessage(text);
  
  // Add to chat history
  chatHistory.push({ role: 'user', content: text });
  
  // Set avatar to Thinking state
  isStreaming = true;
  if (sendBtn) sendBtn.disabled = true;
  setStatus('กำลังคิดและประมวลผลคำตอบ...');
  addThinkingIndicator();

  if (avatar3D) {
    avatar3D.setState('thinking');
  }
  
  try {
    const response = await callNemotronAPI(chatHistory);
    removeThinkingIndicator();
    
    // Add bot response
    addBotMessage(response.content, response.reasoning);
    chatHistory.push({ role: 'assistant', content: response.content });
    
    // Keep history manageable (last 20 messages)
    if (chatHistory.length > 20) {
      chatHistory = chatHistory.slice(-20);
    }
    
    setStatus('พร้อมตอบคำถาม');

    // Trigger 3D Avatar to speak with voice and lip-sync
    if (avatar3D) {
      avatar3D.speak(response.content);
    }
  } catch (error) {
    removeThinkingIndicator();
    console.error('AI Guide Error:', error);
    const errorMsg = 'ขอโทษครับ ตอนนี้ผมเชื่อมต่อ AI ไม่ได้ 😅 ลองถามใหม่อีกครั้ง หรือสอบถามหัวข้อบนเกาะได้เลยครับ!';
    addBotMessage(errorMsg);
    setStatus('พร้อมตอบคำถาม');
    if (avatar3D) {
      avatar3D.speak(errorMsg);
    }
  }
  
  isStreaming = false;
  if (sendBtn) sendBtn.disabled = false;
  input.focus();
}

// ===== NVIDIA Nemotron API Call =====
async function callNemotronAPI(messages) {
  const payload = {
    model: AI_CONFIG.model,
    messages: [
      { role: 'system', content: AI_CONFIG.systemPrompt },
      ...messages
    ],
    temperature: AI_CONFIG.temperature,
    top_p: AI_CONFIG.topP,
    max_tokens: AI_CONFIG.maxTokens,
    stream: false
  };

  // 1. Try local server proxy (/api/chat) first to bypass CORS
  try {
    const proxyResp = await fetch(AI_CONFIG.proxyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (proxyResp.ok) {
      const data = await proxyResp.json();
      const choice = data.choices?.[0];
      if (choice?.message?.content) {
        return {
          content: choice.message.content,
          reasoning: choice.message.reasoning_content || null
        };
      }
    }
  } catch (proxyErr) {
    console.warn('Local proxy not reachable, attempting direct...', proxyErr);
  }

  // 2. Try direct NVIDIA API (if browser allows or server environment permits)
  try {
    const directResp = await fetch(AI_CONFIG.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_CONFIG.apiKey}`
      },
      body: JSON.stringify(payload)
    });
    if (directResp.ok) {
      const data = await directResp.json();
      const choice = data.choices?.[0];
      if (choice?.message?.content) {
        return {
          content: choice.message.content,
          reasoning: choice.message.reasoning_content || null
        };
      }
    }
  } catch (directErr) {
    console.warn('Direct API failed (CORS or network), using local biology engine...', directErr);
  }

  // 3. Robust Local Knowledge Fallback
  const lastUserMsg = messages[messages.length - 1]?.content || '';
  return generateLocalBiologyResponse(lastUserMsg);
}

// ===== Local Biology Knowledge Engine (Zero-Failure Fallback) =====
function generateLocalBiologyResponse(query) {
  const q = (query || '').toLowerCase();
  
  if (q.includes('gene expression') || q.includes('การแสดงออกของยีน') || q.includes('transcription') || q.includes('translation') || q.includes('ถอดรหัส') || q.includes('แปลรหัส')) {
    return {
      content: `🧬 **การแสดงออกของยีน (Gene Expression)** คือกระบวนการที่รหัสพันธุกรรมใน DNA ถูกนำมาสร้างเป็นโปรตีนที่ทำหน้าที่จริงในเซลล์ ประกอบด้วย 2 ขั้นตอนหลัก:\n\n1. **Transcription (การถอดรหัส)**: เกิดขึ้นในนิวเคลียส โดยเอนไซม์ RNA Polymerase จะอ่านลำดับเบสบน DNA แล้วสังเคราะห์เป็นสาย mRNA\n2. **Translation (การแปลรหัส)**: สาย mRNA จะถูกส่งออกมายังไซโทพลาสซึมเพื่อเข้าสู่ไรโบโซม (Ribosome) โดยมี tRNA นำกรดอะมิโนมาต่อกันตามรหัสโคดอน (Codon) เริ่มต้นที่ AUG (Methionine) จนได้เป็นสายพอลิเพปไทด์ครับ!`,
      reasoning: 'ผู้ใช้สอบถามเรื่อง Gene Expression นำเสนอหัวใจสำคัญ Central Dogma: DNA -> mRNA -> Protein อย่างกระชับและถูกต้องตามหลักชีววิทยา'
    };
  }

  if (q.includes('gene regulation') || q.includes('ควบคุม') || q.includes('operon') || q.includes('epigenetics') || q.includes('lac')) {
    return {
      content: `🎛️ **การควบคุมการแสดงออกของยีน (Gene Regulation)** คือกลไกที่เซลล์ใช้เปิดหรือปิดการทำงานของยีนตามสภาพแวดล้อมและความต้องการ:\n\n- **ตัวอย่างในโพรแคริโอต**: **Lac Operon** ในแบคทีเรีย E. coli ยีนจะทำงานเมื่อมีน้ำตาลแลคโตส สาร Allolactose จะไปจับกับ Repressor ทำให้หลุดออกจาก Operator และเปิดทางให้ RNA Polymerase สังเคราะห์เอนไซม์ย่อยแลคโตสได้\n- **ในยูแคริโอต**: มีการควบคุมระดับ **Epigenetics** เช่น การเติมหมู่เมทิล (DNA Methylation) เพื่อปิดยีน หรือการเติมหมู่อะซิติล (Histone Acetylation) เพื่อคลายเกลียวดีเอ็นเอให้ยีนทำงานได้ครับ!`,
      reasoning: 'ผู้ใช้สอบถามเกี่ยวกับการควบคุมยีน อธิบายทั้งระดับ Operon ในแบคทีเรีย และ Epigenetics ในยูแคริโอต'
    };
  }

  if (q.includes('signaling') || q.includes('สื่อสาร') || q.includes('สัญญาณ') || q.includes('receptor') || q.includes('ligand')) {
    return {
      content: `📡 **การสื่อสารระหว่างเซลล์ (Cell Signaling)** ประกอบด้วย 3 ขั้นตอนหลักตามทฤษฎีชีววิทยาโมเลกุล:\n\n1. **Reception (การรับสัญญาณ)**: โมเลกุลสัญญาณ (Ligand) เข้าจับอย่างจำเพาะกับตัวรับ (Receptor) เช่น GPCR หรือ Receptor Tyrosine Kinase\n2. **Transduction (การส่งต่อสัญญาณ)**: การเปลี่ยนรูปสัญญาณผ่าน Second Messengers (เช่น cAMP, Ca2+) และ Phosphorylation Cascade กระตุ้นโปรตีนไคเนสเป็นทอดๆ\n3. **Response (การตอบสนอง)**: เซลล์แสดงการตอบสนอง เช่น การเปลี่ยนสภาพการทำงานของเอนไซม์ หรือสั่งเปิด-ปิดยีนในนิวเคลียสครับ!`,
      reasoning: 'อธิบาย 3 ขั้นตอน Reception, Transduction, Response พร้อมตัวอย่างโมเลกุลสื่อสัญญาณ'
    };
  }

  if (q.includes('response') || q.includes('ตอบสนอง')) {
    return {
      content: `⚡ **การตอบสนองของเซลล์ (Cell Response)** คือผลลัพธ์ปลายทางที่เกิดขึ้นหลังจากการรับส่งสัญญาณชีวเคมี แบ่งได้เป็น 2 ระดับ:\n\n1. **ระดับไซโทพลาสซึม (รวดเร็ว)**: ปรับเปลี่ยนการทำงานของโปรตีนหรือเอนไซม์ที่มีอยู่แล้วทันที เช่น อะดรีนาลีนกระตุ้นการสลายไกลโคเจนเป็นกลูโคสภายในเวลาไม่กี่วินาที\n2. **ระดับนิวเคลียส (ยั่งยืน)**: ปรับเปลี่ยนระดับการถอดรหัสของยีน โดยส่งสัญญาณไปกระตุ้น Transcription Factors ให้สร้างโปรตีนชนิดใหม่เพื่อปรับตัวต่อสิ่งแวดล้อมครับ!`,
      reasoning: 'สรุปรูปแบบการตอบสนองของเซลล์ทั้งระดับเอนไซม์ฉับพลันและระดับการสังเคราะห์โปรตีนใหม่'
    };
  }

  if (q.includes('cycle') || q.includes('วัฏจักร') || q.includes('p53') || q.includes('checkpoint') || q.includes('แบ่งเซลล์')) {
    return {
      content: `🔄 **วัฏจักรของเซลล์ (Cell Cycle & Checkpoints)**:\n\nวัฏจักรเซลล์ประกอบด้วยระยะ **Interphase (G1 → S → G2)** และระยะ **M Phase (Mitosis)** โดยมีจุดตรวจความปลอดภัย (Checkpoints) สำคัญ 3 จุด:\n\n- **G1 Checkpoint**: ตรวจขนาดเซลล์และสารอาหาร\n- **G2 Checkpoint**: ตรวจความถูกต้องของการจำลอง DNA ก่อนเข้าสู่ระยะแบ่งนิวเคลียส\n- **M Checkpoint (Spindle)**: ตรวจการจับกันของโครโมโซมกับเส้นใยสปินเดิล\n\n🛡️ **โปรตีน p53 (Guardian of the Genome)**: ทำหน้าที่ตรวจจับความเสียหายของ DNA หากพบข้อผิดพลาด จะสั่งหยุดวัฏจักรเพื่อซ่อมแซม หรือสั่งเซลล์เข้าสู่กระบวนการตาย (Apoptosis) ป้องกันไม่ให้กลายเป็นเซลล์มะเร็งครับ!`,
      reasoning: 'อธิบายขั้นตอนของวัฏจักรเซลล์ จุดตรวจ Checkpoints และบทบาทสำคัญของโปรตีน p53'
    };
  }

  if (q.includes('apoptosis') || q.includes('การตาย') || q.includes('caspase') || q.includes('ตาย')) {
    return {
      content: `🕯️ **Apoptosis (การตายแบบมีแบบแผนของเซลล์)**:\n\nคือกระบวนการตายตามโปรแกรมที่เซลล์ควบคุมอย่างเป็นระเบียบ ไม่ทำให้เกิดการอักเสบในเนื้อเยื่อรอบข้าง มี 2 วิถีหลัก:\n\n1. **Intrinsic Pathway (วิถีภายใน)**: เกิดเมื่อ DNA เสียหายรุนแรง ไมโทคอนเดรียจะปล่อย **Cytochrome c** ออกมาในไซโทพลาสซึม\n2. **Extrinsic Pathway (วิถีภายนอก)**: เกิดเมื่อมี Death Ligand มาจับกับตัวรับบนผิวเซลล์\n\n💥 ทั้งสองวิถีจะนำไปสู่การกระตุ้นกลุ่มเอนไซม์ **Caspases** ให้ย่อยสลายโครงสร้างเซลล์ เกิดการแตกตัวเป็นถุงเล็กๆ (Apoptotic bodies) แล้วถูกเซลล์เม็ดเลือดขาวกลืนกินอย่างปลอดภัยครับ!`,
      reasoning: 'สรุปกลไก Apoptosis ทั้ง Intrinsic และ Extrinsic pathways รวมถึงการทำงานของเอนไซม์ Caspases'
    };
  }

  if (q.includes('แนะนำตัว') || q.includes('ใคร') || q.includes('ชื่อ') || q.includes('สวัสดี') || q.includes('hello') || q.includes('hi')) {
    return {
      content: `สวัสดีครับ! 🐰✨ ผมคือ **ศาสตราจารย์บันนี่ (Professor Bunny)** AI Guide ประจำระบบจำลอง **Cell Life 3D**\n\nผมพร้อมช่วยอธิบายเนื้อหาชีววิทยาโมเลกุลทั้ง 6 บทเรียน สนทนาด้วยเสียง และแนะนำจุดน่าสนใจบนเกาะลอยฟ้าและในสถาบันวิจัย 2D ถามข้อสงสัยเรื่องเซลล์กับผมได้เลยครับ!`,
      reasoning: 'ทักทายและแนะนำตัวในฐานะ AI Guide ประจำระบบการเรียนรู้'
    };
  }

  if (q.includes('เกาะ') || q.includes('3d') || q.includes('สำรวจ') || q.includes('สถาบันวิจัย') || q.includes('quiz') || q.includes('ข้อสอบ')) {
    return {
      content: `🗺️ **คำแนะนำการเรียนรู้ในระบบ Cell Life 3D**:\n\n1. **โหมดเกาะลอยฟ้า 3D**: เดินสำรวจอนุสาวรีย์ 6 หัวข้อชีววิทยา กดปุ่ม E เมื่อเข้าใกล้อนุสาวรีย์เพื่อเปิดหน้าบทเรียน\n2. **สถาบันวิจัยชีววิทยา 2D**: จำลองห้องแล็บและภารกิจกอบกู้ศูนย์วิจัยจากซอมบี้กลายพันธุ์ด้วยชีววิทยา\n3. **คลังข้อสอบ 15 ข้อ**: กดปุ่ม 'คลังข้อสอบ' เพื่อประมวลผลคะแนนการเรียนรู้ของคุณครับ!`,
      reasoning: 'แนะนำฟีเจอร์หลักและเส้นทางการสำรวจบนระบบ'
    };
  }

  // General scientific fallback
  return {
    content: `ยินดีต้อนรับครับ! 🐰 เกี่ยวกับเรื่อง **"${escapeHtml(query)}"** ในทางชีววิทยาเซลล์ เซลล์เป็นหน่วยพื้นฐานของสิ่งมีชีวิตที่มีระบบควบคุมที่ซับซ้อนและแม่นยำมากครับ\n\nคุณสามารถสอบถามเจาะลึกใน 6 หัวข้อหลักได้เลยครับ:\n- 🧬 **Gene Expression** (การสังเคราะห์โปรตีน)\n- 🎛️ **Gene Regulation** (การควบคุมยีน)\n- 📡 **Cell Signaling** (การสื่อสารระหว่างเซลล์)\n- ⚡ **Cell Response** (การตอบสนอง)\n- 🔄 **Cell Cycle** (วัฏจักรเซลล์ & p53)\n- 🕯️ **Apoptosis** (การตายของเซลล์)`,
    reasoning: 'คำตอบทั่วไปแนะนำหัวข้อชีววิทยาหลัก 6 เรื่องเพื่อให้ผู้ใช้เลือกเรียนรู้ต่อ'
  };
}

// ===== Helpers =====
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatMessage(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>');
}

