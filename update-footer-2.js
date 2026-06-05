const fs = require('fs');

const files = [
  './views/store.ejs',
  './views/shop.ejs',
  './views/checkout.ejs',
  './views/dashboard.ejs',
  './views/Product.ejs'
];

const newText = '<p>© 2026 Mahi-Communication. All rights reserved. Developed by <a href="https://www.linkedin.com/in/nishant-kumar-8a2a3236b" target="_blank" style="color: var(--green, #2d8a4e); font-weight: bold; text-decoration: underline;">Nishant Kumar</a>.</p>';

files.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    // We just replace whatever is inside <div class="footer-bottom"> ... </div>
    const updated = content.replace(/(<div class="footer-bottom">\s*)<p>.*?<\/p>(\s*<\/div>)/, `$1${newText}$2`);
    if (updated !== content) {
      fs.writeFileSync(f, updated);
      console.log('Updated', f);
    } else {
      console.log('Regex did not match in', f);
    }
  }
});
