import { useState, useEffect } from 'react';
import { Alert, Platform, View } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import { authClient } from '@/lib/auth-client';

interface AppleSignInButtonProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function AppleSignInButton({ onSuccess, onError }: AppleSignInButtonProps) {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Apple Sign-In is only available on iOS 13+
    if (Platform.OS === 'ios') {
      AppleAuthentication.isAvailableAsync().then(setIsAvailable);
    }
  }, []);

  // Don't render anything on non-iOS or if unavailable
  if (Platform.OS !== 'ios' || !isAvailable) {
    return null;
  }

  const handlePress = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      // 1. Get credentials from native Apple Sign-In
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (!credential.identityToken) {
        throw new Error('No identity token received from Apple');
      }

      // 2. Verify identityToken with Better Auth backend
      const result = await authClient.signIn.social({
        provider: 'apple',
        idToken: {
          token: credential.identityToken,
        },
      });

      if (result.error) {
        throw new Error(result.error.message ?? 'Sign-in failed');
      }

      onSuccess?.();
    } catch (error: unknown) {
      // User cancelled - not an error
      if (error && typeof error === 'object' && 'code' in error && error.code === 'ERR_REQUEST_CANCELED') {
        setIsLoading(false);
        return;
      }

      const err = error instanceof Error ? error : new Error('Unknown error');
      onError?.(err);
      Alert.alert('Sign-In Failed', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="w-full" pointerEvents={isLoading ? 'none' : 'auto'}>
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={8}
        style={{ width: '100%', height: 48 }}
        onPress={handlePress}
      />
    </View>
  );
}
