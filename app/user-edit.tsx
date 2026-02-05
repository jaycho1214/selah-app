import { useState, useMemo } from 'react';
import {
  View,
  TextInput,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { useLazyLoadQuery } from 'react-relay';
import { graphql } from 'relay-runtime';

import { Text } from '@/components/ui/text';
import { UserAvatar } from '@/components/user/user-avatar';
import { useColors } from '@/hooks/use-colors';
import type { userEditQuery } from '@/lib/relay/__generated__/userEditQuery.graphql';

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

export default function UserEditScreen() {
  const colors = useColors();
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

  const handleCancel = () => {
    // TODO: Add discard confirmation in Task 3
    router.back();
  };

  const handleSave = () => {
    // TODO: Implement save mutation in Task 3
  };

  const handleAvatarPress = () => {
    // TODO: Implement action sheet in Task 2
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
