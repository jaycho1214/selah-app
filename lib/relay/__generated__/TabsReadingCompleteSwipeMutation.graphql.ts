/**
 * @generated SignedSource<<32a7ac56c782c9060f71ae1dc4cf2a5d>>
 * @relayHash 91afdcbcf44455cae2730bdd3901c795
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 91afdcbcf44455cae2730bdd3901c795

import { ConcreteRequest } from 'relay-runtime';
export type TabsReadingCompleteSwipeMutation$variables = {
  dayId: string;
  planId: string;
  readingId: string;
};
export type TabsReadingCompleteSwipeMutation$data = {
  readonly readingPlanReadingComplete: boolean | null | undefined;
};
export type TabsReadingCompleteSwipeMutation = {
  response: TabsReadingCompleteSwipeMutation$data;
  variables: TabsReadingCompleteSwipeMutation$variables;
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
    "name": "TabsReadingCompleteSwipeMutation",
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
    "name": "TabsReadingCompleteSwipeMutation",
    "selections": (v3/*: any*/)
  },
  "params": {
    "id": "91afdcbcf44455cae2730bdd3901c795",
    "metadata": {},
    "name": "TabsReadingCompleteSwipeMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "421253a83a0b965c345fcf3a343dc809";

export default node;
