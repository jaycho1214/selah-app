/**
 * @generated SignedSource<<ea67285eb06cb53bdf8aaf9d575b3762>>
 * @relayHash b0e4ae50d6537d1654e7a04ba6e5c5f1
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID b0e4ae50d6537d1654e7a04ba6e5c5f1

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type plansTabBrowseQuery$variables = {
  featured?: boolean | null | undefined;
};
export type plansTabBrowseQuery$data = {
  readonly readingPlans: ReadonlyArray<{
    readonly id: string;
    readonly " $fragmentSpreads": FragmentRefs<"ReadingPlanCardFragment">;
  }>;
};
export type plansTabBrowseQuery = {
  response: plansTabBrowseQuery$data;
  variables: plansTabBrowseQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "featured"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "featured",
    "variableName": "featured"
  },
  {
    "kind": "Literal",
    "name": "first",
    "value": 50
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "plansTabBrowseQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "ReadingPlan",
        "kind": "LinkedField",
        "name": "readingPlans",
        "plural": true,
        "selections": [
          (v2/*: any*/),
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "ReadingPlanCardFragment"
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
    "name": "plansTabBrowseQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "ReadingPlan",
        "kind": "LinkedField",
        "name": "readingPlans",
        "plural": true,
        "selections": [
          (v2/*: any*/),
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
            "name": "dayCount",
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
              (v2/*: any*/),
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
    "id": "b0e4ae50d6537d1654e7a04ba6e5c5f1",
    "metadata": {},
    "name": "plansTabBrowseQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "37b8a087532291b66e7afc244dce4e2d";

export default node;
