# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2025-02-02)

**Core value:** Bible reading with community sharing around verses - the intersection of personal devotion and social connection must feel seamless and meaningful.
**Current focus:** Phase 3 - Bible Reading

## Current Position

Phase: 3 of 8 (Bible Reading)
Plan: 1 of 6 in current phase
Status: In progress
Last activity: 2026-02-02 - Completed 03-01-PLAN.md (SQLite + Bible types)

Progress: [######....] 28%

## Performance Metrics

**Velocity:**
- Total plans completed: 9
- Average duration: 3 min
- Total execution time: 28 min

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 1. Foundation | 5/5 | 18 min | 4 min |
| 2. Authentication | 4/4 | 12 min | 3 min |
| 3. Bible Reading | 1/6 | 3 min | 3 min |

**Recent Trend:**
- Last 5 plans: 02-01 (2 min), 02-02 (3 min), 02-03 (2 min), 02-04 (5 min), 03-01 (3 min)
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

### Pending Todos

None yet.

### Blockers/Concerns

None.

## Session Continuity

Last session: 2026-02-02T06:27:43Z
Stopped at: Completed 03-01-PLAN.md
Resume file: None
