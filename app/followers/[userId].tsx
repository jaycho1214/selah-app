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
import type { UserIdFollowersQuery } from "@/lib/relay/__generated__/UserIdFollowersQuery.graphql";
import type { UserIdFollowersFragment$key } from "@/lib/relay/__generated__/UserIdFollowersFragment.graphql";

export default function FollowersScreen() {
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
          title: "Followers",
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
        <FollowersContent userId={userId} />
      </Suspense>
    </View>
  );
}

function FollowersContent({ userId }: { userId: string }) {
  const queryData = useLazyLoadQuery<UserIdFollowersQuery>(query, {
    userId,
  });

  if (queryData.node == null) return null;

  return <FollowersList dataKey={queryData.node} />;
}

function FollowersList({ dataKey }: { dataKey: UserIdFollowersFragment$key }) {
  const { data, hasNext, isLoadingNext, loadNext } = usePaginationFragment(
    fragment,
    dataKey,
  );

  return (
    <UserList
      users={data.followers.edges}
      hasNext={hasNext}
      isLoadingNext={isLoadingNext}
      loadNext={() => loadNext(20)}
      emptyMessage="No followers yet"
      emptySubMessage="When people follow this user, they'll appear here"
    />
  );
}

const query = graphql`
  query UserIdFollowersQuery($userId: ID!) {
    node(id: $userId) {
      ...UserIdFollowersFragment
    }
  }
`;

const fragment = graphql`
  fragment UserIdFollowersFragment on User
  @refetchable(queryName: "UserIdFollowersPaginationQuery")
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 20 }
    cursor: { type: "String" }
  ) {
    followers(first: $count, after: $cursor)
      @connection(key: "UserIdFollowers_followers") {
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
