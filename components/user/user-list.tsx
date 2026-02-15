import { FlashList } from "@shopify/flash-list";
import { useCallback } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { EmptyState } from "@/components/ui/empty-state";
import { UserRow } from "@/components/user/user-row";
import type { userRow_user$key } from "@/lib/relay/__generated__/userRow_user.graphql";

interface UserEdge {
  readonly node: userRow_user$key | null;
}

interface UserListProps {
  users: ReadonlyArray<UserEdge | null>;
  hasNext: boolean;
  isLoadingNext: boolean;
  loadNext: () => void;
  emptyMessage: string;
  emptySubMessage?: string;
}

export function UserList({
  users,
  hasNext,
  isLoadingNext,
  loadNext,
  emptyMessage,
  emptySubMessage,
}: UserListProps) {
  // Filter out null edges and nodes
  const validUsers = users.filter(
    (edge): edge is { readonly node: userRow_user$key } =>
      edge !== null && edge.node !== null,
  );

  const renderItem = useCallback(
    ({ item }: { item: { readonly node: userRow_user$key } }) => (
      <UserRow userRef={item.node} />
    ),
    [],
  );

  const keyExtractor = useCallback(
    (_item: { readonly node: userRow_user$key }, index: number) => {
      return String(index);
    },
    [],
  );

  const onEndReached = useCallback(() => {
    if (hasNext && !isLoadingNext) {
      loadNext();
    }
  }, [hasNext, isLoadingNext, loadNext]);

  if (validUsers.length === 0) {
    return (
      <EmptyState
        title={emptyMessage}
        message={emptySubMessage}
        animationDelay={0}
      />
    );
  }

  return (
    <FlashList
      data={validUsers}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isLoadingNext ? (
          <View style={styles.footer}>
            <ActivityIndicator />
          </View>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  footer: {
    paddingVertical: 20,
    alignItems: "center",
  },
});
