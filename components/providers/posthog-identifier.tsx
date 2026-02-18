import { useEffect } from "react";

import { usePostHogClient } from "@/components/providers/posthog-provider";
import { useSession } from "@/components/providers/session-provider";

/**
 * Encode a raw DB user ID to match the web's Relay global ID format.
 * Web does: Buffer.from(`User:${id}`).toString("base64") via Pothos encodeGlobalID.
 */
function encodeGlobalUserId(rawId: string): string {
  return btoa(`User:${rawId}`);
}

/**
 * Identifies the current user with PostHog when session changes.
 * Encodes the raw DB ID to match web's Relay global ID format.
 * Resets PostHog identity on sign-out.
 *
 * Extracted to its own file to break the require cycle:
 * session-provider → sign-in-sheet → analytics → posthog-provider → session-provider
 */
export function PostHogIdentifier() {
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
