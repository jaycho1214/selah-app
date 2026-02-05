---
phase: 04-profiles-connections
plan: 06
subsystem: ui
tags: [flashlist, relay, pagination, user-list, expo-router]

# Dependency graph
requires:
  - phase: 04-05
    provides: FollowButton component with fragment
provides:
  - UserRow component with user fragment
  - UserList component with FlashList
  - Followers list screen (/followers/[userId])
  - Following list screen (/following/[userId])
affects: [profiles, social, search]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - FlashList for user lists with pagination
    - userRow_user fragment for user display

key-files:
  created:
    - components/user/user-row.tsx
    - components/user/user-list.tsx
    - app/followers/[userId].tsx
    - app/following/[userId].tsx
  modified: []

key-decisions:
  - "FlashList v2 no longer requires estimatedItemSize property"
  - "Relay fragment naming: userRow_user (camelCase module prefix)"
  - "Empty state screens pending backend followers/following connection fields"

patterns-established:
  - "UserRow: standard user list item with avatar, name, username, bio, follow button"
  - "UserList: generic FlashList wrapper with empty state and pagination"

# Metrics
duration: 2min
completed: 2026-02-05
---

# Phase 04 Plan 06: Followers/Following Lists Summary

**UserRow and UserList components for displaying users, with followers/following screens awaiting backend connection fields**

## Performance

- **Duration:** 2 min
- **Started:** 2026-02-05T14:14:27Z
- **Completed:** 2026-02-05T14:16:55Z
- **Tasks:** 3
- **Files modified:** 4

## Accomplishments

- Created UserRow component with avatar, name, username, bio, and FollowButton
- Created UserList generic component with FlashList and empty state
- Added followers and following list screens with navigation from profile
- Documented backend requirement for followers/following connection fields

## Task Commits

Each task was committed atomically:

1. **Task 1: Create UserRow component with fragment** - `9d8824e` (feat)
2. **Task 2: Create UserList component with FlashList** - `d46074b` (feat)
3. **Task 3: Create followers and following list screens** - `bb9c6b6` (feat)

## Files Created/Modified

- `components/user/user-row.tsx` - User row item with fragment for lists
- `components/user/user-list.tsx` - Generic user list with FlashList and empty state
- `app/followers/[userId].tsx` - Followers list screen (empty state pending backend)
- `app/following/[userId].tsx` - Following list screen (empty state pending backend)
- `lib/relay/__generated__/userRow_user.graphql.ts` - Generated Relay types

## Decisions Made

- **FlashList v2:** Removed `estimatedItemSize` property (no longer required in v2)
- **Fragment naming:** Used `userRow_user` following camelCase module prefix convention
- **Backend dependency:** Screens show empty state until backend adds `followers`/`following` connection fields to User type

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Removed estimatedItemSize from FlashList**
- **Found during:** Task 2 (UserList component)
- **Issue:** TypeScript error - estimatedItemSize property doesn't exist in FlashList v2
- **Fix:** Removed the estimatedItemSize prop per project decision log
- **Files modified:** components/user/user-list.tsx
- **Verification:** TypeScript compilation passes
- **Committed in:** d46074b (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** FlashList v2 API change, aligned with existing project pattern.

## Issues Encountered

**Backend Schema Limitation:**
The GraphQL schema lacks `followers` and `following` connection fields on User type. The schema only has `followerCount` and `followingCount` integers. Until the backend adds these connection fields:

```graphql
type User {
  followers(first: Int, after: String): UserConnection
  following(first: Int, after: String): UserConnection
}
```

The followers/following screens will show empty states. The screens include documentation for the required Relay pagination implementation once backend support is added.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- UserRow and UserList components ready for any user listing feature
- Followers/following screens linked from profile via ProfileStatsRow
- Backend work required: Add `followers` and `following` connection fields to User type in GraphQL schema

---
*Phase: 04-profiles-connections*
*Completed: 2026-02-05*
