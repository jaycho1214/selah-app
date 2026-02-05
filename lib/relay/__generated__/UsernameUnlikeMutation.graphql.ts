/**
 * @generated SignedSource<<e49702c257bbfd8f9edc4d450f76e319>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type UsernameUnlikeMutation$variables = {
  id: string;
};
export type UsernameUnlikeMutation$data = {
  readonly bibleVersePostUnlike: {
    readonly likedAt: any | null | undefined;
  };
};
export type UsernameUnlikeMutation = {
  response: UsernameUnlikeMutation$data;
  variables: UsernameUnlikeMutation$variables;
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
    "concreteType": "BibleVersePostUnlikePayload",
    "kind": "LinkedField",
    "name": "bibleVersePostUnlike",
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
    "name": "UsernameUnlikeMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "UsernameUnlikeMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "cb2af95b8ff28ccb542e99f3e2749a7f",
    "id": null,
    "metadata": {},
    "name": "UsernameUnlikeMutation",
    "operationKind": "mutation",
    "text": "mutation UsernameUnlikeMutation(\n  $id: ID!\n) {\n  bibleVersePostUnlike(id: $id) {\n    likedAt\n  }\n}\n"
  }
};
})();

(node as any).hash = "0dbb32451cb2ae956109c3346cf6c3a3";

export default node;
