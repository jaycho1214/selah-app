# Stack Research

**Domain:** React Native Bible/Social Mobile App (Porting Next.js/Relay Web App)
**Researched:** 2026-02-01
**Confidence:** HIGH (verified via official docs and current npm/release data)

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended | Confidence |
|------------|---------|---------|-----------------|------------|
| Expo SDK | 54.0.0 | App framework | Latest stable SDK with React Native 0.81, React 19.1.0. Managed workflow simplifies builds, OTA updates, push notifications. 3x/year release cadence means active maintenance. | HIGH |
| React Native | 0.81 | Mobile runtime | Bundled with Expo 54. New Architecture enabled by default. XCFramework precompilation reduces iOS build times by ~90% (120s to 10s). | HIGH |
| TypeScript | 5.x | Type safety | Matches web app. Required for Relay compiler, React Navigation static API, and NativeWind. | HIGH |
| Relay | 20.1.1 | GraphQL client | **Same as web app.** Originally created for React Native at Facebook. Suspense-based, type-safe, automatic cache management. Matches existing schema/fragments. | HIGH |
| React Navigation | 7.x (7.1.28) | Navigation | De facto standard. New static API simplifies TypeScript + deep linking. v8 in alpha but v7 is stable and well-documented. | HIGH |
| NativeWind | 4.x | Styling | Tailwind CSS for React Native. **v4 is production-ready; v5 is pre-release.** Matches web Tailwind patterns. Supports dark mode, animations via Reanimated. | HIGH |

### Authentication

| Technology | Version | Purpose | Why Recommended | Confidence |
|------------|---------|---------|-----------------|------------|
| Better Auth (Expo plugin) | latest | Auth client | **Matches web app backend.** Official Expo integration with SecureStore. Supports idToken sign-in for Apple/Google. Deep link callbacks work natively. | HIGH |
| expo-apple-authentication | ~7.x | Apple Sign-In | Native SDK integration. Required for App Store if Google sign-in offered. Simple config via `ios.usesAppleSignIn: true`. | HIGH |
| @react-native-google-signin/google-signin | 14.x | Google Sign-In | Native SDK for both platforms. Works with development builds (not Expo Go). Supports New Architecture. | HIGH |

### Push Notifications

| Technology | Version | Purpose | Why Recommended | Confidence |
|------------|---------|---------|-----------------|------------|
| expo-notifications | ~0.31.x | Push notifications | Unified API for APNs/FCM. Expo Push Service handles certificate management. Can also use native tokens for direct FCM/APNs if needed. | HIGH |
| Expo Push Service | N/A (hosted) | Push backend | Free, handles APNs/FCM complexity. Alternative: use `getDevicePushTokenAsync()` for direct integration. | HIGH |

### Rich Text Editing

| Technology | Version | Purpose | Why Recommended | Confidence |
|------------|---------|---------|-----------------|------------|
| @10play/tentap-editor | 1.0.1 | Rich text editor | **Best option for porting Lexical.** Based on Tiptap/ProseMirror (same family as Lexical). WebView-based but designed for mobile UX. TypeScript, customizable, actively maintained. | MEDIUM |

**Rich Text Reality Check:** Native rich text editing in React Native is an unsolved problem. No native Lexical port exists. Options are:
1. **@10play/tentap-editor** (recommended) - Tiptap in WebView, best mobile UX
2. **react-native-pell-rich-editor** - Simpler WebView editor, less customizable
3. **Custom WebView + Lexical** - Maximum web parity, more work to integrate

### Data & Storage

| Technology | Version | Purpose | Why Recommended | Confidence |
|------------|---------|---------|-----------------|------------|
| react-native-mmkv | 3.x (V4 Nitro) | Fast key-value storage | 30x faster than AsyncStorage. Synchronous API. Encrypted storage option. Works with Zustand persist middleware. | HIGH |
| expo-secure-store | 15.x | Secure credentials | Keychain (iOS) / Keystore (Android). For auth tokens, sensitive data. Used by Better Auth Expo plugin. | HIGH |
| @tanstack/react-query | 5.x | Server state caching | Complements Relay for non-GraphQL data (local Bible content, cached responses). Optional but useful for offline-first patterns. | MEDIUM |

### UI Components

