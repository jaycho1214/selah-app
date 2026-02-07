import { useCallback, useState, useEffect, useMemo, useRef } from "react";
import { View } from "react-native";
import { FlashList, type FlashListRef } from "@shopify/flash-list";
import { graphql, useLazyLoadQuery } from "react-relay";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Network from "expo-network";
import { VerseItem } from "./verse-item";
import { ChapterHeader } from "./chapter-header";
import { ChapterSkeleton } from "./chapter-skeleton";
import { useBibleStore } from "@/lib/stores/bible-store";
import { useVerseSelectionStore } from "@/lib/stores/verse-selection-store";
import { useVerseHighlightStore } from "@/lib/stores/verse-highlight-store";
import { isTranslationDownloaded, getOfflineVerses } from "@/lib/bible/offline";
import { createVerseId } from "@/lib/bible/utils";
import type { BibleBook } from "@/lib/bible/types";
import type {
  chapterViewQuery,
  chapterViewQuery$variables,
} from "@/lib/relay/__generated__/chapterViewQuery.graphql";

const chapterQuery = graphql`
  query chapterViewQuery(
    $translation: BibleTranslation!
    $book: BibleBook!
    $chapter: Int!
  ) {
    bibleVersesByReference(
      translation: $translation
      book: $book
      chapter: $chapter
    ) {
      id
      verse
      text
      hasUserPost
    }
  }
`;

interface Verse {
  id: string;
  verse: number;
  text: string;
  hasUserPost?: boolean;
}

interface ChapterViewProps {
  book: BibleBook;
  chapter: number;
  topInset?: number;
  scrollToVerse?: number | null;
  onVersePress?: (verseId: string, verseText?: string) => void;
  onVerseLongPress?: (
    verseId: string,
    verseText: string,
    book: BibleBook,
    chapter: number,
    verseNumber: number,
  ) => void;
}

export function ChapterView({
  book,
  chapter,
  topInset = 0,
  scrollToVerse,
  onVersePress,
  onVerseLongPress,
}: ChapterViewProps) {
  const { currentTranslation } = useBibleStore();

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
        const verses = await getOfflineVerses(
          currentTranslation,
          book,
          chapter,
        );
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
        book={book}
        chapter={chapter}
        translation={currentTranslation}
        verses={offlineVerses}
        topInset={topInset}
        scrollToVerse={scrollToVerse}
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
      topInset={topInset}
      scrollToVerse={scrollToVerse}
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
  topInset,
  scrollToVerse,
  onVersePress,
  onVerseLongPress,
}: {
  book: BibleBook;
  chapter: number;
  currentTranslation: string;
  topInset?: number;
  scrollToVerse?: number | null;
  onVersePress?: (verseId: string, verseText?: string) => void;
  onVerseLongPress?: (
    verseId: string,
    verseText: string,
    book: BibleBook,
    chapter: number,
    verseNumber: number,
  ) => void;
}) {
  const data = useLazyLoadQuery<chapterViewQuery>(
    chapterQuery,
    {
      translation:
        currentTranslation as chapterViewQuery$variables["translation"],
      book,
      chapter,
    },
    { fetchPolicy: "store-or-network" },
  );

  const verses = data.bibleVersesByReference ?? [];

  return (
    <ChapterViewContent
      book={book}
      chapter={chapter}
      translation={currentTranslation}
      verses={verses as Verse[]}
      topInset={topInset}
      scrollToVerse={scrollToVerse}
      onVersePress={onVersePress}
      onVerseLongPress={onVerseLongPress}
    />
  );
}

// Shared content renderer
function ChapterViewContent({
  book,
  chapter,
  translation,
  verses,
  topInset = 0,
  scrollToVerse,
  onVersePress,
  onVerseLongPress,
}: {
  book: BibleBook;
  chapter: number;
  translation: string;
  verses: Verse[];
  topInset?: number;
  scrollToVerse?: number | null;
  onVersePress?: (verseId: string, verseText?: string) => void;
  onVerseLongPress?: (
    verseId: string,
    verseText: string,
    book: BibleBook,
    chapter: number,
    verseNumber: number,
  ) => void;
}) {
  const insets = useSafeAreaInsets();
  const setScrollToVerse = useBibleStore((s) => s.setScrollToVerse);
  const selectedIds = useVerseSelectionStore((s) => s.selectedIds);
  const isSelecting = useVerseSelectionStore((s) => s.isSelecting);
  const highlightEnabled = useVerseHighlightStore((s) => s.enabled);
  const highlightColor = useVerseHighlightStore((s) => s.color);

  // Scroll to verse after data loads
  const listRef = useRef<FlashListRef<Verse>>(null);

  useEffect(() => {
    if (scrollToVerse == null || scrollToVerse <= 0 || verses.length === 0)
      return;
    const idx = verses.findIndex((v) => v.verse === scrollToVerse);
    if (idx < 0) return;
    // Give FlashList time to layout, then scroll and clear
    const timer = setTimeout(() => {
      listRef.current?.scrollToIndex({ index: idx, animated: true });
      setScrollToVerse(null);
    }, 150);
    return () => clearTimeout(timer);
  }, [verses, scrollToVerse, setScrollToVerse]);

  const ListHeader = useMemo(
    () => <ChapterHeader book={book} chapter={chapter} />,
    [book, chapter],
  );

  const renderItem = useCallback(
    ({ item }: { item: Verse }) => {
      const verseId = createVerseId(translation, book, chapter, item.verse);

      // When in selection mode, tap toggles selection (same as long press)
      const handlePress = isSelecting
        ? () =>
            onVerseLongPress?.(item.id, item.text, book, chapter, item.verse)
        : () => onVersePress?.(verseId, item.text);

      const shouldHighlight = highlightEnabled && !!item.hasUserPost;

      return (
        <VerseItem
          verse={item}
          isSelected={selectedIds.has(item.id)}
          isFirstVerse={item.verse === 1}
          highlightColor={shouldHighlight ? highlightColor : null}
          onPress={handlePress}
          onLongPress={() =>
            onVerseLongPress?.(item.id, item.text, book, chapter, item.verse)
          }
        />
      );
    },
    [
      selectedIds,
      isSelecting,
      highlightEnabled,
      highlightColor,
      onVersePress,
      onVerseLongPress,
      book,
      chapter,
      translation,
    ],
  );

  const keyExtractor = useCallback((item: Verse) => item.id, []);

  const extraData = useMemo(
    () => ({
      size: selectedIds.size,
      isSelecting,
      highlightEnabled,
      highlightColor,
    }),
    [selectedIds, isSelecting, highlightEnabled, highlightColor],
  );

  if (verses.length === 0) {
    return <ChapterSkeleton topInset={topInset} />;
  }

  return (
    <View className="flex-1">
      <FlashList
        ref={listRef}
        data={verses}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        extraData={extraData}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={{
          paddingTop: topInset + 16,
          paddingBottom: insets.bottom + 120,
        }}
      />
    </View>
  );
}
