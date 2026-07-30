/* ============================================================
   LUXE ESTATES — Header JS
   Sticky, Mega Menu, Mobile Nav, Scroll Behavior
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  const header = document.getElementById('site-header');
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileOverlay = document.getElementById('mobile-overlay');
  const mobileClose = document.getElementById('mobile-nav-close');

  /* ── Sticky Header ──────────────────────────────────── */
  if (header) {
    let lastScroll = 0;

    window.addEventListener('scroll', LuxeUtils.throttle(() => {
      const scroll = window.scrollY;

      // Add scrolled class for glass effect
      if (scroll > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      lastScroll = scroll;
    }, 50), { passive: true });
  }

  /* ── Mobile Nav Toggle ──────────────────────────────── */
  function openMobileNav() {
    mobileNav && mobileNav.classList.add('open');
    mobileOverlay && mobileOverlay.classList.add('open');
    hamburger && hamburger.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    mobileNav && mobileNav.classList.remove('open');
    mobileOverlay && mobileOverlay.classList.remove('open');
    hamburger && hamburger.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger && hamburger.addEventListener('click', () => {
    mobileNav && mobileNav.classList.contains('open') ? closeMobileNav() : openMobileNav();
  });

  mobileOverlay && mobileOverlay.addEventListener('click', closeMobileNav);
  mobileClose   && mobileClose.addEventListener('click', closeMobileNav);

  // Close on nav link click
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  /* ── Active Nav Link ─────────────────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── Mega Menu Hover Delay ───────────────────────────── */
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    let openTimer, closeTimer;
    const menu = item.querySelector('.mega-menu, .dropdown');
    if (!menu) return;

    item.addEventListener('mouseenter', () => {
      clearTimeout(closeTimer);
      openTimer = setTimeout(() => {
        menu.style.opacity = '1';
        menu.style.visibility = 'visible';
        menu.style.transform = menu.classList.contains('mega-menu')
          ? 'translateY(0)'
          : 'translateX(-50%) translateY(0)';
        menu.style.pointerEvents = 'auto';
      }, 100);
    });

    item.addEventListener('mouseleave', () => {
      clearTimeout(openTimer);
      closeTimer = setTimeout(() => {
        menu.style.opacity = '0';
        menu.style.visibility = 'hidden';
        menu.style.pointerEvents = 'none';
      }, 200);
    });
  });

  /* ── Anchor Smooth Scroll ────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        LuxeUtils.scrollTo(target, 90);
      }
    });
  });

});
