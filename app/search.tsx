import { useState, useCallback, Suspense } from "react";
import { ErrorBoundary } from "@/components/error-boundary";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Stack, router } from "expo-router";
import { graphql, useLazyLoadQuery } from "react-relay";
import { SearchBar } from "@/components/bible/search-bar";
import { EmptyState } from "@/components/ui/empty-state";
import { useColors } from "@/hooks/use-colors";
import {
  IS_LIQUID_GLASS,
  useTransparentHeaderPadding,
} from "@/hooks/use-transparent-header";
import { useAnalytics } from "@/lib/analytics";
import { useBibleStore } from "@/lib/stores/bible-store";
import { BIBLE_BOOK_DETAILS } from "@/lib/bible/constants";
import { CommonStyles } from "@/constants/styles";
import type { BibleBook } from "@/lib/bible/types";
import type {
  searchBibleQuery,
  searchBibleQuery$variables,
} from "@/lib/relay/__generated__/searchBibleQuery.graphql";

const searchQuery = graphql`
  query searchBibleQuery(
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

interface SearchResultItemProps {
  verse: {
    id: string;
    book: BibleBook;
    chapter: number;
    verse: number;
    text: string;
  };
  query: string;
  onPress: () => void;
}

function SearchResultItem({ verse, query, onPress }: SearchResultItemProps) {
  const colors = useColors();
  const bookDetails = BIBLE_BOOK_DETAILS[verse.book];
  const reference = `${bookDetails?.name ?? verse.book} ${verse.chapter}:${verse.verse}`;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.resultItem,
        { borderBottomColor: colors.border },
        pressed && { backgroundColor: colors.muted + "80" },
      ]}
    >
      <Text style={[styles.referenceText, { color: colors.primary }]}>
        {reference}
      </Text>
      <Text
        style={[styles.verseText, { color: colors.text }]}
        numberOfLines={3}
      >
        {verse.text}
      </Text>
    </Pressable>
  );
}

function SearchResults({
  query,
  translation,
}: {
  query: string;
  translation: string;
}) {
  const colors = useColors();
  const data = useLazyLoadQuery<searchBibleQuery>(
    searchQuery,
    {
      translation: translation as searchBibleQuery$variables["translation"],
      query,
      limit: 50,
    },
    { fetchPolicy: "store-or-network" },
  );

  const results = data.bibleVersesByQuery ?? [];

  const handleResultPress = useCallback(
    (verse: { book: BibleBook; chapter: number }) => {
      router.push(`/bible/${verse.book}/${verse.chapter}`);
    },
    [],
  );

  const renderItem = useCallback(
    ({ item }: { item: (typeof results)[number] }) => (
      <SearchResultItem
        verse={item as SearchResultItemProps["verse"]}
        query={query}
        onPress={() =>
          handleResultPress(item as { book: BibleBook; chapter: number })
        }
      />
    ),
    [query, handleResultPress],
  );

  const keyExtractor = useCallback(
    (item: (typeof results)[number]) => item.id,
    [],
  );

  if (results.length === 0) {
    return (
      <EmptyState
        variant="inline"
        title="No results found"
        message="Try different keywords"
      />
    );
  }

  return (
    <FlashList
      data={results}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListHeaderComponent={
        <View style={[styles.resultsHeader, { backgroundColor: colors.muted }]}>
          <Text
            style={[styles.resultsCount, { color: colors.mutedForeground }]}
          >
            {results.length} result{results.length !== 1 ? "s" : ""}
          </Text>
        </View>
      }
    />
  );
}

export default function SearchScreen() {
  const colors = useColors();
  const { capture } = useAnalytics();
  const contentPaddingTop = useTransparentHeaderPadding();
  const currentTranslation = useBibleStore((s) => s.currentTranslation);
  const [searchText, setSearchText] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");

  const handleSubmit = useCallback(() => {
    if (searchText.trim().length >= 3) {
      capture("bible_search", {
        query: searchText.trim(),
        translation: currentTranslation,
      });
      setSubmittedQuery(searchText.trim());
    }
  }, [searchText, currentTranslation, capture]);

  const handleClear = useCallback(() => {
    setSearchText("");
    setSubmittedQuery("");
  }, []);

  return (
    <View
      style={[
        CommonStyles.flex1,
        { backgroundColor: colors.bg, paddingTop: contentPaddingTop },
      ]}
    >
      <Stack.Screen
        options={{
          title: "Search",
          headerLargeTitle: true,
          headerTransparent: IS_LIQUID_GLASS,
          headerStyle: {
            backgroundColor: IS_LIQUID_GLASS ? "transparent" : colors.bg,
          },
          headerShadowVisible: false,
        }}
      />

      {/* Search input */}
      <View style={styles.searchInputContainer}>
        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          onSubmit={handleSubmit}
          onClear={handleClear}
          autoFocus
        />
        <Text style={[styles.searchHint, { color: colors.mutedForeground }]}>
          Searching in {currentTranslation} - Minimum 3 characters
        </Text>
      </View>

      {/* Results */}
      {submittedQuery ? (
        <ErrorBoundary>
          <Suspense
            fallback={
              <View style={CommonStyles.centered}>
                <ActivityIndicator size="large" />
              </View>
            }
          >
            <SearchResults
              query={submittedQuery}
              translation={currentTranslation}
            />
          </Suspense>
        </ErrorBoundary>
      ) : (
        <View style={[CommonStyles.centered, { padding: 32 }]}>
          <Text style={[styles.emptyHint, { color: colors.mutedForeground }]}>
            Enter a word or phrase to search
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  resultItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  referenceText: {
    fontSize: 14,
    fontWeight: "500",
  },
  verseText: {
    fontSize: 16,
    marginTop: 4,
  },
  resultsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resultsCount: {
    fontSize: 14,
  },
  searchInputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchHint: {
    fontSize: 12,
    marginTop: 8,
  },
  emptyHint: {
    textAlign: "center",
  },
});
