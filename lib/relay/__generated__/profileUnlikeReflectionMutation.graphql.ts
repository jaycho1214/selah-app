/**
 * @generated SignedSource<<183888439fe7f2e5a1e7c1fa671f1ef7>>
 * @relayHash 97cc30212bbbce8c2fe28ad674dabaaf
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 97cc30212bbbce8c2fe28ad674dabaaf

import { ConcreteRequest } from "relay-runtime";
export type profileUnlikeReflectionMutation$variables = {
  id: string;
};
export type profileUnlikeReflectionMutation$data = {
  readonly bibleVersePostUnlike: {
    readonly likedAt: any | null | undefined;
  };
};
export type profileUnlikeReflectionMutation = {
  response: profileUnlikeReflectionMutation$data;
  variables: profileUnlikeReflectionMutation$variables;
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
      name: "profileUnlikeReflectionMutation",
      selections: v1 /*: any*/,
      type: "Mutation",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Operation",
      name: "profileUnlikeReflectionMutation",
      selections: v1 /*: any*/,
    },
    params: {
      id: "97cc30212bbbce8c2fe28ad674dabaaf",
      metadata: {},
      name: "profileUnlikeReflectionMutation",
      operationKind: "mutation",
      text: null,
    },
  };
})();

(node as any).hash = "1ec40b610aece019ec7170d9f468c510";

export default node;
