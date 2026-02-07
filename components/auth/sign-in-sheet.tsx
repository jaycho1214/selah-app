import React, { forwardRef, useCallback } from "react";
import { Image, useColorScheme, StyleSheet, Platform } from "react-native";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";
import { Text } from "@/components/ui/text";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { AppleSignInButton } from "@/components/auth/apple-sign-in-button";

export interface SignInSheetRef {
  present: () => void;
  dismiss: () => void;
}

interface SignInSheetProps {
  onSignInSuccess?: () => void;
}

// Serif font for Scripture
const serifFont = Platform.select({
  ios: "Georgia",
  default: "serif",
});

export const SignInSheet = forwardRef<BottomSheetModal, SignInSheetProps>(
  function SignInSheet({ onSignInSuccess }, ref) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    const handleSuccess = useCallback(() => {
      if (ref && "current" in ref && ref.current) {
        ref.current.dismiss();
      }
      onSignInSuccess?.();
    }, [ref, onSignInSuccess]);

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.6}
        />
      ),
      [],
    );

    // Warm parchment palette
    const colors = isDark
      ? {
          bg: "#0c0a09",
          text: "#fafaf9",
          textSecondary: "#d6d3d1",
          textMuted: "#78716c",
          accent: "#d6bcab",
          divider: "#292524",
        }
      : {
          bg: "#fdfcfb",
          text: "#1c1917",
          textSecondary: "#57534e",
          textMuted: "#a8a29e",
          accent: "#8b7355",
          divider: "#e7e5e4",
        };

    return (
      <BottomSheetModal
        ref={ref}
        enableDynamicSizing
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{
          backgroundColor: colors.bg,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
        }}
        handleIndicatorStyle={{
          backgroundColor: colors.divider,
          width: 36,
          height: 4,
          marginTop: 12,
        }}
      >
        <BottomSheetView style={styles.container}>
          {/* Logo */}
          <Animated.View
            entering={FadeInDown.duration(500).delay(100)}
            style={styles.logoContainer}
          >
            <Image
              source={require("@/assets/images/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>

          {/* Welcome text */}
          <Animated.View
            entering={FadeInDown.duration(500).delay(200)}
            style={styles.headerContainer}
          >
            <Text style={[styles.title, { color: colors.text }]}>Selah</Text>
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>
              Sign in to save highlights, bookmarks, and notes
            </Text>
          </Animated.View>

          {/* Scripture quote */}
          <Animated.View
            entering={FadeIn.duration(600).delay(300)}
            style={styles.scriptureContainer}
          >
            <Text
              style={[
                styles.scripture,
                { color: colors.textSecondary, fontFamily: serifFont },
              ]}
            >
              {'"Be still, and know that I am God."'}
            </Text>
            <Text style={[styles.scriptureRef, { color: colors.textMuted }]}>
              — Psalm 46:10
            </Text>
          </Animated.View>

          {/* Divider */}
          <Animated.View
            entering={FadeIn.duration(400).delay(350)}
            style={[styles.divider, { backgroundColor: colors.divider }]}
          />

          {/* Auth buttons */}
          <Animated.View
            entering={FadeInUp.duration(400).delay(400)}
            style={styles.buttonContainer}
          >
            <GoogleSignInButton onSuccess={handleSuccess} />
          </Animated.View>

          <Animated.View
            entering={FadeInUp.duration(400).delay(500)}
            style={styles.buttonWrapper}
          >
            <AppleSignInButton onSuccess={handleSuccess} />
          </Animated.View>

          {/* Footer */}
          <Animated.View
            entering={FadeIn.duration(400).delay(600)}
            style={styles.footer}
          >
            <Text style={[styles.footerText, { color: colors.textMuted }]}>
              By continuing, you agree to our{" "}
              <Text
                style={[styles.footerLink, { color: colors.textSecondary }]}
              >
                Terms
              </Text>{" "}
              and{" "}
              <Text
                style={[styles.footerLink, { color: colors.textSecondary }]}
              >
                Privacy Policy
              </Text>
            </Text>
          </Animated.View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 8,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 16,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
  },
  scriptureContainer: {
    alignItems: "center",
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  scripture: {
    fontSize: 16,
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: 24,
  },
  scriptureRef: {
    fontSize: 12,
    marginTop: 8,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginBottom: 24,
  },
  buttonContainer: {
    marginBottom: 12,
  },
  buttonWrapper: {
    marginBottom: 0,
  },
  footer: {
    marginTop: 24,
  },
  footerText: {
    fontSize: 11,
    textAlign: "center",
    lineHeight: 16,
  },
  footerLink: {
    textDecorationLine: "underline",
  },
});
