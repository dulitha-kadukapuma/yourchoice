/**
 * YourChoice – Anti-Gravity Floating Animation
 * Inspired by antigravity.google.com
 * Shapes float, rotate and gently drift in zero-gravity style.
 * Mouse proximity causes subtle repulsion.
 */

(function () {
  const SHAPE_COUNT = 18;
  const SHAPES = ['circle', 'triangle', 'square', 'diamond', 'hexagon'];
  const COLORS = [
    'rgba(255,255,255,0.12)',
    'rgba(255,255,255,0.08)',
    'rgba(200,180,255,0.15)',
    'rgba(255,122,24,0.10)',
    'rgba(108,99,255,0.13)',
    'rgba(255,255,255,0.06)',
  ];

  let mouse = { x: -9999, y: -9999 };
  const shapes = [];

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function createShape() {
    const type = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    const size = rand(24, 70);
    const el = document.createElement('div');
    el.className = 'fg-shape fg-' + type;

    const color = COLORS[Math.floor(Math.random() * COLORS.length)];

    if (type === 'circle') {
      el.style.cssText = `
        width:${size}px; height:${size}px;
        border-radius:50%;
        background:${color};
        border:1.5px solid rgba(255,255,255,0.18);
      `;
    } else if (type === 'square') {
      el.style.cssText = `
        width:${size}px; height:${size}px;
        border-radius:4px;
        background:${color};
        border:1.5px solid rgba(255,255,255,0.15);
      `;
    } else if (type === 'diamond') {
      const s = size * 0.8;
      el.style.cssText = `
        width:${s}px; height:${s}px;
        background:${color};
        border:1.5px solid rgba(255,255,255,0.15);
        transform:rotate(45deg);
      `;
    } else if (type === 'triangle') {
      const h = size * 0.86;
      el.style.cssText = `
        width:0; height:0;
        border-left:${size / 2}px solid transparent;
        border-right:${size / 2}px solid transparent;
        border-bottom:${h}px solid ${color};
        filter: drop-shadow(0 0 3px rgba(255,255,255,0.1));
      `;
    } else if (type === 'hexagon') {
      el.style.cssText = `
        width:${size}px; height:${size * 0.866}px;
        background:${color};
        border:1.5px solid rgba(255,255,255,0.12);
        clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
      `;
    }

    // Base styles
    el.style.position = 'fixed';
    el.style.pointerEvents = 'none';
    el.style.zIndex = '0';
    el.style.willChange = 'transform';

    document.body.appendChild(el);

    const obj = {
      el,
      x: rand(0, window.innerWidth),
      y: rand(0, window.innerHeight),
      vx: rand(-0.3, 0.3),
      vy: rand(-0.3, 0.3),
      rotation: rand(0, 360),
      rotationSpeed: rand(-0.3, 0.3),
      baseScale: rand(0.7, 1.2),
      scale: 1,
      floatAmplitude: rand(20, 50),
      floatSpeed: rand(0.003, 0.008),
      floatOffset: rand(0, Math.PI * 2),
      size,
    };

    return obj;
  }

  function init() {
    // Remove any existing shapes
    document.querySelectorAll('.fg-shape').forEach(el => el.remove());

    for (let i = 0; i < SHAPE_COUNT; i++) {
      shapes.push(createShape());
    }

    document.addEventListener('mousemove', e => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('resize', () => {
      shapes.forEach(s => {
        s.x = rand(0, window.innerWidth);
        s.y = rand(0, window.innerHeight);
      });
    });

    requestAnimationFrame(animate);
  }

  let tick = 0;
  function animate() {
    tick++;

    shapes.forEach(s => {
      // Gentle floating drift
      s.x += s.vx + Math.sin(tick * s.floatSpeed + s.floatOffset) * 0.4;
      s.y += s.vy + Math.cos(tick * s.floatSpeed + s.floatOffset * 1.3) * 0.3;
      s.rotation += s.rotationSpeed;

      // Wrap around screen
      const pad = 100;
      if (s.x > window.innerWidth + pad)  s.x = -pad;
      if (s.x < -pad)  s.x = window.innerWidth + pad;
      if (s.y > window.innerHeight + pad) s.y = -pad;
      if (s.y < -pad)  s.y = window.innerHeight + pad;

      // Mouse repulsion
      const dx = s.x - mouse.x;
      const dy = s.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const repelRadius = 120;
      let rx = 0, ry = 0;

      if (dist < repelRadius && dist > 0) {
        const force = (repelRadius - dist) / repelRadius;
        rx = (dx / dist) * force * 25;
        ry = (dy / dist) * force * 25;
      }

      const tx = s.x + rx;
      const ty = s.y + ry;
      const rot = s.rotation;
      const sc = s.baseScale;

      s.el.style.transform = `translate(${tx}px, ${ty}px) rotate(${rot}deg) scale(${sc})`;
      s.el.style.left = '0';
      s.el.style.top = '0';
    });

    requestAnimationFrame(animate);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
