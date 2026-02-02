import { View, Pressable } from 'react-native';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { useBibleStore } from '@/lib/stores/bible-store';
import { BIBLE_BOOK_DETAILS, BIBLE_BOOKS } from '@/lib/bible/constants';
import { BibleBook } from '@/lib/bible/types';

interface BibleNavigatorBarProps {
  onOpenNavigator: () => void;
  onPrevChapter: () => void;
  onNextChapter: () => void;
}

export function BibleNavigatorBar({
  onOpenNavigator,
  onPrevChapter,
  onNextChapter,
}: BibleNavigatorBarProps) {
  const { currentBook, currentChapter, currentTranslation } = useBibleStore();

  const bookDetails = BIBLE_BOOK_DETAILS[currentBook as BibleBook];
  const bookName = bookDetails?.name ?? currentBook;

  // Check if at boundaries
  const bookIndex = BIBLE_BOOKS.indexOf(currentBook as BibleBook);
  const isFirstChapter = bookIndex === 0 && currentChapter === 1;
  const isLastChapter =
    bookIndex === BIBLE_BOOKS.length - 1 &&
    currentChapter === bookDetails?.chapters;

  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-background border-b border-border">
      {/* Previous Chapter */}
      <Pressable
        onPress={onPrevChapter}
        disabled={isFirstChapter}
        className={`p-2 rounded-lg ${isFirstChapter ? 'opacity-30' : 'active:bg-muted'}`}
      >
        <ChevronLeft size={24} className="text-foreground" />
      </Pressable>

      {/* Current Position - Tap to open navigator */}
      <Pressable
        onPress={onOpenNavigator}
        className="flex-row items-center gap-1 px-3 py-2 rounded-lg active:bg-muted"
      >
        <View className="items-center">
          <Text className="text-foreground text-lg font-semibold">
            {bookName} {currentChapter}
          </Text>
          <Text className="text-muted-foreground text-xs">
            {currentTranslation}
          </Text>
        </View>
        <ChevronDown size={16} className="text-muted-foreground" />
      </Pressable>

      {/* Next Chapter */}
      <Pressable
        onPress={onNextChapter}
        disabled={isLastChapter}
        className={`p-2 rounded-lg ${isLastChapter ? 'opacity-30' : 'active:bg-muted'}`}
      >
        <ChevronRight size={24} className="text-foreground" />
      </Pressable>
    </View>
  );
}
