---
phase: 05-feed-engagement
plan: 02
subsystem: ui
tags: [pager-view, dual-tab, feed, zustand, reanimated, animated-tab-bar, react-native]

# Dependency graph
requires:
  - phase: 05-01
    provides: FeedSkeleton shimmer skeleton, FeedList reusable paginated feed
provides:
  - Dual-tab Posts screen with PagerView swipeable For You / Following feeds
  - Zustand feed store for active tab persistence
  - Animated tab bar with underline indicator
affects: [05-03 poll voting (posts render in this feed), 06-xx post creation (feed is target)]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "PagerView with absolute-positioned animated tab bar and safe area insets"
    - "Zustand store for feed tab state persistence across navigation"
    - "progressViewOffset on RefreshControl for correct pull-to-refresh behind tab bar"

key-files:
  created:
    - lib/stores/feed-store.ts
  modified:
    - app/(tabs)/posts.tsx
    - components/feed/feed-list.tsx

key-decisions:
  - "ForYouFeed and FollowingFeed defined inline in posts.tsx (not separate files) since they share mutations and PagerView ref context"
  - "Following feed shows empty state only (backend lacks following filter on bibleVersePosts query)"
  - "Auth-aware Following tab: unauthenticated users see sign-in prompt, authenticated users see 'follow people' CTA"
  - "Tab bar uses solid background color (not blur/transparency) for simplicity and performance"
  - "progressViewOffset added to FeedList for correct RefreshControl positioning behind tab bar"

patterns-established:
  - "PagerView dual-tab: absolute tab bar + PagerView with width/height 100% pages + collapsable={false}"
  - "Feed tab state: Zustand store synced with PagerView onPageSelected, guarded against setPage loop"

# Metrics
duration: 4min
completed: 2026-02-06
---

# Phase 5 Plan 02: Dual-Tab Feed with PagerView Summary

**Swipeable For You / Following dual-tab feed using PagerView with animated tab bar, Zustand store for tab state, and auth-aware Following empty states**

## Performance

- **Duration:** 4 min
- **Started:** 2026-02-06T04:46:40Z
- **Completed:** 2026-02-06T04:51:17Z
- **Tasks:** 2
- **Files created:** 1
- **Files modified:** 2

## Accomplishments
- Rewrote posts.tsx from single-feed to dual-tab PagerView layout with For You and Following sub-tabs
- Created animated tab bar with sliding underline indicator using Reanimated withTiming
- For You feed preserves all existing functionality: pagination, like/unlike/delete with optimistic updates, pull-to-refresh
- Following feed shows auth-aware empty states: sign-in prompt for unauthenticated, "follow people" CTA for authenticated
- "Discover Posts" button on Following tab programmatically switches to For You tab
- Created minimal Zustand store for active tab persistence across navigation
- Added progressViewOffset to FeedList for correct pull-to-refresh positioning behind absolute tab bar
- Renamed Relay fragment from postsScreenFragment to postsScreenForYouFragment with new connection key
- Both Relay and TypeScript compilation pass cleanly

## Task Commits

Each task was committed atomically:

1. **Task 1: Create feed store and PagerView shell with animated tab bar** - `0dbae7a` (feat)
2. **Task 2: Wire For You and Following feeds with pull-to-refresh offset** - `e35ca10` (feat)

## Files Created/Modified
- `lib/stores/feed-store.ts` - Minimal Zustand store for feed active tab (0 = For You, 1 = Following)
- `app/(tabs)/posts.tsx` - Full rewrite: PagerView dual-tab layout with animated tab bar, ForYouFeed (Relay pagination + mutations), FollowingFeed (auth-aware empty states)
- `components/feed/feed-list.tsx` - Added progressViewOffset prop for RefreshControl positioning behind tab bar
- `lib/relay/__generated__/postsScreenForYouFragment.graphql.ts` - Renamed from postsScreenFragment with forYouFeed connection key
- `lib/relay/__generated__/postsScreenForYouPaginationQuery.graphql.ts` - Renamed pagination query for For You fragment
- `lib/relay/__generated__/postsScreenQuery.graphql.ts` - Updated root query to spread ForYou fragment

## Decisions Made
- ForYouFeed and FollowingFeed components are inline in posts.tsx rather than separate files -- they share PagerView ref context and mutation logic, and keeping them co-located makes the PagerView wiring clearer
- Following feed shows empty state only because the backend bibleVersePosts query has no "following" filter parameter -- the CTA navigates to For You tab instead
- Tab bar uses solid background (not blur/semi-transparent) for better performance and simpler implementation
- Connection key renamed from `postsScreen_bibleVersePosts` to `forYouFeed_bibleVersePosts` to prevent future conflicts when Following feed gets its own query
- PagerView page children use `width: '100%', height: '100%'` (not flex: 1) per PagerView documentation requirements
- setPage/onPageSelected loop guarded by comparing position !== currentTab before state updates

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Added progressViewOffset to FeedList RefreshControl**
- **Found during:** Task 2
- **Issue:** Pull-to-refresh indicator would appear behind the absolute-positioned tab bar, making it invisible to users
- **Fix:** Added progressViewOffset prop to FeedList interface and wired it to RefreshControl, set to TAB_BAR_HEIGHT + insets.top in posts.tsx
- **Files modified:** components/feed/feed-list.tsx, app/(tabs)/posts.tsx
- **Commit:** e35ca10

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Minor prop addition for correct visual behavior. No scope creep.

## Issues Encountered
None -- both tasks completed cleanly.

## User Setup Required
None - no external service configuration required. PagerView requires native rebuild for swipe testing on device.

## Next Phase Readiness
- Dual-tab feed is fully navigable via swipe and tap with animated indicator
- For You feed preserves all existing post interaction features
- Following feed ready to wire real data when backend adds following filter
- Feed store persists active tab across navigation
- No blockers for remaining phase work

## Self-Check: PASSED

---
*Phase: 05-feed-engagement*
*Completed: 2026-02-06*
