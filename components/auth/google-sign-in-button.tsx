import { useState } from 'react';
import { Alert, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { signInWithGoogle } from '@/lib/google-signin';
import { authClient } from '@/lib/auth-client';

interface GoogleSignInButtonProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function GoogleSignInButton({ onSuccess, onError }: GoogleSignInButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePress = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      // 1. Get idToken from native Google Sign-In
      const idToken = await signInWithGoogle();

      if (!idToken) {
        // User cancelled
        setIsLoading(false);
        return;
      }

      // 2. Verify idToken with Better Auth backend
      const result = await authClient.signIn.social({
        provider: 'google',
        idToken: {
          token: idToken,
        },
      });

      if (result.error) {
        throw new Error(result.error.message ?? 'Sign-in failed');
      }

      onSuccess?.();
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      onError?.(err);
      Alert.alert('Sign-In Failed', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      className="w-full flex-row items-center justify-center gap-3"
      onPress={handlePress}
      disabled={isLoading}
    >
      <GoogleIcon />
      <Text className="font-medium">
        {isLoading ? 'Signing in...' : 'Continue with Google'}
      </Text>
    </Button>
  );
}

// Simple Google "G" icon using View and Text
function GoogleIcon() {
  return (
    <View className="h-5 w-5 items-center justify-center rounded-full bg-white">
      <Text className="text-sm font-bold text-blue-500">G</Text>
    </View>
  );
}
