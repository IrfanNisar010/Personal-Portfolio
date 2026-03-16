const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname);

fs.readdirSync(dir).forEach(file => {
  if (file.startsWith('portfolio-single-') && file.endsWith('.html')) {
    let content = fs.readFileSync(path.join(dir, file), 'utf8');
    
    // Replace MORE WORKS title -> stacked version with outline button
    content = content.replace(
      /<h2 class="cs-more-title">More Other cases<\/h2>\s*<a href="index\.html#portfolio-section" class="cs-view-more-btn">View more works<\/a>/g,
      `<h2 class="cs-more-title">MORE<br>WORKS</h2>\n      <a href="index.html#portfolio-section" class="cs-view-all-btn">\n        SEE ALL\n        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>\n      </a>`
    );

    fs.writeFileSync(path.join(dir, file), content, 'utf8');
  }
});
