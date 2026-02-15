import { memo, useCallback, useEffect, useRef, useMemo } from "react";
import { View, Pressable, useColorScheme, StyleSheet } from "react-native";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import * as Haptics from "expo-haptics";
import { Check } from "lucide-react-native";
import { Text } from "@/components/ui/text";
import { useBibleStore } from "@/lib/stores/bible-store";

// Available translations (from GraphQL schema)
const TRANSLATIONS = [
  { id: "KJV", name: "King James Version", language: "English" },
  { id: "ASV", name: "American Standard Version", language: "English" },
] as const;

interface TranslationSelectorProps {
  visible: boolean;
  onClose: () => void;
}

export const TranslationSelector = memo(function TranslationSelector({
  visible,
  onClose,
}: TranslationSelectorProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const hasGlass = isLiquidGlassAvailable();
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const currentTranslation = useBibleStore((s) => s.currentTranslation);
  const setTranslation = useBibleStore((s) => s.setTranslation);

  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [visible]);

  const handleDismiss = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleSelectTranslation = useCallback(
    (translationId: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setTranslation(translationId);
      onClose();
    },
    [setTranslation, onClose],
  );

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    [],
  );

  const colors = isDark
    ? {
        bg: "#0c0a09",
        surface: "#1c1917",
        border: "#292524",
        text: "#fafaf9",
        textMuted: "#a8a29e",
        accent: "#d6bcab",
        handle: "#44403c",
        checkBg: "#292524",
      }
    : {
        bg: "#fdfcfb",
        surface: "#f5f4f3",
        border: "#e7e5e4",
        text: "#1c1917",
        textMuted: "#57534e",
        accent: "#8b7355",
        handle: "#d6d3d1",
        checkBg: "#f5f0eb",
      };

  const renderBackground = useCallback(
    ({ style }: any) => (
      <GlassView
        style={[
          style,
          {
            backgroundColor: hasGlass ? "transparent" : colors.bg,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            overflow: "hidden",
          },
        ]}
        glassEffectStyle="regular"
      />
    ),
    [colors.bg, hasGlass],
  );

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      enableDynamicSizing
      onDismiss={handleDismiss}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundComponent={renderBackground}
      backgroundStyle={{
        backgroundColor: colors.bg,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
      }}
      handleIndicatorStyle={{
        backgroundColor: hasGlass
          ? isDark
            ? "rgba(255,255,255,0.5)"
            : "rgba(0,0,0,0.3)"
          : colors.handle,
        width: 40,
        height: 5,
        marginTop: 10,
      }}
    >
      <BottomSheetView style={styles.container}>
        <Text style={[styles.title, { color: colors.text }]}>Translation</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          Select your preferred Bible translation
        </Text>

        <View style={styles.list}>
          {TRANSLATIONS.map((translation) => {
            const isSelected = translation.id === currentTranslation;
            return (
              <Pressable
                key={translation.id}
                onPress={() => handleSelectTranslation(translation.id)}
                style={[
                  styles.item,
                  {
                    backgroundColor: isSelected
                      ? colors.checkBg
                      : "transparent",
                    borderColor: isSelected ? colors.accent : colors.border,
                  },
                ]}
              >
                <View style={styles.itemContent}>
                  <Text
                    style={[
                      styles.translationId,
                      { color: isSelected ? colors.accent : colors.text },
                    ]}
                  >
                    {translation.id}
                  </Text>
                  <Text
                    style={[
                      styles.translationName,
                      { color: colors.textMuted },
                    ]}
                  >
                    {translation.name}
                  </Text>
                </View>
                {isSelected && (
                  <View
                    style={[
                      styles.checkCircle,
                      { backgroundColor: colors.accent },
                    ]}
                  >
                    <Check
                      size={14}
                      color={isDark ? "#0c0a09" : "#ffffff"}
                      strokeWidth={3}
                    />
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: 0.2,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  list: {
    gap: 10,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  itemContent: {
    flex: 1,
  },
  translationId: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  translationName: {
    fontSize: 13,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});
