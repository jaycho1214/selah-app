# Phase 2: Authentication - Research

**Researched:** 2026-02-02
**Domain:** Mobile Authentication (Google + Apple Sign-In) with Better Auth
**Confidence:** HIGH

## Summary

This phase implements social authentication (Google and Apple Sign-In) for a React Native Expo app that connects to an existing Better Auth backend. The backend already has the `expo()` plugin configured and Google as a social provider. The mobile app will use native sign-in SDKs to obtain ID tokens, which are then verified server-side via Better Auth's `idToken` flow.

The standard approach for Expo authentication combines:
1. **@better-auth/expo** - Client library for Better Auth integration with Expo
2. **@react-native-google-signin/google-signin** - Native Google Sign-In SDK (recommended over expo-auth-session)
3. **expo-apple-authentication** - Native Apple Sign-In for iOS
4. **expo-secure-store** - Secure token persistence across app restarts

The key insight is that native mobile apps should use the **idToken flow** rather than OAuth redirect flow. The native SDKs handle the sign-in UI, return an ID token, which is then sent to Better Auth for server-side verification and session creation.

**Primary recommendation:** Use native sign-in SDKs (Google Sign-In, Apple Authentication) to get ID tokens, then call `authClient.signIn.social({ provider, idToken: { token } })` to authenticate with the existing Better Auth backend.

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @better-auth/expo | ^1.4.9 | Auth client for Expo | Already used by backend; provides expoClient with SecureStore integration |
| better-auth | ^1.4.9 | Auth client core | Required peer dependency for @better-auth/expo |
| @react-native-google-signin/google-signin | latest | Native Google Sign-In | Expo-recommended; provides idToken for server verification |
| expo-apple-authentication | ~15.0.* | Native Apple Sign-In | Built-in Expo SDK; required for iOS App Store compliance |
| expo-secure-store | ~15.0.8 | Secure token storage | Required by @better-auth/expo for session persistence |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| expo-web-browser | ~15.0.* | OAuth redirect handling | Already installed; used for OAuth fallback flows |
| expo-linking | ~8.0.* | Deep link handling | Already installed; needed for OAuth callback URLs |
| expo-constants | ~18.0.* | App constants access | Already installed; provides appId for configuration |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| @react-native-google-signin/google-signin | expo-auth-session | expo-auth-session is deprecated for Google; native SDK provides better UX |
| expo-apple-authentication | @invertase/react-native-apple-authentication | expo-apple-authentication is built-in to Expo SDK, simpler setup |
| expo-secure-store | AsyncStorage | AsyncStorage is not encrypted; SecureStore uses Keychain/Keystore |

**Installation:**
```bash
npx expo install expo-secure-store expo-apple-authentication @react-native-google-signin/google-signin better-auth @better-auth/expo
```

## Architecture Patterns

### Recommended Project Structure

```
app/
├── (app)/               # Protected routes (requires auth)
│   ├── _layout.tsx      # App layout with Stack.Protected
│   └── (tabs)/          # Tab navigator
├── sign-in.tsx          # Sign-in screen (unprotected)
└── _layout.tsx          # Root layout with SessionProvider

components/
├── providers/
│   └── session-provider.tsx  # Auth context provider
└── auth/
    ├── google-sign-in-button.tsx
    └── apple-sign-in-button.tsx

lib/
├── auth-client.ts       # Better Auth client configuration
└── hooks/
    └── use-storage-state.ts  # SecureStore persistence hook
```

### Pattern 1: Native ID Token Authentication

**What:** Use native SDKs to get ID tokens, verify server-side with Better Auth
**When to use:** Always for Google and Apple Sign-In on native platforms
**Example:**
```typescript
// Source: https://www.better-auth.com/docs/integrations/expo

// Google Sign-In
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const signInWithGoogle = async () => {
  await GoogleSignin.hasPlayServices();
  const userInfo = await GoogleSignin.signIn();
  const idToken = userInfo.data?.idToken;

  if (idToken) {
    await authClient.signIn.social({
      provider: "google",
      idToken: {
        token: idToken,
      },
    });
  }
};

// Apple Sign-In
import * as AppleAuthentication from 'expo-apple-authentication';

const signInWithApple = async () => {
  const credential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
  });

  await authClient.signIn.social({
    provider: "apple",
    idToken: {
      token: credential.identityToken!,
    },
  });
};
```

### Pattern 2: SessionProvider with SecureStore Persistence

**What:** React Context providing auth state with automatic SecureStore persistence
**When to use:** Always - wraps entire app, provides useSession hook
**Example:**
```typescript
// Source: https://docs.expo.dev/router/advanced/authentication/

// lib/auth-client.ts
import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";

export const authClient = createAuthClient({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  plugins: [
    expoClient({
      scheme: "selah",
      storagePrefix: "selah",
      storage: SecureStore,
    }),
  ],
});

// components/providers/session-provider.tsx
export function SessionProvider({ children }: PropsWithChildren) {
  const { data: session, isPending } = authClient.useSession();

  return (
    <SessionContext.Provider value={{ session, isLoading: isPending, signOut: authClient.signOut }}>
      {children}
    </SessionContext.Provider>
  );
}
```

