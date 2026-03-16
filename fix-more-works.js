const fs = require('fs');
const glob = require('glob');

// This requires 'glob' which might not be installed, so let's just use readdir
const path = require('path');
const dir = path.join(__dirname);

fs.readdirSync(dir).forEach(file => {
  if (file.startsWith('portfolio-single-') && file.endsWith('.html')) {
    let content = fs.readFileSync(path.join(dir, file), 'utf8');
    
    // Replace MORE WORKS title -> More Other cases + button
    content = content.replace(
      /<h2 class="cs-more-title">MORE WORKS<\/h2>/g,
      `<h2 class="cs-more-title">More Other cases</h2>\n      <a href="index.html#portfolio-section" class="cs-view-more-btn">View more works</a>`
    );

    // Replace cards
    // The pattern:
    // <div class="cs-card-img-wrap">
    //   <img src="..." alt="...">
    // </div>
    // <div class="cs-card-info">
    //   <span class="cs-card-tag">...</span>
    //   <h3 class="cs-card-title">...</h3>
    //   <span class="cs-card-year">...</span>
    // </div>
    
    const regex = /<div class="cs-card-img-wrap">([\s\S]*?)<\/div>\s*<div class="cs-card-info">\s*<span class="cs-card-tag">(.*?)<\/span>([\s\S]*?)<\/div>/g;
    
    content = content.replace(regex, `<div class="cs-card-img-wrap">\n          <span class="cs-card-tag">$2</span>$1</div>\n        <div class="cs-card-info">$3</div>`);

    fs.writeFileSync(path.join(dir, file), content, 'utf8');
  }
});
