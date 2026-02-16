/**
 * @generated SignedSource<<160be6003f698e404ec41c96ead10095>>
 * @relayHash 754171327513b43709b0dbd33c4468c9
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 754171327513b43709b0dbd33c4468c9

import { ConcreteRequest } from 'relay-runtime';
export type settingsDeleteAccountMutation$variables = Record<PropertyKey, never>;
export type settingsDeleteAccountMutation$data = {
  readonly deleteMyAccount: {
    readonly success: boolean;
  };
};
export type settingsDeleteAccountMutation = {
  response: settingsDeleteAccountMutation$data;
  variables: settingsDeleteAccountMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "DeleteMyAccountPayload",
    "kind": "LinkedField",
    "name": "deleteMyAccount",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "success",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "settingsDeleteAccountMutation",
    "selections": (v0/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "settingsDeleteAccountMutation",
    "selections": (v0/*: any*/)
  },
  "params": {
    "id": "754171327513b43709b0dbd33c4468c9",
    "metadata": {},
    "name": "settingsDeleteAccountMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "df02be9e6420fc89823fb27c5c98bbb9";

export default node;
