import * as Haptics from "expo-haptics";
import {
  RelativePathString,
  Stack,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import React, { Suspense, useCallback, useRef } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { graphql, useLazyLoadQuery, useMutation } from "react-relay";

import { ProfileHeader } from "@/components/profile/profile-header";
import {
  ProfilePostsList,
  type ProfilePostsListRef,
} from "@/components/profile/profile-posts-list";
import { ProfileSkeleton } from "@/components/profile/profile-skeleton";
import { ProfileStatsRow } from "@/components/profile/profile-stats-row";
import { useSession } from "@/components/providers/session-provider";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { FollowButton } from "@/components/user/follow-button";
import { useColors } from "@/hooks/use-colors";
import type { UsernameDeleteMutation } from "@/lib/relay/__generated__/UsernameDeleteMutation.graphql";
import type { UsernameLikeMutation } from "@/lib/relay/__generated__/UsernameLikeMutation.graphql";
import type { UsernameQuery } from "@/lib/relay/__generated__/UsernameQuery.graphql";
import type { UsernameUnlikeMutation } from "@/lib/relay/__generated__/UsernameUnlikeMutation.graphql";

// GraphQL query for user profile by username
const userProfileQuery = graphql`
  query UsernameQuery($username: String!) {
    userByUsername(username: $username) {
      id
      username
      name
      bio
      image {
        url
      }
      followerCount
      followingCount
      followedAt
      ...followButton_user
      ...profilePostsListFragment
    }
  }
`;

// Like mutation
const likeReflectionMutation = graphql`
  mutation UsernameLikeMutation($id: ID!) {
    bibleVersePostLike(id: $id) {
      likedAt
    }
  }
`;

// Unlike mutation
const unlikeReflectionMutation = graphql`
  mutation UsernameUnlikeMutation($id: ID!) {
    bibleVersePostUnlike(id: $id) {
      likedAt
    }
  }
`;

// Delete mutation
const deleteReflectionMutation = graphql`
  mutation UsernameDeleteMutation($id: ID!, $connections: [ID!]!) {
    bibleVersePostDelete(id: $id) {
      deletedIds @deleteEdge(connections: $connections)
    }
  }
`;

export default function UserProfileScreen() {
  const colors = useColors();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.bg }]}
      edges={["bottom"]}
    >
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Profile",
          headerStyle: { backgroundColor: "transparent" },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          headerBackButtonDisplayMode: "minimal",
          headerTransparent: true,
        }}
      />
      <Suspense fallback={<ProfileSkeleton />}>
        <UserProfileContent />
      </Suspense>
    </SafeAreaView>
  );
}

function UserProfileContent() {
  const { username } = useLocalSearchParams<{ username: string }>();
  const { session, presentSignIn } = useSession();
  const colors = useColors();
  const router = useRouter();
  const postsListRef = useRef<ProfilePostsListRef>(null);

  // Fetch profile data
  const data = useLazyLoadQuery<UsernameQuery>(userProfileQuery, {
    username: username ?? "",
  });

  const user = data.userByUsername;

  // Mutations
  const [commitLike] = useMutation<UsernameLikeMutation>(
    likeReflectionMutation,
  );
  const [commitUnlike] = useMutation<UsernameUnlikeMutation>(
    unlikeReflectionMutation,
  );
  const [commitDelete] = useMutation<UsernameDeleteMutation>(
    deleteReflectionMutation,
  );

  const handleLike = useCallback(
    (postId: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      commitLike({
        variables: { id: postId },
        optimisticUpdater: (store) => {
          const post = store.get(postId);
          if (post) {
            post.setValue(new Date().toISOString(), "likedAt");
            const currentCount = (post.getValue("likesCount") as number) ?? 0;
            post.setValue(currentCount + 1, "likesCount");
          }
        },
      });
    },
    [commitLike],
  );

  const handleUnlike = useCallback(
    (postId: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      commitUnlike({
        variables: { id: postId },
        optimisticUpdater: (store) => {
          const post = store.get(postId);
          if (post) {
            post.setValue(null, "likedAt");
            const currentCount = (post.getValue("likesCount") as number) ?? 0;
            post.setValue(Math.max(0, currentCount - 1), "likesCount");
          }
        },
      });
    },
    [commitUnlike],
  );

  const handleDelete = useCallback(
    (postId: string) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      const connectionId = postsListRef.current?.connectionId;
      const connections = connectionId ? [connectionId] : [];

      commitDelete({
        variables: { id: postId, connections },
        onError: (error) => {
          console.error("Failed to delete post:", error);
        },
      });
    },
    [commitDelete],
  );

  const handleEditProfile = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/user-edit" as RelativePathString);
  };

  // User not found
  if (!user) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={[styles.notFoundText, { color: colors.textMuted }]}>
          User not found
        </Text>
      </View>
    );
  }

  const isOwnProfile = session?.user?.id === user.id;

  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <ProfileHeader
        name={user.name}
        username={user.username}
        bio={user.bio}
        imageUrl={user.image?.url}
      >
        {isOwnProfile ? (
          <Button
            variant="outline"
            style={styles.actionButton}
            onPress={handleEditProfile}
          >
            <Text style={[styles.actionButtonText, { color: colors.text }]}>
              Edit Profile
            </Text>
          </Button>
        ) : session?.user ? (
          <FollowButton userRef={user} />
        ) : (
          <Button style={styles.actionButton} onPress={presentSignIn}>
            <Text style={styles.signInButtonText}>Sign in to Follow</Text>
          </Button>
        )}
      </ProfileHeader>

      {/* Stats Row */}
      <ProfileStatsRow
        userId={user.id}
        followerCount={user.followerCount ?? 0}
        followingCount={user.followingCount ?? 0}
      />

      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {/* Posts List */}
      <ProfilePostsList
        ref={postsListRef}
        userRef={user}
        currentUserId={session?.user?.id}
        onLike={handleLike}
        onUnlike={handleUnlike}
        onDelete={handleDelete}
      />

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  notFoundText: {
    fontSize: 16,
  },
  actionButton: {
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  signInButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginTop: 8,
  },
  bottomPadding: {
    height: 32,
  },
});
