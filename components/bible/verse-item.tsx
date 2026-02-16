import { memo, useMemo } from "react";
import { FONT_SIZES, useSettingsStore } from "@/lib/stores/settings-store";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";

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
  isInPlanRange?: boolean;
  onPress: () => void;
  onLongPress: () => void;
}

export const VerseItem = memo(function VerseItem({
  verse,
  isSelected,
  isFirstVerse,
  highlightColor,
  isInPlanRange,
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

  // Colors
  const textColor = isDark ? "#fafaf9" : "#0f1419";
  const verseNumColor = isDark ? "#78716c" : "#536471";
  const dropCapColor = isDark ? "#e7e0d8" : "#292524";

  // Selection underline color - warm accent, subtle
  const underlineColor = isDark ? "#d6bcab" : "#8b7355";

  // Highlight background — lighter tint for readability
  const highlightBg = highlightColor
    ? `${highlightColor}${isDark ? "30" : "40"}`
    : undefined;

  // Plan range background — ultra-subtle tint (only when no user highlight)
  const planRangeBg =
    isInPlanRange && !highlightColor
      ? isDark
        ? "rgba(255,255,255,0.03)"
        : "rgba(0,0,0,0.02)"
      : undefined;

  // Plan range left border
  const planBorderColor = isInPlanRange
    ? isDark
      ? "rgba(255,255,255,0.15)"
      : "rgba(0,0,0,0.12)"
    : undefined;

  const dynamicStyles = useMemo(
    () => ({
      container: {
        backgroundColor: highlightBg ?? planRangeBg,
        borderLeftWidth: planBorderColor ? 2 : 0,
        borderLeftColor: planBorderColor,
      },
      verseNum: {
        color: verseNumColor,
        fontSize: sizes.verse,
        opacity: isFirstVerse ? 0 : 1,
      },
      verseText: {
        color: textColor,
        fontSize: sizes.text,
        lineHeight: sizes.lineHeight,
        textDecorationLine: (isSelected ? "underline" : "none") as
          | "underline"
          | "none",
        textDecorationColor: underlineColor,
      },
      firstVerseText: {
        color: textColor,
        fontSize: sizes.text,
        lineHeight: sizes.lineHeight,
        paddingTop: sizes.lineHeight,
        textDecorationLine: (isSelected ? "underline" : "none") as
          | "underline"
          | "none",
        textDecorationColor: underlineColor,
      },
      dropCap: {
        fontSize: sizes.text * 2.6,
        lineHeight: sizes.lineHeight,
        color: dropCapColor,
      },
    }),
    [
      highlightBg,
      planRangeBg,
      planBorderColor,
      verseNumColor,
      sizes,
      isFirstVerse,
      textColor,
      isSelected,
      underlineColor,
      dropCapColor,
    ],
  );

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={400}
      style={[styles.container, dynamicStyles.container]}
    >
      {/* Verse number column */}
      <Text style={[styles.verseNum, dynamicStyles.verseNum]}>
        {verse.verse}
      </Text>

      {/* Verse text */}
      <View style={styles.textColumn}>
        {isFirstVerse ? (
          <View>
            <Text style={[styles.serifText, dynamicStyles.firstVerseText]}>
              <Text style={[styles.dropCap, dynamicStyles.dropCap]}>
                {firstChar}
              </Text>
              {restOfText}
            </Text>
          </View>
        ) : (
          <Text style={[styles.serifText, dynamicStyles.verseText]}>
            {verse.text}
          </Text>
        )}
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  verseNum: {
    fontWeight: "600",
    minWidth: 28,
    textAlign: "right",
  },
  textColumn: {
    flex: 1,
  },
  serifText: {
    fontFamily: serifFont,
    textDecorationStyle: "solid",
  },
  dropCap: {
    fontWeight: "500",
    fontFamily: serifFont,
    letterSpacing: 2,
  },
});
