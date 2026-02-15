import { forwardRef } from "react";
import {
  View,
  Pressable,
  StyleSheet,
  ScrollView,
  TextInput,
  Modal,
  ActivityIndicator,
} from "react-native";
import { WebView } from "react-native-webview";
import { KeyboardStickyView } from "react-native-keyboard-controller";
import {
  BarChart2,
  ArrowUp,
  X,
  AtSign,
  EyeOff,
  Clock,
  Maximize2,
} from "lucide-react-native";
import Animated, {
  FadeInDown,
  FadeOutDown,
  LinearTransition,
} from "react-native-reanimated";
import DateTimePicker from "@react-native-community/datetimepicker";

import { Text } from "@/components/ui/text";
import { ImagePickerGrid, ImagePickerButton } from "../verse/image-picker-grid";
import { ComposerMentionDropdown } from "./composer-mention-dropdown";
import { ComposerFullscreenModal } from "./composer-fullscreen-modal";
import { CircularProgress, AnimatedPressable } from "./composer-shared";
import {
  useComposerState,
  type PostComposerRef,
  type PostComposerProps,
} from "./use-composer-state";

export const PostComposerLegacy = forwardRef<
  PostComposerRef,
  PostComposerProps
>(function PostComposerLegacy(props, ref) {
  const state = useComposerState(props, ref);
  const {
    colors,
    isSubmitting,
    webViewRef,
    htmlContent,
    handleWebViewMessage,
    images,
    setImages,
    poll,
    showPollCreator,
    pollOptions,
    pollDeadline,
    showDatePicker,
    setShowDatePicker,
    showMentionDropdown,
    mentionUsers,
    isMentionLoading,
    selectMention,
    handleImagesChange,
    addImages,
    updatePollOption,
    removePollOption,
    addPollOption,
    formatDeadline,
    handleDeadlineChange,
    confirmDeadline,
    togglePollCreator,
    insertMention,
    toggleSpoiler,
    hasSelection,
    isInsideSpoiler,
    openFullscreen,
    handleDismissKeyboard,
    canSubmit,
    handleSubmit,
    showProgress,
    progress,
    keyboardOffset,
  } = state;

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
        {/* Mention Dropdown */}
        {showMentionDropdown && (
          <ComposerMentionDropdown
            users={mentionUsers}
            isLoading={isMentionLoading}
            onSelect={selectMention}
            colors={colors}
          />
        )}

        {/* Scrollable attachments area (poll + images) */}
        {(showPollCreator || images.length > 0) && (
          <ScrollView
            style={styles.attachmentsScroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
            bounces={false}
          >
            {/* Inline Poll Creator */}
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
                    <Text
                      style={[styles.pollAddText, { color: colors.textMuted }]}
                    >
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
                    style={[
                      styles.pollDeadlineText,
                      { color: colors.textMuted },
                    ]}
                  >
                    Ends in {formatDeadline(pollDeadline)}
                  </Text>
                </Pressable>
              </Animated.View>
            )}

            {/* Image Grid */}
            {images.length > 0 && (
              <ImagePickerGrid
                images={images}
                onImagesChange={handleImagesChange}
                colors={colors}
              />
            )}
          </ScrollView>
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
                style={[styles.modalButton, { backgroundColor: colors.text }]}
              >
                <Text style={[styles.modalButtonText, { color: colors.bg }]}>
                  Done
                </Text>
              </Pressable>
            </Pressable>
          </Pressable>
        </Modal>

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

        {/* Toolbar */}
        <View style={styles.toolbar}>
          <View style={styles.toolbarActions}>
            <View
              style={[
                styles.toolbarIconWrap,
                images.length > 0 && {
                  backgroundColor: colors.surfaceElevated,
                },
              ]}
            >
              <ImagePickerButton
                onImagesSelected={addImages}
                currentCount={images.length}
                colors={colors}
              />
            </View>
            <Pressable onPress={insertMention}>
              <AtSign size={20} color={colors.textSecondary} />
            </Pressable>
            <Pressable
              onPress={toggleSpoiler}
              disabled={!hasSelection}
              style={{ opacity: hasSelection ? 1 : 0.3 }}
            >
              <EyeOff
                size={20}
                color={isInsideSpoiler ? colors.text : colors.textSecondary}
              />
            </Pressable>
            <View
              style={[
                styles.toolbarIconWrap,
                (poll || showPollCreator) && {
                  backgroundColor: colors.surfaceElevated,
                },
              ]}
            >
              <Pressable onPress={togglePollCreator}>
                <BarChart2
                  size={20}
                  color={
                    poll || showPollCreator ? colors.text : colors.textSecondary
                  }
                />
              </Pressable>
            </View>
            <Pressable onPress={openFullscreen}>
              <Maximize2 size={18} color={colors.textSecondary} />
            </Pressable>
          </View>
          <Pressable onPress={handleDismissKeyboard}>
            <Text style={[styles.doneButton, { color: colors.text }]}>
              Done
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Fullscreen Editor Modal */}
      <ComposerFullscreenModal state={state} />
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
  toolbarIconWrap: {
    borderRadius: 8,
    padding: 4,
  },
  attachmentsScroll: {
    maxHeight: 220,
    marginBottom: 4,
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
    paddingVertical: 14,
    alignSelf: "stretch",
    borderRadius: 12,
    alignItems: "center",
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
