# Stack Research: Selah Mobile

**Domain:** React Native social/Bible mobile app with GraphQL
**Researched:** 2026-02-02
**Confidence:** HIGH (core stack) / MEDIUM (rich text editor)

## Executive Summary

The React Native / Expo ecosystem has matured significantly. Expo SDK 54 with React Native 0.81 (New Architecture enabled) provides the foundation. Key decision points:

1. **Relay works identically** - Same version (20.1.1) as web, same patterns
2. **Rich text is the hardest problem** - No perfect solution; 10tap-editor (Tiptap-based) is the best current option
3. **Offline sync needs WatermelonDB** - The only battle-tested RN solution for offline-first with sync
4. **NativeWind v4 for styling** - Tailwind in RN, matches web mental model
5. **gluestack-ui v3 for components** - Replaced NativeBase, accessible, NativeWind-compatible

---

## Recommended Stack

### Core Framework (Already Initialized)

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Expo | ~54.0.33 | Development platform | De-facto standard for RN, managed workflow with EAS, OTA updates |
| React Native | 0.81.5 | Mobile framework | New Architecture enabled by default, excellent performance |
| React | 19.1.0 | UI library | Matches web, hooks-based architecture |
| TypeScript | ~5.9.2 | Type safety | Essential for large codebases, matches web |
| Expo Router | ~6.0.23 | Navigation | File-based routing like Next.js, automatic deep linking |

**Confidence: HIGH** - Already initialized and verified working.

### Data Layer

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| react-relay | ^20.1.1 | GraphQL client | Matches web exactly, enables code sharing, compiler catches errors at build time |
| relay-runtime | ^20.1.1 | Relay core | Required peer dependency |
| relay-compiler | ^20.1.1 | Query compilation | Generates typed artifacts |
| graphql | ^16.12.0 | GraphQL core | Required peer, matches web version |

**Confidence: HIGH** - Identical to web codebase, Relay works great with React Native per official docs.

**Setup Note:** Configure babel-plugin-relay in babel.config.js, share schema.graphql from web repo.

### Styling & UI Components

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| NativeWind | ^4.2.1 | Tailwind CSS for RN | Same mental model as web, compiles at build time, works with Expo SDK 54 |
| tailwindcss | ^3.4.17 | Utility classes | v3.x required for NativeWind v4 (NOT v4.x which is for NativeWind v5) |
| gluestack-ui | ^3.0.11 | Component library | Modular, accessible, NativeWind-compatible, replaced NativeBase |

**Confidence: HIGH** - gluestack-ui v3 explicitly optimized for Expo SDK 54 and NativeWind.

**Critical Config (NativeWind v4 + Expo SDK 54):**
```javascript
// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: ["react-native-reanimated/plugin"],
  };
};

// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const config = getDefaultConfig(__dirname);
module.exports = withNativeWind(config, { input: "./global.css" });
```

### Rich Text Editor

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| @10play/tentap-editor | ^1.0.1 | Rich text editing | Best current RN option, Tiptap/ProseMirror-based, typed, extensible |

**Confidence: MEDIUM** - This is the hardest problem in RN. No perfect solution exists.

**Why 10tap-editor:**
- Built on Tiptap/ProseMirror (mature, extensible)
- TypeScript native
- Custom toolbar support
- Dark mode support
- Active development (v1.0.1 released Nov 2025)
- Works with Expo (basic mode in Expo Go, full features with dev client)

**Limitations:**
- WebView-based (inherent performance tradeoff)
- Cannot use native UI components inside editor
- Mentions/images require custom implementation
- May need to serialize differently than Lexical

**Migration Strategy from Lexical:**
- Web continues using Lexical, stores JSON
- Mobile uses 10tap-editor with Tiptap JSON
- Backend normalizes to HTML or portable format for cross-platform rendering
- Implement custom `RichTextRenderer` component that handles both formats

### Offline & Storage

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| @nozbe/watermelondb | ^0.28.0 | Offline database | Lazy loading, SQLite-based, built-in sync primitives, reactive |
| @morrowdigital/watermelondb-expo-plugin | latest | Expo integration | Enables managed workflow, no ejection needed |
| react-native-mmkv | ^4.1.2 | Key-value storage | 30x faster than AsyncStorage, encrypted, synchronous |

**Confidence: HIGH** - WatermelonDB is the standard for offline-first RN apps.

