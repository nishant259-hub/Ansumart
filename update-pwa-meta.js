const fs = require("fs");
const files = fs.readdirSync("./views").filter(f => f.endsWith(".ejs"));

const metaTags = `
  <!-- PWA Meta Tags -->
  <link rel="manifest" href="/manifest.json" />
  <meta name="theme-color" content="#2d8a4e" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <meta name="apple-mobile-web-app-title" content="Mahi-Communication" />
  <link rel="apple-touch-icon" href="/image/icon-192.png" />
`;

files.forEach(f => {
  const p = "./views/" + f;
  let content = fs.readFileSync(p, "utf8");
  
  if (!content.includes("manifest.json")) {
    const updated = content.replace("</head>", metaTags + "</head>");
    if (updated !== content) {
      fs.writeFileSync(p, updated);
      console.log("Updated", f);
    }
  }
});
