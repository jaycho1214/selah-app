# Requirements: Selah Mobile

**Defined:** 2025-02-01
**Core Value:** Users can read the Bible and share their thoughts on Scripture with a community of believers

## v1 Requirements

Full feature parity with selah-web plus mobile-specific enhancements.

### Authentication

- [ ] **AUTH-01**: User can sign up with email and password
- [ ] **AUTH-02**: User can sign in with Apple (native SDK)
- [ ] **AUTH-03**: User can sign in with Google (native SDK)
- [ ] **AUTH-04**: User can sign in via OAuth browser fallback
- [ ] **AUTH-05**: User receives email verification after signup
- [ ] **AUTH-06**: User can reset password via email link
- [ ] **AUTH-07**: User session persists across app restarts

### Bible Reading

- [ ] **READ-01**: User can view Bible chapter with verse numbers
- [ ] **READ-02**: User can swipe horizontally to navigate between chapters
- [ ] **READ-03**: User can select book and chapter via navigator UI
- [ ] **READ-04**: User can switch between Bible translations (KJV, ASV)
- [ ] **READ-05**: User can search verses by reference or text
- [ ] **READ-06**: User can tap verse to select it
- [ ] **READ-07**: User can highlight selected verse with color options
- [ ] **READ-08**: User can see reading history and resume last position

### Posts

- [ ] **POST-01**: User can create post on a specific verse
- [ ] **POST-02**: User can write rich text content in posts (bold, italic, links)
- [ ] **POST-03**: User can add images to posts
- [ ] **POST-04**: User can create polls in posts
- [ ] **POST-05**: User can edit own posts
- [ ] **POST-06**: User can delete own posts
- [ ] **POST-07**: User can view feed of community posts
- [ ] **POST-08**: User can view activity feed (posts from followed users)

### Social

- [ ] **SOCL-01**: User can like posts
- [ ] **SOCL-02**: User can unlike posts
- [ ] **SOCL-03**: User can comment on posts
- [ ] **SOCL-04**: User can reply to comments
- [ ] **SOCL-05**: User can view other users' profiles
- [ ] **SOCL-06**: User can edit own profile (display name, avatar, bio)
- [ ] **SOCL-07**: User can follow other users
- [ ] **SOCL-08**: User can unfollow users

### Notifications

- [ ] **NOTF-01**: User receives native push notifications (APNs/FCM)
- [ ] **NOTF-02**: User can view notifications in-app
- [ ] **NOTF-03**: User receives notification when someone likes their post
- [ ] **NOTF-04**: User receives notification when someone comments on their post
- [ ] **NOTF-05**: User receives notification when someone follows them

### Settings

- [ ] **SETT-01**: User can toggle dark/light theme
- [ ] **SETT-02**: User can switch language (EN/KO)
- [ ] **SETT-03**: User can adjust font size
- [ ] **SETT-04**: User can set verse highlight color preferences
- [ ] **SETT-05**: User can configure notification preferences

### Mobile-Specific

- [ ] **MOBL-01**: User can share verses via native share sheet
- [ ] **MOBL-02**: User can share posts via native share sheet
- [ ] **MOBL-03**: App opens from deep links (selah://verse/..., selah://post/...)
- [ ] **MOBL-04**: App uses bottom tab navigation (Bible, Posts, Notifications, Profile)

## v2 Requirements

Deferred to future release.

### Offline

- **OFFL-01**: User can download Bible translations for offline reading
- **OFFL-02**: User can read Bible without internet connection
- **OFFL-03**: User can view cached posts offline

### Enhanced Features

- **ENHC-01**: User hears haptic feedback on interactions
- **ENHC-02**: User can generate shareable verse images
- **ENHC-03**: App shows home screen widgets (iOS/Android)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Audio Bible | High complexity, content licensing, deferred to v2+ |
| Reading plans/streaks | Gamification after core engagement proven |
| Biometric app lock | User declined for v1 |
| Real-time chat | High complexity, not core to community value |
| Desktop/tablet layouts | Phone-first for v1 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | TBD | Pending |
| AUTH-02 | TBD | Pending |
| AUTH-03 | TBD | Pending |
| AUTH-04 | TBD | Pending |
| AUTH-05 | TBD | Pending |
| AUTH-06 | TBD | Pending |
| AUTH-07 | TBD | Pending |
| READ-01 | TBD | Pending |
| READ-02 | TBD | Pending |
| READ-03 | TBD | Pending |
| READ-04 | TBD | Pending |
| READ-05 | TBD | Pending |
| READ-06 | TBD | Pending |
| READ-07 | TBD | Pending |
| READ-08 | TBD | Pending |
| POST-01 | TBD | Pending |
| POST-02 | TBD | Pending |
| POST-03 | TBD | Pending |
| POST-04 | TBD | Pending |
| POST-05 | TBD | Pending |
| POST-06 | TBD | Pending |
| POST-07 | TBD | Pending |
| POST-08 | TBD | Pending |
| SOCL-01 | TBD | Pending |
| SOCL-02 | TBD | Pending |
| SOCL-03 | TBD | Pending |
| SOCL-04 | TBD | Pending |
| SOCL-05 | TBD | Pending |
| SOCL-06 | TBD | Pending |
| SOCL-07 | TBD | Pending |
| SOCL-08 | TBD | Pending |
| NOTF-01 | TBD | Pending |
| NOTF-02 | TBD | Pending |
| NOTF-03 | TBD | Pending |
| NOTF-04 | TBD | Pending |
| NOTF-05 | TBD | Pending |
| SETT-01 | TBD | Pending |
| SETT-02 | TBD | Pending |
| SETT-03 | TBD | Pending |
| SETT-04 | TBD | Pending |
| SETT-05 | TBD | Pending |
| MOBL-01 | TBD | Pending |
| MOBL-02 | TBD | Pending |
| MOBL-03 | TBD | Pending |
| MOBL-04 | TBD | Pending |

**Coverage:**
- v1 requirements: 40 total
- Mapped to phases: 0
- Unmapped: 40 ⚠️

---
*Requirements defined: 2025-02-01*
*Last updated: 2025-02-01 after initial definition*
