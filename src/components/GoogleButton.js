import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  View,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const GoogleButton = ({
  onPress,
  loading = false,
  disabled = false,
  title = "Sign in with Google",
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        (disabled || loading) && styles.buttonDisabled,
      ]}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="small" color="#0F172A" style={styles.spinner} />
        ) : (
          <View style={styles.iconContainer}>
            {/* Google Multi-colored Brand Icon Representation */}
            <Ionicons name="logo-google" size={20} color="#EA4335" />
          </View>
        )}
        <Text style={styles.text}>
          {loading ? "Authenticating..." : title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.9)",
    width: "100%",
    ...Platform.select({
      web: {
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
      },
    }),
  },
  buttonDisabled: {
    opacity: 0.65,
    ...Platform.select({
      web: {
        cursor: "not-allowed",
      },
    }),
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    marginRight: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  spinner: {
    marginRight: 12,
  },
  text: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
});

export default GoogleButton;
