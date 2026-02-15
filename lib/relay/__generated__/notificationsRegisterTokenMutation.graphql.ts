/**
 * @generated SignedSource<<74052b25cc7d8866dcce6c6d5b868ced>>
 * @relayHash 16f23e32092d176352c1fbfedeb18e05
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 16f23e32092d176352c1fbfedeb18e05

import { ConcreteRequest } from 'relay-runtime';
export type notificationsRegisterTokenMutation$variables = {
  token: string;
};
export type notificationsRegisterTokenMutation$data = {
  readonly registerExpoPushToken: boolean;
};
export type notificationsRegisterTokenMutation = {
  response: notificationsRegisterTokenMutation$data;
  variables: notificationsRegisterTokenMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "token"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "token",
        "variableName": "token"
      }
    ],
    "kind": "ScalarField",
    "name": "registerExpoPushToken",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "notificationsRegisterTokenMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "notificationsRegisterTokenMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": "16f23e32092d176352c1fbfedeb18e05",
    "metadata": {},
    "name": "notificationsRegisterTokenMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "998ca824e50f4ac3829180b01dba3312";

export default node;
