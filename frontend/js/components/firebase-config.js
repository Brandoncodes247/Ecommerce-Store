// js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Check if Firebase already initialized
if (!globalThis._firebaseInitialized) {
  const firebaseConfig = {
    apiKey: "AIzaSyBQOGhdp1DQ_WwGN3C1NVdtjKEMapGuWmA",
    authDomain: "ecommerce-store-ef497.firebaseapp.com",
    projectId: "ecommerce-store-ef497",
    storageBucket: "ecommerce-store-ef497.appspot.com",
    messagingSenderId: "137024835219",
    appId: "1:137024835219:web:6bb3e9a289a7c2dd85c766",
    measurementId: "G-Y9XBXP1XR3"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  globalThis._firebaseInitialized = true;
}

export const auth = getAuth();