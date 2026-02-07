import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import {
  BookOpen,
  Heart,
  MessageCircle,
  Share as ShareIcon,
  Trash2,
} from "lucide-react-native";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Share,
  StyleSheet,
  View,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { graphql, useMutation } from "react-relay";

import { Text } from "@/components/ui/text";
import { createVerseId } from "@/lib/bible/utils";
import type { BibleBook } from "@/lib/bible/types";
import { getPostShareUrl } from "@/lib/utils";
import type { reflectionItemPollVoteMutation } from "@/lib/relay/__generated__/reflectionItemPollVoteMutation.graphql";
import type { reflectionItemPollUnvoteMutation } from "@/lib/relay/__generated__/reflectionItemPollUnvoteMutation.graphql";

// Poll vote mutation
const PollVoteMutation = graphql`
  mutation reflectionItemPollVoteMutation($optionId: ID!, $pollId: ID!) {
    pollVote(optionId: $optionId, pollId: $pollId) {
      poll {
        id
        totalVotes
        userVote {
          id
          text
        }
        options {
          id
          text
          voteCount
          votePercentage
        }
      }
    }
  }
`;

// Poll unvote mutation
const PollUnvoteMutation = graphql`
  mutation reflectionItemPollUnvoteMutation($pollId: ID!) {
    pollUnvote(pollId: $pollId) {
      poll {
        id
        totalVotes
        userVote {
          id
          text
        }
        options {
          id
          text
          voteCount
          votePercentage
        }
      }
    }
  }
`;

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
  readonly deadline?: string | null;
  readonly userVote?: {
    readonly id?: string | null;
    readonly text?: string | null;
  } | null;
}

interface VerseInfo {
  readonly id?: string | null;
  readonly book?: string | null;
  readonly chapter?: number | null;
  readonly verse?: number | null;
  readonly translation?: string | null;
}

interface ReflectionItemProps {
  id: string;
  content?: string | null;
  user: ReflectionUser;
  createdAt: string;
  images: readonly ReflectionImage[];
  poll?: Poll | null;
  verse?: VerseInfo | null;
  verseReference?: string | null;
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
  verse,
  verseReference,
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
  const [commitPollVote, isPollVoting] =
    useMutation<reflectionItemPollVoteMutation>(PollVoteMutation);
  const [commitPollUnvote, isPollUnvoting] =
    useMutation<reflectionItemPollUnvoteMutation>(PollUnvoteMutation);
  const isPollLoading = isPollVoting || isPollUnvoting;

  const handlePollVote = useCallback(
    (optionId: string) => {
      if (!poll || isPollLoading) return;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      commitPollVote({
        variables: { optionId, pollId: poll.id },
        onError: (error) => {
          console.error("Poll vote failed:", error);
        },
      });
    },
    [poll, commitPollVote, isPollLoading],
  );

