/* ══════════════════════════════════════════
   Mahi-Communication — shop.js
   Features: category sidebar, search, sort,
             add-to-cart, qty control, cart drawer,
             wishlist, free-delivery bar
══════════════════════════════════════════ */

// ─── STATE ───────────────────────────────
const cart      = {};   // { id: { name, price, img, qty } }
const wishlisted = new Set();
let   activeCategory = 'All';
let   searchQuery    = '';
let   sortMode       = 'default';

const FREE_DEL_THRESHOLD = 299;
const DEL_FEE            = 30;

// ─── DOM REFS ─────────────────────────────
const grid         = document.getElementById('productGrid');
const emptyState   = document.getElementById('emptyState');
const catTitle     = document.getElementById('catTitle');
const countBadge   = document.getElementById('productCountBadge');
const searchInput  = document.getElementById('searchInput');
const sortSelect   = document.getElementById('sortSelect');
const cartToggleBtn = document.getElementById('cartToggleBtn');
const cartClose    = document.getElementById('cartClose');
const cartDrawer   = document.getElementById('cartDrawer');
const cartOverlay  = document.getElementById('cartOverlay');
const cartCount    = document.getElementById('cartCount');
const cartSubhead  = document.getElementById('cartSubhead');
const cartBody     = document.getElementById('cartBody');
const cartEmpty    = document.getElementById('cartEmpty');
const cartFoot     = document.getElementById('cartFoot');
const billItems    = document.getElementById('billItems');
const billDel      = document.getElementById('billDel');
const billTotal    = document.getElementById('billTotal');
const fdbarFill    = document.getElementById('fdbarFill');
const fdbarMsg     = document.getElementById('fdbarMsg');
const toast        = document.getElementById('toast');

// ─── ALL CARDS ────────────────────────────
const allCards = Array.from(grid.querySelectorAll('.pcard'));

// ─── CATEGORY FILTER ─────────────────────
document.querySelectorAll('.sbi').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.sbi').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeCategory = btn.dataset.cat;
    searchInput.value = '';
    searchQuery = '';
    applyFilters();
    // scroll product area to top
    document.querySelector('.product-area').scrollTo({ top: 0, behavior: 'smooth' });
  });
});

// ─── SEARCH ──────────────────────────────
searchInput.addEventListener('input', e => {
  searchQuery = e.target.value.toLowerCase().trim();
  // reset sidebar to All when searching
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
  // Filter
  let visible = allCards.filter(card => {
    const catMatch = activeCategory === 'All' || card.dataset.cat === activeCategory;
    const srchMatch = !searchQuery || card.dataset.title.includes(searchQuery);
    return catMatch && srchMatch;
  });

  // Sort
  if (sortMode === 'price-asc') {
    visible.sort((a, b) => +a.dataset.price - +b.dataset.price);
  } else if (sortMode === 'price-desc') {
    visible.sort((a, b) => +b.dataset.price - +a.dataset.price);
  } else if (sortMode === 'name-asc') {
    visible.sort((a, b) => a.dataset.title.localeCompare(b.dataset.title));
  }

  // Hide all first
  allCards.forEach(c => {
    c.style.display = 'none';
    c.style.animationDelay = '0s';
  });

  // Show sorted visible with stagger
  visible.forEach((c, i) => {
    c.style.display = '';
    c.style.animationDelay = Math.min(i * 0.04, 0.4) + 's';
    grid.appendChild(c); // re-insert in sorted order
  });

  // Update heading & count
  const label = activeCategory === 'All' ? 'All Products' : activeCategory;
  catTitle.textContent = searchQuery ? `Results for "${searchInput.value}"` : label;
  countBadge.textContent = `${visible.length} items`;

  // Empty state
  emptyState.classList.toggle('hidden', visible.length > 0);
}

// ─── ADD TO CART ─────────────────────────
grid.addEventListener('click', e => {
  // ADD button
  const addBtn = e.target.closest('.add-btn');
  if (addBtn) {
    const id    = addBtn.dataset.id;
    const name  = addBtn.dataset.name;
    const price = +addBtn.dataset.price;
    const img   = addBtn.dataset.img;
    addToCart(id, name, price, img);
    return;
  }

  // QTY + button (on card)
  const incBtn = e.target.closest('.q-inc');
  if (incBtn) {
    changeCardQty(incBtn.dataset.id, 1);
    return;
  }

  // QTY − button (on card)
  const decBtn = e.target.closest('.q-dec');
  if (decBtn) {
    changeCardQty(decBtn.dataset.id, -1);
    return;
  }

  // Wishlist
  const wishBtn = e.target.closest('.wish-btn');
  if (wishBtn) {
    const id = wishBtn.dataset.id;
    if (wishlisted.has(id)) {
      wishlisted.delete(id);
      wishBtn.classList.remove('active');
      showToast('Removed from wishlist');
    } else {
      wishlisted.add(id);
      wishBtn.classList.add('active');
      showToast('❤️ Added to wishlist!');
    }
  }
});

function addToCart(id, name, price, img) {
  if (cart[id]) {
    cart[id].qty++;
  } else {
    cart[id] = { name, price, img, qty: 1 };
  }
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
  syncCardQtyUI(id);
  renderCart();
}

function syncCardQtyUI(id) {
  const addBtn   = document.querySelector(`.add-btn[data-id="${id}"]`);
  const qtyCtrl  = document.getElementById(`qc-${id}`);
  const qtyNum   = document.getElementById(`qn-${id}`);
  if (!addBtn || !qtyCtrl) return;
  if (cart[id]) {
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

  // Topbar count
  cartCount.textContent = count;

  // Drawer head
  cartSubhead.textContent = `${count} item${count !== 1 ? 's' : ''}`;

  // Free delivery bar
  const pct = Math.min((total / FREE_DEL_THRESHOLD) * 100, 100);
  fdbarFill.style.width = pct + '%';
  if (total >= FREE_DEL_THRESHOLD) {
    fdbarMsg.innerHTML = '🎉 You get <strong>FREE delivery!</strong>';
  } else {
    fdbarMsg.innerHTML = `Add ₹${FREE_DEL_THRESHOLD - total} more for <strong>FREE delivery</strong>`;
  }

  // Cart body
  if (ids.length === 0) {
    cartEmpty.style.display = '';
    cartFoot.classList.add('hidden');
    // remove all .ci elements
    cartBody.querySelectorAll('.ci').forEach(el => el.remove());
    return;
  }

  cartEmpty.style.display = 'none';
  cartFoot.classList.remove('hidden');

  // Build items
  // Remove existing .ci, then re-add
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

  // Bill
  const delFee = total >= FREE_DEL_THRESHOLD ? 0 : DEL_FEE;
  billItems.textContent = `₹${total}`;
  billDel.textContent   = delFee === 0 ? 'FREE 🎉' : `₹${delFee}`;
  billTotal.textContent = `₹${total + delFee}`;
}

// Cart drawer item clicks (dec/inc)
cartBody.addEventListener('click', e => {
  const inc = e.target.closest('.ci-inc');
  const dec = e.target.closest('.ci-dec');
  if (inc) { changeCardQty(inc.dataset.id, 1); }
  if (dec) { changeCardQty(dec.dataset.id, -1); }
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

// scroll-reveal on product cards
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
