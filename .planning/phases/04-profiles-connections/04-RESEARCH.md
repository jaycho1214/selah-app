# Phase 4: Profiles & Connections - Research

**Researched:** 2026-02-05
**Domain:** User Profiles, Social Connections, Image Upload, List Navigation
**Confidence:** HIGH

## Summary

This phase implements user profiles and social connections in the React Native app, matching the selah-web design patterns. The existing codebase provides strong foundations: GraphQL schema already supports all required operations (`userById`, `userByUsername`, `userFollow`, `userUnfollow`, `userUpdate`), Relay patterns are well-established, and expo-router navigation is configured.

Key technical domains include:
1. **Profile viewing** - Using Relay queries with fragments for efficient data loading
2. **Profile editing** - Push navigation to dedicated edit screen with form state management
3. **Image upload** - expo-image-picker for camera/library selection, upload to existing `/api/upload` endpoint
4. **Follow/unfollow** - Relay mutations with optimistic updates matching existing like/unlike patterns
5. **Lists display** - FlashList with infinite scroll using Relay pagination

**Primary recommendation:** Extend existing patterns from verse/post screens (ReflectionItem, PostsList) for profile UI, reuse Relay mutation patterns for follow actions, and leverage expo-image-picker for avatar management.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react-relay | ^20.1.1 | Data fetching and caching | Already in use, handles pagination and optimistic updates |
| expo-router | ~6.0.23 | Navigation and routing | Already configured, file-based routing |
| expo-image-picker | ~17.0.10 | Camera and photo library access | Already installed, Expo-managed |
| @shopify/flash-list | 2.0.2 | Performant list rendering | Already in use (bookmarks, notes screens) |
| expo-image | ~3.0.11 | Image display with caching | Already used for avatars in ReflectionItem |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| react-native-reanimated | ~4.1.1 | Animations | Loading skeletons, transitions |
| @gorhom/bottom-sheet | ^5.2.8 | Action sheets | Avatar change options |
| expo-haptics | ~15.0.8 | Tactile feedback | Button presses, follow actions |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| ActionSheetIOS | @expo/react-native-action-sheet | Cross-platform but ActionSheetIOS is native on iOS; decision: use ActionSheetIOS on iOS, Alert.alert on Android |
| FlashList | ScrollView + map | FlashList better for large lists; always use for follower/following lists |

**Installation:**
All required packages are already installed. No new dependencies needed.

## Architecture Patterns

### Recommended Project Structure
```
app/
├── (tabs)/
│   └── profile.tsx              # Own profile tab (modify existing)
├── user/
│   └── [username].tsx           # View any user's profile
├── user-edit.tsx                # Edit profile screen (push navigation)
├── followers/
│   └── [userId].tsx             # Followers list screen
└── following/
    └── [userId].tsx             # Following list screen

components/
├── profile/
│   ├── profile-header.tsx       # Avatar, name, bio, stats
│   ├── profile-stats-row.tsx    # Follower/following counts (tappable)
│   ├── profile-posts-list.tsx   # User's posts with pagination
│   ├── profile-skeleton.tsx     # Loading skeleton
│   └── edit-profile-form.tsx    # Form fields for editing
├── user/
│   ├── user-row.tsx             # User item for follower/following lists
│   ├── user-avatar.tsx          # Reusable avatar component
│   └── follow-button.tsx        # Follow/unfollow button with loading state
└── common/
    └── user-list.tsx            # Generic user list with FlashList
```

### Pattern 1: Relay Fragment Composition for Profile
**What:** Each profile component owns its data requirements via fragments
**When to use:** Always for profile-related queries
**Example:**
```typescript
// Source: selah-web user-profile-page.tsx pattern
const query = graphql`
  query userProfileQuery($username: String!) {
    userByUsername(username: $username) {
      id
      username
      name
      bio
      image {
        url
      }
      followerCount
      followingCount
      followedAt  # null if not following, timestamp if following
      ...userPostsListFragment
      ...userFollowButton
    }
  }
`;

// Fragment for follow button
const followButtonFragment = graphql`
  fragment userFollowButton on User {
    id
    followedAt
  }
`;
```

