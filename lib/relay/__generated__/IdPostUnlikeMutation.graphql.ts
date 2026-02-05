/**
 * @generated SignedSource<<622f77bb85168fea3eb82337142b92f5>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type IdPostUnlikeMutation$variables = {
  id: string;
};
export type IdPostUnlikeMutation$data = {
  readonly bibleVersePostUnlike: {
    readonly likedAt: any | null | undefined;
  };
};
export type IdPostUnlikeMutation = {
  response: IdPostUnlikeMutation$data;
  variables: IdPostUnlikeMutation$variables;
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
    "name": "IdPostUnlikeMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "IdPostUnlikeMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "139b8048fbd3802e9532b45dddf808b6",
    "id": null,
    "metadata": {},
    "name": "IdPostUnlikeMutation",
    "operationKind": "mutation",
    "text": "mutation IdPostUnlikeMutation(\n  $id: ID!\n) {\n  bibleVersePostUnlike(id: $id) {\n    likedAt\n  }\n}\n"
  }
};
})();

(node as any).hash = "d9bacf8e6dd1bfc435fb7e95f9545774";

export default node;
