import { memo, useMemo } from "react";
import { Image } from "expo-image";
import { Pressable, StyleSheet, View } from "react-native";

import { Text } from "@/components/ui/text";
import { useColors } from "@/hooks/use-colors";

interface UserAvatarProps {
  imageUrl?: string | null;
  name?: string | null;
  size?: number;
  onPress?: () => void;
}

/**
 * Get initials from a name string.
 * - Single word: First letter (e.g., "John" -> "J")
 * - Multiple words: First letter of first two words (e.g., "John Doe" -> "JD")
 */
function getInitials(name: string | null | undefined): string {
  if (!name) return "?";

  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0][0]?.toUpperCase() || "?";
  }

  return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
}

export const UserAvatar = memo(function UserAvatar({
  imageUrl,
  name,
  size = 40,
  onPress,
}: UserAvatarProps) {
  const colors = useColors();

  const dynamicStyles = useMemo(
    () => ({
      avatar: {
        width: size,
        height: size,
        borderRadius: size / 2,
      },
      initials: {
        fontSize: size * 0.4,
      },
      placeholder: { backgroundColor: colors.accent + "18" },
      initialsColor: { color: colors.accent },
    }),
    [size, colors.accent],
  );

  const content = imageUrl ? (
    <Image
      source={{ uri: imageUrl }}
      style={dynamicStyles.avatar}
      contentFit="cover"
      transition={150}
    />
  ) : (
    <View
      style={[
        styles.placeholder,
        dynamicStyles.avatar,
        dynamicStyles.placeholder,
      ]}
    >
      <Text
        style={[
          styles.initials,
          dynamicStyles.initials,
          dynamicStyles.initialsColor,
        ]}
      >
        {getInitials(name)}
      </Text>
    </View>
  );

  if (onPress) {
    return <Pressable onPress={onPress}>{content}</Pressable>;
  }

  return content;
});

const styles = StyleSheet.create({
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    fontWeight: "600",
  },
});
