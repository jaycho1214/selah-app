import {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useRef,
} from "react";
import { StyleSheet, useColorScheme } from "react-native";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import { PartyPopper } from "lucide-react-native";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";

import { Button } from "@/components/ui/button";
import { Confetti } from "@/components/ui/confetti";
import { Text } from "@/components/ui/text";
import { useColors } from "@/hooks/use-colors";

export interface DayCompletionSheetRef {
  present: () => void;
  dismiss: () => void;
}

interface DayCompletionSheetProps {
  dayNumber: number | null;
  planTitle: string | null;
  onDismiss?: () => void;
}

export const DayCompletionSheet = memo(
  forwardRef<DayCompletionSheetRef, DayCompletionSheetProps>(
    function DayCompletionSheet({ dayNumber, planTitle, onDismiss }, ref) {
      const colorScheme = useColorScheme();
      const isDark = colorScheme === "dark";
      const hasGlass = isLiquidGlassAvailable();
      const colors = useColors();
      const bottomSheetRef = useRef<BottomSheetModal>(null);

      useImperativeHandle(ref, () => ({
        present: () => bottomSheetRef.current?.present(),
        dismiss: () => bottomSheetRef.current?.dismiss(),
      }));

      const handleDismiss = useCallback(() => {
        onDismiss?.();
      }, [onDismiss]);

      const renderBackdrop = useCallback(
        (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            opacity={0.5}
          />
        ),
        [],
      );

      const sheetColors = isDark
        ? { bg: "#0c0a09", handle: "#44403c" }
        : { bg: "#fdfcfb", handle: "#d6d3d1" };

      const renderBackground = useCallback(
        ({ style }: any) => (
          <GlassView
            style={[
              style,
              {
                backgroundColor: hasGlass ? "transparent" : sheetColors.bg,
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                overflow: "hidden",
              },
            ]}
            glassEffectStyle="regular"
          />
        ),
        [sheetColors.bg, hasGlass],
      );

      return (
        <BottomSheetModal
          ref={bottomSheetRef}
          enableDynamicSizing
          enablePanDownToClose
          onDismiss={handleDismiss}
          backdropComponent={renderBackdrop}
          backgroundComponent={renderBackground}
          backgroundStyle={{
            backgroundColor: sheetColors.bg,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
          }}
          handleIndicatorStyle={{
            backgroundColor: hasGlass
              ? isDark
                ? "rgba(255,255,255,0.5)"
                : "rgba(0,0,0,0.3)"
              : sheetColors.handle,
            width: 40,
            height: 5,
            marginTop: 10,
          }}
        >
          <BottomSheetView style={styles.container}>
            <Confetti />
            <Animated.View
              entering={FadeIn.duration(400)}
              style={styles.iconRow}
            >
              <PartyPopper size={36} color={colors.text} />
            </Animated.View>
            <Animated.Text
              entering={FadeInUp.duration(400).delay(100)}
              style={[styles.title, { color: colors.text }]}
            >
              {`Day ${dayNumber ?? ""} Complete!`}
            </Animated.Text>
            {planTitle && (
              <Animated.Text
                entering={FadeInUp.duration(400).delay(200)}
                style={[styles.subtitle, { color: colors.textSecondary }]}
              >
                {planTitle}
              </Animated.Text>
            )}
            <Animated.View
              entering={FadeInUp.duration(400).delay(300)}
              style={styles.buttonRow}
            >
              <Button
                variant="default"
                onPress={() => bottomSheetRef.current?.dismiss()}
                style={styles.button}
              >
                <Text
                  style={[
                    styles.buttonText,
                    { color: colors.primaryForeground },
                  ]}
                >
                  Continue
                </Text>
              </Button>
            </Animated.View>
          </BottomSheetView>
        </BottomSheetModal>
      );
    },
  ),
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: "center",
    gap: 12,
  },
  iconRow: {
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },
  buttonRow: {
    marginTop: 8,
    width: "100%",
  },
  button: {
    width: "100%",
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
