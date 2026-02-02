# Feature Research: Mobile Bible Social App

**Domain:** Mobile Bible reading + social sharing platform
**Researched:** 2026-02-02
**Confidence:** MEDIUM-HIGH (based on analysis of major competitors and mobile UX research)

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete or unusable.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Multi-translation Bible reading** | Users want to compare translations; YouVersion offers 2,500+ versions | MEDIUM | Already planned; swipe navigation is mobile-native |
| **Offline Bible access** | Users read in planes, subways, areas with poor signal | HIGH | Must download translations; storage management needed |
| **Highlights with multiple colors** | Standard in all major Bible apps; YouVersion reports 2.4B highlights/year | MEDIUM | Need color picker, verse selection UI |
| **Bookmarks** | Basic reading app functionality | LOW | Simple save/retrieve pattern |
| **Notes (private)** | Users want to capture insights during reading | MEDIUM | Rich text optional but valuable |
| **Search (full-text)** | Finding verses by keyword is fundamental | MEDIUM | Server-side; expose existing API |
| **Adjustable font size** | Accessibility requirement; 25% of Android users change font size | LOW | System dynamic type + custom slider |
| **Dark mode** | Expected in 2025+; reduces eye strain for reading | LOW | Already planned; OKLCH system supports this |
| **Daily verse notifications** | Engagement driver; most Bible apps offer this | MEDIUM | Push notification + scheduling logic |
| **Reading plans** | Core engagement feature; YouVersion has 1,000+ plans | HIGH | Already planned; includes progress tracking |
| **Share verses to other apps** | Native mobile expectation; share sheet integration | LOW | Native share sheet; verse image optional |
| **Audio Bible playback** | Major differentiator becoming table stakes; Dwell, YouVersion lead | HIGH | May require licensed audio content or TTS |
| **Cloud sync across devices** | Users expect seamless experience web-to-mobile | MEDIUM | Existing backend should support; need sync logic |

### Differentiators (Competitive Advantage)

Features that set Selah apart. These align with the "Bible reading with community sharing" core value.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Verse-centric social posts** | Unlike generic social apps, posts center on Scripture | HIGH | Core differentiator; rich text + images + polls |
| **Social activity feed** | See friends' highlights, bookmarks, notes (YouVersion feature) | MEDIUM | "What friends are reading" creates community |
| **Verse images for sharing** | Create beautiful graphics from verses (YouVersion Verse Images: 1.8M+ created) | HIGH | Canvas/image generation; templates, backgrounds |
| **Reading plans with friends** | Accountability through shared progress; YouVersion "Plans With Friends" | HIGH | Group progress, private discussion area |
| **Haptic feedback on interactions** | Polished feel for likes, bookmarks, navigation | LOW | Expo Haptics; subtle confirmation |
| **Deep linking to verses/posts** | Open app directly to content from notifications, shares | MEDIUM | Universal Links (iOS) + App Links (Android) |
| **Swipe navigation between chapters** | Natural mobile reading gesture | LOW | Gesture handler; intuitive for readers |
| **Pull-to-refresh on feeds** | Standard mobile pattern; keeps content fresh | LOW | Built into React Native lists |
| **Infinite scroll social feed** | Smooth content loading; no pagination friction | MEDIUM | FlashList + React Query recommended |
| **User profiles with reading history** | Social identity + accountability | MEDIUM | Already planned from web port |

### Mobile-Specific Patterns (Web Doesn't Have)

Unique mobile UX patterns that don't exist on web.

