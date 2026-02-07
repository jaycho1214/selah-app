import { View, Text, Pressable } from "react-native";
import {
  useSettingsStore,
  FontSize,
  FONT_SIZES,
} from "@/lib/stores/settings-store";

const FONT_SIZE_OPTIONS: { id: FontSize; label: string }[] = [
  { id: "small", label: "A" },
  { id: "medium", label: "A" },
  { id: "large", label: "A" },
];

interface FontSizePickerProps {
  onClose?: () => void;
}

export function FontSizePicker({ onClose }: FontSizePickerProps) {
  const fontSize = useSettingsStore((s) => s.fontSize);
  const setFontSize = useSettingsStore((s) => s.setFontSize);

  const handleSelect = (size: FontSize) => {
    setFontSize(size);
    onClose?.();
  };

  return (
    <View className="p-4">
      <Text className="text-foreground text-base font-semibold mb-3">
        Font Size
      </Text>
      <View className="flex-row gap-3">
        {FONT_SIZE_OPTIONS.map((option) => {
          const sizes = FONT_SIZES[option.id];
          const isSelected = fontSize === option.id;
          return (
            <Pressable
              key={option.id}
              onPress={() => handleSelect(option.id)}
              className={`flex-1 py-3 rounded-lg items-center justify-center ${
                isSelected ? "bg-primary" : "bg-muted"
              }`}
            >
              <Text
                className={
                  isSelected ? "text-primary-foreground" : "text-foreground"
                }
                style={{ fontSize: sizes.text }}
              >
                {option.label}
              </Text>
              <Text
                className={`text-xs mt-1 ${
                  isSelected
                    ? "text-primary-foreground/70"
                    : "text-muted-foreground"
                }`}
              >
                {option.id}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Preview */}
      <View className="mt-4 p-3 bg-muted rounded-lg">
        <Text className="text-muted-foreground text-xs mb-1">Preview</Text>
        <Text
          className="text-foreground"
          style={{
            fontSize: FONT_SIZES[fontSize].text,
            lineHeight: FONT_SIZES[fontSize].lineHeight,
          }}
        >
          For God so loved the world, that he gave his only begotten Son...
        </Text>
      </View>
    </View>
  );
}
