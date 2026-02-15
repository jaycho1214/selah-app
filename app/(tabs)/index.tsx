import { BibleNavigator } from "@/components/bible/bible-navigator";
import { BibleReader } from "@/components/bible/bible-reader";
import { TranslationSelector } from "@/components/bible/translation-selector";
import { VerseActions } from "@/components/bible/verse-actions";
import { Text } from "@/components/ui/text";
import { useColors } from "@/hooks/use-colors";
import { BIBLE_BOOK_DETAILS } from "@/lib/bible/constants";
import type { BibleBook } from "@/lib/bible/types";
import { useBibleStore } from "@/lib/stores/bible-store";
import { useVerseSelectionStore } from "@/lib/stores/verse-selection-store";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Pressable,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const hasGlass = isLiquidGlassAvailable();

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const themeColors = useColors();

  const currentBook = useBibleStore((s) => s.currentBook);
  const currentChapter = useBibleStore((s) => s.currentChapter);
  const currentTranslation = useBibleStore((s) => s.currentTranslation);
  const setPosition = useBibleStore((s) => s.setPosition);
  const scrollToVerse = useBibleStore((s) => s.scrollToVerse);
  const isSelecting = useVerseSelectionStore((s) => s.isSelecting);
  const toggleVerse = useVerseSelectionStore((s) => s.toggleVerse);
  const clearSelection = useVerseSelectionStore((s) => s.clearSelection);

  const [navigatorVisible, setNavigatorVisible] = useState(false);
  const [translationSelectorVisible, setTranslationSelectorVisible] =
    useState(false);

  // Key to force BibleReader remount on position change
  const [readerKey, setReaderKey] = useState(0);

  // When search navigates here with a scrollToVerse, force reader remount
  useEffect(() => {
    if (scrollToVerse != null) {
      setReaderKey((k) => k + 1);
    }
  }, [scrollToVerse]);

  const handlePositionChange = useCallback(
    (book: BibleBook, chapter: number) => {
      setPosition(book, chapter);
      clearSelection();
    },
    [setPosition, clearSelection],
  );

  const handleNavigatorSelect = useCallback(
    (book: BibleBook, chapter: number) => {
      setPosition(book, chapter);
      setNavigatorVisible(false);
      setReaderKey((k) => k + 1);
      clearSelection();
    },
    [setPosition, clearSelection],
  );

  // Tap verse -> navigate to verse page
  const handleVersePress = useCallback(
    (verseId: string, verseText?: string) => {
      router.push({
        pathname: "/verse/[id]",
        params: { id: verseId },
      });
    },
    [router],
  );

  // Long press verse -> toggle selection
  const handleVerseLongPress = useCallback(
    (
      verseId: string,
      verseText: string,
      book: BibleBook,
      chapter: number,
      verseNumber: number,
    ) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      toggleVerse({ id: verseId, text: verseText, book, chapter, verseNumber });
    },
    [toggleVerse],
  );

  const bookDetails = BIBLE_BOOK_DETAILS[currentBook as BibleBook];
  const bookName = bookDetails?.name ?? currentBook;

  const colors = useMemo(
    () => ({
      pillBg: themeColors.surface,
      pillBorder: themeColors.border,
      pillShadow: isDark ? "#000000" : themeColors.textMuted,
      bookText: themeColors.text,
      chapterText: themeColors.accent,
      translationText: themeColors.textMuted,
    }),
    [themeColors, isDark],
  );

  return (
    <View style={[styles.container, { backgroundColor: themeColors.bg }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Immersive Bible reader */}
      <View style={styles.readerContainer}>
        <BibleReader
          key={`${readerKey}-${currentTranslation}`}
          initialBook={currentBook as BibleBook}
          initialChapter={currentChapter}
          scrollToVerse={scrollToVerse}
          onPositionChange={handlePositionChange}
          onVersePress={handleVersePress}
          onVerseLongPress={handleVerseLongPress}
        />
      </View>

      {/* Floating navigator pill - hidden during selection */}
      {!isSelecting && (
        <View style={[styles.pillContainer, { bottom: insets.bottom + 60 }]}>
          <GlassView
            glassEffectStyle="regular"
            isInteractive
            style={[
              styles.floatingPill,
              {
                backgroundColor: hasGlass ? "transparent" : colors.pillBg,
                borderColor: hasGlass ? "transparent" : colors.pillBorder,
                shadowColor: colors.pillShadow,
              },
            ]}
          >
            <Pressable
              onPress={() => setNavigatorVisible(true)}
              style={styles.pillPressable}
            >
              <Text style={[styles.bookName, { color: colors.bookText }]}>
                {bookName}
              </Text>
              <View
                style={[
                  styles.separator,
                  { backgroundColor: colors.pillBorder },
                ]}
              />
              <Text
                style={[styles.chapterNumber, { color: colors.chapterText }]}
              >
                {currentChapter}
              </Text>
              <Pressable
                onPress={() => setTranslationSelectorVisible(true)}
                style={[
                  styles.translationBadge,
                  { backgroundColor: themeColors.surfaceElevated },
                ]}
                hitSlop={8}
              >
                <Text
                  style={[
                    styles.translationText,
                    { color: colors.translationText },
                  ]}
                >
                  {currentTranslation}
                </Text>
              </Pressable>
            </Pressable>
          </GlassView>
        </View>
      )}

      {/* Book/chapter picker modal */}
      <BibleNavigator
        currentBook={currentBook as BibleBook}
        currentChapter={currentChapter}
        onSelect={handleNavigatorSelect}
        visible={navigatorVisible}
        onClose={() => setNavigatorVisible(false)}
      />

      {/* Verse actions (floating toolbar + compare sheet) */}
      <VerseActions />

      {/* Translation selector */}
      <TranslationSelector
        visible={translationSelectorVisible}
        onClose={() => setTranslationSelectorVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  readerContainer: {
    flex: 1,
  },
  pillContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  floatingPill: {
    borderRadius: 24,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
    overflow: "hidden",
  },
  pillPressable: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingLeft: 16,
    paddingRight: 10,
    gap: 10,
  },
  bookName: {
    fontSize: 15,
    fontWeight: "500",
    letterSpacing: 0.2,
  },
  separator: {
    width: 1,
    height: 16,
    opacity: 0.5,
  },
  chapterNumber: {
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: -0.3,
    fontVariant: ["tabular-nums"],
  },
  translationBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  translationText: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
});
