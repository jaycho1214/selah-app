import * as Haptics from "expo-haptics";
import { ChevronRight, LucideIcon } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";

import { Text } from "@/components/ui/text";
import { useColors } from "@/hooks/use-colors";

interface MenuItemProps {
  icon?: LucideIcon;
  label: string;
  count?: number;
  onPress: () => void;
  destructive?: boolean;
}

function MenuItem({
  icon: Icon,
  label,
  count,
  onPress,
  destructive,
}: MenuItemProps) {
  const colors = useColors();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.menuItem,
        {
          backgroundColor: pressed ? colors.border + "40" : "transparent",
        },
      ]}
    >
      <View style={styles.menuItemLeft}>
        {Icon && (
          <Icon
            size={20}
            color={destructive ? "#dc2626" : colors.textMuted}
            strokeWidth={1.5}
          />
        )}
        <Text
          style={[
            styles.menuItemText,
            { color: destructive ? "#dc2626" : colors.text },
          ]}
        >
          {label}
        </Text>
      </View>
      <View style={styles.menuItemRight}>
        {count !== undefined && (
          <Text style={[styles.countText, { color: colors.textMuted }]}>
            {count}
          </Text>
        )}
        <ChevronRight size={18} color={colors.textMuted} />
      </View>
    </Pressable>
  );
}

interface ProfileMenuSectionProps {
  title: string;
  items: Array<{
    icon?: LucideIcon;
    label: string;
    count?: number;
    onPress: () => void;
    destructive?: boolean;
  }>;
  baseIndex?: number;
}

export function ProfileMenuSection({ title, items }: ProfileMenuSectionProps) {
  const colors = useColors();

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
        {title}
      </Text>
      <View style={[styles.menuItems, { borderColor: colors.border }]}>
        {items.map((item, index) => (
          <View key={item.label}>
            {index > 0 && (
              <View
                style={[styles.separator, { backgroundColor: colors.border }]}
              />
            )}
            <MenuItem
              icon={item.icon}
              label={item.label}
              count={item.count}
              onPress={item.onPress}
              destructive={item.destructive}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 8,
    marginLeft: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  menuItems: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
  },
  menuItemRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  countText: {
    fontSize: 14,
  },
  separator: {
    height: 1,
    marginLeft: 48,
  },
});
