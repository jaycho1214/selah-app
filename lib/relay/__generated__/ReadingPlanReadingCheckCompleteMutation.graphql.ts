/**
 * @generated SignedSource<<bad5f57b72f2a20025f939db6cb1a776>>
 * @relayHash c71f21a1138f3c1a48d0667b51a2b5b5
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID c71f21a1138f3c1a48d0667b51a2b5b5

import { ConcreteRequest } from "relay-runtime";
export type ReadingPlanReadingCheckCompleteMutation$variables = {
  dayId: string;
  planId: string;
  readingId: string;
};
export type ReadingPlanReadingCheckCompleteMutation$data = {
  readonly readingPlanReadingComplete: boolean | null | undefined;
};
export type ReadingPlanReadingCheckCompleteMutation = {
  response: ReadingPlanReadingCheckCompleteMutation$data;
  variables: ReadingPlanReadingCheckCompleteMutation$variables;
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
    v2 = {
      defaultValue: null,
      kind: "LocalArgument",
      name: "readingId",
    },
    v3 = [
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
          {
            kind: "Variable",
            name: "readingId",
            variableName: "readingId",
          },
        ],
        kind: "ScalarField",
        name: "readingPlanReadingComplete",
        storageKey: null,
      },
    ];
  return {
    fragment: {
      argumentDefinitions: [v0 /*: any*/, v1 /*: any*/, v2 /*: any*/],
      kind: "Fragment",
      metadata: null,
      name: "ReadingPlanReadingCheckCompleteMutation",
      selections: v3 /*: any*/,
      type: "Mutation",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: [v1 /*: any*/, v2 /*: any*/, v0 /*: any*/],
      kind: "Operation",
      name: "ReadingPlanReadingCheckCompleteMutation",
      selections: v3 /*: any*/,
    },
    params: {
      id: "c71f21a1138f3c1a48d0667b51a2b5b5",
      metadata: {},
      name: "ReadingPlanReadingCheckCompleteMutation",
      operationKind: "mutation",
      text: null,
    },
  };
})();

(node as any).hash = "7a44909487841772fda12c2b7c24e10a";

export default node;
