import { memo, useMemo } from "react";
import { StyleSheet, View } from "react-native";

import { Text } from "@/components/ui/text";
import { useColors } from "@/hooks/use-colors";

interface ReadingPlanProgressBarProps {
  completed: number;
  total: number;
}

export const ReadingPlanProgressBar = memo(function ReadingPlanProgressBar({
  completed,
  total,
}: ReadingPlanProgressBarProps) {
  const colors = useColors();
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const dynamicStyles = useMemo(
    () => ({
      track: { backgroundColor: colors.surfaceElevated },
      fill: { backgroundColor: colors.accent, width: `${percentage}%` as const },
    }),
    [colors, percentage],
  );

  return (
    <View style={styles.container}>
      <View style={[styles.track, dynamicStyles.track]}>
        <View style={[styles.fill, dynamicStyles.fill]} />
      </View>
      <Text style={[styles.label, { color: colors.textMuted }]}>
        {completed}/{total} ({percentage}%)
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
