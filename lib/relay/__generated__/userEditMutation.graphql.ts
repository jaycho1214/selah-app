/**
 * @generated SignedSource<<7d9635e0b5f86ce3c02db96e9c9284f2>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type UserUpdateInput = {
  bio?: string | null | undefined;
  imageId?: string | null | undefined;
  name: string;
  username: string;
  website?: string | null | undefined;
};
export type userEditMutation$variables = {
  input: UserUpdateInput;
};
export type userEditMutation$data = {
  readonly userUpdate: {
    readonly user: {
      readonly bio: string | null | undefined;
      readonly id: string;
      readonly image: {
        readonly id: string;
        readonly url: string | null | undefined;
      } | null | undefined;
      readonly name: string | null | undefined;
    };
  };
};
export type userEditMutation = {
  response: userEditMutation$data;
  variables: userEditMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "UserUpdatePayload",
    "kind": "LinkedField",
    "name": "userUpdate",
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
          (v1/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "name",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "bio",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Asset",
            "kind": "LinkedField",
            "name": "image",
            "plural": false,
            "selections": [
              (v1/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "url",
                "storageKey": null
              }
            ],
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
    "name": "userEditMutation",
    "selections": (v2/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "userEditMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "b74f8f8779ea89f743ac36f7ed6770f9",
    "id": null,
    "metadata": {},
    "name": "userEditMutation",
    "operationKind": "mutation",
    "text": "mutation userEditMutation(\n  $input: UserUpdateInput!\n) {\n  userUpdate(input: $input) {\n    user {\n      id\n      name\n      bio\n      image {\n        id\n        url\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "ca1153b3652f93637cfd9393c77cf968";

export default node;
