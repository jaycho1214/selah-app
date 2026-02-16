import * as Haptics from "expo-haptics";
import { RelativePathString, router } from "expo-router";
import { BookOpen, Settings, Share2 } from "lucide-react-native";
import {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { ErrorBoundary } from "@/components/error-boundary";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Share,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { graphql, useLazyLoadQuery, useMutation } from "react-relay";

import { useSession } from "@/components/providers/session-provider";
import { useAnalytics } from "@/lib/analytics";
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
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Text } from "@/components/ui/text";
import { useColors } from "@/hooks/use-colors";
import type { profileLikeReflectionMutation } from "@/lib/relay/__generated__/profileLikeReflectionMutation.graphql";
import type { profileUnlikeReflectionMutation } from "@/lib/relay/__generated__/profileUnlikeReflectionMutation.graphql";
import type { profileDeleteReflectionMutation } from "@/lib/relay/__generated__/profileDeleteReflectionMutation.graphql";
import type { profileOwnProfileQuery } from "@/lib/relay/__generated__/profileOwnProfileQuery.graphql";

const ownProfileQuery = graphql`
  query profileOwnProfileQuery {
    user {
      id
      name
      username
      bio
      image {
        url
      }
      followerCount
      followingCount
      ...profilePostsListFragment
      ...profileRepliesListFragment
      ...profileLikesListFragment
    }
  }
`;

const likeReflectionMutation = graphql`
  mutation profileLikeReflectionMutation($id: ID!) {
    bibleVersePostLike(id: $id) {
      likedAt
    }
  }
`;

const unlikeReflectionMutation = graphql`
  mutation profileUnlikeReflectionMutation($id: ID!) {
    bibleVersePostUnlike(id: $id) {
      likedAt
    }
  }
`;

const deleteReflectionMutation = graphql`
  mutation profileDeleteReflectionMutation($id: ID!, $connections: [ID!]!) {
    bibleVersePostDelete(id: $id) {
      deletedIds @deleteEdge(connections: $connections)
    }
  }
`;

type ProfileTab = "posts" | "replies" | "likes";

export default function ProfileScreen() {
  const { isAuthenticated } = useSession();
  const colors = useColors();

  if (!isAuthenticated) {
    return <UnauthenticatedProfile />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <ErrorBoundary propagateServerErrors>
        <Suspense fallback={<ProfileSkeletonEnhanced />}>
          <AuthenticatedProfile />
        </Suspense>
      </ErrorBoundary>
    </SafeAreaView>
  );
}

function UnauthenticatedProfile() {
  const { presentSignIn } = useSession();
  const colors = useColors();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.topBar}>
        <View style={styles.topBarSpacer} />
        <Pressable
          onPress={() => router.push("/reading-plans")}
          hitSlop={8}
          style={styles.topBarIcon}
        >
          <BookOpen size={22} color={colors.text} strokeWidth={1.5} />
        </Pressable>
        <Pressable onPress={() => router.push("/settings")} hitSlop={8}>
          <Settings size={24} color={colors.text} strokeWidth={1.5} />
        </Pressable>
      </View>
      <EmptyState
        title="Your space on Selah"
        message="Sign in to track your reading, share reflections, and connect with the community."
        action={{ label: "Sign In", onPress: presentSignIn }}
      />
    </SafeAreaView>
  );
}

