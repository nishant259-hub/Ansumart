/* AnsuMart – cart.js  |  Full cart logic */

const CART_KEY = 'ansumart_cart';
const FREE_DELIVERY_THRESHOLD = 500;
const DELIVERY_FEE = 40;
const TAX_RATE = 0.05;

const COUPONS = {
  FRESH10: { type: 'percent', value: 10, label: '10% off' },
  HALAL20: { type: 'percent', value: 20, label: '20% off' },
  SAVE50:  { type: 'flat',    value: 50, label: '₹50 off' },
};

let appliedCoupon = null;

/* ── STORAGE ── */
function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const obj = JSON.parse(raw);
    if (!obj || typeof obj !== 'object') return [];
    /* Convert object map → array */
    return Object.keys(obj).map(id => ({
      id,                           /* keep as-is (MongoDB ObjectId string) */
      name:     obj[id].name     || '',
      price:    obj[id].price    || 0,
      img:      obj[id].img      || obj[id].image || '',
      emoji:    obj[id].emoji    || '🛒',
      qty:      obj[id].qty      || 1,
      oldPrice: obj[id].oldPrice || null,
      unit:     obj[id].unit     || '1 pc',
      tag:      obj[id].tag      || '',
    }));
  } catch { return []; }
}
function saveCart(arr) {
  const obj = {};
  arr.forEach(item => {
    obj[item.id] = {
      name:     item.name,
      price:    item.price,
      img:      item.img || item.image || '',
      emoji:    item.emoji || '🛒',
      qty:      item.qty,
      oldPrice: item.oldPrice || null,
      unit:     item.unit || '1 pc',
      tag:      item.tag || '',
    };
  });
  localStorage.setItem(CART_KEY, JSON.stringify(obj));
}



/* ── TOAST ── */
let toastTimer;
function showToast(msg, isError = false) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  const toastIcon = document.getElementById('toastIcon');
  if (!toast) return;
  toastMsg.textContent = msg;
  toast.classList.toggle('error', isError);
  toastIcon.className = isError ? 'fa-solid fa-circle-xmark toast-icon' : 'fa-solid fa-circle-check toast-icon';
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

/* ── HELPERS ── */
function setText(id, val) { const el = document.getElementById(id); if (el) el.textContent = val; }

/* ── NAV BADGE ── */
function updateNavBadge(cart) {
  const badge = document.getElementById('cartBadge');
  if (!badge) return;
  const count = cart.reduce((s, i) => s + i.qty, 0);
  badge.textContent = count;
  badge.style.display = count > 0 ? 'flex' : 'none';
}

/* ── DELIVERY BAR ── */
function updateDeliveryBar(subtotal) {
  const bar = document.getElementById('dpBar');
  const msg = document.getElementById('dpMessage');
  const badge = document.getElementById('dpBadge');
  if (!bar) return;
  const pct = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100);
  bar.style.width = pct + '%';
  if (subtotal >= FREE_DELIVERY_THRESHOLD) {
    if (msg) msg.innerHTML = 'You\'ve unlocked <strong>FREE delivery!</strong> 🎉';
    if (badge) badge.style.display = 'inline-block';
  } else {
    if (msg) msg.innerHTML = 'Add <strong>₹' + (FREE_DELIVERY_THRESHOLD - subtotal) + '</strong> more for FREE delivery!';
    if (badge) badge.style.display = 'none';
  }
}

/* ── ORDER SUMMARY ── */
function updateSummary(cart) {
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const delivery = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const tax = Math.round(subtotal * TAX_RATE);
  let discount = 0;
  if (appliedCoupon && COUPONS[appliedCoupon]) {
    const c = COUPONS[appliedCoupon];
    discount = c.type === 'percent' ? Math.round(subtotal * c.value / 100) : Math.min(c.value, subtotal);
  }
  const total = Math.max(0, subtotal + delivery + tax - discount);

  setText('sumItemCount', cart.reduce((s, i) => s + i.qty, 0));
  setText('sumSubtotal', '₹' + subtotal);
  const delEl = document.getElementById('sumDelivery');
  if (delEl) { delEl.textContent = delivery === 0 ? 'FREE' : '₹' + delivery; delEl.style.color = delivery === 0 ? 'var(--green)' : ''; }
  setText('sumTax', '₹' + tax);
  setText('sumTotal', '₹' + total);

  const discRow = document.getElementById('discountRow');
  if (discRow) discRow.style.display = discount > 0 ? 'flex' : 'none';
  setText('sumDiscount', '-₹' + discount);

  const savingsNote = document.getElementById('savingsNote');
  const savingsAmt = document.getElementById('savingsAmt');
  const saved = discount + (DELIVERY_FEE - delivery);
  if (savingsNote && savingsAmt) {
    savingsNote.style.display = saved > 0 && cart.length > 0 ? 'block' : 'none';
    savingsAmt.textContent = '₹' + saved;
  }

  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) checkoutBtn.disabled = cart.length === 0;
}

