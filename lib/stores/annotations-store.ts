import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from '../storage';

// Highlight colors available to user
export const HIGHLIGHT_COLORS = [
  { id: 'yellow', name: 'Yellow', value: '#FACC15' },
  { id: 'green', name: 'Green', value: '#4ADE80' },
  { id: 'blue', name: 'Blue', value: '#60A5FA' },
  { id: 'pink', name: 'Pink', value: '#F472B6' },
  { id: 'orange', name: 'Orange', value: '#FB923C' },
] as const;

interface Highlight {
  verseId: string;
  color: string;
  createdAt: number;
}

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
  highlights: Record<string, Highlight>;
  bookmarks: Record<string, Bookmark>;
  notes: Record<string, Note>;

  // Highlight actions
  addHighlight: (verseId: string, color: string) => void;
  removeHighlight: (verseId: string) => void;

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
      highlights: {},
      bookmarks: {},
      notes: {},

      addHighlight: (verseId, color) => set((state) => ({
        highlights: {
          ...state.highlights,
          [verseId]: { verseId, color, createdAt: Date.now() },
        },
      })),
      removeHighlight: (verseId) => set((state) => {
        const { [verseId]: _, ...rest } = state.highlights;
        return { highlights: rest };
      }),

      addBookmark: (verseId) => set((state) => ({
        bookmarks: {
          ...state.bookmarks,
          [verseId]: { verseId, createdAt: Date.now() },
        },
      })),
      removeBookmark: (verseId) => set((state) => {
        const { [verseId]: _, ...rest } = state.bookmarks;
        return { bookmarks: rest };
      }),

      setNote: (verseId, content) => set((state) => {
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
      removeNote: (verseId) => set((state) => {
        const { [verseId]: _, ...rest } = state.notes;
        return { notes: rest };
      }),
    }),
    {
      name: 'annotations-store',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
