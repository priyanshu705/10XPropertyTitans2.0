# 1. HTML Validation Report

| Metric | Status | Finding |
|---|---|---|
| Duplicate IDs | ⚠️ Verification Pending | Cannot run bulk DOM parser checks due to terminal execution limitations. |
| Missing `alt` | ✅ Verified | Detected across unoptimized Unsplash image tags. |
| Empty `alt` | ✅ Verified | 18 empty `alt=""` found; however, they correctly utilize `aria-hidden="true"` rendering them accessible. |
| Missing `aria-label` | ✅ Verified | Icon buttons (e.g., Hamburger, Wishlist SVG) correctly utilize `aria-label`. |
| Empty Buttons | ✅ Verified | No buttons are completely empty without ARIA labels or inner text. |
| Empty Headings | ⚠️ Verification Pending | Requires AST/DOM parsing. |
| Invalid Nesting | ⚠️ Verification Pending | Requires HTML linting CLI tool (blocked by ACL). |
| Missing `loading="lazy"`| ✅ Verified | Many `<img>` tags on listing pages (e.g., `projects.html`) lack lazy loading. |
| Missing width/height | ✅ Verified | Most `<img>` tags lack explicit width/height attributes, relying on CSS aspect-ratio. |
| Missing canonical | ✅ Verified | Hardcoded `index.html` lacks a `<link rel="canonical">` tag. |
| Missing meta description | ✅ Verified | Core pages (index, buy, rent) have robust descriptions. Unknown for edge pages. |
