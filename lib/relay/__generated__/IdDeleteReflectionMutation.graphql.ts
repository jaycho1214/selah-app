/**
 * @generated SignedSource<<242dc06ebfc5e9e058587e77e123cbfb>>
 * @relayHash b50db6a03f0f7d9d178a1c091a4be8c4
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID b50db6a03f0f7d9d178a1c091a4be8c4

import { ConcreteRequest } from 'relay-runtime';
export type IdDeleteReflectionMutation$variables = {
  connections: ReadonlyArray<string>;
  id: string;
};
export type IdDeleteReflectionMutation$data = {
  readonly bibleVersePostDelete: {
    readonly deletedIds: ReadonlyArray<string>;
  };
};
export type IdDeleteReflectionMutation = {
  response: IdDeleteReflectionMutation$data;
  variables: IdDeleteReflectionMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "connections"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "id"
},
v2 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "deletedIds",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "IdDeleteReflectionMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "BibleVersePostDeletePayload",
        "kind": "LinkedField",
        "name": "bibleVersePostDelete",
        "plural": false,
        "selections": [
          (v3/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "IdDeleteReflectionMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "BibleVersePostDeletePayload",
        "kind": "LinkedField",
        "name": "bibleVersePostDelete",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "filters": null,
            "handle": "deleteEdge",
            "key": "",
            "kind": "ScalarHandle",
            "name": "deletedIds",
            "handleArgs": [
              {
                "kind": "Variable",
                "name": "connections",
                "variableName": "connections"
              }
            ]
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "b50db6a03f0f7d9d178a1c091a4be8c4",
    "metadata": {},
    "name": "IdDeleteReflectionMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "e8bfc017db6e6fc77f63b543a372d269";

export default node;
