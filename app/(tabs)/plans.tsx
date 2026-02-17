import { Suspense, useCallback, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { Calendar, Users, BookOpen } from "lucide-react-native";
import {
  graphql,
  useFragment,
  useLazyLoadQuery,
  useRelayEnvironment,
} from "react-relay";
import { fetchQuery } from "relay-runtime";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInRight,
} from "react-native-reanimated";

import { ErrorBoundary } from "@/components/error-boundary";
import { useSession } from "@/components/providers/session-provider";
import { ReadingPlanCard } from "@/components/reading-plans/ReadingPlanCard";
import { ReadingPlanProgressBar } from "@/components/reading-plans/ReadingPlanProgressBar";
import { EmptyState } from "@/components/ui/empty-state";
import { Text } from "@/components/ui/text";
import { useColors } from "@/hooks/use-colors";
import type { plansTabMyPlansQuery } from "@/lib/relay/__generated__/plansTabMyPlansQuery.graphql";
import type { plansTabBrowseQuery } from "@/lib/relay/__generated__/plansTabBrowseQuery.graphql";
import type { ReadingPlanCardFragment$key } from "@/lib/relay/__generated__/ReadingPlanCardFragment.graphql";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const MY_PLAN_CARD_WIDTH = SCREEN_WIDTH * 0.72;

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
  query plansTabBrowseQuery($official: Boolean) {
    readingPlans(first: 50, official: $official) {
      id
      ...ReadingPlanCardFragment
    }
  }
`;

// ---------- Compact Card for Horizontal Rail ----------

const myPlanCardFragment = graphql`
  fragment plansTabMyPlanCardFragment on ReadingPlan {
    id
    title
    dayCount
    coverImage {
      url
    }
  }
`;

function MyPlanCard({
  dataKey,
  completedDays,
  totalDays,
}: {
  dataKey: ReadingPlanCardFragment$key;
  completedDays: number;
  totalDays: number;
}) {
  const data = useFragment(myPlanCardFragment, dataKey);
  const colors = useColors();
  const router = useRouter();
  const percentage =
    totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;

  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push(`/reading-plans/${data.id}`);
      }}
      style={[
        styles.myPlanCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      {data.coverImage?.url ? (
        <Image
          source={{ uri: data.coverImage.url }}
          style={styles.myPlanCover}
          contentFit="cover"
        />
      ) : (
        <View
          style={[
            styles.myPlanCover,
            styles.myPlanCoverPlaceholder,
            { backgroundColor: colors.surfaceElevated },
          ]}
        >
          <BookOpen size={24} color={colors.textMuted} />
        </View>
      )}
      <View style={styles.myPlanInfo}>
        <Text
          style={[styles.myPlanTitle, { color: colors.text }]}
          numberOfLines={1}
        >
          {data.title}
        </Text>
        <View style={styles.myPlanProgressRow}>
          <View
            style={[
              styles.myPlanTrack,
              { backgroundColor: colors.surfaceElevated },
            ]}
          >
            <View
              style={[
                styles.myPlanFill,
                {
                  backgroundColor: colors.accent,
                  width: `${percentage}%` as `${number}%`,
                },
              ]}
            />
          </View>
          <Text style={[styles.myPlanPercent, { color: colors.textMuted }]}>
            {percentage}%
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

// ---------- My Plans Section ----------

function MyPlansSection() {
  const colors = useColors();
  const data = useLazyLoadQuery<plansTabMyPlansQuery>(MyPlansQuery, {});
  const plans = data.myJoinedReadingPlans ?? [];

  if (plans.length === 0) return null;

  return (
    <Animated.View entering={FadeIn.duration(400)} style={styles.section}>
      <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
        CONTINUE READING
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScroll}
        decelerationRate="fast"
        snapToInterval={MY_PLAN_CARD_WIDTH + 12}
        snapToAlignment="start"
      >
        {plans.map((item, index) => (
          <Animated.View
            key={item.id}
            entering={FadeInRight.duration(400).delay(index * 80)}
            style={{ width: MY_PLAN_CARD_WIDTH }}
          >
            <MyPlanCard
              dataKey={item}
              completedDays={item.myParticipation?.completedDaysCount ?? 0}
              totalDays={item.dayCount ?? 0}
            />
          </Animated.View>
        ))}
      </ScrollView>
    </Animated.View>
  );
}

// ---------- Browse Section ----------

function BrowseSection() {
  const colors = useColors();
  const [activeFilter, setActiveFilter] = useState<"all" | "official">("all");

  const data = useLazyLoadQuery<plansTabBrowseQuery>(BrowseQuery, {
    official: activeFilter === "official" || null,
  });
  const plans = data.readingPlans ?? [];

  const filters = [
    { key: "all" as const, label: "All" },
    { key: "official" as const, label: "Official" },
  ];

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
        DISCOVER
      </Text>
      <View style={styles.filterRow}>
        {filters.map((filter) => {
          const isActive = activeFilter === filter.key;
          return (
            <Pressable
              key={filter.key}
              onPress={() => {
                Haptics.selectionAsync();
                setActiveFilter(filter.key);
              }}
              style={[
                styles.filterChip,
                {
                  backgroundColor: isActive ? colors.text : "transparent",
                  borderColor: isActive ? colors.text : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  {
                    color: isActive ? colors.bg : colors.textSecondary,
                  },
                ]}
              >
                {filter.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.browseGrid}>
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
              entering={FadeInDown.duration(350).delay(100 + index * 60)}
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
          official: null,
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
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  listContent: {
    paddingTop: 24,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 14,
    paddingHorizontal: 20,
  },
  sectionContent: {
    gap: 10,
  },
  sectionLoading: {
    paddingVertical: 32,
    alignItems: "center",
  },

  // --- Horizontal My Plans Rail ---
  horizontalScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  myPlanCard: {
    borderWidth: 1,
    borderRadius: 14,
    overflow: "hidden",
  },
  myPlanCover: {
    width: "100%",
    aspectRatio: 16 / 9,
  },
  myPlanCoverPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  myPlanInfo: {
    padding: 12,
    gap: 8,
  },
  myPlanTitle: {
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: -0.2,
  },
  myPlanProgressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  myPlanTrack: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  myPlanFill: {
    height: "100%",
    borderRadius: 2,
  },
  myPlanPercent: {
    fontSize: 11,
    fontWeight: "600",
    minWidth: 30,
    textAlign: "right",
  },

  // --- Filter Chips ---
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 100,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 13,
    fontWeight: "600",
  },

  // --- Browse Grid ---
  browseGrid: {
    gap: 12,
    paddingHorizontal: 20,
  },
});
