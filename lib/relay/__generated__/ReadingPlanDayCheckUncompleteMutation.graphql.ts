/**
 * @generated SignedSource<<5420f784a1a0c7c66f2c6b54081611ca>>
 * @relayHash 54d4aa61fbf143708bb76d1277f4287f
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 54d4aa61fbf143708bb76d1277f4287f

import { ConcreteRequest } from 'relay-runtime';
export type ReadingPlanDayCheckUncompleteMutation$variables = {
  dayId: string;
  planId: string;
};
export type ReadingPlanDayCheckUncompleteMutation$data = {
  readonly readingPlanDayUncomplete: boolean | null | undefined;
};
export type ReadingPlanDayCheckUncompleteMutation = {
  response: ReadingPlanDayCheckUncompleteMutation$data;
  variables: ReadingPlanDayCheckUncompleteMutation$variables;
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
v2 = [
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
      }
    ],
    "kind": "ScalarField",
    "name": "readingPlanDayUncomplete",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "ReadingPlanDayCheckUncompleteMutation",
    "selections": (v2/*: any*/),
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
    "name": "ReadingPlanDayCheckUncompleteMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "id": "54d4aa61fbf143708bb76d1277f4287f",
    "metadata": {},
    "name": "ReadingPlanDayCheckUncompleteMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "b30114d2d8807f14e5fa3132ce6df8d8";

export default node;
