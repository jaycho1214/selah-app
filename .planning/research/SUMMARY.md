# Project Research Summary

**Project:** Selah Mobile - React Native Bible/Social App
**Domain:** Bible Reading & Social Community Mobile App (Next.js/Relay Web App Port)
**Researched:** 2026-02-01
**Confidence:** HIGH

## Executive Summary

Selah Mobile is a React Native Bible reading and social community app being ported from an existing Next.js/Relay web application. The research confirms that React Native with Expo SDK 54 is the optimal foundation, maintaining architectural consistency with the web app through shared Relay GraphQL infrastructure while adapting to mobile-native patterns. The recommended approach leverages Expo's managed workflow for rapid iteration, Relay for data consistency across platforms, and mobile-first UX patterns like swipe navigation and offline-first architecture.

The core architectural decision is to reuse the GraphQL API and Relay fragments from the web app while creating platform-specific implementations for authentication (Better Auth with native OAuth SDKs), navigation (React Navigation with Expo Router), and rich text (Tiptap-based editor instead of Lexical). This approach minimizes backend duplication while respecting platform differences that cannot be abstracted away.

Key risks center on three critical integration points: (1) Relay environment configuration requires platform-specific network layers and manual auth header injection, (2) OAuth deep linking needs careful scheme registration across development and production, and (3) rich text editing requires accepting that Lexical cannot be directly ported and planning for a WebView-based alternative. Addressing these early through proper foundation setup will prevent costly rework later.

## Key Findings

### Recommended Stack

The research strongly validates Expo SDK 54 as the foundation, bringing React Native 0.81 with New Architecture enabled by default and React 19.1.0 for full feature parity with the web app. This choice provides 3x/year stable releases, managed native modules, and over-the-air updates without sacrificing access to native capabilities.

**Core technologies:**
- **Expo SDK 54.0.0**: Latest stable with React Native 0.81, React 19.1.0 — managed workflow reduces build complexity while enabling OTA updates
- **Relay 20.1.1**: Same as web app, designed for React Native at Facebook — maintains fragment colocation and type safety across platforms
- **React Navigation 7.x**: De facto standard with new static API — simplifies TypeScript integration and deep linking
- **NativeWind 4.x**: Tailwind CSS for React Native — 95% class compatibility with web app's styling approach
- **Better Auth + Expo plugin**: Matches web backend with mobile-specific SecureStore integration — unified auth strategy
- **@10play/tentap-editor**: Tiptap/ProseMirror-based rich text — best available alternative to Lexical for mobile

**Critical version notes:**
- Expo SDK 54 requires iOS 15.1+ and Android 7+ minimum
- NativeWind v4 is production-ready; v5 is pre-release (avoid for now)
- react-native-mmkv V4 Nitro requires New Architecture (enabled by default in SDK 54)

### Expected Features

The feature research reveals that Selah competes in two distinct markets simultaneously: Bible reading apps (YouVersion, Logos) and social platforms (Instagram, Reddit). This dual nature creates both opportunities and constraints.

**Must have (table stakes):**
- **Swipe navigation between chapters** — universal Bible app pattern, users expect page-turning gestures
- **Verse tap-to-select with action menu** — foundation for all Bible interactions (highlight, share, post)
- **Offline Bible access** — mobile users read in transit; offline-first architecture is non-negotiable
- **Posts on specific verses** — core differentiator that bridges Bible reading and community
- **Social feed with infinite scroll** — expected pattern for discovery and engagement
- **Like/comment interactions** — basic social engagement mechanisms
- **Push notifications** — critical for re-engagement, but requires granular user controls
- **Dark/Light mode with font sizing** — accessibility and comfort requirements

**Should have (competitive):**
- **Multiple highlight colors** — Bible study feature in all competitors
- **Follow/unfollow system** — social graph for content discovery
- **Rich text posts with images** — more expressive than plain text
- **Polls on verses** — interactive engagement tool for theological discussion
- **Verse image sharing** — growth mechanism (shareable graphics for Instagram Stories, WhatsApp)
- **Haptic feedback** — premium feel differentiator

**Defer (v2+):**
- **Audio Bible playback** — high complexity, requires content licensing
- **Reading plans with streaks** — gamification after core engagement proven
- **Widgets** — platform polish after core value established
- **Cross-reference navigation** — power user feature for v2

