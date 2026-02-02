import { useRef, useCallback, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import PagerView from 'react-native-pager-view';
import { Suspense } from 'react';
import { ChapterView } from './chapter-view';
import { useBibleStore } from '@/lib/stores/bible-store';
import { BIBLE_BOOKS, BIBLE_BOOK_DETAILS } from '@/lib/bible/constants';
import { BibleBook } from '@/lib/bible/types';

interface BibleReaderProps {
  initialBook: BibleBook;
  initialChapter: number;
  onPositionChange?: (book: BibleBook, chapter: number) => void;
  onVersePress?: (verseId: string, verseText?: string) => void;
  onVerseLongPress?: (verseId: string, verseText?: string) => void;
}

export function BibleReader({
  initialBook,
  initialChapter,
  onPositionChange,
  onVersePress,
  onVerseLongPress,
}: BibleReaderProps) {
  const pagerRef = useRef<PagerView>(null);
  const { setPosition } = useBibleStore();

  // Track current position
  const [currentBook, setCurrentBook] = useState(initialBook);
  const [currentChapter, setCurrentChapter] = useState(initialChapter);

  const maxChapters = BIBLE_BOOK_DETAILS[currentBook].chapters;
  const bookIndex = BIBLE_BOOKS.indexOf(currentBook);

  // Calculate prev/next for 3-page pager
  const getPrevChapter = (): { book: BibleBook; chapter: number } | null => {
    if (currentChapter > 1) {
      return { book: currentBook, chapter: currentChapter - 1 };
    }
    // Go to previous book's last chapter
    if (bookIndex > 0) {
      const prevBook = BIBLE_BOOKS[bookIndex - 1];
      return { book: prevBook, chapter: BIBLE_BOOK_DETAILS[prevBook].chapters };
    }
    return null; // At Genesis 1
  };

  const getNextChapter = (): { book: BibleBook; chapter: number } | null => {
    if (currentChapter < maxChapters) {
      return { book: currentBook, chapter: currentChapter + 1 };
    }
    // Go to next book's first chapter
    if (bookIndex < BIBLE_BOOKS.length - 1) {
      const nextBook = BIBLE_BOOKS[bookIndex + 1];
      return { book: nextBook, chapter: 1 };
    }
    return null; // At Revelation 22
  };

  const prev = getPrevChapter();
  const next = getNextChapter();

  const handlePageSelected = useCallback(
    (e: { nativeEvent: { position: number } }) => {
      const position = e.nativeEvent.position;

      if (position === 0 && prev) {
        // Swiped to previous chapter
        setCurrentBook(prev.book);
        setCurrentChapter(prev.chapter);
        setPosition(prev.book, prev.chapter);
        onPositionChange?.(prev.book, prev.chapter);
        // Reset pager to middle
        pagerRef.current?.setPageWithoutAnimation(1);
      } else if (position === 2 && next) {
        // Swiped to next chapter
        setCurrentBook(next.book);
        setCurrentChapter(next.chapter);
        setPosition(next.book, next.chapter);
        onPositionChange?.(next.book, next.chapter);
        // Reset pager to middle
        pagerRef.current?.setPageWithoutAnimation(1);
      }
    },
    [prev, next, setPosition, onPositionChange]
  );

  // Navigate to specific position (called from navigator)
  const navigateTo = useCallback(
    (book: BibleBook, chapter: number) => {
      setCurrentBook(book);
      setCurrentChapter(chapter);
      setPosition(book, chapter);
      onPositionChange?.(book, chapter);
    },
    [setPosition, onPositionChange]
  );

  const ChapterFallback = () => (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size="large" />
    </View>
  );

  return (
    <PagerView
      ref={pagerRef}
      style={{ flex: 1 }}
      initialPage={1}
      onPageSelected={handlePageSelected}
      offscreenPageLimit={1}
    >
      {/* Page 0: Previous chapter */}
      <View key="prev" style={{ flex: 1 }}>
        {prev ? (
          <Suspense fallback={<ChapterFallback />}>
            <ChapterView
              book={prev.book}
              chapter={prev.chapter}
              onVersePress={onVersePress}
              onVerseLongPress={onVerseLongPress}
            />
          </Suspense>
        ) : (
          <View className="flex-1" />
        )}
      </View>

      {/* Page 1: Current chapter */}
      <View key="current" style={{ flex: 1 }}>
        <Suspense fallback={<ChapterFallback />}>
          <ChapterView
            book={currentBook}
            chapter={currentChapter}
            onVersePress={onVersePress}
            onVerseLongPress={onVerseLongPress}
          />
        </Suspense>
      </View>

      {/* Page 2: Next chapter */}
      <View key="next" style={{ flex: 1 }}>
        {next ? (
          <Suspense fallback={<ChapterFallback />}>
            <ChapterView
              book={next.book}
              chapter={next.chapter}
              onVersePress={onVersePress}
              onVerseLongPress={onVerseLongPress}
            />
          </Suspense>
        ) : (
          <View className="flex-1" />
        )}
      </View>
    </PagerView>
  );
}