### Pattern 2: Follow/Unfollow with Optimistic Updates
**What:** Immediate UI feedback while mutation processes
**When to use:** All follow/unfollow actions
**Example:**
```typescript
// Source: Relay docs + existing like pattern in codebase
const [commitFollow, isFollowing] = useMutation<FollowMutation>(
  graphql`
    mutation userFollowMutation($userId: ID!) {
      userFollow(userId: $userId) {
        user {
          id
          followedAt
          followerCount
        }
      }
    }
  `
);

const handleFollow = () => {
  commitFollow({
    variables: { userId },
    optimisticUpdater: (store) => {
      const user = store.get(userId);
      if (user) {
        user.setValue(new Date().toISOString(), 'followedAt');
        const count = (user.getValue('followerCount') as number) ?? 0;
        user.setValue(count + 1, 'followerCount');
      }
    },
  });
};
```

### Pattern 3: Avatar Upload Flow
**What:** Action sheet to pick image, upload to server, update profile
**When to use:** Avatar changes on edit profile screen
**Example:**
```typescript
// Source: expo-image-picker docs + selah-web upload pattern
import * as ImagePicker from 'expo-image-picker';
import { ActionSheetIOS, Platform, Alert } from 'react-native';

const showAvatarOptions = () => {
  const options = ['Take Photo', 'Choose from Library', 'Remove Photo', 'Cancel'];

  if (Platform.OS === 'ios') {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: 3,
        destructiveButtonIndex: 2,
      },
      async (buttonIndex) => {
        if (buttonIndex === 0) await launchCamera();
        if (buttonIndex === 1) await launchLibrary();
        if (buttonIndex === 2) removeAvatar();
      }
    );
  } else {
    // Android: use Alert.alert
    Alert.alert('Change Photo', undefined, [
      { text: 'Take Photo', onPress: launchCamera },
      { text: 'Choose from Library', onPress: launchLibrary },
      { text: 'Remove Photo', onPress: removeAvatar, style: 'destructive' },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }
};

const launchCamera = async () => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') return;

  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (!result.canceled) {
    await uploadImage(result.assets[0]);
  }
};
```

### Pattern 4: Push Navigation for Edit Screen
**What:** Stack push with header buttons for Save/Cancel
**When to use:** Edit profile screen
**Example:**
```typescript
// Source: expo-router patterns
// app/user-edit.tsx
import { Stack, router } from 'expo-router';

export default function EditProfileScreen() {
  const [hasChanges, setHasChanges] = useState(false);

  const handleCancel = () => {
    if (hasChanges) {
      Alert.alert(
        'Discard Changes?',
        'You have unsaved changes. Are you sure you want to discard them?',
        [
          { text: 'Keep Editing', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => router.back() },
        ]
      );
    } else {
      router.back();
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Edit Profile',
          headerLeft: () => (
            <Pressable onPress={handleCancel}>
              <Text>Cancel</Text>
            </Pressable>
          ),
          headerRight: () => (
            <Pressable onPress={handleSave} disabled={!hasChanges || isSaving}>
              {isSaving ? <ActivityIndicator /> : <Text>Done</Text>}
            </Pressable>
          ),
        }}
      />
      {/* Form content */}
    </>
  );
}
```

### Pattern 5: Infinite Scroll User List
**What:** FlashList with Relay pagination for followers/following
**When to use:** Follower and following list screens
**Example:**
```typescript
// Source: existing postsListFragment pattern + FlashList docs
const { data, loadNext, hasNext, isLoadingNext } = usePaginationFragment(
  graphql`
    fragment followersListFragment on User
    @refetchable(queryName: "followersListPaginationQuery")
    @argumentDefinitions(
      first: { type: "Int", defaultValue: 20 }
      after: { type: "String" }
    ) {
      followers(first: $first, after: $after)
      @connection(key: "followersList_followers") {
        edges {
          node {
            id
            ...userRowFragment
          }
        }
      }
    }
  `,
  userRef
);

// Note: GraphQL schema needs followers/following fields on User
// This may require backend changes - see Open Questions
```

