# Phase 3: Bible Reading - Research

**Researched:** 2026-02-02
**Domain:** Bible reading app with offline support, annotations, and navigation
**Confidence:** HIGH

## Summary

This phase implements the core Bible reading experience: displaying verses across translations, chapter navigation via swipe gestures, user annotations (highlights, bookmarks, notes), text search, font size preferences, and offline reading capability. The existing GraphQL backend provides queries for Bible content (`bibleVersesByReference`, `bibleVersesByQuery`) and user settings (`updateUserSettings`). The key technical challenges are: (1) efficient swipe-based chapter navigation, (2) local storage for offline Bible data and user annotations, and (3) verse-level interactions (tap to highlight, long-press for actions).

The standard approach for this domain combines `react-native-pager-view` for horizontal chapter swiping, `expo-sqlite` with Drizzle ORM for offline Bible data and annotations, and `@shopify/flash-list` for performant verse rendering. User preferences (font size, last reading position) should persist locally with Zustand + MMKV for instant access.

**Primary recommendation:** Use a local-first architecture where Bible translations are downloaded to SQLite for offline reading, user annotations stored locally and synced to the server when authenticated, with PagerView enabling seamless chapter navigation.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `react-native-pager-view` | ^7.x | Horizontal chapter swiping | Native ViewPager/UIPageViewController, 60fps performance, Expo compatible |
| `expo-sqlite` | ~15.x | Offline Bible data storage | Expo native module, SQLite for structured queries, sync/async API |
| `drizzle-orm` | ^0.38.x | Type-safe SQLite queries | TypeScript inference, migrations, works with expo-sqlite |
| `@shopify/flash-list` | ^2.x | Performant verse list rendering | Cell recycling (10x faster than FlatList), new architecture optimized |
| `react-native-mmkv` | ^3.x | Fast key-value persistence | 30-100x faster than AsyncStorage, user preferences storage |
| `zustand` | ^5.x | Lightweight state management | Minimal boilerplate, persist middleware, SSR-safe |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `expo-file-system` | ~18.x | Download translation files | Downloading Bible data files for offline use |
| `drizzle-kit` | ^0.30.x | Database migrations | Schema changes, CLI tool for generating migrations |
| `zustand-mmkv-storage` | ^1.x | Zustand persistence adapter | Connecting Zustand to MMKV for settings persistence |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| expo-sqlite | AsyncStorage | AsyncStorage is 6MB limit, no relational queries - not suitable for Bible data (~4MB per translation) |
| FlashList | FlatList | FlatList works but 10x slower, more blank frames during scroll |
| MMKV | AsyncStorage | AsyncStorage async-only, slower for frequent reads like font size |
| Drizzle | Raw SQL | Drizzle adds type safety, migrations; raw SQL fine for simple cases |

**Installation:**
```bash
npx expo install expo-sqlite @shopify/flash-list react-native-pager-view expo-file-system react-native-mmkv
npm install drizzle-orm zustand zustand-mmkv-storage
npm install -D drizzle-kit
```

## Architecture Patterns

### Recommended Project Structure
```
app/
├── (tabs)/
│   └── index.tsx           # Home tab with Bible reader
├── bible/
│   ├── [book]/
│   │   └── [chapter].tsx   # Dynamic route: /bible/GENESIS/1
│   └── _layout.tsx         # Bible stack layout
├── search.tsx              # Bible search screen
└── bookmarks.tsx           # Bookmarks list screen

lib/
├── bible/
│   ├── constants.ts        # Book details, translations (port from web)
│   ├── types.ts            # BibleBook, BibleVerse types
│   └── utils.ts            # Navigation helpers
├── db/
│   ├── client.ts           # Drizzle client setup
│   ├── schema.ts           # SQLite schema definitions
│   └── migrations/         # Drizzle migrations
└── stores/
    ├── bible-store.ts      # Current reading position, translation
    ├── annotations-store.ts # Highlights, bookmarks, notes
    └── settings-store.ts   # Font size, theme preferences

components/
├── bible/
│   ├── bible-reader.tsx    # Main reader with PagerView
│   ├── chapter-view.tsx    # Single chapter content
│   ├── verse-item.tsx      # Individual verse with highlighting
│   ├── verse-actions.tsx   # Bottom sheet for verse actions
│   └── bible-navigator.tsx # Book/chapter picker
└── search/
    └── search-bar.tsx      # Bible search input
```

