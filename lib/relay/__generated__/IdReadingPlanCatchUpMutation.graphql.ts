/**
 * @generated SignedSource<<408e45f939a4059bd6e84b84fd9d5af1>>
 * @relayHash de620497a233cbc2cbb4963e1cb79728
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID de620497a233cbc2cbb4963e1cb79728

import { ConcreteRequest } from "relay-runtime";
export type IdReadingPlanCatchUpMutation$variables = {
  planId: string;
};
export type IdReadingPlanCatchUpMutation$data = {
  readonly readingPlanCatchUp:
    | {
        readonly behindDaysCount: number | null | undefined;
        readonly completedAt: any | null | undefined;
        readonly completedDaysCount: number | null | undefined;
        readonly id: string;
      }
    | null
    | undefined;
};
export type IdReadingPlanCatchUpMutation = {
  response: IdReadingPlanCatchUpMutation$data;
  variables: IdReadingPlanCatchUpMutation$variables;
};

const node: ConcreteRequest = (function () {
  var v0 = [
      {
        defaultValue: null,
        kind: "LocalArgument",
        name: "planId",
      },
    ],
    v1 = [
      {
        alias: null,
        args: [
          {
            kind: "Variable",
            name: "planId",
            variableName: "planId",
          },
        ],
        concreteType: "ReadingPlanParticipant",
        kind: "LinkedField",
        name: "readingPlanCatchUp",
        plural: false,
        selections: [
          {
            alias: null,
            args: null,
            kind: "ScalarField",
            name: "id",
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            kind: "ScalarField",
            name: "completedDaysCount",
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            kind: "ScalarField",
            name: "completedAt",
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            kind: "ScalarField",
            name: "behindDaysCount",
            storageKey: null,
          },
        ],
        storageKey: null,
      },
    ];
  return {
    fragment: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Fragment",
      metadata: null,
      name: "IdReadingPlanCatchUpMutation",
      selections: v1 /*: any*/,
      type: "Mutation",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Operation",
      name: "IdReadingPlanCatchUpMutation",
      selections: v1 /*: any*/,
    },
    params: {
      id: "de620497a233cbc2cbb4963e1cb79728",
      metadata: {},
      name: "IdReadingPlanCatchUpMutation",
      operationKind: "mutation",
      text: null,
    },
  };
})();

(node as any).hash = "1bb71fce1bdcf9f8768cca6e98b10e33";

export default node;
