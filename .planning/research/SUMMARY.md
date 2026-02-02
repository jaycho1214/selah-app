# Project Research Summary

**Project:** Selah Mobile - React Native Bible Social App
**Domain:** Mobile Bible reading + social sharing platform
**Researched:** 2026-02-02
**Confidence:** HIGH

## Executive Summary

Selah Mobile is a React Native/Expo app that combines Bible reading with social sharing. The research reveals this is a well-documented domain with mature patterns. The Expo SDK 54 + React Native 0.81 (New Architecture) provides a solid foundation. The key architectural decision is maintaining consistency with the web codebase through Relay (GraphQL client), while accepting that UI components must be completely rewritten for mobile.

The recommended approach follows proven patterns from YouVersion (1B+ installs) and similar apps: offline-first Bible storage using SQLite, social features via Relay matching the web API, and mobile-native UX patterns (bottom tabs, swipe navigation, haptics). The critical insight is clear data source separation - SQLite for Bible content that must work offline, Relay for social features that are inherently online.

The highest risks are: rich text editing (Lexical is web-only, requiring a React Native solution), offline storage architecture (needs careful design to avoid sync conflicts), and mobile-specific integration points (push notifications, deep linking, Apple Sign-In). These risks are manageable with early prototyping, established libraries (WatermelonDB for offline, 10tap-editor for rich text), and comprehensive testing on development builds.

## Key Findings

### Recommended Stack

The React Native ecosystem has matured significantly for this use case. Expo provides managed workflow with excellent DX, Relay works identically to web (enabling code sharing for data fetching), and NativeWind v4 brings Tailwind to React Native. The hardest problem is rich text editing since Lexical is web-only.

**Core technologies:**
- Expo SDK 54 + React Native 0.81: De-facto standard with New Architecture enabled, managed workflow with EAS for builds/updates
- react-relay 20.1.1: Matches web exactly, same patterns and compiler, enables sharing GraphQL fragments
- NativeWind v4 + gluestack-ui v3: Tailwind mental model with accessible component library optimized for Expo SDK 54
- @10play/tentap-editor: Best current RN rich text solution, Tiptap/ProseMirror-based, requires strategy for Lexical compatibility
- @nozbe/watermelondb: Offline database with lazy loading, reactive queries, and sync primitives for Bible content
- @better-auth/expo: Matches web auth, supports native ID token flow for Google/Apple Sign-In
- expo-notifications: Official solution for push via FCM/APNs, requires development build for testing

**Critical version constraints:**
- Tailwind CSS must be v3.4.x (NOT v4.x) for NativeWind v4 compatibility
- gluestack-ui v3 explicitly optimized for Expo SDK 54
- Push notifications not supported in Expo Go (SDK 53+), requires dev client

### Expected Features

Mobile Bible apps have established patterns. Users expect multi-translation reading, offline access, highlights/bookmarks/notes, adjustable fonts, dark mode, and cloud sync. These are table stakes. Selah's differentiator is verse-centric social posts with a community feed, reading plans with friends, and tight integration between reading and sharing.

**Must have (table stakes):**
- Multi-translation Bible reading with offline access (complexity: HIGH)
- Highlights with colors, bookmarks, private notes (complexity: MEDIUM)
- Full-text search across Bible content (complexity: MEDIUM)
- Authentication (Google + Apple required for App Store) (complexity: MEDIUM)
- Adjustable font size and dark mode (complexity: LOW)
- Daily verse push notifications (complexity: MEDIUM)
- Reading plans with progress tracking (complexity: HIGH)
- Cloud sync for highlights/bookmarks/notes (complexity: MEDIUM)

**Should have (competitive):**
- Verse-centric social posts with rich text (complexity: HIGH - core differentiator)
- Social activity feed showing friends' highlights and posts (complexity: MEDIUM)
- Deep linking to verses/posts from notifications (complexity: MEDIUM)
- Native mobile gestures (swipe between chapters, pull-to-refresh, haptics) (complexity: LOW)
- Share verses to other apps via native share sheet (complexity: LOW)
- User profiles with reading history and follow functionality (complexity: MEDIUM)

