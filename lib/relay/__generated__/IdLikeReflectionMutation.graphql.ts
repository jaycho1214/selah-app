/**
 * @generated SignedSource<<628904ec42f76f8b8050e0f327f4cbd7>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

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
    "cacheID": "fd713dec9da8f960f0168a58ea244a33",
    "id": null,
    "metadata": {},
    "name": "IdLikeReflectionMutation",
    "operationKind": "mutation",
    "text": "mutation IdLikeReflectionMutation(\n  $id: ID!\n) {\n  bibleVersePostLike(id: $id) {\n    likedAt\n  }\n}\n"
  }
};
})();

(node as any).hash = "4512ab51d69ee10609abd8add75adcb4";

export default node;
