# Architecture Research

**Domain:** React Native social/content app (Bible reading + community sharing)
**Researched:** 2026-02-02
**Confidence:** HIGH (verified with official Expo docs, Relay docs, community patterns)

## Standard Architecture

### System Overview

```
+------------------------------------------------------------------+
|                      Presentation Layer                           |
+------------------------------------------------------------------+
|  +-------------+  +-------------+  +-------------+  +-----------+ |
|  | Bible       |  | Feed        |  | Profile     |  | Settings  | |
|  | Screens     |  | Screens     |  | Screens     |  | Screens   | |
|  +------+------+  +------+------+  +------+------+  +-----+-----+ |
|         |                |                |               |       |
+---------|----------------|----------------|---------------|-------+
          |                |                |               |
+---------|----------------|----------------|---------------|-------+
|         v                v                v               v       |
|                      Navigation Layer                             |
|  +------------------------------------------------------------+  |
|  |              Expo Router (File-based)                       |  |
|  |   app/(tabs)/ -> Tab Navigator                              |  |
|  |   app/(tabs)/feed/ -> Stack within Feed tab                 |  |
|  |   app/modal.tsx -> Modal screens                            |  |
|  +------------------------------------------------------------+  |
+------------------------------------------------------------------+
          |
+---------|------------------------------------------------------------+
|         v              Data Layer                                    |
|  +------------------+  +------------------+  +---------------------+  |
|  | Relay Store      |  | SQLite (Offline) |  | Auth Context        |  |
|  | (Server Data)    |  | (Bible Content)  |  | (Session State)     |  |
|  +--------+---------+  +--------+---------+  +---------+-----------+  |
|           |                     |                      |              |
|           v                     v                      v              |
|  +------------------+  +------------------+  +---------------------+  |
|  | Relay Network    |  | Sync Manager     |  | Better Auth Client  |  |
|  | (GraphQL)        |  | (Download/Update)|  | (Google/Apple)      |  |
|  +--------+---------+  +--------+---------+  +---------+-----------+  |
+--------------------------------------------------------------------- +
           |                      |                      |
           v                      v                      v
+----------------------------------------------------------------------+
|                         External Services                             |
|  +----------------+  +----------------+  +---------------------------+ |
|  | GraphQL API    |  | Bible API      |  | Push Service              | |
|  | (selah-web)    |  | (Translations) |  | (Expo Push/FCM/APNs)      | |
|  +----------------+  +----------------+  +---------------------------+ |
+----------------------------------------------------------------------+
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| **Screens** | UI rendering, user interaction | React components with Relay fragments |
| **Expo Router** | Navigation state, deep linking, URL structure | File-based routes in `app/` directory |
| **Relay Store** | Server state cache, optimistic updates | In-memory normalized store with fragments |
| **SQLite** | Offline Bible content, user preferences | `expo-sqlite` with typed queries |
| **Auth Context** | Session state, token management | React context wrapping Better Auth |
| **Relay Network** | GraphQL request/response | Custom fetch function with auth headers |
| **Sync Manager** | Offline content download, version tracking | Background task with expo-sqlite |
| **Push Service** | Notification delivery | expo-notifications with Expo Push |

## Recommended Project Structure

```
src/
├── app/                          # Expo Router screens (file-based routing)
│   ├── (tabs)/                   # Tab navigator group
│   │   ├── _layout.tsx           # Tab bar configuration
│   │   ├── index.tsx             # Home/Feed tab
│   │   ├── bible/                # Bible tab stack
│   │   │   ├── _layout.tsx       # Stack navigator for Bible
│   │   │   ├── index.tsx         # Book selection
│   │   │   ├── [book]/           # Dynamic route for book
│   │   │   │   └── [chapter].tsx # Chapter reading view
│   │   │   └── translations.tsx  # Translation picker
│   │   ├── notifications.tsx     # Notifications tab
│   │   └── profile/              # Profile tab stack
│   │       ├── _layout.tsx
│   │       ├── index.tsx
│   │       └── [userId].tsx      # Other user profiles
│   ├── (auth)/                   # Auth screens group (unauthenticated)
│   │   ├── _layout.tsx
│   │   ├── sign-in.tsx
│   │   └── sign-up.tsx
│   ├── post/                     # Post-related modals/screens
│   │   ├── [postId].tsx          # Post detail
│   │   └── create.tsx            # Create post modal
│   ├── _layout.tsx               # Root layout (providers, auth check)
│   └── +not-found.tsx            # 404 screen
│
├── components/                   # Shared UI components
│   ├── ui/                       # Primitive UI components (gluestack-style)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── bible/                    # Bible-specific components
│   │   ├── verse-text.tsx
│   │   ├── chapter-view.tsx
│   │   ├── translation-picker.tsx
│   │   └── verse-selector.tsx
│   ├── feed/                     # Feed-specific components
│   │   ├── post-card.tsx
│   │   ├── post-list.tsx
│   │   └── create-post-form.tsx
│   ├── profile/                  # Profile components
│   │   ├── user-avatar.tsx
│   │   ├── user-stats.tsx
│   │   └── follow-button.tsx
│   └── rich-text/                # Rich text rendering/editing
│       ├── renderer.tsx
│       └── editor.tsx
│
├── relay/                        # Relay configuration
│   ├── environment.ts            # Relay environment setup
│   ├── network.ts                # Network layer with auth
│   └── __generated__/            # Relay compiler output
│
├── lib/                          # Core utilities and services
│   ├── auth/                     # Authentication
│   │   ├── context.tsx           # Auth context provider
│   │   ├── client.ts             # Better Auth client setup
│   │   └── hooks.ts              # useAuth, useSession
│   ├── offline/                  # Offline data management
│   │   ├── database.ts           # SQLite setup and migrations
│   │   ├── bible-store.ts        # Bible content operations
│   │   └── sync.ts               # Download/update logic
│   ├── notifications/            # Push notification handling
│   │   ├── setup.ts              # Registration and permissions
│   │   └── handlers.ts           # Notification response handling
│   └── theme/                    # Theming
│       ├── colors.ts             # OKLCH color tokens
│       └── provider.tsx          # Theme context
│
├── hooks/                        # Shared React hooks
│   ├── use-bible.ts              # Bible reading state
│   ├── use-offline.ts            # Offline status detection
│   └── use-deep-link.ts          # Deep link handling
│
├── constants/                    # App-wide constants
│   ├── bible.ts                  # Book names, abbreviations
│   └── config.ts                 # API URLs, feature flags
│
└── types/                        # TypeScript types
    ├── bible.ts                  # Bible-related types
    ├── navigation.ts             # Navigation param types
    └── graphql.ts                # Re-exports from Relay generated
