import { FlashList } from '@shopify/flash-list';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Users } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { UserRow } from '@/components/user/user-row';
import { useColors } from '@/hooks/use-colors';
import type { userRow_user$key } from '@/lib/relay/__generated__/userRow_user.graphql';

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
  const colors = useColors();

  // Filter out null edges and nodes
  const validUsers = users.filter(
    (edge): edge is { readonly node: userRow_user$key } =>
      edge !== null && edge.node !== null
  );

  if (validUsers.length === 0) {
    return (
      <Animated.View
        entering={FadeIn.duration(300)}
        style={styles.emptyContainer}
      >
        <View
          style={[
            styles.emptyIconContainer,
            { backgroundColor: colors.surfaceElevated },
          ]}
        >
          <Users size={32} color={colors.textMuted} strokeWidth={1.5} />
        </View>
        <Text style={[styles.emptyTitle, { color: colors.text }]}>
          {emptyMessage}
        </Text>
        {emptySubMessage && (
          <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
            {emptySubMessage}
          </Text>
        )}
      </Animated.View>
    );
  }

  return (
    <FlashList
      data={validUsers}
      renderItem={({ item }) => <UserRow userRef={item.node} />}
      keyExtractor={(item, index) => {
        // Use index as fallback since we can't access node.id directly
        // (it's hidden in the fragment)
        return String(index);
      }}
      onEndReached={() => {
        if (hasNext && !isLoadingNext) {
          loadNext();
        }
      }}
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
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});
