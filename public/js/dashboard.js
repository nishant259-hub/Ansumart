// ===== TAB SWITCHING =====
function switchTab(name) {
  document.querySelectorAll('.tab').forEach(t => {
    t.classList.toggle('active', t.dataset.tab === name);
  });
  document.querySelectorAll('.tab-section').forEach(s => {
    s.classList.toggle('active', s.id === name);
  });
}

document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => switchTab(tab.dataset.tab));
});

// ===== GPS LOCATION FETCH =====
async function fetchGPS() {
  const btn    = document.getElementById('gpsBtn');
  const btnTxt = document.getElementById('gpsTxt');
  const status = document.getElementById('gpsStatus');

  if (!navigator.geolocation) {
    status.textContent = '❌ Geolocation not supported.';
    status.className = 'gps-status err';
    return;
  }

  btnTxt.textContent = 'Detecting...';
  btn.classList.add('active');
  status.textContent = '📡 Fetching your location...';
  status.className = 'gps-status';

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const { latitude: lat, longitude: lng } = pos.coords;
      document.getElementById('fLat').value = lat;
      document.getElementById('fLng').value = lng;

      status.textContent = '🌐 Getting address...';

      try {
        const res  = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
          { headers: { 'Accept-Language': 'en' } }
        );
        const data = await res.json();
        const a    = data.address || {};

        const road = [a.road, a.neighbourhood, a.suburb].filter(Boolean).join(', ');
        if (road)         document.getElementById('fLine').value    = road;
        if (a.city || a.town || a.village)
                          document.getElementById('fCity').value    = a.city || a.town || a.village;
        if (a.state)      document.getElementById('fState').value   = a.state;
        if (a.postcode)   document.getElementById('fPincode').value = a.postcode;

        btnTxt.textContent = '✓ Location Detected';
        status.textContent = `📍 ${(a.city || a.town || '')}${a.state ? ', ' + a.state : ''}`;
        status.className = 'gps-status ok';

      } catch {
        btnTxt.textContent = 'Use My Current Location';
        btn.classList.remove('active');
        status.textContent = '⚠️ Could not fetch address — enter manually.';
        status.className = 'gps-status err';
      }
    },
    (err) => {
      btnTxt.textContent = 'Use My Current Location';
      btn.classList.remove('active');
      const msgs = {
        1: '🚫 Permission denied — please allow location access.',
        2: '📡 Location unavailable.',
        3: '⏱️ Request timed out.'
      };
      status.textContent = msgs[err.code] || '❌ Could not get location.';
      status.className = 'gps-status err';
    },
    { timeout: 10000, enableHighAccuracy: true }
  );
}

// ===== ADD TO CART =====
async function addToCart(productId) {
  try {
    const res  = await fetch('/cart/add', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ productId, quantity: 1 })
    });
    const data = await res.json();
    if (res.ok) showToast('Added to cart!', 'green');
    else        showToast(data.message || 'Failed to add.', 'red');
  } catch {
    showToast('Network error.', 'red');
  }
}

// ===== REMOVE WISHLIST =====
async function removeWishlist(productId) {
  try {
    const res = await fetch(`/wishlist/remove/${productId}`, { method: 'DELETE' });
    if (res.ok) {
      document.getElementById(`wc-${productId}`)?.remove();
      showToast('Removed from wishlist.', '');
    } else {
      showToast('Failed to remove.', 'red');
    }
  } catch {
    showToast('Network error.', 'red');
  }
}

// ===== PASSWORD TOGGLE =====
function togglePw(id, btn) {
  const input = document.getElementById(id);
  const icon  = btn.querySelector('i');
  if (input.type === 'password') {
    input.type = 'text';
    icon.classList.replace('fa-eye', 'fa-eye-slash');
  } else {
    input.type = 'password';
    icon.classList.replace('fa-eye-slash', 'fa-eye');
  }
}

// ===== TOAST =====
function showToast(msg, type = '') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = `toast ${type} show`;
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ===== OPEN TAB FROM URL HASH =====
document.addEventListener('DOMContentLoaded', () => {
  const openFromHash = () => {
    const hash = window.location.hash.replace('#', '').trim();
    if (hash && document.getElementById(hash)) {
      switchTab(hash);
      /* Scroll to top of section */
      setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
  };
  openFromHash();
  /* Also handle browser back/forward */
  window.addEventListener('hashchange', openFromHash);
});