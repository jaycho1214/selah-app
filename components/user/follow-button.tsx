import { ActivityIndicator, Pressable, StyleSheet } from "react-native";
import { useFragment, useMutation } from "react-relay";
import { graphql } from "relay-runtime";
import * as Haptics from "expo-haptics";

import { Text } from "@/components/ui/text";
import { useColors } from "@/hooks/use-colors";
import type { followButton_user$key } from "@/lib/relay/__generated__/followButton_user.graphql";
import type { followButtonMutation } from "@/lib/relay/__generated__/followButtonMutation.graphql";

const fragment = graphql`
  fragment followButton_user on User {
    id
    followedAt
    followerCount
  }
`;

const mutation = graphql`
  mutation followButtonMutation($userId: ID!, $value: Boolean!) {
    userFollow(userId: $userId) @include(if: $value) {
      user {
        id
        followedAt
        followerCount
      }
    }
    userUnfollow(userId: $userId) @skip(if: $value) {
      user {
        id
        followedAt
        followerCount
      }
    }
  }
`;

interface FollowButtonProps {
  userRef: followButton_user$key;
}

export function FollowButton({ userRef }: FollowButtonProps) {
  const colors = useColors();
  const data = useFragment(fragment, userRef);
  const [commit, isMutationInFlight] =
    useMutation<followButtonMutation>(mutation);

  const isFollowing = !!data?.followedAt;

  const handlePress = () => {
    if (!data?.id) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    commit({
      variables: {
        userId: data.id,
        value: !isFollowing, // true = follow, false = unfollow
      },
      optimisticUpdater: (store) => {
        const user = store.get(data.id);
        if (user) {
          // Toggle followedAt
          user.setValue(
            isFollowing ? null : new Date().toISOString(),
            "followedAt",
          );
          // Update follower count
          const currentCount = (user.getValue("followerCount") as number) ?? 0;
          user.setValue(
            isFollowing ? currentCount - 1 : currentCount + 1,
            "followerCount",
          );
        }
      },
      onError: (error) => {
        // Optimistic update auto-rolls back
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        console.error("Follow/unfollow failed:", error);
      },
    });
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={isMutationInFlight}
      style={[
        styles.button,
        isFollowing ? styles.followingButton : styles.followButton,
        { borderColor: colors.border },
        isMutationInFlight && styles.disabledButton,
      ]}
    >
      {isMutationInFlight ? (
        <ActivityIndicator
          size="small"
          color={isFollowing ? colors.text : "#fff"}
        />
      ) : (
        <Text
          style={[
            styles.buttonText,
            isFollowing ? { color: colors.text } : { color: "#fff" },
          ]}
        >
          {isFollowing ? "Following" : "Follow"}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  followButton: {
    backgroundColor: "#000",
  },
  followingButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
