/**
 * BSS i18n v2.0 — Motor de traducción con variantes nativas por país
 *
 * Idiomas soportados:
 *   en-US / en-CA  → American / Canadian English (direct, value-driven)
 *   en-GB          → British English (formal, NHS-aware)
 *   en-AU          → Australian English (casual, Medicare-aware)
 *   es             → Español colombiano/latino
 *
 * Uso: BSSi18n.init() en cada página
 * Los elementos con data-i18n="key" reciben el texto del idioma activo.
 */
'use strict';

window.BSSi18n = (function() {

  /* ── TRADUCCIONES ─────────────────────────────────────────────── */
  var T = {

    /* ── HERO PRINCIPAL (index.html usa lang-en/lang-es directo) ── */

    /* ── CTAs GLOBALES ─────────────────────────────────────────── */
    'cta.start': {
      'en-US': 'Start My Case — Free',
      'en-CA': 'Start My Case — Free',
      'en-GB': 'Start Your Free Assessment',
      'en-AU': 'Get My Free Assessment',
      'es':    'Empezar mi caso — Gratis'
    },
    'cta.quote': {
      'en-US': 'Get My Free Quote',
      'en-CA': 'Get My Free Quote',
      'en-GB': 'Request a Free Quote',
      'en-AU': 'Get a Free Quote',
      'es':    'Pedir cotización gratis'
    },
    'cta.home': {
      'en-US': '← Back to Home',
      'en-CA': '← Back to Home',
      'en-GB': '← Back to Home',
      'en-AU': '← Back to Home',
      'es':    '← Volver al inicio'
    },

    /* ── VENEERS ────────────────────────────────────────────────── */
    'veneers.eyebrow': {
      'en-US': '✨ Porcelain Veneers · Bogotá, Colombia',
      'en-CA': '✨ Porcelain Veneers · Bogotá, Colombia',
      'en-GB': '✨ Porcelain Veneers · Bogotá, Colombia',
      'en-AU': '✨ Porcelain Veneers · Bogotá, Colombia',
      'es':    '✨ Carillas de Porcelana · Bogotá, Colombia'
    },
    'veneers.h1': {
      'en-US': 'Porcelain Veneers in Bogotá<br><em>From $450 USD. Done in Days.*</em>',
      'en-CA': 'Porcelain Veneers in Bogotá<br><em>From $450 USD. Done in Days.*</em>',
      'en-GB': 'Porcelain Veneers in Bogotá<br><em>From $450 USD. Private dentist prices, without the wait.*</em>',
      'en-AU': 'Porcelain Veneers in Bogotá<br><em>From $450 USD. Done in Days — Not Months.*</em>',
      'es':    'Carillas en Bogotá<br><em>Desde $450 USD. Listas en días.*</em>'
    },
    'veneers.sub': {
      'en-US': 'Same Ivoclar e.max as Beverly Hills — <strong>save 70% vs US prices.</strong> Hollywood Smile or natural design. One coordinator handles your specialist, hotel and every transfer.',
      'en-CA': 'Same Ivoclar e.max used at top Canadian dental clinics — <strong>save 70% vs Canadian prices.</strong> Hollywood Smile or natural design. Your coordinator manages everything.',
      'en-GB': 'Same Ivoclar e.max used at top Harley Street practices — <strong>save up to 70% vs UK private fees.</strong> No NHS waiting lists. Hollywood Smile or natural design. One coordinator manages everything from London to Bogotá.',
      'en-AU': 'Same Ivoclar e.max used at top Australian dental practices — <strong>save up to 70% vs Australian prices.</strong> Medicare doesn\'t cover cosmetic dentistry. Bogotá does it better, for less. One coordinator handles the lot.',
      'es':    'El mismo Ivoclar e.max que Beverly Hills — <strong>ahorra 70% vs precios en EEUU.</strong> Sonrisa Hollywood o diseño natural. Un coordinador maneja todo, desde el especialista hasta el hotel.'
    },

    /* ── ALL-ON-4 ───────────────────────────────────────────────── */
    'allon4.eyebrow': {
      'en-US': '🔩 All-on-4 & All-on-6 Implants · Bogotá',
      'en-CA': '🔩 All-on-4 & All-on-6 Implants · Bogotá',
      'en-GB': '🔩 Full Arch Implants · All-on-4 & All-on-6 · Bogotá',
      'en-AU': '🔩 All-on-4 & All-on-6 Implants · Bogotá',
      'es':    '🔩 All-on-4 · All-on-6 · Bogotá, Colombia'
    },
    'allon4.h1': {
      'en-US': 'All-on-4 in Bogotá<br><em>From $8,500 USD. Save $15,000+.*</em>',
      'en-CA': 'All-on-4 in Bogotá<br><em>From $8,500 USD. Save $15,000+.*</em>',
      'en-GB': 'Full Arch Implants in Bogotá<br><em>From $8,500 USD. Half the cost of UK private treatment.*</em>',
      'en-AU': 'All-on-4 in Bogotá<br><em>From $8,500 USD. Save $15,000+ vs Australian prices.*</em>',
      'es':    'All-on-4 en Bogotá<br><em>Desde $8,500 USD. Ahorra $15,000+.*</em>'
    },
    'allon4.sub': {
      'en-US': 'Fixed teeth in days. <strong>Straumann or Neodent implants + CAD/CAM zirconia arch.</strong> Same technology as leading US implant centers — one coordinator handles your specialist, hotel and every transfer.',
      'en-CA': 'Fixed teeth in days. <strong>Straumann or Neodent implants + CAD/CAM zirconia arch.</strong> Same technology as leading Canadian implant centres — your coordinator handles everything.',
      'en-GB': 'Fixed teeth in days — not the 12–18 month wait you\'d face on the NHS. <strong>Straumann or Neodent implants + CAD/CAM zirconia arch.</strong> Same technology as top UK private implant clinics. Your coordinator manages everything from the UK to Bogotá.',
      'en-AU': 'Fixed teeth in days. <strong>Straumann or Neodent implants + CAD/CAM zirconia prosthesis.</strong> Same technology as top Australian implant specialists. One coordinator sorts your specialist, accommodation and all transfers.',
      'es':    'Dientes fijos en días. <strong>Implantes Straumann o Neodent + arco de zirconia CAD/CAM.</strong> Misma tecnología que los mejores centros de implantes en EEUU. Un coordinador maneja todo.'
    },

    /* ── DENTAL IMPLANTS ─────────────────────────────────────────── */
    'implants.eyebrow': {
      'en-US': '🔩 Dental Implants · Bogotá, Colombia',
      'en-CA': '🔩 Dental Implants · Bogotá, Colombia',
      'en-GB': '🔩 Dental Implants · Bogotá, Colombia',
      'en-AU': '🔩 Dental Implants · Bogotá, Colombia',
      'es':    '🔩 Implantes Dentales · Bogotá, Colombia'
    },
    'implants.h1': {
      'en-US': 'Dental Implants in Bogotá<br><em>From $1,200 USD. Save 70%.*</em>',
      'en-CA': 'Dental Implants in Bogotá<br><em>From $1,200 USD. Save 70% vs Canadian prices.*</em>',
      'en-GB': 'Dental Implants in Bogotá<br><em>From $1,200 USD. A fraction of UK private fees.*</em>',
      'en-AU': 'Dental Implants in Bogotá<br><em>From $1,200 USD. Save 70% vs Australian prices.*</em>',
      'es':    'Implantes Dentales en Bogotá<br><em>Desde $1,200 USD. Ahorra 70%.*</em>'
    },
    'implants.sub': {
      'en-US': 'Straumann & Neodent implants — the exact brands your US dentist uses. <strong>Surgical guide precision.</strong> Single implant + crown: $1,200 vs $4,000–$6,000 back home.',
      'en-CA': 'Straumann & Neodent implants — the exact brands Canadian prosthodontists rely on. <strong>Surgical guide precision.</strong> Single implant + crown: $1,200 vs $4,500–$6,500 at home.',
      'en-GB': 'Straumann & Neodent implants — the same brands used at leading Harley Street practices. <strong>3D surgical guide precision placement.</strong> Single implant + crown: $1,200 USD vs £3,000–£5,000 at a UK private clinic.',
      'en-AU': 'Straumann & Neodent implants — trusted by top Australian oral surgeons. <strong>Surgical guide for precise placement.</strong> Single implant + crown: $1,200 USD vs AUD$5,000–$7,500 back home.',
      'es':    'Implantes Straumann y Neodent — las mismas marcas de tu dentista en EEUU. <strong>Guía quirúrgica de precisión.</strong> Implante único + corona: $1,200 vs $4,000–$6,000 allá.'
    },

    /* ── CROWNS ─────────────────────────────────────────────────── */
    'crowns.eyebrow': {
      'en-US': '👑 Dental Crowns & Bridges · Bogotá',
      'en-CA': '👑 Dental Crowns & Bridges · Bogotá',
      'en-GB': '👑 Dental Crowns & Bridges · Bogotá',
      'en-AU': '👑 Dental Crowns & Bridges · Bogotá',
      'es':    '👑 Coronas y Puentes Dentales · Bogotá'
    },
    'crowns.h1': {
      'en-US': 'Dental Crowns in Bogotá<br><em>From $380 USD. Save 70%.*</em>',
      'en-CA': 'Dental Crowns in Bogotá<br><em>From $380 USD. Save 70%.*</em>',
      'en-GB': 'Dental Crowns in Bogotá<br><em>From $380 USD. A fraction of UK private fees.*</em>',
      'en-AU': 'Dental Crowns in Bogotá<br><em>From $380 USD. Save 70%+.*</em>',
      'es':    'Coronas Dentales en Bogotá<br><em>Desde $380 USD. Ahorra 70%.*</em>'
    },
    'crowns.sub': {
      'en-US': 'Full-contour zirconia and Ivoclar e.max crowns milled in our in-house CAD/CAM lab. <strong>Same quality as your US dentist</strong> — done in 4–5 days.',
      'en-CA': 'Full-contour zirconia and Ivoclar e.max crowns milled in our in-house CAD/CAM lab. <strong>Same quality as your Canadian dentist</strong> — done in 4–5 days.',
      'en-GB': 'Full-contour zirconia and Ivoclar e.max crowns — the same materials your UK private dentist would use, milled in our in-house CAD/CAM lab. <strong>Done in 4–5 days.</strong> No NHS waiting list.',
      'en-AU': 'Full-contour zirconia and Ivoclar e.max crowns milled in our in-house CAD/CAM lab. <strong>Same quality you\'d expect from a top Australian dental practice</strong> — done in 4–5 days.',
      'es':    'Coronas de zirconia e Ivoclar e.max fresadas en nuestro lab CAD/CAM. <strong>Misma calidad que tu dentista en EEUU</strong> — listas en 4–5 días.'
    },

    /* ── HOLLYWOOD SMILE ────────────────────────────────────────── */
    'hollywood.eyebrow': {
      'en-US': '✨ Hollywood Smile · Digital Smile Design · Bogotá',
      'en-CA': '✨ Hollywood Smile · Digital Smile Design · Bogotá',
      'en-GB': '✨ Hollywood Smile · Digital Smile Design · Bogotá',
      'en-AU': '✨ Hollywood Smile · Digital Smile Design · Bogotá',
      'es':    '✨ Sonrisa Hollywood · Diseño Digital · Bogotá'
    },
    'hollywood.h1': {
      'en-US': 'Hollywood Smile in Bogotá<br><em>From $5,500. See It Before You Fly.*</em>',
      'en-CA': 'Hollywood Smile in Bogotá<br><em>From $5,500. See It Before You Fly.*</em>',
      'en-GB': 'Hollywood Smile in Bogotá<br><em>From $5,500. See Your Result Before You Travel.*</em>',
      'en-AU': 'Hollywood Smile in Bogotá<br><em>From $5,500. See It Before You Board.*</em>',
      'es':    'Sonrisa Hollywood en Bogotá<br><em>Desde $5,500. Véla antes de reservar tu vuelo.*</em>'
    },

    /* ── DSD ────────────────────────────────────────────────────── */
    'dsd.eyebrow': {
      'en-US': '🖥️ Digital Smile Design · Bogotá, Colombia',
      'en-CA': '🖥️ Digital Smile Design · Bogotá, Colombia',
      'en-GB': '🖥️ Digital Smile Design · Bogotá, Colombia',
      'en-AU': '🖥️ Digital Smile Design · Bogotá, Colombia',
      'es':    '🖥️ Diseño Digital de Sonrisa · Bogotá, Colombia'
    },
    'dsd.h1': {
      'en-US': 'See Your New Smile<br><em>Before You Book Your Flight.</em>',
      'en-CA': 'See Your New Smile<br><em>Before You Book Your Flight.</em>',
      'en-GB': 'See Your New Smile<br><em>Before You Book Your Flights.</em>',
      'en-AU': 'See Your New Smile<br><em>Before You Book Your Flights.</em>',
      'es':    'Ve tu Nueva Sonrisa<br><em>Antes de Reservar tu Vuelo.</em>'
    },
    'dsd.sub': {
      'en-US': 'We design your result digitally using professional CAD software. <strong>You approve shape, shade and proportions</strong> before any clinical work begins — and before you spend a dollar on airfare.',
      'en-CA': 'We design your result digitally using professional CAD software. <strong>You approve shape, shade and proportions</strong> before any clinical work starts — and before you book a flight.',
      'en-GB': 'We design your result using professional CAD software — the same technology used at top Harley Street cosmetic practices. <strong>You approve shape, shade and proportions</strong> before any clinical work begins and before you book your flights.',
      'en-AU': 'We design your result digitally using professional CAD software. <strong>You approve shape, shade and proportions</strong> before any clinical work begins — and before you spend a cent on flights.',
      'es':    'Diseñamos tu resultado digitalmente con software CAD profesional. <strong>Apruebas forma, tono y proporciones</strong> antes de que comience cualquier trabajo clínico y antes de reservar tu vuelo.'
    },

    /* ── TOURISM GUIDE ──────────────────────────────────────────── */
    'tourism.eyebrow': {
      'en-US': '🌎 Complete Guide · 2026',
      'en-CA': '🌎 Complete Guide · 2026',
      'en-GB': '🌎 Complete Guide for UK Patients · 2026',
      'en-AU': '🌎 Complete Guide for Aussie Patients · 2026',
      'es':    '🌎 Guía Completa · 2026'
    },
    'tourism.h1': {
      'en-US': 'Dental Tourism in Colombia — Everything You Need to Know',
      'en-CA': 'Dental Tourism in Colombia — Everything Canadian Patients Need to Know',
      'en-GB': 'Dental Tourism in Colombia — A Guide for UK Patients',
      'en-AU': 'Dental Tourism in Colombia — A Guide for Australians',
      'es':    'Turismo Dental en Colombia — Todo lo que Necesitas Saber'
    },
    'tourism.sub': {
      'en-US': 'The honest, complete guide for US patients considering dental work in Bogotá. <strong>What to expect, how to stay safe, real prices and how to choose the right provider.</strong>',
      'en-CA': 'The honest guide for Canadian patients considering dental work in Bogotá. <strong>OHIP doesn\'t cover dental. Bogotá does it right.</strong> What to expect, real prices, and how to choose your provider.',
      'en-GB': 'The practical guide for British patients considering dental work in Bogotá. <strong>Skip the NHS waiting list and UK private fees.</strong> What to expect, real prices in USD and GBP, and how to choose a safe provider.',
      'en-AU': 'The practical guide for Australians considering dental work in Bogotá. <strong>Medicare doesn\'t cover this. Bogotá does it better for less.</strong> What to expect, real prices, and how to vet your provider.',
      'es':    'La guía completa y honesta para pacientes de EEUU y Canadá. <strong>Qué esperar, cómo estar seguro, precios reales y cómo elegir al proveedor correcto.</strong>'
    },

    /* ── HUBS ───────────────────────────────────────────────────── */
    'treatments.h1': {
      'en-US': 'All Dental Treatments<br>Available in Bogotá',
      'en-CA': 'All Dental Treatments<br>Available in Bogotá',
      'en-GB': 'All Dental Treatments<br>Available in Bogotá',
      'en-AU': 'All Dental Treatments<br>Available in Bogotá',
      'es':    'Todos los Tratamientos Dentales<br>Disponibles en Bogotá'
    },
    'treatments.sub': {
      'en-US': 'Prices in USD, comparison vs US & Canadian rates, and full guides for each treatment. <strong>$200 clinical assessment</strong> tells you exactly which is right for your case.',
      'en-CA': 'Prices in USD, comparison vs Canadian rates, and full guides for each treatment. OHIP doesn\'t cover dental — but these prices will surprise you. <strong>$200 clinical assessment</strong> first.',
      'en-GB': 'Prices in USD (with GBP equivalents), comparison vs UK private fees, and full guides for each treatment. No NHS list, no hidden fees. <strong>$200 clinical assessment</strong> tells you what\'s right for your case.',
      'en-AU': 'Prices in USD, comparison vs Australian rates, and full guides for each treatment. Medicare won\'t help here — but these prices will. <strong>$200 clinical assessment</strong> first.',
      'es':    'Precios en USD, comparativa vs EEUU y Canadá, y guías por tratamiento. La <strong>valoración clínica de $200</strong> te dice exactamente cuál es el adecuado para tu caso.'
    },
    'compare.h1': {
      'en-US': 'Which Dental Treatment<br>Is Right for You?',
      'en-CA': 'Which Dental Treatment<br>Is Right for You?',
      'en-GB': 'Which Dental Treatment<br>Is Right for You?',
      'en-AU': 'Which Dental Treatment<br>Is Right for You?',
      'es':    '¿Qué Tratamiento Dental<br>Es el Adecuado para Ti?'
    },
    'compare.sub': {
      'en-US': 'Compare veneers, All-on-4, implants and crowns — prices in USD, timelines, candidacy and what to expect in Bogotá.',
      'en-CA': 'Compare veneers, All-on-4, implants and crowns — prices in USD, timelines, candidacy and what to expect in Bogotá.',
      'en-GB': 'Compare veneers, All-on-4 implants, crowns and bridges — prices in USD (with GBP notes), timelines, candidacy and what to expect in Bogotá.',
      'en-AU': 'Compare veneers, All-on-4, implants and crowns — prices in USD, timelines, candidacy and what to expect in Bogotá.',
      'es':    'Compara carillas, All-on-4, implantes y coronas — precios, tiempos, requisitos y qué esperar en Bogotá.'
    },
    'blog.h1': {
      'en-US': 'Dental Tourism Guides for US & Canadian Patients',
      'en-CA': 'Dental Tourism Guides for Canadian Patients',
      'en-GB': 'Dental Tourism Guides for UK Patients',
      'en-AU': 'Dental Tourism Guides for Australian Patients',
      'es':    'Guías para Pacientes Dentales Internacionales'
    },
    'review.h1': {
      'en-US': 'Share Your Experience',
      'en-CA': 'Share Your Experience',
      'en-GB': 'Share Your Experience',
      'en-AU': 'Share Your Experience',
      'es':    'Comparte tu Experiencia'
    },
    'review.sub': {
      'en-US': 'Your honest feedback helps other patients make the right call.',
      'en-CA': 'Your honest feedback helps other patients make the right call.',
      'en-GB': 'Your honest feedback helps other patients make an informed decision.',
      'en-AU': 'Your honest feedback helps other patients make the right choice.',
      'es':    'Tu opinión honesta ayuda a futuros pacientes a tomar decisiones informadas.'
    },
    '404.h1': {
      'en-US': 'Page Not Found',
      'en-CA': 'Page Not Found',
      'en-GB': 'Page Not Found',
      'en-AU': 'Page Not Found',
      'es':    'Página no encontrada'
    },
  };

  /* ── DETECTAR VARIANTE ─────────────────────────────────────────── */
  var _lang = 'en-US'; /* default */

  /* Mapa de país → variante */
  var COUNTRY_LANG = {
    GB: 'en-GB', IE: 'en-GB',
    AU: 'en-AU', NZ: 'en-AU',
    CA: 'en-CA',
    CO: 'es', MX: 'es', AR: 'es', CL: 'es', PE: 'es',
    EC: 'es', VE: 'es', DO: 'es', CU: 'es', PR: 'es',
    GT: 'es', HN: 'es', SV: 'es', NI: 'es', CR: 'es',
    PA: 'es', UY: 'es', BO: 'es', PY: 'es', ES: 'es',
  };

  function _detectFromBrowser() {
    var nav = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
    if (nav.startsWith('es')) return 'es';
    if (nav.startsWith('en-gb') || nav.startsWith('en-ie')) return 'en-GB';
    if (nav.startsWith('en-au') || nav.startsWith('en-nz')) return 'en-AU';
    if (nav.startsWith('en-ca')) return 'en-CA';
    return 'en-US';
  }

  function _fromSaved() { return localStorage.getItem('bss-lang'); }

  /* ── CSS + BOTONES ─────────────────────────────────────────────── */
  function _injectStyle() {
    if (document.getElementById('bss-i18n-css')) return;
    var s = document.createElement('style');
    s.id  = 'bss-i18n-css';
    s.textContent = [
      /* Buttons */
      '.bss-lang-btns{display:flex;gap:2px;align-items:center;flex-wrap:wrap;}',
      '.bss-lb{background:none;border:1px solid rgba(255,255,255,.12);color:#94a3b8;',
        'padding:3px 8px;border-radius:12px;font-size:.62rem;font-weight:800;',
        'cursor:pointer;font-family:inherit;transition:all .15s;letter-spacing:.3px;}',
      '.bss-lb.active{border-color:rgba(212,175,55,.4);color:#D4AF37;background:rgba(212,175,55,.08);}',
      '.bss-lb:hover{border-color:rgba(212,175,55,.3);color:#D4AF37;}',
    ].join('');
    document.head.appendChild(s);
  }

  function _injectButtons() {
    var topbar = document.querySelector('.topbar');
    if (!topbar || document.getElementById('bss-lang-btns')) return;
    var wrap = document.createElement('div');
    wrap.className = 'bss-lang-btns';
    wrap.id = 'bss-lang-btns';
    wrap.setAttribute('role', 'group');
    wrap.setAttribute('aria-label', 'Language / Country selector');
    var langs = [
      { code: 'en-US', label: '🇺🇸 EN' },
      { code: 'en-CA', label: '🇨🇦 EN' },
      { code: 'en-GB', label: '🇬🇧 EN' },
      { code: 'en-AU', label: '🇦🇺 EN' },
      { code: 'es',    label: '🇨🇴 ES' },
    ];
    wrap.innerHTML = langs.map(function(l) {
      return '<button class="bss-lb" data-lang="' + l.code + '" ' +
        'onclick="BSSi18n.set(\'' + l.code + '\')" ' +
        'aria-label="' + l.label + '">' + l.label + '</button>';
    }).join('');
    /* Insert before hamburger or at end */
    var ham = topbar.querySelector('.mob-ham, .lang-btns');
    if (ham) topbar.insertBefore(wrap, ham);
    else topbar.appendChild(wrap);
  }

  /* ── APLICAR TRADUCCIONES ─────────────────────────────────────── */
  function _apply(lang) {
    _lang = lang;
    /* data-i18n="key" → innerHTML */
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
      var key = el.getAttribute('data-i18n');
      var val = T[key] && (T[key][lang] || T[key]['en-US']);
      if (val !== undefined) el.innerHTML = val;
    });
    /* Actualizar botones */
    document.querySelectorAll('.bss-lb').forEach(function(b) {
      b.classList.toggle('active', b.dataset.lang === lang);
      b.setAttribute('aria-pressed', b.dataset.lang === lang ? 'true' : 'false');
    });
    /* Actualizar lang del documento */
    document.documentElement.lang = lang.startsWith('en') ? 'en' : 'es';
    localStorage.setItem('bss-lang', lang);
  }

  /* ── API PÚBLICA ──────────────────────────────────────────────── */
  function set(lang) { _apply(lang); }

  function init() {
    _injectStyle();
    document.addEventListener('DOMContentLoaded', function() {
      _injectButtons();
      /* Prioridad: localStorage → geo-detect → browser → en-US */
      var saved   = _fromSaved();
      var initial = saved || _detectFromBrowser();
      /* Si geo-detect ya resolvió, refinar */
      if (!saved && window._geoCountry && COUNTRY_LANG[window._geoCountry]) {
        initial = COUNTRY_LANG[window._geoCountry];
      }
      _apply(initial);
    });
    /* Escuchar geo-detect asíncrono */
    document.addEventListener('bss-geo-ready', function(e) {
      if (!_fromSaved() && COUNTRY_LANG[e.detail]) {
        _apply(COUNTRY_LANG[e.detail]);
      }
    });
  }

  return {
    init: init,
    set:  set,
    get:  function() { return _lang; },
    t:    function(key) { return T[key] && (T[key][_lang] || T[key]['en-US']) || ''; }
  };

})();
