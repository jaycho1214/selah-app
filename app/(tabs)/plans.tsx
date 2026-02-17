import { Suspense, useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { graphql, useLazyLoadQuery, useRelayEnvironment } from "react-relay";
import { fetchQuery } from "relay-runtime";
import Animated, { FadeInDown } from "react-native-reanimated";

import { ErrorBoundary } from "@/components/error-boundary";
import { useSession } from "@/components/providers/session-provider";
import { ReadingPlanCard } from "@/components/reading-plans/ReadingPlanCard";
import { ReadingPlanProgressBar } from "@/components/reading-plans/ReadingPlanProgressBar";
import { EmptyState } from "@/components/ui/empty-state";
import { Text } from "@/components/ui/text";
import { useColors } from "@/hooks/use-colors";
import type { plansTabMyPlansQuery } from "@/lib/relay/__generated__/plansTabMyPlansQuery.graphql";
import type { plansTabBrowseQuery } from "@/lib/relay/__generated__/plansTabBrowseQuery.graphql";

// ---------- GraphQL ----------

const MyPlansQuery = graphql`
  query plansTabMyPlansQuery {
    myJoinedReadingPlans(first: 50) {
      id
      dayCount
      myParticipation {
        id
        completedDaysCount
      }
      ...ReadingPlanCardFragment
    }
  }
`;

const BrowseQuery = graphql`
  query plansTabBrowseQuery($featured: Boolean) {
    readingPlans(first: 50, featured: $featured) {
      id
      ...ReadingPlanCardFragment
    }
  }
`;

// ---------- My Plans Section ----------

function MyPlansSection() {
  const colors = useColors();
  const data = useLazyLoadQuery<plansTabMyPlansQuery>(MyPlansQuery, {});
  const plans = data.myJoinedReadingPlans ?? [];

  if (plans.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        My Plans
      </Text>
      <View style={styles.sectionContent}>
        {plans.map((item, index) => (
          <Animated.View
            key={item.id}
            entering={FadeInDown.duration(300).delay(index * 50)}
            style={styles.cardWrapper}
          >
            <ReadingPlanCard dataKey={item} />
            {item.myParticipation && (
              <View style={styles.progressWrapper}>
                <ReadingPlanProgressBar
                  completed={item.myParticipation.completedDaysCount}
                  total={item.dayCount}
                />
              </View>
            )}
          </Animated.View>
        ))}
      </View>
    </View>
  );
}

// ---------- Browse Section ----------

function BrowseSection() {
  const colors = useColors();
  const [showFeatured, setShowFeatured] = useState(false);

  const data = useLazyLoadQuery<plansTabBrowseQuery>(BrowseQuery, {
    featured: showFeatured || null,
  });
  const plans = data.readingPlans ?? [];

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Browse</Text>
      <View style={styles.filterRow}>
        <Pressable
          onPress={() => setShowFeatured(false)}
          style={[
            styles.filterChip,
            {
              backgroundColor: !showFeatured
                ? colors.text
                : colors.surfaceElevated,
            },
          ]}
        >
          <Text
            style={[
              styles.filterText,
              { color: !showFeatured ? colors.bg : colors.textSecondary },
            ]}
          >
            All
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setShowFeatured(true)}
          style={[
            styles.filterChip,
            {
              backgroundColor: showFeatured
                ? colors.text
                : colors.surfaceElevated,
            },
          ]}
        >
          <Text
            style={[
              styles.filterText,
              { color: showFeatured ? colors.bg : colors.textSecondary },
            ]}
          >
            Featured
          </Text>
        </Pressable>
      </View>
      <View style={styles.sectionContent}>
        {plans.length === 0 ? (
          <EmptyState
            variant="inline"
            title="No reading plans yet"
            message="Check back soon for new reading plans."
          />
        ) : (
          plans.map((item, index) => (
            <Animated.View
              key={item.id}
              entering={FadeInDown.duration(300).delay(index * 50)}
            >
              <ReadingPlanCard dataKey={item} />
            </Animated.View>
          ))
        )}
      </View>
    </View>
  );
}

// ---------- Screen ----------

export default function PlansScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { isAuthenticated } = useSession();
  const environment = useRelayEnvironment();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const promises = [
        fetchQuery(environment, BrowseQuery, {
          featured: null,
        }).toPromise(),
      ];
      if (isAuthenticated) {
        promises.push(fetchQuery(environment, MyPlansQuery, {}).toPromise());
      }
      await Promise.all(promises);
    } finally {
      setIsRefreshing(false);
    }
  }, [environment, isAuthenticated]);

  return (
    <View style={[styles.screen, { backgroundColor: colors.bg }]}>
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 8,
            backgroundColor: colors.bg,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Reading Plans
        </Text>
      </View>

      <FlatList
        data={[]}
        renderItem={null}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.textMuted}
            colors={[colors.accent]}
          />
        }
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            {isAuthenticated && (
              <ErrorBoundary propagateServerErrors>
                <Suspense
                  fallback={
                    <View style={styles.sectionLoading}>
                      <ActivityIndicator size="small" color={colors.accent} />
                    </View>
                  }
                >
                  <MyPlansSection />
                </Suspense>
              </ErrorBoundary>
            )}

            <ErrorBoundary propagateServerErrors>
              <Suspense
                fallback={
                  <View style={styles.sectionLoading}>
                    <ActivityIndicator size="small" color={colors.accent} />
                  </View>
                }
              >
                <BrowseSection />
              </Suspense>
            </ErrorBoundary>
          </>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: -0.2,
    marginBottom: 12,
  },
  sectionContent: {
    gap: 10,
  },
  sectionLoading: {
    paddingVertical: 32,
    alignItems: "center",
  },
  cardWrapper: {
    gap: 6,
  },
  progressWrapper: {
    paddingHorizontal: 4,
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
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
});
