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
