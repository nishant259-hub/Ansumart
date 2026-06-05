/* ─── Mahi-Communication checkout.js ─── */

const CART_KEY    = 'mahi-communication_cart';
const COUPON_KEY  = 'mahi-communication_coupon';
const FREE_AT     = 500;
const DEL_FEE     = 40;
const TAX_RATE    = 0.05;

const COUPONS = {
  FRESH10: { type: 'percent', value: 10 },
  HALAL20: { type: 'percent', value: 20 },
  SAVE50:  { type: 'flat',    value: 50 },
};

/* ── Load cart from localStorage (object → array) ── */
function loadCart() {
  try {
    const raw = JSON.parse(localStorage.getItem(CART_KEY) || '{}');
    if (typeof raw !== 'object' || Array.isArray(raw)) return [];
    return Object.keys(raw).map(id => ({
      id,
      name:     raw[id].name     || '',
      price:    raw[id].price    || 0,
      image:    raw[id].img      || raw[id].image || '',
      quantity: raw[id].qty      || 1,
    }));
  } catch { return []; }
}

/* ── Load applied coupon from localStorage ── */
function loadCoupon() {
  try { return JSON.parse(localStorage.getItem(COUPON_KEY)) || null; }
  catch { return null; }
}

const cart         = loadCart();
const savedCoupon  = loadCoupon();   /* { code, type, value } */

let addrMode = (SERVER_USER.address && SERVER_USER.address.line) ? 'saved' : 'new';

/* ── Render items ── */
function renderItems() {
  const list  = document.getElementById('itemsList');
  const label = document.getElementById('itemLabel');
  if (!list) return;

  if (!cart.length) {
    list.innerHTML = '<p style="text-align:center;color:#9ca3af;padding:20px 0">Cart empty. <a href="/shop" style="color:#25a244">Shop now</a></p>';
    return;
  }
  if (label) label.textContent = `${cart.length} item${cart.length > 1 ? 's' : ''}`;

  list.innerHTML = cart.map(i => `
    <div class="item-row" style="cursor:pointer;" onclick="window.location.href='/product/${i.id}'">
      <img class="item-img" src="${i.image || ''}" alt="${i.name}"
           onerror="this.style.display='none'"/>
      <div class="item-info">
        <div class="item-name">${i.name}</div>
        <div class="item-qty">Qty: ${i.quantity} &nbsp;&middot;&nbsp; ₹${i.price} each</div>
      </div>
      <div class="item-price">₹${i.price * i.quantity}</div>
    </div>
  `).join('');
}

/* ── Calculate & render totals ── */
function calcTotals() {
  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const delivery = subtotal >= FREE_AT ? 0 : DEL_FEE;
  const tax      = Math.round(subtotal * TAX_RATE);

  /* Coupon discount */
  let discount = 0;
  if (savedCoupon && COUPONS[savedCoupon.code]) {
    const c = COUPONS[savedCoupon.code];
    discount = c.type === 'percent'
      ? Math.round(subtotal * c.value / 100)
      : Math.min(c.value, subtotal);
  }

  const total = Math.max(0, subtotal + delivery + tax - discount);

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

  set('sSubtotal', `₹${subtotal}`);

  const delEl = document.getElementById('sDelivery');
  if (delEl) {
    delEl.textContent = delivery === 0 ? 'FREE 🎉' : `₹${delivery}`;
    delEl.style.color = delivery === 0 ? '#25a244' : '';
  }

  set('sTax', `₹${tax}`);

  /* Show coupon row if applicable */
  const discRow = document.getElementById('sDiscountRow');
  const discEl  = document.getElementById('sDiscount');
  if (discRow && discEl) {
    if (discount > 0) {
      discRow.style.display = '';
      discEl.textContent = `-₹${discount}`;
      discEl.style.color = '#e53935';
    } else {
      discRow.style.display = 'none';
    }
  }

  set('sTotal', `₹${total}`);

  const freeNote = document.getElementById('freeNote');
  if (freeNote) freeNote.style.display = delivery === 0 ? 'block' : 'none';

  /* Coupon info banner */
  const cpnBanner = document.getElementById('couponBanner');
  if (cpnBanner) {
    if (savedCoupon && discount > 0) {
      cpnBanner.textContent = `✓ Coupon "${savedCoupon.code}" applied — saving ₹${discount}!`;
      cpnBanner.style.display = 'block';
    } else {
      cpnBanner.style.display = 'none';
    }
  }

  return total;
}

