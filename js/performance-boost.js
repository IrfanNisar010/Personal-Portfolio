(function () {
  'use strict';

  var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection || {};
  var supportsMatchMedia = typeof window.matchMedia === 'function';
  var state = {
    reduceMotion: supportsMatchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    canUseHover: supportsMatchMedia ? window.matchMedia('(hover: hover) and (pointer: fine)').matches : true,
    saveData: !!connection.saveData,
    smallScreen: window.innerWidth < 992,
    lowMemory: Number(navigator.deviceMemory || 8) <= 4,
    lowCpu: Number(navigator.hardwareConcurrency || 8) <= 4
  };

  state.liteMode = state.reduceMotion || state.saveData || state.lowMemory || state.lowCpu;
  window.__portfolioPerformance = state;

  document.documentElement.classList.add(state.liteMode ? 'perf-lite' : 'perf-rich');
  if (state.reduceMotion) {
    document.documentElement.classList.add('perf-reduce-motion');
  }

  var scriptCache = {};

  function scheduleTask(callback) {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(callback, { timeout: 2500 });
      return;
    }

    window.setTimeout(callback, 1200);
  }

  function loadScript(src, attributes) {
    if (scriptCache[src]) {
      return scriptCache[src];
    }

    scriptCache[src] = new Promise(function (resolve, reject) {
      var existing = document.querySelector('script[src="' + src + '"]');
      if (existing) {
        if (existing.dataset.loaded === 'true') {
          resolve(existing);
          return;
        }

        existing.addEventListener('load', function () {
          existing.dataset.loaded = 'true';
          resolve(existing);
        }, { once: true });
        existing.addEventListener('error', reject, { once: true });
        return;
      }

      var script = document.createElement('script');
      script.src = src;
      script.async = true;

      if (attributes) {
        Object.keys(attributes).forEach(function (key) {
          script.setAttribute(key, attributes[key]);
        });
      }

      script.addEventListener('load', function () {
        script.dataset.loaded = 'true';
        resolve(script);
      }, { once: true });
      script.addEventListener('error', reject, { once: true });
      document.body.appendChild(script);
    });

    return scriptCache[src];
  }

  function optimizeImages() {
    var images = document.querySelectorAll('img');

    Array.prototype.forEach.call(images, function (img, index) {
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }

      if (!img.hasAttribute('decoding')) {
        img.setAttribute('decoding', 'async');
      }

      if (!img.hasAttribute('fetchpriority')) {
        img.setAttribute('fetchpriority', index === 0 ? 'auto' : 'low');
      }
    });
  }

  function deferPlasmaBackground() {
    if (state.liteMode || state.reduceMotion) {
      return;
    }

    var newsletterSection = document.getElementById('newsletter-section');
    if (!newsletterSection) {
      return;
    }

    var started = false;
    function start() {
      if (started) {
        return;
      }

      started = true;

      var moduleScript = document.createElement('script');
      moduleScript.type = 'module';
      moduleScript.src = 'js/plasma-bg.js';
      document.body.appendChild(moduleScript);
    }

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            return;
          }

          observer.disconnect();
          start();
        });
      }, {
        rootMargin: '300px 0px'
      });

      observer.observe(newsletterSection);
      return;
    }

    scheduleTask(start);
  }

  window.loadConfetti = function () {
    if (state.liteMode) {
      return Promise.resolve(null);
    }

    return loadScript('https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js', {
      crossorigin: 'anonymous'
    }).then(function () {
      return window.confetti || null;
    });
  };

  window.loadLenis = function () {
    if (state.liteMode || state.reduceMotion || state.smallScreen || !state.canUseHover) {
      return Promise.resolve(null);
    }

    return loadScript('https://unpkg.com/@studio-freight/lenis@1.0.39/dist/lenis.min.js', {
      crossorigin: 'anonymous'
    }).then(function () {
      document.dispatchEvent(new CustomEvent('portfolio:lenis-ready'));
      return window.Lenis || null;
    });
  };

  document.addEventListener('DOMContentLoaded', function () {
    optimizeImages();
    deferPlasmaBackground();
  });

  window.addEventListener('load', function () {
    scheduleTask(function () {
      window.loadLenis();
      window.loadConfetti();
    });
  });
}());
