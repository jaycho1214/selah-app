import { memo, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from "react-native-reanimated";

import { useColors } from "@/hooks/use-colors";

/**
 * Loading skeleton for profile screen.
 * Shows pulsing placeholders for avatar, name, username, bio, and stats.
 */
export const ProfileSkeleton = memo(function ProfileSkeleton() {
  const colors = useColors();
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(withTiming(1, { duration: 1200 }), -1, false);
  }, [shimmer]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shimmer.value, [0, 1], [0.3, 1]),
  }));

  const skeletonColor = colors.surfaceElevated;

  return (
    <View style={styles.container}>
      {/* Avatar placeholder */}
      <Animated.View
        style={[
          styles.avatar,
          { backgroundColor: skeletonColor },
          animatedStyle,
        ]}
      />

      {/* Name placeholder */}
      <Animated.View
        style={[
          styles.nameLine,
          { backgroundColor: skeletonColor },
          animatedStyle,
        ]}
      />

      {/* Username placeholder */}
      <Animated.View
        style={[
          styles.usernameLine,
          { backgroundColor: skeletonColor },
          animatedStyle,
        ]}
      />

      {/* Bio placeholder - two lines */}
      <View style={styles.bioContainer}>
        <Animated.View
          style={[
            styles.bioLine,
            { backgroundColor: skeletonColor },
            animatedStyle,
          ]}
        />
        <Animated.View
          style={[
            styles.bioLineShort,
            { backgroundColor: skeletonColor },
            animatedStyle,
          ]}
        />
      </View>

      {/* Stats row placeholder */}
      <View style={styles.statsRow}>
        <Animated.View
          style={[
            styles.statItem,
            { backgroundColor: skeletonColor },
            animatedStyle,
          ]}
        />
        <Animated.View
          style={[
            styles.statItem,
            { backgroundColor: skeletonColor },
            animatedStyle,
          ]}
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  nameLine: {
    width: 120,
    height: 24,
    borderRadius: 4,
    marginTop: 12,
  },
  usernameLine: {
    width: 80,
    height: 18,
    borderRadius: 4,
    marginTop: 6,
  },
  bioContainer: {
    alignItems: "center",
    marginTop: 12,
    gap: 6,
  },
  bioLine: {
    width: 240,
    height: 16,
    borderRadius: 4,
  },
  bioLineShort: {
    width: 180,
    height: 16,
    borderRadius: 4,
  },
  statsRow: {
    flexDirection: "row",
    gap: 20,
    marginTop: 16,
  },
  statItem: {
    width: 80,
    height: 20,
    borderRadius: 4,
  },
});
