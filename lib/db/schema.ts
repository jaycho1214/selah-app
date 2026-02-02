import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

/**
 * Downloaded Bible translation metadata.
 * Tracks which translations are available offline.
 */
export const translations = sqliteTable('translations', {
  /** Translation code: 'KJV', 'ASV', 'WEB' */
  id: text('id').primaryKey(),
  /** Full name: 'King James Version' */
  name: text('name').notNull(),
  /** Version string for upgrade detection: '2024.1' */
  version: text('version'),
  /** When the translation was downloaded */
  downloadedAt: integer('downloaded_at', { mode: 'timestamp' }),
});

/**
 * Bible verse data stored locally for offline reading.
 * ID format: "KJV:GENESIS:1:1"
 */
export const verses = sqliteTable('verses', {
  /** Composite ID: "{translationId}:{book}:{chapter}:{verse}" */
  id: text('id').primaryKey(),
  /** Reference to translations.id */
  translationId: text('translation_id').notNull(),
  /** Book enum value: 'GENESIS', 'EXODUS', etc. */
  book: text('book').notNull(),
  /** Chapter number (1-indexed) */
  chapter: integer('chapter').notNull(),
  /** Verse number (1-indexed) */
  verse: integer('verse').notNull(),
  /** The verse text content */
  text: text('text').notNull(),
});

/**
 * User highlights on verses.
 * Local-first: stored immediately, synced when authenticated.
 */
export const highlights = sqliteTable('highlights', {
  /** UUID generated client-side */
  id: text('id').primaryKey(),
  /** Reference to verses.id */
  verseId: text('verse_id').notNull(),
  /** Highlight color: 'yellow', 'green', 'blue', 'pink', 'purple' */
  color: text('color').notNull(),
  /** When the highlight was created locally */
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  /** When synced to server (null = not synced) */
  syncedAt: integer('synced_at', { mode: 'timestamp' }),
});

/**
 * User bookmarks for quick access to verses.
 * Local-first: stored immediately, synced when authenticated.
 */
export const bookmarks = sqliteTable('bookmarks', {
  /** UUID generated client-side */
  id: text('id').primaryKey(),
  /** Reference to verses.id */
  verseId: text('verse_id').notNull(),
  /** When the bookmark was created locally */
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  /** When synced to server (null = not synced) */
  syncedAt: integer('synced_at', { mode: 'timestamp' }),
});

/**
 * User notes attached to verses.
 * Local-first: stored immediately, synced when authenticated.
 */
export const notes = sqliteTable('notes', {
  /** UUID generated client-side */
  id: text('id').primaryKey(),
  /** Reference to verses.id */
  verseId: text('verse_id').notNull(),
  /** The note text content */
  content: text('content').notNull(),
  /** When the note was created locally */
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  /** When the note was last updated locally */
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  /** When synced to server (null = not synced) */
  syncedAt: integer('synced_at', { mode: 'timestamp' }),
});

// Export types for use in queries
export type Translation = typeof translations.$inferSelect;
export type NewTranslation = typeof translations.$inferInsert;
export type Verse = typeof verses.$inferSelect;
export type NewVerse = typeof verses.$inferInsert;
export type Highlight = typeof highlights.$inferSelect;
export type NewHighlight = typeof highlights.$inferInsert;
export type Bookmark = typeof bookmarks.$inferSelect;
export type NewBookmark = typeof bookmarks.$inferInsert;
export type Note = typeof notes.$inferSelect;
export type NewNote = typeof notes.$inferInsert;
