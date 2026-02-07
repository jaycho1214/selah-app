import { View, StyleSheet } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import Animated, { FadeIn } from "react-native-reanimated";
import { Users } from "lucide-react-native";

import { Text } from "@/components/ui/text";
import { useColors } from "@/hooks/use-colors";
import {
  IS_LIQUID_GLASS,
  useTransparentHeaderPadding,
} from "@/hooks/use-transparent-header";

/**
 * Followers list screen.
 *
 * NOTE: The GraphQL schema currently lacks a `followers` connection field on User.
 * This screen shows an empty state until backend support is added.
 *
 * When backend adds `followers(first: Int, after: String): UserConnection` to User type,
 * this screen should be updated to use usePaginationFragment with:
 *
 * fragment followersListFragment on User
 * @refetchable(queryName: "followersListPaginationQuery") {
 *   followers(first: $first, after: $after)
 *   @connection(key: "followersList_followers") {
 *     edges { node { id ...userRow_user } }
 *   }
 * }
 */
export default function FollowersScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const colors = useColors();
  const contentPaddingTop = useTransparentHeaderPadding();

  // TODO: Implement with Relay pagination when backend adds followers connection
  // For now, show empty state indicating feature pending backend support

  return (
    <View
      style={[styles.container, { backgroundColor: colors.bg, paddingTop: contentPaddingTop }]}
    >
      <Stack.Screen
        options={{
          title: "Followers",
          headerTransparent: IS_LIQUID_GLASS,
          headerStyle: { backgroundColor: IS_LIQUID_GLASS ? "transparent" : colors.bg },
          headerShadowVisible: false,
        }}
      />
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
          No followers yet
        </Text>
        <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
          When people follow this user, they&apos;ll appear here
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
