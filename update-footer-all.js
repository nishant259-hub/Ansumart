const fs = require("fs");
const files = fs.readdirSync("./views").filter(f => f.endsWith(".ejs"));

const newText = `\n      <p>&copy; 2026 Mahi-Communication. All rights reserved. Developed by <a href="https://www.linkedin.com/in/nishant-kumar-8a2a3236b" target="_blank" style="color: #f5a623; font-weight: bold; text-decoration: underline;">Nishant Kumar</a>.</p>\n    `;

files.forEach(f => {
  const p = "./views/" + f;
  let content = fs.readFileSync(p, "utf8");
  
  // Pattern 1: <div class="footer-bottom">...</div>
  let updated = content.replace(/(<div class="footer-bottom">)[\s\S]*?(<\/div>)/, `$1${newText}$2`);
  
  // Pattern 2: <div class="foot-bottom">...</div>
  updated = updated.replace(/(<div class="foot-bottom">)[\s\S]*?(<\/div>)/, `$1${newText}$2`);
  
  if (updated !== content) {
    fs.writeFileSync(p, updated);
    console.log("Updated", f);
  }
});
