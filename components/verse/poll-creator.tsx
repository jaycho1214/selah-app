import { memo, useState, useCallback, useMemo } from "react";
import { View, TextInput, Pressable, StyleSheet, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Animated, { FadeIn, FadeOut, Layout } from "react-native-reanimated";
import { X, Plus, Minus, Calendar } from "lucide-react-native";
import * as Haptics from "expo-haptics";

import { Text } from "@/components/ui/text";

const MAX_OPTIONS = 5;
const MIN_OPTIONS = 2;
const MAX_OPTION_LENGTH = 100;

interface PollCreatorProps {
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
  onPollChange: (poll: { options: string[]; deadline: Date } | null) => void;
  onClose: () => void;
}

export const PollCreator = memo(function PollCreator({
  colors,
  onPollChange,
  onClose,
}: PollCreatorProps) {
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [deadline, setDeadline] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 7); // Default: 7 days from now
    return date;
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const minDeadline = useMemo(() => new Date(Date.now() + 10 * 60 * 1000), []); // 10 minutes
  const maxDeadline = useMemo(
    () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    [],
  ); // 30 days

  const addOption = useCallback(() => {
    if (options.length < MAX_OPTIONS) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setOptions([...options, ""]);
    }
  }, [options]);

  const removeOption = useCallback(
    (index: number) => {
      if (options.length > MIN_OPTIONS) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        const newOptions = options.filter((_, i) => i !== index);
        setOptions(newOptions);
      }
    },
    [options],
  );

  const updateOption = useCallback(
    (index: number, value: string) => {
      const newOptions = [...options];
      newOptions[index] = value.slice(0, MAX_OPTION_LENGTH);
      setOptions(newOptions);
    },
    [options],
  );

  const handleDateChange = useCallback(
    (_event: unknown, selectedDate?: Date) => {
      setShowDatePicker(Platform.OS === "ios");
      if (
        selectedDate &&
        selectedDate >= minDeadline &&
        selectedDate <= maxDeadline
      ) {
        setDeadline(selectedDate);
      }
    },
    [minDeadline, maxDeadline],
  );

  // Update parent whenever options or deadline change
  const validOptions = options.filter((o) => o.trim().length > 0);
  const isValid = validOptions.length >= MIN_OPTIONS;

  // Notify parent of changes
  const handleConfirm = useCallback(() => {
    if (isValid) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onPollChange({ options: validOptions, deadline });
    }
  }, [isValid, validOptions, deadline, onPollChange]);

  const formatDeadline = (date: Date): string => {
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffDays >= 1) {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} remaining`;
    }
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} remaining`;
  };

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(150)}
      style={[
        styles.container,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Create Poll</Text>
        <Pressable onPress={onClose} hitSlop={8}>
          <X size={20} color={colors.textMuted} />
        </Pressable>
      </View>

      {/* Options */}
      <View style={styles.optionsContainer}>
        {options.map((option, index) => (
          <Animated.View
            key={index}
            layout={Layout.springify()}
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(150)}
            style={styles.optionRow}
          >
            <View
              style={[
                styles.optionInputContainer,
                {
                  backgroundColor: colors.surfaceElevated,
                  borderColor: colors.border,
                },
              ]}
            >
              <TextInput
                value={option}
                onChangeText={(text) => updateOption(index, text)}
                placeholder={`Option ${index + 1}`}
                placeholderTextColor={colors.textMuted}
                style={[styles.optionInput, { color: colors.text }]}
                maxLength={MAX_OPTION_LENGTH}
              />
              <Text style={[styles.charCount, { color: colors.textMuted }]}>
                {option.length}/{MAX_OPTION_LENGTH}
              </Text>
            </View>

            {options.length > MIN_OPTIONS && (
              <Pressable
                onPress={() => removeOption(index)}
                style={[
                  styles.removeButton,
                  { backgroundColor: colors.surfaceElevated },
                ]}
              >
                <Minus size={16} color={colors.textMuted} />
              </Pressable>
            )}
          </Animated.View>
        ))}
      </View>

      {/* Add Option Button */}
      {options.length < MAX_OPTIONS && (
        <Pressable
          onPress={addOption}
          style={[styles.addButton, { borderColor: colors.border }]}
        >
          <Plus size={16} color={colors.accent} />
          <Text style={[styles.addButtonText, { color: colors.accent }]}>
            Add option
          </Text>
        </Pressable>
      )}

      {/* Deadline */}
      <Pressable
        onPress={() => setShowDatePicker(true)}
        style={[
          styles.deadlineButton,
          {
            backgroundColor: colors.surfaceElevated,
            borderColor: colors.border,
          },
        ]}
      >
        <Calendar size={16} color={colors.textMuted} />
        <View style={styles.deadlineTextContainer}>
          <Text style={[styles.deadlineLabel, { color: colors.textMuted }]}>
            Ends in
          </Text>
          <Text style={[styles.deadlineValue, { color: colors.text }]}>
            {formatDeadline(deadline)}
          </Text>
        </View>
      </Pressable>

      {showDatePicker && (
        <DateTimePicker
          value={deadline}
          mode="datetime"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
          minimumDate={minDeadline}
          maximumDate={maxDeadline}
        />
      )}

      {/* Confirm Button */}
      <Pressable
        onPress={handleConfirm}
        disabled={!isValid}
        style={[
          styles.confirmButton,
          {
            backgroundColor: isValid ? colors.accent : colors.surfaceElevated,
            opacity: isValid ? 1 : 0.5,
          },
        ]}
      >
        <Text
          style={[
            styles.confirmButtonText,
            { color: isValid ? "#fff" : colors.textMuted },
          ]}
        >
          Add Poll to Reflection
        </Text>
      </Pressable>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
  },
  optionsContainer: {
    gap: 8,
    marginBottom: 12,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  optionInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 44,
  },
  optionInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 0,
  },
  charCount: {
    fontSize: 10,
    marginLeft: 8,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: "dashed",
    marginBottom: 16,
  },
  addButtonText: {
    fontSize: 13,
    fontWeight: "500",
  },
  deadlineButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 16,
  },
  deadlineTextContainer: {
    flex: 1,
  },
  deadlineLabel: {
    fontSize: 11,
    marginBottom: 2,
  },
  deadlineValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  confirmButton: {
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
