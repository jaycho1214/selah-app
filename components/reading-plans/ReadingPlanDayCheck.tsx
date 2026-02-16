import { memo, useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";
import { Check } from "lucide-react-native";
import { graphql, useMutation } from "react-relay";

import { useColors } from "@/hooks/use-colors";
import type { ReadingPlanDayCheckCompleteMutation } from "@/lib/relay/__generated__/ReadingPlanDayCheckCompleteMutation.graphql";
import type { ReadingPlanDayCheckUncompleteMutation } from "@/lib/relay/__generated__/ReadingPlanDayCheckUncompleteMutation.graphql";

const completeMutation = graphql`
  mutation ReadingPlanDayCheckCompleteMutation($planId: ID!, $dayId: ID!) {
    readingPlanDayComplete(planId: $planId, dayId: $dayId)
  }
`;

const uncompleteMutation = graphql`
  mutation ReadingPlanDayCheckUncompleteMutation($planId: ID!, $dayId: ID!) {
    readingPlanDayUncomplete(planId: $planId, dayId: $dayId)
  }
`;

interface ReadingPlanDayCheckProps {
  planId: string;
  dayId: string;
  isCompleted: boolean;
}

export const ReadingPlanDayCheck = memo(function ReadingPlanDayCheck({
  planId,
  dayId,
  isCompleted,
}: ReadingPlanDayCheckProps) {
  const colors = useColors();
  const [completed, setCompleted] = useState(isCompleted);

  // Sync local state when prop changes (e.g. after pull-to-refresh)
  useEffect(() => {
    setCompleted(isCompleted);
  }, [isCompleted]);

  const [commitComplete] =
    useMutation<ReadingPlanDayCheckCompleteMutation>(completeMutation);
  const [commitUncomplete] =
    useMutation<ReadingPlanDayCheckUncompleteMutation>(uncompleteMutation);

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newState = !completed;
    setCompleted(newState);

    if (newState) {
      commitComplete({
        variables: { planId, dayId },
        updater: (store) => {
          const plan = store.get(planId);
          if (!plan) return;
          const participation = plan.getLinkedRecord("myParticipation");
          if (!participation) return;
          const count =
            (participation.getValue("completedDaysCount") as number) ?? 0;
          participation.setValue(count + 1, "completedDaysCount");
        },
        onError: () => setCompleted(false),
      });
    } else {
      commitUncomplete({
        variables: { planId, dayId },
        updater: (store) => {
          const plan = store.get(planId);
          if (!plan) return;
          const participation = plan.getLinkedRecord("myParticipation");
          if (!participation) return;
          const count =
            (participation.getValue("completedDaysCount") as number) ?? 0;
          participation.setValue(Math.max(0, count - 1), "completedDaysCount");
        },
        onError: () => setCompleted(true),
      });
    }
  }, [completed, planId, dayId, commitComplete, commitUncomplete]);

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
      {completed && <Check size={14} color="#fff" strokeWidth={3} />}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
});