/* ── RENDER SUGGESTIONS ── */
function renderSuggestions(cart) {
  const list = document.getElementById('alsoLikeList');
  if (!list) return;

  /* Use server-injected products if available */
  const allProds = window.__CART_PRODUCTS__ || [];
  if (!allProds.length) { list.innerHTML = ''; return; }

  const cartIds = cart.map(i => String(i.id));
  const sugg = allProds.filter(p => !cartIds.includes(String(p._id))).slice(0, 5);

  list.innerHTML = sugg.map(p => {
    const imgSrc = p.images && p.images.length ? p.images[0] : (p.image || '');
    return `
    <div class="also-like-item">
      <div class="al-emoji" style="overflow:hidden;border-radius:8px;">
        ${imgSrc
          ? `<img src="${imgSrc}" alt="${p.title}" style="width:100%;height:100%;object-fit:contain;"
                  onerror="this.parentElement.textContent='🛒'"/>`
          : '🛒'}
      </div>
      <div class="al-info">
        <div class="al-name">${p.title}</div>
        <div class="al-price">₹${p.price}</div>
      </div>
      <button class="al-add-btn"
        data-id="${p._id}"
        data-name="${p.title}"
        data-price="${p.price}"
        data-img="${imgSrc}"
        data-cat="${p.category || ''}"
        title="Add to cart">
        <i class="fa-solid fa-plus"></i>
      </button>
    </div>`;
  }).join('');

  list.querySelectorAll('.al-add-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      window.addToCart({
        id:    btn.dataset.id,
        name:  btn.dataset.name,
        price: +btn.dataset.price,
        img:   btn.dataset.img,
        tag:   btn.dataset.cat,
      });
      btn.innerHTML = '<i class="fa-solid fa-check"></i>';
      btn.style.cssText = 'background:var(--green);color:#fff';
      setTimeout(() => { btn.innerHTML = '<i class="fa-solid fa-plus"></i>'; btn.style.cssText = ''; }, 1000);
    });
  });
}

/* ── RENDER CART ── */
function renderCart() {
  const cart = getCart();
  const list = document.getElementById('cartItemsList');
  const empty = document.getElementById('emptyCart');
  const summary = document.getElementById('orderSummary');
  const clearBtn = document.getElementById('clearCartBtn');
  const countLabel = document.getElementById('cartCountLabel');

  if (!list) return;

  if (cart.length === 0) {
    list.innerHTML = '';
    if (empty) empty.style.display = 'block';
    if (summary) summary.style.opacity = '.4';
    if (clearBtn) clearBtn.style.display = 'none';
    if (countLabel) countLabel.textContent = 'Your cart is empty';
    updateSummary([]);
    updateDeliveryBar(0);
    updateNavBadge([]);
    return;
  }

  if (empty) empty.style.display = 'none';
  if (summary) summary.style.opacity = '1';
  if (clearBtn) clearBtn.style.display = 'flex';
  if (countLabel) {
    const total = cart.reduce((s, i) => s + i.qty, 0);
    countLabel.textContent = total + (total === 1 ? ' item' : ' items') + ' in your cart';
  }

  list.innerHTML = cart.map((item, idx) => {
    const imgSrc = item.img || item.image || '';
    const imgHtml = imgSrc
      ? `<img src="${imgSrc}" alt="${item.name}"
              style="width:100%;height:100%;object-fit:contain;border-radius:8px;"
              onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"
         />
         <span style="display:none;width:100%;height:100%;align-items:center;justify-content:center;font-size:1.6rem;">${item.emoji || '🛒'}</span>`
      : `<span style="display:flex;width:100%;height:100%;align-items:center;justify-content:center;font-size:1.6rem;">${item.emoji || '🛒'}</span>`;

    return `
    <div class="cart-item" id="cart-item-${item.id}" style="animation-delay:${idx * .05}s">
      <div class="item-img" style="cursor:pointer;overflow:hidden;border-radius:10px;" onclick="if('${item.id}') window.location.href='/product/${item.id}'">
        ${imgHtml}
      </div>
      <div class="item-details" style="cursor:pointer;" onclick="if('${item.id}') window.location.href='/product/${item.id}'">
        <span class="item-tag">${item.tag || ''}</span>
        <div class="item-name" title="${item.name}">${item.name}</div>
        <div class="item-unit">${item.unit || ''}</div>
      </div>
      <div class="item-price-col">
        <span class="item-price">₹${item.price}</span>
        ${item.oldPrice ? `<span class="item-old-price">₹${item.oldPrice}</span><span class="item-saving">Save ₹${item.oldPrice - item.price}</span>` : ''}
      </div>
      <div class="qty-stepper">
        <button class="qty-btn qty-minus" data-id="${item.id}" ${item.qty <= 1 ? 'disabled' : ''}>
          <i class="fa-solid fa-minus"></i>
        </button>
        <span class="qty-display">${item.qty}</span>
        <button class="qty-btn qty-plus" data-id="${item.id}" ${item.qty >= 10 ? 'disabled' : ''}>
          <i class="fa-solid fa-plus"></i>
        </button>
      </div>
      <div class="item-actions">
        <span class="item-total">₹${item.price * item.qty}</span>
        <button class="remove-btn" data-id="${item.id}">
          <i class="fa-solid fa-trash"></i> Remove
        </button>
      </div>
    </div>`;
  }).join('');

  list.querySelectorAll('.qty-minus').forEach(b => b.addEventListener('click', () => changeQty(b.dataset.id, -1)));
  list.querySelectorAll('.qty-plus').forEach(b  => b.addEventListener('click', () => changeQty(b.dataset.id, +1)));
  list.querySelectorAll('.remove-btn').forEach(b => b.addEventListener('click', () => removeItem(b.dataset.id)));

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  updateSummary(cart);
  updateDeliveryBar(subtotal);
  renderSuggestions(cart);
  updateNavBadge(cart);
}

