# Feature Research

**Domain:** React Native Bible Reading & Social Community App
**Researched:** 2026-02-01
**Confidence:** MEDIUM-HIGH (verified through multiple sources including official docs, UX research, and competitor analysis)

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete.

| Feature | Why Expected | Complexity | Mobile-Specific Notes |
|---------|--------------|------------|----------------------|
| **Swipe navigation between chapters** | Standard book-reading gesture on mobile; simulates flipping pages | MEDIUM | Use `react-native-pager-view` for smooth horizontal paging; avoid button-only navigation which feels outdated |
| **Verse tap-to-select** | YouVersion and all major Bible apps use tap-to-select flow | MEDIUM | Show dotted underline on selection; display action menu at bottom (not popover which obscures content) |
| **Verse highlighting with colors** | Core Bible study feature in every Bible app | MEDIUM | Support 5+ colors; sync across devices; only visible in version where added |
| **Bookmarks** | Users expect to save their place | LOW | Smart bookmark that resumes reading position even after app close |
| **Copy/Share verses** | Basic content utility | LOW | Swipe action menu to reveal Copy; support sharing to SMS, email, social media |
| **Offline Bible access** | Mobile users read in transit, planes, areas with poor signal | HIGH | Download entire Bible versions for offline use; offline-first architecture essential |
| **Font size adjustment** | Accessibility requirement; different contexts need different sizes | LOW | Use Dynamic Type on iOS; respect system accessibility settings |
| **Dark/Light mode** | Eye comfort, battery savings on OLED; users expect per-app control | LOW | Respect system preference but allow override; smooth transition animation |
| **Pull-to-refresh on feeds** | Universal mobile pattern for content refresh | LOW | Use RefreshControl with tintColor matching theme |
| **Infinite scroll on feeds** | Standard social feed pattern; no pagination buttons | MEDIUM | Use FlatList with onEndReached; show loading indicator in footer |
| **Push notifications** | Essential for engagement; users expect control over notification types | HIGH | Separate transactional vs promotional; respect user preferences; rich notifications with images |
| **User profiles** | Social identity requirement | MEDIUM | Avatar, bio, follower/following counts, post history |
| **Follow/unfollow users** | Core social networking pattern | MEDIUM | Optimistic UI updates; handle pending states |
| **Like posts** | Basic social engagement | LOW | Haptic feedback on tap; optimistic updates; show like count |
| **Comments on posts** | Essential social interaction | MEDIUM | Support replies (1-2 levels max on mobile); threaded display |
| **Basic search** | Finding specific verses or content | MEDIUM | Autocomplete suggestions; recent searches; highlight matches |

### Differentiators (Competitive Advantage)

Features that set the product apart. Not required, but valued.

| Feature | Value Proposition | Complexity | Mobile-Specific Notes |
|---------|-------------------|------------|----------------------|
| **Posts on specific verses** | Unique community layer tied to scripture context | HIGH | Bridge between Bible reading and social discussion; context-aware posting |
| **Rich text posts with images** | More expressive than plain text; encourages engagement | HIGH | Use webview-based editor or simplified markdown; compress images before upload to max 2MB |
| **Polls on verses** | Interactive engagement tool; theological questions | MEDIUM | Max 5 options to fit mobile screen; tap-to-vote without separate submit; show results after voting |
| **Verse images (shareable)** | Visual content for social sharing outside app | MEDIUM | Generate verse graphics with customizable backgrounds; direct share to Instagram Stories, WhatsApp |
| **Haptic feedback on interactions** | Premium feel; confirms actions without visual distraction | LOW | Use selection haptics for verse tap; impact haptics for likes; success haptics for post creation |
| **Gesture-based actions** | Power user efficiency | MEDIUM | Swipe to bookmark, swipe to share; long-press for context menu |
| **Cross-reference navigation** | Deep Bible study capability | HIGH | Tap verse references to jump; maintain reading history for back navigation |
| **Reading plans/streaks** | Habit formation; gamification of reading | MEDIUM | Daily check-ins; streak counters; gentle push reminders |
| **Audio Bible playback** | Accessibility and multitasking | HIGH | Background playback; sleep timer; playback speed control |
| **Widget support** | Daily engagement without opening app | MEDIUM | Verse of the day widget; iOS 14+ widgets; Android home screen widgets |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| **Real-time everything** | "Users expect instant updates" | Battery drain, complexity, often unnecessary | Use optimistic UI with background sync; real-time only for direct messages or active discussions |
| **Deeply nested comment threads (3+ levels)** | "Enable full discussion hierarchy" | Impossible to read on mobile screens; horizontal scrolling nightmare | Max 2 levels of nesting; Reddit-style "thread scroller" for navigation; collapse by default |
| **Complex rich text editor** | "Full formatting options" | No good native solution; webview editors are laggy; users struggle on mobile keyboards | Simplified markdown subset; or just bold/italic/link; image-first approach |
| **Sync everything immediately** | "Consistency across devices" | Network calls block UI; fails offline; battery drain | Offline-first with background sync; queue actions for batch processing |
| **Pop-up modals for everything** | "Keep user on page" | Blocks content; back button confusion; accessibility issues | Bottom sheets for actions; dedicated screens for forms |
| **Auto-playing video/audio** | "Increase engagement" | Annoying; data usage; unexpected sound in public | Play-on-tap only; show clear preview thumbnails |
| **Complex filtering/sorting on every list** | "Power users need it" | Clutters UI; rarely used on mobile | Sensible defaults; advanced filters in dedicated settings screen |
| **Custom font selection** | "Personalization" | Font rendering issues; large bundle sizes; accessibility problems | 2-3 carefully chosen fonts max; honor system font size preferences |

