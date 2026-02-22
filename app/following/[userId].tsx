import { Suspense } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { graphql } from "relay-runtime";
import { useLazyLoadQuery, usePaginationFragment } from "react-relay";

import { UserList } from "@/components/user/user-list";
import { useColors } from "@/hooks/use-colors";
import {
  IS_LIQUID_GLASS,
  useTransparentHeaderPadding,
} from "@/hooks/use-transparent-header";
import type { UserIdFollowingQuery } from "@/lib/relay/__generated__/UserIdFollowingQuery.graphql";
import type { UserIdFollowingFragment$key } from "@/lib/relay/__generated__/UserIdFollowingFragment.graphql";

export default function FollowingScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const colors = useColors();
  const contentPaddingTop = useTransparentHeaderPadding();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.bg, paddingTop: contentPaddingTop },
      ]}
    >
      <Stack.Screen
        options={{
          title: "Following",
          headerTransparent: IS_LIQUID_GLASS,
          headerStyle: {
            backgroundColor: IS_LIQUID_GLASS ? "transparent" : colors.bg,
          },
          headerShadowVisible: false,
          headerBackTitle: "",
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <Suspense
        fallback={
          <View style={styles.loading}>
            <ActivityIndicator />
          </View>
        }
      >
        <FollowingContent userId={userId} />
      </Suspense>
    </View>
  );
}

function FollowingContent({ userId }: { userId: string }) {
  const queryData = useLazyLoadQuery<UserIdFollowingQuery>(query, {
    userId,
  });

  if (queryData.node == null) return null;

  return <FollowingList dataKey={queryData.node} />;
}

function FollowingList({ dataKey }: { dataKey: UserIdFollowingFragment$key }) {
  const { data, hasNext, isLoadingNext, loadNext } = usePaginationFragment(
    fragment,
    dataKey,
  );

  return (
    <UserList
      users={data.following.edges}
      hasNext={hasNext}
      isLoadingNext={isLoadingNext}
      loadNext={() => loadNext(20)}
      emptyMessage="Not following anyone"
      emptySubMessage="When this user follows people, they'll appear here"
    />
  );
}

const query = graphql`
  query UserIdFollowingQuery($userId: ID!) {
    node(id: $userId) {
      ...UserIdFollowingFragment
    }
  }
`;

const fragment = graphql`
  fragment UserIdFollowingFragment on User
  @refetchable(queryName: "UserIdFollowingPaginationQuery")
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 20 }
    cursor: { type: "String" }
  ) {
    following(first: $count, after: $cursor)
      @connection(key: "UserIdFollowing_following") {
      edges {
        node {
          id
          ...userRow_user
        }
      }
    }
  }
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