```

### Structure Rationale

- **`app/` (Expo Router):** File-based routing provides automatic deep linking, intuitive URL structure, and familiar web patterns. Grouping with `(tabs)` and `(auth)` separates navigation concerns.

- **`components/` by domain:** Components organized by feature domain (bible, feed, profile) with shared `ui/` primitives. Scales better than flat structure as features grow.

- **`relay/` isolated:** Relay configuration centralized. Generated files in predictable location for easy gitignore and build tooling.

- **`lib/` for services:** Non-component logic (auth, offline, notifications) lives here. Clear separation between UI and business logic.

- **`hooks/` for shared state:** Custom hooks that span multiple screens. Domain-specific hooks stay in their feature directories.

## Architectural Patterns

### Pattern 1: Relay Fragment Colocation

**What:** Each component declares exactly the data it needs via a Relay fragment. Parent components compose child fragments.

**When to use:** All server data fetching. This is the core Relay pattern.

**Trade-offs:**
- PRO: Optimal data fetching, no over-fetching, automatic re-renders on data change
- PRO: Type safety from generated types
- CON: Learning curve, requires Relay compiler in build

**Example:**
```typescript
// components/feed/post-card.tsx
import { graphql, useFragment } from 'react-relay';
import type { PostCard_post$key } from './__generated__/PostCard_post.graphql';

const PostCardFragment = graphql`
  fragment PostCard_post on Post {
    id
    content
    createdAt
    author {
      ...UserAvatar_user
      name
    }
    verses {
      reference
      text
    }
    likeCount
    viewerHasLiked
  }
`;

