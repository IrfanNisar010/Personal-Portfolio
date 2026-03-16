const fs = require('fs');

const files = fs.readdirSync(__dirname).filter(f => f.startsWith('portfolio-single-') && f.endsWith('.html'));

let updated = 0;
files.forEach(file => {
    let text = fs.readFileSync(file, 'utf8');

    // Wrap plain LET'S TALK with shiny-label if not already wrapped
    text = text.replace(
        /class="cs-header-glass cs-lets-talk-btn">LET'S TALK</g,
        'class="cs-header-glass cs-lets-talk-btn"><span class="shiny-label">LET\'S TALK</span'
    );

    // Also add mouse-tracking to header glass elements (for glow border)
    fs.writeFileSync(file, text);
    updated++;
});

console.log(`Updated ${updated} files.`);
