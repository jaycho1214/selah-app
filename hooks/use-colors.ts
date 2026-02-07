import { useMemo } from "react";
import { useColorScheme } from "react-native";
import { ThemeColors } from "@/constants/theme";

/**
 * Hook to get the current theme colors.
 * Returns the warm parchment color palette based on system theme.
 */
export function useColors() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return useMemo(
    () => (isDark ? ThemeColors.dark : ThemeColors.light),
    [isDark],
  );
}

/**
 * Type for the color palette returned by useColors
 */
export type ColorPalette = typeof ThemeColors.light;
