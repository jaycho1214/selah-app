import { Text } from "@/components/ui/text";
import { BIBLE_BOOK_DETAILS } from "@/lib/bible/constants";
import type { verseActionsCompareQuery } from "@/lib/relay/__generated__/verseActionsCompareQuery.graphql";
import { useVerseSelectionStore } from "@/lib/stores/verse-selection-store";
import { getVerseShareUrl } from "@/lib/utils";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import * as Clipboard from "expo-clipboard";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import * as Haptics from "expo-haptics";
import { ArrowLeftRight, Copy, Share2, X } from "lucide-react-native";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  Share,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  SlideInDown,
  SlideOutDown,
} from "react-native-reanimated";
import { fetchQuery, graphql, useRelayEnvironment } from "react-relay";

const AnimatedGlassView = Animated.createAnimatedComponent(GlassView);
const hasGlass = isLiquidGlassAvailable();

const serifFont = Platform.select({
  ios: "Georgia",
  default: "serif",
});

const TRANSLATIONS = [
  { id: "KJV", name: "King James Version" },
  { id: "ASV", name: "American Standard Version" },
] as const;

const compareQuery = graphql`
  query verseActionsCompareQuery(
    $translation: BibleTranslation!
    $book: BibleBook!
    $chapter: Int!
  ) {
    bibleVersesByReference(
      translation: $translation
      book: $book
      chapter: $chapter
    ) {
      id
      verse
      text
    }
  }
`;

