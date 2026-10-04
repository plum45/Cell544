// Interactive 3D Canvas Visualizer for Bio-Tech Website (DNA & Particle Core)
(function() {
  const canvas = document.getElementById('canvas-dna-3d');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = canvas.width = canvas.parentElement.clientWidth;
  let height = canvas.height = canvas.parentElement.clientHeight;

  window.addEventListener('resize', () => {
    if (!canvas.parentElement) return;
    width = canvas.width = canvas.parentElement.clientWidth;
    height = canvas.height = canvas.parentElement.clientHeight;
  });

  let mouseX = width / 2;
  let mouseY = height / 2;
  let targetMouseX = mouseX;
  let targetMouseY = mouseY;

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    if (rect.top <= window.innerHeight && rect.bottom >= 0) {
      targetMouseX = e.clientX - rect.left;
      targetMouseY = e.clientY - rect.top;
    }
  });

  // Base parameters for 3D DNA Helix Simulation
  const numPairs = 50;
  const radius = 120;
  const spacing = 18;
  let rotation = 0;

  // Additional ambient particles
  const particles = [];
  const particleCount = 70;
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: (Math.random() - 0.5) * width * 1.5,
      y: (Math.random() - 0.5) * height * 1.5,
      z: Math.random() * 400 - 200,
      size: Math.random() * 2.5 + 1,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      vz: (Math.random() - 0.5) * 0.4,
      color: Math.random() > 0.5 ? '#00f2fe' : '#9d4edd'
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Smooth mouse lerp
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    const tiltX = (mouseY - height / 2) * 0.0015;
    const tiltY = (mouseX - width / 2) * 0.002;

    rotation += 0.015;

    // Draw ambient bio-glow center
    const grad = ctx.createRadialGradient(width / 2, height / 2, 10, width / 2, height / 2, 280);
    grad.addColorStop(0, 'rgba(0, 242, 254, 0.12)');
    grad.addColorStop(0.5, 'rgba(157, 78, 221, 0.06)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Render Ambient floating particles
    for (let p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.z += p.vz;
      if (p.z < -200) p.z = 200;
      if (p.z > 200) p.z = -200;

      const fov = 400;
      const scale = fov / (fov + p.z);
      const px = width / 2 + p.x * scale;
      const py = height / 2 + p.y * scale;

      if (px > 0 && px < width && py > 0 && py < height) {
        ctx.beginPath();
        ctx.arc(px, py, p.size * scale, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0.1, (scale - 0.5) * 0.8);
        ctx.fill();
      }
    }

    // Render 3D DNA Double Helix
    const centerY = height / 2;
    const centerX = width / 2;
    const totalHeight = numPairs * spacing;
    const startY = -totalHeight / 2;

    const nodesA = [];
    const nodesB = [];

    for (let i = 0; i < numPairs; i++) {
      const y = startY + i * spacing;
      const angle = i * 0.25 + rotation;

      // 3D coordinates of strand A
      let x1 = Math.cos(angle) * radius;
      let z1 = Math.sin(angle) * radius;
      let y1 = y;

      // Apply tilt
      let rx1 = x1 * Math.cos(tiltY) - z1 * Math.sin(tiltY);
      let rz1 = x1 * Math.sin(tiltY) + z1 * Math.cos(tiltY);
      let ry1 = y1 * Math.cos(tiltX) - rz1 * Math.sin(tiltX);
      rz1 = y1 * Math.sin(tiltX) + rz1 * Math.cos(tiltX);

      // Perspective projection
      const fov = 500;
      const scale1 = fov / (fov + rz1 + 300);
      const px1 = centerX + rx1 * scale1;
      const py1 = centerY + ry1 * scale1;

      // 3D coordinates of strand B (opposite phase)
      let x2 = Math.cos(angle + Math.PI) * radius;
      let z2 = Math.sin(angle + Math.PI) * radius;
      let y2 = y;

      let rx2 = x2 * Math.cos(tiltY) - z2 * Math.sin(tiltY);
      let rz2 = x2 * Math.sin(tiltY) + z2 * Math.cos(tiltY);
      let ry2 = y2 * Math.cos(tiltX) - rz2 * Math.sin(tiltX);
      rz2 = y2 * Math.sin(tiltX) + rz2 * Math.cos(tiltX);

      const scale2 = fov / (fov + rz2 + 300);
      const px2 = centerX + rx2 * scale2;
      const py2 = centerY + ry2 * scale2;

      // Draw base pair rung (hydrogen bonds)
      const avgZ = (rz1 + rz2) / 2;
      const alpha = Math.max(0.15, Math.min(1, (avgZ + 200) / 400));

      ctx.beginPath();
      ctx.moveTo(px1, py1);
      ctx.lineTo(px2, py2);
      ctx.strokeStyle = i % 2 === 0 ? `rgba(0, 242, 254, ${alpha * 0.4})` : `rgba(157, 78, 221, ${alpha * 0.4})`;
      ctx.lineWidth = 2 * ((scale1 + scale2) / 2);
      ctx.stroke();

      // Midpoint base pair indicator
      const midX = (px1 + px2) / 2;
      const midY = (py1 + py2) / 2;
      ctx.beginPath();
      ctx.arc(midX, midY, 2.5 * scale1, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.6})`;
      ctx.fill();

      nodesA.push({ x: px1, y: py1, z: rz1, scale: scale1 });
      nodesB.push({ x: px2, y: py2, z: rz2, scale: scale2 });
    }

    // Connect Strands Backbone
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#00f2fe';
    for (let i = 0; i < nodesA.length - 1; i++) {
      ctx.beginPath();
      ctx.moveTo(nodesA[i].x, nodesA[i].y);
      ctx.lineTo(nodesA[i+1].x, nodesA[i+1].y);
      ctx.globalAlpha = Math.max(0.2, (nodesA[i].z + 200) / 400);
      ctx.stroke();
    }

    ctx.strokeStyle = '#c084fc';
    for (let i = 0; i < nodesB.length - 1; i++) {
      ctx.beginPath();
      ctx.moveTo(nodesB[i].x, nodesB[i].y);
      ctx.lineTo(nodesB[i+1].x, nodesB[i+1].y);
      ctx.globalAlpha = Math.max(0.2, (nodesB[i].z + 200) / 400);
      ctx.stroke();
    }

    // Draw Strand Nodes (Phosphates)
    for (let i = 0; i < nodesA.length; i++) {
      ctx.globalAlpha = Math.max(0.3, (nodesA[i].z + 200) / 400);
      ctx.beginPath();
      ctx.arc(nodesA[i].x, nodesA[i].y, 5 * nodesA[i].scale, 0, Math.PI * 2);
      ctx.fillStyle = '#00f2fe';
      ctx.shadowColor = '#00f2fe';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    for (let i = 0; i < nodesB.length; i++) {
      ctx.globalAlpha = Math.max(0.3, (nodesB[i].z + 200) / 400);
      ctx.beginPath();
      ctx.arc(nodesB[i].x, nodesB[i].y, 5 * nodesB[i].scale, 0, Math.PI * 2);
      ctx.fillStyle = '#e879f9';
      ctx.shadowColor = '#e879f9';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(render);
  }

  render();
})();
