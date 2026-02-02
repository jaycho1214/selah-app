import { Pressable, Text, View } from 'react-native';
import { useSettingsStore, FONT_SIZES } from '@/lib/stores/settings-store';

interface VerseItemProps {
  verse: {
    id: string;
    verse: number;
    text: string;
  };
  highlightColor?: string | null;
  isBookmarked?: boolean;
  onPress: () => void;
  onLongPress: () => void;
}

export function VerseItem({
  verse,
  highlightColor,
  isBookmarked,
  onPress,
  onLongPress,
}: VerseItemProps) {
  const { fontSize } = useSettingsStore();
  const sizes = FONT_SIZES[fontSize];

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={400}
      className="flex-row gap-3 py-2 px-4 active:bg-muted/50"
      style={highlightColor ? { backgroundColor: highlightColor + '26' } : undefined}
    >
      {/* Verse number */}
      <Text
        className="text-muted-foreground font-semibold"
        style={{
          fontSize: sizes.verse,
          minWidth: 28,
          textAlign: 'right',
        }}
      >
        {verse.verse}
      </Text>

      {/* Verse text */}
      <View className="flex-1 flex-row flex-wrap">
        <Text
          className="text-foreground"
          style={{
            fontSize: sizes.text,
            lineHeight: sizes.lineHeight,
          }}
        >
          {verse.text}
        </Text>
        {isBookmarked && (
          <Text className="text-primary ml-1" style={{ fontSize: sizes.verse }}>
            *
          </Text>
        )}
      </View>
    </Pressable>
  );
}
