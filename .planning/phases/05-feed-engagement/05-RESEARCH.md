# Phase 5: Feed & Engagement - Research

**Researched:** 2026-02-06
**Domain:** Social feed with swipeable tabs, engagement interactions (likes, replies, poll voting), skeleton loading
**Confidence:** HIGH

## Summary

This phase wires up the dual-tab feed structure (For You / Following), adds poll voting mutations, implements skeleton loading states, and refines the existing feed experience. Significant UI already exists: `ReflectionItem`, `ReflectionComposer`, `PostsList`, `posts.tsx` (global feed with FlashList + pagination), and `post/[id].tsx` (post detail with replies).

The standard approach uses `react-native-pager-view` (already installed v6.9.1) for the swipeable For You / Following sub-tabs, with a custom minimal tab bar at the top. The GraphQL schema already has `pollVote(optionId: ID!, pollId: ID!)` and `pollUnvote(pollId: ID!)` mutations that just need client-side wiring. For the "Following" feed, the root `bibleVersePosts` query on `Query` type currently takes no filter parameter -- a new backend query or filter argument will likely be needed.

**Primary recommendation:** Use PagerView directly (not react-native-tab-view) for the two-tab feed, keeping the implementation lightweight and consistent with the existing dependency. Implement a custom tab bar header with animated underline indicator. Wire poll vote mutation with optimistic updates using Relay store manipulation.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

#### Feed structure
- Single "Posts" tab with two nested sub-tabs: "For You" and "Following"
- "For You" = all verse posts (existing `bibleVersePosts` query)
- "Following" = posts from users the current user follows (needs filtered query)
- Swipeable between tabs AND tappable tab labels (Twitter/X style)
- Tab labels only at top -- no header bar, no app logo, minimal and clean
- Tapping the Posts tab icon while already on it cycles between For You and Following

#### Feed ordering
- Use whatever ordering the backend provides -- no client-side sorting
- Backend controls the feed algorithm; mobile consumes as-is

#### New posts behavior
- Pull-to-refresh only -- no floating "new posts" indicator
- No background refresh when returning from post detail
- Keep scroll position when navigating back from post detail

#### Feed state
- Each sub-tab (For You / Following) preserves its own scroll position when switching between them
- Independent pagination state per sub-tab

#### Empty state (Following feed)
- Simple message + CTA when following feed is empty
- Friendly illustration + "Follow people to see their posts here"
- Button to navigate to For You feed or discover users

#### Like interaction
- Current implementation is sufficient (pink fill + haptic)
- No additional animation needed

#### Poll voting
- Confirm-then-reveal pattern: tap option -> briefly highlight selected -> transition to results view
- Needs vote mutation implementation
- Optimistic update: show selected option highlighted immediately

#### Reply threading
- Unlimited depth, Twitter-style
- Tapping a reply navigates to that reply as a new post detail page (already works via `post/[id]` route)
- Each reply is a full post that can have its own replies

#### Loading states
- Skeleton card placeholders (3-4 shimmer cards) instead of ActivityIndicator spinner for initial feed load
- Staggered fade-in animation for new items loaded via infinite scroll (matching initial load pattern)

### Claude's Discretion
- Exact skeleton card design and shimmer animation implementation
- PagerView vs react-native-tab-view for the swipeable tabs
- Specific query for "Following" feed (depends on backend API)
- Error state handling for feed load failures
- How to handle unauthenticated users viewing the Following tab

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react-native-pager-view | 6.9.1 | Swipeable For You / Following tabs | Already installed, native ViewPager on Android / UIPageViewController on iOS, 60fps performance |
| react-relay | 20.1.1 | Data fetching, pagination, mutations | Already the project's data layer; usePaginationFragment for independent feed pagination |
| @shopify/flash-list | 2.0.2 | Virtualized feed lists | Already used in posts.tsx; handles infinite scroll efficiently |
| react-native-reanimated | ~4.1.1 | Skeleton shimmer animation, tab indicator, fade-in | Already used throughout; useSharedValue + withRepeat for shimmer |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| expo-haptics | ~15.0.8 | Tactile feedback on poll vote, tab switch | Already used for like/unlike; use for poll voting confirmation |
| react-native-safe-area-context | ~5.6.0 | Safe area insets for feed header | Already used; needed for top tab bar positioning |
| lucide-react-native | 0.563.0 | Icons for empty states | Already used throughout the app |
| zustand | 5.0.11 | Feed tab state persistence (active tab index) | Already used for verse selection store; lightweight state for tab cycling |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| PagerView (raw) | react-native-tab-view | Tab-view is a higher-level wrapper around PagerView with built-in tab bar. However, it adds an extra dependency and the built-in Material Design tab bar would need full restyling. Since we need a very minimal custom tab bar (just two text labels with underline), raw PagerView gives us full control with less overhead. |
| Custom shimmer | react-native-skeleton-placeholder | Adds a dependency; the app already has a shimmer pattern in ChapterSkeleton using Reanimated. Keeping it consistent with the existing codebase is better. |

