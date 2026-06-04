/**
 * BSS Tracker v1.0 — UTM capture + Conversion tracking
 * Adaptado de PRODIGY utm-tracker.js + conversions.js
 *
 * Expone:
 *   window.BSSTracker.get()           → objeto UTM actual
 *   window.BSSTracker.getLabel()      → string legible "google › veneers-usa"
 *   window.BSSTracker.track(event, p) → envía evento a GA4 + Meta
 *   window.BSSTracker.trackFormOk()   → marca formulario como completado
 */
'use strict';

window.BSSTracker = (function () {

  /* ── CONFIG — reemplazar con IDs reales de BSS ─────────────────────
     GA4:  analytics.google.com → Admin → Data Streams → Measurement ID
     GADS: ads.google.com → Tools → Conversions → Conversion ID + Label
     META: business.facebook.com → Events Manager → Pixel ID
  ──────────────────────────────────────────────────────────────────── */
  var GA4_ID   = 'G-XXXXXXXXXX';           // ← reemplazar
  var GADS_ID  = 'AW-XXXXXXXXX';           // ← reemplazar (Google Ads conversion ID)
  var GADS_LEAD_LABEL = 'YYYYYYYYYYY';     // ← reemplazar (conversion label de Google Ads)

  /* ── UTM CAPTURE ──────────────────────────────────────────────────── */
  var LS_KEY   = 'bss_utm';
  var SESS_KEY = 'bss_utm_sess';

  function _capture() {
    var p = new URLSearchParams(window.location.search);
    var source   = p.get('utm_source')   || '';
    var medium   = p.get('utm_medium')   || '';
    var campaign = p.get('utm_campaign') || '';
    var content  = p.get('utm_content')  || '';
    var term     = p.get('utm_term')     || '';
    var gclid    = p.get('gclid')        || '';
    var fbclid   = p.get('fbclid')       || '';

    /* Auto-detectar fuente por clid cuando no viene utm_source */
    if (!source && gclid)  { source = 'google';   medium = medium || 'cpc'; }
    if (!source && fbclid) { source = 'facebook'; medium = medium || 'cpc'; }
    if (!source)           { source = 'direct'; }

    var data = {
      source:    source,
      medium:    medium,
      campaign:  campaign,
      content:   content,
      term:      term,
      gclid:     gclid,
      fbclid:    fbclid,
      referrer:  document.referrer || '',
      landing:   window.location.pathname,
      ts:        new Date().toISOString(),
      _start:    Date.now()
    };

    /* Persistir en localStorage si viene de anuncio, o si no hay datos previos */
    var hasAd = source !== 'direct' || gclid || fbclid;
    var existing = _load(LS_KEY);
    if (hasAd || !existing) {
      try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch(_) {}
    }
    /* Session siempre se actualiza */
    try { sessionStorage.setItem(SESS_KEY, JSON.stringify(data)); } catch(_) {}

    /* Exponer en dataLayer para GTM */
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'bss_utm_captured', bss_utm: data });

    return data;
  }

  function _load(key) {
    try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch(_) { return null; }
  }

  function get() {
    return _load(LS_KEY) || _load(SESS_KEY) || { source: 'direct', medium: '', campaign: '' };
  }

  function getLabel() {
    var d = get();
    return [d.source, d.campaign, d.term].filter(Boolean).join(' › ');
  }

  function getFuente() {
    var d = get();
    var s = d.source, m = d.medium;
    if (s === 'google'   && (m === 'cpc' || m === 'paid' || d.gclid)) return 'google_ads';
    if (s === 'facebook' || s === 'instagram')                         return 'meta_ads';
    if (s === 'tiktok')                                                return 'tiktok_ads';
    if (m === 'email')                                                 return 'email';
    if (m === 'social')                                                return 'organic_social';
    if (s !== 'direct')                                                return 'referral';
    return 'landing_b2c';
  }

  function getSecondsOnPage() {
    var d = get();
    return d._start ? Math.round((Date.now() - d._start) / 1000) : 0;
  }

  /* ── ENRIQUECER LINKS DE WHATSAPP CON UTM ─────────────────────────── */
  function _enrichWaLinks() {
    var utm = get();
    if (utm.source === 'direct') return;
    var label = '\n[Ref: ' + utm.source + (utm.campaign ? '/' + utm.campaign : '') + ']';
    document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp.com"]').forEach(function(a) {
      try {
        var url = new URL(a.href);
        var text = url.searchParams.get('text') || '';
        if (text && !text.includes('[Ref:')) {
          url.searchParams.set('text', decodeURIComponent(text) + label);
          a.href = url.toString();
        }
      } catch(_) {}
    });
  }

  /* ── FIRE EVENTOS ─────────────────────────────────────────────────── */
  function _gtag() {
    if (window.gtag) window.gtag.apply(window, arguments);
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(arguments);
  }

  function track(eventName, params) {
    var utm = get();
    var merged = Object.assign({
      event_category: 'engagement',
      utm_source:     utm.source,
      utm_campaign:   utm.campaign,
      page:           window.location.pathname
    }, params || {});

    /* GA4 */
    _gtag('event', eventName, merged);

    /* Meta Pixel custom event */
    if (window.fbq) window.fbq('trackCustom', eventName, params || {});

    /* Microsoft Clarity */
    if (window.clarity) window.clarity('set', eventName, JSON.stringify(params || {}));
  }

  /* ── CONVERSIONES ESPECÍFICAS ─────────────────────────────────────── */

  function trackWhatsApp(context) {
    var utm = get();
    track('whatsapp_click', { context: context || 'unknown', utm_source: utm.source });
    if (window.fbq) window.fbq('track', 'Contact', { content_name: 'WhatsApp ' + (context || '') });
    /* Google Ads conversion — cuando WA es la única forma de contacto */
    if (GADS_ID && !GADS_ID.includes('XXXXXXXXX')) {
      _gtag('event', 'conversion', { send_to: GADS_ID + '/WA_CLICK', value: 0, currency: 'USD' });
    }
  }

  function trackFormStart() {
    track('form_started', { form: 'consult' });
    if (window.fbq) window.fbq('track', 'InitiateCheckout');
  }

  function trackFormOk(treatment, pkg) {
    sessionStorage.setItem('bss_form_ok', '1');
    var leadValue = 200; /* $200 USD assessment fee */

    track('generate_lead', {
      event_category: 'conversion',
      value:          leadValue,
      currency:       'USD',
      treatment:      treatment || 'unknown',
      package:        pkg || 'none',
      utm_source:     get().source
    });

    if (window.fbq) {
      window.fbq('track', 'Lead', {
        value:        leadValue,
        currency:     'USD',
        content_name: treatment
      });
    }

    /* Google Ads conversion — LEAD principal */
    if (GADS_ID && !GADS_ID.includes('XXXXXXXXX') && GADS_LEAD_LABEL && !GADS_LEAD_LABEL.includes('YYY')) {
      _gtag('event', 'conversion', {
        send_to:        GADS_ID + '/' + GADS_LEAD_LABEL,
        value:          leadValue,
        currency:       'USD',
        transaction_id: Date.now().toString(36)
      });
    }
  }

  function trackCalculatorUsed(treatment, saving) {
    track('calculator_used', { treatment: treatment, saving_usd: saving });
  }

  function trackSectionViewed(sectionId) {
    track('section_viewed', { section: sectionId });
  }

  /* ── AUTO-TRACKING ────────────────────────────────────────────────── */

  /* WA link click — auto con evento captura delegada */
  document.addEventListener('click', function(e) {
    var a = e.target.closest('a');
    if (!a || !a.href) return;
    if (!a.href.includes('wa.me') && !a.href.includes('whatsapp.com')) return;
    var section = (a.closest('section') && a.closest('section').id) || 'unknown';
    trackWhatsApp(section);
  });

  /* Form start — primer campo tocado */
  var _formStarted = false;
  document.addEventListener('focusin', function(e) {
    if (_formStarted) return;
    var tag = e.target.tagName;
    if (tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') return;
    if (!e.target.closest('#consult-form')) return;
    _formStarted = true;
    trackFormStart();
  });

  /* Form abandoned — salió con el form iniciado pero sin completar */
  window.addEventListener('beforeunload', function() {
    if (!_formStarted) return;
    if (sessionStorage.getItem('bss_form_ok')) return;
    /* sendBeacon funciona al cerrar tab */
    track('form_abandoned', { form: 'consult', transport_type: 'beacon' });
  });

  /* Secciones clave — IntersectionObserver */
  var _tracked = {};
  if ('IntersectionObserver' in window) {
    ['pricing','packages','smile-styles','consult','itineraries'].forEach(function(id) {
      var el = document.getElementById(id);
      if (!el) return;
      new IntersectionObserver(function(entries) {
        if (entries[0].isIntersecting && !_tracked[id]) {
          _tracked[id] = true;
          trackSectionViewed(id);
        }
      }, { threshold: 0.25 }).observe(el);
    });
  }

  /* Calculadora */
  var calcSel = document.getElementById('calc-treatment');
  if (calcSel) {
    calcSel.addEventListener('change', function() {
      var parts = (this.value || '').split('|');
      if (parts.length === 3) {
        trackCalculatorUsed(
          this.options[this.selectedIndex].text,
          parseInt(parts[2], 10) - parseInt(parts[1], 10)
        );
      }
    });
  }

  /* ── INIT ─────────────────────────────────────────────────────────── */
  var _current = _capture();

  document.addEventListener('DOMContentLoaded', function() {
    _enrichWaLinks();
    /* Re-enriquecer si el DOM cambia (widgets dinámicos) */
    if (window.MutationObserver) {
      new MutationObserver(_enrichWaLinks).observe(document.body, { childList: true, subtree: true });
    }
    /* Pageview a Supabase analytics (best-effort) */
    track('pageview', { referrer: document.referrer || '' });
  });

  return {
    get:                 get,
    getLabel:            getLabel,
    getFuente:           getFuente,
    getSecondsOnPage:    getSecondsOnPage,
    track:               track,
    trackWhatsApp:       trackWhatsApp,
    trackFormStart:      trackFormStart,
    trackFormOk:         trackFormOk,
    trackCalculatorUsed: trackCalculatorUsed,
    trackSectionViewed:  trackSectionViewed
  };

})();
