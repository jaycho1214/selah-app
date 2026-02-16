/**
 * @generated SignedSource<<28ea0328bb39394d152841d34e72f2e7>>
 * @relayHash 4965e60b079eb628bb66691aac20085e
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 4965e60b079eb628bb66691aac20085e

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ReadingPlanStatus = "ARCHIVED" | "DRAFT" | "PUBLISHED" | "%future added value";
export type ReadingPlanVisibility = "PRIVATE" | "PUBLIC" | "UNLISTED" | "%future added value";
export type IdReadingPlanQuery$variables = {
  id: string;
};
export type IdReadingPlanQuery$data = {
  readonly readingPlanById: {
    readonly author: {
      readonly id: string;
      readonly image: {
        readonly url: string | null | undefined;
      } | null | undefined;
      readonly name: string | null | undefined;
      readonly username: string | null | undefined;
    };
    readonly currentVersion: {
      readonly days: ReadonlyArray<{
        readonly dayNumber: number;
        readonly id: string;
        readonly readings: ReadonlyArray<{
          readonly book: string;
          readonly endChapter: number | null | undefined;
          readonly endVerse: number | null | undefined;
          readonly id: string;
          readonly startChapter: number;
          readonly startVerse: number | null | undefined;
        }>;
        readonly " $fragmentSpreads": FragmentRefs<"ReadingPlanDayCardFragment">;
      }>;
      readonly id: string;
    } | null | undefined;
    readonly dayCount: number;
    readonly description: string | null | undefined;
    readonly id: string;
    readonly isFeatured: boolean;
    readonly myParticipation: {
      readonly completedAt: any | null | undefined;
      readonly completedDaysCount: number;
      readonly hideProgress: boolean;
      readonly id: string;
      readonly progress: ReadonlyArray<{
        readonly completedAt: any;
        readonly dayId: string;
      }>;
      readonly readingProgress: ReadonlyArray<{
        readonly completedAt: any | null | undefined;
        readonly readingId: string | null | undefined;
      }>;
    } | null | undefined;
    readonly participantCount: number;
    readonly status: ReadingPlanStatus;
    readonly title: string;
    readonly visibility: ReadingPlanVisibility;
  } | null | undefined;
};
export type IdReadingPlanQuery = {
  response: IdReadingPlanQuery$data;
  variables: IdReadingPlanQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "description",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "visibility",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "status",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isFeatured",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "participantCount",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "dayCount",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "username",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "url",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "dayNumber",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "concreteType": "ReadingPlanDayReading",
  "kind": "LinkedField",
  "name": "readings",
  "plural": true,
  "selections": [
    (v2/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "book",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "startChapter",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "startVerse",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "endChapter",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "endVerse",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "completedDaysCount",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "hideProgress",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "completedAt",
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "dayId",
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "readingId",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "IdReadingPlanQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "ReadingPlan",
        "kind": "LinkedField",
        "name": "readingPlanById",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "User",
            "kind": "LinkedField",
            "name": "author",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v10/*: any*/),
              (v11/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Asset",
                "kind": "LinkedField",
                "name": "image",
                "plural": false,
                "selections": [
                  (v12/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "ReadingPlanVersion",
            "kind": "LinkedField",
            "name": "currentVersion",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "ReadingPlanDay",
                "kind": "LinkedField",
                "name": "days",
                "plural": true,
                "selections": [
                  (v2/*: any*/),
                  (v13/*: any*/),
                  (v14/*: any*/),
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "ReadingPlanDayCardFragment"
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "ReadingPlanParticipant",
            "kind": "LinkedField",
            "name": "myParticipation",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v15/*: any*/),
              (v16/*: any*/),
              (v17/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "ReadingPlanProgress",
                "kind": "LinkedField",
                "name": "progress",
                "plural": true,
                "selections": [
                  (v18/*: any*/),
                  (v17/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "ReadingPlanReadingProgress",
                "kind": "LinkedField",
                "name": "readingProgress",
                "plural": true,
                "selections": [
                  (v19/*: any*/),
                  (v17/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "IdReadingPlanQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "ReadingPlan",
        "kind": "LinkedField",
        "name": "readingPlanById",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "User",
            "kind": "LinkedField",
            "name": "author",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v10/*: any*/),
              (v11/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Asset",
                "kind": "LinkedField",
                "name": "image",
                "plural": false,
                "selections": [
                  (v12/*: any*/),
                  (v2/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "ReadingPlanVersion",
            "kind": "LinkedField",
            "name": "currentVersion",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "ReadingPlanDay",
                "kind": "LinkedField",
                "name": "days",
                "plural": true,
                "selections": [
                  (v2/*: any*/),
                  (v13/*: any*/),
                  (v14/*: any*/),
                  (v3/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "ReadingPlanParticipant",
            "kind": "LinkedField",
            "name": "myParticipation",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v15/*: any*/),
              (v16/*: any*/),
              (v17/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "ReadingPlanProgress",
                "kind": "LinkedField",
                "name": "progress",
                "plural": true,
                "selections": [
                  (v18/*: any*/),
                  (v17/*: any*/),
                  (v2/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "ReadingPlanReadingProgress",
                "kind": "LinkedField",
                "name": "readingProgress",
                "plural": true,
                "selections": [
                  (v19/*: any*/),
                  (v17/*: any*/),
                  (v2/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "4965e60b079eb628bb66691aac20085e",
    "metadata": {},
    "name": "IdReadingPlanQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "383976c3731f3b5d4ffa8303a5728a62";

export default node;
