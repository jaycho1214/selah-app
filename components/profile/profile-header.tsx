import { memo } from "react";
import { StyleSheet, View } from "react-native";

import { UserAvatar } from "@/components/user/user-avatar";
import { Text } from "@/components/ui/text";
import { useColors } from "@/hooks/use-colors";

interface ProfileHeaderProps {
  name?: string | null;
  username?: string | null;
  bio?: string | null;
  imageUrl?: string | null;
  onAvatarPress?: () => void;
  children?: React.ReactNode;
}

export const ProfileHeader = memo(function ProfileHeader({
  name,
  username,
  bio,
  imageUrl,
  onAvatarPress,
  children,
}: ProfileHeaderProps) {
  const colors = useColors();

  return (
    <View style={styles.container}>
      {/* Avatar */}
      <UserAvatar
        imageUrl={imageUrl}
        name={name}
        size={80}
        onPress={onAvatarPress}
      />

      {/* Name */}
      {name && (
        <Text style={[styles.name, { color: colors.text }]}>{name}</Text>
      )}

      {/* Username */}
      {username && (
        <Text style={[styles.username, { color: colors.textMuted }]}>
          @{username}
        </Text>
      )}

      {/* Bio */}
      {bio && (
        <Text style={[styles.bio, { color: colors.textSecondary }]}>{bio}</Text>
      )}

      {/* Action slot (Edit Profile / Follow button) */}
      {children && <View style={styles.actionSlot}>{children}</View>}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 12,
  },
  username: {
    fontSize: 15,
    marginTop: 2,
  },
  bio: {
    fontSize: 15,
    lineHeight: 21,
    textAlign: "center",
    marginTop: 12,
    paddingHorizontal: 16,
  },
  actionSlot: {
    marginTop: 16,
  },
});
