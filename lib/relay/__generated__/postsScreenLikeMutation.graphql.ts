/**
 * @generated SignedSource<<45d43d5fedf914fa25a118852dfecba5>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type postsScreenLikeMutation$variables = {
  id: string;
};
export type postsScreenLikeMutation$data = {
  readonly bibleVersePostLike: {
    readonly likedAt: any | null | undefined;
  };
};
export type postsScreenLikeMutation = {
  response: postsScreenLikeMutation$data;
  variables: postsScreenLikeMutation$variables;
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
    "name": "postsScreenLikeMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "postsScreenLikeMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "46c14c4029e0bbb08325747cee911153",
    "id": null,
    "metadata": {},
    "name": "postsScreenLikeMutation",
    "operationKind": "mutation",
    "text": "mutation postsScreenLikeMutation(\n  $id: ID!\n) {\n  bibleVersePostLike(id: $id) {\n    likedAt\n  }\n}\n"
  }
};
})();

(node as any).hash = "8b24748acf9316217e573736159c1257";

export default node;
