import { useState, useCallback, useRef } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BibleReader } from '@/components/bible/bible-reader';
import { BibleNavigator } from '@/components/bible/bible-navigator';
import { BibleNavigatorBar } from '@/components/bible/bible-navigator-bar';
import { VerseActions, VerseActionsRef } from '@/components/bible/verse-actions';
import { NoteEditor, NoteEditorRef } from '@/components/bible/note-editor';
import { useBibleStore } from '@/lib/stores/bible-store';
import { BIBLE_BOOK_DETAILS, BIBLE_BOOKS } from '@/lib/bible/constants';
import type { BibleBook } from '@/lib/bible/types';

export default function HomeScreen() {
  const { currentBook, currentChapter, setPosition } = useBibleStore();
  const [navigatorVisible, setNavigatorVisible] = useState(false);
  const verseActionsRef = useRef<VerseActionsRef>(null);
  const noteEditorRef = useRef<NoteEditorRef>(null);

  // Key to force BibleReader remount on position change
  const [readerKey, setReaderKey] = useState(0);

  const handlePositionChange = useCallback(
    (book: BibleBook, chapter: number) => {
      setPosition(book, chapter);
    },
    [setPosition]
  );

  const handleNavigatorSelect = useCallback(
    (book: BibleBook, chapter: number) => {
      setPosition(book, chapter);
      setNavigatorVisible(false);
      setReaderKey((k) => k + 1); // Force remount
    },
    [setPosition]
  );

  const handlePrevChapter = useCallback(() => {
    const bookIndex = BIBLE_BOOKS.indexOf(currentBook as BibleBook);
    const bookDetails = BIBLE_BOOK_DETAILS[currentBook as BibleBook];

    if (currentChapter > 1) {
      setPosition(currentBook as BibleBook, currentChapter - 1);
    } else if (bookIndex > 0) {
      const prevBook = BIBLE_BOOKS[bookIndex - 1];
      const prevBookChapters = BIBLE_BOOK_DETAILS[prevBook].chapters;
      setPosition(prevBook, prevBookChapters);
    }
    setReaderKey((k) => k + 1);
  }, [currentBook, currentChapter, setPosition]);

  const handleNextChapter = useCallback(() => {
    const bookIndex = BIBLE_BOOKS.indexOf(currentBook as BibleBook);
    const bookDetails = BIBLE_BOOK_DETAILS[currentBook as BibleBook];

    if (currentChapter < bookDetails.chapters) {
      setPosition(currentBook as BibleBook, currentChapter + 1);
    } else if (bookIndex < BIBLE_BOOKS.length - 1) {
      const nextBook = BIBLE_BOOKS[bookIndex + 1];
      setPosition(nextBook, 1);
    }
    setReaderKey((k) => k + 1);
  }, [currentBook, currentChapter, setPosition]);

  const handleVersePress = useCallback((verseId: string, verseText?: string) => {
    verseActionsRef.current?.open(verseId, verseText ?? '');
  }, []);

  const handleNotePress = useCallback((verseId: string, verseText: string) => {
    verseActionsRef.current?.close();
    noteEditorRef.current?.open(verseId, verseText);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Navigator bar at top */}
      <BibleNavigatorBar
        onOpenNavigator={() => setNavigatorVisible(true)}
        onPrevChapter={handlePrevChapter}
        onNextChapter={handleNextChapter}
      />

      {/* Bible reader fills remaining space */}
      <View className="flex-1">
        <BibleReader
          key={readerKey}
          initialBook={currentBook as BibleBook}
          initialChapter={currentChapter}
          onPositionChange={handlePositionChange}
          onVersePress={handleVersePress}
          onVerseLongPress={handleVersePress}
        />
      </View>

      {/* Book/chapter picker modal */}
      <BibleNavigator
        currentBook={currentBook as BibleBook}
        currentChapter={currentChapter}
        onSelect={handleNavigatorSelect}
        visible={navigatorVisible}
        onClose={() => setNavigatorVisible(false)}
      />

      {/* Verse actions bottom sheet */}
      <VerseActions
        ref={verseActionsRef}
        onNote={handleNotePress}
      />

      {/* Note editor modal */}
      <NoteEditor ref={noteEditorRef} />
    </SafeAreaView>
  );
}
