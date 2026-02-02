# Phase 1: Foundation - Research

**Researched:** 2026-02-02
**Domain:** React Native/Expo foundation with Relay, NativeWind, react-native-reusables
**Confidence:** HIGH

## Summary

This phase establishes the foundational infrastructure for the selah-app mobile application. Research covers five key areas: Expo Router tab navigation, Relay GraphQL setup, NativeWind v4 styling with Tailwind 3.4.x, react-native-reusables component library (shadcn/ui for RN), theme system with OKLCH colors matching selah-web, and 10tap-editor for rich text proof-of-concept.

The stack is well-documented and compatible. Expo SDK 54 with React 19.1.0 provides a solid foundation. NativeWind v4 requires specific configuration with Tailwind 3.4.x (NOT v4.x). react-native-reusables is a direct port of shadcn/ui patterns, enabling consistent design language between web and mobile. Relay 20.1.1 works identically to the web codebase.

**Primary recommendation:** Configure NativeWind v4 with CSS variables matching selah-web's OKLCH colors, then use react-native-reusables CLI to add components incrementally. Set up Relay environment with the existing GraphQL schema.

## Standard Stack

The established libraries/tools for this phase:

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| expo | ~54.0.33 | Development platform | Already initialized, de-facto RN standard |
| expo-router | ~6.0.23 | File-based navigation | Already included, automatic deep linking |
| react-relay | ^20.1.1 | GraphQL client | Matches selah-web exactly, compiler type safety |
| nativewind | ^4.2.1 | Tailwind CSS for RN | Same mental model as web, compiles at build time |
| tailwindcss | ^3.4.17 | Utility classes | Required for NativeWind v4 (NOT v4.x) |
| react-native-reusables | latest | UI component library | shadcn/ui for React Native, matches web design |
| @10play/tentap-editor | ^0.7.4 | Rich text editing | Best RN option, Tiptap/ProseMirror-based |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| relay-runtime | ^20.1.1 | Relay core | Required peer for react-relay |
| babel-plugin-relay | ^20.1.1 | GraphQL transforms | Required for Relay compiler |
| lucide-react-native | latest | Icons | Matches web icon set (lucide-react) |
| react-native-webview | latest | WebView | Required peer for 10tap-editor |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| react-native-reusables | gluestack-ui v3 | User explicitly chose RNR for shadcn/ui parity |
| NativeWind v4 | NativeWind v5 | v5 requires Tailwind v4, less stable |
| 10tap-editor | react-native-pell-rich-editor | Less feature-rich, limited extensibility |

**Installation:**
```bash
# Relay
npm install react-relay graphql relay-runtime
npm install -D relay-compiler babel-plugin-relay @types/react-relay @types/relay-runtime

# NativeWind (note: some deps already in package.json)
npm install nativewind
npm install -D tailwindcss@^3.4.17
npx tailwindcss init

# react-native-reusables (use CLI for existing project)
npx @react-native-reusables/cli@latest add button text card

# Rich text (for POC)
npx expo install @10play/tentap-editor react-native-webview

# Icons
npm install lucide-react-native
```

## Architecture Patterns

### Recommended Project Structure

```
app/                           # Expo Router (file-based routing)
  _layout.tsx                  # Root layout with providers
  (tabs)/                      # Tab navigator group
    _layout.tsx                # Tab bar configuration
    index.tsx                  # Home tab
    explore.tsx                # Explore tab
    profile.tsx                # Profile tab

components/                    # Shared UI components
  ui/                          # Primitive components (from RNR)
    button.tsx                 # Added via CLI
    text.tsx
    card.tsx
    ...
  providers/                   # Context providers
    relay-provider.tsx
    theme-provider.tsx

lib/                           # Core utilities
  relay/                       # Relay configuration
    environment.ts             # Relay environment setup
    network.ts                 # Network layer with auth
  theme/                       # Theme utilities
    colors.ts                  # OKLCH color tokens
  utils.ts                     # cn() and other utilities

constants/                     # App constants
  theme.ts                     # NAV_THEME for react-navigation

global.css                     # CSS variables for theming
tailwind.config.ts             # Tailwind configuration
relay.config.js                # Relay compiler config
```

### Pattern 1: Expo Router Tab Navigation

**What:** File-based routing with parentheses-named folders for route groups.
**When to use:** All navigation structure.

```typescript
// app/(tabs)/_layout.tsx
// Source: https://docs.expo.dev/router/advanced/tabs/
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="compass" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="user" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
```

### Pattern 2: NativeWind with CSS Variables for Theming

**What:** CSS variables define theme colors, NativeWind `vars()` applies them.
**When to use:** All styling with dark/light theme support.

