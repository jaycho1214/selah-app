import { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search } from 'lucide-react-native';
import { BibleReader } from '@/components/bible/bible-reader';
import { BibleNavigator } from '@/components/bible/bible-navigator';
import { VerseActions, VerseActionsRef } from '@/components/bible/verse-actions';
import { NoteEditor, NoteEditorRef } from '@/components/bible/note-editor';
import { BIBLE_BOOK_DETAILS } from '@/lib/bible/constants';
import { useBibleStore } from '@/lib/stores/bible-store';
import { BibleBook } from '@/lib/bible/types';

export default function BibleChapterScreen() {
  const { book, chapter } = useLocalSearchParams<{ book: string; chapter: string }>();
  const { currentTranslation, setPosition } = useBibleStore();
  const [navigatorVisible, setNavigatorVisible] = useState(false);
  const verseActionsRef = useRef<VerseActionsRef>(null);
  const noteEditorRef = useRef<NoteEditorRef>(null);

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

  // Open verse actions on tap or long-press
  const handleVersePress = useCallback((verseId: string, verseText?: string) => {
    verseActionsRef.current?.open(verseId, verseText ?? '');
  }, []);

  const handleVerseLongPress = useCallback((verseId: string, verseText?: string) => {
    verseActionsRef.current?.open(verseId, verseText ?? '');
  }, []);

  const handleNotePress = useCallback((verseId: string, verseText: string) => {
    verseActionsRef.current?.close();
    noteEditorRef.current?.open(verseId, verseText);
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
          headerRight: () => (
            <Pressable onPress={() => router.push('/search')} className="p-2">
              <Search size={22} className="text-foreground" />
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

      <VerseActions
        ref={verseActionsRef}
        onNote={handleNotePress}
      />

      <NoteEditor ref={noteEditorRef} />
    </SafeAreaView>
  );
}
