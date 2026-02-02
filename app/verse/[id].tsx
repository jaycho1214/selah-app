import { useCallback, useMemo } from 'react';
import {
  View,
  ScrollView,
  Pressable,
  StyleSheet,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { graphql, useLazyLoadQuery } from 'react-relay';
import { Suspense } from 'react';
import { X, Share2, Bookmark, MessageCircle } from 'lucide-react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { Text } from '@/components/ui/text';
import { parseVerseId } from '@/lib/bible/utils';
import { BIBLE_BOOK_DETAILS } from '@/lib/bible/constants';
import { useAnnotationsStore } from '@/lib/stores/annotations-store';
import type { BibleBook } from '@/lib/bible/types';
import type {
  IdQuery,
  IdQuery$variables,
} from '@/lib/relay/__generated__/IdQuery.graphql';

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
    }
  }
`;

export default function VersePostPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const parsed = id ? parseVerseId(id) : null;

  if (!parsed) {
    return (
      <View style={[styles.container, styles.center]}>
        <Stack.Screen options={{ headerShown: false }} />
        <Text className="text-muted-foreground">Invalid verse reference</Text>
      </View>
    );
  }

  const bookDetails = BIBLE_BOOK_DETAILS[parsed.book];
  const bookName = bookDetails?.name ?? parsed.book;
  const reference = `${bookName} ${parsed.chapter}:${parsed.verse}`;

  // Colors
  const colors = isDark
    ? {
        bg: '#0c0a09',
        surface: '#1c1917',
        border: '#292524',
        text: '#fafaf9',
        textMuted: '#a8a29e',
        accent: '#d6bcab',
      }
    : {
        bg: '#fdfcfb',
        surface: '#f5f4f3',
        border: '#e7e5e4',
        text: '#1c1917',
        textMuted: '#78716c',
        accent: '#8b7355',
      };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Custom header */}
      <Animated.View
        entering={FadeIn.duration(300)}
        style={[
          styles.header,
          {
            paddingTop: insets.top + 8,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Pressable
          onPress={() => router.back()}
          style={styles.headerButton}
          hitSlop={12}
        >
          <X size={24} color={colors.text} />
        </Pressable>

        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {reference}
        </Text>

        <Pressable style={styles.headerButton} hitSlop={12}>
          <Share2 size={22} color={colors.textMuted} />
        </Pressable>
      </Animated.View>

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
          insets={insets}
        />
      </Suspense>
    </View>
  );
}

function VerseContent({
  verseId,
  parsed,
  colors,
  insets,
}: {
  verseId: string;
  parsed: NonNullable<ReturnType<typeof parseVerseId>>;
  colors: Record<string, string>;
  insets: { bottom: number };
}) {
  const { bookmarks, addBookmark, removeBookmark } = useAnnotationsStore();
  const isBookmarked = !!bookmarks[verseId];

  const data = useLazyLoadQuery<IdQuery>(verseQuery, {
    translation: parsed.translation as IdQuery$variables['translation'],
    book: parsed.book as IdQuery$variables['book'],
    chapter: parsed.chapter,
    verse: parsed.verse,
  });

  const verse = data.bibleVerseByReference;
  const bookDetails = BIBLE_BOOK_DETAILS[parsed.book];
  const bookName = bookDetails?.name ?? parsed.book;

  const handleBookmarkToggle = useCallback(() => {
    if (isBookmarked) {
      removeBookmark(verseId);
    } else {
      addBookmark(verseId);
    }
  }, [verseId, isBookmarked, addBookmark, removeBookmark]);

  if (!verse) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={{ color: colors.textMuted }}>Verse not found</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[
        styles.scrollContent,
        { paddingBottom: insets.bottom + 24 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Verse card */}
      <Animated.View
        entering={FadeInDown.duration(500).delay(100)}
        style={[styles.verseCard, { backgroundColor: colors.surface }]}
      >
        <Text
          style={[styles.verseText, { color: colors.text }]}
          selectable
        >
          {verse.text}
        </Text>

        <View style={[styles.verseMeta, { borderTopColor: colors.border }]}>
          <Text style={[styles.verseReference, { color: colors.accent }]}>
            {bookName} {parsed.chapter}:{parsed.verse}
          </Text>
          <Text style={[styles.verseTranslation, { color: colors.textMuted }]}>
            {parsed.translation}
          </Text>
        </View>

        {/* Action buttons */}
        <View style={styles.actions}>
          <Pressable
            onPress={handleBookmarkToggle}
            style={[styles.actionButton, { backgroundColor: colors.bg }]}
          >
            <Bookmark
              size={18}
              color={isBookmarked ? colors.accent : colors.textMuted}
              fill={isBookmarked ? colors.accent : 'transparent'}
            />
            <Text
              style={[
                styles.actionText,
                { color: isBookmarked ? colors.accent : colors.textMuted },
              ]}
            >
              {isBookmarked ? 'Saved' : 'Save'}
            </Text>
          </Pressable>

          <Pressable style={[styles.actionButton, { backgroundColor: colors.bg }]}>
            <Share2 size={18} color={colors.textMuted} />
            <Text style={[styles.actionText, { color: colors.textMuted }]}>
              Share
            </Text>
          </Pressable>
        </View>
      </Animated.View>

      {/* Community section */}
      <Animated.View
        entering={FadeInDown.duration(500).delay(200)}
        style={styles.communitySection}
      >
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Community
        </Text>

        {/* Empty state */}
        <View
          style={[
            styles.emptyState,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <MessageCircle size={32} color={colors.textMuted} strokeWidth={1.5} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            No reflections yet
          </Text>
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>
            Be the first to share what this verse means to you
          </Text>
          <Pressable
            style={[styles.shareButton, { backgroundColor: colors.accent }]}
          >
            <Text style={styles.shareButtonText}>Share your reflection</Text>
          </Pressable>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  verseCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  verseText: {
    fontSize: 20,
    lineHeight: 32,
    fontWeight: '400',
    letterSpacing: 0.2,
  },
  verseMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  verseReference: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  verseTranslation: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '500',
  },
  communitySection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  shareButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
