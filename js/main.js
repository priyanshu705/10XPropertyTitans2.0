/* ============================================================
   10X PROPERTY TITANS — Main JS
   Loader, Cursor, Particles, Scroll Progress, Back to Top
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ── Page Loader ──────────────────────────────────────── */
  const loader = document.getElementById('page-loader');
  const loaderBar = document.querySelector('.loader-bar');

  if (loader && loaderBar) {
    let progress = 0;

    const interval = setInterval(() => {
      progress += Math.random() * 18;
      if (progress > 100) progress = 100;
      loaderBar.style.width = progress + '%';

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          loader.classList.add('hidden');
          document.body.classList.add('loaded');
          initPageAnimations();
        }, 400);
      }
    }, 80);

    window.addEventListener('load', () => {
      progress = 100;
      loaderBar.style.width = '100%';
    });
  } else {
    initPageAnimations();
  }

  /* ── Custom Cursor ────────────────────────────────────── */
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');

  if (dot && ring && window.innerWidth > 600) {
    let ringX = 0, ringY = 0;
    let dotX  = 0, dotY  = 0;
    let curX  = 0, curY  = 0;
    let raf;

    document.addEventListener('mousemove', e => {
      curX = e.clientX;
      curY = e.clientY;
      dot.style.left = curX + 'px';
      dot.style.top  = curY + 'px';
    });

    function animateCursor() {
      ringX = LuxeUtils.lerp(ringX, curX, 0.12);
      ringY = LuxeUtils.lerp(ringY, curY, 0.12);
      ring.style.left = ringX + 'px';
      ring.style.top  = ringY + 'px';
      raf = requestAnimationFrame(animateCursor);
    }

    raf = requestAnimationFrame(animateCursor);

    const hoverEls = document.querySelectorAll('a, button, [data-cursor="hover"], .property-card, .btn, input, textarea, select');
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', () => {
        dot.classList.add('hovered');
        ring.classList.add('hovered');
      });
      el.addEventListener('mouseleave', () => {
        dot.classList.remove('hovered');
        ring.classList.remove('hovered');
      });
    });
  }

  /* ── Scroll Progress Bar ──────────────────────────────── */
  const progressBar = document.getElementById('scroll-progress');

  if (progressBar) {
    const updateProgress = LuxeUtils.throttle(() => {
      const scrolled = window.scrollY;
      const total    = document.documentElement.scrollHeight - window.innerHeight;
      const pct      = total > 0 ? (scrolled / total) * 100 : 0;
      progressBar.style.width = pct + '%';
    }, 16);

    window.addEventListener('scroll', updateProgress, { passive: true });
  }

  /* ── Back to Top ──────────────────────────────────────── */
  const btt = document.getElementById('back-to-top');

  if (btt) {
    window.addEventListener('scroll', LuxeUtils.throttle(() => {
      if (window.scrollY > 600) btt.classList.add('visible');
      else                       btt.classList.remove('visible');
    }, 100), { passive: true });

    btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ── Particle Canvas ──────────────────────────────────── */
  const canvas = document.getElementById('particles-canvas');
  if (canvas) initParticles(canvas);

  /* ── Ripple Buttons ───────────────────────────────────── */
  document.querySelectorAll('.btn, .btn-gold, .btn-glass, .btn-outline').forEach(btn => {
    btn.addEventListener('click', e => LuxeUtils.addRipple(e, btn));
  });

  /* ── Mouse Spotlight ──────────────────────────────────── */
  const spotlight = document.getElementById('spotlight');
  if (spotlight) {
    document.addEventListener('mousemove', LuxeUtils.throttle(e => {
      spotlight.style.background = `radial-gradient(600px circle at ${e.clientX}px ${e.clientY}px,
        rgba(212,175,55,0.04), transparent 50%)`;
    }, 30));
  }

  /* ── Light Theme Toggle ───────────────────────────────── */
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    const saved = LuxeUtils.storage.get('luxe_theme', 'dark');
    if (saved === 'light') document.documentElement.setAttribute('data-theme', 'light');

    themeToggle.addEventListener('click', () => {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      document.documentElement.setAttribute('data-theme', isLight ? 'dark' : 'light');
      LuxeUtils.storage.set('luxe_theme', isLight ? 'dark' : 'light');
    });
  }

});

/* ── Particles Engine ─────────────────────────────────── */
function initParticles(canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  const count = 80;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener('resize', LuxeUtils.debounce(resize, 200));

  class Particle {
    constructor() { this.reset(); }

    reset() {
      this.x     = LuxeUtils.rand(0, canvas.width);
      this.y     = LuxeUtils.rand(canvas.height, canvas.height * 2);
      this.size  = LuxeUtils.rand(1, 3);
      this.speedY = LuxeUtils.rand(0.3, 1.2);
      this.speedX = LuxeUtils.rand(-0.3, 0.3);
      this.alpha = 0;
      this.maxAlpha = LuxeUtils.rand(0.2, 0.6);
      this.growing = true;
      this.life  = 0;
      this.maxLife = LuxeUtils.rand(150, 300);
      this.hue   = LuxeUtils.rand(42, 52);
    }

    update() {
      this.x += this.speedX;
      this.y -= this.speedY;
      this.life++;

      if (this.growing) {
        this.alpha += 0.02;
        if (this.alpha >= this.maxAlpha) this.growing = false;
      } else {
        if (this.life > this.maxLife * 0.7) this.alpha -= 0.01;
      }

      if (this.life >= this.maxLife || this.y < -20) this.reset();
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fillStyle = `hsl(${this.hue}, 70%, 65%)`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < count; i++) {
    const p = new Particle();
    p.y = LuxeUtils.rand(0, canvas.height); // Distribute initially
    particles.push(p);
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }

  animate();
}

/* ── Page Load Animations ─────────────────────────────── */
function initPageAnimations() {
  // Trigger hero animations
  const heroAnimEls = document.querySelectorAll('.hero-anim');
  heroAnimEls.forEach((el, i) => {
    setTimeout(() => el.classList.add('active'), i * 150 + 200);
  });
}

/* ── Light Beams ──────────────────────────────────────── */
function createLightBeams(container) {
  const colors = [
    'rgba(212,175,55,0.06)',
    'rgba(229,192,123,0.04)',
    'rgba(212,175,55,0.05)'
  ];

  for (let i = 0; i < 3; i++) {
    const beam = document.createElement('div');
    beam.style.cssText = `
      position: absolute;
      width: 2px;
      height: 80%;
      background: linear-gradient(to bottom, transparent, ${colors[i]}, transparent);
      top: 10%;
      left: ${20 + i * 30}%;
      transform: rotate(${-15 + i * 10}deg);
      animation: lightBeam ${6 + i * 2}s ease-in-out ${i * 2}s infinite;
      pointer-events: none;
      z-index: 2;
      filter: blur(2px);
    `;
    container.appendChild(beam);
  }
}

window.createLightBeams = createLightBeams;
