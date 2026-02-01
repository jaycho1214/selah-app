# Selah Mobile

## What This Is

A React Native port of Selah — a Bible reading and community discussion app where users read Scripture, share thoughts on verses, and engage with others. This mobile app targets iOS and Android with full feature parity to the web version, connecting to the same GraphQL backend.

## Core Value

Users can read the Bible and share their thoughts on Scripture with a community of believers — the reading and posting experience must feel native and fluid.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Bible reading view as home screen with chapter navigation
- [ ] Multiple Bible translations (KJV, ASV)
- [ ] Swipe navigation between chapters
- [ ] Search verses by reference or text
- [ ] Create, edit, delete posts on verses
- [ ] Rich text content in posts
- [ ] Image galleries in posts
- [ ] Polls in posts
- [ ] Like/unlike posts
- [ ] Reply/comment on posts
- [ ] View user profiles
- [ ] Follow/unfollow users
- [ ] Notifications screen
- [ ] Native push notifications (APNs/FCM)
- [ ] Native Sign-In (Apple, Google) with OAuth browser fallback
- [ ] Settings (theme, language, font size, highlight colors, notification preferences)
- [ ] Dark/light theme support
- [ ] Bottom tab navigation (Bible, Posts, Notifications, Profile/Settings)

### Out of Scope

- Offline Bible reading — deferred to v2
- Web push notifications — mobile uses native push
- Desktop/tablet optimized layouts — focus on phone experience first

## Context

**Source codebase:** `selah-web` is a Next.js 16 app with:
- React 19, TypeScript, Tailwind CSS v4
- GraphQL via Relay with persisted queries
- Radix UI components, Lexical rich text editor
- Better Auth for OAuth sessions
- PostgreSQL backend via Kysely

**Design system to port:**
- OkLCH color model (primary deep blue/navy, light/dark themes)
- Geist font family (sans + mono)
- Radix UI component patterns (buttons, cards, dialogs, etc.)
- Lucide icons
- Rounded corners (0.625rem radius), subtle shadows, smooth transitions

**Existing Expo scaffolding:** Fresh `create-expo-app` in this directory.

## Constraints

- **Backend**: Must use existing GraphQL API — no backend changes for v1
- **Auth**: Better Auth sessions must work with mobile clients
- **Design**: Visual language must match web — same colors, typography feel, adapted for mobile UX
- **Platforms**: iOS and Android from single codebase (Expo/React Native)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Expo over bare React Native | Managed workflow, easier builds, OTA updates | — Pending |
| Relay for GraphQL | Match web app's data layer, reuse patterns | — Pending |
| Native auth SDKs preferred | Better UX than browser redirects | — Pending |
| Defer offline to v2 | Reduce v1 scope, requires significant caching infrastructure | — Pending |

---
*Last updated: 2025-02-01 after initialization*