| Technology | Version | Purpose | Why Recommended | Confidence |
|------------|---------|---------|-----------------|------------|
| @shopify/flash-list | 1.7.x | Performant lists | Replaces FlatList. Cell recycling = 60 FPS on low-end Android. 54% FPS improvement, 82% CPU reduction vs FlatList. Essential for Bible chapter lists, feeds. | HIGH |
| expo-image | ~3.0.11 | Image component | Built on SDWebImage/Glide. BlurHash/ThumbHash placeholders. Disk+memory caching. No flickering on source change. | HIGH |
| expo-image-picker | ~16.x | Image selection | Native picker UI. SDK 54 returns original HEIC/AVIF without compression by default. | HIGH |
| react-native-reanimated | ~3.17.x | Animations | Required by NativeWind. Native-driven animations for 60fps. New Architecture compatible. | HIGH |
| react-native-gesture-handler | ~2.21.x | Gestures | Native gesture handling. Required by React Navigation for gesture-based navigation. | HIGH |

### State Management

| Technology | Version | Purpose | Why Recommended | Confidence |
|------------|---------|---------|-----------------|------------|
| Zustand | 5.0.10 | Client state | 3KB, minimal boilerplate, subscription-based (no context performance issues). 40% adoption in React ecosystem. Pairs well with Relay (Relay for server state, Zustand for UI state). | HIGH |
| Relay Store | (via Relay) | GraphQL cache | **Primary data store.** Automatic normalization, cache consistency. UI reads from Relay store, not separate state. | HIGH |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| Expo Dev Client | Development builds | Required for native modules (Google Sign-In, push notifications). Replaces Expo Go for full functionality. |
| relay-compiler | GraphQL compilation | Validates queries against schema, generates TypeScript types. Run in watch mode during development. |
| EAS Build | Cloud builds | iOS builds without Mac. Handles credentials. Free tier available. |
| EAS Submit | App store submission | Automated submission to App Store Connect and Google Play. |
| Expo Updates | OTA updates | Push JS updates without app store review. Critical for bug fixes. |

## Installation