**Anti-features to avoid:**
- Real-time everything (battery drain, unnecessary complexity)
- Deeply nested comments beyond 2 levels (unreadable on mobile)
- Complex rich text editors (no good native solutions, laggy WebView performance)
- Auto-playing media (annoying, data concerns)

### Architecture Approach

The architecture research confirms a layered approach with clear separation between routes (Expo Router file-based), feature components (domain-organized with colocated fragments), and data (single Relay Environment at root). The key insight is that React Native and web can share GraphQL schema and fragments while diverging on implementation details like network layers and navigation.

**Major components:**
1. **Root Layout (_layout.tsx)** — single RelayEnvironmentProvider wrapping entire app, recreated on auth token change
2. **Route Groups** — `(auth)` for logged-out flow, `(tabs)` for main app with stack-in-tabs pattern for drill-down
3. **Feature Modules** — reading/, community/, profile/ with colocated components and fragments
4. **Relay Environment** — platform-specific network layer with manual auth header injection from SecureStore
5. **Auth Context** — session state management bridging Better Auth, native OAuth SDKs, and Relay

**Critical patterns:**
- **Fragment colocation**: Every component declares its data needs via GraphQL fragments (never prop-drill data)
- **Screen-level query composition**: Routes use `useLazyLoadQuery`, spreading child fragments for single network request
- **Protected routes**: File-based groups with conditional rendering based on auth state
- **Stack-in-tabs navigation**: Each tab contains its own Stack navigator for natural drill-down flows

**Data flow principles:**
- Server state lives in Relay Store (normalized, cached)
- Client state (UI toggles, preferences) lives in Zustand
- Secure credentials live in SecureStore (Keychain/Keystore)
- Performance-critical data lives in MMKV (30x faster than AsyncStorage)

### Critical Pitfalls

The pitfall research identified six critical failure modes that can derail the project if not addressed proactively.

1. **Relay Environment Mismatch (Phase 1)** — Web's cookie-based auth and localhost URLs fail on mobile. Prevention: Create platform-specific network layers with manual auth headers, use environment-aware base URLs (10.0.2.2 for Android emulator, actual IP for devices), configure Metro bundler for Relay compiler.

2. **Better Auth Session Handling (Phase 2)** — Sessions don't persist without explicit SecureStore integration. Prevention: Install @better-auth/expo plugin, configure Metro with `unstable_enablePackageExports: true`, set `credentials: "omit"` with manual Cookie headers, clear Metro cache after config changes.

3. **OAuth Deep Link Failures (Phase 2)** — Apple/Google Sign-In redirects fail to return to app. Prevention: Register app scheme in app.json, add all schemes to Better Auth server `trustedOrigins`, use Web Client ID for Google (with Android/iOS IDs in Console), enable `ios.usesAppleSignIn: true` and Apple Developer capability.