**No new dependencies needed.** Everything required is already installed.

## Architecture Patterns

### Recommended Project Structure
```
app/(tabs)/posts.tsx          # Refactored: PagerView host with For You / Following
components/feed/
  feed-tab-bar.tsx            # Custom minimal tab bar (For You | Following)
  feed-skeleton.tsx           # Skeleton post cards for loading state
  for-you-feed.tsx            # For You feed content (refactored from current PostsFeed)
  following-feed.tsx          # Following feed content (new, similar structure)
  following-empty-state.tsx   # Empty state CTA for Following feed
components/verse/
  reflection-item.tsx         # Existing (add onVote prop for poll voting)
```

### Pattern 1: PagerView for Two-Tab Feed
**What:** Use PagerView with 2 pages for For You and Following, with a custom header tab bar
**When to use:** Twitter/X style swipeable top tabs with minimal chrome

```typescript
// Source: react-native-pager-view docs + codebase pattern
import PagerView from 'react-native-pager-view';

function PostsScreen() {
  const pagerRef = useRef<PagerView>(null);
  const [activeTab, setActiveTab] = useState(0);

  const handlePageSelected = useCallback((e: { nativeEvent: { position: number } }) => {
    setActiveTab(e.nativeEvent.position);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <FeedTabBar
        activeTab={activeTab}
        onTabPress={(index) => {
          pagerRef.current?.setPage(index);
        }}
      />
      <PagerView
        ref={pagerRef}
        style={{ flex: 1 }}
        initialPage={0}
        onPageSelected={handlePageSelected}
      >
        <View key="0" style={{ width: '100%', height: '100%' }} collapsable={false}>
          <ForYouFeed />
        </View>
        <View key="1" style={{ width: '100%', height: '100%' }} collapsable={false}>
          <FollowingFeed />
        </View>
      </PagerView>
    </View>
  );
}
```

