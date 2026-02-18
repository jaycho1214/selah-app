/**
 * @generated SignedSource<<409bd23344617c01ad97cb3e00f62a31>>
 * @relayHash f30a787c45036fce2c4fb60e3004131b
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID f30a787c45036fce2c4fb60e3004131b

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type postsScreenFollowingFeedPaginationQuery$variables = {
  count?: number | null | undefined;
  cursor?: string | null | undefined;
};
export type postsScreenFollowingFeedPaginationQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"postsScreenFollowingFeedFragment">;
};
export type postsScreenFollowingFeedPaginationQuery = {
  response: postsScreenFollowingFeedPaginationQuery$data;
  variables: postsScreenFollowingFeedPaginationQuery$variables;
};

const node: ConcreteRequest = (function () {
  var v0 = [
      {
        defaultValue: 20,
        kind: "LocalArgument",
        name: "count",
      },
      {
        defaultValue: null,
        kind: "LocalArgument",
        name: "cursor",
      },
    ],
    v1 = [
      {
        kind: "Variable",
        name: "after",
        variableName: "cursor",
      },
      {
        kind: "Variable",
        name: "first",
        variableName: "count",
      },
    ],
    v2 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "id",
      storageKey: null,
    },
    v3 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "url",
      storageKey: null,
    },
    v4 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "text",
      storageKey: null,
    };
  return {
    fragment: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Fragment",
      metadata: null,
      name: "postsScreenFollowingFeedPaginationQuery",
      selections: [
        {
          args: [
            {
              kind: "Variable",
              name: "count",
              variableName: "count",
            },
            {
              kind: "Variable",
              name: "cursor",
              variableName: "cursor",
            },
          ],
          kind: "FragmentSpread",
          name: "postsScreenFollowingFeedFragment",
        },
      ],
      type: "Query",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Operation",
      name: "postsScreenFollowingFeedPaginationQuery",
      selections: [
        {
          alias: null,
          args: v1 /*: any*/,
          concreteType: "BibleVersePostConnection",
          kind: "LinkedField",
          name: "followingBibleVersePosts",
          plural: false,
          selections: [
            {
              alias: null,
              args: null,
              concreteType: "BibleVersePostEdge",
              kind: "LinkedField",
              name: "edges",
              plural: true,
              selections: [
                {
                  alias: null,
                  args: null,
                  concreteType: "BibleVersePost",
                  kind: "LinkedField",
                  name: "node",
                  plural: false,
                  selections: [
                    v2 /*: any*/,
                    {
                      alias: null,
                      args: null,
                      kind: "ScalarField",
                      name: "content",
                      storageKey: null,
                    },
                    {
                      alias: null,
                      args: null,
                      kind: "ScalarField",
                      name: "createdAt",
                      storageKey: null,
                    },
                    {
                      alias: null,
                      args: null,
                      kind: "ScalarField",
                      name: "likesCount",
                      storageKey: null,
                    },
                    {
                      alias: null,
                      args: null,
                      kind: "ScalarField",
                      name: "childPostsCount",
                      storageKey: null,
                    },
                    {
                      alias: null,
                      args: null,
                      kind: "ScalarField",
                      name: "likedAt",
                      storageKey: null,
                    },
                    {
                      alias: null,
                      args: null,
                      concreteType: "User",
                      kind: "LinkedField",
                      name: "user",
                      plural: false,
                      selections: [
                        v2 /*: any*/,
                        {
                          alias: null,
                          args: null,
                          kind: "ScalarField",
                          name: "name",
                          storageKey: null,
                        },
                        {
                          alias: null,
                          args: null,
                          kind: "ScalarField",
                          name: "username",
                          storageKey: null,
                        },
                        {
                          alias: null,
                          args: null,
                          concreteType: "Asset",
                          kind: "LinkedField",
                          name: "image",
                          plural: false,
                          selections: [v3 /*: any*/, v2 /*: any*/],
                          storageKey: null,
                        },
                      ],
                      storageKey: null,
                    },
                    {
                      alias: null,
                      args: null,
                      concreteType: "Asset",
                      kind: "LinkedField",
                      name: "images",
                      plural: true,
                      selections: [
                        v3 /*: any*/,
                        {
                          alias: null,
                          args: null,
                          kind: "ScalarField",
                          name: "width",
                          storageKey: null,
                        },
                        {
                          alias: null,
                          args: null,
                          kind: "ScalarField",
                          name: "height",
                          storageKey: null,
                        },
                        v2 /*: any*/,
                      ],
                      storageKey: null,
                    },
                    {
                      alias: null,
                      args: null,
                      concreteType: "Poll",
                      kind: "LinkedField",
                      name: "poll",
                      plural: false,
                      selections: [
                        v2 /*: any*/,
                        {
                          alias: null,
                          args: null,
                          kind: "ScalarField",
                          name: "totalVotes",
                          storageKey: null,
                        },
                        {
                          alias: null,
                          args: null,
                          kind: "ScalarField",
                          name: "isExpired",
                          storageKey: null,
                        },
                        {
                          alias: null,
                          args: null,
                          kind: "ScalarField",
                          name: "deadline",
                          storageKey: null,
                        },
                        {
                          alias: null,
                          args: null,
                          concreteType: "PollUserVote",
                          kind: "LinkedField",
                          name: "userVote",
                          plural: false,
                          selections: [v2 /*: any*/, v4 /*: any*/],
                          storageKey: null,
                        },
                        {
                          alias: null,
                          args: null,
                          concreteType: "PollOption",
                          kind: "LinkedField",
                          name: "options",
                          plural: true,
                          selections: [
                            v2 /*: any*/,
                            v4 /*: any*/,
                            {
                              alias: null,
                              args: null,
                              kind: "ScalarField",
                              name: "voteCount",
                              storageKey: null,
                            },
                            {
                              alias: null,
                              args: null,
                              kind: "ScalarField",
                              name: "votePercentage",
                              storageKey: null,
                            },
                          ],
                          storageKey: null,
                        },
                      ],
                      storageKey: null,
                    },
                    {
                      alias: null,
                      args: null,
                      concreteType: "BibleVerse",
                      kind: "LinkedField",
                      name: "verse",
                      plural: false,
                      selections: [
                        v2 /*: any*/,
                        {
                          alias: null,
                          args: null,
                          kind: "ScalarField",
                          name: "book",
                          storageKey: null,
                        },
                        {
                          alias: null,
                          args: null,
                          kind: "ScalarField",
                          name: "chapter",
                          storageKey: null,
                        },
                        {
                          alias: null,
                          args: null,
                          kind: "ScalarField",
                          name: "verse",
                          storageKey: null,
                        },
                        {
                          alias: null,
                          args: null,
                          kind: "ScalarField",
                          name: "translation",
                          storageKey: null,
                        },
                      ],
                      storageKey: null,
                    },
                    {
                      alias: null,
                      args: null,
                      kind: "ScalarField",
                      name: "__typename",
                      storageKey: null,
                    },
                  ],
                  storageKey: null,
                },
                {
                  alias: null,
                  args: null,
                  kind: "ScalarField",
                  name: "cursor",
                  storageKey: null,
                },
              ],
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              concreteType: "PageInfo",
              kind: "LinkedField",
              name: "pageInfo",
              plural: false,
              selections: [
                {
                  alias: null,
                  args: null,
                  kind: "ScalarField",
                  name: "endCursor",
                  storageKey: null,
                },
                {
                  alias: null,
                  args: null,
                  kind: "ScalarField",
                  name: "hasNextPage",
                  storageKey: null,
                },
              ],
              storageKey: null,
            },
            {
              kind: "ClientExtension",
              selections: [
                {
                  alias: null,
                  args: null,
                  kind: "ScalarField",
                  name: "__id",
                  storageKey: null,
                },
              ],
            },
          ],
          storageKey: null,
        },
        {
          alias: null,
          args: v1 /*: any*/,
          filters: null,
          handle: "connection",
          key: "followingFeed_followingBibleVersePosts",
          kind: "LinkedHandle",
          name: "followingBibleVersePosts",
        },
      ],
    },
    params: {
      id: "f30a787c45036fce2c4fb60e3004131b",
      metadata: {},
      name: "postsScreenFollowingFeedPaginationQuery",
      operationKind: "query",
      text: null,
    },
  };
})();

(node as any).hash = "bdbe5677217ded8d685065dfb437ceee";

export default node;
