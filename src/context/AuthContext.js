import React, { createContext, useContext, useState, useEffect } from "react";
import {
  signInWithGoogle,
  signOutUser,
  subscribeToAuthState,
} from "../services/authService";
import { RESTRICTED_ERROR_MESSAGE } from "../config/constants";

const AuthContext = createContext({
  user: null,
  role: "User",
  loading: true,
  authActionLoading: false,
  error: null,
  loginWithGoogle: async () => {},
  logout: async () => {},
  clearError: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("User");
  const [loading, setLoading] = useState(true);
  const [authActionLoading, setAuthActionLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Listen for Firebase auth state changes
    const unsubscribe = subscribeToAuthState((firebaseUser, userRole) => {
      setUser(firebaseUser);
      setRole(userRole || "User");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const clearError = () => setError(null);

  /**
   * Triggers official Google OAuth sign-in flow.
   */
  const handleGoogleLogin = async () => {
    try {
      setError(null);
      setAuthActionLoading(true);
      const { user: authedUser, role: authedRole } = await signInWithGoogle();
      setUser(authedUser);
      setRole(authedRole);
      return { success: true, user: authedUser };
    } catch (err) {
      const message = err.message || RESTRICTED_ERROR_MESSAGE;
      setError(message);
      return { success: false, error: message };
    } finally {
      setAuthActionLoading(false);
    }
  };

  /**
   * Logs out the user and clears state.
   */
  const handleLogout = async () => {
    try {
      setAuthActionLoading(true);
      await signOutUser();
      setUser(null);
      setRole("User");
      setError(null);
    } catch (err) {
      console.error("Logout error:", err);
      setUser(null);
      setRole("User");
    } finally {
      setAuthActionLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        authActionLoading,
        error,
        loginWithGoogle: handleGoogleLogin,
        logout: handleLogout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
