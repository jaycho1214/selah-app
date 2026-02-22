/**
 * Offline Bible reading with versioning support.
 *
 * Handles downloading translations for offline use, version tracking,
 * and update detection. Uses expo-file-system for downloads and
 * Drizzle ORM for SQLite storage.
 */

import { File, Paths } from "expo-file-system";
import { db } from "@/lib/db/client";
import { translations, verses } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import type { BibleBook } from "./types";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "https://selah.kr";

export interface DownloadProgress {
  status: "idle" | "downloading" | "processing" | "complete" | "error";
  progress: number; // 0-100
  error?: string;
}

export interface RemoteTranslation {
  id: string;
  name: string;
  version: string;
  size: number; // bytes
}

export interface TranslationUpdate {
  id: string;
  name: string;
  currentVersion: string;
  newVersion: string;
}

/**
 * Fetch available translations from server with version info.
 * GET /api/bible/translations -> { translations: RemoteTranslation[] }
 */
export async function getRemoteTranslations(): Promise<RemoteTranslation[]> {
  const response = await fetch(`${API_URL}/api/bible/translations`);
  if (!response.ok) {
    throw new Error(`Failed to fetch translations: ${response.status}`);
  }
  const data = await response.json();
  return data.translations;
}

/**
 * Check if a translation is downloaded for offline use.
 */
export async function isTranslationDownloaded(
  translationId: string,
): Promise<boolean> {
  const result = await db
    .select()
    .from(translations)
    .where(eq(translations.id, translationId))
    .limit(1);
  return result.length > 0 && result[0].downloadedAt !== null;
}

/**
 * Get list of downloaded translations with their versions.
 */
export async function getDownloadedTranslations() {
  return db.select().from(translations);
}

/**
 * Check for updates to downloaded translations.
 * Compares local version against server version.
 */
export async function checkForUpdates(): Promise<TranslationUpdate[]> {
  const remote = await getRemoteTranslations();
  const local = await getDownloadedTranslations();

  const updates: TranslationUpdate[] = [];

  for (const remoteTranslation of remote) {
    const localTranslation = local.find((t) => t.id === remoteTranslation.id);

    // Only check downloaded translations
    if (
      localTranslation &&
      localTranslation.version !== remoteTranslation.version
    ) {
      updates.push({
        id: remoteTranslation.id,
        name: remoteTranslation.name,
        currentVersion: localTranslation.version ?? "unknown",
        newVersion: remoteTranslation.version,
      });
    }
  }

  return updates;
}

/**
 * Download a translation for offline use.
 * Server endpoint: GET /api/bible/{id}.json
 * Expected response: { id, name, version, verses: Array<{ book, chapter, verse, text }> }
 */
export async function downloadTranslation(
  translationId: string,
  onProgress?: (progress: DownloadProgress) => void,
): Promise<void> {
  try {
    onProgress?.({ status: "downloading", progress: 0 });

    const url = `${API_URL}/api/bible/${translationId}.json`;

    // Download to cache directory using new expo-file-system API
    const downloadedFile = await File.downloadFileAsync(url, Paths.cache, {
      idempotent: true,
    });

    onProgress?.({ status: "processing", progress: 50 });

    // Read and parse the file
    const content = await downloadedFile.text();
    const data = JSON.parse(content) as {
      id: string;
      name: string;
      version: string; // e.g., "2024.1"
      verses: Array<{
        book: BibleBook;
        chapter: number;
        verse: number;
        text: string;
      }>;
    };

    // Insert into SQLite in batches
    const batchSize = 500;
    const totalVerses = data.verses.length;

    for (let i = 0; i < totalVerses; i += batchSize) {
      const batch = data.verses.slice(i, i + batchSize);

      await db.transaction(async (tx) => {
        for (const v of batch) {
          await tx
            .insert(verses)
            .values({
              id: `${translationId}:${v.book}:${v.chapter}:${v.verse}`,
              translationId,
              book: v.book,
              chapter: v.chapter,
              verse: v.verse,
              text: v.text,
            })
            .onConflictDoUpdate({
              target: verses.id,
              set: { text: v.text },
            });
        }
      });

      const progress = 50 + Math.round((i / totalVerses) * 50);
      onProgress?.({ status: "processing", progress });
    }

    // Mark translation as downloaded with version
    await db
      .insert(translations)
      .values({
        id: translationId,
        name: data.name,
        version: data.version,
        downloadedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: translations.id,
        set: {
          name: data.name,
          version: data.version,
          downloadedAt: new Date(),
        },
      });

    // Cleanup temp file
    if (downloadedFile.exists) {
      downloadedFile.delete();
    }

    onProgress?.({ status: "complete", progress: 100 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    onProgress?.({ status: "error", progress: 0, error: message });
    throw error;
  }
}

/**
 * Update a downloaded translation to the latest version.
 * Deletes existing verses and re-downloads fresh data.
 */
export async function updateTranslation(
  translationId: string,
  onProgress?: (progress: DownloadProgress) => void,
): Promise<void> {
  // Delete existing verses first
  await db.delete(verses).where(eq(verses.translationId, translationId));

  // Re-download with new version
  await downloadTranslation(translationId, onProgress);
}

/**
 * Delete a downloaded translation.
 */
export async function deleteTranslation(translationId: string): Promise<void> {
  await db.delete(verses).where(eq(verses.translationId, translationId));
  await db.delete(translations).where(eq(translations.id, translationId));
}

/**
 * Get verses from offline storage.
 * NOTE: Uses Drizzle's and() combinator for multiple WHERE conditions.
 */
export async function getOfflineVerses(
  translationId: string,
  book: BibleBook,
  chapter: number,
) {
  return db
    .select()
    .from(verses)
    .where(
      and(
        eq(verses.translationId, translationId),
        eq(verses.book, book),
        eq(verses.chapter, chapter),
      ),
    )
    .orderBy(verses.verse);
}

/**
 * Check if specific chapter is available offline.
 * NOTE: Uses Drizzle's and() combinator for multiple WHERE conditions.
 */
export async function isChapterAvailable(
  translationId: string,
  book: BibleBook,
  chapter: number,
): Promise<boolean> {
  const result = await db
    .select({ id: verses.id })
    .from(verses)
    .where(
      and(
        eq(verses.translationId, translationId),
        eq(verses.book, book),
        eq(verses.chapter, chapter),
      ),
    )
    .limit(1);
  return result.length > 0;
}
