# Pitfalls Research

**Domain:** React Native Bible/Social App (Next.js/Relay Web Port)
**Researched:** 2026-02-01
**Confidence:** MEDIUM-HIGH (official docs + multiple verified sources)

---

## Critical Pitfalls

### Pitfall 1: Relay Environment Mismatch Between Web and Native

**What goes wrong:**
The Relay environment configured for Next.js web doesn't work on React Native. Network requests fail, auth headers aren't included, or localhost URLs are unreachable from mobile devices. Developers copy web Relay configs expecting them to work.

**Why it happens:**
- Web uses browser's `fetch` with cookies automatically attached; React Native requires explicit header management
- `localhost` URLs work in web browsers but are inaccessible from mobile emulators/devices
- Session/auth credentials work differently: web uses cookies, mobile needs manual header injection
- Metro bundler and Babel plugin for Relay require separate configuration from Next.js/webpack

**How to avoid:**
1. Create platform-specific Relay environments: `createEnvironment.web.ts` and `createEnvironment.native.ts`
2. Replace `localhost` with `10.0.2.2` (Android emulator) or actual IP address for physical devices
3. Configure environment-aware base URL: `process.env.EXPO_PUBLIC_API_URL`
4. Manually inject auth tokens from SecureStore into request headers:
```typescript
// Native network layer must manually add auth
headers: {
  'Authorization': `Bearer ${await SecureStore.getItemAsync('session_token')}`,
  'content-type': 'application/json',
}
```

**Warning signs:**
- Network requests hang or return CORS errors
- "Network request failed" errors only on native
- Auth working on web but 401s on mobile
- Relay compiler output not being picked up by Metro

**Phase to address:** Phase 1 - Foundation/Project Setup

