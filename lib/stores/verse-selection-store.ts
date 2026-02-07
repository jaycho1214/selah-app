import { create } from "zustand";
import type { BibleBook } from "@/lib/bible/types";

export interface SelectedVerse {
  id: string;
  text: string;
  book: BibleBook;
  chapter: number;
  verseNumber: number;
}

interface VerseSelectionStore {
  /** Set of selected verse IDs (Relay node IDs) */
  selectedIds: Set<string>;
  /** Full verse data keyed by ID */
  selectedVerses: Map<string, SelectedVerse>;
  /** Whether selection mode is active */
  isSelecting: boolean;

  /** Toggle a verse in/out of selection */
  toggleVerse: (verse: SelectedVerse) => void;
  /** Clear all selections */
  clearSelection: () => void;
  /** Get selected verses sorted by verse number */
  getSortedVerses: () => SelectedVerse[];
}

export const useVerseSelectionStore = create<VerseSelectionStore>()(
  (set, get) => ({
    selectedIds: new Set(),
    selectedVerses: new Map(),
    isSelecting: false,

    toggleVerse: (verse) =>
      set((state) => {
        const nextMap = new Map(state.selectedVerses);
        const nextIds = new Set(state.selectedIds);

        if (nextMap.has(verse.id)) {
          nextMap.delete(verse.id);
          nextIds.delete(verse.id);
        } else {
          nextMap.set(verse.id, verse);
          nextIds.add(verse.id);
        }

        return {
          selectedVerses: nextMap,
          selectedIds: nextIds,
          isSelecting: nextMap.size > 0,
        };
      }),

    clearSelection: () =>
      set({
        selectedVerses: new Map(),
        selectedIds: new Set(),
        isSelecting: false,
      }),

    getSortedVerses: () => {
      const verses = Array.from(get().selectedVerses.values());
      return verses.sort((a, b) => a.verseNumber - b.verseNumber);
    },
  }),
);