**Defer (v2+):**
- Verse images creation (canvas/image generation with templates)
- Reading plans with friends (group progress, accountability)
- Audio Bible playback (requires licensed content or TTS)
- Home screen widgets (high complexity, OS-specific implementations)
- Video posts (scope creep, different product category)

**Anti-features (deliberately NOT building):**
- Real-time everything (battery drain, complexity for minimal UX benefit)
- Custom Bible translation uploads (copyright liability, QA nightmare)
- AI-generated devotionals (theological accuracy concerns)
- Gamification/achievements (can trivialize Scripture)

### Architecture Approach

The recommended architecture follows Expo's local-first patterns with dual data sources. Relay handles all server data (social features, user data) with fragment colocation for optimal fetching. SQLite stores Bible content locally for instant offline access. This clear boundary prevents the complexity of trying to make everything work offline.

**Major components:**
1. **Expo Router (file-based)**: Navigation with automatic deep linking, route groups for auth/tabs separation, stack within each tab
2. **Relay Store + Network**: Server state cache matching web exactly, same fragments and patterns, custom network layer with auth headers
3. **SQLite + Sync Manager**: Offline Bible storage with verse-by-verse chunking, background download manager for translations, reactive queries via WatermelonDB
4. **Auth Context**: Better Auth client with native OAuth flows, session management via SecureStore, wraps entire app
5. **Push Service**: expo-notifications with token refresh handling, deep link navigation from taps, development build required

**Key patterns:**
- Fragment colocation: Every component declares its data needs via Relay fragments
- Protected route groups: Auth checks at layout level, automatic redirects
- Outbox pattern: Queue mutations when offline, sync when connection restored
- Dual data sources: SQLite for Bible (offline), Relay for social (online) - never mix

### Critical Pitfalls

Research identified eight critical pitfalls with high impact if not addressed early. The most severe are technology incompatibilities (Lexical, Radix UI), misconfigurations that fail silently (Relay, offline storage), and mobile-specific requirements (Apple Sign-In, push tokens, deep links).

1. **Lexical Editor Incompatibility** — Lexical is web-only, does NOT work in React Native. Must choose RN-native solution (@10play/tentap-editor recommended) and implement cross-platform content rendering. Decide rich text strategy in Foundation phase before building post creation.

2. **Radix UI Component Assumptions** — Radix/shadcn are DOM-based, all components must be rewritten for RN. Choose gluestack-ui v3 or Tamagui early in Foundation phase. Map design tokens (colors, spacing) rather than expecting component reuse.

3. **Relay Environment Misconfiguration** — RN's fetch differs from browser, needs custom network layer. Test Relay queries in RN dev build early in Foundation phase, not just web. Configure error boundaries and offline handling from start.

4. **Offline Bible Storage Architecture** — SQLite without reactive layer causes UI issues, sync conflicts, migration problems. Use WatermelonDB for reactive queries and sync primitives. Design schema migrations before implementation in Bible Reading phase.

5. **Push Notification Token Management** — Tokens can change, require development builds for testing (not Expo Go), and production config differs from dev. Implement token refresh listener, test on real devices in production builds during Push Notifications phase.

6. **Apple Sign-In Missing = App Store Rejection** — Apple requires Sign in with Apple if ANY social login is offered (guideline 4.8). Implement both Google and Apple together in Authentication phase, test both in TestFlight.

7. **Deep Link Configuration Fragility** — Universal Links (iOS) and App Links (Android) require perfect alignment, iOS caches AASA for 48 hours, email tracking breaks links. Validate with official tools, test from Gmail/Messages on fresh installs during Deep Linking phase.

