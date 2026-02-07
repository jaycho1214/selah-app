/**
 * Warm Parchment Theme - Monastic Minimalism
 *
 * A contemplative color palette inspired by aged parchment and monastery libraries.
 * Matches the CSS variables in global.css.
 */

import { Platform } from "react-native";

/**
 * Colors for use in components that don't support CSS variables.
 * Warm parchment palette with brown/sepia accent.
 */
export const Colors = {
  light: {
    text: "#1c1917", // --foreground (stone-900)
    background: "#faf9f7", // --background (warm off-white)
    tint: "#8b7355", // --primary (warm brown)
    icon: "#a8a29e", // --muted-foreground (stone-400)
    tabIconDefault: "#a8a29e", // --muted-foreground
    tabIconSelected: "#8b7355", // --primary
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
    bg: "#faf9f7",
    surface: "#ffffff",
    surfaceElevated: "#f5f4f2",
    border: "#e7e5e4",
    text: "#1c1917",
    textSecondary: "#44403c",
    textMuted: "#a8a29e",
    accent: "#8b7355",
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
 * Warm parchment colors for navigation chrome
 */
export const NAV_THEME = {
  light: {
    dark: false,
    colors: {
      background: "#faf9f7", // --background
      border: "#e7e5e4", // --border
      card: "#ffffff", // --card
      notification: "#dc2626", // --destructive
      primary: "#8b7355", // --primary
      text: "#1c1917", // --foreground
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
