/* ══════════════════════════════════════════
   AnsuMart — shop.js  (updated)
   Features: category sidebar, search, sort,
             add-to-cart, qty control, cart drawer,
             wishlist, free-delivery bar,
             localStorage cart persistence
══════════════════════════════════════════ */

// ─── STATE ───────────────────────────────
let cart = {};
const wishlisted = new Set();
let activeCategory = 'All';
let searchQuery    = '';
let sortMode       = 'default';

const FREE_DEL_THRESHOLD = 299;
const DEL_FEE            = 30;

// ─── LOAD CART FROM LOCALSTORAGE ─────────
try {
  const saved = localStorage.getItem('ansumart_cart');
  if (saved) cart = JSON.parse(saved);
  const savedWish = localStorage.getItem('ansumart_wishlist');
  if (savedWish) {
    JSON.parse(savedWish).forEach(id => wishlisted.add(id));
  }
} catch(e) {}

function saveCart() {
  try { localStorage.setItem('ansumart_cart', JSON.stringify(cart)); } catch(e) {}
}
function saveWishlist() {
  try { localStorage.setItem('ansumart_wishlist', JSON.stringify([...wishlisted])); } catch(e) {}
}

// ─── DOM REFS ─────────────────────────────
const grid          = document.getElementById('productGrid');
const emptyState    = document.getElementById('emptyState');
const catTitle      = document.getElementById('catTitle');
const countBadge    = document.getElementById('productCountBadge');
const searchInput   = document.getElementById('searchInput');
const sortSelect    = document.getElementById('sortSelect');
const cartToggleBtn = document.getElementById('cartToggleBtn');
const cartClose     = document.getElementById('cartClose');
const cartDrawer    = document.getElementById('cartDrawer');
const cartOverlay   = document.getElementById('cartOverlay');
const cartCount     = document.getElementById('cartCount');
const cartSubhead   = document.getElementById('cartSubhead');
const cartBody      = document.getElementById('cartBody');
const cartEmpty     = document.getElementById('cartEmpty');
const cartFoot      = document.getElementById('cartFoot');
const billItems     = document.getElementById('billItems');
const billDel       = document.getElementById('billDel');
const billTotal     = document.getElementById('billTotal');
const fdbarFill     = document.getElementById('fdbarFill');
const fdbarMsg      = document.getElementById('fdbarMsg');
const toast         = document.getElementById('toast');

// ─── ALL CARDS ────────────────────────────
const allCards = Array.from(grid.querySelectorAll('.pcard'));

// ─── SYNC WISHLIST UI ON LOAD ─────────────
wishlisted.forEach(id => {
  const wb = document.querySelector(`.wish-btn[data-id="${id}"]`);
  if (wb) wb.classList.add('active');
});

// ─── SYNC CART UI ON LOAD ─────────────────
Object.keys(cart).forEach(id => {
  if (cart[id] && cart[id].qty > 0) {
    syncCardQtyUI(id);
  }
});

// ─── CATEGORY FILTER ─────────────────────
document.querySelectorAll('.sbi').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.sbi').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeCategory = btn.dataset.cat;
    searchInput.value = '';
    searchQuery = '';
    applyFilters();
    document.querySelector('.product-area').scrollTo({ top: 0, behavior: 'smooth' });
  });
});

const urlParams = new URLSearchParams(window.location.search);
const catParam = urlParams.get('cat');
if (catParam) {
  const matchBtn = document.querySelector(`.sbi[data-cat="${catParam}"]`);
  if (matchBtn) {
    document.querySelectorAll('.sbi').forEach(b => b.classList.remove('active'));
    matchBtn.classList.add('active');
    activeCategory = catParam;
  }
}
const searchParam = urlParams.get('search');
if (searchParam) {
  searchInput.value = searchParam;
  searchQuery = searchParam.toLowerCase().trim();
  document.querySelectorAll('.sbi').forEach(b => b.classList.remove('active'));
  document.querySelector('.sbi[data-cat="All"]').classList.add('active');
  activeCategory = 'All';
}

// ─── SEARCH ──────────────────────────────
searchInput.addEventListener('input', e => {
  searchQuery = e.target.value.toLowerCase().trim();
  if (searchQuery) {
    document.querySelectorAll('.sbi').forEach(b => b.classList.remove('active'));
    document.querySelector('.sbi[data-cat="All"]').classList.add('active');
    activeCategory = 'All';
  }
  applyFilters();
});

