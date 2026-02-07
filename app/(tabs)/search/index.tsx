import React, { Suspense, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { router, Stack } from "expo-router";
import { useHeaderHeight } from "@react-navigation/elements";
import { graphql, useLazyLoadQuery } from "react-relay";
import {
  BookOpen,
  ChevronRight,
  Search,
  User as UserIcon,
} from "lucide-react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { Text } from "@/components/ui/text";
import { useColors } from "@/hooks/use-colors";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useBibleStore } from "@/lib/stores/bible-store";
import { BIBLE_BOOK_DETAILS } from "@/lib/bible/constants";
import { Fonts } from "@/constants/theme";
import {
  parseBibleReference,
  type ParsedReference,
} from "@/lib/bible/parse-reference";
import type {
  searchScreenBibleQuery,
  searchScreenBibleQuery$data,
  searchScreenBibleQuery$variables,
} from "@/lib/relay/__generated__/searchScreenBibleQuery.graphql";
import type {
  searchScreenUsersQuery,
  searchScreenUsersQuery$data,
} from "@/lib/relay/__generated__/searchScreenUsersQuery.graphql";

// ---------- Helpers ----------

function navigateToChapter(book: string, chapter: number, verse?: number) {
  const { setPosition, setScrollToVerse } = useBibleStore.getState();
  setPosition(book, chapter);
  setScrollToVerse(verse ?? null);
  router.navigate("/");
}

// ---------- GraphQL ----------

const BibleSearchQuery = graphql`
  query searchScreenBibleQuery(
    $translation: BibleTranslation!
    $query: String!
    $limit: Int
  ) {
    bibleVersesByQuery(
      translation: $translation
      query: $query
      limit: $limit
    ) {
      id
      book
      chapter
      verse
      text
    }
  }
`;

const UsersSearchQuery = graphql`
  query searchScreenUsersQuery($filter: UserFilterInput!, $first: Int) {
    users(filter: $filter, first: $first) {
      edges {
        node {
          id
          username
          name
          image {
            url
          }
          followerCount
        }
      }
    }
  }
`;

// ---------- Section Header ----------

function SectionHeader({ title, count }: { title: string; count: number }) {
  const colors = useColors();
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionHeaderLeft}>
        <View style={[styles.sectionDot, { backgroundColor: colors.accent }]} />
        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
          {title}
        </Text>
      </View>
      <Text style={[styles.sectionCount, { color: colors.textMuted }]}>
        {count}
      </Text>
    </View>
  );
}

// ---------- Reference Card ----------