**WatermelonDB Use Cases for Selah:**
- Offline Bible reading (download entire translations)
- Cache verse posts for offline viewing
- Queue post creation/edits when offline
- Sync with GraphQL API when online

**MMKV Use Cases:**
- User preferences
- Auth tokens (encrypted)
- Theme settings
- Last read position

### State Management

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| zustand | ^5.0.11 | Global app state | Tiny (3KB), no boilerplate, works perfectly with Relay |

**Confidence: HIGH** - Relay handles server state; Zustand only needed for UI state.

**What Zustand Manages (Relay handles server data):**
- UI state (modals open/closed, current tab)
- Navigation state not handled by router
- Temporary form state before submission

### Authentication

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| @better-auth/expo | ^1.4.9 | Auth client | Matches web auth, supports native ID token flow |
| expo-apple-authentication | ^8.0.8 | Apple Sign-In | Required by App Store when offering social login |
| expo-auth-session | latest | OAuth flows | Google Sign-In with native modal |
| expo-secure-store | latest | Secure storage | Better Auth session caching |

**Confidence: HIGH** - Better Auth explicitly supports Expo with native ID token flow.

**Auth Flow:**
1. Native SDK (Apple/Google) returns ID token
2. Pass to Better Auth: `authClient.signIn.social({ provider, idToken })`
3. Session cached in SecureStore automatically

### Push Notifications

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| expo-notifications | ^0.32.16 | Push handling | Handles FCM/APNs, token management, notification display |
| expo-device | latest | Device detection | Required for push token generation |

**Confidence: HIGH** - Official Expo solution, well-documented.

**Note:** From SDK 53+, push notifications not supported in Expo Go. Requires development build.

### Deep Linking & Sharing

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| expo-linking | ^8.0.11 | URL handling | Built-in, works with Expo Router |
| expo-sharing | latest | Share OUT | Share verses/posts to other apps |
| expo-share-intent | ^5.1.1 | Share IN (future) | Receive shares from other apps (post-v1) |

**Confidence: HIGH** - Expo Router auto-enables deep links for all routes.

**Setup:**
- `scheme: "selah"` in app.json for custom URLs
- `associatedDomains` for iOS Universal Links
- `intentFilters` with `autoVerify: true` for Android App Links

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| expo-image | ~3.0.11 | Image display | Performant image loading with caching (already included) |
| expo-image-picker | ^17.0.10 | Image selection | Profile photos, post images |
| react-native-reanimated | ~4.1.1 | Animations | Complex animations, gestures (already included) |
| react-native-gesture-handler | ~2.28.0 | Gestures | Swipe navigation for Bible (already included) |
| lucide-react-native | latest | Icons | Matches web icon set |
| date-fns | latest | Date formatting | Lightweight, matches web |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| EAS Build | Cloud builds | Required for push notifications, production builds |
| EAS Submit | Store submission | Automated iOS/Android submission |
| EAS Update | OTA updates | Instant updates without store review |
| Expo Dev Client | Custom development build | Required for native modules |

---

## Alternatives Considered

### UI Components

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| gluestack-ui v3 | Tamagui | If you need maximum performance optimization and are comfortable with steeper learning curve |
| gluestack-ui v3 | React Native Paper | If you want Material Design specifically |
| gluestack-ui v3 | React Native Elements | If you need quick prototyping with less customization |

### Rich Text Editors

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| 10tap-editor | react-native-pell-rich-editor | If you only need basic formatting and want smaller bundle |
| 10tap-editor | WebView + Lexical | If you need exact Lexical compatibility and accept performance hit |
| 10tap-editor | Native editor (Aztec) | If you need maximum native feel and can handle platform-specific code |

### Offline Storage

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| WatermelonDB | Realm | If you need cloud sync built-in (Realm Sync) and are OK with vendor lock-in |
| WatermelonDB | SQLite directly | If you don't need reactive queries and want full SQL control |
| MMKV | AsyncStorage | Never - MMKV is strictly better in every dimension |

### State Management

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Zustand | Jotai | If you have complex atomic state relationships with fine-grained reactivity needs |
| Zustand | Redux Toolkit | If team is deeply familiar with Redux patterns |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| AsyncStorage | 30x slower than MMKV, unencrypted | react-native-mmkv |
| NativeBase | Deprecated in 2023, replaced by gluestack | gluestack-ui v3 |
| Tailwind CSS v4.x | Incompatible with NativeWind v4 | Tailwind CSS v3.4.x |
| NativeWind v5 | Newer but less stable, requires Tailwind v4 migration | NativeWind v4.2.x |
| react-native-webview (for rich text) | Too low-level, need to build everything | 10tap-editor |
| Expo SecureStore for large data | Size limits, designed for credentials | MMKV with encryption |
| Apollo Client | Different patterns than web codebase | Relay (matches web) |

