import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

import { useColors } from "@/hooks/use-colors";

/**
 * Loading skeleton for profile screen.
 * Shows pulsing placeholders for avatar, name, username, bio, and stats.
 */
export function ProfileSkeleton() {
  const colors = useColors();
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, [pulseAnim]);

  const skeletonColor = colors.surfaceElevated;

  return (
    <View style={styles.container}>
      {/* Avatar placeholder */}
      <Animated.View
        style={[
          styles.avatar,
          { backgroundColor: skeletonColor, opacity: pulseAnim },
        ]}
      />

      {/* Name placeholder */}
      <Animated.View
        style={[
          styles.nameLine,
          { backgroundColor: skeletonColor, opacity: pulseAnim },
        ]}
      />

      {/* Username placeholder */}
      <Animated.View
        style={[
          styles.usernameLine,
          { backgroundColor: skeletonColor, opacity: pulseAnim },
        ]}
      />

      {/* Bio placeholder - two lines */}
      <View style={styles.bioContainer}>
        <Animated.View
          style={[
            styles.bioLine,
            { backgroundColor: skeletonColor, opacity: pulseAnim },
          ]}
        />
        <Animated.View
          style={[
            styles.bioLineShort,
            { backgroundColor: skeletonColor, opacity: pulseAnim },
          ]}
        />
      </View>

      {/* Stats row placeholder */}
      <View style={styles.statsRow}>
        <Animated.View
          style={[
            styles.statItem,
            { backgroundColor: skeletonColor, opacity: pulseAnim },
          ]}
        />
        <Animated.View
          style={[
            styles.statItem,
            { backgroundColor: skeletonColor, opacity: pulseAnim },
          ]}
        />
      </View>
    </View>
  );
}

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
