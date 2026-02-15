import { memo, useCallback, useEffect, useRef, useState } from "react";
import { View, StyleSheet, Dimensions, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import * as Haptics from "expo-haptics";
import { Suspense } from "react";
import { ErrorBoundary } from "@/components/error-boundary";
import { ChapterView } from "./chapter-view";
import { ChapterSkeleton } from "./chapter-skeleton";
import { useBibleStore } from "@/lib/stores/bible-store";
import { BIBLE_BOOKS, BIBLE_BOOK_DETAILS } from "@/lib/bible/constants";
import { BibleBook } from "@/lib/bible/types";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.14; // ~40% finger drag with resistance
const RESISTANCE = 0.35; // Sticky resistance (lower = stickier)

const BULGE_MAX_WIDTH = 24; // Wider bulge (horizontal protrusion)
const BULGE_HEIGHT = 120; // Vertical height of bell

const AnimatedPath = Animated.createAnimatedComponent(Path);

// Sticky spring - low damping for jelly wobble
const STICKY_SPRING = {
  damping: 12,
  stiffness: 100,
  mass: 0.8,
};

interface BibleReaderProps {
  initialBook: BibleBook;
  initialChapter: number;
  scrollToVerse?: number | null;
  onPositionChange?: (book: BibleBook, chapter: number) => void;
  onVersePress?: (verseId: string, verseText?: string) => void;
  onVerseLongPress?: (
    verseId: string,
    verseText: string,
    book: BibleBook,
    chapter: number,
    verseNumber: number,
  ) => void;
}

export const BibleReader = memo(function BibleReader({
  initialBook,
  initialChapter,
  scrollToVerse,
  onPositionChange,
  onVersePress,
  onVerseLongPress,
}: BibleReaderProps) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const setPosition = useBibleStore((s) => s.setPosition);

  // Timer ref for transition cleanup
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    },
    [],
  );

  // Page position (0 = current, negative = going to prev, positive = going to next)
  const translateX = useSharedValue(0);
  const fingerY = useSharedValue(300);
  const isDragging = useSharedValue(false);

  const [currentBook, setCurrentBook] = useState(initialBook);
  const [currentChapter, setCurrentChapter] = useState(initialChapter);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const maxChapters = BIBLE_BOOK_DETAILS[currentBook].chapters;
  const bookIndex = BIBLE_BOOKS.indexOf(currentBook);

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

  const triggerHaptic = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, []);

  const goToPrev = useCallback(() => {
    if (prev) {
      setIsTransitioning(true);
      setCurrentBook(prev.book);
      setCurrentChapter(prev.chapter);
      setPosition(prev.book, prev.chapter);
      onPositionChange?.(prev.book, prev.chapter);
      // Brief delay to let new content load
      transitionTimerRef.current = setTimeout(
        () => setIsTransitioning(false),
        100,
      );
    }
  }, [prev, setPosition, onPositionChange]);

  const goToNext = useCallback(() => {
    if (next) {
      setIsTransitioning(true);
      setCurrentBook(next.book);
      setCurrentChapter(next.chapter);
      setPosition(next.book, next.chapter);
      onPositionChange?.(next.book, next.chapter);
      transitionTimerRef.current = setTimeout(
        () => setIsTransitioning(false),
        100,
      );
    }
  }, [next, setPosition, onPositionChange]);

  // Pan gesture with sticky resistance
  const panGesture = Gesture.Pan()
    .onStart((e) => {
      isDragging.value = true;
      fingerY.value = e.absoluteY;
    })
    .onUpdate((e) => {
      fingerY.value = e.absoluteY;

      // Apply resistance - movement is slower than finger (sticky feel)
      let newX = e.translationX * RESISTANCE;

      // Extra resistance at boundaries
      if ((newX > 0 && !prev) || (newX < 0 && !next)) {
        newX = newX * 0.3; // Even more resistance at edges
      }

      translateX.value = newX;
    })
    .onEnd((e) => {
      isDragging.value = false;

      const shouldGoNext = translateX.value < -SWIPE_THRESHOLD && next;
      const shouldGoPrev = translateX.value > SWIPE_THRESHOLD && prev;

      if (shouldGoNext) {
        // Change page immediately, animate reset
        runOnJS(triggerHaptic)();
        runOnJS(goToNext)();
        translateX.value = withSpring(0, STICKY_SPRING);
      } else if (shouldGoPrev) {
        runOnJS(triggerHaptic)();
        runOnJS(goToPrev)();
        translateX.value = withSpring(0, STICKY_SPRING);
      } else {
        // Snap back with jelly wobble
        translateX.value = withSpring(0, {
          damping: 8,
          stiffness: 150,
          mass: 0.6,
        });
      }
    });

  // Animated style for page with sticky movement
  const pageStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  // Left bulge (when dragging right)
  const leftBulgeStyle = useAnimatedStyle(() => {
    const isActive = translateX.value > 5;
    return {
      opacity: isActive ? 1 : 0,
      transform: [{ translateY: fingerY.value - BULGE_HEIGHT / 2 }],
    };
  });

  const leftBulgePathProps = useAnimatedProps(() => {
    const progress = Math.min(
      Math.abs(translateX.value) / (SCREEN_WIDTH * 0.3),
      1,
    );
    const apex = progress * BULGE_MAX_WIDTH;
    const h = BULGE_HEIGHT;
    const path = `M 0,0 C ${apex * 0.1},${h * 0.2} ${apex},${h * 0.35} ${apex},${h * 0.5} C ${apex},${h * 0.65} ${apex * 0.1},${h * 0.8} 0,${h}`;
    return { d: path };
  });

  // Right bulge (when dragging left)
  const rightBulgeStyle = useAnimatedStyle(() => {
    const isActive = translateX.value < -5;
    return {
      opacity: isActive ? 1 : 0,
      transform: [{ translateY: fingerY.value - BULGE_HEIGHT / 2 }],
    };
  });

  const rightBulgePathProps = useAnimatedProps(() => {
    const progress = Math.min(
      Math.abs(translateX.value) / (SCREEN_WIDTH * 0.3),
      1,
    );
    const apex = progress * BULGE_MAX_WIDTH;
    const h = BULGE_HEIGHT;
    const w = BULGE_MAX_WIDTH;
    const path = `M ${w},0 C ${w - apex * 0.1},${h * 0.2} ${w - apex},${h * 0.35} ${w - apex},${h * 0.5} C ${w - apex},${h * 0.65} ${w - apex * 0.1},${h * 0.8} ${w},${h}`;
    return { d: path };
  });

  const ChapterFallback = () => <ChapterSkeleton topInset={insets.top} />;

  return (
    <View style={styles.container}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.page, pageStyle]}>
          {isTransitioning ? (
            <ChapterFallback />
          ) : (
            <ErrorBoundary>
              <Suspense fallback={<ChapterFallback />}>
                <ChapterView
                  book={currentBook}
                  chapter={currentChapter}
                  topInset={insets.top}
                  scrollToVerse={scrollToVerse}
                  onVersePress={onVersePress}
                  onVerseLongPress={onVerseLongPress}
                />
              </Suspense>
            </ErrorBoundary>
          )}
        </Animated.View>
      </GestureDetector>

      {/* Left edge bulge */}
      <Animated.View
        style={[styles.bulgeLeft, leftBulgeStyle]}
        pointerEvents="none"
      >
        <Svg width={BULGE_MAX_WIDTH} height={BULGE_HEIGHT}>
          <AnimatedPath
            animatedProps={leftBulgePathProps}
            fill="#000"
            stroke={isDark ? "rgba(255,255,255,0.15)" : undefined}
            strokeWidth={isDark ? 1 : 0}
          />
        </Svg>
      </Animated.View>

      {/* Right edge bulge */}
      <Animated.View
        style={[styles.bulgeRight, rightBulgeStyle]}
        pointerEvents="none"
      >
        <Svg width={BULGE_MAX_WIDTH} height={BULGE_HEIGHT}>
          <AnimatedPath
            animatedProps={rightBulgePathProps}
            fill="#000"
            stroke={isDark ? "rgba(255,255,255,0.15)" : undefined}
            strokeWidth={isDark ? 1 : 0}
          />
        </Svg>
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },
  page: {
    flex: 1,
  },
  bulgeLeft: {
    position: "absolute",
    left: 0,
    top: 0,
    width: BULGE_MAX_WIDTH,
    height: BULGE_HEIGHT,
  },
  bulgeRight: {
    position: "absolute",
    right: 0,
    top: 0,
    width: BULGE_MAX_WIDTH,
    height: BULGE_HEIGHT,
  },
});