**Critical PagerView notes (from official docs):**
- Children must use `width: '100%', height: '100%'` NOT `flex: 1` (flex doesn't work in PagerView children)
- Android children need `collapsable={false}` to prevent view flattening
- `setPage` triggers `onPageSelected` -- guard against infinite loops in state sync
- iOS may throw hierarchy errors; wrap `setPage` in `requestAnimationFrame` if needed

### Pattern 2: Independent Pagination per Sub-Tab
**What:** Each feed tab has its own Relay pagination fragment, independent scroll position, and connection ID
**When to use:** When sub-tabs show different data sets with separate cursors

```typescript
// Each feed component uses its own usePaginationFragment
// For You: existing postsScreenFragment on Query.bibleVersePosts
// Following: new fragment on a filtered query (TBD based on backend)

// The PagerView naturally preserves each child's scroll position
// when switching between tabs -- no manual scroll restoration needed
```

**Key insight:** PagerView keeps both children mounted, so each FlashList maintains its own scroll position and pagination state naturally. No need for manual scroll position saving/restoring.

### Pattern 3: Poll Vote Mutation with Optimistic Update
**What:** Use Relay optimisticUpdater to immediately show poll results after voting
**When to use:** When user taps a poll option

```typescript
// Schema: pollVote(optionId: ID!, pollId: ID!): PollVotePayload!
// PollVotePayload { poll: Poll! }

const PollVoteMutation = graphql`
  mutation feedPollVoteMutation($pollId: ID!, $optionId: ID!) {
    pollVote(pollId: $pollId, optionId: $optionId) {
      poll {
        id
        totalVotes
        isExpired
        userVote {
          id
          text
        }
        options {
          id
          text
          voteCount
          votePercentage
        }
      }
    }
  }
`;

// Optimistic updater sets userVote and recalculates percentages
commitVote({
  variables: { pollId, optionId },
  optimisticUpdater: (store) => {
    const poll = store.get(pollId);
    if (!poll) return;

    // Set userVote on the poll
    const option = store.get(optionId);
    if (option) {
      const userVote = store.create(`client:userVote:${optionId}`, 'PollUserVote');
      userVote.setValue(optionId, 'id');
      userVote.setValue(option.getValue('text'), 'text');
      poll.setLinkedRecord(userVote, 'userVote');
    }

    // Increment totalVotes
    const total = (poll.getValue('totalVotes') as number) ?? 0;
    poll.setValue(total + 1, 'totalVotes');

    // Increment selected option's voteCount
    if (option) {
      const count = (option.getValue('voteCount') as number) ?? 0;
      option.setValue(count + 1, 'voteCount');
    }
  },
});
```

### Pattern 4: Tab Icon Cycling (NativeTabs Constraint)
**What:** Tapping the Posts tab icon while already on it cycles between For You and Following
**Constraint:** NativeTabs (expo-router/unstable-native-tabs) does NOT expose `tabPress` event listeners

**Workaround options:**
1. **Switch from NativeTabs to JavaScript Tabs (Tabs component)** -- JavaScript tabs from `@react-navigation/bottom-tabs` DO support `listeners={{ tabPress: ... }}`. This would require refactoring `_layout.tsx` but gives full control.
2. **Use `useNavigation` with `addListener`** -- In the posts.tsx screen component, listen for navigation focus events and track consecutive focuses to detect "re-tap". This is fragile.
3. **Use `disablePopToTop` + observe scroll position** -- Detect when tab is pressed by observing that the default scroll-to-top behavior fires.

**Recommendation:** Option 1 (switch to JavaScript Tabs) is the most reliable. The NativeTabs API is explicitly "unstable" and lacks event support. JavaScript Tabs provide the `tabPress` listener needed for tab cycling. The visual difference is negligible since `Label hidden` is already used (icon-only tabs). However, if the user strongly prefers NativeTabs, option 2 can work with a zustand store tracking the active tab, and the parent layout observing navigation events.

**Alternative approach for NativeTabs:** Since NativeTabs doesn't support tabPress interception, the tab cycling feature could be deferred or implemented differently -- e.g., a long-press gesture on the tab bar area, or only using the swipe gesture and top tab labels (without the bottom tab cycling). This needs a user decision.

### Pattern 5: Skeleton Cards with Shimmer
**What:** Feed loading state shows shimmer skeleton cards matching post card layout
**Existing pattern:** ChapterSkeleton uses Reanimated `useSharedValue` + `withRepeat(withTiming(1, { duration: 1200 }), -1, false)` for shimmer

```typescript
// Consistent with existing ChapterSkeleton pattern
function FeedSkeleton() {
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 1200 }),
      -1,
      false
    );
  }, []);

  // ShimmerBar component using interpolate(shimmer.value, [0, 0.5, 1], [0.4, 0.7, 0.4])
  // Render 3-4 skeleton cards matching ReflectionItem layout:
  // - Circle (avatar) + Rectangle (name) + Rectangle (time)
  // - Rectangles (content lines)
  // - Rectangle (action bar)
}
```

### Anti-Patterns to Avoid
- **Don't use `flex: 1` on PagerView children:** They need explicit `width: '100%', height: '100%'`
- **Don't share pagination state between tabs:** Each sub-feed must have independent `usePaginationFragment` calls with distinct `@connection` keys
- **Don't use `react-native-tab-view` just for two tabs:** Adds unnecessary dependency weight when PagerView is already installed and only two pages are needed
- **Don't re-fetch when navigating back from post detail:** User decision is to keep scroll position and not background refresh
- **Don't animate poll result percentages on initial render:** Only animate the confirm-then-reveal transition for the voting action itself

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Swipeable tab pages | Custom gesture-based page switching | PagerView | Native pager handles edge cases (velocity, interruption, rubber-banding) |
| Feed pagination | Manual cursor tracking + fetch | Relay `usePaginationFragment` | Handles cursor management, deduplication, cache normalization |
| Optimistic UI for mutations | Manual state + rollback | Relay `optimisticUpdater` | Automatic rollback on failure, integrated with normalized cache |
| Skeleton shimmer | Third-party skeleton library | Reanimated `withRepeat` + opacity interpolation | Already established pattern in codebase (ChapterSkeleton) |
| Scroll position preservation | Manual scroll offset save/restore | PagerView keeps children mounted | Both pages stay in memory, FlashList maintains position naturally |

**Key insight:** PagerView's native implementation handles scroll position preservation between tabs for free because it keeps both children mounted. No manual `scrollToOffset` or position saving is needed.

## Common Pitfalls

### Pitfall 1: PagerView Children Flex Issue
**What goes wrong:** Children render with zero height or incorrect layout
**Why it happens:** PagerView children cannot use `flex: 1`; they need explicit dimensions
**How to avoid:** Always use `style={{ width: '100%', height: '100%' }}` on direct PagerView children
**Warning signs:** Feed content doesn't appear or appears collapsed

### Pitfall 2: Android View Flattening in PagerView
**What goes wrong:** Child views disappear or don't render on Android
**Why it happens:** React Native's view flattening optimization removes "unnecessary" View wrappers
**How to avoid:** Add `collapsable={false}` to View children of PagerView
**Warning signs:** Works on iOS but not Android

### Pitfall 3: setPage Triggers onPageSelected Loop
**What goes wrong:** Infinite loop when programmatically switching pages
**Why it happens:** `setPage()` fires `onPageSelected`, which updates state, which calls `setPage()` again
**How to avoid:** Guard state updates: only update if the position actually changed
**Warning signs:** App freezes or rapid tab flickering

### Pitfall 4: Following Feed Query Missing from Backend
**What goes wrong:** No way to fetch posts only from followed users
**Why it happens:** The current GraphQL schema `bibleVersePosts` on `Query` has no filter parameter for following-only
**How to avoid:** Check if backend supports a filter argument; if not, implement as client-side filter of the existing query (slower) or request backend addition
**Warning signs:** No `followingPosts` or `bibleVersePosts(filter: FOLLOWING)` in schema

### Pitfall 5: Poll Vote Optimistic Update Complexity
**What goes wrong:** Percentages don't add up to 100% after optimistic update
**Why it happens:** Recalculating all option percentages client-side during optimistic update is error-prone
**How to avoid:** For the optimistic update, just set `userVote`, increment `totalVotes` and the selected option's `voteCount`. Let the server response (which includes correct `votePercentage` for all options) replace the optimistic values. The brief visual discrepancy in percentages is acceptable.
**Warning signs:** Options showing >100% total or negative percentages

### Pitfall 6: NativeTabs Tab Press Event Limitation
**What goes wrong:** Cannot detect when user taps the Posts tab while already on it
**Why it happens:** NativeTabs (expo-router/unstable-native-tabs) does not expose `tabPress` event listeners
**How to avoid:** Either switch to JavaScript Tabs for event access, or implement tab cycling through top tab labels only (not bottom tab)
**Warning signs:** Bottom tab cycling feature doesn't work

### Pitfall 7: Relay Connection Key Conflicts
**What goes wrong:** Both feeds share pagination state or refetching one feed resets the other
**Why it happens:** Using the same `@connection` key for both For You and Following fragments
**How to avoid:** Use distinct connection keys: `forYouFeed_bibleVersePosts` and `followingFeed_bibleVersePosts` (or `followingFeed_followingPosts` depending on the actual query field name)
**Warning signs:** Switching tabs causes the other tab to lose its data or pagination position

## Code Examples

### Feed Tab Bar (Custom Minimal Header)
```typescript
// Source: Custom implementation following Twitter/X pattern
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';

interface FeedTabBarProps {
  activeTab: number;
  onTabPress: (index: number) => void;
}

const TAB_LABELS = ['For You', 'Following'];

function FeedTabBar({ activeTab, onTabPress }: FeedTabBarProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  // Animated indicator position
  const indicatorX = useSharedValue(0);

  useEffect(() => {
    indicatorX.value = withSpring(activeTab * TAB_WIDTH, {
      damping: 20,
      stiffness: 200,
    });
  }, [activeTab]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
  }));

  return (
    <View style={{
      paddingTop: insets.top,
      backgroundColor: colors.bg,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    }}>
      <View style={{ flexDirection: 'row' }}>
        {TAB_LABELS.map((label, index) => (
          <Pressable
            key={label}
            onPress={() => onTabPress(index)}
            style={{ flex: 1, alignItems: 'center', paddingVertical: 14 }}
          >
            <Text style={{
              fontSize: 15,
              fontWeight: activeTab === index ? '700' : '500',
              color: activeTab === index ? colors.text : colors.textMuted,
            }}>
              {label}
            </Text>
          </Pressable>
        ))}
        {/* Animated underline indicator */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              bottom: 0,
              width: TAB_WIDTH,
              height: 3,
              backgroundColor: colors.accent,
              borderRadius: 1.5,
            },
            indicatorStyle,
          ]}
        />
      </View>
    </View>
  );
}
```

### Poll Vote Mutation
```typescript
// Source: GraphQL schema + Relay mutation pattern
const PollVoteMutation = graphql`
  mutation postsScreenPollVoteMutation($pollId: ID!, $optionId: ID!) {
    pollVote(pollId: $pollId, optionId: $optionId) {
      poll {
        id
        totalVotes
        isExpired
        userVote {
          id
          text
        }
        options {
          id
          text
          voteCount
          votePercentage
        }
      }
    }
  }
`;
```

### Skeleton Feed Card
```typescript
// Source: Consistent with existing ChapterSkeleton pattern (Reanimated)
function FeedSkeletonCard({ shimmer }: { shimmer: Animated.SharedValue<number> }) {
  const colors = useColors();

  const ShimmerBar = ({ width, height, style }: {
    width: number | string;
    height: number;
    style?: ViewStyle;
  }) => {
    const animatedStyle = useAnimatedStyle(() => {
      const opacity = interpolate(shimmer.value, [0, 0.5, 1], [0.4, 0.7, 0.4]);
      return { opacity };
    });

    return (
      <Animated.View style={[
        { width, height, backgroundColor: colors.surfaceElevated, borderRadius: height / 2 },
        animatedStyle,
        style,
      ]} />
    );
  };

  return (
    <View style={{ paddingHorizontal: 16, paddingVertical: 14, flexDirection: 'row', gap: 12 }}>
      {/* Avatar */}
      <ShimmerBar width={44} height={44} style={{ borderRadius: 22 }} />
      <View style={{ flex: 1, gap: 8 }}>
        {/* Header: name + time */}
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <ShimmerBar width={100} height={14} />
          <ShimmerBar width={40} height={14} />
        </View>
        {/* Content lines */}
        <ShimmerBar width="95%" height={14} />
        <ShimmerBar width="80%" height={14} />
        <ShimmerBar width="60%" height={14} />
        {/* Action bar */}
        <View style={{ flexDirection: 'row', gap: 24, marginTop: 8 }}>
          <ShimmerBar width={30} height={14} />
          <ShimmerBar width={30} height={14} />
          <ShimmerBar width={30} height={14} />
        </View>
      </View>
    </View>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| ActivityIndicator spinner for loading | Skeleton shimmer placeholders | Industry standard since 2020 | Reduces perceived loading time, feels more polished |
| react-native-tab-view for all tabbed views | PagerView directly for simple 2-tab layouts | Ongoing | Less overhead, full control over tab bar styling |
| Manual scroll restoration | PagerView keeps children mounted | Always been the case | No code needed for scroll position preservation |
| Client-side feed filtering | Server-side feed queries | Standard practice | Less data transfer, better performance |

**Deprecated/outdated:**
- `ActivityIndicator` for initial feed load: Replace with skeleton cards per user decision
- `PostsSkeleton` component (current): Uses ActivityIndicator, needs replacement with shimmer skeleton cards

## Open Questions

1. **Following Feed Backend Query**
   - What we know: The schema has `bibleVersePosts` on `Query` (all posts) and `bibleVersePosts` on `User` (user's posts). Neither has a "following only" filter.
   - What's unclear: Does the backend support or plan to add a `followingBibleVersePosts` query or a filter parameter like `bibleVersePosts(filter: FOLLOWING)`?
   - Recommendation: For now, plan to query a hypothetical `followingBibleVersePosts` field. If it doesn't exist yet, create a placeholder that shows the empty state and add a backend request. The "For You" feed works today; the "Following" feed needs backend coordination. Alternatively, the existing `bibleVersePosts` might already return only followed-user posts when the user is authenticated -- this needs testing.

2. **NativeTabs vs JavaScript Tabs for Tab Press Cycling**
   - What we know: NativeTabs does NOT support `tabPress` listeners. JavaScript Tabs (from `@react-navigation/bottom-tabs` via expo-router) DO support them.
   - What's unclear: Whether switching to JavaScript Tabs is acceptable to the user (visual/behavioral differences are minimal since label is already hidden).
   - Recommendation: Switch to JavaScript Tabs (`Tabs` from expo-router) to get `tabPress` listener support. Alternatively, implement tab cycling only through the top tab bar labels (swipe or tap) and skip the bottom tab cycling feature. The top tab labels + swipe already provide two ways to switch -- bottom tab cycling is a nice-to-have.

3. **Unauthenticated Users and Following Tab**
   - What we know: The app uses an open-browsing pattern (no forced login).
   - What's unclear: What to show unauthenticated users on the Following tab.
   - Recommendation: Show a sign-in prompt with a friendly message like "Sign in to see posts from people you follow." Use the existing `SignInSheet` bottom sheet pattern. The For You tab should work for unauthenticated users.

## Sources

### Primary (HIGH confidence)
- Codebase analysis: `app/(tabs)/posts.tsx`, `app/post/[id].tsx`, `components/verse/reflection-item.tsx`, `components/bible/chapter-skeleton.tsx`, `components/profile/profile-skeleton.tsx`
- `schema.graphql` -- Full GraphQL schema with `pollVote`, `pollUnvote` mutations verified
- [react-native-pager-view GitHub](https://github.com/callstack/react-native-pager-view) -- Props, methods, known issues
- [Expo Router Native Tabs docs](https://docs.expo.dev/versions/latest/sdk/router-native-tabs/) -- Confirmed no tabPress event support
- [React Navigation Bottom Tab Navigator docs](https://reactnavigation.org/docs/bottom-tab-navigator/#events) -- tabPress event listener API
- [React Navigation Tab View docs](https://reactnavigation.org/docs/tab-view/) -- TabView API and customization
- [Relay Pagination docs](https://relay.dev/docs/guided-tour/list-data/pagination/) -- usePaginationFragment for independent connections

### Secondary (MEDIUM confidence)
- [Relay Mutations docs](https://relay.dev/docs/guided-tour/updating-data/graphql-mutations/) -- optimisticUpdater patterns for poll voting
- [Callstack shimmer blog](https://www.callstack.com/blog/performant-and-cross-platform-shimmers-in-react-native-apps) -- Shimmer performance best practices

### Tertiary (LOW confidence)
- Web search: react-native skeleton library landscape -- used for awareness, not for library selection (we're using existing Reanimated pattern)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- All libraries already installed and proven in codebase
- Architecture: HIGH -- PagerView pattern is well-documented, Relay pagination pattern is established
- Pitfalls: HIGH -- Verified through official docs and codebase analysis
- Following feed query: LOW -- Backend may not have the required query yet; needs coordination
- NativeTabs limitation: HIGH -- Verified through official Expo docs that tabPress is unsupported

**Research date:** 2026-02-06
**Valid until:** 2026-03-06 (30 days -- stable ecosystem, no major version changes expected)
