import { memo, useMemo } from "react";
import { StyleSheet, View } from "react-native";

import { Text } from "@/components/ui/text";
import { useColors } from "@/hooks/use-colors";

interface ReadingPlanProgressBarProps {
  completed: number;
  total: number;
  /** Optional reading-level counts for finer-grained percentage */
  readingCompleted?: number;
  readingTotal?: number;
}

export const ReadingPlanProgressBar = memo(function ReadingPlanProgressBar({
  completed,
  total,
  readingCompleted,
  readingTotal,
}: ReadingPlanProgressBarProps) {
  const colors = useColors();

  // Use reading-level progress for the bar and percentage when available
  const percentage = useMemo(() => {
    if (readingTotal != null && readingTotal > 0) {
      return Math.round(((readingCompleted ?? 0) / readingTotal) * 100);
    }
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }, [completed, total, readingCompleted, readingTotal]);

  const dynamicStyles = useMemo(
    () => ({
      track: { backgroundColor: colors.surfaceElevated },
      fill: {
        backgroundColor: colors.accent,
        width: `${percentage}%` as const,
      },
    }),
    [colors, percentage],
  );

  return (
    <View style={styles.container}>
      <View style={[styles.track, dynamicStyles.track]}>
        <View style={[styles.fill, dynamicStyles.fill]} />
      </View>
      <Text style={[styles.label, { color: colors.textMuted }]}>
        {completed}/{total} days ({percentage}%)
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  track: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 3,
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
  },
});
