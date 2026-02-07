import {
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
  useMemo,
} from "react";
import {
  View,
  Pressable,
  StyleSheet,
  Platform,
  ActivityIndicator,
  Keyboard,
  ScrollView,
  TextInput,
  Modal,
} from "react-native";
import { WebView, type WebViewMessageEvent } from "react-native-webview";
import { Image } from "expo-image";
import Animated, {
  FadeInDown,
  FadeOutDown,
  LinearTransition,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardStickyView } from "react-native-keyboard-controller";
import {
  BarChart2,
  ArrowUp,
  X,
  AtSign,
  EyeOff,
  Clock,
  Maximize2,
  ChevronDown,
} from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Haptics from "expo-haptics";
import { fetchQuery, useRelayEnvironment } from "react-relay";
import { graphql } from "relay-runtime";

import { Text } from "@/components/ui/text";
import {
  ImagePickerGrid,
  ImagePickerButton,
  type SelectedImage,
} from "./image-picker-grid";
import { getLexicalEditorHtml } from "./lexical-editor-html";
import type {
  reflectionComposerMentionQuery,
  reflectionComposerMentionQuery$data,
} from "@/lib/relay/__generated__/reflectionComposerMentionQuery.graphql";

const MAX_LENGTH = 10000;
const SHOW_LIMIT_AT = 0.8;

const MentionSearchQuery = graphql`
  query reflectionComposerMentionQuery($filter: UserFilterInput!) {
    users(first: 5, filter: $filter) {
      edges {
        node {
          id
          username
          name
          image {
            url
          }
        }
      }
    }
  }
`;

interface PollData {
  options: string[];
  deadline: Date;
}

interface MentionUser {
  id: string;
  username: string;
  name: string | null;
  imageUrl: string | null;
}

export interface ReflectionComposerRef {
  focus: () => void;
  clear: () => void;
}

interface ReflectionComposerProps {
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
  onSubmit: (data: {
    content: string;
    images: SelectedImage[];
    poll: PollData | null;
  }) => void;
  placeholder?: string;
  isAuthenticated: boolean;
  onAuthRequired?: () => void;
  isSubmitting?: boolean;
}

