import { GraphQLResponse, RequestParameters, Variables } from "relay-runtime";
import { Platform } from "react-native";
import { authClient } from "../auth-client";

const API_URL =
  (__DEV__
    ? (process.env.EXPO_PUBLIC_API_URL ?? "https://selah.kr")
    : "https://selah.kr") + "/api/graphql";

/**
 * Get the auth cookie for Relay requests.
 *
 * On native, Better Auth's expo plugin manages cookies via SecureStore
 * (not the native cookie jar). We use authClient.getCookie() to retrieve
 * them and manually include them in request headers.
 *
 * @see https://www.better-auth.com/docs/integrations/expo
 */
function getAuthCookie(): string {
  if (Platform.OS === "web") return "";
  return authClient.getCookie() ?? "";
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
    // On native, cookies are provided manually from SecureStore.
    // "include" would let the native cookie jar interfere with our headers.
    credentials: Platform.OS === "web" ? "include" : "omit",
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
