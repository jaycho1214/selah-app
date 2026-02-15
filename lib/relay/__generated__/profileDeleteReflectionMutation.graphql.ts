/**
 * @generated SignedSource<<57839c3224c5a631634557494889ed6e>>
 * @relayHash 9690804b512eec366b6d3ad74d33b9be
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 9690804b512eec366b6d3ad74d33b9be

import { ConcreteRequest } from "relay-runtime";
export type profileDeleteReflectionMutation$variables = {
  connections: ReadonlyArray<string>;
  id: string;
};
export type profileDeleteReflectionMutation$data = {
  readonly bibleVersePostDelete: {
    readonly deletedIds: ReadonlyArray<string>;
  };
};
export type profileDeleteReflectionMutation = {
  response: profileDeleteReflectionMutation$data;
  variables: profileDeleteReflectionMutation$variables;
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
      name: "profileDeleteReflectionMutation",
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
      name: "profileDeleteReflectionMutation",
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
      id: "9690804b512eec366b6d3ad74d33b9be",
      metadata: {},
      name: "profileDeleteReflectionMutation",
      operationKind: "mutation",
      text: null,
    },
  };
})();

(node as any).hash = "74da3766b7eb1ef38dd750ea7cbbba85";

export default node;
