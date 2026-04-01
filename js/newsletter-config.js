// EmailJS Configuration
// 1. Sign up at emailjs.com
// 2. Add an Email Service (e.g., Gmail)
// 3. Create Email Templates for Subscriber Welcome and New Upload Notification
// 4. Fill in these IDs

const EMAILJS_CONFIG = {
    PUBLIC_KEY: "YOUR_PUBLIC_KEY", // Get from Account -> API Keys
    SERVICE_ID: "YOUR_SERVICE_ID", // Get from Email Services
    NEW_SUBSCRIBER_TEMPLATE_ID: "YOUR_SUBSCRIBER_TEMPLATE_ID", // Template sent to new subscriber
    ADMIN_NOTIFY_TEMPLATE_ID: "YOUR_ADMIN_NOTIFY_TEMPLATE_ID", // Template sent to you when someone joins
    NEW_POST_TEMPLATE_ID: "YOUR_NEW_POST_TEMPLATE_ID" // Template sent to subscribers when you upload
};

// Initialize EmailJS
(function() {
    if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
        emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
    }
})();

window.EMAILJS_CONFIG = EMAILJS_CONFIG;
