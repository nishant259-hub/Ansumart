/* ══════════════════════════════════════════
   AnsuMart — product.js
   Product detail page: gallery, qty, cart, wishlist
══════════════════════════════════════════ */

// ─── CART STATE (synced with localStorage) ────
let cart = {};
let wishlisted = new Set();

try {
  const saved = localStorage.getItem('ansumart_cart');
  if (saved) cart = JSON.parse(saved);
  const savedWish = localStorage.getItem('ansumart_wishlist');
  if (savedWish) wishlisted = new Set(JSON.parse(savedWish));
} catch (e) { }

function saveCart() {
  try { localStorage.setItem('ansumart_cart', JSON.stringify(cart)); } catch (e) { }
}
function saveWishlist() {
  try { localStorage.setItem('ansumart_wishlist', JSON.stringify([...wishlisted])); } catch (e) { }
}

const FREE_DEL_THRESHOLD = 499;
const DEL_FEE = 40;

// ─── DOM REFS ─────────────────────────────
const mainImg = document.getElementById('mainImg');
const thumbs = document.querySelectorAll('.gallery-thumbs .thumb');
const qsDec = document.getElementById('qsDec');
const qsInc = document.getElementById('qsInc');
const qsNum = document.getElementById('qsNum');
const addCartBtn = document.getElementById('addCartBtn');
const wishToggle = document.getElementById('wishToggle');
const cartToggleBtn = document.getElementById('cartToggleBtn');
const cartClose = document.getElementById('cartClose');
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const cartCount = document.getElementById('cartCount');
const cartSubhead = document.getElementById('cartSubhead');
const cartBody = document.getElementById('cartBody');
const cartEmpty = document.getElementById('cartEmpty');
const cartFoot = document.getElementById('cartFoot');
const billItems = document.getElementById('billItems');
const billDel = document.getElementById('billDel');
const billTotal = document.getElementById('billTotal');
const fdbarFill = document.getElementById('fdbarFill');
const fdbarMsg = document.getElementById('fdbarMsg');
const toast = document.getElementById('toast');

// ─── GALLERY LOGIC ─────────────────────────
thumbs.forEach(thumb => {
  thumb.addEventListener('click', () => {
    mainImg.style.opacity = '0';
    mainImg.style.transform = 'scale(0.95)';
    setTimeout(() => {
      mainImg.src = thumb.dataset.src;
      mainImg.style.transition = 'opacity 0.3s, transform 0.3s';
      mainImg.style.opacity = '1';
      mainImg.style.transform = 'scale(1)';
    }, 150);
    thumbs.forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
  });
});

// ─── QTY STEPPER ──────────────────────────
let qty = 1;
function updateQtyDisplay() { qsNum.textContent = qty; }

qsDec.addEventListener('click', () => {
  if (qty > 1) { qty--; updateQtyDisplay(); }
});
qsInc.addEventListener('click', () => {
  qty++;
  updateQtyDisplay();
});

// ─── ADD TO CART ──────────────────────────
addCartBtn.addEventListener('click', () => {
  const id = addCartBtn.dataset.id;
  const name = addCartBtn.dataset.name;
  const price = +addCartBtn.dataset.price;
  const img = addCartBtn.dataset.img;

  if (cart[id]) {
    cart[id].qty += qty;
  } else {
    cart[id] = { name, price, img, qty };
  }

  saveCart();
  renderCart();
  showToast(`✅ ${qty}× ${name.substring(0, 25)}… added!`);
  openCart();

  // Button feedback
  addCartBtn.textContent = '✅ Added!';
  addCartBtn.classList.add('added');
  setTimeout(() => {
    addCartBtn.textContent = '🛒 Add to Cart';
    addCartBtn.classList.remove('added');
  }, 1500);
});

// ─── WISHLIST ─────────────────────────────
if (wishToggle) {
  const pid = wishToggle.dataset.id;
  if (wishlisted.has(pid)) wishToggle.classList.add('active');

  wishToggle.addEventListener('click', () => {
    if (wishlisted.has(pid)) {
      wishlisted.delete(pid);
      wishToggle.classList.remove('active');
      showToast('Removed from wishlist');
    } else {
      wishlisted.add(pid);
      wishToggle.classList.add('active');
      showToast('❤️ Added to wishlist!');
    }
    saveWishlist();
  });
}

// ─── QUICK ADD (suggestions) ─────────────
function quickAdd(id, name, price, img) {
  if (cart[id]) {
    cart[id].qty++;
  } else {
    cart[id] = { name, price: +price, img, qty: 1 };
  }
  saveCart();
  renderCart();
  showToast(`✅ ${name.substring(0, 25)}… added!`);
  openCart();
}
window.quickAdd = quickAdd;

// ─── CART RENDER ─────────────────────────
function renderCart() {
  const ids = Object.keys(cart);
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
  billDel.textContent = delFee === 0 ? 'FREE 🎉' : `₹${delFee}`;
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

// ─── TOAST ───────────────────────────────
let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2000);
}

// ─── INIT ────────────────────────────────
renderCart();