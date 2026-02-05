import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import {
  Heart,
  MessageCircle,
  Share as ShareIcon,
  Trash2,
} from "lucide-react-native";
import { useCallback, useMemo, useState } from "react";
import { Alert, Pressable, Share, StyleSheet, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { Text } from "@/components/ui/text";
import { getPostShareUrl } from "@/lib/utils";

// Spoiler component for tap-to-reveal
function SpoilerText({
  text,
  colors,
}: {
  text: string;
  colors: { textMuted: string; surfaceElevated: string; text: string };
}) {
  const [revealed, setRevealed] = useState(false);

  const handlePress = useCallback(() => {
    if (!revealed) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setRevealed(true);
    }
  }, [revealed]);

  return (
    <Pressable onPress={handlePress}>
      <Text
        style={[
          styles.spoilerText,
          {
            backgroundColor: revealed ? "transparent" : colors.surfaceElevated,
            color: revealed ? colors.text : "transparent",
          },
        ]}
      >
        {text}
      </Text>
    </Pressable>
  );
}

// Extract plain text from Lexical JSON for sharing
function extractPlainText(content: string | null | undefined): string {
  if (!content) return "";

  try {
    const parsed = JSON.parse(content);
    const texts: string[] = [];

    const extractFromNode = (node: {
      type?: string;
      text?: string;
      children?: unknown[];
    }) => {
      if (node.type === "text" && node.text) {
        texts.push(node.text);
      }
      if (node.type === "mention" && (node as { username?: string }).username) {
        texts.push(`@${(node as { username?: string }).username}`);
      }
      if (node.children && Array.isArray(node.children)) {
        for (const child of node.children) {
          extractFromNode(child as typeof node);
        }
      }
    };

    if (parsed.root?.children) {
      for (const paragraph of parsed.root.children) {
        extractFromNode(paragraph);
        texts.push("\n");
      }
    }

    return texts.join("").trim();
  } catch {
    return content;
  }
}

interface ReflectionUser {
  readonly id: string;
  readonly name?: string | null;
  readonly username?: string | null;
  readonly image?: { readonly url?: string | null } | null;
}

interface ReflectionImage {
  readonly url?: string | null;
  readonly width?: number | null;
  readonly height?: number | null;
}

interface PollOption {
  readonly id: string;
  readonly text?: string | null;
  readonly voteCount?: number | null;
  readonly votePercentage?: number | null;
}

interface Poll {
  readonly id: string;
  readonly options?: readonly PollOption[] | null;
  readonly totalVotes?: number | null;
  readonly isExpired?: boolean | null;
  readonly userVote?: {
    readonly id?: string | null;
    readonly text?: string | null;
  } | null;
}

interface ReflectionItemProps {
  id: string;
  content?: string | null;
  user: ReflectionUser;
  createdAt: string;
  images: readonly ReflectionImage[];
  poll?: Poll | null;
  likesCount: number;
  childPostsCount: number;
  likedAt?: string | null;
  colors: {
    bg: string;
    surface: string;
    surfaceElevated: string;
    border: string;
    text: string;
    textSecondary: string;
    textMuted: string;
    accent: string;
  };
  index: number;
  currentUserId?: string | null;
  onLike?: (id: string) => void;
  onUnlike?: (id: string) => void;
  onDelete?: (id: string) => void;
  disableNavigation?: boolean;
}

