import { useState, useCallback, useEffect, useRef } from "react";
import { View, Text, Pressable } from "react-native";
import { useLocalSearchParams, router, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
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
import { BibleBook } from "@/lib/bible/types";

export default function BibleChapterScreen() {
  const { book, chapter } = useLocalSearchParams<{
    book: string;
    chapter: string;
  }>();
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
  }, [book, chapter]);

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
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: () => (
            <Pressable onPress={() => setNavigatorVisible(true)}>
              <View className="items-center">
                <Text className="text-foreground text-lg font-semibold">
                  {bookName} {currentChapter}
                </Text>
                <Text className="text-muted-foreground text-xs">
                  {currentTranslation}
                </Text>
              </View>
            </Pressable>
          ),
          headerRight: () => (
            <View className="flex-row">
              <Pressable onPress={() => router.push("/search")} className="p-2">
                <Search size={22} className="text-foreground" />
              </Pressable>
              <Pressable
                onPress={() => settingsSheetRef.current?.expand()}
                className="p-2"
              >
                <Settings size={22} className="text-foreground" />
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
          <View className="flex-row border-b border-border">
            <Pressable
              onPress={() => setSettingsTab("font")}
              className={`flex-1 py-3 items-center ${
                settingsTab === "font" ? "border-b-2 border-primary" : ""
              }`}
            >
              <Text
                className={
                  settingsTab === "font"
                    ? "text-primary font-medium"
                    : "text-muted-foreground"
                }
              >
                Font Size
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setSettingsTab("translation")}
              className={`flex-1 py-3 items-center ${
                settingsTab === "translation" ? "border-b-2 border-primary" : ""
              }`}
            >
              <Text
                className={
                  settingsTab === "translation"
                    ? "text-primary font-medium"
                    : "text-muted-foreground"
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
    </SafeAreaView>
  );
}
