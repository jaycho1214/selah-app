import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "https://www.selah.kr";

export const authClient = createAuthClient({
  baseURL: API_URL,
  plugins: [
    expoClient({
      scheme: "selah", // Deep link scheme
      storagePrefix: "selah", // SecureStore key prefix
      storage: SecureStore, // Secure token persistence
    }),
  ],
});

// Export typed hooks for use throughout app
export const useSession = authClient.useSession;
