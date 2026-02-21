/**
 * @generated SignedSource<<4e232f7f571e052877d66b86d4e0ee9d>>
 * @relayHash fd713dec9da8f960f0168a58ea244a33
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID fd713dec9da8f960f0168a58ea244a33

import { ConcreteRequest } from 'relay-runtime';
export type IdLikeReflectionMutation$variables = {
  id: string;
};
export type IdLikeReflectionMutation$data = {
  readonly bibleVersePostLike: {
    readonly likedAt: any | null | undefined;
  };
};
export type IdLikeReflectionMutation = {
  response: IdLikeReflectionMutation$data;
  variables: IdLikeReflectionMutation$variables;
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
    "name": "IdLikeReflectionMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "IdLikeReflectionMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": "fd713dec9da8f960f0168a58ea244a33",
    "metadata": {},
    "name": "IdLikeReflectionMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "4512ab51d69ee10609abd8add75adcb4";

export default node;
