
/* ══════════════════════════════════════════════════════════
   Mahi-Communication — search.js
   Shared: URL ?cat= → sidebar auto-select + filter trigger
   Works on both /shop (sidebar .sbi) and /store (cat-bar .cbar-btn)
══════════════════════════════════════════════════════════ */

(function () {

  /* ── Map: URL param value → sidebar data-cat value ── */
  /* These match exactly what store.ejs passes as ?cat= */
  const CAT_ALIAS = {
    'instant food':          'Instant Food',
    'drink & juice':         'Drink & Juice',
    'drink &amp; juice':     'Drink & Juice',
    'ice cream':             'Ice Cream',
    'dairy & dairy product': 'Dairy & Dairy product',
    'dairy products':        'Dairy & Dairy product',
    'dairy &amp; dairy product': 'Dairy & Dairy product',
    'chips & namkeen':       'Chips & Namkeen',
    'chips &amp; namkeen':   'Chips & Namkeen',
    'sweets & chocolate':    'Sweets & Chocolate',
    'sweets &amp; chocolate':'Sweets & Chocolate',
    'bath & body':           'Bath & Body',
    'bath &amp; body':       'Bath & Body',
    'household':             'Household',
    'electronic':            'Electronic',
    'electronics':           'Electronic',
    'sim & recharge':        'SIM & Recharge',
    'sim &amp; recharge':    'SIM & Recharge',
    'stationery':            'Stationery',
    'cash withdraw adhar':   'Cash Withdraw Adhar',
    'print notebook':        'Print Notebook',
    'mobile phone':          'Mobile phone',
    'mobiles':               'Mobile phone',
    'all':                   'All',
  };

  /* ── Store page section scroll mapping ── */
  const SECTION_MAP = {
    'Instant Food':          'sec-snacks',
    'Drink & Juice':         'sec-drinks',
    'Ice Cream':             'sec-icecream',
    'Dairy & Dairy product': 'sec-dairy',
    'Chips & Namkeen':       'sec-snacks',
    'Sweets & Chocolate':    'sec-sweets',
    'Bath & Body':           'sec-household',
    'Household':             'sec-household',
    'Electronic':            'sec-electronics',
    'SIM & Recharge':        'sec-electronics',
    'Stationery':            'sec-electronics',
    'Cash Withdraw Adhar':   'sec-electronics',
    'Print Notebook':        'sec-electronics',
    'Mobile phone':          'sec-electronics',
  };

  function run() {
    const params   = new URLSearchParams(window.location.search);
    const catParam = params.get('cat');
    if (!catParam) return;

    const raw      = decodeURIComponent(catParam).trim();
    const lower    = raw.toLowerCase();
    const resolved = CAT_ALIAS[lower] || raw; // canonical name

    /* ─── SHOP PAGE  (/shop)  →  sidebar .sbi buttons ─── */
    const sbiButtons = document.querySelectorAll('.sbi');
    if (sbiButtons.length > 0) {
      let target = null;

      sbiButtons.forEach(btn => {
        const val = (btn.dataset.cat || '').trim();
        if (val === resolved) target = btn;
      });

      /* fuzzy fallback */
      if (!target) {
        sbiButtons.forEach(btn => {
          if (!target) {
            const val = (btn.dataset.cat || '').trim().toLowerCase();
            if (val.includes(lower.split(' ')[0]) || lower.includes(val.split(' ')[0])) {
              target = btn;
            }
          }
        });
      }

      if (target) {
        /* activate visually */
        sbiButtons.forEach(b => b.classList.remove('active'));
        target.classList.add('active');

        /* trigger the filter logic (defined in the original shop.js)   */
        /* shop.js listens to click events on .sbi so dispatch a click  */
        target.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        /* scroll sidebar to show the active item */
        setTimeout(() => {
          target.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }, 80);

        /* update page title */
        const titleEl = document.getElementById('catTitle');
        if (titleEl) titleEl.textContent = resolved === 'All' ? 'All Products' : resolved;
      }

      /* clean URL */
      window.history.replaceState({}, '', window.location.pathname + '?cat=' + encodeURIComponent(raw));
      return;
    }

    /* ─── STORE PAGE  (/store)  →  scroll to section ─── */
    const sectionId = SECTION_MAP[resolved];
    if (sectionId) {
      const navH    = document.querySelector('.navbar')?.offsetHeight || 70;
      const catBarH = document.querySelector('.cat-bar')?.offsetHeight || 48;
      const sec     = document.getElementById(sectionId);
      if (sec) {
        setTimeout(() => {
          const top = sec.getBoundingClientRect().top + window.scrollY - navH - catBarH - 12;
          window.scrollTo({ top, behavior: 'smooth' });
        }, 200);
      }

      /* highlight active cbar-btn */
      const cbarBtns = document.querySelectorAll('.cbar-btn');
      cbarBtns.forEach(b => {
        b.classList.remove('active');
        if (b.dataset.filter === sectionId) b.classList.add('active');
      });
    }
  }

  /* Run after DOM is ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }

})();