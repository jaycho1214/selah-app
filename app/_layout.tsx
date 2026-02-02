import '../global.css';

import { LogBox } from 'react-native';

// Suppress deprecation warning from dependencies (tentap-editor, expo-router)
LogBox.ignoreLogs(['SafeAreaView has been deprecated']);

import {
  ThemeProvider as NavigationThemeProvider,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect, useMemo } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ActivityIndicator, View } from 'react-native';

import { ThemeProvider, useTheme } from '@/components/providers/theme-provider';
import { RelayProvider } from '@/components/providers/relay-provider';
import { SessionProvider, useSession } from '@/components/providers/session-provider';
import { NAV_THEME } from '@/constants/theme';
import { configureGoogleSignIn } from '@/lib/google-signin';

export const unstable_settings = {
  anchor: '(tabs)',
};

// Configure Google Sign-In once on app load
configureGoogleSignIn();

function useProtectedRoute() {
  const { session, isLoading } = useSession();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === 'sign-in';

    if (!session && !inAuthGroup) {
      // Not signed in, redirect to sign-in
      router.replace('/sign-in');
    } else if (session && inAuthGroup) {
      // Signed in, redirect to main app
      router.replace('/(tabs)');
    }
  }, [session, isLoading, segments]);

  return { isLoading };
}

function RootLayoutNav() {
  const { resolvedTheme } = useTheme();
  const { isLoading } = useProtectedRoute();

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

  // Show loading indicator while checking auth state
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationThemeProvider value={theme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
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
    <SafeAreaProvider>
      <RelayProvider>
        <SessionProvider>
          <ThemeProvider>
            <RootLayoutNav />
          </ThemeProvider>
        </SessionProvider>
      </RelayProvider>
    </SafeAreaProvider>
  );
}
