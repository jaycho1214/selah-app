import * as Haptics from "expo-haptics";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { ErrorBoundary } from "@/components/error-boundary";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import PagerView from "react-native-pager-view";
import {
  graphql,
  useLazyLoadQuery,
  useMutation,
  usePaginationFragment,
  useRelayEnvironment,
} from "react-relay";
import { fetchQuery } from "relay-runtime";

import { useSession } from "@/components/providers/session-provider";
import { useAnalytics } from "@/lib/analytics";
import {
  ReportSheet,
  type ReportSheetRef,
} from "@/components/report/report-sheet";
import { EmptyState } from "@/components/ui/empty-state";
import { Text } from "@/components/ui/text";
import { useColors } from "@/hooks/use-colors";
import { useFeedStore } from "@/lib/stores/feed-store";
import { FeedSkeleton } from "@/components/feed/feed-skeleton";
import FeedList from "@/components/feed/feed-list";
import type { postsScreenQuery } from "@/lib/relay/__generated__/postsScreenQuery.graphql";
import type { postsScreenForYouFragment$key } from "@/lib/relay/__generated__/postsScreenForYouFragment.graphql";
import type { postsScreenLikeMutation } from "@/lib/relay/__generated__/postsScreenLikeMutation.graphql";
import type { postsScreenUnlikeMutation } from "@/lib/relay/__generated__/postsScreenUnlikeMutation.graphql";
import type { postsScreenDeleteMutation } from "@/lib/relay/__generated__/postsScreenDeleteMutation.graphql";
import type { postsScreenFollowingFeedQuery } from "@/lib/relay/__generated__/postsScreenFollowingFeedQuery.graphql";
import type { postsScreenFollowingFeedFragment$key } from "@/lib/relay/__generated__/postsScreenFollowingFeedFragment.graphql";

// ---------- Constants ----------

const TAB_LABELS = ["For You", "Following"] as const;
const TAB_BAR_HEIGHT = 46;

// ---------- GraphQL ----------

// Root query for posts feed
const PostsQuery = graphql`
  query postsScreenQuery {
    ...postsScreenForYouFragment
  }
`;

// For You pagination fragment
const ForYouFragment = graphql`
  fragment postsScreenForYouFragment on Query
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 20 }
    cursor: { type: "String" }
  )
  @refetchable(queryName: "postsScreenForYouPaginationQuery") {
    bibleVersePosts(first: $count, after: $cursor)
      @connection(key: "forYouFeed_bibleVersePosts") {
      __id
      edges {
        node {
          id
          content
          createdAt
          likesCount
          childPostsCount
          likedAt
          user {
            id
            name
            username
            image {
              url
            }
          }
          images {
            url
            width
            height
          }
          poll {
            id
            totalVotes
            isExpired
            deadline
            userVote {
              id
              text
            }
            options {
              id
              text
              voteCount
              votePercentage
            }
          }
          verse {
            id
            book
            chapter
            verse
            translation
          }
        }
      }
    }
  }
`;

// Like mutation
const LikeMutation = graphql`
  mutation postsScreenLikeMutation($id: ID!) {
    bibleVersePostLike(id: $id) {
      likedAt
    }
  }
`;

// Unlike mutation
const UnlikeMutation = graphql`
  mutation postsScreenUnlikeMutation($id: ID!) {
    bibleVersePostUnlike(id: $id) {
      likedAt
    }
  }
`;

// Delete mutation
const DeleteMutation = graphql`
  mutation postsScreenDeleteMutation($id: ID!, $connections: [ID!]!) {
    bibleVersePostDelete(id: $id) {
      deletedIds @deleteEdge(connections: $connections)
    }
  }
`;

// ---------- Tab Bar ----------

