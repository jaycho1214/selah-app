/**
 * @generated SignedSource<<a14a5e928852d2374a8a4a065720576d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

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
      cacheID: "d34d59af86660aadb2507ee19a2e0911",
      id: null,
      metadata: {},
      name: "notificationsScreenMarkAsReadMutation",
      operationKind: "mutation",
      text: "mutation notificationsScreenMarkAsReadMutation {\n  notificationMarkAsRead\n}\n",
    },
  };
})();

(node as any).hash = "1ef1ab5b07a4b3d1fe50bffc04d37a0b";

export default node;
