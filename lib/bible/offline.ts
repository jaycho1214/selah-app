/**
 * Offline Bible reading utilities.
 *
 * Stub implementations - full functionality will be added in plan 03-09.
 * These stubs allow ChapterView to compile while offline support is pending.
 */

import type { BibleBook } from './types';

/**
 * Check if a Bible translation has been downloaded for offline use.
 *
 * TODO: Plan 03-09 will implement actual SQLite check.
 */
export async function isTranslationDownloaded(
  _translationId: string
): Promise<boolean> {
  // Stub: always return false until offline download is implemented
  return false;
}

/**
 * Get verses from local SQLite database for offline reading.
 *
 * TODO: Plan 03-09 will implement actual SQLite query.
 */
export async function getOfflineVerses(
  _translationId: string,
  _book: BibleBook,
  _chapter: number
): Promise<Array<{ id: string; verse: number; text: string }>> {
  // Stub: return empty array until offline storage is implemented
  return [];
}
