/**
 * @generated SignedSource<<acf848574b8c233909c6a6bda9544001>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type postsScreenDeleteMutation$variables = {
  connections: ReadonlyArray<string>;
  id: string;
};
export type postsScreenDeleteMutation$data = {
  readonly bibleVersePostDelete: {
    readonly deletedIds: ReadonlyArray<string>;
  };
};
export type postsScreenDeleteMutation = {
  response: postsScreenDeleteMutation$data;
  variables: postsScreenDeleteMutation$variables;
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
    "name": "postsScreenDeleteMutation",
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
    "name": "postsScreenDeleteMutation",
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
    "cacheID": "fddae9e1583d0c5edc07556095d968b5",
    "id": null,
    "metadata": {},
    "name": "postsScreenDeleteMutation",
    "operationKind": "mutation",
    "text": "mutation postsScreenDeleteMutation(\n  $id: ID!\n) {\n  bibleVersePostDelete(id: $id) {\n    deletedIds\n  }\n}\n"
  }
};
})();

(node as any).hash = "f40fced85e48f2b90fd049bf23a2f2dc";

export default node;
