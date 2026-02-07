/**
 * @generated SignedSource<<d73cbae0995652794650f91ec2c146b9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type UserFilterInput = {
  username?: string | null | undefined;
};
export type searchScreenUsersQuery$variables = {
  filter: UserFilterInput;
  first?: number | null | undefined;
};
export type searchScreenUsersQuery$data = {
  readonly users:
    | {
        readonly edges:
          | ReadonlyArray<
              | {
                  readonly node:
                    | {
                        readonly followerCount: number;
                        readonly id: string;
                        readonly image:
                          | {
                              readonly url: string | null | undefined;
                            }
                          | null
                          | undefined;
                        readonly name: string | null | undefined;
                        readonly username: string | null | undefined;
                      }
                    | null
                    | undefined;
                }
              | null
              | undefined
            >
          | null
          | undefined;
      }
    | null
    | undefined;
};
export type searchScreenUsersQuery = {
  response: searchScreenUsersQuery$data;
  variables: searchScreenUsersQuery$variables;
};

const node: ConcreteRequest = (function () {
  var v0 = [
      {
        defaultValue: null,
        kind: "LocalArgument",
        name: "filter",
      },
      {
        defaultValue: null,
        kind: "LocalArgument",
        name: "first",
      },
    ],
    v1 = [
      {
        kind: "Variable",
        name: "filter",
        variableName: "filter",
      },
      {
        kind: "Variable",
        name: "first",
        variableName: "first",
      },
    ],
    v2 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "id",
      storageKey: null,
    },
    v3 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "username",
      storageKey: null,
    },
    v4 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "name",
      storageKey: null,
    },
    v5 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "url",
      storageKey: null,
    },
    v6 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "followerCount",
      storageKey: null,
    };
  return {
    fragment: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Fragment",
      metadata: null,
      name: "searchScreenUsersQuery",
      selections: [
        {
          alias: null,
          args: v1 /*: any*/,
          concreteType: "QueryUsersConnection",
          kind: "LinkedField",
          name: "users",
          plural: false,
          selections: [
            {
              alias: null,
              args: null,
              concreteType: "QueryUsersConnectionEdge",
              kind: "LinkedField",
              name: "edges",
              plural: true,
              selections: [
                {
                  alias: null,
                  args: null,
                  concreteType: "User",
                  kind: "LinkedField",
                  name: "node",
                  plural: false,
                  selections: [
                    v2 /*: any*/,
                    v3 /*: any*/,
                    v4 /*: any*/,
                    {
                      alias: null,
                      args: null,
                      concreteType: "Asset",
                      kind: "LinkedField",
                      name: "image",
                      plural: false,
                      selections: [v5 /*: any*/],
                      storageKey: null,
                    },
                    v6 /*: any*/,
                  ],
                  storageKey: null,
                },
              ],
              storageKey: null,
            },
          ],
          storageKey: null,
        },
      ],
      type: "Query",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Operation",
      name: "searchScreenUsersQuery",
      selections: [
        {
          alias: null,
          args: v1 /*: any*/,
          concreteType: "QueryUsersConnection",
          kind: "LinkedField",
          name: "users",
          plural: false,
          selections: [
            {
              alias: null,
              args: null,
              concreteType: "QueryUsersConnectionEdge",
              kind: "LinkedField",
              name: "edges",
              plural: true,
              selections: [
                {
                  alias: null,
                  args: null,
                  concreteType: "User",
                  kind: "LinkedField",
                  name: "node",
                  plural: false,
                  selections: [
                    v2 /*: any*/,
                    v3 /*: any*/,
                    v4 /*: any*/,
                    {
                      alias: null,
                      args: null,
                      concreteType: "Asset",
                      kind: "LinkedField",
                      name: "image",
                      plural: false,
                      selections: [v5 /*: any*/, v2 /*: any*/],
                      storageKey: null,
                    },
                    v6 /*: any*/,
                  ],
                  storageKey: null,
                },
              ],
              storageKey: null,
            },
          ],
          storageKey: null,
        },
      ],
    },
    params: {
      cacheID: "767b846a580becb53d4e6721617ed7b1",
      id: null,
      metadata: {},
      name: "searchScreenUsersQuery",
      operationKind: "query",
      text: "query searchScreenUsersQuery(\n  $filter: UserFilterInput!\n  $first: Int\n) {\n  users(filter: $filter, first: $first) {\n    edges {\n      node {\n        id\n        username\n        name\n        image {\n          url\n          id\n        }\n        followerCount\n      }\n    }\n  }\n}\n",
    },
  };
})();

(node as any).hash = "8174384f81ba27077707544dce454b5a";

export default node;
