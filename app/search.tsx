import { useState, useCallback, Suspense } from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Stack, router } from "expo-router";
import { graphql, useLazyLoadQuery } from "react-relay";
import { SearchBar } from "@/components/bible/search-bar";
import { useColors } from "@/hooks/use-colors";
import {
  IS_LIQUID_GLASS,
  useTransparentHeaderPadding,
} from "@/hooks/use-transparent-header";
import { useBibleStore } from "@/lib/stores/bible-store";
import { BIBLE_BOOK_DETAILS } from "@/lib/bible/constants";
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
  const bookDetails = BIBLE_BOOK_DETAILS[verse.book];
  const reference = `${bookDetails?.name ?? verse.book} ${verse.chapter}:${verse.verse}`;

  return (
    <Pressable
      onPress={onPress}
      className="px-4 py-3 border-b border-border active:bg-muted/50"
    >
      <Text className="text-primary text-sm font-medium">{reference}</Text>
      <Text className="text-foreground text-base mt-1" numberOfLines={3}>
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
      <View className="flex-1 items-center justify-center p-8">
        <Text className="text-muted-foreground text-center text-lg">
          No results found
        </Text>
        <Text className="text-muted-foreground text-center text-sm mt-2">
          Try different keywords
        </Text>
      </View>
    );
  }

  return (
    <FlashList
      data={results}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListHeaderComponent={
        <View className="px-4 py-2 bg-muted">
          <Text className="text-muted-foreground text-sm">
            {results.length} result{results.length !== 1 ? "s" : ""}
          </Text>
        </View>
      }
    />
  );
}

export default function SearchScreen() {
  const colors = useColors();
  const contentPaddingTop = useTransparentHeaderPadding();
  const currentTranslation = useBibleStore((s) => s.currentTranslation);
  const [searchText, setSearchText] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");

  const handleSubmit = useCallback(() => {
    if (searchText.trim().length >= 3) {
      setSubmittedQuery(searchText.trim());
    }
  }, [searchText]);

  const handleClear = useCallback(() => {
    setSearchText("");
    setSubmittedQuery("");
  }, []);

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: contentPaddingTop }}>
      <Stack.Screen
        options={{
          title: "Search",
          headerLargeTitle: true,
          headerTransparent: IS_LIQUID_GLASS,
          headerStyle: { backgroundColor: IS_LIQUID_GLASS ? "transparent" : colors.bg },
          headerShadowVisible: false,
        }}
      />

      {/* Search input */}
      <View className="px-4 py-2">
        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          onSubmit={handleSubmit}
          onClear={handleClear}
          autoFocus
        />
        <Text className="text-muted-foreground text-xs mt-2">
          Searching in {currentTranslation} - Minimum 3 characters
        </Text>
      </View>

      {/* Results */}
      {submittedQuery ? (
        <Suspense
          fallback={
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" />
            </View>
          }
        >
          <SearchResults
            query={submittedQuery}
            translation={currentTranslation}
          />
        </Suspense>
      ) : (
        <View className="flex-1 items-center justify-center p-8">
          <Text className="text-muted-foreground text-center">
            Enter a word or phrase to search
          </Text>
        </View>
      )}
    </View>
  );
}
