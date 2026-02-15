import React, { memo, useCallback } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { FlashList } from "@shopify/flash-list";

import { ReflectionItem } from "@/components/verse/reflection-item";
import { EmptyState } from "@/components/ui/empty-state";
import { BIBLE_BOOK_DETAILS } from "@/lib/bible/constants";
import type { BibleBook } from "@/lib/bible/types";
import { useColors } from "@/hooks/use-colors";

// ---------- Types ----------

interface PostUser {
  readonly id: string;
  readonly name?: string | null;
  readonly username?: string | null;
  readonly image?: { readonly url?: string | null } | null;
}

interface PostImage {
  readonly url?: string | null;
  readonly width?: number | null;
  readonly height?: number | null;
}

interface PostPollOption {
  readonly id: string;
  readonly text?: string | null;
  readonly voteCount?: number | null;
  readonly votePercentage?: number | null;
}

interface PostPoll {
  readonly id: string;
  readonly totalVotes?: number | null;
  readonly isExpired?: boolean | null;
  readonly deadline?: string | null;
  readonly userVote?: {
    readonly id?: string | null;
    readonly text?: string | null;
  } | null;
  readonly options?: ReadonlyArray<PostPollOption> | null;
}

interface PostVerse {
  readonly id?: string | null;
  readonly book?: string | null;
  readonly chapter?: number | null;
  readonly verse?: number | null;
  readonly translation?: string | null;
}

interface PostNode {
  readonly id: string;
  readonly content?: string | null;
  readonly createdAt: string;
  readonly likesCount: number;
  readonly childPostsCount: number;
  readonly likedAt?: string | null;
  readonly user: PostUser;
  readonly images: ReadonlyArray<PostImage>;
  readonly poll?: PostPoll | null;
  readonly verse?: PostVerse | null;
}

interface PostEdge {
  readonly node: PostNode;
}

interface FeedListProps {
  posts: ReadonlyArray<PostEdge>;
  isRefreshing: boolean;
  isLoadingNext: boolean;
  hasNext: boolean;
  onRefresh: () => void;
  onLoadMore: () => void;
  onLike: (id: string) => void;
  onUnlike: (id: string) => void;
  onDelete: (id: string) => void;
  onReport?: (id: string) => void;
  currentUserId: string | null;
  /** Custom empty state component rendered when posts array is empty */
  emptyState?: React.ReactNode;
  contentContainerStyle?: { paddingTop?: number; paddingBottom?: number };
}

// ---------- Component ----------

/**
 * Reusable paginated feed list component.
 * Renders post edges via FlashList with pull-to-refresh, infinite scroll,
 * and ReflectionItem rendering. Used by both For You and Following tabs.
 */
const FeedList = memo(function FeedList({
  posts,
  isRefreshing,
  isLoadingNext,
  hasNext,
  onRefresh,
  onLoadMore,
  onLike,
  onUnlike,
  onDelete,
  onReport,
  currentUserId,
  emptyState,
  contentContainerStyle,
}: FeedListProps) {
  const colors = useColors();

  const handleEndReached = useCallback(() => {
    if (hasNext && !isLoadingNext) {
      onLoadMore();
    }
  }, [hasNext, isLoadingNext, onLoadMore]);

  const keyExtractor = useCallback((item: PostEdge) => item.node.id, []);

  const renderItem = useCallback(
    ({ item, index }: { item: PostEdge; index: number }) => {
      const post = item.node;
      const verse = post.verse;

      // Get book name for verse reference
      const bookName = verse?.book
        ? (BIBLE_BOOK_DETAILS[verse.book as BibleBook]?.name ?? verse.book)
        : null;
      const verseReference =
        bookName && verse
          ? `${bookName} ${verse.chapter}:${verse.verse}`
          : null;

      return (
        <ReflectionItem
          id={post.id}
          content={post.content}
          user={post.user}
          createdAt={post.createdAt}
          images={post.images ?? []}
          poll={post.poll}
          verse={verse}
          verseReference={verseReference}
          likesCount={post.likesCount}
          childPostsCount={post.childPostsCount}
          likedAt={post.likedAt}
          colors={colors}
          index={index}
          currentUserId={currentUserId}
          onLike={onLike}
          onUnlike={onUnlike}
          onDelete={onDelete}
          onReport={onReport}
        />
      );
    },
    [colors, currentUserId, onLike, onUnlike, onDelete, onReport],
  );

  // Empty state
  if (posts.length === 0) {
    if (emptyState) {
      return <View style={styles.container}>{emptyState}</View>;
    }
    return (
      <View style={styles.container}>
        <EmptyState variant="inline" title="No posts yet" />
      </View>
    );
  }

  const ListFooter = isLoadingNext ? (
    <View style={styles.loadingMore}>
      <ActivityIndicator size="small" color={colors.textMuted} />
    </View>
  ) : null;

  return (
    <View style={styles.container}>
      <FlashList
        data={posts}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={ListFooter}
        contentContainerStyle={contentContainerStyle}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={colors.textMuted}
            colors={[colors.accent]}
          />
        }
      />
    </View>
  );
});

export default FeedList;

// ---------- Styles ----------

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingMore: {
    paddingVertical: 20,
    alignItems: "center",
  },
});