| Pattern | Implementation | Complexity | Notes |
|---------|---------------|------------|-------|
| **Native push notifications** | FCM (Android) + APNs (iOS) via Expo | MEDIUM | Already planned; critical for engagement |
| **Home screen widgets** | Verse of the day, reading plan progress | HIGH | Out of scope for v1, but high value |
| **Bottom tab navigation** | Standard iOS/Android pattern vs web sidebar | LOW | React Navigation bottom tabs |
| **Gesture-based navigation** | Swipe back (iOS native), swipe between chapters | MEDIUM | Must not conflict with other swipes |
| **Share sheet (receive)** | Accept shares from other apps | MEDIUM | Out of scope v1; adds complexity |
| **Biometric quick unlock** | Face ID, fingerprint for returning users | MEDIUM | Out of scope v1; nice to have |
| **System font scaling** | Respect user's accessibility settings | LOW | Support Dynamic Type (iOS), font scale (Android) |
| **Haptic feedback** | Tactile confirmation for key actions | LOW | expo-haptics; impact, selection, notification types |
| **Background audio** | Continue Bible audio when app backgrounded | HIGH | Requires audio session management |
| **Offline-first architecture** | Read, highlight, note while offline; sync later | HIGH | Complex state management; conflict resolution |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems. Deliberately NOT building these.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| **Real-time everything** | Feels "modern" and "live" | Complexity, battery drain, server cost; reading is not real-time | Update on pull-to-refresh; background sync |
| **Custom Bible translations upload** | Power users want obscure translations | Copyright liability; QA nightmare; storage bloat | Support popular translations well; link to web for rare ones |
| **AI-generated devotionals** | Trendy; FaithPod has "Bible Chat Assistant" | Theological accuracy concerns; user trust; potential for misinformation | Human-curated reading plans from trusted sources |
| **Gamification/achievements** | YouVersion has achievement system | Can trivialize Scripture; "grinding" Bible reading feels wrong | Gentle progress indicators; celebration without competition |
| **Social pressure metrics** | Show follower counts, like counts prominently | theWell hides these intentionally; reduces social anxiety | Optional visibility; focus on connection not comparison |
| **Voice rooms/audio chat** | FaithPod offers group voice rooms | High complexity; moderation challenges; scope creep | Text-based comments on posts; DMs later |
| **Dating features** | FaithCircle combines dating + Bible | Mission drift; different product category entirely | Stay focused on Bible reading community |
| **Complex video features** | TikTok-style video feed | High complexity; bandwidth; storage; moderation; distracts from reading | Allow image posts; link to external videos |
| **Aggressive notification frequency** | "Drive engagement" | 46% opt-out at 2-5 messages/week; 78% churn without clear strategy | Quality over quantity; user-controlled frequency |
| **Lock screen Bible reading** | Constant Scripture visibility | Battery drain; privacy concerns; OS restrictions | Home screen widget (future); daily verse notification |

## Feature Dependencies

```
[Bible Reading Core]
    |
    |---requires---> [Authentication]
    |                    |
    |                    +---enhances---> [Cloud Sync]
    |
    +---enables---> [Highlights/Bookmarks/Notes]
    |                    |
    |                    +---enables---> [Social Activity Feed]
    |
    +---enables---> [Reading Plans]
    |                    |
    |                    +---enables---> [Plans With Friends]
    |                    |
    |                    +---enhances---> [Push Notifications]
    |
    +---enables---> [Search]

[Social Core]
    |
    +---requires---> [User Profiles]
    |                    |
    |                    +---enables---> [Follows]
    |                                        |
    |                                        +---enables---> [Social Feed]
    |
    +---requires---> [Verse Posts]
                         |
                         +---enables---> [Likes/Replies]
                         |
                         +---enhances---> [Verse Images]

[Mobile-Specific]
    |
    +---requires---> [Push Notifications] --requires--> [Device Registration]
    |
    +---requires---> [Offline Mode] --requires--> [Local Database]
    |
    +---requires---> [Deep Linking] --requires--> [Universal Links config]
    |
    +---enhances---> [Share Out] --uses--> [Native Share Sheet]

[Conflicts]
    - Swipe chapter navigation conflicts with swipe-to-delete on lists
    - Pull-to-refresh conflicts with scroll-to-top in some contexts
    - Offline mode complexity conflicts with real-time features
```

### Dependency Notes

- **Bible Reading requires Auth:** Even anonymous reading needs user ID for sync
- **Social Feed requires Highlights + Follows:** No feed without content or connections
- **Reading Plans With Friends requires Reading Plans + Social:** Build single-user plans first
- **Push Notifications enhance everything:** Daily verse, plan reminders, social activity
- **Offline Mode affects all features:** Must decide offline scope early (reading only? highlights?)
- **Deep Linking requires URL structure:** Plan deep link schema early for all content types

