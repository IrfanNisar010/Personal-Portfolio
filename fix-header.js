const fs = require('fs');
const path = require('path');

const newNav = `  <!-- Back to portfolio nav -->
  <nav class="cs-nav">
    <div class="cs-site-logo">
      <a href="index.html" class="cs-site-logo">Irfan<span>.</span></a>
    </div>
    <div class="cs-nav-right">
      <a href="index.html#contact-section" class="cs-header-glass cs-lets-talk-btn">LET'S TALK</a>
      <a href="index.html" class="cs-header-glass cs-burger-icon" title="Menu">
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
    
    // Match existing <nav class="cs-nav">...</nav>
    const navRegex = /<!-- Back to portfolio nav -->\s*<nav class="cs-nav">[\s\S]*?<\/nav>/g;
    text = text.replace(navRegex, newNav);

    // Update script listener for mouse glow
    text = text.replace(/'\.cs-date-pill, \.cs-back-btn'/g, "'.cs-date-pill, .cs-header-glass'");

    fs.writeFileSync(file, text);
    modified++;
});

console.log(`Updated nav in ${modified} files.`);