function ReferenceCard({ parsed }: { parsed: ParsedReference }) {
  const colors = useColors();
  const label = parsed.verse
    ? `${parsed.bookName} ${parsed.chapter}:${parsed.verse}`
    : `${parsed.bookName} ${parsed.chapter}`;

  return (
    <Pressable
      onPress={() =>
        navigateToChapter(
          parsed.book,
          parsed.chapter,
          parsed.verse ?? undefined,
        )
      }
      style={[
        styles.referenceCard,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <View
        style={[
          styles.referenceIcon,
          { backgroundColor: `${colors.accent}15` },
        ]}
      >
        <BookOpen size={18} color={colors.accent} strokeWidth={1.5} />
      </View>
      <View style={styles.referenceTextContainer}>
        <Text style={[styles.referenceLabel, { color: colors.textMuted }]}>
          Go to passage
        </Text>
        <Text style={[styles.referenceTitle, { color: colors.text }]}>
          {label}
        </Text>
      </View>
      <ChevronRight size={18} color={colors.textMuted} strokeWidth={1.5} />
    </Pressable>
  );
}

// ---------- Bible Verse Results ----------

type BibleVerseItem = searchScreenBibleQuery$data["bibleVersesByQuery"][number];

function BibleVerseResultItem({
  verse,
  onPress,
  index,
}: {
  verse: BibleVerseItem;
  onPress: () => void;
  index: number;
}) {
  const colors = useColors();
  const bookDetails =
    BIBLE_BOOK_DETAILS[verse.book as keyof typeof BIBLE_BOOK_DETAILS];
  const reference = `${bookDetails?.name ?? String(verse.book)} ${verse.chapter}:${verse.verse}`;

  return (
    <Animated.View entering={FadeIn.duration(250).delay(index * 40)}>
      <Pressable
        onPress={onPress}
        style={[styles.verseResultRow, { borderBottomColor: colors.border }]}
      >
        <View
          style={[
            styles.verseReferenceBadge,
            { backgroundColor: `${colors.accent}12` },
          ]}
        >
          <Text style={[styles.verseReferenceText, { color: colors.accent }]}>
            {reference}
          </Text>
        </View>
        <Text
          style={[styles.verseText, { color: colors.textSecondary }]}
          numberOfLines={2}
        >
          {verse.text}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

function BibleVerseResults({
  query,
  translation,
}: {
  query: string;
  translation: string;
}) {
  const data = useLazyLoadQuery<searchScreenBibleQuery>(BibleSearchQuery, {
    translation: translation as searchScreenBibleQuery$variables["translation"],
    query,
    limit: 25,
  });

  const results = data.bibleVersesByQuery ?? [];
  if (results.length === 0) return null;

  return (
    <Animated.View entering={FadeIn.duration(200)}>
      <SectionHeader title="Verses" count={results.length} />
      {results.map((item, index) => (
        <BibleVerseResultItem
          key={item.id}
          verse={item}
          index={index}
          onPress={() => navigateToChapter(item.book, item.chapter, item.verse)}
        />
      ))}
    </Animated.View>
  );
}

// ---------- User Results ----------

type UserNode = NonNullable<
  NonNullable<
    NonNullable<searchScreenUsersQuery$data["users"]>["edges"]
  >[number]
>["node"];

function UserResultItem({
  user,
  index,
}: {
  user: NonNullable<UserNode>;
  index: number;
}) {
  const colors = useColors();
  if (!user.username) return null;

  return (
    <Animated.View entering={FadeIn.duration(250).delay(index * 40)}>
      <Pressable
        onPress={() => router.push(`/user/${user.username}`)}
        style={[styles.userRow, { borderBottomColor: colors.border }]}
      >
        <View
          style={[
            styles.userAvatar,
            { backgroundColor: colors.surfaceElevated },
          ]}
        >
          {user.image?.url ? (
            <Image
              source={{ uri: user.image.url }}
              style={styles.userAvatarImage}
            />
          ) : (
            <UserIcon size={18} color={colors.textMuted} strokeWidth={1.5} />
          )}
        </View>
        <View style={styles.userInfo}>
          {user.name ? (
            <>
              <Text style={[styles.userName, { color: colors.text }]}>
                {user.name}
              </Text>
              <Text style={[styles.userUsername, { color: colors.textMuted }]}>
                @{user.username}
              </Text>
            </>
          ) : (
            <Text style={[styles.userName, { color: colors.text }]}>
              @{user.username}
            </Text>
          )}
        </View>
        <Text style={[styles.followerCount, { color: colors.textMuted }]}>
          {user.followerCount}{" "}
          {user.followerCount === 1 ? "follower" : "followers"}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

function UserResults({ query }: { query: string }) {
  const data = useLazyLoadQuery<searchScreenUsersQuery>(UsersSearchQuery, {
    filter: { username: query },
    first: 15,
  });

  const edges = data.users?.edges ?? [];
  const users = edges.filter((e) => e?.node != null);
  if (users.length === 0) return null;

  return (
    <Animated.View entering={FadeIn.duration(200)}>
      <SectionHeader title="People" count={users.length} />
      {users.map((edge, index) => {
        const node = edge!.node!;
        return <UserResultItem key={node.id} user={node} index={index} />;
      })}
    </Animated.View>
  );
}

// ---------- Loading Fallback ----------

function SearchSectionLoading() {
  const colors = useColors();
  return (
    <View style={styles.loadingSection}>
      <ActivityIndicator size="small" color={colors.textMuted} />
    </View>
  );
}

// ---------- Empty State ----------

function SearchEmptyState({ topInset }: { topInset: number }) {
  const colors = useColors();
  return (
    <View style={[styles.emptyContainer, { paddingTop: topInset + 48 }]}>
      <Animated.View
        entering={FadeIn.duration(500).delay(150)}
        style={styles.emptyContent}
      >
        <View
          style={[styles.emptyIconRing, { borderColor: `${colors.accent}20` }]}
        >
          <View
            style={[
              styles.emptyIconCircle,
              { backgroundColor: `${colors.accent}10` },
            ]}
          >
            <Search size={24} color={colors.accent} strokeWidth={1.5} />
          </View>
        </View>

        <Text
          style={[
            styles.emptyTitle,
            { color: colors.text, fontFamily: Fonts?.serif },
          ]}
        >
          Search the Bible & people
        </Text>

        <Text style={[styles.emptyHint, { color: colors.textMuted }]}>
          Try &quot;love&quot;, &quot;John 3:16&quot;, or a username
        </Text>
      </Animated.View>
    </View>
  );
}

// ---------- Screen ----------

export default function SearchScreen() {
  const colors = useColors();
  const headerHeight = useHeaderHeight();
  const { currentTranslation } = useBibleStore();

  const [searchText, setSearchText] = useState("");
  const debouncedQuery = useDebouncedValue(searchText.trim(), 350);

  const parsedRef = useMemo(
    () => parseBibleReference(searchText.trim()),
    [searchText],
  );

  const showBibleResults = debouncedQuery.length >= 3;
  const showUserResults = debouncedQuery.length >= 2;
  const hasAnyQuery = showBibleResults || showUserResults || parsedRef != null;

  return (
    <View style={[styles.screen, { backgroundColor: colors.bg }]}>
      <Stack.Screen
        options={{
          title: "Search",
          headerSearchBarOptions: {
            placeholder: "Verses, references, people...",
            onChangeText: (e) => setSearchText(e.nativeEvent.text),
            autoCapitalize: "none",
          },
        }}
      />

      {!hasAnyQuery ? (
        <SearchEmptyState topInset={headerHeight} />
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentInsetAdjustmentBehavior="automatic"
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
        >
          {parsedRef && <ReferenceCard parsed={parsedRef} />}

          <Suspense fallback={<SearchSectionLoading />}>
            {showBibleResults && (
              <BibleVerseResults
                query={debouncedQuery}
                translation={currentTranslation}
              />
            )}
            {showUserResults && <UserResults query={debouncedQuery} />}
          </Suspense>

          <View style={styles.scrollBottomSpacer} />
        </ScrollView>
      )}
    </View>
  );
}

// ---------- Styles ----------

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollBottomSpacer: {
    height: 120,
  },

  // Section header
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 8,
  },
  sectionHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  sectionCount: {
    fontSize: 12,
    fontWeight: "500",
  },

  // Reference card
  referenceCard: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
    paddingVertical: 14,
    paddingLeft: 14,
    paddingRight: 12,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
  },
  referenceIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  referenceTextContainer: {
    flex: 1,
  },
  referenceLabel: {
    fontSize: 11,
    fontWeight: "500",
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  referenceTitle: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: -0.2,
  },

  // Verse results
  verseResultRow: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  verseReferenceBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
  },
  verseReferenceText: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  verseText: {
    fontSize: 15,
    lineHeight: 22,
  },

  // User row
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginRight: 12,
  },
  userAvatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: "600",
  },
  userUsername: {
    fontSize: 13,
    marginTop: 1,
  },
  followerCount: {
    fontSize: 12,
    fontWeight: "500",
  },

  // Loading
  loadingSection: {
    paddingVertical: 28,
    alignItems: "center",
  },

  // Empty state
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 24,
  },
  emptyContent: {
    alignItems: "center",
  },
  emptyIconRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  emptyIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  emptyHint: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 21,
  },
});
