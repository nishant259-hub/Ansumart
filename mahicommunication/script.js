// ── MAHI COMMUNICATION – script.js ──

// ─── PRODUCT DATABASE ───
const PRODUCTS = [
  // Grocery
  { id:1, name:'Aata (5 kg)',        cat:'grocery',    emoji:'🌾', price:'₹220', old:'₹250', badge:'Bestseller', badgeType:'green', desc:'Chakki fresh atta, ghar ke roti ke liye best.' },
  { id:2, name:'Toor Dal (1 kg)',    cat:'grocery',    emoji:'🫘', price:'₹130', old:'₹150', badge:'Fresh',       badgeType:'green', desc:'Saaf aur moti toor dal, rozana ki zaroorat.' },
  { id:3, name:'Sarso Tel (1 L)',    cat:'grocery',    emoji:'🛢️',  price:'₹180', old:'₹200', badge:'MRP',         badgeType:'amber', desc:'Shudh sarso ka tel, khana pakane ke liye.' },
  { id:4, name:'Namak (1 kg)',       cat:'grocery',    emoji:'🧂', price:'₹25',  old:null,   badge:'Daily Use',   badgeType:'green', desc:'Tata Iodized salt, hamesha available.' },
  { id:5, name:'Chawal (5 kg)',      cat:'grocery',    emoji:'🍚', price:'₹280', old:'₹320', badge:'Popular',     badgeType:'amber', desc:'Govind Bhog chawal, khane mein badhiya.' },

  // Milk & Dairy
  { id:6, name:'Doodh (500 ml)',     cat:'dairy',      emoji:'🥛', price:'₹28',  old:null,   badge:'Taza',        badgeType:'green', desc:'Taza full cream doodh, roz ki zaroorat.' },
  { id:7, name:'Dahi (400 g)',       cat:'dairy',      emoji:'🥣', price:'₹45',  old:'₹50',  badge:'Fresh',       badgeType:'green', desc:'Amul dahi, khane ya lassi ke liye.' },
  { id:8, name:'Paneer (200 g)',     cat:'dairy',      emoji:'🧀', price:'₹90',  old:'₹105', badge:'Available',   badgeType:'amber', desc:'Taza paneer, sabzi aur snacks ke liye.' },
  { id:9, name:'Butter (100 g)',     cat:'dairy',      emoji:'🧈', price:'₹58',  old:null,   badge:'Amul',        badgeType:'green', desc:'Amul salted butter, bread pe lagao.' },

  // Ice Cream
  { id:10, name:'Amul Chocobar',     cat:'icecream',   emoji:'🍫', price:'₹30',  old:null,   badge:'Favourite',   badgeType:'red',   desc:'Sabka pasandida chocolate ice cream bar.' },
  { id:11, name:'Cream Bell Vanilla',cat:'icecream',   emoji:'🍦', price:'₹25',  old:null,   badge:'Cool',        badgeType:'red',   desc:'Meethi vanilla ice cream, garmi mein best.' },
  { id:12, name:'Amul Mango Dolly',  cat:'icecream',   emoji:'🥭', price:'₹35',  old:null,   badge:'Season Hit',  badgeType:'amber', desc:'Aamras se bani lajaab mango ice candy.' },
  { id:13, name:'Kulfi Stick',       cat:'icecream',   emoji:'🍢', price:'₹20',  old:null,   badge:'Desi',        badgeType:'green', desc:'Asli desi kulfi, bacho ki favourite.' },

  // Instant Food
  { id:14, name:'Maggi (70 g)',      cat:'instant',    emoji:'🍜', price:'₹14',  old:null,   badge:'Hit',         badgeType:'red',   desc:'2-minute Maggi noodles, sab ka favourite.' },
  { id:15, name:'Oats (500 g)',      cat:'instant',    emoji:'🥣', price:'₹95',  old:'₹110', badge:'Healthy',     badgeType:'green', desc:'Quaker oats, healthy nashta ke liye.' },
  { id:16, name:'Tomato Soup Sachet',cat:'instant',    emoji:'🍲', price:'₹20',  old:null,   badge:'Ready',       badgeType:'amber', desc:'Knorr tomato soup, jaldi tayyar ho jaata hai.' },
  { id:17, name:'Poha (500 g)',      cat:'instant',    emoji:'🍛', price:'₹35',  old:null,   badge:'Daily',       badgeType:'green', desc:'Saaf patla poha, nashte ke liye perfect.' },

  // Electronics
  { id:18, name:'USB-C Charger',     cat:'electronics',emoji:'🔌', price:'₹199', old:'₹350', badge:'Genuine',     badgeType:'green', desc:'5V/2A fast charging USB-C cable charger.' },
  { id:19, name:'Earphone (Wired)',  cat:'electronics',emoji:'🎧', price:'₹149', old:'₹250', badge:'Clear Sound', badgeType:'amber', desc:'3.5mm stereo earphone with inline mic.' },
  { id:20, name:'Mobile Cable 1m',   cat:'electronics',emoji:'🔋', price:'₹99',  old:'₹180', badge:'Durable',     badgeType:'green', desc:'Braided micro USB / Type-C data cum charging cable.' },
  { id:21, name:'Screen Guard',      cat:'electronics',emoji:'📱', price:'₹79',  old:'₹120', badge:'Fits All',    badgeType:'amber', desc:'Tempered glass screen protector, universal fit.' },

  // Stationery
  { id:22, name:'Classmate Notebook',cat:'stationery', emoji:'📓', price:'₹55',  old:'₹65',  badge:'School',      badgeType:'amber', desc:'172 pages ruled notebook, school ke liye best.' },
  { id:23, name:'Reynolds Pen (Pack of 5)',cat:'stationery',emoji:'🖊️',price:'₹45',old:'₹60', badge:'Smooth',     badgeType:'green', desc:'Blue ballpoint pen, smooth writing experience.' },
  { id:24, name:'Pencil Box Set',    cat:'stationery', emoji:'✏️', price:'₹80',  old:'₹110', badge:'Complete',    badgeType:'amber', desc:'Pencil, eraser, sharpener – sab ek box mein.' },
  { id:25, name:'A4 Paper (100 sheets)',cat:'stationery',emoji:'📄',price:'₹60', old:null,   badge:'Printing',    badgeType:'green', desc:'White A4 sheets for printing and writing.' },
];