export function VerseActions() {
  const compareSheetRef = useRef<BottomSheetModal>(null);
  const colorScheme = useColorScheme();
  const environment = useRelayEnvironment();

  const isSelecting = useVerseSelectionStore((s) => s.isSelecting);
  const getSortedVerses = useVerseSelectionStore((s) => s.getSortedVerses);
  const clearSelection = useVerseSelectionStore((s) => s.clearSelection);
  const selectedIds = useVerseSelectionStore((s) => s.selectedIds);

  const [compareData, setCompareData] = useState<Record<
    string,
    string[]
  > | null>(null);
  const [compareLoading, setCompareLoading] = useState(false);

  const verseReference = useMemo(() => {
    if (!isSelecting || selectedIds.size === 0) return "";
    const sorted = getSortedVerses();
    if (sorted.length === 0) return "";

    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    const bookDetails = BIBLE_BOOK_DETAILS[first.book];
    const bookName = bookDetails?.name ?? first.book;

    if (sorted.length === 1) {
      return `${bookName} ${first.chapter}:${first.verseNumber}`;
    }
    return `${bookName} ${first.chapter}:${first.verseNumber}–${last.verseNumber}`;
  }, [isSelecting, getSortedVerses, selectedIds]);

  const handleShare = useCallback(async () => {
    const sorted = getSortedVerses();
    if (sorted.length === 0) return;

    const combinedText = sorted.map((v) => v.text).join(" ");
    const shareUrl = getVerseShareUrl(sorted.map((v) => v.id));
    const shareText = `"${combinedText}"\n\n— ${verseReference}\n${shareUrl}`;

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await Share.share({ message: shareText, url: shareUrl });
    } catch {
      // User cancelled
    }
  }, [getSortedVerses, verseReference]);

  const handleCopy = useCallback(async () => {
    const sorted = getSortedVerses();
    if (sorted.length === 0) return;

    const combinedText = sorted.map((v) => v.text).join(" ");
    const copyText = `"${combinedText}"\n\n— ${verseReference}`;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await Clipboard.setStringAsync(copyText);
    clearSelection();
  }, [getSortedVerses, verseReference, clearSelection]);

  const handleCompare = useCallback(async () => {
    const sorted = getSortedVerses();
    if (sorted.length === 0) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCompareData(null);
    setCompareLoading(true);
    compareSheetRef.current?.present();

    const first = sorted[0];
    const verseNumbers = new Set(sorted.map((v) => v.verseNumber));

    try {
      const results: Record<string, string[]> = {};

      const fetches = TRANSLATIONS.map(async (tr) => {
        const data = await fetchQuery<verseActionsCompareQuery>(
          environment,
          compareQuery,
          {
            translation: tr.id as any,
            book: first.book,
            chapter: first.chapter,
          },
        ).toPromise();

        const verses = (data?.bibleVersesByReference ?? [])
          .filter((v) => verseNumbers.has(v.verse))
          .sort((a, b) => a.verse - b.verse);

        results[tr.id] = verses.map((v) => v.text);
      });

      await Promise.all(fetches);
      setCompareData(results);
    } catch {
      // Network error
    } finally {
      setCompareLoading(false);
    }
  }, [getSortedVerses, environment]);

  const isDark = colorScheme === "dark";

  const t = useMemo(
    () =>
      isDark
        ? {
            bg: "#0c0a09",
            surface: "#1c1917",
            surfaceElevated: "#292524",
            border: "#292524",
            borderSubtle: "#3d3530",
            text: "#fafaf9",
            textMuted: "#a8a29e",
            textSubtle: "#78716c",
            accent: "#d6bcab",
            handle: "#44403c",
            barBg: "#171412",
            barBorder: "#2a2420",
          }
        : {
            bg: "#fdfcfb",
            surface: "#f5f4f3",
            surfaceElevated: "#ffffff",
            border: "#e7e5e4",
            borderSubtle: "#d6d3d1",
            text: "#1c1917",
            textMuted: "#57534e",
            textSubtle: "#a8a29e",
            accent: "#8b7355",
            handle: "#d6d3d1",
            barBg: "#faf9f8",
            barBorder: "#e7e5e4",
          },
    [isDark],
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

  const sheetBackgroundStyle = useMemo(
    () => ({
      backgroundColor: t.bg,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
    }),
    [t.bg],
  );

  const sheetHandleStyle = useMemo(
    () => ({
      backgroundColor: hasGlass
        ? isDark
          ? "rgba(255,255,255,0.5)"
          : "rgba(0,0,0,0.3)"
        : t.handle,
      width: 40,
      height: 5,
      marginTop: 12,
    }),
    [isDark, t.handle],
  );

  const dynamicStyles = useMemo(
    () => ({
      tray: {
        backgroundColor: hasGlass ? "transparent" : t.barBg,
        borderColor: hasGlass ? "transparent" : t.barBorder,
        shadowColor: isDark ? "#000" : "#78716c",
      },
      actionLabel: { color: t.textMuted },
      divider: { backgroundColor: t.barBorder },
      compareRef: { color: t.accent },
      compareLoadingText: { color: t.textSubtle },
      compareDivider: { backgroundColor: t.border },
      compareAbbr: { color: t.accent },
      compareName: { color: t.textSubtle },
      compareText: { color: t.text, fontFamily: serifFont },
    }),
    [t, isDark],
  );

  return (
    <>
      {/* Floating action tray */}
      {isSelecting && (
        <AnimatedGlassView
          entering={SlideInDown.duration(300)}
          exiting={SlideOutDown.duration(200)}
          glassEffectStyle="regular"
          isInteractive
          style={[styles.tray, dynamicStyles.tray]}
        >
          <Pressable
            onPress={handleCompare}
            disabled={compareLoading}
            style={styles.actionButton}
          >
            <ArrowLeftRight size={18} color={t.textMuted} strokeWidth={1.8} />
            <Text style={[styles.actionLabel, dynamicStyles.actionLabel]}>
              Compare
            </Text>
          </Pressable>

          <View style={[styles.divider, dynamicStyles.divider]} />

          <Pressable onPress={handleShare} style={styles.actionButton}>
            <Share2 size={18} color={t.textMuted} strokeWidth={1.8} />
            <Text style={[styles.actionLabel, dynamicStyles.actionLabel]}>
              Share
            </Text>
          </Pressable>

          <View style={[styles.divider, dynamicStyles.divider]} />

          <Pressable onPress={handleCopy} style={styles.actionButton}>
            <Copy size={18} color={t.textMuted} strokeWidth={1.8} />
            <Text style={[styles.actionLabel, dynamicStyles.actionLabel]}>
              Copy
            </Text>
          </Pressable>

          <View style={[styles.divider, dynamicStyles.divider]} />

          <Pressable onPress={clearSelection} style={styles.closeButton}>
            <X size={18} color={t.textSubtle} strokeWidth={2} />
          </Pressable>
        </AnimatedGlassView>
      )}

      {/* Compare translations bottom sheet */}
      <BottomSheetModal
        ref={compareSheetRef}
        enableDynamicSizing
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={sheetBackgroundStyle}
        handleIndicatorStyle={sheetHandleStyle}
      >
        <BottomSheetScrollView style={styles.compareSheet}>
          {/* Header */}
          <Text style={[styles.compareRef, dynamicStyles.compareRef]}>
            {verseReference}
          </Text>

          {/* Loading state */}
          {compareLoading && (
            <View style={styles.compareLoading}>
              <ActivityIndicator size="small" color={t.accent} />
              <Text
                style={[
                  styles.compareLoadingText,
                  dynamicStyles.compareLoadingText,
                ]}
              >
                Loading translations...
              </Text>
            </View>
          )}

          {/* Translation entries */}
          {compareData &&
            TRANSLATIONS.map((translation, index) => {
              const texts = compareData[translation.id];
              if (!texts || texts.length === 0) return null;

              return (
                <Animated.View
                  key={translation.id}
                  entering={FadeInDown.duration(350).delay(index * 80)}
                >
                  {index > 0 && (
                    <View
                      style={[
                        styles.compareDivider,
                        dynamicStyles.compareDivider,
                      ]}
                    />
                  )}
                  <View style={styles.compareEntry}>
                    <Text
                      style={[styles.compareAbbr, dynamicStyles.compareAbbr]}
                    >
                      {translation.id}
                    </Text>
                    <Text
                      style={[styles.compareName, dynamicStyles.compareName]}
                    >
                      {translation.name}
                    </Text>
                    <Text
                      style={[styles.compareText, dynamicStyles.compareText]}
                    >
                      {texts.join(" ")}
                    </Text>
                  </View>
                </Animated.View>
              );
            })}

          <View style={styles.bottomSpacer} />
        </BottomSheetScrollView>
      </BottomSheetModal>
    </>
  );
}

const styles = StyleSheet.create({
  // Floating tray
  tray: {
    position: "absolute",
    bottom: 100,
    left: 24,
    right: 24,
    flexDirection: "row",
    alignItems: "stretch",
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 16,
    height: 52,
  },

  // Action buttons — equal flex
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: "500",
  },

  // Thin vertical divider
  divider: {
    width: StyleSheet.hairlineWidth,
    marginVertical: 12,
  },

  // Fixed-width close button
  closeButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 48,
  },

  // Compare sheet
  compareSheet: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  compareRef: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 24,
  },
  compareLoading: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    gap: 12,
  },
  compareLoadingText: {
    fontSize: 13,
    letterSpacing: 0.2,
  },
  compareDivider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 24,
  },
  compareEntry: {
    gap: 6,
  },
  compareAbbr: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  compareName: {
    fontSize: 11,
    letterSpacing: 0.2,
    marginBottom: 8,
  },
  compareText: {
    fontSize: 18,
    lineHeight: 30,
  },
  bottomSpacer: {
    height: 40,
  },
});
