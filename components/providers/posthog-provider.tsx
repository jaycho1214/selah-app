import { createContext, useContext, useEffect } from "react";
import {
  PostHogProvider as PHProvider,
  usePostHog,
} from "posthog-react-native";
import type PostHog from "posthog-react-native";

import { useSession } from "@/components/providers/session-provider";

const POSTHOG_API_KEY = process.env.EXPO_PUBLIC_POSTHOG_KEY;

const PostHogContext = createContext<PostHog | null>(null);

export function usePostHogClient() {
  return useContext(PostHogContext);
}

/**
 * Encode a raw DB user ID to match the web's Relay global ID format.
 * Web does: Buffer.from(`User:${id}`).toString("base64") via Pothos encodeGlobalID.
 */
function encodeGlobalUserId(rawId: string): string {
  return btoa(`User:${rawId}`);
}

/**
 * PostHog analytics provider.
 * Wraps the app with PostHog context and handles user identification.
 * Renders children directly if no API key is configured.
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
      <PostHogBridge>
        <PostHogIdentifier />
        {children}
      </PostHogBridge>
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
    <PostHogContext.Provider value={posthog}>{children}</PostHogContext.Provider>
  );
}

/**
 * Identifies the current user with PostHog when session changes.
 * Encodes the raw DB ID to match web's Relay global ID format.
 * Resets PostHog identity on sign-out.
 */
function PostHogIdentifier() {
  const posthog = usePostHogClient();
  const { session } = useSession();

  useEffect(() => {
    if (!posthog) return;

    if (session?.user?.id) {
      posthog.identify(encodeGlobalUserId(session.user.id), {
        email: session.user.email,
        name: session.user.name,
      });
    } else {
      posthog.reset();
    }
  }, [posthog, session?.user?.id, session?.user?.email, session?.user?.name]);

  return null;
}