## Mobile-Specific UX Patterns

### Bible Reading Experience

**Gesture Expectations:**
- **Horizontal swipe**: Navigate between chapters (must feel like page-turning)
- **Vertical scroll**: Read within a chapter
- **Tap on verse**: Select verse, show action menu
- **Long-press on verse**: Alternative selection method
- **Double-tap**: Quick bookmark or highlight with default color
- **Pinch-to-zoom**: Adjust font size (optional, system settings preferred)

**Navigation Patterns:**
- Book/chapter selector as bottom sheet or dedicated picker screen
- Current chapter indicator always visible
- Quick jump to any verse via search
- Back button returns to previous reading position, not just previous screen

**Reading Comfort:**
- Line height optimization for readability
- Proper margins for thumb-reach zones
- Night mode with warm amber tint option
- Auto-brightness adjustment consideration

### Social Feed Experience

**Feed Patterns:**
- Pull-to-refresh with spinner at top
- Infinite scroll with onEndReachedThreshold of 0.5 (start loading before bottom)
- Loading indicator in ListFooterComponent
- Empty state with call-to-action if no posts
- "Scroll to top" FAB after scrolling down

**Interaction Patterns:**
- Like with haptic feedback (impactLight)
- Comment counts visible; tap to expand thread
- Share sheet access via share icon
- User avatar tap navigates to profile
- Post timestamp with relative time ("2h ago")

**Performance Requirements:**
- Use FlashList for large feeds (better recycling than FlatList)
- Lazy load images with placeholder
- Prefetch next page of content
- Cache feed state for instant app resume

### Notification Patterns

**User Expectations (2026 standards):**
- Granular notification controls (not just on/off)
- Separate categories: social (likes, comments, follows), spiritual (verse of day, reading reminders), system
- Quiet hours respect
- Rich notifications with images on iOS/Android
- Deep linking to specific content

**Best Practices:**
- 71% of uninstalls triggered by bad notification practices
- Average user gets 46 push notifications/day - be respectful
- Time-sensitive or highly personalized only
- 40% of users interact within an hour - make CTAs clear

### Offline-First Requirements

**Core Principle:** Save locally first, sync in background. Never show "please check your connection" for local actions.

**Offline Capabilities:**
- Bible text: Fully available offline after download
- Highlights/bookmarks: Saved locally, synced when online
- Draft posts: Saved locally, queued for posting
- Feed: Cached version available; stale indicator shown
- Search: Offline search of downloaded Bible versions

**Sync Strategy:**
- Conflict resolution: Server wins for content, merge for user edits (highlights, notes)
- Queue offline actions for batch sync
- Background sync when app regains connectivity
- Clear sync status indicators

## Feature Dependencies

```
Core Reading Features
    [Bible Display]
        |
        +---> [Verse Selection] ---> [Highlighting]
        |                       |
        |                       +---> [Copy/Share]
        |                       |
        |                       +---> [Post on Verse]
        |
        +---> [Chapter Navigation (Swipe)]
        |
        +---> [Offline Download]

Social Features
    [User Authentication]
        |
        +---> [User Profile] ---> [Follow System]
        |                    |
        |                    +---> [Follower/Following Lists]
        |
        +---> [Posts] ---> [Likes]
        |            |
        |            +---> [Comments] ---> [Nested Replies]
        |            |
        |            +---> [Polls]
        |
        +---> [Notifications]

Settings
    [Settings Screen]
        |
        +---> [Theme (Dark/Light)]
        |
        +---> [Font Size]
        |
        +---> [Language]
        |
        +---> [Notification Preferences]
```

