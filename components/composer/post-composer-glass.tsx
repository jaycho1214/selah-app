import { forwardRef } from "react";
import {
  View,
  Pressable,
  StyleSheet,
  TextInput,
  Modal,
  ActivityIndicator,
} from "react-native";
import { WebView } from "react-native-webview";
import { GlassView } from "expo-glass-effect";
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

export const PostComposerGlass = forwardRef<PostComposerRef, PostComposerProps>(
  function PostComposerGlass(props, ref) {
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
      isExpanded,
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
      glassExpandResponder,
      insets,
    } = state;

    return (
      <KeyboardStickyView
        offset={keyboardOffset}
        style={styles.stickyContainer}
      >
        {/* Mention Dropdown — outside GlassView to avoid clipping */}
        {showMentionDropdown && (
          <ComposerMentionDropdown
            users={mentionUsers}
            isLoading={isMentionLoading}
            onSelect={selectMention}
            colors={colors}
            style={glassStyles.mentionDropdown}
          />
        )}

        <GlassView
          glassEffectStyle="regular"
          isInteractive
          style={[glassStyles.pill, { backgroundColor: "transparent" }]}
        >
          {/* Poll — top when expanded */}
          {isExpanded && showPollCreator && (
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
                  style={[styles.pollDeadlineText, { color: colors.textMuted }]}
                >
                  Ends in {formatDeadline(pollDeadline)}
                </Text>
              </Pressable>
            </Animated.View>
          )}

          {/* Editor — center (with inline submit when collapsed) */}
          <View
            style={[
              glassStyles.inputRow,
              !isExpanded && glassStyles.inputRowCollapsed,
            ]}
          >
            <WebView
              ref={webViewRef}
              source={{ html: htmlContent }}
              style={[
                {
                  flex: 1,
                  height: isExpanded ? 56 : 36,
                  backgroundColor: "transparent",
                },
                isSubmitting && {
                  opacity: 0.5,
                  pointerEvents: "none" as const,
                },
              ]}
              originWhitelist={["*"]}
              onMessage={handleWebViewMessage}
              scrollEnabled={false}
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

            {/* Submit button inline only when collapsed */}
            {!isExpanded && (
              <View style={styles.submitWrapper}>
                {showProgress && (
                  <View style={styles.progressRing}>
                    <CircularProgress
                      progress={progress}
                      size={36}
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
            )}
          </View>

          {/* Images — below editor when expanded */}
          {isExpanded && images.length > 0 && (
            <View style={styles.imagesContainer}>
              <ImagePickerGrid
                images={images}
                onImagesChange={handleImagesChange}
                colors={colors}
              />
            </View>
          )}

          {/* Toolbar — bottom, with send button on far right */}
          {isExpanded && (
            <View
              style={glassStyles.toolbar}
              {...glassExpandResponder.panHandlers}
            >
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
                        poll || showPollCreator
                          ? colors.text
                          : colors.textSecondary
                      }
                    />
                  </Pressable>
                </View>
                <Pressable onPress={openFullscreen}>
                  <Maximize2 size={18} color={colors.textSecondary} />
                </Pressable>
              </View>

              {/* Send button — far right, replaces Done */}
              <View style={styles.submitWrapper}>
                {showProgress && (
                  <View style={styles.progressRing}>
                    <CircularProgress
                      progress={progress}
                      size={36}
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
          )}
        </GlassView>

        {/* Bottom spacer — lifts pill above home indicator */}
        {!isExpanded && <View style={{ height: insets.bottom + 40 }} />}
        {isExpanded && <View style={{ height: 12 }} />}

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

        {/* Fullscreen Editor Modal */}
        <ComposerFullscreenModal state={state} />
      </KeyboardStickyView>
    );
  },
);

const styles = StyleSheet.create({
  stickyContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  submitWrapper: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  progressRing: {
    ...StyleSheet.absoluteFillObject,
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
  toolbarActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  toolbarIconWrap: {
    borderRadius: 8,
    padding: 4,
  },
  imagesContainer: {
    marginTop: 8,
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

const glassStyles = StyleSheet.create({
  pill: {
    marginHorizontal: 12,
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  mentionDropdown: {
    marginHorizontal: 12,
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
  },
  inputRowCollapsed: {
    alignItems: "center",
  },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    paddingTop: 6,
  },
});
