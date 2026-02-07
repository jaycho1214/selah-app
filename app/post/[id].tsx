import { useColors } from "@/hooks/use-colors";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Stack, useLocalSearchParams } from "expo-router";
import {
  forwardRef,
  Suspense,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Keyboard,
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
  usePaginationFragment,
} from "react-relay";

import { SignInSheet } from "@/components/auth/sign-in-sheet";
import { useSession } from "@/components/providers/session-provider";
import { Text } from "@/components/ui/text";
import {
  ReflectionComposer,
  type ReflectionComposerRef,
} from "@/components/verse/reflection-composer";
import { ReflectionItem } from "@/components/verse/reflection-item";
import { createLexicalState } from "@/lib/lexical/html-to-lexical";
import type { IdChildrenFragment$key } from "@/lib/relay/__generated__/IdChildrenFragment.graphql";
import type { IdCreateReplyMutation } from "@/lib/relay/__generated__/IdCreateReplyMutation.graphql";
import type { IdPostDeleteMutation } from "@/lib/relay/__generated__/IdPostDeleteMutation.graphql";
import type { IdPostLikeMutation } from "@/lib/relay/__generated__/IdPostLikeMutation.graphql";
import type { IdPostQuery } from "@/lib/relay/__generated__/IdPostQuery.graphql";
import type { IdPostUnlikeMutation } from "@/lib/relay/__generated__/IdPostUnlikeMutation.graphql";

// Main post query
const postQuery = graphql`
  query IdPostQuery($postId: ID!) {
    bibleVersePostById(id: $postId) {
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
      ...IdChildrenFragment
    }
  }
`;

// Create reply mutation
const createReplyMutation = graphql`
  mutation IdCreateReplyMutation(
    $input: BibleVersePostCreateInput!
    $connections: [ID!]!
  ) {
    bibleVersePostCreate(input: $input) {
      bibleVersePost
        @prependNode(
          connections: $connections
          edgeTypeName: "BibleVersePostEdge"
        ) {
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
      }
    }
  }
`;

// Like mutation
const likeMutation = graphql`
  mutation IdPostLikeMutation($id: ID!) {
    bibleVersePostLike(id: $id) {
      likedAt
    }
  }
`;

// Unlike mutation
const unlikeMutation = graphql`
  mutation IdPostUnlikeMutation($id: ID!) {
    bibleVersePostUnlike(id: $id) {
      likedAt
    }
  }
`;

// Delete mutation
const deleteMutation = graphql`
  mutation IdPostDeleteMutation($id: ID!, $connections: [ID!]!) {
    bibleVersePostDelete(id: $id) {
      deletedIds @deleteEdge(connections: $connections)
    }
  }
`;

export default function PostDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();

  if (!id) {
    return (
      <View
        style={[
          styles.container,
          styles.center,
          { backgroundColor: colors.bg },
        ]}
      >
        <Stack.Screen
          options={{
            title: "Post",
            headerStyle: { backgroundColor: colors.bg },
            headerTintColor: colors.text,
            headerShadowVisible: false,
            headerBackButtonDisplayMode: "minimal",
          }}
        />
        <Text style={{ color: colors.textMuted }}>Invalid post</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Stack.Screen
        options={{
          title: "Post",
          headerStyle: { backgroundColor: colors.bg },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          headerBackTitle: "",
          headerBackButtonDisplayMode: "minimal",
        }}
      />

      <Suspense
        fallback={
          <View style={[styles.container, styles.center]}>
            <ActivityIndicator size="large" color={colors.accent} />
          </View>
        }
      >
        <PostContent postId={id} colors={colors} />
      </Suspense>
    </View>
  );
}

// Child posts fragment
const childPostsFragment = graphql`
  fragment IdChildrenFragment on BibleVersePost
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 20 }
    cursor: { type: "String" }
  )
  @refetchable(queryName: "IdChildrenPaginationQuery") {
    childPosts(first: $count, after: $cursor)
      @connection(key: "IdChildren_childPosts") {
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
        }
      }
    }
  }
`;

