import { memo, useCallback, useMemo } from "react";
import { Pressable, View, StyleSheet } from "react-native";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";

import { Text } from "@/components/ui/text";
import { UserAvatar } from "@/components/user/user-avatar";
import { FollowButton } from "@/components/user/follow-button";
import { useColors } from "@/hooks/use-colors";
import { useSession } from "@/components/providers/session-provider";
import type { userRow_user$key } from "@/lib/relay/__generated__/userRow_user.graphql";

const fragment = graphql`
  fragment userRow_user on User {
    id
    username
    name
    bio
    image {
      url
    }
    followedAt
    ...followButton_user
  }
`;

interface UserRowProps {
  userRef: userRow_user$key;
}

export const UserRow = memo(function UserRow({ userRef }: UserRowProps) {
  const colors = useColors();
  const { session } = useSession();
  const data = useFragment(fragment, userRef);

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (data?.username) {
      router.push(`/user/${data.username}`);
    }
  }, [data?.username]);

  const isOwnProfile = session?.user?.id === data?.id;

  const dynamicStyles = useMemo(
    () => ({
      container: { borderBottomColor: colors.border },
      name: { color: colors.text },
      username: { color: colors.textMuted },
      bio: { color: colors.textSecondary },
    }),
    [colors],
  );

  return (
    <Pressable
      onPress={handlePress}
      style={[styles.container, dynamicStyles.container]}
    >
      <UserAvatar imageUrl={data?.image?.url} name={data?.name} size={48} />
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={[styles.name, dynamicStyles.name]} numberOfLines={1}>
            {data?.name || data?.username}
          </Text>
          <Text
            style={[styles.username, dynamicStyles.username]}
            numberOfLines={1}
          >
            @{data?.username}
          </Text>
          {data?.bio && (
            <Text style={[styles.bio, dynamicStyles.bio]} numberOfLines={2}>
              {data.bio}
            </Text>
          )}
        </View>
        {!isOwnProfile && session?.user && <FollowButton userRef={data} />}
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    marginLeft: 12,
    alignItems: "flex-start",
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  username: {
    fontSize: 14,
    marginTop: 2,
  },
  bio: {
    fontSize: 14,
    marginTop: 4,
    lineHeight: 18,
  },
});
