/**
 * @generated SignedSource<<3f185bf7bf8d885ca2d2037156c46d91>>
 * @relayHash 7451b224d0d48dc548e67deb6495cc66
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 7451b224d0d48dc548e67deb6495cc66

import { ConcreteRequest } from 'relay-runtime';
export type userActionsSheetBlockMutation$variables = {
  userId: string;
};
export type userActionsSheetBlockMutation$data = {
  readonly userBlock: {
    readonly user: {
      readonly followedAt: any | null | undefined;
      readonly id: string;
      readonly isBlocked: boolean;
      readonly isBlockingMe: boolean;
    };
  };
};
export type userActionsSheetBlockMutation = {
  response: userActionsSheetBlockMutation$data;
  variables: userActionsSheetBlockMutation$variables;
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
    "concreteType": "UserBlockPayload",
    "kind": "LinkedField",
    "name": "userBlock",
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
    "name": "userActionsSheetBlockMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "userActionsSheetBlockMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": "7451b224d0d48dc548e67deb6495cc66",
    "metadata": {},
    "name": "userActionsSheetBlockMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "4cffb98e91edc284c48404043058141f";

export default node;
