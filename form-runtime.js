(function(){
  'use strict';

  /* A second identical <script src> tag (multiple forms on a page) just re-scans. */
  if (window.__suFormRuntime) { try { window.__suFormRuntime.scan(); } catch (e) {} return; }

  var STYLE_ID = 'su-form-runtime-styles';
  var CSS = [
    /* Card + all colors are driven by --su-* variables baked on each container
       (computed from the form's builder theme, with auto dark/light contrast).
       The fallbacks keep the old light look for any embed without the vars. */
    '.su-form{box-sizing:border-box;background-color:var(--su-card-bg,transparent);background-image:var(--su-card-bg-img,none);color:var(--su-text,#111827);font-size:var(--su-form-font-size,14px);border-radius:var(--su-card-radius,0);box-shadow:var(--su-card-shadow,none);border:var(--su-card-border-w,0) solid var(--su-card-border,transparent);padding:var(--su-card-pad,0)}',
    '.su-form *{box-sizing:border-box}',
    '.su-form .su-field{margin-bottom:var(--su-field-gap,16px)}',
    '.su-form .su-label{display:block;font-size:var(--su-label-font-size,14px);font-weight:var(--su-label-font-weight,500);font-family:var(--su-label-font-family,inherit);margin-bottom:6px;color:var(--su-label,#374151)}',
    '.su-form .su-req{color:var(--su-req,#ef4444)}',
    '.su-form .su-input,.su-form .su-textarea,.su-form .su-select{width:100%;padding:9px 12px;border:1.5px solid var(--su-input-border,#d1d5db);border-radius:var(--su-input-radius,6px);font-size:var(--su-input-font-size,14px);font-family:var(--su-input-font-family,inherit);outline:none;background:var(--su-input-bg,#fff);color:var(--su-input-text,#111827);transition:border-color .15s,box-shadow .15s}',
    '.su-form .su-input::placeholder,.su-form .su-textarea::placeholder{color:var(--su-placeholder,#9ca3af);opacity:1}',
    '.su-form .su-input:focus,.su-form .su-textarea:focus,.su-form .su-select:focus{border-color:var(--su-focus,var(--su-primary,#6366f1));box-shadow:0 0 0 3px var(--su-primary-weak,rgba(99,102,241,.15))}',
    '.su-form .su-textarea{resize:vertical;min-height:100px}',
    '.su-form .su-select option{background:var(--su-opt-bg,#fff);color:var(--su-opt-text,#111827)}',
    '.su-form .iti{width:100%}',
    '.su-form .su-input.su-invalid{border-color:#ef4444}',
    '.su-form .su-input.su-invalid:focus{border-color:#ef4444;box-shadow:0 0 0 3px rgba(239,68,68,.2)}',
    '.su-form .su-btn{display:block;width:100%;padding:var(--su-btn-pad,11px 24px);background-color:var(--su-btn-bg,var(--su-primary,#6366f1));background-image:var(--su-btn-bg-img,none);color:var(--su-btn-text,#fff);border:none;border-radius:var(--su-btn-radius,6px);font-size:var(--su-btn-font-size,14px);font-weight:var(--su-btn-font-weight,600);font-family:inherit;cursor:pointer;transition:opacity .15s,transform .1s;letter-spacing:.01em}',
    '.su-form .su-btn:hover:not(:disabled){opacity:.88}',
    '.su-form .su-btn:active:not(:disabled){transform:scale(.98)}',
    '.su-form .su-btn:disabled{opacity:.55;cursor:not-allowed}',
    '.su-form .su-err{font-size:11px;color:var(--su-err,#ef4444);margin-top:3px;min-height:14px}',
    '.su-form .su-opts{display:flex;flex-direction:column;gap:7px}',
    '.su-form .su-opt-row{display:flex;align-items:center;gap:8px;font-size:14px;cursor:pointer;user-select:none;color:var(--su-text,inherit)}',
    '.su-form .su-opt-row input{accent-color:var(--su-primary,#6366f1);width:15px;height:15px;cursor:pointer;flex-shrink:0}',
    '.su-form .su-stars{display:flex;gap:6px;flex-wrap:wrap}',
    '.su-form .su-star-btn{font-size:22px;background:none;border:none;cursor:pointer;padding:0;line-height:1;color:var(--su-desc,#9ca3af);transition:transform .1s}',
    '.su-form .su-star-btn:hover{transform:scale(1.15)}',
    '.su-form .su-divider{border:none;border-top:1px solid var(--su-divider,#e5e7eb);margin:8px 0}',
    '.su-form .su-heading{font-size:20px;font-weight:700;color:var(--su-heading,#111827);margin:0 0 4px}',
    '.su-form .su-para{font-size:14px;color:var(--su-desc,#6b7280);margin:0 0 4px;line-height:1.6}',
    '.su-form .su-success{text-align:center;padding:40px 20px}',
    '.su-form .su-success-icon{font-size:48px;margin-bottom:12px}',
    '.su-form .su-success-text{font-size:16px;font-weight:600;color:#16a34a}',
    '.su-form .su-banner{padding:10px 14px;border-radius:6px;font-size:13px;margin-bottom:12px}',
    '.su-form .su-banner-err{background:#fef2f2;border:1px solid #fca5a5;color:#b91c1c}',
    /* intl-tel-input theming — the phone widget (input + country dropdown) matches
       the form theme instead of the library's default white. Dropdown uses the
       solid CARD bg (the input bg may be transparent, which would show through). */
    '.su-form .iti__dropdown-content,.su-form .iti__country-list{background:var(--su-card-bg,#fff);color:var(--su-text,#111827);border:1px solid var(--su-input-border,#d1d5db)}',
    '.su-form .iti__search-input{background:var(--su-card-bg,#fff);color:var(--su-text,#111827);border-color:var(--su-input-border,#d1d5db)}',
    '.su-form .iti__country.iti__highlight,.su-form .iti__country:hover{background:rgba(128,128,128,.18)}',
    '.su-form .iti__selected-country,.su-form .iti__selected-dial-code,.su-form .iti__dial-code{color:var(--su-input-text,#111827)}'
  ].join('\n');

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }

  /* ────────────────────────────────────────────────────────────────
     Initialise ONE form container. Everything below is closure-scoped
     to this container, so multiple forms on a page never share state. ── */
  function initForm(root) {
    // Double-init guard MUST be an in-memory expando, NOT a DOM attribute: the
    // visual editor serialises the live iframe body on save, so an attribute like
    // data-su-initialized would be baked into the stored HTML and then make the
    // runtime skip this container on the next load (form renders blank / "gone").
    // An element property is never serialised, so a reopened page re-renders.
    if (!root || root.__suFormInit) return;

    var cfgEl = root.querySelector('script.su-form-config');
    if (!cfgEl) return;
    var cfg;
    try { cfg = JSON.parse(cfgEl.textContent || cfgEl.innerHTML || '{}'); }
    catch (e) { return; }

    var mount = root.querySelector('.su-form-mount');
    if (!mount) return;

    root.__suFormInit = true;

    var FORM_ID     = cfg.formId || '';
    var SUB_ACCOUNT = cfg.subAccountId || '';
    var API_URL     = cfg.apiUrl || '';
    var API_KEY     = cfg.pk || cfg.apiKey || '';   /* Supabase publishable key (public); neutral "pk" field, "apiKey" kept as fallback */
    var TRACK_URL   = API_URL.replace(/form-api\/?$/, 'form-track');
    var SUCCESS_MSG = cfg.successMsg || 'Thank you for your submission!';
    var REDIRECT_URL = cfg.redirectUrl || '';
    var FUNNEL_ID   = cfg.funnelId || '';
    var PAGE_ID     = cfg.pageId || '';
    var SCHEMA      = (cfg.schema && cfg.schema.elements) ? cfg.schema : { elements: [] };

    /* Scope element lookups to THIS container (attribute match tolerates any id
       characters and never reaches into a sibling form's identical ids). */
    function byId(id) { return root.querySelector('[id="' + id + '"]'); }

    var SESSION_ID = (function(){
      try {
        var k = 'su_form_sid_' + FORM_ID;
        var v = sessionStorage.getItem(k);
        if (!v) {
          v = 'sess_' + Date.now() + '_' + Math.random().toString(36).slice(2);
          sessionStorage.setItem(k, v);
        }
        return v;
      } catch (e) {
        return 'sess_' + Date.now();
      }
    })();

    function trackFormEvent(eventType) {
      try {
        var dedupeKey = 'su_tr_' + FORM_ID + '_' + eventType;
        try {
          if (sessionStorage.getItem(dedupeKey)) return;
          sessionStorage.setItem(dedupeKey, '1');
        } catch (e) {}
        var meta = buildAttributionMeta();
        fetch(TRACK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'apikey': API_KEY },
          body: JSON.stringify({
            formId: FORM_ID,
            eventType: eventType,
            sessionId: SESSION_ID,
            meta: meta
          })
        }).catch(function(){});
      } catch (e) {}
    }

    var startTracked = false;
    function trackStartOnce() {
      if (startTracked) return;
      startTracked = true;
      trackFormEvent('form_start');
    }

    /* ────────────────────────────────────────────────────────────────
       LIVE RECONCILE — GET the current schema and re-render if it changed.
       This is what makes the embed a live REFERENCE, not a frozen copy.
       On ANY failure the baked snapshot stays — the form never breaks.  ── */
    function refreshSchema() {
      try {
        var attrMeta = buildAttributionMeta();
        var sep = API_URL.indexOf('?') >= 0 ? '&' : '?';
        var u = API_URL + sep + 'formId=' + encodeURIComponent(FORM_ID)
          + '&subAccountId=' + encodeURIComponent(SUB_ACCOUNT)
          + '&sessionId=' + encodeURIComponent(SESSION_ID);
        if (attrMeta.pageId) u += '&pageId=' + encodeURIComponent(attrMeta.pageId);
        if (attrMeta.funnelId) u += '&funnelId=' + encodeURIComponent(attrMeta.funnelId);
        if (attrMeta.utm_source) u += '&utm_source=' + encodeURIComponent(attrMeta.utm_source);
        if (attrMeta.utm_medium) u += '&utm_medium=' + encodeURIComponent(attrMeta.utm_medium);
        if (attrMeta.utm_campaign) u += '&utm_campaign=' + encodeURIComponent(attrMeta.utm_campaign);
        fetch(u, { method: 'GET', headers: { 'apikey': API_KEY } })
          .then(function(r){ return r.ok ? r.json() : null; })
          .then(function(res){
            if (!res || !res.success || !res.schema || !res.schema.elements) return;
            if (JSON.stringify(res.schema.elements) === JSON.stringify(SCHEMA.elements)) return;
            SCHEMA.elements = res.schema.elements;
            if (res.settings) {
              if (res.settings.successMessage) SUCCESS_MSG = res.settings.successMessage;
              REDIRECT_URL = res.settings.onSubmitAction === 'redirect'
                ? (res.settings.redirectUrl || '') : '';
            }
            renderForm();
          })
          .catch(function(){});
      } catch (e) {}
    }

    /* ── Render the form from the current schema ── */
    function renderForm() {
      var els = SCHEMA.elements;
      var hasBtn = els.some(function(e){ return e.type === 'button'; });
      var inner = els.map(renderField).join('');
      if (!hasBtn) {
        inner += '\x3cdiv class="su-field">\x3cbutton class="su-btn" type="submit">Submit\x3c/button>\x3c/div>';
      }
      mount.innerHTML = '\x3cform novalidate>' + inner + '\x3c/form>';
      attachSubmitHandler();
    }

    function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/\x3c/g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

    function label(el) {
      if (!el.label) return '';
      return '\x3clabel class="su-label" for="su-f-'+el.id+'">'
        + esc(el.label)
        + (el.required ? ' \x3cspan class="su-req">*\x3c/span>' : '')
        + '\x3c/label>';
    }

    function errDiv(id){ return '\x3cdiv class="su-err" id="su-e-'+id+'">\x3c/div>'; }

    function wrap(el, inner) {
      return '\x3cdiv class="su-field" id="su-wrap-'+el.id+'">'+inner+'\x3c/div>';
    }

    function optionTags(list) {
      return (list||[]).map(function(o){
        var v = esc(o.value||o.label||o); var l = esc(o.label||o);
        return '\x3coption value="'+v+'">'+l+'\x3c/option>';
      }).join('');
    }

    function renderField(el) {
      if (el.hidden) return '';
      var t = el.type;
      var ph = esc(el.placeholder || '');
      var req = el.required ? ' required' : '';
      var qk = esc(el.queryKey);

      if (t === 'singleLine' || t === 'firstName' || t === 'lastName' || t === 'fullName'
          || t === 'address' || t === 'city' || t === 'state' || t === 'country'
          || t === 'postalCode' || t === 'source') {
        return wrap(el, label(el)
          + '\x3cinput class="su-input" id="su-f-'+el.id+'" name="'+qk+'" type="text" placeholder="'+ph+'"'+req+lengthAttrs(el)+' />'
          + errDiv(el.id));
      }

      if (t === 'email') {
        return wrap(el, label(el)
          + '\x3cinput class="su-input" id="su-f-'+el.id+'" name="'+qk+'" type="email" placeholder="'+ph+'"'+req+lengthAttrs(el)+' />'
          + errDiv(el.id));
      }

      if (t === 'phone') {
        return wrap(el, label(el)
          + '\x3cinput class="su-input su-phone-input" id="su-f-'+el.id+'" name="'+qk+'" type="tel" placeholder="'+ph+'"'+req+' />'
          + errDiv(el.id));
      }

      if (t === 'dob') {
        return wrap(el, label(el)
          + '\x3cinput class="su-input" id="su-f-'+el.id+'" name="'+qk+'" type="date"'+req+' />'
          + errDiv(el.id));
      }

      if (t === 'multiLine') {
        return wrap(el, label(el)
          + '\x3ctextarea class="su-textarea" id="su-f-'+el.id+'" name="'+qk+'" placeholder="'+ph+'"'+req+lengthAttrs(el)+'>\x3c/textarea>'
          + errDiv(el.id));
      }

      if (t === 'singleDropdown') {
        var sopts = '\x3coption value="">Select...\x3c/option>' + optionTags(el.options);
        return wrap(el, label(el)
          + '\x3cselect class="su-select" id="su-f-'+el.id+'" name="'+qk+'"'+req+'>'+sopts+'\x3c/select>'
          + errDiv(el.id));
      }

      if (t === 'multiDropdown') {
        return wrap(el, label(el)
          + '\x3cselect class="su-select" id="su-f-'+el.id+'" name="'+qk+'" multiple style="min-height:90px"'+req+'>'+optionTags(el.options)+'\x3c/select>'
          + errDiv(el.id));
      }

      if (t === 'checkbox') {
        var citems = (el.options||[]).map(function(o){
          var v = esc(o.value||o.label||o); var l = esc(o.label||o);
          return '\x3clabel class="su-opt-row">\x3cinput type="checkbox" name="'+qk+'[]" value="'+v+'" /> '+l+'\x3c/label>';
        }).join('');
        return wrap(el, label(el) + '\x3cdiv class="su-opts">'+citems+'\x3c/div>' + errDiv(el.id));
      }

      if (t === 'radio') {
        var ritems = (el.options||[]).map(function(o){
          var v = esc(o.value||o.label||o); var l = esc(o.label||o);
          return '\x3clabel class="su-opt-row">\x3cinput type="radio" name="'+qk+'" value="'+v+'"'+req+' /> '+l+'\x3c/label>';
        }).join('');
        return wrap(el, label(el) + '\x3cdiv class="su-opts">'+ritems+'\x3c/div>' + errDiv(el.id));
      }

      if (t === 'rating') {
        var maxS = el.maxRating || 5;
        var stars = '';
        for (var sv = 1; sv !== maxS + 1; sv++) {
          stars += '\x3cbutton type="button" class="su-star-btn" data-val="'+sv+'" data-qk="'+qk+'">&#9733;\x3c/button>';
        }
        return wrap(el, label(el)
          + '\x3cdiv class="su-stars" id="su-stars-'+el.id+'">'+stars+'\x3c/div>'
          + '\x3cinput type="hidden" id="su-f-'+el.id+'" name="'+qk+'" value="" />'
          + errDiv(el.id));
      }

      if (t === 'button') {
        return '\x3cdiv class="su-field">'
          + '\x3cbutton class="su-btn" type="submit">'+esc(el.label||'Submit')+'\x3c/button>'
          + '\x3c/div>';
      }

      if (t === 'heading') {
        return '\x3cdiv class="su-field">\x3cp class="su-heading">'+esc(el.content||el.label||'')+'\x3c/p>\x3c/div>';
      }
      if (t === 'paragraph' || t === 'staticText') {
        return '\x3cdiv class="su-field">\x3cp class="su-para">'+esc(el.content||el.label||'')+'\x3c/p>\x3c/div>';
      }
      if (t === 'htmlBlock') {
        return '\x3cdiv class="su-field">'+(el.content||'')+'\x3c/div>';
      }
      if (t === 'divider') {
        return '\x3chr class="su-divider" />';
      }

      if (t === 'custom_field') {
        var cft = el.customFieldType || 'single_line';
        var cfOpts = el.customFieldOptions || el.options || [];
        if (cft === 'multi_line') {
          return wrap(el, label(el)
            + '\x3ctextarea class="su-textarea" id="su-f-'+el.id+'" name="'+qk+'" placeholder="'+ph+'"'+req+lengthAttrs(el)+'>\x3c/textarea>'
            + errDiv(el.id));
        }
        if (cft === 'dropdown_single') {
          var cfSopts = '\x3coption value="">'+esc(el.placeholder||'Select...')+'\x3c/option>' + optionTags(cfOpts);
          return wrap(el, label(el)
            + '\x3cselect class="su-select" id="su-f-'+el.id+'" name="'+qk+'"'+req+'>'+cfSopts+'\x3c/select>'
            + errDiv(el.id));
        }
        if (cft === 'dropdown_multiple') {
          return wrap(el, label(el)
            + '\x3cselect class="su-select" id="su-f-'+el.id+'" name="'+qk+'" multiple style="min-height:90px"'+req+'>'+optionTags(cfOpts)+'\x3c/select>'
            + errDiv(el.id));
        }
        if (cft === 'checkbox') {
          var cfCitems = (cfOpts||[]).map(function(o){
            var v = esc(o.value||o.label||o); var l = esc(o.label||o);
            return '\x3clabel class="su-opt-row">\x3cinput type="checkbox" name="'+qk+'[]" value="'+v+'" /> '+l+'\x3c/label>';
          }).join('');
          return wrap(el, label(el) + '\x3cdiv class="su-opts">'+cfCitems+'\x3c/div>' + errDiv(el.id));
        }
        if (cft === 'radio') {
          var cfRitems = (cfOpts||[]).map(function(o){
            var v = esc(o.value||o.label||o); var l = esc(o.label||o);
            return '\x3clabel class="su-opt-row">\x3cinput type="radio" name="'+qk+'" value="'+v+'"'+req+' /> '+l+'\x3c/label>';
          }).join('');
          return wrap(el, label(el) + '\x3cdiv class="su-opts">'+cfRitems+'\x3c/div>' + errDiv(el.id));
        }
        if (cft === 'phone') {
          return wrap(el, label(el)
            + '\x3cinput class="su-input su-phone-input" id="su-f-'+el.id+'" name="'+qk+'" type="tel" placeholder="'+ph+'"'+req+' />'
            + errDiv(el.id));
        }
        if (cft === 'date') {
          return wrap(el, label(el)
            + '\x3cinput class="su-input" id="su-f-'+el.id+'" name="'+qk+'" type="date"'+req+' />'
            + errDiv(el.id));
        }
        if (cft === 'number' || cft === 'monetary') {
          return wrap(el, label(el)
            + '\x3cinput class="su-input" id="su-f-'+el.id+'" name="'+qk+'" type="number" placeholder="'+ph+'"'+req+lengthAttrs(el)+' />'
            + errDiv(el.id));
        }
        return wrap(el, label(el)
          + '\x3cinput class="su-input" id="su-f-'+el.id+'" name="'+qk+'" type="text" placeholder="'+ph+'"'+req+lengthAttrs(el)+' />'
          + errDiv(el.id));
      }

      return '';
    }

    function wireStars() {
      var btns = mount.querySelectorAll('.su-star-btn');
      var i = 0;
      while (i !== btns.length) { btns[i].addEventListener('click', onStarClick); i = i + 1; }
    }

    function onStarClick(e) {
      var btn = e.currentTarget;
      var val = parseInt(btn.getAttribute('data-val'), 10);
      var qk  = btn.getAttribute('data-qk');
      var hidden = mount.querySelector('[name="'+qk+'"]');
      if (hidden) hidden.value = String(val);
      var group = btn.parentElement;
      var all = group ? group.querySelectorAll('.su-star-btn') : [];
      var j = 0;
      while (j !== all.length) {
        var starVal = parseInt(all[j].getAttribute('data-val'), 10);
        all[j].style.color = starVal > val ? '#9ca3af' : '#eab308';
        j = j + 1;
      }
    }

    var itiTries = 0;
    function initPhones() {
      var inputs = mount.querySelectorAll('.su-phone-input');
      if (!inputs.length) return;
      if (typeof window.intlTelInput !== 'function') {
        if (itiTries > 80) return;
        itiTries = itiTries + 1;
        setTimeout(initPhones, 50);
        return;
      }
      var i = 0;
      while (i !== inputs.length) {
        var input = inputs[i]; i = i + 1;
        if (input.getAttribute('data-iti') === '1') continue;
        input.setAttribute('data-iti', '1');
        try {
          input.itiInstance = window.intlTelInput(input, {
            initialCountry: 'auto',
            separateDialCode: true,
            strictMode: true,
            geoIpLookup: function(cb) {
              /* get.geojs.io sends Access-Control-Allow-Origin:* (works on
                 localhost AND production), is free and needs no API key. Any
                 failure falls back to India so the field never blocks. */
              fetch('https://get.geojs.io/v1/ip/country.json').then(function(r){ return r.json(); })
                .then(function(d){ cb(d && d.country ? d.country : 'in'); })
                .catch(function(){ cb('in'); });
            }
          });
          input.addEventListener('blur', onPhoneBlur);
          input.addEventListener('input', onPhoneInput);
          input.addEventListener('countrychange', onPhoneCountryChange);
        } catch (e) {}
      }
    }

    function phoneElId(input) {
      return input.id.indexOf('su-f-') === 0 ? input.id.slice(5) : input.id;
    }

    function phoneErrorMessage(iti, label) {
      var name = label || 'Phone number';
      var code = -1;
      try { code = iti.getValidationError(); } catch (e) {}
      if (code === 2) return name + ' is too short for the selected country';
      if (code === 3) return name + ' is too long for the selected country';
      if (code === 5) return name + ' has an invalid length for the selected country';
      if (code === 1) return name + ' has an invalid country code';
      return 'Please enter a valid phone number for the selected country';
    }

    function isPhoneValid(input) {
      var iti = input.itiInstance;
      if (!iti) return true;
      try {
        if (typeof iti.isValidNumberPrecise === 'function') return !!iti.isValidNumberPrecise();
        return !!iti.isValidNumber();
      } catch (e) { return false; }
    }

    function setPhoneInvalid(input, on) {
      if (!input.classList) return;
      if (on) input.classList.add('su-invalid'); else input.classList.remove('su-invalid');
    }

    function validateOnePhone(input) {
      var errEl = byId('su-e-' + phoneElId(input));
      var raw = String(input.value || '').trim();
      if (!raw) { if (errEl) errEl.textContent = ''; setPhoneInvalid(input, false); return true; }
      if (isPhoneValid(input)) { if (errEl) errEl.textContent = ''; setPhoneInvalid(input, false); return true; }
      setPhoneInvalid(input, true);
      if (errEl) {
        var sEl = SCHEMA.elements.find(function(x){ return x.id === phoneElId(input); });
        errEl.textContent = phoneErrorMessage(input.itiInstance, sEl ? sEl.label : '');
      }
      return false;
    }

    function onPhoneBlur(e) {
      e.target.setAttribute('data-touched', '1');
      validateOnePhone(e.target);
    }
    function onPhoneInput(e) {
      var input = e.target;
      if (input.getAttribute('data-touched') === '1') {
        validateOnePhone(input);
      } else {
        var errEl = byId('su-e-' + phoneElId(input));
        if (errEl) errEl.textContent = '';
        setPhoneInvalid(input, false);
      }
    }
    function onPhoneCountryChange(e) {
      e.target.setAttribute('data-touched', '1');
      validateOnePhone(e.target);
    }

    function collectAnswers(form) {
      var answers = {};
      var fields = form.elements;
      var i = 0;
      while (i !== fields.length) {
        var f = fields[i]; i = i + 1;
        if (!f.name || f.disabled) continue;

        if (f.type === 'tel') {
          var iti = f.itiInstance;
          if (iti) {
            var num = '';
            try { num = iti.getNumber(); } catch (e) {}
            if (!num) {
              var cd = '';
              try { cd = iti.getSelectedCountryData().dialCode; } catch (e2) {}
              num = (cd ? ('+' + cd) : '') + String(f.value || '').replace(/\D/g, '');
            }
            if (num) answers[f.name] = num;
          } else if (f.value) {
            answers[f.name] = f.value;
          }
          continue;
        }

        if (f.type === 'checkbox') {
          var key = f.name.replace(/\[\]$/, '');
          if (f.checked) {
            if (!answers[key]) answers[key] = [];
            answers[key].push(f.value);
          }
          continue;
        }

        if (f.type === 'radio') {
          if (f.checked) answers[f.name] = f.value;
          continue;
        }

        if (f.type === 'select-multiple') {
          var mvals = [];
          var o = 0;
          while (o !== f.options.length) {
            if (f.options[o].selected) mvals.push(f.options[o].value);
            o = o + 1;
          }
          if (mvals.length) answers[f.name] = mvals;
          continue;
        }

        if (f.value !== '' && f.value !== undefined) answers[f.name] = f.value;
      }
      return answers;
    }

    var PERSON_NAME_TYPES = { fullName: 1, firstName: 1, lastName: 1 };

    function hasUnicodeLetter(str) {
      try {
        return /\p{L}/u.test(str);
      } catch (e) {
        return /[A-Za-z]/.test(str);
      }
    }

    function isNumericOnlyNameValue(str) {
      if (!str) return false;
      if (hasUnicodeLetter(str)) return false;
      return /\d/.test(str);
    }

    function resolveLengthLimit(v) {
      if (v == null || v === '') return null;
      var n = typeof v === 'number' ? v : Number(v);
      return (isFinite(n) && n >= 0) ? Math.floor(n) : null;
    }

    function lengthAttrs(el) {
      var out = '';
      var minLen = resolveLengthLimit(el.minLength);
      var maxLen = resolveLengthLimit(el.maxLength);
      if (minLen != null && minLen > 0) out += ' minlength="' + minLen + '"';
      if (maxLen != null && maxLen > 0) out += ' maxlength="' + maxLen + '"';
      return out;
    }

    function isPersonNameField(el) {
      if (PERSON_NAME_TYPES[el.type]) return true;
      if (el.type !== 'singleLine') return false;
      var label = String(el.label || '').trim().replace(/\s+/g, ' ');
      return /^(full name|first name|last name|name)$/i.test(label);
    }

    function escapeRegexCharClassNegation(chars) {
      var out = '';
      var seen = {};
      for (var i = 0; i < chars.length; i++) {
        var ch = chars.charAt(i);
        if (seen[ch]) continue;
        seen[ch] = true;
        if (ch === '\\' || ch === ']' || ch === '^' || ch === '-') out += '\\' + ch;
        else out += ch;
      }
      return out;
    }

    function isRegexBlocklist(pattern) {
      var trimmed = String(pattern || '').trim();
      if (!trimmed || trimmed.length < 2) return false;
      if (trimmed.charAt(0) === '^' || trimmed.charAt(trimmed.length - 1) === '$') return false;
      if (trimmed.indexOf('|') !== -1) return false;
      if (/\\[dwsDWSbBnrtfv0-9]/.test(trimmed)) return false;
      if (/\[[^\]]*A-Za-z[^\]]*\]/.test(trimmed)) return false;
      if (/\(\?[:=!<]/.test(trimmed)) return false;
      return true;
    }

    function resolveRegexPattern(pattern) {
      var trimmed = String(pattern || '').trim();
      if (!trimmed) return '';
      if (!isRegexBlocklist(trimmed)) return trimmed;
      return '^[^' + escapeRegexCharClassNegation(trimmed) + ']+$';
    }

    function compileRegex(pattern) {
      var resolved = resolveRegexPattern(pattern);
      if (!resolved) return null;
      try {
        if (resolved.charAt(0) === '^' || resolved.charAt(resolved.length - 1) === '$') {
          return new RegExp(resolved);
        }
        return new RegExp('^(?:' + resolved + ')$');
      } catch (e) {
        return null;
      }
    }

    function fieldError(el, msg) {
      var errEl = byId('su-e-' + el.id);
      if (errEl) errEl.textContent = msg;
      var w = byId('su-wrap-' + el.id);
      if (w) w.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function validate(answers) {
      var ok = true;
      SCHEMA.elements.forEach(function(el) {
        var errEl = byId('su-e-' + el.id);
        if (errEl) errEl.textContent = '';
        if (el.hidden || el.type === 'button') return;

        if (el.type === 'phone') {
          var pin = byId('su-f-' + el.id);
          if (pin) { pin.setAttribute('data-touched', '1'); setPhoneInvalid(pin, false); }
          var rawPhone = pin ? String(pin.value || '').trim() : '';
          if (!rawPhone) {
            if (el.required) {
              if (pin) setPhoneInvalid(pin, true);
              if (ok) fieldError(el, (el.label || 'Phone number') + ' is required');
              ok = false;
            }
            return;
          }
          if (pin && !isPhoneValid(pin)) {
            setPhoneInvalid(pin, true);
            if (ok) fieldError(el, phoneErrorMessage(pin.itiInstance, el.label));
            ok = false;
          }
          return;
        }

        var val = answers[el.queryKey];
        var str = (val === undefined || val === null) ? '' : String(val);
        var trimmed = str.trim();

        if (el.required) {
          var empty = !trimmed || (Array.isArray(val) && val.length === 0);
          if (empty) {
            if (ok) fieldError(el, (el.label || 'This field') + ' is required');
            ok = false;
            return;
          }
        }

        if (!trimmed) return;

        var minLen = resolveLengthLimit(el.minLength);
        var maxLen = resolveLengthLimit(el.maxLength);

        if (minLen != null && trimmed.length < minLen) {
          if (ok) fieldError(el, (el.label || 'This field') + ' must be at least ' + minLen + ' characters');
          ok = false;
          return;
        }

        if (maxLen != null && trimmed.length > maxLen) {
          if (ok) fieldError(el, (el.label || 'This field') + ' must be at most ' + maxLen + ' characters');
          ok = false;
          return;
        }

        if (isPersonNameField(el) && trimmed && !(el.regex && String(el.regex).trim())) {
          if (!hasUnicodeLetter(trimmed)) {
            if (ok) {
              fieldError(
                el,
                (el.label || 'This field') + (isNumericOnlyNameValue(trimmed)
                  ? ' must include letters, not numbers only'
                  : ' must include at least one letter'),
              );
            }
            ok = false;
            return;
          }
        }

        if (el.regex) {
          var re = compileRegex(el.regex);
          if (!re) {
            if (ok) fieldError(el, (el.label || 'This field') + ' has an invalid validation pattern. Contact the form owner.');
            ok = false;
            return;
          }
          if (!re.test(trimmed)) {
            if (ok) fieldError(el, (el.label || 'This field') + ' format is invalid');
            ok = false;
          }
        }
      });
      return ok;
    }

    function showSuccessMessage(msg) {
      mount.innerHTML = '\x3cdiv class="su-success">\x3cdiv class="su-success-icon">&#10003;\x3c/div>'
        + '\x3cp class="su-success-text">' + esc(msg || SUCCESS_MSG) + '\x3c/p>\x3c/div>';
    }

    function handleSuccess(result) {
      if (result.redirect) {
        if (result.redirect_new_tab) {
          // "Open in new tab": keep the success message visible on this page
          // and open the destination in a new tab instead of navigating away.
          window.open(result.redirect, '_blank', 'noopener');
          showSuccessMessage(result.message);
        } else if (result.redirect_target === 'self') {
          window.location.href = result.redirect;
        } else {
          window.top.location.href = result.redirect;
        }
      } else {
        showSuccessMessage(result.message);
      }
    }

    function showBanner(msg) {
      var existing = root.querySelector('.su-banner');
      if (existing) existing.remove();
      var div = document.createElement('div');
      div.className = 'su-banner su-banner-err';
      div.textContent = msg;
      var form = mount.querySelector('form');
      if (form) form.insertBefore(div, form.firstChild);
    }

    /* ── Submit ── */
    function buildAttributionMeta() {
      var meta = {
        referrer: document.referrer || null,
        landingPage: location.href || null,
        deviceType: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
        browser: navigator.userAgent || null
      };
      var keys = ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','fbclid','gclid'];
      var sp = new URLSearchParams(location.search);
      var i, k, v, parsed, st, ft;
      for (i = 0; i !== keys.length; i = i + 1) {
        k = keys[i];
        v = sp.get(k) || sp.get('parent_' + k);
        if (v) meta[k] = v;
      }
      if (!meta.utm_source) {
        try {
          st = sessionStorage.getItem('myappz_utm_last');
          if (st) {
            parsed = JSON.parse(st);
            for (i = 0; i !== keys.length; i = i + 1) {
              k = keys[i];
              if (!meta[k] && parsed[k]) meta[k] = parsed[k];
            }
          }
        } catch (e) {}
      }
      if (!meta.utm_source) {
        try {
          ft = localStorage.getItem('myappz_utm_first');
          if (ft) {
            parsed = JSON.parse(ft);
            for (i = 0; i !== keys.length; i = i + 1) {
              k = keys[i];
              if (!meta[k] && parsed[k]) meta[k] = parsed[k];
            }
          }
        } catch (e) {}
      }
      try {
        v = sp.get('parent_visitor_id') || localStorage.getItem('_ut_vid');
        if (v) meta.visitor_id = v;
        v = sp.get('parent_session_id') || sessionStorage.getItem('_ut_sid');
        if (v) meta.session_id = v;
      } catch (e) {}
      v = sp.get('source_url');
      if (v) {
        meta.landingPage = v;
        meta.landing_url = v;
      }
      v = sp.get('parent_funnel_id');
      if (v) meta.funnelId = v;
      v = sp.get('parent_page_id');
      if (v) meta.pageId = v;
      if (FUNNEL_ID) meta.funnelId = FUNNEL_ID;
      if (PAGE_ID) meta.pageId = PAGE_ID;
      if (root) {
        v = root.getAttribute('data-su-funnel-id');
        if (v) meta.funnelId = v;
        v = root.getAttribute('data-su-page-id');
        if (v) meta.pageId = v;
      }
      return meta;
    }

    function attachSubmitHandler() {
      wireStars();
      initPhones();
      var form = mount.querySelector('form');
      if (!form) return;
      form.addEventListener('focusin', trackStartOnce);
      form.addEventListener('click', trackStartOnce);
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        var prev = root.querySelector('.su-banner');
        if (prev) prev.remove();

        var answers = collectAnswers(form);
        if (!validate(answers)) return;

        var btn = form.querySelector('button[type="submit"]');
        if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

        var attrMeta = buildAttributionMeta();
        fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'apikey': API_KEY },
          body: JSON.stringify({
            subAccountId: SUB_ACCOUNT,
            formId: FORM_ID,
            answers: answers,
            meta: attrMeta,
            visitor_id: attrMeta.visitor_id || null,
            session_id: SESSION_ID
          })
        })
        .then(function(r){ return r.json(); })
        .then(function(result) {
          if (result.success) {
            handleSuccess(result);
          } else {
            if (btn) { btn.disabled = false; btn.textContent = 'Submit'; }
            showBanner(result.error || 'Submission failed. Please try again.');
          }
        })
        .catch(function() {
          if (btn) { btn.disabled = false; btn.textContent = 'Submit'; }
          showBanner('Network error. Please check your connection and try again.');
        });
      });
    }

    /* ── boot this instance ── */
    renderForm();
    trackFormEvent('form_view');
    refreshSchema();
  }

  function scan() {
    var nodes = document.querySelectorAll('[data-su-form="true"]');
    var i = 0;
    while (i !== nodes.length) { try { initForm(nodes[i]); } catch (e) {} i = i + 1; }
  }

  function boot() {
    injectStyles();
    scan();
    /* Re-scan for forms added after load (SPA navigations / builder canvas). */
    try {
      var t;
      var obs = new MutationObserver(function(){ clearTimeout(t); t = setTimeout(scan, 150); });
      var target = document.body || document.documentElement;
      if (target) obs.observe(target, { childList: true, subtree: true });
    } catch (e) {}
  }

  window.__suFormRuntime = { scan: scan, init: initForm };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

