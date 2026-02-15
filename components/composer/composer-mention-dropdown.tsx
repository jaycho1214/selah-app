import {
  View,
  Pressable,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  type ViewStyle,
} from "react-native";
import { Image } from "expo-image";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";

import { Text } from "@/components/ui/text";
import type { MentionUser } from "./use-composer-state";

interface ComposerMentionDropdownProps {
  users: MentionUser[];
  isLoading: boolean;
  onSelect: (user: MentionUser) => void;
  colors: {
    surfaceElevated: string;
    accent: string;
    textMuted: string;
    text: string;
    border: string;
  };
  style?: ViewStyle;
}

export function ComposerMentionDropdown({
  users,
  isLoading,
  onSelect,
  colors,
  style,
}: ComposerMentionDropdownProps) {
  return (
    <Animated.View
      entering={FadeInDown.duration(150)}
      exiting={FadeOutDown.duration(100)}
      style={[
        styles.dropdown,
        { backgroundColor: colors.surfaceElevated },
        style,
      ]}
    >
      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="small" color={colors.accent} />
        </View>
      ) : users.length === 0 ? (
        <View style={styles.empty}>
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>
            No users found
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.list}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
        >
          {users.map((user, index) => (
            <Pressable
              key={user.id}
              onPress={() => onSelect(user)}
              style={[
                styles.item,
                index < users.length - 1 && {
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderBottomColor: colors.border,
                },
              ]}
            >
              {user.imageUrl ? (
                <Image
                  source={{ uri: user.imageUrl }}
                  style={styles.avatar}
                  contentFit="cover"
                />
              ) : (
                <View
                  style={[
                    styles.avatarPlaceholder,
                    { backgroundColor: colors.accent + "20" },
                  ]}
                >
                  <Text
                    style={[styles.avatarInitial, { color: colors.accent }]}
                  >
                    {(user.name || user.username || "?")[0].toUpperCase()}
                  </Text>
                </View>
              )}
              <View style={styles.info}>
                <Text
                  style={[styles.name, { color: colors.text }]}
                  numberOfLines={1}
                >
                  {user.name || user.username}
                </Text>
                <Text
                  style={[styles.username, { color: colors.textMuted }]}
                  numberOfLines={1}
                >
                  @{user.username}
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    borderRadius: 16,
    marginBottom: 10,
    maxHeight: 200,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  loading: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
  },
  empty: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
  },
  list: {
    maxHeight: 200,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitial: {
    fontSize: 16,
    fontWeight: "700",
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
  },
  username: {
    fontSize: 13,
    marginTop: 2,
  },
});