export function PostCard({ post }: { post: PostCard_post$key }) {
  const data = useFragment(PostCardFragment, post);
  // Render with data...
}
```

### Pattern 2: Dual Data Source (Online + Offline)

**What:** Server data via Relay for social features, local SQLite for Bible content. Clear boundary between what's synced and what's cached locally.

**When to use:** When some content must work offline (Bible) while other content is inherently online (feed, notifications).

**Trade-offs:**
- PRO: Bible always available offline, no network dependency for core reading
- PRO: Social features stay fresh with Relay's cache management
- CON: Two data sources to reason about, need clear boundaries

**Example:**
```typescript
// lib/offline/bible-store.ts
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('bible.db');

export async function getChapter(
  translation: string,
  book: string,
  chapter: number
): Promise<Verse[]> {
  return db.getAllAsync<Verse>(
    `SELECT * FROM verses
     WHERE translation = ? AND book = ? AND chapter = ?
     ORDER BY verse_number`,
    [translation, book, chapter]
  );
}

// In component:
// Social data from Relay, Bible content from SQLite
const feedData = useFragment(FeedFragment, feedRef);
const bibleVerses = useBibleChapter('ESV', 'Genesis', 1);
```

### Pattern 3: Protected Route Groups

**What:** Expo Router route groups with authentication checks at the layout level.

**When to use:** Separating authenticated from unauthenticated screens.

**Trade-offs:**
- PRO: Clear separation, automatic redirect logic
- PRO: Deep links work with auth state
- CON: Slightly more complex layout hierarchy

**Example:**
```typescript
// app/_layout.tsx
import { useAuth } from '@/lib/auth/hooks';
import { Redirect, Stack } from 'expo-router';

export default function RootLayout() {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {session ? (
        <Stack.Screen name="(tabs)" />
      ) : (
        <Stack.Screen name="(auth)" />
      )}
    </Stack>
  );
}
```

### Pattern 4: Outbox Pattern for Offline Writes

**What:** Mutations queue locally when offline, sync when connection restored. Each mutation has idempotency key.

**When to use:** Any user action that should persist even if briefly offline (likes, follows, creating posts while on unstable connection).

**Trade-offs:**
- PRO: UX never blocks on network
- PRO: No lost actions due to flaky connections
- CON: Complexity in conflict resolution
- CON: UI must show pending states

**Example:**
```typescript
// lib/offline/sync.ts
interface OutboxEntry {
  id: string;          // Idempotency key
  mutation: string;    // GraphQL mutation name
  variables: unknown;  // Mutation variables
  createdAt: number;
  status: 'pending' | 'syncing' | 'failed';
}

export async function queueMutation(
  mutation: string,
  variables: unknown
): Promise<string> {
  const id = crypto.randomUUID();
  await db.runAsync(
    `INSERT INTO outbox (id, mutation, variables, created_at, status)
     VALUES (?, ?, ?, ?, 'pending')`,
    [id, mutation, JSON.stringify(variables), Date.now()]
  );
  triggerSync(); // Start sync if online
  return id;
}

export async function processOutbox() {
  const pending = await db.getAllAsync<OutboxEntry>(
    `SELECT * FROM outbox WHERE status = 'pending' ORDER BY created_at`
  );

  for (const entry of pending) {
    try {
      await executeMutation(entry);
      await db.runAsync(`DELETE FROM outbox WHERE id = ?`, [entry.id]);
    } catch (error) {
      if (isDuplicateError(error)) {
        // Already processed, remove from outbox
        await db.runAsync(`DELETE FROM outbox WHERE id = ?`, [entry.id]);
      } else {
        // Mark as failed, will retry
        await db.runAsync(
          `UPDATE outbox SET status = 'failed' WHERE id = ?`,
          [entry.id]
        );
      }
    }
  }
}
```

## Data Flow

### Request Flow (Online - Relay)

```
[User Taps Feed]
    |
    v
[Screen Component]
    |
    v
[useLazyLoadQuery / useFragment] --> [Relay Store]
    |                                     |
    | (cache miss)                        | (cache hit)
    v                                     v
[Relay Network]                     [Return cached data]
    |
    v
[GraphQL API] --> [Response] --> [Normalize to Store] --> [Component re-renders]
```

### Bible Content Flow (Offline - SQLite)

```
[User Opens Chapter]
    |
    v
