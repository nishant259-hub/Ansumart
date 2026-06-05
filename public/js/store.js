/* ═══════════════════════════════════════
   Mahi-Communication – store.js  |  Shop Page Logic
   Slider · Products · Cart · Search · Filters
═══════════════════════════════════════ */

/* ──────────────────────────────────────
   PRODUCT CATALOGUE
────────────────────────────────────── */
const STORE_DATA = {

  flash: [
    { id:101, name:'Amul Taaza Milk 1L',       brand:'Amul',        emoji:'🥛', badge:'Halal',  badgeCls:'badge-green', price:62,  old:75  },
    { id:102, name:'Maggi 2-Min Noodles',       brand:'Nestlé',      emoji:'🍜', badge:'HOT',   badgeCls:'badge-red',   price:14,  old:20  },
    { id:103, name:'Kurkure Masala Munch',      brand:'PepsiCo',     emoji:'🍿', badge:'Offer', badgeCls:'badge-amber', price:20,  old:25  },
    { id:104, name:'Coca-Cola 750ml',            brand:'Coca-Cola',   emoji:'🥤', badge:'New',   badgeCls:'badge-blue',  price:45,  old:55  },
    { id:105, name:'Yippee Noodles',             brand:'ITC',         emoji:'🍜', badge:'HOT',   badgeCls:'badge-red',   price:12,  old:18  },
    { id:106, name:'Aashirvaad Milk 500ml',     brand:'Aashirvaad',  emoji:'🥛', badge:'Pure',  badgeCls:'badge-green', price:34,  old:42  },
  ],

  dairy: [
    { id:201, name:'Sudha Toned Milk 1L',       brand:'Sudha',       emoji:'🥛', badge:'Halal', badgeCls:'badge-green', price:55,  old:65  },
    { id:202, name:'Amul Butter 100g',           brand:'Amul',        emoji:'🧈', badge:'Fresh', badgeCls:'badge-green', price:54,  old:60  },
    { id:203, name:'Mother Dairy Curd 400g',    brand:'Mother Dairy',emoji:'🍶', badge:'Pure',  badgeCls:'badge-green', price:42,  old:50  },
    { id:204, name:'Amul Paneer 200g',           brand:'Amul',        emoji:'🧀', badge:'Halal', badgeCls:'badge-green', price:90,  old:110 },
    { id:205, name:'Sudha Lassi 200ml',          brand:'Sudha',       emoji:'🥛', badge:'Fresh', badgeCls:'badge-green', price:28,  old:35  },
    { id:206, name:'Nestlé Munch 50g',           brand:'Nestlé',      emoji:'🍫', badge:'New',   badgeCls:'badge-blue',  price:30,  old:35  },
  ],

  snacks: [
    { id:301, name:"Lay's Classic Salted 40g",  brand:'PepsiCo',     emoji:'🥔', badge:'Offer', badgeCls:'badge-amber', price:20,  old:25  },
    { id:302, name:'Bingo Mad Angles 90g',       brand:'ITC',         emoji:'🍿', badge:'HOT',   badgeCls:'badge-red',   price:30,  old:38  },
    { id:303, name:'Hide & Seek Biscuits',       brand:'Parle',       emoji:'🍪', badge:'New',   badgeCls:'badge-blue',  price:35,  old:42  },
    { id:304, name:'Haldiram Aloo Bhujia 200g', brand:'Haldiram',    emoji:'🥜', badge:'Offer', badgeCls:'badge-amber', price:55,  old:70  },
    { id:305, name:'Oreo Biscuits 120g',         brand:'Cadbury',     emoji:'🍪', badge:'HOT',   badgeCls:'badge-red',   price:30,  old:35  },
    { id:306, name:'Top Ramen Noodles',          brand:'Nissin',      emoji:'🍜', badge:'New',   badgeCls:'badge-blue',  price:14,  old:18  },
  ],

  drinks: [
    { id:401, name:'Maaza Mango 600ml',          brand:'Coca-Cola',   emoji:'🥭', badge:'New',   badgeCls:'badge-blue',  price:40,  old:50  },
    { id:402, name:'Real Fruit Orange 1L',       brand:'Dabur',       emoji:'🍊', badge:'Fresh', badgeCls:'badge-green', price:95,  old:115 },
    { id:403, name:'Sprite 750ml',               brand:'Coca-Cola',   emoji:'🫗', badge:'Cool',  badgeCls:'badge-blue',  price:45,  old:55  },
    { id:404, name:'Frooti Mango 200ml',         brand:'Parle',       emoji:'🧃', badge:'Offer', badgeCls:'badge-amber', price:15,  old:20  },
    { id:405, name:'B Natural Mixed Berry 1L',  brand:'ITC',         emoji:'🍇', badge:'New',   badgeCls:'badge-blue',  price:85,  old:100 },
    { id:406, name:'Limca 750ml',                brand:'Coca-Cola',   emoji:'🥤', badge:'Cool',  badgeCls:'badge-blue',  price:40,  old:50  },
  ],

  icecream: [
    { id:501, name:'Amul Cone 120ml',            brand:'Amul',        emoji:'🍦', badge:'New',   badgeCls:'badge-blue',  price:30,  old:35  },
    { id:502, name:'Kwality Walls Feast Bar',    brand:'HUL',         emoji:'🍫', badge:'HOT',   badgeCls:'badge-red',   price:25,  old:30  },
    { id:503, name:'Havmor Choco Bar',           brand:'Havmor',      emoji:'🍦', badge:'Fresh', badgeCls:'badge-green', price:30,  old:38  },
    { id:504, name:'Mother Dairy Kulfi',         brand:'Mother Dairy',emoji:'🍧', badge:'Pure',  badgeCls:'badge-green', price:40,  old:50  },
    { id:505, name:'Amul Tricone Choco',         brand:'Amul',        emoji:'🍨', badge:'Offer', badgeCls:'badge-amber', price:45,  old:55  },
    { id:506, name:'Naturals Mango Ice Cream',  brand:'Naturals',    emoji:'🥭', badge:'New',   badgeCls:'badge-blue',  price:80,  old:95  },
  ],

  sweets: [
    { id:601, name:'Cadbury Dairy Milk 55g',     brand:'Cadbury',     emoji:'🍫', badge:'HOT',   badgeCls:'badge-red',   price:45,  old:55  },
    { id:602, name:'KitKat 4 Finger',            brand:'Nestlé',      emoji:'🍫', badge:'Offer', badgeCls:'badge-amber', price:40,  old:50  },
    { id:603, name:'Haldiram Gulab Jamun 500g',  brand:'Haldiram',    emoji:'🍮', badge:'Fresh', badgeCls:'badge-green', price:110, old:130 },
    { id:604, name:'Patanjali Honey 500g',       brand:'Patanjali',   emoji:'🍯', badge:'Pure',  badgeCls:'badge-green', price:180, old:210 },
    { id:605, name:'Ferrero Rocher 3pc',         brand:'Ferrero',     emoji:'🍬', badge:'New',   badgeCls:'badge-blue',  price:85,  old:100 },
    { id:606, name:'Mentos Mint 30g',            brand:'Perfetti',    emoji:'🍬', badge:'Offer', badgeCls:'badge-amber', price:10,  old:15  },
  ],

  household: [
    { id:701, name:'Pears Soap 75g',             brand:'HUL',         emoji:'🧼', badge:'Offer', badgeCls:'badge-amber', price:42,  old:55  },
    { id:702, name:'Dettol Hand Wash 220ml',     brand:'Reckitt',     emoji:'🧴', badge:'HOT',   badgeCls:'badge-red',   price:95,  old:115 },
    { id:703, name:'Harpic Power Plus 500ml',   brand:'Reckitt',     emoji:'🪣', badge:'Offer', badgeCls:'badge-amber', price:110, old:130 },
    { id:704, name:'Surf Excel 1kg',             brand:'HUL',         emoji:'🧺', badge:'Fresh', badgeCls:'badge-green', price:195, old:220 },
    { id:705, name:'Vim Dishwash Bar 155g',      brand:'HUL',         emoji:'🍽️', badge:'New',   badgeCls:'badge-blue',  price:22,  old:28  },
    { id:706, name:'Good Knight Liquid Refill',  brand:'Godrej',      emoji:'💡', badge:'Offer', badgeCls:'badge-amber', price:70,  old:85  },
  ],

  electronics: [
    { id:801, name:'Airtel 84-Day SIM',          brand:'Airtel',      emoji:'📶', badge:'New',   badgeCls:'badge-blue',  price:249, old:299 },
    { id:802, name:'boAt Bassheads 100',         brand:'boAt',        emoji:'🎧', badge:'HOT',   badgeCls:'badge-red',   price:399, old:599 },
    { id:803, name:'Jio 28-Day SIM Plan',        brand:'Jio',         emoji:'📱', badge:'Offer', badgeCls:'badge-amber', price:179, old:199 },
    { id:804, name:'Syska LED Bulb 9W',          brand:'Syska',       emoji:'💡', badge:'New',   badgeCls:'badge-blue',  price:89,  old:120 },
    { id:805, name:'Nokia 110 (4G)',             brand:'Nokia',       emoji:'📲', badge:'Fresh', badgeCls:'badge-green', price:1799,old:2199},
    { id:806, name:'Mi Power Bank 10000mAh',    brand:'Xiaomi',      emoji:'🔋', badge:'Offer', badgeCls:'badge-amber', price:799, old:999 },
  ],

};

