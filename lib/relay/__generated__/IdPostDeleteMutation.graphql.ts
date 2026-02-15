/**
 * @generated SignedSource<<24ab8eba8aa0f4e5a36dc634ab167e83>>
 * @relayHash dbe5a9579680ccfc9377af1c42e29fbc
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID dbe5a9579680ccfc9377af1c42e29fbc

import { ConcreteRequest } from "relay-runtime";
export type IdPostDeleteMutation$variables = {
  connections: ReadonlyArray<string>;
  id: string;
};
export type IdPostDeleteMutation$data = {
  readonly bibleVersePostDelete: {
    readonly deletedIds: ReadonlyArray<string>;
  };
};
export type IdPostDeleteMutation = {
  response: IdPostDeleteMutation$data;
  variables: IdPostDeleteMutation$variables;
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
      name: "IdPostDeleteMutation",
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
      name: "IdPostDeleteMutation",
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
      id: "dbe5a9579680ccfc9377af1c42e29fbc",
      metadata: {},
      name: "IdPostDeleteMutation",
      operationKind: "mutation",
      text: null,
    },
  };
})();

(node as any).hash = "06d93c7336256380c61ae3034aee3da9";

export default node;
