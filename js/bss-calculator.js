/**
 * BSS Interactive Price Calculator v1.0
 * Calcula: tratamiento + paquete = total + ahorro vs USA
 * Inyectable en cualquier página con: BSSCalc.init('#container')
 */
'use strict';

window.BSSCalc = (function() {

  var TREATMENTS = [
    { id:'veneers-1', label:'1–8 veneers (e.max)',          bss:600,    us:2000,   unit:true,  unitLabel:'/veneer' },
    { id:'veneers-10',label:'10 veneers — visible change',  bss:5500,   us:17500  },
    { id:'veneers-12',label:'12 veneers — full arch ⭐',     bss:6000,   us:23000  },
    { id:'veneers-24',label:'24 veneers — full smile',       bss:10800,  us:45000  },
    { id:'allon4-1',  label:'All-on-4 — 1 arch',            bss:8500,   us:25000  },
    { id:'allon4-2',  label:'All-on-4 — both arches',        bss:16500,  us:47500  },
    { id:'allon6-1',  label:'All-on-6 — 1 arch',            bss:11500,  us:31500  },
    { id:'implant-1', label:'Single implant + crown',        bss:1200,   us:5000   },
    { id:'crown-1',   label:'Single zirconia crown',         bss:380,    us:1500,  unit:true,  unitLabel:'/crown' },
    { id:'whitening', label:'In-office whitening',           bss:200,    us:900    },
  ];

  var PACKAGES = [
    { id:'none',    label:'No package — treatment only',  bss:0   },
    { id:'comfort', label:'Comfort (hotel 4★ + transfers)',bss:490 },
    { id:'vip',     label:'VIP Bogotá (hotel 5★ + city tour)', bss:890 },
    { id:'glow',    label:'Full Glow (VIP + spa + botox + photos)', bss:1490 },
  ];

  var css = `
.bss-calc{background:#0d1520;border:1px solid rgba(212,175,55,.2);border-radius:20px;padding:28px;max-width:680px;margin:0 auto;}
.bss-calc-title{font-family:'Playfair Display',serif;font-size:1.3rem;font-weight:700;color:#fff;margin-bottom:4px;text-align:center;}
.bss-calc-sub{font-size:.78rem;color:#94a3b8;text-align:center;margin-bottom:20px;}
.bss-calc-label{font-size:.7rem;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px;display:block;}
.bss-calc select,.bss-calc input[type=number]{width:100%;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:11px 14px;color:#f5f0e8;font-family:inherit;font-size:.86rem;outline:none;margin-bottom:14px;color-scheme:dark;}
.bss-calc select:focus,.bss-calc input:focus{border-color:rgba(212,175,55,.5);}
.bss-calc select option{background:#0d1520;color:#f5f0e8;}
.bss-calc-result{background:linear-gradient(135deg,rgba(212,175,55,.12),rgba(212,175,55,.05));border:1px solid rgba(212,175,55,.28);border-radius:14px;padding:20px;margin-top:4px;}
.bss-calc-result.hidden{display:none;}
.bss-result-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;font-size:.8rem;}
.bss-result-row:last-child{margin-bottom:0;}
.bss-result-lbl{color:#94a3b8;}
.bss-result-val{font-weight:700;color:#f5f0e8;}
.bss-result-val.gold{color:#D4AF37;font-size:.95rem;}
.bss-result-val.red{color:#ef4444;text-decoration:line-through;}
.bss-result-val.neon{color:#00FF41;}
.bss-result-sep{border:none;border-top:1px solid rgba(255,255,255,.06);margin:10px 0;}
.bss-result-total{display:flex;justify-content:space-between;align-items:center;margin-top:8px;}
.bss-result-total-lbl{font-size:.88rem;font-weight:800;color:#fff;}
.bss-result-total-val{font-family:'Playfair Display',serif;font-size:1.8rem;font-weight:900;color:#D4AF37;line-height:1;}
.bss-result-save{background:rgba(0,255,65,.1);border:1px solid rgba(0,255,65,.25);color:#00FF41;border-radius:10px;padding:10px 14px;text-align:center;margin-top:12px;font-size:.78rem;font-weight:700;}
.bss-calc-cta{display:block;width:100%;margin-top:14px;background:linear-gradient(135deg,#D4AF37,#b8962a);color:#000;border:none;border-radius:10px;padding:13px;font-size:.88rem;font-weight:800;cursor:pointer;font-family:inherit;text-align:center;text-decoration:none;}
`;

  function _inject() {
    if (document.getElementById('bss-calc-css')) return;
    var s = document.createElement('style');
    s.id = 'bss-calc-css';
    s.textContent = css;
    document.head.appendChild(s);
  }

  function render(container) {
    _inject();
    var lang = document.documentElement.lang || 'en';
    var isES = lang === 'es';

    container.innerHTML = [
      '<div class="bss-calc">',
        '<div class="bss-calc-title">' + (isES ? '¿Cuánto ahorras?' : 'Calculate Your Savings') + '</div>',
        '<div class="bss-calc-sub">' + (isES ? 'Selecciona tu tratamiento y paquete de experiencia.' : 'Select your treatment and experience package to see the total.') + '</div>',
        '<label class="bss-calc-label" for="bsc-treatment">' + (isES ? 'Tratamiento' : 'Treatment') + '</label>',
        '<select id="bsc-treatment">',
          '<option value="">' + (isES ? '— Elige tu tratamiento —' : '— Select your treatment —') + '</option>',
          TREATMENTS.map(function(t){
            return '<option value="' + t.id + '">' + t.label + (t.unit ? ' (per unit)' : '') + '</option>';
          }).join(''),
        '</select>',
        '<div id="bsc-qty-wrap" style="display:none;">',
          '<label class="bss-calc-label" for="bsc-qty">' + (isES ? 'Cantidad de unidades' : 'Number of units') + '</label>',
          '<input type="number" id="bsc-qty" min="1" max="100" value="1" style="max-width:120px;">',
        '</div>',
        '<label class="bss-calc-label" for="bsc-package">' + (isES ? 'Paquete de experiencia (opcional)' : 'Experience package (optional)') + '</label>',
        '<select id="bsc-package">',
          PACKAGES.map(function(p){
            return '<option value="' + p.id + '">' + p.label + (p.bss > 0 ? ' (+$' + p.bss + ')' : '') + '</option>';
          }).join(''),
        '</select>',
        '<div class="bss-calc-result hidden" id="bsc-result">',
          '<div class="bss-result-row"><span class="bss-result-lbl">' + (isES ? 'Tratamiento en Bogotá' : 'Treatment in Bogotá') + '</span><span class="bss-result-val gold" id="bsc-r-treatment">—</span></div>',
          '<div class="bss-result-row" id="bsc-r-pkg-row" style="display:none;"><span class="bss-result-lbl">' + (isES ? 'Paquete de experiencia' : 'Experience package') + '</span><span class="bss-result-val" id="bsc-r-pkg">—</span></div>',
          '<hr class="bss-result-sep">',
          '<div class="bss-result-total"><span class="bss-result-total-lbl">' + (isES ? 'Total Bogotá' : 'Your Total in Bogotá') + '</span><span class="bss-result-total-val" id="bsc-r-total">$0</span></div>',
          '<div class="bss-result-row" style="margin-top:8px;"><span class="bss-result-lbl">' + (isES ? 'Precio equivalente en EEUU' : 'Equivalent US / Canada price') + '</span><span class="bss-result-val red" id="bsc-r-us">—</span></div>',
          '<div class="bss-result-save" id="bsc-r-save"></div>',
        '</div>',
        '<a href="/#consult" class="bss-calc-cta">' + (isES ? '📋 Empezar mi caso gratis' : '📋 Start My Case — Free') + '</a>',
      '</div>'
    ].join('');

    /* Events */
    var tSel  = container.querySelector('#bsc-treatment');
    var pSel  = container.querySelector('#bsc-package');
    var qIn   = container.querySelector('#bsc-qty');
    var qWrap = container.querySelector('#bsc-qty-wrap');

    function update() {
      var tid = tSel.value;
      var pid = pSel.value;
      var qty = parseInt(qIn.value, 10) || 1;

      if (!tid) { container.querySelector('#bsc-result').classList.add('hidden'); return; }

      var t = TREATMENTS.find(function(x){ return x.id === tid; });
      var p = PACKAGES.find(function(x){ return x.id === pid; });
      if (!t) return;

      /* Show qty input for per-unit items */
      qWrap.style.display = t.unit ? '' : 'none';
      if (!t.unit) qty = 1;

      var tBss = t.bss * qty;
      var tUs  = t.us  * qty;
      var pBss = p ? p.bss : 0;
      var total = tBss + pBss;
      var save  = tUs - tBss;
      var savePct = Math.round((save / tUs) * 100);

      container.querySelector('#bsc-r-treatment').textContent = '$' + tBss.toLocaleString('en-US') + (t.unit ? ' (' + qty + ' ' + t.unitLabel.replace('/','') + 's)' : '');
      var pkgRow = container.querySelector('#bsc-r-pkg-row');
      if (pBss > 0) {
        pkgRow.style.display = '';
        container.querySelector('#bsc-r-pkg').textContent = '+$' + pBss.toLocaleString('en-US');
      } else {
        pkgRow.style.display = 'none';
      }
      container.querySelector('#bsc-r-total').textContent = '$' + total.toLocaleString('en-US') + ' USD';
      container.querySelector('#bsc-r-us').textContent    = '$' + tUs.toLocaleString('en-US') + ' USD';
      container.querySelector('#bsc-r-save').textContent  = (isES ? '✓ Ahorras ' : '✓ You save ') + '$' + save.toLocaleString('en-US') + ' USD (' + savePct + '% ' + (isES ? 'menos que en EEUU' : 'less than US prices') + ')';
      container.querySelector('#bsc-result').classList.remove('hidden');

      /* Fire tracking event */
      if (window.BSSTracker) BSSTracker.track('calculator_used', { treatment: t.label, saving_usd: save });
    }

    tSel.addEventListener('change', update);
    pSel.addEventListener('change', update);
    qIn.addEventListener('input', update);
  }

  function init(selector) {
    var containers = document.querySelectorAll(selector || '.bss-calculator');
    containers.forEach(function(c) { render(c); });
  }

  return { init: init, render: render };
})();