---

## Installation

```bash
# Core (already installed via create-expo-app)
# expo, react-native, expo-router, etc.

# Data Layer (Relay)
npm install react-relay graphql
npm install -D relay-compiler babel-plugin-relay @types/react-relay @types/relay-runtime

# Styling & UI
npm install nativewind tailwindcss@3.4.17
npx gluestack-ui init

# Rich Text
npm install @10play/tentap-editor

# Offline & Storage
npm install @nozbe/watermelondb react-native-mmkv
# Add watermelondb-expo-plugin to app.json plugins

# State
npm install zustand

# Auth
npm install @better-auth/expo expo-apple-authentication expo-auth-session expo-secure-store expo-crypto

# Push Notifications
npm install expo-notifications expo-device

# Deep Linking (mostly built-in)
npm install expo-sharing expo-share-intent

# Supporting
npm install expo-image-picker lucide-react-native date-fns

# Dev dependencies
npm install -D @types/react-native
```

---

## Version Compatibility Matrix

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| NativeWind 4.2.x | Tailwind 3.4.x, Expo SDK 54, Reanimated 4 | Do NOT use Tailwind v4.x |
| NativeWind 4.2.x | react-native-reanimated 4.1.x | Reanimated v4 includes worklets internally |
| gluestack-ui 3.x | NativeWind 4.x, Expo SDK 54 | Optimized for new RN architecture |
| WatermelonDB 0.28.x | Expo SDK 54 | Requires expo-plugin for managed workflow |
| MMKV 4.x | Expo SDK 54 | Uses Nitro Modules (new) |
| 10tap-editor 1.x | Expo SDK 54, RN 0.73.5+ | New architecture compatible |

---

## Sources

### HIGH Confidence (Official/Context7)
- [Expo Documentation](https://docs.expo.dev/) - SDK 54, push notifications, deep linking
- [Relay Tutorial](https://relay.dev/docs/tutorial/intro/) - React Native support
- [10tap-editor GitHub](https://github.com/10play/10tap-editor) - v1.0.1 features, platform support
- [gluestack-ui](https://gluestack.io/) - v3 installation, component list
- [Better Auth Expo Integration](https://www.better-auth.com/docs/integrations/expo) - Native ID token flow
- npm registry - All version numbers verified 2026-02-02

### MEDIUM Confidence (Multiple Sources Agree)
- [React Native Tech Stack 2025](https://galaxies.dev/article/react-native-tech-stack-2025) - Ecosystem overview
- [LogRocket: Best RN UI Libraries 2026](https://blog.logrocket.com/best-react-native-ui-component-libraries/) - Component library comparison
- [NativeWind SDK 54 Issues](https://medium.com/@matthitachi/nativewind-styling-not-working-with-expo-sdk-54-54488c07c20d) - Configuration fixes
- [Supabase: Offline-first with WatermelonDB](https://supabase.com/blog/react-native-offline-first-watermelon-db) - Architecture patterns
- [MMKV vs AsyncStorage](https://github.com/mrousavy/react-native-mmkv) - Performance benchmarks

### LOW Confidence (Needs Validation)
- Rich text editor comparison - Limited production testimonials for 10tap-editor
- WatermelonDB + GraphQL sync patterns - May need custom implementation

---

## Roadmap Implications

### Phase 1: Foundation
- Relay setup (HIGH confidence, known patterns)
- NativeWind + gluestack-ui (HIGH confidence)
- Basic navigation structure

### Phase 2: Core Features
- Bible reading with offline (MEDIUM confidence - WatermelonDB new to team)
- Authentication flows (HIGH confidence)

### Phase 3: Rich Content
- Rich text editor (MEDIUM confidence - needs prototyping)
- Image handling
- Polls

### Phase 4: Social & Polish
- Push notifications (HIGH confidence)
- Deep linking (HIGH confidence)
- Share functionality (HIGH confidence)

**Research Flags:**
- Rich text editor needs spike/prototype before committing
- WatermelonDB sync with existing GraphQL API needs architecture design
- Consider fallback to simpler text input if 10tap-editor proves problematic

---

*Stack research for: Selah Mobile (React Native/Expo)*
*Researched: 2026-02-02*
