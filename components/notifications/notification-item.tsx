import { Image } from "expo-image";
import { useRouter } from "expo-router";
import {
  AtSign,
  Heart,
  MessageCirclePlus,
  Reply,
  UserRoundPlus,
  type LucideIcon,
} from "lucide-react-native";
import { useCallback, useMemo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { graphql, useFragment } from "react-relay";

import { Text } from "@/components/ui/text";
import { useColors } from "@/hooks/use-colors";
import { BIBLE_BOOK_DETAILS } from "@/lib/bible/constants";
import type { BibleBook } from "@/lib/bible/types";
import type { notificationItemFragment$key } from "@/lib/relay/__generated__/notificationItemFragment.graphql";

const NotificationFragment = graphql`
  fragment notificationItemFragment on Notification {
    id
    type
    createdAt
    sender {
      id
      name
      username
      image {
        url
      }
    }
    post {
      id
      content
      verse {
        id
        book
        chapter
        verse
        translation
      }
      parentPost {
        verse {
          id
          book
          chapter
          verse
          translation
        }
      }
    }
  }
`;

// ---------------------------------------------------------------------------
// Type icon mapping — keys match the GraphQL NotificationType enum
// ---------------------------------------------------------------------------

const TYPE_CONFIG: Record<
  string,
  {
    icon: LucideIcon;
    color: string;
    fill?: boolean;
    getMessage: (name: string) => string;
  }
> = {
  BIBLE_VERSE_POST_LIKE: {
    icon: Heart,
    color: "#ef4444",
    fill: true,
    getMessage: (name) => ` liked your post`,
  },
  BIBLE_VERSE_POST_REPLY: {
    icon: Reply,
    color: "",
    getMessage: (name) => ` replied to your post`,
  },
  BIBLE_VERSE_POST_FOLLOWER_POST: {
    icon: MessageCirclePlus,
    color: "",
    getMessage: (name) => ` shared a new reflection`,
  },
  BIBLE_VERSE_POST_MENTION: {
    icon: AtSign,
    color: "",
    getMessage: (name) => ` mentioned you`,
  },
  USER_FOLLOWED: {
    icon: UserRoundPlus,
    color: "",
    getMessage: (name) => ` started following you`,
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function extractPlainPreview(content: string | null | undefined): string {
  if (!content) return "";
  try {
    const parsed = JSON.parse(content);
    const texts: string[] = [];
    const walk = (node: {
      type?: string;
      text?: string;
      children?: unknown[];
    }) => {
      if (node.type === "text" && node.text) texts.push(node.text);
      if (node.children && Array.isArray(node.children)) {
        for (const child of node.children) walk(child as typeof node);
      }
    };
    if (parsed.root?.children) {
      for (const p of parsed.root.children) walk(p);
    }
    const full = texts.join(" ").trim();
    return full.length > 100 ? full.slice(0, 100) + "..." : full;
  } catch {
    const trimmed = content.trim();
    return trimmed.length > 100 ? trimmed.slice(0, 100) + "..." : trimmed;
  }
}

function formatVerseRef(
  verse:
    | {
        readonly book?: string | null;
        readonly chapter?: number | null;
        readonly verse?: number | null;
        readonly translation?: string | null;
      }
    | null
    | undefined,
): string | null {
  if (!verse?.book || !verse?.chapter || !verse?.verse) return null;
  const bookDetail = BIBLE_BOOK_DETAILS[verse.book as BibleBook];
  const bookName = bookDetail?.name ?? verse.book;
  const parts: string[] = [];
  if (verse.translation) parts.push(verse.translation);
  parts.push(`${bookName} ${verse.chapter}:${verse.verse}`);
  return parts.join(" · ");
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "now";
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface NotificationItemProps {
  notificationRef: notificationItemFragment$key;
}

export function NotificationItem({ notificationRef }: NotificationItemProps) {
  const data = useFragment(NotificationFragment, notificationRef);
  const colors = useColors();
  const router = useRouter();

  const config =
    TYPE_CONFIG[data.type ?? ""] ?? TYPE_CONFIG.BIBLE_VERSE_POST_LIKE;
  const Icon = config.icon;
  const iconColor = config.color || colors.textSecondary;

  const senderName = data.sender?.name || data.sender?.username || "Someone";
  const formattedDate = useMemo(
    () => formatDate(data.createdAt),
    [data.createdAt],
  );

  const contentPreview = extractPlainPreview(data.post?.content);
  const verse = data.post?.verse ?? data.post?.parentPost?.verse;
  const verseRef = formatVerseRef(verse);

  const handlePress = useCallback(() => {
    if (data.type === "USER_FOLLOWED" && data.sender?.username) {
      router.push(`/user/${data.sender.username}`);
    } else if (data.post?.id) {
      router.push(`/post/${data.post.id}`);
    }
  }, [data, router]);

  const handleVersePress = useCallback(() => {
    if (verse?.id) {
      router.push({ pathname: "/verse/[id]", params: { id: verse.id } });
    }
  }, [verse, router]);

  return (
    <Pressable
      onPress={handlePress}
      style={[styles.container, { borderBottomColor: colors.border }]}
    >
      {/* Type icon — small inline, matching web */}
      <View style={styles.iconWrap}>
        <Icon
          size={16}
          color={iconColor}
          strokeWidth={1.5}
          {...(config.fill ? { fill: iconColor } : {})}
        />
      </View>

      {/* Content column */}
      <View style={styles.contentColumn}>
        {/* Sender row: avatar + message + timestamp */}
        <View style={styles.senderRow}>
          {data.sender?.image?.url ? (
            <Image
              source={{ uri: data.sender.image.url }}
              style={styles.avatar}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <View
              style={[
                styles.avatarPlaceholder,
                { backgroundColor: colors.surfaceElevated },
              ]}
            >
              <Text style={[styles.avatarInitial, { color: colors.textMuted }]}>
                {senderName[0].toUpperCase()}
              </Text>
            </View>
          )}
          <View style={styles.messageColumn}>
            <View style={styles.messageTopRow}>
              <Text
                style={[styles.messageText, { color: colors.text }]}
                numberOfLines={2}
              >
                <Text style={styles.senderName}>{senderName}</Text>
                {config.getMessage(senderName)}
              </Text>
              <Text style={[styles.timestamp, { color: colors.textMuted }]}>
                {formattedDate}
              </Text>
            </View>
          </View>
        </View>

        {/* Post content preview card (matches web's bordered box) */}
        {(contentPreview || verseRef) && (
          <View style={[styles.postCard, { borderColor: colors.border }]}>
            {contentPreview ? (
              <Text
                style={[styles.postContent, { color: colors.textSecondary }]}
                numberOfLines={3}
              >
                {contentPreview}
              </Text>
            ) : null}
            {verseRef && (
              <Pressable
                onPress={handleVersePress}
                style={[styles.verseButton, { borderColor: colors.border }]}
              >
                <Text
                  style={[
                    styles.verseButtonText,
                    { color: colors.textSecondary },
                  ]}
                >
                  {verseRef}
                </Text>
              </Pressable>
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  iconWrap: {
    width: 16,
    marginTop: 6,
  },
  contentColumn: {
    flex: 1,
    gap: 6,
  },
  senderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  messageColumn: {
    flex: 1,
  },
  messageTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    fontSize: 13,
    fontWeight: "600",
  },
  messageText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 21,
  },
  senderName: {
    fontWeight: "600",
  },
  postCard: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    gap: 10,
    marginTop: 4,
  },
  postContent: {
    fontSize: 14,
    lineHeight: 20,
  },
  verseButton: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  verseButtonText: {
    fontSize: 12,
    fontWeight: "500",
  },
  timestamp: {
    fontSize: 13,
    marginTop: 2,
    flexShrink: 0,
  },
});
