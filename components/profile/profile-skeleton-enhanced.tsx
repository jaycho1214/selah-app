import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

import { useColors } from "@/hooks/use-colors";

export function ProfileSkeletonEnhanced() {
  const colors = useColors();
  const pulseAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.4,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  const skeletonColor = colors.border;

  return (
    <View style={styles.container}>
      {/* Top row */}
      <View style={styles.topRow}>
        <View style={styles.nameSection}>
          <Animated.View
            style={[
              styles.nameSkeleton,
              { backgroundColor: skeletonColor, opacity: pulseAnim },
            ]}
          />
          <Animated.View
            style={[
              styles.usernameSkeleton,
              { backgroundColor: skeletonColor, opacity: pulseAnim },
            ]}
          />
        </View>
        <Animated.View
          style={[
            styles.avatarSkeleton,
            { backgroundColor: skeletonColor, opacity: pulseAnim },
          ]}
        />
      </View>

      {/* Bio */}
      <Animated.View
        style={[
          styles.bioSkeleton,
          { backgroundColor: skeletonColor, opacity: pulseAnim },
        ]}
      />

      {/* Stats */}
      <View style={styles.statsRow}>
        <Animated.View
          style={[
            styles.statSkeleton,
            { backgroundColor: skeletonColor, opacity: pulseAnim },
          ]}
        />
        <Animated.View
          style={[
            styles.statSkeleton,
            { backgroundColor: skeletonColor, opacity: pulseAnim },
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
