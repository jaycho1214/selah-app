# Requirements: Selah Mobile

**Defined:** 2026-02-02
**Core Value:** Bible reading with community sharing around verses — the intersection of personal devotion and social connection must feel seamless and meaningful.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Authentication

- [ ] **AUTH-01**: User can sign in with Google account
- [ ] **AUTH-02**: User can sign in with Apple account (required for iOS)
- [ ] **AUTH-03**: User session persists across app restarts
- [ ] **AUTH-04**: User can sign out from any screen

### Bible Reading

- [ ] **BIBL-01**: User can read Bible in multiple translations
- [ ] **BIBL-02**: User can swipe left/right to navigate between chapters
- [ ] **BIBL-03**: User can highlight verses with multiple colors
- [ ] **BIBL-04**: User can bookmark verses for quick access
- [ ] **BIBL-05**: User can add private notes to verses
- [ ] **BIBL-06**: User can search Bible by keyword
- [ ] **BIBL-07**: User can adjust font size for reading
- [ ] **BIBL-08**: User can download translations for offline reading
- [ ] **BIBL-09**: User can read Bible without internet connection (offline mode)

### Social - Profiles

- [ ] **PROF-01**: User can view their own profile with bio and posts
- [ ] **PROF-02**: User can edit their profile (name, bio, avatar)
- [ ] **PROF-03**: User can view other users' profiles
- [ ] **PROF-04**: User can see follower/following counts on profiles

### Social - Connections

- [ ] **CONN-01**: User can follow other users
- [ ] **CONN-02**: User can unfollow users
- [ ] **CONN-03**: User can view list of followers
- [ ] **CONN-04**: User can view list of following

### Social - Feed

- [ ] **FEED-01**: User can view feed of posts from followed users
- [ ] **FEED-02**: User can pull-to-refresh to load new posts
- [ ] **FEED-03**: User can scroll infinitely through feed (pagination)
- [ ] **FEED-04**: User can view all verse posts (explore feed)

### Verse Posts

- [ ] **POST-01**: User can create post on a Bible verse with rich text
- [ ] **POST-02**: User can attach images to posts
- [ ] **POST-03**: User can add polls to posts
- [ ] **POST-04**: User can edit their own posts
- [ ] **POST-05**: User can delete their own posts
- [ ] **POST-06**: User can view single post with replies

### Engagement

- [ ] **ENGM-01**: User can like posts
- [ ] **ENGM-02**: User can unlike posts
- [ ] **ENGM-03**: User can reply to posts
- [ ] **ENGM-04**: User can view replies on a post (threaded)
- [ ] **ENGM-05**: User can vote on polls

### Notifications

- [ ] **NOTF-01**: User can view in-app notification feed
- [ ] **NOTF-02**: User receives push notification for new likes
- [ ] **NOTF-03**: User receives push notification for new replies
- [ ] **NOTF-04**: User receives push notification for new followers
- [ ] **NOTF-05**: User can configure notification preferences

### Mobile Native

- [ ] **MOBL-01**: App opens from deep links (selah:// and https://selah.app/)
- [ ] **MOBL-02**: User can share verse to other apps via share sheet
- [ ] **MOBL-03**: User can share post to other apps via share sheet
- [ ] **MOBL-04**: App handles push notification taps (navigates to content)

### Settings

- [ ] **SETT-01**: User can switch between dark and light theme
- [ ] **SETT-02**: User can change app language
- [ ] **SETT-03**: User can manage notification preferences

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Reading Plans

- **PLAN-01**: User can browse available reading plans
- **PLAN-02**: User can join a reading plan
- **PLAN-03**: User can track daily reading progress
- **PLAN-04**: User can create custom reading plans

### Enhanced Features

- **ENHC-01**: User feels haptic feedback on likes and bookmarks
- **ENHC-02**: User can create verse images for sharing
- **ENHC-03**: User can listen to audio Bible
- **ENHC-04**: User can invite friends to reading plans

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Share IN (receive from other apps) | Adds complexity; limited user value for v1 |
| Home screen widgets | HIGH complexity; OS-specific implementations |
| Biometric auth | Low value; OS handles app unlock |
| Real-time features | Complexity, battery drain; reading is not real-time |
| Custom Bible translation upload | Copyright liability; QA nightmare |
| AI-generated devotionals | Theological accuracy concerns; user trust |
| Gamification/achievements | Can trivialize Scripture; not aligned with core value |
| Video posts | Storage/bandwidth costs; scope creep |
| Voice rooms/audio chat | High complexity; moderation challenges |
| Dating features | Mission drift; different product category |
| Aggressive notifications | 46% opt-out at 2-5 messages/week |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | Phase 2 | Pending |
| AUTH-02 | Phase 2 | Pending |
| AUTH-03 | Phase 2 | Pending |
| AUTH-04 | Phase 2 | Pending |
| BIBL-01 | Phase 3 | Pending |
| BIBL-02 | Phase 3 | Pending |
| BIBL-03 | Phase 3 | Pending |
| BIBL-04 | Phase 3 | Pending |
| BIBL-05 | Phase 3 | Pending |
| BIBL-06 | Phase 3 | Pending |
| BIBL-07 | Phase 3 | Pending |
| BIBL-08 | Phase 3 | Pending |
| BIBL-09 | Phase 3 | Pending |
| PROF-01 | Phase 4 | Pending |
| PROF-02 | Phase 4 | Pending |
| PROF-03 | Phase 4 | Pending |
| PROF-04 | Phase 4 | Pending |
| CONN-01 | Phase 4 | Pending |
| CONN-02 | Phase 4 | Pending |
| CONN-03 | Phase 4 | Pending |
| CONN-04 | Phase 4 | Pending |
| FEED-01 | Phase 5 | Pending |
| FEED-02 | Phase 5 | Pending |
| FEED-03 | Phase 5 | Pending |
| FEED-04 | Phase 5 | Pending |
| ENGM-01 | Phase 5 | Pending |
| ENGM-02 | Phase 5 | Pending |
| ENGM-03 | Phase 5 | Pending |
| ENGM-04 | Phase 5 | Pending |
| ENGM-05 | Phase 5 | Pending |
| POST-01 | Phase 6 | Pending |
| POST-02 | Phase 6 | Pending |
| POST-03 | Phase 6 | Pending |
| POST-04 | Phase 6 | Pending |
| POST-05 | Phase 6 | Pending |
| POST-06 | Phase 6 | Pending |
| NOTF-01 | Phase 7 | Pending |
| NOTF-02 | Phase 7 | Pending |
| NOTF-03 | Phase 7 | Pending |
| NOTF-04 | Phase 7 | Pending |
| NOTF-05 | Phase 7 | Pending |
| MOBL-01 | Phase 8 | Pending |
| MOBL-02 | Phase 8 | Pending |
| MOBL-03 | Phase 8 | Pending |
| MOBL-04 | Phase 8 | Pending |
| SETT-01 | Phase 8 | Pending |
| SETT-02 | Phase 8 | Pending |
| SETT-03 | Phase 8 | Pending |

**Coverage:**
- v1 requirements: 48 total
- Mapped to phases: 48
- Unmapped: 0

---
*Requirements defined: 2026-02-02*
*Last updated: 2025-02-02 after roadmap creation*