function PostContent({
  postId,
  colors,
}: {
  postId: string;
  colors: {
    bg: string;
    surface: string;
    surfaceElevated: string;
    border: string;
    text: string;
    textSecondary: string;
    textMuted: string;
    accent: string;
  };
}) {
  const insets = useSafeAreaInsets();
  const { session } = useSession();
  const composerRef = useRef<ReflectionComposerRef>(null);
  const signInSheetRef = useRef<BottomSheetModal>(null);
  const childPostsRef = useRef<ChildPostsListRef>(null);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [connectionId, setConnectionId] = useState<string | null>(null);

  const isAuthenticated = !!session?.user;

  // Fetch post data
  const data = useLazyLoadQuery<IdPostQuery>(postQuery, { postId });

  // Mutations
  const [commitCreateReply, isCreatingReply] =
    useMutation<IdCreateReplyMutation>(createReplyMutation);
  const [commitLike] = useMutation<IdPostLikeMutation>(likeMutation);
  const [commitUnlike] = useMutation<IdPostUnlikeMutation>(unlikeMutation);
  const [commitDelete] = useMutation<IdPostDeleteMutation>(deleteMutation);

  const post = data.bibleVersePostById;

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    childPostsRef.current?.refetch();
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    refreshTimerRef.current = setTimeout(() => setIsRefreshing(false), 500);
  }, []);

  // Cleanup refresh timer on unmount
  useEffect(() => {
    return () => {
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    };
  }, []);

  const handleSubmitReply = useCallback(
    (postData: {
      content: string;
      images: Array<{
        uri: string;
        width: number;
        height: number;
        mimeType?: string;
      }>;
      poll: { options: string[]; deadline: Date } | null;
    }) => {
      if (!post?.id) return;

      let lexicalContent: string;
      try {
        const parsedContent = JSON.parse(postData.content);
        if (parsedContent?.root?.type === "root") {
          lexicalContent = postData.content;
        } else {
          lexicalContent = JSON.stringify(createLexicalState(postData.content));
        }
      } catch {
        lexicalContent = JSON.stringify(createLexicalState(postData.content));
      }

      const connections = connectionId ? [connectionId] : [];

      Keyboard.dismiss();

      commitCreateReply({
        variables: {
          input: {
            parentId: post.id,
            content: lexicalContent,
            ...(postData.poll && {
              poll: {
                options: postData.poll.options,
                deadline: postData.poll.deadline.toISOString(),
              },
            }),
          },
          connections,
        },
        optimisticUpdater: (store) => {
          const parentPost = store.get(post.id);
          if (parentPost) {
            const currentCount =
              (parentPost.getValue("childPostsCount") as number) ?? 0;
            parentPost.setValue(currentCount + 1, "childPostsCount");
          }
        },
        onCompleted: () => {
          composerRef.current?.clear();
        },
        onError: (error) => {
          console.error("Failed to create reply:", error);
        },
      });
    },
    [post?.id, connectionId, commitCreateReply],
  );

  const handleLike = useCallback(
    (id: string) => {
      commitLike({
        variables: { id },
        optimisticUpdater: (store) => {
          const postRecord = store.get(id);
          if (postRecord) {
            postRecord.setValue(new Date().toISOString(), "likedAt");
            const currentCount =
              (postRecord.getValue("likesCount") as number) ?? 0;
            postRecord.setValue(currentCount + 1, "likesCount");
          }
        },
      });
    },
    [commitLike],
  );

  const handleUnlike = useCallback(
    (id: string) => {
      commitUnlike({
        variables: { id },
        optimisticUpdater: (store) => {
          const postRecord = store.get(id);
          if (postRecord) {
            postRecord.setValue(null, "likedAt");
            const currentCount =
              (postRecord.getValue("likesCount") as number) ?? 0;
            postRecord.setValue(Math.max(0, currentCount - 1), "likesCount");
          }
        },
      });
    },
    [commitUnlike],
  );

  const handleDelete = useCallback(
    (deletedId: string) => {
      const connections = connectionId ? [connectionId] : [];

      commitDelete({
        variables: { id: deletedId, connections },
        optimisticUpdater: (store) => {
          // Decrement parent post's childPostsCount if deleting a reply
          if (post?.id && deletedId !== post.id) {
            const parentPost = store.get(post.id);
            if (parentPost) {
              const currentCount =
                (parentPost.getValue("childPostsCount") as number) ?? 0;
              parentPost.setValue(
                Math.max(0, currentCount - 1),
                "childPostsCount",
              );
            }
          }
        },
        onError: (error) => {
          console.error("Failed to delete post:", error);
        },
      });
    },
    [connectionId, commitDelete, post?.id],
  );

  const handleAuthRequired = useCallback(() => {
    signInSheetRef.current?.present();
  }, []);

  if (!post) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={{ color: colors.textMuted }}>Post not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.contentContainer}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.textMuted}
            colors={[colors.accent]}
          />
        }
      >
        {/* Parent Post */}
        <ReflectionItem
          id={post.id}
          content={post.content}
          user={post.user}
          createdAt={post.createdAt}
          images={post.images ?? []}
          poll={post.poll}
          likesCount={post.likesCount}
          childPostsCount={post.childPostsCount}
          likedAt={post.likedAt}
          colors={colors}
          index={0}
          currentUserId={session?.user?.id}
          onLike={handleLike}
          onUnlike={handleUnlike}
          onDelete={handleDelete}
          disableNavigation
        />

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        {/* Replies Section Header */}
        <View style={styles.repliesHeader}>
          <Text style={[styles.repliesTitle, { color: colors.text }]}>
            Replies
          </Text>
        </View>

        {/* Child Posts */}
        <ChildPostsList
          ref={childPostsRef}
          postRef={post}
          colors={colors}
          currentUserId={session?.user?.id}
          onLike={handleLike}
          onUnlike={handleUnlike}
          onDelete={handleDelete}
          onConnectionId={setConnectionId}
        />

        {/* Bottom padding for composer */}
        <View style={{ height: 200 }} />
      </ScrollView>

      {/* Bottom Composer */}
      <ReflectionComposer
        ref={composerRef}
        colors={colors}
        onSubmit={handleSubmitReply}
        placeholder="Write a reply..."
        isAuthenticated={isAuthenticated}
        onAuthRequired={handleAuthRequired}
        isSubmitting={isCreatingReply}
      />

      {/* Sign-in Sheet */}
      <SignInSheet ref={signInSheetRef} />
    </View>
  );
}

