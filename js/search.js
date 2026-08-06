/* ============================================================
   10X PROPERTY TITANS — Search & Filter JS
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ── Hero Search Tabs ────────────────────────────────── */
  const searchTabs = document.querySelectorAll('.search-tab');
  searchTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      searchTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });

  /* ── Location Autocomplete ───────────────────────────── */
  const locationInputs = document.querySelectorAll('[data-location-search]');
  const suggestions = [
    'Vapi East, Vapi', 'Vapi West, Vapi', 'Chala, Vapi', 'Gunjan, Vapi',
    'Silvassa City, Dadra & Nagar Haveli', 'Samarvarni, Silvassa', 'Tokarkhada, Silvassa',
    'Nani Daman, Daman', 'Moti Daman, Daman', 'Varkund, Daman',
    'Bhilad, Gujarat', 'Sarigam, Gujarat', 'Umbergaon, Gujarat',
    'Valsad City', 'Tithal, Valsad'
  ];

  locationInputs.forEach(input => {
    const wrap = input.closest('.input-wrap') || input.parentElement;
    let dropdown;

    function createDropdown() {
      dropdown = document.createElement('div');
      dropdown.style.cssText = `
        position: absolute;
        top: calc(100% + 8px);
        left: 0;
        right: 0;
        background: rgba(7,9,13,0.97);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 12px;
        overflow: hidden;
        z-index: 1000;
        max-height: 280px;
        overflow-y: auto;
        box-shadow: 0 20px 60px rgba(0,0,0,0.6);
        opacity: 0;
        transform: translateY(-8px);
        transition: all 0.2s ease;
      `;
      wrap.style.position = 'relative';
      wrap.appendChild(dropdown);

      requestAnimationFrame(() => {
        dropdown.style.opacity = '1';
        dropdown.style.transform = 'translateY(0)';
      });
    }

    function showSuggestions(query) {
      if (!dropdown) createDropdown();

      const filtered = suggestions.filter(s =>
        s.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8);

      if (!filtered.length) {
        dropdown.innerHTML = `
          <div style="padding:16px;color:rgba(156,163,175,1);font-size:0.875rem;text-align:center;">
            No locations found
          </div>`;
        return;
      }

      dropdown.innerHTML = filtered.map(s => `
        <div class="location-suggestion" style="
          padding:12px 16px;
          font-size:0.875rem;
          color:#E5E7EB;
          cursor:none;
          display:flex;
          align-items:center;
          gap:10px;
          transition:background 0.15s;
          border-bottom:1px solid rgba(255,255,255,0.04);
        " data-value="${s}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          ${s}
        </div>
      `).join('');

      dropdown.querySelectorAll('.location-suggestion').forEach(item => {
        item.addEventListener('mouseenter', () => {
          item.style.background = 'rgba(212,175,55,0.08)';
          item.style.color = '#E5C07B';
        });
        item.addEventListener('mouseleave', () => {
          item.style.background = '';
          item.style.color = '#E5E7EB';
        });
        item.addEventListener('click', () => {
          input.value = item.getAttribute('data-value');
          closeDropdown();
        });
      });
    }

    function closeDropdown() {
      if (dropdown) {
        dropdown.style.opacity = '0';
        dropdown.style.transform = 'translateY(-8px)';
        setTimeout(() => { dropdown && dropdown.remove(); dropdown = null; }, 200);
      }
    }

    input.addEventListener('input', LuxeUtils.debounce(() => {
      if (input.value.length >= 1) showSuggestions(input.value);
      else closeDropdown();
    }, 200));

    input.addEventListener('focus', () => {
      if (input.value.length >= 1) showSuggestions(input.value);
    });

    document.addEventListener('click', e => {
      if (!wrap.contains(e.target)) closeDropdown();
    });
  });

  /* ── Filter Pills ────────────────────────────────────── */
  document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const group = pill.getAttribute('data-group');
      if (group) {
        // Single select per group
        document.querySelectorAll(`.filter-pill[data-group="${group}"]`)
          .forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
      } else {
        pill.classList.toggle('active');
      }
    });
  });

  /* ── Property Grid Filter ────────────────────────────── */
  const filterBtns = document.querySelectorAll('[data-filter]');
  const propertyItems = document.querySelectorAll('[data-category]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      propertyItems.forEach(item => {
        const categories = item.getAttribute('data-category').split(',');
        const show = filter === 'all' || categories.includes(filter);

        if (show) {
          item.style.display = '';
          requestAnimationFrame(() => {
            item.style.opacity = '1';
            item.style.transform = '';
          });
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9)';
          setTimeout(() => {
            if (item.style.opacity === '0') item.style.display = 'none';
          }, 400);
        }
      });
    });
  });

  /* ── Search Form ─────────────────────────────────────── */
  const searchForms = document.querySelectorAll('[data-search-form]');
  searchForms.forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const formData = new FormData(form);
      const params   = new URLSearchParams();

      formData.forEach((value, key) => {
        if (value) params.set(key, value);
      });

      window.location.href = 'buy.html?' + params.toString();
    });
  });

  /* ── URL Param Filters ───────────────────────────────── */
  function readURLFilters() {
    const params = new URLSearchParams(window.location.search);
    params.forEach((value, key) => {
      const el = document.querySelector(`[name="${key}"]`);
      if (el) el.value = value;
    });
  }

  readURLFilters();

});
