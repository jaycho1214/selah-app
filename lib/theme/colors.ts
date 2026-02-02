/**
 * Selah color palette - centralized color definitions
 * for both light and dark modes.
 */

export const colors = {
  light: {
    // Backgrounds
    background: '#fdfcfb',
    surface: '#f5f4f3',
    surfaceElevated: '#ffffff',

    // Borders
    border: '#e7e5e4',
    borderSubtle: '#f0efee',

    // Text
    text: '#1c1917',
    textMuted: '#57534e',
    textSubtle: '#a8a29e',

    // Accent (warm brown/tan)
    accent: '#8b7355',
    accentMuted: '#d6bcab',
    accentSubtle: '#f5f0eb',

    // Semantic
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',

    // Overlays
    overlay: 'rgba(255,255,255,0.85)',
    overlayDark: 'rgba(0,0,0,0.5)',

    // Special
    bezel: '#000000',
  },

  dark: {
    // Backgrounds
    background: '#0c0a09',
    surface: '#1c1917',
    surfaceElevated: '#292524',

    // Borders
    border: '#292524',
    borderSubtle: '#1c1917',

    // Text
    text: '#fafaf9',
    textMuted: '#a8a29e',
    textSubtle: '#78716c',

    // Accent (warm tan)
    accent: '#d6bcab',
    accentMuted: '#a8977d',
    accentSubtle: '#292524',

    // Semantic
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',

    // Overlays
    overlay: 'rgba(0,0,0,0.7)',
    overlayDark: 'rgba(0,0,0,0.8)',

    // Special
    bezel: '#000000',
  },
} as const;

export type ColorScheme = 'light' | 'dark';
export type ThemeColors = (typeof colors)['light'] | (typeof colors)['dark'];

/**
 * Get colors for the current color scheme
 */
export function getColors(scheme: ColorScheme | null | undefined) {
  return scheme === 'dark' ? colors.dark : colors.light;
}