  const handlePollUnvote = useCallback(() => {
    if (!poll || isPollLoading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    commitPollUnvote({
      variables: { pollId: poll.id },
      onError: (error) => {
        console.error("Poll unvote failed:", error);
      },
    });
  }, [poll, commitPollUnvote, isPollLoading]);

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

  const handleVersePress = useCallback(() => {
    if (verse?.book && verse?.chapter && verse?.verse && verse?.translation) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const verseId = createVerseId(
        verse.translation,
        verse.book as BibleBook,
        verse.chapter,
        verse.verse,
      );
      router.push(`/verse/${verseId}`);
    }
  }, [verse, router]);

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
              style={{
                color: "#3b82f6",
                fontWeight: "500",
                textDecorationLine: "underline",
              }}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push(`/user/${node.username}`);
              }}
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
  }, [content, colors, router]);

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

  // Derive accent colors for visual interest
  const accentLight = colors.accent + "12";
  const accentMedium = colors.accent + "20";

  return (
    <Animated.View
      entering={FadeIn.duration(200).delay(index * 25)}
      style={[styles.container, { borderBottomColor: colors.border }]}
    >
      <Pressable style={styles.row} onPress={handleCardPress}>
        {/* Avatar */}
        <Pressable onPress={handleUserPress} style={[styles.avatarContainer]}>
          {user.image?.url ? (
            <Image
              source={{ uri: user.image.url }}
              style={styles.avatar}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <View
              style={[
                styles.avatarPlaceholder,
                { backgroundColor: accentLight },
              ]}
            >
              <Text style={[styles.avatarInitial, { color: colors.accent }]}>
                {(user.name || user.username || "?")[0].toUpperCase()}
              </Text>
            </View>
          )}
        </Pressable>

        {/* Content Column */}
        <View style={styles.contentColumn}>
          {/* Header: Name + @username • time */}
          <Pressable onPress={handleUserPress}>
            <View style={styles.headerRow}>
              <Text
                style={[styles.displayName, { color: colors.text }]}
                numberOfLines={1}
              >
                {user.name || user.username || "Anonymous"}
              </Text>
              <Text style={[styles.headerDot, { color: colors.textMuted }]}>
                ·
              </Text>
              <Text
                style={[styles.username, { color: colors.textMuted }]}
                numberOfLines={1}
              >
                @{user.username || "user"}
              </Text>
              <Text style={[styles.headerDot, { color: colors.textMuted }]}>
                ·
              </Text>
              <Text
                style={[styles.headerMeta, { color: colors.textMuted }]}
                numberOfLines={1}
              >
                {formattedDate}
              </Text>
            </View>
          </Pressable>

          {/* Post Content */}
          {contentElements && (
            <View style={styles.contentContainer}>{contentElements}</View>
          )}

          {/* Images */}
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
                        style={{ width: "100%", height: "100%" }}
                        contentFit="cover"
                        transition={150}
                      />
                    </View>
                  ),
              )}
            </View>
          )}

          {/* Poll */}
          {poll &&
            poll.options &&
            (() => {
              const showResults = poll.isExpired || !!poll.userVote;

              // Compute time left from deadline
              const timeLeft = (() => {
                if (poll.isExpired) return "Final results";
                if (!poll.deadline) return null;
                const now = new Date();
                const deadline = new Date(poll.deadline);
                const diffMs = deadline.getTime() - now.getTime();
                if (diffMs <= 0) return "Final results";
                const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                const diffMins = Math.floor(diffMs / (1000 * 60));
                if (diffDays > 0)
                  return `${diffDays} day${diffDays !== 1 ? "s" : ""} left`;
                if (diffHours > 0) return `${diffHours}h left`;
                return `${diffMins}m left`;
              })();

              return (
                <Pressable
                  onPress={() => {
                    /* absorb touch from outer card */
                  }}
                >
                  <View
                    style={[
                      styles.pollContainer,
                      { borderColor: colors.border },
                      isPollLoading && { opacity: 0.6 },
                    ]}
                  >
                    {/* Poll Header */}
                    <View style={styles.pollHeader}>
                      <View style={styles.pollHeaderRow}>
                        <Text
                          style={[styles.pollMeta, { color: colors.textMuted }]}
                        >
                          {poll.totalVotes || 0} vote
                          {(poll.totalVotes || 0) !== 1 ? "s" : ""}
                          {timeLeft ? `  ·  ${timeLeft}` : ""}
                        </Text>
                        {isPollLoading && (
                          <ActivityIndicator
                            size="small"
                            color={colors.textMuted}
                          />
                        )}
                      </View>
                    </View>

                    {/* Poll Options */}
                    <View style={styles.pollOptions}>
                      {poll.options.map((option) => {
                        const isVoted = poll.userVote?.text === option.text;
                        const percentage = option.votePercentage || 0;

                        return (
                          <Pressable
                            key={option.id}
                            disabled={isPollLoading || poll.isExpired}
                            onPress={() => {
                              if (isVoted && showResults) {
                                handlePollUnvote();
                              } else if (!showResults) {
                                handlePollVote(option.id);
                              }
                            }}
                            style={[
                              styles.pollOption,
                              {
                                backgroundColor: colors.surface,
                                borderColor: colors.border,
                              },
                              isVoted &&
                                showResults && {
                                  backgroundColor: colors.accent + "12",
                                  borderColor: colors.accent + "30",
                                },
                            ]}
                          >
                            {showResults && (
                              <View style={StyleSheet.absoluteFill}>
                                <View
                                  style={{
                                    width: `${percentage}%`,
                                    height: "100%",
                                    backgroundColor: isVoted
                                      ? colors.accent + "20"
                                      : colors.border + "60",
                                  }}
                                />
                              </View>
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
                                  isVoted && { color: colors.accent },
                                ]}
                              >
                                {Math.round(percentage)}%
                              </Text>
                            )}
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>
                </Pressable>
              );
            })()}

          {/* Footer: Verse Badge + Action Buttons */}
          <View style={styles.footer}>
            {/* Verse Badge */}
            {verseReference && (
              <Pressable
                onPress={handleVersePress}
                style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
              >
                <View
                  style={[
                    styles.verseBadge,
                    { backgroundColor: accentLight, borderColor: accentMedium },
                  ]}
                >
                  <BookOpen size={14} color={colors.accent} strokeWidth={2} />
                  <View style={styles.verseBadgeTextContainer}>
                    {verse?.translation && (
                      <Text
                        style={[
                          styles.verseBadgeTranslation,
                          { color: colors.textMuted },
                        ]}
                      >
                        {verse.translation}
                      </Text>
                    )}
                    <Text
                      style={[
                        styles.verseBadgeReference,
                        { color: colors.text },
                      ]}
                    >
                      {verseReference}
                    </Text>
                  </View>
                </View>
              </Pressable>
            )}

            {/* Action Buttons Row - Refined with better spacing */}
            <View style={styles.actionBar}>
              {/* Like */}
              <Pressable
                onPress={handleLikeToggle}
                style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
                hitSlop={12}
              >
                <View style={styles.actionItem}>
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
                        { color: isLiked ? "#f91880" : colors.textMuted },
                      ]}
                    >
                      {likesCount}
                    </Text>
                  )}
                </View>
              </Pressable>

              {/* Comment */}
              <Pressable
                onPress={handleComment}
                style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
                hitSlop={12}
              >
                <View style={styles.actionItem}>
                  <MessageCircle
                    size={18}
                    color={colors.textMuted}
                    strokeWidth={1.5}
                  />
                  {childPostsCount > 0 && (
                    <Text
                      style={[styles.actionCount, { color: colors.textMuted }]}
                    >
                      {childPostsCount}
                    </Text>
                  )}
                </View>
              </Pressable>

              {/* Share */}
              <Pressable
                onPress={handleShare}
                style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
                hitSlop={12}
              >
                <View style={styles.actionItem}>
                  <ShareIcon
                    size={17}
                    color={colors.textMuted}
                    strokeWidth={1.5}
                  />
                </View>
              </Pressable>

              {/* Spacer */}
              <View style={styles.spacer} />

              {/* Delete - only for owner */}
              {isOwner && onDelete && (
                <Pressable
                  onPress={handleDelete}
                  style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
                  hitSlop={12}
                >
                  <View style={styles.actionItem}>
                    <Trash2
                      size={17}
                      color={colors.textMuted}
                      strokeWidth={1.5}
                    />
                  </View>
                </Pressable>
              )}
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  avatarContainer: {},
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    fontSize: 17,
    fontWeight: "700",
  },
  contentColumn: {
    flex: 1,
    gap: 4,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  displayName: {
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: -0.2,
  },
  headerDot: {
    fontSize: 14,
    opacity: 0.5,
  },
  headerMeta: {
    fontSize: 13,
  },
  username: {
    fontSize: 13,
  },
  contentContainer: {
    marginTop: 4,
  },
  content: {
    fontSize: 15,
    lineHeight: 22,
  },
  spoilerText: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: "hidden",
  },
  // Image Grid
  imageGrid: {
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 8,
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
  // Poll
  pollContainer: {
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 8,
    padding: 12,
  },
  pollHeader: {
    marginBottom: 8,
  },
  pollHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pollOptions: {
    gap: 6,
  },
  pollOption: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  pollOptionText: {
    fontSize: 15,
    zIndex: 1,
  },
  pollPercentage: {
    fontSize: 14,
    fontWeight: "600",
    zIndex: 1,
  },
  pollMeta: {
    fontSize: 13,
  },
  // Footer
  footer: {
    marginTop: 12,
    gap: 12,
  },
  // Verse Badge - Enhanced
  verseBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  verseBadgeTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  verseBadgeTranslation: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    opacity: 0.7,
  },
  verseBadgeReference: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: -0.2,
  },
  // Action Bar
  actionBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  actionCount: {
    fontSize: 13,
  },
  spacer: {
    flex: 1,
  },
});
