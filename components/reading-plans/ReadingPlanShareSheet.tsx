import {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { StyleSheet, useColorScheme, View } from "react-native";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import * as Haptics from "expo-haptics";
import { graphql, useMutation } from "react-relay";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useColors } from "@/hooks/use-colors";

import type { ReadingPlanShareSheetMutation } from "@/lib/relay/__generated__/ReadingPlanShareSheetMutation.graphql";

const shareMutation = graphql`
  mutation ReadingPlanShareSheetMutation(
    $milestoneId: ID!
    $parentId: String!
    $content: JSON!
  ) {
    readingPlanMilestoneShare(
      milestoneId: $milestoneId
      parentId: $parentId
      content: $content
    ) {
      id
    }
  }
`;

export interface ReadingPlanShareSheetRef {
  present: (args: {
    milestoneId: string;
    parentId: string;
    milestoneText: string;
  }) => void;
}

export const ReadingPlanShareSheet = memo(
  forwardRef<ReadingPlanShareSheetRef>(function ReadingPlanShareSheet(_, ref) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
    const hasGlass = isLiquidGlassAvailable();
    const colors = useColors();
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const [reflection, setReflection] = useState("");
    const [milestoneId, setMilestoneId] = useState("");
    const [parentId, setParentId] = useState("");
    const [milestoneText, setMilestoneText] = useState("");

    const [commitShare, isSharing] =
      useMutation<ReadingPlanShareSheetMutation>(shareMutation);

    useImperativeHandle(ref, () => ({
      present: (args) => {
        setMilestoneId(args.milestoneId);
        setParentId(args.parentId);
        setMilestoneText(args.milestoneText);
        setReflection("");
        bottomSheetRef.current?.present();
      },
    }));

    const handleShare = useCallback(() => {
      if (isSharing) return;

      const fullText = reflection
        ? `${milestoneText}\n\n${reflection}`
        : milestoneText;

      const content = {
        root: {
          children: [
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: "normal",
                  style: "",
                  text: fullText,
                  type: "text",
                  version: 1,
                },
              ],
              direction: "ltr",
              format: "",
              indent: 0,
              type: "paragraph",
              version: 1,
            },
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
          version: 1,
        },
      };

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      commitShare({
        variables: {
          milestoneId,
          parentId,
          content,
        },
        onCompleted: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          bottomSheetRef.current?.dismiss();
        },
      });
    }, [
      isSharing,
      reflection,
      milestoneText,
      milestoneId,
      parentId,
      commitShare,
    ]);

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

    return (
      <BottomSheetModal
        ref={bottomSheetRef}
        enableDynamicSizing
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
        <BottomSheetView style={styles.container}>
          <Text style={[styles.title, { color: colors.text }]}>
            Share your progress
          </Text>

          <Text style={[styles.milestoneText, { color: colors.textSecondary }]}>
            {milestoneText}
          </Text>

          <BottomSheetTextInput
            placeholder="Add a reflection..."
            placeholderTextColor={colors.textMuted}
            value={reflection}
            onChangeText={setReflection}
            multiline
            numberOfLines={3}
            style={[
              styles.input,
              {
                color: colors.text,
                borderColor: colors.border,
                backgroundColor: colors.surfaceElevated,
              },
            ]}
          />

          <View style={styles.buttonRow}>
            <Button
              variant="outline"
              onPress={() => bottomSheetRef.current?.dismiss()}
              style={styles.button}
            >
              Not now
            </Button>
            <Button
              variant="default"
              onPress={handleShare}
              disabled={isSharing}
              style={styles.button}
            >
              Share to Feed
            </Button>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }),
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  milestoneText: {
    fontSize: 14,
    lineHeight: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: "top",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
  button: {
    flex: 1,
  },
});
