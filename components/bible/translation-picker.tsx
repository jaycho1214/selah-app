import { memo } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Check } from "lucide-react-native";
import { useBibleStore } from "@/lib/stores/bible-store";
import { TRANSLATIONS } from "@/lib/bible/constants";
import { useColors } from "@/hooks/use-colors";
import { CommonStyles } from "@/constants/styles";

interface TranslationPickerProps {
  onClose?: () => void;
}

export const TranslationPicker = memo(function TranslationPicker({
  onClose,
}: TranslationPickerProps) {
  const colors = useColors();
  const currentTranslation = useBibleStore((s) => s.currentTranslation);
  const setTranslation = useBibleStore((s) => s.setTranslation);

  const handleSelect = (translationId: string) => {
    setTranslation(translationId);
    onClose?.();
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.heading, { color: colors.text }]}>Translation</Text>

      {TRANSLATIONS.map((translation) => {
        const isSelected = currentTranslation === translation.id;

        return (
          <Pressable
            key={translation.id}
            onPress={() => handleSelect(translation.id)}
            style={[
              CommonStyles.rowBetween,
              styles.row,
              { borderBottomColor: colors.border },
            ]}
          >
            <View style={styles.selectButton}>
              <View
                style={[
                  styles.radio,
                  isSelected
                    ? { backgroundColor: colors.primary }
                    : { borderWidth: 1, borderColor: colors.mutedForeground },
                ]}
              >
                {isSelected && (
                  <Check size={12} color={colors.primaryForeground} />
                )}
              </View>
              <Text style={[styles.translationName, { color: colors.text }]}>
                {translation.name}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  heading: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  row: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  selectButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 9999,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  translationName: {
    fontSize: 16,
  },
});
