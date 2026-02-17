import * as Haptics from "expo-haptics";
import {
  RelativePathString,
  Stack,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { Ban, EllipsisVertical } from "lucide-react-native";
import React, {
  Suspense,
  useCallback,
  useRef,
  useState,
  useTransition,
} from "react";
import { ErrorBoundary } from "@/components/error-boundary";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  graphql,
  useLazyLoadQuery,
  useMutation,
  useRelayEnvironment,
} from "react-relay";
import { fetchQuery } from "relay-runtime";

import { ProfileHeaderEnhanced } from "@/components/profile/profile-header-enhanced";
import {
  ProfilePostsList,
  type ProfilePostsListRef,
} from "@/components/profile/profile-posts-list";
import {
  ProfileRepliesList,
  type ProfileRepliesListRef,
} from "@/components/profile/profile-replies-list";
import {
  ProfileLikesList,
  type ProfileLikesListRef,
} from "@/components/profile/profile-likes-list";
import { ProfileSkeletonEnhanced } from "@/components/profile/profile-skeleton-enhanced";
import { ProfileStatsEnhanced } from "@/components/profile/profile-stats-enhanced";
import { useSession } from "@/components/providers/session-provider";
import {
  ReportSheet,
  type ReportSheetRef,
} from "@/components/report/report-sheet";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Text } from "@/components/ui/text";
import { FollowButton } from "@/components/user/follow-button";
import {
  UserActionsSheet,
  type UserActionsSheetRef,
} from "@/components/user/user-actions-sheet";
import { useColors } from "@/hooks/use-colors";
import {
  IS_LIQUID_GLASS,
  useTransparentHeaderPadding,
} from "@/hooks/use-transparent-header";
import { useAnalytics } from "@/lib/analytics";
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
      isBlocked
      isBlockingMe
      ...followButton_user
      ...profilePostsListFragment
      ...profileRepliesListFragment
      ...profileLikesListFragment
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

type ProfileTab = "posts" | "replies" | "likes";

export default function UserProfileScreen() {
  const colors = useColors();

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Profile",
          headerTransparent: IS_LIQUID_GLASS,
          headerStyle: {
            backgroundColor: IS_LIQUID_GLASS ? "transparent" : colors.bg,
          },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <ErrorBoundary>
        <Suspense fallback={<SkeletonFallback />}>
          <UserProfileContent />
        </Suspense>
      </ErrorBoundary>
    </View>
  );
}

function SkeletonFallback() {
  const contentPaddingTop = useTransparentHeaderPadding();
  const insets = useSafeAreaInsets();
  // On transparent headers, useHeaderHeight() may return 0 before layout.
  // Fall back to safe area inset + standard nav bar height (44pt).
  const paddingTop = IS_LIQUID_GLASS
    ? contentPaddingTop > 0
      ? contentPaddingTop
      : insets.top + 44
    : 0;

  return (
    <View style={{ paddingTop }}>
      <ProfileSkeletonEnhanced />
    </View>
  );
}

