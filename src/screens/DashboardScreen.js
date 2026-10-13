import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { RoleBadge } from "../components/RoleBadge";
import { GlassCard } from "../components/GlassCard";
import { colors } from "../theme/colors";
import { APP_CONFIG, ALLOWED_DOMAIN } from "../config/constants";

export const DashboardScreen = () => {
  const { user, role, logout, authActionLoading } = useAuth();

  const displayName =
    user?.displayName ||
    (user?.email ? user.email.split("@")[0].replace(".", " ") : "Corporate Member");

  const email = user?.email || "unknown@hbplus.fit";
  const photoURL = user?.photoURL;
  const isAdmin = role?.toLowerCase() === "admin";

  const getInitials = (name) => {
    if (!name) return "HB";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Ambient Decorative Glows */}
        <View style={styles.ambientGlowTop} pointerEvents="none" />
        <View style={styles.ambientGlowRight} pointerEvents="none" />

        <View style={styles.container}>
          {/* Top Bar */}
          <View style={styles.topBar}>
            <View style={styles.brandRow}>
              <View style={styles.brandBadge}>
                <Text style={styles.brandText}>HB+</Text>
              </View>
              <View>
                <Text style={styles.brandName}>{APP_CONFIG.appName}</Text>
                <View style={styles.liveIndicatorRow}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>Authenticated Session</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              onPress={logout}
              disabled={authActionLoading}
              style={styles.headerLogoutBtn}
              activeOpacity={0.8}
            >
              {authActionLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="log-out-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.headerLogoutText}>Sign Out</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Welcome Banner */}
          <View style={styles.welcomeBanner}>
            <Text style={styles.welcomeSubtitle}>Welcome Back,</Text>
            <Text style={styles.welcomeTitle}>{displayName}</Text>
          </View>

          {/* User Profile Card */}
          <GlassCard glow style={styles.profileCard}>
            <View style={styles.profileHeader}>
              {/* Avatar */}
              <View style={styles.avatarContainer}>
                {photoURL ? (
                  <Image source={{ uri: photoURL }} style={styles.avatarImage} />
                ) : (
                  <View style={[styles.avatarFallback, isAdmin && styles.avatarAdmin]}>
                    <Text style={styles.avatarInitials}>{getInitials(displayName)}</Text>
                  </View>
                )}
                <View style={styles.avatarBadge}>
                  <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                </View>
              </View>

              {/* Profile Details */}
              <View style={styles.profileInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.profileName}>{displayName}</Text>
                  <RoleBadge role={role} />
                </View>

                <View style={styles.emailRow}>
                  <Ionicons name="mail-outline" size={15} color={colors.textSecondary} style={{ marginRight: 6 }} />
                  <Text style={styles.profileEmail}>{email}</Text>
                </View>

                <View style={styles.domainVerifiedRow}>
                  <Ionicons name="shield-checkmark" size={14} color={colors.accentEmerald} style={{ marginRight: 6 }} />
                  <Text style={styles.domainVerifiedText}>
                    Authorized Domain ({ALLOWED_DOMAIN})
                  </Text>
                </View>
              </View>
            </View>

            {/* Quick Session Stats Grid */}
            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>AUTH METHOD</Text>
                <Text style={styles.statValue}>Google OAuth 2.0</Text>
              </View>

              <View style={styles.statBox}>
                <Text style={styles.statLabel}>DOMAIN RESTRICTION</Text>
                <Text style={[styles.statValue, { color: colors.accentEmerald }]}>Enforced</Text>
              </View>

              <View style={styles.statBox}>
                <Text style={styles.statLabel}>ROLE PRIVILEGES</Text>
                <Text style={[styles.statValue, isAdmin ? { color: colors.roleAdminText } : { color: colors.accentEmerald }]}>
                  {isAdmin ? "Enterprise Admin" : "Standard Member"}
                </Text>
              </View>

              <View style={styles.statBox}>
                <Text style={styles.statLabel}>SECURITY STATUS</Text>
                <Text style={[styles.statValue, { color: colors.accentCyan }]}>Compliant</Text>
              </View>
            </View>

            {/* Main Action Logout Button */}
            <TouchableOpacity
              onPress={logout}
              disabled={authActionLoading}
              style={styles.mainLogoutBtn}
              activeOpacity={0.85}
            >
              {authActionLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 8 }} />
              ) : (
                <Ionicons name="log-out-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
              )}
              <Text style={styles.mainLogoutText}>
                {authActionLoading ? "Signing out..." : "Log Out from HB+ Workspace"}
              </Text>
            </TouchableOpacity>
          </GlassCard>

          {/* Role-Specific Dashboard Features */}
          {isAdmin ? (
            <GlassCard style={styles.featuresCard}>
              <View style={styles.featuresHeader}>
                <Ionicons name="shield" size={20} color={colors.roleAdminText} style={{ marginRight: 8 }} />
                <Text style={styles.featuresTitle}>Administrator Control Center</Text>
              </View>
              <Text style={styles.featuresDescription}>
                You have elevated administrative access. Manage access policies, view audit trails, and oversee enterprise domain enforcement.
              </Text>

              <View style={styles.adminActionList}>
                <View style={styles.adminActionItem}>
                  <Ionicons name="people-outline" size={18} color={colors.roleAdminText} style={{ marginRight: 10 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.adminActionTitle}>Domain Access Policy</Text>
                    <Text style={styles.adminActionSub}>Restricting sign-ins to {ALLOWED_DOMAIN} accounts</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
                </View>

                <View style={styles.adminActionItem}>
                  <Ionicons name="finger-print-outline" size={18} color={colors.roleAdminText} style={{ marginRight: 10 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.adminActionTitle}>OAuth Audit Logs</Text>
                    <Text style={styles.adminActionSub}>Active Firebase Authentication telemetry</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
                </View>
              </View>
            </GlassCard>
          ) : (
            <GlassCard style={styles.featuresCard}>
              <View style={styles.featuresHeader}>
                <Ionicons name="fitness-outline" size={20} color={colors.accentEmerald} style={{ marginRight: 8 }} />
                <Text style={styles.featuresTitle}>HB+ Member Workspace</Text>
              </View>
              <Text style={styles.featuresDescription}>
                Welcome to your corporate health & fitness dashboard. Access employee benefits, training plans, and wellness metrics.
              </Text>

              <View style={styles.memberFeatureGrid}>
                <View style={styles.memberFeatureBox}>
                  <Ionicons name="heart-circle-outline" size={24} color={colors.accentEmerald} />
                  <Text style={styles.memberFeatureTitle}>Wellness Program</Text>
                  <Text style={styles.memberFeatureSub}>Enrolled & Active</Text>
                </View>

                <View style={styles.memberFeatureBox}>
                  <Ionicons name="briefcase-outline" size={24} color={colors.accentCyan} />
                  <Text style={styles.memberFeatureTitle}>Corporate Benefits</Text>
                  <Text style={styles.memberFeatureSub}>Verified Access</Text>
                </View>
              </View>
            </GlassCard>
          )}

          {/* Security Verification Footer */}
          <View style={styles.securityFooter}>
            <Ionicons name="lock-closed" size={14} color={colors.textMuted} style={{ marginRight: 6 }} />
            <Text style={styles.securityFooterText}>
              Protected Route • Client & Server State Synchronized • Session Active
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: "center",
  },
  container: {
    width: "100%",
    maxWidth: 760,
    zIndex: 1,
  },
  ambientGlowTop: {
    position: "absolute",
    top: -50,
    left: "10%",
    width: 360,
    height: 360,
    borderRadius: 180,
    backgroundColor: "rgba(99, 102, 241, 0.12)",
    ...Platform.select({
      web: {
        filter: "blur(90px)",
      },
    }),
  },
  ambientGlowRight: {
    position: "absolute",
    bottom: "20%",
    right: -40,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    ...Platform.select({
      web: {
        filter: "blur(80px)",
      },
    }),
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 28,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  brandBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 12,
  },
  brandText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 1,
  },
  brandName: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  liveIndicatorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.accentEmerald,
    marginRight: 6,
  },
  liveText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  headerLogoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    borderColor: "rgba(239, 68, 68, 0.35)",
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    ...Platform.select({
      web: {
        cursor: "pointer",
      },
    }),
  },
  headerLogoutText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  welcomeBanner: {
    marginBottom: 20,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  welcomeTitle: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.5,
    marginTop: 4,
  },
  profileCard: {
    width: "100%",
    marginBottom: 20,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 24,
  },
  avatarContainer: {
    position: "relative",
  },
  avatarImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: colors.borderAccent,
  },
  avatarFallback: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.borderAccent,
  },
  avatarAdmin: {
    backgroundColor: "#7C3AED",
  },
  avatarInitials: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
  },
  avatarBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.accentEmerald,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.background,
  },
  profileInfo: {
    flex: 1,
    minWidth: 220,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 6,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  emailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  domainVerifiedRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  domainVerifiedText: {
    fontSize: 12,
    color: colors.accentEmerald,
    fontWeight: "600",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    minWidth: 140,
    backgroundColor: "rgba(15, 23, 42, 0.7)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: 14,
  },
  statLabel: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: "700",
  },
  mainLogoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DC2626",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    shadowColor: "#DC2626",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
    ...Platform.select({
      web: {
        cursor: "pointer",
        transition: "all 0.2s ease",
      },
    }),
  },
  mainLogoutText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  featuresCard: {
    width: "100%",
    marginBottom: 20,
  },
  featuresHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  featuresDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
    marginBottom: 16,
  },
  adminActionList: {
    gap: 10,
  },
  adminActionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: 14,
  },
  adminActionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  adminActionSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  memberFeatureGrid: {
    flexDirection: "row",
    gap: 12,
  },
  memberFeatureBox: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: 16,
    alignItems: "center",
  },
  memberFeatureTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
    marginTop: 8,
  },
  memberFeatureSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  securityFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
  },
  securityFooterText: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: "500",
    textAlign: "center",
  },
});

export default DashboardScreen;
