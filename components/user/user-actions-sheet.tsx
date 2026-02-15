import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import * as Haptics from "expo-haptics";
import { Ban, Flag, ShieldOff } from "lucide-react-native";
import { graphql, useMutation } from "react-relay";

import { Text } from "@/components/ui/text";
import { useColors } from "@/hooks/use-colors";
import { useAnalytics } from "@/lib/analytics";
import type { userActionsSheetBlockMutation } from "@/lib/relay/__generated__/userActionsSheetBlockMutation.graphql";
import type { userActionsSheetUnblockMutation } from "@/lib/relay/__generated__/userActionsSheetUnblockMutation.graphql";

const blockMutation = graphql`
  mutation userActionsSheetBlockMutation($userId: ID!) {
    userBlock(userId: $userId) {
      user {
        id
        isBlocked
        isBlockingMe
        followedAt
      }
    }
  }
`;

const unblockMutation = graphql`
  mutation userActionsSheetUnblockMutation($userId: ID!) {
    userUnblock(userId: $userId) {
      user {
        id
        isBlocked
        isBlockingMe
        followedAt
      }
    }
  }
`;

export interface UserActionsSheetRef {
  present: () => void;
}

interface UserActionsSheetProps {
  userId: string;
  username: string;
  isBlocked: boolean;
  onReport: () => void;
  onBlockStatusChanged?: () => void;
}

export const UserActionsSheet = forwardRef<
  UserActionsSheetRef,
  UserActionsSheetProps
>(function UserActionsSheet(
  { userId, username, isBlocked, onReport, onBlockStatusChanged },
  ref,
) {
  const colors = useColors();
  const { capture } = useAnalytics();
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const [commitBlock] =
    useMutation<userActionsSheetBlockMutation>(blockMutation);
  const [commitUnblock] =
    useMutation<userActionsSheetUnblockMutation>(unblockMutation);

  useImperativeHandle(ref, () => ({
    present: () => bottomSheetRef.current?.present(),
  }));

  const handleBlock = useCallback(() => {
    bottomSheetRef.current?.dismiss();
    Alert.alert(
      `Block @${username}?`,
      "They won't be able to see your posts or interact with you. You won't see their content either.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Block",
          style: "destructive",
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            commitBlock({
              variables: { userId },
              onCompleted: () => {
                capture("user_blocked", { target_user_id: userId });
                onBlockStatusChanged?.();
              },
              onError: (error) => {
                console.error("Block failed:", error);
                Alert.alert("Error", "Failed to block user. Please try again.");
              },
            });
          },
        },
      ],
    );
  }, [userId, username, commitBlock, onBlockStatusChanged]);

  const handleUnblock = useCallback(() => {
    bottomSheetRef.current?.dismiss();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    commitUnblock({
      variables: { userId },
      onCompleted: () => {
        capture("user_unblocked", { target_user_id: userId });
        onBlockStatusChanged?.();
      },
      onError: (error) => {
        console.error("Unblock failed:", error);
        Alert.alert("Error", "Failed to unblock user. Please try again.");
      },
    });
  }, [userId, commitUnblock, onBlockStatusChanged]);

  const handleReport = useCallback(() => {
    bottomSheetRef.current?.dismiss();
    // Small delay to let dismiss animation finish before opening report sheet
    setTimeout(() => onReport(), 300);
  }, [onReport]);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      enableDynamicSizing
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        backgroundColor: colors.bg,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
      }}
      handleIndicatorStyle={{
        backgroundColor: colors.border,
        width: 36,
        height: 4,
        marginTop: 12,
      }}
    >
      <BottomSheetView style={styles.container}>
        <Pressable
          style={[styles.actionItem, { borderBottomColor: colors.border }]}
          onPress={handleReport}
        >
          <Flag size={20} color={colors.textMuted} strokeWidth={1.5} />
          <Text style={[styles.actionText, { color: colors.text }]}>
            Report @{username}
          </Text>
        </Pressable>

        {isBlocked ? (
          <Pressable
            style={[styles.actionItem, { borderBottomColor: colors.border }]}
            onPress={handleUnblock}
          >
            <ShieldOff size={20} color={colors.textMuted} strokeWidth={1.5} />
            <Text style={[styles.actionText, { color: colors.text }]}>
              Unblock @{username}
            </Text>
          </Pressable>
        ) : (
          <Pressable
            style={[styles.actionItem, { borderBottomColor: colors.border }]}
            onPress={handleBlock}
          >
            <Ban size={20} color="#dc2626" strokeWidth={1.5} />
            <Text style={[styles.actionText, { color: "#dc2626" }]}>
              Block @{username}
            </Text>
          </Pressable>
        )}
      </BottomSheetView>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 8,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  actionText: {
    fontSize: 16,
  },
});
