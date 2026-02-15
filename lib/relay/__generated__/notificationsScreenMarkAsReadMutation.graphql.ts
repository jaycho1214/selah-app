/**
 * @generated SignedSource<<4f7d638c6fbc0f171037f1ada4b3d0ea>>
 * @relayHash d34d59af86660aadb2507ee19a2e0911
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID d34d59af86660aadb2507ee19a2e0911

import { ConcreteRequest } from "relay-runtime";
export type notificationsScreenMarkAsReadMutation$variables = Record<
  PropertyKey,
  never
>;
export type notificationsScreenMarkAsReadMutation$data = {
  readonly notificationMarkAsRead: boolean;
};
export type notificationsScreenMarkAsReadMutation = {
  response: notificationsScreenMarkAsReadMutation$data;
  variables: notificationsScreenMarkAsReadMutation$variables;
};

const node: ConcreteRequest = (function () {
  var v0 = [
    {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "notificationMarkAsRead",
      storageKey: null,
    },
  ];
  return {
    fragment: {
      argumentDefinitions: [],
      kind: "Fragment",
      metadata: null,
      name: "notificationsScreenMarkAsReadMutation",
      selections: v0 /*: any*/,
      type: "Mutation",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: [],
      kind: "Operation",
      name: "notificationsScreenMarkAsReadMutation",
      selections: v0 /*: any*/,
    },
    params: {
      id: "d34d59af86660aadb2507ee19a2e0911",
      metadata: {},
      name: "notificationsScreenMarkAsReadMutation",
      operationKind: "mutation",
      text: null,
    },
  };
})();

(node as any).hash = "1ef1ab5b07a4b3d1fe50bffc04d37a0b";

export default node;
