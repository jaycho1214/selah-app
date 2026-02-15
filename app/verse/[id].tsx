import { useColors } from "@/hooks/use-colors";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import * as Haptics from "expo-haptics";
import { Stack, useLocalSearchParams } from "expo-router";
import { Share2 } from "lucide-react-native";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  Share,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import {
  IS_LIQUID_GLASS,
  useTransparentHeaderPadding,
} from "@/hooks/use-transparent-header";
import { graphql, useLazyLoadQuery, useMutation } from "react-relay";

import { SignInSheet } from "@/components/auth/sign-in-sheet";
import { useSession } from "@/components/providers/session-provider";
import { useAnalytics } from "@/lib/analytics";
import {
  ReportSheet,
  type ReportSheetRef,
} from "@/components/report/report-sheet";
import { Text } from "@/components/ui/text";
import { PostsList, type PostsListRef } from "@/components/verse/posts-list";
import {
  ReflectionComposer,
  type ReflectionComposerRef,
} from "@/components/verse/reflection-composer";
import { BIBLE_BOOK_DETAILS } from "@/lib/bible/constants";
import { parseVerseId } from "@/lib/bible/utils";
import { createLexicalState } from "@/lib/lexical/html-to-lexical";
import type { IdCreateReflectionMutation } from "@/lib/relay/__generated__/IdCreateReflectionMutation.graphql";
import type { IdDeleteReflectionMutation } from "@/lib/relay/__generated__/IdDeleteReflectionMutation.graphql";
import type { IdLikeReflectionMutation } from "@/lib/relay/__generated__/IdLikeReflectionMutation.graphql";
import type {
  IdQuery,
  IdQuery$variables,
} from "@/lib/relay/__generated__/IdQuery.graphql";
import type { IdUnlikeReflectionMutation } from "@/lib/relay/__generated__/IdUnlikeReflectionMutation.graphql";
import { getVerseShareUrl } from "@/lib/utils";

// Serif font for verse text - classic devotional feel
const serifFont = Platform.select({
  ios: "Georgia",
  default: "serif",
});

// Main verse query - spreads fragment for posts
const verseQuery = graphql`
  query IdQuery(
    $translation: BibleTranslation!
    $book: BibleBook!
    $chapter: Int!
    $verse: Int!
  ) {
    bibleVerseByReference(
      translation: $translation
      book: $book
      chapter: $chapter
      verse: $verse
    ) {
      id
      text
      verse
      ...postsListFragment
    }
  }
`;

// Create reflection mutation
const createReflectionMutation = graphql`
  mutation IdCreateReflectionMutation(
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
const likeReflectionMutation = graphql`
  mutation IdLikeReflectionMutation($id: ID!) {
    bibleVersePostLike(id: $id) {
      likedAt
    }
  }
`;

// Unlike mutation
const unlikeReflectionMutation = graphql`
  mutation IdUnlikeReflectionMutation($id: ID!) {
    bibleVersePostUnlike(id: $id) {
      likedAt
    }
  }
`;

// Delete mutation
const deleteReflectionMutation = graphql`
  mutation IdDeleteReflectionMutation($id: ID!, $connections: [ID!]!) {
    bibleVersePostDelete(id: $id) {
      deletedIds @deleteEdge(connections: $connections)
    }
  }
