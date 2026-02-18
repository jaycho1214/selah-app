import { memo, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { graphql, useFragment } from "react-relay";

import { Text } from "@/components/ui/text";
import { useColors } from "@/hooks/use-colors";
import { BIBLE_BOOK_DETAILS } from "@/lib/bible/constants";
import type { BibleBook } from "@/lib/bible/types";
import type { ReadingPlanDayCardFragment$key } from "@/lib/relay/__generated__/ReadingPlanDayCardFragment.graphql";

const fragment = graphql`
  fragment ReadingPlanDayCardFragment on ReadingPlanDay {
    id
    dayNumber
    title
    readings {
      id
      book
      startChapter
      startVerse
      endChapter
      endVerse
    }
  }
`;

interface ReadingPlanDayCardProps {
  dataKey: ReadingPlanDayCardFragment$key;
}

function formatReading(reading: {
  readonly book: string;
  readonly startChapter: number;
  readonly startVerse?: number | null;
  readonly endChapter?: number | null;
  readonly endVerse?: number | null;
}): string {
  const bookName =
    BIBLE_BOOK_DETAILS[reading.book as BibleBook]?.name ?? reading.book;
  let ref = `${bookName} ${reading.startChapter}`;

  if (reading.startVerse) {
    ref += `:${reading.startVerse}`;
  }

  if (reading.endChapter && reading.endChapter !== reading.startChapter) {
    ref += `–${reading.endChapter}`;
    if (reading.endVerse) {
      ref += `:${reading.endVerse}`;
    }
  } else if (reading.endVerse && reading.endVerse !== reading.startVerse) {
    ref += `–${reading.endVerse}`;
  }

  return ref;
}

export const ReadingPlanDayCard = memo(function ReadingPlanDayCard({
  dataKey,
}: ReadingPlanDayCardProps) {
  const data = useFragment(fragment, dataKey);
  const colors = useColors();

  const readingsText = useMemo(
    () =>
      (data.readings ?? [])
        .map((r) =>
          formatReading({
            ...r,
            book: r.book ?? "",
            startChapter: r.startChapter ?? 1,
          }),
        )
        .join(", "),
    [data.readings],
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.dayBadge}>
        <Text style={[styles.dayNumber, { color: colors.textMuted }]}>
          Day {data.dayNumber}
        </Text>
      </View>
      <View style={styles.content}>
        {data.title && (
          <Text
            style={[styles.title, { color: colors.text }]}
            numberOfLines={1}
          >
            {data.title}
          </Text>
        )}
        {readingsText.length > 0 && (
          <Text
            style={[styles.readings, { color: colors.textSecondary }]}
            numberOfLines={1}
          >
            {readingsText}
          </Text>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    padding: 12,
    gap: 10,
    flex: 1,
  },
  dayBadge: {
    minWidth: 44,
  },
  dayNumber: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  content: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
  },
  readings: {
    fontSize: 12,
  },
});
