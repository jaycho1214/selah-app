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

export function UserAvatar({
  imageUrl,
  name,
  size = 40,
  onPress,
}: UserAvatarProps) {
  const colors = useColors();

  const avatarStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  const initialsStyle = {
    fontSize: size * 0.4,
  };

  const content = imageUrl ? (
    <Image
      source={{ uri: imageUrl }}
      style={avatarStyle}
      contentFit="cover"
      transition={150}
    />
  ) : (
    <View
      style={[
        styles.placeholder,
        avatarStyle,
        { backgroundColor: colors.accent + "18" },
      ]}
    >
      <Text style={[styles.initials, initialsStyle, { color: colors.accent }]}>
        {getInitials(name)}
      </Text>
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
      >
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    fontWeight: "600",
  },
});
