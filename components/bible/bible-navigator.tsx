import { useState, useMemo } from 'react';
import { View, Text, Pressable, ScrollView, Modal } from 'react-native';
import { BIBLE_BOOKS, BIBLE_BOOK_DETAILS } from '@/lib/bible/constants';
import { BibleBook } from '@/lib/bible/types';

interface BibleNavigatorProps {
  currentBook: BibleBook;
  currentChapter: number;
  onSelect: (book: BibleBook, chapter: number) => void;
  visible: boolean;
  onClose: () => void;
}

export function BibleNavigator({
  currentBook,
  currentChapter,
  onSelect,
  visible,
  onClose,
}: BibleNavigatorProps) {
  const [selectedBook, setSelectedBook] = useState<BibleBook | null>(null);

  const bookDetails = useMemo(
    () => (selectedBook ? BIBLE_BOOK_DETAILS[selectedBook] : null),
    [selectedBook]
  );

  const handleBookSelect = (book: BibleBook) => {
    setSelectedBook(book);
  };

  const handleChapterSelect = (chapter: number) => {
    if (selectedBook) {
      onSelect(selectedBook, chapter);
      setSelectedBook(null);
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedBook(null);
    onClose();
  };

  const handleBack = () => {
    setSelectedBook(null);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-background">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-border">
          <Pressable onPress={selectedBook ? handleBack : handleClose} className="p-2">
            <Text className="text-primary text-base">
              {selectedBook ? 'Back' : 'Cancel'}
            </Text>
          </Pressable>
          <Text className="text-foreground text-lg font-semibold">
            {selectedBook ? BIBLE_BOOK_DETAILS[selectedBook].name : 'Select Book'}
          </Text>
          <View className="w-16" />
        </View>

        {/* Content */}
        {selectedBook && bookDetails ? (
          // Chapter grid
          <ScrollView className="flex-1 p-4">
            <View className="flex-row flex-wrap gap-2">
              {Array.from({ length: bookDetails.chapters }, (_, i) => i + 1).map(
                (chapter) => (
                  <Pressable
                    key={chapter}
                    onPress={() => handleChapterSelect(chapter)}
                    className={`w-12 h-12 items-center justify-center rounded-lg ${
                      selectedBook === currentBook && chapter === currentChapter
                        ? 'bg-primary'
                        : 'bg-muted'
                    }`}
                  >
                    <Text
                      className={`text-base font-medium ${
                        selectedBook === currentBook && chapter === currentChapter
                          ? 'text-primary-foreground'
                          : 'text-foreground'
                      }`}
                    >
                      {chapter}
                    </Text>
                  </Pressable>
                )
              )}
            </View>
          </ScrollView>
        ) : (
          // Book list
          <ScrollView className="flex-1">
            {/* Old Testament */}
            <View className="px-4 py-2 bg-muted">
              <Text className="text-sm font-semibold text-muted-foreground">
                Old Testament
              </Text>
            </View>
            {BIBLE_BOOKS.filter(
              (book) => BIBLE_BOOK_DETAILS[book].testament === 'old'
            ).map((book) => (
              <Pressable
                key={book}
                onPress={() => handleBookSelect(book)}
                className={`px-4 py-3 border-b border-border ${
                  book === currentBook ? 'bg-primary/10' : ''
                }`}
              >
                <Text className="text-foreground text-base">
                  {BIBLE_BOOK_DETAILS[book].name}
                </Text>
              </Pressable>
            ))}

            {/* New Testament */}
            <View className="px-4 py-2 bg-muted">
              <Text className="text-sm font-semibold text-muted-foreground">
                New Testament
              </Text>
            </View>
            {BIBLE_BOOKS.filter(
              (book) => BIBLE_BOOK_DETAILS[book].testament === 'new'
            ).map((book) => (
              <Pressable
                key={book}
                onPress={() => handleBookSelect(book)}
                className={`px-4 py-3 border-b border-border ${
                  book === currentBook ? 'bg-primary/10' : ''
                }`}
              >
                <Text className="text-foreground text-base">
                  {BIBLE_BOOK_DETAILS[book].name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        )}
      </View>
    </Modal>
  );
}