```bash
# Create Expo project
npx create-expo-app@latest selah-app --template tabs

# Core dependencies
npx expo install expo-image expo-image-picker expo-notifications expo-secure-store expo-apple-authentication @shopify/flash-list react-native-reanimated react-native-gesture-handler react-native-safe-area-context react-native-screens

# Navigation
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs

# Relay (matching web versions)
npm install react-relay relay-runtime graphql
npm install -D relay-compiler babel-plugin-relay @types/relay-runtime @types/react-relay

# Authentication
npm install @react-native-google-signin/google-signin
npm install better-auth @better-auth/expo

# Rich text editor
npx expo install @10play/tentap-editor react-native-webview

# Styling
npm install nativewind
npm install -D tailwindcss@^3.4.17 prettier-plugin-tailwindcss

# State & Storage
npm install zustand react-native-mmkv

# Dev dependencies
npm install -D typescript @types/react @types/react-native
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Relay | Apollo Client | If not porting existing Relay web app. Apollo has simpler learning curve but lacks Relay's automatic optimizations. |
| Relay | urql | Smaller bundle, simpler API. Use for new projects without existing Relay infrastructure. |
| NativeWind | StyleSheet.create | If team unfamiliar with Tailwind. StyleSheet is built-in, zero dependencies, but verbose. |
| NativeWind | Tamagui | If need cross-platform web+native component library. More opinionated, steeper learning curve. |
| NativeWind | Gluestack | Copy-paste accessible components with Tailwind. Good if need pre-built component library. |
| Zustand | Jotai | If need atomic state with fine-grained subscriptions. Better for complex interdependent state. |
| Zustand | Redux Toolkit | Enterprise apps with large teams needing strict patterns. More boilerplate but battle-tested. |
| @10play/tentap-editor | react-native-pell-rich-editor | Simpler rich text needs. Less customizable, fewer features. |
| @10play/tentap-editor | Custom Lexical WebView | Maximum web parity with Lexical. More integration work. |
| MMKV | AsyncStorage | If minimal storage needs and simplicity preferred. AsyncStorage is built-in but 30x slower. |
| FlashList | FlatList | Short lists (<50 items) where recycling overhead not worth it. FlatList is simpler. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Expo Go | Cannot use native modules (Google Sign-In, push notifications) | Expo Dev Client |
| AsyncStorage (for hot paths) | 30x slower than MMKV, async-only API | react-native-mmkv |
| FlatList (for long lists) | Poor performance on Android, no cell recycling | @shopify/flash-list |
| react-native-firebase (for push only) | Overkill if only need notifications; Expo handles it | expo-notifications + Expo Push Service |
| Recoil | Discontinued by Facebook | Zustand or Jotai |
| React Native Paper / UI Kitten | Opinionated styling conflicts with Tailwind approach | NativeWind + custom components |
| expo-auth-session (alone) | Better Auth Expo plugin provides better integration with existing backend | @better-auth/expo |
| Tiptap directly | No native React Native support; relies on browser DOM | @10play/tentap-editor (wraps Tiptap properly) |
| Native Lexical | Does not exist for React Native | @10play/tentap-editor or WebView-based Lexical |

## Stack Patterns by Variant

**If building offline-first Bible reading:**
- Use MMKV for local Bible text storage (fast synchronous reads)
- Use Relay with @defer/@stream for chapter loading
- Use TanStack Query for non-GraphQL Bible data APIs
- Pre-cache Bible books during onboarding

**If social feed is primary:**
- FlashList is mandatory for smooth scrolling
- Relay pagination with useLoadMore
- expo-image with blurhash for image placeholders
- Consider @tanstack/react-query for optimistic updates

**If rich text editing is heavy:**
- @10play/tentap-editor with custom bridge extensions
- WebView performance monitoring
- Consider native keyboard avoiding views
- Test extensively on low-end Android

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| Expo SDK 54 | React Native 0.81, React 19.1.0 | SDK 54 requires iOS 15.1+, Android 7+ |
| NativeWind 4.x | Tailwind CSS 3.4.x | v5 is pre-release, not production-ready |
| Relay 20.x | React 18/19 | Suspense-based, requires React concurrent features |
| React Navigation 7.x | React Native 0.73+ | react-native-screens 4.x required for native-stack |
| Better Auth Expo | Expo SDK 50+ | Requires expo-secure-store |
| @10play/tentap-editor 1.x | React Native 0.73.5+ | Supports New Architecture |
| react-native-mmkv V4 | React Native 0.74+ | Nitro Module requires New Architecture |
| FlashList 1.7.x | React Native 0.71+ | RecyclerListView-based |

## Web App Parity Mapping

| Web (Next.js) | Mobile (React Native) | Notes |
|---------------|----------------------|-------|
| Relay + graphql-tag | Relay + babel-plugin-relay | Same queries/fragments, different compilation |
| Lexical | @10play/tentap-editor | Different editor, similar JSON/HTML output format |
| Tailwind CSS v4 | NativeWind 4.x (Tailwind 3.4) | 95% class compatibility, some CSS features unavailable |
| Radix UI | Custom + NativeWind | No Radix for RN; build accessible components manually |
| Better Auth | Better Auth + @better-auth/expo | Same backend, mobile-specific client |
| next/image | expo-image | Different APIs but similar caching behavior |
| React 19 | React 19.1.0 | Full compatibility via Expo 54 |

## Sources

### Official Documentation (HIGH confidence)
- [Expo SDK 54 Documentation](https://docs.expo.dev/versions/latest/) - Version and feature verification
- [Expo Push Notifications](https://docs.expo.dev/push-notifications/overview/) - APNs/FCM integration patterns
- [Expo Rich Text Editing Guide](https://docs.expo.dev/guides/editing-richtext/) - Official editor recommendations
- [Relay Documentation](https://relay.dev/docs/) - v20.1.0 features and React Native support
- [React Navigation 7.0 Blog](https://reactnavigation.org/blog/2024/11/06/react-navigation-7.0/) - Static API and features
- [NativeWind Installation](https://www.nativewind.dev/docs/getting-started/installation) - Version requirements
- [Better Auth Expo Integration](https://www.better-auth.com/docs/integrations/expo) - Mobile auth setup

### GitHub/npm (HIGH confidence)
- [10tap-editor GitHub](https://github.com/10play/10tap-editor) - v1.0.1, Tiptap-based editor
- [Zustand GitHub Releases](https://github.com/pmndrs/zustand/releases) - v5.0.10 features
- [FlashList by Shopify](https://shopify.github.io/flash-list/) - Performance benchmarks
- [react-native-mmkv](https://github.com/mrousavy/react-native-mmkv) - V4 Nitro Module

### Verified Articles (MEDIUM confidence)
- [FlashList vs FlatList 2025 Guide](https://javascript.plainenglish.io/flashlist-vs-flatlist-2025-complete-performance-comparison-guide-for-react-native-developers-f89989547c29) - Performance benchmarks verified against Shopify data
- [State Management in 2025](https://dev.to/hijazi313/state-management-in-2025-when-to-use-context-redux-zustand-or-jotai-2d2k) - Ecosystem trends
- [MMKV vs AsyncStorage](https://reactnativeexpert.com/blog/mmkv-vs-asyncstorage-in-react-native/) - Performance comparison

---
*Stack research for: Selah Mobile - React Native Bible/Social App*
*Researched: 2026-02-01*
