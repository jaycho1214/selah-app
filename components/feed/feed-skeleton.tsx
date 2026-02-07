import { useEffect } from "react";
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

interface FeedSkeletonProps {
  style?: ViewStyle;
}

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

function ShimmerBarPercent({
  widthPercent,
  height,
  shimmer,
  baseColor,
  style,
}: {
  widthPercent: `${number}%`;
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
          width: widthPercent,
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

/**
 * Shimmer skeleton card matching ReflectionItem layout.
 * Uses the established Reanimated shimmer pattern from ChapterSkeleton.
 */
function SkeletonCard({
  shimmer,
  baseColor,
}: {
  shimmer: SharedValue<number>;
  baseColor: string;
}) {
  const colors = useColors();

  return (
    <View style={[styles.card, { borderBottomColor: colors.border }]}>
      {/* Avatar circle */}
      <ShimmerBar
        width={44}
        height={44}
        shimmer={shimmer}
        baseColor={baseColor}
        style={{ borderRadius: 22 }}
      />

      <View style={styles.contentColumn}>
        {/* Header row: name, dot, username, dot, time */}
        <View style={styles.headerRow}>
          <ShimmerBar
            width={100}
            height={14}
            shimmer={shimmer}
            baseColor={baseColor}
          />
          <ShimmerBar
            width={4}
            height={4}
            shimmer={shimmer}
            baseColor={baseColor}
            style={{ borderRadius: 2 }}
          />
          <ShimmerBar
            width={70}
            height={14}
            shimmer={shimmer}
            baseColor={baseColor}
          />
          <ShimmerBar
            width={4}
            height={4}
            shimmer={shimmer}
            baseColor={baseColor}
            style={{ borderRadius: 2 }}
          />
          <ShimmerBar
            width={30}
            height={14}
            shimmer={shimmer}
            baseColor={baseColor}
          />
        </View>

        {/* Content lines of varying width */}
        <View style={styles.contentLines}>
          <ShimmerBarPercent
            widthPercent="95%"
            height={14}
            shimmer={shimmer}
            baseColor={baseColor}
          />
          <ShimmerBarPercent
            widthPercent="80%"
            height={14}
            shimmer={shimmer}
            baseColor={baseColor}
          />
          <ShimmerBarPercent
            widthPercent="60%"
            height={14}
            shimmer={shimmer}
            baseColor={baseColor}
          />
        </View>

        {/* Action buttons row: 3 small bars */}
        <View style={styles.actionsRow}>
          <ShimmerBar
            width={30}
            height={14}
            shimmer={shimmer}
            baseColor={baseColor}
          />
          <ShimmerBar
            width={30}
            height={14}
            shimmer={shimmer}
            baseColor={baseColor}
          />
          <ShimmerBar
            width={30}
            height={14}
            shimmer={shimmer}
            baseColor={baseColor}
          />
        </View>
      </View>
    </View>
  );
}

/**
 * FeedSkeleton renders 4 shimmer skeleton cards matching the visual shape
 * of ReflectionItem post cards. Used as a Suspense fallback for feed loading.
 */
export function FeedSkeleton({ style }: FeedSkeletonProps) {
  const colors = useColors();
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(withTiming(1, { duration: 1200 }), -1, false);
  }, []);

  return (
    <View style={style}>
      {[0, 1, 2, 3].map((i) => (
        <SkeletonCard
          key={i}
          shimmer={shimmer}
          baseColor={colors.surfaceElevated}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  contentColumn: {
    flex: 1,
    gap: 4,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  contentLines: {
    marginTop: 4,
    gap: 8,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginTop: 12,
  },
});
