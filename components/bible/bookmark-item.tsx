import { View, Pressable } from "react-native";
import { Trash2 } from "lucide-react-native";

import { Text } from "@/components/ui/text";
import { BIBLE_BOOK_DETAILS } from "@/lib/bible/constants";
import { BibleBook } from "@/lib/bible/types";

interface BookmarkItemProps {
  verseId: string; // Format: "KJV:GENESIS:1:1"
  verseText?: string;
  createdAt: number;
  onPress: () => void;
  onDelete: () => void;
}

/**
 * Parse verse ID into its component parts.
 * Format: "{translationId}:{book}:{chapter}:{verse}"
 */
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

/**
 * BookmarkItem displays a single bookmark with verse reference,
 * optional preview text, date, and delete action.
 */
export function BookmarkItem({
  verseId,
  verseText,
  createdAt,
  onPress,
  onDelete,
}: BookmarkItemProps) {
  const parsed = parseVerseId(verseId);
  if (!parsed) return null;

  const bookDetails = BIBLE_BOOK_DETAILS[parsed.book];
  const reference = `${bookDetails?.name ?? parsed.book} ${parsed.chapter}:${parsed.verse}`;
  const dateStr = new Date(createdAt).toLocaleDateString();

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center px-4 py-3 border-b border-border active:bg-muted/50"
    >
      <View className="flex-1">
        <Text className="text-foreground text-base font-medium">
          {reference}
        </Text>
        {verseText && (
          <Text
            className="text-muted-foreground text-sm mt-1"
            numberOfLines={2}
          >
            {verseText}
          </Text>
        )}
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
