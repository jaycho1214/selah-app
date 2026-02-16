import { memo, useCallback, useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";
import { Check } from "lucide-react-native";
import { graphql, useMutation } from "react-relay";

import { useColors } from "@/hooks/use-colors";
import type { ReadingPlanReadingCheckCompleteMutation } from "@/lib/relay/__generated__/ReadingPlanReadingCheckCompleteMutation.graphql";
import type { ReadingPlanReadingCheckUncompleteMutation } from "@/lib/relay/__generated__/ReadingPlanReadingCheckUncompleteMutation.graphql";

const completeMutation = graphql`
  mutation ReadingPlanReadingCheckCompleteMutation(
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
  mutation ReadingPlanReadingCheckUncompleteMutation(
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

interface ReadingPlanReadingCheckProps {
  planId: string;
  readingId: string;
  dayId: string;
  isCompleted: boolean;
  onToggle?: (readingId: string, newState: boolean) => void;
}

export const ReadingPlanReadingCheck = memo(function ReadingPlanReadingCheck({
  planId,
  readingId,
  dayId,
  isCompleted,
  onToggle,
}: ReadingPlanReadingCheckProps) {
  const colors = useColors();
  const [completed, setCompleted] = useState(isCompleted);
  const [commitComplete] =
    useMutation<ReadingPlanReadingCheckCompleteMutation>(completeMutation);
  const [commitUncomplete] =
    useMutation<ReadingPlanReadingCheckUncompleteMutation>(uncompleteMutation);

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newState = !completed;
    setCompleted(newState);
    onToggle?.(readingId, newState);

    if (newState) {
      commitComplete({
        variables: { planId, readingId, dayId },
        onError: () => {
          setCompleted(false);
          onToggle?.(readingId, false);
        },
      });
    } else {
      commitUncomplete({
        variables: { planId, readingId, dayId },
        onError: () => {
          setCompleted(true);
          onToggle?.(readingId, true);
        },
      });
    }
  }, [
    completed,
    planId,
    readingId,
    dayId,
    commitComplete,
    commitUncomplete,
    onToggle,
  ]);

  return (
    <Pressable
      onPress={handlePress}
      style={[
        styles.checkbox,
        {
          borderColor: completed ? colors.accent : colors.border,
          backgroundColor: completed ? colors.accent : "transparent",
        },
      ]}
      hitSlop={8}
    >
      {completed && <Check size={10} color="#fff" strokeWidth={3} />}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
});
