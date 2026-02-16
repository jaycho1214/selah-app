/**
 * @generated SignedSource<<03043e8a914c51b29bb2b6b0dae259b8>>
 * @relayHash 45773018a9284e13921d01ab1b1196df
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 45773018a9284e13921d01ab1b1196df

import { ConcreteRequest } from 'relay-runtime';
export type postsScreenUnlikeMutation$variables = {
  id: string;
};
export type postsScreenUnlikeMutation$data = {
  readonly bibleVersePostUnlike: {
    readonly likedAt: any | null | undefined;
  };
};
export type postsScreenUnlikeMutation = {
  response: postsScreenUnlikeMutation$data;
  variables: postsScreenUnlikeMutation$variables;
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
    "name": "postsScreenUnlikeMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "postsScreenUnlikeMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": "45773018a9284e13921d01ab1b1196df",
    "metadata": {},
    "name": "postsScreenUnlikeMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "cfc90d6a3c9f2d149599a4ba08543039";

export default node;
