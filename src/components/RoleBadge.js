import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";

export const RoleBadge = ({ role = "User", size = "medium" }) => {
  const isAdmin = role?.toLowerCase() === "admin";

  const isSmall = size === "small";

  return (
    <View
      style={[
        styles.badge,
        isAdmin ? styles.adminBadge : styles.userBadge,
        isSmall && styles.badgeSmall,
      ]}
    >
      <Ionicons
        name={isAdmin ? "shield-checkmark" : "person-circle-outline"}
        size={isSmall ? 13 : 16}
        color={isAdmin ? colors.roleAdminText : colors.roleUserText}
        style={styles.icon}
      />
      <Text
        style={[
          styles.text,
          isAdmin ? styles.adminText : styles.userText,
          isSmall && styles.textSmall,
        ]}
      >
        {isAdmin ? "Admin" : "User"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  badgeSmall: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  adminBadge: {
    backgroundColor: colors.roleAdminBg,
    borderColor: colors.roleAdminBorder,
  },
  userBadge: {
    backgroundColor: colors.roleUserBg,
    borderColor: colors.roleUserBorder,
  },
  icon: {
    marginRight: 6,
  },
  text: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  textSmall: {
    fontSize: 11,
  },
  adminText: {
    color: colors.roleAdminText,
  },
  userText: {
    color: colors.roleUserText,
  },
});

export default RoleBadge;
