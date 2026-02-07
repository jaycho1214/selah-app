/**
 * @generated SignedSource<<b5499377a9b575be01ce5c7499bc90b3>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type UsernameQuery$variables = {
  username: string;
};
export type UsernameQuery$data = {
  readonly userByUsername:
    | {
        readonly bio: string | null | undefined;
        readonly followedAt: any | null | undefined;
        readonly followerCount: number;
        readonly followingCount: number;
        readonly id: string;
        readonly image:
          | {
              readonly url: string | null | undefined;
            }
          | null
          | undefined;
        readonly name: string | null | undefined;
        readonly username: string | null | undefined;
        readonly " $fragmentSpreads": FragmentRefs<
          "followButton_user" | "profilePostsListFragment"
        >;
      }
    | null
    | undefined;
};
export type UsernameQuery = {
  response: UsernameQuery$data;
  variables: UsernameQuery$variables;
};

const node: ConcreteRequest = (function () {
  var v0 = [
      {
        defaultValue: null,
        kind: "LocalArgument",
        name: "username",
      },
    ],
    v1 = [
      {
        kind: "Variable",
        name: "username",
        variableName: "username",
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
      name: "username",
      storageKey: null,
    },
    v4 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "name",
      storageKey: null,
    },
    v5 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "bio",
      storageKey: null,
    },
    v6 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "url",
      storageKey: null,
    },
    v7 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "followerCount",
      storageKey: null,
    },
    v8 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "followingCount",
      storageKey: null,
    },
    v9 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "followedAt",
      storageKey: null,
    },
    v10 = {
      alias: null,
      args: null,
      concreteType: "Asset",
      kind: "LinkedField",
      name: "image",
      plural: false,
      selections: [v6 /*: any*/, v2 /*: any*/],
      storageKey: null,
    },
    v11 = [
      {
        kind: "Literal",
        name: "first",
        value: 20,
      },
    ],
    v12 = {
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
      name: "UsernameQuery",
      selections: [
        {
          alias: null,
          args: v1 /*: any*/,
          concreteType: "User",
          kind: "LinkedField",
          name: "userByUsername",
          plural: false,
          selections: [
            v2 /*: any*/,
            v3 /*: any*/,
            v4 /*: any*/,
            v5 /*: any*/,
            {
              alias: null,
              args: null,
              concreteType: "Asset",
              kind: "LinkedField",
              name: "image",
              plural: false,
              selections: [v6 /*: any*/],
              storageKey: null,
            },
            v7 /*: any*/,
            v8 /*: any*/,
            v9 /*: any*/,
            {
              args: null,
              kind: "FragmentSpread",
              name: "followButton_user",
            },
            {
              args: null,
              kind: "FragmentSpread",
              name: "profilePostsListFragment",
            },
          ],
          storageKey: null,
        },
      ],
      type: "Query",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Operation",
      name: "UsernameQuery",
      selections: [
        {
          alias: null,
          args: v1 /*: any*/,
          concreteType: "User",
          kind: "LinkedField",
          name: "userByUsername",
          plural: false,
          selections: [
            v2 /*: any*/,
            v3 /*: any*/,
            v4 /*: any*/,
            v5 /*: any*/,
            v10 /*: any*/,
            v7 /*: any*/,
            v8 /*: any*/,
            v9 /*: any*/,
            {
              alias: null,
              args: v11 /*: any*/,
              concreteType: "BibleVersePostConnection",
              kind: "LinkedField",
              name: "bibleVersePosts",
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
                            v4 /*: any*/,
                            v3 /*: any*/,
                            v10 /*: any*/,
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
                            v6 /*: any*/,
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
                              selections: [v2 /*: any*/, v12 /*: any*/],
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
                                v12 /*: any*/,
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
              storageKey: "bibleVersePosts(first:20)",
            },
            {
              alias: null,
              args: v11 /*: any*/,
              filters: null,
              handle: "connection",
              key: "profilePostsList_bibleVersePosts",
              kind: "LinkedHandle",
              name: "bibleVersePosts",
            },
          ],
          storageKey: null,
        },
      ],
    },
    params: {
      cacheID: "98fa1273e87ea5e7bbb872831d0f8437",
      id: null,
      metadata: {},
      name: "UsernameQuery",
      operationKind: "query",
      text: "query UsernameQuery(\n  $username: String!\n) {\n  userByUsername(username: $username) {\n    id\n    username\n    name\n    bio\n    image {\n      url\n      id\n    }\n    followerCount\n    followingCount\n    followedAt\n    ...followButton_user\n    ...profilePostsListFragment\n  }\n}\n\nfragment followButton_user on User {\n  id\n  followedAt\n  followerCount\n}\n\nfragment profilePostsListFragment on User {\n  bibleVersePosts(first: 20) {\n    edges {\n      node {\n        id\n        content\n        createdAt\n        likesCount\n        childPostsCount\n        likedAt\n        user {\n          id\n          name\n          username\n          image {\n            url\n            id\n          }\n        }\n        images {\n          url\n          width\n          height\n          id\n        }\n        poll {\n          id\n          totalVotes\n          isExpired\n          deadline\n          userVote {\n            id\n            text\n          }\n          options {\n            id\n            text\n            voteCount\n            votePercentage\n          }\n        }\n        verse {\n          id\n          book\n          chapter\n          verse\n          translation\n        }\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n  id\n}\n",
    },
  };
})();

(node as any).hash = "c3da0fde2dd99c2b00cfd079e6ffabb5";

export default node;
