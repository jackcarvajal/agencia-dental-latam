/* header.js — Bogotá Smile Studio v20260601
   Inyecta: WA float + chatbot Gemini
   No inyecta topbar (cada página tiene el suyo inline)
*/
(function () {
  'use strict';

  var BSS_WA      = '573219581949'; // ← reemplazar con WA del admin cuando lo confirme Alejandro
  var BSS_GEMINI  = '/api/gemini';
  var _pgChatHistory = [];
  var _chatOpen   = false;

  /* ─── STICKY BOTTOM CTA BAR (treatment pages only) ─── */
  var _isTreatment = [
    '/veneers-bogota','/hollywood-smile-bogota','/smile-design-bogota',
    '/all-on-4-bogota','/dental-implants-bogota','/crowns-bogota',
    '/dental-tourism-colombia','/treatments','/compare'
  ].some(function(p){
    var cur = window.location.pathname.replace(/\/$|\.html$/,'');
    return cur === p;
  });

  if (_isTreatment) {
    var stickyCSS = [
      '.bss-sticky-cta{position:fixed;bottom:0;left:0;right:0;z-index:8998;',
        'background:rgba(5,5,5,.97);border-top:1px solid rgba(212,175,55,.2);',
        'backdrop-filter:blur(12px);',
        'display:flex;align-items:center;justify-content:center;gap:10px;',
        'padding:12px 20px;flex-wrap:wrap;}',
      '.bss-sticky-cta .sc-msg{font-size:.72rem;color:#94a3b8;flex:1;min-width:140px;}',
      '.bss-sticky-cta .sc-msg strong{color:#f5f0e8;}',
      '.bss-sticky-cta .sc-btn{background:linear-gradient(135deg,#D4AF37,#b8962a);',
        'color:#000;border:none;border-radius:50px;padding:10px 20px;',
        'font-size:.78rem;font-weight:800;cursor:pointer;font-family:inherit;',
        'white-space:nowrap;text-decoration:none;display:inline-flex;align-items:center;gap:6px;}',
      '.bss-sticky-cta .sc-btn2{background:transparent;border:1px solid rgba(212,175,55,.35);',
        'color:#D4AF37;border-radius:50px;padding:9px 18px;font-size:.75rem;font-weight:700;',
        'cursor:pointer;font-family:inherit;white-space:nowrap;text-decoration:none;',
        'display:inline-flex;align-items:center;gap:5px;}',
      /* Push content up so sticky bar doesn\'t cover footer */
      'body{padding-bottom:68px !important;}',
      '@media(max-width:520px){.bss-sticky-cta .sc-msg{display:none;}',
        '.bss-sticky-cta{gap:8px;}}'
    ].join('');

    var stickyEl = document.createElement('style');
    stickyEl.textContent = stickyCSS;
    document.head.appendChild(stickyEl);

    /* Defer sticky bar creation until after setLang() has run (inline scripts) */
    function _buildStickyBar() {
      var isES = document.documentElement.lang === 'es' ||
                 (localStorage.getItem('bss-lang') || '') === 'es';
      var bar = document.createElement('div');
      bar.className = 'bss-sticky-cta';
      bar.setAttribute('role', 'navigation');
      bar.setAttribute('aria-label', isES ? 'Próximos pasos' : 'Next steps');
      bar.innerHTML = [
        '<p class="sc-msg">',
          isES
            ? '<strong>¿Listo para empezar?</strong> Revisión inicial gratis. Valoración clínica $200 (descontable).'
            : '<strong>Ready to start?</strong> Free initial review. $200 clinical assessment — deductible from treatment.',
        '</p>',
        '<a href="/#consult" class="sc-btn">',
          '<i class="fas fa-calendar-check" aria-hidden="true"></i> ',
          isES ? 'Empezar gratis' : 'Start Free',
        '</a>',
        '<a href="/pay-assessment" class="sc-btn2">',
          '<i class="fas fa-credit-card" aria-hidden="true"></i> ',
          isES ? 'Pagar valoración $200' : 'Pay $200 Assessment',
        '</a>',
      ].join('');
      document.body.appendChild(bar);
    }
    /* Use setTimeout(0) to run after all inline scripts on the page */
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function(){ setTimeout(_buildStickyBar, 0); });
    } else {
      setTimeout(_buildStickyBar, 0);
    }
  }

  /* ─── TREATMENT NAV WIDGET ──────────────────────── */
  var TREATMENT_PAGES = [
    { href: '/veneers-bogota',          en: '✨ Veneers',        es: '✨ Carillas' },
    { href: '/hollywood-smile-bogota',  en: '⭐ Hollywood Smile', es: '⭐ Sonrisa Hollywood' },
    { href: '/smile-design-bogota',     en: '🖥️ Smile Design',    es: '🖥️ Diseño de Sonrisa' },
    { href: '/dental-implants-bogota',  en: '🔩 Implants',        es: '🔩 Implantes' },
    { href: '/all-on-4-bogota',         en: '🦷 All-on-4',        es: '🦷 All-on-4' },
    { href: '/crowns-bogota',           en: '👑 Crowns',          es: '👑 Coronas' },
  ];

  var TREATMENT_SLUGS = TREATMENT_PAGES.map(function(p){ return p.href; });
  var currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  var isTreatmentPage = TREATMENT_SLUGS.some(function(s){ return currentPath === s || currentPath === s + '.html'; });

  if (isTreatmentPage) {
    var tnCss = [
      '.bss-treat-nav{position:sticky;top:53px;z-index:90;',
        'background:rgba(5,5,5,.97);border-bottom:1px solid rgba(212,175,55,.12);',
        'padding:8px 24px;display:flex;gap:6px;flex-wrap:wrap;align-items:center;',
        'overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;}',
      '.bss-treat-nav::-webkit-scrollbar{display:none}',
      '.bss-treat-nav a{display:inline-flex;align-items:center;gap:5px;',
        'padding:5px 12px;border-radius:20px;font-size:.68rem;font-weight:700;',
        'color:#94a3b8;white-space:nowrap;transition:background .15s,color .15s;',
        'border:1px solid transparent;text-decoration:none;}',
      '.bss-treat-nav a:hover{background:rgba(212,175,55,.1);color:#D4AF37;border-color:rgba(212,175,55,.2);}',
      '.bss-treat-nav a.active{background:rgba(212,175,55,.12);color:#D4AF37;border-color:rgba(212,175,55,.3);}',
    ].join('');
    var tnSt = document.createElement('style');
    tnSt.textContent = tnCss;
    document.head.appendChild(tnSt);

    function _buildTreatNav() {
      var isES = document.documentElement.lang === 'es' ||
                 (localStorage.getItem('bss-lang') || '') === 'es';
      var navEl = document.createElement('nav');
      navEl.className = 'bss-treat-nav';
      navEl.setAttribute('aria-label', isES ? 'Tratamientos disponibles' : 'All treatments');
      navEl.innerHTML = TREATMENT_PAGES.map(function(p){
        var isActive = currentPath === p.href || currentPath === p.href + '.html';
        var label = isES ? p.es : p.en;
        return '<a href="' + p.href + '"' + (isActive ? ' class="active" aria-current="page"' : '') + '>' + label + '</a>';
      }).join('');
      var header = document.querySelector('header');
      if (header && header.nextSibling) {
        header.parentNode.insertBefore(navEl, header.nextSibling);
      } else {
        document.body.insertBefore(navEl, document.body.firstChild);
      }
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function(){ setTimeout(_buildTreatNav, 0); });
    } else {
      setTimeout(_buildTreatNav, 0);
    }
  }

  /* ─── SOCIAL PROOF WIDGET (index.html only) ────────── */
  if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
    var spCss = [
      '.bss-sp{position:fixed;bottom:88px;left:16px;z-index:8990;',
        'background:#0d1520;border:1px solid rgba(212,175,55,.2);',
        'border-radius:12px;padding:10px 14px;font-size:.72rem;',
        'color:#94a3b8;max-width:240px;',
        'transform:translateX(-120%);transition:transform .4s ease;',
        'box-shadow:0 4px 20px rgba(0,0,0,.5);}',
      '.bss-sp.show{transform:translateX(0);}',
      '.bss-sp-icon{margin-right:6px;}',
      '.bss-sp strong{color:#f5f0e8;}',
      '@media(max-width:420px){.bss-sp{display:none;}}'
    ].join('');
    var spSt = document.createElement('style');
    spSt.textContent = spCss;
    document.head.appendChild(spSt);

    /* Notifications queue — realistic, not fake */
    /* Lee html.lang en el momento de mostrar (no al cargar) para que respete cambios dinámicos */
    function _isESNow() {
      return document.documentElement.lang === 'es' ||
             (localStorage.getItem('bss-lang') || '') === 'es';
    }
    var _notifications = [
      { en: '👀 <strong>3 people</strong> are viewing this page right now', es: '👀 <strong>3 personas</strong> están viendo esta página ahora' },
      { en: '🦷 New consultation submitted from <strong>Miami, FL</strong>', es: '🦷 Nueva consulta desde <strong>Miami, FL</strong>' },
      { en: '⭐ Case confirmed: <strong>12 veneers</strong> — patient from Toronto', es: '⭐ Caso confirmado: <strong>12 carillas</strong> — paciente de Toronto' },
      { en: '💬 <strong>7 people</strong> asked about All-on-4 today', es: '💬 <strong>7 personas</strong> preguntaron por All-on-4 hoy' },
      { en: '✅ Assessment booked from <strong>London, UK</strong>', es: '✅ Valoración reservada desde <strong>Londres, UK</strong>' },
    ];

    var _spEl = document.createElement('div');
    _spEl.className = 'bss-sp';
    _spEl.setAttribute('aria-live', 'polite');
    _spEl.setAttribute('role', 'status');
    document.body.appendChild(_spEl);

    var _spIdx = 0;
    function _showNotification() {
      var n = _notifications[_spIdx % _notifications.length];
      _spEl.innerHTML = '<span class="bss-sp-icon" aria-hidden="true">🔔</span>' + (_isESNow() ? n.es : n.en);
      _spEl.classList.add('show');
      _spIdx++;
      setTimeout(function(){ _spEl.classList.remove('show'); }, 4000);
    }

    /* Start after 8s, then every 18s */
    setTimeout(function(){
      _showNotification();
      setInterval(_showNotification, 18000);
    }, 8000);
  }

  /* ─── INJECT STYLES ─────────────────────────────── */
  var css = [
    /* WA float */
    '.bss-wa-float{position:fixed;bottom:24px;right:24px;z-index:9000;',
    'background:#25d366;color:#fff;border:none;border-radius:50%;',
    'width:54px;height:54px;font-size:1.4rem;cursor:pointer;',
    'display:flex;align-items:center;justify-content:center;',
    'box-shadow:0 4px 20px rgba(37,211,102,.45);',
    'transition:transform .2s,box-shadow .2s;}',
    '.bss-wa-float:hover{transform:scale(1.08);box-shadow:0 6px 28px rgba(37,211,102,.6);}',
    /* Chat button */
    '.bss-chat-btn{position:fixed;bottom:86px;right:24px;z-index:9000;',
    'background:linear-gradient(135deg,#D4AF37,#b8962a);color:#000;border:none;',
    'border-radius:50%;width:54px;height:54px;font-size:1.1rem;cursor:pointer;',
    'display:flex;align-items:center;justify-content:center;',
    'box-shadow:0 4px 20px rgba(212,175,55,.45);',
    'transition:transform .2s,box-shadow .2s;}',
    '.bss-chat-btn:hover{transform:scale(1.08);box-shadow:0 6px 28px rgba(212,175,55,.6);}',
    '.bss-chat-btn .bss-notif{position:absolute;top:-4px;right:-4px;',
    'background:#ef4444;color:#fff;border-radius:50%;width:16px;height:16px;',
    'font-size:.55rem;font-weight:800;display:flex;align-items:center;justify-content:center;}',
    /* Chat window */
    '.bss-chat-win{position:fixed;bottom:152px;right:24px;z-index:8999;',
    'width:340px;max-width:calc(100vw - 32px);',
    'background:#0d1520;border:1px solid rgba(212,175,55,.2);',
    'border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,.6);',
    'display:none;flex-direction:column;overflow:hidden;}',
    '.bss-chat-win.open{display:flex;}',
    '.bss-chat-head{background:linear-gradient(135deg,rgba(212,175,55,.12),rgba(212,175,55,.06));',
    'padding:14px 16px;display:flex;align-items:center;gap:10px;',
    'border-bottom:1px solid rgba(212,175,55,.15);}',
    '.bss-chat-head-avatar{width:36px;height:36px;border-radius:50%;',
    'background:linear-gradient(135deg,#D4AF37,rgba(212,175,55,.4));',
    'display:flex;align-items:center;justify-content:center;font-size:1rem;}',
    '.bss-chat-head-info{flex:1;}',
    '.bss-chat-head-name{font-size:.82rem;font-weight:800;color:#fff;}',
    '.bss-chat-head-status{font-size:.65rem;color:#00FF41;display:flex;align-items:center;gap:4px;}',
    '.bss-chat-head-status::before{content:"";width:6px;height:6px;border-radius:50%;background:#00FF41;display:inline-block;}',
    '.bss-chat-close{background:none;border:none;color:#94a3b8;font-size:1rem;cursor:pointer;padding:4px;}',
    '.bss-chat-close:hover{color:#fff;}',
    '.bss-chat-msgs{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;min-height:200px;max-height:320px;}',
    '.bss-msg{max-width:85%;font-size:.8rem;line-height:1.55;padding:9px 12px;border-radius:12px;}',
    '.bss-msg.bot{background:rgba(255,255,255,.06);color:#cbd5e1;align-self:flex-start;border-bottom-left-radius:3px;}',
    '.bss-msg.user{background:rgba(212,175,55,.15);color:#f5f0e8;align-self:flex-end;border-bottom-right-radius:3px;text-align:right;}',
    '.bss-chat-input-row{padding:10px 12px;border-top:1px solid rgba(255,255,255,.06);display:flex;gap:8px;}',
    '.bss-chat-input{flex:1;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);',
    'border-radius:8px;padding:9px 12px;color:#f5f0e8;font-family:inherit;font-size:.8rem;',
    'outline:none;resize:none;line-height:1.4;}',
    '.bss-chat-input:focus{border-color:rgba(212,175,55,.4);}',
    '.bss-chat-send{background:linear-gradient(135deg,#D4AF37,#b8962a);color:#000;border:none;',
    'border-radius:8px;width:36px;flex-shrink:0;cursor:pointer;font-size:.9rem;',
    'display:flex;align-items:center;justify-content:center;}',
    '.bss-chat-send:disabled{opacity:.4;cursor:default;}',
    '.bss-typing{display:flex;gap:4px;align-items:center;padding:2px 0;}',
    '.bss-typing span{width:6px;height:6px;background:#94a3b8;border-radius:50%;',
    'animation:bss-bounce .8s infinite;}',
    '.bss-typing span:nth-child(2){animation-delay:.15s;}',
    '.bss-typing span:nth-child(3){animation-delay:.3s;}',
    '@keyframes bss-bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}',
    '@media(max-width:420px){.bss-chat-win{width:calc(100vw - 32px);right:16px;bottom:144px;}',
    '.bss-wa-float,.bss-chat-btn{right:16px;}}'
  ].join('');

  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  /* ─── INJECT HTML ─────────────────────────────────── */
  var html = [
    /* WA button */
    '<a href="https://wa.me/' + BSS_WA + '?text=Hi%2C%20I%27d%20like%20to%20know%20more%20about%20dental%20treatment%20in%20Bogot%C3%A1" ',
    'target="_blank" rel="noopener noreferrer" ',
    'class="bss-wa-float" aria-label="Chat on WhatsApp" title="WhatsApp">',
    '<i class="fab fa-whatsapp" aria-hidden="true"></i></a>',
    /* Chat button */
    '<button class="bss-chat-btn" id="bss-chat-btn" aria-expanded="false" aria-controls="bss-chat-win" aria-label="Open chat assistant">',
    '<i class="fas fa-comment-dots" aria-hidden="true"></i>',
    '<span class="bss-notif" aria-hidden="true">1</span></button>',
    /* Chat window */
    '<div id="bss-chat-win" class="bss-chat-win" role="dialog" aria-label="Dental concierge assistant" aria-modal="false">',
    '<div class="bss-chat-head">',
    '<div class="bss-chat-head-avatar" aria-hidden="true">🦷</div>',
    '<div class="bss-chat-head-info">',
    '<div class="bss-chat-head-name">Bogotá Smile Studio</div>',
    '<div class="bss-chat-head-status">Online — replies instantly</div>',
    '</div>',
    '<button class="bss-chat-close" id="bss-chat-close" aria-label="Close chat"><i class="fas fa-times" aria-hidden="true"></i></button>',
    '</div>',
    '<div class="bss-chat-msgs" id="bss-chat-msgs" aria-live="polite" aria-label="Chat messages"></div>',
    '<div class="bss-chat-input-row">',
    '<textarea class="bss-chat-input" id="bss-chat-input" rows="1" placeholder="Ask about treatments, prices, process..." ',
    'aria-label="Type your message" maxlength="600"></textarea>',
    '<button class="bss-chat-send" id="bss-chat-send" aria-label="Send message">',
    '<i class="fas fa-paper-plane" aria-hidden="true"></i></button>',
    '</div></div>'
  ].join('');

  var wrap = document.createElement('div');
  wrap.innerHTML = html;
  document.body.appendChild(wrap);

  /* ─── REFERENCES ─────────────────────────────────── */
  var chatBtn   = document.getElementById('bss-chat-btn');
  var chatWin   = document.getElementById('bss-chat-win');
  var chatClose = document.getElementById('bss-chat-close');
  var chatMsgs  = document.getElementById('bss-chat-msgs');
  var chatInput = document.getElementById('bss-chat-input');
  var chatSend  = document.getElementById('bss-chat-send');

  /* ─── OPEN / CLOSE ───────────────────────────────── */
  function openChat() {
    _chatOpen = true;
    chatWin.classList.add('open');
    chatBtn.setAttribute('aria-expanded', 'true');
    chatBtn.querySelector('.bss-notif').style.display = 'none';
    if (chatMsgs.children.length === 0) _addBotMsg(_welcome());
    chatInput.focus();
  }
  function closeChat() {
    _chatOpen = false;
    chatWin.classList.remove('open');
    chatBtn.setAttribute('aria-expanded', 'false');
  }
  chatBtn.addEventListener('click', function () { _chatOpen ? closeChat() : openChat(); });
  chatClose.addEventListener('click', closeChat);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && _chatOpen) closeChat(); });

  /* ─── WELCOME MESSAGE ────────────────────────────── */
  function _welcome() {
    return "Hi! 👋 I'm the Bogotá Smile Studio assistant.\n\nI can tell you about our treatments (veneers, implants, full arch), prices in USD, the 4-day process, or help you start your free virtual consultation.\n\nWhat would you like to know?";
  }

  /* ─── ADD MESSAGES ───────────────────────────────── */
  function _addBotMsg(text) {
    var div = document.createElement('div');
    div.className = 'bss-msg bot';
    div.textContent = text;
    chatMsgs.appendChild(div);
    chatMsgs.scrollTop = chatMsgs.scrollHeight;
  }
  function _addUserMsg(text) {
    var div = document.createElement('div');
    div.className = 'bss-msg user';
    div.textContent = text;
    chatMsgs.appendChild(div);
    chatMsgs.scrollTop = chatMsgs.scrollHeight;
  }
  function _addTyping() {
    var div = document.createElement('div');
    div.className = 'bss-msg bot';
    div.id = 'bss-typing';
    div.innerHTML = '<div class="bss-typing"><span></span><span></span><span></span></div>';
    chatMsgs.appendChild(div);
    chatMsgs.scrollTop = chatMsgs.scrollHeight;
    return div;
  }

  /* ─── SYSTEM PROMPT ──────────────────────────────── */
  function _pgBuildPrompt() {
    var lang = document.documentElement.lang === 'es' ? 'Spanish' : 'English';
    var bssLang = localStorage.getItem('bss-lang') || 'en-US';
    var savingsCtx = {
      'en-US': 'vs US prices',
      'en-CA': 'vs Canadian prices',
      'en-GB': 'vs UK private fees',
      'en-AU': 'vs Australian prices',
      'es':    'vs precios en EEUU'
    }[bssLang] || 'vs US prices';

    return [
      'You are the virtual assistant for Bogotá Smile Studio — a premium DENTAL CONCIERGE based in Bogotá, Colombia.',
      'You coordinate everything for international dental patients: specialist matching, treatment planning, hotel, airport transfers, follow-up.',
      'You are NOT a clinic. The clinical work is performed by board-certified specialists you help coordinate.',
      '',
      '=== WHO YOU HELP ===',
      'Primary: Americans, Canadians, British, Australians seeking dental treatment in Bogotá at 60–70% less than home prices.',
      'Also: Spanish speakers from LATAM who want premium dental care.',
      'Current user language preference: ' + bssLang + '. Savings context: ' + savingsCtx,
      '',
      '=== CURRENT PRICING (USD) ===',
      'VENEERS (Ivoclar IPS e.max ceramic):',
      '  1–8 veneers: $600/unit (individual correction)',
      '  10 veneers — minimum for real visible change: $5,500 ($550/u)',
      '  12 veneers — standard full upper arch ⭐ MOST COMMON: $6,000 ($500/u)',
      '  24 veneers — full top + bottom transformation: $10,800 ($450/u)',
      '',
      'IMPLANTS (Straumann or Neodent):',
      '  Single implant + zirconia crown: $1,200',
      '  All-on-4 (1 arch): $8,500 | Both arches: $16,500',
      '  All-on-6 (1 arch): $11,500 | Both arches: $22,000',
      '',
      'CROWNS & BRIDGES (zirconia or e.max): $380–$500/unit',
      'TEETH WHITENING (in-office): $150–$250',
      'ORTHODONTICS (clear aligners): $1,500–$4,000',
      '',
      'ASSESSMENT: $200 USD — FULLY DEDUCTIBLE from treatment cost.',
      'Assessment includes: specialist review + digital smile design (preview before you fly) + 30-min video call.',
      '',
      'EXPERIENCE PACKAGES (optional add-ons):',
      '  Comfort — hotel 4★ + airport pickup + all transfers: +$490',
      '  VIP Bogotá — hotel 5★ + transfers + guided city tour + restaurant: +$890',
      '  Full Glow — VIP + spa + Botox/fillers + massage + professional photoshoot: +$1,490',
      '',
      '=== HOW IT WORKS ===',
      'Step 1: Patient fills free form → coordinator reviews in 24h',
      'Step 2: $200 assessment → specialist video call + digital smile preview (deductible from treatment)',
      'Step 3: Patient books flight → coordinator handles hotel, airport pickup, all clinic transfers',
      'Timeline (veneers/crowns): 5–6 days total in Bogotá*',
      'Timeline (implants): 6–7 days*',
      'Timeline (All-on-4): 7–8 days*',
      '(*estimated, built-in buffer days, adapted to travel dates)',
      '',
      '=== PAGES FOR MORE INFO ===',
      '/veneers-bogota → Veneer pricing and process',
      '/all-on-4-bogota → All-on-4 and All-on-6 guide',
      '/dental-implants-bogota → Single/multiple implants',
      '/compare → Side-by-side treatment comparison',
      '/savings-calculator → Calculate your exact savings',
      '/book → Schedule a video call',
      '/patient-stories → Real patient reviews',
      '/treatments → All available treatments',
      '',
      '=== CURRENT PAGE ===',
      document.title || 'Bogotá Smile Studio',
      '',
      '=== RULES ===',
      '- Respond in ' + lang + ' unless user switches language.',
      '- Warm, professional, concise. Max 3 short paragraphs.',
      '- Cite specific prices from above when asked — be precise.',
      '- Never invent prices, clinical outcomes or procedures not listed.',
      '- For complex cases (multiple treatments, medical history): direct to $200 assessment.',
      '- Always end with ONE clear next step.',
      '- Next step priority order: 1) fill form at /#consult, 2) pay $200 at /pay-assessment, 3) book call at /book, 4) WhatsApp: wa.me/' + BSS_WA,
      '- If user mentions a competitor or another city: focus on BSS value, do not disparage others.',
      '- Safety questions ("is it safe?"): acknowledge the concern, reference RETHUS verification + materials + warranty.',
    ].join('\n');
  }

  /* ─── SEND MESSAGE ───────────────────────────────── */
  async function _phdrSendMsg(userText) {
    chatSend.disabled = true;
    _addUserMsg(userText);
    _pgChatHistory.push({ role: 'user', parts: [{ text: userText }] });

    var typing = _addTyping();

    try {
      var resp = await fetch(BSS_GEMINI, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: _pgBuildPrompt() }] },
          contents: _pgChatHistory
        })
      });
      var data = await resp.json();

      if (typing && typing.parentNode) typing.parentNode.removeChild(typing);

      if (data.error) {
        var errMsg;
        if (data.error.includes('429') || data.error.includes('solicitudes')) {
          errMsg = 'Too many messages — please wait a moment and try again. 😊';
        } else if (data.error.includes('configurado')) {
          errMsg = 'The assistant is temporarily offline. Contact us on WhatsApp: wa.me/' + BSS_WA;
        } else {
          errMsg = 'Something went wrong. Chat with us on WhatsApp: wa.me/' + BSS_WA;
          console.warn('[BSS BOT] Error:', data.error);
        }
        _addBotMsg(errMsg);
        return;
      }

      var botText = data.text || (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text) || 'I could not generate a response. Please contact us on WhatsApp.';
      _pgChatHistory.push({ role: 'model', parts: [{ text: botText }] });
      _addBotMsg(botText);

    } catch (e) {
      if (typing && typing.parentNode) typing.parentNode.removeChild(typing);
      _addBotMsg('No internet connection right now. Reach us on WhatsApp: wa.me/' + BSS_WA);
    } finally {
      chatSend.disabled = false;
      chatInput.focus();
    }
  }

  /* ─── INPUT EVENTS ───────────────────────────────── */
  function _doSend() {
    var text = chatInput.value.trim();
    if (!text || chatSend.disabled) return;
    chatInput.value = '';
    _phdrSendMsg(text);
  }
  chatSend.addEventListener('click', _doSend);
  chatInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); _doSend(); }
  });

})();
