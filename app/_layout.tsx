import "../global.css";

import * as Notifications from "expo-notifications";
import * as SplashScreen from "expo-splash-screen";
import { LogBox, View, Text, ActivityIndicator } from "react-native";

SplashScreen.preventAutoHideAsync();

// Native splash hides instantly; our AnimatedSplashScreen handles the transition
SplashScreen.setOptions({
  duration: 0,
  fade: false,
});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Suppress deprecation warning from dependencies (tentap-editor, expo-router)
LogBox.ignoreLogs(["SafeAreaView has been deprecated"]);

import {
  ThemeProvider as NavigationThemeProvider,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import { KeyboardProvider } from "react-native-keyboard-controller";

import { ThemeProvider, useTheme } from "@/components/providers/theme-provider";
import { RelayProvider } from "@/components/providers/relay-provider";
import { SessionProvider } from "@/components/providers/session-provider";
import { NAV_THEME } from "@/constants/theme";
import { useDatabaseMigrations } from "@/lib/db/client";
import { useHydrateUserSettings } from "@/hooks/use-hydrate-user-settings";
import { useNotificationSetup } from "@/hooks/use-notifications";
import { AnimatedSplashScreen } from "@/components/animated-splash-screen";

export const unstable_settings = {
  anchor: "(tabs)",
};

/**
 * Database migration gate - blocks rendering until migrations complete.
 * Shows loading state during migration and error if migration fails.
 */
function DatabaseGate({ children }: { children: React.ReactNode }) {
  const { success, error } = useDatabaseMigrations();

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-background p-4">
        <Text className="text-destructive text-center mb-2 font-semibold">
          Database Error
        </Text>
        <Text className="text-muted-foreground text-center text-sm">
          {error.message}
        </Text>
      </View>
    );
  }

  if (!success) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <>{children}</>;
}

function RootLayoutNav() {
  const { resolvedTheme } = useTheme();
  const [showSplash, setShowSplash] = useState(true);
  useHydrateUserSettings();
  useNotificationSetup();

  useEffect(() => {
    // Hide native splash immediately — our animated overlay takes over
    SplashScreen.hide();
  }, []);

  const onSplashFinish = useCallback(() => {
    setShowSplash(false);
  }, []);

  // Merge our custom colors with the default theme (which includes fonts)
  const theme = useMemo(() => {
    const baseTheme = resolvedTheme === "dark" ? DarkTheme : DefaultTheme;
    return {
      ...baseTheme,
      colors: {
        ...baseTheme.colors,
        ...NAV_THEME[resolvedTheme].colors,
      },
    };
  }, [resolvedTheme]);

  return (
    <NavigationThemeProvider value={theme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style={resolvedTheme === "dark" ? "light" : "dark"} />
      {showSplash && <AnimatedSplashScreen onFinish={onSplashFinish} />}
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <KeyboardProvider>
          <BottomSheetModalProvider>
            <DatabaseGate>
              <RelayProvider>
                <SessionProvider>
                  <ThemeProvider>
                    <RootLayoutNav />
                  </ThemeProvider>
                </SessionProvider>
              </RelayProvider>
            </DatabaseGate>
          </BottomSheetModalProvider>
        </KeyboardProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
