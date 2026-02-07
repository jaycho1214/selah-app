import { forwardRef, useImperativeHandle } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { FlashList } from "@shopify/flash-list";
import { graphql, usePaginationFragment } from "react-relay";
import { MessageCircle } from "lucide-react-native";

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
}

export interface ProfileRepliesListRef {
  refetch: () => void;
  connectionId: string | null;
}

export const ProfileRepliesList = forwardRef<
  ProfileRepliesListRef,
  ProfileRepliesListProps
>(function ProfileRepliesList(
  { userRef, currentUserId, onLike, onUnlike, onDelete },
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

  const handleEndReached = () => {
    if (hasNext && !isLoadingNext) {
      loadNext(20);
    }
  };

  if (posts.length === 0) {
    return (
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
            styles.emptyIconContainer,
            { backgroundColor: colors.surfaceElevated },
          ]}
        >
          <MessageCircle size={24} color={colors.textMuted} strokeWidth={1.5} />
        </View>
        <Text style={[styles.emptyTitle, { color: colors.text }]}>
          No replies yet
        </Text>
        <Text style={[styles.emptyText, { color: colors.textMuted }]}>
          Reply to other people&apos;s reflections
        </Text>
      </Animated.View>
    );
  }

  const renderItem = ({
    item,
    index,
  }: {
    item: (typeof posts)[0];
    index: number;
  }) => {
    const post = item.node;
    const verse = post.verse;

    const bookName = verse?.book
      ? (BIBLE_BOOK_DETAILS[verse.book as BibleBook]?.name ?? verse.book)
      : null;
    const verseReference =
      bookName && verse ? `${bookName} ${verse.chapter}:${verse.verse}` : null;

    return (
      <View>
        {verseReference && (
          <View
            style={[
              styles.verseReferenceContainer,
              { borderBottomColor: colors.border },
            ]}
          >
            <Text style={[styles.verseReference, { color: colors.textMuted }]}>
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
                  style={[styles.translationText, { color: colors.textMuted }]}
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
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlashList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.node.id}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        scrollEnabled={false}
      />
    </View>
  );
});

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
