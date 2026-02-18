import { Suspense, useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { Stack } from "expo-router";
import { graphql, useLazyLoadQuery, useRelayEnvironment } from "react-relay";
import { fetchQuery } from "relay-runtime";
import Animated, { FadeInDown } from "react-native-reanimated";

import { EmptyState } from "@/components/ui/empty-state";
import { ReadingPlanCard } from "@/components/reading-plans/ReadingPlanCard";
import { ReadingPlanProgressBar } from "@/components/reading-plans/ReadingPlanProgressBar";
import { useColors } from "@/hooks/use-colors";
import {
  IS_LIQUID_GLASS,
  useTransparentHeaderPadding,
} from "@/hooks/use-transparent-header";
import type { myPlansQuery } from "@/lib/relay/__generated__/myPlansQuery.graphql";

const joinedQuery = graphql`
  query myPlansQuery {
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

export default function MyReadingPlansPage() {
  const colors = useColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Stack.Screen
        options={{
          title: "My Reading Plans",
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
        <MyPlansContent colors={colors} />
      </Suspense>
    </View>
  );
}

function MyPlansContent({ colors }: { colors: ReturnType<typeof useColors> }) {
  const contentPaddingTop = useTransparentHeaderPadding();
  const environment = useRelayEnvironment();
  const data = useLazyLoadQuery<myPlansQuery>(joinedQuery, {});
  const [isRefreshing, setIsRefreshing] = useState(false);

  const plans = data.myJoinedReadingPlans ?? [];

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await fetchQuery(environment, joinedQuery, {}).toPromise();
    } finally {
      setIsRefreshing(false);
    }
  }, [environment]);

  return (
    <FlatList
      data={plans}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => (
        <Animated.View
          entering={FadeInDown.duration(300).delay(index * 50)}
          style={styles.cardWrapper}
        >
          <ReadingPlanCard dataKey={item} />
          {item.myParticipation && (
            <View style={styles.progressWrapper}>
              <ReadingPlanProgressBar
                completed={item.myParticipation.completedDaysCount ?? 0}
                total={item.dayCount ?? 0}
              />
            </View>
          )}
        </Animated.View>
      )}
      contentContainerStyle={[
        styles.list,
        { paddingTop: contentPaddingTop + 8 },
      ]}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListEmptyComponent={
        <EmptyState
          title="No plans yet"
          message="Join a reading plan to start tracking your progress."
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
  cardWrapper: {
    gap: 6,
  },
  progressWrapper: {
    paddingHorizontal: 4,
  },
});
