import React, {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import type { TextInput as GHTextInput } from "react-native-gesture-handler";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import * as Haptics from "expo-haptics";
import { ChevronRight, Flag } from "lucide-react-native";
import { graphql, useMutation } from "react-relay";

import { Text } from "@/components/ui/text";
import { useColors } from "@/hooks/use-colors";
import { useAnalytics } from "@/lib/analytics";
import type { reportSheetReportPostMutation } from "@/lib/relay/__generated__/reportSheetReportPostMutation.graphql";
import type { reportSheetReportUserMutation } from "@/lib/relay/__generated__/reportSheetReportUserMutation.graphql";

const reportPostMutation = graphql`
  mutation reportSheetReportPostMutation($input: ReportPostInput!) {
    reportPost(input: $input) {
      success
    }
  }
`;

const reportUserMutation = graphql`
  mutation reportSheetReportUserMutation($input: ReportUserInput!) {
    reportUser(input: $input) {
      success
    }
  }
`;

const REPORT_REASONS = [
  "Spam",
  "Harassment or bullying",
  "Hate speech",
  "Violence or threats",
  "Inappropriate content",
  "Misinformation",
  "Other",
];

export interface ReportSheetRef {
  present: (args: { type: "post" | "user"; targetId: string }) => void;
}

export const ReportSheet = memo(
  forwardRef<ReportSheetRef>(function ReportSheet(_, ref) {
    const colors = useColors();
    const { capture } = useAnalytics();
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const [type, setType] = useState<"post" | "user">("post");
    const [targetId, setTargetId] = useState("");
    const [step, setStep] = useState<"reason" | "description">("reason");
    const [selectedReason, setSelectedReason] = useState("");
    const [description, setDescription] = useState("");

    const descriptionInputRef = useRef<GHTextInput>(null);

    const [commitReportPost, isReportingPost] =
      useMutation<reportSheetReportPostMutation>(reportPostMutation);
    const [commitReportUser, isReportingUser] =
      useMutation<reportSheetReportUserMutation>(reportUserMutation);
    const isSubmitting = isReportingPost || isReportingUser;

    useImperativeHandle(ref, () => ({
      present: ({ type: t, targetId: id }) => {
        setType(t);
        setTargetId(id);
        setStep("reason");
        setSelectedReason("");
        setDescription("");
        descriptionInputRef.current?.clear();
        bottomSheetRef.current?.present();
      },
    }));

    const handleSelectReason = useCallback((reason: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setSelectedReason(reason);
      setStep("description");
    }, []);

    const handleSubmit = useCallback(() => {
      if (isSubmitting) return;

      const onCompleted = () => {
        if (type === "post") {
          capture("post_reported", {
            post_id: targetId,
            reason: selectedReason,
          });
        } else {
          capture("user_reported", {
            target_user_id: targetId,
            reason: selectedReason,
          });
        }
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        bottomSheetRef.current?.dismiss();
        Alert.alert(
          "Report Submitted",
          "Thank you for helping keep our community safe. We'll review this report shortly.",
        );
      };

      const onError = (error: Error) => {
        console.error("Report failed:", error);
        Alert.alert("Error", "Failed to submit report. Please try again.");
      };

      if (type === "post") {
        commitReportPost({
          variables: {
            input: {
              postId: targetId,
              reason: selectedReason,
              description: description || undefined,
            },
          },
          onCompleted,
          onError,
        });
      } else {
        commitReportUser({
          variables: {
            input: {
              userId: targetId,
              reason: selectedReason,
              description: description || undefined,
            },
          },
          onCompleted,
          onError,
        });
      }
    }, [
      type,
      targetId,
      selectedReason,
      description,
      isSubmitting,
      commitReportPost,
      commitReportUser,
      capture,
    ]);

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
          {step === "reason" ? (
            <>
              <View style={styles.header}>
                <Flag size={20} color={colors.textMuted} strokeWidth={1.5} />
                <Text style={[styles.title, { color: colors.text }]}>
                  Report {type === "post" ? "Post" : "User"}
                </Text>
              </View>
              <Text style={[styles.subtitle, { color: colors.textMuted }]}>
                Why are you reporting this {type}?
              </Text>
              <View style={styles.reasonList}>
                {REPORT_REASONS.map((reason) => (
                  <Pressable
                    key={reason}
                    style={[
                      styles.reasonItem,
                      { borderBottomColor: colors.border },
                    ]}
                    onPress={() => handleSelectReason(reason)}
                  >
                    <Text style={[styles.reasonText, { color: colors.text }]}>
                      {reason}
                    </Text>
                    <ChevronRight
                      size={16}
                      color={colors.textMuted}
                      strokeWidth={1.5}
                    />
                  </Pressable>
                ))}
              </View>
            </>
          ) : (
            <>
              <View style={styles.header}>
                <Flag size={20} color={colors.textMuted} strokeWidth={1.5} />
                <Text style={[styles.title, { color: colors.text }]}>
                  Additional Details
                </Text>
              </View>
              <Text style={[styles.subtitle, { color: colors.textMuted }]}>
                Reason: {selectedReason}
              </Text>
              <BottomSheetTextInput
                ref={descriptionInputRef}
                style={[
                  styles.textInput,
                  {
                    color: colors.text,
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
                placeholder="Add more details (optional)"
                placeholderTextColor={colors.textMuted}
                multiline
                numberOfLines={4}
                defaultValue=""
                onChangeText={setDescription}
                textAlignVertical="top"
              />
              <Pressable
                style={[
                  styles.submitButton,
                  {
                    backgroundColor: "#dc2626",
                    opacity: isSubmitting ? 0.6 : 1,
                  },
                ]}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                <Text style={styles.submitText}>
                  {isSubmitting ? "Submitting..." : "Submit Report"}
                </Text>
              </Pressable>
            </>
          )}
        </BottomSheetView>
      </BottomSheetModal>
    );
  }),
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  reasonList: {
    gap: 0,
  },
  reasonItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  reasonText: {
    fontSize: 16,
  },
  textInput: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    fontSize: 15,
    minHeight: 100,
    marginBottom: 16,
  },
  submitButton: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
