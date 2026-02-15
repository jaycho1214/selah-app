import {
  Pressable,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { Text } from "@/components/ui/text";
import { useColors } from "@/hooks/use-colors";

interface EmptyStateAction {
  label: string;
  onPress: () => void;
}

interface EmptyStateProps {
  variant?: "default" | "inline";
  title: string;
  message?: string;
  action?: EmptyStateAction;
  animationDelay?: number;
  style?: StyleProp<ViewStyle>;
}

export function EmptyState({
  variant = "default",
  title,
  message,
  action,
  animationDelay = 200,
  style,
}: EmptyStateProps) {
  const colors = useColors();

  if (variant === "inline") {
    return (
      <Animated.View
        entering={FadeIn.duration(400).delay(animationDelay)}
        style={[styles.inlineContainer, style]}
      >
        <Text style={[styles.inlineTitle, { color: colors.textMuted }]}>
          {title}
        </Text>
        {message && (
          <Text style={[styles.inlineMessage, { color: colors.textMuted }]}>
            {message}
          </Text>
        )}
      </Animated.View>
    );
  }

  return (
    <Animated.View
      entering={FadeIn.duration(400).delay(animationDelay)}
      style={[styles.container, style]}
    >
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {message && (
        <Text style={[styles.message, { color: colors.textSecondary }]}>
          {message}
        </Text>
      )}
      {action && (
        <Pressable
          onPress={action.onPress}
          style={[styles.button, { backgroundColor: colors.text }]}
        >
          <Text style={[styles.buttonText, { color: colors.bg }]}>
            {action.label}
          </Text>
        </Pressable>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  message: {
    fontSize: 17,
    lineHeight: 24,
    marginTop: 10,
  },
  button: {
    alignSelf: "flex-start",
    marginTop: 24,
    paddingHorizontal: 32,
    paddingVertical: 13,
    borderRadius: 100,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "600",
  },

  // Inline variant
  inlineContainer: {
    alignItems: "center",
    padding: 32,
  },
  inlineTitle: {
    fontSize: 15,
    textAlign: "center",
  },
  inlineMessage: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
  },
});
