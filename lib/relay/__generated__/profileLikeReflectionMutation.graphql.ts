/**
 * @generated SignedSource<<32c74724117076a15996b2b8c4f38f5e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type profileLikeReflectionMutation$variables = {
  id: string;
};
export type profileLikeReflectionMutation$data = {
  readonly bibleVersePostLike: {
    readonly likedAt: any | null | undefined;
  };
};
export type profileLikeReflectionMutation = {
  response: profileLikeReflectionMutation$data;
  variables: profileLikeReflectionMutation$variables;
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
    "name": "profileLikeReflectionMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "profileLikeReflectionMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "7aee5b679671eeeedbb7ef3e945608f0",
    "id": null,
    "metadata": {},
    "name": "profileLikeReflectionMutation",
    "operationKind": "mutation",
    "text": "mutation profileLikeReflectionMutation(\n  $id: ID!\n) {\n  bibleVersePostLike(id: $id) {\n    likedAt\n  }\n}\n"
  }
};
})();

(node as any).hash = "1e1519e230612df7166a308d13a69a39";

export default node;
