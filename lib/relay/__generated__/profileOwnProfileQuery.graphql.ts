/**
 * @generated SignedSource<<619042c980ee1f78bfbe6abac8c60816>>
 * @relayHash b48d86b9e433960129277ea4f7d3c54a
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID b48d86b9e433960129277ea4f7d3c54a

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type profileOwnProfileQuery$variables = Record<PropertyKey, never>;
export type profileOwnProfileQuery$data = {
  readonly user:
    | {
        readonly bio: string | null | undefined;
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
          | "profileLikesListFragment"
          | "profilePostsListFragment"
          | "profileRepliesListFragment"
        >;
      }
    | null
    | undefined;
};
export type profileOwnProfileQuery = {
  response: profileOwnProfileQuery$data;
  variables: profileOwnProfileQuery$variables;
};

const node: ConcreteRequest = (function () {
  var v0 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "id",
      storageKey: null,
    },
    v1 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "name",
      storageKey: null,
    },
    v2 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "username",
      storageKey: null,
    },
    v3 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "bio",
      storageKey: null,
    },
    v4 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "url",
      storageKey: null,
    },
    v5 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "followerCount",
      storageKey: null,
    },
    v6 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "followingCount",
      storageKey: null,
    },
    v7 = {
      alias: null,
      args: null,
      concreteType: "Asset",
      kind: "LinkedField",
      name: "image",
      plural: false,
      selections: [v4 /*: any*/, v0 /*: any*/],
      storageKey: null,
    },
    v8 = [
      {
        kind: "Literal",
        name: "first",
        value: 20,
      },
    ],
    v9 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "content",
      storageKey: null,
    },
    v10 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "createdAt",
      storageKey: null,
    },
    v11 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "likesCount",
      storageKey: null,
    },
    v12 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "childPostsCount",
      storageKey: null,
    },
    v13 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "likedAt",
      storageKey: null,
    },
    v14 = {
      alias: null,
      args: null,
      concreteType: "User",
      kind: "LinkedField",
      name: "user",
      plural: false,
      selections: [v0 /*: any*/, v1 /*: any*/, v2 /*: any*/, v7 /*: any*/],
      storageKey: null,
    },
    v15 = {
      alias: null,
      args: null,
      concreteType: "Asset",
      kind: "LinkedField",
      name: "images",
      plural: true,
      selections: [
        v4 /*: any*/,
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
        v0 /*: any*/,
      ],
      storageKey: null,
    },
    v16 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "text",
      storageKey: null,
    },
    v17 = {
      alias: null,
      args: null,
      concreteType: "BibleVerse",
      kind: "LinkedField",
      name: "verse",
      plural: false,
      selections: [
        v0 /*: any*/,
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
    v18 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "__typename",
      storageKey: null,
    },
    v19 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "cursor",
      storageKey: null,
    },
    v20 = {
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
    v21 = {
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
    v22 = [
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
              v0 /*: any*/,
              v9 /*: any*/,
              v10 /*: any*/,
              v11 /*: any*/,
              v12 /*: any*/,
              v13 /*: any*/,
              v14 /*: any*/,
              v15 /*: any*/,
              {
                alias: null,
                args: null,
                concreteType: "Poll",
                kind: "LinkedField",
                name: "poll",
                plural: false,
                selections: [
                  v0 /*: any*/,
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
                    selections: [v0 /*: any*/, v16 /*: any*/],
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
                      v0 /*: any*/,
                      v16 /*: any*/,
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
              v17 /*: any*/,
              v18 /*: any*/,
            ],
            storageKey: null,
          },
          v19 /*: any*/,
        ],
        storageKey: null,
      },
      v20 /*: any*/,
      v21 /*: any*/,
    ];
  return {
    fragment: {
      argumentDefinitions: [],
      kind: "Fragment",
      metadata: null,
      name: "profileOwnProfileQuery",
      selections: [
        {
          alias: null,
          args: null,
          concreteType: "User",
          kind: "LinkedField",
          name: "user",
          plural: false,
          selections: [
            v0 /*: any*/,
            v1 /*: any*/,
            v2 /*: any*/,
            v3 /*: any*/,
            {
              alias: null,
              args: null,
              concreteType: "Asset",
              kind: "LinkedField",
              name: "image",
              plural: false,
              selections: [v4 /*: any*/],
              storageKey: null,
            },
            v5 /*: any*/,
            v6 /*: any*/,
            {
              args: null,
              kind: "FragmentSpread",
              name: "profilePostsListFragment",
            },
            {
              args: null,
              kind: "FragmentSpread",
              name: "profileRepliesListFragment",
            },
            {
              args: null,
              kind: "FragmentSpread",
              name: "profileLikesListFragment",
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
      argumentDefinitions: [],
      kind: "Operation",
      name: "profileOwnProfileQuery",
      selections: [
        {
          alias: null,
          args: null,
          concreteType: "User",
          kind: "LinkedField",
          name: "user",
          plural: false,
          selections: [
            v0 /*: any*/,
            v1 /*: any*/,
            v2 /*: any*/,
            v3 /*: any*/,
            v7 /*: any*/,
            v5 /*: any*/,
            v6 /*: any*/,
            {
              alias: null,
              args: v8 /*: any*/,
              concreteType: "BibleVersePostConnection",
              kind: "LinkedField",
              name: "bibleVersePosts",
              plural: false,
              selections: v22 /*: any*/,
              storageKey: "bibleVersePosts(first:20)",
            },
            {
              alias: null,
              args: v8 /*: any*/,
              filters: null,
              handle: "connection",
              key: "profilePostsList_bibleVersePosts",
              kind: "LinkedHandle",
              name: "bibleVersePosts",
            },
            {
              alias: null,
              args: v8 /*: any*/,
              concreteType: "BibleVersePostConnection",
              kind: "LinkedField",
              name: "bibleVerseChildPosts",
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
                        v0 /*: any*/,
                        v9 /*: any*/,
                        v10 /*: any*/,
                        v11 /*: any*/,
                        v12 /*: any*/,
                        v13 /*: any*/,
                        v14 /*: any*/,
                        v15 /*: any*/,
                        v17 /*: any*/,
                        v18 /*: any*/,
                      ],
                      storageKey: null,
                    },
                    v19 /*: any*/,
                  ],
                  storageKey: null,
                },
                v20 /*: any*/,
                v21 /*: any*/,
              ],
              storageKey: "bibleVerseChildPosts(first:20)",
            },
            {
              alias: null,
              args: v8 /*: any*/,
              filters: null,
              handle: "connection",
              key: "profileRepliesList_bibleVerseChildPosts",
              kind: "LinkedHandle",
              name: "bibleVerseChildPosts",
            },
            {
              alias: null,
              args: v8 /*: any*/,
              concreteType: "BibleVersePostConnection",
              kind: "LinkedField",
              name: "likedBibleVersePosts",
              plural: false,
              selections: v22 /*: any*/,
              storageKey: "likedBibleVersePosts(first:20)",
            },
            {
              alias: null,
              args: v8 /*: any*/,
              filters: null,
              handle: "connection",
              key: "profileLikesList_likedBibleVersePosts",
              kind: "LinkedHandle",
              name: "likedBibleVersePosts",
            },
          ],
          storageKey: null,
        },
      ],
    },
    params: {
      id: "b48d86b9e433960129277ea4f7d3c54a",
      metadata: {},
      name: "profileOwnProfileQuery",
      operationKind: "query",
      text: null,
    },
  };
})();

(node as any).hash = "fd157d58d088b34f4d57bad121e1abb3";

export default node;
