const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const dir = 'c:\\\\Users\\\\inzr0\\\\OneDrive\\\\Documents\\\\Personal-Portfolio';
const files = [
  'portfolio-single-1.html',
  'portfolio-single-3.html',
  'portfolio-single-4.html',
  'portfolio-single-badminton-app.html',
  'portfolio-single-gemini-clone.html',
  'portfolio-single-guided-pro.html',
  'portfolio-single-revoult-health.html',
  'portfolio-single-shopify-store.html'
];

for(let file of files) {
  const filePath = path.join(dir, file);
  if(!fs.existsSync(filePath)) continue;
  
  // 1. Get original content from latest git HEAD
  let origContent = '';
  try {
     origContent = execSync(`git show HEAD:${file}`, { cwd: dir }).toString();
  } catch(e) {
     console.error("Could not fetch " + file + " from git:");
     continue;
  }
  
  // 2. Extract original slider container
  // We look for: <div class="owl-carousel single-slider"> ... </div>
  let sliderMatch = origContent.match(/<div class="owl-carousel single-slider">([\s\S]*?)<\/div>\s*<\/div>\s*<div class="col-12/);
  if (!sliderMatch) {
      // maybe no col-12 afterwards, let's just match the deepest div
      sliderMatch = origContent.match(/<div class="owl-carousel single-slider">([\s\S]*?)<\/div><!-- End slider -->/); // unlikely
      
      // Let's do a reliable bracket counting or just match up to "</div> </div>"
      // It's wrapped in <div class="col-12 mb-4">
      const colMatch = origContent.match(/<div class="col-12 mb-4">\s*<div class="owl-carousel single-slider">([\s\S]*?)<\/div>\s*<\/div>/);
      if (colMatch) {
          sliderMatch = colMatch;
      } else {
        console.log('Skipping slider parse for ' + file);
        continue;
      }
  }
  
  let origSliderHtml = sliderMatch[1].trim(); // Just the figures inside
  
  // 3. Current modified file
  let currentContent = fs.readFileSync(filePath, 'utf8');
  
  // Replace my dynamically injected fake slider 
  // <section class="cs-hero-visual">...<div class="cs-image-carousel owl-carousel single-slider"> ... </div> ... </section>
  
  // Replacing everything inside <div class="cs-image-carousel... "> </div>
  const replaceRegex = /<div class="cs-image-carousel owl-carousel single-slider">[\s\S]*?<\/div>\s*<\/section>/;
  
  const newSliderWrap = `<div class="cs-image-carousel owl-carousel single-slider">\n` + 
                        origSliderHtml + 
                        `\n    </div>\n  </section>`;
                        
  const finalContent = currentContent.replace(replaceRegex, newSliderWrap);
  
  fs.writeFileSync(filePath, finalContent);
  console.log('Restored original slider inside ' + file);
}
