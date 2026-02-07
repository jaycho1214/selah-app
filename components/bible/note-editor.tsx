import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useCallback,
} from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAnnotationsStore } from "@/lib/stores/annotations-store";
import { BIBLE_BOOK_DETAILS } from "@/lib/bible/constants";
import type { BibleBook } from "@/lib/bible/types";

export interface NoteEditorRef {
  open: (verseId: string, verseText: string) => void;
  close: () => void;
}

interface NoteEditorProps {
  onSave?: () => void;
  onDelete?: () => void;
}

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

export const NoteEditor = forwardRef<NoteEditorRef, NoteEditorProps>(
  function NoteEditor({ onSave, onDelete }, ref) {
    const [visible, setVisible] = useState(false);
    const [verseId, setVerseId] = useState<string | null>(null);
    const [verseText, setVerseText] = useState("");
    const [noteContent, setNoteContent] = useState("");
    const inputRef = useRef<TextInput>(null);

    const notes = useAnnotationsStore((s) => s.notes);
    const setNote = useAnnotationsStore((s) => s.setNote);
    const removeNote = useAnnotationsStore((s) => s.removeNote);

    useImperativeHandle(ref, () => ({
      open: (id: string, text: string) => {
        setVerseId(id);
        setVerseText(text);
        const existingNote = notes[id];
        setNoteContent(existingNote?.content ?? "");
        setVisible(true);
        // Focus input after modal opens
        setTimeout(() => inputRef.current?.focus(), 100);
      },
      close: () => {
        setVisible(false);
        setVerseId(null);
        setVerseText("");
        setNoteContent("");
      },
    }));

    const parsed = verseId ? parseVerseId(verseId) : null;
    const reference = parsed
      ? `${BIBLE_BOOK_DETAILS[parsed.book]?.name ?? parsed.book} ${parsed.chapter}:${parsed.verse}`
      : "";

    const existingNote = verseId ? notes[verseId] : null;

    const handleSave = useCallback(() => {
      if (!verseId || !noteContent.trim()) return;
      setNote(verseId, noteContent.trim());
      setVisible(false);
      onSave?.();
    }, [verseId, noteContent, setNote, onSave]);

    const handleDelete = useCallback(() => {
      if (!verseId) return;
      removeNote(verseId);
      setVisible(false);
      onDelete?.();
    }, [verseId, removeNote, onDelete]);

    const handleClose = useCallback(() => {
      setVisible(false);
    }, []);

    return (
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleClose}
      >
        <SafeAreaView className="flex-1 bg-background">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1"
          >
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-border">
              <Pressable onPress={handleClose} className="p-2 -ml-2">
                <Text className="text-muted-foreground text-base">Cancel</Text>
              </Pressable>
              <Text className="text-foreground text-lg font-semibold">
                {existingNote ? "Edit Note" : "Add Note"}
              </Text>
              <Pressable
                onPress={handleSave}
                disabled={!noteContent.trim()}
                className="p-2 -mr-2"
              >
                <Text
                  className={`text-base font-medium ${
                    noteContent.trim()
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  Save
                </Text>
              </Pressable>
            </View>

            {/* Verse reference */}
            <View className="px-4 py-3 bg-muted/50 border-b border-border">
              <Text className="text-primary text-sm font-medium">
                {reference}
              </Text>
              <Text
                className="text-muted-foreground text-sm mt-1"
                numberOfLines={2}
              >
                {verseText}
              </Text>
            </View>

            {/* Note input */}
            <View className="flex-1 p-4">
              <TextInput
                ref={inputRef}
                value={noteContent}
                onChangeText={setNoteContent}
                placeholder="Write your note..."
                placeholderTextColor="#9CA3AF"
                multiline
                textAlignVertical="top"
                className="flex-1 text-foreground text-base"
                style={{ minHeight: 200 }}
              />
            </View>

            {/* Delete button (only for existing notes) */}
            {existingNote && (
              <View className="px-4 pb-4">
                <Pressable
                  onPress={handleDelete}
                  className="py-3 rounded-lg bg-destructive/10 items-center"
                >
                  <Text className="text-destructive font-medium">
                    Delete Note
                  </Text>
                </Pressable>
              </View>
            )}
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    );
  },
);
