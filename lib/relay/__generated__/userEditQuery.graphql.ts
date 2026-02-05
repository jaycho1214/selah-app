/**
 * @generated SignedSource<<915f22f243a4ec484ca3fef0f9a2083a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type userEditQuery$variables = Record<PropertyKey, never>;
export type userEditQuery$data = {
  readonly user: {
    readonly bio: string | null | undefined;
    readonly id: string;
    readonly image: {
      readonly id: string;
      readonly url: string | null | undefined;
    } | null | undefined;
    readonly name: string | null | undefined;
    readonly username: string | null | undefined;
  } | null | undefined;
};
export type userEditQuery = {
  response: userEditQuery$data;
  variables: userEditQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "User",
    "kind": "LinkedField",
    "name": "user",
    "plural": false,
    "selections": [
      (v0/*: any*/),
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
        "kind": "ScalarField",
        "name": "bio",
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
          (v0/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "url",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "userEditQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "userEditQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "ab64b3f9813e5c91de8d64d290a93310",
    "id": null,
    "metadata": {},
    "name": "userEditQuery",
    "operationKind": "query",
    "text": "query userEditQuery {\n  user {\n    id\n    name\n    username\n    bio\n    image {\n      id\n      url\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "52b835f8ab7abf33cc9ae3bd1365268e";

export default node;
