import {
  memo,
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
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAnnotationsStore } from "@/lib/stores/annotations-store";
import { BIBLE_BOOK_DETAILS } from "@/lib/bible/constants";
import type { BibleBook } from "@/lib/bible/types";
import { useColors } from "@/hooks/use-colors";
import { CommonStyles } from "@/constants/styles";

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

export const NoteEditor = memo(
  forwardRef<NoteEditorRef, NoteEditorProps>(function NoteEditor(
    { onSave, onDelete },
    ref,
  ) {
    const colors = useColors();
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
        <SafeAreaView
          style={[CommonStyles.flex1, { backgroundColor: colors.bg }]}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={CommonStyles.flex1}
          >
            {/* Header */}
            <View
              style={[
                CommonStyles.rowBetween,
                styles.header,
                { borderBottomColor: colors.border },
              ]}
            >
              <Pressable onPress={handleClose} style={styles.cancelButton}>
                <Text
                  style={[styles.bodyText, { color: colors.mutedForeground }]}
                >
                  Cancel
                </Text>
              </Pressable>
              <Text style={[styles.title, { color: colors.text }]}>
                {existingNote ? "Edit Note" : "Add Note"}
              </Text>
              <Pressable
                onPress={handleSave}
                disabled={!noteContent.trim()}
                style={styles.saveButton}
              >
                <Text
                  style={[
                    styles.saveText,
                    {
                      color: noteContent.trim()
                        ? colors.primary
                        : colors.mutedForeground,
                    },
                  ]}
                >
                  Save
                </Text>
              </Pressable>
            </View>

            {/* Verse reference */}
            <View
              style={[
                styles.verseRef,
                {
                  backgroundColor: colors.muted,
                  borderBottomColor: colors.border,
                },
              ]}
            >
              <Text style={[styles.refLabel, { color: colors.primary }]}>
                {reference}
              </Text>
              <Text
                style={[styles.refText, { color: colors.mutedForeground }]}
                numberOfLines={2}
              >
                {verseText}
              </Text>
            </View>

            {/* Note input */}
            <View style={[CommonStyles.flex1, styles.inputContainer]}>
              <TextInput
                ref={inputRef}
                defaultValue={noteContent}
                onChangeText={setNoteContent}
                placeholder="Write your note..."
                placeholderTextColor={colors.mutedForeground}
                multiline
                textAlignVertical="top"
                style={[styles.textInput, { color: colors.text }]}
              />
            </View>

            {/* Delete button (only for existing notes) */}
            {existingNote && (
              <View style={styles.deleteContainer}>
                <Pressable
                  onPress={handleDelete}
                  style={[
                    styles.deleteButton,
                    { backgroundColor: `${colors.destructive}1A` },
                  ]}
                >
                  <Text
                    style={[styles.deleteText, { color: colors.destructive }]}
                  >
                    Delete Note
                  </Text>
                </Pressable>
              </View>
            )}
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    );
  }),
);

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  cancelButton: {
    padding: 8,
    marginLeft: -8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  saveButton: {
    padding: 8,
    marginRight: -8,
  },
  saveText: {
    fontSize: 16,
    fontWeight: "500",
  },
  bodyText: {
    fontSize: 16,
  },
  verseRef: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  refLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  refText: {
    fontSize: 14,
    marginTop: 4,
  },
  inputContainer: {
    padding: 16,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    minHeight: 200,
  },
  deleteContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  deleteButton: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  deleteText: {
    fontWeight: "500",
  },
});
