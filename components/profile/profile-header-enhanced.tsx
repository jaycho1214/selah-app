import { Image } from "expo-image";
import { Pressable, StyleSheet, View } from "react-native";

import { Text } from "@/components/ui/text";
import { useColors } from "@/hooks/use-colors";

interface ProfileHeaderEnhancedProps {
  name?: string | null;
  username?: string | null;
  bio?: string | null;
  imageUrl?: string | null;
  onAvatarPress?: () => void;
  children?: React.ReactNode;
}

function getInitials(name: string | null | undefined): string {
  if (!name) return "";
  return name
    .split(" ")
    .map((v) => v[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function ProfileHeaderEnhanced({
  name,
  username,
  bio,
  imageUrl,
  onAvatarPress,
  children,
}: ProfileHeaderEnhancedProps) {
  const colors = useColors();

  return (
    <View style={styles.container}>
      {/* Top row: name/username on left, avatar on right */}
      <View style={styles.topRow}>
        <View style={styles.nameSection}>
          {name && (
            <Text style={[styles.name, { color: colors.text }]}>{name}</Text>
          )}
          {username && (
            <Text style={[styles.username, { color: colors.textMuted }]}>
              @{username}
            </Text>
          )}
        </View>

        <Pressable
          onPress={onAvatarPress}
          disabled={!onAvatarPress}
          style={styles.avatarContainer}
        >
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={styles.avatar}
              contentFit="cover"
            />
          ) : (
            <View
              style={[
                styles.avatarPlaceholder,
                { backgroundColor: colors.border },
              ]}
            >
              <Text
                style={[styles.avatarInitials, { color: colors.textMuted }]}
              >
                {getInitials(name)}
              </Text>
            </View>
          )}
        </Pressable>
      </View>

      {/* Bio */}
      {bio && <Text style={[styles.bio, { color: colors.text }]}>{bio}</Text>}

      {/* Action slot */}
      {children && <View style={styles.actionSlot}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  nameSection: {
    flex: 1,
    marginRight: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
  },
  username: {
    fontSize: 15,
    marginTop: 2,
  },
  avatarContainer: {
    width: 72,
    height: 72,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  avatarPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    fontSize: 24,
    fontWeight: "600",
  },
  bio: {
    fontSize: 15,
    lineHeight: 22,
    marginTop: 12,
  },
  actionSlot: {
    marginTop: 16,
  },
});
