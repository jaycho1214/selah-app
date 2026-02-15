import { Text } from "@/components/ui/text";
import { BIBLE_BOOK_DETAILS } from "@/lib/bible/constants";
import { BibleBook } from "@/lib/bible/types";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import * as Haptics from "expo-haptics";
import { ChevronLeft } from "lucide-react-native";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  Pressable,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

// Book categories for visual grouping
const OT_SECTIONS: { title: string; books: BibleBook[] }[] = [
  {
    title: "Law",
    books: [
      "GENESIS",
      "EXODUS",
      "LEVITICUS",
      "NUMBERS",
      "DEUTERONOMY",
    ] as BibleBook[],
  },
  {
    title: "History",
    books: [
      "JOSHUA",
      "JUDGES",
      "RUTH",
      "FIRST_SAMUEL",
      "SECOND_SAMUEL",
      "FIRST_KINGS",
      "SECOND_KINGS",
      "FIRST_CHRONICLES",
      "SECOND_CHRONICLES",
      "EZRA",
      "NEHEMIAH",
      "ESTHER",
    ] as BibleBook[],
  },
  {
    title: "Poetry",
    books: [
      "JOB",
      "PSALMS",
      "PROVERBS",
      "ECCLESIASTES",
      "SONG_OF_SONGS",
    ] as BibleBook[],
  },
  {
    title: "Major Prophets",
    books: [
      "ISAIAH",
      "JEREMIAH",
      "LAMENTATIONS",
      "EZEKIEL",
      "DANIEL",
    ] as BibleBook[],
  },
  {
    title: "Minor Prophets",
    books: [
      "HOSEA",
      "JOEL",
      "AMOS",
      "OBADIAH",
      "JONAH",
      "MICAH",
      "NAHUM",
      "HABAKKUK",
      "ZEPHANIAH",
      "HAGGAI",
      "ZECHARIAH",
      "MALACHI",
    ] as BibleBook[],
  },
];

const NT_SECTIONS: { title: string; books: BibleBook[] }[] = [
  {
    title: "Gospels",
    books: ["MATTHEW", "MARK", "LUKE", "JOHN"] as BibleBook[],
  },
  {
    title: "History",
    books: ["ACTS"] as BibleBook[],
  },
  {
    title: "Paul's Letters",
    books: [
      "ROMANS",
      "FIRST_CORINTHIANS",
      "SECOND_CORINTHIANS",
      "GALATIANS",
      "EPHESIANS",
      "PHILIPPIANS",
      "COLOSSIANS",
      "FIRST_THESSALONIANS",
      "SECOND_THESSALONIANS",
      "FIRST_TIMOTHY",
      "SECOND_TIMOTHY",
      "TITUS",
      "PHILEMON",
    ] as BibleBook[],
  },
  {
    title: "General Letters",
    books: [
      "HEBREWS",
      "JAMES",
      "FIRST_PETER",
      "SECOND_PETER",
      "FIRST_JOHN",
      "SECOND_JOHN",
      "THIRD_JOHN",
      "JUDE",
    ] as BibleBook[],
  },
  {
    title: "Prophecy",
    books: ["REVELATION"] as BibleBook[],
  },
];

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const CHAPTER_GRID_COLUMNS = 6;
const CHAPTER_GAP = 10;
const CHAPTER_ITEM_SIZE =
  (SCREEN_WIDTH - 40 - (CHAPTER_GRID_COLUMNS - 1) * CHAPTER_GAP) /
  CHAPTER_GRID_COLUMNS;

interface BibleNavigatorProps {
  currentBook: BibleBook;
  currentChapter: number;
  onSelect: (book: BibleBook, chapter: number) => void;
  visible: boolean;
  onClose: () => void;
}

