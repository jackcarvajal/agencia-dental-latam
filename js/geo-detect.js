/**
 * BSS Geo-Detect v1.0 — adaptado de PRODIGY Geo-Detect
 * Detecta país del visitante y:
 *  - Países hispanohablantes → idioma ES automático
 *  - Todos los demás → EN (mercado principal de BSS)
 *  - Emite evento 'bss-geo-ready' con el código de país
 *
 * Sin cookies. Detección silenciosa. Usa ipapi.co (gratis <1000 req/día).
 */
'use strict';

window.BSSGeo = (function () {

  var _data  = null;
  var _ready = false;
  var _cbs   = [];

  var ES_COUNTRIES = ['CO','MX','AR','CL','PE','EC','PA','CR','VE','UY','BO',
                      'PY','GT','HN','SV','NI','DO','CU','PR','ES'];

  function onReady(cb) {
    if (_ready) { cb(_data); return; }
    _cbs.push(cb);
  }

  function _resolve(d) {
    _data  = d;
    _ready = true;
    _cbs.forEach(function(cb){ try { cb(d); } catch(_){} });
    _cbs = [];
    /* Emitir evento para que setLang() en index.html lo escuche */
    document.dispatchEvent(new CustomEvent('bss-geo-ready', { detail: d.pais }));
    /* Exponer en dataLayer para GA4/GTM */
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'geo_detected', geo_country: d.pais, geo_es: d.esHispano });
    /* Exponer globalmente para _bssUTMs en index.html */
    window._geoCountry = d.pais;
  }

  function _detect() {
    /* Caché en sessionStorage — evita request duplicado en SPA */
    try {
      var cached = sessionStorage.getItem('bss_geo');
      if (cached) { _resolve(JSON.parse(cached)); return; }
    } catch(_) {}

    fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(4000) })
      .then(function(r) { return r.json(); })
      .then(function(d) {
        var country = d.country_code || 'US';
        var result = {
          pais:      country,
          ciudad:    d.city || '',
          region:    d.region || '',
          moneda:    d.currency || 'USD',
          esHispano: ES_COUNTRIES.includes(country),
          esEuropa:  ['ES','PT','DE','IT','FR','GB','NL','BE','CH','AT','SE','DK','NO','FI','PL','CZ','HU','RO','GR','HR','IE'].includes(country),
          esUSA:     country === 'US',
          esCanada:  country === 'CA',
          esUK:      country === 'GB'
        };
        try { sessionStorage.setItem('bss_geo', JSON.stringify(result)); } catch(_) {}
        _resolve(result);
      })
      .catch(function() {
        /* Fallback: US por defecto (mercado principal de BSS) */
        _resolve({ pais:'US', moneda:'USD', esHispano:false, esEuropa:false, esUSA:true });
      });
  }

  /* ── EFECTOS AUTOMÁTICOS TRAS DETECCIÓN ──────────────────────────── */

  function _applyLanguage(geo) {
    /* Solo si el usuario no ha elegido idioma manualmente */
    if (localStorage.getItem('bss-lang')) return;
    if (typeof setLang === 'function') {
      setLang(geo.esHispano ? 'es' : 'en');
    }
  }

  function _applyGDPRBanner(geo) {
    if (!geo.esEuropa) return;
    if (localStorage.getItem('bss_gdpr_ok')) return;
    var b = document.createElement('div');
    b.id = 'bss-gdpr-banner';
    b.style.cssText = 'position:fixed;top:100px;right:20px;z-index:99998;max-width:280px;' +
      'background:#0d1520;border:1px solid rgba(0,210,255,.3);border-radius:14px;' +
      'padding:16px 18px;font-family:inherit;font-size:.75rem;color:#94a3b8;' +
      'box-shadow:0 8px 32px rgba(0,0,0,.5);transform:translateX(300px);transition:transform .4s ease;';
    b.innerHTML =
      '<div style="font-size:.82rem;font-weight:800;color:#00d2ff;margin-bottom:8px;">🇪🇺 GDPR Notice</div>' +
      '<p style="line-height:1.6;margin-bottom:12px;">' +
        'Under GDPR you can access, correct or delete your data. ' +
        'We use anonymous analytics only. No advertising cookies.' +
      '</p>' +
      '<div style="display:flex;gap:8px;">' +
        '<a href="/privacy" style="flex:1;text-align:center;padding:7px;border:1px solid rgba(0,210,255,.3);' +
          'border-radius:8px;color:#00d2ff;text-decoration:none;font-size:.7rem;font-weight:700;">View policy</a>' +
        '<button type="button" onclick="localStorage.setItem(\'bss_gdpr_ok\',\'1\');' +
          'var b=document.getElementById(\'bss-gdpr-banner\');b.style.transform=\'translateX(300px)\';' +
          'setTimeout(function(){b.remove()},400);" ' +
          'style="flex:1;background:rgba(0,210,255,.1);border:1px solid rgba(0,210,255,.3);' +
          'border-radius:8px;color:#00d2ff;cursor:pointer;font-size:.7rem;font-weight:700;padding:7px;">Got it</button>' +
      '</div>';
    document.body.appendChild(b);
    setTimeout(function() { b.style.transform = 'translateX(0)'; }, 400);
  }

  /* ── INIT ─────────────────────────────────────────────────────────── */
  _detect();

  document.addEventListener('DOMContentLoaded', function () {
    onReady(function(geo) {
      _applyLanguage(geo);
      _applyGDPRBanner(geo);
    });
  });

  return {
    onReady: onReady,
    get: function() { return _data; }
  };

})();
