/**
 * @generated SignedSource<<81c4e5f68251c3f2b53a154501bf5a67>>
 * @relayHash e95c73cda7f6457236af96419b138f80
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID e95c73cda7f6457236af96419b138f80

import { ConcreteRequest } from "relay-runtime";
export type ReadingPlanJoinButtonJoinMutation$variables = {
  planId: string;
};
export type ReadingPlanJoinButtonJoinMutation$data = {
  readonly readingPlanJoin: {
    readonly completedAt: any | null | undefined;
    readonly completedDaysCount: number | null | undefined;
    readonly hideProgress: boolean | null | undefined;
    readonly id: string;
    readonly joinedAt: any | null | undefined;
    readonly progress:
      | ReadonlyArray<{
          readonly completedAt: any | null | undefined;
          readonly dayId: string | null | undefined;
        }>
      | null
      | undefined;
    readonly readingProgress:
      | ReadonlyArray<{
          readonly completedAt: any | null | undefined;
          readonly readingId: string | null | undefined;
        }>
      | null
      | undefined;
    readonly user: {
      readonly id: string;
    };
  };
};
export type ReadingPlanJoinButtonJoinMutation = {
  response: ReadingPlanJoinButtonJoinMutation$data;
  variables: ReadingPlanJoinButtonJoinMutation$variables;
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
        kind: "Variable",
        name: "planId",
        variableName: "planId",
      },
    ],
    v2 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "id",
      storageKey: null,
    },
    v3 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "completedDaysCount",
      storageKey: null,
    },
    v4 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "hideProgress",
      storageKey: null,
    },
    v5 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "completedAt",
      storageKey: null,
    },
    v6 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "joinedAt",
      storageKey: null,
    },
    v7 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "dayId",
      storageKey: null,
    },
    v8 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "readingId",
      storageKey: null,
    },
    v9 = {
      alias: null,
      args: null,
      concreteType: "User",
      kind: "LinkedField",
      name: "user",
      plural: false,
      selections: [v2 /*: any*/],
      storageKey: null,
    };
  return {
    fragment: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Fragment",
      metadata: null,
      name: "ReadingPlanJoinButtonJoinMutation",
      selections: [
        {
          alias: null,
          args: v1 /*: any*/,
          concreteType: "ReadingPlanParticipant",
          kind: "LinkedField",
          name: "readingPlanJoin",
          plural: false,
          selections: [
            v2 /*: any*/,
            v3 /*: any*/,
            v4 /*: any*/,
            v5 /*: any*/,
            v6 /*: any*/,
            {
              alias: null,
              args: null,
              concreteType: "ReadingPlanProgress",
              kind: "LinkedField",
              name: "progress",
              plural: true,
              selections: [v7 /*: any*/, v5 /*: any*/],
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              concreteType: "ReadingPlanReadingProgress",
              kind: "LinkedField",
              name: "readingProgress",
              plural: true,
              selections: [v8 /*: any*/, v5 /*: any*/],
              storageKey: null,
            },
            v9 /*: any*/,
          ],
          storageKey: null,
        },
      ],
      type: "Mutation",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Operation",
      name: "ReadingPlanJoinButtonJoinMutation",
      selections: [
        {
          alias: null,
          args: v1 /*: any*/,
          concreteType: "ReadingPlanParticipant",
          kind: "LinkedField",
          name: "readingPlanJoin",
          plural: false,
          selections: [
            v2 /*: any*/,
            v3 /*: any*/,
            v4 /*: any*/,
            v5 /*: any*/,
            v6 /*: any*/,
            {
              alias: null,
              args: null,
              concreteType: "ReadingPlanProgress",
              kind: "LinkedField",
              name: "progress",
              plural: true,
              selections: [v7 /*: any*/, v5 /*: any*/, v2 /*: any*/],
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              concreteType: "ReadingPlanReadingProgress",
              kind: "LinkedField",
              name: "readingProgress",
              plural: true,
              selections: [v8 /*: any*/, v5 /*: any*/, v2 /*: any*/],
              storageKey: null,
            },
            v9 /*: any*/,
          ],
          storageKey: null,
        },
      ],
    },
    params: {
      id: "e95c73cda7f6457236af96419b138f80",
      metadata: {},
      name: "ReadingPlanJoinButtonJoinMutation",
      operationKind: "mutation",
      text: null,
    },
  };
})();

(node as any).hash = "fe7ea4fca78789ae8c8fdb11dd90ef34";

export default node;
