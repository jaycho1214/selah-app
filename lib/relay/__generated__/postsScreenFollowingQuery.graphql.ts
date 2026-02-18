/**
 * @generated SignedSource<<3e96d991ecac8e2340f623bddad90939>>
 * @relayHash 988ba4ec17c0402a1980d106e78b3ce2
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 988ba4ec17c0402a1980d106e78b3ce2

import { ConcreteRequest } from 'relay-runtime';
export type postsScreenFollowingQuery$variables = Record<PropertyKey, never>;
export type postsScreenFollowingQuery$data = {
  readonly user: {
    readonly followingCount: number;
    readonly id: string;
  } | null | undefined;
};
export type postsScreenFollowingQuery = {
  response: postsScreenFollowingQuery$data;
  variables: postsScreenFollowingQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "User",
    "kind": "LinkedField",
    "name": "user",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "followingCount",
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
    "name": "postsScreenFollowingQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "postsScreenFollowingQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "id": "988ba4ec17c0402a1980d106e78b3ce2",
    "metadata": {},
    "name": "postsScreenFollowingQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "412038d8d2abce6533ce9d0b7d166e51";

export default node;