8. **FlatList Performance Degradation** — Standard FlatList causes jank with long lists. Use FlashList from Shopify, implement pagination, memoize render items. Establish patterns in Foundation phase, apply to every list.

## Implications for Roadmap

Based on research, the natural phase structure follows dependency chains and risk mitigation. Foundation work (routing, data layer, component library) must come first. Bible reading can proceed in parallel with social features since they use separate data sources. Push notifications and deep linking should come last since they depend on content being in place.

### Phase 1: Foundation & Data Layer
**Rationale:** All features depend on navigation, data fetching, and UI components. Relay and component library choices are architectural decisions that affect everything downstream. Rich text strategy must be decided before post creation.

**Delivers:**
- Expo Router setup with (tabs) and (auth) route groups
- Relay environment with custom network layer, auth header injection
- NativeWind v4 + gluestack-ui v3 component library
- Theme provider with OKLCH colors matching web
- Basic UI primitives (Button, Input, Card, etc.)
- Rich text strategy decision and proof-of-concept

**Addresses pitfalls:**
- Relay misconfiguration (test in RN dev build)
- Radix UI assumptions (component library selected)
- Lexical incompatibility (RN solution chosen)

**Research flag:** Standard patterns (Expo Router, Relay setup) - skip phase research

### Phase 2: Authentication & Session
**Rationale:** Auth is prerequisite for social features and cloud sync. Both Google and Apple Sign-In must be implemented together to avoid App Store rejection. Development build required for testing.

**Delivers:**
- Better Auth client with native OAuth flows
- Google Sign-In via expo-auth-session
- Apple Sign-In via expo-apple-authentication
- Session management with expo-secure-store
- Auth context provider and hooks
- Protected routes working with Expo Router

**Addresses pitfalls:**
- Apple Sign-In missing (implement both providers together)

**Research flag:** Standard patterns (Better Auth + Expo) - skip phase research

### Phase 3: Offline Bible Reading
**Rationale:** Bible reading is core functionality and most complex offline feature. Can proceed in parallel with social features since it uses separate data source (SQLite). Sync architecture must be designed before implementation.

**Delivers:**
- SQLite schema for verses, translations, user annotations
- WatermelonDB setup with reactive queries
- Bible text download manager with progress tracking
- Chapter reading view with verse rendering
- Swipe navigation between chapters
- Adjustable font size and dark mode
- Highlights, bookmarks, notes (stored locally)

**Uses stack:**
- @nozbe/watermelondb with expo plugin
- expo-sqlite for storage
- react-native-gesture-handler for swipe

**Addresses pitfalls:**
- Offline storage architecture (WatermelonDB + schema design)

**Research flag:** NEEDS RESEARCH - Bible API integration, translation download strategy, sync with cloud

### Phase 4: Social Feed & Profiles
**Rationale:** Social features can be built in parallel with Bible reading since they use Relay (separate from SQLite). Feed rendering must use FlashList from start to avoid performance issues.

**Delivers:**
- User profile screens with Relay fragments
- Follow/unfollow functionality
- Social feed with FlashList and pagination
- Post card rendering with verse references
- Like/reply interactions with optimistic updates
- In-app notifications feed

**Uses stack:**
- react-relay with fragment colocation
- @shopify/flash-list for performance
- Relay mutations with optimistic updates

**Addresses pitfalls:**
- FlatList performance (use FlashList, pagination patterns)

**Research flag:** Standard patterns (Relay feed, pagination) - skip phase research

### Phase 5: Rich Content Creation
**Rationale:** Post creation depends on rich text editor decision from Foundation and existing feed infrastructure from Phase 4. This is complex and should be isolated from other features.

**Delivers:**
- Rich text editor (@10play/tentap-editor)
- Post creation flow with verse selection
- Image upload via expo-image-picker
- Content format compatibility with web Lexical posts
- Cross-platform rich text renderer
- Poll creation (optional, can defer)