`;

export default function VerseDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = useColors();

  const parsed = id ? parseVerseId(id) : null;

  if (!parsed) {
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
            title: "Verse",
            headerTransparent: IS_LIQUID_GLASS,
            headerStyle: {
              backgroundColor: IS_LIQUID_GLASS ? "transparent" : colors.bg,
            },
            headerTintColor: colors.text,
            headerShadowVisible: false,
          }}
        />
        <Text style={{ color: colors.textMuted }}>Invalid verse reference</Text>
      </View>
    );
  }

  const bookDetails = BIBLE_BOOK_DETAILS[parsed.book];
  const bookName = bookDetails?.name ?? parsed.book;
  const reference = `${bookName} ${parsed.chapter}:${parsed.verse}`;

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Stack.Screen
        options={{
          title: reference,
          headerTransparent: IS_LIQUID_GLASS,
          headerStyle: {
            backgroundColor: IS_LIQUID_GLASS ? "transparent" : colors.bg,
          },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          headerBackTitle: "",
          headerTitleStyle: {
            fontWeight: "600",
            fontSize: 17,
            fontFamily: serifFont,
          },
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
        <VerseContent
          verseId={id}
          parsed={parsed}
          colors={colors}
          isDark={isDark}
        />
      </Suspense>
    </View>
  );
}

function VerseContent({
  verseId,
  parsed,
  colors,
  isDark,
}: {
  verseId: string;
  parsed: NonNullable<ReturnType<typeof parseVerseId>>;
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
  isDark: boolean;
}) {
  const contentPaddingTop = useTransparentHeaderPadding();
  const { session } = useSession();
  const { capture } = useAnalytics();
  const composerRef = useRef<ReflectionComposerRef>(null);
  const postsListRef = useRef<PostsListRef>(null);
  const signInSheetRef = useRef<BottomSheetModal>(null);
  const reportSheetRef = useRef<ReportSheetRef>(null);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const isAuthenticated = !!session?.user;

  const queryVariables = {
    translation: parsed.translation as IdQuery$variables["translation"],
    book: parsed.book as IdQuery$variables["book"],
    chapter: parsed.chapter,
    verse: parsed.verse,
  };

  // Fetch verse data
  const data = useLazyLoadQuery<IdQuery>(verseQuery, queryVariables);

  useEffect(() => {
    if (data.bibleVerseByReference?.id) {
      capture("verse_selected", { verse_id: verseId });
    }
  }, [verseId]);

  // Pull to refresh using the fragment's refetch
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    postsListRef.current?.refetch();
    // Small delay to show the refresh indicator
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    refreshTimerRef.current = setTimeout(() => setIsRefreshing(false), 500);
  }, []);

  // Cleanup refresh timer on unmount
  useEffect(() => {
    return () => {
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    };
  }, []);

  // Mutations
  const [commitCreateReflection, isCreatingReflection] =
    useMutation<IdCreateReflectionMutation>(createReflectionMutation);
  const [commitLike] = useMutation<IdLikeReflectionMutation>(
    likeReflectionMutation,
  );
  const [commitUnlike] = useMutation<IdUnlikeReflectionMutation>(
    unlikeReflectionMutation,
  );
  const [commitDelete] = useMutation<IdDeleteReflectionMutation>(
    deleteReflectionMutation,
  );

  const verse = data.bibleVerseByReference;

  const bookDetails = BIBLE_BOOK_DETAILS[parsed.book];
  const bookName = bookDetails?.name ?? parsed.book;
  const fullReference = `${bookName} ${parsed.chapter}:${parsed.verse}`;

  const handleShare = useCallback(async () => {
    if (!verse) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const shareUrl = getVerseShareUrl(verse.id);
    const shareText = `"${verse.text}"\n\n— ${fullReference} (${parsed.translation})\n${shareUrl}`;
    try {
      await Share.share({ message: shareText, url: shareUrl });
    } catch {
      // User cancelled
    }
  }, [verse, fullReference, parsed.translation]);

  const handleSubmitReflection = useCallback(
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
      if (!verse?.id) return;

      // Content is already Lexical JSON from the WebView editor
      // Just validate it's proper JSON, otherwise convert from plain text
      let lexicalContent: string;
      try {
        const parsedContent = JSON.parse(postData.content);
        if (parsedContent?.root?.type === "root") {
          // Already valid Lexical JSON
          lexicalContent = postData.content;
        } else {
          // Plain text - convert to Lexical format
          lexicalContent = JSON.stringify(createLexicalState(postData.content));
        }
      } catch {
        // Not JSON - convert plain text to Lexical format
        lexicalContent = JSON.stringify(createLexicalState(postData.content));
      }

      // Get connection ID from the PostsList ref
      const connectionId = postsListRef.current?.connectionId;
      const connections = connectionId ? [connectionId] : [];

      // Dismiss keyboard immediately when posting
      Keyboard.dismiss();

      commitCreateReflection({
        variables: {
          input: {
            parentId: verse.id,
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
        onCompleted: (response) => {
          composerRef.current?.clear();
          const postId = response.bibleVersePostCreate?.bibleVersePost?.id;
          if (postId) {
            capture("post_created", {
              post_id: postId,
              has_images: postData.images.length > 0,
              has_poll: postData.poll !== null,
              is_reply: false,
            });
          }
        },
        onError: (error) => {
          console.error("Failed to create post:", error);
        },
      });
    },
    [verse?.id, commitCreateReflection],
  );

  const handleLike = useCallback(
    (postId: string) => {
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
    [commitLike],
  );

  const handleUnlike = useCallback(
    (postId: string) => {
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
    [commitUnlike],
  );

  const handleDelete = useCallback(
    (postId: string) => {
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
    [commitDelete],
  );

  const handleAuthRequired = useCallback(() => {
    signInSheetRef.current?.present();
  }, []);

  const handleReport = useCallback((postId: string) => {
    reportSheetRef.current?.present({ type: "post", targetId: postId });
  }, []);

  if (!verse) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={{ color: colors.textMuted }}>Verse not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.contentContainer}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingTop: contentPaddingTop }}
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
        {/* Verse Section */}
        <Animated.View
          entering={FadeInDown.duration(500).delay(100)}
          style={styles.verseSection}
        >
          {/* Verse Text */}
          <Text
            style={[
              styles.verseText,
              { color: colors.text, fontFamily: serifFont },
            ]}
            selectable
          >
            {verse.text}
          </Text>

          {/* Meta & Actions Row */}
          <View style={styles.verseFooter}>
            <View style={styles.verseMeta}>
              <Text style={[styles.reference, { color: colors.textMuted }]}>
                {fullReference}
              </Text>
              <View
                style={[
                  styles.translationBadge,
                  { backgroundColor: colors.surfaceElevated },
                ]}
              >
                <Text
                  style={[styles.translationText, { color: colors.textMuted }]}
                >
                  {parsed.translation}
                </Text>
              </View>
            </View>

            <Pressable
              onPress={handleShare}
              style={styles.iconButton}
              hitSlop={8}
            >
              <Share2 size={20} color={colors.textMuted} />
            </Pressable>
          </View>
        </Animated.View>

        {/* Full-width divider between verse and posts */}
        <View
          style={[styles.fullWidthDivider, { backgroundColor: colors.border }]}
        />

        {/* Posts Section - Full bleed */}
        <View style={styles.postsSection}>
          <PostsList
            ref={postsListRef}
            verseRef={verse}
            colors={colors}
            currentUserId={session?.user?.id}
            onLike={handleLike}
            onUnlike={handleUnlike}
            onDelete={handleDelete}
            onReport={handleReport}
          />
        </View>

        {/* Bottom padding for composer */}
        <View style={{ height: 200 }} />
      </ScrollView>

      {/* Bottom Composer */}
      <ReflectionComposer
        ref={composerRef}
        colors={colors}
        onSubmit={handleSubmitReflection}
        placeholder="What does this verse mean to you?"
        isAuthenticated={isAuthenticated}
        onAuthRequired={handleAuthRequired}
        isSubmitting={isCreatingReflection}
      />

      {/* Sign-in Sheet */}
      <SignInSheet ref={signInSheetRef} />
      <ReportSheet ref={reportSheetRef} />
    </View>
  );
}

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
  // Verse Section
  verseSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  verseText: {
    fontSize: 22,
    lineHeight: 36,
    fontStyle: "italic",
    letterSpacing: 0.2,
  },
  verseFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
  },
  verseMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  reference: {
    fontSize: 12,
    fontWeight: "500",
  },
  translationBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  translationText: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  iconButton: {
    padding: 4,
  },
  // Full-width divider (no horizontal padding)
  fullWidthDivider: {
    height: StyleSheet.hairlineWidth,
  },
  // Posts Section - no padding here, let PostsList handle it
  postsSection: {
    flex: 1,
  },
});
