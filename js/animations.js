/* ============================================================
   10X PROPERTY TITANS — Animations JS
   Scroll Reveal, Counters, Parallax
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ── Intersection Observer – Scroll Reveals ─────────── */
  const revealClasses = [
    '.reveal', '.reveal-left', '.reveal-right',
    '.reveal-scale', '.reveal-blur', '.stagger-children'
  ];

  const revealEls = document.querySelectorAll(revealClasses.join(','));

  if (revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => observer.observe(el));
  }

  /* ── Animated Counters ───────────────────────────────── */
  const counters = document.querySelectorAll('[data-counter]');

  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => counterObserver.observe(el));
  }

  function animateCounter(el) {
    const target   = parseFloat(el.getAttribute('data-counter'));
    const duration = parseInt(el.getAttribute('data-duration') || '2000');
    const decimals = parseInt(el.getAttribute('data-decimals') || '0');
    const suffix   = el.getAttribute('data-suffix') || '';
    const prefix   = el.getAttribute('data-prefix') || '';

    const start     = 0;
    const startTime = performance.now();

    function ease(t) {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }

    function update(now) {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value    = start + (target - start) * ease(progress);

      el.textContent = prefix + value.toFixed(decimals) + suffix;

      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = prefix + target.toFixed(decimals) + suffix;
    }

    requestAnimationFrame(update);
  }

  /* ── Parallax Layers ─────────────────────────────────── */
  const parallaxEls = document.querySelectorAll('[data-parallax]');

  if (parallaxEls.length) {
    window.addEventListener('scroll', LuxeUtils.throttle(() => {
      const scrollY = window.scrollY;
      parallaxEls.forEach(el => {
        const speed  = parseFloat(el.getAttribute('data-parallax') || '0.3');
        const offset = scrollY * speed;
        el.style.transform = `translateY(${offset}px)`;
      });
    }, 16), { passive: true });
  }

  /* ── Hero Parallax (Mouse) ───────────────────────────── */
  const heroSection = document.querySelector('.hero-section');
  if (heroSection) {
    document.addEventListener('mousemove', LuxeUtils.throttle(e => {
      const { innerWidth: W, innerHeight: H } = window;
      const xRatio = (e.clientX / W - 0.5);
      const yRatio = (e.clientY / H - 0.5);

      const parallaxBg = heroSection.querySelector('.hero-video-wrap');
      if (parallaxBg) {
        parallaxBg.style.transform = `translate(${xRatio * -15}px, ${yRatio * -10}px) scale(1.05)`;
      }

      const heroContent = heroSection.querySelector('.hero-content');
      if (heroContent) {
        heroContent.style.transform = `translate(${xRatio * 8}px, ${yRatio * 5}px)`;
      }
    }, 20));
  }

  /* ── Progress Bars ───────────────────────────────────── */
  const progressBars = document.querySelectorAll('[data-progress]');

  if (progressBars.length) {
    const barObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const pct = bar.getAttribute('data-progress');
          setTimeout(() => {
            bar.style.width = pct + '%';
          }, 200);
          barObserver.unobserve(bar);
        }
      });
    }, { threshold: 0.5 });

    progressBars.forEach(el => barObserver.observe(el));
  }

  /* ── Scroll-Based Opacity (for sections) ──────────────── */
  const fadeOnScrollEls = document.querySelectorAll('[data-fade-scroll]');

  if (fadeOnScrollEls.length) {
    window.addEventListener('scroll', LuxeUtils.throttle(() => {
      fadeOnScrollEls.forEach(el => {
        const rect = el.getBoundingClientRect();
        const viewH = window.innerHeight;
        const ratio = LuxeUtils.clamp((viewH - rect.top) / viewH, 0, 1);
        el.style.opacity = ratio;
        el.style.transform = `translateY(${(1 - ratio) * 30}px)`;
      });
    }, 16), { passive: true });
  }

  /* ── Typewriter Effect ────────────────────────────────── */
  const typewriterEls = document.querySelectorAll('[data-typewriter]');

  typewriterEls.forEach(el => {
    const words    = el.getAttribute('data-typewriter').split('|');
    const speed    = parseInt(el.getAttribute('data-tw-speed') || '100');
    const pause    = parseInt(el.getAttribute('data-tw-pause') || '2000');
    let   wordIdx  = 0;
    let   charIdx  = 0;
    let   deleting = false;

    function type() {
      const word    = words[wordIdx];
      const current = deleting ? word.slice(0, charIdx--) : word.slice(0, ++charIdx);
      el.textContent = current;

      if (!deleting && charIdx === word.length) {
        setTimeout(() => { deleting = true; type(); }, pause);
        return;
      }

      if (deleting && charIdx === 0) {
        deleting = false;
        wordIdx  = (wordIdx + 1) % words.length;
      }

      setTimeout(type, deleting ? speed / 2 : speed);
    }

    type();
  });

});
