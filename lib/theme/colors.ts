/**
 * OKLCH to RGB color mappings from selah-web
 *
 * These colors are converted from OKLCH to RGB for React Native compatibility.
 * Source: selah-web/src/app/globals.css
 *
 * Format: RGB values as space-separated numbers (e.g., "255 255 255")
 * Usage in CSS: rgb(var(--color-name) / <alpha>)
 */

export const COLORS = {
  light: {
    // oklch(1 0 0) -> #ffffff
    background: '255 255 255',
    // oklch(0.13 0.028 261.692) -> ~#121218
    foreground: '18 18 24',
    // oklch(1 0 0) -> #ffffff
    card: '255 255 255',
    cardForeground: '18 18 24',
    // oklch(1 0 0) -> #ffffff
    popover: '255 255 255',
    popoverForeground: '18 18 24',
    // oklch(0.21 0.034 264.665) -> ~#212430
    primary: '33 36 48',
    // oklch(0.985 0.002 247.839) -> ~#fafafc
    primaryForeground: '250 250 252',
    // oklch(0.967 0.003 264.542) -> ~#f3f4f6
    secondary: '243 244 246',
    secondaryForeground: '33 36 48',
    // oklch(0.967 0.003 264.542) -> ~#f3f4f6
    muted: '243 244 246',
    // oklch(0.551 0.027 264.364) -> ~#717a8a
    mutedForeground: '113 122 138',
    // oklch(0.967 0.003 264.542) -> ~#f3f4f6
    accent: '243 244 246',
    accentForeground: '33 36 48',
    // oklch(0.577 0.245 27.325) -> ~#dc2626
    destructive: '220 38 38',
    destructiveForeground: '250 250 252',
    // oklch(0.928 0.006 264.531) -> ~#e4e8ee
    border: '228 232 238',
    input: '228 232 238',
    // oklch(0.707 0.022 261.325) -> ~#a0aab8
    ring: '160 170 184',
  },
  dark: {
    // oklch(0.13 0.028 261.692) -> ~#121218
    background: '18 18 24',
    // oklch(0.985 0.002 247.839) -> ~#fafafc
    foreground: '250 250 252',
    // oklch(0.21 0.034 264.665) -> ~#212430
    card: '33 36 48',
    cardForeground: '250 250 252',
    // oklch(0.21 0.034 264.665) -> ~#212430
    popover: '33 36 48',
    popoverForeground: '250 250 252',
    // oklch(0.928 0.006 264.531) -> ~#e4e8ee
    primary: '228 232 238',
    // oklch(0.21 0.034 264.665) -> ~#212430
    primaryForeground: '33 36 48',
    // oklch(0.278 0.033 256.848) -> ~#2e3442
    secondary: '46 52 66',
    secondaryForeground: '250 250 252',
    // oklch(0.278 0.033 256.848) -> ~#2e3442
    muted: '46 52 66',
    // oklch(0.707 0.022 261.325) -> ~#a0aab8
    mutedForeground: '160 170 184',
    // oklch(0.278 0.033 256.848) -> ~#2e3442
    accent: '46 52 66',
    accentForeground: '250 250 252',
    // oklch(0.704 0.191 22.216) -> ~#f87171
    destructive: '248 113 113',
    destructiveForeground: '18 18 24',
    // oklch(1 0 0 / 10%) -> rgba(255,255,255,0.1)
    border: '255 255 255',
    input: '255 255 255',
    // oklch(0.707 0.022 261.325) -> ~#a0aab8
    ring: '160 170 184',
  },
} as const;

export type ColorScheme = 'light' | 'dark';
export type ColorToken = keyof typeof COLORS.light;
