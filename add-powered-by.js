const fs = require('fs');
const path = require('path');

const viewsDir = path.join(__dirname, 'views');
const files = fs.readdirSync(viewsDir).filter(f => f.endsWith('.ejs'));

const poweredHtml = `\n<div class="powered-by-mahi" style="font-size: 0.55rem; font-weight: bold; font-style: italic; font-family: 'Playfair Display', serif; color: black; letter-spacing: 0.5px; text-transform: uppercase; margin-top: -2px; text-align: center; line-height: 1;">Powered by Mahi-Communication</div>`;

files.forEach(file => {
    let p = path.join(viewsDir, file);
    let content = fs.readFileSync(p, 'utf8');
    let original = content;

    // 1. Remove all existing powered-by-mahi tags
    content = content.replace(/<div class="powered-by-mahi"[\s\S]*?<\/div>\n?/g, '');

    // 2. Unwrap any existing logo-wrapper divs
    const wrapperRegex1 = /<div class="logo-wrapper"[^>]*>\s*(<a\s+[^>]*class="(?:logo|brand)"[^>]*>[\s\S]*?<\/a>)\s*<\/div>/g;
    const wrapperRegex2 = /<div class="logo-wrapper"[^>]*>\s*(<span\s+class="brand-name">[\s\S]*?<\/span>)\s*<\/div>/g;
    const wrapperRegex3 = /<div class="logo-wrapper"[^>]*>\s*(<div\s+class="sb-brand">[\s\S]*?<\/div>)\s*<\/div>/g;

    let prev;
    do {
        prev = content;
        content = content.replace(wrapperRegex1, '$1');
        content = content.replace(wrapperRegex2, '$1');
        content = content.replace(wrapperRegex3, '$1');
    } while (content !== prev);

    // 3. Re-apply the wrappers with the new poweredHtml
    const logoRegex = /(<a\s+[^>]*class="logo"[^>]*>[\s\S]*?<\/a>)/g;
    content = content.replace(logoRegex, (match) => {
        return `<div class="logo-wrapper" style="display: flex; flex-direction: column; align-items: flex-start;">\n${match}${poweredHtml}\n</div>`;
    });

    const brandRegex = /(<a\s+[^>]*class="brand"[^>]*>[\s\S]*?<\/a>)/g;
    content = content.replace(brandRegex, (match) => {
        return `<div class="logo-wrapper" style="display: flex; flex-direction: column; align-items: flex-start;">\n${match}${poweredHtml}\n</div>`;
    });

    const brandNameRegex = /(<span\s+class="brand-name">[\s\S]*?<\/span>)/g;
    content = content.replace(brandNameRegex, (match) => {
        return `<div class="logo-wrapper" style="display: flex; flex-direction: column; align-items: center;">\n${match}${poweredHtml}\n</div>`;
    });

    const sbBrandRegex = /(<div\s+class="sb-brand">[\s\S]*?<\/div>)/g;
    content = content.replace(sbBrandRegex, (match) => {
        return `<div class="logo-wrapper" style="display: flex; flex-direction: column; align-items: flex-start;">\n${match}${poweredHtml}\n</div>`;
    });

    if (content !== original) {
        fs.writeFileSync(p, content);
        console.log(`Updated ${file}`);
    }
});