```typescript
// global.css
// Source: https://www.nativewind.dev/docs/guides/themes
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: 255 255 255;
  --foreground: 33 40 48;
  --primary: 54 66 79;
  --primary-foreground: 251 252 253;
  --muted: 244 245 246;
  --muted-foreground: 140 149 159;
  --border: 235 238 241;
  --ring: 180 187 194;
}

.dark:root {
  --background: 33 40 48;
  --foreground: 251 252 253;
  --primary: 235 238 241;
  --primary-foreground: 54 66 79;
  --muted: 70 79 89;
  --muted-foreground: 180 187 194;
  --border: 255 255 255 / 0.1;
  --ring: 140 149 159;
}

// tailwind.config.ts
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        primary: {
          DEFAULT: "rgb(var(--primary) / <alpha-value>)",
          foreground: "rgb(var(--primary-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "rgb(var(--muted) / <alpha-value>)",
          foreground: "rgb(var(--muted-foreground) / <alpha-value>)",
        },
        border: "rgb(var(--border) / <alpha-value>)",
        ring: "rgb(var(--ring) / <alpha-value>)",
      },
    },
  },
  plugins: [],
};
```

### Pattern 3: Relay Environment with Auth

**What:** Relay environment configured with network layer that injects auth headers.
**When to use:** All GraphQL data fetching.

```typescript
// lib/relay/network.ts
// Source: https://relay.dev/docs/guides/network-layer/
import { RequestParameters, Variables, GraphQLResponse } from 'relay-runtime';

const API_URL = 'https://api.selah.app/graphql';

async function fetchGraphQL(
  request: RequestParameters,
  variables: Variables,
): Promise<GraphQLResponse> {
  // Get auth token from secure storage
  const token = await getAuthToken();

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({
      query: request.text,
      variables,
    }),
  });

  return response.json();
}

export { fetchGraphQL };

// lib/relay/environment.ts
import {
  Environment,
  Network,
  RecordSource,
  Store,
} from 'relay-runtime';
import { fetchGraphQL } from './network';

const network = Network.create(fetchGraphQL);
const store = new Store(new RecordSource());

const environment = new Environment({
  network,
  store,
});

export { environment };
```

### Pattern 4: Theme Provider with NativeWind

**What:** Combine react-navigation ThemeProvider with NativeWind color scheme.
**When to use:** Root layout for consistent theming.

```typescript
// app/_layout.tsx
// Source: https://www.nativewind.dev/docs/core-concepts/dark-mode
import '../global.css';
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { RelayEnvironmentProvider } from 'react-relay';
import { environment } from '@/lib/relay/environment';

export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <RelayEnvironmentProvider environment={environment}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      </ThemeProvider>
    </RelayEnvironmentProvider>
  );
}
```

### Anti-Patterns to Avoid

- **Using Tailwind v4.x with NativeWind v4:** NativeWind v4 requires Tailwind v3.4.x. Using v4.x will cause build failures.
- **Skipping metro.config.js setup:** NativeWind requires `withNativeWind()` wrapper. Styles will not work without it.
- **Using .dark instead of .dark:root:** For NativeWind, dark mode selector must be `.dark:root`, not `.dark`.
- **Duplicating worklets plugin:** In Reanimated v4, worklets are included internally. Don't add both plugins.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| UI components | Custom buttons, cards, inputs | react-native-reusables CLI | Accessible, tested, consistent with web |
| Dark mode toggle | Manual state + colorScheme | NativeWind `colorScheme.set()` | Handles persistence, system preference |
| GraphQL types | Manual TypeScript | Relay compiler | Generates types from schema automatically |
| Icon system | Individual imports | lucide-react-native | Consistent with web, tree-shakeable |
| Tab navigation | Custom tab bar | Expo Router Tabs | Deep linking, type safety built-in |

**Key insight:** react-native-reusables uses the same CLI pattern as shadcn/ui. Add components with `npx @react-native-reusables/cli@latest add [component]` and customize locally.

## Common Pitfalls

### Pitfall 1: NativeWind Not Working After Setup

**What goes wrong:** Tailwind classes have no effect, styles don't apply.
**Why it happens:** Missing or incorrect metro.config.js, babel.config.js, or global.css import.
**How to avoid:**
1. Ensure metro.config.js uses `withNativeWind()`
2. Ensure babel.config.js has `jsxImportSource: 'nativewind'` and `nativewind/babel` preset
3. Ensure `global.css` is imported in root layout BEFORE any component imports
4. Clear caches: `rm -rf node_modules/.cache .expo && npx expo start -c`
**Warning signs:** Components render but with no styles, Tailwind classes ignored.

### Pitfall 2: Relay Compiler Schema Mismatch