## MVP Definition

### Launch With (v1)

Minimum viable product - what's needed to validate the core value proposition.

- [x] **Bible reading with multi-translation support** - Core functionality
- [x] **Swipe navigation between chapters** - Mobile-native reading experience
- [x] **Authentication (Google + Apple)** - Required for social, Apple required for App Store
- [x] **Highlights and bookmarks** - Basic engagement with Scripture
- [x] **Notes (private)** - Personal reflection capture
- [x] **Search** - Find verses by keyword
- [x] **User profiles** - Social identity
- [x] **Follows** - Build community connections
- [x] **Verse posts with rich text** - Core social sharing
- [x] **Likes and replies** - Basic social engagement
- [x] **Social feed** - See what friends are sharing
- [x] **Notifications feed** - In-app notification center
- [x] **Reading plans (browse, join, track)** - Engagement and habit formation
- [x] **Push notifications** - Re-engagement driver
- [x] **Offline Bible reading** - Essential mobile feature
- [x] **Share out to other apps** - Spread content beyond app
- [x] **Deep linking** - Navigate from notifications/shares
- [x] **Dark mode** - User comfort
- [x] **Adjustable font size** - Accessibility

### Add After Validation (v1.x)

Features to add once core is working and users are engaged.

- [ ] **Verse images creation** - Trigger: Users requesting image sharing options
- [ ] **Reading plans with friends** - Trigger: Users trying to share plans manually
- [ ] **Audio Bible playback** - Trigger: User research shows demand for listening
- [ ] **Private notes on posts** - Trigger: Users wanting personal reflection on others' posts
- [ ] **Image posts** - Trigger: Users wanting richer content creation
- [ ] **Polls in posts** - Trigger: Community discussion engagement metrics

### Future Consideration (v2+)

Features to defer until product-market fit is established.

- [ ] **Home screen widgets** - HIGH complexity; OS-specific implementations
- [ ] **Background audio** - HIGH complexity; audio session management
- [ ] **Offline social features** - HIGH complexity; sync conflict resolution
- [ ] **Receive shares from other apps** - MEDIUM complexity; limited user value
- [ ] **Biometric auth** - LOW value; OS handles app unlock
- [ ] **Video posts** - Scope creep; different product category

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Bible reading + swipe nav | HIGH | MEDIUM | P1 |
| Highlights/bookmarks/notes | HIGH | MEDIUM | P1 |
| Authentication | HIGH | MEDIUM | P1 |
| Offline Bible reading | HIGH | HIGH | P1 |
| Social feed | HIGH | MEDIUM | P1 |
| Verse posts | HIGH | HIGH | P1 |
| Push notifications | HIGH | MEDIUM | P1 |
| Reading plans | HIGH | HIGH | P1 |
| Deep linking | MEDIUM | MEDIUM | P1 |
| Search | MEDIUM | LOW | P1 |
| Dark mode + font size | MEDIUM | LOW | P1 |
| Verse images | HIGH | HIGH | P2 |
| Plans with friends | HIGH | HIGH | P2 |
| Audio Bible | HIGH | HIGH | P2 |
| Image posts | MEDIUM | MEDIUM | P2 |
| Polls | MEDIUM | MEDIUM | P2 |
| Widgets | HIGH | HIGH | P3 |
| Background audio | MEDIUM | HIGH | P3 |
| Biometric auth | LOW | MEDIUM | P3 |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration

## Competitor Feature Analysis

