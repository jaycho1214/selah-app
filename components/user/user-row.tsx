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

export function UserRow({ userRef }: UserRowProps) {
  const colors = useColors();
  const { session } = useSession();
  const data = useFragment(fragment, userRef);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (data?.username) {
      router.push(`/user/${data.username}`);
    }
  };

  const isOwnProfile = session?.user?.id === data?.id;

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.container,
        { borderBottomColor: colors.border },
        pressed && { opacity: 0.7 },
      ]}
    >
      <UserAvatar imageUrl={data?.image?.url} name={data?.name} size={48} />
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
            {data?.name || data?.username}
          </Text>
          <Text
            style={[styles.username, { color: colors.textMuted }]}
            numberOfLines={1}
          >
            @{data?.username}
          </Text>
          {data?.bio && (
            <Text
              style={[styles.bio, { color: colors.textSecondary }]}
              numberOfLines={2}
            >
              {data.bio}
            </Text>
          )}
        </View>
        {!isOwnProfile && session?.user && <FollowButton userRef={data} />}
      </View>
    </Pressable>
  );
}

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
