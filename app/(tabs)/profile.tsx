import { View, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Search, Bookmark, FileText, ChevronRight } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { useSession } from '@/components/providers/session-provider';
import { useTheme } from '@/components/providers/theme-provider';
import { signOutFromGoogle } from '@/lib/google-signin';
import { useAnnotationsStore } from '@/lib/stores/annotations-store';

export default function ProfileScreen() {
  const { session, isAuthenticated, presentSignIn, signOut } = useSession();
  const { resolvedTheme, toggleTheme } = useTheme();
  const { bookmarks, notes } = useAnnotationsStore();

  const handleSignOut = async () => {
    // Sign out from Google (clears local Google state)
    await signOutFromGoogle();
    // Sign out from Better Auth (clears session)
    await signOut();
  };

  // Bible utilities section - shown for both authenticated and unauthenticated users
  const BibleUtilities = () => (
    <View className="mt-6">
      <Text className="text-muted-foreground text-sm font-medium px-4 mb-2">
        Bible
      </Text>

      <Pressable
        onPress={() => router.push('/search')}
        className="flex-row items-center justify-between px-4 py-3 bg-card border-y border-border active:opacity-70"
      >
        <View className="flex-row items-center gap-3">
          <Search size={20} className="text-muted-foreground" />
          <Text className="text-foreground text-base">Search Bible</Text>
        </View>
        <ChevronRight size={20} className="text-muted-foreground" />
      </Pressable>

      <Pressable
        onPress={() => router.push('/bookmarks')}
        className="flex-row items-center justify-between px-4 py-3 bg-card border-b border-border active:opacity-70"
      >
        <View className="flex-row items-center gap-3">
          <Bookmark size={20} className="text-muted-foreground" />
          <Text className="text-foreground text-base">Bookmarks</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Text className="text-muted-foreground">{Object.keys(bookmarks).length}</Text>
          <ChevronRight size={20} className="text-muted-foreground" />
        </View>
      </Pressable>

      <Pressable
        onPress={() => router.push('/notes')}
        className="flex-row items-center justify-between px-4 py-3 bg-card border-b border-border active:opacity-70"
      >
        <View className="flex-row items-center gap-3">
          <FileText size={20} className="text-muted-foreground" />
          <Text className="text-foreground text-base">Notes</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Text className="text-muted-foreground">{Object.keys(notes).length}</Text>
          <ChevronRight size={20} className="text-muted-foreground" />
        </View>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1">
        <View className="p-6">
          {isAuthenticated ? (
            <>
              {/* User Info */}
              <View className="items-center mb-4">
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
            </>
          ) : (
            <>
              {/* Unauthenticated state */}
              <View className="items-center mb-4">
                <View className="h-20 w-20 rounded-full bg-muted items-center justify-center mb-4">
                  <Text className="text-3xl">👤</Text>
                </View>
                <Text className="text-xl font-semibold text-foreground mb-2">
                  Welcome to Selah
                </Text>
                <Text className="text-muted-foreground text-center mb-4 px-4">
                  Sign in to save your reading progress, post reflections, and connect with the community
                </Text>
                <Button className="w-full max-w-xs" onPress={presentSignIn}>
                  <Text className="text-primary-foreground font-semibold">Sign In</Text>
                </Button>
              </View>
            </>
          )}
        </View>

        {/* Bible Utilities - always visible */}
        <BibleUtilities />

        {/* Settings Section */}
        <View className="mt-6">
          <Text className="text-muted-foreground text-sm font-medium px-4 mb-2">
            Settings
          </Text>

          <Pressable
            onPress={toggleTheme}
            className="flex-row items-center justify-between px-4 py-3 bg-card border-y border-border active:opacity-70"
          >
            <Text className="text-foreground text-base">
              Switch to {resolvedTheme === 'light' ? 'Dark' : 'Light'} Mode
            </Text>
            <ChevronRight size={20} className="text-muted-foreground" />
          </Pressable>

          {isAuthenticated && (
            <Pressable
              onPress={handleSignOut}
              className="flex-row items-center justify-between px-4 py-3 bg-card border-b border-border active:opacity-70"
            >
              <Text className="text-destructive text-base">Sign Out</Text>
            </Pressable>
          )}
        </View>

        {/* Bottom padding */}
        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
