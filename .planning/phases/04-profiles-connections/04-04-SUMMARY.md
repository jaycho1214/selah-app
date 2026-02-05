---
phase: 04-profiles-connections
plan: 04
subsystem: profiles
tags: [user-profile, navigation, graphql, relay]

dependency_graph:
  requires: ["04-02"]
  provides: ["user-profile-screen", "post-to-profile-navigation"]
  affects: ["04-05"]

tech_stack:
  added: []
  patterns: ["dynamic-route", "useLazyLoadQuery", "user-navigation"]

key_files:
  created:
    - app/user/[username].tsx
    - lib/relay/__generated__/UsernameQuery.graphql.ts
    - lib/relay/__generated__/UsernameLikeMutation.graphql.ts
    - lib/relay/__generated__/UsernameUnlikeMutation.graphql.ts
    - lib/relay/__generated__/UsernameDeleteMutation.graphql.ts
  modified:
    - components/verse/reflection-item.tsx

decisions:
  - key: "relay-naming-username"
    value: "UsernameQuery prefix for [username].tsx dynamic route"
    rationale: "Relay requires module name prefix with capital U"

metrics:
  duration: "3 min"
  completed: "2026-02-05"
---

# Phase 04 Plan 04: User Profile Screen Summary

**One-liner:** Dynamic user profile screen at /user/[username] with post navigation from avatar/username taps.

## What Was Built

### User Profile Screen (/user/[username])
- Dynamic route using expo-router's bracket notation
- UsernameQuery fetches user by username via `userByUsername` field
- Displays ProfileHeader with avatar, name, username, bio
- Shows ProfileStatsRow with follower/following counts
- ProfilePostsList renders user's posts with pagination
- Like/unlike/delete mutations with optimistic UI updates
- Own profile detection via session.user.id comparison
- Stack.Screen header with title "Profile" and back button

### Own Profile vs Other User Detection
- `isOwnProfile = session?.user?.id === user.id`
- Own profile: Shows "Edit Profile" button navigating to /user-edit
- Other user: Shows FollowButton placeholder (to be wired in 04-05)
- Follow button displays "Following" or "Follow" based on followedAt

### Post-to-Profile Navigation
- Avatar in ReflectionItem is now tappable
- Name/username row is tappable
- Both navigate to /user/[username]
- Haptic feedback on user press
- Card press still navigates to post detail (separate from user press)

## GraphQL Schema Usage

```graphql
# User profile query by username
query UsernameQuery($username: String!) {
  userByUsername(username: $username) {
    id
    username
    name
    bio
    image { url }
    followerCount
    followingCount
    followedAt  # null if not following
    ...profilePostsListFragment
  }
}

# Mutations reused from profile tab
mutation UsernameLikeMutation($id: ID!)
mutation UsernameUnlikeMutation($id: ID!)
mutation UsernameDeleteMutation($id: ID!, $connections: [ID!]!)
```

## Key Implementation Details

### Navigation Pattern
```typescript
// In ReflectionItem
const handleUserPress = useCallback(() => {
  if (user.username) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/user/${user.username}`);
  }
}, [user.username, router]);
```

### Follow Button Placeholder
```typescript
function FollowButtonPlaceholder({ followedAt, colors }) {
  const isFollowing = !!followedAt;
  return (
    <Button variant={isFollowing ? "outline" : "default"}>
      <Text>{isFollowing ? "Following" : "Follow"}</Text>
    </Button>
  );
}
```

## Commits

| Hash | Type | Description |
|------|------|-------------|
| b427fa8 | feat | Create user profile screen with GraphQL query |
| 8ef7960 | feat | Add navigation from posts to user profiles |

## Deviations from Plan

None - plan executed exactly as written.

## Next Phase Readiness

**04-05 Dependencies Met:**
- User profile screen exists at /user/[username]
- FollowButton placeholder ready to be replaced with functional component
- followedAt field available for determining follow state

**Integration Points:**
- ProfileHeader accepts children for action button slot
- Follow/unfollow mutations will be added in 04-05