4. **Push Notification Credential Mismatch (Phase 3)** — Works in dev, fails in production/TestFlight. Prevention: Never test in Expo Go (SDK 53+ doesn't support push), use development builds from day one, test on physical devices only, set up EAS credentials early, use `eas build --profile preview` for testing.

5. **Lexical Editor Incompatibility (Phase 4)** — Lexical is DOM-based and cannot be directly ported. Prevention: Accept this limitation early, choose WebView wrapper strategy (@10play/tentap-editor with Tiptap), design data format to be editor-agnostic (store as JSON/HTML, render per-platform).

6. **Bible Content Performance (Phase 4)** — Large chapters (Psalm 119 with 176 verses) cause janky scrolling. Prevention: Use FlashList instead of ScrollView/FlatList, configure virtualization with proper `estimatedItemSize`, memoize verse components, paginate by chapter not book, use `removeClippedSubviews={true}` on Android.

## Implications for Roadmap

Based on architectural dependencies and pitfall prevention, the recommended phase structure follows a strict foundation-first approach with incremental feature delivery.

### Phase 1: Foundation & Environment Setup
**Rationale:** Everything depends on properly configured Relay, navigation, and build infrastructure. Cutting corners here creates compounding problems later (Pitfall 1 prevention).

**Delivers:**
- Expo project with React Navigation and Expo Router file-based routing
- Platform-specific Relay environment with correct network layer
- Development build configuration (not Expo Go)
- Environment-aware API base URLs
- Metro bundler configured for Relay compiler

**Addresses:**
- No user-facing features yet, but unblocks all future work
- Validates that API integration works from mobile devices
- Establishes CI/CD foundation with EAS

**Avoids:**
- Relay environment mismatch (Pitfall 1)
- Technical debt from copying web configs

**Research Flag:** Standard patterns; skip research-phase (well-documented in official Expo and Relay docs).

---

### Phase 2: Authentication & User Identity
**Rationale:** Social features require user identity; authentication must work before building any user-facing features. This phase addresses Pitfalls 2 and 3 proactively.

**Delivers:**
- Better Auth integration with @better-auth/expo plugin
- SecureStore for session persistence
- Native Apple Sign-In (expo-apple-authentication)
- Native Google Sign-In (@react-native-google-signin)
- OAuth deep link handling with correct scheme registration
- Protected route groups ((auth) vs (tabs))
- User profile schema and basic profile screen

**Uses:**
- expo-secure-store for encrypted token storage
- Better Auth with manual Cookie header injection
- Native OAuth SDKs with Web Client ID fallback

**Implements:**
- AuthContext provider at root
- Relay Environment recreation on token change
- Deep link URL scheme registration

**Avoids:**
- Session persistence failures (Pitfall 2)
- OAuth redirect loops (Pitfall 3)
- AsyncStorage security vulnerabilities

**Research Flag:** Needs phase-specific research for Better Auth + native SDK integration patterns (complex, multiple sources of failure).

---

### Phase 3: Core Bible Reading Experience
**Rationale:** After auth, Bible reading is the primary value proposition. This validates the core UX and Relay fragment patterns before adding social complexity.

**Delivers:**
- Bible chapter display with swipe navigation (react-native-pager-view)
- Verse tap-to-select with action menu
- Basic highlighting (single color for MVP)
- Offline Bible storage (MMKV for text data)
- Book/chapter selection UI
- FlashList-based verse rendering for performance

**Addresses:**
- Swipe navigation (table stakes)
- Verse selection (foundation for all Bible interactions)
- Offline access (mobile requirement)

**Implements:**
- Reading feature module with colocated fragments
- PassageView component with Relay fragments
- Stack-in-tabs navigation for read/ route

**Avoids:**
- Bible content performance issues (Pitfall 6)
- ScrollView mistakes (use FlashList from day one)

**Research Flag:** Standard patterns for list performance; skip research-phase (FlashList is well-documented).

---

### Phase 4: Social Feed & Community Core
**Rationale:** With Bible reading working, add social layer. Posts on verses require both Bible and social infrastructure to be functional.

**Delivers:**
- Posts on specific verses (core differentiator)
- Social feed with infinite scroll (Relay pagination)
- Like posts with optimistic updates
- Basic comments (flat, no nesting for MVP)
- User profiles (view-only)
- FlashList for feed performance

**Addresses:**
- Posts on verses (differentiator)
- Social feed (table stakes for social apps)
- Like/comment (basic engagement)

**Implements:**
- Community feature module
- DiscussionCard component with fragments
- Relay mutations with optimistic updates
- expo-image for cached user avatars

**Avoids:**
- Feed performance traps (use FlashList with proper virtualization)
- Deeply nested comments (limit to 1 level for MVP)

**Research Flag:** Standard social patterns; skip research-phase (well-documented in Stream/Relay docs).

---

### Phase 5: Rich Text & Media
**Rationale:** After basic posts work, add rich text and images. Deferred because of Lexical incompatibility (Pitfall 5) and complexity.

**Delivers:**
- Rich text post composition with @10play/tentap-editor
- Image upload with compression (expo-image-picker)
- Image display in feed with caching (expo-image)
- Rich text rendering across app

**Addresses:**
- Images in posts (competitive feature)
- Formatted text (user request)

**Implements:**
- WebView-based Tiptap editor
- Image compression before upload (2MB max)
- Bridge communication between WebView and React Native

**Avoids:**
- Lexical porting attempts (Pitfall 5)
- Uncompressed image uploads (performance)

**Research Flag:** Needs phase-specific research for Tiptap/WebView bridge patterns and image optimization strategies.

---

### Phase 6: Push Notifications & Re-engagement
**Rationale:** Deferred until core features work because push requires production builds and is a common failure point (Pitfall 4).

**Delivers:**
- expo-notifications setup with permission flow
- Push token registration (GraphQL mutation)
- Notification handlers (foreground/background)
- Deep link navigation from notification tap
- Granular notification preferences

**Addresses:**
- Push notifications (table stakes for engagement)

**Implements:**
- Push service integration in services/ layer
- Token manager for Expo Push Service
- Notification listeners in root layout

**Avoids:**
- Testing in Expo Go or simulators (Pitfall 4)
- Credential mismatches between dev/prod
- Notification permission dark patterns

**Research Flag:** Needs phase-specific research for EAS credentials, APNs/FCM configuration, and deep link URL handling.

---

### Phase 7: Enhanced Social Features
**Rationale:** After core loop works, add features that increase engagement and retention.

**Delivers:**
- Follow/unfollow system
- Multiple highlight colors
- Nested comment replies (2 levels max)
- Polls on verses
- Verse image generation/sharing
- Haptic feedback polish

**Addresses:**
- Follow system (social graph)
- Enhanced highlights (competitive parity)
- Polls (differentiator)

**Research Flag:** Standard patterns; skip research-phase.

---

### Phase 8: Content Discovery & Search
**Rationale:** Discovery becomes valuable once there's enough content to search through.

**Delivers:**
- Search for verses (autocomplete)
- Search for posts/users
- Bookmarks
- Reading history

**Addresses:**
- Search (table stakes)
- Bookmarks (expected feature)

**Research Flag:** Skip research-phase (standard search patterns).

---

### Phase Ordering Rationale

1. **Foundation before features:** Relay and auth configuration mistakes compound. Getting these right first prevents costly rework (Pitfalls 1, 2, 3).

2. **Bible reading before social:** Validates core value proposition and establishes Relay fragment patterns. Social features are an enhancement layer on top of reading.

3. **Basic before rich:** Start with simple posts, add rich text only after proving the social loop works. Prevents over-investing in Lexical porting that can't succeed (Pitfall 5).

4. **Performance from day one:** Use FlashList and virtualization from the start for both Bible chapters and feeds. Retrofitting performance is much harder (Pitfall 6).

5. **Push notifications late:** Requires production builds and EAS credentials setup. Moving this late avoids it blocking feature development while ensuring it's tested properly (Pitfall 4).

6. **Enhanced features after validation:** Follow systems, polls, and discovery only make sense once core engagement is proven.

### Research Flags

**Phases needing deeper research during planning:**
- **Phase 2 (Auth):** Complex integration of Better Auth + native SDKs + deep linking; multiple failure modes require detailed investigation
- **Phase 5 (Rich Text):** Tiptap WebView bridge patterns and editor configuration need exploration
- **Phase 6 (Push):** EAS credentials, APNs/FCM setup, and deep link URL schemes require environment-specific research

**Phases with standard patterns (skip research-phase):**
- **Phase 1 (Foundation):** Official Expo and Relay docs are comprehensive
- **Phase 3 (Bible Reading):** FlashList performance patterns well-documented
- **Phase 4 (Social Core):** Standard social feed patterns, Relay pagination is documented
- **Phase 7 (Enhanced Social):** Incremental additions to proven patterns
- **Phase 8 (Discovery):** Standard search implementation patterns

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All recommendations verified via official npm versions, Expo SDK 54 docs, and Relay docs. No speculative choices. |
| Features | MEDIUM-HIGH | Based on competitor analysis (YouVersion, Logos) and mobile UX best practices. Anti-features list is opinionated but grounded in performance research. |
| Architecture | HIGH | Relay fragment colocation and Expo Router patterns are official recommendations. Project structure follows established conventions from Expo and React Navigation teams. |
| Pitfalls | HIGH | All six critical pitfalls verified through official troubleshooting docs, GitHub issues, and multiple community sources. Recovery strategies tested. |

**Overall confidence:** HIGH

The research converges on a clear technical path with minimal ambiguity. The main uncertainties are in execution details (e.g., exact Tiptap configuration, EAS credential flow) rather than strategic direction.

### Gaps to Address

**Gap 1: Bible content API structure**
- Research assumes GraphQL API exists but doesn't specify verse/chapter schema
- **Handle during:** Phase 3 planning — validate schema supports needed queries (verse selection, highlighting state)

**Gap 2: Better Auth server configuration**
- Research assumes web backend uses Better Auth but doesn't confirm mobile-specific middleware
- **Handle during:** Phase 2 planning — verify `trustedOrigins` config and session cookie format

**Gap 3: Image optimization thresholds**
- Research recommends 2MB max but doesn't specify compression ratio or format conversions
- **Handle during:** Phase 5 planning — test compression strategies to balance quality vs. upload speed

**Gap 4: Notification payload structure**
- Research confirms Expo Push Service but doesn't specify notification JSON schema for deep linking
- **Handle during:** Phase 6 planning — design notification payload format that supports all deep link targets

**Gap 5: Offline sync conflict resolution**
- Architecture supports offline-first but doesn't specify merge strategies for highlights/notes
- **Handle during:** Phase 3-4 planning — decide on server-wins vs. last-write-wins vs. merge strategies

## Sources

### Primary Sources (HIGH confidence)

**Official Documentation:**
- [Expo SDK 54 Documentation](https://docs.expo.dev/versions/latest/) — Version verification, API capabilities
- [Relay Documentation](https://relay.dev/docs/) — Fragment colocation, network layer patterns
- [React Navigation 7.0](https://reactnavigation.org/docs/7.x/) — Stack-in-tabs navigation, deep linking
- [NativeWind Documentation](https://www.nativewind.dev/docs/) — Tailwind compatibility, version requirements
- [Better Auth Expo Integration](https://www.better-auth.com/docs/integrations/expo) — Mobile auth setup, SecureStore usage
- [Expo Push Notifications](https://docs.expo.dev/push-notifications/overview/) — APNs/FCM integration, credential setup
- [Expo Rich Text Guide](https://docs.expo.dev/guides/editing-richtext/) — Editor recommendations, Lexical limitations

**npm/GitHub (version verification):**
- [@10play/tentap-editor v1.0.1](https://github.com/10play/10tap-editor) — Tiptap-based mobile editor
- [react-native-mmkv v3.x](https://github.com/mrousavy/react-native-mmkv) — Performance benchmarks vs AsyncStorage
- [@shopify/flash-list](https://shopify.github.io/flash-list/) — Virtualization performance data

### Secondary Sources (MEDIUM confidence)

**UX Research:**
- [YouVersion Support Docs](https://help.youversion.com/) — Bible app interaction patterns (highlighting, sharing)
- [Mobile Navigation Best Practices 2026](https://www.designstudiouiux.com/blog/mobile-navigation-ux/) — Swipe navigation patterns
- [Push Notification Best Practices 2026](https://reteno.com/blog/push-notification-best-practices-ultimate-guide-for-2026) — User expectations, timing strategies

**Technical Articles:**
- [FlashList vs FlatList 2025](https://javascript.plainenglish.io/flashlist-vs-flatlist-2025-complete-performance-comparison-guide-for-react-native-developers-f89989547c29) — Performance comparison (verified against Shopify data)
- [Offline-First React Native Apps 2026](https://javascript.plainenglish.io/building-offline-first-react-native-apps-the-complete-guide-2026-68ff77c7bb06) — Sync patterns
- [React Native Performance 2026](https://www.esparkinfo.com/blog/react-native-best-practices) — VirtualizedList optimization

### Troubleshooting Sources (pitfall verification)

- [Expo Common Development Errors](https://docs.expo.dev/workflow/common-development-errors/)
- [React Native Google Sign-In Troubleshooting](https://react-native-google-signin.github.io/docs/troubleshooting)
- [Expo Build Troubleshooting](https://docs.expo.dev/build-reference/troubleshooting/)
- [7 React Native Mistakes in 2026](https://medium.com/@baheer224/7-react-native-mistakes-slowing-your-app-in-2026-19702572796a)

---
*Research completed: 2026-02-01*
*Ready for roadmap: yes*
