/**
 * Clean White & Black (light) / Warm Parchment (dark)
 *
 * Light mode: Twitter-inspired white & black palette.
 * Dark mode: Contemplative warm parchment colors.
 * Matches the CSS variables in global.css.
 */

import { Platform } from "react-native";

/**
 * Colors for use in components that don't support CSS variables.
 */
export const Colors = {
  light: {
    text: "#0f1419", // --foreground
    background: "#ffffff", // --background
    tint: "#0f1419", // --primary
    icon: "#536471", // --muted-foreground
    tabIconDefault: "#536471", // --muted-foreground
    tabIconSelected: "#0f1419", // --primary
  },
  dark: {
    text: "#fafaf9", // --foreground (stone-50)
    background: "#0c0a09", // --background (stone-950)
    tint: "#d6bcab", // --primary (warm tan)
    icon: "#78716c", // --muted-foreground (stone-500)
    tabIconDefault: "#78716c", // --muted-foreground
    tabIconSelected: "#d6bcab", // --primary
  },
};

/**
 * Extended color palette for use in screens and components.
 * Provides all the semantic colors needed for UI elements.
 */
export const ThemeColors = {
  light: {
    bg: "#ffffff",
    surface: "#ffffff",
    surfaceElevated: "#f7f9f9",
    border: "#eff3f4",
    text: "#0f1419",
    textSecondary: "#536471",
    textMuted: "#536471",
    accent: "#0f1419",
  },
  dark: {
    bg: "#0c0a09",
    surface: "#1c1917",
    surfaceElevated: "#292524",
    border: "#3d3530",
    text: "#fafaf9",
    textSecondary: "#d6d3d1",
    textMuted: "#78716c",
    accent: "#d6bcab",
  },
};

/**
 * Navigation theme for React Navigation
 */
export const NAV_THEME = {
  light: {
    dark: false,
    colors: {
      background: "#ffffff", // --background
      border: "#eff3f4", // --border
      card: "#ffffff", // --card
      notification: "#dc2626", // --destructive
      primary: "#0f1419", // --primary
      text: "#0f1419", // --foreground
    },
  },
  dark: {
    dark: true,
    colors: {
      background: "#0c0a09", // --background
      border: "#3d3530", // --border
      card: "#1c1917", // --card
      notification: "#f87171", // --destructive
      primary: "#d6bcab", // --primary
      text: "#fafaf9", // --foreground
    },
  },
};

/**
 * Platform-specific font families
 */
export const Fonts = Platform.select({
  ios: {
    /** iOS system default */
    sans: "system-ui",
    /** iOS serif - Georgia */
    serif: "Georgia",
    /** iOS rounded */
    rounded: "ui-rounded",
    /** iOS monospace */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
