import { useRef, useCallback, useState } from 'react';
import { View, ActivityIndicator, Dimensions, StyleSheet, useColorScheme } from 'react-native';
import PagerView, { PagerViewOnPageScrollEvent } from 'react-native-pager-view';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Suspense } from 'react';
import { ChapterView } from './chapter-view';
import { useBibleStore } from '@/lib/stores/bible-store';
import { BIBLE_BOOKS, BIBLE_BOOK_DETAILS } from '@/lib/bible/constants';
import { BibleBook } from '@/lib/bible/types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BULGE_MAX_WIDTH = 48;
const BULGE_HEIGHT = SCREEN_HEIGHT * 0.4;

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
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Shared values for edge bulge animation
  const scrollOffset = useSharedValue(0);
  const scrollDirection = useSharedValue<'left' | 'right' | null>(null);

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
    if (bookIndex > 0) {
      const prevBook = BIBLE_BOOKS[bookIndex - 1];
      return { book: prevBook, chapter: BIBLE_BOOK_DETAILS[prevBook].chapters };
    }
    return null;
  };

  const getNextChapter = (): { book: BibleBook; chapter: number } | null => {
    if (currentChapter < maxChapters) {
      return { book: currentBook, chapter: currentChapter + 1 };
    }
    if (bookIndex < BIBLE_BOOKS.length - 1) {
      const nextBook = BIBLE_BOOKS[bookIndex + 1];
      return { book: nextBook, chapter: 1 };
    }
    return null;
  };

  const prev = getPrevChapter();
  const next = getNextChapter();

  // Handle page scroll for bulge animation
  const handlePageScroll = useCallback(
    (e: PagerViewOnPageScrollEvent) => {
      const { position, offset } = e.nativeEvent;

      // Calculate scroll progress: 0 = at page 0, 1 = at page 1, 2 = at page 2
      const progress = position + offset;

      // Determine scroll direction and amount
      if (progress < 1) {
        // Scrolling towards previous (left edge bulge appears on right side of screen)
        scrollDirection.value = 'left';
        scrollOffset.value = 1 - progress; // 0 to 1 as we scroll left
      } else if (progress > 1) {
        // Scrolling towards next (right edge bulge appears on left side)
        scrollDirection.value = 'right';
        scrollOffset.value = progress - 1; // 0 to 1 as we scroll right
      } else {
        scrollOffset.value = 0;
        scrollDirection.value = null;
      }
    },
    []
  );

  const handlePageSelected = useCallback(
    (e: { nativeEvent: { position: number } }) => {
      const position = e.nativeEvent.position;

      // Trigger haptic feedback on page change
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Reset bulge animation
      scrollOffset.value = withSpring(0, { damping: 15, stiffness: 150 });

      if (position === 0 && prev) {
        setCurrentBook(prev.book);
        setCurrentChapter(prev.chapter);
        setPosition(prev.book, prev.chapter);
        onPositionChange?.(prev.book, prev.chapter);
        pagerRef.current?.setPageWithoutAnimation(1);
      } else if (position === 2 && next) {
        setCurrentBook(next.book);
        setCurrentChapter(next.chapter);
        setPosition(next.book, next.chapter);
        onPositionChange?.(next.book, next.chapter);
        pagerRef.current?.setPageWithoutAnimation(1);
      }
    },
    [prev, next, setPosition, onPositionChange]
  );

  // Animated style for left edge bulge (appears when swiping right to go back)
  const leftBulgeStyle = useAnimatedStyle(() => {
    const isActive = scrollDirection.value === 'right';
    const bulgeWidth = interpolate(
      scrollOffset.value,
      [0, 0.3, 1],
      [0, BULGE_MAX_WIDTH * 0.8, BULGE_MAX_WIDTH],
      Extrapolation.CLAMP
    );
    const opacity = interpolate(
      scrollOffset.value,
      [0, 0.1, 0.5],
      [0, 0.6, 0.8],
      Extrapolation.CLAMP
    );

    return {
      width: isActive ? bulgeWidth : 0,
      opacity: isActive ? opacity : 0,
    };
  });

  // Animated style for right edge bulge (appears when swiping left to go forward)
  const rightBulgeStyle = useAnimatedStyle(() => {
    const isActive = scrollDirection.value === 'left';
    const bulgeWidth = interpolate(
      scrollOffset.value,
      [0, 0.3, 1],
      [0, BULGE_MAX_WIDTH * 0.8, BULGE_MAX_WIDTH],
      Extrapolation.CLAMP
    );
    const opacity = interpolate(
      scrollOffset.value,
      [0, 0.1, 0.5],
      [0, 0.6, 0.8],
      Extrapolation.CLAMP
    );

    return {
      width: isActive ? bulgeWidth : 0,
      opacity: isActive ? opacity : 0,
    };
  });

  const bulgeColor = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)';

  const ChapterFallback = () => (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size="large" />
    </View>
  );

  return (
    <View style={styles.container}>
      <PagerView
        ref={pagerRef}
        style={styles.pager}
        initialPage={1}
        onPageSelected={handlePageSelected}
        onPageScroll={handlePageScroll}
        offscreenPageLimit={1}
        overdrag={true}
      >
        {/* Page 0: Previous chapter */}
        <View key="prev" style={styles.page}>
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
            <View style={styles.page} />
          )}
        </View>

        {/* Page 1: Current chapter */}
        <View key="current" style={styles.page}>
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
        <View key="next" style={styles.page}>
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
            <View style={styles.page} />
          )}
        </View>
      </PagerView>

      {/* Left edge bulge indicator */}
      <Animated.View
        style={[
          styles.bulgeLeft,
          leftBulgeStyle,
          { backgroundColor: bulgeColor },
        ]}
        pointerEvents="none"
      />

      {/* Right edge bulge indicator */}
      <Animated.View
        style={[
          styles.bulgeRight,
          rightBulgeStyle,
          { backgroundColor: bulgeColor },
        ]}
        pointerEvents="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pager: {
    flex: 1,
  },
  page: {
    flex: 1,
  },
  bulgeLeft: {
    position: 'absolute',
    left: 0,
    top: '30%',
    height: BULGE_HEIGHT,
    borderTopRightRadius: BULGE_MAX_WIDTH,
    borderBottomRightRadius: BULGE_MAX_WIDTH,
  },
  bulgeRight: {
    position: 'absolute',
    right: 0,
    top: '30%',
    height: BULGE_HEIGHT,
    borderTopLeftRadius: BULGE_MAX_WIDTH,
    borderBottomLeftRadius: BULGE_MAX_WIDTH,
  },
});
