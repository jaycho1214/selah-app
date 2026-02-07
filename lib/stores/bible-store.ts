import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { mmkvStorage } from "../storage";

interface BibleStore {
  // Current reading position
  currentBook: string;
  currentChapter: number;
  currentTranslation: string;

  // Scroll-to-verse (transient, used by search → home navigation)
  scrollToVerse: number | null;

  // Actions
  setPosition: (book: string, chapter: number) => void;
  setTranslation: (translation: string) => void;
  setScrollToVerse: (verse: number | null) => void;
}

export const useBibleStore = create<BibleStore>()(
  persist(
    (set) => ({
      currentBook: "GENESIS",
      currentChapter: 1,
      currentTranslation: "KJV",
      scrollToVerse: null,

      setPosition: (currentBook, currentChapter) =>
        set({ currentBook, currentChapter }),
      setTranslation: (currentTranslation) => set({ currentTranslation }),
      setScrollToVerse: (scrollToVerse) => set({ scrollToVerse }),
    }),
    {
      name: "bible-store",
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({
        currentBook: state.currentBook,
        currentChapter: state.currentChapter,
        currentTranslation: state.currentTranslation,
      }),
    },
  ),
);
