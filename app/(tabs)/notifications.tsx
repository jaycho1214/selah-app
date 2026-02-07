import { Bell, LogIn } from "lucide-react-native";
import { Suspense, useCallback, useState } from "react";
import { Pressable, RefreshControl, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeIn } from "react-native-reanimated";
import { FlashList } from "@shopify/flash-list";
import {
  graphql,
  useLazyLoadQuery,
  useMutation,
  usePaginationFragment,
  useRelayEnvironment,
} from "react-relay";
import { fetchQuery } from "relay-runtime";
import { useFocusEffect } from "@react-navigation/native";

import { useSession } from "@/components/providers/session-provider";
import { Text } from "@/components/ui/text";
import { useColors } from "@/hooks/use-colors";
import { NotificationItem } from "@/components/notifications/notification-item";
import { NotificationsSkeleton } from "@/components/notifications/notifications-skeleton";
import type { notificationsScreenQuery } from "@/lib/relay/__generated__/notificationsScreenQuery.graphql";
import type { notificationsScreenListFragment$key } from "@/lib/relay/__generated__/notificationsScreenListFragment.graphql";
import type { notificationsScreenMarkAsReadMutation } from "@/lib/relay/__generated__/notificationsScreenMarkAsReadMutation.graphql";

// ---------- GraphQL ----------

const NotificationsQuery = graphql`
  query notificationsScreenQuery {
    user {
      unreadNotificationCount
    }
    ...notificationsScreenListFragment
  }
`;

const NotificationsListFragment = graphql`
  fragment notificationsScreenListFragment on Query
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 20 }
    cursor: { type: "String" }
  )
  @refetchable(queryName: "notificationsScreenListPaginationQuery") {
    notifications(first: $count, after: $cursor)
      @connection(key: "notificationsScreenList_notifications") {
      edges {
        node {
          id
          ...notificationItemFragment
        }
      }
    }
  }
`;

const MarkAsReadMutation = graphql`
  mutation notificationsScreenMarkAsReadMutation {
    notificationMarkAsRead
  }
`;

// ---------- Notification List ----------

function NotificationList() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const environment = useRelayEnvironment();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const queryData = useLazyLoadQuery<notificationsScreenQuery>(
    NotificationsQuery,
    {},
  );

  const { data, loadNext, hasNext, isLoadingNext } = usePaginationFragment<
    notificationsScreenQuery,
    notificationsScreenListFragment$key
  >(NotificationsListFragment, queryData);

  const notifications = data.notifications?.edges ?? [];

  const [commitMarkAsRead] =
    useMutation<notificationsScreenMarkAsReadMutation>(MarkAsReadMutation);

  // Mark as read on screen focus
  useFocusEffect(
    useCallback(() => {
      if (
        queryData.user?.unreadNotificationCount &&
        queryData.user.unreadNotificationCount > 0
      ) {
        commitMarkAsRead({ variables: {} });
      }
    }, [queryData.user?.unreadNotificationCount, commitMarkAsRead]),
  );

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchQuery(environment, NotificationsQuery, {}).subscribe({
      complete: () => setIsRefreshing(false),
      error: () => setIsRefreshing(false),
    });
  }, [environment]);

  const handleLoadMore = useCallback(() => {
    if (hasNext && !isLoadingNext) {
      loadNext(20);
    }
  }, [hasNext, isLoadingNext, loadNext]);

  if (notifications.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Animated.View
          entering={FadeIn.duration(400).delay(200)}
          style={[
            styles.emptyCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.emptyIconContainer,
              { backgroundColor: colors.surfaceElevated },
            ]}
          >
            <Bell size={24} color={colors.textMuted} strokeWidth={1.5} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            No notifications yet
          </Text>
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>
            When someone likes, replies, or mentions you, it will show up here
          </Text>
        </Animated.View>
      </View>
    );
  }

  return (
    <FlashList
      data={notifications}
      keyExtractor={(item) => item.node.id}
      renderItem={({ item }) => (
        <NotificationItem notificationRef={item.node} />
      )}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          tintColor={colors.textMuted}
        />
      }
      contentContainerStyle={{
        paddingBottom: insets.bottom + 100,
      }}
    />
  );
}

// ---------- Unauthenticated State ----------

function UnauthenticatedState() {
  const colors = useColors();
  const { presentSignIn } = useSession();

  return (
    <View style={styles.emptyContainer}>
      <Animated.View
        entering={FadeIn.duration(400).delay(200)}
        style={[
          styles.emptyCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <View
          style={[
            styles.emptyIconContainer,
            { backgroundColor: `${colors.accent}20` },
          ]}
        >
          <LogIn size={24} color={colors.accent} strokeWidth={1.5} />
        </View>
        <Text style={[styles.emptyTitle, { color: colors.text }]}>
          Sign in to see notifications
        </Text>
        <Text style={[styles.emptyText, { color: colors.textMuted }]}>
          Sign in to get notified about likes, replies, and more
        </Text>
        <Pressable
          onPress={presentSignIn}
          style={[styles.ctaButton, { backgroundColor: colors.accent }]}
        >
          <Text style={[styles.ctaButtonText, { color: "#fff" }]}>Sign In</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

// ---------- Screen ----------

export default function NotificationsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { isAuthenticated } = useSession();

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
          Notifications
        </Text>
      </View>

      {!isAuthenticated ? (
        <UnauthenticatedState />
      ) : (
        <Suspense fallback={<NotificationsSkeleton />}>
          <NotificationList />
        </Suspense>
      )}
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
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  // Empty states
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  emptyCard: {
    alignItems: "center",
    padding: 36,
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: "dashed",
  },
  emptyIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 21,
    maxWidth: 260,
  },
  ctaButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  ctaButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
