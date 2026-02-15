import { View, Text, Pressable, StyleSheet } from "react-native";
import {
  useSettingsStore,
  FontSize,
  FONT_SIZES,
} from "@/lib/stores/settings-store";
import { useColors } from "@/hooks/use-colors";

const FONT_SIZE_OPTIONS: { id: FontSize; label: string }[] = [
  { id: "small", label: "A" },
  { id: "medium", label: "A" },
  { id: "large", label: "A" },
];

interface FontSizePickerProps {
  onClose?: () => void;
}

export function FontSizePicker({ onClose }: FontSizePickerProps) {
  const colors = useColors();
  const fontSize = useSettingsStore((s) => s.fontSize);
  const setFontSize = useSettingsStore((s) => s.setFontSize);

  const handleSelect = (size: FontSize) => {
    setFontSize(size);
    onClose?.();
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.heading, { color: colors.text }]}>Font Size</Text>
      <View style={styles.optionsRow}>
        {FONT_SIZE_OPTIONS.map((option) => {
          const sizes = FONT_SIZES[option.id];
          const isSelected = fontSize === option.id;
          return (
            <Pressable
              key={option.id}
              onPress={() => handleSelect(option.id)}
              style={[
                styles.optionButton,
                {
                  backgroundColor: isSelected ? colors.primary : colors.muted,
                },
              ]}
            >
              <Text
                style={{
                  color: isSelected ? colors.primaryForeground : colors.text,
                  fontSize: sizes.text,
                }}
              >
                {option.label}
              </Text>
              <Text
                style={[
                  styles.optionLabel,
                  {
                    color: isSelected
                      ? colors.primaryForeground
                      : colors.mutedForeground,
                    opacity: isSelected ? 0.7 : 1,
                  },
                ]}
              >
                {option.id}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Preview */}
      <View style={[styles.preview, { backgroundColor: colors.muted }]}>
        <Text style={[styles.previewLabel, { color: colors.mutedForeground }]}>
          Preview
        </Text>
        <Text
          style={{
            color: colors.text,
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

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  heading: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  optionsRow: {
    flexDirection: "row",
    gap: 12,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  optionLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  preview: {
    marginTop: 16,
    padding: 12,
    borderRadius: 10,
  },
  previewLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
});
