/**
 * @generated SignedSource<<a30384abb426e65c5e636f4926555c9b>>
 * @relayHash 58d90ee598e9566a615a278e40c96a19
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 58d90ee598e9566a615a278e40c96a19

import { ConcreteRequest } from "relay-runtime";
export type UserFilterInput = {
  username?: string | null | undefined;
};
export type reflectionComposerMentionQuery$variables = {
  filter: UserFilterInput;
};
export type reflectionComposerMentionQuery$data = {
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
export type reflectionComposerMentionQuery = {
  response: reflectionComposerMentionQuery$data;
  variables: reflectionComposerMentionQuery$variables;
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
      name: "reflectionComposerMentionQuery",
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
      name: "reflectionComposerMentionQuery",
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
      id: "58d90ee598e9566a615a278e40c96a19",
      metadata: {},
      name: "reflectionComposerMentionQuery",
      operationKind: "query",
      text: null,
    },
  };
})();

(node as any).hash = "2422cea5278f29a95ba58530ab6d327d";

export default node;