export const BibleNavigator = memo(function BibleNavigator({
  currentBook,
  currentChapter,
  onSelect,
  visible,
  onClose,
}: BibleNavigatorProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const hasGlass = isLiquidGlassAvailable();

  const [selectedBook, setSelectedBook] = useState<BibleBook | null>(null);
  const [testament, setTestament] = useState<"old" | "new">("old");
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [visible]);

  const sections = useMemo(
    () => (testament === "old" ? OT_SECTIONS : NT_SECTIONS),
    [testament],
  );

  const bookDetails = useMemo(
    () => (selectedBook ? BIBLE_BOOK_DETAILS[selectedBook] : null),
    [selectedBook],
  );

  const chapters = useMemo(
    () =>
      bookDetails
        ? Array.from({ length: bookDetails.chapters }, (_, i) => i + 1)
        : [],
    [bookDetails],
  );

  const handleDismiss = useCallback(() => {
    setSelectedBook(null);
    onClose();
  }, [onClose]);

  const handleBookSelect = useCallback((book: BibleBook) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedBook(book);
  }, []);

  const handleChapterSelect = useCallback(
    (chapter: number) => {
      if (selectedBook) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onSelect(selectedBook, chapter);
        setSelectedBook(null);
        onClose();
      }
    },
    [selectedBook, onSelect, onClose],
  );

  const handleBack = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedBook(null);
  }, []);

  const handleTestamentToggle = useCallback(
    (newTestament: "old" | "new") => {
      if (newTestament !== testament) {
        Haptics.selectionAsync();
        setTestament(newTestament);
      }
    },
    [testament],
  );

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    [],
  );

  // Colors - warm parchment palette
  const colors = isDark
    ? {
        bg: "#0c0a09",
        surface: "#1c1917",
        surfaceElevated: "#292524",
        border: "#292524",
        text: "#fafaf9",
        textMuted: "#a8a29e",
        textSubtle: "#78716c",
        accent: "#d6bcab",
        handle: "#44403c",
        currentBg: "#292524",
        currentBorder: "#d6bcab",
      }
    : {
        bg: "#fdfcfb",
        surface: "#f5f4f3",
        surfaceElevated: "#ffffff",
        border: "#e7e5e4",
        text: "#1c1917",
        textMuted: "#57534e",
        textSubtle: "#a8a29e",
        accent: "#8b7355",
        handle: "#d6d3d1",
        currentBg: "#f5f0eb",
        currentBorder: "#8b7355",
      };

  const renderBackground = useCallback(
    ({ style }: any) => (
      <GlassView
        style={[
          style,
          {
            backgroundColor: isLiquidGlassAvailable()
              ? "transparent"
              : colors.bg,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            overflow: "hidden",
          },
        ]}
        glassEffectStyle="regular"
      />
    ),
    [colors.bg],
  );

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      enableDynamicSizing
      maxDynamicContentSize={SCREEN_HEIGHT * 0.9}
      onDismiss={handleDismiss}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundComponent={renderBackground}
      backgroundStyle={{
        backgroundColor: colors.bg,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
      }}
      handleIndicatorStyle={{
        backgroundColor: hasGlass
          ? isDark
            ? "rgba(255,255,255,0.5)"
            : "rgba(0,0,0,0.3)"
          : colors.handle,
        width: 40,
        height: 5,
        marginTop: 10,
      }}
    >
      {selectedBook && bookDetails ? (
        // Chapter Selection View - uses BottomSheetView for proper dynamic sizing
        <BottomSheetView style={styles.chapterContainer}>
          {/* Header with back button */}
          <View style={styles.chapterHeader}>
            <Pressable
              onPress={handleBack}
              style={styles.backButton}
              hitSlop={12}
            >
              <ChevronLeft size={24} color={colors.accent} />
            </Pressable>
            <View style={styles.chapterHeaderInfo}>
              <Text style={[styles.chapterHeaderTitle, { color: colors.text }]}>
                {bookDetails.name}
              </Text>
              <Text
                style={[
                  styles.chapterHeaderSubtitle,
                  { color: colors.textSubtle },
                ]}
              >
                {bookDetails.chapters} chapters
              </Text>
            </View>
          </View>

          {/* Chapter Grid */}
          <View style={styles.chapterGrid}>
            {chapters.map((chapter) => {
              const isCurrent =
                selectedBook === currentBook && chapter === currentChapter;
              return (
                <Pressable
                  key={chapter}
                  onPress={() => handleChapterSelect(chapter)}
                  style={[
                    styles.chapterItem,
                    {
                      backgroundColor: isCurrent
                        ? colors.currentBg
                        : colors.surface,
                      borderColor: isCurrent
                        ? colors.currentBorder
                        : "transparent",
                      borderWidth: isCurrent ? 1.5 : 0,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.chapterNumber,
                      {
                        color: isCurrent ? colors.accent : colors.text,
                        fontWeight: isCurrent ? "700" : "500",
                      },
                    ]}
                  >
                    {chapter}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </BottomSheetView>
      ) : (
        // Book Selection View
        <BottomSheetScrollView
          contentContainerStyle={styles.bookScrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Testament Tabs - simple text tabs, no sliding indicator */}
          <View style={styles.testamentTabs}>
            <Pressable
              onPress={() => handleTestamentToggle("old")}
              style={[
                styles.testamentTab,
                testament === "old" && { backgroundColor: colors.surface },
              ]}
            >
              <Text
                style={[
                  styles.testamentTabText,
                  {
                    color:
                      testament === "old" ? colors.text : colors.textSubtle,
                  },
                ]}
              >
                Old Testament
              </Text>
            </Pressable>
            <Pressable
              onPress={() => handleTestamentToggle("new")}
              style={[
                styles.testamentTab,
                testament === "new" && { backgroundColor: colors.surface },
              ]}
            >
              <Text
                style={[
                  styles.testamentTabText,
                  {
                    color:
                      testament === "new" ? colors.text : colors.textSubtle,
                  },
                ]}
              >
                New Testament
              </Text>
            </Pressable>
          </View>

          {/* Book List - Sectioned horizontal flow */}
          <View style={styles.bookSections}>
            {sections.map((section, sectionIndex) => (
              <Animated.View
                key={section.title}
                entering={FadeIn.delay(Math.min(sectionIndex, 8) * 50).duration(
                  200,
                )}
                style={styles.bookSection}
              >
                {/* Section Header */}
                <Text
                  style={[styles.sectionTitle, { color: colors.textSubtle }]}
                >
                  {section.title}
                </Text>

                {/* Horizontal Book Flow */}
                <View style={styles.bookFlow}>
                  {section.books.map((book) => {
                    const isCurrent = book === currentBook;
                    const details = BIBLE_BOOK_DETAILS[book];
                    return (
                      <Pressable
                        key={book}
                        onPress={() => handleBookSelect(book)}
                        hitSlop={6}
                        style={[
                          styles.bookItem,
                          isCurrent && {
                            backgroundColor: isDark ? "#292524" : "#f5f0eb",
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.bookName,
                            {
                              color: isCurrent ? colors.accent : colors.text,
                              fontWeight: isCurrent ? "600" : "400",
                            },
                          ]}
                        >
                          {details.name}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </Animated.View>
            ))}
          </View>
        </BottomSheetScrollView>
      )}
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  // Testament Tabs
  testamentTabs: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 4,
    marginBottom: 8,
    gap: 8,
  },
  testamentTab: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  testamentTabText: {
    fontSize: 14,
    fontWeight: "600",
  },
  // Book Sections
  bookScrollContent: {
    paddingBottom: 40,
  },
  bookSections: {
    paddingHorizontal: 20,
    gap: 20,
  },
  bookSection: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  bookFlow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    rowGap: 4,
  },
  bookItem: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  bookName: {
    fontSize: 16,
  },
  // Chapter View
  chapterContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  chapterHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 12,
  },
  backButton: {
    padding: 4,
    marginLeft: -4,
  },
  chapterHeaderInfo: {
    flex: 1,
  },
  chapterHeaderTitle: {
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  chapterHeaderSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  chapterGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: CHAPTER_GAP,
  },
  chapterItem: {
    width: CHAPTER_ITEM_SIZE,
    height: CHAPTER_ITEM_SIZE,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  chapterNumber: {
    fontSize: 16,
    letterSpacing: -0.3,
    fontVariant: ["tabular-nums"],
  },
});
