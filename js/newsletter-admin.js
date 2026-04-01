const ADMIN_EMAIL = "inzrwork020@gmail.com"; // Your specific Gmail here

document.addEventListener("DOMContentLoaded", () => {
    const authSection = document.getElementById("authSection");
    const dashboardSection = document.getElementById("dashboardSection");
    const googleLoginBtn = document.getElementById("googleLoginBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const authError = document.getElementById("authError");
    
    const uploadForm = document.getElementById("uploadForm");
    const uploadBtn = document.getElementById("uploadBtn");
    const uploadStatus = document.getElementById("uploadStatus");

    // Check Firebase Init
    if (!window.isFirebaseConfigured || !window.firebase) {
        if (authError) {
            authError.style.display = "block";
            authError.innerText = "Firebase not Configured! Check js/firebase-config.js";
            if (googleLoginBtn) googleLoginBtn.disabled = true;
        }
        return; // Stop execution
    }

    const auth = firebase.auth();
    const db = firebase.firestore();
    const provider = new firebase.auth.GoogleAuthProvider();

    // 1. Authentication State Observer
    auth.onAuthStateChanged((user) => {
        if (user) {
            // Check if it's the admin
            if (user.email === ADMIN_EMAIL) {
                authSection.style.display = "none";
                dashboardSection.style.display = "block";
                authError.style.display = "none";
            } else {
                // Not the admin
                auth.signOut().then(() => {
                    authError.style.display = "block";
                    authError.innerText = "Unauthorized access. This area is restricted to owner only.";
                    authSection.style.display = "block";
                    dashboardSection.style.display = "none";
                });
            }
        } else {
            authSection.style.display = "block";
            dashboardSection.style.display = "none";
        }
    });

    // 2. Google Login
    if(googleLoginBtn) {
        googleLoginBtn.addEventListener("click", () => {
            auth.signInWithPopup(provider)
            .catch((error) => {
                authError.style.display = "block";
                authError.innerText = "Login failed: " + error.message;
            });
        });
    }

    // 3. Logout
    if(logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            auth.signOut();
        });
    }

    // 4. Upload Newsletter & Notify
    if (uploadForm) {
        uploadForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const title = document.getElementById("newsTitle").value;
            const kicker = document.getElementById("newsKicker").value;
            const summary = document.getElementById("newsSummary").value;
            const link = document.getElementById("newsLink").value || "https://yourwebsite.com/newsletter";

            uploadBtn.disabled = true;
            uploadBtn.innerText = "Publishing...";
            uploadStatus.style.display = "none";
            uploadStatus.classList.remove("error-message");

            try {
                // 1. Save to Firestore `newsletters` collection
                await db.collection("newsletters").add({
                    title: title,
                    kicker: kicker,
                    summary: summary,
                    link: link,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });

                // 2. Fetch all subscribers
                let subscribers = [];
                const querySnapshot = await db.collection("subscribers").get();
                querySnapshot.forEach((doc) => {
                    subscribers.push(doc.data().email);
                });

                // Remove duplicates just in case
                subscribers = [...new Set(subscribers)];

                // 3. Send Emails via EmailJS to each subscriber
                if (subscribers.length > 0 && typeof emailjs !== 'undefined' && window.EMAILJS_CONFIG && window.EMAILJS_CONFIG.PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
                    
                    const emailPromises = subscribers.map(subEmail => {
                        return emailjs.send(
                            window.EMAILJS_CONFIG.SERVICE_ID,
                            window.EMAILJS_CONFIG.NEW_POST_TEMPLATE_ID, 
                            {
                                to_email: subEmail,
                                news_title: title,
                                news_kicker: kicker,
                                news_summary: summary,
                                news_link: link
                            }
                        ).catch(err => console.warn(`Failed to send email to ${subEmail}`, err));
                    });

                    // Wait for all emails to finish sending
                    await Promise.all(emailPromises);
                } else {
                    console.warn("No subscribers found or EmailJS not fully configured.");
                }

                // 4. Success UI Update
                uploadForm.reset();
                uploadStatus.style.display = "block";
                uploadStatus.style.color = "#10b981";
                uploadStatus.innerText = `Published successfully! Updates sent to ${subscribers.length} subscribers.`;

            } catch (error) {
                console.error("Error creating newsletter: ", error);
                uploadStatus.style.display = "block";
                uploadStatus.classList.add("error-message");
                uploadStatus.innerText = `Error: ${error.message}. Check Firebase Config.`;
            } finally {
                uploadBtn.disabled = false;
                uploadBtn.innerText = "Publish & Notify Subscribers";
            }
        });
    }
});
