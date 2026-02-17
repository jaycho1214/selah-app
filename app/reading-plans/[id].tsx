import { Suspense, useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Calendar, Users } from "lucide-react-native";
import { graphql, useLazyLoadQuery, useRelayEnvironment } from "react-relay";
import { fetchQuery } from "relay-runtime";
import Animated, { FadeInDown } from "react-native-reanimated";

import { Image } from "expo-image";
import { Text } from "@/components/ui/text";
import { UserAvatar } from "@/components/user/user-avatar";
import { ReadingPlanProgressBar } from "@/components/reading-plans/ReadingPlanProgressBar";
import { ReadingPlanJoinButton } from "@/components/reading-plans/ReadingPlanJoinButton";
import { ReadingPlanDayCard } from "@/components/reading-plans/ReadingPlanDayCard";
import { ReadingPlanDayCheck } from "@/components/reading-plans/ReadingPlanDayCheck";
import { useColors } from "@/hooks/use-colors";
import {
  IS_LIQUID_GLASS,
  useTransparentHeaderPadding,
} from "@/hooks/use-transparent-header";
import { useReadingPlanStore } from "@/lib/stores/reading-plan-store";
import { useBibleStore } from "@/lib/stores/bible-store";
import type { IdReadingPlanQuery } from "@/lib/relay/__generated__/IdReadingPlanQuery.graphql";

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
            endChapter
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
  const contentPaddingTop = useTransparentHeaderPadding();
  const router = useRouter();
  const environment = useRelayEnvironment();
  const data = useLazyLoadQuery<IdReadingPlanQuery>(detailQuery, { id });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startPlanSession = useReadingPlanStore((s) => s.startPlanSession);
  const setPosition = useBibleStore((s) => s.setPosition);
  const setScrollToVerse = useBibleStore((s) => s.setScrollToVerse);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await fetchQuery(environment, detailQuery, { id }).toPromise();
    } finally {
      setIsRefreshing(false);
    }
  }, [environment, id]);

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
  const days = plan?.currentVersion?.days ?? [];

  const handleDayPress = useCallback(
    (day: (typeof days)[number]) => {
      if (!isJoined || !plan) return;
      const readings = (day.readings ?? []).map((r) => ({
        id: r.id,
        book: r.book,
        startChapter: r.startChapter,
        startVerse: r.startVerse,
        endChapter: r.endChapter,
        endVerse: r.endVerse,
      }));
      if (readings.length === 0) return;

      startPlanSession({
        planId: plan.id,
        dayId: day.id,
        dayNumber: day.dayNumber,
        planTitle: plan.title,
        planDayCount: plan.dayCount,
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

  if (!plan) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={{ color: colors.textMuted }}>Plan not found</Text>
      </View>
    );
  }

  return (
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
              style={[styles.badge, { backgroundColor: colors.accent + "18" }]}
            >
              <Text style={[styles.badgeText, { color: colors.accent }]}>
                Official
              </Text>
            </View>
          )}
        </View>

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
                <Text style={[styles.authorName, { color: colors.textMuted }]}>
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
                <Text style={[styles.authorName, { color: colors.textMuted }]}>
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
          <ReadingPlanJoinButton planId={plan.id} isJoined={isJoined} />
        )}

        {/* Progress */}
        {isJoined && plan.myParticipation && (
          <ReadingPlanProgressBar
            completed={plan.myParticipation.completedDaysCount}
            total={plan.dayCount}
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
        {days.map((day, index) => (
          <Animated.View
            key={day.id}
            entering={FadeInDown.duration(300).delay(200 + index * 40)}
            style={styles.dayRow}
          >
            {isJoined && (
              <ReadingPlanDayCheck
                planId={plan.id}
                dayId={day.id}
                isCompleted={completedDayIds.has(day.id)}
              />
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
        ))}
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
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
  bottomPadding: {
    height: 40,
  },
});
