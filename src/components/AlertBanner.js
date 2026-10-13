import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";

export const AlertBanner = ({
  message,
  type = "error",
  onDismiss,
  title,
}) => {
  if (!message) return null;

  const isError = type === "error";
  const defaultTitle = isError ? "Access Restricted" : "Notice";

  return (
    <View
      style={[
        styles.container,
        isError ? styles.containerError : styles.containerInfo,
      ]}
      accessibilityRole="alert"
    >
      <View style={styles.iconColumn}>
        <Ionicons
          name={isError ? "alert-circle" : "information-circle"}
          size={22}
          color={isError ? colors.error : colors.info}
        />
      </View>

      <View style={styles.textColumn}>
        <Text
          style={[
            styles.title,
            isError ? styles.titleError : styles.titleInfo,
          ]}
        >
          {title || defaultTitle}
        </Text>
        <Text style={styles.message}>{message}</Text>
      </View>

      {onDismiss && (
        <TouchableOpacity
          onPress={onDismiss}
          style={styles.dismissButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Dismiss alert"
        >
          <Ionicons name="close" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 14,
    marginVertical: 12,
    borderWidth: 1,
    width: "100%",
    alignItems: "flex-start",
  },
  containerError: {
    backgroundColor: colors.errorLight,
    borderColor: colors.errorBorder,
  },
  containerInfo: {
    backgroundColor: colors.infoLight,
    borderColor: colors.borderAccent,
  },
  iconColumn: {
    marginRight: 10,
    marginTop: 1,
  },
  textColumn: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 2,
    letterSpacing: 0.2,
  },
  titleError: {
    color: "#F87171",
  },
  titleInfo: {
    color: "#38BDF8",
  },
  message: {
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 18,
  },
  dismissButton: {
    marginLeft: 8,
    padding: 4,
    ...Platform.select({
      web: {
        cursor: "pointer",
      },
    }),
  },
});

export default AlertBanner;
