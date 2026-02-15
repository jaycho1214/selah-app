import { useCallback, useMemo, useRef } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Stack, router } from "expo-router";
import { Trash2, FileText } from "lucide-react-native";
import { NoteEditor, NoteEditorRef } from "@/components/bible/note-editor";
import { useColors } from "@/hooks/use-colors";
import {
  IS_LIQUID_GLASS,
  useTransparentHeaderPadding,
} from "@/hooks/use-transparent-header";
import { useAnnotationsStore } from "@/lib/stores/annotations-store";
import { BIBLE_BOOK_DETAILS } from "@/lib/bible/constants";
import { CommonStyles } from "@/constants/styles";
import type { BibleBook } from "@/lib/bible/types";

// Parse verse ID into parts
function parseVerseId(verseId: string) {
  const parts = verseId.split(":");
  if (parts.length !== 4) return null;
  return {
    translation: parts[0],
    book: parts[1] as BibleBook,
    chapter: parseInt(parts[2], 10),
    verse: parseInt(parts[3], 10),
  };
}

interface Note {
  verseId: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

interface NoteItemProps {
  verseId: string;
  content: string;
  updatedAt: number;
  onPress: () => void;
  onDelete: () => void;
}

function NoteItem({
  verseId,
  content,
  updatedAt,
  onPress,
  onDelete,
}: NoteItemProps) {
  const colors = useColors();
  const parsed = parseVerseId(verseId);
  const bookDetails = parsed ? BIBLE_BOOK_DETAILS[parsed.book] : null;
  const reference = parsed
    ? `${bookDetails?.name ?? parsed.book} ${parsed.chapter}:${parsed.verse}`
    : verseId;
  const dateStr = new Date(updatedAt).toLocaleDateString();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        CommonStyles.rowStart,
        styles.noteItem,
        { borderBottomColor: colors.border },
        pressed && { backgroundColor: colors.muted + "80" },
      ]}
    >
      <FileText
        size={18}
        color={colors.mutedForeground}
        style={styles.noteIcon}
      />
      <View style={CommonStyles.flex1}>
        <Text style={[styles.referenceText, { color: colors.primary }]}>
          {reference}
        </Text>
        <Text
          style={[styles.contentText, { color: colors.text }]}
          numberOfLines={3}
        >
          {content}
        </Text>
        <Text style={[styles.dateText, { color: colors.mutedForeground }]}>
          {dateStr}
        </Text>
      </View>
      <Pressable
        onPress={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        style={styles.deleteButton}
        hitSlop={8}
      >
        <Trash2 size={18} color={colors.mutedForeground} />
      </Pressable>
    </Pressable>
  );
}

export default function NotesScreen() {
  const colors = useColors();
  const contentPaddingTop = useTransparentHeaderPadding();
  const notes = useAnnotationsStore((s) => s.notes);
  const removeNote = useAnnotationsStore((s) => s.removeNote);
  const noteEditorRef = useRef<NoteEditorRef>(null);

  // Convert Record to sorted array (newest first)
  const notesList = useMemo(() => {
    return Object.values(notes).sort((a, b) => b.updatedAt - a.updatedAt);
  }, [notes]);

  const handleNotePress = useCallback(
    (verseId: string) => {
      // Open note editor to edit
      const note = notes[verseId];
      if (note) {
        noteEditorRef.current?.open(verseId, ""); // Verse text not available here
      }
    },
    [notes],
  );

  const handleDeleteNote = useCallback(
    (verseId: string) => {
      removeNote(verseId);
    },
    [removeNote],
  );

  const renderItem = useCallback(
    ({ item }: { item: Note }) => (
      <NoteItem
        verseId={item.verseId}
        content={item.content}
        updatedAt={item.updatedAt}
        onPress={() => handleNotePress(item.verseId)}
        onDelete={() => handleDeleteNote(item.verseId)}
      />
    ),
    [handleNotePress, handleDeleteNote],
  );

  const keyExtractor = useCallback((item: Note) => item.verseId, []);

  return (
    <View style={[CommonStyles.flex1, { backgroundColor: colors.bg }]}>
      <Stack.Screen
        options={{
          title: "Notes",
          headerLargeTitle: true,
          headerTransparent: IS_LIQUID_GLASS,
          headerStyle: {
            backgroundColor: IS_LIQUID_GLASS ? "transparent" : colors.bg,
          },
          headerShadowVisible: false,
        }}
      />

      {notesList.length === 0 ? (
        <View
          style={[
            CommonStyles.centered,
            { padding: 32, paddingTop: contentPaddingTop },
          ]}
        >
          <FileText
            size={48}
            color={colors.mutedForeground}
            style={styles.emptyIcon}
          />
          <Text style={[styles.emptyTitle, { color: colors.mutedForeground }]}>
            No notes yet
          </Text>
          <Text
            style={[styles.emptySubtitle, { color: colors.mutedForeground }]}
          >
            Add a note to a verse while reading
          </Text>
        </View>
      ) : (
        <FlashList
          data={notesList}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={{ paddingTop: contentPaddingTop }}
        />
      )}

      <NoteEditor ref={noteEditorRef} />
    </View>
  );
}

const styles = StyleSheet.create({
  noteItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  noteIcon: {
    marginTop: 4,
    marginRight: 12,
  },
  referenceText: {
    fontSize: 14,
    fontWeight: "500",
  },
  contentText: {
    fontSize: 16,
    marginTop: 4,
  },
  dateText: {
    fontSize: 12,
    marginTop: 4,
  },
  deleteButton: {
    padding: 8,
    marginRight: -8,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    textAlign: "center",
    fontSize: 18,
  },
  emptySubtitle: {
    textAlign: "center",
    fontSize: 14,
    marginTop: 8,
  },
});
