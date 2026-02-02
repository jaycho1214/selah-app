import { useState, useCallback, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BibleReader } from '@/components/bible/bible-reader';
import { BibleNavigator } from '@/components/bible/bible-navigator';
import { BIBLE_BOOK_DETAILS } from '@/lib/bible/constants';
import { useBibleStore } from '@/lib/stores/bible-store';
import { BibleBook } from '@/lib/bible/types';

export default function BibleChapterScreen() {
  const { book, chapter } = useLocalSearchParams<{ book: string; chapter: string }>();
  const { currentTranslation, setPosition } = useBibleStore();
  const [navigatorVisible, setNavigatorVisible] = useState(false);

  // Track current position locally for re-renders on navigation
  const [currentBook, setCurrentBook] = useState<BibleBook>(book as BibleBook);
  const [currentChapter, setCurrentChapter] = useState(parseInt(chapter, 10));

  // Update local state when URL params change (e.g., from navigator)
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
      // Update URL without navigation animation
      router.setParams({ book: newBook, chapter: String(newChapter) });
    },
    []
  );

  const handleNavigatorSelect = useCallback(
    (selectedBook: BibleBook, selectedChapter: number) => {
      setCurrentBook(selectedBook);
      setCurrentChapter(selectedChapter);
      setPosition(selectedBook, selectedChapter);
      router.setParams({ book: selectedBook, chapter: String(selectedChapter) });
    },
    [setPosition]
  );

  const handleVersePress = useCallback((verseId: string, verseText?: string) => {
    // TODO: Show verse actions (highlight, bookmark, note, share)
    console.log('Verse pressed:', verseId);
  }, []);

  const handleVerseLongPress = useCallback((verseId: string, verseText?: string) => {
    // TODO: Show verse actions sheet
    console.log('Verse long-pressed:', verseId);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
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
    </SafeAreaView>
  );
}
