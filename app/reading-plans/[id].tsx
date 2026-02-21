import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import * as Haptics from "expo-haptics";
import {
  BookMarked,
  BookOpen,
  Calendar,
  Check,
  FastForward,
  PartyPopper,
  Users,
} from "lucide-react-native";
import {
  graphql,
  useLazyLoadQuery,
  useMutation,
  useRelayEnvironment,
} from "react-relay";
import { fetchQuery } from "relay-runtime";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";

import { Image } from "expo-image";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Confetti } from "@/components/ui/confetti";
import { UserAvatar } from "@/components/user/user-avatar";
import { ReadingPlanProgressBar } from "@/components/reading-plans/ReadingPlanProgressBar";
import { ReadingPlanJoinButton } from "@/components/reading-plans/ReadingPlanJoinButton";
import { ReadingPlanDayCard } from "@/components/reading-plans/ReadingPlanDayCard";
import { ReadingPlanCircleProgress } from "@/components/reading-plans/ReadingPlanCircleProgress";
import { useColors } from "@/hooks/use-colors";
import {
  IS_LIQUID_GLASS,
  useTransparentHeaderPadding,
} from "@/hooks/use-transparent-header";
import { useReadingPlanStore } from "@/lib/stores/reading-plan-store";
import { useBibleStore } from "@/lib/stores/bible-store";
import type { IdReadingPlanQuery } from "@/lib/relay/__generated__/IdReadingPlanQuery.graphql";
import type { IdReadingPlanCatchUpMutation } from "@/lib/relay/__generated__/IdReadingPlanCatchUpMutation.graphql";

const detailQuery = graphql`
  query IdReadingPlanQuery($id: ID!) {
    readingPlanById(id: $id) {
      id
      title
      description
      visibility
      status
      isFeatured
      isOfficial
      participantCount
      dayCount
      coversFullBible
      coversOldTestament
      coversNewTestament
      coverImage {
        url
      }
      author {
        id
        name
        username
        image {
          url
        }
      }
      currentVersion {
        id
        days {
          id
          dayNumber
          readings {
            id
            book
            startChapter
            startVerse
            endVerse
          }
          ...ReadingPlanDayCardFragment
        }
      }
      myParticipation {
        id
        completedDaysCount
        hideProgress
        completedAt
        behindDaysCount
        progress {
          dayId
          completedAt
        }
        readingProgress {
          readingId
          completedAt
        }
      }
    }
  }
`;

const catchUpMutation = graphql`
  mutation IdReadingPlanCatchUpMutation($planId: ID!) {
    readingPlanCatchUp(planId: $planId) {
      id
      completedDaysCount
      completedAt
      behindDaysCount
    }
  }
`;

export default function ReadingPlanDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Stack.Screen
        options={{
          title: "Reading Plan",
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
        <DetailContent id={id} colors={colors} />
      </Suspense>
    </View>
  );
}

