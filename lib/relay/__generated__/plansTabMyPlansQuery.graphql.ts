/**
 * @generated SignedSource<<cf177de7e304432428ebbfdc7f8fc898>>
 * @relayHash e99a2a5adad6405023c0bc34b8dca4ef
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID e99a2a5adad6405023c0bc34b8dca4ef

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type plansTabMyPlansQuery$variables = Record<PropertyKey, never>;
export type plansTabMyPlansQuery$data = {
  readonly myJoinedReadingPlans: ReadonlyArray<{
    readonly currentVersion: {
      readonly days: ReadonlyArray<{
        readonly readings: ReadonlyArray<{
          readonly id: string;
        }> | null | undefined;
      }> | null | undefined;
    } | null | undefined;
    readonly dayCount: number | null | undefined;
    readonly id: string;
    readonly myParticipation: {
      readonly completedDaysCount: number | null | undefined;
      readonly id: string;
      readonly readingProgress: ReadonlyArray<{
        readonly readingId: string | null | undefined;
      }> | null | undefined;
    } | null | undefined;
    readonly " $fragmentSpreads": FragmentRefs<"ReadingPlanCardFragment" | "plansTabMyPlanCardFragment">;
  }> | null | undefined;
};
export type plansTabMyPlansQuery = {
  response: plansTabMyPlansQuery$data;
  variables: plansTabMyPlansQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 50
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "dayCount",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "concreteType": "ReadingPlanDayReading",
  "kind": "LinkedField",
  "name": "readings",
  "plural": true,
  "selections": [
    (v1/*: any*/)
  ],
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "completedDaysCount",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "readingId",
  "storageKey": null
},
v6 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "url",
    "storageKey": null
  },
  (v1/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "plansTabMyPlansQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "ReadingPlan",
        "kind": "LinkedField",
        "name": "myJoinedReadingPlans",
        "plural": true,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "ReadingPlanVersion",
            "kind": "LinkedField",
            "name": "currentVersion",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "ReadingPlanDay",
                "kind": "LinkedField",
                "name": "days",
                "plural": true,
                "selections": [
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
              (v1/*: any*/),
              (v4/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "ReadingPlanReadingProgress",
                "kind": "LinkedField",
                "name": "readingProgress",
                "plural": true,
                "selections": [
                  (v5/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "ReadingPlanCardFragment"
          },
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "plansTabMyPlanCardFragment"
          }
        ],
        "storageKey": "myJoinedReadingPlans(first:50)"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "plansTabMyPlansQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "ReadingPlan",
        "kind": "LinkedField",
        "name": "myJoinedReadingPlans",
        "plural": true,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "ReadingPlanVersion",
            "kind": "LinkedField",
            "name": "currentVersion",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "ReadingPlanDay",
                "kind": "LinkedField",
                "name": "days",
                "plural": true,
                "selections": [
                  (v3/*: any*/),
                  (v1/*: any*/)
                ],
                "storageKey": null
              },
              (v1/*: any*/)
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
              (v1/*: any*/),
              (v4/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "ReadingPlanReadingProgress",
                "kind": "LinkedField",
                "name": "readingProgress",
                "plural": true,
                "selections": [
                  (v5/*: any*/),
                  (v1/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "title",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "description",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "participantCount",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "isFeatured",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "isOfficial",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "status",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "coversFullBible",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "coversOldTestament",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "coversNewTestament",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Asset",
            "kind": "LinkedField",
            "name": "coverImage",
            "plural": false,
            "selections": (v6/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "User",
            "kind": "LinkedField",
            "name": "author",
            "plural": false,
            "selections": [
              (v1/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "name",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "username",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "Asset",
                "kind": "LinkedField",
                "name": "image",
                "plural": false,
                "selections": (v6/*: any*/),
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": "myJoinedReadingPlans(first:50)"
      }
    ]
  },
  "params": {
    "id": "e99a2a5adad6405023c0bc34b8dca4ef",
    "metadata": {},
    "name": "plansTabMyPlansQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "1e80f16acf9516cce826e8a3496b1b9d";

export default node;