### Anti-Patterns to Avoid
- **Fetching entire user object for small UI:** Use fragments to fetch only needed fields
- **Mutating state directly after follow action:** Always use optimistic updates through Relay store
- **Modal for edit profile:** Decision specifies push navigation, not modal
- **Confirmation dialog on unfollow:** Decision specifies immediate unfollow

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Image picking | Custom file picker | expo-image-picker | Handles permissions, camera, gallery, cropping |
| Action sheets | Custom modal with options | ActionSheetIOS / Alert.alert | Native look and feel, accessible |
| List virtualization | ScrollView + map | FlashList | Memory efficient, handles large lists |
| Image upload | Custom multipart handling | Existing /api/upload endpoint | Already handles resizing, compression, S3 |
| Avatar display | Custom Image component | expo-image | Caching, placeholders, transitions |
| Optimistic updates | Manual state management | Relay optimisticUpdater | Automatic rollback on failure |

**Key insight:** The selah-web codebase has already solved these problems. The mobile app should mirror the web patterns using React Native equivalents.

## Common Pitfalls

### Pitfall 1: Missing Unsaved Changes Detection
**What goes wrong:** User loses form data by accidentally navigating away
**Why it happens:** No listener for back gesture or back button
**How to avoid:** Use useBackHandler or beforeRemove listener to intercept navigation
**Warning signs:** No confirmation dialog appears when leaving edit screen with changes

### Pitfall 2: Race Condition on Follow Button
**What goes wrong:** Multiple rapid taps cause inconsistent state
**Why it happens:** Button not disabled during mutation
**How to avoid:** Use `isMutationInFlight` from useMutation to disable button
**Warning signs:** Follow count jumps by more than 1, UI flickers

### Pitfall 3: Stale Cache After Profile Edit
**What goes wrong:** Old profile data shown after saving changes
**Why it happens:** Mutation doesn't return updated fields
**How to avoid:** Return all modified fields in mutation response, or use updater
**Warning signs:** Need to pull-to-refresh to see changes

### Pitfall 4: Image Upload Without Progress Indicator
**What goes wrong:** User thinks app is frozen during upload
**Why it happens:** No loading state while image uploads
**How to avoid:** Show ActivityIndicator immediately after image selection, disable Done button
**Warning signs:** User repeatedly taps Done, multiple uploads triggered

### Pitfall 5: FlashList Without keyExtractor
**What goes wrong:** Items re-render unnecessarily, may show wrong data
**Why it happens:** FlashList v2 requires proper keyExtractor for recycling
**How to avoid:** Always provide keyExtractor using stable unique ID
**Warning signs:** Profile images flicker, wrong user shown momentarily

### Pitfall 6: Own Profile Check Using String Comparison
**What goes wrong:** User can follow themselves or sees wrong button
**Why it happens:** Comparing user IDs as strings without normalization
**How to avoid:** Always compare GraphQL IDs consistently (both encoded or both decoded)
**Warning signs:** "Edit Profile" and "Follow" both appear, or neither appears

## Code Examples

Verified patterns from official sources and existing codebase:

### User Avatar Component
```typescript
// Source: existing ReflectionItem pattern
import { Image } from 'expo-image';
import { View, Text, Pressable } from 'react-native';

interface UserAvatarProps {
  imageUrl?: string | null;
  name?: string | null;
  size?: number;
  onPress?: () => void;
}

export function UserAvatar({ imageUrl, name, size = 40, onPress }: UserAvatarProps) {
  const initials = name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() ?? '?';

  const content = imageUrl ? (
    <Image
      source={{ uri: imageUrl }}
      style={{ width: size, height: size, borderRadius: size / 2 }}
      contentFit="cover"
      transition={150}
    />
  ) : (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: colors.accent + '18',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ color: colors.accent, fontWeight: '600' }}>{initials}</Text>
    </View>
  );

  return onPress ? <Pressable onPress={onPress}>{content}</Pressable> : content;
}
```

### Profile Stats Row (Twitter-style)
```typescript
// Source: selah-web user-profile-page.tsx design
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';

interface ProfileStatsRowProps {
  userId: string;
  followerCount: number;
  followingCount: number;
}

export function ProfileStatsRow({ userId, followerCount, followingCount }: ProfileStatsRowProps) {
  return (
    <View style={{ flexDirection: 'row', gap: 16 }}>
      <Pressable onPress={() => router.push(`/following/${userId}`)}>
        <Text>
          <Text style={{ fontWeight: '700' }}>{followingCount}</Text>
          <Text style={{ color: colors.textMuted }}> Following</Text>
        </Text>
      </Pressable>
      <Pressable onPress={() => router.push(`/followers/${userId}`)}>
        <Text>
          <Text style={{ fontWeight: '700' }}>{followerCount}</Text>
          <Text style={{ color: colors.textMuted }}> Followers</Text>
        </Text>
      </Pressable>
    </View>
  );
}
```

