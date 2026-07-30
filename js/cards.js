/* ============================================================
   LUXE ESTATES — 3D Cards JS
   Mouse Tilt, Glow, Magnetic Buttons
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ── 3D Card Tilt ────────────────────────────────────── */
  const tiltCards = document.querySelectorAll('[data-tilt]');

  tiltCards.forEach(card => {
    const strength    = parseFloat(card.getAttribute('data-tilt-strength') || '12');
    const glowEl      = card.querySelector('.card-glow');
    let   animFrame;

    card.style.transformStyle = 'preserve-3d';
    card.style.perspective    = '1000px';

    card.addEventListener('mousemove', e => {
      cancelAnimationFrame(animFrame);
      animFrame = requestAnimationFrame(() => {
        const rect   = card.getBoundingClientRect();
        const x      = e.clientX - rect.left;
        const y      = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = LuxeUtils.clamp(((y - centerY) / centerY) * -strength, -strength, strength);
        const rotateY = LuxeUtils.clamp(((x - centerX) / centerX) * strength, -strength, strength);

        card.style.transform = `
          perspective(1000px)
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
          translateZ(8px)
        `;

        // Mouse glow position
        if (glowEl) {
          const xPct = (x / rect.width)  * 100;
          const yPct = (y / rect.height) * 100;
          card.style.setProperty('--mouse-x', xPct + '%');
          card.style.setProperty('--mouse-y', yPct + '%');
        }

        // Dynamic shadow
        card.style.boxShadow = `
          ${-rotateY * 2}px ${rotateX * 2}px 40px rgba(0,0,0,0.5),
          0 0 30px rgba(212,175,55,${Math.abs(rotateY) / strength * 0.2})
        `;
      });
    });

    card.addEventListener('mouseleave', () => {
      cancelAnimationFrame(animFrame);
      card.style.transform   = '';
      card.style.boxShadow   = '';
      card.style.transition  = 'transform 0.5s cubic-bezier(0.23,1,0.32,1), box-shadow 0.5s ease';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });
  });

  /* ── Magnetic Buttons ────────────────────────────────── */
  const magneticEls = document.querySelectorAll('[data-magnetic]');

  magneticEls.forEach(el => {
    const strength = parseFloat(el.getAttribute('data-magnetic') || '0.4');

    el.addEventListener('mousemove', e => {
      const rect   = el.getBoundingClientRect();
      const x      = e.clientX - rect.left - rect.width  / 2;
      const y      = e.clientY - rect.top  - rect.height / 2;

      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform  = '';
      el.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
      setTimeout(() => { el.style.transition = ''; }, 500);
    });
  });

  /* ── Wishlist Toggle ─────────────────────────────────── */
  document.querySelectorAll('[data-wishlist]').forEach(btn => {
    const id = btn.getAttribute('data-wishlist');

    if (LuxeUtils.wishlist.has(id)) {
      btn.classList.add('fav-active');
    }

    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      const isNowFav = LuxeUtils.wishlist.toggle(id);
      btn.classList.toggle('fav-active', isNowFav);

      // Bounce animation
      btn.style.transform = 'scale(1.4)';
      setTimeout(() => { btn.style.transform = ''; }, 300);
    });
  });

  /* ── Compare Toggle ──────────────────────────────────── */
  document.querySelectorAll('[data-compare]').forEach(btn => {
    const id = btn.getAttribute('data-compare');

    if (LuxeUtils.compare.has(id)) btn.classList.add('active');

    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      const added = LuxeUtils.compare.toggle(id);
      btn.classList.toggle('active', added);

      if (!added && !LuxeUtils.compare.has(id)) {
        // Was removed
      } else if (!added) {
        showToast('Maximum 4 properties can be compared', 'warning');
      }
    });
  });

  /* ── Image Hover Zoom ────────────────────────────────── */
  document.querySelectorAll('.img-zoom').forEach(wrap => {
    const img = wrap.querySelector('img');
    if (!img) return;

    wrap.addEventListener('mouseenter', () => {
      img.style.transform = 'scale(1.08)';
      img.style.transition = 'transform 0.7s cubic-bezier(0.23,1,0.32,1)';
    });

    wrap.addEventListener('mouseleave', () => {
      img.style.transform = '';
    });
  });

  /* ── Toast Notification ──────────────────────────────── */
  function showToast(message, type = 'info') {
    const existing = document.querySelector('.luxe-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'luxe-toast';
    toast.style.cssText = `
      position: fixed;
      bottom: 100px;
      left: 50%;
      transform: translateX(-50%) translateY(20px);
      background: rgba(7,9,13,0.95);
      backdrop-filter: blur(20px);
      border: 1px solid ${type === 'warning' ? 'rgba(245,158,11,0.4)' : 'rgba(212,175,55,0.3)'};
      color: #fff;
      padding: 14px 28px;
      border-radius: 100px;
      font-family: var(--font-sans);
      font-size: 0.875rem;
      font-weight: 500;
      z-index: 9999;
      opacity: 0;
      transition: all 0.4s cubic-bezier(0.23,1,0.32,1);
      white-space: nowrap;
      box-shadow: 0 8px 32px rgba(0,0,0,0.5);
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(10px)';
      setTimeout(() => toast.remove(), 400);
    }, 3000);
  }

  window.LuxeCards = { showToast };

});
