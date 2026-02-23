/**
 * @generated SignedSource<<426f78049987ecfc181d54230be32688>>
 * @relayHash 07bbe254e5b78fc4936cb3b9b3adbe4c
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 07bbe254e5b78fc4936cb3b9b3adbe4c

import { ConcreteRequest } from 'relay-runtime';
export type reflectionItemTopReplyQuery$variables = {
  postId: string;
};
export type reflectionItemTopReplyQuery$data = {
  readonly bibleVersePostById: {
    readonly topReply: {
      readonly content: string | null | undefined;
      readonly id: string;
      readonly user: {
        readonly id: string;
        readonly image: {
          readonly url: string | null | undefined;
        } | null | undefined;
        readonly name: string | null | undefined;
        readonly username: string | null | undefined;
      };
    } | null | undefined;
  } | null | undefined;
};
export type reflectionItemTopReplyQuery = {
  response: reflectionItemTopReplyQuery$data;
  variables: reflectionItemTopReplyQuery$variables;
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
  "name": "name",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "username",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "url",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "reflectionItemTopReplyQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "BibleVersePost",
        "kind": "LinkedField",
        "name": "bibleVersePostById",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "BibleVersePost",
            "kind": "LinkedField",
            "name": "topReply",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "User",
                "kind": "LinkedField",
                "name": "user",
                "plural": false,
                "selections": [
                  (v2/*: any*/),
                  (v4/*: any*/),
                  (v5/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Asset",
                    "kind": "LinkedField",
                    "name": "image",
                    "plural": false,
                    "selections": [
                      (v6/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
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
    "name": "reflectionItemTopReplyQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "BibleVersePost",
        "kind": "LinkedField",
        "name": "bibleVersePostById",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "BibleVersePost",
            "kind": "LinkedField",
            "name": "topReply",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "User",
                "kind": "LinkedField",
                "name": "user",
                "plural": false,
                "selections": [
                  (v2/*: any*/),
                  (v4/*: any*/),
                  (v5/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Asset",
                    "kind": "LinkedField",
                    "name": "image",
                    "plural": false,
                    "selections": [
                      (v6/*: any*/),
                      (v2/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v2/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "07bbe254e5b78fc4936cb3b9b3adbe4c",
    "metadata": {},
    "name": "reflectionItemTopReplyQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "9b24936dee70bcfde43929f05b8e524d";

export default node;
