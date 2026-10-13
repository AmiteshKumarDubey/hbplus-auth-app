import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
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
import { APP_CONFIG, ALLOWED_DOMAIN } from "../config/constants";

export const LoginScreen = () => {
  const {
    loginWithGoogle,
    authActionLoading,
    error,
    clearError,
  } = useAuth();

  const handleGoogleSignIn = async () => {
    clearError();
    await loginWithGoogle();
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
