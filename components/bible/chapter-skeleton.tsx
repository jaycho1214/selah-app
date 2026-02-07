import { View, useColorScheme, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import { useEffect } from "react";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface ChapterSkeletonProps {
  topInset?: number;
}

export function ChapterSkeleton({ topInset = 0 }: ChapterSkeletonProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(withTiming(1, { duration: 1200 }), -1, false);
  }, []);

  const colors = isDark
    ? {
        base: "#1c1917",
        highlight: "#292524",
      }
    : {
        base: "#f5f4f3",
        highlight: "#fdfcfb",
      };

  const ShimmerBar = ({
    width,
    height,
    style,
  }: {
    width: number | string;
    height: number;
    style?: any;
  }) => {
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
            backgroundColor: colors.base,
            borderRadius: height / 2,
          },
          animatedStyle,
          style,
        ]}
      />
    );
  };

  // Generate random-ish verse line widths for natural look
  const verseWidths = [
    ["92%", "88%", "45%"],
    ["95%", "78%", "82%", "30%"],
    ["88%", "94%", "65%"],
    ["90%", "85%", "92%", "55%"],
    ["94%", "70%"],
    ["87%", "92%", "48%"],
    ["91%", "86%", "79%", "35%"],
    ["89%", "95%", "60%"],
  ];

  return (
    <View style={[styles.container, { paddingTop: topInset + 16 }]}>
      {/* Chapter Header Skeleton */}
      <View style={styles.header}>
        {/* Book name */}
        <ShimmerBar width={80} height={12} style={{ marginBottom: 12 }} />
        {/* Chapter number */}
        <ShimmerBar width={60} height={90} style={{ borderRadius: 8 }} />
      </View>

      {/* Verse Skeletons */}
      <View style={styles.verses}>
        {verseWidths.map((lines, verseIndex) => (
          <View key={verseIndex} style={styles.verse}>
            {/* Verse number */}
            <ShimmerBar width={20} height={14} style={styles.verseNumber} />

            {/* Verse text lines */}
            <View style={styles.verseText}>
              {lines.map((width, lineIndex) => (
                <ShimmerBar
                  key={lineIndex}
                  width={width}
                  height={16}
                  style={{
                    marginBottom: lineIndex < lines.length - 1 ? 10 : 0,
                  }}
                />
              ))}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 56,
  },
  verses: {
    gap: 20,
  },
  verse: {
    flexDirection: "row",
    gap: 12,
  },
  verseNumber: {
    marginTop: 2,
  },
  verseText: {
    flex: 1,
    gap: 0,
  },
});
