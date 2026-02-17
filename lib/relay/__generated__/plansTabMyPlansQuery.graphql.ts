/**
 * @generated SignedSource<<b2cc92e19f4afb9bc7b60ae26388b5d3>>
 * @relayHash f1d447f85f70fd5d72f5a1d148324ff7
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID f1d447f85f70fd5d72f5a1d148324ff7

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type plansTabMyPlansQuery$variables = Record<PropertyKey, never>;
export type plansTabMyPlansQuery$data = {
  readonly myJoinedReadingPlans: ReadonlyArray<{
    readonly dayCount: number;
    readonly id: string;
    readonly myParticipation: {
      readonly completedDaysCount: number;
      readonly id: string;
    } | null | undefined;
    readonly " $fragmentSpreads": FragmentRefs<"ReadingPlanCardFragment">;
  }>;
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
};
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
            "name": "status",
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
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "url",
                    "storageKey": null
                  },
                  (v1/*: any*/)
                ],
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
    "id": "f1d447f85f70fd5d72f5a1d148324ff7",
    "metadata": {},
    "name": "plansTabMyPlansQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "14438aab11e58f800c66dfd38603270f";

export default node;
