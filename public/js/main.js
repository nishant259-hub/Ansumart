/* ─────────────────────────────────────────────
   Mahi-Communication – main.js
   Landing Page Interactions
───────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. Navbar scroll shadow ── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });

  /* ── 2. Hamburger mobile menu ── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });

  /* ── 3. Search suggestions ── */
  const searchInput    = document.getElementById('searchInput');
  const suggestions    = document.getElementById('searchSuggestions');
  const PRODUCTS       = [
    '🍎 Fresh Apples',    '🥦 Broccoli',         '🥛 Whole Milk',
    '🥚 Farm Eggs',       '🍗 Halal Chicken',     '🥬 Spinach Bunch',
    '🍌 Bananas (1kg)',   '🧅 Onions',            '🫐 Blueberries',
    '🧀 Cottage Cheese',  '🍅 Tomatoes',          '🥕 Carrots',
    '🍞 Whole Wheat Bread','🫒 Olive Oil',         '🍋 Lemons',
  ];

  function buildSuggestions(val) {
    const q = val.trim().toLowerCase();
    if (!q) { suggestions.classList.remove('open'); return; }
    const matches = PRODUCTS.filter(p => p.toLowerCase().includes(q)).slice(0, 6);
    if (!matches.length) { suggestions.classList.remove('open'); return; }
    suggestions.innerHTML = matches.map(m =>
      `<div class="suggestion-item">
         <i class="fa-solid fa-magnifying-glass" style="color:var(--gray);font-size:.8rem"></i>
         ${m}
       </div>`
    ).join('');
    suggestions.classList.add('open');
    suggestions.querySelectorAll('.suggestion-item').forEach(el => {
      el.addEventListener('mousedown', () => {
        // redirect to login since not logged in
        window.location.href = '/login';
      });
    });
  }

  searchInput?.addEventListener('input', e => buildSuggestions(e.target.value));
  document.addEventListener('click', e => {
    if (!e.target.closest('.search-wrap')) {
      suggestions.classList.remove('open');
    }
  });

  /* ── 4. Cart badge demo (localStorage) ── */
  const cartBadge = document.getElementById('cartBadge');
  let cartCount = parseInt(localStorage.getItem('mahi-communication_cart') || '0');

  function updateBadge() {
    if (cartBadge) {
      cartBadge.textContent = cartCount;
      cartBadge.style.display = cartCount > 0 ? 'flex' : 'none';
    }
  }
  updateBadge();

  // "Add to Cart" buttons → redirect to login (pre-login page)
  document.querySelectorAll('.btn-add').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      // Animate then redirect
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Added!';
      btn.style.background = 'var(--green)';
      btn.style.color = '#fff';
      setTimeout(() => { window.location.href = '/login'; }, 700);
    });
  });

  /* ── 5. Counter animation ── */
  const counters = document.querySelectorAll('.stat-num');

  const countObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target);
      const dur    = 1400;
      const step   = 16;
      const inc    = target / (dur / step);
      let cur      = 0;

      const tick = () => {
        cur = Math.min(cur + inc, target);
        el.textContent = Math.floor(cur);
        if (cur < target) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      countObserver.unobserve(el);
    });
  }, { threshold: .4 });

  counters.forEach(c => countObserver.observe(c));

  /* ── 6. Testimonial dots ── */
  const track = document.getElementById('testimonialsTrack');
  const dotsWrap = document.getElementById('testimDots');
  const cards = track?.querySelectorAll('.testimonial-card');

  if (cards?.length && dotsWrap) {
    cards.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => {
        cards[i].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
      });
      dotsWrap.appendChild(dot);
    });

    const dots = dotsWrap.querySelectorAll('.dot');
    track.addEventListener('scroll', () => {
      const scrollLeft = track.scrollLeft;
      const cardW      = cards[0].offsetWidth + 24; // gap
      const idx        = Math.round(scrollLeft / cardW);
      dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    });
  }

  /* ── 7. Scroll-reveal for sections ── */
  const revealEls = document.querySelectorAll(
    '.cat-card, .product-card, .why-card, .testimonial-card, .stat-item'
  );

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'fadeUp .5s ease both';
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .15 });

  revealEls.forEach(el => {
    el.style.opacity = '0';
    el.style.animation = 'none';
    revealObserver.observe(el);
  });

  /* ── 8. Wishlist heart toggle ── */
  document.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const icon = btn.querySelector('i');
      if (icon.classList.contains('fa-regular')) {
        icon.classList.replace('fa-regular', 'fa-solid');
        btn.style.color = 'var(--red-hi)';
      } else {
        icon.classList.replace('fa-solid', 'fa-regular');
        btn.style.color = '';
      }
    });
  });

  /* ── 9. Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

});


/* ── PWA SERVICE WORKER ── */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(err => console.log('SW registration failed', err));
  });
}
