/**
 * @generated SignedSource<<fa06a1d4f04904ddd3acc3c553d1060f>>
 * @relayHash d7872850569649bca09a83ec41c8128a
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID d7872850569649bca09a83ec41c8128a

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type myPlansQuery$variables = Record<PropertyKey, never>;
export type myPlansQuery$data = {
  readonly myJoinedReadingPlans: ReadonlyArray<{
    readonly dayCount: number | null | undefined;
    readonly id: string;
    readonly myParticipation: {
      readonly completedDaysCount: number | null | undefined;
      readonly id: string;
    } | null | undefined;
    readonly " $fragmentSpreads": FragmentRefs<"ReadingPlanCardFragment">;
  }> | null | undefined;
};
export type myPlansQuery = {
  response: myPlansQuery$data;
  variables: myPlansQuery$variables;
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
  "concreteType": "ReadingPlanParticipant",
  "kind": "LinkedField",
  "name": "myParticipation",
  "plural": false,
  "selections": [
    (v1/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "completedDaysCount",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v4 = [
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
    "name": "myPlansQuery",
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
          (v3/*: any*/),
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "ReadingPlanCardFragment"
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
    "name": "myPlansQuery",
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
          (v3/*: any*/),
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
            "selections": (v4/*: any*/),
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
                "selections": (v4/*: any*/),
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
    "id": "d7872850569649bca09a83ec41c8128a",
    "metadata": {},
    "name": "myPlansQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "27aaa325803065951d38f600d79ca92f";

export default node;
