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
    // const hasRated = localStorage.getItem("hasRatedWebsite_v1");
    // DEBUG MODE: FORCE POPUP TO SHOW (Comment out the line above and uncomment the line below)
    const hasRated = false; 

    // Session flag to track "Second Interval"
    let shownCount = 0;

    if (!hasRated) {
        // 1. First Interval: Show after 5 seconds
        setTimeout(() => {
            // DEBUG MODE: Ignore localStorage check
            const shouldShow = true; // !localStorage.getItem("hasRatedWebsite_v1")
            
            if (shouldShow && shownCount === 0) {
                showPopup();
                shownCount++;
                
                // 2. Second Interval: Schedule next popup if they don't rate now
                // "Show two time the popup in two intervals"
                // We restart a timer for the second show after the first is potentially closed/ignored
                setTimeout(() => {
                    const isPopupVisible = popupOverlay.classList.contains("show");
                    // DEBUG MODE: Ignore localStorage check
                    const shouldShowAgain = !isPopupVisible; // !localStorage.getItem("hasRatedWebsite_v1") && !isPopupVisible
                    
                    if (shouldShowAgain) {
                        showPopup();
                        shownCount++;
                    }
                }, 15000); // 5s (display) + 10s (gap) = 15s check
            }
        }, 5000);
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
        if (autoCloseTimer) clearTimeout(autoCloseTimer);
        autoCloseTimer = setTimeout(() => {
            if (popupOverlay.style.display !== "none" && popupOverlay.style.opacity !== "0") {
                closePopup('auto');
            }
        }, 5000);
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
      
      // Ensure initial visibility constraints
      popupOverlay.style.display = "flex";
      
      // Animate Overlay Fade In
      TweenMax.fromTo(popupOverlay, 0.4, 
        { autoAlpha: 0 }, 
        { autoAlpha: 1, ease: Power2.easeOut }
      );

      // Animate Card Entrance (Slide Up)
      const card = document.querySelector(".rating-card");
      TweenMax.fromTo(card, 0.8, 
        { y: 100, scale: 0.9, autoAlpha: 0 }, 
        { y: 0, scale: 1, autoAlpha: 1, ease: Expo.easeOut, delay: 0.1 }
      );

      // Start the timer
      startAutoClose();
    }

    function closePopup(reason = 'default') {
      const card = document.querySelector(".rating-card");
      
      if (reason !== 'drag') {
          if (isMobile()) {
               TweenMax.to(card, 0.5, { y: "120vh", ease: Power2.easeIn });
          } else {
               TweenMax.to(card, 0.5, { x: "120vw", ease: Power2.easeIn });
          }
      }

      TweenMax.to(popupOverlay, 0.5, { 
          autoAlpha: 0, 
          delay: 0.2, 
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

        // Check/Add Loader
        let loader = submitBtn.querySelector(".rating-btn-loader");
        if (!loader) {
            loader = document.createElement("span");
            loader.className = "rating-btn-loader";
            submitBtn.appendChild(loader);
        }
        loader.style.display = "inline-block";

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
                    
                    // Reset Tick Animation to ensure it plays every time
                    const tickPath = successMessage.querySelector(".success-tick-path");
                    if (tickPath) {
                        tickPath.style.animation = 'none';
                        tickPath.offsetHeight; /* trigger reflow */
                        tickPath.style.animation = 'drawTick 0.6s ease forwards 0.3s';
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
