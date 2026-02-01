# Architecture Research

**Domain:** React Native Bible/Social App with Relay GraphQL
**Researched:** 2026-02-01
**Confidence:** HIGH (verified with official documentation and multiple sources)

## System Overview

```
+------------------------------------------------------------------+
|                         App Root Layer                            |
|  +------------------------------------------------------------+  |
|  |  _layout.tsx (Root)                                        |  |
|  |  - RelayEnvironmentProvider                                |  |
|  |  - AuthContext Provider                                    |  |
|  |  - Notification Handlers                                   |  |
|  |  - Font/Asset Loading                                      |  |
|  +------------------------------------------------------------+  |
+------------------------------------------------------------------+
                              |
                              v
+------------------------------------------------------------------+
|                      Navigation Layer                             |
|  +---------------------------+  +-----------------------------+  |
|  |  (auth) Group             |  |  (tabs) Group               |  |
|  |  - login.tsx              |  |  - _layout.tsx (Tab Nav)    |  |
|  |  - signup.tsx             |  |  - index.tsx (Home/Feed)    |  |
|  |  - forgot-password.tsx    |  |  - read/                    |  |
|  +---------------------------+  |  - community/               |  |
|                                 |  - profile/                 |  |
|                                 +-----------------------------+  |
+------------------------------------------------------------------+
                              |
                              v
+------------------------------------------------------------------+
|                      Feature Modules                              |
|  +---------------+  +---------------+  +---------------------+   |
|  | Reading       |  | Community     |  | User                |   |
|  | - BibleReader |  | - Feed        |  | - Profile           |   |
|  | - PassageView |  | - Discussion  |  | - Settings          |   |
|  | - Bookmarks   |  | - Comments    |  | - Notifications     |   |
|  +---------------+  +---------------+  +---------------------+   |
+------------------------------------------------------------------+
                              |
                              v
+------------------------------------------------------------------+
|                       Data Layer                                  |
|  +---------------------------+  +-----------------------------+  |
|  |  Relay Environment        |  |  Local State                |  |
|  |  - Network Layer          |  |  - Auth tokens (SecureStore)|  |
|  |  - Store (RecordSource)   |  |  - User preferences (MMKV)  |  |
|  |  - Fragment Subscriptions |  |  - Offline queue            |  |
|  +---------------------------+  +-----------------------------+  |
+------------------------------------------------------------------+
                              |
                              v
+------------------------------------------------------------------+
|                     External Services                             |
|  +---------------+  +---------------+  +---------------------+   |
|  | GraphQL API   |  | Auth Provider |  | Push Service        |   |
|  | (Shared w/Web)|  | (Native SDKs) |  | (Expo + APNs/FCM)   |   |
|  +---------------+  +---------------+  +---------------------+   |
+------------------------------------------------------------------+
```

## Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| Root Layout | App initialization, providers, splash screen | `_layout.tsx` with RelayEnvironmentProvider wrapping app |
| Navigation | Route structure, tab/stack configuration | Expo Router file-based with `(tabs)` and `(auth)` groups |
| Feature Screens | UI for specific features, query data | Screen components with `useLazyLoadQuery` for page queries |
| Shared Components | Reusable UI elements with data requirements | Components with `useFragment` for colocated data needs |
| Relay Environment | GraphQL network, caching, subscriptions | Single Environment instance at app root |
| Auth Context | Authentication state, token management | React Context with SecureStore for token persistence |
| Push Handlers | Notification registration, foreground handling | expo-notifications listeners in root layout |

## Recommended Project Structure

