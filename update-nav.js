const fs = require('fs');
const files = ['index.ejs', 'store.ejs', 'shop.ejs', 'cart.ejs', 'checkout.ejs', 'dashboard.ejs', 'Product.ejs'];
const basePath = 'c:/Users/ACER/OneDrive/Desktop/ansumart/views/';

function getNavHtml(activeItem) {
  return `<% if(typeof user !== 'undefined' && user) { %>
<!-- ═══════ BOTTOM NAV (MOBILE) ═══════ -->
<nav class="bottom-nav">
  <a href="/store" class="bnav-item ${activeItem === 'store' || activeItem === 'home' ? 'active' : ''}">
    <i class="fa-solid fa-house"></i>
    <span>Home</span>
  </a>
  <a href="/shop" class="bnav-item ${activeItem === 'shop' ? 'active' : ''}">
    <i class="fa-solid fa-bag-shopping"></i>
    <span>Shop</span>
  </a>
  <a href="/cart" class="bnav-item ${activeItem === 'cart' ? 'active' : ''}">
    <i class="fa-solid fa-cart-shopping"></i>
    <span>Cart</span>
  </a>
  <a href="/profile" class="bnav-item ${activeItem === 'profile' ? 'active' : ''}">
    <i class="fa-solid fa-user"></i>
    <span>Profile</span>
  </a>
</nav>
<% } %>`;
}

files.forEach(file => {
  let p = basePath + file;
  if (!fs.existsSync(p)) return;
  let content = fs.readFileSync(p, 'utf8');
  
  // Remove existing bottom-nav if any
  content = content.replace(/<% if\(typeof user !== 'undefined' && user\) { %>\s*<!-- ═══════ BOTTOM NAV \(MOBILE\) ═══════ -->[\s\S]*?<nav class="bottom-nav">[\s\S]*?<\/nav>\s*<% } %>/g, '');
  content = content.replace(/<!-- ═══════ BOTTOM NAV \(MOBILE\) ═══════ -->[\s\S]*?<nav class="bottom-nav">[\s\S]*?<\/nav>/g, '');
  
  // Determine active item
  let active = '';
  if (file === 'index.ejs') active = 'home';
  else if (file === 'store.ejs') active = 'store';
  else if (file === 'shop.ejs' || file === 'Product.ejs') active = 'shop';
  else if (file === 'cart.ejs' || file === 'checkout.ejs') active = 'cart';
  else if (file === 'dashboard.ejs') active = 'profile';

  let nav = getNavHtml(active);
  
  // Insert before </body> or <script> tags depending on the file
  if (content.includes('</body>')) {
    if (content.includes('<div class="toast-msg"')) {
        content = content.replace('<div class="toast-msg"', nav + '\n\n<div class="toast-msg"');
    } else if (content.includes('<div id="toast"')) {
        content = content.replace('<div id="toast"', nav + '\n\n<div id="toast"');
    } else if (content.includes('<div class="toast"')) {
        content = content.replace('<div class="toast"', nav + '\n\n<div class="toast"');
    } else if (content.includes('<script')) {
        let lastScript = content.lastIndexOf('<script');
        content = content.slice(0, lastScript) + nav + '\n\n' + content.slice(lastScript);
    } else {
        content = content.replace('</body>', nav + '\n</body>');
    }
    fs.writeFileSync(p, content);
    console.log('Updated ' + file);
  }
});