export function ReflectionItem({
  id,
  content,
  user,
  createdAt,
  images,
  poll,
  likesCount,
  childPostsCount,
  likedAt,
  colors,
  index,
  currentUserId,
  onLike,
  onUnlike,
  onDelete,
  disableNavigation = false,
}: ReflectionItemProps) {
  const router = useRouter();
  const isLiked = !!likedAt;
  const isOwner = currentUserId === user.id;

  const handleLikeToggle = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (isLiked) {
      onUnlike?.(id);
    } else {
      onLike?.(id);
    }
  }, [id, isLiked, onLike, onUnlike]);

  const handleComment = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/post/${id}`);
  }, [id, router]);

  const handleShare = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const shareUrl = getPostShareUrl(id);
    const plainText = extractPlainText(content);
    const authorName = user.name || user.username || "Someone";
    const shareText = `"${plainText}"\n\n— ${authorName} on Selah\n${shareUrl}`;

    try {
      await Share.share({ message: shareText, url: shareUrl });
    } catch {
      // User cancelled
    }
  }, [id, content, user]);

  const handleDelete = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert(
      "Delete Post",
      "Are you sure you want to delete this post? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onDelete?.(id),
        },
      ],
    );
  }, [id, onDelete]);

  const formattedDate = useMemo(() => {
    const date = new Date(createdAt);
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
  }, [createdAt]);

  // Parse Lexical content to renderable elements
  const contentElements = useMemo(() => {
    if (!content) return null;

    try {
      const parsed = JSON.parse(content);
      const elements: React.ReactNode[] = [];
      let key = 0;

      const renderNode = (node: {
        type?: string;
        text?: string;
        format?: number;
        userId?: string;
        username?: string;
        children?: unknown[];
      }): React.ReactNode => {
        if (node.type === "text" && node.text) {
          let textElement: React.ReactNode = node.text;
          const format = node.format || 0;

          if (format & 1)
            textElement = (
              <Text key={key++} style={{ fontWeight: "700" }}>
                {textElement}
              </Text>
            );
          if (format & 2)
            textElement = (
              <Text key={key++} style={{ fontStyle: "italic" }}>
                {textElement}
              </Text>
            );
          if (format & 8)
            textElement = (
              <Text key={key++} style={{ textDecorationLine: "underline" }}>
                {textElement}
              </Text>
            );

          return textElement;
        }

        if (node.type === "mention" && node.username) {
          return (
            <Text
              key={key++}
              style={{ color: colors.accent, fontWeight: "500" }}
            >
              @{node.username}
            </Text>
          );
        }

        if (node.type === "spoiler" && node.children) {
          let spoilerText = "";
          for (const child of node.children) {
            const c = child as { type?: string; text?: string };
            if (c.type === "text" && c.text) {
              spoilerText += c.text;
            }
          }
          return <SpoilerText key={key++} text={spoilerText} colors={colors} />;
        }

        if (node.children && Array.isArray(node.children)) {
          const childElements: React.ReactNode[] = [];
          for (const child of node.children) {
            childElements.push(renderNode(child as typeof node));
          }
          return childElements;
        }

        return null;
      };

      if (parsed.root?.children) {
        for (let i = 0; i < parsed.root.children.length; i++) {
          const paragraph = parsed.root.children[i];
          const paragraphContent = renderNode(paragraph);
          if (paragraphContent) {
            elements.push(
              <Text
                key={`p-${i}`}
                style={[styles.content, { color: colors.text }]}
              >
                {paragraphContent}
              </Text>,
            );
          }
        }
      }

      return elements.length > 0 ? elements : null;
    } catch {
      return (
        <Text style={[styles.content, { color: colors.text }]} selectable>
          {content}
        </Text>
      );
    }
  }, [content, colors]);

  const handleCardPress = useCallback(() => {
    if (disableNavigation) return;
    router.push(`/post/${id}`);
  }, [id, router, disableNavigation]);

  const handleUserPress = useCallback(() => {
    if (user.username) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      router.push(`/user/${user.username}`);
    }
  }, [user.username, router]);

  return (
    <Animated.View
      entering={FadeIn.duration(200).delay(index * 30)}
      style={[styles.container, { borderBottomColor: colors.border }]}
    >
      {/* Twitter-style horizontal layout */}
      <View style={styles.row}>
        {/* Avatar - tappable to navigate to user profile */}
        <Pressable
          onPress={handleUserPress}
          style={({ pressed }) => [
            styles.avatarContainer,
            { opacity: pressed ? 0.7 : 1 },
          ]}
        >
          {user.image?.url ? (
            <Image
              source={{ uri: user.image.url }}
              style={styles.avatar}
              contentFit="cover"
              transition={150}
            />
          ) : (
            <View
              style={[
                styles.avatarPlaceholder,
                { backgroundColor: colors.accent + "18" },
              ]}
            >
              <Text style={[styles.avatarInitial, { color: colors.accent }]}>
                {(user.name || user.username || "?")[0].toUpperCase()}
              </Text>
            </View>
          )}
        </Pressable>

        {/* Content Column */}
        <Pressable style={styles.contentColumn} onPress={handleCardPress}>
          {/* Header Row: Name, Username, Time */}
          <View style={styles.header}>
            <Pressable
              onPress={handleUserPress}
              style={({ pressed }) => [
                styles.headerLeft,
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Text
                style={[styles.displayName, { color: colors.text }]}
                numberOfLines={1}
              >
                {user.name || user.username || "Anonymous"}
              </Text>
              <Text
                style={[styles.username, { color: colors.textMuted }]}
                numberOfLines={1}
              >
                @{user.username || "user"}
              </Text>
              <Text style={[styles.dot, { color: colors.textMuted }]}>·</Text>
              <Text style={[styles.time, { color: colors.textMuted }]}>
                {formattedDate}
              </Text>
            </Pressable>
          </View>

          {/* Content */}
          {contentElements && (
            <View style={styles.contentContainer}>{contentElements}</View>
          )}

          {/* Images - Twitter-style grid */}
          {images.length > 0 && (
            <View
              style={[
                styles.imageGrid,
                images.length === 1 && styles.singleImageGrid,
                images.length === 2 && styles.twoImageGrid,
                images.length >= 3 && styles.multiImageGrid,
                { borderColor: colors.border },
              ]}
            >
              {images.slice(0, 4).map(
                (image, imgIndex) =>
                  image.url && (
                    <View
                      key={imgIndex}
                      style={[
                        styles.imageItem,
                        images.length === 1 && styles.singleImage,
                        images.length === 2 && styles.twoImage,
                        images.length === 3 &&
                          (imgIndex === 0
                            ? styles.threeImageFirst
                            : styles.threeImageRest),
                        images.length === 4 && styles.fourImage,
                      ]}
                    >
                      <Image
                        source={{ uri: image.url }}
                        style={styles.image}
                        contentFit="cover"
                        transition={150}
                      />
                    </View>
                  ),
              )}
            </View>
          )}

          {/* Poll - Twitter style */}
          {poll && poll.options && (
            <View
              style={[styles.pollContainer, { borderColor: colors.border }]}
            >
              {poll.options.map((option) => {
                const isVoted = poll.userVote?.id === option.id;
                const percentage = option.votePercentage || 0;
                const showResults = poll.isExpired || !!poll.userVote;

                return (
                  <Pressable
                    key={option.id}
                    style={[styles.pollOption, { borderColor: colors.border }]}
                  >
                    {showResults && (
                      <View
                        style={[
                          styles.pollBar,
                          {
                            width: `${percentage}%`,
                            backgroundColor: isVoted
                              ? colors.accent + "25"
                              : colors.surfaceElevated,
                          },
                        ]}
                      />
                    )}
                    <Text
                      style={[
                        styles.pollOptionText,
                        { color: colors.text },
                        isVoted && { fontWeight: "600" },
                      ]}
                    >
                      {option.text}
                    </Text>
                    {showResults && (
                      <Text
                        style={[
                          styles.pollPercentage,
                          { color: colors.textMuted },
                        ]}
                      >
                        {Math.round(percentage)}%
                      </Text>
                    )}
                  </Pressable>
                );
              })}
              <Text style={[styles.pollMeta, { color: colors.textMuted }]}>
                {poll.totalVotes || 0} vote
                {(poll.totalVotes || 0) !== 1 ? "s" : ""}
                {poll.isExpired ? " · Final results" : ""}
              </Text>
            </View>
          )}

          {/* Action Bar - wrapped to prevent touch bubbling */}
          <Pressable style={styles.actionBar} onPress={() => {}}>
            {/* Comment */}
            <Pressable
              onPress={handleComment}
              style={({ pressed }) => [
                styles.actionItem,
                { opacity: pressed ? 0.5 : 1 },
              ]}
              hitSlop={8}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MessageCircle
                  size={18}
                  color={colors.textMuted}
                  strokeWidth={1.5}
                />
                {childPostsCount > 0 && (
                  <Text
                    style={[
                      styles.actionCount,
                      { color: colors.textMuted, marginLeft: 6 },
                    ]}
                  >
                    {childPostsCount}
                  </Text>
                )}
              </View>
            </Pressable>

            {/* Like */}
            <Pressable
              onPress={handleLikeToggle}
              style={({ pressed }) => [
                styles.actionItem,
                { opacity: pressed ? 0.5 : 1 },
              ]}
              hitSlop={8}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Heart
                  size={18}
                  color={isLiked ? "#f91880" : colors.textMuted}
                  fill={isLiked ? "#f91880" : "transparent"}
                  strokeWidth={1.5}
                />
                {likesCount > 0 && (
                  <Text
                    style={[
                      styles.actionCount,
                      {
                        color: isLiked ? "#f91880" : colors.textMuted,
                        marginLeft: 6,
                      },
                    ]}
                  >
                    {likesCount}
                  </Text>
                )}
              </View>
            </Pressable>

            {/* Share */}
            <Pressable
              onPress={handleShare}
              style={({ pressed }) => [
                styles.actionItem,
                { opacity: pressed ? 0.5 : 1 },
              ]}
              hitSlop={8}
            >
              <ShareIcon size={17} color={colors.textMuted} strokeWidth={1.5} />
            </Pressable>

            {/* Delete - only for owner */}
            {isOwner && onDelete && (
              <Pressable
                onPress={handleDelete}
                style={({ pressed }) => [
                  styles.actionItem,
                  { opacity: pressed ? 0.5 : 1 },
                ]}
                hitSlop={8}
              >
                <Trash2 size={17} color={colors.textMuted} strokeWidth={1.5} />
              </Pressable>
            )}
          </Pressable>
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  row: {
    flexDirection: "row",
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    fontSize: 16,
    fontWeight: "600",
  },
  contentColumn: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 4,
  },
  displayName: {
    fontSize: 15,
    fontWeight: "700",
    flexShrink: 1,
  },
  username: {
    fontSize: 14,
    flexShrink: 1,
  },
  dot: {
    fontSize: 14,
  },
  time: {
    fontSize: 14,
  },
  contentContainer: {
    marginBottom: 10,
  },
  content: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  spoilerText: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: "hidden",
  },
  // Image Grid - Twitter style
  imageGrid: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
  singleImageGrid: {
    aspectRatio: 16 / 9,
  },
  twoImageGrid: {
    flexDirection: "row",
    aspectRatio: 2 / 1,
    gap: 2,
  },
  multiImageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    aspectRatio: 16 / 9,
    gap: 2,
  },
  imageItem: {
    overflow: "hidden",
  },
  singleImage: {
    width: "100%",
    height: "100%",
  },
  twoImage: {
    width: "50%",
    height: "100%",
  },
  threeImageFirst: {
    width: "50%",
    height: "100%",
  },
  threeImageRest: {
    width: "50%",
    height: "50%",
  },
  fourImage: {
    width: "50%",
    height: "50%",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  // Poll styles
  pollContainer: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 10,
  },
  pollOption: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  pollBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
  },
  pollOptionText: {
    fontSize: 14,
    zIndex: 1,
  },
  pollPercentage: {
    fontSize: 14,
    fontWeight: "600",
    zIndex: 1,
  },
  pollMeta: {
    fontSize: 13,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  // Action Bar
  actionBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
    paddingVertical: 8,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 4,
  },
  actionCount: {
    fontSize: 13,
  },
});
