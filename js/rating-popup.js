(function() {
  document.addEventListener("DOMContentLoaded", function() {
    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------
    // REPLACE THESE WITH YOUR ACTUAL EMAILJS IDS
    const EMAILJS_SERVICE_ID = "service_vlvela8"; // Updated Service ID
    const EMAILJS_TEMPLATE_ID = "template_1vplhws"; // Updated Template ID
    const EMAILJS_PUBLIC_KEY = "0ClrYMOecNl2szYOj"; // Defaulting to existing public key found in codebase

    // ---------------------------------------------------------
    // Selectors & State
    // ---------------------------------------------------------
    const popupOverlay = document.getElementById("rating-popup-overlay");
    const closeBtn = document.querySelector(".close-popup");
    const ratingForm = document.getElementById("rating-form");
    const skillsSection = document.getElementById("skills-section");
    const successMessage = document.getElementById("rating-success-message");
    const formContent = document.getElementById("rating-form-content");

    let hasShownPopup = sessionStorage.getItem("hasRatedWebsite_v1");

    // ---------------------------------------------------------
    // Time Trigger & Persistence
    // ---------------------------------------------------------
    
    // Check if user has already successfully rated (Persistent)
    const hasRated = localStorage.getItem("hasRatedWebsite_v1");
    // const hasRated = false; // DEBUG MODE OFF

    // Session flag to track "Second Interval"
    let shownCount = 0;

    // ---------------------------------------------------------
    // Time Trigger & Persistence - REMOVED PER USER REQUEST
    // Only triggering via "Let's Connect" section now.
    // ---------------------------------------------------------
    
    // Check if user has already successfully rated (Persistent) - Referenced by form submission logic mostly now
    // const hasRated is defined above.

    // ---------------------------------------------------------
    // "Let's Connect" Intersection Trigger (Forced)
    // "show review popup when the user reach the let's connect section even if they review already"
    // ---------------------------------------------------------
    const contactSection = document.getElementById("contact-section");
    if (contactSection) {
        const contactObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    handleReviewTrigger();
                }
            });
        }, { threshold: 0.1 }); 
        contactObserver.observe(contactSection);
    }
    
    // Notification Element
    const notif = document.getElementById("custom-notification");
    if (notif) {
        notif.addEventListener("click", () => {
            // Hide notification and show actual popup
            notif.classList.remove("show");
            showPopup(); 
        });
    }

    function handleReviewTrigger() {
        // FIX: Check computed style to correctly detect effective visibility (CSS display: none)
        const computedStyle = window.getComputedStyle(popupOverlay);
        const isVisible = computedStyle.display !== "none" && computedStyle.visibility !== "hidden" && computedStyle.opacity !== "0";
        
        // Also check if notification is already showing
        const isNotifVisible = notif && notif.classList.contains("show");

        if (!isVisible && !isNotifVisible) {
             if (isMobile()) {
                 // Mobile: Show Notification Button
                 if (notif) notif.classList.add("show");
                 // Auto-hide notification after 8s if ignored? Optional.
                 setTimeout(() => { if(notif) notif.classList.remove("show"); }, 8000); 
             } else {
                 // Desktop: Show Popup Directly
                 showPopup();
             }
        }
    }

    // ---------------------------------------------------------
    // Popup Functions
    // ---------------------------------------------------------
    // ---------------------------------------------------------
    // Popup Functions (GSAP Powered)
    // ---------------------------------------------------------
    let autoCloseTimer = null;
    const isMobile = () => window.innerWidth <= 768;

    // ---------------------------------------------------------
    // Auto-Close Logic with Hover Pause
    // ---------------------------------------------------------
    function startAutoClose() {
        // Auto-close removed per user request ("only have to work on review popup windows" - implying manual check)
        // If we want it to stay open until user interacts, we disable this.
        if (autoCloseTimer) clearTimeout(autoCloseTimer);
    }

    function stopAutoClose() {
        if (autoCloseTimer) {
            clearTimeout(autoCloseTimer);
            autoCloseTimer = null;
        }
    }

    function showPopup() {
      // Clear any previous state
      TweenMax.killTweensOf([popupOverlay, document.querySelector(".rating-card")]);
      
      const card = document.querySelector(".rating-card");
      // Select content elements for staggering
      const cardContent = [
        card.querySelector(".close-popup"), // Animate close button too
        card.querySelector(".rating-header"),
        card.querySelector(".star-rating-wrapper"),
        ...card.querySelectorAll(".rating-form-group"),
        card.querySelector(".luxury-button-wrapper"),
        card.querySelector(".swipe-hint-text")
      ];

      // Prepare Initial States for Stagger (Ghost State)
      // "Blend In" = Opacity 0 + Slight Offset + Blur
      TweenMax.set(cardContent, { 
          autoAlpha: 0, 
          y: 15, 
          filter: "blur(10px)" 
      });

      // Ensure initial visibility constraints
      popupOverlay.style.display = "flex";
      document.body.style.overflow = "hidden"; /* Hide Page Scrollbar */
      
      // Master Timeline
      const tl = new TimelineMax();

      // 1. Overlay Fade In
      tl.fromTo(popupOverlay, 0.5, 
        { autoAlpha: 0 }, 
        { autoAlpha: 1, ease: Power2.easeOut }
      );

      // 2. Card Entrance
      if (isMobile()) {
          // Mobile Sheet Up
          tl.fromTo(card, 0.7, 
            { y: "110%", scale: 0.95, autoAlpha: 1, filter: "blur(10px)" },
            { y: "0%", scale: 1, autoAlpha: 1, filter: "blur(0px)", ease: Power4.easeOut, force3D: true }, 
            "-=0.3"
          );
      } else {
          // Desktop Pop
          tl.fromTo(card, 0.8, 
            { y: 40, scale: 0.9, rotationX: 8, autoAlpha: 0, filter: "blur(20px)", transformOrigin: "center center" }, 
            { y: 0, scale: 1, rotationX: 0, autoAlpha: 1, filter: "blur(0px)", ease: Elastic.easeOut.config(1.1, 0.7), force3D: true }, 
            "-=0.3"
          );
      }

      // 3. Staggered Content "Blend In" Reveal
      tl.staggerTo(cardContent, 0.6, 
        { 
            autoAlpha: 1, 
            y: 0, 
            filter: "blur(0px)", /* Cleans up the blur */
            ease: Power2.easeOut 
        }, 
        0.06, /* Tight stagger delay */
        "-=0.5" /* Overlapping with card entry */
      );

      // Start the timer
      startAutoClose();
    }

    function closePopup(reason = 'default') {
      const card = document.querySelector(".rating-card");
      const cardContent = [
        card.querySelector(".close-popup"), 
        card.querySelector(".rating-header"),
        card.querySelector(".star-rating-wrapper"),
        ...card.querySelectorAll(".rating-form-group"),
        card.querySelector(".luxury-button-wrapper"),
        card.querySelector(".swipe-hint-text")
      ];
      
      // Stop ongoing animations
      TweenMax.killTweensOf([popupOverlay, card, ...cardContent]);

      if (reason === 'drag') {
          // If dragged, just fade overlay (card is handled by drag logic)
      } else {
          // 1. Animate Content OUT first (Reverse Blend)
          TweenMax.staggerTo(cardContent.reverse(), 0.3, {
              autoAlpha: 0,
              y: -10, /* Float up slightly */
              filter: "blur(5px)",
              ease: Power2.easeIn
          }, 0.03);

          // 2. Animate Card OUT (with slight delay)
          if (isMobile()) {
              TweenMax.to(card, 0.45, { 
                  y: "110%", 
                  ease: Power3.easeIn,
                  force3D: true,
                  delay: 0.1
              });
          } else {
              TweenMax.to(card, 0.4, { 
                  scale: 0.92, 
                  autoAlpha: 0, 
                  filter: "blur(10px)",
                  ease: Power2.easeInOut,
                  force3D: true,
                  delay: 0.1
              });
          }
      }

      // 3. Overlay Fade Out
      TweenMax.to(popupOverlay, 0.4, { 
          autoAlpha: 0, 
          delay: 0.2, 
          ease: Power2.easeInOut,
          onComplete: () => {
             popupOverlay.style.display = "none";
             resetCardState();
             document.body.style.overflow = ""; 
          }
      });
    }

    function resetCardState() {
        const card = document.querySelector(".rating-card");
        TweenMax.set(card, { clearProps: "all" });
    }

    // Event Listeners
    if (closeBtn) {
      closeBtn.addEventListener("click", () => closePopup('button'));
    }
    
    popupOverlay.addEventListener("click", (e) => {
      if (e.target === popupOverlay) {
        closePopup('overlay');
      }
    });

    // Hover Logic for Desktop (Pause on Hover)
    const cardElement = document.querySelector(".rating-card");
    if (cardElement) {
        cardElement.addEventListener("mouseenter", stopAutoClose);
        cardElement.addEventListener("mouseleave", () => {
             // Only restart if we haven't already interacted in a way that permanently cancels it (like typing)
             // But for now, simple restart is safer to ensure it eventually closes if they just leave the mouse there
             startAutoClose();
        });
    }

    // ---------------------------------------------------------
    // Form Interaction Logic (Permanent Cancel on Type)
    // ---------------------------------------------------------
    const inputs = ratingForm ? ratingForm.querySelectorAll("input, textarea") : [];
    
    // Typing permanently cancels the timer for this session
    function cancelAutoClosePermanently() {
        stopAutoClose();
        // Remove hover listeners so it doesn't restart
        if (cardElement) {
            cardElement.removeEventListener("mouseleave", startAutoClose);
            // We can leave mouseenter as stopping it is fine, but restarting is the issue.
            // Actually better to just nullify the start function or set a flag.
        }
    }

    if (inputs.length > 0) {
        inputs.forEach(input => {
            input.addEventListener("input", cancelAutoClosePermanently);
            input.addEventListener("change", cancelAutoClosePermanently);
        });
    }

    // ---------------------------------------------------------
    // Swipe Gestures (GSAP Draggable Logic)
    // ---------------------------------------------------------
    const card = document.querySelector(".rating-card");
    let startX = 0, startY = 0;
    let isDragging = false;

    if (card) {
        // --- Touch Events (Mobile) ---
        card.addEventListener("touchstart", (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isDragging = true;
            TweenMax.killTweensOf(card); // Stop any entrance animation
            cancelAutoClose();
        }, { passive: true });

        card.addEventListener("touchmove", (e) => {
            if (!isDragging) return;
            const touch = e.touches[0];
            const deltaY = touch.clientY - startY;

            if (isMobile()) {
                // Only allow drag DOWN (positive Y)
                if (deltaY > 0) {
                   TweenMax.set(card, { y: deltaY });
                }
            }
        }, { passive: true });

        card.addEventListener("touchend", (e) => {
            if (!isDragging) return;
            isDragging = false;
            
            const touch = e.changedTouches[0];
            const deltaY = touch.clientY - startY;

            if (isMobile()) {
                if (deltaY > 100) { 
                    // Throw Down
                    TweenMax.to(card, 0.4, { y: "100vh", ease: Power1.easeIn });
                    closePopup('drag');
                } else {
                    // Snap Back
                    TweenMax.to(card, 0.5, { y: 0, ease: Elastic.easeOut.config(1, 0.5) });
                }
            }
        });

        // --- Mouse Events (Desktop) ---
        card.addEventListener("mousedown", (e) => {
            if (["INPUT", "TEXTAREA", "BUTTON", "LABEL"].includes(e.target.tagName)) return;
            
            startX = e.clientX;
            isDragging = true;
            TweenMax.killTweensOf(card);
            cancelAutoClose();
        });

        document.addEventListener("mousemove", (e) => {
            if (!isDragging) return;
            const deltaX = e.clientX - startX;
            
            if (!isMobile()) {
                // Only allow drag RIGHT (positive X)
                if (deltaX > 0) {
                     TweenMax.set(card, { x: deltaX });
                }
            }
        });

        document.addEventListener("mouseup", (e) => {
            if (!isDragging) return;
            isDragging = false;
            
            const deltaX = e.clientX - startX;
             
            if (!isMobile()) {
                if (deltaX > 100) { 
                    // Throw Right
                    TweenMax.to(card, 0.4, { x: "100vw", ease: Power1.easeIn });
                    closePopup('drag');
                } else {
                    // Snap Back
                    TweenMax.to(card, 0.5, { x: 0, ease: Elastic.easeOut.config(1, 0.5) });
                }
            }
        });
    }

    // ---------------------------------------------------------
    // Form Submission (EmailJS)
    // ---------------------------------------------------------
    if (ratingForm) {
      ratingForm.addEventListener("submit", function(e) {
        e.preventDefault();

        // Validate Validation
        const name = document.getElementById("rating-name").value;
        const feedback = document.getElementById("rating-feedback").value;
        const rating = document.querySelector('input[name="rating"]:checked');

        if (!rating) {
            if (typeof showNotification === "function") {
                showNotification(false, "Please select a star rating!");
            } else {
                alert("Please select a star rating!");
            }
            return;
        }

        const submitBtn = ratingForm.querySelector(".resume-btn");
        const btnText = submitBtn.querySelector(".resume-btn-text");

        // Visual Loading State
        btnText.style.display = "none"; // Hide text
        submitBtn.style.opacity = "0.8";
        submitBtn.disabled = true;

        // Check/Add Loader (3 Dots)
        let loader = submitBtn.querySelector(".rating-btn-loader");
        if (!loader) {
            loader = document.createElement("div");
            loader.className = "rating-btn-loader";
            // Create 3 dots
            for (let i = 0; i < 3; i++) {
                let dot = document.createElement("span");
                loader.appendChild(dot);
            }
            submitBtn.appendChild(loader);
        }
        loader.style.display = "inline-flex"; // Ensure flex display

        // Prepare Template Params
        const templateParams = {
            user_name: name,
            user_feedback: feedback,
            user_rating: rating.value,
            rating_date: new Date().toLocaleString(),
            user_device: navigator.userAgent,
            to_name: "Irfan Nisar",
            to_email: "inzrwork020@gmail.com", // Trying to force recipient from code
        };

        // Send Email
        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                
                // Save persistence state
                localStorage.setItem("hasRatedWebsite_v1", "true");
                
                // Show Success Animation with a slight delay for smoother transition
                setTimeout(() => {
                    formContent.style.display = "none";
                    successMessage.style.display = "block";
                    
                    // Trigger New Animations (Circle Pop + SVG Draw + Particles)
                    const circleBg = successMessage.querySelector(".success-circle-bg");
                    const tickSvg = successMessage.querySelector(".new-success-tick");
                    const wrapper = successMessage.querySelector(".success-tick-wrapper");
                    
                    if (wrapper) {
                         wrapper.classList.remove('animate');
                         void wrapper.offsetWidth; 
                         wrapper.classList.add('animate');
                    }

                    if (circleBg) {
                         circleBg.classList.remove('animate');
                         void circleBg.offsetWidth; 
                         circleBg.classList.add('animate');
                    }
                    
                    if (tickSvg) {
                         tickSvg.classList.remove('animate');
                         void tickSvg.offsetWidth;
                         tickSvg.classList.add('animate');
                    }
                    
                }, 500);
                
                // Close popup after a delay
                setTimeout(() => {
                    closePopup();
                }, 3000);

            }, function(error) {
                console.error('FAILED...', error);
                
                // Reset Button State
                loader.style.display = "none";
                btnText.style.display = "block"; // Restore text
                submitBtn.style.opacity = "1";
                submitBtn.disabled = false;

                // Show detailed error via custom notification
                if (typeof showNotification === "function") {
                    showNotification(false, "Failed to send rating. Error: " + JSON.stringify(error));
                } else {
                    alert("Failed: " + JSON.stringify(error));
                }
            });
      });
    }

  });
})();
