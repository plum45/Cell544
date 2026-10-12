import { player, keys } from './slime.js';

let joystickZone = null;
let joystickBase = null;
let joystickKnob = null;
let activeTouchId = null;
let baseCenter = { x: 0, y: 0 };
const MAX_RADIUS = 42; // slightly larger radius for easier control

export function initTouchControls() {
  joystickZone = document.getElementById('joystick-zone');
  joystickBase = document.getElementById('joystick-base');
  joystickKnob = document.getElementById('joystick-knob');
  const touchContainer = document.getElementById('touch-controls');
  const btnToggleTouch = document.getElementById('btn-toggle-touch');

  if (!touchContainer || !joystickZone || !joystickBase || !joystickKnob) return;

  // Real mobile touch detection (only phones/tablets with coarse pointer, not PC laptops)
  const isMobileTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  if (isMobileTouch) {
    touchContainer.classList.add('active');
    if (btnToggleTouch) btnToggleTouch.classList.add('active');
  }

  // Toggle button in HUD allows toggling touch controls on/off anytime
  if (btnToggleTouch) {
    btnToggleTouch.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = touchContainer.classList.toggle('active');
      btnToggleTouch.classList.toggle('active', isActive);
    });
  }

  // Auto-show when real touch occurs
  window.addEventListener('touchstart', () => {
    if (!touchContainer.classList.contains('active')) {
      touchContainer.classList.add('active');
      if (btnToggleTouch) btnToggleTouch.classList.add('active');
    }
  }, { passive: true, once: true });

  // Auto-hide touch controls when user starts walking with keyboard on PC
  window.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(key)) {
      if (touchContainer.classList.contains('active') && !isMobileTouch) {
        touchContainer.classList.remove('active');
        if (btnToggleTouch) btnToggleTouch.classList.remove('active');
      }
    }
  });

  // ===== Floating Virtual Joystick =====
  // The joystick zone covers the entire left half of the screen.
  // When touching anywhere in the zone, the joystick base teleports to that position.
  // The base is hidden by default and only appears on touch.
  let isMouseDown = false;

  // Start hidden — only show on touch
  joystickBase.style.opacity = '0';
  joystickBase.style.transition = 'opacity 0.15s ease';

  joystickZone.addEventListener('touchstart', onJoystickStart, { passive: false });
  window.addEventListener('touchmove', onJoystickMove, { passive: false });
  window.addEventListener('touchend', onJoystickEnd, { passive: false });
  window.addEventListener('touchcancel', onJoystickEnd, { passive: false });

  // Mouse fallback for PC users who want on-screen controls
  joystickZone.addEventListener('mousedown', (e) => {
    isMouseDown = true;
    // Move the base to where the user clicked
    moveBaseTo(e.clientX, e.clientY);
    joystickBase.style.opacity = '1';
    updateJoystick(e.clientX, e.clientY);
  });

  window.addEventListener('mousemove', (e) => {
    if (!isMouseDown) return;
    updateJoystick(e.clientX, e.clientY);
  });

  window.addEventListener('mouseup', () => {
    if (!isMouseDown) return;
    isMouseDown = false;
    resetJoystick();
  });

  function moveBaseTo(clientX, clientY) {
    // Position the joystick base centered on the touch point
    const zoneRect = joystickZone.getBoundingClientRect();
    const baseW = joystickBase.offsetWidth;
    const baseH = joystickBase.offsetHeight;

    // Clamp so it doesn't go outside the zone
    let left = clientX - zoneRect.left - baseW / 2;
    let top = clientY - zoneRect.top - baseH / 2;

    // Clamp within zone bounds with some padding
    const pad = 8;
    left = Math.max(pad, Math.min(left, zoneRect.width - baseW - pad));
    top = Math.max(pad, Math.min(top, zoneRect.height - baseH - pad));

    joystickBase.style.left = left + 'px';
    joystickBase.style.top = top + 'px';

    // Update base center for knob calculations
    baseCenter = {
      x: zoneRect.left + left + baseW / 2,
      y: zoneRect.top + top + baseH / 2,
    };
  }

  function onJoystickStart(e) {
    e.preventDefault();
    if (activeTouchId !== null) return;

    const touch = e.changedTouches[0];
    activeTouchId = touch.identifier;

    // Teleport base to where the finger is
    moveBaseTo(touch.clientX, touch.clientY);
    joystickBase.style.opacity = '1';

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
        resetJoystick();
        break;
      }
    }
  }

  function resetJoystick() {
    joystickKnob.style.transform = 'translate(0px, 0px)';
    joystickBase.style.opacity = '0';
    if (player.joystickInput) {
      player.joystickInput.x = 0;
      player.joystickInput.y = 0;
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

  // ===== Action Buttons (Support both Touch & Click) =====
  const btnJump = document.getElementById('btn-touch-jump');
  const btnSprint = document.getElementById('btn-touch-sprint');
  const btnInteract = document.getElementById('btn-touch-interact');

  function triggerJump() {
    if (player.isGrounded) {
      player.velocity.y = 10.0;
      player.isGrounded = false;
      if (btnJump) {
        btnJump.classList.add('pressed');
        setTimeout(() => btnJump.classList.remove('pressed'), 200);
      }
    }
  }

  function toggleSprint() {
    keys.shift = !keys.shift;
    if (btnSprint) btnSprint.classList.toggle('active', keys.shift);
  }

  function triggerInteract() {
    if (btnInteract) {
      btnInteract.classList.add('pressed');
      setTimeout(() => btnInteract.classList.remove('pressed'), 200);
    }
    window.dispatchEvent(new CustomEvent('player-interact'));
  }

  // 1. Jump Button
  if (btnJump) {
    btnJump.addEventListener('touchstart', (e) => { e.preventDefault(); triggerJump(); }, { passive: false });
    btnJump.addEventListener('click', triggerJump);
  }

  // 2. Sprint Button (Toggle Sprint)
  if (btnSprint) {
    btnSprint.addEventListener('touchstart', (e) => { e.preventDefault(); toggleSprint(); }, { passive: false });
    btnSprint.addEventListener('click', toggleSprint);
  }

  // 3. Interact Button
  if (btnInteract) {
    btnInteract.addEventListener('touchstart', (e) => { e.preventDefault(); triggerInteract(); }, { passive: false });
    btnInteract.addEventListener('click', triggerInteract);
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

  console.log('📱 Mobile & iPad Touch Controls initialized (Floating Joystick)!');
}
