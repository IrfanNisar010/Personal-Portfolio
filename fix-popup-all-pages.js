const fs = require('fs');

// Project-specific popup data for each page
const projects = {
  'portfolio-single-3.html': {
    accent: '#D63447',
    popupAccent: '#D63447',
    eyebrow: 'Case Study',
    title: 'Home Screen Customization',
    subtitle: 'UX/UI · Android · Widget Design · December 2023',
    summary: 'A curated exploration of digital aesthetics, transforming the Android homescreen into a canvas of functional art. By harmonising widgets, typography, and colour theory, each layout transcends mere utility to become a cohesive visual narrative using Material You principles.',
    highlights: [
      'Designed modular KWGT widget templates with full dynamic data support',
      'Applied deep colour science and typography hierarchy for editorial feel',
      'Created neumorphic UI language making buttons feel tactile and cinematic',
      '9+ dynamic widgets integrating live data (weather, time, battery, music)',
      '100% custom layouts — no off-the-shelf presets used',
    ],
    liveUrl: 'https://m3.material.io/',
  },
  'portfolio-single-4.html': {
    accent: '#D63447',
    popupAccent: '#D63447',
    eyebrow: 'Case Study',
    title: 'Portfolio Website',
    subtitle: 'Web Design · Full-Stack · Personal Brand',
    summary: 'A personal portfolio built to showcase design and development capabilities with a premium, modern aesthetic. Every section is crafted with micro-animations, glassmorphism, and performance in mind to create a memorable first impression.',
    highlights: [
      'Fully custom design system with glassmorphism and GSAP animations',
      'Responsive across all devices with mobile-first approach',
      'AOS + GSAP scroll-triggered reveal animations throughout',
      'Dark mode design with vibrant accent colours and premium typography',
      'Optimised for fast load times and SEO best practices',
    ],
    liveUrl: '#',
  },
  'portfolio-single-badminton-app.html': {
    accent: '#D63447',
    popupAccent: '#22c55e',
    eyebrow: 'Case Study',
    title: 'Badminton App',
    subtitle: 'Mobile App · UI/UX Design · Sport Tech',
    summary: 'A mobile application designed for badminton enthusiasts to track matches, scores, and player performance. The app combines sports analytics with a clean, fast interface optimised for real-time scoring during live matches.',
    highlights: [
      'Real-time score tracking with intuitive one-tap input',
      'Player profile system with match history and statistics',
      'Clean sports-focused UI with high contrast for outdoor visibility',
      'Match replay and rally breakdown analytics',
      'Lightweight performance optimised for quick session starts',
    ],
    liveUrl: '#',
  },
  'portfolio-single-gemini-clone.html': {
    accent: '#D63447',
    popupAccent: '#818cf8',
    eyebrow: 'Case Study',
    title: 'Gemini Clone',
    subtitle: 'AI Interface · Web App · Full-Stack · 2024',
    summary: 'A functional clone of Google Gemini built to explore AI interface design patterns. The project focuses on delivering a clean, minimal chat experience with real-time streaming responses, conversation history, and a polished dark-mode interface.',
    highlights: [
      'Real-time AI response streaming with typing indicator animations',
      'Conversation history with persistent session management',
      'Markdown rendering for code blocks, tables, and formatted text',
      'Clean minimal UI matching Google\'s Gemini design language',
      'Responsive layout optimised for both desktop and mobile use',
    ],
    liveUrl: '#',
  },
  'portfolio-single-guided-pro.html': {
    accent: '#D63447',
    popupAccent: '#f59e0b',
    eyebrow: 'Case Study',
    title: 'Guided Pro Wallet',
    subtitle: 'Fintech · UI/UX Design · Mobile App',
    summary: 'A modern digital wallet application designed to simplify personal finance management. Guided Pro Wallet focuses on intuitive budgeting, transaction tracking, and financial goal setting with a premium fintech aesthetic.',
    highlights: [
      'Comprehensive budgeting dashboard with category breakdowns',
      'Smart transaction categorisation and spending insights',
      'Goal-setting and savings tracker with progress visualisation',
      'Secure onboarding flow with biometric authentication UX',
      'Premium fintech-grade design language with data clarity',
    ],
    liveUrl: '#',
  },
  'portfolio-single-revoult-health.html': {
    accent: '#D63447',
    popupAccent: '#34d399',
    eyebrow: 'Case Study',
    title: 'Re.voult Health',
    subtitle: 'Health Tech · UI/UX Design · Mobile App · 2024',
    summary: 'Re.voult Health is a digital health platform designed to make wellness tracking intuitive and motivating. The app combines habit tracking, health metrics, and personalised insights in a clean, calming interface built for daily engagement.',
    highlights: [
      'Habit and wellness tracker with streak system and daily reminders',
      'Health metric visualisations — sleep, hydration, activity, nutrition',
      'Personalised AI-driven health insights and weekly summaries',
      'Calm, approachable design language with soft colour palette',
      'Onboarding flow tailored to individual health goals',
    ],
    liveUrl: 'https://lnkd.in/dCyGC_uY',
  },
  'portfolio-single-shopify-store.html': {
    accent: '#D63447',
    popupAccent: '#96bf48',
    eyebrow: 'Case Study',
    title: 'Shopify Clothing Store',
    subtitle: 'E-Commerce · Shopify · UI Design',
    summary: 'A premium Shopify clothing store designed and developed to deliver a seamless shopping experience. The project focuses on conversion-optimised product pages, a refined visual identity, and a checkout flow that reduces drop-off and increases average order value.',
    highlights: [
      'Custom Shopify theme built from the ground up for the brand',
      'Conversion-focused product pages with rich visual storytelling',
      'Streamlined 3-step checkout flow reducing cart abandonment',
      'Mobile-first responsive design optimised for Instagram traffic',
      'Custom collection filtering and size recommendation features',
    ],
    liveUrl: '#',
  },
};