// ─── SORT ────────────────────────────────
sortSelect.addEventListener('change', e => {
  sortMode = e.target.value;
  applyFilters();
});

// ─── APPLY FILTERS ───────────────────────
function applyFilters() {
  let visible = allCards.filter(card => {
    const catMatch  = activeCategory === 'All' || card.dataset.cat === activeCategory;
    const srchMatch = !searchQuery || card.dataset.title.includes(searchQuery);
    return catMatch && srchMatch;
  });

  if (sortMode === 'price-asc') {
    visible.sort((a, b) => +a.dataset.price - +b.dataset.price);
  } else if (sortMode === 'price-desc') {
    visible.sort((a, b) => +b.dataset.price - +a.dataset.price);
  } else if (sortMode === 'name-asc') {
    visible.sort((a, b) => a.dataset.title.localeCompare(b.dataset.title));
  }

  allCards.forEach(c => {
    c.style.display = 'none';
    c.style.animationDelay = '0s';
  });

  visible.forEach((c, i) => {
    c.style.display = '';
    c.style.animationDelay = Math.min(i * 0.04, 0.4) + 's';
    grid.appendChild(c);
  });

  const label = activeCategory === 'All' ? 'All Products' : activeCategory;
  catTitle.textContent = searchQuery ? `Results for "${searchInput.value}"` : label;
  countBadge.textContent = `${visible.length} items`;
  emptyState.classList.toggle('hidden', visible.length > 0);
}

// ─── ADD TO CART ─────────────────────────
grid.addEventListener('click', e => {
  // Don't process if clicking on the card link area
  if (e.target.closest('.pcard-link') && !e.target.closest('.add-btn') && !e.target.closest('.q-inc') && !e.target.closest('.q-dec') && !e.target.closest('.wish-btn')) {
    return; // Let the link handle navigation
  }

  const addBtn = e.target.closest('.add-btn');
  if (addBtn) {
    e.preventDefault();
    const id    = addBtn.dataset.id;
    const name  = addBtn.dataset.name;
    const price = +addBtn.dataset.price;
    const img   = addBtn.dataset.img;
    addToCart(id, name, price, img);
    return;
  }

  const incBtn = e.target.closest('.q-inc');
  if (incBtn) {
    e.preventDefault();
    changeCardQty(incBtn.dataset.id, 1);
    return;
  }

  const decBtn = e.target.closest('.q-dec');
  if (decBtn) {
    e.preventDefault();
    changeCardQty(decBtn.dataset.id, -1);
    return;
  }

  const wishBtn = e.target.closest('.wish-btn');
  if (wishBtn) {
    e.preventDefault();
    e.stopPropagation();
    const id = wishBtn.dataset.id;

    /* Optimistic UI update */
    const nowWishlisted = !wishlisted.has(id);
    if (nowWishlisted) { wishlisted.add(id); wishBtn.classList.add('active'); }
    else { wishlisted.delete(id); wishBtn.classList.remove('active'); }
    wishBtn.style.transform = 'scale(1.35)';
    setTimeout(() => wishBtn.style.transform = '', 280);

    /* Sync with server */
    fetch('/wishlist/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: id })
    }).then(r => r.json()).then(data => {
      if (!data.ok) {
        /* Rollback on failure */
        if (nowWishlisted) { wishlisted.delete(id); wishBtn.classList.remove('active'); }
        else { wishlisted.add(id); wishBtn.classList.add('active'); }
      } else {
        showToast(data.wishlisted ? '❤️ Added to wishlist!' : '🤍 Removed from wishlist');
        saveWishlist();
      }
    }).catch(() => showToast('Network error. Try again.'));
  }
});

function addToCart(id, name, price, img) {
  if (cart[id]) {
    cart[id].qty++;
  } else {
    cart[id] = { name, price, img, qty: 1 };
  }
  saveCart();
  syncCardQtyUI(id);
  renderCart();
  showToast(`✅ ${name.substring(0, 30)}… added!`);
}

function changeCardQty(id, delta) {
  if (!cart[id]) return;
  cart[id].qty += delta;
  if (cart[id].qty <= 0) {
    delete cart[id];
  }
  saveCart();
  syncCardQtyUI(id);
  renderCart();
}

