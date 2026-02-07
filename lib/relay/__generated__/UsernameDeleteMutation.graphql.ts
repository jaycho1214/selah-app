/**
 * @generated SignedSource<<26bb6b69f8a04ae9bba69d6ddbb15578>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type UsernameDeleteMutation$variables = {
  connections: ReadonlyArray<string>;
  id: string;
};
export type UsernameDeleteMutation$data = {
  readonly bibleVersePostDelete: {
    readonly deletedIds: ReadonlyArray<string>;
  };
};
export type UsernameDeleteMutation = {
  response: UsernameDeleteMutation$data;
  variables: UsernameDeleteMutation$variables;
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
      name: "UsernameDeleteMutation",
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
      name: "UsernameDeleteMutation",
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
      cacheID: "24e1b97f761336774e58ba1e13dbf49d",
      id: null,
      metadata: {},
      name: "UsernameDeleteMutation",
      operationKind: "mutation",
      text: "mutation UsernameDeleteMutation(\n  $id: ID!\n) {\n  bibleVersePostDelete(id: $id) {\n    deletedIds\n  }\n}\n",
    },
  };
})();

(node as any).hash = "3bfe63b3592cea5771d19118874433ad";

export default node;