**Uses stack:**
- @10play/tentap-editor
- Custom renderer for Lexical-to-Tiptap compatibility

**Addresses pitfalls:**
- Lexical incompatibility (solution implemented)

**Research flag:** NEEDS RESEARCH - Cross-platform rich text rendering, Lexical-to-Tiptap migration

### Phase 6: Reading Plans
**Rationale:** Reading plans depend on Bible reading infrastructure (Phase 3) and user profiles (Phase 4). Plans with friends can be deferred to v1.x but single-user plans are table stakes.

**Delivers:**
- Browse available reading plans
- Join/leave plans
- Daily plan content viewing
- Progress tracking
- Plan completion UI
- Plan-related notifications (in-app)

**Uses stack:**
- Relay for plan data from API
- SQLite for offline plan progress
- Integration with Bible chapter views

**Research flag:** Standard patterns (plan tracking, progress) - skip phase research

### Phase 7: Push Notifications
**Rationale:** Push requires development build and working content (posts, plans, activity). Should come after core features are stable. Token management complexity justifies dedicated phase.

**Delivers:**
- Push token registration with expo-notifications
- Token refresh listener for changes
- Daily verse notifications
- Plan reminder notifications
- Social activity notifications (likes, replies, follows)
- Notification tap handling with deep links
- Development build configuration

**Uses stack:**
- expo-notifications
- expo-device
- Expo Push Service (FCM/APNs)

**Addresses pitfalls:**
- Push token management (refresh listener, production testing)

**Research flag:** Standard patterns (expo-notifications) - skip phase research

### Phase 8: Deep Linking & Sharing
**Rationale:** Deep linking should come last since it depends on all content types being navigable (Bible verses, posts, profiles, plans). Configuration is fragile and requires extensive testing.

**Delivers:**
- Universal Links (iOS) and App Links (Android) configuration
- AASA file and assetlinks.json validation
- Deep link handling for all content types
- Share out functionality via native share sheet
- Verse image generation (optional, can defer)
- Cold start deep link queuing

**Uses stack:**
- Expo Router automatic deep link support
- expo-linking
- expo-sharing

**Addresses pitfalls:**
- Deep link configuration fragility (validation, extensive testing)

**Research flag:** NEEDS RESEARCH - Universal Links/App Links setup, AASA/assetlinks validation

### Phase Ordering Rationale

- **Foundation first:** Architectural decisions (Relay, components, rich text) affect everything downstream. Cannot proceed without these choices.
- **Auth early:** Prerequisite for cloud sync and social features. Apple Sign-In requirement forces both providers together.
- **Bible + Social parallel:** Use separate data sources (SQLite vs Relay), can be developed concurrently.
- **Rich content isolated:** Complex with cross-platform concerns, benefits from existing feed infrastructure.
- **Push + Deep linking last:** Depend on all content being in place, require extensive testing in production builds.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 3 (Offline Bible):** Bible API integration, translation download strategy, sync with cloud for user annotations
- **Phase 5 (Rich Content):** Cross-platform rich text rendering, Lexical-to-Tiptap content migration strategy
- **Phase 8 (Deep Linking):** Universal Links/App Links configuration, AASA/assetlinks validation process

Phases with standard patterns (skip research-phase):
- **Phase 1 (Foundation):** Expo Router, Relay, NativeWind are well-documented with official guides
- **Phase 2 (Authentication):** Better Auth + Expo authentication is documented
- **Phase 4 (Social Feed):** Relay pagination and feed patterns are standard
- **Phase 6 (Reading Plans):** Progress tracking is straightforward CRUD
- **Phase 7 (Push Notifications):** expo-notifications has comprehensive official docs

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All technologies verified with official docs, versions confirmed on npm, compatibility matrix validated |
| Features | MEDIUM-HIGH | Based on competitor analysis (YouVersion, Dwell, Grow, theWell) and mobile UX research, but user preferences may differ |
| Architecture | HIGH | Follows Expo official patterns, Relay best practices, proven by similar apps (Bible + social hybrid) |
| Pitfalls | MEDIUM-HIGH | Verified via official docs and community reports, but some edge cases may exist |

