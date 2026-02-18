import { createContext, useContext } from "react";
import {
  PostHogProvider as PHProvider,
  usePostHog,
} from "posthog-react-native";
import type PostHog from "posthog-react-native";

const POSTHOG_API_KEY = process.env.EXPO_PUBLIC_POSTHOG_KEY;

const PostHogContext = createContext<PostHog | null>(null);

export function usePostHogClient() {
  return useContext(PostHogContext);
}

/**
 * PostHog analytics provider.
 * Wraps the app with PostHog context.
 * Renders children directly if no API key is configured.
 *
 * Note: User identification is handled by PostHogIdentifier (posthog-identifier.tsx),
 * rendered separately in _layout.tsx to avoid a require cycle.
 */
export function PostHogProvider({ children }: { children: React.ReactNode }) {
  if (!POSTHOG_API_KEY) {
    return (
      <PostHogContext.Provider value={null}>{children}</PostHogContext.Provider>
    );
  }

  return (
    <PHProvider
      apiKey={POSTHOG_API_KEY}
      options={{
        host: "https://us.i.posthog.com",
        enableSessionReplay: false,
      }}
      autocapture
    >
      <PostHogBridge>{children}</PostHogBridge>
    </PHProvider>
  );
}

/**
 * Bridges the posthog-react-native context into our own context
 * so consumers can use usePostHogClient() safely.
 */
function PostHogBridge({ children }: { children: React.ReactNode }) {
  const posthog = usePostHog();
  return (
    <PostHogContext.Provider value={posthog}>
      {children}
    </PostHogContext.Provider>
  );
}