function FeedTabBar({
  activeTab,
  onTabPress,
}: {
  activeTab: number;
  onTabPress: (index: number) => void;
}) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const indicatorPosition = useSharedValue(activeTab);
  const [tabWidth, setTabWidth] = useState(0);

  useEffect(() => {
    indicatorPosition.value = withTiming(activeTab, { duration: 250 });
  }, [activeTab, indicatorPosition]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorPosition.value * tabWidth }],
  }));

  return (
    <View
      style={[
        styles.tabBar,
        {
          paddingTop: insets.top,
          backgroundColor: colors.bg,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <View
        style={styles.tabBarRow}
        onLayout={(e) => {
          const width = e.nativeEvent.layout.width / TAB_LABELS.length;
          setTabWidth(width);
        }}
      >
        {TAB_LABELS.map((label, index) => (
          <Pressable
            key={label}
            onPress={() => onTabPress(index)}
            style={styles.tabItem}
          >
            <Text
              style={[
                styles.tabLabel,
                {
                  fontWeight: activeTab === index ? "700" : "500",
                  color: activeTab === index ? colors.text : colors.textMuted,
                },
              ]}
            >
              {label}
            </Text>
          </Pressable>
        ))}
        {/* Animated underline indicator */}
        {tabWidth > 0 && (
          <Animated.View
            style={[
              styles.tabIndicator,
              {
                width: tabWidth,
                backgroundColor: colors.accent,
              },
              indicatorStyle,
            ]}
          />
        )}
      </View>
    </View>
  );
}

// ---------- For You Feed ----------

function ForYouFeed() {
  const insets = useSafeAreaInsets();
  const { session } = useSession();
  const { capture } = useAnalytics();
  const currentUserId = session?.user?.id ?? null;
  const [isRefreshing, setIsRefreshing] = useState(false);
  const environment = useRelayEnvironment();
  const connectionIdRef = useRef<string | null>(null);
  const reportSheetRef = useRef<ReportSheetRef>(null);

  // Fetch initial data
  const queryData = useLazyLoadQuery<postsScreenQuery>(PostsQuery, {});

  // Setup pagination
  const { data, loadNext, hasNext, isLoadingNext } = usePaginationFragment<
    postsScreenQuery,
    postsScreenForYouFragment$key
  >(ForYouFragment, queryData);

  const posts = data.bibleVersePosts?.edges ?? [];
  connectionIdRef.current = data.bibleVersePosts?.__id ?? null;

  // Mutations
  const [commitLike] = useMutation<postsScreenLikeMutation>(LikeMutation);
  const [commitUnlike] = useMutation<postsScreenUnlikeMutation>(UnlikeMutation);
  const [commitDelete] = useMutation<postsScreenDeleteMutation>(DeleteMutation);

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
      Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            capture("post_deleted", { post_id: postId });
            const connections = connectionIdRef.current
              ? [connectionIdRef.current]
              : [];
            commitDelete({
              variables: { id: postId, connections },
              onError: (error) => {
                console.error("Failed to delete post:", error);
              },
            });
          },
        },
      ]);
    },
    [commitDelete, capture],
  );

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await fetchQuery(environment, PostsQuery, {}).toPromise();
    } finally {
      setIsRefreshing(false);
    }
  }, [environment]);

  const handleLoadMore = useCallback(() => {
    if (hasNext && !isLoadingNext) {
      loadNext(20);
    }
  }, [hasNext, isLoadingNext, loadNext]);

  const handleReport = useCallback((postId: string) => {
    reportSheetRef.current?.present({ type: "post", targetId: postId });
  }, []);

  const emptyState = (
    <EmptyState
      title="No posts yet"
      message="Be the first to share a reflection on a Bible verse"
      style={{ marginTop: 16 }}
    />
  );

  return (
    <>
      <FeedList
        posts={posts}
        isRefreshing={isRefreshing}
        isLoadingNext={isLoadingNext}
        hasNext={hasNext}
        onRefresh={handleRefresh}
        onLoadMore={handleLoadMore}
        onLike={handleLike}
        onUnlike={handleUnlike}
        onDelete={handleDelete}
        onReport={handleReport}
        currentUserId={currentUserId}
        emptyState={emptyState}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 100,
        }}
      />
      <ReportSheet ref={reportSheetRef} />
    </>
  );
}