**Overall confidence:** HIGH

Research is comprehensive with strong primary sources (official documentation, verified versions, competitor analysis). The mobile Bible app domain is well-established with proven patterns. The main uncertainties are in cross-platform rich text (Lexical compatibility) and user feature preferences (which can be validated during development).

### Gaps to Address

Areas where research was inconclusive or needs validation during implementation:

- **Rich text cross-platform rendering:** How to handle Lexical JSON from web in mobile app? Options are: (1) convert Lexical to Tiptap on backend, (2) implement dual renderers in app, (3) simplify mobile to text-only posts. Prototype during Phase 1, decide during Phase 5.

- **Bible API integration:** Research assumes Bible content is available via API or bulk download. Actual integration depends on chosen Bible content provider (Bible.com API, digital Bible library, etc.). Research during Phase 3 planning.

- **Offline sync conflict resolution:** What happens when user highlights same verse on mobile and web while offline? Research covered patterns (last-write-wins, CRDTs) but didn't specify implementation. Design during Phase 3 planning.

- **User feature priorities:** Research identified table stakes vs differentiators based on competitors, but actual user preferences for Selah may differ. Consider user research/testing to validate priorities before locking roadmap.

- **Translation licensing:** Research didn't address Bible translation licensing for offline storage. Some translations have usage restrictions. Legal review needed before Phase 3.

## Sources

### Primary (HIGH confidence)
- [Expo Documentation](https://docs.expo.dev/) - SDK 54 features, push notifications, deep linking, authentication, SQLite
- [Relay Documentation](https://relay.dev/docs/) - React Native support, fragment colocation, network layer
- [NativeWind Documentation](https://www.nativewind.dev/) - v4 setup with Expo SDK 54
- [gluestack-ui Documentation](https://gluestack.io/) - v3 installation and components
- [Better Auth Expo Integration](https://www.better-auth.com/docs/integrations/expo) - Native OAuth flows
- [10tap-editor GitHub](https://github.com/10play/10tap-editor) - Features, platform support, limitations
- npm registry - All package versions verified 2026-02-02

### Secondary (MEDIUM confidence)
- [YouVersion Bible App](https://www.youversion.com/bible-app) - 1B+ installs, feature set, engagement statistics
- [17 Best Bible Apps Reviewed 2026](https://theleadpastor.com/tools/best-bible-apps/) - Competitor feature comparison
- [7 Best Christian Social Media Apps 2026](https://actssocial.com/blog/best-christian-social-media-apps) - Social feature landscape
- [React Native Tech Stack 2025](https://galaxies.dev/article/react-native-tech-stack-2025) - Ecosystem overview
- [LogRocket: Best RN UI Libraries 2026](https://blog.logrocket.com/best-react-native-ui-component-libraries/) - Component library comparison
- [Supabase: Offline-first with WatermelonDB](https://supabase.com/blog/react-native-offline-first-watermelon-db) - Architecture patterns
- [Universal & Deep Links 2026 Guide](https://prototyp.digital/blog/universal-links-deep-linking-2026) - Configuration details
- [Push Notification Benchmarks 2025](https://www.airship.com/resources/benchmark-report/mobile-app-push-notification-benchmarks-for-2025/) - Retention data

### Tertiary (LOW confidence)
- [Expo App Folder Structure Best Practices](https://expo.dev/blog/expo-app-folder-structure-best-practices) - Project structure patterns
- [React Native Best Practices for AI Agents](https://www.callstack.com/blog/announcing-react-native-best-practices-for-ai-agents) - Common pitfalls
- Community reports on Expo SDK 54 + NativeWind issues via Medium

---
*Research completed: 2026-02-02*
*Ready for roadmap: yes*
