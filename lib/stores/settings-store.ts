import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from '../storage';

export type FontSize = 'small' | 'medium' | 'large';

interface SettingsStore {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      fontSize: 'medium',
      setFontSize: (fontSize) => set({ fontSize }),
    }),
    {
      name: 'settings-store',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);

// Font size values in pixels
export const FONT_SIZES = {
  small: { text: 15, verse: 12, lineHeight: 22 },
  medium: { text: 17, verse: 14, lineHeight: 26 },
  large: { text: 20, verse: 16, lineHeight: 30 },
} as const;
