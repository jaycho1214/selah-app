import { useRef, useCallback, useState } from 'react';
import { View, ActivityIndicator, Dimensions, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PagerView, { PagerViewOnPageScrollEvent } from 'react-native-pager-view';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withSpring,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { Suspense } from 'react';
import { ChapterView } from './chapter-view';
import { useBibleStore } from '@/lib/stores/bible-store';
import { BIBLE_BOOKS, BIBLE_BOOK_DETAILS } from '@/lib/bible/constants';
import { BibleBook } from '@/lib/bible/types';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const BULGE_MAX_WIDTH = 16; // Narrower bulge
const BULGE_HEIGHT = SCREEN_HEIGHT * 0.3; // Height of the bell curve

const AnimatedPath = Animated.createAnimatedComponent(Path);

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
  const insets = useSafeAreaInsets();
  const { setPosition } = useBibleStore();

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
      // When dragging RIGHT-to-LEFT (going forward/next), progress goes 1 -> 2
      // The bulge should appear on the RIGHT edge (where finger started)
      if (progress < 1) {
        // Scrolling towards previous - finger dragging left-to-right
        // Bulge appears on LEFT edge
        scrollDirection.value = 'left';
        scrollOffset.value = 1 - progress;
      } else if (progress > 1) {
        // Scrolling towards next - finger dragging right-to-left
        // Bulge appears on RIGHT edge
        scrollDirection.value = 'right';
        scrollOffset.value = progress - 1;
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

      // Reset bulge with sticky spring physics - snaps back with slight overshoot
      scrollOffset.value = withSpring(0, {
        damping: 12,
        stiffness: 180,
        mass: 0.5,
      });

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

  // Animated style for left edge bulge container
  const leftBulgeStyle = useAnimatedStyle(() => {
    const isActive = scrollDirection.value === 'left';
    // Quick fade in, follows finger directly
    const opacity = isActive
      ? interpolate(scrollOffset.value, [0, 0.02], [0, 1], Extrapolation.CLAMP)
      : 0;

    return { opacity };
  });

  // Animated props for left bulge SVG path (bell curve with expanding center)
  const leftBulgePathProps = useAnimatedProps(() => {
    // Direct mapping - bulge follows finger more closely
    // Use cubic easing for more natural "sticky" feel at the start
    const progress = Math.min(scrollOffset.value * 1.5, 1); // Amplify slightly
    const easedProgress = progress * progress * (3 - 2 * progress); // Smoothstep easing

    const bulgeWidth = easedProgress * BULGE_MAX_WIDTH;

    // Bell curve: use cubic bezier for smoother bell shape
    // The center point moves out as you scroll more
    const centerY = BULGE_HEIGHT / 2;

    // Bell curve on left edge using cubic bezier for smoother shape
    // Control points create the bell shape with expanding center
    const cp1y = centerY * 0.3; // Upper control point
    const cp2y = centerY * 1.7; // Lower control point
    const path = `M 0,0 C ${bulgeWidth * 0.2},${cp1y} ${bulgeWidth},${centerY * 0.5} ${bulgeWidth},${centerY} C ${bulgeWidth},${centerY * 1.5} ${bulgeWidth * 0.2},${cp2y} 0,${BULGE_HEIGHT}`;

    return { d: path };
  });

  // Animated style for right edge bulge container
  const rightBulgeStyle = useAnimatedStyle(() => {
    const isActive = scrollDirection.value === 'right';
    const opacity = isActive
      ? interpolate(scrollOffset.value, [0, 0.02], [0, 1], Extrapolation.CLAMP)
      : 0;

    return { opacity };
  });

  // Animated props for right bulge SVG path (bell curve with expanding center)
  const rightBulgePathProps = useAnimatedProps(() => {
    const progress = Math.min(scrollOffset.value * 1.5, 1);
    const easedProgress = progress * progress * (3 - 2 * progress);

    const bulgeWidth = easedProgress * BULGE_MAX_WIDTH;
    const centerY = BULGE_HEIGHT / 2;

    // Bell curve on right edge using cubic bezier
    const cp1y = centerY * 0.3;
    const cp2y = centerY * 1.7;
    const startX = BULGE_MAX_WIDTH;
    const apexX = startX - bulgeWidth;
    const path = `M ${startX},0 C ${startX - bulgeWidth * 0.2},${cp1y} ${apexX},${centerY * 0.5} ${apexX},${centerY} C ${apexX},${centerY * 1.5} ${startX - bulgeWidth * 0.2},${cp2y} ${startX},${BULGE_HEIGHT}`;

    return { d: path };
  });

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
                topInset={insets.top}
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
              topInset={insets.top}
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
                topInset={insets.top}
                onVersePress={onVersePress}
                onVerseLongPress={onVerseLongPress}
              />
            </Suspense>
          ) : (
            <View style={styles.page} />
          )}
        </View>
      </PagerView>

      {/* Left edge bulge indicator - bell curve */}
      <Animated.View style={[styles.bulgeLeft, leftBulgeStyle]} pointerEvents="none">
        <Svg width={BULGE_MAX_WIDTH} height={BULGE_HEIGHT}>
          <AnimatedPath animatedProps={leftBulgePathProps} fill="#000" />
        </Svg>
      </Animated.View>

      {/* Right edge bulge indicator - bell curve */}
      <Animated.View style={[styles.bulgeRight, rightBulgeStyle]} pointerEvents="none">
        <Svg width={BULGE_MAX_WIDTH} height={BULGE_HEIGHT}>
          <AnimatedPath animatedProps={rightBulgePathProps} fill="#000" />
        </Svg>
      </Animated.View>
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
    top: '32.5%',
    width: BULGE_MAX_WIDTH,
    height: BULGE_HEIGHT,
  },
  bulgeRight: {
    position: 'absolute',
    right: 0,
    top: '32.5%',
    width: BULGE_MAX_WIDTH,
    height: BULGE_HEIGHT,
  },
});
