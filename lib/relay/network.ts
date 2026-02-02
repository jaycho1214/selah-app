import { RequestParameters, Variables, GraphQLResponse } from 'relay-runtime';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.joinselah.com/graphql';

export async function fetchGraphQL(
  request: RequestParameters,
  variables: Variables,
): Promise<GraphQLResponse> {
  // Auth token will be added in Phase 2 (authentication)
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: request.text,
      variables,
    }),
  });

  return response.json();
}
