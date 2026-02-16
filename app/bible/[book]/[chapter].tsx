import { useState, useCallback, useEffect, useRef } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useLocalSearchParams, router, Stack } from "expo-router";
import { Search, Settings } from "lucide-react-native";
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import * as Haptics from "expo-haptics";
import { BibleReader } from "@/components/bible/bible-reader";
import { BibleNavigator } from "@/components/bible/bible-navigator";
import { VerseActions } from "@/components/bible/verse-actions";
import { FontSizePicker } from "@/components/bible/font-size-picker";
import { TranslationPicker } from "@/components/bible/translation-picker";
import { BIBLE_BOOK_DETAILS } from "@/lib/bible/constants";
import { useBibleStore } from "@/lib/stores/bible-store";
import { useVerseSelectionStore } from "@/lib/stores/verse-selection-store";
import { useColors } from "@/hooks/use-colors";
import { useAnalytics } from "@/lib/analytics";
import {
  IS_LIQUID_GLASS,
  useTransparentHeaderPadding,
} from "@/hooks/use-transparent-header";
import { CommonStyles } from "@/constants/styles";
import { BibleBook } from "@/lib/bible/types";

export default function BibleChapterScreen() {
  const colors = useColors();
  const contentPaddingTop = useTransparentHeaderPadding();
  const { book, chapter } = useLocalSearchParams<{
    book: string;
    chapter: string;
  }>();
  const { capture } = useAnalytics();
  const currentTranslation = useBibleStore((s) => s.currentTranslation);
  const setPosition = useBibleStore((s) => s.setPosition);
  const toggleVerse = useVerseSelectionStore((s) => s.toggleVerse);
  const clearSelection = useVerseSelectionStore((s) => s.clearSelection);

  const [navigatorVisible, setNavigatorVisible] = useState(false);
  const settingsSheetRef = useRef<BottomSheet>(null);
  const [settingsTab, setSettingsTab] = useState<"font" | "translation">(
    "font",
  );

  const [currentBook, setCurrentBook] = useState<BibleBook>(book as BibleBook);
  const [currentChapter, setCurrentChapter] = useState(parseInt(chapter, 10));

  useEffect(() => {
    setCurrentBook(book as BibleBook);
    setCurrentChapter(parseInt(chapter, 10));
    capture("chapter_viewed", {
      book: book as string,
      chapter: parseInt(chapter, 10),
      translation: currentTranslation,
    });
  }, [book, chapter, capture, currentTranslation]);

  const bookDetails = BIBLE_BOOK_DETAILS[currentBook];
  const bookName = bookDetails?.name ?? book;

  const handlePositionChange = useCallback(
    (newBook: BibleBook, newChapter: number) => {
      setCurrentBook(newBook);
      setCurrentChapter(newChapter);
      router.setParams({ book: newBook, chapter: String(newChapter) });
      clearSelection();
    },
    [clearSelection],
  );

  const handleNavigatorSelect = useCallback(
    (selectedBook: BibleBook, selectedChapter: number) => {
      setCurrentBook(selectedBook);
      setCurrentChapter(selectedChapter);
      setPosition(selectedBook, selectedChapter);
      router.setParams({
        book: selectedBook,
        chapter: String(selectedChapter),
      });
      clearSelection();
    },
    [setPosition, clearSelection],
  );

  const handleVersePress = useCallback(
    (verseId: string, verseText?: string) => {
      router.push({
        pathname: "/verse/[id]",
        params: { id: verseId },
      });
    },
    [],
  );

  const handleVerseLongPress = useCallback(
    (
      verseId: string,
      verseText: string,
      pressedBook: BibleBook,
      pressedChapter: number,
      verseNumber: number,
    ) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      toggleVerse({
        id: verseId,
        text: verseText,
        book: pressedBook,
        chapter: pressedChapter,
        verseNumber,
      });
    },
    [toggleVerse],
  );

  return (
    <View
      style={[
        CommonStyles.flex1,
        { backgroundColor: colors.bg, paddingTop: contentPaddingTop },
      ]}
    >
      <Stack.Screen
        options={{
          headerShown: true,
          headerTransparent: IS_LIQUID_GLASS,
          headerStyle: {
            backgroundColor: IS_LIQUID_GLASS ? "transparent" : colors.bg,
          },
          headerShadowVisible: false,
          headerTitle: () => (
            <Pressable onPress={() => setNavigatorVisible(true)}>
              <View style={styles.headerTitleContainer}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>
                  {bookName} {currentChapter}
                </Text>
                <Text
                  style={[
                    styles.headerSubtitle,
                    { color: colors.mutedForeground },
                  ]}
                >
                  {currentTranslation}
                </Text>
              </View>
            </Pressable>
          ),
          headerRight: () => (
            <View style={CommonStyles.row}>
              <Pressable
                onPress={() => router.push("/search")}
                style={styles.headerButton}
              >
                <Search size={22} color={colors.text} />
              </Pressable>
              <Pressable
                onPress={() => settingsSheetRef.current?.expand()}
                style={styles.headerButton}
              >
                <Settings size={22} color={colors.text} />
              </Pressable>
            </View>
          ),
        }}
      />

      <BibleReader
        key={`${currentBook}-${currentChapter}`}
        initialBook={currentBook}
        initialChapter={currentChapter}
        onPositionChange={handlePositionChange}
        onVersePress={handleVersePress}
        onVerseLongPress={handleVerseLongPress}
      />

      <BibleNavigator
        currentBook={currentBook}
        currentChapter={currentChapter}
        onSelect={handleNavigatorSelect}
        visible={navigatorVisible}
        onClose={() => setNavigatorVisible(false)}
      />

      <VerseActions />

      {/* Settings bottom sheet */}
      <BottomSheet
        ref={settingsSheetRef}
        index={-1}
        snapPoints={["50%"]}
        enablePanDownToClose
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
          />
        )}
      >
        <BottomSheetView>
          <View style={[styles.tabBar, { borderBottomColor: colors.border }]}>
            <Pressable
              onPress={() => setSettingsTab("font")}
              style={[
                styles.tab,
                settingsTab === "font" && {
                  borderBottomWidth: 2,
                  borderBottomColor: colors.primary,
                },
              ]}
            >
              <Text
                style={
                  settingsTab === "font"
                    ? [styles.tabTextActive, { color: colors.primary }]
                    : [styles.tabText, { color: colors.mutedForeground }]
                }
              >
                Font Size
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setSettingsTab("translation")}
              style={[
                styles.tab,
                settingsTab === "translation" && {
                  borderBottomWidth: 2,
                  borderBottomColor: colors.primary,
                },
              ]}
            >
              <Text
                style={
                  settingsTab === "translation"
                    ? [styles.tabTextActive, { color: colors.primary }]
                    : [styles.tabText, { color: colors.mutedForeground }]
                }
              >
                Translation
              </Text>
            </Pressable>
          </View>

          {settingsTab === "font" ? (
            <FontSizePicker onClose={() => settingsSheetRef.current?.close()} />
          ) : (
            <TranslationPicker
              onClose={() => settingsSheetRef.current?.close()}
            />
          )}
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  headerTitleContainer: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  headerSubtitle: {
    fontSize: 12,
  },
  headerButton: {
    padding: 8,
  },
  tabBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  tabTextActive: {
    fontWeight: "500",
  },
  tabText: {},
});
