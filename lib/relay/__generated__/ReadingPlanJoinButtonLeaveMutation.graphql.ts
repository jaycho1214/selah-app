/**
 * @generated SignedSource<<2b448f97dd6c6a95035ad6c9f750af32>>
 * @relayHash 4cabb671e590728f940e12d055394246
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 4cabb671e590728f940e12d055394246

import { ConcreteRequest } from "relay-runtime";
export type ReadingPlanJoinButtonLeaveMutation$variables = {
  planId: string;
};
export type ReadingPlanJoinButtonLeaveMutation$data = {
  readonly readingPlanLeave: boolean | null | undefined;
};
export type ReadingPlanJoinButtonLeaveMutation = {
  response: ReadingPlanJoinButtonLeaveMutation$data;
  variables: ReadingPlanJoinButtonLeaveMutation$variables;
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
        kind: "ScalarField",
        name: "readingPlanLeave",
        storageKey: null,
      },
    ];
  return {
    fragment: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Fragment",
      metadata: null,
      name: "ReadingPlanJoinButtonLeaveMutation",
      selections: v1 /*: any*/,
      type: "Mutation",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Operation",
      name: "ReadingPlanJoinButtonLeaveMutation",
      selections: v1 /*: any*/,
    },
    params: {
      id: "4cabb671e590728f940e12d055394246",
      metadata: {},
      name: "ReadingPlanJoinButtonLeaveMutation",
      operationKind: "mutation",
      text: null,
    },
  };
})();

(node as any).hash = "cfac8c46f9067a28b842b8cb2b71783e";

export default node;
