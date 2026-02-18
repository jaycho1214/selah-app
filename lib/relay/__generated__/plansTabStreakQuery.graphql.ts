/**
 * @generated SignedSource<<3e1d8400d4c5e80e36547bec60f6367c>>
 * @relayHash 497efb3b20bc41e627bd3a904a91c003
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 497efb3b20bc41e627bd3a904a91c003

import { ConcreteRequest } from "relay-runtime";
export type plansTabStreakQuery$variables = Record<PropertyKey, never>;
export type plansTabStreakQuery$data = {
  readonly myReadingPlanStreak:
    | {
        readonly currentStreak: number | null | undefined;
        readonly longestStreak: number | null | undefined;
      }
    | null
    | undefined;
};
export type plansTabStreakQuery = {
  response: plansTabStreakQuery$data;
  variables: plansTabStreakQuery$variables;
};

const node: ConcreteRequest = (function () {
  var v0 = [
    {
      alias: null,
      args: null,
      concreteType: "ReadingPlanStreak",
      kind: "LinkedField",
      name: "myReadingPlanStreak",
      plural: false,
      selections: [
        {
          alias: null,
          args: null,
          kind: "ScalarField",
          name: "currentStreak",
          storageKey: null,
        },
        {
          alias: null,
          args: null,
          kind: "ScalarField",
          name: "longestStreak",
          storageKey: null,
        },
      ],
      storageKey: null,
    },
  ];
  return {
    fragment: {
      argumentDefinitions: [],
      kind: "Fragment",
      metadata: null,
      name: "plansTabStreakQuery",
      selections: v0 /*: any*/,
      type: "Query",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: [],
      kind: "Operation",
      name: "plansTabStreakQuery",
      selections: v0 /*: any*/,
    },
    params: {
      id: "497efb3b20bc41e627bd3a904a91c003",
      metadata: {},
      name: "plansTabStreakQuery",
      operationKind: "query",
      text: null,
    },
  };
})();

(node as any).hash = "df012844c3f487aaaee2d97eda359611";

export default node;