function AuthenticatedProfile() {
  const { session } = useSession();
  const colors = useColors();
  const { capture } = useAnalytics();
  const postsListRef = useRef<ProfilePostsListRef>(null);
  const repliesListRef = useRef<ProfileRepliesListRef>(null);
  const likesListRef = useRef<ProfileLikesListRef>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<ProfileTab>("posts");
  const [, startTransition] = useTransition();
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const data = useLazyLoadQuery<profileOwnProfileQuery>(
    ownProfileQuery,
    {},
    {
      fetchPolicy: "store-and-network",
    },
  );
  const user = data.user;

  const [commitLike] = useMutation<profileLikeReflectionMutation>(
    likeReflectionMutation,
  );
  const [commitUnlike] = useMutation<profileUnlikeReflectionMutation>(
    unlikeReflectionMutation,
  );
  const [commitDelete] = useMutation<profileDeleteReflectionMutation>(
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

  useEffect(() => {
    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, []);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    startTransition(() => {
      postsListRef.current?.refetch();
      repliesListRef.current?.refetch();
      likesListRef.current?.refetch();
    });
    refreshTimerRef.current = setTimeout(() => setIsRefreshing(false), 500);
  }, [startTransition]);

  const handleEditProfile = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/user-edit" as RelativePathString);
  };

  const handleShareProfile = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (user?.username) {
      capture("profile_shared", { username: user.username });
      await Share.share({
        message: `Check out @${user.username} on Selah`,
        url: `https://selah.kr/@${user.username}`,
      });
    }
  };

  const handleTabPress = useCallback((tab: ProfileTab) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    startTransition(() => {
      setActiveTab(tab);
    });
  }, []);

  if (!user) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <>
      <View style={styles.topBar}>
        <View style={styles.topBarSpacer} />
        <Pressable
          onPress={() => router.push("/reading-plans")}
          hitSlop={8}
          style={styles.topBarIcon}
        >
          <BookOpen size={22} color={colors.text} strokeWidth={1.5} />
        </Pressable>
        <Pressable onPress={() => router.push("/settings")} hitSlop={8}>
          <Settings size={24} color={colors.text} strokeWidth={1.5} />
        </Pressable>
      </View>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.textMuted}
            colors={[colors.accent]}
          />
        }
      >
        <ProfileHeaderEnhanced
          name={user.name}
          username={user.username}
          bio={user.bio}
          imageUrl={user.image?.url}
        >
          <View style={styles.headerButtons}>
            <Button
              variant="outline"
              style={styles.editButton}
              onPress={handleEditProfile}
            >
              <Text style={[styles.editButtonText, { color: colors.text }]}>
                Edit Profile
              </Text>
            </Button>
            <Pressable
              onPress={handleShareProfile}
              style={[styles.shareButton, { borderColor: colors.border }]}
            >
              <Share2 size={18} color={colors.text} strokeWidth={2} />
            </Pressable>
          </View>
        </ProfileHeaderEnhanced>

        <ProfileStatsEnhanced
          userId={user.id}
          followerCount={user.followerCount}
          followingCount={user.followingCount}
        />

        {/* Tabs */}
        <View
          style={[styles.tabsContainer, { borderBottomColor: colors.border }]}
        >
          <Pressable onPress={() => handleTabPress("posts")} style={styles.tab}>
            <Text
              style={[
                styles.tabText,
                {
                  color: activeTab === "posts" ? colors.text : colors.textMuted,
                },
              ]}
            >
              Posts
            </Text>
            {activeTab === "posts" && (
              <View
                style={[styles.tabIndicator, { backgroundColor: colors.text }]}
              />
            )}
          </Pressable>

          <Pressable
            onPress={() => handleTabPress("replies")}
            style={styles.tab}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    activeTab === "replies" ? colors.text : colors.textMuted,
                },
              ]}
            >
              Replies
            </Text>
            {activeTab === "replies" && (
              <View
                style={[styles.tabIndicator, { backgroundColor: colors.text }]}
              />
            )}
          </Pressable>

          <Pressable onPress={() => handleTabPress("likes")} style={styles.tab}>
            <Text
              style={[
                styles.tabText,
                {
                  color: activeTab === "likes" ? colors.text : colors.textMuted,
                },
              ]}
            >
              Likes
            </Text>
            {activeTab === "likes" && (
              <View
                style={[styles.tabIndicator, { backgroundColor: colors.text }]}
              />
            )}
          </Pressable>
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
          />
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
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
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  editButton: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  shareButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
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
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  topBarSpacer: {
    flex: 1,
  },
  topBarIcon: {
    marginRight: 16,
  },
  bottomPadding: {
    height: 40,
  },
});
