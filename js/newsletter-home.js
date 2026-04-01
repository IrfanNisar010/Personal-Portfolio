document.addEventListener("DOMContentLoaded", () => {
    // 1. Animation Trigger (Fix for title not showing)
    const elementsToReveal = document.querySelectorAll('.premium-blur-reveal');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: "0px 0px -50px 0px", threshold: 0.1 });

    elementsToReveal.forEach(el => observer.observe(el));

    // 2. Newsletter Subscription Handling
    const form = document.getElementById("tech-brew-form");
    const emailInput = document.querySelector(".newsletter-input");
    const wrapper = document.querySelector(".newsletter-form-wrapper");
    const submitBtn = document.querySelector(".newsletter-btn");
    const spinner = document.querySelector(".spinner");
    const btnText = document.querySelector(".btn-text");

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = emailInput.value.trim();
            if (!email) return;

            // Show Loading State
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            spinner.style.display = 'block';

            try {
                // 1. Save subscriber email to Firestore Database (Compat Mode)
                if (window.isFirebaseConfigured && window.firebase) {
                    try {
                        const db = firebase.firestore();
                        await db.collection("subscribers").add({
                            email: email,
                            timestamp: firebase.firestore.FieldValue.serverTimestamp()
                        });
                    } catch (dbError) {
                        console.warn("Could not save to DB (check config):", dbError);
                    }
                } else {
                    console.log("Firebase is not configured yet. Skipping DB save.");
                }

                // 2. Send Email Notification using EmailJS
                if (typeof emailjs !== 'undefined' && window.EMAILJS_CONFIG && window.EMAILJS_CONFIG.PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
                    // Send to User (Welcome)
                    emailjs.send(
                        window.EMAILJS_CONFIG.SERVICE_ID,
                        window.EMAILJS_CONFIG.NEW_SUBSCRIBER_TEMPLATE_ID,
                        {
                            user_email: email,
                            reply_to: "inzrwork020@gmail.com"
                        }
                    ).catch(console.error);

                    // Send to Admin (New Subscriber Notification)
                    emailjs.send(
                        window.EMAILJS_CONFIG.SERVICE_ID,
                        window.EMAILJS_CONFIG.ADMIN_NOTIFY_TEMPLATE_ID,
                        {
                            subscriber_email: email,
                            admin_email: "inzrwork020@gmail.com"
                        }
                    ).catch(console.error);
                } else {
                    console.warn("EmailJS is not configured yet. Use placeholder.");
                }

                // Simulate slight delay for luxury feeling
                await new Promise(r => setTimeout(r, 800));

                // Success Animation
                wrapper.classList.add("success");
                emailInput.value = "";
                
                // Reset after 4 seconds
                setTimeout(() => {
                    wrapper.classList.remove("success");
                    submitBtn.disabled = false;
                    btnText.style.display = 'inline-block';
                    spinner.style.display = 'none';
                }, 4000);

            } catch (error) {
                console.error("Subscription error: ", error);
                submitBtn.disabled = false;
                btnText.style.display = 'inline-block';
                spinner.style.display = 'none';
                alert("Something went wrong. Please try again later.");
            }
        });
    }

    // 3. Optional Open Animation when intersecting the form
    if (wrapper) {
        const formObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                wrapper.classList.add('animate-open');
                formObserver.unobserve(wrapper);
            }
        }, { threshold: 0.5 });
        formObserver.observe(wrapper);
    }
});
