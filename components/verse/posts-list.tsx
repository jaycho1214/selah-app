import { forwardRef, useImperativeHandle } from "react";
import { View, StyleSheet } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { graphql, usePaginationFragment } from "react-relay";
import { MessageCircle } from "lucide-react-native";

import { Text } from "@/components/ui/text";
import { ReflectionItem } from "@/components/verse/reflection-item";
import type { postsListFragment$key } from "@/lib/relay/__generated__/postsListFragment.graphql";

interface PostsListProps {
  verseRef: postsListFragment$key;
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
}

export interface PostsListRef {
  refetch: () => void;
  connectionId: string | null;
}

export const PostsList = forwardRef<PostsListRef, PostsListProps>(
  function PostsList(
    { verseRef, colors, currentUserId, onLike, onUnlike, onDelete },
    ref,
  ) {
    const { data, refetch } = usePaginationFragment(
      graphql`
        fragment postsListFragment on BibleVerse
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 20 }
          cursor: { type: "String" }
        )
        @refetchable(queryName: "postsListPaginationQuery") {
          id
          posts(first: $count, after: $cursor)
            @connection(key: "postsList_posts") {
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
      `,
      verseRef,
    );

    const posts = data.posts?.edges ?? [];
    const connectionId = data.posts?.__id ?? null;

    // Expose refetch and connectionId to parent
    useImperativeHandle(
      ref,
      () => ({
        refetch: () => {
          refetch({}, { fetchPolicy: "store-and-network" });
        },
        connectionId,
      }),
      [refetch, connectionId],
    );

    if (posts.length === 0) {
      return (
        <Animated.View
          entering={FadeIn.duration(400).delay(400)}
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
              styles.emptyIconContainer,
              { backgroundColor: colors.surfaceElevated },
            ]}
          >
            <MessageCircle
              size={24}
              color={colors.textMuted}
              strokeWidth={1.5}
            />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            Be the first to share
          </Text>
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>
            What does this verse mean to you?
          </Text>
        </Animated.View>
      );
    }

    return (
      <View style={styles.postsList}>
        {posts.map((edge, index) => (
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
            index={index}
            currentUserId={currentUserId}
            onLike={onLike}
            onUnlike={onUnlike}
            onDelete={onDelete}
          />
        ))}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  postsList: {
    // Full bleed - no horizontal padding
  },
  // Empty State
  emptyCard: {
    alignItems: "center",
    padding: 36,
    marginHorizontal: 16,
    marginTop: 24,
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
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 21,
    maxWidth: 260,
  },
});
