// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  initializeAuth, 
  getAuth, 
  getReactNativePersistence, 
  GoogleAuthProvider 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCAkICLhKbMLgTc4TwPmpVh-PVoYCQz6eE",
  authDomain: "hbplus-auth-app.firebaseapp.com",
  projectId: "hbplus-auth-app",
  storageBucket: "hbplus-auth-app.firebasestorage.app",
  messagingSenderId: "665048582658",
  appId: "1:665048582658:web:6ebc5b1492188ad2f7b51b",
  measurementId: "G-451RNN9H05"
};

// Initialize Firebase App singleton
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let analytics = null;
try {
  if (Platform.OS === "web" && typeof window !== "undefined") {
    analytics = getAnalytics(app);
  }
} catch (error) {
  // Graceful fallback for environments where indexedDB/analytics is unsupported
  console.log("Firebase Analytics initialization skipped:", error?.message || error);
}

// Initialize Auth with cross-platform persistence (AsyncStorage for mobile, indexedDB/local for web)
let auth;
if (Platform.OS === "web") {
  auth = getAuth(app);
} else {
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    auth = getAuth(app);
  }
}

// Initialize Cloud Firestore database for user data storage (Bonus Requirement)
let db = null;
try {
  db = getFirestore(app);
} catch (error) {
  console.log("Firestore initialization note:", error?.message || error);
}

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

export { app, analytics, auth, db, googleProvider, firebaseConfig };
export default app;
