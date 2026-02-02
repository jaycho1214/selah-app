/**
 * Navigation theme configuration for React Navigation
 *
 * These colors are derived from the CSS variables in global.css and match
 * the OKLCH-to-RGB mappings in lib/theme/colors.ts for consistency with selah-web.
 */

import { Platform } from 'react-native';

/**
 * Colors for use in components that don't support CSS variables.
 * These are derived from the same OKLCH colors as global.css.
 */
export const Colors = {
  light: {
    text: 'rgb(18, 18, 24)', // --foreground
    background: 'rgb(255, 255, 255)', // --background
    tint: 'rgb(33, 36, 48)', // --primary
    icon: 'rgb(113, 122, 138)', // --muted-foreground
    tabIconDefault: 'rgb(113, 122, 138)', // --muted-foreground
    tabIconSelected: 'rgb(33, 36, 48)', // --primary
  },
  dark: {
    text: 'rgb(250, 250, 252)', // --foreground
    background: 'rgb(18, 18, 24)', // --background
    tint: 'rgb(228, 232, 238)', // --primary
    icon: 'rgb(160, 170, 184)', // --muted-foreground
    tabIconDefault: 'rgb(160, 170, 184)', // --muted-foreground
    tabIconSelected: 'rgb(228, 232, 238)', // --primary
  },
};

/**
 * Navigation theme for React Navigation
 * Includes required fonts configuration
 */
export const NAV_THEME = {
  light: {
    dark: false,
    colors: {
      background: 'rgb(255, 255, 255)', // --background
      border: 'rgb(228, 232, 238)', // --border
      card: 'rgb(255, 255, 255)', // --card
      notification: 'rgb(220, 38, 38)', // --destructive
      primary: 'rgb(33, 36, 48)', // --primary
      text: 'rgb(18, 18, 24)', // --foreground
    },
  },
  dark: {
    dark: true,
    colors: {
      background: 'rgb(18, 18, 24)', // --background
      border: 'rgba(255, 255, 255, 0.1)', // --border
      card: 'rgb(33, 36, 48)', // --card
      notification: 'rgb(248, 113, 113)', // --destructive
      primary: 'rgb(228, 232, 238)', // --primary
      text: 'rgb(250, 250, 252)', // --foreground
    },
  },
};

/**
 * Platform-specific font families
 */
export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
