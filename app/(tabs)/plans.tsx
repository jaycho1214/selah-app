import { Suspense, useCallback, useEffect, useState } from "react";
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
import * as SecureStore from "expo-secure-store";
import {
  BookMarked,
  BookOpen,
  Flame,
  Monitor,
  Trophy,
  X,
} from "lucide-react-native";
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
import { EmptyState } from "@/components/ui/empty-state";
import { Text } from "@/components/ui/text";
import { useColors } from "@/hooks/use-colors";
import { useBehindDaysStore } from "@/lib/stores/behind-days-store";
import type { plansTabMyPlansQuery } from "@/lib/relay/__generated__/plansTabMyPlansQuery.graphql";
import type { plansTabBrowseQuery } from "@/lib/relay/__generated__/plansTabBrowseQuery.graphql";
import type { plansTabStreakQuery } from "@/lib/relay/__generated__/plansTabStreakQuery.graphql";
import type { plansTabStatsQuery } from "@/lib/relay/__generated__/plansTabStatsQuery.graphql";
import type { plansTabBehindQuery } from "@/lib/relay/__generated__/plansTabBehindQuery.graphql";
import type { plansTabMyPlanCardFragment$key } from "@/lib/relay/__generated__/plansTabMyPlanCardFragment.graphql";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const MY_PLAN_CARD_WIDTH = SCREEN_WIDTH * 0.72;
const MANAGE_BANNER_KEY = "selah_manage_banner_dismissed";

// ---------- GraphQL ----------

const MyPlansQuery = graphql`
  query plansTabMyPlansQuery {
    myJoinedReadingPlans(first: 50) {
      id
      dayCount
      currentVersion {
        days {
          readings {
            id
          }
        }
      }
      myParticipation {
        id
        completedDaysCount
        readingProgress {
          readingId
        }
      }
      ...ReadingPlanCardFragment
      ...plansTabMyPlanCardFragment
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

const StreakQuery = graphql`
  query plansTabStreakQuery {
    myReadingPlanStreak {
      currentStreak
      longestStreak
    }
  }
`;

const StatsQuery = graphql`
  query plansTabStatsQuery {
    myReadingPlanStats {
      completedPlansCount
      fullBibleCount
      oldTestamentCount
      newTestamentCount
    }
  }
`;

const BehindQuery = graphql`
  query plansTabBehindQuery {
    user {
      behindReadingPlanDaysCount
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
  readingPercentage,
}: {
  dataKey: plansTabMyPlanCardFragment$key;
  completedDays: number;
  totalDays: number;
  readingPercentage: number;
}) {
  const data = useFragment(myPlanCardFragment, dataKey);
  const colors = useColors();
  const router = useRouter();
  const percentage = readingPercentage;

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

// ---------- Behind Days Fetcher ----------

function BehindDaysFetcher() {
  const data = useLazyLoadQuery<plansTabBehindQuery>(BehindQuery, {});
  const setBehindDaysCount = useBehindDaysStore((s) => s.setBehindDaysCount);

  useEffect(() => {
    setBehindDaysCount(data.user?.behindReadingPlanDaysCount ?? 0);
  }, [data.user?.behindReadingPlanDaysCount, setBehindDaysCount]);

  return null;
}

// ---------- Streak Display ----------

function StreakDisplay() {
  const colors = useColors();
  const data = useLazyLoadQuery<plansTabStreakQuery>(StreakQuery, {});
  const streak = data.myReadingPlanStreak;

  const current = streak?.currentStreak ?? 0;
  const longest = streak?.longestStreak ?? 0;

  if (!streak || current === 0) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(400)}
      style={[styles.streakRow, { borderBottomColor: colors.border }]}
    >
      <View style={styles.streakItem}>
        <Flame size={16} color={colors.text} />
        <Text style={[styles.streakText, { color: colors.text }]}>
          {current} day streak
        </Text>
      </View>
      {longest > current && (
        <>
          <Text style={[styles.streakDivider, { color: colors.textMuted }]}>
            |
          </Text>
          <View style={styles.streakItem}>
            <Trophy size={14} color={colors.textMuted} />
            <Text style={[styles.streakBestText, { color: colors.textMuted }]}>
              Best: {longest}
            </Text>
          </View>
        </>
      )}
    </Animated.View>
  );
}

// ---------- Stats Display ----------

