/**
 * @generated SignedSource<<46ede74bdf39f3b2bc4b004e79778fa2>>
 * @relayHash 139b8048fbd3802e9532b45dddf808b6
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 139b8048fbd3802e9532b45dddf808b6

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
    "id": "139b8048fbd3802e9532b45dddf808b6",
    "metadata": {},
    "name": "IdPostUnlikeMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "d9bacf8e6dd1bfc435fb7e95f9545774";

export default node;
