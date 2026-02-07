import type { BibleBook } from "./types";

/**
 * Parse verse ID into components.
 * Format: "{translationId}:{book}:{chapter}:{verse}"
 */
export function parseVerseId(verseId: string) {
  const parts = verseId.split(":");
  if (parts.length !== 4) return null;
  return {
    translation: parts[0],
    book: parts[1] as BibleBook,
    chapter: parseInt(parts[2], 10),
    verse: parseInt(parts[3], 10),
  };
}

/**
 * Create a verse ID from components.
 */
export function createVerseId(
  translation: string,
  book: BibleBook,
  chapter: number,
  verse: number,
): string {
  return `${translation}:${book}:${chapter}:${verse}`;
}

/**
 * Format verse reference for display.
 * e.g., "Genesis 1:1"
 */
export function formatVerseReference(
  bookName: string,
  chapter: number,
  verse: number,
): string {
  return `${bookName} ${chapter}:${verse}`;
}