### Dependency Notes

- **Verse Selection requires Bible Display:** Can't select what isn't rendered
- **Highlighting requires Verse Selection:** Must select before applying highlight
- **Post on Verse requires both Verse Selection AND User Authentication:** Social feature tied to reading
- **Comments require Posts:** No orphan comments
- **Notifications require all social features:** Can't notify about nonexistent interactions
- **Follow System requires User Profiles:** Must have identity before relationships

### Conflicts to Avoid

- **Rich text editor + Offline-first:** Complex editors depend on web tech; offline sync of rich content is tricky. Consider: simplified formatting that serializes to plain markdown.
- **Real-time updates + Battery optimization:** Pick your battles. Real-time for active screens only.

## MVP Definition

### Launch With (v1)

Minimum viable product - what's needed to validate the concept as a mobile Bible + community app.

- [ ] **Bible chapter reading with swipe navigation** - Core value prop; must feel native
- [ ] **Verse tap-to-select** - Foundation for all Bible interactions
- [ ] **Basic highlighting (single color minimum)** - Table stakes for Bible apps
- [ ] **Offline Bible (at least one version)** - Mobile users expect offline access
- [ ] **User registration/login** - Required for social features
- [ ] **Create posts on verses** - Core differentiator of Selah
- [ ] **View social feed of posts** - Basic discovery
- [ ] **Like posts** - Minimal engagement mechanism
- [ ] **Basic comments (no nesting for MVP)** - Social interaction
- [ ] **User profiles (view only)** - Basic identity
- [ ] **Dark/Light theme** - Expected customization
- [ ] **Font size adjustment** - Accessibility requirement
- [ ] **Push notifications for social actions** - Re-engagement

### Add After Validation (v1.x)

Features to add once core is working and users are engaged.

- [ ] **Multiple highlight colors** - When usage shows people highlight frequently
- [ ] **Follow system** - When user base is large enough for social graph
- [ ] **Nested comment replies** - When discussions get substantive
- [ ] **Rich text in posts (images)** - When plain text feels limiting
- [ ] **Polls** - When community engagement patterns emerge
- [ ] **Verse sharing/images** - When growth becomes a goal
- [ ] **Search for verses** - When content volume demands it
- [ ] **Bookmarks** - When reading sessions are long enough
- [ ] **Multiple Bible versions** - When users request

### Future Consideration (v2+)

Features to defer until product-market fit is established.

- [ ] **Audio Bible** - High complexity; requires content licensing
- [ ] **Reading plans/streaks** - Gamification after core engagement proven
- [ ] **Widgets** - Platform polish after core value established
- [ ] **Cross-reference navigation** - Power user feature
- [ ] **Language localization** - After English market validation

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Swipe chapter navigation | HIGH | MEDIUM | P1 |
| Verse selection + highlighting | HIGH | MEDIUM | P1 |
| Offline Bible | HIGH | HIGH | P1 |
| Posts on verses | HIGH | MEDIUM | P1 |
| Social feed (infinite scroll) | HIGH | MEDIUM | P1 |
| Like posts | HIGH | LOW | P1 |
| Comments (flat) | HIGH | MEDIUM | P1 |
| User profiles | MEDIUM | MEDIUM | P1 |
| Push notifications | HIGH | HIGH | P1 |
| Dark/Light theme | HIGH | LOW | P1 |
| Font size | MEDIUM | LOW | P1 |
| Follow system | MEDIUM | MEDIUM | P2 |
| Multiple highlight colors | MEDIUM | LOW | P2 |
| Nested comments | MEDIUM | MEDIUM | P2 |
| Images in posts | MEDIUM | HIGH | P2 |
| Polls | MEDIUM | MEDIUM | P2 |
| Verse image sharing | MEDIUM | MEDIUM | P2 |
| Search | MEDIUM | MEDIUM | P2 |
| Bookmarks | MEDIUM | LOW | P2 |
| Audio Bible | MEDIUM | HIGH | P3 |
| Reading plans | MEDIUM | HIGH | P3 |
| Widgets | LOW | MEDIUM | P3 |
| Cross-references | LOW | HIGH | P3 |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration

## Competitor Feature Analysis