// Circular progress indicator
function CircularProgress({
  progress,
  size = 24,
  strokeWidth = 2.5,
  color,
  trackColor,
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color: string;
  trackColor: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - progress * circumference;

  const isOverLimit = progress > 1;
  const displayColor = isOverLimit ? "#ef4444" : color;

  return (
    <Svg
      width={size}
      height={size}
      style={{ transform: [{ rotate: "-90deg" }] }}
    >
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={trackColor}
        strokeWidth={strokeWidth}
        fill="none"
      />
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={displayColor}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
      />
    </Svg>
  );
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const ReflectionComposer = forwardRef<
  ReflectionComposerRef,
  ReflectionComposerProps
>(function ReflectionComposer(
  {
    colors,
    onSubmit,
    placeholder = "What's on your mind?",
    isAuthenticated,
    onAuthRequired,
    isSubmitting = false,
  },
  ref,
) {
  const insets = useSafeAreaInsets();
  const webViewRef = useRef<WebView>(null);
  const environment = useRelayEnvironment();

  const [editorState, setEditorState] = useState<string>("");
  const editorStateRef = useRef<string>("");
  const [contentLength, setContentLength] = useState(0);
  const [isEditorEmpty, setIsEditorEmpty] = useState(true);
  const [images, setImages] = useState<SelectedImage[]>([]);
  const [poll, setPoll] = useState<PollData | null>(null);
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [editorReady, setEditorReady] = useState(false);
  const [hasSelection, setHasSelection] = useState(false);
  const [isInsideSpoiler, setIsInsideSpoiler] = useState(false);
  const [mentionUsers, setMentionUsers] = useState<MentionUser[]>([]);
  const [showMentionDropdown, setShowMentionDropdown] = useState(false);
  const [isMentionLoading, setIsMentionLoading] = useState(false);
  const [pollOptions, setPollOptions] = useState<string[]>(["", ""]);
  const [pollDeadline, setPollDeadline] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d;
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fullscreenWebViewRef = useRef<WebView>(null);
  const [fullscreenEditorReady, setFullscreenEditorReady] = useState(false);

  // Generate HTML with colors inlined
  const htmlContent = useMemo(() => getLexicalEditorHtml(colors), [colors]);

  // Keep ref in sync with state for use in callbacks
  useEffect(() => {
    editorStateRef.current = editorState;
  }, [editorState]);

  // Send placeholder to WebView when ready
  useEffect(() => {
    if (editorReady && webViewRef.current) {
      postToWebView("setPlaceholder", {
        placeholder: isAuthenticated ? placeholder : "Sign in to post...",
      });
    }
  }, [editorReady, placeholder, isAuthenticated]);

  // Post message to WebView
  const postToWebView = useCallback(
    (type: string, data: Record<string, unknown> = {}) => {
      if (webViewRef.current) {
        webViewRef.current.postMessage(JSON.stringify({ type, ...data }));
      }
    },
    [],
  );

  // Post message to fullscreen WebView
  const postToFullscreenWebView = useCallback(
    (type: string, data: Record<string, unknown> = {}) => {
      if (fullscreenWebViewRef.current) {
        fullscreenWebViewRef.current.postMessage(
          JSON.stringify({ type, ...data }),
        );
      }
    },
    [],
  );

  // Handle messages from WebView
  const handleWebViewMessage = useCallback(
    async (event: WebViewMessageEvent) => {
      try {
        const data = JSON.parse(event.nativeEvent.data);

        switch (data.type) {
          case "ready":
            setEditorReady(true);
            break;

          case "change":
            setEditorState(data.state || "");
            setIsEditorEmpty(data.isEmpty ?? true);
            setContentLength(data.length ?? 0);
            break;

          case "focus":
            if (!isAuthenticated) {
              onAuthRequired?.();
              postToWebView("blur");
              return;
            }
            setIsExpanded(true);
            break;

          case "blur":
            // Keep expanded if there's content
            break;

          case "mentionSearch":
            if (data.query) {
              setShowMentionDropdown(true);
              setIsMentionLoading(true);
              try {
                const result = await fetchQuery<reflectionComposerMentionQuery>(
                  environment,
                  MentionSearchQuery,
                  { filter: { username: data.query } },
                ).toPromise();

                type Edge = NonNullable<
                  NonNullable<
                    reflectionComposerMentionQuery$data["users"]
                  >["edges"]
                >[number];
                const users =
                  result?.users?.edges
                    ?.filter(
                      (edge): edge is NonNullable<Edge> => edge?.node != null,
                    )
                    .map((edge) => ({
                      id: edge.node!.id,
                      username: edge.node!.username ?? "",
                      name: edge.node!.name ?? null,
                      imageUrl: edge.node!.image?.url ?? null,
                    })) ?? [];

                setMentionUsers(users);
                setIsMentionLoading(false);
                postToWebView("mentionResults", { users });
              } catch (error) {
                console.error("Mention search failed:", error);
                setMentionUsers([]);
                setIsMentionLoading(false);
                postToWebView("mentionResults", { users: [] });
              }
            } else {
              setShowMentionDropdown(false);
              setMentionUsers([]);
            }
            break;

          case "mentionHide":
            setShowMentionDropdown(false);
            setMentionUsers([]);
            break;

          case "selectionChange":
            setHasSelection(data.hasSelection ?? false);
            setIsInsideSpoiler(data.isInsideSpoiler ?? false);
            break;

          case "stateResult":
            // Handle state result if needed
            break;
        }
      } catch (error) {
        console.error("WebView message error:", error);
      }
    },
    [environment, isAuthenticated, onAuthRequired, postToWebView],
  );

  // Handle messages from fullscreen WebView
  const handleFullscreenWebViewMessage = useCallback(
    async (event: WebViewMessageEvent) => {
      try {
        const data = JSON.parse(event.nativeEvent.data);

        switch (data.type) {
          case "ready":
            setFullscreenEditorReady(true);
            // Sync current state to fullscreen editor (use ref for latest value)
            if (editorStateRef.current) {
              postToFullscreenWebView("setState", {
                state: editorStateRef.current,
              });
            }
            postToFullscreenWebView("setPlaceholder", {
              placeholder: isAuthenticated ? placeholder : "Sign in to post...",
            });
            postToFullscreenWebView("focus");
            break;

          case "change":
            setEditorState(data.state || "");
            setIsEditorEmpty(data.isEmpty ?? true);
            setContentLength(data.length ?? 0);
            // Sync to main editor
            postToWebView("setState", { state: data.state || "" });
            break;

          case "focus":
            // Already in fullscreen
            break;

          case "blur":
            break;

          case "mentionSearch":
            if (data.query) {
              setShowMentionDropdown(true);
              setIsMentionLoading(true);
              try {
                const result = await fetchQuery<reflectionComposerMentionQuery>(
                  environment,
                  MentionSearchQuery,
                  { filter: { username: data.query } },
                ).toPromise();

                type Edge = NonNullable<
                  NonNullable<
                    reflectionComposerMentionQuery$data["users"]
                  >["edges"]
                >[number];
                const users =
                  result?.users?.edges
                    ?.filter(
                      (edge): edge is NonNullable<Edge> => edge?.node != null,
                    )
                    .map((edge) => ({
                      id: edge.node!.id,
                      username: edge.node!.username ?? "",
                      name: edge.node!.name ?? null,
                      imageUrl: edge.node!.image?.url ?? null,
                    })) ?? [];

                setMentionUsers(users);
                setIsMentionLoading(false);
                postToFullscreenWebView("mentionResults", { users });
              } catch (error) {
                console.error("Mention search failed:", error);
                setMentionUsers([]);
                setIsMentionLoading(false);
                postToFullscreenWebView("mentionResults", { users: [] });
              }
            } else {
              setShowMentionDropdown(false);
              setMentionUsers([]);
            }
            break;

          case "mentionHide":
            setShowMentionDropdown(false);
            setMentionUsers([]);
            break;

          case "selectionChange":
            setHasSelection(data.hasSelection ?? false);
            setIsInsideSpoiler(data.isInsideSpoiler ?? false);
            break;
        }
      } catch (error) {
        console.error("Fullscreen WebView message error:", error);
      }
    },
    [
      environment,
      isAuthenticated,
      placeholder,
      postToWebView,
      postToFullscreenWebView,
    ],
  );

  // Open fullscreen editor
  const openFullscreen = useCallback(() => {
    if (!isAuthenticated) {
      onAuthRequired?.();
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsFullscreen(true);
  }, [isAuthenticated, onAuthRequired]);

  // Close fullscreen editor
  const closeFullscreen = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Sync final state to compact editor before closing (use ref for latest value)
    if (editorStateRef.current) {
      postToWebView("setState", { state: editorStateRef.current });
    }
    setIsFullscreen(false);
    setFullscreenEditorReady(false);
    setShowMentionDropdown(false);
  }, [postToWebView]);

  // Select mention in fullscreen
  const selectMentionFullscreen = useCallback(
    (user: MentionUser) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      postToFullscreenWebView("selectMention", {
        userId: user.id,
        username: user.username,
      });
      setShowMentionDropdown(false);
      setMentionUsers([]);
    },
    [postToFullscreenWebView],
  );

  useImperativeHandle(ref, () => ({
    focus: () => {
      if (!isAuthenticated) {
        onAuthRequired?.();
        return;
      }
      postToWebView("focus");
      setIsExpanded(true);
    },
    clear: () => {
      postToWebView("clear");
      setEditorState("");
      setContentLength(0);
      setIsEditorEmpty(true);
      setImages([]);
      setPoll(null);
      setShowPollCreator(false);
      setIsExpanded(false);
      setIsFullscreen(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    },
  }));

  const handleSubmit = useCallback(() => {
    if (isEditorEmpty && images.length === 0 && !poll) return;
    if (contentLength > MAX_LENGTH) return;
    if (isSubmitting) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Keyboard.dismiss();

    onSubmit({
      content: editorState,
      images,
      poll,
    });
  }, [
    isEditorEmpty,
    images,
    poll,
    contentLength,
    isSubmitting,
    onSubmit,
    editorState,
  ]);

  // Submit from fullscreen (with auth check)
  const handleFullscreenSubmit = useCallback(() => {
    if (!isAuthenticated) {
      closeFullscreen();
      onAuthRequired?.();
      return;
    }
    handleSubmit();
    // Note: closeFullscreen will be called by clear() via onCompleted
  }, [isAuthenticated, handleSubmit, closeFullscreen, onAuthRequired]);

  const handleImagesChange = useCallback((newImages: SelectedImage[]) => {
    setImages(newImages);
  }, []);

  const togglePollCreator = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (showPollCreator) {
      setShowPollCreator(false);
      setPollOptions(["", ""]);
      setPoll(null);
      const d = new Date();
      d.setDate(d.getDate() + 1);
      setPollDeadline(d);
    } else {
      setShowPollCreator(true);
    }
  }, [showPollCreator]);

  const addPollOption = useCallback(() => {
    if (pollOptions.length < 5) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setPollOptions([...pollOptions, ""]);
    }
  }, [pollOptions]);

  const removePollOption = useCallback(
    (index: number) => {
      if (pollOptions.length > 2) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setPollOptions(pollOptions.filter((_, i) => i !== index));
      }
    },
    [pollOptions],
  );

  const updatePollOption = useCallback(
    (index: number, value: string) => {
      const newOptions = [...pollOptions];
      newOptions[index] = value;
      setPollOptions(newOptions);

      // Auto-update poll data
      const validOptions = newOptions.filter((o) => o.trim());
      if (validOptions.length >= 2) {
        setPoll({ options: validOptions, deadline: pollDeadline });
      } else {
        setPoll(null);
      }
    },
    [pollOptions, pollDeadline],
  );

  const handleDeadlineChange = useCallback(
    (_event: unknown, selectedDate?: Date) => {
      if (Platform.OS === "android") {
        setShowDatePicker(false);
      }
      if (selectedDate) {
        setPollDeadline(selectedDate);
        // Update poll if already valid
        const validOptions = pollOptions.filter((o) => o.trim());
        if (validOptions.length >= 2) {
          setPoll({ options: validOptions, deadline: selectedDate });
        }
      }
    },
    [pollOptions],
  );

  const confirmDeadline = useCallback(() => {
    setShowDatePicker(false);
    // Update poll if already valid
    const validOptions = pollOptions.filter((o) => o.trim());
    if (validOptions.length >= 2) {
      setPoll({ options: validOptions, deadline: pollDeadline });
    }
  }, [pollOptions, pollDeadline]);

  const formatDeadline = useCallback((date: Date) => {
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays >= 1) return `${diffDays}d`;
    if (diffHours >= 1) return `${diffHours}h`;
    return "Soon";
  }, []);

  const selectMention = useCallback(
    (user: MentionUser) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      postToWebView("selectMention", {
        userId: user.id,
        username: user.username,
      });
      setShowMentionDropdown(false);
      setMentionUsers([]);
    },
    [postToWebView],
  );

  const insertMention = useCallback(() => {
    if (!isAuthenticated) {
      onAuthRequired?.();
      return;
    }
    postToWebView("insertAtSymbol");
  }, [isAuthenticated, onAuthRequired, postToWebView]);

  const toggleSpoiler = useCallback(() => {
    if (!hasSelection) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    postToWebView("toggleSpoiler");
  }, [hasSelection, postToWebView]);

  const canSubmit =
    (!isEditorEmpty || images.length > 0 || poll) &&
    !isSubmitting &&
    contentLength <= MAX_LENGTH;

  const progress = contentLength / MAX_LENGTH;
  const showProgress = progress >= SHOW_LIMIT_AT;

  // KeyboardStickyView offset - when keyboard is closed, add safe area padding
  const keyboardOffset = useMemo(
    () => ({
      closed: insets.bottom,
      opened: 0,
    }),
    [insets.bottom],
  );

  // Dismiss keyboard
  const handleDismissKeyboard = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    postToWebView("blur");
    Keyboard.dismiss();
  }, [postToWebView]);

  return (
    <KeyboardStickyView offset={keyboardOffset} style={styles.stickyContainer}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
          },
        ]}
      >
        {/* Native Mention Dropdown */}
        {showMentionDropdown && (
          <Animated.View
            entering={FadeInDown.duration(150)}
            exiting={FadeOutDown.duration(100)}
            style={[
              styles.mentionDropdown,
              { backgroundColor: colors.surfaceElevated },
            ]}
          >
            {isMentionLoading ? (
              <View style={styles.mentionLoading}>
                <ActivityIndicator size="small" color={colors.accent} />
              </View>
            ) : mentionUsers.length === 0 ? (
              <View style={styles.mentionEmpty}>
                <Text
                  style={[styles.mentionEmptyText, { color: colors.textMuted }]}
                >
                  No users found
                </Text>
              </View>
            ) : (
              <ScrollView
                style={styles.mentionList}
                keyboardShouldPersistTaps="always"
                showsVerticalScrollIndicator={false}
              >
                {mentionUsers.map((user, index) => (
                  <Pressable
                    key={user.id}
                    onPress={() => selectMention(user)}
                    style={[
                      {
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 12,
                        paddingVertical: 12,
                        paddingHorizontal: 14,
                      },
                      index < mentionUsers.length - 1 && {
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        borderBottomColor: colors.border,
                      },
                    ]}
                  >
                    {user.imageUrl ? (
                      <Image
                        source={{ uri: user.imageUrl }}
                        style={{ width: 40, height: 40, borderRadius: 20 }}
                        contentFit="cover"
                      />
                    ) : (
                      <View
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          backgroundColor: colors.accent + "20",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: "700",
                            color: colors.accent,
                          }}
                        >
                          {(user.name || user.username || "?")[0].toUpperCase()}
                        </Text>
                      </View>
                    )}
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: "600",
                          color: colors.text,
                        }}
                        numberOfLines={1}
                      >
                        {user.name || user.username}
                      </Text>
                      <Text
                        style={{
                          fontSize: 13,
                          color: colors.textMuted,
                          marginTop: 2,
                        }}
                        numberOfLines={1}
                      >
                        @{user.username}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </ScrollView>
            )}
          </Animated.View>
        )}

        {/* Inline Poll Creator - iMessage style */}
        {showPollCreator && (
          <Animated.View
            entering={FadeInDown.duration(200)}
            exiting={FadeOutDown.duration(200)}
            layout={LinearTransition.springify().damping(20)}
            style={[
              styles.inlinePoll,
              { backgroundColor: colors.surfaceElevated },
            ]}
          >
            {pollOptions.map((option, index) => (
              <View
                key={index}
                style={[
                  styles.pollOptionRow,
                  index < pollOptions.length - 1 && {
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: colors.border,
                  },
                ]}
              >
                <TextInput
                  value={option}
                  onChangeText={(text) => updatePollOption(index, text)}
                  placeholder={`Choice ${index + 1}`}
                  placeholderTextColor={colors.textMuted}
                  style={[styles.pollOptionInput, { color: colors.text }]}
                  maxLength={100}
                />
                {pollOptions.length > 2 && (
                  <Pressable
                    onPress={() => removePollOption(index)}
                    hitSlop={8}
                    style={styles.pollRemoveBtn}
                  >
                    <X size={16} color={colors.textMuted} />
                  </Pressable>
                )}
              </View>
            ))}
            {pollOptions.length < 5 && (
              <Pressable
                onPress={addPollOption}
                style={[
                  styles.pollOptionRow,
                  {
                    borderTopWidth: StyleSheet.hairlineWidth,
                    borderTopColor: colors.border,
                  },
                ]}
              >
                <Text style={[styles.pollAddText, { color: colors.textMuted }]}>
                  Add choice...
                </Text>
              </Pressable>
            )}
            <Pressable
              onPress={() => setShowDatePicker(true)}
              style={[
                styles.pollDeadlineRow,
                {
                  borderTopWidth: StyleSheet.hairlineWidth,
                  borderTopColor: colors.border,
                },
              ]}
            >
              <Clock size={14} color={colors.textMuted} />
              <Text
                style={[styles.pollDeadlineText, { color: colors.textMuted }]}
              >
                Ends in {formatDeadline(pollDeadline)}
              </Text>
            </Pressable>
          </Animated.View>
        )}

        {/* Deadline Picker Modal */}
        <Modal
          visible={showDatePicker}
          transparent
          animationType="fade"
          onRequestClose={() => setShowDatePicker(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setShowDatePicker(false)}
          >
            <Pressable
              style={[styles.modalContent, { backgroundColor: colors.surface }]}
              onPress={(e) => e.stopPropagation()}
            >
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Poll ends
              </Text>
              <DateTimePicker
                value={pollDeadline}
                mode="datetime"
                display="spinner"
                onChange={handleDeadlineChange}
                minimumDate={new Date(Date.now() + 10 * 60 * 1000)}
                maximumDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
                style={styles.datePicker}
              />
              <Pressable
                onPress={confirmDeadline}
                style={[styles.modalButton, { backgroundColor: colors.accent }]}
              >
                <Text style={styles.modalButtonText}>Done</Text>
              </Pressable>
            </Pressable>
          </Pressable>
        </Modal>

        {/* Image Grid */}
        {images.length > 0 && (
          <ImagePickerGrid
            images={images}
            onImagesChange={handleImagesChange}
            colors={colors}
          />
        )}

        {/* WebView Editor + Submit Button */}
        <View style={styles.inputContainer}>
          <View
            style={[
              styles.webViewWrapper,
              isSubmitting && styles.webViewDisabled,
            ]}
          >
            <WebView
              ref={webViewRef}
              source={{ html: htmlContent }}
              style={[styles.webView, isSubmitting && { opacity: 0.5 }]}
              originWhitelist={["*"]}
              onMessage={handleWebViewMessage}
              scrollEnabled={true}
              bounces={false}
              keyboardDisplayRequiresUserAction={false}
              hideKeyboardAccessoryView={true}
              automaticallyAdjustContentInsets={false}
              contentInsetAdjustmentBehavior="never"
              allowsInlineMediaPlayback={true}
              mediaPlaybackRequiresUserAction={false}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              startInLoadingState={false}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              overScrollMode="never"
              textInteractionEnabled={!isSubmitting}
            />
          </View>

          {/* Submit Button with Progress Ring */}
          <View style={styles.submitWrapper}>
            {showProgress && (
              <View style={styles.progressRing}>
                <CircularProgress
                  progress={progress}
                  size={40}
                  strokeWidth={2.5}
                  color={colors.text}
                  trackColor={colors.border}
                />
              </View>
            )}
            <AnimatedPressable
              onPress={handleSubmit}
              disabled={!canSubmit}
              style={[
                styles.submitButton,
                {
                  backgroundColor: canSubmit ? colors.text : colors.border,
                },
              ]}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color={colors.bg} />
              ) : (
                <ArrowUp
                  size={20}
                  color={canSubmit ? colors.bg : colors.textMuted}
                  strokeWidth={2.5}
                />
              )}
            </AnimatedPressable>
          </View>
        </View>

        {/* Toolbar with action buttons */}
        <View style={styles.toolbar}>
          <View style={styles.toolbarActions}>
            <ImagePickerButton
              onImagesSelected={(newImages) =>
                setImages([...images, ...newImages].slice(0, 4))
              }
              currentCount={images.length}
              colors={colors}
            />

            <Pressable
              onPress={insertMention}
              style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
            >
              <AtSign size={20} color={colors.textSecondary} />
            </Pressable>

            <Pressable
              onPress={toggleSpoiler}
              disabled={!hasSelection}
              style={({ pressed }) => ({
                opacity: hasSelection ? (pressed ? 0.5 : 1) : 0.3,
              })}
            >
              <EyeOff
                size={20}
                color={isInsideSpoiler ? colors.text : colors.textSecondary}
              />
            </Pressable>

            <Pressable
              onPress={togglePollCreator}
              style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
            >
              <BarChart2
                size={20}
                color={
                  poll || showPollCreator ? colors.text : colors.textSecondary
                }
              />
            </Pressable>

            <Pressable
              onPress={openFullscreen}
              style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
            >
              <Maximize2 size={18} color={colors.textSecondary} />
            </Pressable>
          </View>

          <Pressable
            onPress={handleDismissKeyboard}
            style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
          >
            <Text style={[styles.doneButton, { color: colors.text }]}>
              Done
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Fullscreen Editor Modal */}
      <Modal
        visible={isFullscreen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeFullscreen}
      >
        <View
          style={[styles.fullscreenContainer, { backgroundColor: colors.bg }]}
        >
          {/* Header */}
          <View
            style={[
              styles.fullscreenHeader,
              { borderBottomColor: colors.border },
            ]}
          >
            <Pressable
              onPress={closeFullscreen}
              style={({ pressed }) => [
                styles.fullscreenHeaderButton,
                { opacity: pressed ? 0.5 : 1 },
              ]}
            >
              <ChevronDown size={24} color={colors.text} />
            </Pressable>

            <Text style={[styles.fullscreenTitle, { color: colors.text }]}>
              Compose
            </Text>

            <Pressable
              onPress={handleFullscreenSubmit}
              disabled={!canSubmit || !isAuthenticated}
              style={({ pressed }) => [
                styles.fullscreenPostButton,
                {
                  backgroundColor:
                    canSubmit && isAuthenticated ? colors.text : colors.border,
                  opacity: pressed && canSubmit ? 0.8 : 1,
                },
              ]}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color={colors.bg} />
              ) : (
                <Text style={[styles.fullscreenPostText, { color: colors.bg }]}>
                  Post
                </Text>
              )}
            </Pressable>
          </View>

          {/* Mention Dropdown in Fullscreen */}
          {showMentionDropdown && (
            <Animated.View
              entering={FadeInDown.duration(150)}
              exiting={FadeOutDown.duration(100)}
              style={[
                styles.fullscreenMentionDropdown,
                { backgroundColor: colors.surfaceElevated },
              ]}
            >
              {isMentionLoading ? (
                <View style={styles.mentionLoading}>
                  <ActivityIndicator size="small" color={colors.accent} />
                </View>
              ) : mentionUsers.length === 0 ? (
                <View style={styles.mentionEmpty}>
                  <Text
                    style={[
                      styles.mentionEmptyText,
                      { color: colors.textMuted },
                    ]}
                  >
                    No users found
                  </Text>
                </View>
              ) : (
                <ScrollView
                  style={styles.mentionList}
                  keyboardShouldPersistTaps="always"
                  showsVerticalScrollIndicator={false}
                >
                  {mentionUsers.map((user, index) => (
                    <Pressable
                      key={user.id}
                      onPress={() => selectMentionFullscreen(user)}
                      style={[
                        styles.mentionItem,
                        index < mentionUsers.length - 1 && {
                          borderBottomWidth: StyleSheet.hairlineWidth,
                          borderBottomColor: colors.border,
                        },
                      ]}
                    >
                      {user.imageUrl ? (
                        <Image
                          source={{ uri: user.imageUrl }}
                          style={styles.mentionAvatar}
                          contentFit="cover"
                        />
                      ) : (
                        <View
                          style={[
                            styles.mentionAvatarPlaceholder,
                            { backgroundColor: colors.accent + "20" },
                          ]}
                        >
                          <Text
                            style={{
                              fontSize: 16,
                              fontWeight: "700",
                              color: colors.accent,
                            }}
                          >
                            {(user.name ||
                              user.username ||
                              "?")[0].toUpperCase()}
                          </Text>
                        </View>
                      )}
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            fontSize: 15,
                            fontWeight: "600",
                            color: colors.text,
                          }}
                          numberOfLines={1}
                        >
                          {user.name || user.username}
                        </Text>
                        <Text
                          style={{
                            fontSize: 13,
                            color: colors.textMuted,
                            marginTop: 2,
                          }}
                          numberOfLines={1}
                        >
                          @{user.username}
                        </Text>
                      </View>
                    </Pressable>
                  ))}
                </ScrollView>
              )}
            </Animated.View>
          )}

          {/* Fullscreen Editor */}
          <View style={styles.fullscreenEditor}>
            <WebView
              ref={fullscreenWebViewRef}
              source={{ html: htmlContent }}
              style={styles.fullscreenWebView}
              originWhitelist={["*"]}
              onMessage={handleFullscreenWebViewMessage}
              scrollEnabled={true}
              bounces={true}
              keyboardDisplayRequiresUserAction={false}
              hideKeyboardAccessoryView={true}
              automaticallyAdjustContentInsets={false}
              contentInsetAdjustmentBehavior="never"
              allowsInlineMediaPlayback={true}
              mediaPlaybackRequiresUserAction={false}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              startInLoadingState={false}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              overScrollMode="never"
              textInteractionEnabled={true}
            />
          </View>

          {/* Character Count */}
          {showProgress && (
            <View
              style={[
                styles.fullscreenProgress,
                { borderTopColor: colors.border },
              ]}
            >
              <CircularProgress
                progress={progress}
                size={32}
                strokeWidth={2}
                color={colors.text}
                trackColor={colors.border}
              />
              <Text
                style={[
                  styles.fullscreenCharCount,
                  { color: progress > 1 ? "#ef4444" : colors.textMuted },
                ]}
              >
                {contentLength} / {MAX_LENGTH}
              </Text>
            </View>
          )}

          {/* Bottom Safe Area */}
          <View style={{ height: insets.bottom }} />
        </View>
      </Modal>
    </KeyboardStickyView>
  );
});

