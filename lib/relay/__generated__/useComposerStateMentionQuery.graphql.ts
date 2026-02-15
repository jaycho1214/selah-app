/**
 * @generated SignedSource<<0c1e380367ccd50be826e3e745dc7002>>
 * @relayHash 89729387be946909cecf1ab94dd3449b
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 89729387be946909cecf1ab94dd3449b

import { ConcreteRequest } from "relay-runtime";
export type UserFilterInput = {
  username?: string | null | undefined;
};
export type useComposerStateMentionQuery$variables = {
  filter: UserFilterInput;
};
export type useComposerStateMentionQuery$data = {
  readonly users:
    | {
        readonly edges:
          | ReadonlyArray<
              | {
                  readonly node:
                    | {
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
export type useComposerStateMentionQuery = {
  response: useComposerStateMentionQuery$data;
  variables: useComposerStateMentionQuery$variables;
};

const node: ConcreteRequest = (function () {
  var v0 = [
      {
        defaultValue: null,
        kind: "LocalArgument",
        name: "filter",
      },
    ],
    v1 = [
      {
        kind: "Variable",
        name: "filter",
        variableName: "filter",
      },
      {
        kind: "Literal",
        name: "first",
        value: 5,
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
    };
  return {
    fragment: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Fragment",
      metadata: null,
      name: "useComposerStateMentionQuery",
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
      name: "useComposerStateMentionQuery",
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
      id: "89729387be946909cecf1ab94dd3449b",
      metadata: {},
      name: "useComposerStateMentionQuery",
      operationKind: "query",
      text: null,
    },
  };
})();

(node as any).hash = "04263a144c17fa9f362dee1e69dfaaf9";

export default node;
