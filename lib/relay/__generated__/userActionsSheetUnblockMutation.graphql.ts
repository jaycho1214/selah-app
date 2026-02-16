/**
 * @generated SignedSource<<327e188c1cef90533fd8b172a9035468>>
 * @relayHash 17e51f4c91d854b44167fcb5291fc196
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 17e51f4c91d854b44167fcb5291fc196

import { ConcreteRequest } from 'relay-runtime';
export type userActionsSheetUnblockMutation$variables = {
  userId: string;
};
export type userActionsSheetUnblockMutation$data = {
  readonly userUnblock: {
    readonly user: {
      readonly followedAt: any | null | undefined;
      readonly id: string;
      readonly isBlocked: boolean;
      readonly isBlockingMe: boolean;
    };
  };
};
export type userActionsSheetUnblockMutation = {
  response: userActionsSheetUnblockMutation$data;
  variables: userActionsSheetUnblockMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "userId"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "userId",
        "variableName": "userId"
      }
    ],
    "concreteType": "UserUnblockPayload",
    "kind": "LinkedField",
    "name": "userUnblock",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "User",
        "kind": "LinkedField",
        "name": "user",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "isBlocked",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "isBlockingMe",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "followedAt",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "userActionsSheetUnblockMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "userActionsSheetUnblockMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": "17e51f4c91d854b44167fcb5291fc196",
    "metadata": {},
    "name": "userActionsSheetUnblockMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "15abc40315dc906ac9866662df6149b5";

export default node;
