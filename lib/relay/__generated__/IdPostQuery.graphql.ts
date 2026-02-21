/**
 * @generated SignedSource<<bd91abc398664119b416e84cc5da2f44>>
 * @relayHash 35a96acd0be60a9c5a9062f5749441e0
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 35a96acd0be60a9c5a9062f5749441e0

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type IdPostQuery$variables = {
  postId: string;
};
export type IdPostQuery$data = {
  readonly bibleVersePostById: {
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
      readonly deadline: any | null | undefined;
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
    readonly " $fragmentSpreads": FragmentRefs<"IdChildrenFragment">;
  } | null | undefined;
};
export type IdPostQuery = {
  response: IdPostQuery$data;
  variables: IdPostQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "postId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "postId"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "content",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "createdAt",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "likesCount",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "childPostsCount",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "likedAt",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "username",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "url",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "width",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "height",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "text",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "concreteType": "Poll",
  "kind": "LinkedField",
  "name": "poll",
  "plural": false,
  "selections": [
    (v2/*: any*/),
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
      "kind": "ScalarField",
      "name": "deadline",
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
        (v2/*: any*/),
        (v13/*: any*/)
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
        (v2/*: any*/),
        (v13/*: any*/),
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
v15 = {
  "alias": null,
  "args": null,
  "concreteType": "User",
  "kind": "LinkedField",
  "name": "user",
  "plural": false,
  "selections": [
    (v2/*: any*/),
    (v8/*: any*/),
    (v9/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "Asset",
      "kind": "LinkedField",
      "name": "image",
      "plural": false,
      "selections": [
        (v10/*: any*/),
        (v2/*: any*/)
      ],
      "storageKey": null
    }
  ],
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "concreteType": "Asset",
  "kind": "LinkedField",
  "name": "images",
  "plural": true,
  "selections": [
    (v10/*: any*/),
    (v11/*: any*/),
    (v12/*: any*/),
    (v2/*: any*/)
  ],
  "storageKey": null
},
v17 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 20
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "IdPostQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "BibleVersePost",
        "kind": "LinkedField",
        "name": "bibleVersePostById",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "User",
            "kind": "LinkedField",
            "name": "user",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v8/*: any*/),
              (v9/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Asset",
                "kind": "LinkedField",
                "name": "image",
                "plural": false,
                "selections": [
                  (v10/*: any*/)
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
              (v10/*: any*/),
              (v11/*: any*/),
              (v12/*: any*/)
            ],
            "storageKey": null
          },
          (v14/*: any*/),
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "IdChildrenFragment"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "IdPostQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "BibleVersePost",
        "kind": "LinkedField",
        "name": "bibleVersePostById",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v15/*: any*/),
          (v16/*: any*/),
          (v14/*: any*/),
          {
            "alias": null,
            "args": (v17/*: any*/),
            "concreteType": "BibleVersePostConnection",
            "kind": "LinkedField",
            "name": "childPosts",
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
                      (v2/*: any*/),
                      (v3/*: any*/),
                      (v4/*: any*/),
                      (v5/*: any*/),
                      (v6/*: any*/),
                      (v7/*: any*/),
                      (v15/*: any*/),
                      (v16/*: any*/),
                      (v14/*: any*/),
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
            "storageKey": "childPosts(first:20)"
          },
          {
            "alias": null,
            "args": (v17/*: any*/),
            "filters": null,
            "handle": "connection",
            "key": "IdChildren_childPosts",
            "kind": "LinkedHandle",
            "name": "childPosts"
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "35a96acd0be60a9c5a9062f5749441e0",
    "metadata": {},
    "name": "IdPostQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "a4f3092813c47ade5a79b1d8edf5979b";

export default node;
