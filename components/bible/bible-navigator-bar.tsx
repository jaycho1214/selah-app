import { View, Pressable, StyleSheet } from "react-native";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react-native";
import { Text } from "@/components/ui/text";
import { useBibleStore } from "@/lib/stores/bible-store";
import { BIBLE_BOOK_DETAILS, BIBLE_BOOKS } from "@/lib/bible/constants";
import { BibleBook } from "@/lib/bible/types";
import { useColors } from "@/hooks/use-colors";
import { CommonStyles } from "@/constants/styles";

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
  const colors = useColors();
  const currentBook = useBibleStore((s) => s.currentBook);
  const currentChapter = useBibleStore((s) => s.currentChapter);
  const currentTranslation = useBibleStore((s) => s.currentTranslation);

  const bookDetails = BIBLE_BOOK_DETAILS[currentBook as BibleBook];
  const bookName = bookDetails?.name ?? currentBook;

  // Check if at boundaries
  const bookIndex = BIBLE_BOOKS.indexOf(currentBook as BibleBook);
  const isFirstChapter = bookIndex === 0 && currentChapter === 1;
  const isLastChapter =
    bookIndex === BIBLE_BOOKS.length - 1 &&
    currentChapter === bookDetails?.chapters;

  return (
    <View
      style={[
        CommonStyles.rowBetween,
        styles.container,
        { backgroundColor: colors.bg, borderBottomColor: colors.border },
      ]}
    >
      {/* Previous Chapter */}
      <Pressable
        onPress={onPrevChapter}
        disabled={isFirstChapter}
        style={({ pressed }) => [
          styles.navButton,
          isFirstChapter && styles.disabled,
          pressed && !isFirstChapter && { backgroundColor: colors.muted },
        ]}
      >
        <ChevronLeft size={24} color={colors.text} />
      </Pressable>

      {/* Current Position - Tap to open navigator */}
      <Pressable
        onPress={onOpenNavigator}
        style={({ pressed }) => [
          styles.centerButton,
          pressed && { backgroundColor: colors.muted },
        ]}
      >
        <View style={styles.centerContent}>
          <Text style={[styles.bookTitle, { color: colors.text }]}>
            {bookName} {currentChapter}
          </Text>
          <Text
            style={[styles.translationLabel, { color: colors.mutedForeground }]}
          >
            {currentTranslation}
          </Text>
        </View>
        <ChevronDown size={16} color={colors.mutedForeground} />
      </Pressable>

      {/* Next Chapter */}
      <Pressable
        onPress={onNextChapter}
        disabled={isLastChapter}
        style={({ pressed }) => [
          styles.navButton,
          isLastChapter && styles.disabled,
          pressed && !isLastChapter && { backgroundColor: colors.muted },
        ]}
      >
        <ChevronRight size={24} color={colors.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  navButton: {
    padding: 8,
    borderRadius: 10,
  },
  disabled: {
    opacity: 0.3,
  },
  centerButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  centerContent: {
    alignItems: "center",
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  translationLabel: {
    fontSize: 12,
  },
});
