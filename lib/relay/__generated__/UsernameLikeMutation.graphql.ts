/**
 * @generated SignedSource<<de1f447437088ff48d1de2b0351e14e9>>
 * @relayHash 3759af7ab2cb0b6bdebe1fa3188a65bd
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 3759af7ab2cb0b6bdebe1fa3188a65bd

import { ConcreteRequest } from 'relay-runtime';
export type UsernameLikeMutation$variables = {
  id: string;
};
export type UsernameLikeMutation$data = {
  readonly bibleVersePostLike: {
    readonly likedAt: any | null | undefined;
  };
};
export type UsernameLikeMutation = {
  response: UsernameLikeMutation$data;
  variables: UsernameLikeMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "id"
      }
    ],
    "concreteType": "BibleVersePostLikePayload",
    "kind": "LinkedField",
    "name": "bibleVersePostLike",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "likedAt",
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
    "name": "UsernameLikeMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "UsernameLikeMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": "3759af7ab2cb0b6bdebe1fa3188a65bd",
    "metadata": {},
    "name": "UsernameLikeMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "be46925e8fe20ba5e5ebf25cb9de8f3b";

export default node;
