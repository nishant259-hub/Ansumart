// ===== LOCATION FETCH (GPS + Reverse Geocoding) =====
async function fetchLocation() {
  const btn        = document.getElementById('locateBtn');
  const btnText    = document.getElementById('locateBtnText');
  const status     = document.getElementById('locationStatus');
  const mapPreview = document.getElementById('mapPreview');
  const mapIframe  = document.getElementById('mapIframe');

  if (!navigator.geolocation) {
    setLocationStatus('err', '❌ Geolocation is not supported by your browser.');
    return;
  }

  // Loading state
  btn.classList.add('loading');
  btnText.textContent = 'Fetching location...';
  btn.querySelector('i').className = 'fa fa-spinner fa-spin';
  setLocationStatus('fetching', '📡 Detecting your location...');

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      document.getElementById('latitude').value  = lat;
      document.getElementById('longitude').value = lng;

      setLocationStatus('fetching', '🌐 Fetching address...');

      try {
        // Reverse Geocoding via OpenStreetMap Nominatim (free, no API key needed)
        const res  = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
          { headers: { 'Accept-Language': 'en' } }
        );
        const data = await res.json();
        const addr = data.address || {};

        // Fill fields
        const road    = [addr.road, addr.neighbourhood, addr.suburb].filter(Boolean).join(', ');
        const city    = addr.city || addr.town || addr.village || addr.county || '';
        const state   = addr.state || '';
        const pincode = addr.postcode || '';

        if (road)    document.getElementById('addressLine').value = road;
        if (city)    document.getElementById('city').value        = city;
        if (state)   document.getElementById('state').value       = state;
        if (pincode) document.getElementById('pincode').value     = pincode;

        // Show map
        mapIframe.src = `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
        mapPreview.style.display = 'block';

        // Success state
        btn.classList.remove('loading');
        btn.classList.add('success');
        btn.querySelector('i').className = 'fa fa-circle-check';
        btnText.textContent = 'Location Detected ✓';
        setLocationStatus('ok', `📍 ${data.display_name.split(',').slice(0,3).join(', ')}`);
        clearError('location');

      } catch {
        btn.classList.remove('loading');
        btn.querySelector('i').className = 'fa fa-crosshairs';
        btnText.textContent = 'Use My Current Location';
        setLocationStatus('err', '⚠️ Could not fetch address. Please enter manually.');
        // Still save coords
        document.getElementById('latitude').value  = lat;
        document.getElementById('longitude').value = lng;
      }
    },
    (err) => {
      btn.classList.remove('loading');
      btn.querySelector('i').className = 'fa fa-crosshairs';
      btnText.textContent = 'Use My Current Location';

      const msgs = {
        1: '🚫 Location permission denied. Please allow access or enter manually.',
        2: '📡 Location unavailable. Please enter your address manually.',
        3: '⏱️ Location request timed out. Try again.',
      };
      setLocationStatus('err', msgs[err.code] || '❌ Could not get location.');
    },
    { timeout: 10000, enableHighAccuracy: true }
  );
}

function setLocationStatus(type, msg) {
  const el = document.getElementById('locationStatus');
  el.className = `location-status ${type}`;
  el.textContent = msg;
}


function togglePassword(fieldId, btn) {
  const input = document.getElementById(fieldId);
  const icon  = btn.querySelector('i');
  if (input.type === 'password') {
    input.type = 'text';
    icon.classList.replace('fa-eye', 'fa-eye-slash');
  } else {
    input.type = 'password';
    icon.classList.replace('fa-eye-slash', 'fa-eye');
  }
}

// ===== PASSWORD STRENGTH METER =====
const passwordInput  = document.getElementById('password');
const strengthFill   = document.getElementById('strengthFill');
const strengthLabel  = document.getElementById('strengthLabel');

const strengthLevels = [
  { label: '',          color: '',          width: '0%'   },
  { label: 'Weak',      color: '#ef4444',   width: '25%'  },
  { label: 'Fair',      color: '#f59e0b',   width: '50%'  },
  { label: 'Good',      color: '#3b82f6',   width: '75%'  },
  { label: 'Strong',    color: '#25a244',   width: '100%' },
];

function getStrength(pw) {
  let score = 0;
  if (pw.length >= 8)                score++;
  if (/[A-Z]/.test(pw))              score++;
  if (/[0-9]/.test(pw))              score++;
  if (/[^A-Za-z0-9]/.test(pw))      score++;
  return pw.length === 0 ? 0 : Math.max(1, score);
}

passwordInput.addEventListener('input', () => {
  const level = getStrength(passwordInput.value);
  const s = strengthLevels[level];
  strengthFill.style.width      = s.width;
  strengthFill.style.background = s.color;
  strengthLabel.textContent     = s.label;
  strengthLabel.style.color     = s.color;
});

// ===== FIELD VALIDATORS =====
function showError(fieldId, msg) {
  const el = document.getElementById(fieldId + 'Error');
  if (el) el.textContent = msg;
}
function clearError(fieldId) { showError(fieldId, ''); }

function validateName(value, field) {
  if (!value.trim()) { showError(field, 'This field is required.'); return false; }
  if (value.trim().length < 2) { showError(field, 'Minimum 2 characters.'); return false; }
  clearError(field); return true;
}
function validateEmail(value) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!value.trim()) { showError('email', 'Email is required.'); return false; }
  if (!re.test(value)) { showError('email', 'Enter a valid email address.'); return false; }
  clearError('email'); return true;
}
function validatePhone(value) {
  if (!value.trim()) { clearError('phone'); return true; } // optional
  const re = /^[+]?[\d\s\-]{7,15}$/;
  if (!re.test(value)) { showError('phone', 'Enter a valid phone number.'); return false; }
  clearError('phone'); return true;
}
function validatePassword(value) {
  if (!value) { showError('password', 'Password is required.'); return false; }
  if (value.length < 8) { showError('password', 'Password must be at least 8 characters.'); return false; }
  if (getStrength(value) < 2) { showError('password', 'Password is too weak.'); return false; }
  clearError('password'); return true;
}
function validateConfirm(pw, cpw) {
  if (!cpw) { showError('confirmPassword', 'Please confirm your password.'); return false; }
  if (pw !== cpw) { showError('confirmPassword', 'Passwords do not match.'); return false; }
  clearError('confirmPassword'); return true;
}
function validateTerms(checked) {
  if (!checked) { showError('terms', 'You must accept the terms to continue.'); return false; }
  clearError('terms'); return true;
}

// ===== LIVE VALIDATION =====
document.getElementById('firstName').addEventListener('blur',
  e => validateName(e.target.value, 'firstName'));
document.getElementById('lastName').addEventListener('blur',
  e => validateName(e.target.value, 'lastName'));
document.getElementById('email').addEventListener('blur',
  e => validateEmail(e.target.value));
document.getElementById('phone').addEventListener('blur',
  e => validatePhone(e.target.value));
document.getElementById('password').addEventListener('blur',
  e => validatePassword(e.target.value));
document.getElementById('confirmPassword').addEventListener('blur', e => {
  validateConfirm(document.getElementById('password').value, e.target.value);
});

// ===== FORM SUBMIT =====
document.getElementById('registerForm').addEventListener('submit', function(e) {
  const firstName       = document.getElementById('firstName').value;
  const lastName        = document.getElementById('lastName').value;
  const email           = document.getElementById('email').value;
  const phone           = document.getElementById('phone').value;
  const password        = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const terms           = document.getElementById('terms').checked;

  const valid = [
    validateName(firstName, 'firstName'),
    validateName(lastName, 'lastName'),
    validateEmail(email),
    validatePhone(phone),
    validatePassword(password),
    validateConfirm(password, confirmPassword),
    validateTerms(terms),
  ].every(Boolean);

  if (!valid) {
    e.preventDefault();
    // scroll to first error
    const firstError = document.querySelector('.field-error:not(:empty)');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return;
  }

  // Show loading state
  const btn = document.getElementById('submitBtn');
  btn.classList.add('loading');
  btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Creating Account...';
});

// ===== INPUT CLEAR ERRORS ON TYPING =====
['firstName','lastName','email','phone','password','confirmPassword'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', () => clearError(id));
});
document.getElementById('terms').addEventListener('change', () => clearError('terms'));
