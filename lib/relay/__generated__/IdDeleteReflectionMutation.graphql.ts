/**
 * @generated SignedSource<<3c0f58be4e225fafaa79282227d25c81>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
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

const node: ConcreteRequest = (function () {
  var v0 = {
      defaultValue: null,
      kind: "LocalArgument",
      name: "connections",
    },
    v1 = {
      defaultValue: null,
      kind: "LocalArgument",
      name: "id",
    },
    v2 = [
      {
        kind: "Variable",
        name: "id",
        variableName: "id",
      },
    ],
    v3 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "deletedIds",
      storageKey: null,
    };
  return {
    fragment: {
      argumentDefinitions: [v0 /*: any*/, v1 /*: any*/],
      kind: "Fragment",
      metadata: null,
      name: "IdDeleteReflectionMutation",
      selections: [
        {
          alias: null,
          args: v2 /*: any*/,
          concreteType: "BibleVersePostDeletePayload",
          kind: "LinkedField",
          name: "bibleVersePostDelete",
          plural: false,
          selections: [v3 /*: any*/],
          storageKey: null,
        },
      ],
      type: "Mutation",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: [v1 /*: any*/, v0 /*: any*/],
      kind: "Operation",
      name: "IdDeleteReflectionMutation",
      selections: [
        {
          alias: null,
          args: v2 /*: any*/,
          concreteType: "BibleVersePostDeletePayload",
          kind: "LinkedField",
          name: "bibleVersePostDelete",
          plural: false,
          selections: [
            v3 /*: any*/,
            {
              alias: null,
              args: null,
              filters: null,
              handle: "deleteEdge",
              key: "",
              kind: "ScalarHandle",
              name: "deletedIds",
              handleArgs: [
                {
                  kind: "Variable",
                  name: "connections",
                  variableName: "connections",
                },
              ],
            },
          ],
          storageKey: null,
        },
      ],
    },
    params: {
      cacheID: "b50db6a03f0f7d9d178a1c091a4be8c4",
      id: null,
      metadata: {},
      name: "IdDeleteReflectionMutation",
      operationKind: "mutation",
      text: "mutation IdDeleteReflectionMutation(\n  $id: ID!\n) {\n  bibleVersePostDelete(id: $id) {\n    deletedIds\n  }\n}\n",
    },
  };
})();

(node as any).hash = "e8bfc017db6e6fc77f63b543a372d269";

export default node;
