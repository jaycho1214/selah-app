import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from '../storage';

interface BibleStore {
  // Current reading position
  currentBook: string;
  currentChapter: number;
  currentTranslation: string;

  // Actions
  setPosition: (book: string, chapter: number) => void;
  setTranslation: (translation: string) => void;
}

export const useBibleStore = create<BibleStore>()(
  persist(
    (set) => ({
      currentBook: 'GENESIS',
      currentChapter: 1,
      currentTranslation: 'KJV',

      setPosition: (currentBook, currentChapter) =>
        set({ currentBook, currentChapter }),
      setTranslation: (currentTranslation) =>
        set({ currentTranslation }),
    }),
    {
      name: 'bible-store',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
