/**
 * @generated SignedSource<<35b7d1cf90a1fa0d3778fa96abb96ab5>>
 * @relayHash 4e6fb95bd21e8f5d91212892f4328d57
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 4e6fb95bd21e8f5d91212892f4328d57

import { ConcreteRequest } from 'relay-runtime';
export type ReadingPlanBannerReadingCompleteMutation$variables = {
  dayId: string;
  planId: string;
  readingId: string;
};
export type ReadingPlanBannerReadingCompleteMutation$data = {
  readonly readingPlanReadingComplete: boolean | null | undefined;
};
export type ReadingPlanBannerReadingCompleteMutation = {
  response: ReadingPlanBannerReadingCompleteMutation$data;
  variables: ReadingPlanBannerReadingCompleteMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "dayId"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "planId"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "readingId"
},
v3 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "dayId",
        "variableName": "dayId"
      },
      {
        "kind": "Variable",
        "name": "planId",
        "variableName": "planId"
      },
      {
        "kind": "Variable",
        "name": "readingId",
        "variableName": "readingId"
      }
    ],
    "kind": "ScalarField",
    "name": "readingPlanReadingComplete",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "ReadingPlanBannerReadingCompleteMutation",
    "selections": (v3/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v2/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "ReadingPlanBannerReadingCompleteMutation",
    "selections": (v3/*: any*/)
  },
  "params": {
    "id": "4e6fb95bd21e8f5d91212892f4328d57",
    "metadata": {},
    "name": "ReadingPlanBannerReadingCompleteMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "2ba7687329380cccb57d88b296b49beb";

export default node;
