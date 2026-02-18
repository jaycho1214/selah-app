/**
 * @generated SignedSource<<b7f67dbe86a47e3ce1d42954d60c5fee>>
 * @relayHash c7f2a50dc1201be225ca64b6d33adbee
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID c7f2a50dc1201be225ca64b6d33adbee

import { ConcreteRequest } from "relay-runtime";
export type notificationsUnregisterTokenMutation$variables = {
  token: string;
};
export type notificationsUnregisterTokenMutation$data = {
  readonly unregisterExpoPushToken: boolean;
};
export type notificationsUnregisterTokenMutation = {
  response: notificationsUnregisterTokenMutation$data;
  variables: notificationsUnregisterTokenMutation$variables;
};

const node: ConcreteRequest = (function () {
  var v0 = [
      {
        defaultValue: null,
        kind: "LocalArgument",
        name: "token",
      },
    ],
    v1 = [
      {
        alias: null,
        args: [
          {
            kind: "Variable",
            name: "token",
            variableName: "token",
          },
        ],
        kind: "ScalarField",
        name: "unregisterExpoPushToken",
        storageKey: null,
      },
    ];
  return {
    fragment: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Fragment",
      metadata: null,
      name: "notificationsUnregisterTokenMutation",
      selections: v1 /*: any*/,
      type: "Mutation",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Operation",
      name: "notificationsUnregisterTokenMutation",
      selections: v1 /*: any*/,
    },
    params: {
      id: "c7f2a50dc1201be225ca64b6d33adbee",
      metadata: {},
      name: "notificationsUnregisterTokenMutation",
      operationKind: "mutation",
      text: null,
    },
  };
})();

(node as any).hash = "4257f3e345c84f2309885d0a81c51294";

export default node;
