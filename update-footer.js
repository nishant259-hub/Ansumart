const fs = require("fs");
const files = fs.readdirSync("./views").filter(f => f.endsWith(".ejs"));
const newText = `<p>� 2026 Mahi-Communication. All rights reserved. Developed by <a href="https://www.linkedin.com/in/nishant-kumar-8a2a3236b" target="_blank" style="color: var(--green, #2d8a4e); font-weight: bold; text-decoration: underline;">Nishant Kumar</a>.</p>`;

files.forEach(f => {
  const p = "./views/" + f;
  let content = fs.readFileSync(p, "utf8");
  const updated = content.replace(/<p>� 2026 Mahi-Communication\. All rights reserved[\s\S]*?<\/p>/, newText);
  if(updated !== content) {
    fs.writeFileSync(p, updated);
    console.log("Updated", f);
  }
});
