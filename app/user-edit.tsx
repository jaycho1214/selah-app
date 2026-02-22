import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import * as ImagePicker from "expo-image-picker";
import { Stack, router } from "expo-router";
import { Camera, ImageIcon, Trash2 } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text as RNText,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLazyLoadQuery, useMutation } from "react-relay";
import { graphql } from "relay-runtime";

import { Text } from "@/components/ui/text";
import { UserAvatar } from "@/components/user/user-avatar";
import { useColors } from "@/hooks/use-colors";
import { useAnalytics } from "@/lib/analytics";
import { authClient } from "@/lib/auth-client";
import type { userEditMutation } from "@/lib/relay/__generated__/userEditMutation.graphql";
import type { userEditQuery } from "@/lib/relay/__generated__/userEditQuery.graphql";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "https://selah.kr";

const query = graphql`
  query userEditQuery {
    user {
      id
      name
      username
      bio
      website
      image {
        id
        url
      }
    }
  }
`;

const mutation = graphql`
  mutation userEditMutation($input: UserUpdateInput!) {
    userUpdate(input: $input) {
      user {
        id
        name
        username
        bio
        website
        image {
          id
          url
        }
      }
    }
  }
`;

export default function UserEditScreen() {
  const colors = useColors();
  const { capture } = useAnalytics();
  const insets = useSafeAreaInsets();
  const data = useLazyLoadQuery<userEditQuery>(query, {});
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Form state
  const [name, setName] = useState(data.user?.name ?? "");
  const [username, setUsername] = useState(data.user?.username ?? "");
  const [website, setWebsite] = useState(data.user?.website ?? "");
  const [bio, setBio] = useState(data.user?.bio ?? "");
  const [imageId, setImageId] = useState<string | null>(
    data.user?.image?.id ?? null,
  );
  const [imageUrl, setImageUrl] = useState<string | null>(
    data.user?.image?.url ?? null,
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Track unsaved changes
  const hasChanges = useMemo(() => {
    return (
      name !== (data.user?.name ?? "") ||
      username !== (data.user?.username ?? "") ||
      website !== (data.user?.website ?? "") ||
      bio !== (data.user?.bio ?? "") ||
      imageId !== (data.user?.image?.id ?? null)
    );
  }, [name, username, website, bio, imageId, data.user]);

  // Save mutation
  const [commitUpdate] = useMutation<userEditMutation>(mutation);

  // Discard changes confirmation
  const showDiscardConfirmation = (onDiscard: () => void) => {
    Alert.alert(
      "Discard Changes?",
      "You have unsaved changes. Are you sure you want to discard them?",
      [
        { text: "Keep Editing", style: "cancel" },
        { text: "Discard", style: "destructive", onPress: onDiscard },
      ],
    );
  };

  const handleCancel = () => {
    if (hasChanges) {
      showDiscardConfirmation(() => router.back());
    } else {
      router.back();
    }
  };

  const handleSave = () => {
    if (!username.trim()) {
      Alert.alert("Error", "Username is required");
      return;
    }

    // Validate username format
    const usernameRegex = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{3,19}$/;
    if (!usernameRegex.test(username)) {
      Alert.alert(
        "Error",
        "Username must be 4-20 characters, letters, numbers, underscores, or periods only",
      );
      return;
    }

    // Validate website URL if provided
    if (website.trim()) {
      try {
        new URL(website);
      } catch {
        Alert.alert("Error", "Please enter a valid website URL");
        return;
      }
    }

    setIsSaving(true);
    commitUpdate({
      variables: {
        input: {
          name: name.trim(),
          username: username.trim(),
          bio: bio.trim() || undefined,
          website: website.trim() || undefined,
          imageId: imageId,
        },
      },
      onCompleted: () => {
        setIsSaving(false);
        capture("profile_edited", {
          fields_updated: [
            "name",
            "username",
            "bio",
            "website",
            "image",
          ].filter(Boolean),
        });
        router.back();
      },
      onError: (error) => {
        setIsSaving(false);
        if (error.message.includes("username")) {
          Alert.alert("Error", "This username is already taken");
        } else {
          Alert.alert("Error", "Failed to save profile. Please try again.");
        }
        console.error("Save error:", error);
      },
    });
  };

  // Handle Android back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (hasChanges && !isSaving) {
          showDiscardConfirmation(() => router.back());
          return true;
        }
        return false;
      },
    );

    return () => backHandler.remove();
  }, [hasChanges, isSaving]);

  // Avatar action sheet and image handling
  const showAvatarOptions = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  const handleAvatarAction = useCallback(
    async (action: "camera" | "library" | "remove") => {
      bottomSheetRef.current?.close();
      if (action === "camera") await launchCamera();
      if (action === "library") await launchLibrary();
      if (action === "remove") removeAvatar();
    },
    // eslint-disable-next-line react-compiler/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    [],
  );

  const launchCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Camera access is needed to take photos",
      );
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      await uploadImage(result.assets[0]);
    }
  };

  const launchLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      mediaTypes: ["images"],
    });
    if (!result.canceled) {
      await uploadImage(result.assets[0]);
    }
  };

  const uploadImage = async (asset: ImagePicker.ImagePickerAsset) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", {
        uri: asset.uri,
        type: "image/jpeg",
        name: "avatar.jpg",
      } as any);

      const cookie = authClient.getCookie() ?? "";
      const response = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        body: formData,
        headers: {
          ...(cookie ? { cookie } : {}),
        },
        credentials: Platform.OS === "web" ? "include" : "omit",
      });

      const responseData = await response.json();
      if (responseData.ok) {
        setImageId(responseData.data.id);
        setImageUrl(responseData.data.url);
      } else {
        Alert.alert(
          "Upload Failed",
          "Could not upload image. Please try again.",
        );
      }
    } catch {
      Alert.alert("Upload Failed", "Could not upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const removeAvatar = () => {
    setImageId(null);
    setImageUrl(null);
  };

  const isDoneDisabled = !hasChanges || isSaving || isUploading;

  return (
    <View style={[styles.flex, { backgroundColor: colors.bg }]}>
      <Stack.Screen
        options={{
          title: "Edit Profile",
          headerBackVisible: false,
          headerTransparent: true,
          headerStyle: { backgroundColor: "transparent" },
          headerShadowVisible: false,
          headerTitleStyle: { color: colors.text },
          headerLeft: () => (
            <Pressable
              onPress={handleCancel}
              style={{ paddingHorizontal: 8, paddingVertical: 8 }}
              accessibilityRole="button"
              accessibilityLabel="Cancel editing profile"
            >
              <RNText style={{ color: colors.accent, fontSize: 17 }}>
                Cancel
              </RNText>
            </Pressable>
          ),
          headerRight: () => (
            <Pressable
              onPress={handleSave}
              disabled={isDoneDisabled}
              style={{
                opacity: isDoneDisabled ? 0.5 : 1,
                paddingHorizontal: 8,
                paddingVertical: 8,
              }}
              accessibilityRole="button"
              accessibilityLabel="Save profile changes"
              accessibilityState={{ disabled: isDoneDisabled }}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color={colors.accent} />
              ) : (
                <RNText
                  style={{
                    fontSize: 17,
                    fontWeight: "600",
                    color: isDoneDisabled ? colors.textMuted : colors.accent,
                  }}
                >
                  Done
                </RNText>
              )}
            </Pressable>
          ),
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
        keyboardVerticalOffset={insets.top}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[
            styles.content,
            { paddingTop: insets.top + 44, paddingBottom: insets.bottom + 24 },
          ]}
          contentInsetAdjustmentBehavior="never"
          keyboardShouldPersistTaps="handled"
        >
          {/* Avatar */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrapper}>
              <UserAvatar
                imageUrl={imageUrl}
                name={name}
                size={100}
                onPress={showAvatarOptions}
              />
              {isUploading && (
                <View style={styles.uploadingOverlay}>
                  <ActivityIndicator size="small" color="#fff" />
                </View>
              )}
            </View>
            <Pressable
              onPress={showAvatarOptions}
              style={styles.changePhotoButton}
              accessibilityRole="button"
              accessibilityLabel="Change profile photo"
            >
              <Text
                style={{
                  color: colors.accent,
                  fontSize: 16,
                  fontWeight: "500",
                }}
              >
                Change Photo
              </Text>
            </Pressable>
          </View>

          {/* Name Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textMuted }]}>
              Name
            </Text>
            <TextInput
              value={name}
              onChangeText={(text) => setName(text.slice(0, 30))}
              placeholder="Your name"
              placeholderTextColor={colors.textMuted}
              maxLength={30}
              accessibilityLabel="Name"
              accessibilityHint="Enter your display name"
              style={[
                styles.input,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
            />
            <Text style={[styles.charCount, { color: colors.textMuted }]}>
              {name.length}/30
            </Text>
          </View>

          {/* Username Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textMuted }]}>
              Username
            </Text>
            <TextInput
              value={username}
              onChangeText={(text) =>
                setUsername(text.toLowerCase().slice(0, 20))
              }
              placeholder="username"
              placeholderTextColor={colors.textMuted}
              maxLength={20}
              autoCapitalize="none"
              autoCorrect={false}
              accessibilityLabel="Username"
              accessibilityHint="Enter your unique username"
              style={[
                styles.input,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
            />
            <Text style={[styles.charCount, { color: colors.textMuted }]}>
              {username.length}/20
            </Text>
          </View>

          {/* Website Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textMuted }]}>
              Website
            </Text>
            <TextInput
              value={website}
              onChangeText={(text) => setWebsite(text.slice(0, 100))}
              placeholder="https://example.com"
              placeholderTextColor={colors.textMuted}
              maxLength={100}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              accessibilityLabel="Website"
              accessibilityHint="Enter your website URL"
              style={[
                styles.input,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
            />
            <Text style={[styles.charCount, { color: colors.textMuted }]}>
              {website.length}/100
            </Text>
          </View>

          {/* Bio Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textMuted }]}>Bio</Text>
            <TextInput
              value={bio}
              onChangeText={(text) =>
                setBio(text.replace(/\n/g, " ").slice(0, 200))
              }
              placeholder="Tell us about yourself"
              placeholderTextColor={colors.textMuted}
              maxLength={200}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              accessibilityLabel="Bio"
              accessibilityHint="Enter a short description about yourself"
              style={[
                styles.textArea,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
            />
            <Text style={[styles.charCount, { color: colors.textMuted }]}>
              {bio.length}/200
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={[260 + insets.bottom]}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: colors.surface, borderRadius: 24 }}
        handleIndicatorStyle={{
          backgroundColor: colors.border,
          width: 36,
          height: 4,
        }}
      >
        <BottomSheetView style={styles.sheetContent}>
          <RNText style={[styles.sheetTitle, { color: colors.textMuted }]}>
            Change Photo
          </RNText>

          <View
            style={[
              styles.sheetOptionsContainer,
              { backgroundColor: colors.surfaceElevated },
            ]}
          >
            <Pressable
              onPress={() => handleAvatarAction("camera")}
              style={{ paddingVertical: 14, paddingHorizontal: 16 }}
              accessibilityRole="button"
              accessibilityLabel="Take photo"
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: colors.surface,
                    marginRight: 14,
                  }}
                >
                  <Camera size={20} color={colors.accent} strokeWidth={1.5} />
                </View>
                <RNText
                  style={{
                    fontSize: 16,
                    fontWeight: "500",
                    color: colors.text,
                  }}
                >
                  Take Photo
                </RNText>
              </View>
            </Pressable>

            <View
              style={{
                height: 1,
                marginLeft: 70,
                backgroundColor: colors.border,
              }}
            />

            <Pressable
              onPress={() => handleAvatarAction("library")}
              style={{ paddingVertical: 14, paddingHorizontal: 16 }}
              accessibilityRole="button"
              accessibilityLabel="Choose from library"
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: colors.surface,
                    marginRight: 14,
                  }}
                >
                  <ImageIcon
                    size={20}
                    color={colors.accent}
                    strokeWidth={1.5}
                  />
                </View>
                <RNText
                  style={{
                    fontSize: 16,
                    fontWeight: "500",
                    color: colors.text,
                  }}
                >
                  Choose from Library
                </RNText>
              </View>
            </Pressable>

            <View
              style={{
                height: 1,
                marginLeft: 70,
                backgroundColor: colors.border,
              }}
            />

            <Pressable
              onPress={() => handleAvatarAction("remove")}
              style={{ paddingVertical: 14, paddingHorizontal: 16 }}
              accessibilityRole="button"
              accessibilityLabel="Remove photo"
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(220, 38, 38, 0.1)",
                    marginRight: 14,
                  }}
                >
                  <Trash2 size={20} color="#dc2626" strokeWidth={1.5} />
                </View>
                <RNText
                  style={{ fontSize: 16, fontWeight: "500", color: "#dc2626" }}
                >
                  Remove Photo
                </RNText>
              </View>
            </Pressable>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  avatarWrapper: {
    position: "relative",
  },
  uploadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  changePhotoButton: {
    marginTop: 12,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 100,
  },
  charCount: {
    fontSize: 12,
    marginTop: 4,
    textAlign: "right",
  },
  sheetContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  sheetTitle: {
    fontSize: 13,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 16,
    textAlign: "center",
  },
  sheetOptionsContainer: {
    borderRadius: 16,
    overflow: "hidden",
  },
});
