import { Suspense, useCallback, useState } from "react";
import { ErrorBoundary } from "@/components/error-boundary";
import { RefreshControl, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
import { EmptyState } from "@/components/ui/empty-state";
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

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await fetchQuery(environment, NotificationsQuery, {}).toPromise();
    } finally {
      setIsRefreshing(false);
    }
  }, [environment]);

  const handleLoadMore = useCallback(() => {
    if (hasNext && !isLoadingNext) {
      loadNext(20);
    }
  }, [hasNext, isLoadingNext, loadNext]);

  const renderItem = useCallback(
    ({ item }: { item: (typeof notifications)[number] }) => (
      <NotificationItem notificationRef={item.node} />
    ),
    [],
  );

  const keyExtractor = useCallback(
    (item: (typeof notifications)[number]) => item.node.id,
    [],
  );

  if (notifications.length === 0) {
    return (
      <EmptyState
        title="No notifications yet"
        message="When someone likes, replies, or mentions you, it will show up here"
      />
    );
  }

  return (
    <FlashList
      data={notifications}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
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
  const { presentSignIn } = useSession();

  return (
    <EmptyState
      title="Don't miss a thing"
      message="Sign in to get notified when others respond to your reflections."
      action={{ label: "Sign In", onPress: presentSignIn }}
    />
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
        <ErrorBoundary propagateServerErrors>
          <Suspense fallback={<NotificationsSkeleton />}>
            <NotificationList />
          </Suspense>
        </ErrorBoundary>
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
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
});
