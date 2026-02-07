import { useCallback, useMemo, useRef } from "react";
import { View, Text, Pressable } from "react-native";
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
  const parsed = parseVerseId(verseId);
  const bookDetails = parsed ? BIBLE_BOOK_DETAILS[parsed.book] : null;
  const reference = parsed
    ? `${bookDetails?.name ?? parsed.book} ${parsed.chapter}:${parsed.verse}`
    : verseId;
  const dateStr = new Date(updatedAt).toLocaleDateString();

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-start px-4 py-3 border-b border-border active:bg-muted/50"
    >
      <FileText size={18} className="text-muted-foreground mt-1 mr-3" />
      <View className="flex-1">
        <Text className="text-primary text-sm font-medium">{reference}</Text>
        <Text className="text-foreground text-base mt-1" numberOfLines={3}>
          {content}
        </Text>
        <Text className="text-muted-foreground text-xs mt-1">{dateStr}</Text>
      </View>
      <Pressable
        onPress={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="p-2 -mr-2"
        hitSlop={8}
      >
        <Trash2 size={18} className="text-muted-foreground" />
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
    <View className="flex-1 bg-background">
      <Stack.Screen
        options={{
          title: "Notes",
          headerLargeTitle: true,
          headerTransparent: IS_LIQUID_GLASS,
          headerStyle: { backgroundColor: IS_LIQUID_GLASS ? "transparent" : colors.bg },
          headerShadowVisible: false,
        }}
      />

      {notesList.length === 0 ? (
        <View
          className="flex-1 items-center justify-center p-8"
          style={{ paddingTop: contentPaddingTop }}
        >
          <FileText size={48} className="text-muted-foreground mb-4" />
          <Text className="text-muted-foreground text-center text-lg">
            No notes yet
          </Text>
          <Text className="text-muted-foreground text-center text-sm mt-2">
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
