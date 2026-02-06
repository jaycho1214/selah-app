import * as Haptics from "expo-haptics";
import { MessageCircle, Users } from "lucide-react-native";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  FadeIn,
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
} from "react-relay";

import { useSession } from "@/components/providers/session-provider";
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
  }, [activeTab]);

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
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { session } = useSession();
  const currentUserId = session?.user?.id ?? null;
  const [isRefreshing, setIsRefreshing] = useState(false);
  const connectionIdRef = useRef<string | null>(null);

  // Fetch initial data
  const queryData = useLazyLoadQuery<postsScreenQuery>(PostsQuery, {});

  // Setup pagination
  const { data, loadNext, hasNext, isLoadingNext, refetch } =
    usePaginationFragment<postsScreenQuery, postsScreenForYouFragment$key>(
      ForYouFragment,
      queryData
    );

  const posts = data.bibleVersePosts?.edges ?? [];
  connectionIdRef.current = data.bibleVersePosts?.__id ?? null;

  // Mutations
  const [commitLike] = useMutation<postsScreenLikeMutation>(LikeMutation);
  const [commitUnlike] = useMutation<postsScreenUnlikeMutation>(UnlikeMutation);
  const [commitDelete] = useMutation<postsScreenDeleteMutation>(DeleteMutation);

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
    [commitLike]
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
    [commitUnlike]
  );

  const handleDelete = useCallback(
    (postId: string) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
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
    [commitDelete]
  );

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    refetch(
      {},
      {
        fetchPolicy: "store-and-network",
        onComplete: () => setIsRefreshing(false),
      }
    );
  }, [refetch]);

  const handleLoadMore = useCallback(() => {
    if (hasNext && !isLoadingNext) {
      loadNext(20);
    }
  }, [hasNext, isLoadingNext, loadNext]);

  const emptyState = (
    <Animated.View
      entering={FadeIn.duration(400).delay(200)}
      style={[
        styles.emptyCard,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          marginTop: 40,
        },
      ]}
    >
      <View
        style={[
          styles.emptyIconContainer,
          { backgroundColor: colors.surfaceElevated },
        ]}
      >
        <MessageCircle size={24} color={colors.textMuted} strokeWidth={1.5} />
      </View>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        No posts yet
      </Text>
      <Text style={[styles.emptyText, { color: colors.textMuted }]}>
        Be the first to share a reflection on a Bible verse
      </Text>
    </Animated.View>
  );

  return (
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
      currentUserId={currentUserId}
      emptyState={emptyState}
      contentContainerStyle={{
        paddingTop: TAB_BAR_HEIGHT + insets.top,
        paddingBottom: insets.bottom + 100,
      }}
    />
  );
}

// ---------- Following Feed ----------

function FollowingFeed({
  onSwitchToForYou,
}: {
  onSwitchToForYou: () => void;
}) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { isAuthenticated, presentSignIn } = useSession();

  if (!isAuthenticated) {
    return (
      <View
        style={[
          styles.followingContainer,
          {
            paddingTop: TAB_BAR_HEIGHT + insets.top + 60,
            paddingBottom: insets.bottom + 100,
          },
        ]}
      >
        <Animated.View
          entering={FadeIn.duration(400).delay(200)}
          style={[
            styles.emptyCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.followingIconContainer,
              { backgroundColor: `${colors.accent}20` },
            ]}
          >
            <Users size={32} color={colors.accent} strokeWidth={1.5} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            Sign in to see your feed
          </Text>
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>
            Sign in to see posts from people you follow
          </Text>
          <Pressable
            onPress={presentSignIn}
            style={[styles.ctaButton, { backgroundColor: colors.accent }]}
          >
            <Text style={[styles.ctaButtonText, { color: "#fff" }]}>
              Sign In
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    );
  }

  // Authenticated but no following feed from backend yet
  return (
    <View
      style={[
        styles.followingContainer,
        {
          paddingTop: TAB_BAR_HEIGHT + insets.top + 60,
          paddingBottom: insets.bottom + 100,
        },
      ]}
    >
      <Animated.View
        entering={FadeIn.duration(400).delay(200)}
        style={[
          styles.emptyCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <View
          style={[
            styles.followingIconContainer,
            { backgroundColor: `${colors.accent}20` },
          ]}
        >
          <Users size={32} color={colors.accent} strokeWidth={1.5} />
        </View>
        <Text style={[styles.emptyTitle, { color: colors.text }]}>
          Follow people to see their posts here
        </Text>
        <Text style={[styles.emptyText, { color: colors.textMuted }]}>
          Posts from people you follow will show up in this feed
        </Text>
        <Pressable
          onPress={onSwitchToForYou}
          style={[styles.ctaButton, { backgroundColor: colors.accent }]}
        >
          <Text style={[styles.ctaButtonText, { color: "#fff" }]}>
            Discover Posts
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

// ---------- Posts Screen ----------

export default function PostsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const pagerRef = useRef<PagerView>(null);
  const { activeTab, setActiveTab } = useFeedStore();
  const [currentTab, setCurrentTab] = useState(activeTab);

  const handlePageSelected = useCallback(
    (e: { nativeEvent: { position: number } }) => {
      const position = e.nativeEvent.position;
      if (position !== currentTab) {
        setCurrentTab(position);
        setActiveTab(position);
      }
    },
    [currentTab, setActiveTab]
  );

  const handleTabPress = useCallback(
    (index: number) => {
      if (index !== currentTab) {
        pagerRef.current?.setPage(index);
      }
    },
    [currentTab]
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
        <View
          key="for-you"
          style={styles.page}
          collapsable={false}
        >
          <Suspense
            fallback={
              <FeedSkeleton
                style={{
                  paddingTop: TAB_BAR_HEIGHT + insets.top,
                }}
              />
            }
          >
            <ForYouFeed />
          </Suspense>
        </View>
        <View
          key="following"
          style={styles.page}
          collapsable={false}
        >
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
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
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
    alignItems: "center",
    paddingHorizontal: 16,
  },
  followingIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  // Shared empty state
  emptyCard: {
    alignItems: "center",
    padding: 36,
    marginHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: "dashed",
  },
  emptyIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 21,
    maxWidth: 260,
  },
  // CTA button
  ctaButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  ctaButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
