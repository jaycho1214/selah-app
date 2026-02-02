# Pitfalls Research

**Domain:** React Native/Expo mobile app (Bible social platform, porting from Next.js)
**Researched:** 2026-02-02
**Confidence:** MEDIUM-HIGH (verified via multiple sources, Expo docs, community reports)

## Critical Pitfalls

### Pitfall 1: Lexical Editor Incompatibility

**What goes wrong:**
Lexical is web-only. Teams attempt to use it in React Native and discover it doesn't work, requiring a complete rich text strategy rewrite mid-project.

**Why it happens:**
Lexical is a JavaScript framework for web browsers. There's an effort to port it to iOS/Android with a React Native wrapper, but it's not production-ready. Teams assume "it's React" means "it works in React Native."

**How to avoid:**
- Choose a React Native-native rich text solution from the start
- Options: WebView-based editor (performance penalty), native editor wrapped via Expo Modules API, or simplified markdown-based input
- If posts from web use Lexical's JSON format, you need a render-only solution for mobile (parse Lexical JSON, render with native components)
- Consider: Can you simplify post creation on mobile? Maybe text-only with images, while full rich text is web-only

**Warning signs:**
- Planning to "port" Lexical without researching RN compatibility
- Assuming any web React library works in RN
- Not prototyping rich text early

**Phase to address:**
Foundation phase - must decide rich text strategy before building post creation UI

