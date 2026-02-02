import React, { forwardRef, useCallback, useMemo } from 'react';
import { View } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
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
    const snapPoints = useMemo(() => ['50%'], []);

    const handleSuccess = useCallback(() => {
      // Dismiss the sheet on successful sign-in
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
          opacity={0.5}
        />
      ),
      []
    );

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: 'rgb(var(--background))' }}
        handleIndicatorStyle={{ backgroundColor: 'rgb(var(--muted-foreground))' }}
      >
        <BottomSheetView className="flex-1 px-6 pb-8">
          {/* Header */}
          <View className="items-center mb-8">
            <Text className="text-2xl font-bold text-foreground">Sign In</Text>
            <Text className="text-muted-foreground mt-2 text-center">
              Sign in to post, comment, and connect with the community
            </Text>
          </View>

          {/* Sign-in buttons */}
          <View className="gap-4">
            <GoogleSignInButton onSuccess={handleSuccess} />
            <AppleSignInButton onSuccess={handleSuccess} />
          </View>

          {/* Footer */}
          <View className="mt-6">
            <Text className="text-center text-xs text-muted-foreground">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </Text>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);
