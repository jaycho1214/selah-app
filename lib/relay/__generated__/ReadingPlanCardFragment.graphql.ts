/**
 * @generated SignedSource<<53cc91e89e4761b80814179eae4fd167>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type ReadingPlanStatus = "ARCHIVED" | "DRAFT" | "PUBLISHED" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type ReadingPlanCardFragment$data = {
  readonly author: {
    readonly id: string;
    readonly image: {
      readonly url: string | null | undefined;
    } | null | undefined;
    readonly name: string | null | undefined;
    readonly username: string | null | undefined;
  };
  readonly coverImage: {
    readonly url: string | null | undefined;
  } | null | undefined;
  readonly coversFullBible: boolean | null | undefined;
  readonly coversNewTestament: boolean | null | undefined;
  readonly coversOldTestament: boolean | null | undefined;
  readonly dayCount: number | null | undefined;
  readonly description: string | null | undefined;
  readonly id: string;
  readonly isFeatured: boolean | null | undefined;
  readonly isOfficial: boolean | null | undefined;
  readonly participantCount: number | null | undefined;
  readonly status: ReadingPlanStatus | null | undefined;
  readonly title: string | null | undefined;
  readonly " $fragmentType": "ReadingPlanCardFragment";
};
export type ReadingPlanCardFragment$key = {
  readonly " $data"?: ReadingPlanCardFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"ReadingPlanCardFragment">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "url",
    "storageKey": null
  }
];
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ReadingPlanCardFragment",
  "selections": [
    (v0/*: any*/),
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
      "selections": (v1/*: any*/),
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
        (v0/*: any*/),
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
          "selections": (v1/*: any*/),
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "ReadingPlan",
  "abstractKey": null
};
})();

(node as any).hash = "6b32cb0d828ba05f9860573004cc7dd8";

export default node;
