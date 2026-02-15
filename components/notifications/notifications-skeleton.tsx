import { memo, useEffect } from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  interpolate,
  type SharedValue,
} from "react-native-reanimated";

import { useColors } from "@/hooks/use-colors";

function ShimmerBar({
  width,
  height,
  shimmer,
  baseColor,
  style,
}: {
  width: number;
  height: number;
  shimmer: SharedValue<number>;
  baseColor: string;
  style?: ViewStyle;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(shimmer.value, [0, 0.5, 1], [0.4, 0.7, 0.4]);
    return { opacity };
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          backgroundColor: baseColor,
          borderRadius: height / 2,
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

function SkeletonRow({
  shimmer,
  baseColor,
  borderColor,
}: {
  shimmer: SharedValue<number>;
  baseColor: string;
  borderColor: string;
}) {
  return (
    <View style={[styles.row, { borderBottomColor: borderColor }]}>
      {/* Type icon circle */}
      <ShimmerBar
        width={36}
        height={36}
        shimmer={shimmer}
        baseColor={baseColor}
        style={{ borderRadius: 18 }}
      />

      <View style={styles.contentColumn}>
        {/* Avatar + message */}
        <View style={styles.headerRow}>
          <ShimmerBar
            width={28}
            height={28}
            shimmer={shimmer}
            baseColor={baseColor}
            style={{ borderRadius: 14 }}
          />
          <View style={styles.messageLines}>
            <ShimmerBar
              width={200}
              height={14}
              shimmer={shimmer}
              baseColor={baseColor}
            />
            <ShimmerBar
              width={60}
              height={12}
              shimmer={shimmer}
              baseColor={baseColor}
            />
          </View>
        </View>
        {/* Preview line */}
        <ShimmerBar
          width={160}
          height={12}
          shimmer={shimmer}
          baseColor={baseColor}
          style={{ marginLeft: 38 }}
        />
      </View>
    </View>
  );
}

export const NotificationsSkeleton = memo(function NotificationsSkeleton() {
  const colors = useColors();
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(withTiming(1, { duration: 1200 }), -1, false);
  }, []);

  return (
    <View>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <SkeletonRow
          key={i}
          shimmer={shimmer}
          baseColor={colors.surfaceElevated}
          borderColor={colors.border}
        />
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  contentColumn: {
    flex: 1,
    gap: 8,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  messageLines: {
    flex: 1,
    gap: 6,
  },
});
