import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/providers/theme-provider';

export default function ProfileScreen() {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-2xl font-bold mb-2">Profile</Text>
        <Text className="text-muted-foreground mb-4">Your profile details</Text>
        <Button variant="outline" onPress={toggleTheme}>
          <Text>Switch to {resolvedTheme === 'light' ? 'Dark' : 'Light'} Mode</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