const styles = StyleSheet.create({
  stickyContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  container: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 12,
  },
  webViewWrapper: {
    flex: 1,
    minHeight: 36,
    maxHeight: 120,
  },
  webView: {
    flex: 1,
    backgroundColor: "transparent",
  },
  webViewDisabled: {
    pointerEvents: "none",
  },
  submitWrapper: {
    position: "relative",
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  progressRing: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 8,
  },
  toolbarActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  doneButton: {
    fontSize: 15,
    fontWeight: "600",
  },
  pollPreview: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 8,
  },
  pollPreviewContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  pollPreviewText: {
    fontSize: 13,
    fontWeight: "500",
  },
  mentionDropdown: {
    borderRadius: 16,
    marginBottom: 10,
    maxHeight: 200,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  mentionLoading: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
  },
  mentionEmpty: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  mentionEmptyText: {
    fontSize: 14,
  },
  mentionList: {
    maxHeight: 200,
  },
  inlinePoll: {
    borderRadius: 12,
    marginBottom: 8,
    overflow: "hidden",
  },
  pollOptionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    minHeight: 44,
  },
  pollOptionInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 12,
    backgroundColor: "transparent",
  },
  pollRemoveBtn: {
    padding: 4,
  },
  pollAddText: {
    fontSize: 15,
    paddingVertical: 12,
  },
  pollDeadlineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  pollDeadlineText: {
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 8,
  },
  datePicker: {
    width: "100%",
    height: 200,
  },
  modalButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  // Fullscreen styles
  fullscreenContainer: {
    flex: 1,
  },
  fullscreenHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  fullscreenHeaderButton: {
    padding: 4,
  },
  fullscreenTitle: {
    fontSize: 17,
    fontWeight: "600",
  },
  fullscreenPostButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 70,
    alignItems: "center",
  },
  fullscreenPostText: {
    fontSize: 15,
    fontWeight: "600",
  },
  fullscreenEditor: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  fullscreenWebView: {
    flex: 1,
    backgroundColor: "transparent",
  },
  fullscreenMentionDropdown: {
    position: "absolute",
    top: 60,
    left: 16,
    right: 16,
    borderRadius: 16,
    maxHeight: 200,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 100,
  },
  fullscreenProgress: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  fullscreenCharCount: {
    fontSize: 13,
    fontWeight: "500",
  },
  mentionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  mentionAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  mentionAvatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
