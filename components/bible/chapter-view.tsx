import { useCallback, useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { graphql, useLazyLoadQuery } from 'react-relay';
import * as Network from 'expo-network';
import { VerseItem } from './verse-item';
import { useAnnotationsStore } from '@/lib/stores/annotations-store';
import { useBibleStore } from '@/lib/stores/bible-store';
import { isTranslationDownloaded, getOfflineVerses } from '@/lib/bible/offline';
import type { BibleBook } from '@/lib/bible/types';
import type { chapterViewQuery, chapterViewQuery$variables } from '@/lib/relay/__generated__/chapterViewQuery.graphql';

const chapterQuery = graphql`
  query chapterViewQuery($translation: BibleTranslation!, $book: BibleBook!, $chapter: Int!) {
    bibleVersesByReference(translation: $translation, book: $book, chapter: $chapter) {
      id
      verse
      text
    }
  }
`;

interface Verse {
  id: string;
  verse: number;
  text: string;
}

interface ChapterViewProps {
  book: BibleBook;
  chapter: number;
  topInset?: number;
  onVersePress?: (verseId: string, verseText?: string) => void;
  onVerseLongPress?: (verseId: string, verseText?: string) => void;
}

export function ChapterView({
  book,
  chapter,
  topInset = 0,
  onVersePress,
  onVerseLongPress,
}: ChapterViewProps) {
  const { currentTranslation } = useBibleStore();
  const { highlights, bookmarks } = useAnnotationsStore();

  // Track offline state and availability
  const [isOffline, setIsOffline] = useState(false);
  const [offlineAvailable, setOfflineAvailable] = useState(false);
  const [offlineVerses, setOfflineVerses] = useState<Verse[] | null>(null);

  // Check network status and offline availability
  useEffect(() => {
    const checkOfflineStatus = async () => {
      const netState = await Network.getNetworkStateAsync();
      const offline = !netState.isConnected;
      setIsOffline(offline);

      const downloaded = await isTranslationDownloaded(currentTranslation);
      setOfflineAvailable(downloaded);

      // If offline and translation is downloaded, load from SQLite
      if (offline && downloaded) {
        const verses = await getOfflineVerses(currentTranslation, book, chapter);
        setOfflineVerses(verses as Verse[]);
      } else {
        setOfflineVerses(null);
      }
    };

    checkOfflineStatus();

    // Subscribe to network changes
    const subscription = Network.addNetworkStateListener((state) => {
      setIsOffline(!state.isConnected);
      if (!state.isConnected) {
        checkOfflineStatus();
      }
    });

    return () => subscription.remove();
  }, [currentTranslation, book, chapter]);

  // Conditionally render the Relay version or offline version
  if (isOffline && offlineAvailable && offlineVerses) {
    return (
      <ChapterViewContent
        verses={offlineVerses}
        highlights={highlights}
        bookmarks={bookmarks}
        topInset={topInset}
        onVersePress={onVersePress}
        onVerseLongPress={onVerseLongPress}
      />
    );
  }

  // Online mode - use Relay
  return (
    <ChapterViewRelay
      book={book}
      chapter={chapter}
      currentTranslation={currentTranslation}
      highlights={highlights}
      bookmarks={bookmarks}
      topInset={topInset}
      onVersePress={onVersePress}
      onVerseLongPress={onVerseLongPress}
    />
  );
}

// Relay-powered chapter view (for online use)
function ChapterViewRelay({
  book,
  chapter,
  currentTranslation,
  highlights,
  bookmarks,
  topInset,
  onVersePress,
  onVerseLongPress,
}: {
  book: BibleBook;
  chapter: number;
  currentTranslation: string;
  highlights: Record<string, { color: string }>;
  bookmarks: Record<string, { createdAt: number }>;
  topInset?: number;
  onVersePress?: (verseId: string, verseText?: string) => void;
  onVerseLongPress?: (verseId: string, verseText?: string) => void;
}) {
  const data = useLazyLoadQuery<chapterViewQuery>(
    chapterQuery,
    {
      translation: currentTranslation as chapterViewQuery$variables['translation'],
      book,
      chapter,
    },
    { fetchPolicy: 'store-or-network' }
  );

  const verses = data.bibleVersesByReference ?? [];

  return (
    <ChapterViewContent
      verses={verses as Verse[]}
      highlights={highlights}
      bookmarks={bookmarks}
      topInset={topInset}
      onVersePress={onVersePress}
      onVerseLongPress={onVerseLongPress}
    />
  );
}

// Shared content renderer
function ChapterViewContent({
  verses,
  highlights,
  bookmarks,
  topInset = 0,
  onVersePress,
  onVerseLongPress,
}: {
  verses: Verse[];
  highlights: Record<string, { color: string }>;
  bookmarks: Record<string, { createdAt: number }>;
  topInset?: number;
  onVersePress?: (verseId: string, verseText?: string) => void;
  onVerseLongPress?: (verseId: string, verseText?: string) => void;
}) {
  const renderItem = useCallback(
    ({ item }: { item: Verse }) => {
      const highlight = highlights[item.id];
      const bookmark = bookmarks[item.id];

      return (
        <VerseItem
          verse={item}
          highlightColor={highlight?.color}
          isBookmarked={!!bookmark}
          onPress={() => onVersePress?.(item.id, item.text)}
          onLongPress={() => onVerseLongPress?.(item.id, item.text)}
        />
      );
    },
    [highlights, bookmarks, onVersePress, onVerseLongPress]
  );

  const keyExtractor = useCallback((item: Verse) => item.id, []);

  if (verses.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <FlashList
        data={verses}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={{
          paddingTop: topInset + 16,
          paddingBottom: 16,
        }}
      />
    </View>
  );
}
