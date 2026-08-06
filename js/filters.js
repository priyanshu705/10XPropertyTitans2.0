/**
 * 10X Property Titans - Property Filtering Logic
 * Handles client-side filtering for buy.html, rent.html, etc.
 */

document.addEventListener('DOMContentLoaded', () => {
  const propertiesGrid = document.getElementById('properties-grid');
  if (!propertiesGrid) return; // Not a page with properties grid

  const propertyCards = Array.from(propertiesGrid.querySelectorAll('.property-card'));
  const resultsCountEl = document.querySelector('.results-count strong');

  // Filter Elements
  const quickFilters = document.querySelectorAll('.filter-pill[data-filter]');
  const bhkFilters = document.querySelectorAll('.filter-pill[data-group="bhk"]');
  const locationInput = document.getElementById('filter-location');
  const budgetMin = document.getElementById('budget-min');
  const budgetMax = document.getElementById('budget-max');
  const areaMin = document.getElementById('area-min');
  const areaMax = document.getElementById('area-max');
  const sortSelect = document.getElementById('sort-properties');
  const clearFiltersBtn = document.getElementById('clear-filters');
  const applyFiltersBtn = document.getElementById('apply-filters');
  
  // Status Checkboxes
  const statusCheckboxes = {
    ready: document.getElementById('chk-ready'),
    construction: document.getElementById('chk-construction'),
    rera: document.getElementById('chk-rera'),
    verified: document.getElementById('chk-verified')
  };

  // Amenities Checkboxes
  const amenitiesCheckboxes = {
    pool: document.getElementById('chk-pool'),
    gym: document.getElementById('chk-gym'),
    parking: document.getElementById('chk-parking'),
    garden: document.getElementById('chk-garden'),
    security: document.getElementById('chk-security'),
    club: document.getElementById('chk-club')
  };

  // State
  let currentCategory = 'all';
  let activeBhk = [];

  // Parse price string (e.g., "₹8.5 Cr", "₹50 L") to a number
  const parsePrice = (priceStr) => {
    if (!priceStr) return 0;
    let numStr = priceStr.replace(/[^0-9.]/g, '');
    let val = parseFloat(numStr);
    if (priceStr.toLowerCase().includes('cr')) val *= 10000000;
    else if (priceStr.toLowerCase().includes('l') || priceStr.toLowerCase().includes('lac')) val *= 100000;
    return val;
  };

  // Parse area string (e.g., "4200 sq.ft") to a number
  const parseArea = (areaStr) => {
    if (!areaStr) return 0;
    return parseFloat(areaStr.replace(/[^0-9.]/g, ''));
  };

  // Extract specs from card
  const getCardSpecs = (card) => {
    const specs = Array.from(card.querySelectorAll('.card-spec')).map(s => s.textContent.toLowerCase());
    return specs;
  };

  const applyFilters = () => {
    let visibleCount = 0;

    const locVal = locationInput ? locationInput.value.toLowerCase() : '';
    const bMin = budgetMin && budgetMin.value ? parseFloat(budgetMin.value) : 0;
    const bMax = budgetMax && budgetMax.value ? parseFloat(budgetMax.value) : Infinity;
    const aMin = areaMin && areaMin.value ? parseFloat(areaMin.value) : 0;
    const aMax = areaMax && areaMax.value ? parseFloat(areaMax.value) : Infinity;

    propertyCards.forEach(card => {
      let isMatch = true;

      // Category filter
      const categories = (card.getAttribute('data-category') || '').toLowerCase();
      if (currentCategory !== 'all' && !categories.includes(currentCategory)) {
        isMatch = false;
      }

      // Location filter
      if (isMatch && locVal) {
        const locationText = (card.querySelector('.card-location')?.textContent || '').toLowerCase();
        const titleText = (card.querySelector('.card-title')?.textContent || '').toLowerCase();
        if (!locationText.includes(locVal) && !titleText.includes(locVal)) {
          isMatch = false;
        }
      }

      // Budget filter
      if (isMatch && (bMin > 0 || bMax < Infinity)) {
        const priceText = card.querySelector('.card-price')?.textContent || '';
        const priceVal = parsePrice(priceText);
        if (priceVal > 0 && (priceVal < bMin || priceVal > bMax)) {
          isMatch = false;
        }
      }

      const specs = getCardSpecs(card);
      const specsText = specs.join(' ');

      // BHK filter
      if (isMatch && activeBhk.length > 0) {
        const matchesBhk = activeBhk.some(bhk => specsText.includes(bhk));
        if (!matchesBhk) isMatch = false;
      }

      // Area filter
      if (isMatch && (aMin > 0 || aMax < Infinity)) {
        const areaSpec = specs.find(s => s.includes('sq.ft') || s.includes('sqft') || s.includes('sq ft'));
        if (areaSpec) {
          const areaVal = parseArea(areaSpec);
          if (areaVal > 0 && (areaVal < aMin || areaVal > aMax)) {
            isMatch = false;
          }
        }
      }

      // Status/Badges
      if (isMatch) {
        const badgesText = (card.querySelector('.card-badges')?.textContent || '').toLowerCase();
        if (statusCheckboxes.ready?.checked && !badgesText.includes('ready')) isMatch = false;
        if (statusCheckboxes.construction?.checked && !badgesText.includes('construction') && !badgesText.includes('under')) isMatch = false;
        if (statusCheckboxes.rera?.checked && !badgesText.includes('rera')) isMatch = false;
        if (statusCheckboxes.verified?.checked && (!badgesText.includes('verified') && !badgesText.includes('exclusive'))) isMatch = false;
      }

      // Apply visibility
      if (isMatch) {
        card.style.display = 'block';
        setTimeout(() => card.style.opacity = '1', 10);
        visibleCount++;
      } else {
        card.style.opacity = '0';
        setTimeout(() => card.style.display = 'none', 300); // transition duration
      }
    });

    if (resultsCountEl) {
      resultsCountEl.textContent = visibleCount.toLocaleString();
    }
    
    sortProperties();
  };

  const sortProperties = () => {
    if (!sortSelect) return;
    const sortVal = sortSelect.value.toLowerCase();
    
    // Sort logic requires re-appending items
    const visibleCards = propertyCards.filter(c => c.style.display !== 'none');
    
    if (sortVal.includes('low to high')) {
      visibleCards.sort((a, b) => parsePrice(a.querySelector('.card-price')?.textContent) - parsePrice(b.querySelector('.card-price')?.textContent));
    } else if (sortVal.includes('high to low')) {
      visibleCards.sort((a, b) => parsePrice(b.querySelector('.card-price')?.textContent) - parsePrice(a.querySelector('.card-price')?.textContent));
    }
    
    // Append in sorted order
    visibleCards.forEach(card => propertiesGrid.appendChild(card));
  };

  // Event Listeners
  quickFilters.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      quickFilters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-filter');
      applyFilters();
    });
  });

  bhkFilters.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      btn.classList.toggle('active');
      
      activeBhk = Array.from(bhkFilters)
        .filter(b => b.classList.contains('active'))
        .map(b => b.textContent.toLowerCase());
        
      applyFilters();
    });
  });

  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener('click', (e) => {
      e.preventDefault();
      applyFilters();
    });
  }

  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      if (locationInput) locationInput.value = '';
      if (budgetMin) budgetMin.value = '';
      if (budgetMax) budgetMax.value = '';
      if (areaMin) areaMin.value = '';
      if (areaMax) areaMax.value = '';
      if (sortSelect) sortSelect.selectedIndex = 0;
      
      Object.values(statusCheckboxes).forEach(chk => { if(chk) chk.checked = false; });
      Object.values(amenitiesCheckboxes).forEach(chk => { if(chk) chk.checked = false; });
      
      bhkFilters.forEach(b => b.classList.remove('active'));
      activeBhk = [];
      
      quickFilters.forEach(b => b.classList.remove('active'));
      const allFilter = Array.from(quickFilters).find(f => f.getAttribute('data-filter') === 'all');
      if (allFilter) allFilter.classList.add('active');
      currentCategory = 'all';
      
      applyFilters();
    });
  }
  
  if (sortSelect) {
    sortSelect.addEventListener('change', sortProperties);
  }

  // Pre-select category based on URL query param
  const urlParams = new URLSearchParams(window.location.search);
  const typeParam = urlParams.get('type');
  if (typeParam) {
    const targetFilter = Array.from(quickFilters).find(f => f.getAttribute('data-filter') === typeParam);
    if (targetFilter) {
      targetFilter.click();
    }
  }

  // Initial apply to set counts correctly
  applyFilters();
});
