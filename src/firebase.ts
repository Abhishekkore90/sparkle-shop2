// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBnIfSm8FVWCx44wZxyg4ejcTlrHK-MjZs",
  authDomain: "aqua-ro-d6ff9.firebaseapp.com",
  projectId: "aqua-ro-d6ff9",
  storageBucket: "aqua-ro-d6ff9.firebasestorage.app",
  messagingSenderId: "339216541850",
  appId: "1:339216541850:web:2dbaa3ba1fa6e94c449723",
  measurementId: "G-XYNYGXG25K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db };
