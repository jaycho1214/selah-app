import { memo, useCallback, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import * as Haptics from "expo-haptics";
import { graphql, useMutation } from "react-relay";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Confetti } from "@/components/ui/confetti";
import { useColors } from "@/hooks/use-colors";
import type { ReadingPlanJoinButtonJoinMutation } from "@/lib/relay/__generated__/ReadingPlanJoinButtonJoinMutation.graphql";
import type { ReadingPlanJoinButtonLeaveMutation } from "@/lib/relay/__generated__/ReadingPlanJoinButtonLeaveMutation.graphql";

const joinMutation = graphql`
  mutation ReadingPlanJoinButtonJoinMutation($planId: ID!) {
    readingPlanJoin(planId: $planId) {
      id
      completedDaysCount
      hideProgress
      completedAt
      joinedAt
      progress {
        dayId
        completedAt
      }
      readingProgress {
        readingId
        completedAt
      }
      user {
        id
      }
    }
  }
`;

const leaveMutation = graphql`
  mutation ReadingPlanJoinButtonLeaveMutation($planId: ID!) {
    readingPlanLeave(planId: $planId)
  }
`;

interface ReadingPlanJoinButtonProps {
  planId: string;
  isJoined: boolean;
}

export const ReadingPlanJoinButton = memo(function ReadingPlanJoinButton({
  planId,
  isJoined,
}: ReadingPlanJoinButtonProps) {
  const colors = useColors();
  const [showConfetti, setShowConfetti] = useState(false);
  const [commitJoin, isJoining] =
    useMutation<ReadingPlanJoinButtonJoinMutation>(joinMutation);
  const [commitLeave, isLeaving] =
    useMutation<ReadingPlanJoinButtonLeaveMutation>(leaveMutation);

  const handleLeave = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    commitLeave({
      variables: { planId },
      updater: (store) => {
        const plan = store.get(planId);
        if (!plan) return;
        plan.setValue(null, "myParticipation");
        const count = (plan.getValue("participantCount") as number) ?? 0;
        plan.setValue(Math.max(0, count - 1), "participantCount");
      },
    });
  }, [planId, commitLeave]);

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (isJoined) {
      Alert.alert(
        "Leave Reading Plan?",
        "Your progress will be lost. This cannot be undone.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Leave", style: "destructive", onPress: handleLeave },
        ],
      );
    } else {
      commitJoin({
        variables: { planId },
        updater: (store) => {
          const plan = store.get(planId);
          if (!plan) return;
          const payload = store.getRootField("readingPlanJoin");
          if (payload) {
            plan.setLinkedRecord(payload, "myParticipation");
            const count = (plan.getValue("participantCount") as number) ?? 0;
            plan.setValue(count + 1, "participantCount");
          }
        },
        onCompleted: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          setShowConfetti(true);
        },
      });
    }
  }, [isJoined, planId, handleLeave, commitJoin]);

  const isLoading = isJoining || isLeaving;

  return (
    <View>
      <Button
        variant={isJoined ? "outline" : "default"}
        size="sm"
        onPress={handlePress}
        disabled={isLoading}
        style={styles.button}
      >
        <Text
          style={[
            styles.text,
            { color: isJoined ? colors.text : colors.primaryForeground },
          ]}
        >
          {isLoading ? "..." : isJoined ? "Leave" : "Join"}
        </Text>
      </Button>
      {showConfetti && <Confetti onComplete={() => setShowConfetti(false)} />}
    </View>
  );
});

const styles = StyleSheet.create({
  button: {
    minWidth: 64,
  },
  text: {
    fontSize: 14,
    fontWeight: "600",
  },
});
