import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useRelayEnvironment } from "react-relay";
import { useSession } from "@/components/providers/session-provider";
import { getStorage } from "@/lib/storage";
import {
  registerForPushNotificationsAsync,
  registerTokenWithServer,
} from "@/lib/notifications";

const PUSH_TOKEN_KEY = "expo-push-token";

/**
 * Sets up push notification registration and listeners.
 * Call once inside RootLayoutNav (after auth + relay are available).
 */
export function useNotificationSetup() {
  const { isAuthenticated } = useSession();
  const environment = useRelayEnvironment();
  const router = useRouter();
  const notificationListener = useRef<Notifications.EventSubscription>(null);
  const responseListener = useRef<Notifications.EventSubscription>(null);

  // Register push token when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    let cancelled = false;

    (async () => {
      try {
        const token = await registerForPushNotificationsAsync();
        if (cancelled || !token) return;

        // Store token so we can unregister later
        getStorage().set(PUSH_TOKEN_KEY, token);

        await registerTokenWithServer(environment, token);
      } catch (error) {
        console.error("Failed to register push token:", error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, environment]);

  // Set up notification listeners
  useEffect(() => {
    // Foreground notification received
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("Notification received:", notification.request.identifier);
      });

    // User tapped on a notification
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;
        const url = data?.url as string | undefined;

        if (url) {
          // Deep link: handle selah://, https://selah.kr/, or /path formats
          let path = url;
          if (url.startsWith("selah://")) {
            path = url.replace("selah://", "/");
          } else if (url.startsWith("https://selah.kr")) {
            path = url.replace("https://selah.kr", "");
          }
          router.push(path as never);
        }
      });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, [router]);
}

/**
 * Get the stored push token (for unregistration in settings).
 */
export function getStoredPushToken(): string | null {
  return getStorage().getString(PUSH_TOKEN_KEY) ?? null;
}

/**
 * Clear the stored push token.
 */
export function clearStoredPushToken() {
  getStorage().remove(PUSH_TOKEN_KEY);
}