**What goes wrong:** Compiler errors about unknown types or fields.
**Why it happens:** Local schema.graphql out of sync with server, or wrong schema path in relay.config.js.
**How to avoid:**
1. Copy schema.graphql from selah-web or fetch from API
2. Verify path in relay.config.js matches actual location
3. Run compiler after any schema changes
**Warning signs:** Type errors in generated files, "unknown type" compiler errors.

### Pitfall 3: react-native-reusables CLI in Existing Project

**What goes wrong:** CLI creates new project instead of adding to existing.
**Why it happens:** Running `init` instead of `add` or missing configuration.
**How to avoid:**
1. Use `add` command for existing projects: `npx @react-native-reusables/cli@latest add [component]`
2. Create components.json manually if needed
3. Ensure NativeWind is already configured
**Warning signs:** CLI prompts to create new project, files in wrong location.

### Pitfall 4: OKLCH Colors Not Rendering Correctly

**What goes wrong:** Colors appear different from web, or don't render at all.
**Why it happens:** React Native doesn't natively support OKLCH color format.
**How to avoid:**
1. Convert OKLCH to RGB values for CSS variables
2. Use a build-time conversion tool or pre-convert in global.css
3. Store OKLCH as reference, use RGB in actual CSS variables
**Warning signs:** Colors missing, fallback colors showing, white/transparent elements.

### Pitfall 5: 10tap-editor Not Working in Expo Go

**What goes wrong:** Rich text features fail or editor doesn't render.
**Why it happens:** 10tap-editor requires native modules not available in Expo Go.
**How to avoid:**
1. Only basic usage works in Expo Go
2. For full features, use Expo Dev Client with development build
3. Plan for dev client setup if rich text is critical path
**Warning signs:** Editor crashes, features missing, webview errors.

## Code Examples

Verified patterns from official sources:

### NativeWind Configuration Files

```javascript
// babel.config.js
// Source: https://www.nativewind.dev/docs/getting-started/installation
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  };
};

// metro.config.js
// Source: https://www.nativewind.dev/docs/getting-started/installation
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: "./global.css" });
```

### Relay Configuration

```javascript
// relay.config.js
// Source: https://relay.dev/docs/getting-started/step-by-step-guide/
module.exports = {
  src: './app',
  schema: './schema.graphql',
  language: 'typescript',
  artifactDirectory: './lib/relay/__generated__',
  exclude: ['**/node_modules/**', '**/__mocks__/**', '**/__generated__/**'],
};

// package.json scripts
{
  "scripts": {
    "relay": "relay-compiler",
    "relay:watch": "relay-compiler --watch"
  }
}
```

### Theme with OKLCH to RGB Conversion

```css
/* global.css - OKLCH values converted to approximate RGB for RN */
/* Source: selah-web/src/app/globals.css */
:root {
  /* OKLCH: oklch(1 0 0) -> RGB: 255 255 255 */
  --background: 255 255 255;
  /* OKLCH: oklch(0.13 0.028 261.692) -> RGB: 18 18 24 */
  --foreground: 18 18 24;
  /* OKLCH: oklch(0.21 0.034 264.665) -> RGB: 33 36 48 */
  --primary: 33 36 48;
  /* OKLCH: oklch(0.985 0.002 247.839) -> RGB: 250 250 252 */
  --primary-foreground: 250 250 252;
  /* OKLCH: oklch(0.967 0.003 264.542) -> RGB: 243 244 246 */
  --muted: 243 244 246;
  /* OKLCH: oklch(0.551 0.027 264.364) -> RGB: 113 122 138 */
  --muted-foreground: 113 122 138;
  /* OKLCH: oklch(0.928 0.006 264.531) -> RGB: 228 232 238 */
  --border: 228 232 238;
  /* OKLCH: oklch(0.577 0.245 27.325) -> RGB: 220 38 38 */
  --destructive: 220 38 38;
}

.dark:root {
  /* OKLCH: oklch(0.13 0.028 261.692) -> RGB: 18 18 24 */
  --background: 18 18 24;
  /* OKLCH: oklch(0.985 0.002 247.839) -> RGB: 250 250 252 */
  --foreground: 250 250 252;
  /* OKLCH: oklch(0.928 0.006 264.531) -> RGB: 228 232 238 */
  --primary: 228 232 238;
  /* OKLCH: oklch(0.21 0.034 264.665) -> RGB: 33 36 48 */
  --primary-foreground: 33 36 48;
  /* OKLCH: oklch(0.278 0.033 256.848) -> RGB: 46 52 66 */
  --muted: 46 52 66;
  /* OKLCH: oklch(0.707 0.022 261.325) -> RGB: 160 170 184 */
  --muted-foreground: 160 170 184;
  /* oklch(1 0 0 / 10%) -> RGB with alpha */
  --border: 255 255 255 / 0.1;
  /* OKLCH: oklch(0.704 0.191 22.216) -> RGB: 248 113 113 */
  --destructive: 248 113 113;
}
```

