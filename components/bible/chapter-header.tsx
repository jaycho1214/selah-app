import { memo } from "react";
import { Platform, useColorScheme, StyleSheet } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Text } from "@/components/ui/text";
import { BIBLE_BOOK_DETAILS } from "@/lib/bible/constants";
import type { BibleBook } from "@/lib/bible/types";

// Serif font for bible reading
const serifFont = Platform.select({
  ios: "ui-serif",
  default: "serif",
});

interface ChapterHeaderProps {
  book: BibleBook;
  chapter: number;
}

export const ChapterHeader = memo(function ChapterHeader({
  book,
  chapter,
}: ChapterHeaderProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const bookDetails = BIBLE_BOOK_DETAILS[book];

  const colors = isDark
    ? {
        bookName: "#a8a29e",
        chapter: "#fafaf9",
      }
    : {
        bookName: "#78716c",
        chapter: "#1c1917",
      };

  return (
    <Animated.View
      entering={FadeInDown.duration(400).springify()}
      style={styles.container}
    >
      <Text style={[styles.bookName, { color: colors.bookName }]}>
        {bookDetails.name}
      </Text>
      <Text style={[styles.chapterNumber, { color: colors.chapter }]}>
        {chapter}
      </Text>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: 56,
    paddingBottom: 56,
  },
  bookName: {
    fontSize: 11,
    fontWeight: "500",
    letterSpacing: 3,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  chapterNumber: {
    fontSize: 120,
    fontWeight: "300",
    fontFamily: serifFont,
    letterSpacing: -2,
    lineHeight: 130,
  },
});