### Pattern 3: Protected Routes with Stack.Protected

**What:** Expo Router pattern for auth-gated navigation
**When to use:** To protect authenticated routes and redirect unauthenticated users
**Example:**
```typescript
// Source: https://docs.expo.dev/router/advanced/authentication/

// app/_layout.tsx
function RootNavigator() {
  const { session, isLoading } = useSession();

  if (isLoading) {
    return null; // Or splash screen
  }

  return (
    <Stack>
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>
      <Stack.Protected guard={!session}>
        <Stack.Screen name="sign-in" />
      </Stack.Protected>
    </Stack>
  );
}
```

### Anti-Patterns to Avoid

- **Using OAuth redirect flow on native:** Native apps should use idToken flow, not OAuth redirects. The redirect flow requires browser context and is a worse UX.
- **Passing idToken as string:** Must be `{ idToken: { token: "..." } }`, not `{ idToken: "..." }`. Passing as string triggers OAuth redirect instead of token verification.
- **Storing tokens in AsyncStorage:** AsyncStorage is not encrypted. Always use expo-secure-store for auth tokens.
- **Not checking Apple availability:** Apple Sign-In is iOS-only. Must check `AppleAuthentication.isAvailableAsync()` before showing button.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Token storage | Custom encrypted storage | expo-secure-store | Uses platform Keychain/Keystore, handles encryption automatically |
| Google Sign-In flow | Custom OAuth implementation | @react-native-google-signin/google-signin | Handles Google Play Services, account picker, token refresh |
| Apple Sign-In UI | Custom button/flow | expo-apple-authentication | Apple requires specific button styling; SDK handles compliance |
| Session refresh | Manual token refresh logic | Better Auth useSession | Handles token refresh, caching, network state automatically |
| Cookie management | Manual cookie parsing | Better Auth expoClient | Handles cookie storage/retrieval for authenticated requests |

**Key insight:** Authentication has many edge cases (token expiry, account linking, credential revocation, biometric changes). The combination of Better Auth + native SDKs handles these; custom solutions will have security holes.

## Common Pitfalls

### Pitfall 1: idToken Format Error

**What goes wrong:** `authClient.signIn.social` returns redirect URL instead of creating session
**Why it happens:** idToken passed as string instead of object
**How to avoid:** Always use `idToken: { token: "..." }` format
**Warning signs:** Response contains `redirectTo` URL instead of session data

### Pitfall 2: Apple Bundle ID Mismatch

**What goes wrong:** "JWTClaimValidationFailed: unexpected aud claim value" error
**Why it happens:** Server configured with Service ID but native app sends token with App Bundle ID as audience
**How to avoid:** Configure `appBundleIdentifier: "kr.selah.selah"` in Better Auth server config
**Warning signs:** Apple Sign-In works on web but fails on native iOS

### Pitfall 3: Session Not Persisting After App Close

**What goes wrong:** Users must re-login every time they open the app
**Why it happens:** SecureStore not properly configured or session not being read on startup
**How to avoid:**
  1. Ensure expoClient has `storage: SecureStore` configured
  2. Call `authClient.getSession()` on app startup to restore session
  3. Verify scheme matches in app.json and trustedOrigins
**Warning signs:** `useSession()` returns null after app restart despite previous login

### Pitfall 4: Google Sign-In Fails on Production Build

**What goes wrong:** Google Sign-In works in dev but fails in production/TestFlight
**Why it happens:** SHA-1 fingerprint mismatch between debug and release signing keys
**How to avoid:**
  1. Add both debug and release SHA-1 fingerprints to Google Cloud Console
  2. For EAS Build, get SHA-1 from EAS credentials
  3. Use webClientId (not Android client ID) for server verification
**Warning signs:** "DEVELOPER_ERROR" or silent failure on release builds

### Pitfall 5: Missing trustedOrigins Configuration

**What goes wrong:** OAuth callback fails with origin error
**Why it happens:** Backend doesn't trust the app's deep link scheme
**How to avoid:** Server must include `trustedOrigins: ["selah://", "https://appleid.apple.com"]`
**Warning signs:** "Origin not trusted" error, callback URL rejected

### Pitfall 6: Metro Config Missing Package Exports

**What goes wrong:** Import errors when using @better-auth/expo
**Why it happens:** Better Auth uses package exports which Metro doesn't enable by default
**How to avoid:** Add `config.resolver.unstable_enablePackageExports = true` to metro.config.js
**Warning signs:** "Cannot find module" errors for @better-auth packages

## Code Examples

### Auth Client Configuration

```typescript
// lib/auth-client.ts
// Source: https://www.better-auth.com/docs/integrations/expo

import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "https://www.selah.kr";

export const authClient = createAuthClient({
  baseURL: API_URL,
  plugins: [
    expoClient({
      scheme: "selah",
      storagePrefix: "selah",
      storage: SecureStore,
    }),
  ],
});

// Export typed hooks
export const useSession = authClient.useSession;
```

### Google Sign-In Configuration

