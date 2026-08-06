/**
 * 10X Property Titans - CRM Form Integration
 * Handles validation, submission, and lead tracking metadata.
 */

class CRMFormIntegration {
  constructor() {
    this.apiUrl = 'https://myappzbackend.com/functions/v1/form-api';
    this.init();
  }

  init() {
    // Bind to all forms with data-crm-form attribute
    document.addEventListener('DOMContentLoaded', () => {
      const forms = document.querySelectorAll('form[data-crm-form-id]');
      forms.forEach(form => {
        form.addEventListener('submit', (e) => this.handleSubmit(e, form));
      });
    });
  }

  getUTMParams() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      utmSource: urlParams.get('utm_source') || '',
      utmMedium: urlParams.get('utm_medium') || '',
      utmCampaign: urlParams.get('utm_campaign') || '',
      utmContent: urlParams.get('utm_content') || '',
      utmTerm: urlParams.get('utm_term') || ''
    };
  }

  getTrackingData() {
    return {
      landingUrl: window.location.href,
      referrer: document.referrer || '',
      currentPage: window.location.pathname,
      pageTitle: document.title,
      timestamp: new Date().toISOString(),
      browser: navigator.userAgent,
      deviceType: /Mobile|Android|iP(ad|hone)/.test(navigator.userAgent) ? 'Mobile' : 'Desktop',
      ...this.getUTMParams()
    };
  }

  async handleSubmit(e, form) {
    e.preventDefault();
    
    // Basic HTML5 validation is handled by the browser if 'required' is present,
    // but we can double check
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formId = form.getAttribute('data-crm-form-id');
    const formName = form.getAttribute('data-crm-form-name') || 'Website Lead Form';
    const apiUrl = form.getAttribute('data-crm-api-url') || this.apiUrl;
    const subAccountId = form.getAttribute('data-crm-sub-account') || '';
    const apiKey = form.getAttribute('data-crm-api-key') || '';

    if (!formId) {
      console.error('CRM form missing data-crm-form-id');
      this.showToast('Form configuration is invalid. Please contact support.', 'error');
      return;
    }

    if (!subAccountId) {
      console.error('CRM form missing data-crm-sub-account');
      this.showToast('Form integration is not configured correctly. Please contact support.', 'error');
      return;
    }

    const inputs = form.querySelectorAll('input, select, textarea');
    const answers = {};

    inputs.forEach(el => {
      if (!el) return;
      if (el.disabled) return;

      const tag = (el.tagName || '').toLowerCase();
      if (tag === 'input') {
        const t = (el.type || '').toLowerCase();
        if (['submit', 'reset', 'button', 'image', 'file'].includes(t)) return;
      }

      const key = el.dataset.crmFieldName || el.getAttribute('name') || el.id;
      if (!key) return;

      let value;
      if (tag === 'select') {
        if (el.multiple) {
          const vals = Array.from(el.options).filter(o => o.selected).map(o => o.value);
          if (!vals.length) return;
          value = vals.join(',');
        } else {
          value = el.value;
        }
      } else if (tag === 'textarea') {
        value = el.value;
      } else {
        const t = (el.type || '').toLowerCase();
        if (t === 'checkbox') {
          if (!el.checked) return;
          value = el.value || 'on';
        } else if (t === 'radio') {
          if (!el.checked) return;
          value = el.value;
        } else {
          value = el.value;
        }
      }

      if (typeof value !== 'undefined') {
        answers[key] = value;
      }
    });

    if (!Object.keys(answers).length) {
      this.showToast('Please complete the form before submitting.', 'error');
      return;
    }

    const tracking = this.getTrackingData();
    const payload = {
      subAccountId,
      formId,
      answers,
      meta: tracking
    };

    if (formName) {
      payload.formName = formName;
    }

    const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
    const originalBtnText = submitBtn ? (submitBtn.tagName.toLowerCase() === 'input' ? submitBtn.value : submitBtn.innerText) : 'Submit';

    try {
      if (submitBtn) {
        submitBtn.disabled = true;
        if (submitBtn.tagName.toLowerCase() === 'input') {
          submitBtn.value = 'Submitting...';
        } else {
          submitBtn.innerText = 'Submitting...';
        }
      }

      const headers = {
        'Content-Type': 'application/json'
      };
      if (apiKey) {
        headers.apikey = apiKey;
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        // Success state
        this.showToast('✓ Message sent successfully! Our team will contact you shortly.', 'success');
        form.reset();
      } else {
        let errorText = 'Unable to read response body';
        const responseBody = await response.text().catch(() => '');
        try {
          const parsed = JSON.parse(responseBody || '{}');
          if (parsed.error) {
            errorText = parsed.error;
          } else if (responseBody) {
            errorText = responseBody;
          }
        } catch (ignore) {
          if (responseBody) errorText = responseBody;
        }
        throw new Error(`Server returned ${response.status}: ${errorText}`);
      }
    } catch (error) {
      console.error('CRM Submission Error:', error);
      // Error state
      this.showToast('✕ Something went wrong. Please try again later or contact us directly.', 'error');
    } finally {
      // Restore button
      if (submitBtn) {
        submitBtn.disabled = false;
        if (submitBtn.tagName.toLowerCase() === 'input') {
          submitBtn.value = originalBtnText;
        } else {
          submitBtn.innerText = originalBtnText;
        }
      }
    }
  }

  showToast(message, type = 'success') {
    // Try to use the existing LuxeCards toast if available
    if (window.LuxeCards && typeof window.LuxeCards.showToast === 'function') {
      window.LuxeCards.showToast(message);
    } else {
      // Fallback simple toast
      const toast = document.createElement('div');
      toast.style.position = 'fixed';
      toast.style.bottom = '20px';
      toast.style.right = '20px';
      toast.style.padding = '15px 25px';
      toast.style.background = type === 'success' ? '#2e7d32' : '#d32f2f';
      toast.style.color = '#fff';
      toast.style.borderRadius = '8px';
      toast.style.zIndex = '9999';
      toast.style.fontFamily = 'sans-serif';
      toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
      toast.innerText = message;
      
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s ease';
        setTimeout(() => toast.remove(), 500);
      }, 5000);
    }
  }
}

// Initialize on load
new CRMFormIntegration();
