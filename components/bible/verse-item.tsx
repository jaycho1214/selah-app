import { FONT_SIZES, useSettingsStore } from "@/lib/stores/settings-store";
import { Platform, Pressable, Text, View, useColorScheme } from "react-native";

// Serif font for bible reading - New York on iOS, Georgia on Android
const serifFont = Platform.select({
  ios: "ui-serif",
  default: "serif",
});

interface VerseItemProps {
  verse: {
    id: string;
    verse: number;
    text: string;
  };
  isSelected?: boolean;
  isFirstVerse?: boolean;
  highlightColor?: string | null;
  onPress: () => void;
  onLongPress: () => void;
}

export function VerseItem({
  verse,
  isSelected,
  isFirstVerse,
  highlightColor,
  onPress,
  onLongPress,
}: VerseItemProps) {
  const fontSize = useSettingsStore((s) => s.fontSize);
  const sizes = FONT_SIZES[fontSize];
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Drop cap styling for first verse
  const firstChar = isFirstVerse ? verse.text.charAt(0) : "";
  const restOfText = isFirstVerse ? verse.text.slice(1) : verse.text;

  // Drop cap color
  const dropCapColor = isDark ? "#e7e0d8" : "#292524";

  // Drop cap size
  const dropCapSize = sizes.text * 2.6;

  // Selection underline color - warm accent, subtle
  const underlineColor = isDark ? "#d6bcab" : "#8b7355";

  // Highlight background — lighter tint for readability
  const highlightBg = highlightColor
    ? `${highlightColor}${isDark ? "30" : "40"}`
    : undefined;

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={400}
      className="flex-row gap-3 px-4 active:bg-muted/50"
      style={{
        paddingTop: 8,
        paddingBottom: 8,
        backgroundColor: highlightBg,
      }}
    >
      {/* Verse number column */}
      <Text
        className="text-muted-foreground font-semibold"
        style={{
          fontSize: sizes.verse,
          minWidth: 28,
          textAlign: "right",
          opacity: isFirstVerse ? 0 : 1,
        }}
      >
        {verse.verse}
      </Text>

      {/* Verse text */}
      <View className="flex-1">
        {isFirstVerse ? (
          <View>
            <Text
              className="text-foreground"
              style={{
                fontSize: sizes.text,
                lineHeight: sizes.lineHeight,
                fontFamily: serifFont,
                paddingTop: dropCapSize - sizes.lineHeight,
                textDecorationLine: isSelected ? "underline" : "none",
                textDecorationColor: underlineColor,
                textDecorationStyle: "solid",
              }}
            >
              <Text
                style={{
                  fontSize: dropCapSize,
                  lineHeight: sizes.lineHeight,
                  fontWeight: "500",
                  fontFamily: serifFont,
                  color: dropCapColor,
                  letterSpacing: 2,
                }}
              >
                {firstChar}
              </Text>
              {restOfText}
            </Text>
          </View>
        ) : (
          <Text
            className="text-foreground"
            style={{
              fontSize: sizes.text,
              lineHeight: sizes.lineHeight,
              fontFamily: serifFont,
              textDecorationLine: isSelected ? "underline" : "none",
              textDecorationColor: underlineColor,
              textDecorationStyle: "solid",
            }}
          >
            {verse.text}
          </Text>
        )}
      </View>
    </Pressable>
  );
}
