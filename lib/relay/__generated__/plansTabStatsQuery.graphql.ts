/**
 * @generated SignedSource<<9b3014820346200b57ea1735ec25d8e7>>
 * @relayHash 356e71da64981da5f6de4c17bbb58277
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 356e71da64981da5f6de4c17bbb58277

import { ConcreteRequest } from 'relay-runtime';
export type plansTabStatsQuery$variables = Record<PropertyKey, never>;
export type plansTabStatsQuery$data = {
  readonly myReadingPlanStats: {
    readonly completedPlansCount: number | null | undefined;
    readonly fullBibleCount: number | null | undefined;
    readonly newTestamentCount: number | null | undefined;
    readonly oldTestamentCount: number | null | undefined;
  };
};
export type plansTabStatsQuery = {
  response: plansTabStatsQuery$data;
  variables: plansTabStatsQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "UserReadingPlanStats",
    "kind": "LinkedField",
    "name": "myReadingPlanStats",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "completedPlansCount",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "fullBibleCount",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "oldTestamentCount",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "newTestamentCount",
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
    "name": "plansTabStatsQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "plansTabStatsQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "id": "356e71da64981da5f6de4c17bbb58277",
    "metadata": {},
    "name": "plansTabStatsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "dd102a54050ce8172dd4e5cfc954244c";

export default node;
