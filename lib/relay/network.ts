import { GraphQLResponse, RequestParameters, Variables } from "relay-runtime";

const API_URL =
  (__DEV__
    ? (process.env.EXPO_PUBLIC_API_URL ?? "https://selah.kr")
    : "https://selah.kr") + "/api/graphql";

export async function fetchGraphQL(
  request: RequestParameters,
  variables: Variables,
): Promise<GraphQLResponse> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      query: request.text,
      variables,
    }),
  });

  return response.json();
}
