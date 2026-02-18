import { memo, useCallback, useEffect, useRef } from "react";
import { Pressable, StyleSheet, useColorScheme, View } from "react-native";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import * as Haptics from "expo-haptics";
import { CheckCircle2, Circle, X } from "lucide-react-native";
import { graphql, useMutation } from "react-relay";

import { ReadingPlanCircleProgress } from "@/components/reading-plans/ReadingPlanCircleProgress";
import { Text } from "@/components/ui/text";
import { useColors } from "@/hooks/use-colors";
import { useReadingPlanStore } from "@/lib/stores/reading-plan-store";
import { BIBLE_BOOK_DETAILS } from "@/lib/bible/constants";
import type { BibleBook } from "@/lib/bible/types";
import type { ReadingPlanBannerReadingCompleteMutation } from "@/lib/relay/__generated__/ReadingPlanBannerReadingCompleteMutation.graphql";
import type { ReadingPlanBannerReadingUncompleteMutation } from "@/lib/relay/__generated__/ReadingPlanBannerReadingUncompleteMutation.graphql";

const completeMutation = graphql`
  mutation ReadingPlanBannerReadingCompleteMutation(
    $planId: ID!
    $readingId: ID!
    $dayId: ID!
  ) {
    readingPlanReadingComplete(
      planId: $planId
      readingId: $readingId
      dayId: $dayId
    )
  }
`;

const uncompleteMutation = graphql`
  mutation ReadingPlanBannerReadingUncompleteMutation(
    $planId: ID!
    $readingId: ID!
    $dayId: ID!
  ) {
    readingPlanReadingUncomplete(
      planId: $planId
      readingId: $readingId
      dayId: $dayId
    )
  }
`;

// ─── Pill badge (inline next to book picker) ───────────────────────

interface ReadingPlanPillProps {
  onPress: () => void;
}

export const ReadingPlanPill = memo(function ReadingPlanPill({
  onPress,
}: ReadingPlanPillProps) {
  const colors = useColors();
  const activeDayNumber = useReadingPlanStore((s) => s.activeDayNumber);
  const readings = useReadingPlanStore((s) => s.readings);
  const completedReadingIds = useReadingPlanStore((s) => s.completedReadingIds);
  const currentReadingIndex = useReadingPlanStore((s) => s.currentReadingIndex);
  const scrollProgress = useReadingPlanStore((s) => s.scrollProgress);

  const completedCount = readings.filter((r) =>
    completedReadingIds.has(r.id),
  ).length;
  const allDone = completedCount === readings.length && readings.length > 0;

  // Overall progress: completed readings + fractional scroll of current reading
  const currentReading = readings[currentReadingIndex];
  const isCurrentDone = currentReading
    ? completedReadingIds.has(currentReading.id)
    : false;
  const overallProgress =
    readings.length > 0
      ? (completedCount + (isCurrentDone ? 0 : scrollProgress)) /
        readings.length
      : 0;

  return (
    <Pressable onPress={onPress} style={styles.pillBadge}>
      <ReadingPlanCircleProgress
        progress={allDone ? 1 : overallProgress}
        size={20}
        strokeWidth={2}
      >
        {allDone ? <CheckCircle2 size={10} color={colors.text} /> : null}
      </ReadingPlanCircleProgress>
      <Text style={[styles.pillBadgeText, { color: colors.text }]}>
        {completedCount}/{readings.length}
      </Text>
      <Text style={[styles.pillDayText, { color: colors.textMuted }]}>
        D{activeDayNumber}
      </Text>
    </Pressable>
  );
});

// ─── Bottom sheet (full progress) ──────────────────────────────────

interface ReadingPlanSheetProps {
  visible: boolean;
  onClose: () => void;
}

