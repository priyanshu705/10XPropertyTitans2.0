# Phase 2: Bug Tracker

| ID | Page | Component | Severity | Issue | Fix Applied | Status |
|---|---|---|---|---|---|---|
| BUG-001 | Global | Search Location | Medium | Autocomplete suggestions hardcoded to Mumbai/Delhi instead of target markets | Updated `js/search.js` to suggest Vapi, Silvassa, Daman localities | FIXED |
| BUG-002 | Wishlist/Details | Modals | Medium | Modals did not close on ESC key or clicking outside the overlay container | Attached `keydown` (Escape) and `click` (target === modal) event listeners to window | FIXED |
| BUG-003 | Property Cards | Compare Feature | High | Compare button silently stored to localStorage without user feedback | Attached `LuxeCards.showToast` to emit a "Added to Compare! Feature coming soon" success message | FIXED |
| BUG-004 | Global | Broken `href="#"` | High | Various social and footer links acted as dead anchors that reload page to top | Addressed during Phase 0 by injecting `preventDefault()` and toasts | FIXED |
| BUG-005 | Calculator | EMI Division | Low | `r === 0` division by zero risk in EMI math | `js/utils.js` successfully implements `if (r === 0)` fallback preventing Infinity/NaN | VERIFIED |
