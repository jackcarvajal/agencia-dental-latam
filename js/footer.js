/**
 * BSS Footer v1.0 — adaptado de PRODIGY footer.js
 * - Cookie consent (SIC CO + GDPR EU + GA4 Consent Mode v2)
 * - Lazy loading: bss-tracker.js, geo-detect.js, Meta Pixel, Clarity
 */
(function () {
  'use strict';

  /* Actualizar año © automáticamente */
  document.querySelectorAll('.bss-year').forEach(function(el) {
    el.textContent = new Date().getFullYear();
  });

  /* ── LAZY LOAD ANALYTICS SCRIPTS ──────────────────────────────────── */
  function _loadScript(src) {
    var s = document.createElement('script');
    s.src = src; s.defer = true;
    document.body.appendChild(s);
  }

  function _loadAnalytics() {
    /* BSS Tracker (UTM + conversions) */
    _loadScript('/js/bss-tracker.js?v=20260602');
    /* Geo-detect (idioma + GDPR) */
    _loadScript('/js/geo-detect.js?v=20260602');

    /* ── META PIXEL ─────────────────────────────────────────────────
       Reemplazar PIXEL_ID_PENDIENTE con tu Facebook Pixel ID
       Obtener en: business.facebook.com → Events Manager → Pixels
    ─────────────────────────────────────────────────────────────── */
    var META_PIXEL_ID = 'PIXEL_ID_PENDIENTE';
    if (META_PIXEL_ID !== 'PIXEL_ID_PENDIENTE') {
      !function(f,b,e,v,n,t,s){
        if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)
      }(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', META_PIXEL_ID);
      fbq('track', 'PageView');
    }

    /* ── MICROSOFT CLARITY — heatmaps + session recordings GRATIS ───
       Registrar en: clarity.microsoft.com (gratuito, sin límite)
       Reemplazar CLARITY_ID_PENDIENTE con tu Project ID
    ─────────────────────────────────────────────────────────────── */
    var CLARITY_ID = 'CLARITY_ID_PENDIENTE';
    if (CLARITY_ID !== 'CLARITY_ID_PENDIENTE') {
      (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window,document,'clarity','script',CLARITY_ID);
    }
  }

  /* Cargar analytics solo cuando el browser esté libre */
  if ('requestIdleCallback' in window) {
    requestIdleCallback(_loadAnalytics, { timeout: 3000 });
  } else {
    setTimeout(_loadAnalytics, 1500);
  }

  /* ── PUSH NOTIFICATION SUBSCRIBE BUTTON ──────────────────────────── */
  var VAPID_PK = 'VAPID_PUBLIC_KEY_PENDIENTE'; /* reemplazar */
  if ('serviceWorker' in navigator && 'PushManager' in window &&
      VAPID_PK !== 'VAPID_PUBLIC_KEY_PENDIENTE' &&
      !localStorage.getItem('bss_push_subscribed') &&
      !localStorage.getItem('bss_push_denied')) {

    setTimeout(function() {
      var lang = document.documentElement.lang || 'en';
      var isES = lang === 'es';
      var btn = document.createElement('button');
      btn.id = 'bss-push-btn';
      btn.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:9002;' +
        'background:#0d1520;border:1px solid rgba(212,175,55,.3);border-radius:50px;' +
        'padding:10px 22px;font-family:inherit;font-size:.76rem;font-weight:700;color:#D4AF37;' +
        'cursor:pointer;display:flex;align-items:center;gap:8px;' +
        'box-shadow:0 4px 20px rgba(0,0,0,.5);white-space:nowrap;';
      btn.innerHTML = '🔔 ' + (isES ? 'Recibir notificaciones de mi caso' : 'Get notified about your case');
      btn.setAttribute('aria-label', isES ? 'Activar notificaciones push' : 'Enable push notifications');
      document.body.appendChild(btn);

      btn.addEventListener('click', async function() {
        try {
          var reg = await navigator.serviceWorker.ready;
          var sub = await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: VAPID_PK
          });
          await fetch('/api/push-subscribe', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({ subscription: sub, lang: lang, page: window.location.pathname })
          });
          localStorage.setItem('bss_push_subscribed', '1');
          btn.innerHTML = '✅ ' + (isES ? '¡Listo! Te avisamos sobre tu caso.' : 'Done! We\'ll notify you about your case.');
          setTimeout(function() { btn.remove(); }, 3000);
        } catch(_) {
          localStorage.setItem('bss_push_denied', '1');
          btn.remove();
        }
      });

      setTimeout(function() { if (btn.parentNode) btn.remove(); }, 12000);
    }, 20000);
  }

  /* ── EXIT INTENT POPUP (index.html only) ────────────────────────── */
  if ((window.location.pathname === '/' || window.location.pathname === '/index.html') &&
      !localStorage.getItem('bss_exit_shown') &&
      !localStorage.getItem('bss_form_ok')) {

    var _exitShown = false;
    document.addEventListener('mouseleave', function(e) {
      if (_exitShown || e.clientY > 50) return;
      _exitShown = true;
      localStorage.setItem('bss_exit_shown', '1');

      var lang = document.documentElement.lang || 'en';
      var isES = lang === 'es';

      var overlay = document.createElement('div');
      overlay.id = 'bss-exit-overlay';
      overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:10000;' +
        'display:flex;align-items:center;justify-content:center;padding:20px;';
      overlay.innerHTML = '<div style="background:#0d1520;border:1px solid rgba(212,175,55,.3);border-radius:20px;' +
        'padding:32px;max-width:420px;width:100%;text-align:center;position:relative;">' +
        '<button onclick="document.getElementById(\'bss-exit-overlay\').remove()" ' +
          'style="position:absolute;top:14px;right:16px;background:none;border:none;color:#94a3b8;' +
          'font-size:1.1rem;cursor:pointer;" aria-label="Close">✕</button>' +
        '<div style="font-size:2rem;margin-bottom:10px;" aria-hidden="true">💡</div>' +
        '<h3 style="font-family:\'Playfair Display\',serif;font-size:1.3rem;color:#fff;margin-bottom:8px;">' +
          (isES ? 'Antes de irte…' : 'Before you go…') + '</h3>' +
        '<p style="font-size:.82rem;color:#94a3b8;line-height:1.65;margin-bottom:20px;">' +
          (isES
            ? 'La <strong style="color:#f5f0e8;">valoración inicial es gratuita</strong>. Solo llena el formulario — te respondemos en 24 horas con tu plan de tratamiento y precio exacto.'
            : 'The <strong style="color:#f5f0e8;">initial review is completely free.</strong> Just fill in the form — we\'ll send your personalized treatment plan and exact quote within 24 hours.') + '</p>' +
        '<a href="/#consult" onclick="document.getElementById(\'bss-exit-overlay\').remove()" ' +
          'style="display:block;background:linear-gradient(135deg,#D4AF37,#b8962a);color:#000;border:none;' +
          'border-radius:10px;padding:13px;font-size:.9rem;font-weight:800;cursor:pointer;font-family:inherit;' +
          'text-decoration:none;">' +
          (isES ? '📋 Enviar mi caso — Gratis' : '📋 Send My Case — Free') + '</a>' +
        '<p style="font-size:.68rem;color:#475569;margin-top:10px;">' +
          (isES ? 'Sin compromiso. Sin tarjeta de crédito.' : 'No commitment. No credit card.') + '</p>' +
        '</div>';

      document.body.appendChild(overlay);
      overlay.addEventListener('click', function(e) {
        if (e.target === overlay) overlay.remove();
      });
    });
  }

  /* ── COOKIE CONSENT (SIC CO + GDPR + GA4 Consent Mode v2) ────────── */

  /* Aplicar consent guardado al cargar */
  var _consent = localStorage.getItem('bss_cookies_ok');
  if (window.gtag) {
    if (_consent === '1') {
      window.gtag('consent', 'update', { analytics_storage: 'granted', ad_storage: 'denied' });
    } else if (_consent === '0') {
      window.gtag('consent', 'update', { analytics_storage: 'denied', ad_storage: 'denied' });
    }
  }

  /* Solo mostrar banner si no hay decisión previa */
  if (_consent) return;

  function _accept() {
    localStorage.setItem('bss_cookies_ok', '1');
    if (window.gtag) window.gtag('consent', 'update', { analytics_storage: 'granted', ad_storage: 'denied' });
    document.dispatchEvent(new CustomEvent('bss_consent_granted'));
    _dismissBanner();
  }

  function _reject() {
    localStorage.setItem('bss_cookies_ok', '0');
    if (window.gtag) window.gtag('consent', 'update', { analytics_storage: 'denied', ad_storage: 'denied' });
    _dismissBanner();
  }

  function _dismissBanner() {
    var b = document.getElementById('bss-cookie-banner');
    if (!b) return;
    b.style.transform = 'translateY(120%)';
    setTimeout(function() { if (b.parentNode) b.remove(); }, 350);
  }

  /* Mostrar después de 3s — el usuario ya vio valor de la página primero */
  setTimeout(function() {
    var isES = document.documentElement.lang === 'es';

    var cb = document.createElement('div');
    cb.id = 'bss-cookie-banner';
    cb.setAttribute('role', 'dialog');
    cb.setAttribute('aria-label', isES ? 'Aviso de cookies' : 'Cookie notice');
    cb.setAttribute('aria-modal', 'false');
    cb.style.cssText = [
      'position:fixed;bottom:24px;left:24px;z-index:99999;',
      'background:linear-gradient(135deg,#0d1520,#0a1018);',
      'border:1px solid rgba(212,175,55,.3);border-radius:16px;',
      'padding:16px 18px;font-family:inherit;width:300px;',
      'transform:translateY(120%);transition:transform .4s ease;',
      'box-shadow:0 8px 32px rgba(0,0,0,.6);'
    ].join('');

    cb.innerHTML =
      '<div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:12px;">' +
        '<div style="font-size:1.4rem;flex-shrink:0;">📊</div>' +
        '<div>' +
          '<div style="font-size:.84rem;font-weight:800;color:#f8fafc;margin-bottom:4px;">' +
            (isES ? 'Ayúdanos a mejorar' : 'Help us improve') +
          '</div>' +
          '<div style="font-size:.72rem;color:#64748b;line-height:1.5;">' +
            (isES
              ? 'Analytics anónimo para saber qué funciona. <strong style="color:#94a3b8;">Sin anuncios.</strong> '
              : 'Anonymous analytics to see what works. <strong style="color:#94a3b8;">No ad tracking.</strong> ') +
            '<a href="/privacy" style="color:rgba(212,175,55,.8);text-decoration:none;">' +
              (isES ? 'Ver política →' : 'Privacy policy →') +
            '</a>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<button type="button" id="bss-cookie-accept" ' +
        'style="width:100%;background:linear-gradient(135deg,#D4AF37,#b8962a);color:#000;border:none;' +
        'border-radius:50px;padding:12px 0;font-weight:900;font-size:.8rem;cursor:pointer;' +
        'margin-bottom:6px;min-height:44px;box-shadow:0 4px 14px rgba(212,175,55,.3);">' +
        (isES ? '✓ Sí, mejorar la experiencia' : '✓ Yes, improve my experience') +
      '</button>' +
      '<button type="button" id="bss-cookie-reject" ' +
        'style="width:100%;background:transparent;color:#475569;border:none;padding:10px;' +
        'font-size:.7rem;cursor:pointer;text-decoration:underline;min-height:44px;">' +
        (isES ? 'No por ahora' : 'No thanks') +
      '</button>';

    document.body.appendChild(cb);
    requestAnimationFrame(function() { cb.style.transform = 'translateY(0)'; });

    document.getElementById('bss-cookie-accept').addEventListener('click', _accept);
    document.getElementById('bss-cookie-reject').addEventListener('click', _reject);

  }, 3000);

})();
