# Roadmap: Selah Mobile

## Overview

Selah Mobile transforms from an empty Expo project to a full-featured Bible social app across 8 phases. The journey starts with foundation infrastructure (routing, data layer, components), establishes authentication, builds the core Bible reading experience with offline support, adds social features (profiles, connections, feed, posts), integrates notifications, and finishes with mobile-native integrations (deep links, sharing, settings). Each phase delivers a complete, verifiable capability.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation** - Project infrastructure: routing, Relay, component library, theming
- [ ] **Phase 2: Authentication** - Google and Apple Sign-In with session persistence
- [ ] **Phase 3: Bible Reading** - Multi-translation Bible with offline support, highlights, notes, bookmarks
- [ ] **Phase 4: Profiles & Connections** - User profiles, following, and follower lists
- [ ] **Phase 5: Feed & Engagement** - Social feed with likes, replies, and poll voting
- [ ] **Phase 6: Verse Posts** - Rich text post creation with images and polls
- [ ] **Phase 7: Notifications** - In-app notification feed and push notifications
- [ ] **Phase 8: Mobile Native & Settings** - Deep links, share sheet, theme and language settings

## Phase Details

### Phase 1: Foundation
**Goal**: Establish project infrastructure that all features depend on
**Depends on**: Nothing (first phase)
**Requirements**: None (infrastructure phase)
**Success Criteria** (what must be TRUE):
  1. App launches with tab-based navigation (home, explore, profile tabs visible)
  2. Relay successfully fetches data from GraphQL API (test query returns data)
  3. UI components render with correct OKLCH colors matching selah-web
  4. Dark and light themes toggle correctly throughout the app
  5. Rich text rendering proof-of-concept displays formatted content
**Plans**: 5 plans

Plans:
- [ ] 01-01-PLAN.md — Expo Router setup with tab navigation (home, explore, profile)
- [ ] 01-02-PLAN.md — Relay environment and GraphQL connection
- [ ] 01-03-PLAN.md — NativeWind + react-native-reusables component library
- [ ] 01-04-PLAN.md — Theme system with OKLCH colors and dark/light toggle
- [ ] 01-05-PLAN.md — Rich text strategy proof-of-concept with 10tap-editor

### Phase 2: Authentication
**Goal**: Users can securely access their accounts via social login
**Depends on**: Phase 1
**Requirements**: AUTH-01, AUTH-02, AUTH-03, AUTH-04
**Success Criteria** (what must be TRUE):
  1. User can sign in with Google account and see their profile
  2. User can sign in with Apple account and see their profile
  3. User session persists after closing and reopening the app
  4. User can sign out from any screen and returns to login
**Plans**: TBD

Plans:
- [ ] 02-01: Better Auth client and auth context
- [ ] 02-02: Google Sign-In flow
- [ ] 02-03: Apple Sign-In flow
- [ ] 02-04: Session persistence and protected routes

### Phase 3: Bible Reading
**Goal**: Users can read the Bible across translations with personal annotations, online and offline
**Depends on**: Phase 2
**Requirements**: BIBL-01, BIBL-02, BIBL-03, BIBL-04, BIBL-05, BIBL-06, BIBL-07, BIBL-08, BIBL-09
**Success Criteria** (what must be TRUE):
  1. User can read Bible chapters and switch between multiple translations
  2. User can swipe left/right to navigate between chapters
  3. User can highlight verses with different colors and see highlights persist
  4. User can bookmark verses and access them from a bookmarks list
  5. User can add private notes to verses and view them later
  6. User can search Bible text and navigate to results
  7. User can adjust font size and it persists across sessions
  8. User can download a translation and read it without internet connection
**Plans**: TBD

Plans:
- [ ] 03-01: Bible data schema and SQLite setup
- [ ] 03-02: Chapter reading view with verse rendering
- [ ] 03-03: Swipe navigation between chapters
- [ ] 03-04: Highlights with color selection
- [ ] 03-05: Bookmarks management
- [ ] 03-06: Private notes on verses
- [ ] 03-07: Bible search functionality
- [ ] 03-08: Font size adjustment
- [ ] 03-09: Translation download and offline reading

### Phase 4: Profiles & Connections
**Goal**: Users can view profiles and build social connections
**Depends on**: Phase 2
**Requirements**: PROF-01, PROF-02, PROF-03, PROF-04, CONN-01, CONN-02, CONN-03, CONN-04
**Success Criteria** (what must be TRUE):
  1. User can view their own profile with bio and list of their posts
  2. User can edit their profile (name, bio, avatar) and changes persist
  3. User can view other users' profiles and see their posts
  4. User can see follower and following counts on any profile
  5. User can follow another user and see their count increment
  6. User can unfollow a user and see their count decrement
  7. User can view their list of followers
  8. User can view their list of users they follow
