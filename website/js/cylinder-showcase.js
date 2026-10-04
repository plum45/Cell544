// 3D Cylinder Rotating Carousel Showcase (Apple Cupertino Edition)
(function() {
  function init3DCylinder() {
    const ring = document.getElementById('showcase-cylinder-ring');
    const stage = document.getElementById('showcase-stage');
    const cards = document.querySelectorAll('.showcase-card');
    if (!ring || !cards.length) return;

    const totalCards = cards.length;
    let angleStep = 360 / totalCards;
    let radius = calculateRadius();
    let currentRotation = 0;
    let targetRotation = 0;
    let autoRotate = true;
    let rotateSpeed = 0.28; // Speed of smooth 3D orbit
    let isDragging = false;
    let startX = 0;
    let previousX = 0;
    let lastDelta = 0;
    let isHovered = false;

    function calculateRadius() {
      const cardWidth = window.innerWidth <= 768 ? 260 : 310;
      // Formula for perfect cylinder radius: (w / 2) / tan(PI / N)
      return Math.round((cardWidth / 2) / Math.tan(Math.PI / totalCards)) + 20;
    }

    // Position cards in 3D Cylinder Ring
    function layoutCards() {
      radius = calculateRadius();
      cards.forEach((card, index) => {
        const cardAngle = index * angleStep;
        card.dataset.angle = cardAngle;
        card.style.transform = `rotateY(${cardAngle}deg) translateZ(${radius}px)`;
      });
    }

    layoutCards();
    window.addEventListener('resize', layoutCards);

    // Animation Loop
    function animate() {
      if (autoRotate && !isHovered && !isDragging) {
        targetRotation -= rotateSpeed;
      }

      // Smooth lerp
      currentRotation += (targetRotation - currentRotation) * 0.08;
      ring.style.transform = `rotateY(${currentRotation}deg)`;

      // Depth fading / scale for active front-facing cards
      cards.forEach(card => {
        if (!isHovered) {
          const cardBaseAngle = parseFloat(card.dataset.angle);
          const effectiveAngle = (cardBaseAngle + currentRotation) % 360;
          const normalized = (effectiveAngle + 360) % 360;
          // Calculate distance from front (0 deg)
          const diffFromFront = Math.abs(normalized > 180 ? 360 - normalized : normalized);
          const opacity = Math.max(0.35, 1 - (diffFromFront / 180) * 0.7);
          card.style.opacity = opacity;
        } else {
          card.style.opacity = 1;
        }
      });

      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);

    // Hover Interaction: Pause & Expand
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        isHovered = true;
        const baseAngle = parseFloat(card.dataset.angle);
        card.style.transform = `rotateY(${baseAngle}deg) translateZ(${radius + 35}px) scale(1.06)`;
        card.style.zIndex = '50';
      });

      card.addEventListener('mouseleave', () => {
        isHovered = false;
        const baseAngle = parseFloat(card.dataset.angle);
        card.style.transform = `rotateY(${baseAngle}deg) translateZ(${radius}px) scale(1)`;
        card.style.zIndex = '1';
      });
    });

    // Drag / Swipe Gestures on Stage
    if (stage) {
      stage.addEventListener('mousedown', (e) => {
        if (e.target.closest('a') || e.target.closest('button')) return;
        isDragging = true;
        startX = e.clientX;
        previousX = e.clientX;
      });

      window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const delta = e.clientX - previousX;
        lastDelta = delta;
        targetRotation += delta * 0.4;
        previousX = e.clientX;
      });

      window.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        targetRotation += lastDelta * 2;
      });

      // Touch Events for Mobile
      stage.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
          isDragging = true;
          startX = e.touches[0].clientX;
          previousX = e.touches[0].clientX;
        }
      }, { passive: true });

      window.addEventListener('touchmove', (e) => {
        if (!isDragging || e.touches.length !== 1) return;
        const currentX = e.touches[0].clientX;
        const delta = currentX - previousX;
        lastDelta = delta;
        targetRotation += delta * 0.5;
        previousX = currentX;
      }, { passive: true });

      window.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        targetRotation += lastDelta * 2;
      });
    }

    // Controls Bar Buttons
    const btnPrev = document.getElementById('btn-cylinder-prev');
    const btnNext = document.getElementById('btn-cylinder-next');
    const btnToggle = document.getElementById('btn-cylinder-toggle');

    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        targetRotation += angleStep;
      });
    }

    if (btnNext) {
      btnNext.addEventListener('click', () => {
        targetRotation -= angleStep;
      });
    }

    if (btnToggle) {
      btnToggle.addEventListener('click', () => {
        autoRotate = !autoRotate;
        btnToggle.innerText = autoRotate ? '⏸️' : '▶️';
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init3DCylinder);
  } else {
    init3DCylinder();
  }
})();
