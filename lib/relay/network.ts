import { GraphQLResponse, RequestParameters, Variables } from "relay-runtime";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const API_URL =
  (__DEV__
    ? (process.env.EXPO_PUBLIC_API_URL ?? "https://selah.kr")
    : "https://selah.kr") + "/api/graphql";

/**
 * Read the auth cookie stored by better-auth's expo client in SecureStore.
 * On native, better-auth sets `credentials: "omit"` on its own requests and
 * manages cookies via SecureStore, so the native cookie jar never has them.
 * We need to manually include them in Relay requests.
 */
function getAuthCookie(): string {
  if (Platform.OS === "web") return "";
  const raw = SecureStore.getItem("selah_cookie");
  if (!raw) return "";
  try {
    const parsed: Record<string, { value: string; expires: string | null }> =
      JSON.parse(raw);
    return Object.entries(parsed)
      .filter(([, v]) => !v.expires || new Date(v.expires) > new Date())
      .map(([k, v]) => `${k}=${v.value}`)
      .join("; ");
  } catch {
    return "";
  }
}

export async function fetchGraphQL(
  request: RequestParameters,
  variables: Variables,
): Promise<GraphQLResponse> {
  const body: Record<string, unknown> = { variables };

  if (request.id != null) {
    // Persisted query — send only the doc_id, no query body
    body.doc_id = request.id;
  } else {
    // Fallback for development without persisted queries
    body.query = request.text;
  }

  const cookie = getAuthCookie();

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { cookie } : {}),
    },
    credentials: "include",
    body: JSON.stringify(body),
  });

  return response.json();
}