/* ── Address toggle ── */
function toggleAddr(mode) {
  addrMode = mode;
  const form = document.getElementById('newAddrForm');
  if (form) form.style.display = mode === 'new' ? 'flex' : 'none';
}

/* ── Get address ── */
function getAddress() {
  if (addrMode === 'saved') {
    return {
      line:    SERVER_USER.address.line,
      city:    SERVER_USER.address.city,
      state:   SERVER_USER.address.state,
      pincode: SERVER_USER.address.pincode,
      type:    SERVER_USER.address.type || 'home',
      save:    false,
    };
  }
  /* New address form */
  const line    = document.getElementById('aLine')?.value.trim()    || '';
  const city    = document.getElementById('aCity')?.value.trim()    || '';
  const state   = document.getElementById('aState')?.value.trim()   || '';
  const pincode = document.getElementById('aPincode')?.value.trim() || '';
  const type    = document.getElementById('aType')?.value           || 'home';
  const save    = document.getElementById('saveAddr')?.checked      ?? true;
  return { line, city, state, pincode, type, save };
}

/* ── Validate ── */
function validate() {
  const a = getAddress();
  if (!a.line || !a.city || !a.pincode) {
    alert('Please fill in your complete delivery address.');
    return false;
  }
  if (!cart.length) {
    alert('Your cart is empty! Go back and add items.');
    return false;
  }
  return true;
}

/* ── Place Order ── */
async function placeOrder() {
  if (!validate()) return;

  const total   = calcTotals();
  const address = getAddress();
  const btn     = document.getElementById('orderBtn');
  const txt     = document.getElementById('orderBtnTxt');

  if (btn) { btn.classList.add('loading'); btn.disabled = true; }
  if (txt) txt.textContent = 'Placing Order...';

  try {
    const res = await fetch('/checkout/place-order', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: cart.map(i => ({
          id:       i.id,
          name:     i.name,
          price:    i.price,
          quantity: i.quantity,
          image:    i.image || '',
        })),
        totalAmount:  total,
        address,
        saveAddress:  address.save,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      /* Mark coupon as used for this user */
      if (savedCoupon && savedCoupon.code) {
        const uid = window.__USER_ID__ || 'guest';
        const usedKey = 'mahi-communication_used_coupons_' + uid;
        const used = JSON.parse(localStorage.getItem(usedKey) || '[]');
        if (!used.includes(savedCoupon.code)) used.push(savedCoupon.code);
        localStorage.setItem(usedKey, JSON.stringify(used));
      }
      localStorage.removeItem(CART_KEY);
      localStorage.removeItem(COUPON_KEY);
      const oid = document.getElementById('successOId');
      if (oid) oid.textContent = String(data.orderId).slice(-8).toUpperCase();
      const overlay = document.getElementById('successOverlay');
      if (overlay) overlay.style.display = 'flex';
    } else {
      alert(data.message || 'Order failed. Please try again.');
      if (btn) { btn.classList.remove('loading'); btn.disabled = false; }
      if (txt) txt.textContent = 'Place Order (COD)';
    }
  } catch {
    alert('Network error. Please check your connection.');
    if (btn) { btn.classList.remove('loading'); btn.disabled = false; }
    if (txt) txt.textContent = 'Place Order (COD)';
  }
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
  renderItems();
  calcTotals();

  /* Pre-fill name & phone in new address form */
  const nameEl  = document.getElementById('aName');
  const phoneEl = document.getElementById('aPhone');
  if (nameEl && !nameEl.value)
    nameEl.value = `${SERVER_USER.firstName} ${SERVER_USER.lastName}`.trim();
  if (phoneEl && !phoneEl.value)
    phoneEl.value = SERVER_USER.phone || '';

  /* Show new address form if no saved address */
  if (!SERVER_USER.address || !SERVER_USER.address.line) {
    addrMode = 'new';
    const f = document.getElementById('newAddrForm');
    if (f) f.style.display = 'flex';
  }
});
