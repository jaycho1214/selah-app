import '../global.css';

import { LogBox } from 'react-native';

// Suppress deprecation warning from dependencies (tentap-editor, expo-router)
LogBox.ignoreLogs(['SafeAreaView has been deprecated']);

import {
  ThemeProvider as NavigationThemeProvider,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useMemo } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

import { ThemeProvider, useTheme } from '@/components/providers/theme-provider';
import { RelayProvider } from '@/components/providers/relay-provider';
import { SessionProvider } from '@/components/providers/session-provider';
import { NAV_THEME } from '@/constants/theme';
import { configureGoogleSignIn } from '@/lib/google-signin';

export const unstable_settings = {
  anchor: '(tabs)',
};

// Configure Google Sign-In once on app load
configureGoogleSignIn();

function RootLayoutNav() {
  const { resolvedTheme } = useTheme();

  // Merge our custom colors with the default theme (which includes fonts)
  const theme = useMemo(() => {
    const baseTheme = resolvedTheme === 'dark' ? DarkTheme : DefaultTheme;
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
          options={{ presentation: 'modal', title: 'Modal' }}
        />
      </Stack>
      <StatusBar style={resolvedTheme === 'dark' ? 'light' : 'dark'} />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <BottomSheetModalProvider>
          <RelayProvider>
            <SessionProvider>
              <ThemeProvider>
                <RootLayoutNav />
              </ThemeProvider>
            </SessionProvider>
          </RelayProvider>
        </BottomSheetModalProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
