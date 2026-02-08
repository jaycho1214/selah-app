# Selah

> _"Selah" — a Hebrew word found throughout the Psalms, inviting the reader to pause, reflect, and let the words sink deep._

A Bible social app for reading Scripture together and sharing reflections with a community of faith. Built with Expo, React Native, Relay, and GraphQL.

## Features

**Scripture**

- Bible reader with chapter-by-chapter navigation
- Multiple translations (KJV, ASV)
- Verse highlighting and annotations
- Offline reading via local SQLite database
- Font size customization

**Community**

- Share reflections on any verse — text, images, or polls
- Reply threads on reflections
- Like and engage with posts from others
- Follow other readers and build your community
- Real-time notifications (push via Expo)

**Profile**

- Personal feed of posts, replies, and liked reflections
- Follower/following connections
- Editable profile with avatar, bio, and website

**Experience**

- Clean white (light) / warm parchment (dark) theme
- Liquid glass tab bar on iOS 26+
- Animated splash screen
- Haptic feedback
- Apple and Google Sign-In

## Tech Stack

| Layer      | Technology                                                                                        |
| ---------- | ------------------------------------------------------------------------------------------------- |
| Framework  | [Expo SDK 54](https://expo.dev) (New Architecture)                                                |
| Runtime    | [React Native 0.81](https://reactnative.dev) with [React 19](https://react.dev)                   |
| Data       | [Relay 20](https://relay.dev) + GraphQL                                                           |
| Styling    | [NativeWind 4](https://nativewind.dev) (Tailwind CSS)                                             |
| Auth       | [Better Auth](https://better-auth.com) with Expo plugin                                           |
| Navigation | [Expo Router 6](https://docs.expo.dev/router/introduction/) (file-based)                          |
| Local DB   | [Drizzle ORM](https://orm.drizzle.team) + expo-sqlite                                             |
| State      | [Zustand 5](https://zustand.docs.pmnd.rs) + [MMKV](https://github.com/mrousavy/react-native-mmkv) |
| Animation  | [React Native Reanimated 4](https://docs.swmansion.com/react-native-reanimated/)                  |
| Lists      | [FlashList 2](https://shopify.github.io/flash-list/)                                              |
| Rich Text  | [TenTap Editor](https://github.com/10play/10tap-editor) (Lexical)                                 |
| UI         | Bottom sheets, pager view, gesture handler, keyboard controller                                   |

## Project Structure

```
app/
  _layout.tsx          # Root layout with providers
  (tabs)/              # Tab navigation (Home, Posts, Notifications, Profile, Search)
  bible/               # Bible reader routes
  verse/[id].tsx       # Verse detail with reflections
  post/[id].tsx        # Post detail with thread
  user/[username].tsx  # Public user profile
  settings.tsx         # App settings
  user-edit.tsx        # Edit profile
  search.tsx           # Global search
  notes.tsx            # Personal notes

components/
  auth/                # Sign-in sheets and buttons
  bible/               # Reader, navigator, chapter views
  feed/                # Feed list and skeletons
  notifications/       # Notification items
  profile/             # Profile header, stats, post lists
  providers/           # Theme, Relay, Session context
  rich-text/           # Editor and renderer
  ui/                  # Button, Card, Text, IconSymbol
  user/                # Avatar, follow button, user list
  verse/               # Reflection composer, items, polls

lib/
  relay/               # Relay environment, network, generated artifacts
  bible/               # Bible constants, parsing, offline support
  db/                  # Drizzle schema, migrations, client
  stores/              # Zustand stores (bible, feed, settings, annotations)
  auth-client.ts       # Better Auth client config
  storage.ts           # MMKV storage
  utils.ts             # Shared utilities

hooks/                 # Custom hooks (theme, colors, notifications, settings)
constants/             # Theme colors, navigation theme, fonts
```

## Getting Started

### Prerequisites

- Node.js 18+
- [Expo CLI](https://docs.expo.dev/get-started/set-up-your-environment/)
- iOS Simulator or Android Emulator (or a physical device)

### Install

```bash
npm install
```

### Development

```bash
npx expo start
```

Open the app in a [development build](https://docs.expo.dev/develop/development-builds/introduction/), [iOS Simulator](https://docs.expo.dev/workflow/ios-simulator/), or [Android Emulator](https://docs.expo.dev/workflow/android-studio-emulator/).

### GraphQL

After modifying any GraphQL queries, fragments, or mutations:

```bash
npx relay-compiler
```

Or run in watch mode:

```bash
npm run relay:watch
```

### Build

```bash
eas build --platform ios --profile production
eas build --platform android --profile production
```

## Configuration

| Variable              | Purpose              |
| --------------------- | -------------------- |
| `EXPO_PUBLIC_API_URL` | GraphQL API endpoint |

Auth tokens are stored securely via `expo-secure-store`. Local data (bible reading state, settings cache) persists through MMKV and SQLite.

## Design

The visual language is intentionally restrained:

- **Light mode** — Clean white and black, inspired by modern reading apps
- **Dark mode** — Warm parchment tones (stone palette) for contemplative evening reading
- Semantic color tokens via CSS variables for consistent theming
- Platform-native tab bars with liquid glass support on iOS 26+
- System fonts with serif options for scripture reading
