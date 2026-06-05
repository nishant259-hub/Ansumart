const fs = require("fs");
const files = fs.readdirSync("./views").filter(f => f.endsWith(".ejs"));
const newText = `<p>� 2026 Mahi-Communication. All rights reserved. Developed by <a href="https://www.linkedin.com/in/nishant-kumar-8a2a3236b" target="_blank" style="color: #f5a623; font-weight: bold; text-decoration: underline;">Nishant Kumar</a>.</p>`;

files.forEach(f => {
  const p = "./views/" + f;
  let content = fs.readFileSync(p, "utf8");
  const updated = content.replace(/(<div class="footer-bottom">\s*)<p>.*?<\/p>(\s*<\/div>)/, `$1${newText}$2`);
  if(updated !== content) {
    fs.writeFileSync(p, updated);
    console.log("Updated", f);
  }
});
