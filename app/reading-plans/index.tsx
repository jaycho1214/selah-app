import { Suspense, useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { BookOpen } from "lucide-react-native";
import { graphql, useLazyLoadQuery, useRelayEnvironment } from "react-relay";
import { fetchQuery } from "relay-runtime";
import Animated, { FadeInDown } from "react-native-reanimated";

import { Text } from "@/components/ui/text";
import { EmptyState } from "@/components/ui/empty-state";
import { ReadingPlanCard } from "@/components/reading-plans/ReadingPlanCard";
import { useColors } from "@/hooks/use-colors";
import { useSession } from "@/components/providers/session-provider";
import {
  IS_LIQUID_GLASS,
  useTransparentHeaderPadding,
} from "@/hooks/use-transparent-header";
import type { readingPlansBrowseQuery } from "@/lib/relay/__generated__/readingPlansBrowseQuery.graphql";

const browseQuery = graphql`
  query readingPlansBrowseQuery($featured: Boolean) {
    readingPlans(first: 50, featured: $featured) {
      id
      ...ReadingPlanCardFragment
    }
  }
`;

export default function ReadingPlansBrowsePage() {
  const colors = useColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Stack.Screen
        options={{
          title: "Reading Plans",
          headerTransparent: IS_LIQUID_GLASS,
          headerStyle: {
            backgroundColor: IS_LIQUID_GLASS ? "transparent" : colors.bg,
          },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          headerBackTitle: "",
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
        <BrowseContent colors={colors} />
      </Suspense>
    </View>
  );
}

function BrowseContent({ colors }: { colors: ReturnType<typeof useColors> }) {
  const contentPaddingTop = useTransparentHeaderPadding();
  const router = useRouter();
  const { isAuthenticated } = useSession();
  const [showFeatured, setShowFeatured] = useState(false);

  const environment = useRelayEnvironment();
  const refreshSubRef = useRef<{ unsubscribe: () => void } | null>(null);

  const data = useLazyLoadQuery<readingPlansBrowseQuery>(browseQuery, {
    featured: showFeatured || null,
  });

  const plans = data.readingPlans ?? [];

  const [isRefreshing, setIsRefreshing] = useState(false);
  const handleRefresh = useCallback(() => {
    refreshSubRef.current?.unsubscribe();
    setIsRefreshing(true);
    refreshSubRef.current = fetchQuery(environment, browseQuery, {
      featured: showFeatured || null,
    }).subscribe({
      complete: () => setIsRefreshing(false),
      error: () => setIsRefreshing(false),
    });
  }, [environment, showFeatured]);

  return (
    <FlatList
      data={plans}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => (
        <Animated.View entering={FadeInDown.duration(300).delay(index * 50)}>
          <ReadingPlanCard dataKey={item} />
        </Animated.View>
      )}
      contentContainerStyle={[
        styles.list,
        { paddingTop: contentPaddingTop + 8 },
      ]}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListHeaderComponent={
        <View style={styles.headerSection}>
          <View style={styles.filterRow}>
            <Pressable
              onPress={() => setShowFeatured(false)}
              style={[
                styles.filterChip,
                !showFeatured && {
                  backgroundColor: colors.text,
                },
                showFeatured && {
                  backgroundColor: colors.surfaceElevated,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  {
                    color: !showFeatured ? colors.bg : colors.textSecondary,
                  },
                ]}
              >
                All
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setShowFeatured(true)}
              style={[
                styles.filterChip,
                showFeatured && {
                  backgroundColor: colors.text,
                },
                !showFeatured && {
                  backgroundColor: colors.surfaceElevated,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  {
                    color: showFeatured ? colors.bg : colors.textSecondary,
                  },
                ]}
              >
                Featured
              </Text>
            </Pressable>
          </View>

          {isAuthenticated && (
            <Pressable
              onPress={() => router.push("/reading-plans/my-plans")}
              style={[
                styles.myPlansLink,
                { backgroundColor: colors.surfaceElevated },
              ]}
            >
              <BookOpen size={16} color={colors.accent} />
              <Text style={[styles.myPlansText, { color: colors.text }]}>
                My Reading Plans
              </Text>
            </Pressable>
          )}
        </View>
      }
      ListEmptyComponent={
        <EmptyState
          variant="inline"
          title="No reading plans yet"
          message="Check back soon for new reading plans."
        />
      }
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          tintColor={colors.textMuted}
          colors={[colors.accent]}
          progressViewOffset={contentPaddingTop}
        />
      }
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  separator: {
    height: 10,
  },
  headerSection: {
    marginBottom: 12,
    gap: 10,
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 100,
  },
  filterText: {
    fontSize: 13,
    fontWeight: "600",
  },
  myPlansLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  myPlansText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
