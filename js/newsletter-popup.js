(function() {
  document.addEventListener("DOMContentLoaded", function() {
    const moreInfoBtn = document.getElementById("newsletter-more-info-btn");
    const newsletterPopup = document.getElementById("newsletter-popup-overlay");
    const closeNewsletterBtn = document.getElementById("close-newsletter-popup");
    const newsletterCard = document.getElementById("newsletter-card");
    const isMobile = () => window.innerWidth <= 768;

    if (!moreInfoBtn || !newsletterPopup || !closeNewsletterBtn || !newsletterCard) return;

    function showNewsletterPopup() {
      // Clear previous states
      TweenMax.killTweensOf([newsletterPopup, newsletterCard]);
      
      const titleElement = newsletterCard.querySelector(".popup-title-luxury");
      const elementsToReveal = [
          closeNewsletterBtn,
          ...newsletterCard.querySelectorAll(".news-reveal-text")
      ];

      // Reset text states
      TweenMax.set(elementsToReveal, { 
          autoAlpha: 0, 
          y: 20, 
          filter: "blur(10px)" 
      });

      if (titleElement) {
          TweenMax.set(titleElement, {
              autoAlpha: 0,
              y: 40,
              scale: 0.9,
              rotationX: 20,
              filter: "blur(20px)"
          });
      }

      // Show overlay
      newsletterPopup.style.display = "flex";
      document.body.style.overflow = "hidden"; // Prevent scrolling

      const tl = new TimelineMax();

      // Fade overlay in
      tl.fromTo(newsletterPopup, 0.4, 
        { autoAlpha: 0 }, 
        { autoAlpha: 1, ease: Power2.easeOut }
      );

      // Card entrance (Unified Centered Pop for all devices)
      tl.fromTo(newsletterCard, 0.7, 
        { y: 30, scale: 0.9, autoAlpha: 0, filter: "blur(15px)" }, 
        { y: 0, scale: 1, autoAlpha: 1, filter: "blur(0px)", ease: Elastic.easeOut.config(1, 0.8) }
      , "-=0.2");

      // Smooth modern title entrance
      if (titleElement) {
          tl.to(titleElement, 1.4, {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              rotationX: 0,
              filter: "blur(0px)",
              ease: Expo.easeOut
          }, "-=0.4");
      }

      // Staggered text reveal (like Let's Connect / Premium Blur Reveal)
      tl.staggerTo(elementsToReveal, 0.8, 
        { 
            autoAlpha: 1, 
            y: 0, 
            filter: "blur(0px)", 
            ease: Power3.easeOut 
        }, 
        0.08, 
        titleElement ? "-=1.0" : "-=0.4"
      );
    }

    function closeNewsletterPopup() {
      const titleElement = newsletterCard.querySelector(".popup-title-luxury");
      const elementsToReveal = [
          closeNewsletterBtn,
          ...newsletterCard.querySelectorAll(".news-reveal-text")
      ];

      const elementsToKill = [newsletterPopup, newsletterCard, ...elementsToReveal];
      if (titleElement) elementsToKill.push(titleElement);
      TweenMax.killTweensOf(elementsToKill);

      const tl = new TimelineMax({
          onComplete: () => {
              newsletterPopup.style.display = "none";
              document.body.style.overflow = ""; // Restore scroll
              TweenMax.set(newsletterCard, { clearProps: "all" });
          }
      });

      if (titleElement) {
          tl.to(titleElement, 0.3, {
              autoAlpha: 0,
              y: -15,
              scale: 0.95,
              filter: "blur(8px)",
              ease: Power2.easeIn
          }, 0);
      }

      // Hide text first
      tl.staggerTo(elementsToReveal.reverse(), 0.2, {
          autoAlpha: 0,
          y: -10,
          filter: "blur(5px)",
          ease: Power2.easeIn
      }, 0.02, titleElement ? "-=0.2" : 0);

      // Hide Card (Unified scale down for all devices)
      tl.to(newsletterCard, 0.35, { 
          scale: 0.9, 
          y: 20,
          autoAlpha: 0, 
          filter: "blur(10px)",
          ease: Power2.easeIn
      });

      // Fade out overlay
      tl.to(newsletterPopup, 0.3, { autoAlpha: 0, ease: Power2.easeInOut }, "-=0.1");
    }

    // Event Listeners
    moreInfoBtn.addEventListener("click", (e) => {
        e.preventDefault();
        showNewsletterPopup();
    });

    closeNewsletterBtn.addEventListener("click", closeNewsletterPopup);

    newsletterPopup.addEventListener("click", (e) => {
        if (e.target === newsletterPopup) {
            closeNewsletterPopup();
        }
    });

    // Touch/Swipe Logic for Mobile (Drag Down to Close)
    let startY = 0;
    let isDragging = false;

    newsletterCard.addEventListener("touchstart", (e) => {
        // Prevent if clicking a link/button
        if (e.target.closest("button") || e.target.closest("a")) return;
        startY = e.touches[0].clientY;
        isDragging = true;
    }, { passive: true });

    newsletterCard.addEventListener("touchmove", (e) => {
        if (!isDragging || !isMobile()) return;
        const deltaY = e.touches[0].clientY - startY;
        if (deltaY > 0) {
           TweenMax.set(newsletterCard, { y: deltaY });
        }
    }, { passive: true });

    newsletterCard.addEventListener("touchend", (e) => {
        if (!isDragging || !isMobile()) return;
        isDragging = false;
        const deltaY = e.changedTouches[0].clientY - startY;
        
        if (deltaY > 100) { 
            // Swipe successful -> Close
            TweenMax.to(newsletterCard, 0.3, { y: "100vh", ease: Power1.easeIn });
            
            // Fade out overlay independently
            TweenMax.to(newsletterPopup, 0.4, { 
                autoAlpha: 0, 
                onComplete: () => {
                    newsletterPopup.style.display = "none";
                    document.body.style.overflow = ""; 
                }
            });
        } else {
            // Snap back
            TweenMax.to(newsletterCard, 0.4, { y: 0, ease: Elastic.easeOut.config(1, 0.5) });
        }
    });

    // Desktop Mouse Drag to Close (Swipe Right)
    let mouseStartX = 0;
    let isMouseDragging = false;

    newsletterCard.addEventListener("mousedown", (e) => {
        if (e.target.closest("button") || e.target.closest("a")) return;
        mouseStartX = e.clientX;
        isMouseDragging = true;
    });

    document.addEventListener("mousemove", (e) => {
        if (!isMouseDragging || isMobile()) return;
        const deltaX = e.clientX - mouseStartX;
        if (deltaX > 0) {
             TweenMax.set(newsletterCard, { x: deltaX });
        }
    });

    document.addEventListener("mouseup", (e) => {
        if (!isMouseDragging || isMobile()) return;
        isMouseDragging = false;
        const deltaX = e.clientX - mouseStartX;
        
        if (deltaX > 100) { 
            TweenMax.to(newsletterCard, 0.3, { x: "100vw", ease: Power1.easeIn });
            TweenMax.to(newsletterPopup, 0.4, { 
                autoAlpha: 0, 
                onComplete: () => {
                    newsletterPopup.style.display = "none";
                    document.body.style.overflow = ""; 
                    TweenMax.set(newsletterCard, { clearProps: "all" });
                }
            });
        } else {
            TweenMax.to(newsletterCard, 0.4, { x: 0, ease: Elastic.easeOut.config(1, 0.5) });
        }
    });

    // --- New Minimalist Skew-Mask Word Animation ---
    const mainNewsletterTitle = document.getElementById("newsletter-main-title");
    if (mainNewsletterTitle) {
      // 1. Split Text by Words, Wrapped in Overflow Masks
      const text = mainNewsletterTitle.innerText;
      mainNewsletterTitle.innerHTML = "";
      
      const words = text.split(" ");
      let wordHTML = "";
      
      words.forEach((word, wordIndex) => {
          let wordSpan = `<span class="word-mask-wrap" style="display:inline-flex; overflow:hidden; vertical-align: top; padding-bottom: 8px; margin-bottom: -8px;">`;
          wordSpan += `<span class="split-title-word-inner" style="display:inline-block; transform-origin: left top; will-change: transform, opacity; padding-right: 4px;">${word}</span>`;
          wordSpan += `</span>`;
          
          wordHTML += wordSpan + (wordIndex < words.length - 1 ? "&nbsp;" : "");
      });
      
      mainNewsletterTitle.innerHTML = wordHTML;

      // 2. Intersection Observer for Minimal Skew Reveal
      const titleObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              if (entry.isIntersecting) {
                  const inners = entry.target.querySelectorAll('.split-title-word-inner');
                  
                  if (typeof TweenMax !== 'undefined') {
                      // Initial hidden state: pushed down and skewed inside the mask
                      TweenMax.set(inners, {
                          y: "110%",
                          skewY: 7,
                          rotationZ: 3,
                          opacity: 0
                      });
                      
                      // Modern fluid staggering
                      TweenMax.staggerTo(inners, 1.4, {
                          y: "0%",
                          skewY: 0,
                          rotationZ: 0,
                          opacity: 1,
                          ease: Expo.easeOut
                      }, 0.08); 
                  } else {
                     // CSS Fallback if GSAP fails
                     inners.forEach(inner => inner.style.opacity = '1');
                  }
                  titleObserver.unobserve(entry.target);
              }
          });
      }, { threshold: 0.1 });
      
      titleObserver.observe(mainNewsletterTitle);
    }

  });
})();