### Pattern 1: PagerView for Chapter Navigation
**What:** Use PagerView with three pages (prev, current, next) for memory efficiency
**When to use:** Chapter-by-chapter Bible reading with swipe gestures
**Example:**
```typescript
// Source: https://github.com/callstack/react-native-pager-view
import PagerView from 'react-native-pager-view';
import { useRef, useCallback, useState } from 'react';

type ChapterPagerProps = {
  book: BibleBook;
  chapter: number;
  translation: BibleTranslation;
  onChapterChange: (chapter: number) => void;
};

export function ChapterPager({ book, chapter, translation, onChapterChange }: ChapterPagerProps) {
  const pagerRef = useRef<PagerView>(null);
  const maxChapters = bibleBookDetails[book].chapters;

  const handlePageSelected = useCallback((e: { nativeEvent: { position: number } }) => {
    const newPage = e.nativeEvent.position;
    // Position 0 = prev chapter, 1 = current, 2 = next
    if (newPage === 0 && chapter > 1) {
      onChapterChange(chapter - 1);
    } else if (newPage === 2 && chapter < maxChapters) {
      onChapterChange(chapter + 1);
    }
    // Reset to middle page
    pagerRef.current?.setPageWithoutAnimation(1);
  }, [chapter, maxChapters, onChapterChange]);

  return (
    <PagerView
      ref={pagerRef}
      style={{ flex: 1 }}
      initialPage={1}
      onPageSelected={handlePageSelected}
      offscreenPageLimit={1}
    >
      <ChapterView key="prev" book={book} chapter={chapter - 1} translation={translation} />
      <ChapterView key="current" book={book} chapter={chapter} translation={translation} />
      <ChapterView key="next" book={book} chapter={chapter + 1} translation={translation} />
    </PagerView>
  );
}
```

### Pattern 2: Drizzle + expo-sqlite for Offline Storage
**What:** Type-safe SQLite with migrations for Bible data and annotations
**When to use:** Storing downloaded translations and user annotations locally
**Example:**
```typescript
// Source: https://orm.drizzle.team/docs/connect-expo-sqlite
// db/schema.ts
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const translations = sqliteTable('translations', {
  id: text('id').primaryKey(), // 'KJV', 'ASV'
  name: text('name').notNull(),
  downloadedAt: integer('downloaded_at', { mode: 'timestamp' }),
});

export const verses = sqliteTable('verses', {
  id: text('id').primaryKey(), // 'KJV:GENESIS:1:1'
  translationId: text('translation_id').notNull(),
  book: text('book').notNull(),
  chapter: integer('chapter').notNull(),
  verse: integer('verse').notNull(),
  text: text('text').notNull(),
});

export const highlights = sqliteTable('highlights', {
  id: text('id').primaryKey(),
  verseId: text('verse_id').notNull(),
  color: text('color').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  syncedAt: integer('synced_at', { mode: 'timestamp' }),
});

export const bookmarks = sqliteTable('bookmarks', {
  id: text('id').primaryKey(),
  verseId: text('verse_id').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  syncedAt: integer('synced_at', { mode: 'timestamp' }),
});

export const notes = sqliteTable('notes', {
  id: text('id').primaryKey(),
  verseId: text('verse_id').notNull(),
  content: text('content').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  syncedAt: integer('synced_at', { mode: 'timestamp' }),
});

// db/client.ts
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';
import * as schema from './schema';

const expoDb = openDatabaseSync('selah.db', { enableChangeListener: true });
export const db = drizzle(expoDb, { schema });
```

