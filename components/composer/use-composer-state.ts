import {
  useState,
  useCallback,
  useImperativeHandle,
  useRef,
  useEffect,
  useMemo,
  type Ref,
} from "react";
import { Platform, Keyboard, PanResponder } from "react-native";
import type { WebView, WebViewMessageEvent } from "react-native-webview";
import * as Haptics from "expo-haptics";
import { fetchQuery, useRelayEnvironment } from "react-relay";
import { graphql } from "relay-runtime";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { getLexicalEditorHtml } from "../verse/lexical-editor-html";
import type { SelectedImage } from "../verse/image-picker-grid";
import type {
  useComposerStateMentionQuery,
  useComposerStateMentionQuery$data,
} from "@/lib/relay/__generated__/useComposerStateMentionQuery.graphql";

// ─── Constants ───
export const MAX_LENGTH = 10000;
export const SHOW_LIMIT_AT = 0.8;

// ─── GraphQL ───
const MentionSearchQuery = graphql`
  query useComposerStateMentionQuery($filter: UserFilterInput!) {
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

// ─── Types ───
export interface PollData {
  options: string[];
  deadline: Date;
}

export interface MentionUser {
  id: string;
  username: string;
  name: string | null;
  imageUrl: string | null;
}

export interface PostComposerRef {
  focus: () => void;
  clear: () => void;
}

export interface PostComposerProps {
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

// ─── Hook ───
export function useComposerState(
  props: PostComposerProps,
  ref: Ref<PostComposerRef>,
) {
  const {
    colors,
    onSubmit,
    placeholder = "What's on your mind?",
    isAuthenticated,
    onAuthRequired,
    isSubmitting = false,
  } = props;

  const insets = useSafeAreaInsets();
  const environment = useRelayEnvironment();
  const webViewRef = useRef<WebView>(null);
  const fullscreenWebViewRef = useRef<WebView>(null);

  // ─── State ───
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
  const [fullscreenEditorReady, setFullscreenEditorReady] = useState(false);

  // Glass pill expand gesture refs
  const expandedRef = useRef(false);
  const openFullscreenRef = useRef<() => void>(() => {});

  // ─── Derived ───
  const htmlContent = useMemo(() => getLexicalEditorHtml(colors), [colors]);

  const hasPollWithValidOptions =
    showPollCreator && pollOptions.filter((o) => o.trim()).length >= 2;

  const canSubmit =
    (!isEditorEmpty || images.length > 0 || poll) &&
    !isSubmitting &&
    contentLength <= MAX_LENGTH &&
    // If poll creator is open, require at least 2 filled options
    (!showPollCreator || hasPollWithValidOptions);

  const progress = contentLength / MAX_LENGTH;
  const showProgress = progress >= SHOW_LIMIT_AT;

  const keyboardOffset = useMemo(
    () => ({
      closed: insets.bottom,
      opened: 0,
    }),
    [insets.bottom],
  );

  // ─── Effects ───
  useEffect(() => {
    editorStateRef.current = editorState;
  }, [editorState]);

  useEffect(() => {
    if (editorReady && webViewRef.current) {
      postToWebView("setPlaceholder", {
        placeholder: isAuthenticated ? placeholder : "Sign in to post...",
      });
    }
  }, [editorReady, placeholder, isAuthenticated]);

  // Collapse immediately when keyboard starts hiding (before WebView blur fires)
  useEffect(() => {
    const event =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
    const sub = Keyboard.addListener(event, () => {
      setIsExpanded(false);
    });
    return () => sub.remove();
  }, []);

  // ─── Callbacks ───
  const postToWebView = useCallback(
    (type: string, data: Record<string, unknown> = {}) => {
      if (webViewRef.current) {
        webViewRef.current.postMessage(JSON.stringify({ type, ...data }));
      }
    },
    [],
  );

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
            setIsExpanded(false);
            break;

          case "mentionSearch":
            if (data.query) {
              setShowMentionDropdown(true);
              setIsMentionLoading(true);
              try {
                const result = await fetchQuery<useComposerStateMentionQuery>(
                  environment,
                  MentionSearchQuery,
                  { filter: { username: data.query } },
                ).toPromise();

                type Edge = NonNullable<
                  NonNullable<
                    useComposerStateMentionQuery$data["users"]
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
            break;
        }
      } catch (error) {
        console.error("WebView message error:", error);
      }
    },
    [environment, isAuthenticated, onAuthRequired, postToWebView],
  );

  const handleFullscreenWebViewMessage = useCallback(
    async (event: WebViewMessageEvent) => {
      try {
        const data = JSON.parse(event.nativeEvent.data);

        switch (data.type) {
          case "ready":
            setFullscreenEditorReady(true);
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
            postToWebView("setState", { state: data.state || "" });
            break;

          case "focus":
            break;

          case "blur":
            break;

          case "mentionSearch":
            if (data.query) {
              setShowMentionDropdown(true);
              setIsMentionLoading(true);
              try {
                const result = await fetchQuery<useComposerStateMentionQuery>(
                  environment,
                  MentionSearchQuery,
                  { filter: { username: data.query } },
                ).toPromise();

                type Edge = NonNullable<
                  NonNullable<
                    useComposerStateMentionQuery$data["users"]
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

  const openFullscreen = useCallback(() => {
    if (!isAuthenticated) {
      onAuthRequired?.();
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsFullscreen(true);
  }, [isAuthenticated, onAuthRequired]);

  // Keep refs current for glass expand gesture
  expandedRef.current = isExpanded;
  openFullscreenRef.current = openFullscreen;

  // Pan gesture: swipe up on toolbar to expand to fullscreen (glass-specific)
  const glassExpandResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_, gs) =>
          expandedRef.current && gs.dy < -10 && Math.abs(gs.dx) < 20,
        onPanResponderRelease: (_, gs) => {
          if (gs.dy < -50) {
            openFullscreenRef.current();
          }
        },
      }),
    [],
  );

  const closeFullscreen = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (editorStateRef.current) {
      postToWebView("setState", { state: editorStateRef.current });
    }
    setIsFullscreen(false);
    setFullscreenEditorReady(false);
    setShowMentionDropdown(false);
  }, [postToWebView]);

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

  const handleFullscreenSubmit = useCallback(() => {
    if (!isAuthenticated) {
      closeFullscreen();
      onAuthRequired?.();
      return;
    }
    handleSubmit();
  }, [isAuthenticated, handleSubmit, closeFullscreen, onAuthRequired]);

  const handleImagesChange = useCallback((newImages: SelectedImage[]) => {
    setImages(newImages);
  }, []);

  const addImages = useCallback((newImages: SelectedImage[]) => {
    setImages((prev) => [...prev, ...newImages].slice(0, 4));
    setIsExpanded(true);
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

  const handleDismissKeyboard = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    postToWebView("blur");
    Keyboard.dismiss();
  }, [postToWebView]);

  // ─── Imperative Handle ───
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

  return {
    // Refs
    webViewRef,
    fullscreenWebViewRef,

    // State
    editorState,
    contentLength,
    isEditorEmpty,
    images,
    setImages,
    poll,
    showPollCreator,
    isExpanded,
    editorReady,
    hasSelection,
    isInsideSpoiler,
    mentionUsers,
    showMentionDropdown,
    isMentionLoading,
    pollOptions,
    pollDeadline,
    showDatePicker,
    setShowDatePicker,
    isFullscreen,
    fullscreenEditorReady,

    // Derived
    htmlContent,
    canSubmit,
    progress,
    showProgress,
    keyboardOffset,
    insets,

    // Callbacks
    postToWebView,
    postToFullscreenWebView,
    handleWebViewMessage,
    handleFullscreenWebViewMessage,
    handleSubmit,
    handleFullscreenSubmit,
    openFullscreen,
    closeFullscreen,
    handleDismissKeyboard,
    togglePollCreator,
    addPollOption,
    removePollOption,
    updatePollOption,
    handleDeadlineChange,
    confirmDeadline,
    formatDeadline,
    handleImagesChange,
    addImages,
    selectMention,
    selectMentionFullscreen,
    insertMention,
    toggleSpoiler,

    // Glass-specific
    glassExpandResponder,

    // Props passthrough
    colors,
    isAuthenticated,
    isSubmitting,
  };
}

export type ComposerState = ReturnType<typeof useComposerState>;
