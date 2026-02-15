/**
 * @generated SignedSource<<a8492be48d6bd6bd6614a9fc1723da64>>
 * @relayHash 47a39bb0796e791929dabdc3018dc9c9
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 47a39bb0796e791929dabdc3018dc9c9

import { ConcreteRequest } from 'relay-runtime';
export type BibleVersePostCreateInput = {
  content: string;
  imageIds?: ReadonlyArray<string> | null | undefined;
  parentId: string;
  poll?: PollCreateInput | null | undefined;
};
export type PollCreateInput = {
  deadline: any;
  options: ReadonlyArray<string>;
};
export type IdCreateReplyMutation$variables = {
  connections: ReadonlyArray<string>;
  input: BibleVersePostCreateInput;
};
export type IdCreateReplyMutation$data = {
  readonly bibleVersePostCreate: {
    readonly bibleVersePost: {
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
    };
  };
};
export type IdCreateReplyMutation = {
  response: IdCreateReplyMutation$data;
  variables: IdCreateReplyMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "connections"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "input"
},
v2 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "content",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "createdAt",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "likesCount",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "childPostsCount",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "likedAt",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "username",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "url",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "width",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "height",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "text",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "concreteType": "Poll",
  "kind": "LinkedField",
  "name": "poll",
  "plural": false,
  "selections": [
    (v3/*: any*/),
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
        (v3/*: any*/),
        (v14/*: any*/)
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
        (v3/*: any*/),
        (v14/*: any*/),
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
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "IdCreateReplyMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "BibleVersePostCreatePayload",
        "kind": "LinkedField",
        "name": "bibleVersePostCreate",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "BibleVersePost",
            "kind": "LinkedField",
            "name": "bibleVersePost",
            "plural": false,
            "selections": [
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/),
              (v8/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "User",
                "kind": "LinkedField",
                "name": "user",
                "plural": false,
                "selections": [
                  (v3/*: any*/),
                  (v9/*: any*/),
                  (v10/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Asset",
                    "kind": "LinkedField",
                    "name": "image",
                    "plural": false,
                    "selections": [
                      (v11/*: any*/)
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
                  (v11/*: any*/),
                  (v12/*: any*/),
                  (v13/*: any*/)
                ],
                "storageKey": null
              },
              (v15/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "IdCreateReplyMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "BibleVersePostCreatePayload",
        "kind": "LinkedField",
        "name": "bibleVersePostCreate",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "BibleVersePost",
            "kind": "LinkedField",
            "name": "bibleVersePost",
            "plural": false,
            "selections": [
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/),
              (v8/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "User",
                "kind": "LinkedField",
                "name": "user",
                "plural": false,
                "selections": [
                  (v3/*: any*/),
                  (v9/*: any*/),
                  (v10/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Asset",
                    "kind": "LinkedField",
                    "name": "image",
                    "plural": false,
                    "selections": [
                      (v11/*: any*/),
                      (v3/*: any*/)
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
                  (v11/*: any*/),
                  (v12/*: any*/),
                  (v13/*: any*/),
                  (v3/*: any*/)
                ],
                "storageKey": null
              },
              (v15/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "filters": null,
            "handle": "prependNode",
            "key": "",
            "kind": "LinkedHandle",
            "name": "bibleVersePost",
            "handleArgs": [
              {
                "kind": "Variable",
                "name": "connections",
                "variableName": "connections"
              },
              {
                "kind": "Literal",
                "name": "edgeTypeName",
                "value": "BibleVersePostEdge"
              }
            ]
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "47a39bb0796e791929dabdc3018dc9c9",
    "metadata": {},
    "name": "IdCreateReplyMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "33dc49eb6e8019357ed40e89196463be";

export default node;
