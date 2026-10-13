# HB Plus Corporate Authentication App

[![Platform](https://img.shields.io/badge/Platform-Web%20%7C%20iOS%20%7C%20Android-blue.svg)](https://expo.dev)
[![Expo SDK](https://img.shields.io/badge/Expo%20SDK-57-black.svg)](https://docs.expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.86-61DAFB.svg)](https://reactnative.dev)
[![Firebase](https://img.shields.io/badge/Firebase%20Auth-v13-FFCA28.svg)](https://firebase.google.com)
[![Netlify Status](https://img.shields.io/badge/Netlify-Live%20Demo-00C7B7.svg)](https://spectacular-naiad-6941fa.netlify.app)

> 🚀 **Live Production Deployment**: [https://spectacular-naiad-6941fa.netlify.app](https://spectacular-naiad-6941fa.netlify.app)  
> 🔗 **GitHub Repository**: [https://github.com/AmiteshKumarDubey/hbplus-auth-app](https://github.com/AmiteshKumarDubey/hbplus-auth-app)

A complete, production-ready cross-platform authentication application built with **React Native**, **Expo**, **React Native for Web**, and **Firebase Authentication**. Features enterprise-grade Google OAuth with strict corporate domain restriction (`@hbplus.fit`), role-based access control (`Admin` vs `User`), and protected navigation routing.

---

## 📑 Table of Contents
1. [Live Deployment & Submission](#-live-deployment--submission)
2. [Key Features](#-key-features)
3. [Tech Stack](#-tech-stack)
4. [Folder Structure](#-folder-structure)
5. [Firebase Configuration](#-firebase-configuration)
6. [Authentication Flow](#-authentication-flow)
7. [Domain Restriction Validation Logic](#-domain-restriction-validation-logic)
8. [Getting Started & Local Setup](#-getting-started--local-setup)
9. [Available Scripts](#-available-scripts)
10. [Deployment Guide (Netlify)](#-deployment-guide-netlify)
11. [Security & Production Hardening](#-security--production-hardening)

---

## 🌐 Live Deployment & Submission

- **Live URL**: [https://spectacular-naiad-6941fa.netlify.app](https://spectacular-naiad-6941fa.netlify.app)
- **Repository**: [https://github.com/AmiteshKumarDubey/hbplus-auth-app](https://github.com/AmiteshKumarDubey/hbplus-auth-app)

---

## 🚀 Key Features

- **Cross-Platform Parity**: Unified codebase running seamlessly across Web browsers, iOS, and Android using Expo and React Native for Web.
- **Enterprise Domain Restriction**: Automated gatekeeper enforcing that only Google accounts ending in `@hbplus.fit` gain access. Disallowed accounts (e.g. `@gmail.com`) are immediately evicted and signed out.
- **Protected Routes**: Navigation hierarchy governed by `@react-navigation/native-stack`. Unauthenticated requests cannot access internal screens, and logouts cleanly wipe session state.
- **Role-Based Access Control (RBAC)**: Dynamically assigns and renders visual role badges (`Admin` vs `User`) along with role-tailored dashboard control panels.
- **Database Persistence**: Synchronizes authenticated corporate member profiles to Cloud Firestore database (`users` collection).
- **Premium Glassmorphic UI**: High-contrast, dark-mode corporate theme with ambient lighting, frosted glass cards, custom vector icons, and fluid responsive layouts.

---

## 🛠 Tech Stack

| Component | Technology | Version |
| :--- | :--- | :--- |
| **Framework** | Expo (SDK 57) | `~57.0.28` |
| **Core UI** | React Native / React Native for Web | `0.86.3` / `0.21.2` |
| **Web Runtime** | React 19 / React DOM | `19.2.3` |
| **Authentication** | Firebase JavaScript SDK (Auth, App, Analytics, Firestore) | `^13.0.0` |
| **Navigation** | React Navigation Native & Native-Stack | `^7.5.0` |
| **State Persistence**| React Native Async Storage | `2.2.0` |
| **Icons & Design** | Expo Vector Icons (`Ionicons`) | `^15.0.2` |
| **Hosting** | Netlify Single-Page Web Export | Configured |

---

## 📁 Folder Structure

```
hbplus-auth-app/
├── assets/                       # App icons, favicons, and splash screens
├── src/
│   ├── components/               # Reusable UI components
│   │   ├── AlertBanner.js        # Error/restriction notification banner
│   │   ├── GlassCard.js          # Glassmorphic surface container
│   │   ├── GoogleButton.js       # Authentic Google branded OAuth button
│   │   └── RoleBadge.js          # Dynamic Admin / User role badge
│   ├── config/                   # Centralized configuration & constants
│   │   ├── constants.js          # ALLOWED_DOMAIN, error messages, app metadata
│   │   └── firebase.js           # Firebase app initialization, Firestore & auth exports
│   ├── context/                  # Application state & context providers
│   │   └── AuthContext.js        # React Context managing session, user & roles
│   ├── navigation/               # Routing & protected screen transitions
│   │   └── AppNavigator.js       # React Navigation stack with auth guard
│   ├── screens/                  # Top-level screen views
│   │   ├── DashboardScreen.js    # Protected dashboard with profile & controls
│   │   └── LoginScreen.js        # Corporate login interface & error alerts
│   ├── services/                 # Business logic & API abstraction
│   │   └── authService.js        # Google OAuth, domain verification engine & Firestore sync
│   └── theme/                    # Design tokens & color system
│       └── colors.js             # Curated dark-mode theme colors
├── App.js                        # Application root entry point
├── app.json                      # Expo application metadata & config
├── index.js                      # Expo entry register
├── netlify.toml                  # Netlify build command, headers & SPA rewrites
├── package.json                  # Dependencies & npm scripts
└── README.md                     # Complete project documentation
```

---

## 🔥 Firebase Configuration

The application is connected to the HB+ Firebase project in [`src/config/firebase.js`](src/config/firebase.js):

```javascript
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeAuth, getAuth, getReactNativePersistence, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyCAkICLhKbMLgTc4TwPmpVh-PVoYCQz6eE",
  authDomain: "hbplus-auth-app.firebaseapp.com",
  projectId: "hbplus-auth-app",
  storageBucket: "hbplus-auth-app.firebasestorage.app",
  messagingSenderId: "665048582658",
  appId: "1:665048582658:web:6ebc5b1492188ad2f7b51b",
  measurementId: "G-451RNN9H05"
};

// Singleton initialization
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Safe analytics loading (Web-only)
let analytics = null;
if (Platform.OS === "web" && typeof window !== "undefined") {
  try { analytics = getAnalytics(app); } catch (e) {}
}

// Cross-platform Auth Persistence
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

// Firestore Database for User Data Storage
let db = null;
try {
  db = getFirestore(app);
} catch (e) {}

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export { app, analytics, auth, db, googleProvider, firebaseConfig };
```

---

## 🔄 Authentication Flow

```
+-----------------------------------------------------------+
|                        Login Screen                       |
+-----------------------------------------------------------+
                              |
                     [Sign In with Google]
                              |
                              v
             +----------------------------------+
             | Firebase Google OAuth Flow       |
             | (signInWithPopup / Credential)   |
             +----------------------------------+
                              |
                              v
             +----------------------------------+
             |  Extract user email address      |
             +----------------------------------+
                              |
               Does email end with @hbplus.fit?
                              |
             +----------------+----------------+
             |                                 |
           [YES]                              [NO]
             |                                 |
             v                                 v
   +--------------------+            +--------------------+
   | Derive User Role   |            | Invalidate Session |
   | (Admin vs User)    |            | (signOut(auth))    |
   +--------------------+            +--------------------+
             |                                 |
             v                                 v
   +--------------------+            +--------------------+
   | Sync to Firestore  |            | Display Alert:     |
   | (users collection) |            | "Access restricted.|
   +--------------------+            |  Please login using|
             |                       |  your official     |
             v                       |  domain email."    |
   +--------------------+            +--------------------+
   | Mount Protected    |
   | Dashboard Screen   |
   +--------------------+
```

---

## 🛡 Domain Restriction Validation Logic

The corporate domain restriction is configured centrally in [`src/config/constants.js`](src/config/constants.js):

```javascript
// Configurable corporate domain
export const ALLOWED_DOMAIN = "@hbplus.fit";

// Standard restricted access notification
export const RESTRICTED_ERROR_MESSAGE =
  "Access restricted. Please login using your official domain email.";
```

### The Validation Engine

1. **Extraction**: Following OAuth authentication, `user.email` is retrieved from the credentials.
2. **Sanitization**: Whitespace is trimmed and string is converted to lowercase.
3. **Verification**:
   ```javascript
   export const isAllowedDomain = (email) => {
     if (!email || typeof email !== "string") return false;
     const cleanEmail = email.trim().toLowerCase();
     const targetDomain = ALLOWED_DOMAIN.toLowerCase().startsWith("@")
       ? ALLOWED_DOMAIN.toLowerCase()
       : `@${ALLOWED_DOMAIN.toLowerCase()}`;

     return cleanEmail.endsWith(targetDomain);
   };
   ```
4. **Immediate Eviction upon Restriction**:
   If `isAllowedDomain(email)` returns `false`:
   - `signOut(auth)` is triggered immediately on the Firebase instance to invalidate tokens and kill local cache.
   - An `AUTH_DOMAIN_RESTRICTED` error is thrown with `RESTRICTED_ERROR_MESSAGE`.
   - The user is kept on the Login Screen and the `AlertBanner` highlights the restriction in crimson:
     > *"Access restricted. Please login using your official domain email."*

---

## 💻 Getting Started & Local Setup

### Prerequisites
- **Node.js**: v18.0.0 or later (v22 LTS recommended)
- **npm** or **bun** / **yarn**

### 1. Installation
Clone the repository and install project dependencies:
```bash
git clone https://github.com/AmiteshKumarDubey/hbplus-auth-app.git
cd hbplus-auth-app
npm install
```

### 2. Start Local Development Server

#### Running on Web:
```bash
npm run web
```
The application will launch in your default web browser at `http://localhost:8081`.

#### Running on Mobile (iOS / Android):
```bash
npm start
```
Scan the QR code with the **Expo Go** app on your physical mobile device or launch directly in an iOS Simulator / Android Emulator (`press i` or `press a`).

---

## 📜 Available Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| `npm run web` | `expo start --web` | Runs the Expo dev server targeting Web |
| `npm start` | `expo start` | Starts interactive Expo CLI bundler |
| `npm run android` | `expo start --android` | Launches dev server and connects to Android emulator |
| `npm run ios` | `expo start --ios` | Launches dev server and connects to iOS Simulator |
| `npm run build:web` | `expo export -p web` | Generates optimized production static bundle in `/dist` |

---

## 🌐 Deployment Guide (Netlify)

This project is pre-configured for automated continuous deployment to **Netlify** via [`netlify.toml`](netlify.toml).

### Option A: Deploy via Netlify CLI

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```
2. **Build the production bundle**:
   ```bash
   npm run build:web
   ```
3. **Deploy**:
   ```bash
   netlify deploy --prod --dir=dist
   ```

---

### Option B: Deploy via Netlify Git Integration

1. Push your repository to **GitHub**.
2. Log in to [Netlify](https://app.netlify.com) and click **"Add new site" > "Import an existing project"**.
3. Select your repository (`hbplus-auth-app`).
4. Netlify will automatically detect the settings from `netlify.toml`:
   - **Base directory**: `/` (leave empty)
   - **Build command**: `npm run build:web`
   - **Publish directory**: `dist`
5. Click **"Deploy Site"**.

### Important: Firebase Authorized Domains
In order for Google OAuth popups to function on your deployed Netlify domain:
1. Go to the [Firebase Console](https://console.firebase.google.com).
2. Navigate to **Authentication** > **Settings** > **Authorized domains**.
3. Click **Add domain** and enter your Netlify subdomain (e.g., `spectacular-naiad-6941fa.netlify.app`).

---

## 🔒 Security & Production Hardening

- **No Secret Leaks**: Firebase Web API keys are identifiers intended for public client use; security is enforced via Firebase Auth Domain verification and Google OAuth configuration.
- **Content Security Headers**: [`netlify.toml`](netlify.toml) configures `X-Frame-Options: DENY`, `X-XSS-Protection`, and `nosniff` headers to mitigate framing and injection risks.
- **Fail-Closed Gatekeeping**: If a user's network or state fails during domain validation, the authentication context automatically fails closed, ensuring unverified users are rejected by default.
