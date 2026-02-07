import * as Haptics from "expo-haptics";
import { RelativePathString, useRouter } from "expo-router";
import { useCallback } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { Text } from "@/components/ui/text";
import { useColors } from "@/hooks/use-colors";

interface ProfileStatsRowProps {
  userId: string;
  followerCount: number;
  followingCount: number;
}

export function ProfileStatsRow({
  userId,
  followerCount,
  followingCount,
}: ProfileStatsRowProps) {
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
      {/* Following count */}
      <Pressable
        onPress={followingCount > 0 ? handleFollowingPress : undefined}
        disabled={followingCount === 0}
        style={styles.stat}
      >
        <Text style={[styles.count, { color: colors.text }]}>
          {followingCount}
        </Text>
        <Text style={[styles.label, { color: colors.textMuted }]}>
          {" Following"}
        </Text>
      </Pressable>

      {/* Followers count */}
      <Pressable
        onPress={followerCount > 0 ? handleFollowersPress : undefined}
        disabled={followerCount === 0}
        style={styles.stat}
      >
        <Text style={[styles.count, { color: colors.text }]}>
          {followerCount}
        </Text>
        <Text style={[styles.label, { color: colors.textMuted }]}>
          {followerCount === 1 ? " Follower" : " Followers"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
  },
  count: {
    fontSize: 15,
    fontWeight: "700",
  },
  label: {
    fontSize: 15,
  },
});
