import { forwardRef, startTransition, useImperativeHandle } from "react";
import { View, StyleSheet } from "react-native";
import { graphql, usePaginationFragment } from "react-relay";
import { EmptyState } from "@/components/ui/empty-state";
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
  onReport?: (id: string) => void;
}

export interface PostsListRef {
  refetch: () => void;
  connectionId: string | null;
}

export const PostsList = forwardRef<PostsListRef, PostsListProps>(
  function PostsList(
    { verseRef, colors, currentUserId, onLike, onUnlike, onDelete, onReport },
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
          startTransition(() => {
            refetch({}, { fetchPolicy: "store-and-network" });
          });
        },
        connectionId,
      }),
      [refetch, connectionId],
    );

    if (posts.length === 0) {
      return (
        <EmptyState
          title="Be the first to share"
          message="What does this verse mean to you?"
          animationDelay={400}
        />
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
            onReport={onReport}
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
});