/* ── CHANGE QTY ── */
function changeQty(id, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty = Math.min(10, Math.max(1, item.qty + delta));
  saveCart(cart);
  renderCart();
}

/* ── REMOVE ── */
function removeItem(id) {
  const el = document.getElementById('cart-item-' + id);
  if (el) {
    el.classList.add('removing');
    setTimeout(() => {
      saveCart(getCart().filter(i => i.id !== id));
      renderCart();
      showToast('Item removed from cart');
    }, 280);
  }
}

/* ── CLEAR ── */
function clearCart() {
  if (!confirm('Clear your entire cart?')) return;
  saveCart([]);
  appliedCoupon = null;
  const inp = document.getElementById('couponInput');
  const msg = document.getElementById('couponMsg');
  if (inp) { inp.value = ''; inp.disabled = false; }
  if (msg) { msg.textContent = ''; msg.className = 'coupon-msg'; }
  renderCart();
  showToast('Cart cleared!');
}

/* ── COUPON ── */
function applyCoupon() {
  const input = document.getElementById('couponInput');
  const msg   = document.getElementById('couponMsg');
  if (!input || !msg) return;
  const code = input.value.trim().toUpperCase();
  if (!code) { msg.textContent = 'Please enter a coupon code.'; msg.className = 'coupon-msg error'; return; }

  if (!COUPONS[code]) {
    appliedCoupon = null;
    localStorage.removeItem('ansumart_coupon');
    msg.textContent = 'Invalid coupon code. Try FRESH10, HALAL20 or SAVE50.';
    msg.className = 'coupon-msg error';
    updateSummary(getCart());
    return;
  }

  /* One-time use check per user */
  const userId = window.__USER_ID__ || 'guest';
  const usedKey = 'ansumart_used_coupons_' + userId;
  const usedCoupons = JSON.parse(localStorage.getItem(usedKey) || '[]');
  if (usedCoupons.includes(code)) {
    msg.textContent = `"${code}" already used. Each coupon can only be applied once per account.`;
    msg.className = 'coupon-msg error';
    return;
  }

  appliedCoupon = code;
  localStorage.setItem('ansumart_coupon', JSON.stringify({ code, ...COUPONS[code] }));
  msg.textContent = `✓ "${code}" applied — ${COUPONS[code].label}!`;
  msg.className = 'coupon-msg success';
  input.value = code;
  input.disabled = true;
  renderCart();
  showToast('Coupon ' + code + ' applied!');
}

/* ── GLOBAL addToCart (used from other pages) ── */
window.addToCart = function(product) {
  const raw = JSON.parse(localStorage.getItem(CART_KEY) || '{}');
  const id = String(product.id);
  if (raw[id]) {
    raw[id].qty = Math.min(10, (raw[id].qty || 1) + 1);
    showToast((product.name || product.title) + ' quantity updated!');
  } else {
    raw[id] = {
      name:     product.name || product.title || '',
      price:    product.price || 0,
      img:      product.img  || product.image || '',
      emoji:    product.emoji || '🛒',
      qty:      1,
      oldPrice: product.oldPrice || product.mrp || null,
      unit:     product.unit || '1 pc',
      tag:      product.tag  || product.category || '',
    };
    showToast((product.name || product.title) + ' added to cart!');
  }
  localStorage.setItem(CART_KEY, JSON.stringify(raw));
  const cart = getCart();
  updateNavBadge(cart);
  if (document.getElementById('cartItemsList')) renderCart();
  const badge = document.getElementById('cartBadge');
  if (badge) { badge.classList.add('pop'); setTimeout(() => badge.classList.remove('pop'), 300); }
};

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  renderCart();

  document.getElementById('couponBtn')?.addEventListener('click', applyCoupon);
  document.getElementById('couponInput')?.addEventListener('keydown', e => { if (e.key === 'Enter') applyCoupon(); });
  document.querySelectorAll('.coupon-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const inp = document.getElementById('couponInput');
      if (inp && !inp.disabled) { inp.value = chip.dataset.code; applyCoupon(); }
    });
  });
  document.getElementById('clearCartBtn')?.addEventListener('click', clearCart);
  document.getElementById('checkoutBtn')?.addEventListener('click', () => {
    showToast('Redirecting to checkout...');
    setTimeout(() => { window.location.href = '/checkout'; }, 900);
  });

  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => navbar?.classList.toggle('scrolled', window.scrollY > 20));

  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  hamburger?.addEventListener('click', () => { hamburger.classList.toggle('open'); mobileMenu?.classList.toggle('open'); });
});