function buildPopup(pageId, data) {
  const highlightItems = data.highlights.map(h => `        <li>${h}</li>`).join('\n');
  return `
  <!-- ── Project Info Popup ── -->
  <div id="cs-project-popup-overlay" style="--cs-popup-accent: ${data.popupAccent};">
    <div id="cs-project-popup-card">
      <button class="cs-popup-close" onclick="csCloseProjectPopup()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>

      <span class="cs-popup-eyebrow">${data.eyebrow}</span>
      <h3 class="cs-popup-title">${data.title}</h3>
      <p class="cs-popup-subtitle">${data.subtitle}</p>

      <div class="cs-popup-divider"></div>

      <span class="cs-popup-section-label">About the Project</span>
      <p class="cs-popup-summary">${data.summary}</p>

      <span class="cs-popup-section-label">Highlights</span>
      <ul class="cs-popup-highlights">
${highlightItems}
      </ul>

      <div class="cs-popup-footer">
        <a href="${data.liveUrl}" target="_blank" class="cs-popup-cta cs-popup-cta-primary">View Live Website ↗</a>
        <button class="cs-popup-cta cs-popup-cta-secondary" onclick="csCloseProjectPopup()">Close</button>
      </div>
    </div>
  </div>

  <script>
    function csOpenProjectPopup() {
      var overlay = document.getElementById('cs-project-popup-overlay');
      overlay.style.display = 'flex';
      requestAnimationFrame(function() {
        requestAnimationFrame(function() {
          overlay.classList.add('open');
        });
      });
      document.body.style.overflow = 'hidden';
    }

    function csCloseProjectPopup() {
      var overlay = document.getElementById('cs-project-popup-overlay');
      overlay.classList.remove('open');
      setTimeout(function() {
        overlay.style.display = 'none';
        document.body.style.overflow = '';
      }, 380);
    }

    document.getElementById('cs-project-popup-overlay').addEventListener('click', function(e) {
      if (e.target === this) csCloseProjectPopup();
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') csCloseProjectPopup();
    });
  <\/script>`;
}

let updatedCount = 0;

for (const [filename, data] of Object.entries(projects)) {
  if (!fs.existsSync(filename)) {
    console.log(`SKIP (not found): ${filename}`);
    continue;
  }

  let html = fs.readFileSync(filename, 'utf8');

  // 1. Replace "View Live Website" anchor with "More Details" button
  html = html.replace(
    /<a[^>]+class="cs-live-btn"[^>]*>View Live Website<\/a>/g,
    `<button id="cs-view-more-btn" class="cs-live-btn" onclick="csOpenProjectPopup()">More Details</button>`
  );

  // Also catch already-updated anchor variants
  html = html.replace(
    /<a[^>]+class="cs-live-btn"[^>]*>[^<]*Live[^<]*<\/a>/g,
    `<button id="cs-view-more-btn" class="cs-live-btn" onclick="csOpenProjectPopup()">More Details</button>`
  );

  // 2. Remove any existing popup block to avoid duplicates
  html = html.replace(/\s*<!-- ── Project Info Popup ── -->[\s\S]*?<\/script>/g, '');

  // 3. Inject popup before </body>
  const popup = buildPopup(filename, data);
  html = html.replace('</body>', popup + '\n</body>');

  fs.writeFileSync(filename, html, 'utf8');
  console.log(`✅ Updated: ${filename}`);
  updatedCount++;
}

console.log(`\nDone. ${updatedCount} files updated.`);
