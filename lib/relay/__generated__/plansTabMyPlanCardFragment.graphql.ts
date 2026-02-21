/**
 * @generated SignedSource<<2b42cb6e2ad782371a6b43dbbbbbab15>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type plansTabMyPlanCardFragment$data = {
  readonly coverImage: {
    readonly url: string | null | undefined;
  } | null | undefined;
  readonly dayCount: number | null | undefined;
  readonly id: string;
  readonly title: string | null | undefined;
  readonly " $fragmentType": "plansTabMyPlanCardFragment";
};
export type plansTabMyPlanCardFragment$key = {
  readonly " $data"?: plansTabMyPlanCardFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"plansTabMyPlanCardFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "plansTabMyPlanCardFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
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
      "name": "dayCount",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Asset",
      "kind": "LinkedField",
      "name": "coverImage",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "url",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "ReadingPlan",
  "abstractKey": null
};

(node as any).hash = "5b2704a5eac79e49cd9add64d195989a";

export default node;
