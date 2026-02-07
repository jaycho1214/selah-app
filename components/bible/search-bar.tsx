import { View, TextInput, Pressable } from "react-native";
import { Search, X } from "lucide-react-native";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  onClear: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function SearchBar({
  value,
  onChangeText,
  onSubmit,
  onClear,
  placeholder = "Search the Bible...",
  autoFocus = false,
}: SearchBarProps) {
  return (
    <View className="flex-row items-center bg-muted rounded-lg px-3 py-2">
      <Search size={18} className="text-muted-foreground mr-2" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        returnKeyType="search"
        autoFocus={autoFocus}
        autoCapitalize="none"
        autoCorrect={false}
        className="flex-1 text-foreground text-base py-1"
      />
      {value.length > 0 && (
        <Pressable onPress={onClear} className="p-1">
          <X size={18} className="text-muted-foreground" />
        </Pressable>
      )}
    </View>
  );
}
