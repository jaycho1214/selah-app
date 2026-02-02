import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';
import * as schema from './schema';

/**
 * Opens the SQLite database synchronously.
 * enableChangeListener allows reactive queries in the future.
 */
const expoDb = openDatabaseSync('selah.db', { enableChangeListener: true });

/**
 * Drizzle ORM client for type-safe database queries.
 *
 * Usage:
 * ```typescript
 * import { db } from '@/lib/db/client';
 * import { verses } from '@/lib/db/schema';
 * import { eq } from 'drizzle-orm';
 *
 * const result = await db.select().from(verses).where(eq(verses.book, 'GENESIS'));
 * ```
 */
export const db = drizzle(expoDb, { schema });

export { expoDb };
