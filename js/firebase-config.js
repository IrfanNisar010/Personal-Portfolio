// Firebase Configuration (v9 Compat)
// This file is loaded via a standard <script> tag, so firebase is available globally.

const firebaseConfig = {
    apiKey: "AIzaSyAV8d6Pw_7A6LYjIx3syo-3fkAloKl3jQ4",
    authDomain: "newsletter-208d7.firebaseapp.com",
    projectId: "newsletter-208d7",
    storageBucket: "newsletter-208d7.firebasestorage.app",
    messagingSenderId: "387147515478",
    appId: "1:387147515478:android:68f3a381339b83fe42ddf7"
};

// Initialize Firebase if config exists
window.isFirebaseConfigured = false;
if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
    try {
        firebase.initializeApp(firebaseConfig);
        window.isFirebaseConfigured = true;
    } catch (error) {
        console.error("Firebase not configured correctly.", error);
    }
}