```
/app                           # Expo Router routes only
  /_layout.tsx                 # Root layout: providers, initialization
  /index.tsx                   # Redirect to appropriate start screen
  /(auth)/                     # Authentication flow (not logged in)
    /_layout.tsx               # Stack layout for auth screens
    /login.tsx
    /signup.tsx
    /forgot-password.tsx
  /(tabs)/                     # Main app (logged in)
    /_layout.tsx               # Tab navigator layout
    /index.tsx                 # Home/Feed tab
    /read/                     # Bible reading tab
      /_layout.tsx             # Stack for reading screens
      /index.tsx               # Book/chapter selection
      /[book]/[chapter].tsx    # Dynamic passage view
    /community/                # Community/social tab
      /_layout.tsx             # Stack for community screens
      /index.tsx               # Discussion feed
      /[discussionId].tsx      # Discussion detail
    /profile/                  # Profile tab
      /_layout.tsx
      /index.tsx               # User profile
      /settings.tsx
  /+not-found.tsx              # 404 handler

/src
  /components/                 # Shared UI components
    /ui/                       # Base UI primitives
      Button.tsx
      Card.tsx
      Text.tsx
    /reading/                  # Reading-specific components
      PassageView.tsx          # + PassageView_passage.graphql
      VerseHighlight.tsx
    /community/                # Community components
      DiscussionCard.tsx       # + DiscussionCard_discussion.graphql
      CommentThread.tsx
    /common/                   # Cross-feature components
      UserAvatar.tsx           # + UserAvatar_user.graphql

  /relay/                      # Relay configuration
    environment.ts             # Relay Environment setup
    network.ts                 # Network layer (fetch function)
    __generated__/             # Relay compiler output

  /hooks/                      # Custom hooks
    useAuth.ts                 # Authentication state
    usePushNotifications.ts    # Push notification setup
    useOnlineStatus.ts         # Network connectivity

  /contexts/                   # React Contexts
    AuthContext.tsx            # Auth provider
    ThemeContext.tsx           # Theme provider

  /services/                   # External service integrations
    auth/
      index.ts                 # Auth service facade
      nativeAuth.ts            # Native SDK auth
      webAuth.ts               # Web fallback auth
    notifications/
      index.ts
      tokenManager.ts
      handlers.ts

  /utils/                      # Utility functions
    storage.ts                 # Secure storage helpers
    formatting.ts              # Text/date formatting

  /types/                      # TypeScript types (non-GraphQL)
    navigation.ts              # Navigation param types
    auth.ts                    # Auth types
```

### Structure Rationale

- **`/app` contains routes only:** Expo Router convention. Non-route code goes elsewhere to avoid route confusion.
- **Feature-based component organization:** Components grouped by domain (reading, community) with colocated fragments.
- **Relay `__generated__` in `/src/relay/`:** Centralized compiler output, separate from source.
- **Services layer:** Abstracts native/web differences for auth and notifications.

## Architectural Patterns

### Pattern 1: Relay Fragment Colocation

**What:** Each component declares its data requirements via GraphQL fragments in the same file (or adjacent `.graphql` file).

**When to use:** Every component that needs GraphQL data.

**Trade-offs:**
- PRO: Components are self-contained and reusable across contexts
- PRO: Relay compiler ensures type safety and query efficiency
- CON: More files if using `.graphql` extensions
- CON: Learning curve for fragment key passing

**Example:**
```typescript
// src/components/community/DiscussionCard.tsx
import { graphql, useFragment } from 'react-relay';
import type { DiscussionCard_discussion$key } from '@/relay/__generated__/DiscussionCard_discussion.graphql';

const DiscussionCardFragment = graphql`
  fragment DiscussionCard_discussion on Discussion {
    id
    title
    excerpt
    author {
      ...UserAvatar_user
    }
    commentCount
    createdAt
  }
`;

interface Props {
  discussion: DiscussionCard_discussion$key;
}

export function DiscussionCard({ discussion }: Props) {
  const data = useFragment(DiscussionCardFragment, discussion);
  // Render using data...
}
```

### Pattern 2: Screen-Level Query Composition

**What:** Screen components (routes) use `useLazyLoadQuery` to fetch data, spreading child fragments.

**When to use:** Every screen that needs server data.

**Trade-offs:**
- PRO: Single network request for entire screen
- PRO: Automatic fragment stitching by Relay compiler
- CON: Screen becomes data coordinator

