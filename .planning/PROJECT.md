# Selah Mobile

## What This Is

A React Native (Expo) mobile app for iOS and Android, porting the selah-web Bible social platform. Users read the Bible across multiple translations, share verse-based posts with rich text and images, and engage with a community through likes, replies, and follows. Same design language and backend as the web app.

## Core Value

Bible reading with community sharing around verses — the intersection of personal devotion and social connection must feel seamless and meaningful.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Bible reading with multi-translation support and swipe navigation
- [ ] Verse posts with rich text, images, and polls
- [ ] Social features: likes, replies, follows, user profiles
- [ ] Notifications feed
- [ ] Reading plans (browse, create, track)
- [ ] User settings (theme, language, font size, notifications)
- [ ] Google Sign-In authentication
- [ ] Apple Sign-In authentication (required for iOS)
- [ ] Native push notifications (FCM for Android, APNs for iOS)
- [ ] Offline Bible reading (downloadable translations)
- [ ] Share out (verses/posts to other apps via share sheet)
- [ ] Deep linking (selah:// and universal links)

### Out of Scope

- Share IN (receiving shares from other apps) — deferred to post-v1
- Widgets (home screen verse of the day) — deferred to post-v1
- Biometric auth — not required for v1
- Web push migration — mobile uses native push instead

## Context

**Source codebase:** selah-web (Next.js 16, React 19, Relay, PostgreSQL)
- GraphQL API via Yoga + Pothos with Relay plugin
- OKLCH color system with dark/light themes
- Lexical rich text editor for posts
- Better Auth with Google One-Tap on web

**Mobile initialization:** Expo (create-expo-app), fresh codebase
- Will consume existing GraphQL API via Relay
- Need React Native equivalents for web-specific libs (Lexical, Radix UI)

**Design reference:** shadcn/ui components, Geist font, clean minimal aesthetic
- Adapt for mobile patterns (bottom nav, gestures, native controls)

## Constraints

- **Tech stack**: React Native with Expo — already initialized, use Expo ecosystem
- **Backend**: Existing GraphQL API — no backend changes, mobile is a new client
- **Design**: Match selah-web visual language — OKLCH colors, typography, spacing
- **Platforms**: iOS and Android — universal app, no platform-specific features initially
- **Auth**: Apple Sign-In required — App Store policy when offering social login

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Use Relay for data layer | Same as web, enables potential code sharing, familiar patterns | — Pending |
| Expo over bare React Native | Faster development, managed workflow, OTA updates | — Pending |
| Apple Sign-In alongside Google | Required by App Store policy when offering any social login | — Pending |
| Native push over web push | Better reliability and UX on mobile, platform expectations | — Pending |

---
*Last updated: 2025-02-02 after initialization*