function DetailContent({
  id,
  colors,
}: {
  id: string;
  colors: ReturnType<typeof useColors>;
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const hasGlass = isLiquidGlassAvailable();
  const contentPaddingTop = useTransparentHeaderPadding();
  const router = useRouter();
  const environment = useRelayEnvironment();
  const data = useLazyLoadQuery<IdReadingPlanQuery>(detailQuery, { id });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const welcomeSheetRef = useRef<BottomSheetModal>(null);
  const startPlanSession = useReadingPlanStore((s) => s.startPlanSession);
  const setPosition = useBibleStore((s) => s.setPosition);
  const setScrollToVerse = useBibleStore((s) => s.setScrollToVerse);

  const [commitCatchUp, isCatchingUp] =
    useMutation<IdReadingPlanCatchUpMutation>(catchUpMutation);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await fetchQuery(environment, detailQuery, { id }).toPromise();
    } finally {
      setIsRefreshing(false);
    }
  }, [environment, id]);

  // Refetch when returning to this screen (e.g. after Bible reading)
  const isFirstFocus = useRef(true);
  useFocusEffect(
    useCallback(() => {
      if (isFirstFocus.current) {
        isFirstFocus.current = false;
        return;
      }
      fetchQuery(environment, detailQuery, { id }).toPromise();
    }, [environment, id]),
  );

  const plan = data.readingPlanById;
  const isJoined = plan?.myParticipation != null;
  const completedDayIds = new Set(
    plan?.myParticipation?.progress?.map((p) => p.dayId) ?? [],
  );
  const completedReadingIds = useMemo(
    () =>
      new Set(
        (plan?.myParticipation?.readingProgress ?? [])
          .map((p) => p.readingId)
          .filter((id): id is string => id != null),
      ),
    [plan?.myParticipation?.readingProgress],
  );
  const days = useMemo(
    () => plan?.currentVersion?.days ?? [],
    [plan?.currentVersion?.days],
  );
  const behindDaysCount = plan?.myParticipation?.behindDaysCount ?? 0;

  // Per-day reading progress (for showing partial progress like "2/4")
  const dayReadingProgress = useMemo(() => {
    const map = new Map<string, { completed: number; total: number }>();
    for (const day of days) {
      const dayReadings = day.readings ?? [];
      const completed = dayReadings.filter((r) =>
        completedReadingIds.has(r.id),
      ).length;
      map.set(day.id, { completed, total: dayReadings.length });
    }
    return map;
  }, [days, completedReadingIds]);

  // Total reading-level progress across all days
  const { totalReadingsCompleted, totalReadingsCount } = useMemo(() => {
    let completed = 0;
    let total = 0;
    for (const { completed: c, total: t } of dayReadingProgress.values()) {
      completed += c;
      total += t;
    }
    return { totalReadingsCompleted: completed, totalReadingsCount: total };
  }, [dayReadingProgress]);

  const handleJoined = useCallback(() => {
    setShowConfetti(true);
    setTimeout(() => {
      welcomeSheetRef.current?.present();
    }, 600);
  }, []);

  const handleDayPress = useCallback(
    (day: (typeof days)[number]) => {
      if (!isJoined || !plan) return;
      const readings = (day.readings ?? []).map((r) => ({
        id: r.id,
        book: r.book ?? "",
        startChapter: r.startChapter ?? 1,
        startVerse: r.startVerse,
        endVerse: r.endVerse,
      }));
      if (readings.length === 0) return;

      startPlanSession({
        planId: plan.id,
        dayId: day.id,
        dayNumber: day.dayNumber ?? 0,
        planTitle: plan.title ?? "",
        planDayCount: plan.dayCount ?? 0,
        readings,
        completedReadingIds,
      });

      // Navigate Bible to the first reading
      const first = readings[0];
      setPosition(first.book, first.startChapter);
      if (first.startVerse) {
        setScrollToVerse(first.startVerse);
      }
      router.navigate("/(tabs)");
    },
    [
      isJoined,
      plan,
      completedReadingIds,
      startPlanSession,
      setPosition,
      setScrollToVerse,
      router,
    ],
  );

  const [catchUpDone, setCatchUpDone] = useState(false);

  const handleCatchUp = useCallback(() => {
    if (!plan || isCatchingUp) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    commitCatchUp({
      variables: { planId: plan.id },
      onCompleted: () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setCatchUpDone(true);
        setTimeout(() => setCatchUpDone(false), 2000);
      },
    });
  }, [plan, isCatchingUp, commitCatchUp]);

  const handleStartReading = useCallback(() => {
    welcomeSheetRef.current?.dismiss();
    if (!plan || days.length === 0) return;
    const firstDay = days[0];
    handleDayPress(firstDay);
  }, [plan, days, handleDayPress]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    [],
  );

  const sheetColors = isDark
    ? { bg: "#0c0a09", handle: "#44403c" }
    : { bg: "#fdfcfb", handle: "#d6d3d1" };

  const renderBackground = useCallback(
    ({ style }: any) => (
      <GlassView
        style={[
          style,
          {
            backgroundColor: hasGlass ? "transparent" : sheetColors.bg,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            overflow: "hidden",
          },
        ]}
        glassEffectStyle="regular"
      />
    ),
    [sheetColors.bg, hasGlass],
  );

  if (!plan) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={{ color: colors.textMuted }}>Plan not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingTop: contentPaddingTop }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.textMuted}
            colors={[colors.accent]}
            progressViewOffset={contentPaddingTop}
          />
        }
      >
        {/* Cover image */}
        {plan.coverImage?.url && (
          <Image
            source={{ uri: plan.coverImage.url }}
            style={styles.heroImage}
            contentFit="cover"
          />
        )}

        {/* Header */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(100)}
          style={styles.headerSection}
        >
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: colors.text }]}>
              {plan.title}
            </Text>
            {plan.isOfficial && (
              <View
                style={[
                  styles.badge,
                  { backgroundColor: colors.accent + "18" },
                ]}
              >
                <Text style={[styles.badgeText, { color: colors.accent }]}>
                  Official
                </Text>
              </View>
            )}
          </View>

          {/* Coverage badges */}
          {(plan.coversFullBible ||
            plan.coversOldTestament ||
            plan.coversNewTestament) && (
            <View style={styles.coverageBadgeRow}>
              {plan.coversFullBible ? (
                <View
                  style={[styles.coverageBadge, { borderColor: colors.border }]}
                >
                  <BookMarked size={12} color={colors.textMuted} />
                  <Text
                    style={[styles.coverageBadgeText, { color: colors.text }]}
                  >
                    Full Bible
                  </Text>
                </View>
              ) : (
                <>
                  {plan.coversOldTestament && (
                    <View
                      style={[
                        styles.coverageBadge,
                        { borderColor: colors.border },
                      ]}
                    >
                      <BookOpen size={12} color={colors.textMuted} />
                      <Text
                        style={[
                          styles.coverageBadgeText,
                          { color: colors.text },
                        ]}
                      >
                        OT
                      </Text>
                    </View>
                  )}
                  {plan.coversNewTestament && (
                    <View
                      style={[
                        styles.coverageBadge,
                        { borderColor: colors.border },
                      ]}
                    >
                      <BookOpen size={12} color={colors.textMuted} />
                      <Text
                        style={[
                          styles.coverageBadgeText,
                          { color: colors.text },
                        ]}
                      >
                        NT
                      </Text>
                    </View>
                  )}
                </>
              )}
            </View>
          )}

          {plan.description && (
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              {plan.description}
            </Text>
          )}

          {/* Author + stats */}
          <View style={styles.metaRow}>
            <View style={styles.authorRow}>
              {plan.isOfficial ? (
                <>
                  <Image
                    source={require("@/assets/images/icon.png")}
                    style={{ width: 22, height: 22, borderRadius: 11 }}
                  />
                  <Text
                    style={[styles.authorName, { color: colors.textMuted }]}
                  >
                    Selah
                  </Text>
                </>
              ) : (
                <>
                  <UserAvatar
                    imageUrl={plan.author.image?.url}
                    name={plan.author.name}
                    size={22}
                  />
                  <Text
                    style={[styles.authorName, { color: colors.textMuted }]}
                  >
                    {plan.author.name || plan.author.username}
                  </Text>
                </>
              )}
            </View>
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Calendar size={14} color={colors.textMuted} />
                <Text style={[styles.statText, { color: colors.textMuted }]}>
                  {plan.dayCount} days
                </Text>
              </View>
              <View style={styles.stat}>
                <Users size={14} color={colors.textMuted} />
                <Text style={[styles.statText, { color: colors.textMuted }]}>
                  {plan.participantCount}
                </Text>
              </View>
            </View>
          </View>

          {/* Join button — owner can also join, status must be PUBLISHED */}
          {plan.status === "PUBLISHED" && (
            <ReadingPlanJoinButton
              planId={plan.id}
              isJoined={isJoined}
              onJoined={handleJoined}
            />
          )}

          {/* Catch up button */}
          {isJoined && behindDaysCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onPress={handleCatchUp}
              disabled={isCatchingUp || catchUpDone}
              style={styles.catchUpButton}
            >
              <View style={styles.catchUpContent}>
                {isCatchingUp ? (
                  <ActivityIndicator size="small" color={colors.text} />
                ) : catchUpDone ? (
                  <Check size={14} color={colors.text} />
                ) : (
                  <FastForward size={14} color={colors.text} />
                )}
                <Text style={[styles.catchUpText, { color: colors.text }]}>
                  {isCatchingUp
                    ? "Catching up..."
                    : catchUpDone
                      ? "All caught up!"
                      : `Catch up — ${behindDaysCount} ${behindDaysCount === 1 ? "day" : "days"} behind`}
                </Text>
              </View>
            </Button>
          )}

          {/* Progress */}
          {isJoined && plan.myParticipation && (
            <ReadingPlanProgressBar
              completed={plan.myParticipation.completedDaysCount ?? 0}
              total={plan.dayCount ?? 0}
              readingCompleted={totalReadingsCompleted}
              readingTotal={totalReadingsCount}
            />
          )}
        </Animated.View>

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        {/* Days */}
        <View style={styles.daysSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Reading Schedule
          </Text>
          {days.map((day, index) => {
            const rp = dayReadingProgress.get(day.id);
            const isDayDone = completedDayIds.has(day.id);
            const dayProgress =
              rp && rp.total > 0 ? rp.completed / rp.total : 0;

            return (
              <Animated.View
                key={day.id}
                entering={FadeInDown.duration(300).delay(200 + index * 40)}
                style={styles.dayRow}
              >
                {isJoined && (
                  <ReadingPlanCircleProgress
                    progress={isDayDone ? 1 : dayProgress}
                    size={32}
                    strokeWidth={2.5}
                  >
                    {isDayDone ? (
                      <Check size={14} color={colors.text} strokeWidth={3} />
                    ) : rp && rp.completed > 0 ? (
                      <Text
                        style={[
                          styles.circleProgressText,
                          { color: colors.textMuted },
                        ]}
                      >
                        {rp.completed}/{rp.total}
                      </Text>
                    ) : null}
                  </ReadingPlanCircleProgress>
                )}
                <Pressable
                  style={[
                    styles.dayCardPressable,
                    !isJoined && styles.dayCardDisabled,
                  ]}
                  onPress={() => handleDayPress(day)}
                  disabled={!isJoined}
                >
                  <ReadingPlanDayCard dataKey={day} />
                </Pressable>
              </Animated.View>
            );
          })}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Confetti — rendered outside ScrollView so it appears above everything */}
      {showConfetti && <Confetti onComplete={() => setShowConfetti(false)} />}

      {/* Welcome bottom sheet */}
      <BottomSheetModal
        ref={welcomeSheetRef}
        enableDynamicSizing
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundComponent={renderBackground}
        backgroundStyle={{
          backgroundColor: sheetColors.bg,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
        }}
        handleIndicatorStyle={{
          backgroundColor: hasGlass
            ? isDark
              ? "rgba(255,255,255,0.5)"
              : "rgba(0,0,0,0.3)"
            : sheetColors.handle,
          width: 40,
          height: 5,
          marginTop: 10,
        }}
      >
        <BottomSheetView style={styles.welcomeContainer}>
          <Animated.View
            entering={FadeIn.duration(400)}
            style={styles.welcomeIconRow}
          >
            <PartyPopper size={32} color={colors.text} />
          </Animated.View>
          <Animated.Text
            entering={FadeInUp.duration(400).delay(100)}
            style={[styles.welcomeTitle, { color: colors.text }]}
          >
            {"You're in!"}
          </Animated.Text>
          <Animated.Text
            entering={FadeInUp.duration(400).delay(200)}
            style={[styles.welcomeSubtitle, { color: colors.textSecondary }]}
          >
            {plan.title} — {plan.dayCount} days of reading ahead.
          </Animated.Text>
          <Animated.View
            entering={FadeInUp.duration(400).delay(300)}
            style={styles.welcomeButtons}
          >
            <Button
              variant="default"
              onPress={handleStartReading}
              style={styles.welcomeButton}
            >
              <Text
                style={[
                  styles.welcomeButtonText,
                  { color: colors.primaryForeground },
                ]}
              >
                Start reading
              </Text>
            </Button>
            <Button
              variant="outline"
              onPress={() => welcomeSheetRef.current?.dismiss()}
              style={styles.welcomeButton}
            >
              <Text style={[styles.welcomeButtonText, { color: colors.text }]}>
                Later
              </Text>
            </Button>
          </Animated.View>
        </BottomSheetView>
      </BottomSheetModal>
    </View>
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
  scrollView: {
    flex: 1,
  },
  heroImage: {
    width: "100%",
    aspectRatio: 16 / 9,
  },
  headerSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    gap: 10,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  coverageBadgeRow: {
    flexDirection: "row",
    gap: 6,
    flexWrap: "wrap",
  },
  coverageBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  coverageBadgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  authorName: {
    fontSize: 13,
    fontWeight: "500",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 13,
  },
  catchUpButton: {
    alignSelf: "flex-start",
  },
  catchUpContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  catchUpText: {
    fontSize: 13,
    fontWeight: "600",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
  daysSection: {
    padding: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  dayRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dayCardPressable: {
    flex: 1,
  },
  dayCardDisabled: {
    opacity: 0.5,
  },
  circleProgressText: {
    fontSize: 7,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  bottomPadding: {
    height: 40,
  },
  welcomeContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: "center",
    gap: 12,
  },
  welcomeIconRow: {
    marginBottom: 4,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: "700",
  },
  welcomeSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },
  welcomeButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
    width: "100%",
  },
  welcomeButton: {
    flex: 1,
  },
  welcomeButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
