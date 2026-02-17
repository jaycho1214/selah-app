import { Suspense, useCallback, useState } from "react";
import { RefreshControl, StyleSheet, View } from "react-native";
import { Stack } from "expo-router";
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

import { ErrorBoundary } from "@/components/error-boundary";
import { useSession } from "@/components/providers/session-provider";
import { EmptyState } from "@/components/ui/empty-state";
import { useColors } from "@/hooks/use-colors";
import { NotificationItem } from "@/components/notifications/notification-item";
import { NotificationsSkeleton } from "@/components/notifications/notifications-skeleton";
import {
  IS_LIQUID_GLASS,
  useTransparentHeaderPadding,
} from "@/hooks/use-transparent-header";
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
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.listContent}
    />
  );
}

// ---------- Unauthenticated State ----------

function UnauthenticatedState({
  style,
}: {
  style?: import("react-native").StyleProp<import("react-native").ViewStyle>;
}) {
  const { presentSignIn } = useSession();

  return (
    <EmptyState
      title="Don't miss a thing"
      message="Sign in to get notified when others respond to your reflections."
      action={{ label: "Sign In", onPress: presentSignIn }}
      style={style}
    />
  );
}

// ---------- Screen ----------

export default function NotificationsScreen() {
  const colors = useColors();
  const { isAuthenticated } = useSession();
  const contentPaddingTop = useTransparentHeaderPadding();

  return (
    <View style={[styles.screen, { backgroundColor: colors.bg }]}>
      <Stack.Screen
        options={{
          title: "Notifications",
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

      {!isAuthenticated ? (
        <UnauthenticatedState style={{ paddingTop: contentPaddingTop }} />
      ) : (
        <ErrorBoundary propagateServerErrors>
          <Suspense
            fallback={
              <View style={{ paddingTop: contentPaddingTop }}>
                <NotificationsSkeleton />
              </View>
            }
          >
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
  listContent: {
    paddingBottom: 40,
  },
});
