import { useState, useMemo, useEffect } from 'react';
import {
  View,
  TextInput,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActionSheetIOS,
  Alert,
  BackHandler,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { useLazyLoadQuery, useMutation } from 'react-relay';
import { graphql } from 'relay-runtime';
import * as ImagePicker from 'expo-image-picker';

import { Text } from '@/components/ui/text';
import { UserAvatar } from '@/components/user/user-avatar';
import { useColors } from '@/hooks/use-colors';
import { useSession } from '@/components/providers/session-provider';
import type { userEditQuery } from '@/lib/relay/__generated__/userEditQuery.graphql';
import type { userEditMutation } from '@/lib/relay/__generated__/userEditMutation.graphql';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://www.selah.kr';

const query = graphql`
  query userEditQuery {
    user {
      id
      name
      username
      bio
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
        bio
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
  const { session } = useSession();
  const data = useLazyLoadQuery<userEditQuery>(query, {});

  // Form state
  const [name, setName] = useState(data.user?.name ?? '');
  const [bio, setBio] = useState(data.user?.bio ?? '');
  const [imageId, setImageId] = useState<string | null>(data.user?.image?.id ?? null);
  const [imageUrl, setImageUrl] = useState<string | null>(data.user?.image?.url ?? null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Track unsaved changes
  const hasChanges = useMemo(() => {
    return (
      name !== (data.user?.name ?? '') ||
      bio !== (data.user?.bio ?? '') ||
      imageId !== (data.user?.image?.id ?? null)
    );
  }, [name, bio, imageId, data.user]);

  // Save mutation
  const [commitUpdate, isUpdating] = useMutation<userEditMutation>(mutation);

  // Discard changes confirmation
  const showDiscardConfirmation = (onDiscard: () => void) => {
    Alert.alert(
      'Discard Changes?',
      'You have unsaved changes. Are you sure you want to discard them?',
      [
        { text: 'Keep Editing', style: 'cancel' },
        { text: 'Discard', style: 'destructive', onPress: onDiscard },
      ]
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
    if (!data.user?.username) {
      Alert.alert('Error', 'Username is required');
      return;
    }

    setIsSaving(true);
    commitUpdate({
      variables: {
        input: {
          name: name.trim(),
          username: data.user.username, // Keep existing username
          bio: bio.trim() || undefined,
          imageId: imageId,
        },
      },
      onCompleted: () => {
        setIsSaving(false);
        router.back();
      },
      onError: (error) => {
        setIsSaving(false);
        Alert.alert('Error', 'Failed to save profile. Please try again.');
        console.error('Save error:', error);
      },
    });
  };

  // Handle Android back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (hasChanges && !isSaving) {
        showDiscardConfirmation(() => router.back());
        return true; // Prevent default back behavior
      }
      return false; // Allow default back behavior
    });

    return () => backHandler.remove();
  }, [hasChanges, isSaving]);

  // Avatar action sheet and image handling
  const showAvatarOptions = () => {
    const options = ['Take Photo', 'Choose from Library', 'Remove Photo', 'Cancel'];

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex: 3,
          destructiveButtonIndex: 2,
        },
        handleAvatarAction
      );
    } else {
      Alert.alert('Change Photo', undefined, [
        { text: 'Take Photo', onPress: () => handleAvatarAction(0) },
        { text: 'Choose from Library', onPress: () => handleAvatarAction(1) },
        { text: 'Remove Photo', onPress: () => handleAvatarAction(2), style: 'destructive' },
        { text: 'Cancel', style: 'cancel' },
      ]);
    }
  };

  const handleAvatarAction = async (buttonIndex: number) => {
    if (buttonIndex === 0) await launchCamera();
    if (buttonIndex === 1) await launchLibrary();
    if (buttonIndex === 2) removeAvatar();
  };

  const launchCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera access is needed to take photos');
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
      mediaTypes: ['images'],
    });
    if (!result.canceled) {
      await uploadImage(result.assets[0]);
    }
  };

  const uploadImage = async (asset: ImagePicker.ImagePickerAsset) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: asset.uri,
        type: 'image/jpeg',
        name: 'avatar.jpg',
      } as any);

      const response = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${session?.session?.token}`,
        },
      });

      const responseData = await response.json();
      if (responseData.ok) {
        setImageId(responseData.data.id);
        setImageUrl(responseData.data.url);
      } else {
        Alert.alert('Upload Failed', 'Could not upload image. Please try again.');
      }
    } catch (error) {
      Alert.alert('Upload Failed', 'Could not upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const removeAvatar = () => {
    setImageId(null);
    setImageUrl(null);
  };

  const handleAvatarPress = () => {
    showAvatarOptions();
  };

  const isDoneDisabled = !hasChanges || isSaving || isUploading;

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Edit Profile',
          headerLeft: () => (
            <Pressable onPress={handleCancel} hitSlop={8}>
              <Text className="text-primary text-base">Cancel</Text>
            </Pressable>
          ),
          headerRight: () => (
            <Pressable
              onPress={handleSave}
              disabled={isDoneDisabled}
              hitSlop={8}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color={colors.accent} />
              ) : (
                <Text
                  className={`text-base font-semibold ${
                    isDoneDisabled ? 'text-muted-foreground' : 'text-primary'
                  }`}
                >
                  Done
                </Text>
              )}
            </Pressable>
          ),
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 bg-background"
          contentContainerClassName="p-6"
          keyboardShouldPersistTaps="handled"
        >
          {/* Avatar */}
          <View className="items-center mb-8">
            <View className="relative">
              <UserAvatar
                imageUrl={imageUrl}
                name={name}
                size={100}
                onPress={handleAvatarPress}
              />
              {isUploading && (
                <View className="absolute inset-0 items-center justify-center bg-black/50 rounded-full">
                  <ActivityIndicator size="small" color="#fff" />
                </View>
              )}
            </View>
            <Pressable onPress={handleAvatarPress} className="mt-3">
              <Text className="text-primary text-base font-medium">
                Change Photo
              </Text>
            </Pressable>
          </View>

          {/* Name Input */}
          <View className="mb-6">
            <Text className="text-muted-foreground text-sm font-medium mb-2">
              Name
            </Text>
            <TextInput
              value={name}
              onChangeText={(text) => setName(text.slice(0, 30))}
              placeholder="Your name"
              placeholderTextColor={colors.textMuted}
              maxLength={30}
              className="bg-card border border-border rounded-lg px-4 py-3 text-foreground text-base"
              style={{ color: colors.text }}
            />
            <Text className="text-muted-foreground text-xs mt-1 text-right">
              {name.length}/30
            </Text>
          </View>

          {/* Bio Input */}
          <View className="mb-6">
            <Text className="text-muted-foreground text-sm font-medium mb-2">
              Bio
            </Text>
            <TextInput
              value={bio}
              onChangeText={(text) => setBio(text.slice(0, 200))}
              placeholder="Tell us about yourself"
              placeholderTextColor={colors.textMuted}
              maxLength={200}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              className="bg-card border border-border rounded-lg px-4 py-3 text-foreground text-base min-h-[100px]"
              style={{ color: colors.text }}
            />
            <Text className="text-muted-foreground text-xs mt-1 text-right">
              {bio.length}/200
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
