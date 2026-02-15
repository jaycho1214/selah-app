/**
 * @generated SignedSource<<17919293bd000a64b5c1f1614aaa4c3f>>
 * @relayHash f42a31420e22dcd3c329b747891e0bc1
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID f42a31420e22dcd3c329b747891e0bc1

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type postsScreenQuery$variables = Record<PropertyKey, never>;
export type postsScreenQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"postsScreenForYouFragment">;
};
export type postsScreenQuery = {
  response: postsScreenQuery$data;
  variables: postsScreenQuery$variables;
};

const node: ConcreteRequest = (function () {
  var v0 = [
      {
        kind: "Literal",
        name: "first",
        value: 20,
      },
    ],
    v1 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "id",
      storageKey: null,
    },
    v2 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "url",
      storageKey: null,
    },
    v3 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "text",
      storageKey: null,
    };
  return {
    fragment: {
      argumentDefinitions: [],
      kind: "Fragment",
      metadata: null,
      name: "postsScreenQuery",
      selections: [
        {
          args: null,
          kind: "FragmentSpread",
          name: "postsScreenForYouFragment",
        },
      ],
      type: "Query",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: [],
      kind: "Operation",
      name: "postsScreenQuery",
      selections: [
        {
          alias: null,
          args: v0 /*: any*/,
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
                    v1 /*: any*/,
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
                        v1 /*: any*/,
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
                          selections: [v2 /*: any*/, v1 /*: any*/],
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
                        v2 /*: any*/,
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
                        v1 /*: any*/,
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
                        v1 /*: any*/,
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
                          selections: [v1 /*: any*/, v3 /*: any*/],
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
                            v1 /*: any*/,
                            v3 /*: any*/,
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
                        v1 /*: any*/,
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
          args: v0 /*: any*/,
          filters: null,
          handle: "connection",
          key: "forYouFeed_bibleVersePosts",
          kind: "LinkedHandle",
          name: "bibleVersePosts",
        },
      ],
    },
    params: {
      id: "f42a31420e22dcd3c329b747891e0bc1",
      metadata: {},
      name: "postsScreenQuery",
      operationKind: "query",
      text: null,
    },
  };
})();

(node as any).hash = "3c48cde3dbd2ef63b882a3f72aec8292";

export default node;