| Feature | YouVersion | Logos | Selah (Our Approach) |
|---------|------------|-------|----------------------|
| Bible reading | Swipe between chapters; tap to select verses | Tap to select; extensive study tools | Swipe navigation; tap-to-select with immediate action menu |
| Highlighting | 5+ colors; visible only in version added | Extensive markup tools | 5 colors; sync across versions for same verse |
| Social features | Share verse images; limited community | None | Full social feed on verses; posts, likes, comments |
| Notes | Private notes on verses | Extensive notes with linking | Public posts on verses (community notes) |
| Offline | Download individual versions | Full library offline | Offline-first architecture; Bible + cached content |
| Profiles | Basic account; reading streak | Account for purchases | Full social profiles with follow system |
| Notifications | Verse of day; reading reminders | Purchase/update alerts | Social notifications + verse of day |
| Rich content | Verse images; video clips | Video courses | Posts with images and polls |

## React Native Implementation Notes

### Key Libraries

| Feature | Recommended Library | Notes |
|---------|---------------------|-------|
| Swipe navigation | react-native-pager-view | Used by React Navigation's TabView; native performance |
| Gestures | react-native-gesture-handler | Foundation for swipe, long-press, pan |
| Haptics | react-native-haptic-feedback | iOS Taptic Engine + Android vibration |
| Image picker | expo-image-picker or react-native-image-crop-picker | With compression before upload |
| Image compression | react-native-compressor or expo-image-manipulator | WhatsApp-quality compression |
| Lists | @shopify/flash-list | Better than FlatList for large feeds |
| Offline storage | WatermelonDB or MMKV | SQLite-based for complex queries; MMKV for key-value |
| Push notifications | expo-notifications or react-native-firebase | FCM for Android, APNs for iOS |
| Infinite scroll | React Query useInfiniteQuery | Built-in pagination state management |

### Performance Considerations

- **Swipeable in FlatList**: Known performance issues with gesture handler; consider custom implementation
- **Large Bible text**: Virtualize chapter content; don't render entire book at once
- **Image loading**: Use expo-image or react-native-fast-image with caching
- **Feed performance**: Use FlashList over FlatList for 10x better recycling

## Sources

### Bible App UX
- [YouVersion Support - Highlighting](https://help.youversion.com/l/en/article/ie1gz0nsr7-highlights-ios) (HIGH confidence)
- [YouVersion Support - Copy/Share](https://help.youversion.com/l/en/article/6nmv44gg2m-sharing) (HIGH confidence)
- [Mobile Navigation UX Best Practices 2026](https://www.designstudiouiux.com/blog/mobile-navigation-ux/) (MEDIUM confidence)
- [Unique Bible App Navigation](https://www.uniquebible.app/mobile/navigation) (MEDIUM confidence)

### Social Features
- [React Native Social SDK](https://www.social.plus/social/sdk/react-native) (MEDIUM confidence)
- [Stream Activity Feeds - React Native](https://getstream.io/activity-feeds/docs/react-native/social_network/) (HIGH confidence)
- [Building Social Media with React Native](https://www.reactnativeappdeveloper.com/blog/how-to-build-a-social-media-platform-using-react-native/) (MEDIUM confidence)

### Mobile UX Patterns
- [Baymard - Autocomplete Best Practices](https://baymard.com/blog/autocomplete-design) (HIGH confidence)
- [Algolia - Mobile Search UX](https://www.algolia.com/blog/ux/mobile-search-ux-best-practices) (HIGH confidence)
- [Comment Thread Design Examples](https://www.subframe.com/tips/comment-thread-design-examples) (MEDIUM confidence)

### Push Notifications
- [Reteno - Push Notification Best Practices 2026](https://reteno.com/blog/push-notification-best-practices-ultimate-guide-for-2026) (MEDIUM confidence)
- [Appbot - App Push Notifications 2026](https://appbot.co/blog/app-push-notifications-2026-best-practices/) (MEDIUM confidence)

### React Native Implementation
- [Expo ImagePicker Docs](https://docs.expo.dev/versions/latest/sdk/imagepicker/) (HIGH confidence)
- [React Navigation TabView](https://reactnavigation.org/docs/7.x/tab-view/) (HIGH confidence)
- [Mastering Media Uploads 2026](https://dev.to/fasthedeveloper/mastering-media-uploads-in-react-native-images-videos-smart-compression-2026-guide-5g2i) (MEDIUM confidence)
- [Haptics Design Principles - Android](https://developer.android.com/develop/ui/views/haptics/haptics-principles) (HIGH confidence)

### Offline-First
- [Building Offline-First React Native Apps 2026](https://javascript.plainenglish.io/building-offline-first-react-native-apps-the-complete-guide-2026-68ff77c7bb06) (MEDIUM confidence)

---
*Feature research for: Selah Mobile - React Native Bible/Social App*
*Researched: 2026-02-01*
