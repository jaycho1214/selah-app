/**
 * @generated SignedSource<<1ddd5b7b1a0b5cf488a44734cde2eeba>>
 * @relayHash 1fb415fd41a82dcc52bffbbf2950baac
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 1fb415fd41a82dcc52bffbbf2950baac

import { ConcreteRequest } from 'relay-runtime';
export type plansTabBehindQuery$variables = Record<PropertyKey, never>;
export type plansTabBehindQuery$data = {
  readonly user: {
    readonly behindReadingPlanDaysCount: number | null | undefined;
  } | null | undefined;
};
export type plansTabBehindQuery = {
  response: plansTabBehindQuery$data;
  variables: plansTabBehindQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "behindReadingPlanDaysCount",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "plansTabBehindQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "User",
        "kind": "LinkedField",
        "name": "user",
        "plural": false,
        "selections": [
          (v0/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "plansTabBehindQuery",
    "selections": [
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
            "name": "id",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "1fb415fd41a82dcc52bffbbf2950baac",
    "metadata": {},
    "name": "plansTabBehindQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "15310f5ad383654aea5130860d066e4a";

export default node;