### Pattern 3: Zustand + MMKV for Settings Persistence
**What:** Fast, synchronous settings persistence with Zustand
**When to use:** Font size, last reading position, translation preference
**Example:**
```typescript
// Source: https://github.com/mrousavy/react-native-mmkv
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV({ id: 'selah-settings' });

const mmkvStorage = {
  getItem: (name: string) => storage.getString(name) ?? null,
  setItem: (name: string, value: string) => storage.set(name, value),
  removeItem: (name: string) => storage.delete(name),
};

type FontSize = 'small' | 'medium' | 'large';

interface BibleSettingsStore {
  fontSize: FontSize;
  translation: 'KJV' | 'ASV';
  lastBook: string;
  lastChapter: number;
  setFontSize: (size: FontSize) => void;
  setTranslation: (translation: 'KJV' | 'ASV') => void;
  setLastPosition: (book: string, chapter: number) => void;
}

export const useBibleSettings = create<BibleSettingsStore>()(
  persist(
    (set) => ({
      fontSize: 'medium',
      translation: 'KJV',
      lastBook: 'GENESIS',
      lastChapter: 1,
      setFontSize: (fontSize) => set({ fontSize }),
      setTranslation: (translation) => set({ translation }),
      setLastPosition: (lastBook, lastChapter) => set({ lastBook, lastChapter }),
    }),
    {
      name: 'bible-settings',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
```

### Pattern 4: FlashList for Verse Rendering
**What:** High-performance list with cell recycling for verse display
**When to use:** Displaying chapter verses with highlights
**Example:**
```typescript
// Source: https://shopify.github.io/flash-list/
import { FlashList } from '@shopify/flash-list';

type Verse = {
  id: string;
  verse: number;
  text: string;
  highlightColor?: string;
};

export function ChapterView({ verses }: { verses: Verse[] }) {
  const renderVerse = useCallback(({ item }: { item: Verse }) => (
    <VerseItem verse={item} />
  ), []);

  return (
    <FlashList
      data={verses}
      renderItem={renderVerse}
      estimatedItemSize={80}
      keyExtractor={(item) => item.id}
    />
  );
}
```

### Anti-Patterns to Avoid
- **Loading entire Bible into memory:** Verse data should be queried per-chapter, not loaded entirely
- **Sync storage for settings:** Don't use AsyncStorage for frequently-read settings (font size) - use MMKV
- **FlatList for verses:** Use FlashList for cell recycling, especially on low-end devices
- **Network-first for reading:** Always check local SQLite first for offline-first UX
- **Storing highlights in API only:** Store locally first, sync when authenticated (local-first pattern)

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Chapter swipe navigation | Custom gesture handlers | `react-native-pager-view` | Native ViewPager performance, edge cases handled |
| Offline storage | JSON files with AsyncStorage | `expo-sqlite` + Drizzle | Relational queries, large data, migrations |
| Fast settings persistence | Custom file-based storage | MMKV | Synchronous reads, 30x faster than AsyncStorage |
| Virtualized verse list | Basic ScrollView | `@shopify/flash-list` | Memory recycling, 60fps on low-end devices |
| Text highlighting UI | Custom gesture-based selection | Render highlighted spans | Bible highlighting is per-verse, not arbitrary text selection |

**Key insight:** Bible apps have well-understood patterns. The offline-first, swipe-navigation, annotation pattern is mature - use established libraries rather than building from scratch.

## Common Pitfalls

### Pitfall 1: Rendering All Verses at Once
**What goes wrong:** App freezes when loading chapters with many verses (Psalm 119 has 176 verses)
**Why it happens:** FlatList creates all components; no virtualization awareness
**How to avoid:** Use FlashList with `estimatedItemSize`, load only visible verses
**Warning signs:** Slow chapter loads, high memory usage, janky scroll

### Pitfall 2: Network-First for Reading
**What goes wrong:** App unusable offline, slow chapter transitions
**Why it happens:** Fetching from GraphQL API on every chapter change
**How to avoid:** Download translations to SQLite, read from local DB, sync when online
**Warning signs:** Loading spinners on chapter change, offline errors

### Pitfall 3: AsyncStorage for Bible Data
**What goes wrong:** Exceeds 6MB limit, slow queries, no relational lookups
**Why it happens:** AsyncStorage is simple but not designed for structured data
**How to avoid:** Use expo-sqlite for Bible data (verses, translations)
**Warning signs:** "AsyncStorage has been cleared" errors, slow search

### Pitfall 4: No Migration Strategy for SQLite
**What goes wrong:** Database schema changes break existing users
**Why it happens:** Schema changes without version tracking
**How to avoid:** Use Drizzle migrations, increment schema version, handle upgrades
**Warning signs:** Crashes on app update, "no such column" errors

