const fs = require('fs');
const path = require('path');

const newNav = `  <!-- Back to portfolio nav -->
  <nav class="cs-nav">
    <div class="cs-site-logo">
      <a href="index.html" class="cs-site-logo">Irfan<span>.</span></a>
    </div>
    <div class="cs-nav-right">
      <a href="index.html#contact-section" class="cs-header-glass cs-lets-talk-btn">LET'S TALK</a>
      <a href="#" class="cs-header-glass cs-burger-icon" title="Menu" style="cursor: pointer;">
        <span class="cs-burger-line top"></span>
        <span class="cs-burger-line mid"></span>
        <span class="cs-burger-line bot"></span>
      </a>
    </div>
  </nav>`;

const files = fs.readdirSync(__dirname).filter(file => file.startsWith('portfolio-single-') && file.endsWith('.html'));

let modified = 0;

files.forEach(file => {
    let text = fs.readFileSync(file, 'utf8');
    
    const navRegex = /<!-- Back to portfolio nav -->\s*<nav class="cs-nav">[\s\S]*?<\/nav>/g;
    text = text.replace(navRegex, newNav);

    fs.writeFileSync(file, text);
    modified++;
});

console.log(`Updated nav href to # in ${modified} files.`);
