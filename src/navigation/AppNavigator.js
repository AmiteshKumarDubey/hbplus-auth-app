import React from "react";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import { LoginScreen } from "../screens/LoginScreen";
import { DashboardScreen } from "../screens/DashboardScreen";
import { colors } from "../theme/colors";

const Stack = createNativeStackNavigator();

const linking = {
  prefixes: ["/"],
  config: {
    screens: {
      Login: "login",
      Dashboard: "dashboard",
    },
  },
};

const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <View style={styles.logoBadge}>
      <Text style={styles.logoText}>HB+</Text>
    </View>
    <ActivityIndicator size="large" color={colors.primary} style={styles.spinner} />
    <Text style={styles.loadingText}>Initializing secure environment...</Text>
  </View>
);

export const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: "fade",
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        {user ? (
          // Protected Routes (Only rendered when user is authenticated)
          <Stack.Screen
            name="Dashboard"
            component={DashboardScreen}
            options={{ title: "HB+ Dashboard" }}
          />
        ) : (
          // Public Authentication Routes
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ title: "Sign In - HB+" }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logoBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 18,
    marginBottom: 24,
  },
  logoText: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: 2,
  },
  spinner: {
    marginBottom: 16,
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "500",
  },
});

export default AppNavigator;
