import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 items-center justify-center bg-background p-4">
        <Text className="text-2xl font-bold mb-2">Home</Text>
        <Text className="text-muted-foreground mb-4">
          Your feed will appear here
        </Text>
        <Button variant="outline" onPress={() => {}}>
          Get Started
        </Button>
      </View>
    </SafeAreaView>
  );
}