[BibleScreen Component]
    |
    v
[useBibleChapter Hook]
    |
    v
[SQLite Query] --> [Return verses] --> [Render chapter]

[Background: Check for translation updates]
    |
    v
[Sync Manager] --> [Download if new version] --> [Update SQLite]
```

### Mutation Flow (Hybrid)

```
[User Taps Like]
    |
    v
[Optimistic Update] --> [Relay Store Update] --> [UI shows liked]
    |
    |-- [Online?] --YES--> [Send Mutation] --> [Server confirms]
    |
    |-- [Online?] --NO--> [Queue in Outbox]
                               |
                               v
                          [Connection restored]
                               |
                               v
                          [Process Outbox] --> [Send Mutation]
```

### Authentication Flow

```
[App Launch]
    |
    v
[Check Stored Session] --> [Valid?] --YES--> [Load (tabs)]
    |                          |
    |                          NO
    |                          |
    v                          v
[Session Expired?]        [Show (auth)]
    |                          |
YES |                          | [User signs in]
    v                          v
[Refresh Token] --FAIL--> [Show (auth)]
    |
SUCCESS
    |
    v
[Load (tabs)]
```

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0-10k users | Current architecture is fine. SQLite handles Bible content easily. Relay cache handles normal usage. |
| 10k-100k users | May need to paginate more aggressively. Consider lazy loading heavy screens. Relay's GC release buffer may need tuning. |
| 100k+ users | Feed rendering becomes critical. Consider `FlashList` for long lists. May need to shard Bible SQLite by translation. Background sync should be smarter about battery. |

### Scaling Priorities

1. **First bottleneck: List rendering** - Feed and notification lists will hit performance issues first. Use `FlashList` from the start, implement proper pagination with Relay connections.

2. **Second bottleneck: SQLite query performance** - As Bible content grows (multiple translations), queries may slow. Add proper indexes, consider FTS5 for search.

3. **Third bottleneck: Memory** - Large Relay store + SQLite + images in memory. Tune Relay GC, use proper image caching with `expo-image`.

## Anti-Patterns

### Anti-Pattern 1: Fetching in Components Without Fragments

**What people do:** Using `fetch()` or axios directly in components instead of Relay fragments.

**Why it's wrong:** Loses all Relay benefits - no caching, no optimistic updates, no automatic re-renders, no data colocation, no type safety.

**Do this instead:** Always use Relay for server data. Define fragments for each component's data needs.

### Anti-Pattern 2: Mixing Online and Offline Data Sources

**What people do:** Trying to cache Relay data in SQLite for offline, or fetching Bible content from GraphQL.

**Why it's wrong:** Creates complex sync logic, duplicate data, inconsistent states. Two caching layers fighting each other.

**Do this instead:** Clear separation - Relay for social/online content, SQLite for Bible/offline content. Don't mix.

### Anti-Pattern 3: Passing Data Through Navigation Params

**What people do:** Passing full objects through navigation params to avoid refetching.

**Why it's wrong:** Navigation params should be minimal (IDs, references). Large objects cause serialization overhead, memory issues, and stale data.

**Do this instead:** Pass IDs, let destination screen fetch from Relay store (cache hit will be instant).

```typescript
// Bad
navigation.navigate('Post', { post: fullPostObject });

