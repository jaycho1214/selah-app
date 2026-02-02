import { View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Bookmark } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { useBibleStore } from '@/lib/stores/bible-store';
import { useAnnotationsStore } from '@/lib/stores/annotations-store';
import { BIBLE_BOOK_DETAILS } from '@/lib/bible/constants';
import { BibleBook } from '@/lib/bible/types';

export default function HomeScreen() {
  const { currentBook, currentChapter, currentTranslation } = useBibleStore();
  const { bookmarks } = useAnnotationsStore();

  // Get book details for display name
  const bookDetails = BIBLE_BOOK_DETAILS[currentBook as BibleBook];
  const bookName = bookDetails?.name ?? currentBook;

  const handleContinueReading = () => {
    router.push(`/bible/${currentBook}/${currentChapter}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 p-4">
        <Text className="text-2xl font-bold mb-6">Selah</Text>

        {/* Continue Reading Card */}
        <Pressable
          onPress={handleContinueReading}
          className="bg-card rounded-xl p-4 border border-border active:opacity-70"
        >
          <Text className="text-muted-foreground text-sm mb-1">Continue Reading</Text>
          <Text className="text-foreground text-xl font-semibold">
            {bookName} {currentChapter}
          </Text>
          <Text className="text-muted-foreground text-sm">{currentTranslation}</Text>
        </Pressable>

        {/* Bookmarks Card */}
        <Pressable
          onPress={() => router.push('/bookmarks')}
          className="flex-row items-center justify-between bg-card rounded-xl p-4 border border-border mt-4 active:opacity-70"
        >
          <View className="flex-row items-center gap-3">
            <Bookmark size={20} className="text-primary" />
            <Text className="text-foreground text-base">Bookmarks</Text>
          </View>
          <Text className="text-muted-foreground">{Object.keys(bookmarks).length}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
