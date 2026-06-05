const fs = require('fs');
const path = require('path');

const viewsDir = path.join(__dirname, 'views');
const files = fs.readdirSync(viewsDir).filter(f => f.endsWith('.ejs'));

const poweredHtml = `\n<div class="powered-by-mahi" style="font-size: 0.55rem; font-weight: 900; font-family: 'Playfair Display', serif; color: #f5a623; letter-spacing: 0.5px; text-transform: uppercase; margin-top: -2px; text-align: center; line-height: 1;">Powered by Mahi Communication</div>`;

files.forEach(file => {
    let p = path.join(viewsDir, file);
    let content = fs.readFileSync(p, 'utf8');
    let original = content;

    // Pattern 1: <a href="/" class="logo"> ... </a>
    const logoRegex = /(<a\s+[^>]*class="logo"[^>]*>[\s\S]*?<\/a>)/g;
    content = content.replace(logoRegex, (match) => {
        if (match.includes('powered-by-mahi')) return match;
        return `<div class="logo-wrapper" style="display: flex; flex-direction: column; align-items: flex-start;">\n${match}${poweredHtml}\n</div>`;
    });

    // Pattern 2: <a href="/" class="brand">🛒 <span>AnsuMart</span></a>
    const brandRegex = /(<a\s+[^>]*class="brand"[^>]*>[\s\S]*?<\/a>)/g;
    content = content.replace(brandRegex, (match) => {
        if (match.includes('powered-by-mahi')) return match;
        return `<div class="logo-wrapper" style="display: flex; flex-direction: column; align-items: flex-start;">\n${match}${poweredHtml}\n</div>`;
    });

    // Pattern 3: <span class="brand-name">AnsuMart</span>
    const brandNameRegex = /(<span\s+class="brand-name">[\s\S]*?<\/span>)/g;
    content = content.replace(brandNameRegex, (match) => {
        if (match.includes('powered-by-mahi')) return match;
        return `<div class="logo-wrapper" style="display: flex; flex-direction: column; align-items: center;">\n${match}${poweredHtml}\n</div>`;
    });

    // Pattern 4: <div class="sb-brand">🛒 AnsuMart <span>Admin Panel</span></div>
    const sbBrandRegex = /(<div\s+class="sb-brand">[\s\S]*?<\/div>)/g;
    content = content.replace(sbBrandRegex, (match) => {
        if (match.includes('powered-by-mahi')) return match;
        return `<div class="logo-wrapper" style="display: flex; flex-direction: column; align-items: flex-start;">\n${match}${poweredHtml}\n</div>`;
    });

    if (content !== original) {
        fs.writeFileSync(p, content);
        console.log(`Updated ${file}`);
    }
});
