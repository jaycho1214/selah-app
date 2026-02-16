import {
  View,
  Pressable,
  StyleSheet,
  Modal,
  ActivityIndicator,
} from "react-native";
import { WebView } from "react-native-webview";
import { ChevronDown } from "lucide-react-native";

import { Text } from "@/components/ui/text";
import { ComposerMentionDropdown } from "./composer-mention-dropdown";
import { ComposerVerseReferenceDropdown } from "./composer-verse-reference-dropdown";
import { CircularProgress } from "./composer-shared";
import type { ComposerState } from "./use-composer-state";
import { MAX_LENGTH } from "./use-composer-state";

interface ComposerFullscreenModalProps {
  state: ComposerState;
}

export function ComposerFullscreenModal({
  state,
}: ComposerFullscreenModalProps) {
  const {
    isFullscreen,
    closeFullscreen,
    colors,
    isAuthenticated,
    isSubmitting,
    canSubmit,
    handleFullscreenSubmit,
    showMentionDropdown,
    mentionUsers,
    isMentionLoading,
    selectMentionFullscreen,
    showVerseRefDropdown,
    verseRefResults,
    isVerseRefLoading,
    selectVerseReferenceFullscreen,
    fullscreenWebViewRef,
    htmlContent,
    handleFullscreenWebViewMessage,
    showProgress,
    progress,
    contentLength,
    insets,
  } = state;

  return (
    <Modal
      visible={isFullscreen}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={closeFullscreen}
    >
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Pressable onPress={closeFullscreen} style={styles.headerButton}>
            <ChevronDown size={24} color={colors.text} />
          </Pressable>
          <Text style={[styles.title, { color: colors.text }]}>Compose</Text>
          <Pressable
            onPress={handleFullscreenSubmit}
            disabled={!canSubmit || !isAuthenticated}
            style={[
              styles.postButton,
              {
                backgroundColor:
                  canSubmit && isAuthenticated ? colors.text : colors.border,
              },
            ]}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color={colors.bg} />
            ) : (
              <Text style={[styles.postText, { color: colors.bg }]}>Post</Text>
            )}
          </Pressable>
        </View>

        {/* Mention Dropdown */}
        {showMentionDropdown && (
          <ComposerMentionDropdown
            users={mentionUsers}
            isLoading={isMentionLoading}
            onSelect={selectMentionFullscreen}
            colors={colors}
            style={styles.mentionDropdown}
          />
        )}

        {/* Verse Reference Dropdown */}
        {showVerseRefDropdown && (
          <ComposerVerseReferenceDropdown
            verses={verseRefResults}
            isLoading={isVerseRefLoading}
            onSelect={selectVerseReferenceFullscreen}
            colors={colors}
            style={styles.mentionDropdown}
          />
        )}

        {/* Editor */}
        <View style={styles.editor}>
          <WebView
            ref={fullscreenWebViewRef}
            source={{ html: htmlContent }}
            style={styles.webView}
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
          <View style={[styles.progress, { borderTopColor: colors.border }]}>
            <CircularProgress
              progress={progress}
              size={32}
              strokeWidth={2}
              color={colors.text}
              trackColor={colors.border}
            />
            <Text
              style={[
                styles.charCount,
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerButton: {
    padding: 4,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
  },
  postButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 70,
    alignItems: "center",
  },
  postText: {
    fontSize: 15,
    fontWeight: "600",
  },
  mentionDropdown: {
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
  editor: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  webView: {
    flex: 1,
    backgroundColor: "transparent",
  },
  progress: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  charCount: {
    fontSize: 13,
    fontWeight: "500",
  },
});