**Example:**
```typescript
// app/(tabs)/community/index.tsx
import { graphql, useLazyLoadQuery } from 'react-relay';
import { CommunityFeedQuery } from '@/relay/__generated__/CommunityFeedQuery.graphql';

const query = graphql`
  query CommunityFeedQuery($first: Int!, $after: String) {
    viewer {
      discussions(first: $first, after: $after) {
        edges {
          node {
            id
            ...DiscussionCard_discussion
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

export default function CommunityFeedScreen() {
  const data = useLazyLoadQuery<CommunityFeedQuery>(query, { first: 20 });
  // Render DiscussionCard for each edge...
}
```

### Pattern 3: Single RelayEnvironmentProvider at Root

**What:** Relay Environment created once and provided at app root.

**When to use:** Always. Only one Environment per app.

**Trade-offs:**
- PRO: All components share the same cache/store
- PRO: Authentication token injected via closure
- CON: Environment recreation on logout requires careful handling

**Example:**
```typescript
// app/_layout.tsx
import { RelayEnvironmentProvider } from 'react-relay';
import { createEnvironment } from '@/relay/environment';
import { useAuth } from '@/hooks/useAuth';

export default function RootLayout() {
  const { token } = useAuth();
  const environment = useMemo(
    () => createEnvironment(token),
    [token] // Recreate on token change
  );

  return (
    <RelayEnvironmentProvider environment={environment}>
      <AuthProvider>
        <Stack />
      </AuthProvider>
    </RelayEnvironmentProvider>
  );
}
```

### Pattern 4: Protected Routes with Expo Router

**What:** Use route groups and conditional rendering to protect authenticated routes.

**When to use:** Separating logged-in vs logged-out experiences.

**Trade-offs:**
- PRO: File-based structure makes auth boundaries visible
- PRO: Deep links handled automatically
- CON: Requires careful initial route handling

**Example:**
```typescript
// app/_layout.tsx
import { useAuth } from '@/hooks/useAuth';
import { Redirect, Stack } from 'expo-router';

export default function RootLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="(tabs)" />
      ) : (
        <Stack.Screen name="(auth)" />
      )}
    </Stack>
  );
}
```

### Pattern 5: Stack-in-Tabs Navigation

**What:** Each tab contains its own Stack navigator for drill-down flows.

**When to use:** When tabs have multi-screen flows (e.g., feed -> detail -> comments).

**Trade-offs:**
- PRO: Intuitive URL structure (`/community/[id]`)
- PRO: Each tab maintains its own navigation state
- PRO: Deep linking works naturally
- CON: More nested layouts to manage

**Example structure:**
```
/(tabs)/
  _layout.tsx          # Tab navigator
  community/
    _layout.tsx        # Stack navigator for community tab
    index.tsx          # Discussion list
    [discussionId].tsx # Discussion detail (pushed on stack)
```

## Data Flow

### Request Flow (Query)

```
[User navigates to screen]
         |
         v
[Screen component mounts]
         |
         v
[useLazyLoadQuery called]
         |
         v
[Relay checks Store cache]
         |
    +----+----+
    |         |
[Cache hit]  [Cache miss]
    |              |
    v              v
[Return data]  [Network fetch via fetchQuery]
                   |
                   v
              [GraphQL API]
                   |
                   v
              [Store updated]
                   |
                   v
              [Components re-render]
```

### Relay Store Subscriptions

```
[Fragment data in Store changes]
         |
         v
[Store notifies subscribed components]
         |
         v
[Only components using changed fields re-render]
```

### Authentication Flow

```
[App launch]
     |
     v
[Check SecureStore for token]
     |
+----+----+
|         |
[No token] [Has token]
    |           |
    v           v
[Show auth]  [Validate token with API]
    |           |
    |      +----+----+
    |      |         |
    |   [Valid]   [Invalid]
    |      |         |
    v      v         v
[Login] [Show app] [Clear & show auth]
    |
    v
[Native SDK auth OR web fallback]
    |
    v
[Receive token]
    |
    v
[Store in SecureStore]
    |
    v
[Update AuthContext]
    |
    v
[Recreate Relay Environment with token]
    |
    v
[Navigate to (tabs)]
```

### Push Notification Flow

```
[App launch]
     |
     v
[Request notification permissions]
     |
     v
[Get Expo push token (wraps APNs/FCM)]
     |
     v
[Send token to backend via GraphQL mutation]
     |
     v
[Backend stores token associated with user]

---

[Backend wants to notify user]
     |
     v
[Backend sends to Expo Push Service]
     |
     v
[Expo routes to APNs (iOS) or FCM (Android)]
     |
     v
[Device receives notification]
     |
+----+----+
|         |
[App foreground]  [App background/closed]
    |                    |
    v                    v
[Notification listener]  [System notification]
    |                    |
    v                    v
[Custom in-app UI]    [User taps]
                         |
                         v
                    [App opens with deep link]
```

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0-1k users | Current architecture is sufficient. Single Relay store, standard caching. |
| 1k-100k users | Implement pagination (Relay connections), optimize re-renders with `@refetchable`. Add basic offline queue for writes. |
| 100k+ users | Consider splitting Relay store by feature if memory becomes issue. Implement aggressive cache policies. Add background sync for offline. |

### Scaling Priorities

1. **First bottleneck: Initial load time** - Use `@preloadable` queries, implement skeleton screens, optimize bundle splitting by route.

2. **Second bottleneck: List rendering** - Implement proper virtualization with FlashList, ensure fragment subscriptions are granular.

3. **Third bottleneck: Memory on lower-end devices** - Configure Relay store garbage collection, limit retained data window for large feeds.

## Anti-Patterns

### Anti-Pattern 1: Prop-Drilling GraphQL Data

**What people do:** Fetch data in a parent and pass it down through props to deeply nested children.

**Why it's wrong:** Defeats Relay's fragment colocation. Children become coupled to parent's query shape. Changes require editing multiple files.

**Do this instead:** Each component that needs data declares its own fragment. Pass fragment keys, not data.

### Anti-Pattern 2: Shared/Generic Fragments

**What people do:** Create a `UserFragment` used by 15 different components with all possible user fields.

**Why it's wrong:** Over-fetching. Every component gets all fields even if it only needs `name`. Network and memory waste.

**Do this instead:** Each component declares exactly the fields it needs. Relay handles deduplication.

### Anti-Pattern 3: Multiple Relay Environments

**What people do:** Create new Environment in each feature or screen.

**Why it's wrong:** Each Environment has its own cache. Data consistency breaks. Same query fetches multiple times.

**Do this instead:** Single Environment at root. Recreate only on auth token change.

### Anti-Pattern 4: Direct AsyncStorage for Auth Tokens

**What people do:** Store JWT tokens in AsyncStorage.

**Why it's wrong:** AsyncStorage is not encrypted. Tokens can be extracted on rooted/jailbroken devices.

**Do this instead:** Use `expo-secure-store` for sensitive tokens. It uses Keychain (iOS) and Keystore (Android).

### Anti-Pattern 5: Mixing Navigation State Sources

**What people do:** Track navigation state in Redux AND Expo Router.

**Why it's wrong:** Two sources of truth. State gets out of sync. Deep linking breaks.

**Do this instead:** Let Expo Router own navigation state entirely. Use its hooks (`useSegments`, `usePathname`) for state-dependent logic.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| GraphQL API (shared backend) | Relay Network Layer | Auth token in headers. Same schema as web app. |
| Auth (Native SDKs) | Service facade pattern | `react-native-app-auth` for OAuth. Fallback to web for unsupported providers. |
| Auth (Web fallback) | expo-auth-session | For providers without native SDK support. Opens in-app browser. |
| Push (Expo) | expo-notifications | Gets Expo push token. Backend sends via Expo Push Service. |
| Secure Storage | expo-secure-store | Keychain/Keystore for tokens. |
| Fast KV Storage | react-native-mmkv | User preferences, feature flags. 30-50x faster than AsyncStorage. |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Screen <-> Components | Fragment keys via props | Never pass raw data, always fragment refs |
| Auth <-> Relay | Token via Environment closure | Environment recreated on token change |
| Navigation <-> Auth | AuthContext in root layout | Auth state determines route group visibility |
| Push <-> Backend | GraphQL mutation | `registerPushToken(token: String!)` mutation |
| Features <-> Shared | Import from `/src/components/common/` | Shared components define their own fragments |

## Build Order Implications

Based on architectural dependencies, suggested implementation order:

### Phase 1: Foundation
1. **Expo project setup** - Initialize with Expo Router
2. **Relay environment** - Network layer, store, compiler configuration
3. **Basic navigation structure** - Root layout, tab navigator skeleton

**Rationale:** Everything depends on navigation and data layer.

### Phase 2: Authentication
1. **Auth context and hooks** - State management
2. **Secure token storage** - expo-secure-store integration
3. **Login/signup screens** - Basic auth flow
4. **Protected routes** - Auth-based navigation

**Rationale:** Most features require authentication. Blocks feature work.

### Phase 3: Core Reading Feature
1. **Bible reading screens** - Book/chapter selection
2. **Passage view component** - Rich text rendering with fragments
3. **Basic navigation within reading** - Stack for drill-down

**Rationale:** Primary feature. Validates Relay fragment patterns.

### Phase 4: Community Feature
1. **Feed screen** - List with pagination
2. **Discussion components** - Card, detail, comments
3. **Social interactions** - Mutations for likes, comments

**Rationale:** Depends on auth. Validates mutations and optimistic updates.

### Phase 5: Push Notifications
1. **Permission request flow** - User-facing
2. **Token registration** - Backend mutation
3. **Notification handlers** - Foreground/background handling
4. **Deep link handling** - Navigation from notifications

**Rationale:** Requires backend work. Deferrable.

### Phase 6: Offline Considerations (Deferred)
1. **Cache policies** - What to keep offline
2. **Offline mutation queue** - Write-through pattern
3. **Sync on reconnect** - Conflict resolution

**Rationale:** Architecture supports this but implementation deferred per project scope.

## Sources

### Official Documentation (HIGH confidence)
- [Expo Router - Navigation layouts](https://docs.expo.dev/router/basics/layout/)
- [Expo Router - Stack navigation](https://docs.expo.dev/router/advanced/stack/)
- [Expo Router - Tab navigation](https://docs.expo.dev/router/advanced/tabs/)
- [Expo Router - Core concepts](https://docs.expo.dev/router/basics/core-concepts/)
- [Expo Push Notifications - Overview](https://docs.expo.dev/push-notifications/overview/)
- [Expo Authentication](https://docs.expo.dev/develop/authentication/)
- [Relay - Fragments](https://relay.dev/docs/guided-tour/rendering/fragments/)
- [Relay - Environment Provider](https://relay.dev/docs/api-reference/relay-environment-provider/)

### Community Resources (MEDIUM confidence)
- [React Native Relay GraphQL patterns](https://medium.com/@felippepuhle/how-we-improved-a-react-native-app-performance-by-using-graphql-and-relay-ed983a89747b)
- [Building Scalable React Apps with GraphQL and Relay](https://www.velotio.com/engineering-blog/building-react-applications-using-graphql-and-relay)
- [Expo managed workflow 2026](https://metadesignsolutions.com/expo-2026-the-best-way-to-build-cross-platform-apps/)
- [React Native best practices 2026](https://www.esparkinfo.com/blog/react-native-best-practices)
- [Relay Setup for React Native](https://www.back4app.com/docs/react-native/graphql/relay-setup)

### Authentication Patterns
- [React Navigation Auth Flow](https://reactnavigation.org/docs/auth-flow/)
- [react-native-app-auth](https://github.com/FormidableLabs/react-native-app-auth)

---
*Architecture research for: Selah Mobile - React Native Bible/Social App with Relay GraphQL*
*Researched: 2026-02-01*
