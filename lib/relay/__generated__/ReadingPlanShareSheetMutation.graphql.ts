/**
 * @generated SignedSource<<496c043661c73e5677e6a4b49a4280fb>>
 * @relayHash 06bd95f251938422147e65a564f5d81e
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 06bd95f251938422147e65a564f5d81e

import { ConcreteRequest } from "relay-runtime";
export type ReadingPlanShareSheetMutation$variables = {
  content: any;
  milestoneId: string;
  parentId: string;
};
export type ReadingPlanShareSheetMutation$data = {
  readonly readingPlanMilestoneShare:
    | {
        readonly id: string;
      }
    | null
    | undefined;
};
export type ReadingPlanShareSheetMutation = {
  response: ReadingPlanShareSheetMutation$data;
  variables: ReadingPlanShareSheetMutation$variables;
};

const node: ConcreteRequest = (function () {
  var v0 = {
      defaultValue: null,
      kind: "LocalArgument",
      name: "content",
    },
    v1 = {
      defaultValue: null,
      kind: "LocalArgument",
      name: "milestoneId",
    },
    v2 = {
      defaultValue: null,
      kind: "LocalArgument",
      name: "parentId",
    },
    v3 = [
      {
        alias: null,
        args: [
          {
            kind: "Variable",
            name: "content",
            variableName: "content",
          },
          {
            kind: "Variable",
            name: "milestoneId",
            variableName: "milestoneId",
          },
          {
            kind: "Variable",
            name: "parentId",
            variableName: "parentId",
          },
        ],
        concreteType: "ReadingPlanMilestone",
        kind: "LinkedField",
        name: "readingPlanMilestoneShare",
        plural: false,
        selections: [
          {
            alias: null,
            args: null,
            kind: "ScalarField",
            name: "id",
            storageKey: null,
          },
        ],
        storageKey: null,
      },
    ];
  return {
    fragment: {
      argumentDefinitions: [v0 /*: any*/, v1 /*: any*/, v2 /*: any*/],
      kind: "Fragment",
      metadata: null,
      name: "ReadingPlanShareSheetMutation",
      selections: v3 /*: any*/,
      type: "Mutation",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: [v1 /*: any*/, v2 /*: any*/, v0 /*: any*/],
      kind: "Operation",
      name: "ReadingPlanShareSheetMutation",
      selections: v3 /*: any*/,
    },
    params: {
      id: "06bd95f251938422147e65a564f5d81e",
      metadata: {},
      name: "ReadingPlanShareSheetMutation",
      operationKind: "mutation",
      text: null,
    },
  };
})();

(node as any).hash = "59bf304d3e903911c246126d6e7d4edc";

export default node;
