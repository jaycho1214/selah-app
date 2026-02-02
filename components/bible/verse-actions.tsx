import { useCallback, useMemo, forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { View, Pressable, useColorScheme } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { Text } from '@/components/ui/text';
import { useAnnotationsStore, HIGHLIGHT_COLORS } from '@/lib/stores/annotations-store';

interface VerseActionsProps {
  onHighlight?: () => void;
  onBookmark?: () => void;
  onNote?: () => void;
  onShare?: () => void;
}

export interface VerseActionsRef {
  open: (verseId: string, verseText: string) => void;
  close: () => void;
}

export const VerseActions = forwardRef<VerseActionsRef, VerseActionsProps>(
  function VerseActions({ onHighlight, onBookmark, onNote, onShare }, ref) {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const colorScheme = useColorScheme();

    // Use state for current verse to trigger re-renders
    const [currentVerse, setCurrentVerse] = useState<{ id: string; text: string } | null>(null);

    const { highlights, addHighlight, removeHighlight, bookmarks, addBookmark, removeBookmark } =
      useAnnotationsStore();

    const snapPoints = useMemo(() => ['40%'], []);

    useImperativeHandle(ref, () => ({
      open: (verseId: string, verseText: string) => {
        setCurrentVerse({ id: verseId, text: verseText });
        bottomSheetRef.current?.expand();
      },
      close: () => {
        bottomSheetRef.current?.close();
      },
    }));

    const handleSheetChange = useCallback((index: number) => {
      // Clear current verse when sheet closes
      if (index === -1) {
        setCurrentVerse(null);
      }
    }, []);

    const currentHighlight = currentVerse
      ? highlights[currentVerse.id]
      : null;

    const isBookmarked = currentVerse
      ? !!bookmarks[currentVerse.id]
      : false;

    const handleColorSelect = useCallback(
      (colorValue: string) => {
        if (!currentVerse) return;

        if (currentHighlight?.color === colorValue) {
          // Remove highlight if same color tapped
          removeHighlight(currentVerse.id);
        } else {
          addHighlight(currentVerse.id, colorValue);
        }
        onHighlight?.();
      },
      [currentVerse, currentHighlight, addHighlight, removeHighlight, onHighlight]
    );

    const handleRemoveHighlight = useCallback(() => {
      if (!currentVerse) return;
      removeHighlight(currentVerse.id);
      onHighlight?.();
    }, [currentVerse, removeHighlight, onHighlight]);

    const handleBookmarkToggle = useCallback(() => {
      if (!currentVerse) return;
      if (isBookmarked) {
        removeBookmark(currentVerse.id);
      } else {
        addBookmark(currentVerse.id);
      }
      onBookmark?.();
    }, [currentVerse, isBookmarked, addBookmark, removeBookmark, onBookmark]);

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.4}
        />
      ),
      []
    );

    const isDark = colorScheme === 'dark';
    const backgroundColor = isDark ? '#18181b' : '#fafaf9';
    const handleColor = isDark ? '#52525b' : '#d4d4d8';

    return (
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        onChange={handleSheetChange}
        backgroundStyle={{
          backgroundColor,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
        }}
        handleIndicatorStyle={{
          backgroundColor: handleColor,
          width: 40,
          height: 4,
          marginTop: 12,
        }}
      >
        <BottomSheetView className="flex-1 px-6 pb-6">
          {/* Verse preview */}
          {currentVerse && (
            <Text
              className="text-muted-foreground text-sm mb-4"
              numberOfLines={2}
            >
              {currentVerse.text}
            </Text>
          )}

          {/* Highlight colors */}
          <View className="mb-5">
            <Text className="text-foreground text-base font-semibold mb-3">
              Highlight
            </Text>
            <View className="flex-row gap-3">
              {HIGHLIGHT_COLORS.map((color) => (
                <Pressable
                  key={color.id}
                  onPress={() => handleColorSelect(color.value)}
                  className="w-11 h-11 rounded-full items-center justify-center"
                  style={[
                    { backgroundColor: color.value },
                    currentHighlight?.color === color.value && {
                      borderWidth: 3,
                      borderColor: isDark ? '#ffffff' : '#18181b',
                    },
                  ]}
                >
                  {currentHighlight?.color === color.value && (
                    <Text className="text-white text-base font-bold">✓</Text>
                  )}
                </Pressable>
              ))}
              {/* Remove highlight button */}
              {currentHighlight && (
                <Pressable
                  onPress={handleRemoveHighlight}
                  className="w-11 h-11 rounded-full items-center justify-center border border-border bg-muted"
                >
                  <Text className="text-muted-foreground text-base">✕</Text>
                </Pressable>
              )}
            </View>
          </View>

          {/* Action buttons */}
          <View className="flex-row gap-3">
            <Pressable
              onPress={handleBookmarkToggle}
              className="flex-1 py-3 rounded-xl bg-muted items-center active:opacity-70"
            >
              <Text className="text-foreground font-medium">
                {isBookmarked ? 'Bookmarked' : 'Bookmark'}
              </Text>
            </Pressable>
            <Pressable
              onPress={onNote}
              className="flex-1 py-3 rounded-xl bg-muted items-center active:opacity-70"
            >
              <Text className="text-foreground font-medium">Add Note</Text>
            </Pressable>
          </View>
        </BottomSheetView>
      </BottomSheet>
    );
  }
);
