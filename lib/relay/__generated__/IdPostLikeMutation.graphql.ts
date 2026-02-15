/**
 * @generated SignedSource<<5a7e1cb03df2ef120318fba6e38c44f6>>
 * @relayHash 7ed2abcc435f1da89ff279bf31ad56dc
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 7ed2abcc435f1da89ff279bf31ad56dc

import { ConcreteRequest } from 'relay-runtime';
export type IdPostLikeMutation$variables = {
  id: string;
};
export type IdPostLikeMutation$data = {
  readonly bibleVersePostLike: {
    readonly likedAt: any | null | undefined;
  };
};
export type IdPostLikeMutation = {
  response: IdPostLikeMutation$data;
  variables: IdPostLikeMutation$variables;
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
    "name": "IdPostLikeMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "IdPostLikeMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": "7ed2abcc435f1da89ff279bf31ad56dc",
    "metadata": {},
    "name": "IdPostLikeMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "1ae86b55fb00128d422e19c68d965af8";

export default node;
