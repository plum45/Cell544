// ===== Shared Topic Helper =====
// 1. Auto-awards topic treasure to shared localStorage upon reading or answering correctly
// 2. Adds ?play=1&topic=[id] to "กลับสู่เกาะลอยฟ้า 3D" links for instant seamless return without landing page

(function() {
  const TOPIC_TREASURES = {
    'gene-expression': { id: 'gene-expression', name: 'คริสตัล DNA', emoji: '💎' },
    'gene-regulation': { id: 'gene-regulation', name: 'ม้วนคัมภีร์ RNA', emoji: '📜' },
    'cell-signaling': { id: 'cell-signaling', name: 'ลูกแก้วสัญญาณ', emoji: '🔮' },
    'cell-response': { id: 'cell-response', name: 'หินพลังชีวิต', emoji: '⚡' },
    'cell-cycle': { id: 'cell-cycle', name: 'แว่นตาจักรกล', emoji: '🔬' },
    'apoptosis': { id: 'apoptosis', name: 'เทียนวิญญาณ', emoji: '🕯️' },
  };

  function init() {
    const path = window.location.pathname;
    let currentTopic = null;
    for (const key of Object.keys(TOPIC_TREASURES)) {
      if (path.includes(key)) {
        currentTopic = TOPIC_TREASURES[key];
        break;
      }
    }

    if (!currentTopic) return;

    // 1. Upgrade back-to-island links with ?play=1&topic=...
    document.querySelectorAll('a[href="../index.html"], a[href="../island-3d/index.html"]').forEach(a => {
      a.href = `../island-3d/index.html?play=1&topic=${currentTopic.id}`;
    });

    // 2. Award treasure function
    window.awardCurrentTopicTreasure = function() {
      try {
        const key = 'cell-life-treasures';
        const list = JSON.parse(localStorage.getItem(key)) || [];
        if (!list.includes(currentTopic.id)) {
          list.push(currentTopic.id);
          localStorage.setItem(key, JSON.stringify(list));
          showTreasureToast(currentTopic);
        }
      } catch (e) {}
    };

    function showTreasureToast(t) {
      if (document.querySelector('.topic-treasure-toast')) return;
      const toast = document.createElement('div');
      toast.className = 'topic-treasure-toast';
      toast.innerHTML = `
        <span style="font-size: 1.5rem;">${t.emoji}</span>
        <div>
          <div style="font-size: 0.72rem; text-transform: uppercase; font-weight: 700; color: #7C3AED; letter-spacing: 0.05em;">✨ ปลดล็อกสมบัติใหม่!</div>
          <div style="font-weight: 700; font-size: 0.95rem; color: #1E293B;">${t.name}</div>
        </div>
      `;
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 400);
      }, 4500);
    }

    // Auto-award when user scrolls near the bottom of lesson
    let awarded = false;
    window.addEventListener('scroll', () => {
      if (awarded) return;
      const scrollPos = window.innerHeight + window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      if (scrollPos >= docHeight - 350) {
        awarded = true;
        window.awardCurrentTopicTreasure();
      }
    }, { passive: true });

    // Hook existing checkAnswer function
    const origCheck = window.checkAnswer;
    window.checkAnswer = function(btn, isCorrect, explanation) {
      if (typeof origCheck === 'function') {
        origCheck(btn, isCorrect, explanation);
      }
      if (isCorrect) {
        window.awardCurrentTopicTreasure();
      }
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
