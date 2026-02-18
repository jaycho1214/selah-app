/**
 * @generated SignedSource<<edc0a2e76ac911b337f0952925984298>>
 * @relayHash 9d466ce14127d3c07f8abf67dd24fffb
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 9d466ce14127d3c07f8abf67dd24fffb

import { ConcreteRequest } from "relay-runtime";
export type ReadingPlanBannerReadingUncompleteMutation$variables = {
  dayId: string;
  planId: string;
  readingId: string;
};
export type ReadingPlanBannerReadingUncompleteMutation$data = {
  readonly readingPlanReadingUncomplete: boolean | null | undefined;
};
export type ReadingPlanBannerReadingUncompleteMutation = {
  response: ReadingPlanBannerReadingUncompleteMutation$data;
  variables: ReadingPlanBannerReadingUncompleteMutation$variables;
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
      name: "ReadingPlanBannerReadingUncompleteMutation",
      selections: v3 /*: any*/,
      type: "Mutation",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: [v1 /*: any*/, v2 /*: any*/, v0 /*: any*/],
      kind: "Operation",
      name: "ReadingPlanBannerReadingUncompleteMutation",
      selections: v3 /*: any*/,
    },
    params: {
      id: "9d466ce14127d3c07f8abf67dd24fffb",
      metadata: {},
      name: "ReadingPlanBannerReadingUncompleteMutation",
      operationKind: "mutation",
      text: null,
    },
  };
})();

(node as any).hash = "0a891000bcef9783215fe53c3fd14f42";

export default node;
