# Phase 4: Profiles & Connections - Context

**Gathered:** 2026-02-05
**Status:** Ready for planning

<domain>
## Phase Boundary

Users can view profiles and build social connections. View own profile with bio and posts, edit profile (name, bio, avatar), view other users' profiles, see follower/following counts, follow/unfollow users, and browse follower/following lists.

</domain>

<decisions>
## Implementation Decisions

### Profile layout
- Clean minimal header — no cover image, avatar with name/bio below
- Twitter-style stats placement — follower/following counts as tappable row below bio
- Posts section and own-vs-others distinction: match selah-web design

### Edit experience
- Push navigation to dedicated edit screen (not modal or bottom sheet)
- Avatar changes via action sheet: Take Photo / Choose from Library / Remove
- Cancel / Done buttons in header — Done saves all changes at once
- Confirmation dialog when leaving with unsaved changes ("Discard changes?")

### Follow interactions
- Loading state on Follow button (spinner while request processes)
- Immediate unfollow on tap — no confirmation dialog
- All profiles public for now (no private profiles or follow requests)
- Own profile shows Edit Profile button instead of Follow button
- Users cannot follow themselves

### Lists display
- Tap follower/following count to push to list screen
- Row design: match selah-web
- No search or filtering — simple scroll
- Infinite scroll for loading more users

### Claude's Discretion
- Loading skeletons and empty states
- Exact spacing, typography, and animations
- Error handling for failed requests
- Pull-to-refresh on lists

</decisions>

<specifics>
## Specific Ideas

- "Match selah-web" is the design reference for: profile header stats, posts section, own-vs-others distinction, and list row design
- Twitter-style stats row (tappable counts) for followers/following

</specifics>

<deferred>
## Deferred Ideas

- Private profiles with follow requests — future phase
- Blocking users — future phase

</deferred>

---

*Phase: 04-profiles-connections*
*Context gathered: 2026-02-05*