| Feature | YouVersion | Dwell | Grow | theWell | Selah Approach |
|---------|------------|-------|------|---------|----------------|
| Multi-translation | 2,500+ versions | 14 versions | 7 translations | Limited | Support popular ones; use existing API |
| Audio Bible | Yes (dramatized) | Premium (20 voices) | No | No | Defer to v1.x; evaluate licensing |
| Verse images | Yes (very popular) | No | Yes | No | P2 - high differentiator potential |
| Reading plans | 1,000+ | Playlists | Yes (devotionals) | No | Yes - core engagement feature |
| Plans with friends | Yes | Yes (share playlists) | No | No | P2 - social differentiator |
| Social feed | Activity stream | No | Yes (full social) | Yes (full social) | Yes - core product |
| Highlights/notes | Yes | Favorites | Basic | Basic | Yes - enhance with social sharing |
| Widgets | Yes (iOS 14+) | No | No | No | Defer to v2 |
| Dark mode | Yes | Yes | Yes | Yes | Yes - standard expectation |
| Offline | Yes | Yes (download) | Limited | No | Yes - critical for mobile |
| Privacy features | No | N/A | No | Yes (hide metrics) | Optional - respect user preference |
| Push notifications | Yes | Yes | Yes | Yes | Yes - smart frequency |

## Mobile UX Patterns to Implement

### Gestures

| Gesture | Action | Platform | Notes |
|---------|--------|----------|-------|
| Swipe left/right | Navigate chapters | Both | Must disable for lists |
| Swipe from left edge | Back navigation | iOS | System standard; don't override |
| Pull down | Refresh feed | Both | Standard pattern |
| Long press | Select verse/show menu | Both | For highlighting, sharing |
| Double tap | Like post | Both | Instagram-popularized pattern |
| Pinch | Zoom text (optional) | Both | Alternative to font slider |

### Haptic Feedback

| Action | Haptic Type | Notes |
|--------|-------------|-------|
| Like/bookmark tap | Light impact | Quick confirmation |
| Complete reading plan day | Success notification | Celebration moment |
| Error (network, validation) | Error notification | Alert user |
| Long press menu appears | Selection | Tactile menu opening |
| Pull-to-refresh threshold | Light impact | Indicate refresh will trigger |

### Navigation

- **Bottom tabs:** Home (feed), Bible, Plans, Notifications, Profile
- **Stack navigation:** Within each tab for drill-down
- **Modal sheets:** Quick actions, sharing, verse selection
- **Floating action button:** Optional for new post (common pattern)

## Sources

### Primary Competitors Analyzed
- [YouVersion Bible App](https://www.youversion.com/bible-app) - 1B+ installs, market leader
- [Dwell Audio Bible](https://dwellapp.io/) - Premium audio focus
- [Grow Christian Social App](https://play.google.com/store/apps/details?id=co.growfaith.grow) - Social + devotional
- [theWell Christian Social Media](https://apps.apple.com/us/app/thewell-christian-social-media/id1370790950) - Privacy-focused social
- [FaithPod](https://play.google.com/store/apps/details?id=com.faithpod.christiansocial) - Voice rooms, AI chat

### Mobile UX Research
- [17 Best Bible Apps Reviewed 2026](https://theleadpastor.com/tools/best-bible-apps/) - Feature comparison
- [7 Best Christian Social Media Apps 2026](https://actssocial.com/blog/best-christian-social-media-apps) - Social app landscape
- [Push Notification Best Practices 2025](https://upshot-ai.medium.com/push-notifications-best-practices-for-2025-dos-and-don-ts-34f99de4273d) - Engagement patterns
- [2025 Guide to Haptics](https://saropa-contacts.medium.com/2025-guide-to-haptics-enhancing-mobile-ux-with-tactile-feedback-676dd5937774) - Tactile UX patterns
- [Font Size for Older Adults](https://pmc.ncbi.nlm.nih.gov/articles/PMC9376262/) - Accessibility research
- [Deep Linking Guide 2025](https://www.bitcot.com/mobile-application-deep-linking/) - Universal/App Links

### Engagement Statistics
- [YouVersion 2025 Verse of the Year](https://www.youversion.com/news/youversion-announces-2025-verse-of-the-year) - Usage patterns
- [Push Notification Benchmarks 2025](https://www.airship.com/resources/benchmark-report/mobile-app-push-notification-benchmarks-for-2025/) - Retention data

---
*Feature research for: Mobile Bible social platform (Selah)*
*Researched: 2026-02-02*