function syncCardQtyUI(id) {
  const addBtn  = document.querySelector(`.add-btn[data-id="${id}"]`);
  const qtyCtrl = document.getElementById(`qc-${id}`);
  const qtyNum  = document.getElementById(`qn-${id}`);
  if (!addBtn || !qtyCtrl) return;
  if (cart[id] && cart[id].qty > 0) {
    addBtn.style.display = 'none';
    qtyCtrl.classList.remove('hidden');
    qtyNum.textContent = cart[id].qty;
  } else {
    addBtn.style.display = '';
    qtyCtrl.classList.add('hidden');
  }
}

// ─── CART RENDER ─────────────────────────
function renderCart() {
  const ids   = Object.keys(cart);
  const total = ids.reduce((s, id) => s + cart[id].price * cart[id].qty, 0);
  const count = ids.reduce((s, id) => s + cart[id].qty, 0);

  cartCount.textContent = count;
  cartSubhead.textContent = `${count} item${count !== 1 ? 's' : ''}`;

  const pct = Math.min((total / FREE_DEL_THRESHOLD) * 100, 100);
  fdbarFill.style.width = pct + '%';
  if (total >= FREE_DEL_THRESHOLD) {
    fdbarMsg.innerHTML = '🎉 You get <strong>FREE delivery!</strong>';
  } else {
    fdbarMsg.innerHTML = `Add ₹${FREE_DEL_THRESHOLD - total} more for <strong>FREE delivery</strong>`;
  }

  if (ids.length === 0) {
    cartEmpty.style.display = '';
    cartFoot.classList.add('hidden');
    cartBody.querySelectorAll('.ci').forEach(el => el.remove());
    return;
  }

  cartEmpty.style.display = 'none';
  cartFoot.classList.remove('hidden');
  cartBody.querySelectorAll('.ci').forEach(el => el.remove());

  ids.forEach(id => {
    const item = cart[id];
    const ci = document.createElement('div');
    ci.className = 'ci';
    ci.dataset.id = id;
    ci.innerHTML = `
      <img class="ci-img" src="${item.img}" alt="${item.name}"
           onerror="this.src='https://images.pexels.com/photos/4397921/pexels-photo-4397921.jpeg?auto=compress&w=100'"/>
      <div class="ci-info">
        <p class="ci-name">${item.name}</p>
        <p class="ci-price">₹${item.price} × ${item.qty} = ₹${item.price * item.qty}</p>
      </div>
      <div class="ci-qty">
        <button class="ci-dec" data-id="${id}">−</button>
        <span class="ci-n">${item.qty}</span>
        <button class="ci-inc" data-id="${id}">+</button>
      </div>`;
    cartBody.appendChild(ci);
  });

  const delFee = total >= FREE_DEL_THRESHOLD ? 0 : DEL_FEE;
  billItems.textContent = `₹${total}`;
  billDel.textContent   = delFee === 0 ? 'FREE 🎉' : `₹${delFee}`;
  billTotal.textContent = `₹${total + delFee}`;
}

cartBody.addEventListener('click', e => {
  const inc = e.target.closest('.ci-inc');
  const dec = e.target.closest('.ci-dec');
  if (inc) {
    const id = inc.dataset.id;
    if (cart[id]) { cart[id].qty++; saveCart(); renderCart(); }
  }
  if (dec) {
    const id = dec.dataset.id;
    if (cart[id]) {
      cart[id].qty--;
      if (cart[id].qty <= 0) delete cart[id];
      saveCart();
      renderCart();
    }
    // also sync card UI if visible
    syncCardQtyUI(dec.dataset.id);
  }
});

// ─── CART TOGGLE ─────────────────────────
function openCart() {
  cartDrawer.classList.add('open');
  cartOverlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  cartDrawer.classList.remove('open');
  cartOverlay.classList.add('hidden');
  document.body.style.overflow = '';
}

cartToggleBtn.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCart(); });

// ─── CHECKOUT BUTTON ─────────────────────
document.querySelector('.checkout-btn')?.addEventListener('click', () => {
  const ids = Object.keys(cart);
  if (ids.length === 0) {
    showToast('Your cart is empty!');
    return;
  }
  window.location.href = '/checkout';
});

// ─── TOAST ───────────────────────────────
let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2000);
}

// ─── INIT ─────────────────────────────────
applyFilters();
renderCart();

// scroll-reveal
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.animationPlayState = 'running';
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });
allCards.forEach(c => {
  c.style.animationPlayState = 'paused';
  io.observe(c);
});