export const ReadingPlanSheet = memo(function ReadingPlanSheet({
  visible,
  onClose,
}: ReadingPlanSheetProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const hasGlass = isLiquidGlassAvailable();
  const colors = useColors();
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const activePlanId = useReadingPlanStore((s) => s.activePlanId);
  const activeDayId = useReadingPlanStore((s) => s.activeDayId);
  const activeDayNumber = useReadingPlanStore((s) => s.activeDayNumber);
  const planTitle = useReadingPlanStore((s) => s.planTitle);
  const planDayCount = useReadingPlanStore((s) => s.planDayCount);
  const readings = useReadingPlanStore((s) => s.readings);
  const currentReadingIndex = useReadingPlanStore((s) => s.currentReadingIndex);
  const completedReadingIds = useReadingPlanStore((s) => s.completedReadingIds);
  const clearPlanSession = useReadingPlanStore((s) => s.clearPlanSession);
  const markReadingComplete = useReadingPlanStore((s) => s.markReadingComplete);
  const markReadingUncomplete = useReadingPlanStore(
    (s) => s.markReadingUncomplete,
  );

  const [commitComplete, isCompleting] =
    useMutation<ReadingPlanBannerReadingCompleteMutation>(completeMutation);
  const [commitUncomplete, isUncompleting] =
    useMutation<ReadingPlanBannerReadingUncompleteMutation>(uncompleteMutation);

  const isLoading = isCompleting || isUncompleting;

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

  const setDayJustCompleted = useReadingPlanStore((s) => s.setDayJustCompleted);

  const handleToggleReading = useCallback(
    (readingId: string) => {
      if (!activePlanId || !activeDayId || isLoading) return;

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const wasCompleted = completedReadingIds.has(readingId);

      if (wasCompleted) {
        markReadingUncomplete(readingId);
        commitUncomplete({
          variables: {
            planId: activePlanId,
            readingId,
            dayId: activeDayId,
          },
          onError: () => markReadingComplete(readingId),
        });
      } else {
        markReadingComplete(readingId);
        commitComplete({
          variables: {
            planId: activePlanId,
            readingId,
            dayId: activeDayId,
          },
          onCompleted: () => {
            // Check if ALL readings are now complete after this toggle
            const allComplete = readings.every(
              (r) => r.id === readingId || completedReadingIds.has(r.id),
            );
            if (allComplete) {
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success,
              );
              // Close sheet and trigger day completion celebration
              setTimeout(() => {
                onClose();
                setDayJustCompleted(true);
              }, 400);
            }
          },
          onError: () => markReadingUncomplete(readingId),
        });
      }
    },
    [
      activePlanId,
      activeDayId,
      isLoading,
      completedReadingIds,
      readings,
      markReadingComplete,
      markReadingUncomplete,
      commitComplete,
      commitUncomplete,
      onClose,
      setDayJustCompleted,
    ],
  );

  const handleClose = useCallback(() => {
    clearPlanSession();
    onClose();
  }, [clearPlanSession, onClose]);

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

  const completedCount = readings.filter((r) =>
    completedReadingIds.has(r.id),
  ).length;

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      enableDynamicSizing
      onDismiss={handleDismiss}
      enablePanDownToClose
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
      <BottomSheetView style={styles.sheetContainer}>
        {/* Header */}
        <View style={styles.sheetHeader}>
          <View style={styles.sheetHeaderLeft}>
            <Text style={[styles.sheetTitle, { color: colors.text }]}>
              {planTitle}
            </Text>
            <Text style={[styles.sheetSubtitle, { color: colors.textMuted }]}>
              Day {activeDayNumber} of {planDayCount} · {completedCount}/
              {readings.length} readings
            </Text>
          </View>
          <Pressable onPress={onClose} hitSlop={8}>
            <X size={18} color={colors.textMuted} strokeWidth={2} />
          </Pressable>
        </View>

        {/* Readings list */}
        <View style={styles.sheetReadings}>
          {readings.map((reading, index) => {
            const isDone = completedReadingIds.has(reading.id);
            const isCurrent = index === currentReadingIndex;
            const bookName =
              BIBLE_BOOK_DETAILS[reading.book as BibleBook]?.name ??
              reading.book;
            let label = `${bookName} ${reading.startChapter}`;
            if (reading.startVerse) {
              label += `:${reading.startVerse}`;
            }
            if (
              reading.endChapter &&
              reading.endChapter !== reading.startChapter
            ) {
              label += `–${reading.endChapter}`;
              if (reading.endVerse) {
                label += `:${reading.endVerse}`;
              }
            } else if (
              reading.endVerse &&
              reading.endVerse !== reading.startVerse
            ) {
              label += `–${reading.endVerse}`;
            }

            return (
              <Pressable
                key={reading.id}
                onPress={() => handleToggleReading(reading.id)}
                disabled={isLoading}
                style={[
                  styles.sheetReadingRow,
                  { borderBottomColor: colors.border },
                ]}
              >
                {isDone ? (
                  <CheckCircle2 size={18} color={colors.text} />
                ) : (
                  <Circle
                    size={18}
                    color={isCurrent ? colors.text : colors.textMuted}
                  />
                )}
                <Text
                  style={[
                    styles.sheetReadingLabel,
                    {
                      color: isDone ? colors.textMuted : colors.text,
                      fontWeight: isCurrent ? "600" : "400",
                    },
                    isDone && styles.strikethrough,
                  ]}
                >
                  {label}
                </Text>
                {isCurrent && !isDone && (
                  <Text
                    style={[styles.currentBadge, { color: colors.textMuted }]}
                  >
                    current
                  </Text>
                )}
              </Pressable>
            );
          })}
        </View>

        {/* Exit plan */}
        <Pressable onPress={handleClose} style={styles.exitButton}>
          <Text style={[styles.exitText, { color: colors.destructive }]}>
            Exit reading plan
          </Text>
        </Pressable>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  // Pill badge
  pillBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingLeft: 4,
  },
  pillBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
  pillDayText: {
    fontSize: 10,
    fontWeight: "500",
  },

  // Bottom sheet
  sheetContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  sheetHeaderLeft: {
    flex: 1,
    marginRight: 12,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.1,
    marginBottom: 4,
  },
  sheetSubtitle: {
    fontSize: 13,
  },
  sheetReadings: {
    gap: 0,
  },
  sheetReadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  sheetReadingLabel: {
    fontSize: 15,
    flex: 1,
  },
  currentBadge: {
    fontSize: 11,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  strikethrough: {
    textDecorationLine: "line-through",
  },
  exitButton: {
    alignItems: "center",
    paddingVertical: 16,
    marginTop: 8,
  },
  exitText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