// ---------- Following Feed ----------

const FollowingFeedQuery = graphql`
  query postsScreenFollowingFeedQuery {
    user {
      id
      followingCount
    }
    ...postsScreenFollowingFeedFragment
  }
`;

const FollowingFeedFragment = graphql`
  fragment postsScreenFollowingFeedFragment on Query
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 20 }
    cursor: { type: "String" }
  )
  @refetchable(queryName: "postsScreenFollowingFeedPaginationQuery") {
    followingBibleVersePosts(first: $count, after: $cursor)
      @connection(key: "followingFeed_followingBibleVersePosts") {
      __id
      edges {
        node {
          id
          content
          createdAt
          likesCount
          childPostsCount
          likedAt
          user {
            id
            name
            username
            image {
              url
            }
          }
          images {
            url
            width
            height
          }
          poll {
            id
            totalVotes
            isExpired
            deadline
            userVote {
              id
              text
            }
            options {
              id
              text
              voteCount
              votePercentage
            }
          }
          verse {
            id
            book
            chapter
            verse
            translation
          }
        }
      }
    }
  }
`;

function FollowingFeedContent({
  onSwitchToForYou,
}: {
  onSwitchToForYou: () => void;
}) {
  const insets = useSafeAreaInsets();
  const { session } = useSession();
  const { capture } = useAnalytics();
  const currentUserId = session?.user?.id ?? null;
  const [isRefreshing, setIsRefreshing] = useState(false);
  const environment = useRelayEnvironment();
  const connectionIdRef = useRef<string | null>(null);
  const reportSheetRef = useRef<ReportSheetRef>(null);

  const queryData = useLazyLoadQuery<postsScreenFollowingFeedQuery>(
    FollowingFeedQuery,
    {},
    { fetchPolicy: "store-and-network" },
  );

  const followingCount = queryData.user?.followingCount ?? 0;

  const { data, loadNext, hasNext, isLoadingNext } = usePaginationFragment<
    postsScreenFollowingFeedQuery,
    postsScreenFollowingFeedFragment$key
  >(FollowingFeedFragment, queryData);

  const posts = data.followingBibleVersePosts?.edges ?? [];
  connectionIdRef.current = data.followingBibleVersePosts?.__id ?? null;

  const [commitLike] = useMutation<postsScreenLikeMutation>(LikeMutation);
  const [commitUnlike] = useMutation<postsScreenUnlikeMutation>(UnlikeMutation);
  const [commitDelete] = useMutation<postsScreenDeleteMutation>(DeleteMutation);

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
      Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            capture("post_deleted", { post_id: postId });
            const connections = connectionIdRef.current
              ? [connectionIdRef.current]
              : [];
            commitDelete({
              variables: { id: postId, connections },
              onError: (error) => {
                console.error("Failed to delete post:", error);
              },
            });
          },
        },
      ]);
    },
    [commitDelete, capture],
  );

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await fetchQuery(environment, FollowingFeedQuery, {}).toPromise();
    } finally {
      setIsRefreshing(false);
    }
  }, [environment]);

  const handleLoadMore = useCallback(() => {
    if (hasNext && !isLoadingNext) {
      loadNext(20);
    }
  }, [hasNext, isLoadingNext, loadNext]);

  const handleReport = useCallback((postId: string) => {
    reportSheetRef.current?.present({ type: "post", targetId: postId });
  }, []);

  if (followingCount === 0) {
    return (
      <View
        style={[
          styles.followingContainer,
          { paddingBottom: insets.bottom + 100 },
        ]}
      >
        <EmptyState
          title="Follow people to see their posts here"
          message="Posts from people you follow will show up in this feed"
          action={{ label: "Discover Posts", onPress: onSwitchToForYou }}
        />
      </View>
    );
  }

  const emptyState = (
    <EmptyState
      title="No posts yet"
      message="When people you follow share reflections, they will appear here"
      action={{ label: "Discover Posts", onPress: onSwitchToForYou }}
      style={{ marginTop: 16 }}
    />
  );

  return (
    <>
      <FeedList
        posts={posts}
        isRefreshing={isRefreshing}
        isLoadingNext={isLoadingNext}
        hasNext={hasNext}
        onRefresh={handleRefresh}
        onLoadMore={handleLoadMore}
        onLike={handleLike}
        onUnlike={handleUnlike}
        onDelete={handleDelete}
        onReport={handleReport}
        currentUserId={currentUserId}
        emptyState={emptyState}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 100,
        }}
      />
      <ReportSheet ref={reportSheetRef} />
    </>
  );
}

