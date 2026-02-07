import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { mmkvStorage } from "../storage";

interface Bookmark {
  verseId: string;
  createdAt: number;
}

interface Note {
  verseId: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

interface AnnotationsStore {
  bookmarks: Record<string, Bookmark>;
  notes: Record<string, Note>;

  // Bookmark actions
  addBookmark: (verseId: string) => void;
  removeBookmark: (verseId: string) => void;

  // Note actions
  setNote: (verseId: string, content: string) => void;
  removeNote: (verseId: string) => void;
}

export const useAnnotationsStore = create<AnnotationsStore>()(
  persist(
    (set) => ({
      bookmarks: {},
      notes: {},

      addBookmark: (verseId) =>
        set((state) => ({
          bookmarks: {
            ...state.bookmarks,
            [verseId]: { verseId, createdAt: Date.now() },
          },
        })),
      removeBookmark: (verseId) =>
        set((state) => {
          const { [verseId]: _, ...rest } = state.bookmarks;
          return { bookmarks: rest };
        }),

      setNote: (verseId, content) =>
        set((state) => {
          const existing = state.notes[verseId];
          return {
            notes: {
              ...state.notes,
              [verseId]: {
                verseId,
                content,
                createdAt: existing?.createdAt ?? Date.now(),
                updatedAt: Date.now(),
              },
            },
          };
        }),
      removeNote: (verseId) =>
        set((state) => {
          const { [verseId]: _, ...rest } = state.notes;
          return { notes: rest };
        }),
    }),
    {
      name: "annotations-store",
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