### 10tap-editor Basic Setup

```typescript
// components/rich-text/editor.tsx
// Source: https://10play.github.io/10tap-editor/docs/examples/basic
import React from 'react';
import { KeyboardAvoidingView, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RichText, Toolbar, useEditorBridge } from '@10play/tentap-editor';

interface EditorProps {
  initialContent?: string;
  onContentChange?: (html: string) => void;
}

export function RichTextEditor({ initialContent = '', onContentChange }: EditorProps) {
  const editor = useEditorBridge({
    autofocus: true,
    avoidIosKeyboard: true,
    initialContent: initialContent || '<p>Start writing...</p>',
    onChange: () => {
      if (onContentChange) {
        editor.getHTML().then(onContentChange);
      }
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <RichText editor={editor} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <Toolbar editor={editor} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardView: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
  },
});
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| NativeWind v2 | NativeWind v4 | 2024 | New preset system, better performance |
| Tailwind v3 w/ NativeWind v4 | Still current | N/A | Do NOT upgrade to Tailwind v4 yet |
| gluestack-ui | react-native-reusables | 2024-2025 | Better shadcn/ui compatibility |
| react-native-rich-editor | 10tap-editor | 2024 | TypeScript, Tiptap-based, extensible |

**Deprecated/outdated:**
- **NativeBase**: Deprecated 2023, replaced by gluestack-ui (but we use react-native-reusables)
- **AsyncStorage**: Still works but MMKV is 30x faster (not needed for this phase)
- **StyleSheet.create only**: NativeWind provides superior DX with Tailwind classes

## Open Questions

Things that couldn't be fully resolved:

1. **OKLCH to RGB Conversion Accuracy**
   - What we know: React Native doesn't support OKLCH natively
   - What's unclear: Exact RGB values that match OKLCH perceptually
   - Recommendation: Use color conversion tools (oklch.com) to pre-convert, store mapping in theme documentation

2. **react-native-reusables Theming with Existing Project**
   - What we know: CLI `add` command works for components
   - What's unclear: Whether global.css and tailwind.config need manual setup or CLI handles it
   - Recommendation: Set up NativeWind manually first, then use CLI to add individual components

3. **10tap-editor HTML vs Lexical JSON**
   - What we know: 10tap-editor uses Tiptap/ProseMirror, outputs HTML
   - What's unclear: How to render selah-web's Lexical JSON content on mobile
   - Recommendation: Create a `RichTextRenderer` that can handle both formats, or normalize on backend

## Sources

### Primary (HIGH confidence)
- [Expo Router Tabs Documentation](https://docs.expo.dev/router/advanced/tabs/) - Tab navigation setup, options, icons
- [NativeWind v4 Installation](https://www.nativewind.dev/docs/getting-started/installation) - Complete setup guide
- [NativeWind Themes Guide](https://www.nativewind.dev/docs/guides/themes) - CSS variables, theme switching
- [NativeWind Dark Mode](https://www.nativewind.dev/docs/core-concepts/dark-mode) - colorScheme.set(), system preference
- [Relay Network Layer](https://relay.dev/docs/guides/network-layer/) - Environment, fetch function setup
- [10tap-editor Documentation](https://10play.github.io/10tap-editor/docs/intro.html) - Installation, basic usage
- [10tap-editor Basic Example](https://10play.github.io/10tap-editor/docs/examples/basic) - Code patterns
- [Expo Color Themes](https://docs.expo.dev/develop/user-interface/color-themes/) - useColorScheme, userInterfaceStyle
- [react-native-reusables Docs](https://reactnativereusables.com/docs) - Installation, CLI, customization

### Secondary (MEDIUM confidence)
- [NativeWind SDK 54 Issues](https://medium.com/@matthitachi/nativewind-styling-not-working-with-expo-sdk-54-54488c07c20d) - Configuration fixes, cache clearing
- [Relay Expo Workshop](https://github.com/hyochan/relay-expo-workshop) - Project structure patterns
- [react-relay-network-modern](https://github.com/relay-tools/react-relay-network-modern) - Advanced network layer patterns

### Tertiary (LOW confidence)
- OKLCH to RGB conversion values - Manually approximated, should verify with proper tooling
- 10tap-editor + Lexical interop - No official documentation, needs POC validation

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries verified with official docs
- Architecture: HIGH - Patterns from official documentation
- Pitfalls: HIGH - Common issues documented in community + official sources
- Theme OKLCH conversion: MEDIUM - Manual approximation, needs validation

**Research date:** 2026-02-02
**Valid until:** 2026-03-02 (30 days - stack is stable)