interface ChildPostsListRef {
  refetch: () => void;
}

const ChildPostsList = forwardRef<
  ChildPostsListRef,
  {
    postRef: IdChildrenFragment$key;
    colors: {
      bg: string;
      surface: string;
      surfaceElevated: string;
      border: string;
      text: string;
      textSecondary: string;
      textMuted: string;
      accent: string;
    };
    currentUserId?: string | null;
    onLike: (id: string) => void;
    onUnlike: (id: string) => void;
    onDelete: (id: string) => void;
    onConnectionId: (id: string | null) => void;
  }
>(function ChildPostsList(
  {
    postRef,
    colors,
    currentUserId,
    onLike,
    onUnlike,
    onDelete,
    onConnectionId,
  },
  ref,
) {
  const { data, refetch } = usePaginationFragment(childPostsFragment, postRef);

  const childPosts = data.childPosts?.edges ?? [];
  const connId = data.childPosts?.__id ?? null;

  // Expose refetch to parent
  useImperativeHandle(
    ref,
    () => ({
      refetch: () => {
        refetch({}, { fetchPolicy: "store-and-network" });
      },
    }),
    [refetch],
  );

  // Report connection ID to parent
  useEffect(() => {
    onConnectionId(connId);
  }, [connId, onConnectionId]);

  if (childPosts.length === 0) {
    return (
      <View style={styles.emptyReplies}>
        <Text style={[styles.emptyText, { color: colors.textMuted }]}>
          No replies yet. Be the first to reply!
        </Text>
      </View>
    );
  }

  return (
    <View>
      {childPosts.map((edge, index) => (
        <ReflectionItem
          key={edge.node.id}
          id={edge.node.id}
          content={edge.node.content}
          user={edge.node.user}
          createdAt={edge.node.createdAt}
          images={edge.node.images ?? []}
          poll={edge.node.poll}
          likesCount={edge.node.likesCount}
          childPostsCount={edge.node.childPostsCount}
          likedAt={edge.node.likedAt}
          colors={colors}
          index={index + 1}
          currentUserId={currentUserId}
          onLike={onLike}
          onUnlike={onUnlike}
          onDelete={onDelete}
        />
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 8,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
  repliesHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  repliesTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  emptyReplies: {
    padding: 32,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
  },
});