function UserProfileContent() {
  const { username } = useLocalSearchParams<{ username: string }>();
  const { session, presentSignIn } = useSession();
  const colors = useColors();
  const router = useRouter();
  const contentPaddingTop = useTransparentHeaderPadding();
  const insets = useSafeAreaInsets();

  const { capture } = useAnalytics();
  const postsListRef = useRef<ProfilePostsListRef>(null);
  const repliesListRef = useRef<ProfileRepliesListRef>(null);
  const likesListRef = useRef<ProfileLikesListRef>(null);
  const reportSheetRef = useRef<ReportSheetRef>(null);
  const userActionsSheetRef = useRef<UserActionsSheetRef>(null);

  const [activeTab, setActiveTab] = useState<ProfileTab>("posts");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [, startTransition] = useTransition();
  const environment = useRelayEnvironment();

  // Fetch profile data
  const data = useLazyLoadQuery<UsernameQuery>(
    userProfileQuery,
    {
      username: username ?? "",
    },
    {
      fetchPolicy: "store-and-network",
    },
  );

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
      capture("post_liked", { post_id: postId });
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
    [commitLike, capture],
  );

  const handleUnlike = useCallback(
    (postId: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      capture("post_unliked", { post_id: postId });
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
    [commitUnlike, capture],
  );

  const handleDelete = useCallback(
    (postId: string) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      capture("post_deleted", { post_id: postId });
      const connectionId = postsListRef.current?.connectionId;
      const connections = connectionId ? [connectionId] : [];

      commitDelete({
        variables: { id: postId, connections },
        onError: (error) => {
          console.error("Failed to delete post:", error);
        },
      });
    },
    [commitDelete, capture],
  );

  const handleEditProfile = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/user-edit" as RelativePathString);
  };

  const handleReportPost = useCallback((postId: string) => {
    reportSheetRef.current?.present({ type: "post", targetId: postId });
  }, []);

  const handleReportUser = useCallback(() => {
    if (user) {
      reportSheetRef.current?.present({ type: "user", targetId: user.id });
    }
  }, [user]);

  const handlePresentUserActions = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    userActionsSheetRef.current?.present();
  }, []);

  const handleTabPress = useCallback((tab: ProfileTab) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    startTransition(() => {
      setActiveTab(tab);
    });
  }, []);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await fetchQuery(environment, userProfileQuery, {
        username: username ?? "",
      }).toPromise();
    } finally {
      setIsRefreshing(false);
    }
  }, [environment, username]);

  // User not found
  if (!user) {
    return (
      <View style={[styles.container, styles.center]}>
        <EmptyState variant="inline" title="User not found" />
      </View>
    );
  }

  const isOwnProfile = session?.user?.id === user.id;

  // Blocked by this user
  if (user.isBlockingMe && !isOwnProfile) {
    return (
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: contentPaddingTop,
          paddingBottom: insets.bottom + 32,
        }}
      >
        <ProfileHeaderEnhanced
          name={user.name}
          username={user.username}
          bio={null}
          imageUrl={user.image?.url}
        />
        <View style={styles.blockedContainer}>
          <EmptyState variant="inline" title="This profile is not available" />
        </View>
      </ScrollView>
    );
  }

  // Normal profile view
  return (
    <>
      {!isOwnProfile && session?.user && (
        <Stack.Screen
          options={{
            headerRight: () => (
              <Pressable
                onPress={handlePresentUserActions}
                hitSlop={12}
                style={styles.headerRightButton}
              >
                <EllipsisVertical
                  size={22}
                  color={colors.text}
                  strokeWidth={1.5}
                />
              </Pressable>
            ),
          }}
        />
      )}
      <View style={{ flex: 1, paddingTop: contentPaddingTop }}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: insets.bottom + 32,
          }}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={colors.textMuted}
              colors={[colors.accent]}
            />
          }
        >
          {/* Profile Header */}
          <ProfileHeaderEnhanced
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
            ) : user.isBlocked ? (
              <Pressable
                onPress={() => userActionsSheetRef.current?.present()}
                style={styles.blockedButton}
              >
                <Ban size={14} color="#dc2626" strokeWidth={2} />
                <Text style={styles.blockedButtonText}>Blocked</Text>
              </Pressable>
            ) : session?.user ? (
              <FollowButton userRef={user} />
            ) : (
              <Button style={styles.actionButton} onPress={presentSignIn}>
                <Text style={styles.signInButtonText}>Sign in to Follow</Text>
              </Button>
            )}
          </ProfileHeaderEnhanced>

          {/* Stats Row */}
          <ProfileStatsEnhanced
            userId={user.id}
            followerCount={user.followerCount ?? 0}
            followingCount={user.followingCount ?? 0}
          />

          {user.isBlocked && !isOwnProfile ? (
            <View style={styles.blockedContainer}>
              <Ban size={32} color={colors.textMuted} strokeWidth={1.5} />
              <Text style={[styles.blockedTitle, { color: colors.text }]}>
                @{user.username} is blocked
              </Text>
              <Text
                style={[styles.blockedSubtext, { color: colors.textMuted }]}
              >
                They can&apos;t see your posts or contact you on Selah.
              </Text>
            </View>
          ) : (
            <>
              {/* Tabs */}
              <View
                style={[
                  styles.tabsContainer,
                  { borderBottomColor: colors.border },
                ]}
              >
                {(["posts", "replies", "likes"] as const).map((tab) => (
                  <Pressable
                    key={tab}
                    onPress={() => handleTabPress(tab)}
                    style={styles.tab}
                  >
                    <Text
                      style={[
                        styles.tabText,
                        {
                          color:
                            activeTab === tab ? colors.text : colors.textMuted,
                        },
                      ]}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </Text>
                    {activeTab === tab && (
                      <View
                        style={[
                          styles.tabIndicator,
                          { backgroundColor: colors.text },
                        ]}
                      />
                    )}
                  </Pressable>
                ))}
              </View>

              {/* Tab Content */}
              {activeTab === "posts" && (
                <ProfilePostsList
                  ref={postsListRef}
                  userRef={user}
                  currentUserId={session?.user?.id}
                  onLike={handleLike}
                  onUnlike={handleUnlike}
                  onDelete={handleDelete}
                  onReport={handleReportPost}
                />
              )}

              {activeTab === "replies" && (
                <ProfileRepliesList
                  ref={repliesListRef}
                  userRef={user}
                  currentUserId={session?.user?.id}
                  onLike={handleLike}
                  onUnlike={handleUnlike}
                  onDelete={handleDelete}
                  onReport={handleReportPost}
                />
              )}

              {activeTab === "likes" && (
                <ProfileLikesList
                  ref={likesListRef}
                  userRef={user}
                  currentUserId={session?.user?.id}
                  onLike={handleLike}
                  onUnlike={handleUnlike}
                  onDelete={handleDelete}
                  onReport={handleReportPost}
                />
              )}
            </>
          )}

          <View style={styles.bottomPadding} />
        </ScrollView>
      </View>

      {!isOwnProfile && session?.user && (
        <>
          <UserActionsSheet
            ref={userActionsSheetRef}
            userId={user.id}
            username={user.username ?? ""}
            isBlocked={user.isBlocked}
            onReport={handleReportUser}
          />
          <ReportSheet ref={reportSheetRef} />
        </>
      )}
    </>
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
  headerRightButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
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
  tabsContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    marginTop: 16,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    position: "relative",
  },
  tabText: {
    fontSize: 15,
    fontWeight: "600",
  },
  tabIndicator: {
    position: "absolute",
    bottom: 0,
    left: 16,
    right: 16,
    height: 2,
    borderRadius: 1,
  },
  bottomPadding: {
    height: 32,
  },
  blockedButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(220, 38, 38, 0.3)",
    backgroundColor: "rgba(220, 38, 38, 0.08)",
  },
  blockedButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#dc2626",
  },
  blockedContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 48,
    paddingHorizontal: 32,
    gap: 12,
  },
  blockedTitle: {
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
  },
  blockedSubtext: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
});
