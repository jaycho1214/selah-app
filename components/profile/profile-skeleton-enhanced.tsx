import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from "react-native-reanimated";

import { useColors } from "@/hooks/use-colors";

export function ProfileSkeletonEnhanced() {
  const colors = useColors();
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(withTiming(1, { duration: 1200 }), -1, false);
  }, [shimmer]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shimmer.value, [0, 1], [0.4, 0.7]),
  }));

  const skeletonColor = colors.border;

  return (
    <View style={styles.container}>
      {/* Top row */}
      <View style={styles.topRow}>
        <View style={styles.nameSection}>
          <Animated.View
            style={[
              styles.nameSkeleton,
              { backgroundColor: skeletonColor },
              animatedStyle,
            ]}
          />
          <Animated.View
            style={[
              styles.usernameSkeleton,
              { backgroundColor: skeletonColor },
              animatedStyle,
            ]}
          />
        </View>
        <Animated.View
          style={[
            styles.avatarSkeleton,
            { backgroundColor: skeletonColor },
            animatedStyle,
          ]}
        />
      </View>

      {/* Bio */}
      <Animated.View
        style={[
          styles.bioSkeleton,
          { backgroundColor: skeletonColor },
          animatedStyle,
        ]}
      />

      {/* Stats */}
      <View style={styles.statsRow}>
        <Animated.View
          style={[
            styles.statSkeleton,
            { backgroundColor: skeletonColor },
            animatedStyle,
          ]}
        />
        <Animated.View
          style={[
            styles.statSkeleton,
            { backgroundColor: skeletonColor },
            animatedStyle,
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  nameSection: {
    flex: 1,
    marginRight: 16,
  },
  nameSkeleton: {
    width: 140,
    height: 24,
    borderRadius: 4,
  },
  usernameSkeleton: {
    width: 100,
    height: 16,
    borderRadius: 4,
    marginTop: 6,
  },
  avatarSkeleton: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  bioSkeleton: {
    width: "80%",
    height: 16,
    borderRadius: 4,
    marginTop: 12,
  },
  statsRow: {
    flexDirection: "row",
    gap: 16,
    marginTop: 16,
  },
  statSkeleton: {
    width: 80,
    height: 16,
    borderRadius: 4,
  },
});