/* all products flat (for search) */
const ALL_ITEMS = Object.values(STORE_DATA).flat();

/* ──────────────────────────────────────
   (Cart logic is handled by cart.js)
────────────────────────────────────── */

/* ──────────────────────────────────────
   TOAST
────────────────────────────────────── */
let _tt;
function toast(msg){
  const box = document.getElementById('toastMsg');
  const txt = document.getElementById('toastTxt');
  if(!box||!txt) return;
  txt.textContent = msg;
  box.classList.add('show');
  clearTimeout(_tt);
  _tt = setTimeout(() => box.classList.remove('show'), 2600);
}

/* Wishlist management */
let wishlisted = new Set();
try {
  const savedWish = localStorage.getItem('mahi-communication_wishlist');
  if (savedWish) JSON.parse(savedWish).forEach(id => wishlisted.add(id));
} catch(e) {}

function saveWishlist() {
  try { localStorage.setItem('mahi-communication_wishlist', JSON.stringify([...wishlisted])); } catch(e) {}
}

/* ──────────────────────────────────────
   STORE BUTTONS (Wishlist & Add to Cart)
────────────────────────────────────── */
function initStoreButtons() {
  /* sync UI with wishlisted Set */
  document.querySelectorAll('.wish-btn').forEach(btn => {
    const id = btn.dataset.id;
    if (wishlisted.has(id)) {
      btn.classList.add('liked');
      const icon = btn.querySelector('i');
      if (icon) icon.className = 'fa-solid fa-heart';
    }
  });

  /* wishlist toggle */
  document.querySelectorAll('.wish-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const id = btn.dataset.id;
      if (!id) return;

      const nowLiked = !btn.classList.contains('liked');
      
      // Optimistic UI Update
      if (nowLiked) {
        btn.classList.add('liked');
        btn.querySelector('i').className = 'fa-solid fa-heart';
        wishlisted.add(id);
      } else {
        btn.classList.remove('liked');
        btn.querySelector('i').className = 'fa-regular fa-heart';
        wishlisted.delete(id);
      }

      btn.style.transform = 'scale(1.25)';
      setTimeout(() => btn.style.transform = '', 200);

      // Sync with DB
      fetch('/wishlist/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: id })
      })
      .then(r => r.json())
      .then(data => {
        if (!data.ok) {
          // rollback
          if (nowLiked) {
            btn.classList.remove('liked');
            btn.querySelector('i').className = 'fa-regular fa-heart';
            wishlisted.delete(id);
          } else {
            btn.classList.add('liked');
            btn.querySelector('i').className = 'fa-solid fa-heart';
            wishlisted.add(id);
          }
          toast('Failed to update wishlist.');
        } else {
          toast(data.wishlisted ? '❤️ Added to wishlist!' : '🤍 Removed from wishlist');
          saveWishlist();
        }
      })
      .catch(() => {
        // rollback
        if (nowLiked) {
          btn.classList.remove('liked');
          btn.querySelector('i').className = 'fa-regular fa-heart';
          wishlisted.delete(id);
        } else {
          btn.classList.add('liked');
          btn.querySelector('i').className = 'fa-solid fa-heart';
          wishlisted.add(id);
        }
        toast('Network error. Try again.');
      });
    });
  });

  /* add to cart */
  document.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation(); /* prevent card click */
      const product = {
        id:       btn.dataset.id,
        name:     btn.dataset.name,
        emoji:    btn.dataset.emoji || '🛒',
        img:      btn.dataset.img,
        tag:      btn.dataset.badge || '',
        unit:    '1 pc',
        price:   +btn.dataset.price,
        oldPrice: btn.dataset.old ? +btn.dataset.old : null,
      };
      if (typeof window.addToCart === 'function') {
        window.addToCart(product);
      }
      toast(`${product.name} added to cart!`);
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Added!';
      btn.classList.add('added');
      setTimeout(() => {
        btn.innerHTML = '<i class="fa-solid fa-plus"></i> Add to Cart';
        btn.classList.remove('added');
      }, 1300);
    });
  });

  /* wishlist – already stops propagation, safe */

  /* click on card → product detail page */
  document.querySelectorAll('.prod-card').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      const btn = card.querySelector('.add-btn');
      if (!btn) return;
      const id = btn.dataset.id;
      if (id) window.location.href = `/product/${id}`;
    });
  });
}

