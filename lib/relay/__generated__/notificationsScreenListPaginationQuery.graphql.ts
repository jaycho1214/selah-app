/**
 * @generated SignedSource<<8f0a6af6e38c7b6b8acde64cad2b1fc1>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type notificationsScreenListPaginationQuery$variables = {
  count?: number | null | undefined;
  cursor?: string | null | undefined;
};
export type notificationsScreenListPaginationQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"notificationsScreenListFragment">;
};
export type notificationsScreenListPaginationQuery = {
  response: notificationsScreenListPaginationQuery$data;
  variables: notificationsScreenListPaginationQuery$variables;
};

const node: ConcreteRequest = (function () {
  var v0 = [
      {
        defaultValue: 20,
        kind: "LocalArgument",
        name: "count",
      },
      {
        defaultValue: null,
        kind: "LocalArgument",
        name: "cursor",
      },
    ],
    v1 = [
      {
        kind: "Variable",
        name: "after",
        variableName: "cursor",
      },
      {
        kind: "Variable",
        name: "first",
        variableName: "count",
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
      concreteType: "BibleVerse",
      kind: "LinkedField",
      name: "verse",
      plural: false,
      selections: [
        v2 /*: any*/,
        {
          alias: null,
          args: null,
          kind: "ScalarField",
          name: "book",
          storageKey: null,
        },
        {
          alias: null,
          args: null,
          kind: "ScalarField",
          name: "chapter",
          storageKey: null,
        },
        {
          alias: null,
          args: null,
          kind: "ScalarField",
          name: "verse",
          storageKey: null,
        },
        {
          alias: null,
          args: null,
          kind: "ScalarField",
          name: "translation",
          storageKey: null,
        },
      ],
      storageKey: null,
    };
  return {
    fragment: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Fragment",
      metadata: null,
      name: "notificationsScreenListPaginationQuery",
      selections: [
        {
          args: [
            {
              kind: "Variable",
              name: "count",
              variableName: "count",
            },
            {
              kind: "Variable",
              name: "cursor",
              variableName: "cursor",
            },
          ],
          kind: "FragmentSpread",
          name: "notificationsScreenListFragment",
        },
      ],
      type: "Query",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Operation",
      name: "notificationsScreenListPaginationQuery",
      selections: [
        {
          alias: null,
          args: v1 /*: any*/,
          concreteType: "NotificationConnection",
          kind: "LinkedField",
          name: "notifications",
          plural: false,
          selections: [
            {
              alias: null,
              args: null,
              concreteType: "NotificationEdge",
              kind: "LinkedField",
              name: "edges",
              plural: true,
              selections: [
                {
                  alias: null,
                  args: null,
                  concreteType: "Notification",
                  kind: "LinkedField",
                  name: "node",
                  plural: false,
                  selections: [
                    v2 /*: any*/,
                    {
                      alias: null,
                      args: null,
                      kind: "ScalarField",
                      name: "type",
                      storageKey: null,
                    },
                    {
                      alias: null,
                      args: null,
                      kind: "ScalarField",
                      name: "createdAt",
                      storageKey: null,
                    },
                    {
                      alias: null,
                      args: null,
                      concreteType: "User",
                      kind: "LinkedField",
                      name: "sender",
                      plural: false,
                      selections: [
                        v2 /*: any*/,
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
                          concreteType: "Asset",
                          kind: "LinkedField",
                          name: "image",
                          plural: false,
                          selections: [
                            {
                              alias: null,
                              args: null,
                              kind: "ScalarField",
                              name: "url",
                              storageKey: null,
                            },
                            v2 /*: any*/,
                          ],
                          storageKey: null,
                        },
                      ],
                      storageKey: null,
                    },
                    {
                      alias: null,
                      args: null,
                      concreteType: "BibleVersePost",
                      kind: "LinkedField",
                      name: "post",
                      plural: false,
                      selections: [
                        v2 /*: any*/,
                        {
                          alias: null,
                          args: null,
                          kind: "ScalarField",
                          name: "content",
                          storageKey: null,
                        },
                        v3 /*: any*/,
                        {
                          alias: null,
                          args: null,
                          concreteType: "BibleVersePost",
                          kind: "LinkedField",
                          name: "parentPost",
                          plural: false,
                          selections: [v3 /*: any*/, v2 /*: any*/],
                          storageKey: null,
                        },
                      ],
                      storageKey: null,
                    },
                    {
                      alias: null,
                      args: null,
                      kind: "ScalarField",
                      name: "__typename",
                      storageKey: null,
                    },
                  ],
                  storageKey: null,
                },
                {
                  alias: null,
                  args: null,
                  kind: "ScalarField",
                  name: "cursor",
                  storageKey: null,
                },
              ],
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              concreteType: "PageInfo",
              kind: "LinkedField",
              name: "pageInfo",
              plural: false,
              selections: [
                {
                  alias: null,
                  args: null,
                  kind: "ScalarField",
                  name: "endCursor",
                  storageKey: null,
                },
                {
                  alias: null,
                  args: null,
                  kind: "ScalarField",
                  name: "hasNextPage",
                  storageKey: null,
                },
              ],
              storageKey: null,
            },
          ],
          storageKey: null,
        },
        {
          alias: null,
          args: v1 /*: any*/,
          filters: null,
          handle: "connection",
          key: "notificationsScreenList_notifications",
          kind: "LinkedHandle",
          name: "notifications",
        },
      ],
    },
    params: {
      cacheID: "1133a645dc0bc8b259cf08830c192b5b",
      id: null,
      metadata: {},
      name: "notificationsScreenListPaginationQuery",
      operationKind: "query",
      text: "query notificationsScreenListPaginationQuery(\n  $count: Int = 20\n  $cursor: String\n) {\n  ...notificationsScreenListFragment_1G22uz\n}\n\nfragment notificationItemFragment on Notification {\n  id\n  type\n  createdAt\n  sender {\n    id\n    name\n    username\n    image {\n      url\n      id\n    }\n  }\n  post {\n    id\n    content\n    verse {\n      id\n      book\n      chapter\n      verse\n      translation\n    }\n    parentPost {\n      verse {\n        id\n        book\n        chapter\n        verse\n        translation\n      }\n      id\n    }\n  }\n}\n\nfragment notificationsScreenListFragment_1G22uz on Query {\n  notifications(first: $count, after: $cursor) {\n    edges {\n      node {\n        id\n        ...notificationItemFragment\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n",
    },
  };
})();

(node as any).hash = "3d26ad6cba5beda3bab4f0e349285525";

export default node;
