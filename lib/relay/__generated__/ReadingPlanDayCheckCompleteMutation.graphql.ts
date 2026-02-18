/**
 * @generated SignedSource<<6737ddf85ac7d1e8a0994653301b42d1>>
 * @relayHash c9cb911a61f26139d2caacdfe9f63018
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID c9cb911a61f26139d2caacdfe9f63018

import { ConcreteRequest } from "relay-runtime";
export type ReadingPlanDayCheckCompleteMutation$variables = {
  dayId: string;
  planId: string;
};
export type ReadingPlanDayCheckCompleteMutation$data = {
  readonly readingPlanDayComplete: boolean | null | undefined;
};
export type ReadingPlanDayCheckCompleteMutation = {
  response: ReadingPlanDayCheckCompleteMutation$data;
  variables: ReadingPlanDayCheckCompleteMutation$variables;
};

const node: ConcreteRequest = (function () {
  var v0 = {
      defaultValue: null,
      kind: "LocalArgument",
      name: "dayId",
    },
    v1 = {
      defaultValue: null,
      kind: "LocalArgument",
      name: "planId",
    },
    v2 = [
      {
        alias: null,
        args: [
          {
            kind: "Variable",
            name: "dayId",
            variableName: "dayId",
          },
          {
            kind: "Variable",
            name: "planId",
            variableName: "planId",
          },
        ],
        kind: "ScalarField",
        name: "readingPlanDayComplete",
        storageKey: null,
      },
    ];
  return {
    fragment: {
      argumentDefinitions: [v0 /*: any*/, v1 /*: any*/],
      kind: "Fragment",
      metadata: null,
      name: "ReadingPlanDayCheckCompleteMutation",
      selections: v2 /*: any*/,
      type: "Mutation",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: [v1 /*: any*/, v0 /*: any*/],
      kind: "Operation",
      name: "ReadingPlanDayCheckCompleteMutation",
      selections: v2 /*: any*/,
    },
    params: {
      id: "c9cb911a61f26139d2caacdfe9f63018",
      metadata: {},
      name: "ReadingPlanDayCheckCompleteMutation",
      operationKind: "mutation",
      text: null,
    },
  };
})();

(node as any).hash = "fa42da30f2dc17db4e3b1dbcd8cb9be2";

export default node;
