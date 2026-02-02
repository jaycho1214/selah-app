import { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';
import { BookmarkItem } from '@/components/bible/bookmark-item';
import { useAnnotationsStore } from '@/lib/stores/annotations-store';
import type { BibleBook } from '@/lib/bible/types';

/**
 * Parse verse ID into routing parameters.
 * Format: "{translationId}:{book}:{chapter}:{verse}"
 */
function parseVerseId(verseId: string) {
  const parts = verseId.split(':');
  if (parts.length !== 4) return null;
  return {
    translation: parts[0],
    book: parts[1] as BibleBook,
    chapter: parseInt(parts[2], 10),
    verse: parseInt(parts[3], 10),
  };
}

/**
 * BookmarksScreen displays all saved bookmarks sorted by date (newest first).
 * Tapping a bookmark navigates to the chapter containing that verse.
 * Users can delete bookmarks directly from this list.
 */
export default function BookmarksScreen() {
  const { bookmarks, removeBookmark } = useAnnotationsStore();

  // Convert Record to sorted array (newest first)
  const bookmarkList = useMemo(() => {
    return Object.values(bookmarks).sort((a, b) => b.createdAt - a.createdAt);
  }, [bookmarks]);

  const handleBookmarkPress = useCallback((verseId: string) => {
    const parsed = parseVerseId(verseId);
    if (!parsed) return;
    router.push(`/bible/${parsed.book}/${parsed.chapter}`);
    // TODO: Scroll to specific verse within chapter
  }, []);

  const handleDeleteBookmark = useCallback(
    (verseId: string) => {
      removeBookmark(verseId);
    },
    [removeBookmark]
  );

  const renderItem = useCallback(
    ({ item }: { item: (typeof bookmarkList)[number] }) => (
      <BookmarkItem
        verseId={item.verseId}
        createdAt={item.createdAt}
        onPress={() => handleBookmarkPress(item.verseId)}
        onDelete={() => handleDeleteBookmark(item.verseId)}
      />
    ),
    [handleBookmarkPress, handleDeleteBookmark]
  );

  const keyExtractor = useCallback(
    (item: (typeof bookmarkList)[number]) => item.verseId,
    []
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <Stack.Screen
        options={{
          title: 'Bookmarks',
          headerLargeTitle: true,
        }}
      />

      {bookmarkList.length === 0 ? (
        <View className="flex-1 items-center justify-center p-8">
          <Text className="text-muted-foreground text-center text-lg">
            No bookmarks yet
          </Text>
          <Text className="text-muted-foreground text-center text-sm mt-2">
            Tap a verse while reading to add a bookmark
          </Text>
        </View>
      ) : (
        <FlashList
          data={bookmarkList}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
        />
      )}
    </SafeAreaView>
  );
}
