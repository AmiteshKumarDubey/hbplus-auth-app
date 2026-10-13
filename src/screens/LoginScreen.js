import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { GoogleButton } from "../components/GoogleButton";
import { AlertBanner } from "../components/AlertBanner";
import { GlassCard } from "../components/GlassCard";
import { colors } from "../theme/colors";
import { APP_CONFIG, ALLOWED_DOMAIN, isDemoToolsEnabled } from "../config/constants";

export const LoginScreen = () => {
  const {
    loginWithGoogle,
    loginWithSimulation,
    authActionLoading,
    error,
    clearError,
  } = useAuth();

  const [showDevTools, setShowDevTools] = useState(false);
  const isDemoAvailable = isDemoToolsEnabled();

  const handleGoogleSignIn = async () => {
    clearError();
    await loginWithGoogle();
  };

  const handleSimulatedSignIn = async (email, name) => {
    clearError();
    await loginWithSimulation(email, name);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Ambient Decorative Background Circles */}
          <View style={styles.ambientGlowTop} pointerEvents="none" />
          <View style={styles.ambientGlowBottom} pointerEvents="none" />

          <View style={styles.contentWrapper}>
            {/* Brand Logo & Header */}
            <View style={styles.header}>
              <View style={styles.logoBadge}>
                <Text style={styles.logoText}>HB+</Text>
              </View>
              <Text style={styles.title}>{APP_CONFIG.appName}</Text>
              <Text style={styles.subtitle}>{APP_CONFIG.tagline}</Text>
            </View>

            {/* Login Card */}
            <GlassCard glow style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.badgeRow}>
                  <View style={styles.securityBadge}>
                    <Ionicons
                      name="shield-checkmark"
                      size={14}
                      color={colors.accentEmerald}
                      style={{ marginRight: 6 }}
                    />
                    <Text style={styles.securityBadgeText}>
                      Domain Restricted Access
                    </Text>
                  </View>
                </View>

                <Text style={styles.cardTitle}>Sign In</Text>
                <Text style={styles.cardDescription}>
                  This portal is strictly reserved for authorized personnel.
                  Authenticate using your official{" "}
                  <Text style={styles.highlightDomain}>{ALLOWED_DOMAIN}</Text>{" "}
                  Google Workspace credentials.
                </Text>
              </View>

              {/* Error Banner (Displays when domain is restricted or sign-in fails) */}
              {error ? (
                <AlertBanner
                  type="error"
                  title="Access Restricted"
                  message={error}
                  onDismiss={clearError}
                />
              ) : null}

              {/* Primary Action: Google OAuth Button */}
              <View style={styles.buttonWrapper}>
                <GoogleButton
                  onPress={handleGoogleSignIn}
                  loading={authActionLoading}
                  title="Sign in with Google"
                />
              </View>

              {/* Corporate Domain Policy Notice */}
              <View style={styles.policyBox}>
                <Ionicons
                  name="information-circle-outline"
                  size={16}
                  color={colors.textSecondary}
                  style={{ marginRight: 8, marginTop: 1 }}
                />
                <Text style={styles.policyText}>
                  Accounts ending with any domain other than{" "}
                  <Text style={styles.boldText}>{ALLOWED_DOMAIN}</Text> will be
                  automatically rejected and signed out immediately.
                </Text>
              </View>

              {/* Developer / Demonstration Testing Drawer (Visible on localhost dev, hidden in production unless ?demo=true) */}
              {isDemoAvailable && (
                <View style={styles.devDrawerSection}>
                  <TouchableOpacity
                    onPress={() => setShowDevTools(!showDevTools)}
                    style={styles.devToggle}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={showDevTools ? "chevron-up" : "chevron-down"}
                      size={14}
                      color={colors.textMuted}
                      style={{ marginRight: 6 }}
                    />
                    <Text style={styles.devToggleText}>
                      {showDevTools ? "Hide Quick-Test Scenarios" : "Quick-Test Scenarios (Allowed & Restricted)"}
                    </Text>
                  </TouchableOpacity>

                  {showDevTools && (
                    <View style={styles.devBox}>
                      <Text style={styles.devBoxHeading}>
                        Validate Domain Restriction Engine:
                      </Text>
                      <View style={styles.devButtonsGrid}>
                        <TouchableOpacity
                          style={[styles.devButton, styles.devButtonSuccess]}
                          onPress={() =>
                            handleSimulatedSignIn(
                              "alex.morgan@hbplus.fit",
                              "Alex Morgan"
                            )
                          }
                          disabled={authActionLoading}
                        >
                          <Ionicons
                            name="checkmark-circle"
                            size={14}
                            color={colors.accentEmerald}
                            style={{ marginRight: 6 }}
                          />
                          <Text style={styles.devButtonText}>
                            Allowed User (@hbplus.fit)
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[styles.devButton, styles.devButtonAdmin]}
                          onPress={() =>
                            handleSimulatedSignIn(
                              "admin@hbplus.fit",
                              "Sarah Chen (Admin)"
                            )
                          }
                          disabled={authActionLoading}
                        >
                          <Ionicons
                            name="shield"
                            size={14}
                            color={colors.roleAdminText}
                            style={{ marginRight: 6 }}
                          />
                          <Text style={styles.devButtonText}>
                            Allowed Admin (@hbplus.fit)
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[styles.devButton, styles.devButtonFail]}
                          onPress={() =>
                            handleSimulatedSignIn(
                              "external.user@gmail.com",
                              "External User"
                            )
                          }
                          disabled={authActionLoading}
                        >
                          <Ionicons
                            name="close-circle"
                            size={14}
                            color={colors.error}
                            style={{ marginRight: 6 }}
                          />
                          <Text style={styles.devButtonText}>
                            Restricted (@gmail.com)
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>
              )}
            </GlassCard>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                {APP_CONFIG.companyName} • Confidential & Proprietary
              </Text>
              <Text style={styles.footerSubtext}>
                Need assistance? Contact{" "}
                <Text style={styles.footerLink}>{APP_CONFIG.supportEmail}</Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
    minHeight: "100%",
  },
  ambientGlowTop: {
    position: "absolute",
    top: -80,
    left: "20%",
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "rgba(99, 102, 241, 0.15)",
    ...Platform.select({
      web: {
        filter: "blur(90px)",
      },
    }),
  },
  ambientGlowBottom: {
    position: "absolute",
    bottom: -60,
    right: "15%",
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(6, 182, 212, 0.12)",
    ...Platform.select({
      web: {
        filter: "blur(80px)",
      },
    }),
  },
  contentWrapper: {
    width: "100%",
    maxWidth: 480,
    alignItems: "center",
    zIndex: 1,
  },
  header: {
    alignItems: "center",
    marginBottom: 28,
  },
  logoBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 8,
  },
  logoText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.5,
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
  },
  card: {
    width: "100%",
  },
  cardHeader: {
    marginBottom: 18,
  },
  badgeRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  securityBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(16, 185, 129, 0.12)",
    borderColor: "rgba(16, 185, 129, 0.3)",
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  securityBadgeText: {
    color: colors.accentEmerald,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 21,
  },
  highlightDomain: {
    color: "#818CF8",
    fontWeight: "700",
  },
  buttonWrapper: {
    marginVertical: 10,
  },
  policyBox: {
    flexDirection: "row",
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: 12,
    marginTop: 14,
    alignItems: "flex-start",
  },
  policyText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 17,
    flex: 1,
  },
  boldText: {
    color: colors.textPrimary,
    fontWeight: "600",
  },
  devDrawerSection: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
    paddingTop: 16,
  },
  devToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  devToggleText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "600",
  },
  devBox: {
    backgroundColor: "rgba(15, 23, 42, 0.75)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
    padding: 12,
    marginTop: 12,
  },
  devBoxHeading: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  devButtonsGrid: {
    gap: 8,
  },
  devButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    ...Platform.select({
      web: {
        cursor: "pointer",
      },
    }),
  },
  devButtonSuccess: {
    backgroundColor: "rgba(16, 185, 129, 0.08)",
    borderColor: "rgba(16, 185, 129, 0.3)",
  },
  devButtonAdmin: {
    backgroundColor: "rgba(139, 92, 246, 0.08)",
    borderColor: "rgba(139, 92, 246, 0.3)",
  },
  devButtonFail: {
    backgroundColor: "rgba(239, 68, 68, 0.08)",
    borderColor: "rgba(239, 68, 68, 0.3)",
  },
  devButtonText: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: "600",
  },
  footer: {
    marginTop: 32,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: colors.textMuted,
  },
  footerLink: {
    color: colors.primary,
    fontWeight: "600",
  },
});

export default LoginScreen;
