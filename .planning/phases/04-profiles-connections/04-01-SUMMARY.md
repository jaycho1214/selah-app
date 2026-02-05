---
phase: 04-profiles-connections
plan: 01
subsystem: profile-components
tags: [avatar, profile, skeleton, ui-components]

dependency-graph:
  requires: [03-bible-reading]
  provides: [user-avatar, profile-header, profile-stats-row, profile-skeleton]
  affects: [04-02, 04-03, 04-04]

tech-stack:
  added: []
  patterns: [useColors-hook, initials-fallback, skeleton-animation]

key-files:
  created:
    - components/user/user-avatar.tsx
    - components/profile/profile-header.tsx
    - components/profile/profile-stats-row.tsx
    - components/profile/profile-skeleton.tsx
  modified: []

decisions:
  - id: avatar-initials
    choice: "Single letter for single-word names, two letters for multi-word"
    reason: "Matches common avatar patterns (Twitter, iOS contacts)"
  - id: stats-navigation
    choice: "RelativePathString cast for untyped routes"
    reason: "Routes will be created in later plans, allows component to compile"
  - id: skeleton-animation
    choice: "Animated API with opacity loop 0.3-1.0"
    reason: "Simple native-driven animation, matches loading skeleton patterns"

metrics:
  duration: 2 min
  completed: 2026-02-05
---

# Phase 04 Plan 01: Profile UI Components Summary

**One-liner:** Reusable profile components - avatar with initials fallback, header layout, stats row, and loading skeleton.

## What Was Built

### UserAvatar Component
- Displays user image with expo-image (contentFit cover, 150ms transition)
- Initials fallback: single letter for "John", two letters for "John Doe"
- Configurable size prop (default 40px, 80px for profile header)
- Optional onPress handler wraps content in Pressable
- Themed accent color at 18% opacity for fallback background

### ProfileHeader Component
- Clean minimal layout matching selah-web design
- 80px avatar at top center
- Name (bold, 20px), username (@mention), and bio below
- Children slot for action buttons (Edit Profile or Follow)
- Uses UserAvatar component internally

### ProfileStatsRow Component
- Twitter-style horizontal row with follower/following counts
- Bold count number with muted label text
- Each stat is tappable with haptic feedback
- Navigates to /followers/{userId} and /following/{userId} routes
- Singular/plural handling for "1 Follower" vs "N Followers"

### ProfileSkeleton Component
- Loading state with pulsing opacity animation
- Placeholders for avatar, name, username, bio lines, and stats row
- Uses surfaceElevated color from useColors hook
- Animated.loop with native driver for smooth 60fps animation

## Commits

| Hash | Type | Description |
|------|------|-------------|
| 565bcd8 | feat | Create UserAvatar component |
| 1ca3743 | feat | Create ProfileHeader and ProfileStatsRow |
| 9ac2eb5 | feat | Create ProfileSkeleton component |

## Deviations from Plan

None - plan executed exactly as written.

Note: The useColors hook already existed with the correct interface, so no modifications were needed.

## Files Created

```
components/
  user/
    user-avatar.tsx          # Reusable avatar with image/initials
  profile/
    profile-header.tsx       # Header with avatar, name, bio, action slot
    profile-stats-row.tsx    # Tappable follower/following counts
    profile-skeleton.tsx     # Loading skeleton with pulse animation
```

## Component API Summary

```typescript
// UserAvatar
<UserAvatar
  imageUrl={string | null}
  name={string | null}
  size={number}           // Default: 40
  onPress={() => void}    // Optional
/>

// ProfileHeader
<ProfileHeader
  name={string | null}
  username={string | null}
  bio={string | null}
  imageUrl={string | null}
  onAvatarPress={() => void}
>
  {/* Action button slot */}
</ProfileHeader>

// ProfileStatsRow
<ProfileStatsRow
  userId={string}
  followerCount={number}
  followingCount={number}
/>

// ProfileSkeleton
<ProfileSkeleton />
```

## Next Phase Readiness

Ready for plan 04-02 (Profile Screen with Relay).

Dependencies satisfied:
- Profile UI components created and exported
- useColors hook available for theme consistency
- All TypeScript types defined

Routes needed (not yet created):
- /followers/[userId] - for ProfileStatsRow navigation
- /following/[userId] - for ProfileStatsRow navigation