const WHATSAPP = '919876543210';

// ─── HELPERS ───
function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
function qsa(sel, ctx) { return [...(ctx || document).querySelectorAll(sel)]; }

// ─── STICKY NAV ───
const navbar = qs('#navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  });
}

// ─── HAMBURGER ───
const hamburger = qs('#hamburger');
const navLinks  = qs('#navLinks');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  qsa('a', navLinks).forEach(a => a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  }));
}

// ─── STATS COUNT-UP (index.html) ───
const counters = qsa('.count');
if (counters.length) {
  const runCount = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const step   = Math.max(1, Math.floor(target / 60));
    let cur = 0;
    const timer = setInterval(() => {
      cur = Math.min(cur + step, target);
      el.textContent = cur;
      if (cur >= target) clearInterval(timer);
    }, 30);
  };
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { runCount(e.target); obs.unobserve(e.target); } });
  }, { threshold: 0.5 });
  counters.forEach(c => obs.observe(c));
}

// ─── PRODUCTS / SHOP PAGE (shop.html) ───
const productsGrid = qs('#productsGrid');
if (productsGrid) {
  let currentCat = 'all';
  let searchVal  = '';

  // Read URL param ?cat=xxx
  const urlCat = new URLSearchParams(window.location.search).get('cat');
  if (urlCat) currentCat = urlCat;

  // Render products
  function renderProducts() {
    const filtered = PRODUCTS.filter(p => {
      const catOk    = currentCat === 'all' || p.cat === currentCat;
      const searchOk = p.name.toLowerCase().includes(searchVal) || p.desc.toLowerCase().includes(searchVal);
      return catOk && searchOk;
    });

    const countEl = qs('#resultCount');
    if (countEl) {
      countEl.textContent = searchVal
        ? `"${searchVal}" ke liye ${filtered.length} product(s) mila`
        : currentCat === 'all'
          ? `Sab ${filtered.length} products dikh rahe hain`
          : `${currentCat} category mein ${filtered.length} products`;
    }

    if (!filtered.length) {
      productsGrid.innerHTML = `
        <div class="no-results">
          <i class="fa-solid fa-box-open"></i>
          <h3>Koi product nahi mila</h3>
          <p>Alag category ya search term try karein.</p>
        </div>`;
      return;
    }

    productsGrid.innerHTML = filtered.map(p => `
      <div class="prod-card">
        <div class="prod-thumb">
          <span>${p.emoji}</span>
          <span class="prod-badge badge-${p.badgeType}">${p.badge}</span>
        </div>
        <div class="prod-body">
          <h3>${p.name}</h3>
          <p>${p.desc}</p>
          <div class="prod-price">
            ${p.price}
            ${p.old ? `<s>${p.old}</s>` : ''}
          </div>
          <button class="btn-enquire" data-name="${p.name}" data-price="${p.price}">
            <i class="fa-brands fa-whatsapp"></i> WhatsApp Par Poochho
          </button>
        </div>
      </div>
    `).join('');

    // Wire enquiry buttons
    qsa('.btn-enquire', productsGrid).forEach(btn => {
      btn.addEventListener('click', () => {
        const name  = btn.dataset.name;
        const price = btn.dataset.price;
        const msg   = `Namaste Mahi Communication!\n\nMujhe *${name}* (approx. ${price}) lena hai. Kya yeh available hai? 🙏`;
        window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank');
      });
    });
  }

  // Filter tabs
  const tabs = qsa('.filter-tab');
  // set active tab from URL param
  if (urlCat) {
    tabs.forEach(t => { t.classList.toggle('active', t.dataset.cat === currentCat); });
  }
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentCat = tab.dataset.cat;
      renderProducts();
    });
  });

  // Search
  const shopSearch = qs('#shopSearch');
  if (shopSearch) {
    shopSearch.addEventListener('input', e => {
      searchVal = e.target.value.toLowerCase().trim();
      renderProducts();
    });
  }

  // Initial render
  renderProducts();
}

// ─── CONTACT FORM → WHATSAPP (contact.html) ───
const msgForm = qs('#msgForm');
if (msgForm) {
  msgForm.addEventListener('submit', e => {
    e.preventDefault();
    const name  = qs('#contactName').value.trim();
    const phone = qs('#contactPhone').value.trim();
    const msg   = qs('#contactMsg').value.trim();

    let text = `Namaste Mahi Communication! 🙏\n\n*Naam:* ${name}\n`;
    if (phone) text += `*Phone:* ${phone}\n`;
    text += `\n*Message:*\n${msg}`;

    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, '_blank');
    msgForm.reset();
  });
}
