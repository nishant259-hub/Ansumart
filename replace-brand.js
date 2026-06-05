const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        if (file === 'node_modules' || file === '.git') return;
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(fullPath));
        } else {
            if (fullPath.endsWith('.js') || fullPath.endsWith('.ejs') || fullPath.endsWith('.css') || fullPath.endsWith('.html') || fullPath.endsWith('.md') || fullPath.endsWith('.json')) {
                // skip some files to avoid breaking git or dependencies
                if (file.includes('package.json') || file.includes('package-lock.json') || file === 'replace-brand.js' || file === 'add-powered-by.js') return;
                results.push(fullPath);
            }
        }
    });
    return results;
}

const files = walk(__dirname);

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // 1. Remove all existing powered-by-mahi tags (for EJS files mainly, but safe to run everywhere)
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

    // 3. Replace AnsuMart variations with Mahi-Communication
    
    // Pattern: Ansu<span>Mart</span> -> Mahi<span>Communication</span>
    content = content.replace(/Ansu<span([^>]*)>Mart<\/span>/g, 'Mahi<span$1>Communication</span>');
    
    // Pattern: Ansu<em...>Mart</em> -> Mahi<em...>Communication</em>
    content = content.replace(/Ansu<em([^>]*)>Mart<\/em>/g, 'Mahi<em$1>Communication</em>');
    
    // Plain text replacements
    // Case sensitive AnsuMart and Ansumart
    content = content.replace(/AnsuMart/g, 'Mahi-Communication');
    content = content.replace(/Ansumart/g, 'Mahi-Communication');
    
    // Replace all lowercase ansumart EXCEPT when part of a github URL
    // Use negative lookbehind to avoid replacing github.com/nishant259-hub/ansumart
    // Since lookbehind might not be supported in older node versions, we can use a callback
    content = content.replace(/(github\.com\/[^/]+\/)?ansumart/g, (match, p1) => {
        if (p1) return match; // Keep github URL intact
        return 'mahi-communication';
    });

    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log(`Updated ${file}`);
    }
});