### Pitfall 5: Blocking UI with Database Writes
**What goes wrong:** UI freezes when saving highlights or notes
**Why it happens:** Running SQLite writes on main thread
**How to avoid:** Use async methods, optimistic UI updates
**Warning signs:** Jank when tapping to highlight, delayed visual feedback

### Pitfall 6: Font Size Not Respecting System Accessibility
**What goes wrong:** Users with accessibility needs can't read comfortably
**Why it happens:** Using fixed pixel values, ignoring `maxFontSizeMultiplier`
**How to avoid:** Use relative sizes, allow font scaling, test with Large Text enabled
**Warning signs:** Text too small on large displays, overflows on max accessibility

## Code Examples

Verified patterns from official sources:

### Verse Item with Highlight Support
```typescript
// Adapted from selah-web/src/components/bible/bible-verse-card.tsx
import { Pressable, Text, View } from 'react-native';
import { useBibleSettings } from '@/lib/stores/settings-store';

const FONT_SIZES = {
  small: { text: 15, verse: 12 },
  medium: { text: 17, verse: 14 },
  large: { text: 20, verse: 16 },
};

type VerseItemProps = {
  verse: {
    id: string;
    verse: number;
    text: string;
    highlightColor?: string | null;
  };
  onPress: () => void;
  onLongPress: () => void;
};

export function VerseItem({ verse, onPress, onLongPress }: VerseItemProps) {
  const { fontSize } = useBibleSettings();
  const sizes = FONT_SIZES[fontSize];

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      className="flex-row gap-3 py-2 px-3"
      style={verse.highlightColor ? { backgroundColor: verse.highlightColor + '26' } : undefined}
    >
      <Text
        className="text-muted-foreground font-medium"
        style={{ fontSize: sizes.verse, minWidth: 24, textAlign: 'right' }}
      >
        {verse.verse}
      </Text>
      <Text
        className="text-foreground flex-1 leading-relaxed"
        style={{ fontSize: sizes.text }}
      >
        {verse.text}
      </Text>
    </Pressable>
  );
}
```

### Bible Navigation with Expo Router
```typescript
// app/bible/[book]/[chapter].tsx
import { useLocalSearchParams, router } from 'expo-router';
import { ChapterPager } from '@/components/bible/chapter-pager';
import { useBibleSettings } from '@/lib/stores/settings-store';

export default function ChapterScreen() {
  const { book, chapter } = useLocalSearchParams<{ book: string; chapter: string }>();
  const { translation, setLastPosition } = useBibleSettings();

  const handleChapterChange = (newChapter: number) => {
    setLastPosition(book, newChapter);
    router.setParams({ chapter: String(newChapter) });
  };

  return (
    <ChapterPager
      book={book as BibleBook}
      chapter={parseInt(chapter, 10)}
      translation={translation}
      onChapterChange={handleChapterChange}
    />
  );
}
```

### SQLite Query for Chapter Verses
```typescript
// Using Drizzle with expo-sqlite
import { db } from '@/lib/db/client';
import { verses } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function getChapterVerses(
  translation: string,
  book: string,
  chapter: number
) {
  return db.select()
    .from(verses)
    .where(
      and(
        eq(verses.translationId, translation),
        eq(verses.book, book),
        eq(verses.chapter, chapter)
      )
    )
    .orderBy(verses.verse);
}

// With highlights joined
export async function getChapterVersesWithHighlights(
  translation: string,
  book: string,
  chapter: number
) {
  return db.select({
    id: verses.id,
    verse: verses.verse,
    text: verses.text,
    highlightColor: highlights.color,
  })
    .from(verses)
    .leftJoin(highlights, eq(verses.id, highlights.verseId))
    .where(
      and(
        eq(verses.translationId, translation),
        eq(verses.book, book),
        eq(verses.chapter, chapter)
      )
    )
    .orderBy(verses.verse);
}
```