**Sources:**
- [Relay Network Layer Docs](https://relay.dev/docs/guides/network-layer/)
- [GitHub: Relay + React Native Web issues](https://github.com/necolas/react-native-web/issues/1611)
- [Stack Overflow: localhost network failures in RN](https://dev.to/cathylai/fixing-network-request-failed-in-react-native-the-localhost-problem-7dg)

---

### Pitfall 2: Better Auth Session Handling on Mobile

**What goes wrong:**
Sessions work on web but don't persist on mobile. Users must re-login every app launch. Or worse: requests fail silently because cookie headers aren't attached correctly.

**Why it happens:**
- Web automatically handles cookies; mobile requires explicit SecureStore + manual header injection
- Developers set `credentials: "include"` (web pattern) instead of `credentials: "omit"` with manual headers
- Missing Metro config for Better Auth package exports
- Session cache not initialized properly, causing infinite re-fetching

**How to avoid:**
1. Install and configure `expo-secure-store` for session persistence
2. Use `@better-auth/expo` plugin on both server and client
3. Set `credentials: "omit"` and manually attach session cookie to headers:
```typescript
const sessionCookie = await SecureStore.getItemAsync('better-auth.session_token');
fetch(url, {
  credentials: 'omit', // Prevent browser cookie interference
  headers: {
    'Cookie': sessionCookie,
  }
});
```
4. Add to `metro.config.js`:
```javascript
const config = {
  resolver: {
    unstable_enablePackageExports: true,
  },
};
```
5. After config changes: `npx expo start --clear`

**Warning signs:**
- `useSession()` always returns loading/null state
- Import errors for `better-auth` modules
- Sessions lost on app background/foreground
- Infinite network requests for session data

**Phase to address:** Phase 2 - Authentication

**Sources:**
- [Better Auth Expo Integration](https://www.better-auth.com/docs/integrations/expo)

---

### Pitfall 3: OAuth Deep Link Configuration Mismatch

**What goes wrong:**
Apple Sign-In or Google Sign-In redirects fail. Users tap sign-in, browser opens, auth succeeds, but the redirect back to the app fails or goes nowhere.

**Why it happens:**
- App scheme not registered in `app.json`
- Scheme not added to `trustedOrigins` on Better Auth server
- Development uses `exp://` scheme, production uses custom scheme - configs mixed
- Missing URL scheme configuration in Xcode for iOS
- Wrong client IDs (Android vs iOS vs Web) used

**How to avoid:**
1. Register app scheme in `app.json`:
```json
{
  "expo": {
    "scheme": "selah"
  }
}
```
2. Add all schemes to Better Auth server `trustedOrigins`:
```typescript
trustedOrigins: [
  "selah://",           // Production
  "exp://**",           // Expo Go development (if needed)
  "http://localhost:*"  // Web development
]
```
3. For Google Sign-In: use **Web Client ID** in app code, but ensure Android/iOS Client IDs exist in Google Console
4. Enable "Sign In with Apple" capability in Apple Developer account AND set `ios.usesAppleSignIn: true` in app.json

**Warning signs:**
- OAuth redirects to web browser but never returns to app
- "Invalid redirect URI" errors in console
- DEVELOPER_ERROR (code 10) from Google Sign-In
- App crashes when tapping sign-in button (iOS URL scheme issue)

**Phase to address:** Phase 2 - Authentication

**Sources:**
- [Expo Apple Authentication](https://docs.expo.dev/versions/latest/sdk/apple-authentication/)
- [React Native Google Sign-In Troubleshooting](https://react-native-google-signin.github.io/docs/troubleshooting)
- [Better Auth Expo Integration](https://www.better-auth.com/docs/integrations/expo)

---

### Pitfall 4: Push Notification Development vs Production Credential Mismatch

**What goes wrong:**
Push notifications work in development but fail completely in production/TestFlight builds. Or notifications work on Android but not iOS (or vice versa).

**Why it happens:**
- SDK 53+: Expo Go no longer supports push notifications, but devs test in Expo Go anyway
- iOS push keys expire without warning
- Different credentials for development vs production not configured
- FCM (Firebase Cloud Messaging) not set up for Android production builds
- Testing on emulator/simulator (which can't receive push notifications)

**How to avoid:**
1. Use development builds from day one: `npx expo run:ios` / `npx expo run:android`
2. Never test push notifications on simulators/emulators
3. Set up EAS credentials early: `eas credentials`
4. Use `eas build --platform ios --profile preview` for TestFlight testing
5. Monitor for "DeviceNotRegistered" errors and remove invalid tokens from your database
6. Set priority to "high" for reliable Android delivery

**Warning signs:**
- Notifications work in `expo start` but not in EAS builds
- "No valid aps-environment entitlement string found" errors
- getDevicePushTokenAsync hangs indefinitely
- Gray/white square icons instead of your notification icon (Android)

**Phase to address:** Phase 3 - Push Notifications

**Sources:**
- [Expo Push Notifications FAQ](https://docs.expo.dev/push-notifications/faq/)
- [Expo Push Notifications Troubleshooting](https://docs.expo.dev/push-notifications/faq/)

---

### Pitfall 5: Lexical Editor Not Working in React Native

**What goes wrong:**
Teams try to reuse Lexical rich text editor from the web app and discover it doesn't work at all in React Native. Either nothing renders, or they spend weeks trying to make it work.

**Why it happens:**
- Lexical is built for DOM manipulation; React Native has no DOM
- Lexical's architecture assumes browser APIs (contenteditable, Selection API, etc.)
- There's no official React Native support from the Lexical team
- Developers assume "React library" means "React Native compatible"

**How to avoid:**
1. Accept that Lexical cannot be directly ported to React Native
2. Choose one of these strategies:
   - **WebView wrapper**: Run Lexical inside a WebView with bridge communication (see [react-native-lexical-editor](https://github.com/davevilela/react-native-lexical-editor))
   - **Read-only rendering**: Parse Lexical JSON on mobile and render with native Text components
   - **Alternative editor**: Use a native rich text solution for editing (react-native-pell-rich-editor, etc.)
3. Design data format to be editor-agnostic (store as JSON, render per-platform)

**Warning signs:**
- `contentEditable is not a function` or DOM-related errors
- Blank screen where editor should appear
- Attempting to install `@lexical/react` in RN project

**Phase to address:** Phase 4 - Rich Text / Content Display

**Sources:**
- [Expo Rich Text Editing Guide](https://docs.expo.dev/guides/editing-richtext/)
- [How to set up Lexical in React Native](https://strdr4605.com/how-to-set-up-lexical-editor-in-react-native)
- [GitHub: react-native-lexical-editor](https://github.com/davevilela/react-native-lexical-editor)

---

### Pitfall 6: Bible Content Performance Degradation

**What goes wrong:**
Bible chapters (large text blocks) cause janky scrolling, slow initial render, or memory issues. Users report lag when scrolling through chapters or the app crashes on older devices.

**Why it happens:**
- Using `ScrollView` instead of `FlatList`/`FlashList` for verse lists
- Not virtualizing verse components
- Re-rendering all verses on any state change
- Loading entire book into memory instead of paginating by chapter
- Not using `useMemo` or `React.memo` for verse components

**How to avoid:**
1. Use `FlashList` (Shopify) for verse lists - better than FlatList for complex content
2. Configure virtualization properly:
```typescript
<FlashList
  data={verses}
  estimatedItemSize={80}
  renderItem={renderVerse}
  keyExtractor={(verse) => verse.id}
/>
```
3. Memoize verse components:
```typescript
const VerseItem = React.memo(({ verse }) => (
  <Text>{verse.number}. {verse.text}</Text>
));
```
4. Paginate by chapter, not by book
5. Use `removeClippedSubviews={true}` on Android for large lists

**Warning signs:**
- JS thread frame drops in Flipper/Perf Monitor
- "VirtualizedList: You have a large list that is slow to update" warning
- App freezes when navigating to long chapters (Psalms 119, etc.)
- Memory usage grows unbounded when scrolling

**Phase to address:** Phase 4 - Bible Display / Content Phase

**Sources:**
- [React Native VirtualizedList Docs](https://reactnative.dev/docs/virtualizedlist)
- [React Native Performance Optimization for Lists](https://medium.com/@benjaminharringtonrose/react-native-performance-optimization-techniques-for-lists-c9f5c6beb109)
- [react-native-big-list](https://github.com/marcocesarato/react-native-big-list)

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Copying web Relay config | Faster initial setup | Network failures on mobile, auth issues | Never - design platform-aware from start |
| Testing only in Expo Go | Faster iteration | Push notifications untested, native features broken | Only for UI-only iterations |
| Using ScrollView for verse lists | Simpler code | Performance death on long chapters | Only for lists under 20 items |
| Storing session in AsyncStorage | Simpler setup | Security vulnerability (unencrypted) | Never for auth tokens |
| Hardcoding localhost URLs | Works on web | Breaks all mobile testing | Never - use env variables |
| Skipping Apple Sign-In | Less config | App Store rejection | Never if Google Sign-In is included |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Relay + React Native | Using web `fetch` with cookies | Create mobile-specific network layer with manual auth headers |
| Better Auth + Expo | Missing `unstable_enablePackageExports` in Metro | Add to metro.config.js resolver, clear cache |
| Google Sign-In | Using wrong client ID (Android vs Web) | Use Web Client ID in app, but create iOS/Android IDs in Console |
| Apple Sign-In | Forgetting `usesAppleSignIn` in app.json | Set `ios.usesAppleSignIn: true` AND enable in Apple Developer portal |
| Expo Push Notifications | Testing on emulator | Always use physical devices for push testing |
| Lexical | Trying to import directly | Use WebView wrapper or alternative native editor |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Non-virtualized verse lists | Janky scroll, high memory | Use FlashList with proper estimatedItemSize | 50+ verses (most chapters) |
| Relay over-fetching | Slow chapter loads | Use fragments to fetch only needed verse fields | Large chapters, slow networks |
| Unoptimized images | Slow load, memory pressure | Use expo-image with caching, specify dimensions | 10+ images in feed |
| Full book data in memory | Memory crash on old devices | Paginate by chapter, lazy load | Book of Psalms, Isaiah |
| Sync re-renders | UI freeze on data updates | useDeferredValue, React.memo | Any data sync while scrolling |

---

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Storing auth tokens in AsyncStorage | Token theft from rooted/jailbroken devices | Use expo-secure-store exclusively for tokens |
| Hardcoding API keys in JS | Key extraction from bundle | Use environment variables, server-side key storage |
| Not validating OAuth state parameter | CSRF attacks on auth flow | Better Auth handles this - don't override |
| Exposing GraphQL introspection in production | Schema discovery by attackers | Disable introspection in production Relay server |
| Trusting client-provided user IDs | Privilege escalation | Always derive user from session server-side |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Notification permission prompt on first launch | Users deny, never see notifications | Delay prompt, explain value first, use soft-ask |
| Long chapter loads without skeleton | Users think app is frozen | Show skeleton/shimmer while Relay query loads |
| Auth session expiry without warning | Users lose unsaved highlights/notes | Proactive token refresh, offline queue for writes |
| Platform-inconsistent navigation | Confusion switching iOS/Android | Use React Navigation with platform-specific patterns |
| Blocking UI during Relay mutations | App feels unresponsive | Optimistic updates with rollback on failure |

---

## "Looks Done But Isn't" Checklist

- [ ] **Push Notifications:** Works in dev but untested in production build - verify with EAS preview builds
- [ ] **OAuth:** Works with one provider but Apple Sign-In not tested - App Store requires both if one exists
- [ ] **Relay Queries:** Works online but no offline/error handling - test airplane mode behavior
- [ ] **Bible Display:** Works for short chapters but Psalm 119 (176 verses) not tested
- [ ] **Session Persistence:** Works on fresh install but not tested after app update
- [ ] **Deep Links:** Works from browser but not tested from push notification tap
- [ ] **Images:** Load correctly but no placeholder/error states for failed loads
- [ ] **Android Notifications:** Notification received but icon is gray square - check asset requirements

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Wrong Relay environment config | LOW | Create platform-specific environments, update imports |
| Sessions not persisting | LOW | Add SecureStore, migrate auth to @better-auth/expo |
| OAuth redirect failures | MEDIUM | Audit all scheme configs, regenerate credentials |
| Push notifications broken in production | MEDIUM | Regenerate credentials, rebuild with EAS |
| Lexical not working | HIGH | Implement WebView wrapper or rewrite with native editor |
| Performance issues with verse lists | MEDIUM | Replace ScrollView with FlashList, add virtualization |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Relay environment mismatch | Phase 1: Foundation | API calls succeed from iOS and Android devices |
| Session handling issues | Phase 2: Auth | User stays logged in after app restart |
| OAuth deep link failures | Phase 2: Auth | Sign-in completes and returns to app on both platforms |
| Push notification credential mismatch | Phase 3: Notifications | Notifications received in EAS preview build |
| Lexical incompatibility | Phase 4: Content | Rich text displays correctly (even if read-only) |
| Bible content performance | Phase 4: Content | Psalm 119 scrolls at 60fps on 3-year-old device |
| Image caching issues | Phase 4: Content | Images load quickly on repeat views, offline gracefully |

---

## Sources

### Official Documentation
- [Relay Network Layer](https://relay.dev/docs/guides/network-layer/)
- [Better Auth Expo Integration](https://www.better-auth.com/docs/integrations/expo)
- [Expo Push Notifications FAQ](https://docs.expo.dev/push-notifications/faq/)
- [Expo Apple Authentication](https://docs.expo.dev/versions/latest/sdk/apple-authentication/)
- [Expo Image](https://docs.expo.dev/versions/latest/sdk/image/)
- [Expo Rich Text Editing](https://docs.expo.dev/guides/editing-richtext/)
- [React Native VirtualizedList](https://reactnative.dev/docs/virtualizedlist)

### Troubleshooting Guides
- [React Native Google Sign-In Troubleshooting](https://react-native-google-signin.github.io/docs/troubleshooting)
- [Expo Common Development Errors](https://docs.expo.dev/workflow/common-development-errors/)
- [Expo Build Troubleshooting](https://docs.expo.dev/build-reference/troubleshooting/)

### Community Resources
- [7 React Native Mistakes in 2026](https://medium.com/@baheer224/7-react-native-mistakes-slowing-your-app-in-2026-19702572796a)
- [Making Expo Notifications Work on Android 12+ and iOS](https://medium.com/@gligor99/making-expo-notifications-actually-work-even-on-android-12-and-ios-206ff632a845)
- [How to set up Lexical in React Native](https://strdr4605.com/how-to-set-up-lexical-editor-in-react-native)
- [Migrating React to React Native](https://quabyt.com/blog/migrating-react-to-react-native)

---
*Pitfalls research for: Selah Mobile - React Native Bible/Social App*
*Researched: 2026-02-01*
