import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { openDatabaseSync } from 'expo-sqlite';
import * as schema from './schema';
import migrations from './migrations/migrations';

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

/**
 * Hook to run database migrations on app startup.
 * Must be called once at the root of the app before any database access.
 *
 * Usage:
 * ```typescript
 * const { success, error } = useDatabaseMigrations();
 * if (!success) return <LoadingScreen />;
 * ```
 */
export function useDatabaseMigrations() {
  return useMigrations(db, migrations);
}

export { expoDb };
