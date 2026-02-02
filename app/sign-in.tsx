import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { GoogleSignInButton } from '@/components/auth/google-sign-in-button';
import { AppleSignInButton } from '@/components/auth/apple-sign-in-button';

export default function SignInScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 justify-center px-6">
        {/* Logo / Branding */}
        <View className="items-center mb-12">
          <Text className="text-4xl font-bold text-foreground">Selah</Text>
          <Text className="text-muted-foreground mt-2 text-center">
            Bible reading with community
          </Text>
        </View>

        {/* Sign-in buttons */}
        <View className="gap-4">
          <GoogleSignInButton />
          <AppleSignInButton />
        </View>

        {/* Footer */}
        <View className="mt-8">
          <Text className="text-center text-sm text-muted-foreground">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
