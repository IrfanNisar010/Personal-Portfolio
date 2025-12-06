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
                }, 25000); // 15s (duration) + 10s (gap) = 25s check
            }
        }, 5000);
    }

    // ---------------------------------------------------------
    // Popup Functions
    // ---------------------------------------------------------
    let autoCloseTimer = null;

    function showPopup() {
      popupOverlay.style.display = "flex"; 
      setTimeout(() => {
        popupOverlay.classList.add("show");
      }, 10);
      
      // Removed scroll lock to allow website interaction
      // document.body.style.overflow = "hidden"; 

      // Auto-close after 15 seconds
      if (autoCloseTimer) clearTimeout(autoCloseTimer);
      autoCloseTimer = setTimeout(() => {
          // Verify it's still open before closing
          if (popupOverlay.classList.contains("show")) {
            closePopup();
          }
      }, 15000);
    }

    function closePopup() {
      popupOverlay.classList.add("closing");
      popupOverlay.classList.remove("show");
      
      // Wait for animation to finish before hiding
      setTimeout(() => {
        popupOverlay.style.display = "none";
        popupOverlay.classList.remove("closing");
        // Reset form state if needed, or leave it if closed post-success
        document.body.style.overflow = ""; // Restore scrolling
      }, 600); // Matches CSS animation duration
    }

    // Event Listeners
    if (closeBtn) {
      closeBtn.addEventListener("click", closePopup);
    }

    // Close on click outside (optional)
    popupOverlay.addEventListener("click", (e) => {
      if (e.target === popupOverlay) {
        closePopup();
      }
    });

    // ---------------------------------------------------------
    // Form Interaction Logic (Cancel Auto-Close)
    // ---------------------------------------------------------
    const inputs = ratingForm ? ratingForm.querySelectorAll("input, textarea") : [];
    
    function cancelAutoClose() {
        if (autoCloseTimer) {
            clearTimeout(autoCloseTimer);
            autoCloseTimer = null;
            // console.log("Auto-close cancelled by user interaction");
        }
    }

    if (inputs.length > 0) {
        inputs.forEach(input => {
            input.addEventListener("input", cancelAutoClose);
            input.addEventListener("change", cancelAutoClose);
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
        const originalText = btnText.innerText;

        // Visual Loading State
        btnText.innerText = "Sending...";
        submitBtn.style.opacity = "0.7";
        submitBtn.disabled = true;

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
                
                // Show Success Animation
                formContent.style.display = "none";
                successMessage.style.display = "block";
                
                // Close popup after a delay
                setTimeout(() => {
                    closePopup();
                }, 2500);

            }, function(error) {
                console.error('FAILED...', error);
                // Show detailed error via custom notification
                if (typeof showNotification === "function") {
                    showNotification(false, "Failed to send rating. Error: " + JSON.stringify(error));
                } else {
                    alert("Failed: " + JSON.stringify(error));
                }
                btnText.innerText = originalText;
                submitBtn.style.opacity = "1";
                submitBtn.disabled = false;
            });
      });
    }

  });
})();