### Follow Button with Loading State
```typescript
// Source: Relay docs useMutation + selah-web userFollowButton.tsx
import { ActivityIndicator, Pressable, Text } from 'react-native';
import { useMutation, useFragment } from 'react-relay';

export function FollowButton({ userRef }) {
  const data = useFragment(
    graphql`
      fragment FollowButton_user on User {
        id
        followedAt
      }
    `,
    userRef
  );

  const [commit, isMutationInFlight] = useMutation(
    graphql`
      mutation FollowButtonMutation($userId: ID!, $value: Boolean!) {
        userFollow(userId: $userId) @include(if: $value) {
          user { id followedAt followerCount }
        }
        userUnfollow(userId: $userId) @skip(if: $value) {
          user { id followedAt followerCount }
        }
      }
    `
  );

  const isFollowing = !!data?.followedAt;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    commit({
      variables: { userId: data.id, value: !isFollowing },
      optimisticUpdater: (store) => {
        const user = store.get(data.id);
        if (user) {
          user.setValue(isFollowing ? null : new Date().toISOString(), 'followedAt');
        }
      },
    });
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={isMutationInFlight}
      style={[
        styles.button,
        isFollowing ? styles.followingButton : styles.followButton,
      ]}
    >
      {isMutationInFlight ? (
        <ActivityIndicator size="small" color={isFollowing ? colors.text : '#fff'} />
      ) : (
        <Text style={isFollowing ? styles.followingText : styles.followText}>
          {isFollowing ? 'Following' : 'Follow'}
        </Text>
      )}
    </Pressable>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| FlatList for all lists | FlashList v2 | Late 2024 | Better performance, auto item sizing |
| useMemo for items | keyExtractor required | FlashList v2 | Prevents recycling issues |
| Manual fetch + state | Relay fragments | Established | Automatic caching, optimistic updates |
| Custom image picker | expo-image-picker | Expo SDK 50+ | Simpler API, managed permissions |

**Deprecated/outdated:**
- `estimatedItemSize` in FlashList v2: No longer required, auto-measured
- `CameraRoll` API: Replaced by expo-image-picker
- Direct fetch for mutations: Use Relay useMutation for cache consistency

## Open Questions

Things that couldn't be fully resolved:

1. **Followers/Following List Query**
   - What we know: GraphQL schema has `followerCount` and `followingCount` on User
   - What's unclear: Schema doesn't currently have `followers` or `following` connection fields
   - Recommendation: Backend needs to add these fields, or use `users` query with filter. Check with backend team.

2. **Profile Posts Tab vs All Posts**
   - What we know: selah-web shows posts/replies/likes tabs on own profile
   - What's unclear: Decision says "match selah-web" but mobile may need simpler UX
   - Recommendation: Start with posts only, add tabs in future iteration if needed

3. **Deep Link to Profile**
   - What we know: expo-router supports dynamic routes
   - What's unclear: URL scheme for profiles (/@username vs /user/username)
   - Recommendation: Use `/user/[username]` to match web, configure deep linking later

## Sources

### Primary (HIGH confidence)
- Context7 relay.dev - useMutation, optimisticUpdater, fragments
- expo-image-picker official docs - launchCameraAsync, launchImageLibraryAsync
- FlashList GitHub - v2 migration, keyExtractor requirements

### Secondary (MEDIUM confidence)
- selah-web codebase - UserProfilePage, UserFollowButton, UserEditProfileDialog patterns
- selah-app codebase - ReflectionItem, PostsList, BookmarksScreen existing patterns
- Expo Router docs - navigation, Stack.Screen options

### Tertiary (LOW confidence)
- Medium articles on FlashList infinite scroll patterns (verified against official docs)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries already installed and used in codebase
- Architecture: HIGH - Patterns directly derived from existing code
- Pitfalls: MEDIUM - Based on React Native best practices, not all verified in this codebase

**Research date:** 2026-02-05
**Valid until:** 2026-03-05 (30 days - stable domain)