```typescript
// lib/google-signin.ts
// Source: https://react-native-google-signin.github.io/docs/setting-up/expo

import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

export function configureGoogleSignIn() {
  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    offlineAccess: false, // We only need idToken for server verification
  });
}

export async function signInWithGoogle(): Promise<string | null> {
  try {
    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn();
    return response.data?.idToken ?? null;
  } catch (error: any) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      // User cancelled
      return null;
    }
    throw error;
  }
}
```

### Apple Sign-In Button

```typescript
// components/auth/apple-sign-in-button.tsx
// Source: https://docs.expo.dev/versions/latest/sdk/apple-authentication/

import * as AppleAuthentication from 'expo-apple-authentication';
import { Platform, View } from 'react-native';

interface Props {
  onSuccess: (identityToken: string) => void;
  onError: (error: Error) => void;
}

export function AppleSignInButton({ onSuccess, onError }: Props) {
  // Apple Sign-In only available on iOS
  if (Platform.OS !== 'ios') {
    return null;
  }

  const handlePress = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (credential.identityToken) {
        onSuccess(credential.identityToken);
      }
    } catch (error: any) {
      if (error.code !== 'ERR_REQUEST_CANCELED') {
        onError(error);
      }
    }
  };

  return (
    <AppleAuthentication.AppleAuthenticationButton
      buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
      buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
      cornerRadius={5}
      style={{ width: '100%', height: 44 }}
      onPress={handlePress}
    />
  );
}
```

### Authenticated API Requests

```typescript
// lib/fetch-with-auth.ts
// Source: https://www.better-auth.com/docs/integrations/expo

import { authClient } from './auth-client';

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const cookies = authClient.getCookie();

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Cookie: cookies,
    },
    credentials: 'omit', // Don't send browser cookies, use manual Cookie header
  });
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| expo-auth-session for Google | @react-native-google-signin/google-signin | 2024 | Better UX, native account picker, avoids browser redirect |
| OAuth redirect flow on mobile | idToken verification flow | 2024-2025 | Direct token verification, no browser required |
| Manual cookie storage | expoClient with SecureStore | Better Auth 1.0+ | Automatic session persistence and refresh |
| expo-google-sign-in | @react-native-google-signin/google-signin | Expo SDK 45+ | expo-google-sign-in deprecated |

**Deprecated/outdated:**
- expo-auth-session for Google: Deprecated per Expo docs; use native Google Sign-In SDK
- expo-google-sign-in: Removed from Expo SDK; use @react-native-google-signin/google-signin
- Manual OAuth implementation: Better Auth handles all OAuth complexity

## Open Questions

1. **Apple Service ID vs Bundle ID**
   - What we know: Native iOS uses Bundle ID (kr.selah.selah), web uses Service ID
   - What's unclear: Whether backend already has appBundleIdentifier configured
   - Recommendation: Check/update selah-web server auth.ts to include `appBundleIdentifier`

2. **Google Client ID Configuration**
   - What we know: Backend has NEXT_PUBLIC_GOOGLE_CLIENT_ID for web
   - What's unclear: Whether this same webClientId works for native idToken verification
   - Recommendation: Verify the existing Google Cloud project has iOS/Android client IDs created; webClientId should work for server verification

3. **Development Environment OAuth**
   - What we know: trustedOrigins includes "selah://" but development uses "exp://"
   - What's unclear: Current development trustedOrigins configuration
   - Recommendation: Add development-only exp:// patterns to trustedOrigins

## Sources

### Primary (HIGH confidence)
- [Better Auth Expo Integration](https://www.better-auth.com/docs/integrations/expo) - Complete setup guide
- [Better Auth Apple Authentication](https://www.better-auth.com/docs/authentication/apple) - Apple-specific configuration
- [Better Auth Google Authentication](https://www.better-auth.com/docs/authentication/google) - Google idToken flow
- [Expo Apple Authentication SDK](https://docs.expo.dev/versions/latest/sdk/apple-authentication/) - Native Apple Sign-In
- [Expo Router Authentication](https://docs.expo.dev/router/advanced/authentication/) - Protected routes pattern
- [React Native Google Sign In - Expo Setup](https://react-native-google-signin.github.io/docs/setting-up/expo) - Google Sign-In config plugin

### Secondary (MEDIUM confidence)
- [Expo SecureStore](https://docs.expo.dev/versions/latest/sdk/securestore/) - Token persistence
- [Expo Google Authentication Guide](https://docs.expo.dev/guides/google-authentication/) - Google setup overview
- [GitHub Issue #4485](https://github.com/better-auth/better-auth/issues/4485) - idToken format fix
- [GitHub Issue #4570](https://github.com/better-auth/better-auth/issues/4570) - Session persistence fix

### Tertiary (LOW confidence)
- WebSearch results for common pitfalls and community patterns

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Official Better Auth and Expo documentation
- Architecture: HIGH - Expo Router official patterns with Better Auth integration
- Pitfalls: HIGH - Verified from GitHub issues and official documentation

**Research date:** 2026-02-02
**Valid until:** 2026-03-02 (30 days - stable libraries with minor updates expected)