**Plans**: TBD

Plans:
- [ ] 04-01: Own profile screen with Relay fragments
- [ ] 04-02: Profile editing flow
- [ ] 04-03: Other user profile viewing
- [ ] 04-04: Follow/unfollow functionality
- [ ] 04-05: Follower and following lists

### Phase 5: Feed & Engagement
**Goal**: Users can browse social content and engage with posts
**Depends on**: Phase 4
**Requirements**: FEED-01, FEED-02, FEED-03, FEED-04, ENGM-01, ENGM-02, ENGM-03, ENGM-04, ENGM-05
**Success Criteria** (what must be TRUE):
  1. User can view feed of posts from users they follow
  2. User can pull down to refresh and see new posts appear
  3. User can scroll continuously and older posts load automatically
  4. User can view explore feed showing all verse posts
  5. User can like a post and see like count increment
  6. User can unlike a post and see like count decrement
  7. User can reply to a post and see their reply appear
  8. User can view threaded replies on a post
  9. User can vote on a poll and see results update
**Plans**: TBD

Plans:
- [ ] 05-01: Home feed with FlashList and pagination
- [ ] 05-02: Pull-to-refresh implementation
- [ ] 05-03: Explore feed (all verse posts)
- [ ] 05-04: Like/unlike functionality with optimistic updates
- [ ] 05-05: Reply creation and threaded display
- [ ] 05-06: Poll voting

### Phase 6: Verse Posts
**Goal**: Users can create and manage verse-based posts with rich content
**Depends on**: Phase 5
**Requirements**: POST-01, POST-02, POST-03, POST-04, POST-05, POST-06
**Success Criteria** (what must be TRUE):
  1. User can create a post on a Bible verse with rich text formatting
  2. User can attach images to their post and see them displayed
  3. User can add a poll to their post with multiple options
  4. User can edit their own post and see changes reflected
  5. User can delete their own post and it disappears from feeds
  6. User can view a single post with all its replies
**Plans**: TBD

Plans:
- [ ] 06-01: Rich text editor integration (tentap-editor)
- [ ] 06-02: Verse selection for posts
- [ ] 06-03: Image attachment and upload
- [ ] 06-04: Poll creation
- [ ] 06-05: Post editing
- [ ] 06-06: Post deletion
- [ ] 06-07: Single post view with replies

### Phase 7: Notifications
**Goal**: Users receive timely notifications about social activity
**Depends on**: Phase 5
**Requirements**: NOTF-01, NOTF-02, NOTF-03, NOTF-04, NOTF-05
**Success Criteria** (what must be TRUE):
  1. User can view in-app notification feed showing recent activity
  2. User receives push notification when someone likes their post
  3. User receives push notification when someone replies to their post
  4. User receives push notification when someone follows them
  5. User can configure which notification types they want to receive
**Plans**: TBD

Plans:
- [ ] 07-01: In-app notification feed
- [ ] 07-02: Push token registration and management
- [ ] 07-03: Push notification display (likes, replies, follows)
- [ ] 07-04: Notification tap handling (deep link to content)
- [ ] 07-05: Notification preferences screen

### Phase 8: Mobile Native & Settings
**Goal**: Users have full mobile-native experience with sharing and personalization
**Depends on**: Phase 7
**Requirements**: MOBL-01, MOBL-02, MOBL-03, MOBL-04, SETT-01, SETT-02, SETT-03
**Success Criteria** (what must be TRUE):
  1. App opens from deep links (selah:// and https://selah.app/) to correct content
  2. User can share a verse to other apps via share sheet
  3. User can share a post to other apps via share sheet
  4. Tapping a push notification navigates to the relevant content
  5. User can switch between dark and light theme
  6. User can change app language and UI updates accordingly
  7. User can manage notification preferences from settings
**Plans**: TBD

Plans:
- [ ] 08-01: Universal Links and App Links configuration
- [ ] 08-02: Deep link routing for all content types
- [ ] 08-03: Share sheet integration (verses and posts)
- [ ] 08-04: Theme toggle in settings
- [ ] 08-05: Language selection
- [ ] 08-06: Settings screen with notification preferences

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 0/5 | Planned | - |
| 2. Authentication | 0/4 | Not started | - |
| 3. Bible Reading | 0/9 | Not started | - |
| 4. Profiles & Connections | 0/5 | Not started | - |
| 5. Feed & Engagement | 0/6 | Not started | - |
| 6. Verse Posts | 0/7 | Not started | - |
| 7. Notifications | 0/5 | Not started | - |
| 8. Mobile Native & Settings | 0/6 | Not started | - |

---
*Roadmap created: 2025-02-02*
*Phase 1 planned: 2026-02-02*
*Depth: comprehensive (8 phases, 47 plans estimated)*
*Coverage: 48/48 v1 requirements mapped*
