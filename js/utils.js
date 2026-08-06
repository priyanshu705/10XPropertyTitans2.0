/* ============================================================
   10X PROPERTY TITANS — Utility Functions
   ============================================================ */

'use strict';

const LuxeUtils = (() => {

  /** Debounce a function */
  function debounce(fn, wait = 150) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), wait);
    };
  }

  /** Throttle a function */
  function throttle(fn, limit = 16) {
    let last = 0;
    return (...args) => {
      const now = Date.now();
      if (now - last >= limit) { last = now; fn(...args); }
    };
  }

  /** Clamp a number between min and max */
  function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }

  /** Linear interpolation */
  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  /** Map value from one range to another */
  function mapRange(val, in1, in2, out1, out2) {
    return out1 + ((val - in1) * (out2 - out1)) / (in2 - in1);
  }

  /** Format a number with commas */
  function formatNumber(n) {
    if (n >= 10000000) return (n / 10000000).toFixed(1) + ' Cr';
    if (n >= 100000)   return (n / 100000).toFixed(1) + ' L';
    if (n >= 1000)     return (n / 1000).toFixed(1) + 'K';
    return n.toString();
  }

  /** Format INR currency */
  function formatINR(amount) {
    if (amount >= 10000000) return '₹' + (amount / 10000000).toFixed(2) + ' Cr';
    if (amount >= 100000)   return '₹' + (amount / 100000).toFixed(2) + ' L';
    return '₹' + amount.toLocaleString('en-IN');
  }

  /** Get element's position relative to viewport */
  function getRect(el) {
    return el.getBoundingClientRect();
  }

  /** Check if element is in viewport */
  function isInViewport(el, offset = 0) {
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight - offset && rect.bottom > 0;
  }

  /** Smooth scroll to element */
  function scrollTo(target, offset = 80) {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  /** Add ripple effect to button */
  function addRipple(e, btn) {
    const existing = btn.querySelector('.btn-ripple');
    if (existing) existing.remove();

    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const ripple = document.createElement('span');
    ripple.classList.add('btn-ripple');
    ripple.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      position: absolute;
      border-radius: 50%;
      pointer-events: none;
    `;

    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  }

  /** Generate a random float between min and max */
  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  /** LocalStorage helpers */
  const storage = {
    get(key, fallback = null) {
      try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
      catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); }
      catch {}
    },
    remove(key) {
      try { localStorage.removeItem(key); }
      catch {}
    }
  };

  /** Wishlist helpers */
  const wishlist = {
    get()        { return storage.get('luxe_wishlist', []); },
    add(id)      { const l = this.get(); if (!l.includes(id)) { l.push(id); storage.set('luxe_wishlist', l); } },
    remove(id)   { storage.set('luxe_wishlist', this.get().filter(x => x !== id)); },
    toggle(id)   { this.has(id) ? this.remove(id) : this.add(id); return this.has(id); },
    has(id)      { return this.get().includes(id); }
  };

  /** Compare helpers */
  const compare = {
    get()       { return storage.get('luxe_compare', []); },
    add(id)     { const l = this.get(); if (l.length < 4 && !l.includes(id)) { l.push(id); storage.set('luxe_compare', l); return true; } return false; },
    remove(id)  { storage.set('luxe_compare', this.get().filter(x => x !== id)); },
    toggle(id)  { if (this.has(id)) { this.remove(id); return false; } return this.add(id); },
    has(id)     { return this.get().includes(id); }
  };

  /** EMI Calculator */
  function calcEMI(principal, annualRate, tenureMonths) {
    const r = annualRate / 12 / 100;
    if (r === 0) return principal / tenureMonths;
    return (principal * r * Math.pow(1 + r, tenureMonths)) / (Math.pow(1 + r, tenureMonths) - 1);
  }

  return {
    debounce, throttle, clamp, lerp, mapRange,
    formatNumber, formatINR, getRect, isInViewport,
    scrollTo, addRipple, rand, storage, wishlist, compare, calcEMI
  };
})();

window.LuxeUtils = LuxeUtils;
