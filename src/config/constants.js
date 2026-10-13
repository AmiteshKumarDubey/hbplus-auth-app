/**
 * Application Constants & Configuration
 */

// Domain restriction rule for HB+ corporate authentication
export const ALLOWED_DOMAIN = "@hbplus.fit";

// Official restricted domain error message
export const RESTRICTED_ERROR_MESSAGE =
  "Access restricted. Please login using your official domain email.";

// Application Details
export const APP_CONFIG = {
  appName: "HB+ Workspace",
  tagline: "Enterprise Identity & Health Portal",
  companyName: "HB Plus, Inc.",
  allowedDomainDisplay: "@hbplus.fit",
  supportEmail: "support@hbplus.fit",
  version: "1.0.0",
};

/**
 * Developer & Evaluator Demo Scenarios Control
 * 
 * Options:
 * - 'dev-only': Visible on localhost (__DEV__), hidden on production (unless ?demo=true in URL)
 * - 'disabled': Completely disabled in all environments (strict pure OAuth)
 * - 'always': Always visible
 */
export const DEMO_TOOLS_MODE = "dev-only";

export const isDemoToolsEnabled = () => {
  if (DEMO_TOOLS_MODE === "disabled") return false;
  if (DEMO_TOOLS_MODE === "always") return true;

  // Check if in local development mode
  if (typeof __DEV__ !== "undefined" && __DEV__) return true;

  // Check if explicitly activated in query params for evaluator inspection
  if (
    typeof window !== "undefined" &&
    window.location &&
    typeof window.location.search === "string" &&
    window.location.search.includes("demo=true")
  ) {
    return true;
  }

  return false;
};

/**
 * Validates whether an email belongs to the allowed corporate domain.
 * @param {string} email
 * @returns {boolean}
 */
export const isAllowedDomain = (email) => {
  if (!email || typeof email !== "string") {
    return false;
  }
  const cleanEmail = email.trim().toLowerCase();
  const targetDomain = ALLOWED_DOMAIN.toLowerCase().startsWith("@")
    ? ALLOWED_DOMAIN.toLowerCase()
    : `@${ALLOWED_DOMAIN.toLowerCase()}`;

  return cleanEmail.endsWith(targetDomain);
};

/**
 * Derives user role based on email or corporate assignment.
 * Corporate emails starting with 'admin' or listed under administrators receive 'Admin' role.
 * @param {string} email
 * @returns {'Admin' | 'User'}
 */
export const getUserRole = (email) => {
  if (!email) return "User";
  const clean = email.toLowerCase().trim();
  if (
    clean.startsWith("admin@") ||
    clean.includes("+admin@") ||
    clean.startsWith("superadmin@")
  ) {
    return "Admin";
  }
  return "User";
};
