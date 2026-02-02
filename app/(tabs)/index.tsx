import { useState, useCallback, useRef, useEffect } from 'react';
import { View, Pressable, StyleSheet, useColorScheme, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  FadeIn,
  FadeOut,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { ChevronDown } from 'lucide-react-native';
import { BibleReader } from '@/components/bible/bible-reader';
import { BibleNavigator } from '@/components/bible/bible-navigator';
import { VerseActions, VerseActionsRef } from '@/components/bible/verse-actions';
import { NoteEditor, NoteEditorRef } from '@/components/bible/note-editor';
import { Text } from '@/components/ui/text';
import { useBibleStore } from '@/lib/stores/bible-store';
import { BIBLE_BOOK_DETAILS } from '@/lib/bible/constants';
import type { BibleBook } from '@/lib/bible/types';
import { parseVerseId } from '@/lib/bible/utils';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const { currentBook, currentChapter, currentTranslation, setPosition } = useBibleStore();
  const [navigatorVisible, setNavigatorVisible] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const verseActionsRef = useRef<VerseActionsRef>(null);
  const noteEditorRef = useRef<NoteEditorRef>(null);

  // Key to force BibleReader remount on position change
  const [readerKey, setReaderKey] = useState(0);

  // Auto-hide overlay after delay
  const overlayOpacity = useSharedValue(1);

  useEffect(() => {
    if (overlayVisible) {
      overlayOpacity.value = withTiming(1, { duration: 200 });
      // Auto-hide after 3 seconds
      const timeout = setTimeout(() => {
        overlayOpacity.value = withTiming(0, { duration: 300 });
        setOverlayVisible(false);
      }, 3000);
      return () => clearTimeout(timeout);
    } else {
      overlayOpacity.value = withTiming(0, { duration: 300 });
    }
  }, [overlayVisible]);

  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
    pointerEvents: overlayOpacity.value > 0.5 ? 'auto' : 'none',
  }));

  const handlePositionChange = useCallback(
    (book: BibleBook, chapter: number) => {
      setPosition(book, chapter);
      // Show overlay briefly on position change
      setOverlayVisible(true);
    },
    [setPosition]
  );

  const handleNavigatorSelect = useCallback(
    (book: BibleBook, chapter: number) => {
      setPosition(book, chapter);
      setNavigatorVisible(false);
      setReaderKey((k) => k + 1);
      setOverlayVisible(true);
    },
    [setPosition]
  );

  // Tap verse -> Navigate to post page for that verse
  const handleVersePress = useCallback(
    (verseId: string, verseText?: string) => {
      // Navigate to the post/discussion page for this verse
      router.push({
        pathname: '/verse/[id]',
        params: { id: verseId },
      });
    },
    [router]
  );

  // Long press verse -> Open actions sheet (highlight, bookmark, note, share)
  const handleVerseLongPress = useCallback((verseId: string, verseText?: string) => {
    verseActionsRef.current?.open(verseId, verseText ?? '');
  }, []);

  const handleNotePress = useCallback((verseId: string, verseText: string) => {
    verseActionsRef.current?.close();
    noteEditorRef.current?.open(verseId, verseText);
  }, []);

  // Toggle overlay on screen tap
  const handleScreenTap = useCallback(() => {
    setOverlayVisible((v) => !v);
  }, []);

  const bookDetails = BIBLE_BOOK_DETAILS[currentBook as BibleBook];
  const bookName = bookDetails?.name ?? currentBook;

  // Colors
  const overlayBg = isDark ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.85)';
  const textColor = isDark ? '#fafaf9' : '#1c1917';
  const mutedColor = isDark ? '#a8a29e' : '#78716c';

  return (
    <View style={styles.container} className="bg-background">
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Immersive Bible reader - full screen */}
      <View style={styles.readerContainer}>
        <Pressable style={StyleSheet.absoluteFill} onPress={handleScreenTap}>
          <BibleReader
            key={readerKey}
            initialBook={currentBook as BibleBook}
            initialChapter={currentChapter}
            onPositionChange={handlePositionChange}
            onVersePress={handleVersePress}
            onVerseLongPress={handleVerseLongPress}
          />
        </Pressable>
      </View>

      {/* Floating navigation overlay - appears at top */}
      <Animated.View
        style={[
          styles.overlay,
          overlayAnimatedStyle,
          {
            paddingTop: insets.top + 8,
            backgroundColor: overlayBg,
          },
        ]}
        pointerEvents="box-none"
      >
        <Pressable
          onPress={() => setNavigatorVisible(true)}
          style={styles.navButton}
        >
          <View style={styles.navContent}>
            <Text style={[styles.bookChapter, { color: textColor }]}>
              {bookName} {currentChapter}
            </Text>
            <Text style={[styles.translation, { color: mutedColor }]}>
              {currentTranslation}
            </Text>
          </View>
          <ChevronDown size={18} color={mutedColor} />
        </Pressable>
      </Animated.View>

      {/* Book/chapter picker modal */}
      <BibleNavigator
        currentBook={currentBook as BibleBook}
        currentChapter={currentChapter}
        onSelect={handleNavigatorSelect}
        visible={navigatorVisible}
        onClose={() => setNavigatorVisible(false)}
      />

      {/* Verse actions bottom sheet */}
      <VerseActions ref={verseActionsRef} onNote={handleNotePress} />

      {/* Note editor modal */}
      <NoteEditor ref={noteEditorRef} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  readerContainer: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 4,
  },
  navContent: {
    alignItems: 'center',
  },
  bookChapter: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  translation: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
