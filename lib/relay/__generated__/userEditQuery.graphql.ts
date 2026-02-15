/**
 * @generated SignedSource<<829b8864bcc08ed30d2b60c4c0d6f7de>>
 * @relayHash 8d583edb52bba3bc8e8ad9e39424ebdc
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 8d583edb52bba3bc8e8ad9e39424ebdc

import { ConcreteRequest } from "relay-runtime";
export type userEditQuery$variables = Record<PropertyKey, never>;
export type userEditQuery$data = {
  readonly user:
    | {
        readonly bio: string | null | undefined;
        readonly id: string;
        readonly image:
          | {
              readonly id: string;
              readonly url: string | null | undefined;
            }
          | null
          | undefined;
        readonly name: string | null | undefined;
        readonly username: string | null | undefined;
        readonly website: string | null | undefined;
      }
    | null
    | undefined;
};
export type userEditQuery = {
  response: userEditQuery$data;
  variables: userEditQuery$variables;
};

const node: ConcreteRequest = (function () {
  var v0 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "id",
      storageKey: null,
    },
    v1 = [
      {
        alias: null,
        args: null,
        concreteType: "User",
        kind: "LinkedField",
        name: "user",
        plural: false,
        selections: [
          v0 /*: any*/,
          {
            alias: null,
            args: null,
            kind: "ScalarField",
            name: "name",
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            kind: "ScalarField",
            name: "username",
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            kind: "ScalarField",
            name: "bio",
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            kind: "ScalarField",
            name: "website",
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            concreteType: "Asset",
            kind: "LinkedField",
            name: "image",
            plural: false,
            selections: [
              v0 /*: any*/,
              {
                alias: null,
                args: null,
                kind: "ScalarField",
                name: "url",
                storageKey: null,
              },
            ],
            storageKey: null,
          },
        ],
        storageKey: null,
      },
    ];
  return {
    fragment: {
      argumentDefinitions: [],
      kind: "Fragment",
      metadata: null,
      name: "userEditQuery",
      selections: v1 /*: any*/,
      type: "Query",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: [],
      kind: "Operation",
      name: "userEditQuery",
      selections: v1 /*: any*/,
    },
    params: {
      id: "8d583edb52bba3bc8e8ad9e39424ebdc",
      metadata: {},
      name: "userEditQuery",
      operationKind: "query",
      text: null,
    },
  };
})();

(node as any).hash = "e706f8dbb6908484c3f4ecd101dd2f49";

export default node;
