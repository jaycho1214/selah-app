import { useColors } from "@/hooks/use-colors";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Stack, useLocalSearchParams } from "expo-router";
import {
  forwardRef,
  startTransition,
  Suspense,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { ErrorBoundary } from "@/components/error-boundary";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  IS_LIQUID_GLASS,
  useTransparentHeaderPadding,
} from "@/hooks/use-transparent-header";
import {
  graphql,
  useLazyLoadQuery,
  useMutation,
  usePaginationFragment,
  useRelayEnvironment,
} from "react-relay";
import { fetchQuery } from "relay-runtime";

import { SignInSheet } from "@/components/auth/sign-in-sheet";
import { useSession } from "@/components/providers/session-provider";
import {
  ReportSheet,
  type ReportSheetRef,
} from "@/components/report/report-sheet";
import { EmptyState } from "@/components/ui/empty-state";
import { Text } from "@/components/ui/text";
import {
  PostComposer,
  type PostComposerRef,
} from "@/components/composer/post-composer";
import { ReflectionItem } from "@/components/verse/reflection-item";
import { useAnalytics } from "@/lib/analytics";
import { createLexicalState } from "@/lib/lexical/html-to-lexical";
import { uploadPostImages } from "@/lib/upload-images";
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
            headerTransparent: IS_LIQUID_GLASS,
            headerStyle: {
              backgroundColor: IS_LIQUID_GLASS ? "transparent" : colors.bg,
            },
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
          headerTransparent: IS_LIQUID_GLASS,
          headerStyle: {
            backgroundColor: IS_LIQUID_GLASS ? "transparent" : colors.bg,
          },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          headerBackTitle: "",
          headerBackButtonDisplayMode: "minimal",
        }}
      />

      <ErrorBoundary>
        <Suspense
          fallback={
            <View style={[styles.container, styles.center]}>
              <ActivityIndicator size="large" color={colors.accent} />
            </View>
          }
        >
          <PostContent postId={id} colors={colors} />
        </Suspense>
      </ErrorBoundary>
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
  const contentPaddingTop = useTransparentHeaderPadding();
  const { session } = useSession();
  const { capture } = useAnalytics();
  const composerRef = useRef<PostComposerRef>(null);
  const signInSheetRef = useRef<BottomSheetModal>(null);
  const childPostsRef = useRef<ChildPostsListRef>(null);
  const reportSheetRef = useRef<ReportSheetRef>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    completed: number;
    total: number;
  } | null>(null);
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const environment = useRelayEnvironment();

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
    try {
      await fetchQuery(environment, postQuery, { postId }).toPromise();
    } finally {
      setIsRefreshing(false);
    }
  }, [environment, postId]);

  const submitReply = useCallback(
    (
      lexicalContent: string,
      connections: string[],
      imageIds: string[] | undefined,
      postData: {
        images: { uri: string }[];
        poll: { options: string[]; deadline: Date } | null;
      },
    ) => {
      if (!post) return;
      commitCreateReply({
        variables: {
          input: {
            parentId: post.id,
            content: lexicalContent,
            ...(imageIds && imageIds.length > 0 && { imageIds }),
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
        onCompleted: (response) => {
          const newPostId = response.bibleVersePostCreate?.bibleVersePost?.id;
          if (newPostId) {
            capture("post_created", {
              post_id: newPostId,
              has_images: postData.images.length > 0,
              has_poll: !!postData.poll,
              is_reply: true,
            });
          }
          composerRef.current?.clear();
        },
        onError: (error) => {
          console.error("Failed to create reply:", error);
        },
      });
    },
    [post, commitCreateReply, capture],
  );

  const handleSubmitReply = useCallback(
    (postData: {
      content: string;
      images: {
        uri: string;
        width: number;
        height: number;
        mimeType?: string;
      }[];
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

      // Upload images first, then create the reply
      if (postData.images.length > 0) {
        setIsUploading(true);
        setUploadProgress({ completed: 0, total: postData.images.length });
        uploadPostImages(postData.images, (completed, total) => {
          setUploadProgress({ completed, total });
        })
          .then((imageIds) => {
            submitReply(lexicalContent, connections, imageIds, postData);
          })
          .catch((error) => {
            console.error("Failed to upload images:", error);
            // Still create the reply without images
            submitReply(lexicalContent, connections, undefined, postData);
          })
          .finally(() => {
            setIsUploading(false);
            setUploadProgress(null);
          });
      } else {
        submitReply(lexicalContent, connections, undefined, postData);
      }
    },
    [post?.id, connectionId, submitReply],
  );

  const handleLike = useCallback(
    (id: string) => {
      capture("post_liked", { post_id: id });
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
    [commitLike, capture],
  );

  const handleUnlike = useCallback(
    (id: string) => {
      capture("post_unliked", { post_id: id });
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
    [commitUnlike, capture],
  );

  const handleDelete = useCallback(
    (deletedId: string) => {
      Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            capture("post_deleted", { post_id: deletedId });
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
        },
      ]);
    },
    [connectionId, commitDelete, post?.id, capture],
  );

  const handleAuthRequired = useCallback(() => {
    signInSheetRef.current?.present();
  }, []);

  const handleReport = useCallback((postId: string) => {
    reportSheetRef.current?.present({ type: "post", targetId: postId });
  }, []);

  if (!post) {
    return (
      <View style={[styles.container, styles.center]}>
        <EmptyState variant="inline" title="Post not found" />
      </View>
    );
  }

  return (
    <View style={styles.contentContainer}>
      <ScrollView
        style={styles.scrollView}
        contentInset={{ top: contentPaddingTop }}
        scrollIndicatorInsets={{ top: contentPaddingTop }}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.textMuted}
            colors={[colors.accent]}
            progressViewOffset={contentPaddingTop}
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
          onReport={handleReport}
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
          onReport={handleReport}
          onConnectionId={setConnectionId}
        />

        {/* Bottom padding for composer */}
        <View style={{ height: 200 }} />
      </ScrollView>

      {/* Bottom Composer */}
      <PostComposer
        ref={composerRef}
        colors={colors}
        onSubmit={handleSubmitReply}
        placeholder="Write a reply..."
        isAuthenticated={isAuthenticated}
        onAuthRequired={handleAuthRequired}
        isSubmitting={isUploading || isCreatingReply}
        uploadProgress={uploadProgress}
      />

      {/* Sign-in Sheet */}
      <SignInSheet ref={signInSheetRef} />
      <ReportSheet ref={reportSheetRef} />
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
    onReport?: (id: string) => void;
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
    onReport,
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
        startTransition(() => {
          refetch({}, { fetchPolicy: "store-and-network" });
        });
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
      <EmptyState
        variant="inline"
        title="No replies yet"
        message="Be the first to reply!"
      />
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
          onReport={onReport}
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
});
