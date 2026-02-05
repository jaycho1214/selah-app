---
phase: 04-profiles-connections
plan: 05
subsystem: ui
tags: [relay, graphql, mutations, optimistic-ui, follow, haptics]

# Dependency graph
requires:
  - phase: 04-04
    provides: User profile screen with placeholder follow button
provides:
  - FollowButton component with optimistic updates
  - Follow/unfollow mutations with @include/@skip pattern
  - Sign-in prompt for anonymous users
affects: [notifications, activity-feed, follower-list]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "@include/@skip conditional mutation execution"
    - "Relay optimisticUpdater for immediate UI feedback"
    - "Error haptic feedback on mutation failure"

key-files:
  created:
    - components/user/follow-button.tsx
    - lib/relay/__generated__/followButtonMutation.graphql.ts
    - lib/relay/__generated__/followButton_user.graphql.ts
  modified:
    - app/user/[username].tsx
    - lib/relay/__generated__/UsernameQuery.graphql.ts

key-decisions:
  - "Relay naming convention: camelCase module prefix (followButton not FollowButton)"
  - "Combined follow/unfollow into single mutation with @include/@skip"
  - "No confirmation dialog for unfollow (immediate action per CONTEXT)"

patterns-established:
  - "Follow button pattern: fragment for state, mutation with conditional execution"
  - "Anonymous user handling: presentSignIn() from useSession()"

# Metrics
duration: 2min
completed: 2026-02-05
---

# Phase 04 Plan 05: Follow/Unfollow Button Summary

**FollowButton component with optimistic updates using Relay @include/@skip conditional mutation pattern**

## Performance

- **Duration:** 2 min
- **Started:** 2026-02-05T14:09:06Z
- **Completed:** 2026-02-05T14:11:29Z
- **Tasks:** 3 (Tasks 1-2 combined, Task 3 separate)
- **Files modified:** 5

## Accomplishments

- Created FollowButton component with followButton_user fragment
- Implemented follow/unfollow mutation with @include/@skip pattern for conditional execution
- Added optimistic updates for immediate follower count changes
- Integrated FollowButton into user profile screen with anonymous user handling
- Added haptic feedback on press and error notification on failure

## Task Commits

Each task was committed atomically:

1. **Tasks 1+2: Create FollowButton with fragment and mutation** - `05b651e` (feat)
2. **Task 3: Integrate FollowButton into user profile screen** - `16ddfc2` (feat)

## Files Created/Modified

- `components/user/follow-button.tsx` - FollowButton with fragment, mutation, optimistic updates
- `lib/relay/__generated__/followButtonMutation.graphql.ts` - Generated mutation types
- `lib/relay/__generated__/followButton_user.graphql.ts` - Generated fragment types
- `app/user/[username].tsx` - Integrated FollowButton, removed placeholder
- `lib/relay/__generated__/UsernameQuery.graphql.ts` - Updated with fragment spread

## Decisions Made

- **Relay naming convention:** Used camelCase (followButton) instead of PascalCase per Relay compiler requirements
- **Combined mutation:** Single mutation with @include/@skip instead of separate follow/unfollow mutations
- **No unfollow confirmation:** Immediate unfollow per CONTEXT.md decision

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed Relay naming convention**
- **Found during:** Task 1 (Create FollowButton component)
- **Issue:** Relay compiler requires camelCase module prefix matching filename
- **Fix:** Changed FollowButton_user to followButton_user, FollowButtonMutation to followButtonMutation
- **Files modified:** components/user/follow-button.tsx
- **Verification:** npx relay-compiler passes
- **Committed in:** 05b651e (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Naming convention fix required for Relay compiler compatibility. No scope creep.

## Issues Encountered

None - plan executed with minor naming adjustment.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Follow functionality complete, ready for follower/following list screens
- Consider adding follow button to search results and post author headers
- Activity feed can now track follow events

---
*Phase: 04-profiles-connections*
*Completed: 2026-02-05*