/* ──────────────────────────────────────
   SLIDER
────────────────────────────────────── */
function initSlider(){
  const track = document.getElementById('slides');
  if(!track) return;
  const dots = document.querySelectorAll('.sl-dot');
  const total = document.querySelectorAll('.slide').length;
  let cur = 0, auto;

  function goTo(n){
    cur = ((n % total) + total) % total;
    track.style.transform = `translateX(-${cur*100}%)`;
    dots.forEach((d,i) => d.classList.toggle('active', i===cur));
  }

  document.getElementById('slPrev')?.addEventListener('click', () => goTo(cur-1));
  document.getElementById('slNext')?.addEventListener('click', () => goTo(cur+1));
  dots.forEach(d => d.addEventListener('click', () => goTo(+d.dataset.i)));

  function startAuto(){ auto = setInterval(() => goTo(cur+1), 5000); }
  function stopAuto (){ clearInterval(auto); }

  startAuto();
  const wrap = document.getElementById('sliderWrap');
  wrap?.addEventListener('mouseenter', stopAuto);
  wrap?.addEventListener('mouseleave', startAuto);

  /* touch swipe */
  let sx = 0;
  track.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, {passive:true});
  track.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - sx;
    if(Math.abs(dx) > 48) goTo(cur + (dx < 0 ? 1 : -1));
  });
}

