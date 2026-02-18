/**
 * @generated SignedSource<<4feedaef3dcf88cec5cf0e449fe4e701>>
 * @relayHash 83e58e78314118b71ed1213ed8175d85
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 83e58e78314118b71ed1213ed8175d85

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ReadingPlanStatus =
  | "ARCHIVED"
  | "DRAFT"
  | "PUBLISHED"
  | "%future added value";
export type ReadingPlanVisibility =
  | "PRIVATE"
  | "PUBLIC"
  | "UNLISTED"
  | "%future added value";
export type IdReadingPlanQuery$variables = {
  id: string;
};
export type IdReadingPlanQuery$data = {
  readonly readingPlanById:
    | {
        readonly author: {
          readonly id: string;
          readonly image:
            | {
                readonly url: string | null | undefined;
              }
            | null
            | undefined;
          readonly name: string | null | undefined;
          readonly username: string | null | undefined;
        };
        readonly coverImage:
          | {
              readonly url: string | null | undefined;
            }
          | null
          | undefined;
        readonly coversFullBible: boolean | null | undefined;
        readonly coversNewTestament: boolean | null | undefined;
        readonly coversOldTestament: boolean | null | undefined;
        readonly currentVersion:
          | {
              readonly days:
                | ReadonlyArray<{
                    readonly dayNumber: number | null | undefined;
                    readonly id: string;
                    readonly readings:
                      | ReadonlyArray<{
                          readonly book: string | null | undefined;
                          readonly endChapter: number | null | undefined;
                          readonly endVerse: number | null | undefined;
                          readonly id: string;
                          readonly startChapter: number | null | undefined;
                          readonly startVerse: number | null | undefined;
                        }>
                      | null
                      | undefined;
                    readonly " $fragmentSpreads": FragmentRefs<"ReadingPlanDayCardFragment">;
                  }>
                | null
                | undefined;
              readonly id: string;
            }
          | null
          | undefined;
        readonly dayCount: number | null | undefined;
        readonly description: string | null | undefined;
        readonly id: string;
        readonly isFeatured: boolean | null | undefined;
        readonly isOfficial: boolean | null | undefined;
        readonly myParticipation:
          | {
              readonly behindDaysCount: number | null | undefined;
              readonly completedAt: any | null | undefined;
              readonly completedDaysCount: number | null | undefined;
              readonly hideProgress: boolean | null | undefined;
              readonly id: string;
              readonly progress:
                | ReadonlyArray<{
                    readonly completedAt: any | null | undefined;
                    readonly dayId: string | null | undefined;
                  }>
                | null
                | undefined;
              readonly readingProgress:
                | ReadonlyArray<{
                    readonly completedAt: any | null | undefined;
                    readonly readingId: string | null | undefined;
                  }>
                | null
                | undefined;
            }
          | null
          | undefined;
        readonly participantCount: number | null | undefined;
        readonly status: ReadingPlanStatus | null | undefined;
        readonly title: string | null | undefined;
        readonly visibility: ReadingPlanVisibility | null | undefined;
      }
    | null
    | undefined;
};
export type IdReadingPlanQuery = {
  response: IdReadingPlanQuery$data;
  variables: IdReadingPlanQuery$variables;
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
        kind: "Variable",
        name: "id",
        variableName: "id",
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
      name: "title",
      storageKey: null,
    },
    v4 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "description",
      storageKey: null,
    },
    v5 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "visibility",
      storageKey: null,
    },
    v6 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "status",
      storageKey: null,
    },
    v7 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "isFeatured",
      storageKey: null,
    },
    v8 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "isOfficial",
      storageKey: null,
    },
    v9 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "participantCount",
      storageKey: null,
    },
    v10 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "dayCount",
      storageKey: null,
    },
    v11 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "coversFullBible",
      storageKey: null,
    },
    v12 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "coversOldTestament",
      storageKey: null,
    },
    v13 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "coversNewTestament",
      storageKey: null,
    },
    v14 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "url",
      storageKey: null,
    },
    v15 = [v14 /*: any*/],
    v16 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "name",
      storageKey: null,
    },
    v17 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "username",
      storageKey: null,
    },
    v18 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "dayNumber",
      storageKey: null,
    },
    v19 = {
      alias: null,
      args: null,
      concreteType: "ReadingPlanDayReading",
      kind: "LinkedField",
      name: "readings",
      plural: true,
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
          name: "startChapter",
          storageKey: null,
        },
        {
          alias: null,
          args: null,
          kind: "ScalarField",
          name: "startVerse",
          storageKey: null,
        },
        {
          alias: null,
          args: null,
          kind: "ScalarField",
          name: "endChapter",
          storageKey: null,
        },
        {
          alias: null,
          args: null,
          kind: "ScalarField",
          name: "endVerse",
          storageKey: null,
        },
      ],
      storageKey: null,
    },
    v20 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "completedDaysCount",
      storageKey: null,
    },
    v21 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "hideProgress",
      storageKey: null,
    },
    v22 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "completedAt",
      storageKey: null,
    },
    v23 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "behindDaysCount",
      storageKey: null,
    },
    v24 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "dayId",
      storageKey: null,
    },
    v25 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "readingId",
      storageKey: null,
    },
    v26 = [v14 /*: any*/, v2 /*: any*/];
  return {
    fragment: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Fragment",
      metadata: null,
      name: "IdReadingPlanQuery",
      selections: [
        {
          alias: null,
          args: v1 /*: any*/,
          concreteType: "ReadingPlan",
          kind: "LinkedField",
          name: "readingPlanById",
          plural: false,
          selections: [
            v2 /*: any*/,
            v3 /*: any*/,
            v4 /*: any*/,
            v5 /*: any*/,
            v6 /*: any*/,
            v7 /*: any*/,
            v8 /*: any*/,
            v9 /*: any*/,
            v10 /*: any*/,
            v11 /*: any*/,
            v12 /*: any*/,
            v13 /*: any*/,
            {
              alias: null,
              args: null,
              concreteType: "Asset",
              kind: "LinkedField",
              name: "coverImage",
              plural: false,
              selections: v15 /*: any*/,
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              concreteType: "User",
              kind: "LinkedField",
              name: "author",
              plural: false,
              selections: [
                v2 /*: any*/,
                v16 /*: any*/,
                v17 /*: any*/,
                {
                  alias: null,
                  args: null,
                  concreteType: "Asset",
                  kind: "LinkedField",
                  name: "image",
                  plural: false,
                  selections: v15 /*: any*/,
                  storageKey: null,
                },
              ],
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              concreteType: "ReadingPlanVersion",
              kind: "LinkedField",
              name: "currentVersion",
              plural: false,
              selections: [
                v2 /*: any*/,
                {
                  alias: null,
                  args: null,
                  concreteType: "ReadingPlanDay",
                  kind: "LinkedField",
                  name: "days",
                  plural: true,
                  selections: [
                    v2 /*: any*/,
                    v18 /*: any*/,
                    v19 /*: any*/,
                    {
                      args: null,
                      kind: "FragmentSpread",
                      name: "ReadingPlanDayCardFragment",
                    },
                  ],
                  storageKey: null,
                },
              ],
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              concreteType: "ReadingPlanParticipant",
              kind: "LinkedField",
              name: "myParticipation",
              plural: false,
              selections: [
                v2 /*: any*/,
                v20 /*: any*/,
                v21 /*: any*/,
                v22 /*: any*/,
                v23 /*: any*/,
                {
                  alias: null,
                  args: null,
                  concreteType: "ReadingPlanProgress",
                  kind: "LinkedField",
                  name: "progress",
                  plural: true,
                  selections: [v24 /*: any*/, v22 /*: any*/],
                  storageKey: null,
                },
                {
                  alias: null,
                  args: null,
                  concreteType: "ReadingPlanReadingProgress",
                  kind: "LinkedField",
                  name: "readingProgress",
                  plural: true,
                  selections: [v25 /*: any*/, v22 /*: any*/],
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
      name: "IdReadingPlanQuery",
      selections: [
        {
          alias: null,
          args: v1 /*: any*/,
          concreteType: "ReadingPlan",
          kind: "LinkedField",
          name: "readingPlanById",
          plural: false,
          selections: [
            v2 /*: any*/,
            v3 /*: any*/,
            v4 /*: any*/,
            v5 /*: any*/,
            v6 /*: any*/,
            v7 /*: any*/,
            v8 /*: any*/,
            v9 /*: any*/,
            v10 /*: any*/,
            v11 /*: any*/,
            v12 /*: any*/,
            v13 /*: any*/,
            {
              alias: null,
              args: null,
              concreteType: "Asset",
              kind: "LinkedField",
              name: "coverImage",
              plural: false,
              selections: v26 /*: any*/,
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              concreteType: "User",
              kind: "LinkedField",
              name: "author",
              plural: false,
              selections: [
                v2 /*: any*/,
                v16 /*: any*/,
                v17 /*: any*/,
                {
                  alias: null,
                  args: null,
                  concreteType: "Asset",
                  kind: "LinkedField",
                  name: "image",
                  plural: false,
                  selections: v26 /*: any*/,
                  storageKey: null,
                },
              ],
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              concreteType: "ReadingPlanVersion",
              kind: "LinkedField",
              name: "currentVersion",
              plural: false,
              selections: [
                v2 /*: any*/,
                {
                  alias: null,
                  args: null,
                  concreteType: "ReadingPlanDay",
                  kind: "LinkedField",
                  name: "days",
                  plural: true,
                  selections: [
                    v2 /*: any*/,
                    v18 /*: any*/,
                    v19 /*: any*/,
                    v3 /*: any*/,
                  ],
                  storageKey: null,
                },
              ],
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              concreteType: "ReadingPlanParticipant",
              kind: "LinkedField",
              name: "myParticipation",
              plural: false,
              selections: [
                v2 /*: any*/,
                v20 /*: any*/,
                v21 /*: any*/,
                v22 /*: any*/,
                v23 /*: any*/,
                {
                  alias: null,
                  args: null,
                  concreteType: "ReadingPlanProgress",
                  kind: "LinkedField",
                  name: "progress",
                  plural: true,
                  selections: [v24 /*: any*/, v22 /*: any*/, v2 /*: any*/],
                  storageKey: null,
                },
                {
                  alias: null,
                  args: null,
                  concreteType: "ReadingPlanReadingProgress",
                  kind: "LinkedField",
                  name: "readingProgress",
                  plural: true,
                  selections: [v25 /*: any*/, v22 /*: any*/, v2 /*: any*/],
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
      id: "83e58e78314118b71ed1213ed8175d85",
      metadata: {},
      name: "IdReadingPlanQuery",
      operationKind: "query",
      text: null,
    },
  };
})();

(node as any).hash = "8b6ef493b2425f05c7f88796fd28bc9e";

export default node;