// Good
navigation.navigate('Post', { postId: post.id });
// In PostScreen: useFragment to get data from Relay store
```

### Anti-Pattern 4: Global State for Server Data

**What people do:** Using Zustand/Jotai/Redux for server-fetched data.

**Why it's wrong:** Relay already manages server state. Adding another state layer creates duplication, sync issues, and confusion about source of truth.

**Do this instead:** Relay for server state, local state managers (if needed) only for purely client-side state (UI state, form state, etc.).

### Anti-Pattern 5: Blocking UI on Network for Bible Content

**What people do:** Fetching Bible verses from the server on every read.

**Why it's wrong:** Bible content rarely changes. Users expect instant access. Network dependency for core feature is unacceptable.

**Do this instead:** Pre-download Bible translations to SQLite. Check for updates in background. Never block reading on network.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| GraphQL API (selah-web) | Relay Network layer with auth header injection | Same API as web, no mobile-specific endpoints needed |
| Push Notifications | expo-notifications with Expo Push Service | Token sent to backend on registration, backend sends via Expo Push API |
| Google Sign-In | @react-native-google-signin with Better Auth | ID token sent to backend for session creation |
| Apple Sign-In | expo-apple-authentication with Better Auth | Identity token sent to backend for session creation |
| Deep Links | Expo Router automatic handling | Universal links configured in app.json, verified with AASA file on web domain |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Screens <-> Relay | Fragment refs, hooks | Screens never call network directly |
| Screens <-> SQLite | Custom hooks (useBibleChapter, etc.) | Abstraction layer hides SQLite details |
| Auth <-> All | React Context | AuthProvider wraps app, useAuth hook everywhere |
| Notifications <-> Navigation | Expo Router linking | Notification tap triggers navigation via deep link |
| Offline Sync <-> SQLite | Direct function calls | Sync manager owns SQLite writes for Bible content |

## Build Order Implications

Based on dependencies between components:

1. **Foundation (must be first)**
   - Expo Router setup with route groups
   - Theme provider with OKLCH colors
   - Basic UI components (button, input, card)

2. **Data Layer (depends on foundation)**
   - Relay environment and network layer
   - SQLite database setup and migrations
   - Auth context and Better Auth client

3. **Bible Features (depends on data layer)**
   - Bible SQLite schema and operations
   - Translation download/sync
   - Chapter reading view
   - Verse selection

4. **Social Features (depends on data layer, can parallel with Bible)**
   - Feed list with Relay pagination
   - Post creation (requires rich text decision)
   - Likes, follows (optimistic updates)
   - User profiles

5. **Notifications (depends on auth)**
   - Push token registration
   - Notification handlers
   - Notifications screen

6. **Polish (depends on all above)**
   - Deep linking verification
   - Offline state handling
   - Error boundaries
   - Loading states

## Sources

### Official Documentation (HIGH confidence)
- [Expo Router Introduction](https://docs.expo.dev/router/introduction/)
- [Expo Local-First Architecture Guide](https://docs.expo.dev/guides/local-first/)
- [Expo SQLite Documentation](https://docs.expo.dev/versions/latest/sdk/sqlite/)
- [Expo Push Notifications Setup](https://docs.expo.dev/push-notifications/push-notifications-setup/)
- [Relay Guided Tour - Presence of Data](https://relay.dev/docs/guided-tour/reusing-cached-data/presence-of-data/)
- [Expo Common Navigation Patterns](https://docs.expo.dev/router/basics/common-navigation-patterns/)
- [Expo Deep Linking Overview](https://docs.expo.dev/linking/overview/)
- [Expo Authentication Guide](https://docs.expo.dev/develop/authentication/)
- [Expo Rich Text Editing Guide](https://docs.expo.dev/guides/editing-richtext/)

### Community Patterns (MEDIUM confidence)
- [Expo App Folder Structure Best Practices](https://expo.dev/blog/expo-app-folder-structure-best-practices) - Expo Blog
- [React Native Relay Performance Case Study](https://medium.com/@felippepuhle/how-we-improved-a-react-native-app-performance-by-using-graphql-and-relay-ed983a89747b)
- [Offline-First SQLite Sync Pattern](https://dev.to/sathish_daggula/how-to-build-offline-first-sqlite-sync-in-expo-1lli)
- [react-relay-offline Library](https://github.com/morrys/react-relay-offline)
- [Feature-Based React Folder Structure](https://asrulkadir.medium.com/3-folder-structures-in-react-ive-used-and-why-feature-based-is-my-favorite-e1af7c8e91ec)
- [gluestack-ui v3 Release](https://gluestack.io/blogs/gluestack-v3-release) - Component library patterns

### Architecture References (MEDIUM confidence)
- [State Management in 2026](https://www.nucamp.co/blog/state-management-in-2026-redux-context-api-and-modern-patterns)
- [Cross-Platform Lexical Editor Architecture](https://storyie.com/blog/cross-platform-lexical-editor)
- [React Native Push Notifications Guide](https://www.courier.com/blog/react-native-push-notifications-fcm-expo-guide)

---
*Architecture research for: Selah Mobile - React Native Bible social platform*
*Researched: 2026-02-02*
