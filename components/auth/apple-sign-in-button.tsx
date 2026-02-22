import { memo, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  useColorScheme,
  StyleSheet,
} from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import Svg, { Path } from "react-native-svg";
import { Text } from "@/components/ui/text";
import { useAnalytics } from "@/lib/analytics";
import { authClient } from "@/lib/auth-client";

interface AppleSignInButtonProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const AppleSignInButton = memo(function AppleSignInButton({
  onSuccess,
  onError,
}: AppleSignInButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { capture } = useAnalytics();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Only render on iOS
  if (Platform.OS !== "ios") {
    return null;
  }

  const handlePress = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (credential.identityToken) {
        // Verify identityToken with Better Auth backend
        const result = await authClient.signIn.social({
          provider: "apple",
          idToken: { token: credential.identityToken },
        });

        if (result.error) {
          throw new Error(result.error.message ?? "Sign-in failed");
        }

        capture("sign_in", { provider: "apple" });
        onSuccess?.();
      }
      // If no token, user cancelled - just reset loading state
    } catch (error) {
      // User cancelled - not an error
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "ERR_REQUEST_CANCELED"
      ) {
        setIsLoading(false);
        return;
      }

      console.error("[Auth] Apple sign in error:", error);
      const err = error instanceof Error ? error : new Error("Unknown error");
      onError?.(err);
      Alert.alert("Sign-In Failed", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const colors = isDark
    ? {
        bg: "transparent",
        border: "#3d3530",
        text: "#fafaf9",
        icon: "#fafaf9",
      }
    : {
        bg: "transparent",
        border: "#e7e5e4",
        text: "#1c1917",
        icon: "#1c1917",
      };

  return (
    <Pressable
      onPress={handlePress}
      disabled={isLoading}
      style={[
        styles.button,
        {
          backgroundColor: colors.bg,
          borderColor: colors.border,
          opacity: isLoading ? 0.6 : 1,
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={isLoading ? "Signing in with Apple" : "Continue with Apple"}
      accessibilityState={{ disabled: isLoading, busy: isLoading }}
    >
      <AppleIcon color={colors.icon} />
      <Text style={[styles.text, { color: colors.text }]}>
        {isLoading ? "Signing in..." : "Continue with Apple"}
      </Text>
    </Pressable>
  );
});

function AppleIcon({ color }: { color: string }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill={color}>
      <Path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </Svg>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
  },
  text: {
    fontSize: 15,
    fontWeight: "500",
  },
});
