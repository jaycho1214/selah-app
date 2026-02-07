import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { mmkvStorage } from "../storage";

export const VERSE_HIGHLIGHT_COLORS = [
  { id: "yellow", value: "#fef08a" },
  { id: "green", value: "#bbf7d0" },
  { id: "blue", value: "#bfdbfe" },
  { id: "purple", value: "#ddd6fe" },
  { id: "pink", value: "#fbcfe8" },
  { id: "orange", value: "#fed7aa" },
] as const;

interface VerseHighlightStore {
  enabled: boolean;
  color: string;
  setEnabled: (enabled: boolean) => void;
  setColor: (color: string) => void;
  hydrate: (enabled: boolean, color: string) => void;
}

export const useVerseHighlightStore = create<VerseHighlightStore>()(
  persist(
    (set) => ({
      enabled: true,
      color: "#fef08a",

      setEnabled: (enabled) => set({ enabled }),
      setColor: (color) => set({ color }),
      hydrate: (enabled, color) => set({ enabled, color }),
    }),
    {
      name: "verse-highlight-store",
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