function StatsDisplay() {
  const colors = useColors();
  const data = useLazyLoadQuery<plansTabStatsQuery>(StatsQuery, {});
  const stats = data.myReadingPlanStats;
  const completedPlans = stats?.completedPlansCount ?? 0;
  const fullBible = stats?.fullBibleCount ?? 0;
  const ot = stats?.oldTestamentCount ?? 0;
  const nt = stats?.newTestamentCount ?? 0;

  if (completedPlans === 0 && fullBible === 0 && ot === 0 && nt === 0) {
    return null;
  }

  return (
    <Animated.View entering={FadeIn.duration(400)} style={styles.statsRow}>
      {completedPlans > 0 && (
        <View style={styles.statItem}>
          <Trophy size={13} color={colors.textMuted} />
          <Text style={[styles.statItemText, { color: colors.textMuted }]}>
            Plans x{completedPlans}
          </Text>
        </View>
      )}
      {fullBible > 0 && (
        <View style={styles.statItem}>
          <BookMarked size={13} color={colors.textMuted} />
          <Text style={[styles.statItemText, { color: colors.textMuted }]}>
            Bible x{fullBible}
          </Text>
        </View>
      )}
      {ot > 0 && (
        <View style={styles.statItem}>
          <BookOpen size={13} color={colors.textMuted} />
          <Text style={[styles.statItemText, { color: colors.textMuted }]}>
            OT x{ot}
          </Text>
        </View>
      )}
      {nt > 0 && (
        <View style={styles.statItem}>
          <BookOpen size={13} color={colors.textMuted} />
          <Text style={[styles.statItemText, { color: colors.textMuted }]}>
            NT x{nt}
          </Text>
        </View>
      )}
    </Animated.View>
  );
}

// ---------- Management Notice ----------

function ManagementNotice() {
  const colors = useColors();
  const [dismissed, setDismissed] = useState<boolean | null>(null);

  useEffect(() => {
    SecureStore.getItemAsync(MANAGE_BANNER_KEY).then((val) => {
      setDismissed(val === "true");
    });
  }, []);

  const handleDismiss = useCallback(() => {
    setDismissed(true);
    SecureStore.setItemAsync(MANAGE_BANNER_KEY, "true");
  }, []);

  if (dismissed === null || dismissed) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      style={[
        styles.manageBanner,
        {
          backgroundColor: colors.surfaceElevated,
          borderColor: colors.border,
        },
      ]}
    >
      <Monitor size={14} color={colors.textMuted} />
      <Text
        style={[styles.manageBannerText, { color: colors.textSecondary }]}
        numberOfLines={1}
      >
        Create and manage plans on selah.kr
      </Text>
      <Pressable onPress={handleDismiss} hitSlop={8}>
        <X size={14} color={colors.textMuted} />
      </Pressable>
    </Animated.View>
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
        {plans.map((item, index) => {
          const totalReadings =
            item.currentVersion?.days?.reduce(
              (sum, d) => sum + (d.readings?.length ?? 0),
              0,
            ) ?? 0;
          const completedReadingIds = new Set(
            (item.myParticipation?.readingProgress ?? [])
              .map((p) => p.readingId)
              .filter((id): id is string => id != null),
          );
          const readingPct =
            totalReadings > 0
              ? Math.round((completedReadingIds.size / totalReadings) * 100)
              : 0;

          return (
            <Animated.View
              key={item.id}
              entering={FadeInRight.duration(400).delay(index * 80)}
              style={{ width: MY_PLAN_CARD_WIDTH }}
            >
              <MyPlanCard
                dataKey={item}
                completedDays={item.myParticipation?.completedDaysCount ?? 0}
                totalDays={item.dayCount ?? 0}
                readingPercentage={readingPct}
              />
            </Animated.View>
          );
        })}
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
        promises.push(fetchQuery(environment, StreakQuery, {}).toPromise());
        promises.push(fetchQuery(environment, StatsQuery, {}).toPromise());
        promises.push(fetchQuery(environment, BehindQuery, {}).toPromise());
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
              <>
                {/* Behind days fetcher (invisible) */}
                <ErrorBoundary propagateServerErrors>
                  <Suspense fallback={null}>
                    <BehindDaysFetcher />
                  </Suspense>
                </ErrorBoundary>

                {/* Management notice */}
                <ManagementNotice />

                {/* Streak */}
                <ErrorBoundary propagateServerErrors>
                  <Suspense fallback={null}>
                    <StreakDisplay />
                  </Suspense>
                </ErrorBoundary>

                {/* Stats */}
                <ErrorBoundary propagateServerErrors>
                  <Suspense fallback={null}>
                    <StatsDisplay />
                  </Suspense>
                </ErrorBoundary>

                {/* My Plans */}
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
              </>
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

  // --- Streak ---
  streakRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 8,
  },
  streakItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  streakText: {
    fontSize: 14,
    fontWeight: "600",
  },
  streakDivider: {
    fontSize: 14,
  },
  streakBestText: {
    fontSize: 13,
  },

  // --- Stats ---
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexWrap: "wrap",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statItemText: {
    fontSize: 13,
  },

  // --- Management Notice ---
  manageBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  manageBannerText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "500",
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