### Download Translation for Offline
```typescript
// Source: https://docs.expo.dev/versions/latest/sdk/filesystem/
import * as FileSystem from 'expo-file-system';
import { db } from '@/lib/db/client';
import { verses, translations } from '@/lib/db/schema';

export async function downloadTranslation(translationId: 'KJV' | 'ASV') {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/api/bible/${translationId}.json`;
  const fileUri = FileSystem.cacheDirectory + `${translationId}.json`;

  // Download file
  const { uri } = await FileSystem.downloadAsync(url, fileUri);

  // Parse and insert into SQLite
  const content = await FileSystem.readAsStringAsync(uri);
  const data = JSON.parse(content);

  await db.transaction(async (tx) => {
    // Insert verses in batches
    for (const verse of data.verses) {
      await tx.insert(verses).values({
        id: `${translationId}:${verse.book}:${verse.chapter}:${verse.verse}`,
        translationId,
        book: verse.book,
        chapter: verse.chapter,
        verse: verse.verse,
        text: verse.text,
      });
    }

    // Mark as downloaded
    await tx.insert(translations).values({
      id: translationId,
      name: data.name,
      downloadedAt: new Date(),
    }).onConflictDoUpdate({
      target: translations.id,
      set: { downloadedAt: new Date() },
    });
  });

  // Cleanup temp file
  await FileSystem.deleteAsync(uri);
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| FlatList for lists | FlashList v2 | 2025 | 10x faster rendering, new arch support |
| AsyncStorage | expo-sqlite + MMKV | 2024 | Better for large data + fast settings |
| Custom gestures | react-native-pager-view v7 | 2025 | Native pager, new arch only |
| Manual SQL | Drizzle ORM | 2024-2025 | Type safety, migrations |
| Redux for state | Zustand | 2023+ | Less boilerplate, persist middleware |

**Deprecated/outdated:**
- `react-native-sqlite-storage`: Use expo-sqlite for Expo projects
- FlatList for long lists: FlashList is the standard now
- Realm: expo-sqlite + Drizzle is simpler and well-supported

## Open Questions

Things that couldn't be fully resolved:

1. **Backend API for offline Bible data**
   - What we know: GraphQL API returns verses via `bibleVersesByReference`
   - What's unclear: Is there a bulk endpoint or downloadable JSON for offline? Need to check if backend exposes Bible translation data in bulk format.
   - Recommendation: If no bulk endpoint exists, may need to add one to backend or bundle Bible data in app assets

2. **Highlights/bookmarks/notes in GraphQL schema**
   - What we know: Current schema has `VerseHighlightSettings` (enabled/color) but no per-verse highlight storage
   - What's unclear: Are there mutations for saving individual highlights/bookmarks/notes to server?
   - Recommendation: Store locally first (SQLite), add GraphQL mutations later for sync; local-first is better UX anyway

3. **Full-text search performance**
   - What we know: expo-sqlite supports FTS5 via `enableFTS` config
   - What's unclear: Best approach - local FTS vs server search vs hybrid
   - Recommendation: Use server search (bibleVersesByQuery) when online, consider FTS for offline if needed

## Sources

### Primary (HIGH confidence)
- [expo-sqlite documentation](https://docs.expo.dev/versions/latest/sdk/sqlite/) - SQLite API, SQLiteProvider, useSQLiteContext
- [Drizzle ORM - Expo SQLite](https://orm.drizzle.team/docs/connect-expo-sqlite) - Setup, migrations, live queries
- [FlashList documentation](https://shopify.github.io/flash-list/) - Performance, API, estimatedItemSize
- [react-native-pager-view GitHub](https://github.com/callstack/react-native-pager-view) - Props, methods, usePagerView

### Secondary (MEDIUM confidence)
- [Expo blog - Modern SQLite](https://expo.dev/blog/modern-sqlite-for-react-native-apps) - Best practices, third-party integrations
- [react-native-mmkv docs](https://github.com/mrousavy/react-native-mmkv) - Zustand persist middleware setup
- [Zustand persist middleware](https://zustand.docs.pmnd.rs/integrations/persisting-store-data) - Storage configuration

### Tertiary (LOW confidence)
- WebSearch findings on Bible app patterns - multiple sources confirm swipe navigation + offline-first is standard

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries verified via official documentation
- Architecture: HIGH - Patterns derived from official docs + existing selah-web implementation
- Pitfalls: MEDIUM - Based on documentation warnings + common React Native issues
- Offline sync: MEDIUM - Local-first pattern is established; server sync details depend on backend

**Research date:** 2026-02-02
**Valid until:** 2026-03-02 (30 days - libraries are stable)
