import {
  View,
  Pressable,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  type ViewStyle,
} from "react-native";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import { BookOpen } from "lucide-react-native";

import { memo, useCallback } from "react";
import { Text } from "@/components/ui/text";

export interface VerseReferenceResult {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  label: string;
}

interface ComposerVerseReferenceDropdownProps {
  verses: VerseReferenceResult[];
  isLoading: boolean;
  onSelect: (verse: VerseReferenceResult) => void;
  colors: {
    surfaceElevated: string;
    accent: string;
    textMuted: string;
    text: string;
    border: string;
  };
  style?: ViewStyle;
}

export const ComposerVerseReferenceDropdown = memo(
  function ComposerVerseReferenceDropdown({
    verses,
    isLoading,
    onSelect,
    colors,
    style,
  }: ComposerVerseReferenceDropdownProps) {
    const keyExtractor = useCallback(
      (item: VerseReferenceResult) => item.id,
      [],
    );

    const renderItem = useCallback(
      ({ item, index }: { item: VerseReferenceResult; index: number }) => (
        <Pressable
          onPress={() => onSelect(item)}
          style={[
            styles.item,
            index < verses.length - 1 && {
              borderBottomWidth: StyleSheet.hairlineWidth,
              borderBottomColor: colors.border,
            },
          ]}
        >
          <View
            style={[styles.iconContainer, { backgroundColor: "#0d948820" }]}
          >
            <BookOpen size={16} color="#0d9488" />
          </View>
          <View style={styles.info}>
            <Text
              style={[styles.reference, { color: colors.text }]}
              numberOfLines={1}
            >
              {item.label}
            </Text>
            <Text
              style={[styles.verseText, { color: colors.textMuted }]}
              numberOfLines={1}
            >
              {item.text}
            </Text>
          </View>
        </Pressable>
      ),
      [onSelect, verses.length, colors],
    );

    return (
      <Animated.View
        entering={FadeInDown.duration(150)}
        exiting={FadeOutDown.duration(100)}
        style={[
          styles.dropdown,
          { backgroundColor: colors.surfaceElevated },
          style,
        ]}
      >
        {isLoading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="small" color={colors.accent} />
          </View>
        ) : verses.length === 0 ? (
          <View style={styles.empty}>
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>
              No verses found
            </Text>
          </View>
        ) : (
          <FlatList
            data={verses}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            style={styles.list}
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}
          />
        )}
      </Animated.View>
    );
  },
);

const styles = StyleSheet.create({
  dropdown: {
    borderRadius: 16,
    marginBottom: 10,
    maxHeight: 200,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  loading: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
  },
  empty: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
  },
  list: {
    maxHeight: 200,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  info: {
    flex: 1,
  },
  reference: {
    fontSize: 15,
    fontWeight: "600",
  },
  verseText: {
    fontSize: 13,
    marginTop: 2,
  },
});