function FollowingFeed({ onSwitchToForYou }: { onSwitchToForYou: () => void }) {
  const insets = useSafeAreaInsets();
  const { isAuthenticated, presentSignIn } = useSession();

  if (!isAuthenticated) {
    return (
      <View
        style={[
          styles.followingContainer,
          {
            paddingBottom: insets.bottom + 100,
          },
        ]}
      >
        <EmptyState
          title="See who you follow"
          message="Sign in to follow others and see their reflections here."
          action={{ label: "Sign In", onPress: presentSignIn }}
        />
      </View>
    );
  }

  return (
    <Suspense
      fallback={
        <View
          style={[
            styles.followingContainer,
            { paddingBottom: insets.bottom + 100 },
          ]}
        >
          <FeedSkeleton />
        </View>
      }
    >
      <FollowingFeedContent onSwitchToForYou={onSwitchToForYou} />
    </Suspense>
  );
}

// ---------- Posts Screen ----------

export default function PostsScreen() {
  const colors = useColors();
  const pagerRef = useRef<PagerView>(null);
  const activeTab = useFeedStore((s) => s.activeTab);
  const setActiveTab = useFeedStore((s) => s.setActiveTab);
  const [currentTab, setCurrentTab] = useState(activeTab);

  const handlePageSelected = useCallback(
    (e: { nativeEvent: { position: number } }) => {
      const position = e.nativeEvent.position;
      if (position !== currentTab) {
        setCurrentTab(position);
        setActiveTab(position);
      }
    },
    [currentTab, setActiveTab],
  );

  const handleTabPress = useCallback(
    (index: number) => {
      if (index !== currentTab) {
        pagerRef.current?.setPage(index);
      }
    },
    [currentTab],
  );

  const handleSwitchToForYou = useCallback(() => {
    pagerRef.current?.setPage(0);
  }, []);

  return (
    <View style={[styles.screen, { backgroundColor: colors.bg }]}>
      <FeedTabBar activeTab={currentTab} onTabPress={handleTabPress} />
      <PagerView
        ref={pagerRef}
        style={styles.pager}
        initialPage={activeTab}
        onPageSelected={handlePageSelected}
      >
        <View key="for-you" style={styles.page} collapsable={false}>
          <ErrorBoundary propagateServerErrors>
            <Suspense fallback={<FeedSkeleton />}>
              <ForYouFeed />
            </Suspense>
          </ErrorBoundary>
        </View>
        <View key="following" style={styles.page} collapsable={false}>
          <FollowingFeed onSwitchToForYou={handleSwitchToForYou} />
        </View>
      </PagerView>
    </View>
  );
}

// ---------- Styles ----------

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  // Tab bar
  tabBar: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  tabBarRow: {
    flexDirection: "row",
    position: "relative",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: TAB_BAR_HEIGHT,
  },
  tabLabel: {
    fontSize: 15,
  },
  tabIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    height: 3,
    borderRadius: 1.5,
  },
  // PagerView
  pager: {
    flex: 1,
  },
  page: {
    width: "100%",
    height: "100%",
  },
  // Following feed
  followingContainer: {
    flex: 1,
  },
});
