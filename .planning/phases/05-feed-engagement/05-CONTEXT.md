# Phase 5: Feed & Engagement - Context

**Gathered:** 2026-02-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Social feed with two sub-feeds (For You and Following), engagement interactions (likes, replies, poll voting), and infinite scroll pagination. Post creation (Phase 6) and notifications (Phase 7) are separate phases. Significant UI already exists — this phase wires up the feed structure, adds missing mutations, and refines the experience.

**Already implemented (from earlier phases):**
- `ReflectionItem` component — full post card with Lexical rendering, images, polls, verse badge, like/comment/share/delete actions
- `ReflectionComposer` — rich text editor with images, polls, @mentions, spoiler, fullscreen mode
- `PostsList` — verse-specific posts list component
- `posts.tsx` tab — global feed with FlashList, pagination, pull-to-refresh, like/unlike/delete with optimistic updates
- `post/[id].tsx` — post detail page with replies and composer
- Poll display (shows results after voting/expiry, but no vote mutation)

</domain>

<decisions>
## Implementation Decisions

### Feed structure
- Single "Posts" tab with two nested sub-tabs: "For You" and "Following"
- "For You" = all verse posts (existing `bibleVersePosts` query)
- "Following" = posts from users the current user follows (needs filtered query)
- Swipeable between tabs AND tappable tab labels (Twitter/X style)
- Tab labels only at top — no header bar, no app logo, minimal and clean
- Tapping the Posts tab icon while already on it cycles between For You and Following

### Feed ordering
- Use whatever ordering the backend provides — no client-side sorting
- Backend controls the feed algorithm; mobile consumes as-is

### New posts behavior
- Pull-to-refresh only — no floating "new posts" indicator
- No background refresh when returning from post detail
- Keep scroll position when navigating back from post detail

### Feed state
- Each sub-tab (For You / Following) preserves its own scroll position when switching between them
- Independent pagination state per sub-tab

### Empty state (Following feed)
- Simple message + CTA when following feed is empty
- Friendly illustration + "Follow people to see their posts here"
- Button to navigate to For You feed or discover users

### Like interaction
- Current implementation is sufficient (pink fill + haptic)
- No additional animation needed

### Poll voting
- Confirm-then-reveal pattern: tap option → briefly highlight selected → transition to results view
- Needs vote mutation implementation
- Optimistic update: show selected option highlighted immediately

### Reply threading
- Unlimited depth, Twitter-style
- Tapping a reply navigates to that reply as a new post detail page (already works via `post/[id]` route)
- Each reply is a full post that can have its own replies

### Loading states
- Skeleton card placeholders (3-4 shimmer cards) instead of ActivityIndicator spinner for initial feed load
- Staggered fade-in animation for new items loaded via infinite scroll (matching initial load pattern)

### Claude's Discretion
- Exact skeleton card design and shimmer animation implementation
- PagerView vs react-native-tab-view for the swipeable tabs
- Specific query for "Following" feed (depends on backend API)
- Error state handling for feed load failures
- How to handle unauthenticated users viewing the Following tab

</decisions>

<specifics>
## Specific Ideas

- "Like Twitter/X home screen" — For You / Following as swipeable top tabs
- Tab tap cycles between nested tabs (not scroll-to-top)
- "Confirm then reveal" for poll voting — brief highlight before showing results
- Skeleton cards for loading state (like Twitter/LinkedIn shimmer)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 05-feed-engagement*
*Context gathered: 2026-02-06*
