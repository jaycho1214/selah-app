# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2025-02-02)

**Core value:** Bible reading with community sharing around verses - the intersection of personal devotion and social connection must feel seamless and meaningful.
**Current focus:** Phase 4 - Profiles & Connections

## Current Position

Phase: 4 of 8 (Profiles & Connections)
Plan: 1 of ? in current phase
Status: In progress
Last activity: 2026-02-05 - Completed 04-01-PLAN.md (Profile UI Components)

Progress: [################] 58%  (Phase 4 started)

## Performance Metrics

**Velocity:**
- Total plans completed: 20
- Average duration: 3 min
- Total execution time: 60 min

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 1. Foundation | 5/5 | 18 min | 4 min |
| 2. Authentication | 4/4 | 12 min | 3 min |
| 3. Bible Reading | 11/11 | 33 min | 3 min |
| 4. Profiles & Connections | 1/? | 2 min | 2 min |

**Recent Trend:**
- Last 5 plans: 03-08 (3 min), 03-09 (4 min), 03-10 (2 min), 03-11 (2 min), 04-01 (2 min)
- Trend: Good velocity

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- Changed Explore tab icon from paperplane.fill to compass for better semantics
- Simplified IconSymbol mapping type for easier extension
- Relay environment as singleton pattern for consistent caching
- RelayProvider as outermost provider (before ThemeProvider)
- API URL configurable via EXPO_PUBLIC_API_URL env var
- NativeWind v4 with Tailwind 3.4.x (not v4) for compatibility
- class-variance-authority for component variants
- cn() utility using clsx + tailwind-merge pattern
- WebView for rich text renderer (consistent HTML display)
- 10tap-editor v1.0.1 with TenTapStartKit for full formatting
- OKLCH colors converted to RGB for React Native compatibility
- CSS variables use .dark:root selector for NativeWind compatibility
- ThemeProvider supports system/light/dark modes
- NAV_THEME merged with DefaultTheme/DarkTheme to inherit fonts
- SecureStore for auth token persistence (iOS Keychain / Android Keystore)
- Auth client scheme "selah" matches app.json deep link config
- storagePrefix "selah" prevents SecureStore key collisions
- Native Google Sign-In SDK (not OAuth redirect) for better UX
- webClientId for server-side idToken verification
- idToken passed as {token: idToken} object to trigger idToken flow
- Native AppleAuthenticationButton for App Store compliance
- idToken flow for Apple Sign-In native experience
- Platform.OS conditional rendering for iOS-only Apple Sign-In
- Open-browsing pattern: no forced login, auth on protected actions
- Bottom sheet sign-in using @gorhom/bottom-sheet
- requireAuth() helper for protecting actions without redirects
- Composite verse ID format: {translationId}:{book}:{chapter}:{verse}
- syncedAt field on annotations enables local-first sync tracking
- version field on translations enables upgrade detection
- BIBLE_BOOKS array in canonical order, not alphabetical
- createMMKV (v4 API) for MMKV storage instance
- Record<verseId, Annotation> for O(1) lookups in annotation store
- FONT_SIZES constant map for consistent text sizing
- FlashList v2 auto-measures items (no estimatedItemSize needed)
- expo-network instead of @react-native-community/netinfo
- relay.config.js src changed from ./app to . for component queries
- 3-page PagerView pattern for memory efficiency (prev, current, next)
- Modal with pageSheet presentation for navigator
- BibleReader key prop forces remount on navigator selection
- useState for currentVerse in VerseActions (triggers re-render on selection)
- BottomSheet with index={-1} pattern for verse actions
- VerseActionsRef imperative API: open(verseId, verseText) and close()
- parseVerseId helper extracts translation, book, chapter, verse from composite ID
- bibleVersesByQuery GraphQL query for server-side full-text search
- BibleTranslation enum type required by GraphQL schema (cast from string)
- expo-file-system new API: File.downloadFileAsync + Paths.cache
- Tabbed settings sheet: Font Size and Translation in same bottom sheet
- DatabaseGate placed before RelayProvider to block all DB-dependent providers
- drizzle-kit generate creates migration bundle for Expo automatically
- Home tab shows BibleReader directly instead of navigation hub
- BibleNavigatorBar provides compact prev/next/picker controls
- Profile tab serves as hub for Bible utilities and settings
- Avatar initials: single letter for single-word, two letters for multi-word names
- RelativePathString cast for untyped expo-router routes (routes created in later plans)
- Skeleton animation: Animated API with opacity loop 0.3-1.0, native driver

### Pending Todos

None yet.

### Blockers/Concerns

- MMKV requires native rebuild (`npx expo run:ios` or `npx expo run:android`) before testing on device
- FlashList requires native rebuild for cell recycling performance
- PagerView requires native rebuild for swipe navigation
- expo-file-system requires native rebuild for file download functionality

## Session Continuity

Last session: 2026-02-05
Stopped at: Completed 04-01-PLAN.md (Profile UI Components)
Resume file: None
