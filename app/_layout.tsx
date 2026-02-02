import '../global.css';

import {
  ThemeProvider as NavigationThemeProvider,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useMemo } from 'react';

import { ThemeProvider, useTheme } from '@/components/providers/theme-provider';
import { RelayProvider } from '@/components/providers/relay-provider';
import { NAV_THEME } from '@/constants/theme';

export const unstable_settings = {
  anchor: '(tabs)',
};

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
    <RelayProvider>
      <ThemeProvider>
        <RootLayoutNav />
      </ThemeProvider>
    </RelayProvider>
  );
}
