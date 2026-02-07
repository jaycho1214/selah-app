/**
 * @generated SignedSource<<f53512f226f6cdf850e109cc93e2c34c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type UserUpdateInput = {
  bio?: string | null | undefined;
  imageId?: string | null | undefined;
  name: string;
  username: string;
  website?: string | null | undefined;
};
export type userEditMutation$variables = {
  input: UserUpdateInput;
};
export type userEditMutation$data = {
  readonly userUpdate: {
    readonly user: {
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
    };
  };
};
export type userEditMutation = {
  response: userEditMutation$data;
  variables: userEditMutation$variables;
};

const node: ConcreteRequest = (function () {
  var v0 = [
      {
        defaultValue: null,
        kind: "LocalArgument",
        name: "input",
      },
    ],
    v1 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "id",
      storageKey: null,
    },
    v2 = [
      {
        alias: null,
        args: [
          {
            kind: "Variable",
            name: "input",
            variableName: "input",
          },
        ],
        concreteType: "UserUpdatePayload",
        kind: "LinkedField",
        name: "userUpdate",
        plural: false,
        selections: [
          {
            alias: null,
            args: null,
            concreteType: "User",
            kind: "LinkedField",
            name: "user",
            plural: false,
            selections: [
              v1 /*: any*/,
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
                  v1 /*: any*/,
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
        ],
        storageKey: null,
      },
    ];
  return {
    fragment: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Fragment",
      metadata: null,
      name: "userEditMutation",
      selections: v2 /*: any*/,
      type: "Mutation",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Operation",
      name: "userEditMutation",
      selections: v2 /*: any*/,
    },
    params: {
      cacheID: "ba207af9c36c37c2c77048210f324bcd",
      id: null,
      metadata: {},
      name: "userEditMutation",
      operationKind: "mutation",
      text: "mutation userEditMutation(\n  $input: UserUpdateInput!\n) {\n  userUpdate(input: $input) {\n    user {\n      id\n      name\n      username\n      bio\n      website\n      image {\n        id\n        url\n      }\n    }\n  }\n}\n",
    },
  };
})();

(node as any).hash = "12b6c8692172e73fe9f0409cd4dd46c5";

export default node;
