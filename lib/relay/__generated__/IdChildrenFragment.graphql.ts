/**
 * @generated SignedSource<<713778355d0efce5cc6a4fee6de53f6d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type IdChildrenFragment$data = {
  readonly childPosts: {
    readonly __id: string;
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly childPostsCount: number;
        readonly content: string | null | undefined;
        readonly createdAt: any;
        readonly id: string;
        readonly images: ReadonlyArray<{
          readonly height: number | null | undefined;
          readonly url: string | null | undefined;
          readonly width: number | null | undefined;
        }>;
        readonly likedAt: any | null | undefined;
        readonly likesCount: number;
        readonly poll: {
          readonly id: string;
          readonly isExpired: boolean | null | undefined;
          readonly options: ReadonlyArray<{
            readonly id: string;
            readonly text: string | null | undefined;
            readonly voteCount: number | null | undefined;
            readonly votePercentage: number | null | undefined;
          }> | null | undefined;
          readonly totalVotes: number | null | undefined;
          readonly userVote: {
            readonly id: string | null | undefined;
            readonly text: string | null | undefined;
          } | null | undefined;
        } | null | undefined;
        readonly user: {
          readonly id: string;
          readonly image: {
            readonly url: string | null | undefined;
          } | null | undefined;
          readonly name: string | null | undefined;
          readonly username: string | null | undefined;
        };
      };
    }>;
  };
  readonly id: string;
  readonly " $fragmentType": "IdChildrenFragment";
};
export type IdChildrenFragment$key = {
  readonly " $data"?: IdChildrenFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"IdChildrenFragment">;
};

import IdChildrenPaginationQuery_graphql from './IdChildrenPaginationQuery.graphql';

const node: ReaderFragment = (function(){
var v0 = [
  "childPosts"
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "url",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "text",
  "storageKey": null
};
return {
  "argumentDefinitions": [
    {
      "defaultValue": 20,
      "kind": "LocalArgument",
      "name": "count"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "cursor"
    }
  ],
  "kind": "Fragment",
  "metadata": {
    "connection": [
      {
        "count": "count",
        "cursor": "cursor",
        "direction": "forward",
        "path": (v0/*: any*/)
      }
    ],
    "refetch": {
      "connection": {
        "forward": {
          "count": "count",
          "cursor": "cursor"
        },
        "backward": null,
        "path": (v0/*: any*/)
      },
      "fragmentPathInResult": [
        "node"
      ],
      "operation": IdChildrenPaginationQuery_graphql,
      "identifierInfo": {
        "identifierField": "id",
        "identifierQueryVariableName": "id"
      }
    }
  },
  "name": "IdChildrenFragment",
  "selections": [
    {
      "alias": "childPosts",
      "args": null,
      "concreteType": "BibleVersePostConnection",
      "kind": "LinkedField",
      "name": "__IdChildren_childPosts_connection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "BibleVersePostEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "BibleVersePost",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                (v1/*: any*/),
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "content",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "createdAt",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "likesCount",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "childPostsCount",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "likedAt",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "User",
                  "kind": "LinkedField",
                  "name": "user",
                  "plural": false,
                  "selections": [
                    (v1/*: any*/),
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "name",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "username",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "Asset",
                      "kind": "LinkedField",
                      "name": "image",
                      "plural": false,
                      "selections": [
                        (v2/*: any*/)
                      ],
                      "storageKey": null
                    }
                  ],
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "Asset",
                  "kind": "LinkedField",
                  "name": "images",
                  "plural": true,
                  "selections": [
                    (v2/*: any*/),
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "width",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "height",
                      "storageKey": null
                    }
                  ],
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "Poll",
                  "kind": "LinkedField",
                  "name": "poll",
                  "plural": false,
                  "selections": [
                    (v1/*: any*/),
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "totalVotes",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "isExpired",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "PollUserVote",
                      "kind": "LinkedField",
                      "name": "userVote",
                      "plural": false,
                      "selections": [
                        (v1/*: any*/),
                        (v3/*: any*/)
                      ],
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "PollOption",
                      "kind": "LinkedField",
                      "name": "options",
                      "plural": true,
                      "selections": [
                        (v1/*: any*/),
                        (v3/*: any*/),
                        {
                          "alias": null,
                          "args": null,
                          "kind": "ScalarField",
                          "name": "voteCount",
                          "storageKey": null
                        },
                        {
                          "alias": null,
                          "args": null,
                          "kind": "ScalarField",
                          "name": "votePercentage",
                          "storageKey": null
                        }
                      ],
                      "storageKey": null
                    }
                  ],
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "__typename",
                  "storageKey": null
                }
              ],
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "cursor",
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "PageInfo",
          "kind": "LinkedField",
          "name": "pageInfo",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "endCursor",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "hasNextPage",
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        {
          "kind": "ClientExtension",
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "__id",
              "storageKey": null
            }
          ]
        }
      ],
      "storageKey": null
    },
    (v1/*: any*/)
  ],
  "type": "BibleVersePost",
  "abstractKey": null
};
})();

(node as any).hash = "7153a10c731155c39fa1545fd73782aa";

export default node;
