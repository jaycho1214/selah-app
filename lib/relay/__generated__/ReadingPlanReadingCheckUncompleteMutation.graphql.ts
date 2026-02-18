/**
 * @generated SignedSource<<d15ec12e1c60431d6bded8ccf02153be>>
 * @relayHash 73927e1032cd4e7a120ba0f6a67f53cf
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 73927e1032cd4e7a120ba0f6a67f53cf

import { ConcreteRequest } from "relay-runtime";
export type ReadingPlanReadingCheckUncompleteMutation$variables = {
  dayId: string;
  planId: string;
  readingId: string;
};
export type ReadingPlanReadingCheckUncompleteMutation$data = {
  readonly readingPlanReadingUncomplete: boolean | null | undefined;
};
export type ReadingPlanReadingCheckUncompleteMutation = {
  response: ReadingPlanReadingCheckUncompleteMutation$data;
  variables: ReadingPlanReadingCheckUncompleteMutation$variables;
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
        name: "readingPlanReadingUncomplete",
        storageKey: null,
      },
    ];
  return {
    fragment: {
      argumentDefinitions: [v0 /*: any*/, v1 /*: any*/, v2 /*: any*/],
      kind: "Fragment",
      metadata: null,
      name: "ReadingPlanReadingCheckUncompleteMutation",
      selections: v3 /*: any*/,
      type: "Mutation",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: [v1 /*: any*/, v2 /*: any*/, v0 /*: any*/],
      kind: "Operation",
      name: "ReadingPlanReadingCheckUncompleteMutation",
      selections: v3 /*: any*/,
    },
    params: {
      id: "73927e1032cd4e7a120ba0f6a67f53cf",
      metadata: {},
      name: "ReadingPlanReadingCheckUncompleteMutation",
      operationKind: "mutation",
      text: null,
    },
  };
})();

(node as any).hash = "407d151b611ac43056a1283c3a4dcdd6";

export default node;
