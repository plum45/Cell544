import { player, keys } from './slime.js';

let joystickZone = null;
let joystickBase = null;
let joystickKnob = null;
let activeTouchId = null;
let baseCenter = { x: 0, y: 0 };
const MAX_RADIUS = 46; // maximum joystick radius in px

export function initTouchControls() {
  joystickZone = document.getElementById('joystick-zone');
  joystickBase = document.getElementById('joystick-base');
  joystickKnob = document.getElementById('joystick-knob');
  const touchContainer = document.getElementById('touch-controls');

  if (!touchContainer || !joystickZone || !joystickBase || !joystickKnob) return;

  // Auto-detect touch capability or tablet screen size
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth <= 1024;
  if (isTouchDevice) {
    touchContainer.classList.add('active');
  }

  // ===== Virtual Joystick Touch Events =====
  joystickZone.addEventListener('touchstart', onJoystickStart, { passive: false });
  window.addEventListener('touchmove', onJoystickMove, { passive: false });
  window.addEventListener('touchend', onJoystickEnd, { passive: false });
  window.addEventListener('touchcancel', onJoystickEnd, { passive: false });

  function onJoystickStart(e) {
    e.preventDefault();
    if (activeTouchId !== null) return;

    const touch = e.changedTouches[0];
    activeTouchId = touch.identifier;

    const rect = joystickBase.getBoundingClientRect();
    baseCenter = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };

    updateJoystick(touch.clientX, touch.clientY);
  }

  function onJoystickMove(e) {
    if (activeTouchId === null) return;

    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === activeTouchId) {
        e.preventDefault();
        updateJoystick(touch.clientX, touch.clientY);
        break;
      }
    }
  }

  function onJoystickEnd(e) {
    if (activeTouchId === null) return;

    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === activeTouchId) {
        activeTouchId = null;
        joystickKnob.style.transform = 'translate(0px, 0px)';
        if (player.joystickInput) {
          player.joystickInput.x = 0;
          player.joystickInput.y = 0;
        }
        break;
      }
    }
  }

  function updateJoystick(clientX, clientY) {
    const dx = clientX - baseCenter.x;
    const dy = clientY - baseCenter.y;
    const dist = Math.hypot(dx, dy);

    const clampedDist = Math.min(dist, MAX_RADIUS);
    const angle = Math.atan2(dy, dx);

    const knobX = Math.cos(angle) * clampedDist;
    const knobY = Math.sin(angle) * clampedDist;

    joystickKnob.style.transform = `translate(${knobX.toFixed(1)}px, ${knobY.toFixed(1)}px)`;

    // Normalized input (-1.0 to 1.0)
    const normX = knobX / MAX_RADIUS;
    const normY = knobY / MAX_RADIUS;

    if (player.joystickInput) {
      player.joystickInput.x = normX;
      player.joystickInput.y = normY;
    }
  }

  // ===== Touch Action Buttons =====
  const btnJump = document.getElementById('btn-touch-jump');
  const btnSprint = document.getElementById('btn-touch-sprint');
  const btnInteract = document.getElementById('btn-touch-interact');

  // 1. Jump Button
  if (btnJump) {
    btnJump.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (player.isGrounded) {
        player.velocity.y = 10.0;
        player.isGrounded = false;
        btnJump.classList.add('pressed');
        setTimeout(() => btnJump.classList.remove('pressed'), 200);
      }
    }, { passive: false });
  }

  // 2. Sprint Button (Toggle Sprint)
  if (btnSprint) {
    btnSprint.addEventListener('touchstart', (e) => {
      e.preventDefault();
      keys.shift = !keys.shift;
      btnSprint.classList.toggle('active', keys.shift);
    }, { passive: false });
  }

  // 3. Interact Button
  if (btnInteract) {
    btnInteract.addEventListener('touchstart', (e) => {
      e.preventDefault();
      btnInteract.classList.add('pressed');
      setTimeout(() => btnInteract.classList.remove('pressed'), 200);
      window.dispatchEvent(new CustomEvent('player-interact'));
    }, { passive: false });
  }

  // Highlight interact button when near landmark/NPC/animal
  const promptEl = document.getElementById('interact-prompt');
  if (promptEl && btnInteract) {
    const observer = new MutationObserver(() => {
      const isNear = promptEl.classList.contains('visible');
      btnInteract.classList.toggle('highlight', isNear);
    });
    observer.observe(promptEl, { attributes: true, attributeFilter: ['class'] });
  }

  console.log('📱 Mobile & iPad Touch Controls initialized successfully!');
}
