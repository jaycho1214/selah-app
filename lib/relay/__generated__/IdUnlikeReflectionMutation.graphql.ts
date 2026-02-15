/**
 * @generated SignedSource<<0fcfa22bffe9cf769fc1820e8bb0cb9c>>
 * @relayHash 13d86c209f7315b62ae3c3a33b80a9d2
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 13d86c209f7315b62ae3c3a33b80a9d2

import { ConcreteRequest } from "relay-runtime";
export type IdUnlikeReflectionMutation$variables = {
  id: string;
};
export type IdUnlikeReflectionMutation$data = {
  readonly bibleVersePostUnlike: {
    readonly likedAt: any | null | undefined;
  };
};
export type IdUnlikeReflectionMutation = {
  response: IdUnlikeReflectionMutation$data;
  variables: IdUnlikeReflectionMutation$variables;
};

const node: ConcreteRequest = (function () {
  var v0 = [
      {
        defaultValue: null,
        kind: "LocalArgument",
        name: "id",
      },
    ],
    v1 = [
      {
        alias: null,
        args: [
          {
            kind: "Variable",
            name: "id",
            variableName: "id",
          },
        ],
        concreteType: "BibleVersePostUnlikePayload",
        kind: "LinkedField",
        name: "bibleVersePostUnlike",
        plural: false,
        selections: [
          {
            alias: null,
            args: null,
            kind: "ScalarField",
            name: "likedAt",
            storageKey: null,
          },
        ],
        storageKey: null,
      },
    ];
  return {
    fragment: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Fragment",
      metadata: null,
      name: "IdUnlikeReflectionMutation",
      selections: v1 /*: any*/,
      type: "Mutation",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Operation",
      name: "IdUnlikeReflectionMutation",
      selections: v1 /*: any*/,
    },
    params: {
      id: "13d86c209f7315b62ae3c3a33b80a9d2",
      metadata: {},
      name: "IdUnlikeReflectionMutation",
      operationKind: "mutation",
      text: null,
    },
  };
})();

(node as any).hash = "21598dbb3f3fa4bbb8e5338a19e1e552";

export default node;
