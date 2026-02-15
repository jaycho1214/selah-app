import { memo, useCallback, useRef, useState } from "react";
import { View, TextInput, Pressable, StyleSheet } from "react-native";
import { Search, X } from "lucide-react-native";
import { useColors } from "@/hooks/use-colors";
import { CommonStyles } from "@/constants/styles";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  onClear: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export const SearchBar = memo(function SearchBar({
  value,
  onChangeText,
  onSubmit,
  onClear,
  placeholder = "Search the Bible...",
  autoFocus = false,
}: SearchBarProps) {
  const colors = useColors();
  const inputRef = useRef<TextInput>(null);
  const [hasText, setHasText] = useState(value.length > 0);

  const handleChangeText = useCallback(
    (text: string) => {
      setHasText(text.length > 0);
      onChangeText(text);
    },
    [onChangeText],
  );

  const handleClear = useCallback(() => {
    inputRef.current?.clear();
    setHasText(false);
    onClear();
  }, [onClear]);

  return (
    <View
      style={[
        CommonStyles.row,
        styles.container,
        { backgroundColor: colors.muted },
      ]}
    >
      <Search
        size={18}
        color={colors.mutedForeground}
        style={styles.searchIcon}
      />
      <TextInput
        ref={inputRef}
        defaultValue={value}
        onChangeText={handleChangeText}
        onSubmitEditing={onSubmit}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        returnKeyType="search"
        autoFocus={autoFocus}
        autoCapitalize="none"
        autoCorrect={false}
        style={[styles.input, { color: colors.text }]}
      />
      {hasText && (
        <Pressable onPress={handleClear} style={styles.clearButton}>
          <X size={18} color={colors.mutedForeground} />
        </Pressable>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 4,
  },
  clearButton: {
    padding: 4,
  },
});
