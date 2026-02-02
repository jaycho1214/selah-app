import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { useSession } from '@/components/providers/session-provider';
import { useTheme } from '@/components/providers/theme-provider';
import { signOutFromGoogle } from '@/lib/google-signin';

export default function ProfileScreen() {
  const { session, isAuthenticated, presentSignIn, signOut } = useSession();
  const { resolvedTheme, toggleTheme } = useTheme();

  const handleSignOut = async () => {
    // Sign out from Google (clears local Google state)
    await signOutFromGoogle();
    // Sign out from Better Auth (clears session)
    await signOut();
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 p-6">
        {isAuthenticated ? (
          <>
            {/* User Info */}
            <View className="items-center mb-8">
              <View className="h-20 w-20 rounded-full bg-muted items-center justify-center mb-4">
                <Text className="text-3xl">
                  {session?.user?.name?.[0]?.toUpperCase() ?? '?'}
                </Text>
              </View>
              <Text className="text-xl font-semibold text-foreground">
                {session?.user?.name ?? 'Unknown'}
              </Text>
              <Text className="text-muted-foreground">
                {session?.user?.email ?? ''}
              </Text>
            </View>

            {/* Profile content placeholder */}
            <View className="flex-1">
              <Text className="text-center text-muted-foreground">
                Profile content coming in Phase 4
              </Text>
            </View>

            {/* Theme Toggle */}
            <Button variant="outline" className="w-full mb-4" onPress={toggleTheme}>
              <Text>Switch to {resolvedTheme === 'light' ? 'Dark' : 'Light'} Mode</Text>
            </Button>

            {/* Sign Out Button */}
            <Button variant="outline" className="w-full" onPress={handleSignOut}>
              <Text>Sign Out</Text>
            </Button>
          </>
        ) : (
          <>
            {/* Unauthenticated state */}
            <View className="flex-1 justify-center items-center">
              <View className="h-24 w-24 rounded-full bg-muted items-center justify-center mb-6">
                <Text className="text-4xl">👤</Text>
              </View>
              <Text className="text-xl font-semibold text-foreground mb-2">
                Welcome to Selah
              </Text>
              <Text className="text-muted-foreground text-center mb-8 px-4">
                Sign in to save your reading progress, post reflections, and connect with the community
              </Text>
              <Button className="w-full max-w-xs" onPress={presentSignIn}>
                <Text className="text-primary-foreground font-semibold">Sign In</Text>
              </Button>
            </View>

            {/* Theme Toggle - always available */}
            <Button variant="outline" className="w-full" onPress={toggleTheme}>
              <Text>Switch to {resolvedTheme === 'light' ? 'Dark' : 'Light'} Mode</Text>
            </Button>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
