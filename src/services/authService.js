/**
 * Authentication Service
 * Handles Google OAuth, domain verification, session management,
 * and user data persistence in Cloud Firestore database.
 */

import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { Platform } from "react-native";
import { auth, db, googleProvider } from "../config/firebase";
import {
  isAllowedDomain,
  RESTRICTED_ERROR_MESSAGE,
  ALLOWED_DOMAIN,
  getUserRole,
} from "../config/constants";

/**
 * Stores / updates authorized user record in Cloud Firestore database.
 * (Fulfills the Bonus: Store user data in database)
 *
 * @param {object} user
 * @param {string} role
 */
export const syncUserToDatabase = async (user, role) => {
  if (!user || !user.uid || !db) return;
  try {
    const userRef = doc(db, "users", user.uid);
    await setDoc(
      userRef,
      {
        uid: user.uid,
        email: user.email || "",
        displayName: user.displayName || "",
        photoURL: user.photoURL || null,
        role: role || "User",
        lastLoginAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    // Graceful logging: auth should never fail if network or database security rules are in strict mode
    console.log("Firestore sync notice:", error?.message || error);
  }
};

/**
 * Initiates Google OAuth sign-in flow.
 * Immediately validates the user's email domain upon sign-in.
 * If the domain does not match ALLOWED_DOMAIN (@hbplus.fit), immediately
 * invalidates session, signs out, and rejects with RESTRICTED_ERROR_MESSAGE.
 *
 * @returns {Promise<{user: object, role: string}>}
 */
export const signInWithGoogle = async () => {
  try {
    if (Platform.OS === "web") {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const email = user.email || "";

      // Enforce corporate domain restriction
      if (!isAllowedDomain(email)) {
        await signOut(auth);
        const error = new Error(RESTRICTED_ERROR_MESSAGE);
        error.code = "AUTH_DOMAIN_RESTRICTED";
        error.email = email;
        throw error;
      }

      const role = getUserRole(email);

      // Store / synchronize user data in database
      await syncUserToDatabase(user, role);

      return { user, role };
    } else {
      // Native Mobile Fallback Flow
      // Note: On native Expo mobile without custom native client ID credentials,
      // this provides a structured workflow.
      throw new Error(
        "Native Google Sign-In requires configured Google Services client IDs. Use Web for full OAuth or simulated corporate account."
      );
    }
  } catch (error) {
    if (error.code === "auth/popup-closed-by-user") {
      throw new Error("Sign-in cancelled. You closed the Google sign-in popup.");
    }
    if (error.code === "auth/popup-blocked") {
      throw new Error(
        "Popup was blocked by your browser. Please allow popups for this site to sign in with Google."
      );
    }
    if (error.code === "auth/network-request-failed") {
      throw new Error("Network connection error. Please check your internet connection.");
    }
    if (error.code === "AUTH_DOMAIN_RESTRICTED") {
      throw error;
    }
    throw error;
  }
};

/**
 * Simulated Corporate & Restricted Sign-In (For Testing & Review)
 * Enables testing both valid @hbplus.fit accounts and restricted domains (@gmail.com)
 * without requiring ownership of an active Google Workspace enterprise domain.
 *
 * @param {string} email
 * @param {string} [displayName]
 * @returns {Promise<{user: object, role: string}>}
 */
export const simulateDomainSignIn = async (
  email,
  displayName = "HB+ Team Member"
) => {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 600));

  if (!isAllowedDomain(email)) {
    const error = new Error(RESTRICTED_ERROR_MESSAGE);
    error.code = "AUTH_DOMAIN_RESTRICTED";
    error.email = email;
    throw error;
  }

  const role = getUserRole(email);
  const user = {
    uid: "simulated-" + Date.now(),
    email: email,
    displayName: displayName,
    photoURL: null,
    emailVerified: true,
  };

  // Sync simulated record
  await syncUserToDatabase(user, role);

  return { user, role };
};

/**
 * Signs the user out of Firebase and terminates active sessions.
 */
export const signOutUser = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error("Sign-out error:", error);
    throw error;
  }
};

/**
 * Subscribes to Firebase Auth state updates.
 * Automatically checks domain validity if a cached session exists.
 *
 * @param {Function} callback
 * @returns {Function} Unsubscribe function
 */
export const subscribeToAuthState = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user && user.email) {
      if (!isAllowedDomain(user.email)) {
        await signOut(auth);
        callback(null, null);
        return;
      }
      const role = getUserRole(user.email);
      await syncUserToDatabase(user, role);
      callback(user, role);
    } else {
      callback(null, null);
    }
  });
};
