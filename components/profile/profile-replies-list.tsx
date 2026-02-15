import { forwardRef, memo, useCallback, useImperativeHandle } from "react";
import { StyleSheet, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { graphql, usePaginationFragment } from "react-relay";
import { EmptyState } from "@/components/ui/empty-state";
import { Text } from "@/components/ui/text";
import { ReflectionItem } from "@/components/verse/reflection-item";
import { BIBLE_BOOK_DETAILS } from "@/lib/bible/constants";
import { BibleBook } from "@/lib/bible/types";
import { useColors } from "@/hooks/use-colors";
import type { profileRepliesListFragment$key } from "@/lib/relay/__generated__/profileRepliesListFragment.graphql";

interface ProfileRepliesListProps {
  userRef: profileRepliesListFragment$key;
  currentUserId?: string | null;
  onLike: (id: string) => void;
  onUnlike: (id: string) => void;
  onDelete: (id: string) => void;
  onReport?: (id: string) => void;
}

export interface ProfileRepliesListRef {
  refetch: () => void;
  connectionId: string | null;
}

export const ProfileRepliesList = memo(
  forwardRef<ProfileRepliesListRef, ProfileRepliesListProps>(
    function ProfileRepliesList(
      { userRef, currentUserId, onLike, onUnlike, onDelete, onReport },
      ref,
    ) {
      const colors = useColors();
      const { data, loadNext, hasNext, isLoadingNext, refetch } =
        usePaginationFragment(
          graphql`
            fragment profileRepliesListFragment on User
            @argumentDefinitions(
              count: { type: "Int", defaultValue: 20 }
              cursor: { type: "String" }
            )
            @refetchable(queryName: "profileRepliesListPaginationQuery") {
              bibleVerseChildPosts(first: $count, after: $cursor)
                @connection(key: "profileRepliesList_bibleVerseChildPosts") {
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
          `,
          userRef,
        );

      const posts = data.bibleVerseChildPosts?.edges ?? [];
      const connectionId = data.bibleVerseChildPosts?.__id ?? null;

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

      const handleEndReached = useCallback(() => {
        if (hasNext && !isLoadingNext) {
          loadNext(20);
        }
      }, [hasNext, isLoadingNext, loadNext]);

      const keyExtractor = useCallback(
        (item: (typeof posts)[0]) => item.node.id,
        [],
      );

      const renderItem = useCallback(
        ({ item, index }: { item: (typeof posts)[0]; index: number }) => {
          const post = item.node;
          const verse = post.verse;

          const bookName = verse?.book
            ? (BIBLE_BOOK_DETAILS[verse.book as BibleBook]?.name ?? verse.book)
            : null;
          const verseReference =
            bookName && verse
              ? `${bookName} ${verse.chapter}:${verse.verse}`
              : null;

          return (
            <View>
              {verseReference && (
                <View
                  style={[
                    styles.verseReferenceContainer,
                    { borderBottomColor: colors.border },
                  ]}
                >
                  <Text
                    style={[styles.verseReference, { color: colors.textMuted }]}
                  >
                    {verseReference}
                  </Text>
                  {verse?.translation && (
                    <View
                      style={[
                        styles.translationBadge,
                        { backgroundColor: colors.surfaceElevated },
                      ]}
                    >
                      <Text
                        style={[
                          styles.translationText,
                          { color: colors.textMuted },
                        ]}
                      >
                        {verse.translation}
                      </Text>
                    </View>
                  )}
                </View>
              )}
              <ReflectionItem
                id={post.id}
                content={post.content}
                user={post.user}
                createdAt={post.createdAt}
                images={post.images ?? []}
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
            </View>
          );
        },
        [colors, currentUserId, onLike, onUnlike, onDelete, onReport],
      );

      if (posts.length === 0) {
        return (
          <EmptyState
            title="No replies yet"
            message="Reply to other people's reflections"
          />
        );
      }

      return (
        <View style={styles.container}>
          <FlashList
            data={posts}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.5}
            scrollEnabled={false}
          />
        </View>
      );
    },
  ),
);

const styles = StyleSheet.create({
  container: {
    minHeight: 100,
  },
  verseReferenceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  verseReference: {
    fontSize: 12,
    fontWeight: "500",
  },
  translationBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  translationText: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
});
