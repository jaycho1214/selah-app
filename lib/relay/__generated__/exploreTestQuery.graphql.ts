/**
 * @generated SignedSource<<658f141c684bf7391e4a47922d824fdf>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type exploreTestQuery$variables = Record<PropertyKey, never>;
export type exploreTestQuery$data = {
  readonly bibleVersePosts: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly id: string;
      };
    }>;
  };
};
export type exploreTestQuery = {
  response: exploreTestQuery$data;
  variables: exploreTestQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Literal",
        "name": "first",
        "value": 1
      }
    ],
    "concreteType": "BibleVersePostConnection",
    "kind": "LinkedField",
    "name": "bibleVersePosts",
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
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "id",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": "bibleVersePosts(first:1)"
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "exploreTestQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "exploreTestQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "782ad0bd594318e935808656c596784b",
    "id": null,
    "metadata": {},
    "name": "exploreTestQuery",
    "operationKind": "query",
    "text": "query exploreTestQuery {\n  bibleVersePosts(first: 1) {\n    edges {\n      node {\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "a9a3614dadeab9c48854eafaa1ea7fb6";

export default node;
