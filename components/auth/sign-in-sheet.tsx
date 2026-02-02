import React, { forwardRef, useCallback, useEffect } from 'react';
import { View, Image, useColorScheme, StyleSheet } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Text } from '@/components/ui/text';
import { GoogleSignInButton } from '@/components/auth/google-sign-in-button';
import { AppleSignInButton } from '@/components/auth/apple-sign-in-button';

export interface SignInSheetRef {
  present: () => void;
  dismiss: () => void;
}

interface SignInSheetProps {
  onSignInSuccess?: () => void;
}

export const SignInSheet = forwardRef<BottomSheetModal, SignInSheetProps>(
  function SignInSheet({ onSignInSuccess }, ref) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    // Subtle breathing animation for the logo glow
    const glowOpacity = useSharedValue(0.3);

    useEffect(() => {
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(0.6, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.3, { duration: 2000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    }, []);

    const glowStyle = useAnimatedStyle(() => ({
      opacity: glowOpacity.value,
    }));

    const handleSuccess = useCallback(() => {
      if (ref && 'current' in ref && ref.current) {
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
          opacity={0.7}
        />
      ),
      []
    );

    // Warm, contemplative palette
    const colors = isDark
      ? {
          bg: '#0c0a09',
          surface: '#1c1917',
          border: '#292524',
          text: '#fafaf9',
          textMuted: '#a8a29e',
          textSubtle: '#78716c',
          accent: '#d6bcab',
          glow: '#d6bcab',
        }
      : {
          bg: '#fdfcfb',
          surface: '#f5f4f3',
          border: '#e7e5e4',
          text: '#1c1917',
          textMuted: '#57534e',
          textSubtle: '#a8a29e',
          accent: '#8b7355',
          glow: '#d6bcab',
        };

    return (
      <BottomSheetModal
        ref={ref}
        enableDynamicSizing
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{
          backgroundColor: colors.bg,
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
        }}
        handleIndicatorStyle={{
          backgroundColor: colors.border,
          width: 48,
          height: 5,
          marginTop: 14,
          borderRadius: 3,
        }}
      >
        <BottomSheetView style={styles.container}>
          {/* Decorative top gradient line */}
          <View
            style={[
              styles.topAccent,
              {
                backgroundColor: colors.accent,
                shadowColor: colors.glow,
              },
            ]}
          />

          {/* Logo with glow effect */}
          <Animated.View
            entering={FadeInDown.duration(600).delay(100)}
            style={styles.logoContainer}
          >
            {/* Glow behind logo */}
            <Animated.View
              style={[
                styles.logoGlow,
                glowStyle,
                { backgroundColor: colors.glow },
              ]}
            />
            <Image
              source={require('@/assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>

          {/* Brand name with elegant typography */}
          <Animated.View entering={FadeInDown.duration(600).delay(200)}>
            <Text
              style={[
                styles.brandName,
                { color: colors.text },
              ]}
            >
              Selah
            </Text>
          </Animated.View>

          {/* Tagline with refined spacing */}
          <Animated.View
            entering={FadeInDown.duration(600).delay(300)}
            style={styles.taglineContainer}
          >
            <Text style={[styles.tagline, { color: colors.textMuted }]}>
              Pause · Reflect · Connect
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSubtle }]}>
              Scripture reading with community
            </Text>
          </Animated.View>

          {/* Elegant divider with subtle ornament */}
          <Animated.View
            entering={FadeIn.duration(800).delay(400)}
            style={styles.dividerContainer}
          >
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            <View style={[styles.dividerOrnament, { backgroundColor: colors.accent }]} />
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          </Animated.View>

          {/* Sign-in buttons with staggered animation */}
          <Animated.View
            entering={FadeInUp.duration(500).delay(500)}
            style={styles.buttonsContainer}
          >
            <GoogleSignInButton onSuccess={handleSuccess} />
          </Animated.View>

          <Animated.View
            entering={FadeInUp.duration(500).delay(600)}
            style={styles.buttonWrapper}
          >
            <AppleSignInButton onSuccess={handleSuccess} />
          </Animated.View>

          {/* Footer with refined typography */}
          <Animated.View
            entering={FadeIn.duration(600).delay(700)}
            style={styles.footer}
          >
            <Text style={[styles.footerText, { color: colors.textSubtle }]}>
              By continuing, you agree to our{' '}
              <Text style={[styles.footerLink, { color: colors.textMuted }]}>
                Terms
              </Text>{' '}
              &{' '}
              <Text style={[styles.footerLink, { color: colors.textMuted }]}>
                Privacy
              </Text>
            </Text>
          </Animated.View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 32,
    paddingBottom: 40,
    paddingTop: 8,
  },
  topAccent: {
    position: 'absolute',
    top: 0,
    left: 32,
    right: 32,
    height: 1,
    opacity: 0.4,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  logoGlow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    top: -10,
  },
  logo: {
    width: 88,
    height: 88,
    borderRadius: 22,
  },
  brandName: {
    fontSize: 36,
    fontWeight: '200',
    letterSpacing: 8,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  taglineContainer: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  tagline: {
    fontSize: 15,
    fontWeight: '400',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '400',
    marginTop: 8,
    letterSpacing: 0.5,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
    paddingHorizontal: 20,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  dividerOrnament: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 16,
    opacity: 0.6,
  },
  buttonsContainer: {
    marginBottom: 12,
  },
  buttonWrapper: {
    marginBottom: 0,
  },
  footer: {
    marginTop: 28,
    marginBottom: 8,
  },
  footerText: {
    fontSize: 11,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  footerLink: {
    textDecorationLine: 'underline',
  },
});