/* ──────────────────────────────────────
   CATEGORY BAR  →  smooth scroll to section
────────────────────────────────────── */
function initCatBar(){
  const btns = document.querySelectorAll('.cbar-btn');
  const navbar  = document.getElementById('navbar');
  const catBar  = document.getElementById('catBar');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const secId = btn.dataset.section;
      if (!secId) {
        /* "All" → scroll to top */
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const sec = document.getElementById(secId);
      if (!sec) return;
      const offset = (navbar?.offsetHeight || 64) + (catBar?.offsetHeight || 48) + 8;
      const top = sec.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ──────────────────────────────────────
   CATEGORY TILE ACTIVE STATE
────────────────────────────────────── */
function initCatTiles(){
  document.querySelectorAll('.cat-tile').forEach(tile => {
    tile.addEventListener('click', () => {
      document.querySelectorAll('.cat-tile').forEach(t => t.classList.remove('active-cat'));
      tile.classList.add('active-cat');
    });
  });
}

/* ──────────────────────────────────────
   FLASH DEALS COUNTDOWN
────────────────────────────────────── */
function initCountdown(){
  const el = document.getElementById('countdown');
  if(!el) return;
  const now = new Date();
  const end = new Date(now);
  end.setHours(23,59,59,0);
  function tick(){
    const diff = end - new Date();
    if(diff <= 0){ el.textContent = '00:00:00'; return; }
    const h = String(Math.floor(diff/3600000)).padStart(2,'0');
    const m = String(Math.floor((diff%3600000)/60000)).padStart(2,'0');
    const s = String(Math.floor((diff%60000)/1000)).padStart(2,'0');
    el.textContent = `${h}:${m}:${s}`;
  }
  tick();
  setInterval(tick, 1000);
}

/* ──────────────────────────────────────
   SEARCH
────────────────────────────────────── */
function initSearch(){
  const input = document.getElementById('searchInput');
  const drop  = document.getElementById('searchDrop');
  if(!input||!drop) return;

  const names = ALL_ITEMS.map(p => p.name);

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if(!q){ drop.classList.remove('open'); drop.innerHTML=''; return; }
    const matches = names.filter(n => n.toLowerCase().includes(q)).slice(0,7);
    if(!matches.length){ drop.classList.remove('open'); return; }
    drop.innerHTML = matches.map(m =>
      `<li><i class="fa-solid fa-magnifying-glass" style="color:var(--gray);font-size:.75rem"></i>${m}</li>`
    ).join('');
    drop.classList.add('open');
    drop.querySelectorAll('li').forEach((li,i) => {
      li.addEventListener('mousedown', () => {
        input.value = matches[i];
        drop.classList.remove('open');
        window.location.href = '/shop?search=' + encodeURIComponent(matches[i]);
      });
    });
  });

  document.addEventListener('click', e => {
    if(!e.target.closest('.nav-search')) drop.classList.remove('open');
  });

  input.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
      const q = input.value.trim();
      if (q) window.location.href = '/shop?search=' + encodeURIComponent(q);
    }
  });
}

/* ──────────────────────────────────────
   NAVBAR SCROLL + BURGER
────────────────────────────────────── */
function initNav(){
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 20);
  });

  const burger  = document.getElementById('burger');
  const navMob  = document.getElementById('navMobile');
  burger?.addEventListener('click', () => {
    burger.classList.toggle('open');
    navMob?.classList.toggle('open');
  });
}

/* ──────────────────────────────────────
   SCROLL REVEAL
────────────────────────────────────── */
/* ──────────────────────────────────────
   INIT
────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initStoreButtons();
  initSlider();
  initCatBar();
  initCatTiles();
  initCountdown();
  initSearch();
  initNav();
});