**Sources:**
- [Expo Rich Text Guide](https://docs.expo.dev/guides/editing-richtext/)
- [Lexical Official Site](https://lexical.dev/)

---

### Pitfall 2: Radix UI Component Assumptions

**What goes wrong:**
Teams plan to reuse shadcn/ui or Radix primitives from the web app and discover these are DOM-based and won't work in React Native.

**Why it happens:**
Radix UI is built on web primitives (DOM, CSS). shadcn/ui is Radix + Tailwind CSS. Neither has React Native support. Teams underestimate the UI rewrite scope.

**How to avoid:**
- Accept that ALL UI components must be rewritten for React Native
- Choose a React Native component library early: Tamagui (performance-focused, web+native), Gluestack UI (NativeBase successor, accessible), or build custom
- Map shadcn components to RN equivalents: Button, Dialog, Sheet, Toast, etc.
- Focus on matching design tokens (colors, spacing, typography) rather than components

**Warning signs:**
- Estimates assume component reuse from web
- No RN component library selected
- "We'll just use Tailwind" (NativeWind exists but components still need rewriting)

**Phase to address:**
Foundation phase - component library selection is architectural decision

**Sources:**
- [Tamagui](https://tamagui.dev/)
- [React Native UI Libraries 2026](https://blog.logrocket.com/best-react-native-ui-component-libraries/)

---

### Pitfall 3: Relay Environment Misconfiguration

**What goes wrong:**
Relay works on web but fails silently or crashes on React Native due to network layer, fetch polyfills, or environment setup differences.

**Why it happens:**
Relay's network layer assumes browser fetch. React Native's fetch has subtle differences. Missing regenerator-runtime causes "regeneratorRuntime is not defined" errors. Environment not properly configured for mobile context.

**How to avoid:**
- Use react-relay-network-modern for customizable network layer with middlewares
- Ensure regenerator-runtime is imported before Relay
- Test Relay queries in RN development build early, not just web
- Configure proper error boundaries - Relay errors can crash the app
- Set up network layer to handle offline states gracefully (not just errors)

**Warning signs:**
- "It works on web" without RN testing
- No custom network layer (using basic fetch)
- regeneratorRuntime errors in console
- Relay queries silently failing

**Phase to address:**
Foundation phase - Relay environment setup is prerequisite for all data features

**Sources:**
- [Relay Network Layer Docs](https://relay.dev/docs/guides/network-layer/)
- [react-relay-network-modern](https://github.com/relay-tools/react-relay-network-modern)

---

### Pitfall 4: Offline Bible Storage Architecture

**What goes wrong:**
Teams implement offline storage with basic SQLite but face: no reactive UI updates, sync conflicts, schema migration hell, and poor performance on large Bible texts.

**Why it happens:**
SQLite is reliable but lacks observability (UI doesn't update when data changes), has no built-in replication, and requires manual schema migrations. Bible translations are large (each ~5-10MB), making download/storage strategy critical.

**How to avoid:**
- Consider WatermelonDB for reactive, performant offline data with sync primitives
- Or use SQLite with a reactive layer (TinyBase, custom observers)
- Design schema migrations from day one - users will update the app
- Implement download manager: progress tracking, resume on failure, background downloads
- Store Bible text in chunks (by book) not monolithic files
- Use expo-sqlite with proper async patterns, avoid blocking main thread

**Warning signs:**
- "Just use AsyncStorage" for Bible data (will be too slow)
- No schema migration strategy
- Downloading entire Bible as single file
- UI polling for data changes instead of reactive updates

**Phase to address:**
Bible reading phase - offline architecture must be designed before implementation

**Sources:**
- [Expo SQLite Guide](https://medium.com/@aargon007/expo-sqlite-a-complete-guide-for-offline-first-react-native-apps-984fd50e3adb)
- [React Native Local Database Options](https://www.powersync.com/blog/react-native-local-database-options)
- [WatermelonDB](https://github.com/Nozbe/WatermelonDB)

---

### Pitfall 5: Push Notification Token Management

**What goes wrong:**
Push notifications work in development but fail in production. Tokens become stale, users don't receive notifications, and debugging is nearly impossible.

**Why it happens:**
- Expo SDK 53+ dropped push notification support from Expo Go on Android
- Push tokens can change while app is running (rare but happens)
- Tokens change on reinstall
- APNs/FCM configuration differs from development to production
- No visibility into whether notification was actually delivered

**How to avoid:**
- Use development builds from day one for notification testing, not Expo Go
- Implement token refresh listener to update backend immediately when token changes
- Store token with device ID to detect reinstalls
- Test on real devices only (simulators don't support push)
- Set priority: "high" for Android lock screen notifications
- Handle the "app killed" state - no way to react to notification when app is killed
- Configure proper entitlements: ios.usesAppleSignIn, aps-environment in app config

**Warning signs:**
- Testing only in Expo Go
- No token refresh handling
- Testing on simulator
- Notifications work in debug but not release

**Phase to address:**
Push notifications phase - requires development build infrastructure first

**Sources:**
- [Expo Push Notifications FAQ](https://docs.expo.dev/push-notifications/faq/)
- [Expo Notifications Setup](https://docs.expo.dev/push-notifications/push-notifications-setup/)

---

### Pitfall 6: Apple Sign-In Missing = App Store Rejection

**What goes wrong:**
App is submitted to App Store with only Google Sign-In and gets rejected. Team scrambles to implement Apple Sign-In under deadline pressure.

**Why it happens:**
Apple requires Sign in with Apple if ANY third-party social login is offered. This is App Store Review guideline 4.8. Teams focus on Google (matching web app) and forget Apple requirement.

**How to avoid:**
- Implement Apple Sign-In alongside Google Sign-In from the start
- Both require development builds (won't work in Expo Go)
- Configure ios.usesAppleSignIn in app.json
- Test both auth flows in TestFlight before submission
- Ensure your backend supports Apple Sign-In tokens

**Warning signs:**
- Auth planning only mentions Google
- No Apple Developer account configuration for Sign in with Apple
- Backend doesn't have Apple auth endpoint

**Phase to address:**
Authentication phase - both providers must be implemented together

**Sources:**
- [Expo Apple Authentication](https://docs.expo.dev/versions/latest/sdk/apple-authentication/)
- [App Store Review Guidelines 4.8](https://developer.apple.com/app-store/review/guidelines/#sign-in-with-apple)

---

### Pitfall 7: Deep Link Configuration Fragility

**What goes wrong:**
Deep links work inconsistently: work in some apps but not Gmail, work on Android but not iOS, work on fresh install but not updates.

**Why it happens:**
Universal Links (iOS) and App Links (Android) require perfect alignment across: AASA file on web server, assetlinks.json, app entitlements, navigation configuration. iOS caches AASA aggressively (up to 48 hours). Email providers wrap links with tracking that breaks detection.

**How to avoid:**
- Use Expo Router for file-based routing with built-in deep link support
- Validate AASA and assetlinks.json with Apple/Google official validators
- Test from real apps (Gmail, Mail, Messages), not Safari address bar
- Test on fresh installs - iOS caches AASA on install
- Avoid redirects, tracking wrappers, or URL shorteners in shared links
- Handle cold start: queue deep link URL until navigation is ready
- Disable remote JS debugging when testing getInitialURL (returns null with debugger)

**Warning signs:**
- Only testing deep links from Notes app or Safari
- No AASA/assetlinks.json validation
- Deep links work in dev but not production
- getInitialURL always returns null

**Phase to address:**
Deep linking phase - but URL scheme should be decided in foundation

**Sources:**
- [Universal & Deep Links 2026 Guide](https://prototyp.digital/blog/universal-links-deep-linking-2026)
- [Expo Deep Linking](https://docs.expo.dev/guides/deep-linking/)

---

### Pitfall 8: FlatList Performance Degradation

**What goes wrong:**
Social feed and Bible chapter views are janky, drop frames, and feel sluggish - especially on older devices. App feels "slow" compared to native apps.

**Why it happens:**
FlatList has inherent performance limitations. Anonymous functions in renderItem cause re-renders. Not using getItemLayout forces async layout calculations. Loading all data upfront defeats virtualization.

**How to avoid:**
- Use FlashList (Shopify) instead of FlatList for long lists - designed for performance
- Wrap renderItem components in React.memo()
- Move renderItem function outside JSX, wrap in useCallback
- Provide getItemLayout if items have consistent height
- Implement pagination/infinite scroll, don't load all data upfront
- Use removeClippedSubviews={true} (but test - can have bugs on iOS)
- Profile with React DevTools Profiler to identify re-renders
- Tune maxToRenderPerBatch and updateCellsBatchingPeriod

**Warning signs:**
- Using ScrollView for long lists (should use FlatList/FlashList)
- Anonymous arrow functions in renderItem
- No pagination (loading all posts at once)
- No performance profiling during development

**Phase to address:**
Every phase with lists - but establish patterns in foundation phase

**Sources:**
- [React Native FlatList Optimization](https://reactnative.dev/docs/optimizing-flatlist-configuration)
- [FlashList by Shopify](https://github.com/Shopify/flash-list)

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Using Expo Go for all testing | Faster iteration, no build wait | Can't test push, auth, or native modules | Never for features requiring native code |
| Inline styles | Quick styling | No reuse, harder theming, performance cost | Prototyping only, refactor before merge |
| Any-typing in TypeScript | Faster development | Type safety loss, runtime errors | Never - use proper types or unknown |
| Skipping error boundaries | Less code | App crashes on component errors | Never - always wrap feature boundaries |
| Console.log debugging | Quick answers | Left in production, performance impact | Development only, use proper logging service |
| Not testing on Android | Faster dev cycle on Mac | Android-specific bugs in production | Never - test both platforms regularly |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Google Sign-In | Using only web client ID | Configure all three client IDs (web, iOS, Android) even though only web ID is used in code |
| Apple Sign-In | Forgetting backend support | Backend must validate Apple ID tokens, not just Google |
| Relay + Offline | Assuming Relay handles offline | Implement custom network layer with offline queue |
| expo-notifications + Firebase | Mixing client implementations | Choose one approach, don't mix expo-notifications with @react-native-firebase/messaging |
| Better Auth | Assuming web auth works | Mobile needs native OAuth flows, not web redirects |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Large Bible images | Slow chapter transitions | Use optimized images, lazy loading, caching | First use of high-res images |
| Unoptimized re-renders | Janky scrolling, dropped frames | React.memo, useMemo, useCallback | 50+ items in list |
| Synchronous SQLite | UI freezes during queries | Use async patterns, run queries off main thread | Complex queries or large datasets |
| No image caching | Re-downloading images on every view | Use expo-image or react-native-fast-image | Any image-heavy screen |
| Bundle size bloat | Slow app launch | Tree-shake, analyze bundle, lazy load screens | When bundle exceeds ~10MB JS |

---

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Sensitive data in deep link URLs | Token/password exposure | Use short-lived, single-use tokens for sensitive deep links |
| Storing auth tokens in AsyncStorage | Tokens accessible if device rooted | Use expo-secure-store for sensitive data |
| Hardcoded API keys in code | Keys extracted from app bundle | Use environment variables, never commit secrets |
| Not validating deep link data | Injection attacks via malicious links | Validate and sanitize all deep link parameters |
| Logging sensitive data | Credentials in crash reports | Scrub logs, use proper error boundaries |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Web-style navigation | Confusion, back button issues | Use bottom tabs + stack nav, respect platform patterns |
| No loading states | App feels frozen | Skeleton screens, progress indicators, optimistic updates |
| No offline indication | User doesn't know why things fail | Clear offline banner, retry buttons, cached data messaging |
| Ignoring safe areas | Content under notch/home indicator | Use SafeAreaView, test on devices with notch |
| Tiny touch targets | Frustrating taps, accessibility issues | Minimum 44x44pt touch targets |
| No haptic feedback | App feels cheap | Add haptics for important actions (Expo Haptics) |

---

## "Looks Done But Isn't" Checklist

- [ ] **Push notifications:** Test on real device, test app killed state, test production build
- [ ] **Deep links:** Test from Gmail (not Notes), test cold start, test after 48 hours on iOS
- [ ] **Authentication:** Test token refresh, test session expiry, test re-authentication flow
- [ ] **Offline mode:** Test airplane mode, test poor connectivity, test coming back online
- [ ] **List performance:** Test with 100+ items, test on old Android device
- [ ] **Bible downloads:** Test download interruption, test resume, test storage full scenario
- [ ] **Images:** Test slow network, test cache miss, test very large images
- [ ] **Keyboard:** Test all input fields, test with external keyboard, test keyboard avoidance

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Wrong rich text library | HIGH | Extract data layer, rebuild UI with new library, migrate content format |
| Missing Apple Sign-In | MEDIUM | Add expo-apple-authentication, configure app.json, add backend support, rebuild |
| Bad offline architecture | HIGH | Refactor data layer, migrate local storage, test extensively |
| Poor list performance | MEDIUM | Switch to FlashList, memoize components, add pagination |
| Broken deep links | MEDIUM | Regenerate AASA/assetlinks, validate, wait for cache expiry |
| Push token management | LOW-MEDIUM | Add token refresh listener, migrate existing tokens, notify users |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Lexical incompatibility | Foundation | Rich text POC before building post creation |
| Radix UI assumptions | Foundation | Component library selected and prototyped |
| Relay misconfiguration | Foundation | Relay queries working in RN dev build |
| Offline storage architecture | Bible Reading | Download + read offline works end-to-end |
| Push token management | Push Notifications | Notifications received on production build |
| Apple Sign-In missing | Authentication | Both providers tested in TestFlight |
| Deep link fragility | Deep Linking | Links tested from multiple apps, fresh install |
| FlatList performance | Every phase with lists | 60fps scrolling on mid-tier device |

---

## Phase-Specific Risk Summary

| Phase | Highest Risk Pitfall | Mitigation |
|-------|---------------------|------------|
| Foundation | Relay + component library choices | Prototype early, test in dev build |
| Bible Reading | Offline storage architecture | Design schema + migration strategy first |
| Authentication | Apple Sign-In forgotten | Implement both providers together |
| Social Features | List performance | Use FlashList, pagination from start |
| Push Notifications | Token management | Implement refresh listener, test production |
| Deep Linking | Configuration fragility | Use official validators, test extensively |

---

## Sources

**Official Documentation:**
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Relay Documentation](https://relay.dev/docs/)

**Community & Research:**
- [Universal & Deep Links 2026 Complete Guide](https://prototyp.digital/blog/universal-links-deep-linking-2026)
- [React Native Best Practices for AI Agents](https://www.callstack.com/blog/announcing-react-native-best-practices-for-ai-agents)
- [Expo SDK 54 Upgrade Issues](https://medium.com/elobyte-software/what-breaks-after-an-expo-54-reactnative-0-81-15cb83cdb248)
- [FlashList Performance Tips](https://github.com/filipemerker/flatlist-performance-tips)
- [React Native Local Database Options](https://www.powersync.com/blog/react-native-local-database-options)
- [Expo Push Notifications FAQ](https://docs.expo.dev/push-notifications/faq/)

---
*Pitfalls research for: Selah Mobile (React Native/Expo Bible social platform)*
*Researched: 2026-02-02*
