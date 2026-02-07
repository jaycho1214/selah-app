import * as Haptics from "expo-haptics";
import { RelativePathString, useRouter } from "expo-router";
import { useCallback } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { Text } from "@/components/ui/text";
import { useColors } from "@/hooks/use-colors";

interface ProfileStatsEnhancedProps {
  userId: string;
  followerCount: number;
  followingCount: number;
}

export function ProfileStatsEnhanced({
  userId,
  followerCount,
  followingCount,
}: ProfileStatsEnhancedProps) {
  const colors = useColors();
  const router = useRouter();

  const handleFollowingPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/following/${userId}` as RelativePathString);
  }, [userId, router]);

  const handleFollowersPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/followers/${userId}` as RelativePathString);
  }, [userId, router]);

  return (
    <View style={styles.container}>
      <Pressable onPress={handleFollowingPress} style={styles.stat}>
        <Text style={[styles.count, { color: colors.text }]}>
          {followingCount}
        </Text>
        <Text style={[styles.label, { color: colors.textMuted }]}>
          {" following"}
        </Text>
      </Pressable>

      <Pressable onPress={handleFollowersPress} style={styles.stat}>
        <Text style={[styles.count, { color: colors.text }]}>
          {followerCount}
        </Text>
        <Text style={[styles.label, { color: colors.textMuted }]}>
          {followerCount === 1 ? " follower" : " followers"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
  },
  count: {
    fontSize: 14,
    fontWeight: "700",
  },
  label: {
    fontSize: 14,
  },
});
