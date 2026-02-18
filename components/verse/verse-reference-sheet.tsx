import React, {
  forwardRef,
  memo,
  Suspense,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  type BottomSheetBackgroundProps,
} from "@gorhom/bottom-sheet";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import * as Haptics from "expo-haptics";
import { BookOpen, ChevronRight } from "lucide-react-native";
import {
  graphql,
  useLazyLoadQuery,
  RelayEnvironmentProvider,
} from "react-relay";
import type { IEnvironment } from "relay-runtime";
import { useRouter } from "expo-router";
import { decodeGlobalId } from "@/lib/utils";

import { Text } from "@/components/ui/text";
import type { verseReferenceSheetQuery } from "@/lib/relay/__generated__/verseReferenceSheetQuery.graphql";

const verseSheetQuery = graphql`
  query verseReferenceSheetQuery($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on BibleVerse {
        id
        book
        chapter
        verse
        text
        translation
      }
    }
  }
`;

interface VerseData {
  verseId: string;
  label: string;
}

export interface VerseReferenceSheetRef {
  present: (data: VerseData) => void;
}

function SheetContent({
  verseId,
  label,
  colors,
}: {
  verseId: string;
  label: string;
  colors: ReturnType<typeof getColors>;
}) {
  const router = useRouter();
  const data = useLazyLoadQuery<verseReferenceSheetQuery>(
    verseSheetQuery,
    { ids: [verseId] },
    { fetchPolicy: "store-or-network" },
  );

  const verse = data.nodes?.[0];
  const hasVerseData =
    verse != null && "book" in verse && "text" in verse && verse.text;

  const handleGoToVerse = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      const id = decodeGlobalId(verseId);
      router.push(`/verse/${id}`);
    } catch {
      // Ignore invalid IDs
    }
  }, [verseId, router]);

  return (
    <>
      {hasVerseData ? (
        <Text style={[styles.verseText, { color: colors.text }]} selectable>
          {verse.text}
        </Text>
      ) : (
        <Text style={[styles.verseText, { color: colors.textMuted }]}>
          Verse not available
        </Text>
      )}

      <Pressable
        style={[styles.goButton, { borderColor: colors.border }]}
        onPress={handleGoToVerse}
      >
        <Text style={[styles.goButtonText, { color: colors.text }]}>
          Go to verse
        </Text>
        <ChevronRight size={16} color={colors.textMuted} strokeWidth={1.5} />
      </Pressable>
    </>
  );
}

function SheetLoading({ colors }: { colors: ReturnType<typeof getColors> }) {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="small" color={colors.textMuted} />
    </View>
  );
}

function getColors(isDark: boolean) {
  return isDark
    ? {
        bg: "#0c0a09",
        border: "#292524",
        text: "#fafaf9",
        textMuted: "#a8a29e",
        accent: "#d6bcab",
        handle: "#44403c",
      }
    : {
        bg: "#fdfcfb",
        border: "#e7e5e4",
        text: "#1c1917",
        textMuted: "#57534e",
        accent: "#8b7355",
        handle: "#d6d3d1",
      };
}

export const VerseReferenceSheet = memo(
  forwardRef<VerseReferenceSheetRef, { environment: IEnvironment }>(
    function VerseReferenceSheet({ environment }, ref) {
      const colorScheme = useColorScheme();
      const isDark = colorScheme === "dark";
      const hasGlass = isLiquidGlassAvailable();
      const colors = getColors(isDark);
      const bottomSheetRef = useRef<BottomSheetModal>(null);
      const [verseData, setVerseData] = useState<VerseData | null>(null);

      useImperativeHandle(ref, () => ({
        present: (data: VerseData) => {
          setVerseData(data);
          bottomSheetRef.current?.present();
        },
      }));

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

      const renderBackground = useCallback(
        ({ style }: BottomSheetBackgroundProps) => (
          <GlassView
            style={[
              style,
              {
                backgroundColor: hasGlass ? "transparent" : colors.bg,
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                overflow: "hidden" as const,
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
            <RelayEnvironmentProvider environment={environment}>
              {/* Header */}
              <View style={styles.header}>
                <BookOpen
                  size={18}
                  color={colors.textMuted}
                  strokeWidth={1.5}
                />
                <Text style={[styles.title, { color: colors.text }]}>
                  {verseData?.label}
                </Text>
              </View>

              {/* Content */}
              {verseData && (
                <Suspense fallback={<SheetLoading colors={colors} />}>
                  <SheetContent
                    verseId={verseData.verseId}
                    label={verseData.label}
                    colors={colors}
                  />
                </Suspense>
              )}
            </RelayEnvironmentProvider>
          </BottomSheetView>
        </BottomSheetModal>
      );
    },
  ),
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 80,
  },
  verseText: {
    fontSize: 16,
    lineHeight: 26,
    fontStyle: "italic",
    marginBottom: 20,
  },
  goButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    gap: 6,
  },
  goButtonText: {
    fontSize: 15,
    fontWeight: "500",
  },
});
