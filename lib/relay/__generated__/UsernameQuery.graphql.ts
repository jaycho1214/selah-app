/**
 * @generated SignedSource<<8f4ca48c1a18cfcc78255a0b169c3cb4>>
 * @relayHash a5bd9c4b23a16b873a1ef76a9079bdf1
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID a5bd9c4b23a16b873a1ef76a9079bdf1

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
        readonly isBlocked: boolean;
        readonly isBlockingMe: boolean;
        readonly name: string | null | undefined;
        readonly username: string | null | undefined;
        readonly " $fragmentSpreads": FragmentRefs<
          | "followButton_user"
          | "profileLikesListFragment"
          | "profilePostsListFragment"
          | "profileRepliesListFragment"
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
      kind: "ScalarField",
      name: "isBlocked",
      storageKey: null,
    },
    v11 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "isBlockingMe",
      storageKey: null,
    },
    v12 = {
      alias: null,
      args: null,
      concreteType: "Asset",
      kind: "LinkedField",
      name: "image",
      plural: false,
      selections: [v6 /*: any*/, v2 /*: any*/],
      storageKey: null,
    },
    v13 = [
      {
        kind: "Literal",
        name: "first",
        value: 20,
      },
    ],
    v14 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "content",
      storageKey: null,
    },
    v15 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "createdAt",
      storageKey: null,
    },
    v16 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "likesCount",
      storageKey: null,
    },
    v17 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "childPostsCount",
      storageKey: null,
    },
    v18 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "likedAt",
      storageKey: null,
    },
    v19 = {
      alias: null,
      args: null,
      concreteType: "User",
      kind: "LinkedField",
      name: "user",
      plural: false,
      selections: [v2 /*: any*/, v4 /*: any*/, v3 /*: any*/, v12 /*: any*/],
      storageKey: null,
    },
    v20 = {
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
    v21 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "text",
      storageKey: null,
    },
    v22 = {
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
    v23 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "__typename",
      storageKey: null,
    },
    v24 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "cursor",
      storageKey: null,
    },
    v25 = {
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
    v26 = {
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
    v27 = [
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
              v14 /*: any*/,
              v15 /*: any*/,
              v16 /*: any*/,
              v17 /*: any*/,
              v18 /*: any*/,
              v19 /*: any*/,
              v20 /*: any*/,
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
                    selections: [v2 /*: any*/, v21 /*: any*/],
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
                      v21 /*: any*/,
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
              v22 /*: any*/,
              v23 /*: any*/,
            ],
            storageKey: null,
          },
          v24 /*: any*/,
        ],
        storageKey: null,
      },
      v25 /*: any*/,
      v26 /*: any*/,
    ];
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
            v10 /*: any*/,
            v11 /*: any*/,
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
            v12 /*: any*/,
            v7 /*: any*/,
            v8 /*: any*/,
            v9 /*: any*/,
            v10 /*: any*/,
            v11 /*: any*/,
            {
              alias: null,
              args: v13 /*: any*/,
              concreteType: "BibleVersePostConnection",
              kind: "LinkedField",
              name: "bibleVersePosts",
              plural: false,
              selections: v27 /*: any*/,
              storageKey: "bibleVersePosts(first:20)",
            },
            {
              alias: null,
              args: v13 /*: any*/,
              filters: null,
              handle: "connection",
              key: "profilePostsList_bibleVersePosts",
              kind: "LinkedHandle",
              name: "bibleVersePosts",
            },
            {
              alias: null,
              args: v13 /*: any*/,
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
                        v2 /*: any*/,
                        v14 /*: any*/,
                        v15 /*: any*/,
                        v16 /*: any*/,
                        v17 /*: any*/,
                        v18 /*: any*/,
                        v19 /*: any*/,
                        v20 /*: any*/,
                        v22 /*: any*/,
                        v23 /*: any*/,
                      ],
                      storageKey: null,
                    },
                    v24 /*: any*/,
                  ],
                  storageKey: null,
                },
                v25 /*: any*/,
                v26 /*: any*/,
              ],
              storageKey: "bibleVerseChildPosts(first:20)",
            },
            {
              alias: null,
              args: v13 /*: any*/,
              filters: null,
              handle: "connection",
              key: "profileRepliesList_bibleVerseChildPosts",
              kind: "LinkedHandle",
              name: "bibleVerseChildPosts",
            },
            {
              alias: null,
              args: v13 /*: any*/,
              concreteType: "BibleVersePostConnection",
              kind: "LinkedField",
              name: "likedBibleVersePosts",
              plural: false,
              selections: v27 /*: any*/,
              storageKey: "likedBibleVersePosts(first:20)",
            },
            {
              alias: null,
              args: v13 /*: any*/,
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
      id: "a5bd9c4b23a16b873a1ef76a9079bdf1",
      metadata: {},
      name: "UsernameQuery",
      operationKind: "query",
      text: null,
    },
  };
})();

(node as any).hash = "85cc13d2daef596c476f97414b5a2aa2";

export default node;
