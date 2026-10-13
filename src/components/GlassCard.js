import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { colors } from "../theme/colors";

export const GlassCard = ({ children, style, glow = false }) => {
  return (
    <View
      style={[
        styles.card,
        glow && styles.glow,
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: 24,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 8,
    ...Platform.select({
      web: {
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      },
    }),
  },
  glow: {
    borderColor: colors.borderAccent,
    shadowColor: colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: 25,
  },
});

export default GlassCard;
